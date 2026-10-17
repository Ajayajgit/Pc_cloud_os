## Handback
Files read: `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\src\FileCabinet\SuiteScripts\PC\pc_crm_create_project_sl.js`, `...\src\Objects\Scripts\customscript_pc_crm_create_project_sl.xml`, the `netsuite-sdf` skill (supplied in the prompt). Did not read `manifest.xml` or `deploy.xml`; not asked to edit them.

Files written:
- `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\src\FileCabinet\SuiteScripts\PC\pc_crm_search_installer_sl.js`
- `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\src\Objects\Scripts\customscript_pc_crm_search_installer_sl.xml`
- this handback

Registration needed (orchestrator, not done by me): add the script object to `deploy.xml` (`~/Objects/Scripts/customscript_pc_crm_search_installer_sl.xml`) if `deploy.xml` lists objects individually. No manifest dependency entries are needed: the XML references no non-project objects (`ADMINISTRATOR` is a standard role).

IDs created:
- customscript_pc_crm_search_installer_sl, Suitelet, src/Objects/Scripts/customscript_pc_crm_search_installer_sl.xml (name "PC | Saved Search Installer", 27 chars)
- customdeploy_pc_crm_search_installer_sl, scriptdeployment, same file
- (the six saved search ids below are created at runtime by the Suitelet, not by SDF)

Deployment XML as written:
```xml
<scriptdeployment scriptid="customdeploy_pc_crm_search_installer_sl">
  <allemployees>F</allemployees>
  <allpartners>F</allpartners>
  <allroles>F</allroles>
  <audslctrole>ADMINISTRATOR</audslctrole>
  <isdeployed>T</isdeployed>
  <isonline>F</isonline>
  <loglevel>DEBUG</loglevel>
  <status>TESTING</status>
  <title>PC | Saved Search Installer</title>
</scriptdeployment>
```
No `runasrole` element. No script parameters.

Definition array (module scope, plain data only; abridged to the shape, values exactly as in the file):
- 1 `customsearch_pc_opp_no_end_client`, type `'transaction'`: filters type anyof Opprtnty; mainline is T; entitystatus anyof 6,7,8,9,10,11,12,18,19,21,24,25,23; custbody_pc_referral_end_user anyof @NONE@. Columns internalid, tranid ASC, title, entity, entitystatus, class, custbody_pc_billing_party, datecreated.
- 2 `customsearch_pc_proj_sub_no_partner_contact`, type `'job'`: isinactive is F; entitystatus anyof 2,5,17; parent anyof 136,198,514,6; custentity_pc_partner_contact anyof @NONE@. Columns internalid, entityid, companyname ASC, parent, entitystatus, jobtype, custentity_proj_af_contact, datecreated.
- 3 `customsearch_pc_inv_no_class_90d`, type `'transaction'`: type anyof CustInvc; trandate onorafter daysago90; formulanumeric equalto 1 with the CASE formula from the prompt (verbatim). Columns internalid, tranid, trandate DESC, entity, job, mainline, item, class, amount.
- 4 `customsearch_pc_recon_links`, type `'transaction'`: type anyof Opprtnty; mainline is T; custbody_opp_proj_create noneof @NONE@; job anyof @NONE@; class noneof 5,6,110,3. Columns tranid ASC, title, entity, class, custbody_opp_proj_create, job.
- 5 `customsearch_pc_recon_status24`, type `'transaction'`: type anyof Opprtnty; mainline is T; entitystatus anyof 24; custbody_opp_proj_create noneof @NONE@. Columns tranid ASC, title, custbody_opp_proj_create.
- 6 `customsearch_pc_recon_ledger`, type `'customrecord_pc_op_ledger'`: custrecord_pc_ol_status anyof 1,3; formulanumeric equalto 1 with `CASE WHEN {created} < SYSDATE - 1/24 THEN 1 ELSE 0 END`. Columns name, custrecord_pc_ol_action, custrecord_pc_ol_opp_id, custrecord_pc_ol_step, custrecord_pc_ol_status, custrecord_pc_ol_error, created ASC.

