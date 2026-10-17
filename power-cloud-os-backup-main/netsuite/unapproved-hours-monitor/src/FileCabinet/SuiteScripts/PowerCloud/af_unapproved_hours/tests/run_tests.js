/**
 * Offline test runner for the AF Unapproved Hours parsing and matching logic.
 * Plain Node, no dependencies:  node tests/run_tests.js
 *
 * The lib modules are AMD (SuiteScript 2.1) but carry no N/ dependencies, so
 * they load here through a five-line shim. That is the whole point of keeping
 * the decision logic free of NetSuite imports.
 */
'use strict';

const fs = require('fs');
const path = require('path');

function loadAmd(file) {
    const src = fs.readFileSync(file, 'utf8');
    let exported = null;
    // eslint-disable-next-line no-unused-vars
    const define = function (deps, factory) { exported = factory(); };
    // eslint-disable-next-line no-eval
    eval(src);
    return exported;
}

const LIB = path.join(__dirname, '..', 'lib');
const parse = loadAmd(path.join(LIB, 'pc_af_parse.js'));
const match = loadAmd(path.join(LIB, 'pc_af_match.js'));

let passed = 0;
const failures = [];

function check(name, fn) {
    try {
        fn();
        passed += 1;
    } catch (e) {
        failures.push({ name: name, message: e.message });
    }
}

function eq(actual, expected, what) {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) {
        throw new Error((what || 'value') + ': expected ' + b + ' but got ' + a);
    }
}

function ok(cond, what) {
    if (!cond) { throw new Error(what || 'expected truthy'); }
}

const D = function (y, m, d) { return new Date(y, m - 1, d); };

/* ------------------------------------------------------------------ CSV ---*/

check('CSV keeps a quoted comma inside one field', function () {
    const grid = parse.parseCsv('a,b\n1,"Hyham, Steve"\n');
    eq(grid[1], ['1', 'Hyham, Steve'], 'row');
});

check('CSV handles doubled quotes and embedded newlines', function () {
    const grid = parse.parseCsv('a\n"say ""hi""\nagain"\n');
    eq(grid[1], ['say "hi"\nagain'], 'row');
});

check('CSV strips the Excel UTF-8 BOM from the first header', function () {
    const grid = parse.parseCsv('﻿id,Client\n1,AbSci\n');
    eq(grid[0][0], 'id', 'first header');
});

check('CSV treats CRLF as a single row terminator', function () {
    const grid = parse.parseCsv('a,b\r\n1,2\r\n');
    eq(grid.length, 2, 'row count');
});

/* ---------------------------------------------------------------- values ---*/

check('Hours HH:MM:SS becomes decimal', function () {
    eq(parse.parseHours('14:30:00').value, 14.5, '14:30:00');
    eq(parse.parseHours('3:00:00').value, 3, '3:00:00');
    eq(parse.parseHours('61:30:00').value, 61.5, '61:30:00');
    eq(parse.parseHours('36:45:00').value, 36.75, '36:45:00');
});

check('Hours accepts HH:MM and plain decimals', function () {
    eq(parse.parseHours('14:30').value, 14.5, 'HH:MM');
    eq(parse.parseHours('7.25').value, 7.25, 'decimal');
});

check('Hours reports rather than guesses on junk', function () {
    ok(parse.parseHours('abc').warning, 'should warn');
    eq(parse.parseHours('abc').value, null, 'value');
});

check('AF native DD-MMM-YYYY parses with no warning', function () {
    const r = parse.parseAfDate('29-Aug-2026');
    eq([r.value.getFullYear(), r.value.getMonth(), r.value.getDate()], [2026, 7, 29], 'ymd');
    eq(r.warning, null, 'warning');
});

check('Excel-reformatted M/D/YYYY parses but warns about the assumption', function () {
    const r = parse.parseAfDate('8/29/2026');
    eq([r.value.getFullYear(), r.value.getMonth(), r.value.getDate()], [2026, 7, 29], 'ymd');
    ok(r.warning, 'should warn that US order was assumed');
});

check('Unrecognised date is refused, not guessed', function () {
    eq(parse.parseAfDate('29.08.26').value, null, 'value');
    ok(parse.parseAfDate('29.08.26').warning, 'warning');
});

/* ------------------------------------------------- token matching rules ---*/

check('PO number digit tokens are extracted', function () {
    eq(match.extractIdTokens('Tepperman 2545756'), ['2545756'], 'simple');
    eq(match.extractIdTokens('Harvest Hope MSP September 2026 2546644'),
       ['2026', '2546644'], 'two tokens');
    eq(match.extractIdTokens('Partner Rev Share'), [], 'none');
});

