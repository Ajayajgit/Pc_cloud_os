/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**
 * PC | Class Propagation
 * Purpose: fill an empty header class and empty line classes on invoices and credit memos from the header project, and an empty class on time entries from their project, never overwriting a set value.
 * Plan task: T4 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: customdeploy_pc_crm_class_prop_inv (INVOICE), customdeploy_pc_crm_class_prop_cm (CREDITMEMO), customdeploy_pc_crm_class_prop_tb (TIMEBILL), beforeSubmit
 */
define(['N/record', 'N/search', 'N/runtime', 'N/log'], (record, search, runtime, log) => {

    const CLASS_FIELD = 'class';
    const PROJECT_CLASS_FIELD = 'custentity_cus_rev_src';
    const ITEM_SUBLIST = 'item';
    const USAGE_FLOOR = 100;

    const TYPE_TIME_ENTRY = 'timebill';

    const isEmpty = (value) => value === null || value === undefined || value === '' || value === 0 || value === '0';

    // search.lookupFields returns a select field as [{value, text}] (empty array when unset).
    const selectValue = (lookupResult, fieldId) => {
        const raw = lookupResult ? lookupResult[fieldId] : null;
        if (Array.isArray(raw)) {
            return raw.length > 0 ? raw[0].value : null;
        }
        return isEmpty(raw) ? null : raw;
    };

    /**
     * Which header field carries the project for this record type.
     * Invoice and credit memo: job. Time entry: customer, returned as a candidate project id;
     * getProjectClass decides whether it really is a project.
     */
    const getProjectId = (rec, type) => {
        const fieldId = type === TYPE_TIME_ENTRY ? 'customer' : 'job';
        const id = rec.getValue({ fieldId: fieldId });
        return isEmpty(id) ? null : id;
    };

    const getProjectClass = (projectId) => {
        // A time entry's customer may be a plain customer rather than a project. A non-project
        // customer is detected here by the JOB lookup throwing or returning nothing, in which
        // case this returns null and the record is left untouched.
        try {
            const lookup = search.lookupFields({
                type: search.Type.JOB,
                id: projectId,
                columns: [PROJECT_CLASS_FIELD]
            });
            return selectValue(lookup, PROJECT_CLASS_FIELD);
        } catch (e) {
            log.audit({
                title: 'Project class lookup returned no project',
                details: `Id ${projectId} is not a readable project (${e.name}); record left unchanged`
            });
            return null;
        }
    };

    /**
     * Counts item lines whose class is empty. Read-only.
     */
    const countEmptyLineClasses = (rec) => {
        const lineCount = rec.getLineCount({ sublistId: ITEM_SUBLIST });
        let empty = 0;
        for (let i = 0; i < lineCount; i++) {
            const lineClass = rec.getSublistValue({ sublistId: ITEM_SUBLIST, fieldId: CLASS_FIELD, line: i });
            if (isEmpty(lineClass)) {
                empty++;
            }
        }
        return empty;
    };

    const beforeSubmit = (context) => {
        const target = context.newRecord;
        const type = target.type;
        const recId = target.id || 'new';
        try {
            const eventType = context.type;
            const isCreate = eventType === context.UserEventType.CREATE;
            const isEdit = eventType === context.UserEventType.EDIT;
            const isXedit = eventType === context.UserEventType.XEDIT;
            if (!isCreate && !isEdit && !isXedit) {
                return;
            }

            const script = runtime.getCurrentScript();
            const hasLines = type !== TYPE_TIME_ENTRY;

            // On XEDIT newRecord holds only the edited fields, so read from the full record.
            // PC-DECISION: on XEDIT only the header class is written (inline edit cannot reach
            // item lines through newRecord). Default: header only on XEDIT. Option: also fill
            // lines on XEDIT by loading, setting and saving the record (rejected as a default:
            // a save inside beforeSubmit re-triggers the script and costs 10+ units).
            let source = target;
            if (isXedit) {
                if (isEmpty(target.id)) {
                    return;
                }
                source = record.load({ type: type, id: target.id });
            }

            let headerClass = source.getValue({ fieldId: CLASS_FIELD });
            const headerWasEmpty = isEmpty(headerClass);
            const wantLines = hasLines && !isXedit;
            const emptyLines = wantLines ? countEmptyLineClasses(target) : 0;

            // Nothing to fill: skip every lookup.
            if (!headerWasEmpty && emptyLines === 0) {
                return;
            }

            if (headerWasEmpty) {
                if (script.getRemainingUsage() < USAGE_FLOOR) {
                    log.audit({ title: 'Usage floor reached', details: `Skipped class lookup on ${type} ${recId}` });
                    return;
                }
                const projectId = getProjectId(source, type);
                if (isEmpty(projectId)) {
                    return;
                }
                const projectClass = getProjectClass(projectId);
                if (isEmpty(projectClass)) {
                    return;
                }
                headerClass = projectClass;
                target.setValue({ fieldId: CLASS_FIELD, value: headerClass });
            }

            let linesFilled = 0;
            if (wantLines && emptyLines > 0) {
                const lineCount = target.getLineCount({ sublistId: ITEM_SUBLIST });
                for (let i = 0; i < lineCount; i++) {
                    if (script.getRemainingUsage() < USAGE_FLOOR) {
                        log.audit({ title: 'Usage floor reached', details: `Stopped at line ${i} on ${type} ${recId}` });
                        break;
                    }
                    const lineClass = target.getSublistValue({ sublistId: ITEM_SUBLIST, fieldId: CLASS_FIELD, line: i });
                    if (isEmpty(lineClass)) {
                        target.setSublistValue({ sublistId: ITEM_SUBLIST, fieldId: CLASS_FIELD, line: i, value: headerClass });
                        linesFilled++;
                    }
                }
            }

            if (headerWasEmpty || linesFilled > 0) {
                log.audit({
                    title: 'Class propagated',
                    details: `${type} ${recId}: class ${headerClass} set; header filled ${headerWasEmpty}; lines filled ${linesFilled}`
                });
            }
        } catch (e) {
            // The propagation is a convenience: a failure must never block billing or time entry.
            log.error({
                title: `beforeSubmit failed on ${type} ${recId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
        }
    };

    return { beforeSubmit };
});
