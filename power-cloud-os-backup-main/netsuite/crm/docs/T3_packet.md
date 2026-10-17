# T3 delegation packet: CRM RESTlet, two roles, two deployments

> Written 2026-10-09 by the orchestrator (session bb920280) from PLAN.md T3, proposal section 15 and the T1/T2 code that already exists in this project. Gate 1 (plan approval) was given by Mike on 2026-10-09 for the whole plan. Deploy is gate 2 and is Mike's; nothing in this packet deploys. Two units, authored in parallel by `pc-sdf-author`: **Unit A** (the two role objects) and **Unit B** (the RESTlet file and its script object). Tests for Unit B come from `pc-code-chores` from the acceptance criteria in section 9, never from the author.

Project root: `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\`. Standards: `G:\Shared drives\Power Cloud OS\.claude\skills\netsuite-sdf\SKILL.md`. Three binding account rules (CAPABILITIES.md, 2026-10-09): never `getText` in `beforeSubmit` on a record that may arrive through REST or CSV (resolve labels through a search of the list, as `pc_crm_ledger_lib.js` does); no N module call or property read at module scope (string literals for record types, enums read inside functions); an SDF `customfieldfilter` comparing to a native body field key validates and then fails at deploy (not relevant to T3, listed for completeness).

The author edits nothing outside the files named in its unit. `manifest.xml`, `deploy.xml`, the ledger record XML and the T2 suitelet XML are orchestrator edits (section 8 of this packet).

## 1. Conventions already in the project (read these files first)

- `src/FileCabinet/SuiteScripts/PC/pc_crm_ledger_lib.js`: `claim(action, requestId, payloadHash, oppId, roleId)` returns `{rowId, existing, status, step, hash, oppId, result}`; `step(rowId, n, extraValues)`, `done(rowId, result)`, `fail(rowId, {name, message, step})`, `refuse(rowId, reason, details)`, `reopen(rowId)`, `findByOpp`, `ACTION_CREATE_PROJECT`. Status labels: pending, done, failed, refused.
- `src/FileCabinet/SuiteScripts/PC/pc_crm_project_builder_lib.js`: `build(oppId, requestId, {action, supportTypeId, failAfterStep, roleId})` claims its own ledger row (hash `sha256("{action}:{oppId}")`) and returns the result object, or `{refused: true, reason, state, missing, projectId?, projectUrl?}`. It throws after marking its row failed. **The RESTlet never claims a ledger row for `createProject`**; the builder owns that row.
- `src/FileCabinet/SuiteScripts/PC/pc_crm_types_lib.js`: `toJobType(engagementTypeId, supportTypeId)` returns `{jobTypeId}` or `{noProject: true}` or `{unmapped: true}`.
- `src/FileCabinet/SuiteScripts/PC/pc_crm_channel_lib.js`: `resolve(classId)` and `isBillingParty(customerId)`.
- `src/FileCabinet/SuiteScripts/PC/pc_crm_create_project_sl.js`: the input validation style (allowed keys, UUID v4 regex, id regex, whole request rejected on any bad value) and the response style to copy.
- `src/Objects/Scripts/customscript_pc_crm_create_project_sl.xml`: script parameter XML shape and deployment XML shape.

## 2. Confirmed existing references (source in brackets)

Opportunity (transaction, `opportunity`) body fields [PLAN.md T1 manifest list, T1 deploy log, SuiteQL on live records 2026-10-09]: `title`, `entity`, `class`, `partner`, `entitystatus`, `expectedclosedate`, `projectedtotal`, `memo`, `winlossreason`, `job`, `externalid`, `custbody_pc_referral_end_user` (End Client, Customer), `custbody_pc_referral_contact` (Contact), `custbody_pc_partner_contact` (Contact), `custbody_pc_billing_party` (Customer, written only by the user event), `custbody_pc_commercial_model`, `custbody_pc_signed_date` (Date), `custbody_pc_deal_uuid` (text 36), `custbody_pc_project_type` (engagement type, list `customlist_pc_proj_types`), `custbody_opp_rate` (number), `custbody_opp_next_contact` (Date), `custbody_opp_kickoff_meet` (Date), `custbody_opp_asana_proj` (text), `custbody_opp_onboarding_sheet` (text), `custbody_opp_principal`, `custbody_opp_proj_srcon`, `custbody_opp_proj_staff`, `custbody_opp_proj_leaddev` (Employee), `custbody_opp_task1_title`, `custbody_opp_task1_hrs`, `custbody_opp_task1_rate` (and `task2`, `task3`), `custbody_opp_proj_create` (Project).

Status ids [SALES_OS_PHASE1_VERIFICATION.md, 26 statuses read from the account]: open set `6, 7, 8, 9, 10, 11, 12, 18, 19, 21`; `24` Won - Awaiting Project; `25` Won - Ready for Kick Off; `23` Won - Kicked Off; `13` Closed Won; `14` Closed Lost. Nothing moves out of 13 or 14.

Project (`job`) [T1 deploy log]: `custentity_pc_travel_exclude` (Check Box), `isinactive`, `companyname`, `externalid`.

Customer (`customer`) [account practice, baseline scripts]: `isperson`, `companyname`, `url`, `phone`, `email`, `externalid`, `isinactive`, `stage` (LEAD, PROSPECT, CUSTOMER), `entityid`. No subsidiary is set (not readable under the connector role; no project script sets one).

Contact (`contact`) [SuiteQL column set, account]: `company`, `firstname`, `lastname`, `email`, `phone`, `title`, `externalid`, `isinactive`.

Phone call (`phonecall`) [SuiteQL `SELECT * FROM phonecall` 2026-10-09]: `title`, `message`, `phone`, `status` (value `COMPLETE`), `startdate`, `completeddate`, `company`, `contact`, `transaction`, `assigned`, `externalid`.

Saved search [listing and 3-row run 2026-10-09]: `customsearch901` "Navan Project Export", record type Project, public; result columns labeled `ID`, `Name`, `Email`.

Roles that exist and are not in this project [manifest]: `customrole_pc_mcp_ai_connection`. Standard role id for audiences: `ADMINISTRATOR`.

Custom records in this project [T1]: `customrecord_pc_op_ledger` (USEPERMISSIONLIST), `customrecord_pc_channel_map` (NONENEEDED), `customlist_pc_ol_status`.

Script parameter ids already taken in the account (do not reuse): `custscript_pc_sl_allowed_roles`, `custscript_pc_type_support_id`, `custscript_pc_fail_after_step`, `custscript_pc_ue_type_support_id`.

## 3. Unit A: the two roles (SDF `role` objects)

Files: `src/Objects/Roles/customrole_pc_crm_sales_write.xml`, `src/Objects/Roles/customrole_pc_crm_travel_read.xml`.

XML shape, copied from the role this account already holds (`customrole_pc_mcp_ai_connection`, imported from the account, so every element below is accepted by this account's SDF):

```xml
<role scriptid="customrole_pc_crm_sales_write">
  <centertype>BASIC</centertype>
  <coreadminpermission>F</coreadminpermission>
  <employeerestriction>NONE</employeerestriction>
  <employeeselectionunrestricted>T</employeeselectionunrestricted>
  <isinactive>F</isinactive>
  <issalesrole>F</issalesrole>
  <issinglesignononly>F</issinglesignononly>
  <issupportrole>F</issupportrole>
  <iswebserviceonlyrole>F</iswebserviceonlyrole>
  <name>PC | CRM Sales Write</name>
  <restrictbydevice>F</restrictbydevice>
  <restricttimeandexpenses>F</restricttimeandexpenses>
  <subsidiaryoption>ALL</subsidiaryoption>
  <subsidiaryviewingallowed>T</subsidiaryviewingallowed>
  <tfaduration>0</tfaduration>
  <tfarequired>OFF</tfarequired>
  <permissions>
    <permission>
      <permkey>TRAN_OPPRTNTY</permkey>
      <permlevel>FULL</permlevel>
    </permission>
    ...
  </permissions>
