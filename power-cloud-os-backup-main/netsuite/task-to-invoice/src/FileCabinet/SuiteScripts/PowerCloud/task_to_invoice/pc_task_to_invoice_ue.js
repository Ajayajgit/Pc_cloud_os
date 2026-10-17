/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @description Power Cloud - Task to Invoice : stamp the Task label at save time.
 *              Sets custcol_powercloud_task on each time line as the record is saved, so
 *              the value is present immediately rather than after the nightly sweep.
 * @author Power Cloud Consulting
 *
 * DEPLOY TO TIMESHEET FIRST
 *   Verified against account 5641465: 2,356 of 2,356 billable time entries in the last
 *   3 months arrived via Weekly Timesheet. Zero were direct Time entries. A deployment
 *   on Time Tracking alone would therefore have caught nothing.
 *   The Time Tracking deployment is kept as a cheap safety net for direct entry.
 *
 * BEFORESUBMIT, NOT AFTERSUBMIT
 *   Values are set in memory on the record being saved, so there is no second save and
 *   no risk of a save loop.
 *
 * FAIL-OPEN BY DESIGN
 *   This runs on every timesheet save. Nothing in here is allowed to block a consultant
 *   submitting time. Every failure is logged and swallowed; the nightly Map/Reduce
 *   (customscript_pc_task_to_invoice_mr) reconciles anything this misses.
 */
define(['./lib/pc_task_label', 'N/runtime', 'N/log'],
function (taskLabel, runtime, log) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_TaskToInvoiceUE';

    /**
     * Time sublist on the Timesheet record, and the task column within it.
     * VERIFY IN SANDBOX: confirm these ids before relying on the timesheet deployment.
     * If either is wrong, setSublistValue throws, the error is logged, the save still
     * succeeds, and the Map/Reduce picks the record up that night.
     */
    const TIME_SUBLIST = 'timeitem';
    const SUBLIST_TASK_FIELD = 'casetaskevent';

    /**
     * Timesheet path: resolve every line's task in one query, then stamp each line.
     *
     * @param {Record} rec - context.newRecord
     * @returns {{set: number, skipped: number}}
     */
    function stampTimesheet(rec) {
        const lineCount = rec.getLineCount({ sublistId: TIME_SUBLIST });
        if (lineCount <= 0) {
            return { set: 0, skipped: 0 };
        }

        // Pass 1: collect task ids so the title lookup is a single query.
        const taskIds = [];
        for (let i = 0; i < lineCount; i++) {
            const taskId = rec.getSublistValue({
                sublistId: TIME_SUBLIST,
                fieldId: SUBLIST_TASK_FIELD,
                line: i
            });
            if (taskId) {
                taskIds.push(taskId);
            }
        }

        const titles = taskLabel.fetchTitles(taskIds);
        let set = 0;
        let skipped = 0;

        // Pass 2: stamp.
        for (let i = 0; i < lineCount; i++) {
            const taskId = rec.getSublistValue({
                sublistId: TIME_SUBLIST,
                fieldId: SUBLIST_TASK_FIELD,
                line: i
            });

            if (!taskId) {
                skipped++;
                continue;
            }

            let label = taskLabel.resolveLabel(taskId, titles[taskId]);

            // Not a Project Task, or title lookup came back empty - use the display text.
            if (!label) {
                try {
                    label = taskLabel.normalise(rec.getSublistText({
                        sublistId: TIME_SUBLIST,
                        fieldId: SUBLIST_TASK_FIELD,
                        line: i
                    }));
                } catch (e) {
                    label = '';
                }
            }

            if (!label) {
                skipped++;
                continue;
            }

            rec.setSublistValue({
                sublistId: TIME_SUBLIST,
                fieldId: taskLabel.TASK_FIELD,
                line: i,
                value: label
            });

            // Concatenated value for Anderson Frank portal entry (87% of billable hours).
            const memo = rec.getSublistValue({
                sublistId: TIME_SUBLIST,
                fieldId: 'memo',
                line: i
            });

            rec.setSublistValue({
                sublistId: TIME_SUBLIST,
                fieldId: taskLabel.TASK_DESC_FIELD,
                line: i,
                value: taskLabel.buildTaskDesc(label, memo)
            });

            set++;
        }

        return { set: set, skipped: skipped };
    }

    /**
     * Time Tracking path: single record, single field.
     *
     * @param {Record} rec - context.newRecord
     * @returns {{set: number, skipped: number}}
     */
    function stampTimeBill(rec) {
        const taskId = rec.getValue({ fieldId: taskLabel.SOURCE_TASK_FIELD });
        if (!taskId) {
            return { set: 0, skipped: 1 };
        }

        const titles = taskLabel.fetchTitles([taskId]);
        let label = taskLabel.resolveLabel(taskId, titles[taskId]);

        if (!label) {
            label = taskLabel.normalise(rec.getText({ fieldId: taskLabel.SOURCE_TASK_FIELD }));
        }

        if (!label) {
            return { set: 0, skipped: 1 };
        }

        rec.setValue({ fieldId: taskLabel.TASK_FIELD, value: label });
        rec.setValue({
            fieldId: taskLabel.TASK_DESC_FIELD,
            value: taskLabel.buildTaskDesc(label, rec.getValue({ fieldId: 'memo' }))
        });
        return { set: 1, skipped: 0 };
    }

    /**
     * @param {Object} context
     */
    function beforeSubmit(context) {
        if (context.type !== context.UserEventType.CREATE &&
            context.type !== context.UserEventType.EDIT &&
            context.type !== context.UserEventType.XEDIT) {
            return;
        }

        try {
            const rec = context.newRecord;
            const recType = rec.type;

            const result = (recType === 'timesheet')
                ? stampTimesheet(rec)
                : stampTimeBill(rec);

            log.debug(SCRIPT_NAME, recType + ' ' + (rec.id || 'new') +
                                   ' | set: ' + result.set +
                                   ' | skipped: ' + result.skipped +
                                   ' | context: ' + runtime.executionContext);
        } catch (e) {
            // Deliberately swallowed - see FAIL-OPEN note in the header.
            log.error(SCRIPT_NAME + ' failed, save allowed to continue',
                      e.name + ': ' + e.message + ' | ' + (e.stack || 'no stack'));
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
