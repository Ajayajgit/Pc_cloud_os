## Handback (T1, fix pass 2)

Files read: `customrecord_pc_channel_map.xml`, `pc_crm_channel_map_ue.js` (this pass); earlier passes: PLAN.md, netsuite-sdf SKILL.md, SALES_OS_FIELD_SET.md, manifest.xml, deploy.xml, `pc_crm_ledger_lib.js` (pattern only).

## Fix pass 2 (Mike's design change: no custom Active checkbox)

Files written (two only):
1. `src/Objects/Records/customrecord_pc_channel_map.xml`
   - Removed the `custrecord_pc_cm_active` block entirely.
   - Record description now reads "One row per class; a retired channel is marked Inactive. Each row says how the channel relates to Power Cloud and who is billed. ..." (rest unchanged).
   - `custrecord_pc_cm_class` description now "One row per class." and help now "The class (Revenue Source) this row describes. One row per class; a retired channel is marked Inactive."
2. `src/FileCabinet/SuiteScripts/PC/pc_crm_channel_map_ue.js`
   - Removed `FIELD_ACTIVE` and every read of it. Added `FIELD_INACTIVE = 'isinactive'`.
   - `active` is now `!toBool(pick('isinactive'))`. On CREATE and EDIT `pick` uses `getValue({ fieldId: 'isinactive' })`; on XEDIT it uses `getValue` when `isinactive` is among the edited fields, else the `lookupFields` value (`isinactive` is in the lookup columns).
   - The duplicate check runs only when the row being saved is active (not inactive). The search for other rows keeps `['isinactive', 'is', 'F']` and no longer has the custom active filter; it still excludes the row's own id.
   - Unchanged: both header blocks, error names (`PC_CHANNEL_DUPLICATE`, `PC_CHANNEL_NO_BILLING_PARTY`, `PC_CHANNEL_LIST_MISSING`), the Subcontract id lookup, the fail-closed catch. No `getText` anywhere (grep confirms). No reference to `custrecord_pc_cm_active` remains anywhere under `src/` (grep confirms).

Observations for you:
- `customrecord_pc_channel_map.xml` as I found it this pass had three fields besides active: class, relationship, billing party. **`custrecord_pc_cm_partner` is not in the file** (my pass-1 version had it; I did not remove it this pass, so someone edited the file between passes). If the Partner field is still wanted on the channel map for referral rows, it needs to be re-added. No `custrecord_pc_cm_partner` reference remains in `src/`.
- The `isinactive` read on XEDIT assumes `rec.getFields()` lists `isinactive` when it is edited (for example a REST PATCH of `isInactive`). Same untested XEDIT assumption as before; the seed-and-inactivate test through MCP will exercise it.
- The SDF has no "name must be unique" element that I know of; the guard checks class only.

## State of T1 (unchanged elsewhere)

Files (under `...\Power Cloud NS\CRM\`): `src/Objects/Lists/` (3 lists), `src/Objects/Fields/` (6 `custbody_pc_*`, 6 `custentity_pc_*`), `src/Objects/Records/` (channel map, ledger), `src/Objects/Scripts/customscript_pc_crm_channel_map_ue.xml`, `src/FileCabinet/SuiteScripts/PC/pc_crm_channel_map_ue.js`. The stray first-pass file `src/FileCabinet/SuiteScripts/PowerCloud/crm/pc_channel_map_ue.js` must not be deployed and should be deleted (I have no delete tool).

IDs created: `customlist_pc_commercial_model`, `customlist_pc_cm_relationship`, `customlist_pc_ol_status`; the 12 field ids; `customrecord_pc_channel_map` (`custrecord_pc_cm_class`, `_relationship`, `_billing_party`; `_active` is gone; `_partner` absent, see above); `customrecord_pc_op_ledger` (nine `custrecord_pc_ol_*` fields); `customscript_pc_crm_channel_map_ue`, `customdeploy_pc_crm_channel_map_ue`.

Existing references: `customrecord_pc_op_ledger` grants `customrole_pc_mcp_ai_connection` View (manifest dependency); -2, -101, -30, -7 confirmed by the orchestrator; any `UNCONFIRMED_CONTACT` placeholder still in the three contact fields is the orchestrator's to substitute.

Open decisions: none. Not fixed, needs a decision: n/a.

Observed: no new trap this pass (the getText trap was reported in pass 1).

Self-check (netsuite-sdf sections 2, 3, 4, 7, 8):
- Section 2: pass. Ids and names unchanged; the channel map has one fewer field.
- Section 3: pass. Header blocks unchanged; `@NApiVersion 2.1`; no `var`.
- Section 4: pass. Deployment XML unchanged (`allroles` T, `isdeployed` T, `runasrole` empty, explicit `executioncontext`).
- Section 7: pass. Entry point wrapped, catch logs record type, id and stack, refusals audit-log and rethrow; one cached list lookup, one class search and, on XEDIT, one `lookupFields`; no loops, no re-save.
- Section 8: pass. No secrets, hosts or `eval`; logs carry ids and error names only; no `runasrole`; MCP role View only.

Guesses: that `getValue({ fieldId: 'isinactive' })` returns a boolean in `beforeSubmit` on a custom record (handled by `toBool`, which accepts true or 'T'); that `lookupFields` accepts `isinactive` as a column on a custom record.