check('Whole-token matching rejects substring false positives', function () {
    ok(match.matchesAfId('Tepperman 2545756', '2545756'), 'exact token should match');
    ok(!match.matchesAfId('Ref 12545756', '2545756'), 'longer number must NOT match');
    ok(!match.matchesAfId('Ref 25457569', '2545756'), 'trailing digit must NOT match');
    ok(!match.matchesAfId('', '2545756'), 'empty PO');
});

check('A LIKE prefilter false positive is discarded at confirmation', function () {
    const candidates = [
        { tranid: 'INV1', otherrefnum: 'Alastin 12545760' },
        { tranid: 'INV2', otherrefnum: 'Alastin 2545760' }
    ];
    const confirmed = match.confirmCandidates(candidates, '2545760');
    eq(confirmed.length, 1, 'count');
    eq(confirmed[0].tranid, 'INV2', 'survivor');
});

/* ------------------------------------------------------ classification ---*/

const ASOF = D(2026, 9, 1);

check('Recent uninvoiced period is informational, not an exception', function () {
    const row = { afId: '2549387', periodEnding: D(2026, 8, 29), pay: 1740 };
    const c = match.classifyRow(row, [], ASOF);
    eq(c.matchStatus, match.MATCH.NOT_YET_INVOICED, 'status');
    eq(c.isException, false, 'must not be an exception');
    eq(c.ageDays, 3, 'age');
});

check('Old uninvoiced period IS an exception', function () {
    const row = { afId: '2400000', periodEnding: D(2026, 6, 30), pay: 500 };
    const c = match.classifyRow(row, [], ASOF);
    eq(c.matchStatus, match.MATCH.UNMATCHED, 'status');
    eq(c.isException, true, 'should be an exception');
});

check('Grace boundary: day 10 informational, day 11 exception', function () {
    const at10 = match.classifyRow({ afId: '1', periodEnding: D(2026, 8, 22), pay: 1 }, [], ASOF);
    const at11 = match.classifyRow({ afId: '2', periodEnding: D(2026, 8, 21), pay: 1 }, [], ASOF);
    eq(at10.ageDays, 10, 'age at boundary');
    eq(at10.matchStatus, match.MATCH.NOT_YET_INVOICED, 'day 10');
    eq(at11.matchStatus, match.MATCH.UNMATCHED, 'day 11');
});

check('Matching amounts produce zero variance and no exception', function () {
    const row = { afId: '2545756', periodEnding: D(2026, 8, 22), pay: 4410 };
    const inv = { tranid: 'INV8923', otherrefnum: 'Tepperman 2545756', total: 4410 };
    const c = match.classifyRow(row, [inv], ASOF);
    eq(c.matchStatus, match.MATCH.MATCHED, 'status');
    eq(c.variance, 0, 'variance');
    eq(c.isException, false, 'exception');
});

check('Pay disagreeing with the invoice is flagged', function () {
    const row = { afId: '2545756', periodEnding: D(2026, 8, 22), pay: 4410 };
    const inv = { tranid: 'INV8923', otherrefnum: 'Tepperman 2545756', total: 4290 };
    const c = match.classifyRow(row, [inv], ASOF);
    eq(c.variance, 120, 'variance');
    eq(c.isException, true, 'exception');
    ok(/INV8923/.test(c.reason), 'reason names the invoice');
});

check('One AF id on two invoices is ambiguous, never silently first-wins', function () {
    const row = { afId: '2545756', periodEnding: D(2026, 8, 22), pay: 4410 };
    const c = match.classifyRow(row, [
        { tranid: 'INV8923', otherrefnum: 'Tepperman 2545756', total: 4410 },
        { tranid: 'INV9999', otherrefnum: 'Dupe 2545756', total: 4410 }
    ], ASOF);
    eq(c.matchStatus, match.MATCH.AMBIGUOUS, 'status');
    eq(c.isException, true, 'exception');
    eq(c.invoice, null, 'must not pick one');
});

/* ------------------------------------ invoice-side (the never-unapproved) --*/

check('AF id is the last seven-digit token, ignoring the year', function () {
    eq(match.extractAfId('Tepperman 2545756'), '2545756', 'simple');
    eq(match.extractAfId('Harvest Hope MSP September 2026 2546644'), '2546644', 'year ignored');
    eq(match.extractAfId('Partner Rev Share'), null, 'no id');
    eq(match.extractAfId('July 2026 Balance Transfer'), null, 'year alone is not an id');
    eq(match.extractAfId('Spinelli hours through 8/31/2026'), null, 'dates are not ids');
});

