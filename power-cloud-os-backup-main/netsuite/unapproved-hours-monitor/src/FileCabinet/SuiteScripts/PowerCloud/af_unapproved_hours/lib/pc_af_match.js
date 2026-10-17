/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: matching and diff rules
 * @author Power Cloud Consulting
 *
 * Pure decision logic with no N/ dependencies. Everything here is a function of
 * its arguments so the whole diff can be exercised against a fixture before it
 * is ever allowed near a real invoice.
 *
 * The AF report is a NEGATIVE list - it states what is unapproved and says
 * nothing about what is approved. AF exposes no filters, so we cannot get the
 * positive list. Absence from the report is therefore treated as approval, but
 * only ever as of a specific report date. See STALE_AFTER_DAYS.
 */
define([], function () {
    'use strict';

    /**
     * A timesheet not yet matched to an invoice is only suspicious once it has
     * had time to be invoiced. The most recent period on any given report is
     * routinely uninvoiced - on the 2026-09-01 sample that was 7 of 16 rows,
     * all correct. Below this age, unmatched is informational.
     */
    const GRACE_DAYS = 10;

    /**
     * A status older than this cannot be trusted. Absence from a three-week-old
     * report is not evidence of current approval, it is evidence that nobody
     * ran the import. Surfaces as "Stale" rather than "Approved".
     */
    const STALE_AFTER_DAYS = 10;

    /** Money is equal if it agrees to the cent. */
    const MONEY_TOLERANCE = 0.005;

    const MATCH = {
        MATCHED: 'MATCHED',
        NOT_YET_INVOICED: 'NOT_YET_INVOICED',
        UNMATCHED: 'UNMATCHED',
        AMBIGUOUS: 'AMBIGUOUS'
    };

    const STATUS = {
        UNAPPROVED: 'UNAPPROVED',
        APPROVED: 'APPROVED',
        AWAITING: 'AWAITING'
    };

    /**
     * AF timesheet ids are seven digits. Matching exactly seven, rather than
     * "any long number", keeps the year out of "Harvest Hope MSP September 2026
     * 2546644" and keeps a stray account number from being read as an id.
     *
     * If AF ever moves to eight digits this stops classifying and invoices go
     * blank - a visible failure, which is the right way for this to break
     * rather than silently stamping the wrong status.
     */
    const AF_ID_PATTERN = /^\d{7}$/;

    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    /**
     * Whole days between two dates, ignoring time of day.
     *
     * @param {Date} from
     * @param {Date} to
     * @returns {number|null}
     */
    function daysBetween(from, to) {
        if (!from || !to) { return null; }
        const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
        const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
        return Math.round((b - a) / MS_PER_DAY);
    }

    /**
     * Pulls every run of digits out of a PO number.
     *
     * Our PO numbers are free text - "Tepperman 2545756", "Harvest Hope MSP
     * September 2026 2546644". We match on whole digit tokens rather than a
     * raw substring so that AF id 2545754 cannot match a PO containing
     * 12545754 or 25457549.
     *
     * @param {string} otherrefnum
     * @returns {Array<string>}
     */
    function extractIdTokens(otherrefnum) {
        const t = String(otherrefnum == null ? '' : otherrefnum);
        return t.match(/\d+/g) || [];
    }

    /**
     * True when this PO number carries this AF timesheet id as a whole token.
     *
     * @param {string} otherrefnum
     * @param {string} afId
     * @returns {boolean}
     */
    function matchesAfId(otherrefnum, afId) {
        if (!afId) { return false; }
        return extractIdTokens(otherrefnum).indexOf(String(afId)) !== -1;
    }

    /**
     * Confirms candidate invoices from a SuiteQL LIKE prefilter.
     *
     * The LIKE narrows the candidate set cheaply; this rejects the false
     * positives a substring search lets through. Two stages, on purpose.
     *
     * @param {Array<Object>} candidates - invoices with an otherrefnum property
     * @param {string} afId
     * @returns {Array<Object>}
     */
    function confirmCandidates(candidates, afId) {
        return (candidates || []).filter(function (inv) {
            return matchesAfId(inv.otherrefnum, afId);
        });
    }

    /**
     * Decides how one report row relates to our invoices.
     *
     * @param {Object} row - a parsed report row
     * @param {Array<Object>} candidates - possible invoices for this row
     * @param {Date} asOf - the report date
     * @returns {Object} classification
     */
    function classifyRow(row, candidates, asOf) {
        const confirmed = confirmCandidates(candidates, row.afId);
        const result = {
            afId: row.afId,
            matchStatus: null,
            invoice: null,
            variance: null,
            ageDays: daysBetween(row.periodEnding, asOf),
            isException: false,
            reason: null
        };

        if (confirmed.length > 1) {
            result.matchStatus = MATCH.AMBIGUOUS;
            result.isException = true;
            result.reason = 'AF id ' + row.afId + ' appears on ' + confirmed.length +
                            ' invoices: ' + confirmed.map(function (i) {
                                return i.tranid;
                            }).join(', ') + '. One of them has the wrong PO number.';
            return result;
        }

        if (confirmed.length === 0) {
            const age = result.ageDays;
            if (age !== null && age <= GRACE_DAYS) {
                result.matchStatus = MATCH.NOT_YET_INVOICED;
                result.reason = 'Period ended ' + age + ' day(s) before this report. ' +
                                'Not invoiced yet - expected, not a problem.';
            } else {
                result.matchStatus = MATCH.UNMATCHED;
                result.isException = true;
                result.reason = age === null
                    ? 'No period ending on the row, so age cannot be judged.'
                    : 'Period ended ' + age + ' days ago with no matching invoice. ' +
                      'Either it was never invoiced or the PO number is wrong.';
            }
            return result;
        }

        const inv = confirmed[0];
        result.matchStatus = MATCH.MATCHED;
        result.invoice = inv;

        if (typeof row.pay === 'number' && typeof inv.total === 'number') {
            const diff = row.pay - inv.total;
            result.variance = Math.round(diff * 100) / 100;
            if (Math.abs(diff) > MONEY_TOLERANCE) {
                result.isException = true;
                result.reason = 'AF says ' + row.pay.toFixed(2) + ' but ' + inv.tranid +
                                ' is ' + inv.total.toFixed(2) + ' (difference ' +
                                result.variance.toFixed(2) + ').';
            }
        }
        return result;
    }

    /**
     * Builds the full preview of what an import would change, without changing
     * anything. This is what the reviewer confirms before a single write.
     *
     * @param {Object} params
     * @param {Array<Object>} params.rows - parsed report rows
     * @param {Array<Object>} params.existing - existing timesheet records
     * @param {Object} params.candidatesByAfId - afId -> array of candidate invoices
     * @param {Date} params.asOf - the report date
     * @returns {Object} the preview
     */
    function buildDiff(params) {
        const rows = params.rows || [];
        const existing = params.existing || [];
        const candidatesByAfId = params.candidatesByAfId || {};
        const asOf = params.asOf;

        const existingByAfId = {};
        existing.forEach(function (e) { existingByAfId[String(e.afId)] = e; });

        const inReport = {};
        const newlyUnapproved = [];
        const stillUnapproved = [];
        const notYetInvoiced = [];
        const exceptions = [];
        const matched = [];

        rows.forEach(function (row) {
            inReport[row.afId] = true;
            const prior = existingByAfId[row.afId] || null;
            const cls = classifyRow(row, candidatesByAfId[row.afId], asOf);

            const entry = {
                // Lifted to the top level because consumers read entry.afId
                // directly - the invoice stamp, the error messages and both
                // preview tables. Leaving it only on entry.row silently wrote
                // undefined to custbody_pc_af_ts_id on the first live run.
                afId: row.afId,
                row: row,
                classification: cls,
                prior: prior,
                isNew: !prior,
                // First seen is set once and never moved. All aging hangs off it.
                firstSeen: prior && prior.firstSeen ? prior.firstSeen : asOf,
                lastSeen: asOf,
                status: STATUS.UNAPPROVED
            };
            entry.daysUnapproved = daysBetween(entry.firstSeen, asOf);

            if (entry.isNew) { newlyUnapproved.push(entry); } else { stillUnapproved.push(entry); }
            if (cls.matchStatus === MATCH.MATCHED) { matched.push(entry); }
            if (cls.matchStatus === MATCH.NOT_YET_INVOICED) { notYetInvoiced.push(entry); }
            if (cls.isException) { exceptions.push(entry); }
        });

        // The inferred half of the negative list: previously unapproved, absent
        // from this report, therefore approved as of this report's date.
        const flippedToApproved = existing.filter(function (e) {
            return e.status === STATUS.UNAPPROVED && !inReport[String(e.afId)];
        }).map(function (e) {
            return {
                prior: e,
                afId: e.afId,
                status: STATUS.APPROVED,
                approvedOn: asOf,
                lastSeen: e.lastSeen || null,
                daysUnapproved: daysBetween(e.firstSeen, asOf),
                inferred: true
            };
        });

        return {
            asOf: asOf,
            counts: {
                rowsInFile: rows.length,
                // Counted, not inferred by subtraction. A matched row with a pay
                // variance is still matched - it is both matched and an exception.
                matched: matched.length,
                newlyUnapproved: newlyUnapproved.length,
                stillUnapproved: stillUnapproved.length,
                flippedToApproved: flippedToApproved.length,
                notYetInvoiced: notYetInvoiced.length,
                exceptions: exceptions.length
            },
            matched: matched,
            newlyUnapproved: newlyUnapproved,
            stillUnapproved: stillUnapproved,
            flippedToApproved: flippedToApproved,
            notYetInvoiced: notYetInvoiced,
            exceptions: exceptions
        };
    }

    /**
     * The AF timesheet id carried by a PO number, or null if it carries none.
     *
     * Takes the LAST seven-digit token, matching the observed convention of
     * "<label> <id>". A PO with no seven-digit token is not a timesheet
     * invoice - roughly 2,000 of the AF invoices in this account are rev share,
     * balance transfers and MSP fees, and they are deliberately left alone.
     *
     * @param {string} otherrefnum
     * @returns {string|null}
     */
    function extractAfId(otherrefnum) {
        const tokens = extractIdTokens(otherrefnum).filter(function (t) {
            return AF_ID_PATTERN.test(t);
        });
        return tokens.length ? tokens[tokens.length - 1] : null;
    }

    /**
     * Decides the AF status of ONE INVOICE, working from the invoice population
     * rather than from the report.
     *
     * This is the half the report cannot tell us. Hours approved promptly never
     * appear on an unapproved report at all, so an approach that only learns
     * from report rows leaves those invoices blank forever. Here the invoice
     * population is the universe and the report is only a filter over it.
     *
     * @param {Object} params
     * @param {string} params.otherrefnum - the invoice PO number
     * @param {Date} params.invoiceDate
     * @param {Object} params.unapprovedIds - set-like, afId -> truthy
     * @param {Date} params.asOf - date of the report this judgement rests on
     * @param {number} [params.graceDays] - defaults to GRACE_DAYS
     * @returns {Object} { afId, status, reason } - status null when not a
     *                   timesheet invoice
     */
    function classifyInvoice(params) {
        const afId = extractAfId(params.otherrefnum);
        if (!afId) {
            return {
                afId: null,
                status: null,
                reason: 'No seven-digit AF timesheet id in the PO number. Not a ' +
                        'timesheet invoice - left alone.'
            };
        }

        if (params.unapprovedIds && params.unapprovedIds[afId]) {
            return {
                afId: afId,
                status: STATUS.UNAPPROVED,
                reason: 'On the report dated ' + fmt(params.asOf) + '.'
            };
        }

        const grace = params.graceDays === undefined ? GRACE_DAYS : params.graceDays;
        const age = daysBetween(params.invoiceDate, params.asOf);

        if (age === null) {
            return {
                afId: afId,
                status: null,
                reason: 'Invoice has no date, so its age cannot be judged.'
            };
        }

        if (age >= grace) {
            return {
                afId: afId,
                status: STATUS.APPROVED,
                reason: 'Absent from the report dated ' + fmt(params.asOf) +
                        ' and invoiced ' + age + ' days before it. Approval is ' +
                        'inferred from that absence - AF never states it.'
            };
        }

        return {
            afId: afId,
            status: STATUS.AWAITING,
            reason: 'Invoiced only ' + age + ' day(s) before the report dated ' +
                    fmt(params.asOf) + '. Awaiting status - too new for absence ' +
                    'to mean anything yet.'
        };
    }

    function fmt(d) {
        if (!d) { return '(no date)'; }
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    /**
     * Whether a stored status is too old to be believed.
     *
     * @param {Date} asOfDate - the status's as-of date
     * @param {Date} today
     * @returns {boolean}
     */
    function isStale(asOfDate, today) {
        if (!asOfDate) { return true; }
        const age = daysBetween(asOfDate, today);
        return age === null || age > STALE_AFTER_DAYS;
    }

    return {
        GRACE_DAYS: GRACE_DAYS,
        STALE_AFTER_DAYS: STALE_AFTER_DAYS,
        MATCH: MATCH,
        STATUS: STATUS,
        daysBetween: daysBetween,
        extractIdTokens: extractIdTokens,
        extractAfId: extractAfId,
        matchesAfId: matchesAfId,
        classifyInvoice: classifyInvoice,
        confirmCandidates: confirmCandidates,
        classifyRow: classifyRow,
        buildDiff: buildDiff,
        isStale: isStale
    };
});
