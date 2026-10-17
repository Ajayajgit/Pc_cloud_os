## Handback (T2, fix pass 3, 2026-10-09)

Files read: PLAN.md; netsuite-sdf standards (as supplied in the packet); T1 `customrecord_pc_channel_map.xml`, `customrecord_pc_op_ledger.xml`, `customlist_pc_ol_status.xml`, `customlist_pc_cm_relationship.xml`, `custbody_pc_billing_party.xml`, `customscript_pc_crm_channel_map_ue.xml`, `pc_crm_channel_map_ue.js`; `baseline/sl_create_project_from_opp.js`; `src/deploy.xml`; `src/manifest.xml`; my own T2 JS files on the fix passes.

Files written (under `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\`):
- `src/FileCabinet/SuiteScripts/PC/pc_crm_channel_lib.js` (fix passes 1 and 2)
- `src/FileCabinet/SuiteScripts/PC/pc_crm_types_lib.js`
- `src/FileCabinet/SuiteScripts/PC/pc_crm_ledger_lib.js`
- `src/FileCabinet/SuiteScripts/PC/pc_crm_readiness_lib.js` (fix pass 1)
- `src/FileCabinet/SuiteScripts/PC/pc_crm_project_builder_lib.js` (fix passes 1 and 3)
- `src/FileCabinet/SuiteScripts/PC/pc_crm_create_project_sl.js`
- `src/FileCabinet/SuiteScripts/PC/pc_crm_opp_ue.js` (fix passes 1 and 3)
- `src/FileCabinet/SuiteScripts/PC/pc_crm_opp_cs.js`
- `src/Objects/Scripts/customscript_pc_crm_create_project_sl.xml`
- `src/Objects/Scripts/customscript_pc_crm_opp_ue.xml`
- `handbacks/T2_handback.md`

IDs created (unchanged):
- customscript_pc_crm_create_project_sl (suitelet "PC | Create Project Service"); deployment customdeploy_pc_crm_create_project_sl (TESTING, DEBUG, audience ADMINISTRATOR only); parameters custscript_pc_sl_allowed_roles (TEXT), custscript_pc_type_support_id (INTEGER), custscript_pc_fail_after_step (INTEGER); file customscript_pc_crm_create_project_sl.xml
- customscript_pc_crm_opp_ue (user event "PC | Opportunity CRM Guard"); deployment customdeploy_pc_crm_opp_ue (OPPORTUNITY, TESTING, DEBUG, allroles T); parameter custscript_pc_ue_type_support_id (INTEGER); file customscript_pc_crm_opp_ue.xml
- The five libraries and the client module have no script objects.

Existing references used (none UNCONFIRMED in my files): the opportunity, project and task fields, status ids, jobtype and engagement type map, service items 6 and 7, `customrecord_navan_config` / `custrecord_navan_relay_url`, `custsecret_pc_relay` (packet); the T1 ids custbody_pc_deal_uuid, custbody_pc_billing_party, custbody_pc_partner_contact, custbody_pc_commercial_model, custbody_pc_signed_date, the custentity_pc_* fields, customrecord_pc_channel_map (`custrecord_pc_cm_class`, `custrecord_pc_cm_relationship`, `custrecord_pc_cm_billing_party`), customrecord_pc_op_ledger and its nine fields, customlist_pc_ol_status (T1 files). `custrecord_pc_cm_partner` and `custrecord_pc_cm_active` are no longer referenced anywhere in T2.

Unconfirmed references: none in my files. Needed at deploy, not mine: the Support engagement type id for `custscript_pc_type_support_id` (suitelet) and `custscript_pc_ue_type_support_id` (user event), both blank now.

Manifest and deploy.xml: no new features or object dependencies from my files. The plan lists PROJECTMANAGEMENT for project tasks; the current manifest does not have it (your call). deploy.xml needs nothing new.

Fix pass 3 (this pass): SUITESCRIPT_API_UNAVAILABLE_IN_DEFINE. Rule applied to all eight T2 files: nothing directly inside the define callback may call or read a property of record, search, runtime, https, url, crypto, encode, error, log, serverWidget, message or currentRecord.

Sweep method: grep of `\b(record|search|runtime|https|url|crypto|encode|error|log|serverWidget|message|currentRecord)\.[A-Za-z]` across the eight files, each hit checked for whether it sits inside a function. Two module-scope hits, both fixed; every other hit is inside a function body.

Lines changed:
1. `pc_crm_project_builder_lib.js`, line 25 (was): `const OPP_TYPE = record.Type.OPPORTUNITY;` now lines 25 and 26: a comment line "String literal, not record.Type: no N module may be called while the define callback runs." and `const OPP_TYPE = 'opportunity';`.
2. `pc_crm_opp_ue.js`, line 23 (was): `const OPP_TYPE = record.Type.OPPORTUNITY;` now lines 23 and 24: the same comment line and `const OPP_TYPE = 'opportunity';`.

Checked and left alone (no module-scope call or property read):
- `pc_crm_channel_lib.js`, `pc_crm_types_lib.js` (no dependencies), `pc_crm_ledger_lib.js` (the status id cache is a plain `let` filled on first use inside `loadStatusIds`; `crypto`-style enums like `search.Sort.DESC` are read inside `findByOpp`), `pc_crm_readiness_lib.js` (`search.Type.JOB` is read inside `findProject`), `pc_crm_create_project_sl.js` (`record.Type.OPPORTUNITY` is read inside `opportunityExists`), `pc_crm_opp_cs.js` (`message.Type.*` and `window.crypto` are read inside functions).
- In the builder: `crypto.HashAlg.SHA256`, `encode.Encoding.UTF_8` and `encode.Encoding.HEX` are read inside `sha256Hex`; `record.Type.JOB`, `record.Type.PROJECT_TASK`, `search.Type.PROJECT_TASK` are read inside functions. In the user event: `search.Type.OPPORTUNITY` is read inside `checkDealUuid` and `serverWidget.FieldType.INLINEHTML` inside `renderMessage`.
- Plain string, number and regex constants stay at module scope. Behavior is otherwise unchanged: `record.Type.OPPORTUNITY` is the string `'opportunity'`.
- Not changed, but available if you want belt and braces: the in-function `search.Type.X` and `record.Type.X` reads could also become string literals; they are legal at run time.

Fix passes 1 and 2 (unchanged, for the record):
- Pass 1: partner column and `partnerId` removed from the channel lib; `externalidstring is` for project and task lookups; blank Task n rate uses `custbody_opp_rate` ("task n rate blank, general rate used"); a link to a project without `pc_proj_{D}` is state `complete` ("This opportunity is linked to a project created outside the builder."), links-disagree and inactive-project stay conflicts; status-25 non-partial early return moved above the no-project, complete and conflict handling; Billing Party cleared with ''; Deal UUID collision check `PC_DEAL_UUID_DUPLICATE` on CREATE, EDIT and XEDIT-when-edited. All PC-DECISION markers in my files are replaced by "Decided 2026-10-09 (orchestrator)" comments.
- Pass 2: `FIELD_ACTIVE` and its filter removed from `resolve()` in the channel lib (the native `isinactive` filter is the active test); `isBillingParty()` lost its `isinactive` filter so retired rows still count as billing parties (revert if retired rows should be ignored).

Open decisions: none.

Not fixed, needs a decision: n/a (no validate output received).

Observed (possible traps for CAPABILITIES.md):
- NEW, from the deploy failure: SuiteScript 2.1 evaluates the `define` callback when the script record is created at deploy, and any N module call or property read at module scope fails with SUITESCRIPT_API_UNAVAILABLE_IN_DEFINE ("All SuiteScript API Modules are unavailable while executing your define callback"). `record.Type.X` and `search.Type.X` at module scope count. `project:validate` does not catch it; only the deploy does. Author rule: use string literals for record types at module scope and read enums inside functions.
- A deployment in TESTING runs only for the deployment owner (the SDF auth user), so UAT of the user event and button works only for that user until T7 sets Released.
- `getValue` in beforeLoad returns null for fields not on the form. The user event looks up `entitystatus` and `record.load`s the opportunity before the readiness check (about 10 units per VIEW of a deal at status 24 or 25 only).
- `custsecret_pc_relay` needs its Allowed Domains to include the relay host and a restriction to the suitelet script (and later the RESTlet), or the relay call fails (non-fatal, logged). Manual item.
- The baseline suitelet sets both `project` and `company` on a new task; I set `company` only (per the plan). If the first task save rejects it, try `project`.
- The `externalidstring` filter on `job` and `projecttask` is untested in this account. The ledger is looked up by `name` (equal to the request id) instead.
- The XEDIT Deal UUID check assumes `newRecord.getFields()` returns only the edited fields (the same assumption the T1 channel map guard makes). If it returns every field, the check runs on every XEDIT but only fires on a real change.
- `isBillingParty` searches the channel map with no `isinactive` filter, assuming a SuiteScript search on a custom record returns inactive rows unless filtered. Untested; check that a retired row's billing party still returns true.

Self-check (netsuite-sdf sections 2, 3, 4, 7, 8):
- Section 2 (naming): pass. Script names are 27 and 26 characters; new scriptids carry `_pc_`; object file names equal scriptids; script files match `pc_crm_*_(ue|cs|sl|lib).js`.
- Section 3 (header): pass. Both header blocks verbatim in the three entry-point files (first block unchanged); libraries have `@NApiVersion 2.1` and `@NModuleScope SameAccount` and no `@NScriptType`; every file uses `define` with an explicit dependency array; no `var`, no `2.x`. This pass touched neither header block. Module scope in all eight files now holds only string, number and regex constants, plain arrow functions and a `let` cache; no N module is touched inside a define callback.
- Section 4 (deployment XML): pass, unchanged. Suitelet deployment: `audslctrole` ADMINISTRATOR, other audience booleans F, TESTING, DEBUG, isdeployed T, isonline F, empty runasrole with the T3 comments. User event deployment: `allroles` T, OPPORTUNITY, TESTING, DEBUG, the specified executioncontext, empty runasrole.
- Section 7 (governance and errors): pass. Every entry point is wrapped with `log.error` carrying record type, id and stack; the one deliberate rethrow in the user event (`PC_DEAL_UUID_DUPLICATE`) logs at audit first; the builder's catch marks the ledger row failed and rethrows. `getRemainingUsage` is checked before the project save, each task save, the links and the status change (floor 150), and in the ledger row loop (floor 50). No save in afterSubmit; `submitFields` and `lookupFields` for single-field work. Idempotency: ledger claim by external id, project and task lookup by external id, re-lookup after a failed save, status change only when still 24.
- Section 8 (security): pass. No secrets in source (`{custsecret_pc_relay}` only through `https.createSecureString`); `N/https` only, and the only host is the relay URL from `customrecord_navan_config`, required to be https; suitelet input validated for type, range, UUID v4 and action, unknown keys rejected, whole request rejected on any bad value; role checked against the allowed list; no eval, dynamic require or DOM manipulation; `runasrole` empty in both deployments; no PII in logs; SHA-256 for the payload hash; request id from `crypto.getRandomValues`.

Guesses (assumed, not stated in the plan or fix messages):
- `isBillingParty` counts every channel row, including retired (Inactive) ones, by searching without an `isinactive` filter.
- If a `pc_proj_{D}` project exists and a link points at a different project, state stays `conflict`.
- Ledger action string is `create_project` for every builder run; the requested action (create or resume) is in the payload hash `sha256("{action}:{oppId}")`. The readiness gate filters ledger rows by that action.
- A same request id with a different hash or a different opportunity is refused without touching the existing row.
- A create request on a partial state resumes, and a resume request on a fresh state creates (acceptance test (d) needs this).
- The suitelet answers `complete` and other refused states with success false, the reason in `error`, and the state and project id when known; the client reloads the page on `complete`.
- The user event shows the button, message or nothing only for statuses 24, plus 25 when the state is partial; the client module is attached only when a button is added.
- Status 24 to 25 only if the opportunity is still 24 when re-read.
- `startdate` is set only when `custbody_opp_kickoff_meet` holds a date.
- Assignee lines split the task hours to two decimals, and the last line takes the rounding remainder.
- Default task rate is `custbody_opp_rate`; default task hours as in the plan.
- The relay POST body is `{}`.
- The Deal UUID is required in the readiness list, since every external id depends on it.
- On XEDIT the user event always `record.load`s the opportunity.
- Extras beyond the packet: ledger `reopen(rowId)` and `findByOpp(...)`; `step` takes an optional third values argument and `refuse` an optional third details argument; channel lib exports `isBillingParty`; readiness `check` also returns `stateMessage`, `projectId`, `channel`, `jobTypeId`.