</role>
```

No `parentrolescriptid` (both roles start blank). `iswebserviceonlyrole` is F on purpose: Oracle, "OAuth 2.0 for RESTlets": roles marked Web Services Only cannot call RESTlets. No `recordrestrictions`. Custom record access is granted on the record side (orchestrator edit to `customrecord_pc_op_ledger.xml`), not in the role.

Permissions, exact keys and levels (ids confirmed on Oracle's "Permission Names and IDs" page 2026-10-09; levels are the plan's, with the three substitutions logged in `build_log.md`):

`customrole_pc_crm_sales_write` ("PC | CRM Sales Write"):

| permkey | permlevel | Why |
|---|---|---|
| TRAN_OPPRTNTY | FULL | opportunities: create, update, close |
| LIST_CUSTJOB | FULL | end clients (customers) |
| LIST_JOB | FULL | projects |
| LIST_CONTACT | FULL | end client contacts |
| LIST_TASK | FULL | plan T3 |
| LIST_CALL | FULL | logTouch phone calls |
| LIST_PARTNER | VIEW | partner lookups on referral deals |
| LIST_CLASS | VIEW | channel lookups |
| LIST_PROJECTTASK | FULL | project tasks from the builder |
| LIST_FIND | FULL | Perform Search (the plan's LIST_SEARCH) |
| LIST_EMPLOYEE | VIEW | staffing lookups |
| LIST_ITEM | VIEW | task service items (the plan's LIST_SERVICEITEM) |
| ADMI_LOGIN_OAUTH2 | FULL | OAuth 2.0 client credentials login |
| ADMI_RESTWEBSERVICES | FULL | plan T3 |
| ADMI_CUSTOMSCRIPT | VIEW | SuiteScript (the plan's ADMI_SUITESCRIPT); VIEW is the lowest level, raised only with a ledger note |

`customrole_pc_crm_travel_read` ("PC | CRM Travel Read"):

| permkey | permlevel |
|---|---|
| LIST_JOB | VIEW |
| LIST_FIND | FULL |
| LIST_EMPLOYEE | VIEW (added 2026-10-09 at acceptance: without it the loaded search has no Principal : Email column) |
| ADMI_LOGIN_OAUTH2 | FULL |
| ADMI_CUSTOMSCRIPT | VIEW |

Nothing else on either role: no `customrecord_navan_config` access, no employee access on the travel role (if the 901 Email column comes back empty under that role, LIST_EMPLOYEE VIEW is the first suspect and is added with a ledger note).

Acceptance for Unit A: `suitecloud project:validate` clean with the roles referenced from the ledger record's permission list and the RESTlet deployments' audiences.

## 4. Unit B: the RESTlet

Files: `src/FileCabinet/SuiteScripts/PC/pc_crm_api_rl.js` and `src/Objects/Scripts/customscript_pc_crm_api.xml`.

Header blocks, verbatim:

```js
/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
/**
 * PC | CRM API
 * Purpose: the one write path for the sales process: domain actions on end clients, opportunities, touches, close and project creation, idempotent by request id, plus the travel project list for the relay.
 * Plan task: T3 (Power Cloud NS/CRM/PLAN.md), proposal section 15
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: customdeploy_pc_crm_api_sales (customrole_pc_crm_sales_write), customdeploy_pc_crm_api_travel (customrole_pc_crm_travel_read)
 */
