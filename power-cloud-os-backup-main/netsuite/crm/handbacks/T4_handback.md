## Handback (T4, class propagation user event, fix pass 1)

Files read: PLAN.md (T4 and conventions), netsuite-sdf SKILL.md (in packet), src/Objects/Scripts/customscript_pc_crm_channel_map_ue.xml, and my own two files for the fix pass.

Files written (this unit only):
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\src\FileCabinet\SuiteScripts\PC\pc_crm_class_propagate_ue.js
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\src\Objects\Scripts\customscript_pc_crm_class_propagate_ue.xml
- C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\handbacks\T4_handback.md

### Changes in the fix pass
1. Time entry project test: the entity `type` lookup is gone. `getProjectId` now only returns the header `job` (invoice, credit memo) or `customer` (time entry) as a candidate id. `getProjectClass` does one `search.lookupFields({ type: search.Type.JOB, ... })` inside its own try/catch; a customer that is not a project is detected by that lookup throwing or returning nothing, and the function returns null so the record is untouched. The catch logs at `audit` (record not changed on purpose; commented in the code). One lookup instead of two, no unconfirmed column.
2. Execution contexts: USEREVENT removed from all three deployments. Nine remain.

### Existing references used
- `custentity_cus_rev_src` (JS PROJECT_CLASS_FIELD): source is the packet's confirmed facts (also in PLAN.md T1 manifest list). Needs a manifest `<object>` entry.
- Header `class`, item sublist `item` field `class`, invoice and credit memo `job`, time entry `customer`: source is the packet.
- No UNCONFIRMED ids. One UNCONFIRMED behavior: what `search.lookupFields` on `search.Type.JOB` does when given a non-project customer id (throw or empty); both are handled.

### IDs this unit creates
- customscript_pc_crm_class_propagate_ue, usereventscript, "PC | Class Propagation" (22 chars), pc_crm_class_propagate_ue.js
- customdeploy_pc_crm_class_prop_inv (INVOICE)
- customdeploy_pc_crm_class_prop_cm (CREDITMEMO)
- customdeploy_pc_crm_class_prop_tb (TIMEBILL)

### Manifest and deploy.xml needs (not edited)
- manifest.xml objects: `custentity_cus_rev_src` (already in the plan T1 list; confirm present).
- manifest.xml features: nothing added by this unit. The TIMEBILL deployment depends on the Time Tracking feature being enabled in the account; add `TIMETRACKING` under features only if validate asks. `PROJECTMANAGEMENT` is already planned in T1.
- deploy.xml: add `~/FileCabinet/SuiteScripts/PC/pc_crm_class_propagate_ue.js` and `~/Objects/Scripts/customscript_pc_crm_class_propagate_ue.xml` (or rely on existing globs).

### Execution contexts (all three deployments, identical)
USERINTERFACE|WEBSERVICES|RESTWEBSERVICES|RESTLET|CSVIMPORT|MAPREDUCE|SCHEDULED|WORKFLOW|SUITELET. Why: UI (manual entry and Invoice Billable Customers), RESTLET and RESTWEBSERVICES (Navan and Uber RESTlet), WEBSERVICES (SOAP), CSVIMPORT (time entry CSV), MAPREDUCE (Task to Invoice and the integration map/reduce), SCHEDULED, SUITELET and WORKFLOW (script-created records per the plan). USEREVENT omitted per the orchestrator (a user event never fires for a record another user event creates). I could not verify the full SDF enum from here and added nothing beyond the orchestrator's list.

### Open design choices
- Resolved and accepted: on XEDIT only the header class is written; item lines are not filled on XEDIT (`// PC-DECISION:` marker stays in the code, default header only).
- Time entry project test is now the JOB lookup failure path (decided by the orchestrator).

### Observed
- Invoices from billable time or expenses (Invoice Billable Customers) also carry `time` and `expcost` sublist lines; only the `item` sublist is filled, as specified. Filling class there would be a plan change.
- On CREATE, `newRecord.id` is empty in beforeSubmit, so the audit line logs `new` for the id.
- TESTING status runs only for the deployment owner (the SDF auth user), so integrations and other users will not trigger it until RELEASED. Plan the tests accordingly.
- Logging: every time entry whose customer is not a project writes one audit line from the catch (in an account with many non-project time entries this could be noisy). Option: downgrade to `log.debug` if the execution log fills up. A genuine lookup failure (for example a permission error) is also caught here and looks the same as "not a project"; the audit line carries the error name.
- PLAN.md T4 names are being aligned by the orchestrator to the `pc_crm_*` names.

### Not fixed, needs a decision
n/a (no validate output received).

### Self-check
Section 2:
- PC | prefix on the script name: pass
- Name 22 chars, within the 40 cap: pass
- scriptid matches the object file name: pass
- Deployment ids `customdeploy_pc_` with record-type suffix: pass
- JS file name pattern and PC/ location: pass

Section 3:
- Both header blocks verbatim from the packet, unchanged in the fix pass: pass
- 2.1 / UserEventScript / SameAccount: pass
- define with explicit dependency array: pass
- No var, const/let only: pass

Section 4:
- Explicit audience (allroles T) on all three deployments: pass
- status TESTING, loglevel DEBUG, isdeployed T on all three: pass
- One deployment per record type with its own scriptid: pass
- runasrole empty: pass
- executioncontext explicit (nine contexts, USEREVENT removed, justified above): pass
- scriptfile matches the file written: pass

Section 7:
- Entry point wrapped in try/catch with log.error carrying type, id and stack, no rethrow (never blocks the save): pass
- Inner lookup catch is deliberate, commented, and logs at audit (permitted form): pass
- getRemainingUsage guard before the lookup and inside the line loop (floor 100): pass
- No save in the script; values set on newRecord in beforeSubmit; reads via search.lookupFields; record.load only on XEDIT: pass
- Idempotent, set values never overwritten, lookups skipped when nothing to fill: pass

Section 8:
- No secrets or account ids: pass
- No N/http or N/https: pass
- No eval or dynamic require: pass
- runasrole empty: pass
- No PII in logs (record type, id, class id, counts, error name): pass
- Audience allroles matches the plan: pass
- Items 3, 7, 9, 10 not applicable (no Suitelet or RESTlet input, no role, no crypto, no cards): pass

### Guesses
- JOB lookup on a non-project id throws or returns an empty result (both handled). Not confirmed against the account.
- lookupFields on search.Type.JOB returns `custentity_cus_rev_src` as `[{value, text}]`; the code also tolerates a scalar.
- Time entry header `class` is settable through newRecord.setValue in beforeSubmit.
- Treated 0 and '0' as empty alongside null and ''.
