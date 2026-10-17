/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * @description Power Cloud - Task to Invoice : nightly reconciliation sweep.
 *              Stamps custcol_powercloud_task on billable Time that the User Event did
 *              not catch. NetSuite copies that custom column field onto the invoice item
 *              line when the time is billed - which is how the Task reaches the invoice.
 *              Proven in this account by custcol_pc_emp_name.
 * @author Power Cloud Consulting
 *
 * RELATIONSHIP TO THE USER EVENT
 *   customscript_pc_task_to_invoice_ue stamps the value at timesheet save time and is
 *   the primary path. This script is the safety net: it catches records created before
 *   the UE was deployed, records where the UE failed (it is deliberately fail-open so a
 *   consultant can always submit time), and imports or integrations that bypass the UI.
 *   Label logic lives in lib/pc_task_label so the two cannot drift apart.
 *
 * SCHEDULING
 *   Must complete BEFORE the Invoice Billable Customers run. Once time is billed the
 *   value has already been copied and further updates cannot affect the invoice, which
 *   is why billed time is excluded.
 */
define(['./lib/pc_task_label', 'N/query', 'N/record', 'N/runtime', 'N/log'],
function (taskLabel, query, record, runtime, log) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_TaskToInvoiceMR';

    /**
     * Rolling window default, in days.
     *
     * Measured on account 5641465: with NO lookback filter at all there were 103
     * unbilled billable entries spanning a 28-day range (2026-08-07 to 2026-09-04).
     * The billed='F' filter does the real work; this window is belt-and-braces.
     * 45 days covers a monthly billing cycle with headroom.
     */
    const DEFAULT_LOOKBACK_DAYS = 45;

    /**
     * Absolute ceiling on the rolling window, regardless of the script parameter.
     * Stops a mis-set parameter from turning the nightly sweep into a multi-year scan.
     */
    const MAX_LOOKBACK_DAYS = 180;

    /**
     * Formats a Date as an Oracle-safe literal for TO_DATE.
     * @param {Date} d
     * @returns {string} YYYY-MM-DD
     */
    function toSqlDate(d) {
        const pad = function (n) { return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    /**
     * Resolves the hard date floor from the cutoff parameter, if set.
     *
     * WHY A DATE AND NOT A PERIOD JOIN
     *   The accountingperiod record is not exposed to this integration role
     *   ("Record 'accountingperiod' was not found"), so period status cannot be filtered
     *   in SQL. An explicit cutoff is a harder guarantee anyway: set it to the end date
     *   of your last closed period and this script can never touch a closed period,
     *   independent of what the period table says.
     *
     * @param {Object} script - runtime.getCurrentScript()
     * @returns {string|null} YYYY-MM-DD, or null when unset
     */
    function resolveCutoff(script) {
        const raw = script.getParameter({ name: 'custscript_pc_t2i_cutoff_date' });
        if (!raw) {
            return null;
        }
        try {
            const d = (raw instanceof Date) ? raw : new Date(raw);
            return isNaN(d.getTime()) ? null : toSqlDate(d);
        } catch (e) {
            log.error(SCRIPT_NAME + ' bad cutoff parameter', String(raw));
            return null;
        }
    }

    /**
     * Selects billable, not-yet-billed time carrying a task whose stamped label is
     * missing or stale.
     *
     * LEFT JOIN, not inner: casetaskevent is polymorphic, so a Case / CRM Task /
     * Calendar Event must still be processed. Those rows return a null title and fall
     * through to getText() in map(). Verified against account 5641465: 0 of 2,356
     * billable entries in 3 months were anything other than a Project Task, so this
     * path is a safety net rather than a common case.
     *
     * All four filter identifiers were verified against the account before use.
     *
     * THREE INDEPENDENT GUARDS keep this off billed and closed-period time:
     *   1. billed = 'F'  - already-billed time is never touched, so no existing invoice
     *                      can change. This is the primary and most important gate.
     *   2. rolling window - trandate within sinceDays, capped at MAX_LOOKBACK_DAYS.
     *   3. cutoff date    - optional hard floor; set it to your last closed period end.
     *
     * @param {number} sinceDays
     * @param {string|null} cutoffSql - YYYY-MM-DD, or null
     * @returns {string} SuiteQL
     */
    function buildQuery(sinceDays, cutoffSql) {
        let sql = 'SELECT tb.id AS timeid, ' +
                  '       tb.' + taskLabel.SOURCE_TASK_FIELD + ' AS taskid, ' +
                  '       tb.' + taskLabel.TASK_FIELD + ' AS current_label, ' +
                  '       tb.' + taskLabel.TASK_DESC_FIELD + ' AS current_desc, ' +
                  '       tb.memo AS memo, ' +
                  '       pt.title AS task_title ' +
                  'FROM TimeBill tb ' +
                  'LEFT JOIN projecttask pt ON pt.id = tb.' + taskLabel.SOURCE_TASK_FIELD + ' ' +
                  'WHERE tb.isbillable = \'T\' ' +
                  '  AND tb.billed = \'F\' ' +
                  '  AND tb.' + taskLabel.SOURCE_TASK_FIELD + ' IS NOT NULL ' +
                  '  AND tb.trandate >= (CURRENT_DATE - ' + sinceDays + ')';

        if (cutoffSql) {
            sql += '  AND tb.trandate > TO_DATE(\'' + cutoffSql + '\', \'YYYY-MM-DD\')';
        }

        return sql;
    }

    /**
     * @returns {Array<Object>} candidate rows
     */
    function getInputData() {
        try {
            const script = runtime.getCurrentScript();

            let sinceDays = Number(script.getParameter({ name: 'custscript_pc_t2i_since_days' }))
                            || DEFAULT_LOOKBACK_DAYS;

            if (sinceDays > MAX_LOOKBACK_DAYS) {
                log.audit(SCRIPT_NAME + ' lookback clamped',
                          'Parameter requested ' + sinceDays + ' days; capped at ' +
                          MAX_LOOKBACK_DAYS + '.');
                sinceDays = MAX_LOOKBACK_DAYS;
            }

            const cutoffSql = resolveCutoff(script);

            const rows = [];
            const paged = query.runSuiteQLPaged({
                query: buildQuery(sinceDays, cutoffSql),
                pageSize: 1000
            });
            paged.pageRanges.forEach(function (range) {
                paged.fetch({ index: range.index }).data.asMappedResults().forEach(function (r) {
                    rows.push(r);
                });
            });

            log.audit(SCRIPT_NAME + ' getInputData',
                      'Candidates: ' + rows.length +
                      ' | lookback: ' + sinceDays + ' days' +
                      ' | cutoff: ' + (cutoffSql || 'none'));
            return rows;
        } catch (e) {
            log.error(SCRIPT_NAME + ' getInputData failed', e.name + ': ' + e.message);
            throw e;
        }
    }

    /**
     * @param {Object} ctx
     */
    function map(ctx) {
        let row;
        try {
            row = JSON.parse(ctx.value);
        } catch (e) {
            log.error(SCRIPT_NAME + ' map parse failed', ctx.value);
            return;
        }

        const timeId = row.timeid;

        try {
            let label = taskLabel.resolveLabel(row.taskid, row.task_title);
            let rec = null;

            // Not a Project Task - load and use the union field's display text.
            if (!label) {
                rec = record.load({ type: record.Type.TIME_BILL, id: timeId, isDynamic: false });
                label = taskLabel.normalise(rec.getText({ fieldId: taskLabel.SOURCE_TASK_FIELD }));
            }

            if (!label) {
                log.warn(SCRIPT_NAME + ' no label',
                         'Time ' + timeId + ' task ' + row.taskid + ' - left unchanged.');
                ctx.write({ key: 'skipped_no_label', value: timeId });
                return;
            }

            const desc = taskLabel.buildTaskDesc(label, row.memo);

            // Idempotency: a re-run over already-correct data performs no writes.
            // Both fields must match - a memo edit changes desc while label stays put.
            if ((row.current_label || '') === label && (row.current_desc || '') === desc) {
                ctx.write({ key: 'unchanged', value: timeId });
                return;
            }

            if (!rec) {
                rec = record.load({ type: record.Type.TIME_BILL, id: timeId, isDynamic: false });
            }
            rec.setValue({ fieldId: taskLabel.TASK_FIELD, value: label });
            rec.setValue({ fieldId: taskLabel.TASK_DESC_FIELD, value: desc });
            rec.save({ ignoreMandatoryFields: true });

            ctx.write({ key: 'updated', value: timeId });
        } catch (e) {
            log.error(SCRIPT_NAME + ' map failed on time ' + timeId,
                      e.name + ': ' + e.message + ' | ' + (e.stack || 'no stack'));
            ctx.write({ key: 'error', value: timeId + ': ' + e.message });
        }
    }

    /**
     * @param {Object} ctx
     */
    function reduce(ctx) {
        ctx.write({ key: ctx.key, value: ctx.values.length });
    }

    /**
     * @param {Object} summary
     */
    function summarize(summary) {
        const counts = {};
        const errors = [];

        summary.output.iterator().each(function (key, value) {
            counts[key] = value;
            return true;
        });

        summary.mapSummary.errors.iterator().each(function (key, err) {
            if (errors.length < 20) {
                errors.push(key + ': ' + err);
            }
            return true;
        });

        log.audit(SCRIPT_NAME + ' summary',
                  'Updated: ' + (counts.updated || 0) +
                  ' | Unchanged: ' + (counts.unchanged || 0) +
                  ' | No label: ' + (counts.skipped_no_label || 0) +
                  ' | Errors: ' + (counts.error || 0) +
                  ' | Usage: ' + summary.usage +
                  ' | Seconds: ' + summary.seconds);

        if (errors.length) {
            log.error(SCRIPT_NAME + ' errors', errors.join('\n'));
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});
