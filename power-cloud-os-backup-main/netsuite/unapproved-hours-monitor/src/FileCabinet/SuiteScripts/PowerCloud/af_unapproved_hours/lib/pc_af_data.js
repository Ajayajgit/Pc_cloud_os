/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: NetSuite reads and writes
 * @author Power Cloud Consulting
 *
 * All NetSuite I/O for the feature. The decision logic lives in pc_af_match,
 * which knows nothing about NetSuite; this module only fetches what that logic
 * needs and then applies what it decided.
 */
define([
    'N/query', 'N/search', 'N/record', 'N/runtime', 'N/log',
    './pc_af_config', './pc_af_match'
], function (query, search, record, runtime, log, cfg, matcher) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_AFData';

    /** Ids per SuiteQL statement. Keeps the generated OR-chain sane. */
    const ID_CHUNK = 40;

    /** Refuse to start an apply without at least this much governance left. */
    const MIN_UNITS_TO_START = 150;

    /** Units to keep in reserve so the run can always write its log record. */
    const UNITS_RESERVE = 60;

    function chunk(arr, size) {
        const out = [];
        for (let i = 0; i < arr.length; i += size) { out.push(arr.slice(i, i + size)); }
        return out;
    }

    /**
     * Finds invoices whose PO number might carry any of these AF timesheet ids.
     *
     * This is a PREFILTER only. LIKE '%2545756%' also matches "12545756", so
     * every candidate must still go through matcher.confirmCandidates, which
     * compares whole digit tokens. Do not treat this result as a match.
     *
     * Scoped to the Anderson Frank customer and to non-voided invoices.
     *
     * @param {Array<string>} afIds
     * @returns {Object} afId -> array of candidate invoices
     */
    function findCandidateInvoices(afIds) {
        const byAfId = {};
        afIds.forEach(function (id) { byAfId[id] = []; });
        if (!afIds.length) { return byAfId; }

        const seen = {};
        chunk(afIds, ID_CHUNK).forEach(function (ids) {
            const where = ids.map(function () { return 't.otherrefnum LIKE ?'; }).join(' OR ');
            const params = ids.map(function (id) { return '%' + id + '%'; });
            const sql =
                'SELECT t.id, t.tranid, t.trandate, t.otherrefnum, t.foreigntotal, t.job ' +
                'FROM transaction t ' +
                "WHERE t.type = 'CustInvc' " +
                "  AND t.voided = 'F' " +
                '  AND t.entity = ' + cfg.AF_CUSTOMER_ID + ' ' +
                '  AND (' + where + ')';

            const results = query.runSuiteQL({ query: sql, params: params }).asMappedResults();
            results.forEach(function (r) {
                if (seen[r.id]) { return; }
                seen[r.id] = true;
                const inv = {
                    id: r.id,
                    tranid: r.tranid,
                    trandate: r.trandate,
                    otherrefnum: r.otherrefnum,
                    total: r.foreigntotal === null ? null : Number(r.foreigntotal),
                    jobId: r.job || null
                };
                // Attach to every id it genuinely carries as a whole token.
                afIds.forEach(function (afId) {
                    if (matcher.matchesAfId(inv.otherrefnum, afId)) {
                        byAfId[afId].push(inv);
                    }
                });
            });
        });
        return byAfId;
    }

    /**
     * Reads timesheet records into the plain shape matcher.buildDiff expects.
     *
     * @param {Object} filters - search filters to apply
     * @returns {Array<Object>}
     */
    function searchTimesheets(filters) {
        const out = [];
        const statusValues = cfg.getListValues(cfg.LIST.TS_STATUS);
        const idToText = {};
        Object.keys(statusValues).forEach(function (text) {
            idToText[statusValues[text]] = text;
        });

        const s = search.create({
            type: cfg.REC.TIMESHEET,
            filters: filters || [],
            columns: [
                'internalid', 'name',
                cfg.TS.STATUS, cfg.TS.FIRST_SEEN, cfg.TS.LAST_SEEN,
                cfg.TS.INVOICE, cfg.TS.PERIOD_END, cfg.TS.PAY,
                cfg.TS.CLIENT, cfg.TS.NUDGE_COUNT
            ]
        });

        let count = 0;
        s.run().each(function (r) {
            count += 1;
            const statusId = r.getValue(cfg.TS.STATUS);
            const statusText = idToText[statusId] || null;
            out.push({
                recordId: r.getValue('internalid'),
                afId: r.getValue('name'),
                status: statusText === cfg.STATUS_TEXT.APPROVED
                    ? matcher.STATUS.APPROVED
                    : matcher.STATUS.UNAPPROVED,
                firstSeen: parseNsDate(r.getValue(cfg.TS.FIRST_SEEN)),
                lastSeen: parseNsDate(r.getValue(cfg.TS.LAST_SEEN)),
                periodEnding: parseNsDate(r.getValue(cfg.TS.PERIOD_END)),
                invoiceId: r.getValue(cfg.TS.INVOICE) || null,
                client: r.getValue(cfg.TS.CLIENT),
                pay: r.getValue(cfg.TS.PAY) === '' ? null : Number(r.getValue(cfg.TS.PAY)),
                nudgeCount: Number(r.getValue(cfg.TS.NUDGE_COUNT) || 0)
            });
            return count < 4000;
        });

        if (count >= 4000) {
            log.error({
                title: SCRIPT_NAME + ': timesheet search hit the 4000 row ceiling',
                details: 'The diff may be incomplete. Move this read to runPaged.'
            });
        }
        return out;
    }

    /** NetSuite search returns dates as MM/DD/YYYY strings. */
    function parseNsDate(v) {
        if (!v) { return null; }
        const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(v).trim());
        if (!m) { return null; }
        return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
    }

    /**
     * Loads everything buildDiff needs to see.
     *
     * The union matters: rows in the file (so they are updated rather than
     * duplicated) PLUS every record still marked unapproved (so records that
     * have dropped off the report can be inferred approved). Loading only the
     * file's ids would make the flip step silently do nothing.
     *
     * @param {Array<string>} afIds - ids present in the file being imported
     * @returns {Array<Object>}
     */
    function loadExistingForDiff(afIds) {
        const unapprovedId = cfg.getListValueId(cfg.LIST.TS_STATUS, cfg.STATUS_TEXT.UNAPPROVED);
        const byAfId = {};

        searchTimesheets([[cfg.TS.STATUS, 'anyof', unapprovedId]]).forEach(function (r) {
            byAfId[r.afId] = r;
        });

        chunk(afIds, ID_CHUNK).forEach(function (ids) {
            const filters = [];
            ids.forEach(function (id, i) {
                if (i > 0) { filters.push('OR'); }
                filters.push(['name', 'is', id]);
            });
            searchTimesheets([filters]).forEach(function (r) {
                byAfId[r.afId] = r;
            });
        });

        return Object.keys(byAfId).map(function (k) { return byAfId[k]; });
    }

    /**
     * Reads the AF contact off the projects behind a set of invoices.
     * The invoice customer is always Anderson Frank, so the person to chase is
     * only reachable through the project.
     *
     * @param {Array<number>} projectIds
     * @returns {Object} projectId -> { name, contact, email }
     */
    function getProjectContacts(projectIds) {
        const out = {};
        const ids = projectIds.filter(function (v) { return !!v; });
        if (!ids.length) { return out; }

        chunk(ids, ID_CHUNK).forEach(function (batch) {
            const sql =
                'SELECT j.id, j.companyname, j.custentity_proj_af_contact AS contact, ' +
                '       j.custentity_proj_af_contact_email AS email ' +
                'FROM job j WHERE j.id IN (' + batch.join(',') + ')';
            query.runSuiteQL({ query: sql }).asMappedResults().forEach(function (r) {
                out[r.id] = {
                    name: r.companyname,
                    contact: r.contact ? String(r.contact).trim() : null,
                    email: r.email ? String(r.email).trim() : null
                };
            });
        });
        return out;
    }

    /**
     * Creates the import log that every status written this run points back to.
     *
     * @param {Object} params
     * @returns {number} record id
     */
    function createImportLog(params) {
        const rec = record.create({ type: cfg.REC.IMPORT_LOG, isDynamic: false });
        rec.setValue({ fieldId: cfg.IL.ASOF, value: params.asOf });
        rec.setValue({ fieldId: cfg.IL.ROWS, value: params.counts.rowsInFile });
        rec.setValue({ fieldId: cfg.IL.MATCHED, value: params.counts.matched });
        rec.setValue({ fieldId: cfg.IL.NEW, value: params.counts.newlyUnapproved });
        rec.setValue({ fieldId: cfg.IL.FLIPPED, value: params.counts.flippedToApproved });
        rec.setValue({ fieldId: cfg.IL.NOTINV, value: params.counts.notYetInvoiced });
        rec.setValue({ fieldId: cfg.IL.EXCEPT, value: params.counts.exceptions });
        rec.setValue({ fieldId: cfg.IL.USER, value: runtime.getCurrentUser().id });

        // The source-file pointer is an audit convenience, not part of the
        // result. It is set defensively because on the apply step the id
        // arrives as a string from a request parameter, and because a bad file
        // reference must never be able to abort an otherwise good import -
        // which is exactly what happened on the first live run.
        if (params.fileId) {
            const fileId = Number(params.fileId);
            if (isFinite(fileId) && fileId > 0) {
                try {
                    rec.setValue({ fieldId: cfg.IL.FILE, value: fileId });
                } catch (e) {
                    log.error({
                        title: SCRIPT_NAME + ': could not link source file ' + fileId,
                        details: e.message + ' - continuing without the link.'
                    });
                }
            }
        }
        if (params.notes) {
            rec.setValue({ fieldId: cfg.IL.NOTES, value: String(params.notes).slice(0, 100000) });
        }

        try {
            return rec.save();
        } catch (e) {
            // An invalid field value surfaces here, at save, not at setValue.
            // Drop the optional file link and try once more rather than losing
            // the whole import over an audit pointer.
            if (params.fileId) {
                log.error({
                    title: SCRIPT_NAME + ': import log save failed, retrying without ' +
                           'the source file link',
                    details: e.message
                });
                rec.setValue({ fieldId: cfg.IL.FILE, value: '' });
                return rec.save();
            }
            throw e;
        }
    }

    /**
     * Writes one timesheet entry from the diff.
     *
     * @param {Object} entry
     * @param {Object} ctx - { asOf, importLogId, statusIds, matchIds, contacts }
     * @returns {number} record id
     */
    function writeTimesheet(entry, ctx) {
        const row = entry.row;
        const cls = entry.classification;
        const isNew = entry.isNew;

        const rec = isNew
            ? record.create({ type: cfg.REC.TIMESHEET, isDynamic: false })
            : record.load({ type: cfg.REC.TIMESHEET, id: entry.prior.recordId, isDynamic: false });

        if (isNew) {
            rec.setValue({ fieldId: cfg.TS.NAME, value: row.afId });
            // Set once. Never touched again - all aging depends on it holding still.
            rec.setValue({ fieldId: cfg.TS.FIRST_SEEN, value: entry.firstSeen });
        }

        rec.setValue({ fieldId: cfg.TS.CONTRACTOR, value: row.contractor });
        rec.setValue({ fieldId: cfg.TS.CLIENT, value: row.client });
        rec.setValue({ fieldId: cfg.TS.PLACEMENT, value: row.placement });
        rec.setValue({ fieldId: cfg.TS.PLACE_START, value: row.placementStart });
        rec.setValue({ fieldId: cfg.TS.PLACE_END, value: row.placementEnd });
        rec.setValue({ fieldId: cfg.TS.PERIOD_END, value: row.periodEnding });
        rec.setValue({ fieldId: cfg.TS.AF_STATUS, value: row.afStatus });
        rec.setValue({ fieldId: cfg.TS.HOURS, value: row.hours });
        rec.setValue({ fieldId: cfg.TS.PAY, value: row.pay });
        rec.setValue({ fieldId: cfg.TS.PAY_CCY, value: row.payCurrency });

        rec.setValue({ fieldId: cfg.TS.STATUS, value: ctx.statusIds.UNAPPROVED });
        rec.setValue({ fieldId: cfg.TS.MATCH, value: ctx.matchIds[cls.matchStatus] });
        rec.setValue({ fieldId: cfg.TS.LAST_SEEN, value: ctx.asOf });
        rec.setValue({ fieldId: cfg.TS.IMPORT, value: ctx.importLogId });
        rec.setValue({ fieldId: cfg.TS.APPROVED_ON, value: null });

        if (cls.invoice) {
            rec.setValue({ fieldId: cfg.TS.INVOICE, value: cls.invoice.id });
            rec.setValue({ fieldId: cfg.TS.PROJECT, value: cls.invoice.jobId });
            rec.setValue({ fieldId: cfg.TS.VARIANCE, value: cls.variance });
            const contact = ctx.contacts[cls.invoice.jobId];
            if (contact && contact.email) {
                rec.setValue({ fieldId: cfg.TS.CONTACT_EMAIL, value: contact.email });
            }
        } else {
            rec.setValue({ fieldId: cfg.TS.INVOICE, value: null });
            rec.setValue({ fieldId: cfg.TS.VARIANCE, value: null });
        }

        return rec.save();
    }

    /**
     * Marks a record approved because it dropped off the report.
     *
     * @param {Object} flip
     * @param {Object} ctx
     */
    function writeApprovedFlip(flip, ctx) {
        const values = {};
        values[cfg.TS.STATUS] = ctx.statusIds.APPROVED;
        values[cfg.TS.APPROVED_ON] = ctx.asOf;
        values[cfg.TS.IMPORT] = ctx.importLogId;
        record.submitFields({
            type: cfg.REC.TIMESHEET,
            id: flip.prior.recordId,
            values: values,
            options: { enableSourcing: false, ignoreMandatoryFields: true }
        });
    }

    /**
     * Mirrors status onto the invoice so AR Aging and saved searches can filter.
     *
     * @param {number} invoiceId
     * @param {Object} values
     */
    function stampInvoice(invoiceId, values) {
        record.submitFields({
            type: record.Type.INVOICE,
            id: invoiceId,
            values: values,
            options: { enableSourcing: false, ignoreMandatoryFields: true }
        });
    }

    /**
     * Applies a diff. Stops cleanly and reports partial progress rather than
     * dying mid-write if governance runs low.
     *
     * @param {Object} diff - from matcher.buildDiff
     * @param {Object} opts - { fileId, notes }
     * @returns {Object} outcome
     */
    function applyDiff(diff, opts) {
        opts = opts || {};
        const script = runtime.getCurrentScript();

        if (script.getRemainingUsage() < MIN_UNITS_TO_START) {
            throw new Error(SCRIPT_NAME + ': not enough governance left to start ' +
                            'an apply. Re-run the import.');
        }

        const statusValues = cfg.getListValues(cfg.LIST.TS_STATUS);
        const statusIds = {
            UNAPPROVED: statusValues[cfg.STATUS_TEXT.UNAPPROVED],
            APPROVED: statusValues[cfg.STATUS_TEXT.APPROVED]
        };
        const matchValues = cfg.getListValues(cfg.LIST.MATCH_STATUS);
        const matchIds = {};
        Object.keys(cfg.MATCH_TEXT).forEach(function (code) {
            matchIds[code] = matchValues[cfg.MATCH_TEXT[code]];
        });

        const projectIds = [];
        diff.matched.forEach(function (e) {
            if (e.classification.invoice && e.classification.invoice.jobId) {
                projectIds.push(e.classification.invoice.jobId);
            }
        });

        const importLogId = createImportLog({
            asOf: diff.asOf,
            counts: diff.counts,
            fileId: opts.fileId,
            notes: opts.notes
        });

        const ctx = {
            asOf: diff.asOf,
            importLogId: importLogId,
            statusIds: statusIds,
            matchIds: matchIds,
            contacts: getProjectContacts(projectIds)
        };

        const outcome = {
            importLogId: importLogId,
            timesheetsWritten: 0,
            flipsWritten: 0,
            invoicesStamped: 0,
            stoppedEarly: false,
            errors: []
        };

        const entries = diff.newlyUnapproved.concat(diff.stillUnapproved);

        for (let i = 0; i < entries.length; i += 1) {
            if (script.getRemainingUsage() < UNITS_RESERVE) {
                outcome.stoppedEarly = true;
                break;
            }
            const entry = entries[i];
            try {
                writeTimesheet(entry, ctx);
                outcome.timesheetsWritten += 1;

                const inv = entry.classification.invoice;
                if (inv) {
                    const values = {};
                    // Guarded: writing undefined here would blank the field
                    // rather than fail, which is how this went unnoticed once.
                    const afId = entry.afId || (entry.row && entry.row.afId);
                    if (afId) { values[cfg.INV.TS_ID] = afId; }

                    // Status and its as-of date move together, and only when the
                    // status actually changes. A row that was already unapproved
                    // last week has not changed; rewriting it every week would
                    // add a system note to say nothing happened.
                    const wasUnapproved = entry.prior &&
                        entry.prior.status === matcher.STATUS.UNAPPROVED;
                    if (!wasUnapproved) {
                        values[cfg.INV.TS_STATUS] = statusIds.UNAPPROVED;
                        values[cfg.INV.STATUS_ASOF] = diff.asOf;
                        values[cfg.INV.FIRST_UNAPPR] = entry.firstSeen;
                    }

                    if (Object.keys(values).length) {
                        stampInvoice(inv.id, values);
                        outcome.invoicesStamped += 1;
                    }
                }
            } catch (e) {
                outcome.errors.push('AF ' + entry.afId + ': ' + e.message);
                log.error({ title: SCRIPT_NAME + ': write failed for AF ' + entry.afId,
                            details: e.message });
            }
        }

        for (let j = 0; j < diff.flippedToApproved.length; j += 1) {
            if (script.getRemainingUsage() < UNITS_RESERVE) {
                outcome.stoppedEarly = true;
                break;
            }
            const flip = diff.flippedToApproved[j];
            try {
                writeApprovedFlip(flip, ctx);
                outcome.flipsWritten += 1;
                if (flip.prior.invoiceId) {
                    const v = {};
                    v[cfg.INV.TS_STATUS] = statusIds.APPROVED;
                    v[cfg.INV.STATUS_ASOF] = diff.asOf;
                    stampInvoice(flip.prior.invoiceId, v);
                    outcome.invoicesStamped += 1;
                }
            } catch (e) {
                outcome.errors.push('AF ' + flip.afId + ' (approve): ' + e.message);
                log.error({ title: SCRIPT_NAME + ': flip failed for AF ' + flip.afId,
                            details: e.message });
            }
        }

        return outcome;
    }

    /**
     * Everything the Friday review screen needs: unapproved timesheets, aged,
     * with the AF contact resolved through the invoice's project.
     *
     * Snoozed rows are excluded. Snooze exists so that "rep is on PTO" or
     * "client is mid-close" has an answer other than send-or-ignore - and
     * ignoring is what teaches people to stop reading.
     *
     * @param {Date} today
     * @returns {Array<Object>}
     */
    function loadUnapprovedForReview(today) {
        const unapprovedId = cfg.getListValueId(cfg.LIST.TS_STATUS, cfg.STATUS_TEXT.UNAPPROVED);
        const rows = [];

        search.create({
            type: cfg.REC.TIMESHEET,
            filters: [[cfg.TS.STATUS, 'anyof', unapprovedId]],
            columns: [
                'internalid', 'name', cfg.TS.CLIENT, cfg.TS.PERIOD_END,
                cfg.TS.HOURS, cfg.TS.PAY, cfg.TS.FIRST_SEEN, cfg.TS.PROJECT,
                cfg.TS.INVOICE, cfg.TS.NUDGE_COUNT, cfg.TS.LAST_NUDGED,
                cfg.TS.SNOOZED_UNTIL, cfg.TS.NUDGE_LOG
            ]
        }).run().each(function (r) {
            const snoozed = parseNsDate(r.getValue(cfg.TS.SNOOZED_UNTIL));
            if (snoozed && matcher.daysBetween(today, snoozed) > 0) { return true; }
            const firstSeen = parseNsDate(r.getValue(cfg.TS.FIRST_SEEN));
            rows.push({
                recordId: r.getValue('internalid'),
                afId: r.getValue('name'),
                client: r.getValue(cfg.TS.CLIENT),
                periodEnding: parseNsDate(r.getValue(cfg.TS.PERIOD_END)),
                hours: Number(r.getValue(cfg.TS.HOURS) || 0),
                pay: Number(r.getValue(cfg.TS.PAY) || 0),
                firstSeen: firstSeen,
                daysUnapproved: matcher.daysBetween(firstSeen, today) || 0,
                projectId: r.getValue(cfg.TS.PROJECT) || null,
                invoiceId: r.getValue(cfg.TS.INVOICE) || null,
                nudgeCount: Number(r.getValue(cfg.TS.NUDGE_COUNT) || 0),
                lastNudged: parseNsDate(r.getValue(cfg.TS.LAST_NUDGED)),
                nudgeLog: r.getValue(cfg.TS.NUDGE_LOG) || '',
                contactName: null,
                contactEmail: null
            });
            return true;
        });

        const contacts = getProjectContacts(rows.map(function (r) { return r.projectId; }));
        rows.forEach(function (r) {
            const c = r.projectId ? contacts[r.projectId] : null;
            if (c) {
                r.contactName = c.contact;
                r.contactEmail = c.email;
                r.projectName = c.name;
            }
        });
        return rows;
    }

    /**
     * Records that a nudge actually went out.
     *
     * This is what lets next week's draft know what was already said. Without
     * it every draft is a first nudge forever and Steve ends up sending "just
     * following up" about something that appeared yesterday.
     *
     * @param {Array<Object>} timesheets - rows from loadUnapprovedForReview
     * @param {Object} params - { when, subject, userId }
     * @returns {number} rows updated
     */
    function recordNudge(timesheets, params) {
        let n = 0;
        const stamp = nsDateString(params.when);
        (timesheets || []).forEach(function (t) {
            try {
                const entry = stamp + ' - nudge #' + (t.nudgeCount + 1) + ' - ' +
                              (params.subject || '(no subject)');
                const log = (t.nudgeLog ? t.nudgeLog + '\n' : '') + entry;
                const values = {};
                values[cfg.TS.NUDGE_COUNT] = t.nudgeCount + 1;
                values[cfg.TS.LAST_NUDGED] = params.when;
                values[cfg.TS.NUDGED_BY] = params.userId;
                values[cfg.TS.NUDGE_LOG] = log.slice(-100000);
                if (t.contactEmail) { values[cfg.TS.CONTACT_EMAIL] = t.contactEmail; }
                record.submitFields({
                    type: cfg.REC.TIMESHEET,
                    id: t.recordId,
                    values: values,
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                n += 1;
            } catch (e) {
                log.error({
                    title: SCRIPT_NAME + ': could not record nudge for AF ' + t.afId,
                    details: e.message
                });
            }
        });
        return n;
    }

    /**
     * Suppresses rows from the review screen until a date.
     *
     * @param {Array<Object>} timesheets
     * @param {Date} until
     * @returns {number} rows updated
     */
    function snooze(timesheets, until) {
        let n = 0;
        (timesheets || []).forEach(function (t) {
            try {
                const values = {};
                values[cfg.TS.SNOOZED_UNTIL] = until;
                record.submitFields({
                    type: cfg.REC.TIMESHEET,
                    id: t.recordId,
                    values: values,
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                n += 1;
            } catch (e) {
                log.error({
                    title: SCRIPT_NAME + ': could not snooze AF ' + t.afId,
                    details: e.message
                });
            }
        });
        return n;
    }

    /** NetSuite wants MM/DD/YYYY strings in a few places. */
    function nsDateString(d) {
        if (!d) { return ''; }
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    /**
     * Active AF projects with no contact email - the worklist blocking every
     * nudge. Independent of whether anything is currently unapproved.
     *
     * @returns {Array<Object>}
     */
    function findProjectsMissingContact() {
        const sql =
            'SELECT j.id, j.companyname, j.custentity_proj_af_contact AS contact, ' +
            '       j.custentity_proj_af_contact_email AS email ' +
            'FROM job j WHERE j.id IN (' +
            '  SELECT t.job FROM transaction t ' +
            "  WHERE t.type = 'CustInvc' AND t.entity = " + cfg.AF_CUSTOMER_ID +
            '    AND t.job IS NOT NULL' +
            "    AND t.trandate >= TO_DATE(?, 'MM/DD/YYYY')" +
            ') AND (j.custentity_proj_af_contact_email IS NULL ' +
            "     OR j.custentity_proj_af_contact_email = '') " +
            'ORDER BY j.companyname';
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 1);
        return query.runSuiteQL({
            query: sql, params: [nsDateString(cutoff)]
        }).asMappedResults().map(function (r) {
            return {
                projectId: r.id,
                projectName: r.companyname,
                contact: r.contact ? String(r.contact).trim() : null
            };
        });
    }

    return {
        findCandidateInvoices: findCandidateInvoices,
        loadUnapprovedForReview: loadUnapprovedForReview,
        recordNudge: recordNudge,
        snooze: snooze,
        findProjectsMissingContact: findProjectsMissingContact,
        loadExistingForDiff: loadExistingForDiff,
        getProjectContacts: getProjectContacts,
        searchTimesheets: searchTimesheets,
        createImportLog: createImportLog,
        applyDiff: applyDiff,
        parseNsDate: parseNsDate
    };
});
