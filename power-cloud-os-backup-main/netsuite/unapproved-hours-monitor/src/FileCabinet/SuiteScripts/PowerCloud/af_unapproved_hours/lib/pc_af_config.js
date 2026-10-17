/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: ids, field names, list lookup
 * @author Power Cloud Consulting
 *
 * Every script id the feature touches, in one place. Custom list VALUES are
 * resolved by name at runtime rather than hardcoded, because their internal ids
 * are assigned per account - hardcoding them would work in production and fail
 * silently the day a sandbox exists.
 */
define(['N/search', 'N/log'], function (search, log) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_AFConfig';

    /**
     * Anderson Frank is the bill-to customer on every one of these invoices;
     * the end client is reached through the invoice's project. Resolved by name
     * with this as the fast path.
     */
    const AF_CUSTOMER_ID = 136;
    const AF_CUSTOMER_NAME = 'Anderson Frank';

    const REC = {
        TIMESHEET: 'customrecord_pc_af_timesheet',
        IMPORT_LOG: 'customrecord_pc_af_import_log'
    };

    const LIST = {
        TS_STATUS: 'customlist_pc_af_ts_status',
        MATCH_STATUS: 'customlist_pc_af_match_status'
    };

    /** Fields on customrecord_pc_af_timesheet. */
    const TS = {
        NAME: 'name',
        CONTRACTOR: 'custrecord_pc_afts_contractor',
        CLIENT: 'custrecord_pc_afts_client',
        PLACEMENT: 'custrecord_pc_afts_placement',
        PLACE_START: 'custrecord_pc_afts_place_start',
        PLACE_END: 'custrecord_pc_afts_place_end',
        PERIOD_END: 'custrecord_pc_afts_period_end',
        AF_STATUS: 'custrecord_pc_afts_af_status',
        HOURS: 'custrecord_pc_afts_hours',
        PAY: 'custrecord_pc_afts_pay',
        PAY_CCY: 'custrecord_pc_afts_pay_ccy',
        STATUS: 'custrecord_pc_afts_status',
        MATCH: 'custrecord_pc_afts_match',
        INVOICE: 'custrecord_pc_afts_invoice',
        PROJECT: 'custrecord_pc_afts_project',
        VARIANCE: 'custrecord_pc_afts_variance',
        FIRST_SEEN: 'custrecord_pc_afts_first_seen',
        LAST_SEEN: 'custrecord_pc_afts_last_seen',
        APPROVED_ON: 'custrecord_pc_afts_approved_on',
        IMPORT: 'custrecord_pc_afts_import',
        CONTACT_EMAIL: 'custrecord_pc_afts_contact_email',
        NUDGE_COUNT: 'custrecord_pc_afts_nudge_count',
        LAST_NUDGED: 'custrecord_pc_afts_last_nudged',
        NUDGED_BY: 'custrecord_pc_afts_nudged_by',
        SNOOZED_UNTIL: 'custrecord_pc_afts_snoozed_until',
        NUDGE_LOG: 'custrecord_pc_afts_nudge_log'
    };

    /** Fields on customrecord_pc_af_import_log. */
    const IL = {
        ASOF: 'custrecord_pc_afil_asof',
        FILE: 'custrecord_pc_afil_file',
        ROWS: 'custrecord_pc_afil_rows',
        MATCHED: 'custrecord_pc_afil_matched',
        NEW: 'custrecord_pc_afil_new',
        FLIPPED: 'custrecord_pc_afil_flipped',
        NOTINV: 'custrecord_pc_afil_notinv',
        EXCEPT: 'custrecord_pc_afil_except',
        USER: 'custrecord_pc_afil_user',
        NOTES: 'custrecord_pc_afil_notes'
    };

    /** Invoice body fields this feature maintains. */
    const INV = {
        TS_ID: 'custbody_pc_af_ts_id',
        TS_STATUS: 'custbody_pc_af_ts_status',
        STATUS_ASOF: 'custbody_pc_af_status_asof',
        FIRST_UNAPPR: 'custbody_pc_af_first_unappr'
    };

    /** Where uploaded source files are retained. */
    const FILE_FOLDER_NAME = 'PowerCloud AF Imports';

    const listCache = {};

    /**
     * Maps a custom list's value text to its internal id for this account.
     *
     * @param {string} listScriptId
     * @returns {Object} e.g. { Unapproved: '1', Approved: '2' }
     */
    function getListValues(listScriptId) {
        if (listCache[listScriptId]) { return listCache[listScriptId]; }
        const map = {};
        try {
            search.create({
                type: listScriptId,
                columns: ['internalid', 'name']
            }).run().each(function (r) {
                map[r.getValue('name')] = r.getValue('internalid');
                return true;
            });
        } catch (e) {
            log.error({
                title: SCRIPT_NAME + ': cannot read list ' + listScriptId,
                details: e.message
            });
            throw new Error(SCRIPT_NAME + ': could not resolve values for ' +
                            listScriptId + '. Is the list deployed? (' + e.message + ')');
        }
        listCache[listScriptId] = map;
        return map;
    }

    /**
     * Internal id for one value of a custom list, by its display text.
     *
     * @param {string} listScriptId
     * @param {string} valueText
     * @returns {string}
     */
    function getListValueId(listScriptId, valueText) {
        const map = getListValues(listScriptId);
        const id = map[valueText];
        if (!id) {
            throw new Error(SCRIPT_NAME + ': list ' + listScriptId +
                            ' has no value "' + valueText + '". Found: ' +
                            Object.keys(map).join(', '));
        }
        return id;
    }

    /** Display text used in the lists, mapped from the logical codes in pc_af_match. */
    const STATUS_TEXT = {
        UNAPPROVED: 'Unapproved',
        APPROVED: 'Approved',
        AWAITING: 'Awaiting Status'
    };

    const MATCH_TEXT = {
        MATCHED: 'Matched',
        NOT_YET_INVOICED: 'Not Yet Invoiced',
        UNMATCHED: 'Unmatched - Exception',
        AMBIGUOUS: 'Ambiguous - Multiple Invoices'
    };

    return {
        AF_CUSTOMER_ID: AF_CUSTOMER_ID,
        AF_CUSTOMER_NAME: AF_CUSTOMER_NAME,
        FILE_FOLDER_NAME: FILE_FOLDER_NAME,
        REC: REC,
        LIST: LIST,
        TS: TS,
        IL: IL,
        INV: INV,
        STATUS_TEXT: STATUS_TEXT,
        MATCH_TEXT: MATCH_TEXT,
        getListValues: getListValues,
        getListValueId: getListValueId
    };
});
