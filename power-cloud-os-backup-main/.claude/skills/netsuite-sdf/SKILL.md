---
name: netsuite-sdf
description: Power Cloud authoring standards for SuiteCloud SDF objects and SuiteScript 2.1. Auto-loads for SuiteScript, SDF projects, and NetSuite customizations. The authoring contract the pc-sdf-author worker follows and the orchestrator reviews against.
---

# NetSuite SDF authoring standards

The contract between two parties. The **worker** (`pc-sdf-author`, a delegated Sonnet session) authors one SDF object or one SuiteScript file against these rules. The **orchestrator** (the session model running the `execution` skill) writes the delegation packet, runs validate and tests, reviews against these rules, and owns everything that touches an account. Scaffolding is `sdf-scaffold`; deploying is `sdf-deploy`; the per-task loop, the two human gates, and the execution-plan block are the `execution` skill. This file is only how the objects and scripts are written.

Sources: `sdf-scaffold`, `sdf-deploy`, `execution`, `../../CAPABILITIES.md` (SuiteCloud SDF section), `../../WRITING_STANDARDS.md`, NetSuite SAFE Guide 2026.1 / 2026.2, and Oracle's NetSuite Help Center (https://docs.oracle.com/en/cloud/saas/netsuite/index.html). Where this file and Oracle disagree, Oracle wins; fix this file.

## 1. Project layout and file naming

One account customization project per client, at `{Client}/execution/sdf/` (custom projects: `{Client}/{ProjectName}/execution/sdf/`). A second project only for a genuinely separate deploy target, and only when the plan says so.

| Path | Holds |
|---|---|
| `execution/sdf/src/Objects/{type}/` | SDF object XML, one file per object, grouped by object type (`Scripts/`, `Records/`, `Fields/`, `Roles/`, `Forms/`, `SavedSearches/`, `Workflows/`) |
| `execution/sdf/src/AccountConfiguration/features.xml` | Feature enablement only (see the deploy.xml `<configuration>` path in the test fixture) |
| `execution/sdf/src/FileCabinet/SuiteScripts/PC/` | Every SuiteScript file Power Cloud writes; nothing outside `PC/` |
| `execution/sdf/__tests__/` | Jest unit tests (section 9); never under `src/`, because `deploy.xml` uploads all of `src/FileCabinet/` to the account |
| `execution/build_log.md` | Deploy and test results, in the `sdf-deploy` shape |

Script file names: `pc_{area}_{type}.js`, lowercase, underscores, where `{area}` is the process area or work-item code from the execution plan and `{type}` is the script type abbreviation.

| Abbreviation | Script type |
|---|---|
| `ue` | User Event |
| `cs` | Client Script |
| `sl` | Suitelet |
| `rl` | RESTlet |
| `ss` | Scheduled Script |
| `mr` | Map/Reduce |
| `mu` | Mass Update |
| `wa` | Workflow Action |
| `lib` | Custom module (no entry points) |

Example: `pc_o2c_so_line_audit_ue.js`, its object at `src/Objects/Scripts/customscript_pc_o2c_so_line_audit_ue.xml`, its test at `__tests__/pc_o2c_so_line_audit_ue.test.js`. The object file name equals its `scriptid`.

Check (orchestrator, from `execution/sdf/`): every `.js` under `src/FileCabinet/SuiteScripts/` sits under `PC/` and matches `^pc_[a-z0-9_]+_(ue|cs|sl|rl|ss|mr|mu|wa|lib)\.js$`; every file under `src/Objects/` is named after the `scriptid` attribute inside it. Sweep `desktop.ini` before every validate and deploy (`sdf-deploy`).

## 2. Naming

Display names carry the `PC | ` prefix so anyone in the account can see what Power Cloud added. Script IDs carry `pc_` after NetSuite's mandatory type prefix.

