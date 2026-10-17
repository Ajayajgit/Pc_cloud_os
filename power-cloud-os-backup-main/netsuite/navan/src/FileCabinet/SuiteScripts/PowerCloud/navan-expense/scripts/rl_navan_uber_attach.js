/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Uber Attach RESTlet. Receives a batch of parsed Uber for
 *              Business transactions from the PC Browser Relay and turns each into an expense
 *              report line (one line per transaction, reconciling 1:1 with the corporate card).
 *              NetSuite owns dedup via the Uber transaction map (Network Transaction Id), so the
 *              relay can safely re-POST overlapping daily files.
 * @author Power Cloud Consulting
 */
define([
    'N/log',
    'N/record',
    'N/search',
    'N/task',
    '../lib/powercloud_navan_constants',
    '../lib/powercloud_navan_logger',
    '../lib/powercloud_navan_employee',
    '../lib/powercloud_navan_uber_builder',
    '../lib/powercloud_navan_config',
    '../lib/powercloud_navan_alert'
], function (log, record, search, task, constants, logger, employee, uberBuilder, config, alert) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanUberAttach';

    /**
     * POST handler. Body: { run_id, transactions: [ {txnId, tripId, employeeEmail, expenseCode,
     * transactionType, amountUsd, expenseDate, description, receiptUrl} ] }
     *
     * Also accepts { action: 'rewrite_memos', run_id, items: [{txnId, description?, receiptUrl?}] }
     * to retroactively patch the memo, expense-memo column, and/or receipt-url column on
     * already-imported Uber lines (used when the description format evolves or a new column is
     * added). Each item field is optional — only the fields present are touched. The expense-memo
     * substring is swapped surgically so any header-memo prefix on appended lines is preserved
     * verbatim.
     *
     * Also accepts { action: 'heartbeat', ok, error?, counts?, failures? } sent by the relay at the
     * end of every Uber poll (see handleHeartbeat).
     * @returns {Object} { success, runId, counts, results }
     */
    function post(body) {
        if (body && body.action === 'rewrite_memos') {
            return rewriteMemos(body);
        }
        if (body && body.action === 'trigger_navan_processor') {
            return triggerNavanProcessor();
        }
        if (body && body.action === 'heartbeat') {
            return handleHeartbeat(body);
        }

        const runId = (body && body.run_id) || 'uber_' + Date.now();
        const transactions = (body && body.transactions) || [];

        log.audit({ title: SCRIPT_NAME, details: 'Uber run ' + runId + ': ' + transactions.length + ' transaction(s)' });

        const counts = { created: 0, appended: 0, skipped: 0, failed: 0 };
        const results = [];

        transactions.forEach(function (txn) {
            const result = processOne(txn, counts);
            results.push(result);
        });

        log.audit({
            title: SCRIPT_NAME,
            details: 'Uber run ' + runId + ' complete. Created: ' + counts.created +
                     ', Appended: ' + counts.appended + ', Skipped: ' + counts.skipped +
                     ', Failed: ' + counts.failed
        });

        return { success: true, runId: runId, counts: counts, results: results };
    }

    /**
     * Processes a single transaction; never throws (a bad row must not abort the batch).
     */
    function processOne(txn, counts) {
        const txnId = txn && txn.txnId;
        if (!txnId) {
            counts.failed++;
            return { status: 'failed', error: 'Missing txnId' };
        }

        try {
            // Dedup: NetSuite is the source of truth (the line carries the txn id), so
            // re-POSTed files are idempotent.
            if (uberBuilder.isTransactionImported(txnId)) {
                counts.skipped++;
                return { txnId: txnId, status: 'skipped', reason: 'already imported' };
            }

            const amount = parseFloat(txn.amountUsd) || 0;
            if (amount <= 0) {
                counts.skipped++;
                return { txnId: txnId, status: 'skipped', reason: 'non-positive amount' };
            }

            const emp = employee.findByEmail(txn.employeeEmail);
            if (!emp) {
                logger.createLog({
                    eventType: constants.LOG_EVENT_TYPES.MISSING_EMPLOYEE,
                    status: 'failed',
                    errorMessage: 'No NetSuite employee for Uber email: ' + txn.employeeEmail +
                        ' (txn ' + txnId + '). Populate custentity_pc_uber_email on the employee.'
                });
                counts.failed++;
                return { txnId: txnId, status: 'failed', error: 'employee not found for ' + txn.employeeEmail };
            }

            const built = uberBuilder.processTransaction({ transaction: txn, employee: emp });

            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.UBER_IMPORT,
                employeeId: emp.id,
                expenseReportId: built.expenseReportId,
                status: 'success',
                totalAmount: amount
            });

            if (built.action === 'appended') {
                counts.appended++;
            } else {
                counts.created++;
            }

            return {
                txnId: txnId,
                status: 'success',
                action: built.action,
                expenseReportId: built.expenseReportId,
                lineIndex: built.lineIndex,
                projectId: built.projectId
            };
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'Txn ' + txnId + ' failed: ' + e.message });
            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.UBER_IMPORT,
                status: 'failed',
                errorMessage: 'Txn ' + txnId + ': ' + e.message,
                rawPayload: txn
            });
            counts.failed++;
            return { txnId: txnId, status: 'failed', error: e.message };
        }
    }

    /**
     * Replays new description text and/or receipt URL onto already-imported Uber lines. Groups
     * items by expense report to avoid the stale-load anti-pattern where N back-to-back
     * load/save cycles on the same ER each see a snapshot that's missing the prior cycle's
     * write (newly-added columns are especially prone to this), causing each save to wipe the
     * other lines' values. One load + N line edits + one save per ER is correct and faster.
     */
    function rewriteMemos(body) {
        const runId = body.run_id || 'rewrite_' + Date.now();
        const items = body.items || [];
        log.audit({ title: SCRIPT_NAME, details: 'Memo rewrite ' + runId + ': ' + items.length + ' item(s)' });

        const counts = { updated: 0, notFound: 0, failed: 0 };
        const results = [];

        // Phase 1: resolve every item to its ER + bucket. Items targeting an unfindable txn are
        // recorded immediately and excluded from save phase.
        const groups = {};
        items.forEach(function (item) {
            const validation = validateItem(item);
            if (validation.error) {
                counts.failed++;
                results.push(validation.error);
                return;
            }
            const erId = findErIdByTxn(item.txnId);
            if (!erId) {
                counts.notFound++;
                results.push({ txnId: item.txnId, status: 'not_found' });
                return;
            }
            if (!groups[erId]) { groups[erId] = []; }
            groups[erId].push(item);
        });

        // Phase 2: one load + all line edits + one save per ER.
        Object.keys(groups).forEach(function (erId) {
            const erResults = applyGroup(erId, groups[erId], counts);
            erResults.forEach(function (r) { results.push(r); });
        });

        log.audit({
            title: SCRIPT_NAME,
            details: 'Memo rewrite ' + runId + ' complete. Updated: ' + counts.updated +
                     ', NotFound: ' + counts.notFound + ', Failed: ' + counts.failed
        });
        return { success: true, runId: runId, counts: counts, results: results };
    }

    function validateItem(item) {
        if (!item || !item.txnId) {
            return { error: { status: 'failed', error: 'Missing txnId' } };
        }
        if (!item.description && !item.receiptUrl) {
            return { error: { txnId: item.txnId, status: 'failed', error: 'Nothing to update — supply description and/or receiptUrl' } };
        }
        return {};
    }

    function findErIdByTxn(txnId) {
        const found = search.create({
            type: search.Type.EXPENSE_REPORT,
            filters: [
                ['mainline', 'is', 'F'],
                'AND',
                [constants.UBER_LINE_FIELDS.TXN_ID, 'is', txnId]
            ],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        return found.length ? found[0].getValue('internalid') : null;
    }

    function applyGroup(erId, groupItems, counts) {
        const out = [];
        try {
            const er = record.load({ type: record.Type.EXPENSE_REPORT, id: erId, isDynamic: true });

            groupItems.forEach(function (item) {
                const lineIdx = er.findSublistLineWithValue({
                    sublistId: 'expense',
                    fieldId: constants.UBER_LINE_FIELDS.TXN_ID,
                    value: item.txnId
                });
                if (lineIdx < 0) {
                    counts.notFound++;
                    out.push({ txnId: item.txnId, status: 'line_not_found_on_er_' + erId });
                    return;
                }

                er.selectLine({ sublistId: 'expense', line: lineIdx });
                const result = { txnId: item.txnId, status: 'updated', expenseReportId: erId, lineIndex: lineIdx };

                if (item.description) {
                    const oldMemo = er.getCurrentSublistValue({ sublistId: 'expense', fieldId: 'memo' }) || '';
                    const oldExp = er.getCurrentSublistValue({ sublistId: 'expense', fieldId: constants.EXPENSE.EXPENSE_MEMO_COLUMN }) || '';
                    let newMemo;
                    const subIdx = oldExp ? oldMemo.lastIndexOf(oldExp) : -1;
                    if (subIdx >= 0) {
                        newMemo = oldMemo.substring(0, subIdx) + item.description + oldMemo.substring(subIdx + oldExp.length);
                    } else {
                        newMemo = item.description;
                    }
                    er.setCurrentSublistValue({ sublistId: 'expense', fieldId: 'memo', value: newMemo });
                    er.setCurrentSublistValue({ sublistId: 'expense', fieldId: constants.EXPENSE.EXPENSE_MEMO_COLUMN, value: item.description });
                    result.oldMemo = oldMemo;
                    result.newMemo = newMemo;
                }

                if (item.receiptUrl) {
                    er.setCurrentSublistValue({ sublistId: 'expense', fieldId: constants.UBER_LINE_FIELDS.RECEIPT_URL, value: item.receiptUrl });
                    result.receiptUrl = item.receiptUrl;
                }

                er.commitLine({ sublistId: 'expense' });
                counts.updated++;
                out.push(result);
            });

            er.save({ enableSourcing: false, ignoreMandatoryFields: false });
            return out;
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'Rewrite ER ' + erId + ' failed: ' + e.message });
            // Roll back the per-line "updated" counter; the save errored so none persisted.
            const erTxns = groupItems.map(function (i) { return i.txnId; });
            const succeededInBatch = out.filter(function (r) { return r.status === 'updated'; }).length;
            counts.updated -= succeededInBatch;
            counts.failed += groupItems.length;
            return erTxns.map(function (txnId) { return { txnId: txnId, status: 'failed', error: 'ER save failed: ' + e.message }; });
        }
    }

    /** Fires the daily Navan expense processor on-demand (re-runs the same M/R that's scheduled
     *  for 3 AM PT). Idempotent: bookings already in booking_map are skipped, failed bookings are
     *  retried. Returns the task id so the caller can poll status. */
    function triggerNavanProcessor() {
        try {
            const taskId = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_pc_navan_expense_processor',
                deploymentId: 'customdeploy_pc_navan_expense_processor'
            }).submit();
            log.audit({ title: SCRIPT_NAME, details: 'Navan processor triggered manually; task id ' + taskId });
            return { success: true, taskId: taskId };
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'trigger_navan_processor failed: ' + e.message });
            return { success: false, error: e.message };
        }
    }

    /**
     * Relay Uber-poll check-in. ok=true stamps the config's Last Check-in (the Uber watchdog alerts
     * when it goes stale, which covers failures that can't reach NetSuite at all: revoked token,
     * relay box down, broken timer). Emails immediately for a run that failed after NetSuite was
     * reachable (ok=false, e.g. SFTP error) or for individual rides that failed to import.
     * @param {Object} body - { ok, error?, counts?, failures?: [{txnId, employeeEmail, expenseDate, amountUsd, error}] }
     * @returns {Object} { success }
     */
    function handleHeartbeat(body) {
        const failures = body.failures || [];

        if (body.ok) {
            const cfg = config.load();
            record.submitFields({
                type: constants.RECORD_TYPES.CONFIG,
                id: cfg.id,
                values: { [constants.CONFIG_FIELDS.UBER_LAST_OK]: new Date().toISOString() }
            });
        } else {
            log.error({ title: SCRIPT_NAME + ':heartbeat', details: 'Uber poll failed: ' + body.error });
            alert.send('Uber Poll Failed',
                'The relay\'s daily Uber poll failed before it could import rides.\n\n' +
                'Error: ' + (body.error || 'unknown') + '\n\n' +
                'Nothing was marked as imported, so the next run retries everything. Check the box with:\n' +
                '  journalctl -u pc-navan-uber-poll.service -n 50');
        }

        if (failures.length) {
            const lines = failures.map(function (f) {
                return '- ' + (f.expenseDate || '?') + '  $' + (f.amountUsd != null ? f.amountUsd : '?') +
                       '  ' + (f.employeeEmail || '?') + '\n    ' + (f.error || 'unknown error') +
                       '\n    (txn ' + f.txnId + ')';
            });
            log.error({ title: SCRIPT_NAME + ':heartbeat', details: failures.length + ' Uber ride(s) failed: ' + JSON.stringify(failures) });
            alert.send('Uber Rides Failed to Import (' + failures.length + ')',
                failures.length + ' Uber ride(s) could not be imported:\n\n' + lines.join('\n') + '\n\n' +
                'These retry on every daily run until they succeed. For "employee not found", add the ' +
                'rider\'s Uber email to the Uber Email field on their employee record.');
        }

        return { success: true };
    }

    return {
        post: post
    };
});
