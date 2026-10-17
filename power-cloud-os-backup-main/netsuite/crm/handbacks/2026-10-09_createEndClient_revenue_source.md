## Handback

Files read: `src/FileCabinet/SuiteScripts/PC/pc_crm_api_rl.js` (header, lines 396-431, 470-590, 715-870, plus grep of the whole file). The netsuite-sdf skill was supplied in the prompt.

Files written: `src/FileCabinet/SuiteScripts/PC/pc_crm_api_rl.js` (four edits below). This handback file.

### Edit 1: shapeCreateEndClient (around line 496)

Before:
```js
        const r = makeReader(payload, ['clientUUID', 'companyName', 'website', 'phone', 'email', 'contacts']);
        const p = {
            clientUUID: r.uuid('clientUUID', true),
            companyName: r.text('companyName', 83, 1, true),
            website: r.text('website', 100, 1),
```
After:
```js
        const r = makeReader(payload, ['clientUUID', 'companyName', 'revenueSourceId', 'website', 'phone', 'email', 'contacts']);
        const p = {
            clientUUID: r.uuid('clientUUID', true),
            companyName: r.text('companyName', 83, 1, true),
            revenueSourceId: r.id('revenueSourceId', true),
            website: r.text('website', 100, 1),
```

### Edit 2: new refsCreateEndClient (directly before refsCreateOpportunity)

Before:
```js
    const refsCreateOpportunity = (p) => {
```
After:
```js
    const refsCreateEndClient = (p) => {
        requireActive(T_CLASS, p.revenueSourceId, 'revenueSourceId');
    };

    const refsCreateOpportunity = (p) => {
```
No `ensureUsage` added. `refsCreateOpportunity` does not call it before its `requireActive` calls (it only calls it before the billing party check and the referral contact lookup), and `requireActive` itself calls `ensureUsage` as its first line.

### Edit 3: REFS map

Before: `        createEndClient: noRefs,`
After: `        createEndClient: refsCreateEndClient,`

### Edit 4: customer save in runCreateEndClient

Before:
```js
            rec.setValue({ fieldId: 'companyname', value: p.companyName });
            const subsidiaryId = toId(param(PARAM_SUBSIDIARY));
```
After:
```js
            rec.setValue({ fieldId: 'companyname', value: p.companyName });
            rec.setValue({ fieldId: 'custentity_cus_rev_src', value: p.revenueSourceId });
            const subsidiaryId = toId(param(PARAM_SUBSIDIARY));
```

Comment blocks updated: none. No JSDoc or comment in the file lists the createEndClient payload keys (grep for `companyName` and `classId` found only code), so there was nothing to keep true. The header block was not touched.

IDs created: none (no new scriptids).
Unconfirmed references: `custentity_cus_rev_src` (used in `runCreateEndClient`) is the field id the orchestrator supplied from the verified production error; I did not independently confirm it.
Open decisions: none
Not fixed, needs a decision: n/a

Observed:
- The new `refsCreateEndClient` runs after the ledger claim and before the action, like every REFS entry. A replay of an already finished request returns its stored answer without re-checking `revenueSourceId`, but a replayed request that predates this change carries no `revenueSourceId` and now fails shape validation. That is the intended behavior for a required key, but any ledgered in-flight retry from before the deploy will be rejected. Tests that call `createEndClient` without `revenueSourceId` need the new key.
- `requireActive` uses `safeLookup(T_CLASS, ...)` with `isinactive` only. It confirms the class exists and is active; it does not check the class is a valid Revenue Source value, for example if the field is filtered by a subset of classes. If the account restricts the field's allowed classes, the customer save would still fail on a class outside that set.

Self-check (netsuite-sdf sections 2, 3, 4, 7, 8):
- Section 2: pass, no new names or ids; display name unchanged.
- Section 3: pass, header blocks not edited; no `var`.
- Section 4: pass, no XML touched.
- Section 7: pass, the new lookup goes through `requireActive`, which calls `ensureUsage`; no new loops, no new catch blocks, no re-save.
- Section 8: pass, input is validated as an id in `shapeCreateEndClient` before use and checked against the account in `refsCreateEndClient`; nothing logged, no hosts, no `runasrole`, no secrets.

Guesses: none.
