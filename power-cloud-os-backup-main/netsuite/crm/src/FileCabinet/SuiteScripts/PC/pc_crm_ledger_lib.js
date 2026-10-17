/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
/**
 * PC | Operation Ledger
 * Purpose: claim, advance, complete, fail and refuse rows of PC | Operation Ledger so a mutation request is idempotent by request id and resumable by step.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: none (library)
 */
define(['N/record', 'N/search', 'N/runtime', 'N/error', 'N/log'], (record, search, runtime, error, log) => {
    const RECORD_TYPE = 'customrecord_pc_op_ledger';
    const STATUS_LIST = 'customlist_pc_ol_status';
    const F = {
        action: 'custrecord_pc_ol_action',
        hash: 'custrecord_pc_ol_hash',
        // Integer field: a List/Record Transaction field does not accept opportunities (production, 2026-10-09).
        opp: 'custrecord_pc_ol_opp_id',
        project: 'custrecord_pc_ol_project',
        step: 'custrecord_pc_ol_step',
        status: 'custrecord_pc_ol_status',
        result: 'custrecord_pc_ol_result',
        role: 'custrecord_pc_ol_role',
        error: 'custrecord_pc_ol_error'
    };

    // Ledger action written by the project builder. The readiness gate filters on it so rows written by other
    // CRM actions on the same opportunity never count as project setup state.
    const ACTION_CREATE_PROJECT = 'create_project';

    const USAGE_FLOOR = 50;
    const MAX_ROWS = 100;
    const MAX_TEXT = 3500;

    // Status list value labels (customlist_pc_ol_status). Internal ids are assigned at deploy time, so they are
    // read from the list once per execution rather than hard coded.
    const STATUS_LABELS = ['pending', 'done', 'failed', 'refused'];
    let statusIdByLabel = null;

    const loadStatusIds = () => {
        if (statusIdByLabel) {
            return statusIdByLabel;
        }
        const map = {};
        const rows = search.create({
            type: STATUS_LIST,
            columns: ['name']
        }).run().getRange({ start: 0, end: 50 });
        rows.forEach((row) => {
            map[String(row.getValue({ name: 'name' })).toLowerCase()] = parseInt(row.id, 10);
        });
        STATUS_LABELS.forEach((label) => {
            if (!map[label]) {
                throw error.create({
                    name: 'PC_LEDGER_STATUS_MISSING',
                    message: `Ledger status value "${label}" was not found in ${STATUS_LIST}.`,
                    notifyOff: true
                });
            }
        });
        statusIdByLabel = map;
        return statusIdByLabel;
    };

    const statusId = (label) => loadStatusIds()[label];

    const truncate = (text) => {
        const s = String(text === undefined || text === null ? '' : text);
        return s.length > MAX_TEXT ? s.slice(0, MAX_TEXT) : s;
    };

    const parseJson = (text) => {
        if (!text) {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            log.error({
                title: `parseJson failed on ${RECORD_TYPE} result`,
                details: `${e.name}: ${e.message}`
            });
            return null;
        }
    };

    const submit = (rowId, values) => {
        record.submitFields({
            type: RECORD_TYPE,
            id: rowId,
            values,
            options: { enableSourcing: false, ignoreMandatoryFields: true }
        });
    };

    /**
     * Loads a row by request id. The ledger name holds the request id. Uses record.load so the full result
     * text is returned (search columns truncate long text).
     */
    const findByRequestId = (requestId) => {
        const rows = search.create({
            type: RECORD_TYPE,
            filters: [['name', 'is', requestId]],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        if (rows.length === 0) {
            return null;
        }
        const rowId = parseInt(rows[0].id, 10);
        const rec = record.load({ type: RECORD_TYPE, id: rowId });
        return {
            rowId,
            status: String(rec.getText({ fieldId: F.status }) || '').toLowerCase(),
            step: parseInt(rec.getValue({ fieldId: F.step }), 10) || 0,
            hash: rec.getValue({ fieldId: F.hash }) || '',
            oppId: parseInt(rec.getValue({ fieldId: F.opp }), 10) || null,
            result: parseJson(rec.getValue({ fieldId: F.result }))
        };
    };

    /**
     * Claims a ledger row for the request. The row carries externalid pc_req_{requestId}; a second save with the
     * same external id fails, and that failure is the atomic claim. When the save fails and a row for the request
     * id exists, the existing row is returned with existing: true so the caller can replay, resume or refuse.
     */
    const claim = (action, requestId, payloadHash, oppId, roleId) => {
        const rec = record.create({ type: RECORD_TYPE });
        rec.setValue({ fieldId: 'name', value: requestId });
        rec.setValue({ fieldId: 'externalid', value: `pc_req_${requestId}` });
        rec.setValue({ fieldId: F.action, value: action });
        rec.setValue({ fieldId: F.hash, value: payloadHash });
        rec.setValue({ fieldId: F.opp, value: oppId });
        rec.setValue({ fieldId: F.step, value: 0 });
        rec.setValue({ fieldId: F.status, value: statusId('pending') });
        rec.setValue({ fieldId: F.role, value: truncate(roleId) });

        try {
            const rowId = parseInt(rec.save({ ignoreMandatoryFields: true }), 10);
            return { rowId, existing: false, status: 'pending', step: 0, hash: payloadHash, oppId, result: null };
        } catch (e) {
            const existing = findByRequestId(requestId);
            if (!existing) {
                log.error({
                    title: `claim failed on ${RECORD_TYPE} for opportunity ${oppId}`,
                    details: `${e.name}: ${e.message}\n${e.stack}`
                });
                throw e;
            }
            log.audit({
                title: `claim found existing ${RECORD_TYPE} ${existing.rowId}`,
                details: `status ${existing.status}, step ${existing.step}`
            });
            return Object.assign({ existing: true }, existing);
        }
    };

    /**
     * Lists the rows of an opportunity for an action, newest first, optionally leaving one row out (the row the
     * caller just claimed). Bounded to MAX_ROWS.
     */
    const findByOpp = (oppId, action, excludeRowId) => {
        const filters = [
            [F.opp, 'equalto', oppId],
            'AND', [F.action, 'is', action],
            'AND', ['isinactive', 'is', 'F']
        ];
        if (excludeRowId) {
            filters.push('AND', ['internalid', 'noneof', excludeRowId]);
        }
        const rows = search.create({
            type: RECORD_TYPE,
            filters,
            columns: [
                search.createColumn({ name: 'internalid', sort: search.Sort.DESC }),
                F.status,
                F.step
            ]
        }).run().getRange({ start: 0, end: MAX_ROWS });

        const out = [];
        const script = runtime.getCurrentScript();
        for (const row of rows) {
            if (script.getRemainingUsage() < USAGE_FLOOR) {
                throw error.create({
                    name: 'PC_USAGE_LOW',
                    message: 'Governance floor reached while reading ledger rows.',
                    notifyOff: true
                });
            }
            out.push({
                rowId: parseInt(row.id, 10),
                status: String(row.getText({ name: F.status }) || '').toLowerCase(),
                step: parseInt(row.getValue({ name: F.step }), 10) || 0
            });
        }
        return out;
    };

    /** Records the last completed step. extraValues (optional) holds other ledger field values to write with it. */
    const step = (rowId, n, extraValues) => {
        submit(rowId, Object.assign({}, extraValues || {}, { [F.step]: n }));
    };

    /** Marks the row done and stores the result JSON, unchanged, for replay. */
    const done = (rowId, resultObject) => {
        const values = {
            [F.status]: statusId('done'),
            [F.result]: JSON.stringify(resultObject),
            [F.error]: ''
        };
        if (resultObject && resultObject.projectId) {
            values[F.project] = resultObject.projectId;
        }
        submit(rowId, values);
    };

    /** Marks the row failed. errorObject carries name, message and optionally the step; no stack, no PII. */
    const fail = (rowId, errorObject) => {
        submit(rowId, {
            [F.status]: statusId('failed'),
            [F.error]: truncate(JSON.stringify(errorObject))
        });
    };

    /** Marks the row refused and stores the reason (and optional details) as its result. */
    const refuse = (rowId, reason, details) => {
        const result = Object.assign({ refused: true, reason }, details || {});
        submit(rowId, {
            [F.status]: statusId('refused'),
            [F.result]: truncate(JSON.stringify(result)),
            [F.error]: truncate(reason)
        });
        return result;
    };

    /** Puts a failed row back to pending when its request id is replayed to resume. */
    const reopen = (rowId) => {
        submit(rowId, { [F.status]: statusId('pending'), [F.error]: '' });
    };

    return {
        ACTION_CREATE_PROJECT,
        claim,
        findByOpp,
        step,
        done,
        fail,
        refuse,
        reopen
    };
});