| Object | Display name | Script ID |
|---|---|---|
| Script record | `PC | SO Line Audit` | `customscript_pc_o2c_so_line_audit_ue` |
| Script deployment | (none; title optional) | `customdeploy_pc_o2c_so_line_audit_ue` (add `_2`, `_3` or the record type when a script has several) |
| Custom record type | `PC | Removed Line Log` | `customrecord_pc_removed_line_log` |
| Custom record field | `PC | Source Transaction` | `custrecord_pc_rll_source_tran` |
| Transaction body field | `PC | Hold Reason` | `custbody_pc_hold_reason` |
| Transaction column field | `PC | Original Qty` | `custcol_pc_original_qty` |
| Entity field | `PC | Credit Reviewer` | `custentity_pc_credit_reviewer` |
| Item field | `PC | Season Code` | `custitem_pc_season_code` |
| Custom list | `PC | Hold Reasons` | `customlist_pc_hold_reasons` |
| Role | `PC | Warehouse Lead` | `customrole_pc_warehouse_lead` |
| Saved search | `PC | Open SOs Missing Class` | `customsearch_pc_open_so_no_class` |
| Workflow | `PC | SO Approval` | `customworkflow_pc_so_approval` |

Rules:

- **Script record names are capped at 40 characters** (Oracle's SDF XML reference for `suitelet`, `mapreducescript` and the other script objects: "This field value can be up to 40 characters long"). `PC | ` uses five, so the descriptive part gets 35. `PC | Sales Order Removed Line Audit and Log` (43) fails; `PC | SO Removed Line Audit` (25) passes. Custom record type names carry the same 40-character cap (Oracle, Entering Name and Display Settings).
- Script IDs are lowercase, underscores only, and stable once deployed. Renaming a deployed `scriptid` creates a second object; it does not rename the first.
- The `scriptid` in the XML, the object file name, and the `@NScriptType` in the JS must agree with each other and with the execution-plan block.

Check: `grep -L 'PC | ' src/Objects/**/*.xml` returns nothing; every `scriptid="` in `src/Objects/` matches `^(customscript|customdeploy|customrecord|customlist|customrole|customsearch|customworkflow|custbody|custcol|custentity|custitem|custrecord)_pc_`; every `<name>` inside a script object is 40 characters or fewer.

## 3. SuiteScript 2.1 file header

Every script file opens with two blocks. The first is the JSDoc block that **NetSuite parses when the file is uploaded and that SDF validates**: `@NApiVersion` and `@NScriptType` are required on every entry point script, and their values must be valid (Oracle, SuiteScript 2.x JSDoc Validation). The second is the Power Cloud provenance block.

```js
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**
 * PC | SO Line Audit
 * Purpose: log every line removed from a Sales Order on edit to PC | Removed Line Log.
 * Plan task: O2C.3 ({Client}_Execution_Plan.md)
 * Author: Power Cloud Consulting, 2026-09-21
 * Deployments: customdeploy_pc_o2c_so_line_audit_ue (SALESORDER, afterSubmit)
 */
define(['N/record', 'N/log', 'N/runtime'], (record, log, runtime) => {
    ...
});
```

Rules:

- `@NApiVersion` is always `2.1`, never `2.x` (Oracle: `2.x` resolves to 2.0 unless an account preference says otherwise, so the same file can run on different engines in different accounts).
- `@NScriptType` is one of Oracle's documented values: `UserEventScript`, `ClientScript`, `Suitelet`, `Restlet`, `ScheduledScript`, `MapReduceScript`, `MassUpdateScript`, `WorkflowActionScript`, `Portlet`, `BundleInstallationScript`. Case matters.
- `@NModuleScope` is `SameAccount` (Oracle's default, and required for 2.1 class syntax inside a bundle). `Public` or `TargetAccount` only when the plan names another consumer of the module.
- A custom module (`_lib.js`) has `@NApiVersion` and `@NModuleScope` and no `@NScriptType`.
- Use `define` with an explicit dependency array; `let`/`const`, never `var`; arrow functions and template literals are fine in 2.1 (SAFE Guide, JavaScript Best Practices).
- **The header block is never edited by the worker.** The orchestrator writes both blocks into the delegation packet and the worker copies them verbatim. A worker that believes the header is wrong stops and says so (section 10). Any header change is an orchestrator change, and it re-checks the XML `scriptfile` and `@NScriptType` against the plan when it makes one.

Check: `head -6` of every `pc_*.js` contains `@NApiVersion 2.1`; `grep -n '@NApiVersion 2\.x\|@NApiVersion 2\.0'` returns nothing; `grep -n '\bvar\b'` returns nothing.

## 4. Deployment XML rules

`scriptdeployment` (Oracle, SDF XML reference) requires `status` and `recordtype` (record-triggered types); `isdeployed`, `loglevel`, the audience booleans, `audslctrole`, `runasrole`, `executioncontext` and `eventtype` are optional and default in ways that bite.

```xml
<usereventscript scriptid="customscript_pc_o2c_so_line_audit_ue">
  <name>PC | SO Line Audit</name>
  <notifyowner>T</notifyowner>
  <scriptfile>[/SuiteScripts/PC/pc_o2c_so_line_audit_ue.js]</scriptfile>
  <scriptdeployments>
    <scriptdeployment scriptid="customdeploy_pc_o2c_so_line_audit_ue">
      <recordtype>SALESORDER</recordtype>
      <status>TESTING</status>
      <loglevel>DEBUG</loglevel>
      <isdeployed>T</isdeployed>
      <allroles>T</allroles>
      <runasrole></runasrole>
      <executioncontext>USERINTERFACE|WEBSERVICES|RESTLET|CSVIMPORT</executioncontext>
    </scriptdeployment>
  </scriptdeployments>
</usereventscript>
```

| Element | Rule | Why |
|---|---|---|
| Audience (`allroles`, `allemployees`, `allpartners`, `audslctrole`, `audemployee`) | **Every** deployment sets one explicitly. `<allroles>T</allroles>` for all internal roles, or `<audslctrole>` with named roles. | `../../CAPABILITIES.md`: a deployment with no audience tags deploys, shows RELEASED, and fires for nobody. Validate and deploy both pass silently. `allroles` does not cover partner or customer center roles; those need `audslctrole`. |
| `status` | Sandbox: `TESTING`. Production gate: `RELEASED`. Scheduled and Map/Reduce deployments use `NOTSCHEDULED` in sandbox (run on demand) and `SCHEDULED` with the plan's schedule at the gate. | Oracle enumerates `TESTING`, `RELEASED`, `NOTSCHEDULED`, `SCHEDULED` (the others are runtime states). `TESTING` executes only for the deployment owner (the SDF auth user); if another sandbox tester must trigger it, use `RELEASED` in sandbox and log that in `build_log.md`. Confirm the owner behavior against Oracle docs for the script type before relying on it. |
| `loglevel` | Sandbox: `DEBUG`. Production gate: `ERROR`. `AUDIT` in production only when the plan asks for an audit trail. | Oracle's default is `DEBUG`; `DEBUG` in production floods the execution log and slows the script. |
| `isdeployed` | `T`. `F` only to park a deployment on purpose, with the reason in the plan block. | A parked deployment looks deployed in a file listing and is not. |
| `recordtype` | One deployment per record type unless the plan says otherwise. A script that must fire on Sales Order and Invoice gets two `scriptdeployment` elements, each with its own `scriptid`. | Separate audiences, statuses, and log lines per record type. |
| `runasrole` | Empty unless the plan block names the role and the reason (section 8). | SAFE Guide: Execute as Admin overrides the role model. It is a security decision, not a convenience. |
| `executioncontext` | Set explicitly to the contexts the plan needs. Omit `SCHEDULED`, `MAPREDUCE`, `SUITELET` and `USEREVENT` from a User Event's list unless another script is meant to trigger it. | Script-on-script triggers are the usual source of double writes and governance blowouts. |
| `scriptfile` | `[/SuiteScripts/PC/pc_{area}_{type}.js]`, matching the file in `src/FileCabinet/SuiteScripts/PC/`. | Validate catches a missing file; it does not catch a stale one pointing at the wrong script. |

The production-gate edits (`TESTING` to `RELEASED`, `DEBUG` to `ERROR`, `NOTSCHEDULED` to `SCHEDULED`) are orchestrator edits made at gate 2 of the `execution` skill, committed before the production deploy, never pre-set in sandbox.

Check: `grep -L '<allroles>T</allroles>\|<audslctrole>' src/Objects/Scripts/*.xml` returns nothing; before a production deploy, `grep -n 'TESTING\|<loglevel>DEBUG' src/Objects/Scripts/*.xml` returns nothing for the objects being promoted.

## 5. Semantic traps validate does not catch

`suitecloud project:validate` checks XML syntax, object references, and (server-side) feature dependencies. It does not check meaning. These are verified account behaviors from `../../CAPABILITIES.md`; the worker designs around them, the orchestrator checks for them.

| Trap | What actually happens | Rule |
|---|---|---|
| Audience-less `scriptdeployment` | "Deploys and shows RELEASED, but fires for nobody, not everybody." No warning from validate or deploy. | Explicit audience on every deployment (section 4). Sandbox-test an actual trigger, "not just checking `isdeployed`/`status`, before considering any User Event/Client Script task done." |
| `selectrecordtype` on a List/Record custom field | "Has no published name-to-number mapping anywhere, including Oracle's own SDF XML reference." Validate "only confirms a guess is syntactically valid (a real value exists), not semantically correct (three different valid numbers mean three different record types)." | Never guess the number. Take it from an existing unlocked field in the target account (`object:import`, grep `selectrecordtype`), or from a file the orchestrator supplied, or list it UNCONFIRMED (section 6). Observed on one account, not yet cross-checked: `-2` Customer, `-4` Employee, `-6` Contact, `-10` Item, `-30` Transaction. |
| `addSubmitButton()` on a `serverWidget` Form | Submits via **POST**. A Suitelet gated with `if (context.request.method !== 'GET') return;` "silently produces a blank page with zero output on every submit." No exception, no log entry. | Do not gate a Suitelet on `request.method` unless GET and POST must behave differently, and then handle both branches with output. |
| Custom record `accesstype` other than `NONE` | Enforced "even on a server-side scripted create." A User Event's `record.create().save()` runs as the triggering user's role; without the custom record permission it throws `Permission Violation`, visible only in the execution log if caught. The parent save succeeds and the user sees nothing. | Any custom record a script writes to: either every triggering role holds the permission (grant it in the role object), or the deployment sets `runasrole` with the reason in the plan (section 8). Check this before UAT, not after. |
| `manifest.xml` `<dependencies><features>` | A prerequisite check, not a way to enable features. Deploy fails if the feature is off. | Feature enablement is `AccountConfiguration/features.xml`, and only for features outside Oracle's excluded and Terms-of-Service-gated list (see `../../CAPABILITIES.md`). |
| `[scriptid=X]` reference to an object not in the project | Validate fails to resolve it. The tempting fixes (import the object, write a stub) either cascade into dozens of errors or overwrite the live object on deploy; a locked object will not import at all. | Declare X under `manifest.xml` `<dependencies><objects>` (section 6). |
| `suitecloud` commands from a path containing spaces via Git Bash | `object:import` failed with an unrelated-looking "Objects must be placed under the Objects folder" error; the identical command in PowerShell succeeded. | Orchestrator runs `suitecloud` through PowerShell in this workspace. |
| `desktop.ini` in `src/FileCabinet/` | Uploaded to the File Cabinet on deploy. | Sweep before every validate and deploy (`sdf-deploy`). |

A worker who hits a case that looks like a new trap writes it in the handback under "Observed"; the orchestrator appends a dated `[unreviewed]` entry to `../../CAPABILITIES.md` (the `execution` skill's learning-capture rule).

## 6. References to existing account objects

Authored XML and code reference things that already exist in the account: standard and custom fields, record types, forms, roles, saved searches, lists, subsidiaries, locations. Every such reference is either **confirmed** or **UNCONFIRMED**. There is no third state.

Confirmed means one of:
- an MCP read-only query result the orchestrator pasted into the delegation packet (SuiteQL, `ns_getRecordTypeMetadata`, Script Reader);
- an `object:import` of the object from the target account, supplied as a file;
- a value in the approved execution-plan block that itself cites its source.

Rules:

- The worker never invents a `scriptid`, `internalid`, `selectrecordtype` number, form ID, or role ID. If the packet does not supply it, the worker writes the reference as a clearly marked placeholder (`custbody_UNCONFIRMED_hold_reason`) and lists it.
- The handback carries two lists, always, even when empty:
  - **Existing references used**: each ID, where it appears (file and line), and the packet source that confirmed it, or `UNCONFIRMED`.
  - **IDs this unit creates**: every new `scriptid`, with its display name, so the orchestrator can check naming (section 2) and collisions.
- **An UNCONFIRMED reference is a stop for the orchestrator.** It confirms the ID with a read-only query, or asks the consultant, and re-delegates or edits. Nothing with an UNCONFIRMED reference reaches validate, let alone deploy.
- Script IDs are not proof of meaning. `../../CAPABILITIES.md` records a custom segment whose script ID read "Fund" and whose live label and business use were "Program". When the field's purpose matters, the orchestrator confirms the UI label (`BUILTIN.DF(fieldname)` in SuiteQL, or a screenshot) before handing the ID to the worker.

Check: `grep -rn 'UNCONFIRMED' src/` returns nothing before validate runs.

### Referencing objects the project does not own (manifest object dependencies)

A confirmed reference in the XML (`[scriptid=X]` in `permittedrole`, `selectrecordtype`, a form, a sourcing field) must also **resolve** at validate. It resolves from one of two places, and the choice matters:

| The referenced object is | Resolve it by | Why |
|---|---|---|
| Owned by this project (we author and change it) | Its object file in `src/Objects/`, listed in `deploy.xml` | It deploys with the project |
| Anything else that already exists in the account: roles (including `customrole_pc_mcp_ai_connection`, owned by the ScriptReader project), records built by hand in the UI, **locked** bundle or SuiteSuccess objects | An entry in `src/manifest.xml`: `<dependencies><objects><object>X</object></objects></dependencies>` | Validate and deploy check that X exists in the target account; X is never deployed or modified |

```xml
<dependencies>
    <features>
    </features>
    <objects>
        <object>customrole_pc_mcp_ai_connection</object>
        <object>customrecord_edp_item_category</object>
    </objects>
</dependencies>
```

Rules:

- **Never `object:import` a role or another project's object just to satisfy a reference**, and never hand-write a stub of one. The import cascades into dozens of missing-dependency errors (a role references everything it grants), and a copy or stub that reaches `deploy.xml` overwrites the live object. A locked object cannot be imported at all; the manifest entry is the only SDF path to it, and it usually works. **Exception found: a role owned by another installed SuiteApp (referenced as `[appid=X, scriptid=Y]`, not a plain `[scriptid=Y]`) can be read via `object:import` with no problem, but no tested `manifest.xml` dependency syntax makes it resolve for `project:validate`/`project:deploy`** (Upward, 2026-09-30; see `../../CAPABILITIES.md`, SuiteCloud SDF section, for the four syntaxes tried). Treat this specific shape as read-only through SDF: pull it with `object:import` to keep source honest, but don't try to redeploy that block, and don't route the fix through SDF at all if this is what's blocking a live audience change — set it directly in the NetSuite UI instead. This is narrower than it might look: it is not a general `role` object-type limitation (an earlier, wrong conclusion on the same engagement), and it does not apply to plain custom roles the account itself owns, which resolve via manifest dependency exactly as MH Crane proved.
- Every custom record type Power Cloud authors grants the MCP connection role in its `<permissions>` block from the first deploy, with the role declared in the manifest, so the record is readable over MCP immediately and no UI step follows. Standard roles (`ADMINISTRATOR`) need no declaration.
- The manifest entry is an orchestrator edit (the worker never edits `manifest.xml`, section 10). The worker lists the reference under "Existing references used"; the orchestrator confirms the scriptid exists (SuiteQL on `customrecordtype`, `role`, `customfield`) and adds the manifest line before validate.
- Verified on MH Crane production 2026-09-25 (`../../CAPABILITIES.md`, SuiteCloud SDF, locked objects entry).

Check: every `[scriptid=X]` in `src/Objects/` either names an object file in `src/Objects/` or appears in `manifest.xml` `<dependencies><objects>`; no role object other than a role this project authors sits in `src/Objects/`.

## 7. Governance and error handling

Oracle's unit limits per execution (Script Type Usage Unit Limits): User Event, Client, Suitelet, Mass Update, Workflow Action, Portlet **1,000**; RESTlet **5,000**; Scheduled, Bundle Installation, SDF Installation **10,000**; Map/Reduce per invocation `getInputData` **10,000**, `map` **1,000**, `reduce` **5,000**, `summarize` **10,000**, with a **10,000** soft limit per map or reduce job that yields gracefully and a **200 MB** persisted-data hard limit. Exceeding a hard limit throws `SSS_USAGE_LIMIT_EXCEEDED` and ends the invocation; the script does not resume where it stopped (SAFE Guide, Principle 2).

Rules, each with the pattern:

**Check remaining usage inside any loop that does I/O.**
```js
const script = runtime.getCurrentScript();
for (const line of lines) {
    if (script.getRemainingUsage() < 100) {
        log.audit({ title: 'Usage floor reached', details: `Stopping at line ${line.id}` });
        break; // or hand off, never keep going
    }
    ...
}
```

**Heavy I/O leaves the User Event or Suitelet POST.** More than a handful of record loads or saves per trigger goes to a Map/Reduce (or a Scheduled Script started with `task.create`), with the User Event only recording what needs doing (SAFE Guide 2.3, 3.1.3).

**Do not re-save the record in `afterSubmit`.** Set values in `beforeSubmit` on `context.newRecord` (SAFE Guide 3.1.1). Use `record.submitFields` and `search.lookupFields` for single-field writes and reads instead of load and save (SAFE Guide 2.2). Put the columns on the search instead of loading each result (SAFE Guide 3.1.2).

**Every entry point body is wrapped, and every catch logs record id and stack.**
```js
const afterSubmit = (context) => {
    const rec = context.newRecord;
    try {
        ...
    } catch (e) {
        log.error({
            title: `afterSubmit failed on ${rec.type} ${rec.id}`,
            details: `${e.name}: ${e.message}\n${e.stack}`
        });
        // rethrow only if the plan says the save must fail; otherwise the user's save succeeds and the error is on record
    }
};
```
No silent catch: a `catch` block with no `log.error` (or with a `log.debug` only) fails review. A catch that swallows on purpose says why in a comment and still logs at `audit`.

**Map/Reduce: let the framework yield; make each stage small and independent.** No usage-check loops inside `map` or `reduce`; each invocation handles one key. `summarize` walks `summary.mapSummary.errors` and `summary.reduceSummary.errors` and logs every one with its key, and logs `summary.inputSummary.error` if set. A Map/Reduce that needs ordering between keys is the wrong script type (SAFE Guide 2.3.3).

**Scheduled Script re-invocation carries state.** When a Scheduled Script re-queues itself with `task.create`, the remaining work travels as a script parameter or in `N/cache`, never assumed from a fresh search (SAFE Guide 2.3.2). On entry, check the `type` argument for `aborted` and treat a repeat as possible (SAFE Guide 1.11.1).

**Anything re-runnable is idempotent.** A create checks for an existing record first (by `externalid` or a unique key the plan names) and updates or skips instead of duplicating; a log record carries the source transaction and line so a second run finds the first (SAFE Guide 4.6, 2.3.2). Race conditions on custom records are real; a counter or status field two scripts write needs the plan to say how it is locked (SAFE Guide 4.7).

**Client Scripts stay light.** Field validation and sourcing only; no searches in `fieldChanged` on a line-heavy form; no `record.load` from a client script when `search.lookupFields` answers it.

Check (orchestrator): `grep -n 'catch' pc_*.js` and confirm each has a `log.error` within the block; `grep -n 'getRemainingUsage'` finds at least one hit in any script with a loop over search results; a `.save()` inside an `afterSubmit` on a record loaded from `context.newRecord.id` is a finding.

## 8. Security checklist (orchestrator runs this)

Distilled from NetSuite SAFE Guide 2026.1 / 2026.2, Principle 5 (Security and Privacy), Principle 11 (OWASP), and the AI-systems chapter. The worker writes to these; the orchestrator ticks every line before validate. A failed line is a rewrite, not a note.

| # | Check | SAFE basis |
|---|---|---|
| 1 | No secrets, tokens, passwords, API keys, or NetSuite account IDs in source, XML, comments, or tests. External credentials live in Secrets Management (Setup > Company > Preferences > API Secrets) and are referenced by script ID through `N/https` `createSecureString`, `N/sftp`, `N/crypto` or `N/keyControl`. A credential in a custom field or custom record is a fail. | 5.5 (table: "Exposed credentials in NetSuite" strictly not allowed) |
| 2 | `N/https` (never `N/http`) and only to hosts named in the approved plan block. Any URL not in the plan is a stop. | 5.5 ("HTTP Protocol" strictly not allowed), 1.5 |
| 3 | Suitelet and RESTlet input: every parameter checked for type, length, range, and allowed values before use, and the whole request rejected on any bad value. Numeric IDs parsed and range-checked; select values matched against a list. | 5.3 ("zero-tolerance for allowing the input of unsanitized data") |
| 4 | No `eval`, `new Function`, dynamic `require` of a computed module name, or DOM manipulation. Suitelet output built with `N/ui/serverWidget`, not string-concatenated HTML from user input. | Principle 2 intro (DOM not supported), 1.9.2, Principle 11 |
| 5 | `runasrole` (Execute as Admin or any elevated role) only where the plan block states the role and the reason. The reason is a real one (a custom record permission gap that cannot be granted, `task.create` needing admin), not "it was easier". | 5.1 note, 5.2 ("avoid shipping SuiteScript scripts set to Execute as Admin whenever possible") |
| 6 | No PII in logs: no email addresses, tax IDs, bank or card data, full names, or raw request bodies in `log.debug`/`log.audit`/`log.error`. Log internal IDs and field names. | 5.9, 3.1.7.6 and chapter 14 ("do not log raw sensitive data, credentials") |
| 7 | Least privilege: roles Power Cloud creates start from a blank or a narrow standard role and add only the permissions the plan lists. Custom records with data a role should not see carry `accesstype` and role permissions; access is not enforced by script logic. | 5.1, 5.2 |
| 8 | Tests and sandbox UAT run under the intended roles, not Administrator. | 5.2 (Important note) |
| 9 | Hashing and HMAC use SHA-256 or SHA-512, never MD5 or SHA-1; random tokens come from `N/crypto/random`, not `Math.random`. | 5.12 |
| 10 | Card numbers only in NetSuite's Credit Cards subtab; never a custom field. | 5.6 |
| 11 | A deployment's audience is the roles that need it, not `allroles` by reflex when the plan names a narrower group. | 5.1 |

Check: `grep -rniE 'password|secret|token|apikey|api_key|Authorization:' src/` returns only Secrets Management references; `grep -rn "N/http'" src/` returns nothing; `grep -rn 'eval(\|new Function' src/` returns nothing; `grep -rn '<runasrole>[A-Z]' src/Objects/` returns only deployments whose plan block states the reason.

## 9. Tests

- **One test per acceptance criterion**, and the criteria come from the approved execution-plan block, never from reading the implementation. A criterion the plan does not state is not tested; a criterion the implementation cannot meet is a planning finding, not a test to delete (`sdf-deploy`: "don't invent new acceptance criteria at deploy time").
- **Test files are new files, never edits to the script.** Convention: `execution/sdf/__tests__/pc_{area}_{type}.test.js`, one per script, named after it. This is SuiteCloud Unit Testing's Jest layout (SAFE Guide 6.1: `.test.js` files in a tests directory at the project root, with the SDK's `N/*` stubs mocked via `jest.mock`). Tests do not go in `src/`, because `deploy.xml` uploads all of `src/FileCabinet/` to the account. Confirm the exact Jest configuration against Oracle's SuiteCloud Unit Testing docs when setting up a project the first time.
- Each `it(...)` names the criterion it covers, verbatim from the plan block, so the build log reads back to the plan.

```js
// __tests__/pc_o2c_so_line_audit_ue.test.js
import script from 'SuiteScripts/PC/pc_o2c_so_line_audit_ue';
import record from 'N/record';
import Record from 'N/record/instance';
jest.mock('N/record');
jest.mock('N/record/instance');

describe('O2C.3 acceptance criteria', () => {
    it('AC1: a removed SO line creates one PC | Removed Line Log record carrying the SO id and line key', () => {
        record.create.mockReturnValue(Record);
        Record.save.mockReturnValue(501);
        script.afterSubmit(/* context with oldRecord holding one more line than newRecord */);
        expect(record.create).toHaveBeenCalledTimes(1);
        expect(Record.setValue).toHaveBeenCalledWith({ fieldId: 'custrecord_pc_rll_source_tran', value: 1352 });
    });
});
```

- **Sandbox results go in `execution/build_log.md`** in the `sdf-deploy` shape: what was deployed, when, against which account (name, not just ID), pass or fail against each acceptance criterion by name, and any fix-and-redeploy loop with what changed. A unit test passing is not a sandbox pass; the criterion is met when the trigger was exercised in the sandbox account (section 5, audience trap).
- **Unit tests are written from the plan block by `pc-code-chores` (or the orchestrator), never by the author of the script.** An author who writes its own tests encodes its own reading of the plan twice; a separate writer working only from the criteria catches the mismatch. Sandbox tests are the orchestrator's. No worker records a sandbox result.

Check: the number of `it(` blocks in the test file equals the number of acceptance criteria in the plan block; each `it` title starts with a criterion ID from the block.

## 10. Delegation contract for `pc-sdf-author`

The worker is a Sonnet session with Read, Write, Edit, Glob and Grep. **It has no Bash.** It never runs `suitecloud`, validate, deploy, Jest, or any MCP tool. It never sees an account.

**What may be delegated.** One unit at a time, fully specified, with a checker the orchestrator can run:

- one SDF object (a custom record type with its fields, a field, a role, a saved search, a form) with its XML, or
- one SuiteScript file with its script object XML. Its test file is a separate `pc-code-chores` unit, written from the plan's acceptance criteria (section 9).

The delegation packet contains: the approved execution-plan block (acceptance criteria, classification, rollback note); the file paths to create; the exact header blocks (section 3); the `PC | ` names and `scriptid`s to use; every confirmed existing-object reference with its source (section 6); the hosts, roles, and `runasrole` reason if any (section 8); and the checker (validate command the orchestrator will run, the test file expected, the criteria).

**What is never delegated.** Architecture or script-type choice; debugging a failing deploy or a blank Suitelet page; anything that decides security posture (roles, permissions, `runasrole`, external hosts); data migration or a scripted data fix that writes to an account; financial posting logic (journal entries, revenue, inventory costing, tax); anything that touches `features.xml` or `N/config`. The orchestrator does those itself, with the consultant at the gates.

**Worker behavior.**

- Reads the packet and this file, then writes only the files the packet names.
- **Stops and lists any open design choice instead of picking.** "Should the log record be created in `beforeSubmit` or `afterSubmit`" is a question in the handback, not a decision in the code. The worker returns without writing the affected file rather than writing two versions.
- Never edits the header blocks, the plan block, `manifest.xml`, `deploy.xml`, `project.json`, or anything outside the packet's file list.
- Hands back: the files written; the two reference lists from section 6; open design choices; anything observed that looks like a new trap (section 5); and a self-check against sections 2, 3, 4, 7 and 8 stated line by line, pass or fail, with no line skipped.

**Orchestrator review, four steps, in order, before anything deploys.**

1. **Read all of it.** Every file the worker wrote, top to bottom. Not the diff summary, not the handback's word for it.
2. **Diff against the plan.** Acceptance criteria to code paths, names and IDs to section 2, references to section 6 (any UNCONFIRMED is a stop), deployment XML to section 4, security to section 8, governance to section 7.
3. **Validate.** `suitecloud project:validate` (server-side against the sandbox auth ID, via PowerShell), after the `desktop.ini` sweep. Validate output goes back to the worker verbatim if a fix is needed; the orchestrator does not fix worker output by hand except for header blocks and plan edits, which are its own.
4. **Tests.** Have `pc-code-chores` write the Jest file from the plan block if it does not exist yet, run it, and confirm the `it` count matches the criteria count. Then `sdf-deploy` to sandbox and exercise every trigger, recording in `build_log.md`.

A worker handback is not done until all four pass. Gate 2 (production) is the `execution` skill's, and is never reached from this file.

## 11. What SDF cannot do

The verified register of SDF limits (features it cannot set, preferences that need `N/config`, bundles it cannot install, and the traps above) is the SuiteCloud SDF section of `../../CAPABILITIES.md`; read it there, do not copy it here.