```

Dependencies: `N/record`, `N/search`, `N/runtime`, `N/error`, `N/log`, `N/url`, `N/crypto`, `N/encode`, `./pc_crm_ledger_lib`, `./pc_crm_project_builder_lib`, `./pc_crm_types_lib`, `./pc_crm_channel_lib`. No `N/https` (the RESTlet calls no host). Module scope holds literals only.

Entry points: `post(body)` does the work. `get`, `put`, `delete` return the refusal `{ok: false, error: {code: 'PC_API_BAD_REQUEST', message: 'POST required.'}}` (define all four so a wrong verb never produces a NetSuite error page).

### 4.1 Request and response

Request body (JSON object, parsed by NetSuite): `{action, requestId, payload}`. Allowed top-level keys: exactly these three. `action` is one of the eight names. `requestId` is a UUID v4 string (lowercased before use); required for every action except `resolveClient` and `listTravelProjects`, where it is optional and, when present, only echoed. `payload` is a JSON object (not an array, not null); its allowed keys depend on the action and any unknown key rejects the whole request.

Response, always a JSON object:

```
{
  ok: boolean,
  action: string|null,
  requestId: string|null,
  replayed: boolean,          // true when a stored ledger result was returned
  result: object|null,        // action result on ok
  error: null | { code: string, message: string, details: object }
}
```

Error codes: `PC_API_BAD_REQUEST` (shape, type, range, unknown key, bad verb), `PC_API_REFUSED` (role and deployment allowlist), `PC_API_DISABLED` (kill switch), `PC_API_REPLAY_MISMATCH` (request id reused with a different payload or action), `PC_API_IN_PROGRESS` (request id pending), `PC_API_REFUSED_STATUS` (status machine), `PC_API_NOT_READY` (createProject refused by the builder; details carry `state`, `missing`, `projectId`, `projectUrl`), `PC_API_NOT_FOUND` (a referenced record does not exist or is inactive), `PC_API_FAILED` (unexpected failure; details carry the ledger step reached and the error name, never the stack). Messages are written for a human reading a Chat thread; no stack traces, no PII.

### 4.2 Order of checks inside `post`

1. Shape: body is an object with only the three keys; `action` known; `requestId` valid when required; `payload` an object. Any failure returns `PC_API_BAD_REQUEST` and writes nothing.
2. Allowlist, before anything touches a record: `const role = String(runtime.getCurrentUser().roleId || '').toLowerCase()` and `const deployment = String(runtime.getCurrentScript().deploymentId || '').toLowerCase()`. Table:
   - `customdeploy_pc_crm_api_sales` + `customrole_pc_crm_sales_write`: `resolveClient`, `createEndClient`, `createOpportunity`, `updateOpportunity`, `logTouch`, `closeOpportunity`, `createProject`.
   - `customdeploy_pc_crm_api_travel` + `customrole_pc_crm_travel_read`: `listTravelProjects`.
   - Anything else, including Administrator, is refused with `PC_API_REFUSED` and one `log.audit` line (role, deployment, action; no payload).
3. Kill switch: script parameter `custscript_pc_api_disabled_actions` (TEXT, comma-separated action names, blank by default). A listed action returns `PC_API_DISABLED` before any record is touched.
4. Payload validation for the action (section 4.4). Whole request rejected on any bad value; nothing written.
5. Ledger claim for the five mutating actions (`createEndClient`, `createOpportunity`, `updateOpportunity`, `logTouch`, `closeOpportunity`): `payloadHash = sha256Hex(action + ':' + canonicalJson(payload))` where `canonicalJson` serializes with object keys sorted recursively (arrays keep their order). `ledgerLib.claim(action, requestId, payloadHash, oppId or null, role)`. On `existing`:
   - hash differs: `PC_API_REPLAY_MISMATCH`, the stored row untouched;
   - `done`: return the stored result with `replayed: true`;
   - `refused`: return the stored refusal (`result.reason` as the message, code `PC_API_REFUSED_STATUS` when the stored reason came from the status machine, otherwise `PC_API_NOT_READY`), `replayed: true`;
   - `pending`: `PC_API_IN_PROGRESS`;
   - `failed`: `ledgerLib.reopen(rowId)` and run the action again; every action is idempotent by external id, and `createEndClient` also reads `claimed.step`.
   `createProject` skips this step (the builder claims). `resolveClient` and `listTravelProjects` never touch the ledger.
6. Run the action inside try/catch. On success `ledgerLib.done(rowId, result)` (mutating actions) and return `ok: true`. On a thrown error: `log.error` with action, request id, opportunity id and stack; `ledgerLib.fail(rowId, {name, message, step})` when a row was claimed; return `PC_API_FAILED` with `{step, errorName}`.

Governance: 5,000 units. `ensureUsage(what)` with a floor of 200 before each record save and inside the contact loop and the search page loop. Never re-save a record just loaded for a read; use `search.lookupFields` and `record.submitFields` for single-field work.

### 4.3 Validation helpers

Copy the style of `pc_crm_create_project_sl.js`: `toId` (positive integer or numeric string, max 15 digits), `isUuidV4`, `isIsoDate` (`^\d{4}-\d{2}-\d{2}$` and a real calendar date; converted with `new Date(y, m - 1, d)`), `isText(value, max)` (string, trimmed length 1..max unless optional), `isMoney` (finite number at or above 0, two decimals or fewer after rounding), `onlyKeys(obj, allowed)`. Select ids are checked for existence with `search.lookupFields` on the record type named in 4.4 (`isinactive` must be F); a missing or inactive id returns `PC_API_NOT_FOUND` naming the field (not the value).

### 4.4 Actions

**resolveClient** (read-only, no ledger). Payload keys: `name` (text 2..100, optional), `emailDomain` (optional, lowercase, `^[a-z0-9.-]+\.[a-z]{2,}$`), at least one. Search `customer` with `isinactive is F` and: every whitespace token of `name` as a `companyname contains` filter (AND between tokens), OR `url contains emailDomain`, OR `email contains '@' + emailDomain`. Columns `companyname`, `entityid`, `stage`, `url`, `email`. Up to 10 rows, ordered by `companyname`. Result: `{candidates: [{id, stage, name, domain, isBillingParty}], count}` where `domain` is the host of `url` or the domain of `email` (null when neither), `isBillingParty` from `channelLib.isBillingParty(id)` (so a channel billing party is never picked as an end client by accident). Never creates anything.

**createEndClient**. Payload keys: `clientUUID` (UUID v4), `companyName` (text 1..83), `revenueSourceId` (class id, required; added 2026-10-09 at acceptance because the customer's Revenue Source `custentity_cus_rev_src` is mandatory in the account, and the revenue source is asked at intake, never defaulted), `website` (optional text 1..100), `phone` (optional text 1..21), `email` (optional text 5..254 containing one `@`), `contacts` (array, 0..10 items; each `{firstName (text 1..32), lastName (text 1..32), email (optional), phone (optional), title (optional text 1..100)}` with no other keys). Steps:
- Step 1: customer by `externalidstring is pc_client_{clientUUID}`; if absent create (`isperson` F, `companyname`, `url`, `phone`, `email`, `externalid`). On a save failure look up the external id again (a concurrent request may have won) before rethrowing. Ledger `step(rowId, 1, {})`.
- Step 1 + i for contact i (1-based): by `externalidstring is pc_contact_{clientUUID}_{i}`; if absent create (`company` = customer id, `firstname`, `lastname`, `email`, `phone`, `title`, `externalid`). Ledger step after each.
- Fault injection: script parameter `custscript_pc_api_fail_after_step` (INTEGER) throws `PC_TEST_FAULT` after that step, only when `companyName` starts with `ZZ TEST`.
- Result: `{customerId, created, contacts: [{index, id, created}]}`. A retry after a failure resumes at the first missing contact; nothing is created twice (external ids are the claim).

**createOpportunity**. Payload keys: `dealUUID` (UUID v4), `title` (text 1..200), `entityId` (customer id), `endClientId` (optional customer id; default `entityId`), `classId` (class id), `partnerId` (optional partner id), `referralContactId` (optional contact id), `engagementTypeId` (positive int, value of `customlist_pc_proj_types`), `commercialModelId` (optional positive int), `nextContact` (optional date), `expectedClose` (optional date), `principalId`, `seniorConsultantId`, `staffConsultantId`, `leadDeveloperId` (optional employee ids), `rate` (optional money), `entityStatusId` (required, must be in the open set; no silent account default), `memo` (optional text 1..999). `billingPartyId` is **not** a key; the user event sets Billing Party from the class on save (its deployment context includes RESTLET). Rules: `referralContactId` requires `partnerId` and the contact's `company` must equal `partnerId` (lookupFields on `contact`), otherwise `PC_API_BAD_REQUEST` ("Referral Contact does not belong to the Partner"). `endClientId` must not be a channel billing party (`channelLib.isBillingParty`), otherwise `PC_API_BAD_REQUEST`. Idempotency: look up `opportunity` by `externalidstring is pc_opp_{dealUUID}` (filter `mainline is T`); if found return `{opportunityId, created: false}` without writing. Otherwise `record.create({type: 'opportunity'})` and set `externalid`, `title`, `entity`, `custbody_pc_referral_end_user`, `class`, `partner`, `custbody_pc_referral_contact`, `custbody_pc_project_type`, `custbody_pc_commercial_model`, `custbody_opp_next_contact`, `expectedclosedate`, the four staffing fields, `custbody_opp_rate`, `custbody_pc_deal_uuid` = dealUUID, `entitystatus` (only when given), `memo`; save with `ignoreMandatoryFields: false`; on a save failure look the external id up again before rethrowing. Result `{opportunityId, created: true}`.

**updateOpportunity**. Payload keys: `opportunityId`, `fields` (object, at least one key, only these): `entityStatusId`, `nextContact` (date), `expectedClose` (date), `projectedTotal` (money), `task1Title`/`task2Title`/`task3Title` (text 1..200 or `''` to clear), `task1Hours`/`task2Hours`/`task3Hours` (number at or above 0), `task1Rate`/`task2Rate`/`task3Rate` (money), `rate` (money), `principalId`, `seniorConsultantId`, `staffConsultantId`, `leadDeveloperId` (employee id or `''` to clear), `commercialModelId`, `asanaUrl` (text 1..300), `onboardingSheet` (text 1..300), `kickoffDate` (date). Status rule, read the current `entitystatus` with lookupFields first: allowed when current and new are both in the open set, or current is 25 and new is 23 and a kickoff date is in this call or already on the record; every other transition (including 13, 14, 24, and anything from 13 or 14) returns `PC_API_REFUSED_STATUS` and the ledger row is marked refused with that reason. The opportunity must exist (`PC_API_NOT_FOUND`). Write everything in one `record.submitFields` (`enableSourcing: false`, `ignoreMandatoryFields: true`). Result `{opportunityId, updated: [field ids written]}`.

**logTouch**. Payload keys: `opportunityId`, `title` (text 1..300), `note` (optional text 1..4000), `occurredAt` (optional date, default today), `nextContact` (optional date), `contactId` (optional contact id). Phone call by `externalidstring is pc_touch_{requestId}`; if absent create `phonecall` with `externalid`, `title`, `message` = note, `startdate` = occurredAt, `status` = `'COMPLETE'`, `company` = the opportunity's `entity` (lookupFields), `contact`, `transaction` = opportunityId. Then, when `nextContact` is given, `record.submitFields` on the opportunity `custbody_opp_next_contact`. Result `{callId, created, nextContactSet}`. Replay-safe by the external id.

**closeOpportunity**. Payload keys: `opportunityId`, `outcome` (`'won'` or `'lost'`), `signedDate` (date, required when won), `winLossReasonId` (positive int, required when lost), `memo` (optional text 1..999). Read current `entitystatus` and `custbody_pc_project_type`; current must be in the open set, otherwise `PC_API_REFUSED_STATUS` (a status-13 record is refused). Won: `typesLib.toJobType(engagementType, supportTypeId)`; `noProject` sets `entitystatus` 13, otherwise 24; always sets `custbody_pc_signed_date`. Lost: sets 14, `winlossreason`, `memo`. One `submitFields`. Result `{opportunityId, status, noProject}`.

**createProject**. Payload keys: `opportunityId` only. Calls `builderLib.build(opportunityId, requestId, {action: 'create', supportTypeId, failAfterStep, roleId: role})`. `refused` maps to `PC_API_NOT_READY` with the builder's reason and details; a thrown error maps to `PC_API_FAILED` (the builder already marked its row). Success returns the builder result as `result`.

**listTravelProjects** (read-only, no ledger). Payload: `{}` (no keys). Search id from script parameter `custscript_pc_travel_search_id` (TEXT); blank means `customsearch901`. `search.load({id})`, then `runPaged({pageSize: 1000})`, walking every page with the usage check. Per result: `projectId = parseInt(result.id)`; `name` from the column whose `label` equals `Name` (case-insensitive), falling back to the first column whose `name` is `companyname`, `entityid` or `altname`; `approverEmail` from the column labeled `Email`, falling back to the first column whose `name` contains `email`; blank becomes `null`. If no Name column can be found, throw `PC_API_FAILED` with message "Travel search has no Name column" (contract broken, never guess). After collecting, remove every project whose `custentity_pc_travel_exclude` is T: one `job` search `[custentity_pc_travel_exclude is T]`, columns `internalid`, bounded to 1000 rows, applied **after** the run so the saved search's own criteria are untouched. Sort the remaining rows by `projectId` ascending (deterministic). Result `{searchId, projects: [{projectId, name, approverEmail}], count, excluded}`.

### 4.5 Script object `customscript_pc_crm_api.xml`

```xml
<restlet scriptid="customscript_pc_crm_api">
  <name>PC | CRM API</name>
  <notifyowner>T</notifyowner>
  <scriptfile>[/SuiteScripts/PC/pc_crm_api_rl.js]</scriptfile>
  <scriptcustomfields>
    custscript_pc_api_support_type_id  INTEGER  "PC | Support Type ID"       (same help text as custscript_pc_type_support_id)
    custscript_pc_api_fail_after_step  INTEGER  "PC | Fail After Step (Test)" (honored only for ZZ TEST records)
    custscript_pc_travel_search_id     TEXT     "PC | Travel Search ID"       (blank = customsearch901)
    custscript_pc_api_disabled_actions TEXT     "PC | Disabled Actions"       (comma-separated action names; the kill switch)
  </scriptcustomfields>
  <scriptdeployments>
    customdeploy_pc_crm_api_sales:  allroles F, allemployees F, allpartners F, audslctrole [scriptid=customrole_pc_crm_sales_write], isdeployed T, loglevel DEBUG, runasrole empty, status TESTING, title "PC | CRM API (sales)"
    customdeploy_pc_crm_api_travel: same with audslctrole [scriptid=customrole_pc_crm_travel_read], title "PC | CRM API (travel)"
  </scriptdeployments>
