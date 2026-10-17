/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: invoice status sweep
 * @author Power Cloud Consulting
 *
 * Closes the half of the picture the AF report cannot tell us.
 *
 * Hours the client approves promptly NEVER appear on an unapproved report, so
 * an approach that only learns from report rows leaves those invoices blank
 * forever - and blank would then mean four different things at once. This walks
 * the invoice population instead, treating the report as a filter over it, and
 * gives every AF timesheet invoice an explicit status.
 *
 * Runs as the one-time backfill AND as the ongoing weekly reconciliation after
 * each import. Writes only where a value actually changes, so a repeat run over
 * an already-correct account is cheap and produces no system notes.
 */
define([
    'N/query', 'N/search', 'N/record', 'N/runtime', 'N/log',
    '../lib/pc_af_config', '../lib/pc_af_match'
], function (query, search, record, runtime, log, cfg, matcher) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_AFSweepMR';
    const PAGE = 1000;

    /** Optional date floor, for scoping a backfill. Blank means all history. */
    const PARAM_FROM = 'custscript_pc_af_sweep_from';

    function nsDateString(d) {
        if (!d) { return null; }
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    function parseNsDate(v) {
        if (!v) { return null; }
        const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(v).trim());
        if (!m) { return null; }
        return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
    }

    /**
     * The date of the most recent import. Every judgement this script makes
     * rests on it.
     *
     * @returns {Date|null}
     */
    function getLatestImportAsOf() {
        let latest = null;
        search.create({
            type: cfg.REC.IMPORT_LOG,
            filters: [],
            columns: [search.createColumn({ name: cfg.IL.ASOF, sort: search.Sort.DESC })]
        }).run().getRange({ start: 0, end: 1 }).forEach(function (r) {
            latest = parseNsDate(r.getValue(cfg.IL.ASOF));
        });
        return latest;
    }

    /**
     * The earliest AF invoice this feature has ever stamped.
     *
     * Everything older is out of scope, deliberately. Those invoices sit in
     * closed accounting periods where a body-field write throws, and their
     * approval status is history - nobody is going to chase a 2021 timesheet.
     * Sweeping them produced nothing but a wall of closed-period errors.
     *
     * Computed each run rather than hardcoded, so the window is anchored to
     * real data instead of a date that rots.
     *
     * @param {Date} asOf
     * @returns {Date|null}
     */
    function getTrackedFloor(asOf) {
        const sql =
            'SELECT MIN(t.trandate) AS earliest FROM transaction t ' +
            "WHERE t.type = 'CustInvc' AND t.voided = 'F' " +
            '  AND t.entity = ' + cfg.AF_CUSTOMER_ID +
            '  AND t.' + cfg.INV.TS_STATUS + ' IS NOT NULL';
        const rows = query.runSuiteQL({ query: sql }).asMappedResults();
        const earliest = rows.length ? parseNsDate(rows[0].earliest) : null;
        if (earliest) { return earliest; }

        // Nothing stamped yet. Fall back to a conservative recent window rather
        // than all history, so a first run cannot stampede into closed periods.
        const fallback = new Date(asOf.getTime());
        fallback.setDate(fallback.getDate() - 90);
        log.audit({
            title: SCRIPT_NAME + ': no stamped invoice yet, flooring at 90 days',
            details: 'floor=' + nsDateString(fallback)
        });
        return fallback;
    }

    /**
     * AF ids currently sitting unapproved, as a set.
     *
     * @returns {Object} afId -> true
     */
    function getUnapprovedIds() {
        const set = {};
        const unapprovedId = cfg.getListValueId(cfg.LIST.TS_STATUS, cfg.STATUS_TEXT.UNAPPROVED);
        search.create({
            type: cfg.REC.TIMESHEET,
            filters: [[cfg.TS.STATUS, 'anyof', unapprovedId]],
            columns: ['name']
        }).run().each(function (r) {
            set[r.getValue('name')] = true;
            return true;
        });
        return set;
    }

    /**
     * Every AF invoice, with the AF fields it currently carries.
     *
     * @param {Date} asOf
     * @param {Date|null} from
     * @returns {Array<Object>}
     */
    function loadInvoices(asOf, from, approvedStatusId) {
        // Approval is terminal - AF hours are never un-approved - so an invoice
        // already marked Approved can never change again and is excluded here.
        // This is what keeps the weekly run small: the first backfill sees all
        // ~3,500 timesheet invoices, and every run after it sees only the ones
        // still unapproved, too recent to judge, or newly created.
        //
        // Skipping them is not the same as being blind to them: if AF ever did
        // the impossible and re-listed an approved timesheet, the IMPORT works
        // straight from the report rows and would set it back to Unapproved
        // regardless of what the sweep looks at.
        const excludeApproved = approvedStatusId
            ? ' AND (t.' + cfg.INV.TS_STATUS + ' IS NULL OR t.' +
              cfg.INV.TS_STATUS + ' != ' + approvedStatusId + ')'
            : '';
        const sql =
            'SELECT t.id, t.tranid, t.trandate, t.otherrefnum, ' +
            '       t.' + cfg.INV.TS_ID + ' AS cur_tsid, ' +
            '       t.' + cfg.INV.TS_STATUS + ' AS cur_status, ' +
            '       t.' + cfg.INV.STATUS_ASOF + ' AS cur_asof ' +
            'FROM transaction t ' +
            "WHERE t.type = 'CustInvc' " +
            "  AND t.voided = 'F' " +
            '  AND t.entity = ' + cfg.AF_CUSTOMER_ID + ' ' +
            "  AND t.trandate <= TO_DATE(?, 'MM/DD/YYYY')" +
            (from ? " AND t.trandate >= TO_DATE(?, 'MM/DD/YYYY')" : '') +
            excludeApproved +
            ' ORDER BY t.id';
        const params = from ? [nsDateString(asOf), nsDateString(from)]
                            : [nsDateString(asOf)];

        // Paged: a single runSuiteQL caps at 5,000 rows, and this account
        // already has 5,552 AF invoices.
        const rows = [];
        const paged = query.runSuiteQLPaged({
            query: sql, params: params, pageSize: PAGE
        });
        paged.pageRanges.forEach(function (pageRange) {
            paged.fetch({ index: pageRange.index }).data.asMappedResults()
                .forEach(function (r) { rows.push(r); });
        });
        return rows;
    }

    /**
     * Decides everything up front, so map only has to write. Emits ONLY the
     * invoices whose stored values differ from what they should be.
     */
    function getInputData() {
        const asOf = getLatestImportAsOf();
        if (!asOf) {
            // Without a report there is no evidence of anything. Refusing here
            // is the difference between "no data" and silently marking 3,500
            // invoices approved on the strength of nothing at all.
            throw new Error(SCRIPT_NAME + ': no import log found. Run the import ' +
                            'Suitelet at least once before sweeping - this script ' +
                            'infers approval from absence, and with no report ' +
                            'there is nothing to be absent from.');
        }

        // The parameter is an override for one-off runs; the default is the
        // tracked window, not all history.
        const fromRaw = runtime.getCurrentScript().getParameter({ name: PARAM_FROM });
        const from = fromRaw ? parseNsDate(fromRaw) : getTrackedFloor(asOf);

        const unapprovedIds = getUnapprovedIds();
        const statusIds = {};
        Object.keys(cfg.STATUS_TEXT).forEach(function (code) {
            statusIds[code] = cfg.getListValueId(cfg.LIST.TS_STATUS, cfg.STATUS_TEXT[code]);
        });

        const invoices = loadInvoices(asOf, from, statusIds.APPROVED);
        const asOfStr = nsDateString(asOf);
        const work = [];
        let skippedNotTimesheet = 0;
        let alreadyCorrect = 0;

        invoices.forEach(function (inv) {
            const cls = matcher.classifyInvoice({
                otherrefnum: inv.otherrefnum,
                invoiceDate: parseNsDate(inv.trandate),
                unapprovedIds: unapprovedIds,
                asOf: asOf
            });

            if (!cls.status) { skippedNotTimesheet += 1; return; }

            const targetStatusId = statusIds[cls.status];
            const values = {};

            // As-of is the date this status BECAME what it is, so it moves only
            // when the status moves. Refreshing it on every invoice every week
            // would rewrite all ~3,500 timesheet invoices weekly, with a system
            // note on each, to restore one number that is already known once -
            // from the newest import log record. Staleness is a property of the
            // system, not of each row.
            const statusChanged = String(inv.cur_status || '') !== String(targetStatusId);
            if (statusChanged) {
                values[cfg.INV.TS_STATUS] = targetStatusId;
                values[cfg.INV.STATUS_ASOF] = asOfStr;
            } else if (!inv.cur_asof) {
                values[cfg.INV.STATUS_ASOF] = asOfStr;
            }

            if (String(inv.cur_tsid || '') !== cls.afId) {
                values[cfg.INV.TS_ID] = cls.afId;
            }
            // AF First Seen Unapproved is deliberately never touched here.
            // It is set once by the import and all aging depends on it holding.

            if (!Object.keys(values).length) { alreadyCorrect += 1; return; }

            work.push({ id: inv.id, tranid: inv.tranid, status: cls.status, values: values });
        });

        log.audit({
            title: SCRIPT_NAME + ': sweep planned',
            details: 'asOf=' + asOfStr +
                     ' from=' + (from ? nsDateString(from) : '(none)') +
                     ' considered=' + invoices.length +
                     ' (already-Approved invoices excluded at source - approval ' +
                     'is terminal) toWrite=' + work.length +
                     ' alreadyCorrect=' + alreadyCorrect +
                     ' notTimesheet=' + skippedNotTimesheet +
                     ' unapprovedIds=' + Object.keys(unapprovedIds).length
        });

        return work;
    }

    function map(context) {
        const item = JSON.parse(context.value);
        try {
            record.submitFields({
                type: record.Type.INVOICE,
                id: item.id,
                values: item.values,
                options: { enableSourcing: false, ignoreMandatoryFields: true }
            });
            context.write({ key: item.status, value: item.tranid });
        } catch (e) {
            const msg = String(e.message || '');
            // A closed or A/R-locked period is expected, not a defect. It gets
            // its own bucket so it never drowns a real failure in the log.
            const isPeriod = /period/i.test(msg) &&
                             /clos|lock/i.test(msg);
            if (isPeriod) {
                log.audit({
                    title: SCRIPT_NAME + ': skipped ' + item.tranid + ' - closed period',
                    details: msg
                });
                context.write({ key: 'SKIPPED_CLOSED_PERIOD', value: item.tranid });
            } else {
                log.error({
                    title: SCRIPT_NAME + ': failed to stamp ' + item.tranid +
                           ' (' + item.id + ')',
                    details: msg
                });
                context.write({ key: 'ERROR', value: item.tranid + ': ' + msg });
            }
        }
    }

    function reduce(context) {
        context.write({ key: context.key, value: context.values.length });
    }

    function summarize(summary) {
        const counts = {};
        summary.output.iterator().each(function (key, value) {
            counts[key] = value;
            return true;
        });

        let errors = 0;
        summary.mapSummary.errors.iterator().each(function (key, error) {
            errors += 1;
            log.error({ title: SCRIPT_NAME + ': map error on ' + key, details: error });
            return true;
        });

        log.audit({
            title: SCRIPT_NAME + ': sweep complete',
            details: 'stamped=' + JSON.stringify(counts) +
                     ' unrecoverableErrors=' + errors +
                     ' seconds=' + summary.seconds +
                     ' usage=' + summary.usage
        });
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});
