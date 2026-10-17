/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Task to Invoice : shared label resolution.
 *              Single source of truth for turning a task id into the string that gets
 *              printed on a customer invoice. Used by both the User Event (on save) and
 *              the Map/Reduce (nightly sweep) so the two cannot drift apart.
 * @author Power Cloud Consulting
 */
define(['N/query', 'N/log'], function (query, log) {
    'use strict';

    const MODULE_NAME = 'PowerCloud_TaskLabel';

    /** Target custom column field. Applies to Time and to the invoice item sublist. */
    const TASK_FIELD = 'custcol_powercloud_task';

    /**
     * Concatenated "task + description" field, for Anderson Frank portal entry.
     *
     * AF is 87% of billable hours (3,830 of 4,402 since 2026-06-01) and is billed by
     * manually copying description + hours into AF's portal. A standalone Task column
     * is useless there - the task has to be inside the copied text.
     *
     * MUST be TEXTAREA, not TEXT. Measured on 2,114 AF entries: longest memo is 1,740
     * characters and 183 entries exceed 300, so a TEXT field would silently truncate
     * ~9% of them mid-sentence.
     */
    const TASK_DESC_FIELD = 'custcol_powercloud_task_desc';

    /**
     * Separator between task and description.
     *
     * A pipe rather than a hyphen: task titles frequently contain hyphens already
     * ("Celigo - NetSuite Field Fix", "1003 - Fixed Asset Configuration"), so a bare
     * hyphen is ambiguous. One character, no surrounding spaces, per the AF char limit.
     */
    const SEPARATOR = '|';

    /**
     * Date handling in the concatenated value.
     *
     *   'STRIP'      - remove the leading MM-DD-YYYY prefix. Saves 13 chars per entry,
     *                  six times more than dropping spaces around the separator. Correct
     *                  when the AF portal captures the date in its own field.
     *   'KEEP_FIRST' - leave the memo's date at the front, task after it.
     *   'KEEP_INNER' - task first, memo (with its date) after. Literal reading of the
     *                  original request; leaves the date mid-string.
     *
     * Flip this one constant to change format across both the UE and the M/R.
     */
    const DATE_MODE = 'STRIP';

    /** Leading date stamp consultants type into the memo (99% of AF entries have it). */
    const DATE_PREFIX_RE = /^\s*\d{2}-\d{2}-\d{4}\s*-?\s*/;

    /** Collapses CR/LF runs so the value survives a paste into a single-line portal field. */
    const NEWLINE_RE = /[\r\n]+/g;

    /** Standard union field on Time holding the Project Task / Case / CRM Task / Event. */
    const SOURCE_TASK_FIELD = 'casetaskevent';

    /** NetSuite free-form text ceiling. Longer labels truncate rather than fail the save. */
    const MAX_LEN = 300;

    /**
     * Trailing record-type suffix, stripped mechanically. Two sources, same fix:
     *
     *  1. Stored in some Project Task titles (verified on tasks 6170, 6229, 6169,
     *     6171, 6257 - " (Project Task)" is literally in projecttask.title).
     *  2. Appended by NetSuite to the display text of the polymorphic casetaskevent
     *     field, to disambiguate which record type it points at. Confirmed in
     *     production on time entry 420986, where getText() returned
     *     "Status Update (Task)" for a CRM Task.
     *
     * The second case is why this list covers every type the union field can hold,
     * not just Project Task.
     */
    const SUFFIX_RE = /\s*\((?:Project Task|Task|Case|Support Case|Event|Calendar Event|Phone Call|Milestone)\)\s*$/i;

    /**
     * Customer-facing labels for tasks whose stored title is unusable as printed output:
     * requirement paragraphs truncated mid-word by a title length limit.
     *
     * Config-in-code is acceptable at this size (5 stable entries) and avoids adding a
     * custom field plus a mass update across every in-use task. If this grows past ~20
     * entries, migrate to an "Invoice Label" custom field on Project Task and read it in
     * fetchTitles() instead.
     */
    const LABEL_OVERRIDES = {
        6147: '1004 : Allocation',
        6071: '1031 : Purchasing Contract',
        6065: '1025 : Vendor Bill AR Items',
        6072: '1032 : Purchasing Contract Approval',
        6144: '1001 : Location'
    };

    /**
     * Bulk-fetches Project Task titles for a set of ids in one round trip.
     *
     * Verified against account 5641465: 100% of billable time in the last 3 months
     * points at a Project Task, so this covers the real population. Ids that are Cases,
     * CRM Tasks or Calendar Events simply return no row and the caller falls back.
     *
     * @param {Array<number|string>} taskIds
     * @returns {Object} map of taskId -> title
     */
    function fetchTitles(taskIds) {
        const titles = {};
        const ids = (taskIds || [])
            .map(function (v) { return parseInt(v, 10); })
            .filter(function (v) { return !isNaN(v); });

        if (!ids.length) {
            return titles;
        }

        // De-duplicate so a 40-line timesheet on 5 tasks costs one small query.
        const unique = ids.filter(function (v, i) { return ids.indexOf(v) === i; });

        try {
            const rows = query.runSuiteQL({
                query: 'SELECT id, title FROM projecttask WHERE id IN (' + unique.join(',') + ')'
            }).asMappedResults();

            rows.forEach(function (r) {
                titles[r.id] = r.title;
            });
        } catch (e) {
            log.error(MODULE_NAME + ' fetchTitles failed', e.name + ': ' + e.message);
        }

        return titles;
    }

    /**
     * Derives the printable label. Override wins; otherwise the title, suffix-stripped,
     * trimmed and length-capped.
     *
     * @param {number|string} taskId
     * @param {string} [taskTitle]
     * @returns {string} label, or empty string when nothing usable is available
     */
    function resolveLabel(taskId, taskTitle) {
        const override = LABEL_OVERRIDES[taskId];
        if (override) {
            return override;
        }
        if (!taskTitle) {
            return '';
        }
        return String(taskTitle).replace(SUFFIX_RE, '').trim().substring(0, MAX_LEN);
    }

    /**
     * Cleans a display string obtained from getText()/getSublistText() rather than from
     * a title lookup. Same normalisation, no override lookup needed by the caller.
     *
     * @param {string} displayText
     * @returns {string}
     */
    function normalise(displayText) {
        return displayText
            ? String(displayText).replace(SUFFIX_RE, '').trim().substring(0, MAX_LEN)
            : '';
    }

    /**
     * Builds the concatenated "task + description" value for portal entry.
     *
     * No length cap applied - the destination is a TEXTAREA field, and truncating here
     * would lose billable detail. If AF enforces a hard limit, trim at the point of
     * paste rather than destroying the stored value.
     *
     * @param {string} label - resolved task label
     * @param {string} memo - the time entry memo
     * @returns {string} concatenated value, or whichever side is non-empty
     */
    function buildTaskDesc(label, memo) {
        let desc = String(memo || '').replace(NEWLINE_RE, '; ').trim();
        let datePrefix = '';

        if (DATE_MODE === 'STRIP' || DATE_MODE === 'KEEP_FIRST') {
            const match = desc.match(DATE_PREFIX_RE);
            if (match) {
                datePrefix = match[0].trim();
                desc = desc.replace(DATE_PREFIX_RE, '').trim();
            }
        }

        const task = String(label || '').trim();

        // Either side may be absent: 27 AF entries have a memo that is only a date stub,
        // and a non-Project-Task may resolve to no label. Never emit a bare separator.
        if (!task && !desc) {
            return '';
        }
        if (!task) {
            return DATE_MODE === 'KEEP_FIRST' && datePrefix ? datePrefix + ' ' + desc : desc;
        }
        if (!desc) {
            return DATE_MODE === 'KEEP_FIRST' && datePrefix ? datePrefix + ' ' + task : task;
        }

        const joined = task + SEPARATOR + desc;
        return (DATE_MODE === 'KEEP_FIRST' && datePrefix) ? datePrefix + ' ' + joined : joined;
    }

    return {
        TASK_FIELD: TASK_FIELD,
        TASK_DESC_FIELD: TASK_DESC_FIELD,
        SOURCE_TASK_FIELD: SOURCE_TASK_FIELD,
        fetchTitles: fetchTitles,
        resolveLabel: resolveLabel,
        normalise: normalise,
        buildTaskDesc: buildTaskDesc
    };
});