</restlet>
```

Write the real XML with the same element shape as `customscript_pc_crm_create_project_sl.xml` (accesslevel 2, searchlevel 2, displaytype NORMAL, isformula F, ismandatory F, storevalue T on each parameter). Both deployments stay TESTING until T8 (plan). `runasrole` empty.

## 5. Security (orchestrator ticks these at review)

No secrets, hosts, or account ids in the file. No `N/https`. Every payload value type-, length- and range-checked; unknown keys reject the request. No `eval`, no dynamic require. No PII in logs: log action, request id, internal ids, error names; never titles, names, emails, phone numbers, payloads or stacks in `audit` lines (stacks only in `log.error`). SHA-256 for the hash. Role check by script id string, deployment check by script id string, both before any record access.

## 6. Governance

RESTlet limit 5,000 units. Floors: 200 before each save, in the contact loop, in the search page loop. One `record.load` at most per action (none in most). `submitFields` and `lookupFields` for single-field work.

## 7. What the author must not decide

Any open design choice goes under `Open decisions` in the handback with a `// PC-DECISION:` marker; the file is written up to the choice. Do not add actions, fields, hosts, or permissions. Do not change the ledger, builder, types or channel libraries.

## 8. Orchestrator edits after the handbacks (not the author's)

- `src/Objects/Records/customrecord_pc_op_ledger.xml`: add `[scriptid=customrole_pc_crm_sales_write]` FULL and `[scriptid=customrole_pc_crm_travel_read]` VIEW to `<permissions>`.
- `src/Objects/Scripts/customscript_pc_crm_create_project_sl.xml`: audience `ADMINISTRATOR|[scriptid=customrole_pc_crm_sales_write]`, `runasrole` `[scriptid=customrole_pc_crm_sales_write]` (plan T2/T3; reason: the suitelet writes the ledger and creates projects and tasks, which a seller's own role cannot, and the narrow role replaces the legacy suitelet's Execute as Administrator).
- `src/deploy.xml`: add `~/Objects/Roles/*`.
- `src/manifest.xml`: features as validate requires (candidates: RESTWEBSERVICES, OAUTH2); nothing added until validate asks.

