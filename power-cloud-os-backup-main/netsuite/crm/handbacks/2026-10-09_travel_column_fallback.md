## Handback
Files read: src/FileCabinet/SuiteScripts/PC/pc_crm_api_rl.js (lines 1105-1155 only, plus a grep for `findColumn`)
Files written: C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\src\FileCabinet\SuiteScripts\PC\pc_crm_api_rl.js (edited, `findColumn` and its two call sites only); this handback file
IDs created: none
Unconfirmed references: none (the field names `companyname`, `entityid`, `altname`, `email` were supplied in the task)
Open decisions: none
Not fixed, needs a decision: n/a
Observed: `column.name` on a search column ignores `join`. If customsearch901 ever carries a joined column (for example `email` from a contact join) next to the project's own, the by-name pass sees two matches and throws the "(by field name)" error. Not a problem for the stated account fact; flagged only.

### New `findColumn` (lines 1118-1139)
```js
    /**
     * Exactly one column whose custom label equals label (case-insensitive, trimmed); if none, exactly one whose
     * lowercase field name is in fallbackNames (exact match). Zero or several in the deciding pass breaks the contract.
     */
    const findColumn = (columns, label, fallbackNames) => {
        const wanted = label.toLowerCase();
        const byLabel = columns.filter((c) => String(c.label || '').trim().toLowerCase() === wanted);
        if (byLabel.length > 1) {
            throw new ApiError(E_FAILED, `Travel search has more than one ${label} column`);
        }
        if (byLabel.length === 1) {
            return byLabel[0];
        }
        const names = fallbackNames || [];
        const byName = columns.filter((c) => names.indexOf(String(c.name || '').toLowerCase()) !== -1);
        if (byName.length > 1) {
            throw new ApiError(E_FAILED, `Travel search has more than one ${label} column (by field name)`);
        }
        if (byName.length === 0) {
            throw new ApiError(E_FAILED, `Travel search has no ${label} column`);
        }
        return byName[0];
    };
```

### Call sites (lines 1152-1153 after the edit)
```js
        const nameColumn = findColumn(columns, 'Name', ['companyname', 'entityid', 'altname']);
        const emailColumn = findColumn(columns, 'Email', ['email']);
```

### Notes
- Label pass is unchanged in behavior: one match returns, several throw the original message. The ordering of the two label checks is swapped (several is checked before one); the outcomes are identical.
- `fallbackNames` defaults to `[]` if omitted, so a call without it behaves as before (label only, zero matches throws the unchanged "no ${label} column" message).
- `names.indexOf(...) !== -1` is used instead of `includes`; both are valid in 2.1. Switch to `includes` if preferred.
- No logging, no module-scope statements, nothing else in the file touched. No tests written or run.

Self-check (netsuite-sdf sections 2, 3, 4, 7, 8):
- 2 Naming: pass (no new objects or IDs)
- 3 Header: pass (header untouched; no `var`, const and arrow functions only)
- 4 Deployment XML: pass (no XML touched)
- 7 Governance and error handling: pass (pure in-memory filter, no I/O, errors thrown as the existing ApiError, no catch added)
- 8 Security: pass (no secrets, hosts, PII, or logging added)

Guesses: that "exact match, not substring" means `Array.indexOf` on the lowercased `c.name`, and that a missing `fallbackNames` should be treated as empty rather than throwing.