Implementation notes:
- Each filter is stored as `[name, operator, valuesArray]` or `[name, operator, valuesArray, formula]`. For uniformity ALL six searches build their filters as `search.createFilter` objects, not only 3 and 6 (the prompt allowed nested arrays for the other four). Semantically the same; one code path.
- `search.Sort.ASC/DESC` and `search.createColumn/createFilter` are used only inside functions called from `onRequest`; nothing from a NetSuite module is touched at module scope. `USAGE_FLOOR` is a plain constant.
- No `getText`. No PII in logs (search ids, error name and message only). `log.error` per failed definition: title is the search id, details is `name: message`, no stack. The outer catch logs the stack but returns only a generic message.
- Non-GET returns `{ok:false, error:'GET required.'}` as the body. Both branches write output.
- A `search.load` throw of any kind is treated as "absent" and logged at debug. If the cause was something other than "not found" (for example permission), the create path then fails on its own and is reported as `failed`.
- Governance floor (100) is checked before each `save()`; a plain `Error` is thrown if below, caught by the per-definition catch and reported as `failed`. All six saves are far under the 1,000-unit Suitelet limit in practice (about 20 units each is an estimate, not confirmed).

Unconfirmed references (all come from the T5 sheet per the prompt, none verified by me; ledger status Pending 1 and Failed 3 verified by the orchestrator today):
- Transaction fields: `custbody_pc_referral_end_user`, `custbody_pc_billing_party`, `custbody_opp_proj_create` (searches 1, 4, 5)
- Project fields: `custentity_pc_partner_contact`, `custentity_proj_af_contact` (search 2)
- Ledger fields: `custrecord_pc_ol_status`, `_action`, `_opp_id`, `_step`, `_error`, record type `customrecord_pc_op_ledger` (search 6)
- Entity status ids 6,7,8,9,10,11,12,18,19,21,24,25,23 and 2,5,17; parent project ids 136,198,514,6; class ids 5,6,110,3 (all from the T5 sheet)
- Whether the ledger record exposes `created` as a searchable column name and whether `jobtype`, `companyname`, `entityid` are valid Job search column names (standard in the NetSuite UI, not confirmed here).
- Whether `search.Type`-free string `'job'` is accepted by `search.create` in this account (Oracle documents `job` as a search type string; not exercised).

Open decisions: none (no `PC-DECISION` markers).

Not fixed, needs a decision: n/a

Observed:
- Possible trap for CAPABILITIES.md, unverified: `Search.id` assignment followed by `save()` on a search whose id already exists would fail; the load-first check guards this, but a search that exists but is not loadable by the installer's role (not public, owned by another user) would be reported `failed`, not `exists`.
- Suitelet response cannot carry an HTTP status, so a client cannot tell 405 from 200 except by the JSON body.

Self-check (netsuite-sdf sections 2, 3, 4, 7, 8):
- Section 2 naming: pass (scriptid, deploy id and file name agree; `PC | ` prefix; script name 27 chars, under 40; search ids and titles follow `customsearch_pc_` and `PC | `).
- Section 3 header: pass (both blocks copied verbatim in shape from the create-project suitelet; `@NApiVersion 2.1`, `Suitelet`, `SameAccount`; no `var`).
- Section 4 deployment: pass (explicit audience `allroles` F with `audslctrole` ADMINISTRATOR; `status` TESTING, `loglevel` DEBUG, `isdeployed` T, `isonline` F; no `runasrole`; `scriptfile` matches the file path).
- Section 7 governance and errors: pass (entry point wrapped; every catch logs via `log.error`, except the `searchExists` catch which logs at `log.debug` on purpose because absence is the expected path and it is explained in a comment; remaining-usage check before every save; idempotent by load-first). Note the strict "no debug-only catch" rule: this one is a deliberate expected-absence path, flagged here for the orchestrator to accept or change.
- Section 8 security: pass (no secrets, no `N/http`, no `eval`, no external hosts, no request input read so nothing to sanitize, no `runasrole`, no PII in logs, audience limited to Administrator).

Guesses: all six searches use `search.createFilter` objects (one code path); the filter values for `type`, `mainline`, `isinactive` are passed as one-element arrays (`['T']`) as `createFilter` expects `values`; the `runasrole` element is omitted instead of written empty; the response on the outer-catch path is a generic message; `deploy.xml` registration is left to the orchestrator because I did not read it.