## 9. Acceptance criteria (the test file `__tests__/pc_crm_api_rl.test.js`, one `it` per line, written by pc-code-chores)

- A1: listTravelProjects under the travel deployment and travel role returns the saved search rows minus projects flagged Exclude From Travel Lists, in internal id ascending order, every row with an approverEmail string or null.
- A2: every action other than listTravelProjects under the travel deployment and travel role, sent as a structurally valid request, is refused with PC_API_REFUSED and no record is read or written.
- A3: listTravelProjects under the sales deployment and sales role is refused with PC_API_REFUSED; any unknown role or deployment pair (including Administrator) is refused.
- A4: updateOpportunity to status 13, 14 or 24 is refused with PC_API_REFUSED_STATUS and the opportunity is not written (the ledger row records the refusal).
- A5: updateOpportunity from 25 to 23 is accepted only when a kickoff date is in the call or already on the record.
- A6: closeOpportunity won on a status-13 record is refused with PC_API_REFUSED_STATUS; closeOpportunity won on an open status sets the signed date and status 24, or 13 when the engagement type has no project; closeOpportunity lost sets 14 with the reason.
- A7: createOpportunity twice with one request id and the same payload returns one opportunity id and the second response is marked replayed.
- A8: createOpportunity twice with two request ids and the same deal UUID returns the same id and creates one record (external id pc_opp_{D}).
- A9: createEndClient with a forced failure after the customer save marks the ledger row failed; a retry with the same request id resumes and creates the contacts without creating a second customer.
- A10: the same request id with a different payload or action is refused with PC_API_REPLAY_MISMATCH and the stored row is untouched.
- A11: resolveClient never creates a record and never writes a ledger row.
- A12: an action listed in the disabled-actions parameter is refused with PC_API_DISABLED before any record access; a non-POST verb, a malformed body or an unknown payload key returns PC_API_BAD_REQUEST and writes nothing.