check('An invoice approved before we ever saw it still gets a status', function () {
    // The gap this whole mechanism exists to close: never on any report.
    const c = match.classifyInvoice({
        otherrefnum: 'Alastin 2543205',
        invoiceDate: D(2026, 8, 16),
        unapprovedIds: {},
        asOf: ASOF
    });
    eq(c.status, match.STATUS.APPROVED, 'status');
    eq(c.afId, '2543205', 'afId');
    ok(/inferred/.test(c.reason), 'reason is honest about being an inference');
});

check('An invoice on the report is unapproved', function () {
    const c = match.classifyInvoice({
        otherrefnum: 'Tepperman 2545756',
        invoiceDate: D(2026, 8, 23),
        unapprovedIds: { '2545756': true },
        asOf: ASOF
    });
    eq(c.status, match.STATUS.UNAPPROVED, 'status');
});

check('An invoice raised just before the report is too recent to judge', function () {
    const c = match.classifyInvoice({
        otherrefnum: 'Alastin 2549388',
        invoiceDate: D(2026, 8, 30),
        unapprovedIds: {},
        asOf: ASOF
    });
    eq(c.status, match.STATUS.AWAITING, 'status');
    ok(/Awaiting status/.test(c.reason), 'reason');
});

check('Grace boundary on the invoice side', function () {
    const base = { otherrefnum: 'X 2545756', unapprovedIds: {}, asOf: ASOF };
    base.invoiceDate = D(2026, 8, 22); // 10 days
    eq(match.classifyInvoice(base).status, match.STATUS.APPROVED, 'day 10 judged');
    base.invoiceDate = D(2026, 8, 23); // 9 days
    eq(match.classifyInvoice(base).status, match.STATUS.AWAITING, 'day 9 not judged');
});

check('Non-timesheet AF invoices are left strictly alone', function () {
    ['Partner Rev Share', 'July 2026 Balance Transfer', ''].forEach(function (po) {
        const c = match.classifyInvoice({
            otherrefnum: po, invoiceDate: D(2025, 1, 1),
            unapprovedIds: {}, asOf: ASOF
        });
        eq(c.status, null, 'status for "' + po + '"');
        eq(c.afId, null, 'afId for "' + po + '"');
    });
});

check('An undated invoice is refused rather than assumed approved', function () {
    const c = match.classifyInvoice({
        otherrefnum: 'X 2545756', invoiceDate: null,
        unapprovedIds: {}, asOf: ASOF
    });
    eq(c.status, null, 'status');
});

/* -------------------------------------------------------------- staleness --*/

check('Status older than the window is stale', function () {
    ok(!match.isStale(D(2026, 8, 29), ASOF), '3 days is fresh');
    ok(!match.isStale(D(2026, 8, 22), ASOF), '10 days is the boundary');
    ok(match.isStale(D(2026, 8, 21), ASOF), '11 days is stale');
    ok(match.isStale(null, ASOF), 'never imported is stale');
});

/* ------------------------------------------------ the real report fixture --*/

const csv = fs.readFileSync(path.join(__dirname, 'fixtures', 'report_sample.csv'), 'utf8');

// The nine invoices that really carry these AF ids, from the live account.
const REAL_INVOICES = [
    { tranid: 'INV8891', otherrefnum: 'Alastin 2543205', total: 7380 },
    { tranid: 'INV8897', otherrefnum: 'Chalk 2543228', total: 1470 },
    { tranid: 'INV8903', otherrefnum: 'Tepperman 2543198', total: 4290 },
    { tranid: 'INV8889', otherrefnum: 'ACL 2543124', total: 360 },
    { tranid: 'INV8908', otherrefnum: 'ACL 2545768', total: 180 },
    { tranid: 'INV8914', otherrefnum: 'Chalk 2545761', total: 3570 },
    { tranid: 'INV8918', otherrefnum: 'GW SCA 2545754', total: 1920 },
    { tranid: 'INV8911', otherrefnum: 'Alastin 2545760', total: 7800 },
    { tranid: 'INV8923', otherrefnum: 'Tepperman 2545756', total: 4410 }
];

