## Handback
Files read: pc_crm_api_rl.js (ApiError definition at 159-166, findColumn region, `.details` consumers), netsuite-sdf SKILL.md
Files written: src/FileCabinet/SuiteScripts/PC/pc_crm_api_rl.js (findColumn only, now lines 1122-1147); this handback
IDs created: none
Unconfirmed references: none
Open decisions: none
Not fixed, needs a decision: n/a
Observed: see "Unsure" below (details also reach the ledger row)

### New helper body (full)

```js
    const findColumn = (columns, label, fallbackNames) => {
        const inventory = columns.map((c) => ({
            name: c.name === undefined ? null : String(c.name),
            join: c.join === undefined || c.join === null ? null : String(c.join),
            label: c.label === undefined || c.label === null ? null : String(c.label),
            formula: c.formula === undefined || c.formula === null ? null : String(c.formula),
            summary: c.summary === undefined || c.summary === null ? null : String(c.summary)
        }));
        const wanted = label.toLowerCase();
        const byLabel = columns.filter((c) => String(c.label || '').trim().toLowerCase() === wanted);
        if (byLabel.length > 1) {
            throw new ApiError(E_FAILED, `Travel search has more than one ${label} column`, { wanted: label, columns: inventory });
        }
        if (byLabel.length === 1) {
            return byLabel[0];
        }
        const names = fallbackNames || [];
        const byName = columns.filter((c) => names.indexOf(String(c.name || '').toLowerCase()) !== -1);
        if (byName.length > 1) {
            throw new ApiError(E_FAILED, `Travel search has more than one ${label} column (by field name)`, { wanted: label, columns: inventory });
        }
        if (byName.length === 0) {
            throw new ApiError(E_FAILED, `Travel search has no ${label} column`, { wanted: label, columns: inventory });
        }
        return byName[0];
    };
```

The label pass and field-name pass are unchanged. Only the `inventory` const and the third argument on the three throws were added. No other edits.

### ApiError signature matched

Line 160: `constructor(code, message, details) {` with `this.details = details || {};` (line 164). The class is declared at line 159: `class ApiError extends Error {`. The new calls pass `(E_FAILED, message, { wanted: label, columns: inventory })`, the same shape as the existing `new ApiError(E_FAILED, message, { step: null, errorName: e.name })` at line 1114.

### Unsure

- Details are forwarded to the caller at lines 1366 and 1446 (`errorResponse(..., e.details, ...)`), so the inventory will appear in the response. Line 1357 also spreads `e.details` into `ledgerLib.refuse(rowId, e.message, Object.assign({ code: e.code }, e.details))`, so the inventory will be written into the ledger refusal row as well. That is column metadata only, but it is a larger payload than before on a ledger row. I did not check the ledger field size limit (not in scope); the orchestrator may want to confirm the ledger tolerates the extra JSON, or that `refuse` truncates.
- Not run: Jest or validate (orchestrator owns). Any existing test that asserts `error.details` equals `{}` for these three throws would now fail.
- Two of the new lines run about 130 characters; the file had no stated line-length limit that I found.
- `c.name === undefined ? null : String(c.name)` was used verbatim as specified, so a `null` name becomes the string "null". Kept as instructed.

### Self-check (netsuite-sdf sections 2, 3, 4, 7, 8)
- Section 2 (naming): pass, no new objects or IDs.
- Section 3 (header): pass, header blocks untouched; no `var` introduced.
- Section 4 (deployment XML): pass, n/a, no XML touched.
- Section 7 (governance and errors): pass, no I/O added, no new catch blocks; the throws are caught by existing entry-point handlers that log.
- Section 8 (security): pass, inventory is column metadata only, no record data, no secrets, no logging added.

Guesses: none
