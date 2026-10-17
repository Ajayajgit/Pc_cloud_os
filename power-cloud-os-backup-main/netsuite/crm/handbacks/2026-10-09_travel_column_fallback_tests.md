# Handback: travel column fallback tests (A1b, A1c)

Date: 2026-10-09
File edited: `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\__tests__\pc_crm_api_rl.test.js`

Two `it` blocks were inserted inside the `describe('PC | CRM API acceptance criteria')` block, directly after the A1 `it(...)` and before the A2 JSDoc. No existing test, helper, mock or header was changed. Jest was not run (per instructions); the tests are unverified until the orchestrator runs them.

## A1b block

```js
    /**
     * Fallback case, added on top of the packet's A1 to A12: with no custom label on the Name and Email columns, the
     * RESTlet resolves them by field name (Name: companyname, entityid or altname; Email: email) and returns the same rows as A1.
     */
    it('A1b: listTravelProjects resolves the Email and Name columns by field name when the saved search carries no custom label for them.', () => {
        session = { role: TRAVEL_ROLE, deployment: TRAVEL_DEPLOY };
        seed('job', 30, { custentity_pc_travel_exclude: false });
        seed('job', 44, { custentity_pc_travel_exclude: true });
        seed('job', 12, { custentity_pc_travel_exclude: false });
        seed('job', 21, { custentity_pc_travel_exclude: false });
        travelPages = [
            [
                { id: '30', altname: 'Acme Apparel Travel', email: 'approver@client.example' },
                { id: '44', altname: 'Delta Excluded Trip', email: 'excluded@client.example' }
            ],
            [
                { id: '12', altname: 'Beta Footwear Trip', email: '' },
                { id: '21', altname: 'Gamma Retail Trip', email: 'travel@gamma.example' }
            ]
        ];
        // Name carries an empty label and Email carries no label key, so both must resolve by field name.
        search.load.mockImplementation(({ id }) => ({
            id,
            columns: [{ name: 'internalid', label: 'ID' }, { name: 'altname', label: '' }, { name: 'email' }],
            runPaged: () => ({
                pageRanges: travelPages.map((page, index) => ({ index })),
                fetch: ({ index }) => ({ data: travelPages[index].map(toResult) })
            })
        }));

        const res = send(actionBody('listTravelProjects', {}));

        expect(res.ok).toBe(true);
        expect(res.error).toBeFalsy();
        expect(res.result.projects).toEqual([
            { projectId: 12, name: 'Beta Footwear Trip', approverEmail: null },
            { projectId: 21, name: 'Gamma Retail Trip', approverEmail: 'travel@gamma.example' },
            { projectId: 30, name: 'Acme Apparel Travel', approverEmail: 'approver@client.example' }
        ]);
    });
```

## A1c block

```js
    /**
     * Fallback case, added on top of the packet's A1 to A12: when neither a labeled nor a field-named Email column exists
     * in the travel saved search, listTravelProjects refuses with PC_API_FAILED and names the missing column.
     */
    it('A1c: listTravelProjects fails with PC_API_FAILED when neither a labeled nor a field-named Email column exists.', () => {
        session = { role: TRAVEL_ROLE, deployment: TRAVEL_DEPLOY };
        travelPages = [
            [
                { id: '30', altname: 'Acme Apparel Travel', email: 'approver@client.example' },
                { id: '44', altname: 'Delta Excluded Trip', email: 'excluded@client.example' }
            ],
            [
                { id: '12', altname: 'Beta Footwear Trip', email: '' },
                { id: '21', altname: 'Gamma Retail Trip', email: 'travel@gamma.example' }
            ]
        ];
        // No column carries the Email label or the field name email.
        search.load.mockImplementation(({ id }) => ({
            id,
            columns: [{ name: 'internalid', label: 'ID' }, { name: 'altname', label: 'Name' }, { name: 'phone', label: 'Phone' }],
            runPaged: () => ({
                pageRanges: travelPages.map((page, index) => ({ index })),
                fetch: ({ index }) => ({ data: travelPages[index].map(toResult) })
            })
        }));

        const res = send(actionBody('listTravelProjects', {}));

        expectError(res, 'PC_API_FAILED');
        expect(res.error.message).toBe('Travel search has no Email column');
    });
```

## Existing helpers reused

- `session`, `TRAVEL_ROLE`, `TRAVEL_DEPLOY` (roles and deployments, lines 113 and 114).
- `send`, `actionBody` (request builders).
- `seed` and the `job` exclusion data (`custentity_pc_travel_exclude`), copied from A1 so the exclusion search returns the same rows.
- `travelPages` (test-scope, reset in `beforeEach`).
- `toResult` (search row adapter, reads columns by name).
- `expectError` (asserts `ok` false and `error.code`).
- The `search.load` mock shape from `beforeEach` (`id`, `columns`, `runPaged` with `pageRanges` and `fetch`), reproduced inline with different `columns`.

## Awkward points

1. `beforeEach` hard-codes `columns: TRAVEL_COLUMNS` inside the `search.load` mock, and `TRAVEL_COLUMNS` is a module constant that the file does not let a test swap. Each new test therefore re-mocks `search.load` with its own `columns` and repeats the `runPaged`/`fetch` body. The `beforeEach` mock is re-assigned on every test, so the override does not leak into later tests. Making `columns` a test-scope variable (like `travelPages`) in `beforeEach` would remove the duplication, but that edits existing setup and was not requested, so I left it.
2. A1b repeats the A1 seeds and pages verbatim, because the exclusion search reads the in-memory store and the expected rows depend on it.
3. A1c has no seeded jobs. The assertion only checks the error, so it does not depend on the exclusion search. I did include the A1 travel pages so an implementation that ignores a missing Email column would return rows and fail the test, instead of passing for lack of data. This is a judgment call, since the orchestrator did not specify pages for A1c.
4. A1b does not assert `search.load` was called with `customsearch901` (A1 does). The spec listed only `ok`, rows and no error, so I kept to that.
5. The file header comment still says "One test per acceptance criterion (A1 to A12)". I did not change it. A1b and A1c are fallback cases beyond the packet's criteria, and the JSDoc on each says so.
6. The Name column override uses `label: ''`, and the Email column override omits the `label` key. This follows the orchestrator's arrangement exactly. The RESTlet behavior these tests exercise is being written in parallel, so the tests were written from the description, not from the script.

## Handback

- Files read: `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\__tests__\pc_crm_api_rl.test.js`.
- Files written: the same test file (two `it` blocks added, nothing else changed); this handback at `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\handbacks\2026-10-09_travel_column_fallback_tests.md`.
- Not done: Jest was not run, per instructions. No syntax check beyond reading the inserted text.
- Guesses: pages in A1c (point 3); the `expect(res.error).toBeFalsy()` check in A1b assumes the success envelope omits or nulls `error`.