function candidatesFor(rows) {
    const byAfId = {};
    rows.forEach(function (r) {
        byAfId[r.afId] = REAL_INVOICES.filter(function (inv) {
            return inv.otherrefnum.indexOf(r.afId) !== -1; // mimics the SuiteQL LIKE
        });
    });
    return byAfId;
}

check('Fixture parses to 16 clean rows with no warnings', function () {
    const res = parse.parseReport(csv);
    eq(res.rows.length, 16, 'row count');
    eq(res.warnings, [], 'warnings');
});

check('Fixture preserves the comma inside the contractor name', function () {
    const res = parse.parseReport(csv);
    eq(res.rows[0].contractor, 'Hyham, Steve', 'contractor');
    eq(res.rows[0].client, 'AbSci', 'client must not be shifted');
    eq(res.rows[0].afId, '2549387', 'afId');
    eq(res.rows[0].hours, 14.5, 'hours');
    eq(res.rows[0].pay, 1740, 'pay');
});

check('Fixture diff reproduces the live account: 9 matched, 7 pending, 0 exceptions', function () {
    const res = parse.parseReport(csv);
    const diff = match.buildDiff({
        rows: res.rows,
        existing: [],
        candidatesByAfId: candidatesFor(res.rows),
        asOf: ASOF
    });
    eq(diff.counts.rowsInFile, 16, 'rows');
    eq(diff.counts.matched, 9, 'matched');
    eq(diff.counts.notYetInvoiced, 7, 'not yet invoiced');
    eq(diff.counts.exceptions, 0, 'exceptions');
    eq(diff.counts.newlyUnapproved, 16, 'all new on a first run');
    eq(diff.counts.flippedToApproved, 0, 'nothing to flip on a first run');
});

check('REGRESSION: every diff entry exposes afId at the top level', function () {
    // Consumers read entry.afId directly - the invoice stamp, the error
    // messages, and both preview tables. When it lived only on entry.row this
    // silently wrote undefined into custbody_pc_af_ts_id on the first live run,
    // and validation could never have caught it.
    const res = parse.parseReport(csv);
    const diff = match.buildDiff({
        rows: res.rows, existing: [{
            afId: '2500001', status: match.STATUS.UNAPPROVED,
            firstSeen: D(2026, 8, 1), lastSeen: D(2026, 8, 25)
        }],
        candidatesByAfId: candidatesFor(res.rows), asOf: ASOF
    });
    ['newlyUnapproved', 'stillUnapproved', 'matched', 'notYetInvoiced',
     'exceptions', 'flippedToApproved'].forEach(function (bucket) {
        diff[bucket].forEach(function (e, i) {
            ok(typeof e.afId === 'string' && e.afId.length > 0,
               bucket + '[' + i + '].afId must be a non-empty string, got ' +
               JSON.stringify(e.afId));
        });
    });
    // And it must agree with the row it came from.
    diff.newlyUnapproved.forEach(function (e) {
        eq(e.afId, e.row.afId, 'afId matches row');
    });
});

check('Every not-yet-invoiced row is the most recent period', function () {
    const res = parse.parseReport(csv);
    const diff = match.buildDiff({
        rows: res.rows, existing: [],
        candidatesByAfId: candidatesFor(res.rows), asOf: ASOF
    });
    diff.notYetInvoiced.forEach(function (e) {
        eq(e.row.periodEnding.getDate(), 29, 'day for AF ' + e.row.afId);
        eq(e.row.periodEnding.getMonth(), 7, 'month for AF ' + e.row.afId);
    });
});

check('Every matched row ties to the penny', function () {
    const res = parse.parseReport(csv);
    const diff = match.buildDiff({
        rows: res.rows, existing: [],
        candidatesByAfId: candidatesFor(res.rows), asOf: ASOF
    });
    const matched = diff.newlyUnapproved.filter(function (e) {
        return e.classification.matchStatus === match.MATCH.MATCHED;
    });
    eq(matched.length, 9, 'matched count');
    matched.forEach(function (e) {
        eq(e.classification.variance, 0, 'variance for AF ' + e.afId);
    });
});

check('A matched row with a pay variance counts as BOTH matched and an exception', function () {
    const rows = [{ afId: '2545756', periodEnding: D(2026, 8, 22), pay: 4410 }];
    const diff = match.buildDiff({
        rows: rows,
        existing: [],
        candidatesByAfId: {
            '2545756': [{ tranid: 'INV8923', otherrefnum: 'Tepperman 2545756', total: 4000 }]
        },
        asOf: ASOF
    });
    eq(diff.counts.matched, 1, 'still matched');
    eq(diff.counts.exceptions, 1, 'and flagged');
    eq(diff.counts.notYetInvoiced, 0, 'not pending');
});

/* --------------------------------------------------- second-run behaviour --*/

check('Second run keeps first-seen fixed and ages the row', function () {
    const res = parse.parseReport(csv);
    const priorAsOf = D(2026, 8, 25);
    const existing = res.rows.map(function (r) {
        return {
            afId: r.afId, status: match.STATUS.UNAPPROVED,
            firstSeen: priorAsOf, lastSeen: priorAsOf
        };
    });
    const diff = match.buildDiff({
        rows: res.rows, existing: existing,
        candidatesByAfId: candidatesFor(res.rows), asOf: ASOF
    });
    eq(diff.counts.newlyUnapproved, 0, 'nothing new');
    eq(diff.counts.stillUnapproved, 16, 'all still unapproved');
    diff.stillUnapproved.forEach(function (e) {
        eq(e.firstSeen.getTime(), priorAsOf.getTime(), 'firstSeen must not move');
        eq(e.daysUnapproved, 7, 'aged 7 days');
    });
});

check('Dropping off the report infers approval as of this run', function () {
    const res = parse.parseReport(csv);
    const gone = {
        afId: '2500001', status: match.STATUS.UNAPPROVED,
        firstSeen: D(2026, 8, 1), lastSeen: D(2026, 8, 25)
    };
    const diff = match.buildDiff({
        rows: res.rows, existing: [gone],
        candidatesByAfId: candidatesFor(res.rows), asOf: ASOF
    });
    eq(diff.counts.flippedToApproved, 1, 'one flip');
    eq(diff.flippedToApproved[0].afId, '2500001', 'which one');
    eq(diff.flippedToApproved[0].approvedOn.getTime(), ASOF.getTime(), 'approvedOn');
    eq(diff.flippedToApproved[0].daysUnapproved, 31, 'time it took');
    ok(diff.flippedToApproved[0].inferred, 'flagged as inferred, never as stated by AF');
});

check('An already-approved record is not re-flipped', function () {
    const res = parse.parseReport(csv);
    const done = {
        afId: '2500002', status: match.STATUS.APPROVED,
        firstSeen: D(2026, 7, 1), lastSeen: D(2026, 8, 1)
    };
    const diff = match.buildDiff({
        rows: res.rows, existing: [done],
        candidatesByAfId: candidatesFor(res.rows), asOf: ASOF
    });
    eq(diff.counts.flippedToApproved, 0, 'no flip');
});

/* ------------------------------------------------------ malformed input ---*/

check('A non-AF file is rejected with a useful message', function () {
    let msg = '';
    try { parse.parseReport('foo,bar\n1,2\n'); } catch (e) { msg = e.message; }
    ok(/no header row found/.test(msg), 'got: ' + msg);
});

check('A duplicate AF id is skipped and reported', function () {
    const dup = 'id,Client,Period Ending,Pay\n' +
                '111,AbSci,29-Aug-2026,10\n' +
                '111,AbSci,29-Aug-2026,10\n';
    const res = parse.parseReport(dup);
    eq(res.rows.length, 1, 'kept one');
    ok(/already appeared/.test(res.warnings[0]), 'warned');
});

check('A missing required column is refused up front', function () {
    let msg = '';
    try { parse.parseReport('id,Client\n1,AbSci\n'); } catch (e) { msg = e.message; }
    ok(/missing required column/.test(msg), 'got: ' + msg);
});

/* ------------------------------------------------------------- drafting ---*/

const draft = loadAmd(path.join(LIB, 'pc_af_draft.js'));

const ts = function (client, m, d, days, nudges) {
    return {
        client: client, periodEnding: D(2026, m, d), hours: 8, pay: 960,
        daysUnapproved: days, nudgeCount: nudges || 0,
        contactName: 'Erin Pryce', contactEmail: 'e.pryce@tenthrevolution.com'
    };
};

check('Tone tier is driven by the OLDEST item and prior asks, not row count', function () {
    eq(draft.pickTier([ts('Alastin', 8, 22, 3)]), draft.TIER.FIRST, 'fresh');
    eq(draft.pickTier([ts('Alastin', 8, 22, 3), ts('Alastin', 8, 15, 20)]),
       draft.TIER.SECOND, 'oldest drives it');
    eq(draft.pickTier([ts('Alastin', 8, 22, 40)]), draft.TIER.ESCALATE, '40 days');
    eq(draft.pickTier([ts('Alastin', 8, 22, 2, 1)]), draft.TIER.SECOND, 'asked once');
    eq(draft.pickTier([ts('Alastin', 8, 22, 2, 2)]), draft.TIER.ESCALATE, 'asked twice');
});

check('Few items read as prose, never as a table', function () {
    const d = draft.composeDraft({
        contactName: 'Erin Pryce',
        timesheets: [ts('Alastin', 8, 15, 5), ts('Alastin', 8, 22, 5)]
    });
    ok(/the 8\/15 and 8\/22 weeks for Alastin/.test(d.body), 'prose phrasing: ' + d.body);
    ok(d.body.indexOf('  - ') === -1, 'must not bullet under the prose limit');
    ok(/^Hi Erin,/.test(d.body), 'first name only');
});

check('Many items switch to a list, because prose would read worse', function () {
    const many = [ts('A', 8, 1, 5), ts('B', 8, 8, 5), ts('C', 8, 15, 5), ts('D', 8, 22, 5)];
    const d = draft.composeDraft({ contactName: 'Erin', timesheets: many });
    ok(d.body.indexOf('  - ') !== -1, 'should bullet above the limit');
});

check('One rep with several clients reads naturally', function () {
    const d = draft.composeDraft({
        contactName: 'Maria Mihaylov',
        timesheets: [ts('Brixton', 8, 15, 5), ts('Brixton', 8, 22, 5), ts('Sauce Labs', 8, 22, 5)]
    });
    ok(/the 8\/15 and 8\/22 weeks for Brixton and the 8\/22 week for Sauce Labs/.test(d.body),
       'grouped by client: ' + d.body);
});

check('Drafts never lead with money and carry no machine footer', function () {
    [1, 20, 45].forEach(function (age) {
        const d = draft.composeDraft({
            contactName: 'Erin', timesheets: [ts('Alastin', 8, 22, age)]
        });
        ok(d.body.indexOf('$') === -1, 'no dollar figure at age ' + age + ': ' + d.body);
        ok(!/unsubscribe|automatically|generated/i.test(d.body), 'no footer at age ' + age);
    });
});

check('The three tiers are genuinely different messages', function () {
    const first = draft.composeDraft({ contactName: 'E', timesheets: [ts('A', 8, 22, 2)] });
    const second = draft.composeDraft({ contactName: 'E', timesheets: [ts('A', 8, 22, 20)] });
    const esc = draft.composeDraft({ contactName: 'E', timesheets: [ts('A', 8, 22, 45)] });
    ok(first.body !== second.body && second.body !== esc.body, 'bodies differ');
    ok(first.subject !== second.subject && second.subject !== esc.subject, 'subjects differ');
    ok(/asked a couple of times/.test(esc.body), 'escalation acknowledges repetition');
    ok(/looped in/.test(esc.body), 'escalation asks for another person');
});

check('One bundle per rep, never one per client', function () {
    const rows = [
        ts('Brixton', 8, 22, 5), ts('Sauce Labs', 8, 22, 5), ts('Case Worthy', 8, 22, 5)
    ];
    const b = draft.bundleByRep(rows);
    eq(b.sendable.length, 1, 'three clients, one rep, one email');
    eq(b.sendable[0].timesheets.length, 3, 'all three in it');
});

check('Rows with no contact email are surfaced, never silently dropped', function () {
    const withEmail = ts('Alastin', 8, 22, 5);
    const without = ts('Teppermans', 8, 22, 5);
    without.contactEmail = null;
    without.contactName = null;
    const b = draft.bundleByRep([withEmail, without]);
    eq(b.sendable.length, 1, 'sendable');
    eq(b.unsendable.length, 1, 'blocked but visible');
    eq(b.unsendable[0].timesheets[0].client, 'Teppermans', 'which one');
});

check('Bundles are ordered oldest first', function () {
    const a = ts('A', 8, 22, 5); a.contactEmail = 'a@x.com';
    const b2 = ts('B', 8, 22, 40); b2.contactEmail = 'b@x.com';
    const out = draft.bundleByRep([a, b2]);
    eq(out.sendable[0].draft.oldestDays, 40, 'oldest first');
});

/* ------------------------------------------------------------------ out ---*/

console.log('');
failures.forEach(function (f) {
    console.log('  FAIL  ' + f.name + '\n        ' + f.message);
});
console.log('  ' + passed + ' passed, ' + failures.length + ' failed');
console.log('');
process.exit(failures.length ? 1 : 0);
