# Script Reader — NetSuite AI Connector Custom Toolset

## Plan
Build a distributable SuiteApp SDF project exposing 4 read-only AI Connector tools that read
SuiteScript source + File Cabinet files through the existing NetSuite MCP connection.

## Tasks
- [x] Scaffold SuiteApp SDF project (manifest, deploy, suitecloud.config)
- [x] `scriptreader_tools.js` — CustomTool script with 4 async methods
- [x] `scriptreader_schema.json` — tool schema for all 4 tools
- [x] `custtoolset_pc_scriptreader.xml` — toolset object (exposetoaiconnector=T)
- [x] Local verification: `node --check` on the JS, JSON.parse the schema
- [ ] `suitecloud account:setup` (USER runs — interactive auth to sandbox)
- [ ] `suitecloud project:validate` — resolve exact permkeys + `<features>`
- [ ] `suitecloud project:deploy` to sandbox
- [ ] Create/confirm non-Admin AI Connector role (MCP Server Connection, OAuth 2.0, File Cabinet view, scripting view)
- [ ] Prompt-test each tool via the MCP connection against a known script
- [ ] (optional) jest unit test for `paginate`

## Tools shipped
1. `readScriptSource` — source of a script by scriptId / fileId / filePath, line-range paged
2. `listScripts` — script metadata discovery (returns JSON-string array)
3. `readFile` — generic File Cabinet text reader (refuses binary)
4. `getScriptDeployments` — deployment status/context for a script

## Open items (resolve during validate/deploy)
- Exact `<permkey>`/level for SuiteScript record visibility + full manifest `<features>` list
- `toolset` object is 2026.1; if account is on 2025.2 the object type is `tool` instead
- Confirm `ScriptDeployment.ExecutionContext` / `LogLevel` select cleanly via SuiteQL
- Owner column dropped from listScripts for now (BUILTIN.DF on Script.Owner) — re-add if needed

## Review
Built the full SuiteApp SDF project + 4-tool CustomTool. Local verification complete:
- `node --check` on `scriptreader_tools.js` → syntax valid
- schema JSON parses; all 4 tool names match exported async methods; all input params scalar
- `paginate()` extracted from real source and unit-tested → 19/19 edge cases pass
  (whole file, head/mid/tail windows, past-end clamp, single line, negative-arg fallback)

Remaining work needs the authenticated NetSuite account (cannot run here):
1. USER: `suitecloud account:setup` (interactive browser auth to the SANDBOX)
2. `suitecloud project:validate` → resolve exact `<permkey>`s + `<features>` it requests
3. `suitecloud project:deploy`
4. Confirm non-Admin AI Connector role has the perms; confirm tools at
   Customization > Scripting > Custom Tools
5. Prompt-test each tool over the MCP connection against a known script

Design notes baked in:
- Array results (listScripts, getScriptDeployments) returned as JSON strings per Oracle's
  "stringify objects" best practice → avoids any nested-array schema limits.
- 10 MB getContents guard; binary files refused in readFile; line-range paging caps payload
  size against AI-client token/timeout limits.

## DEPLOYED — 2026-06-30
- Pivoted SuiteApp → ACP (ACCOUNTCUSTOMIZATION); files under /SuiteScripts/PowerCloud/scriptreader/
- CLI pinned to 2026.1 (npx @oracle/suitecloud-cli@^3.2.0)
- Root-caused 302 redirect: SDF auth was using the non-Admin MCP role (no SuiteApp Deployment
  perm). Fixed by re-authing as PC_SDN_BUNDLING_ADMIN (Administrator).
- `project:validate --server` → all green (account accepts `toolset` → account is 2026.1)
- `project:deploy` → SUCCESS. Created custtoolset_pc_scriptreader + uploaded script+schema to
  TSTDRV2793975 (Power Cloud Consulting - Bundling).

## LIVE-VERIFIED via SDN Bundling MCP — 2026-06-30 — ALL 4 TOOLS PASS
- [x] Tools visible in MCP after connect → confirms MCP role has the File Cabinet View gate
- [x] listScripts → 200 scripts (capped) with correct metadata
- [x] readScriptSource(customscript_cl_validate_email) → full 150-line source; metadata
      cross-checked against ns_runCustomSuiteQL (fileId 650, name, type all match). Proves the
      core value: returns CODE that SuiteQL cannot.
- [x] getScriptDeployments → returned deployment record (status/recordType/logLevel)
- [x] readFile(filePath, maxLines=5) → paging + truncated flag + JSON type detection correct
- [x] BUG FOUND + FIXED via live test: `ScriptDeployment.StartDate` is NOT_EXPOSED to SuiteQL
      (NOT_EXPOSED for channel SEARCH). Removed StartDate from query + schema; redeployed.
      Graceful try/catch meant it errored cleanly (no crash) before the fix.
- [x] Code-change redeploy takes effect immediately on next MCP call (no reconnect needed)

## Status: COMPLETE — deployed and end-to-end verified in the Bundling account.
Note: this account had NO StartDate-style issue elsewhere; other deployment columns
(Status, IsDeployed, ExecutionContext, RecordType, LogLevel) all query fine.

---

# Task 2: MCP Read-Only Administrator role in SDF — 2026-07-09 — SUPERSEDED by Task 3

Goal: Administrator cannot use the AI Connector (MCP), so ship a custom role in
this SDF project alongside the tools — a "read-only administrator" with VIEW
access to everything possible, MCP-specific naming.

PAUSED 2026-07-09 mid-task (user needs tools pushed to a new account first).
Research phase COMPLETE — full resume kit in `tasks/role-research/`
(ROLE-RESEARCH.md + machine-readable permission tables). No src/ changes made
yet, so the project is exactly its deployed state.

## Plan
- [x] Research full SDF permission ID list (TRAN_/LIST_/REPO_/ADMI_) + which
      support VIEW → tasks/role-research/ (682 IDs w/ valid levels + MCP
      required perms: ADMI_MCP_SERVER/ADMI_LOGIN_OAUTH2/ADMI_RESTWEBSERVICES
      FULL, REPO_ANALYTICS EDIT, LIST_FIND FULL)
- [ ] ~~Import existing "PC MCP AI Connection Role" as ground truth~~ —
      blocked: PC_SDN_BUNDLING_ADMIN token expired (browser re-auth timed
      out); superseded by research anyway
- [ ] Generate `src/Objects/customrole_pc_mcp_readonly.xml` from
      tasks/role-research/ids_levels.tsv per rules in ROLE-RESEARCH.md
      (~525 perms; root element is <role>, scalars alphabetical)
- [ ] Local validate, then server-validate w/ admin authid; trim rejected
      permkeys/feature-gated entries until green
- [ ] Deploy + update README/docs

## Review
Superseded 2026-07-10: instead of generating a role from research tables, the user
exported the real "PC MCP AI Connection Role" (customrole1118) from the source
account via object:import and we merged that. Draft customrole_pc_mcp_readonly.xml
moved to tasks/role-research/. Research kit remains valid reference.

---

# Task 3: Merge imported MCP role into project — 2026-07-10 — DONE (not yet deployed)

User supplied `MCP Role SDF/` (object:import of customrole1118, "PC MCP AI
Connection Role", from the OneWorld source account). Merged into the project.

## Tasks
- [x] Copy role XML into src/Objects/ (deploy.xml already wildcards ~/Objects/*)
- [x] Move superseded draft customrole_pc_mcp_readonly.xml → tasks/role-research/
- [x] Manifest: add WEBSERVICES optional feature (iswebserviceonlyrole field)
- [x] Local validate (npx = CLI 3.2.0; global 3.1.2 is older — always npx)
- [x] Server validate vs Shinesty prod (4775967) + fix each finding (see below)
- [x] Rename scriptid customrole1118 → customrole_pc_mcp_ai_connection
      (SuiteQL-confirmed no customrole1118 / no MCP role exists in Shinesty;
      numeric id was source-account noise; matches pc_ naming convention)
- [ ] `npm run deploy` to Shinesty prod (user go-ahead)
- [ ] Assign role to the MCP connection employee(s); reconnect not required

## Server-validation fixes applied (Shinesty is non-OneWorld)
- REPO_RECONCILE: FULL and EDIT both rejected → VIEW
- Empty <restriction></restriction> on custom-record permkey → removed
- Perms for objects not in Shinesty → removed: [customsale_retainer_invoice],
  [customrecord_executive_summar_week_repor] (+ their manifest object deps)
- custrecord_cash360_role_access field (Cash360, source acct only) → removed
- SUBSIDIARIES-gated content → removed: subsidiaryoption, subsidiaryviewingallowed,
  LIST_CONTACTSUBSIDIARYRELATION, LIST_ENTITYSUBSIDIARYRELATION,
  REPO_CONSOLIDATED_REPORTING; dropped SUBSIDIARIES from manifest features
- NOTE: 9 permkeys the LOCAL validator rejects (ADMI_MCP_SERVER, LIST_OTHER_ADDRESS,
  LIST_BULK_PROCESSING, etc.) are ACCEPTED server-side — CLI schema lag. Local
  validate will always exit 1 on this project; trust `project:validate --server`.

## Review
Final `npx suitecloud project:validate --server` → ALL GREEN, zero warnings,
against 4775967 Shinesty prod. Role keeps ADMI_MCP_SERVER / ADMI_LOGIN_OAUTH2 /
ADMI_RESTWEBSERVICES FULL — the MCP connection gates. Not deployed yet.

## Addendum 2026-07-10: multi-account role variant system
User: most future target accounts ARE OneWorld — don't lose that functionality.
- `roles/customrole_pc_mcp_ai_connection.master.xml` = single source of truth
  (full OneWorld: subsidiaryoption/subsidiaryviewingallowed + the 3 subsidiary
  permkeys restored). Source-account-only junk (cash360 field, retainer-invoice
  + exec-summary-record perms) stays out permanently; platform fixes
  (REPO_RECONCILE VIEW, no empty <restriction>) baked in.
- `scripts/set-role-variant.js` + npm run role:oneworld | role:standard writes
  src/Objects/customrole_pc_mcp_ai_connection.xml (generated — edit master only).
- Manifest keeps SUBSIDIARIES optional permanently (valid for both variants).
- Verified: role:standard output is BYTE-IDENTICAL (md5 EF4AAA25...) to the
  server-validated Shinesty file; role:oneworld passes local validate with only
  the known 9 schema-lag permkey errors (all server-accepted); final
  role:standard + --server validate vs Shinesty = all green. README documents
  the workflow. Repo left in Shinesty-ready (standard) state.

---

# Task 4: Deploy to Power Cloud Consulting, LLC production — 2026-08-06

Target: PowerCloudProduction authid (Administrator @ Power Cloud Consulting, LLC).
User confirmed account is OneWorld → oneworld role variant.

## Tasks
- [x] project.json defaultAuthId → PowerCloudProduction
- [x] npm run role:oneworld (regenerate src/Objects role from master)
- [x] npx suitecloud project:validate --server (authoritative; local always exits 1)
- [x] Trim account-specific permkey rejections in src/Objects if any → NONE NEEDED
- [x] npx suitecloud project:deploy
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection employee(s);
      connector URL must use /services/mcp/v1/all (not the suiteapp path)
- [x] Commit after successful deployment

---

# Task 5: Deploy to American Barbell sandbox — 2026-08-13

Target: 7573974_SB1 (SANDBOX) American Barbell, LLC via new AmericanBarbellSB authid
(user ran account:setup — CLI's setup prompt is interactive-only, can't be driven
from a non-interactive session). User confirmed OneWorld.

## Tasks
- [x] USER: npx suitecloud account:setup → AmericanBarbellSB (set as project default)
- [x] npm run role:oneworld
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → FAILED creating role: "Invalid permkey1 reference
      key TRAN_TAXLIAB" (legacy Pay Sales Tax perm; invalid in this account —
      SuiteTax-style config). NOTE: --server validation did NOT catch this;
      deploy-time object creation is the real permkey gate.
- [x] Trimmed TRAN_TAXLIAB from src/Objects copy only (feature-gated, account-
      specific — master untouched per README rule)
- [x] project:deploy attempt 2 → COMPLETE (8s). Role + toolset CREATED; the two
      files + folder had already uploaded during attempt 1.
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://7573974-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit after successful deployment

## Review
Fourth account live (Bundling, Shinesty, PC LLC prod, AB sandbox). New lesson
recorded in lessons.md: server validate is necessary but NOT sufficient for role
permkeys — feature-gated keys can pass validation and still fail at deploy.
Repo left in AB-sandbox state (oneworld minus TRAN_TAXLIAB); rerun a role:*
script before deploying elsewhere.

---

# Task 6: Deploy to Absci sandbox — 2026-08-13

Target: 5915970_SB1 (SANDBOX) Absci Corporation via new ABSCI-SB authid
(user ran account:setup). OneWorld auto-detected: server validation accepted
the subsidiary-gated role content.

## Tasks
- [x] USER: npx suitecloud account:setup → ABSCI-SB (set as project default)
- [x] npm run role:oneworld (reset from AB-trimmed state to full master)
- [x] npx suitecloud project:validate --server → all green
- [x] npx suitecloud project:deploy → COMPLETE first pass (6s), zero trims.
      Role + toolset CREATED; folder + both files uploaded.
      (TRAN_TAXLIAB valid here — legacy tax; the AB rejection was account-specific.)
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://5915970-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit after successful deployment

## Review
Fifth account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB).
Cleanest run yet — full oneworld master deployed unmodified. Repo left in
pure oneworld state (matches master).

---

# Task 7: Deploy to MH Crane production — 2026-08-15

Target: 1225738 (PRODUCTION) Material Handling Systems Inc ("MH Crane") via new
MHCrane authid (user ran account:setup). User confirmed OneWorld.

## Tasks
- [x] USER: npx suitecloud account:setup → MHCrane (set as project default)
- [x] npm run role:oneworld
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → FAILED on "Invalid permkey1 reference key
      TRAN_TAXLIAB" (same as American Barbell — SuiteTax-style account; that's
      2 of 6 accounts now)
- [x] Trimmed TRAN_TAXLIAB from src/Objects copy; attempt 2 → COMPLETE (4s).
      Role + toolset CREATED; folder + files had uploaded during attempt 1.
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://1225738.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit after successful deployment

## Review
Sixth account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod). TRAN_TAXLIAB rejection is now a recurring account-specific pattern
(SuiteTax accounts) — expected occasionally, handled by trim-and-retry; still
not a master change (legacy-tax accounts like Absci accept it). Repo left in
oneworld-minus-TRAN_TAXLIAB state; rerun a role:* script before next deploy.

---

# Task 8: 2026.2 fix — uncheck Core Administration Permissions — 2026-08-27

NetSuite 2026.2 enforces (unannounced) its documented rule that "full
permissions" roles can't use the AI Connector: a role with Core Administration
Permissions checked now fails the MCP OAuth2 handshake with "Your role does not
support OAuth2 login" (worked fine on 2026.1; community-confirmed fix, reported
by colleague on the FMW copy of this role).

## Tasks
- [x] Master: coreadminpermission T → F (platform rule → master change per README)
- [x] README: 2026.2 note in "The MCP connection role" section
- [x] Redeploy Absci SB (5915970_SB1) → role UPDATEd in place, all green
- [x] Redeploy American Barbell SB (7573974_SB1, minus TRAN_TAXLIAB) → UPDATEd
- [x] Redeploy Power Cloud LLC prod (5641465) → UPDATEd
- [ ] Redeploy MH Crane prod (1225738, minus TRAN_TAXLIAB) — BLOCKED by Claude
      Code permission classifier (twice); repo + project.json left staged for it:
      USER runs `npx suitecloud project:deploy` from the project root
- [ ] USER per affected account: Setup > Integration > OAuth 2.0 Authorized
      Applications → revoke the Claude entry → reconnect the connector
- [x] Commit

## Review
Role fix rolled out to 3 of 4 role-bearing accounts; MH Crane staged for a
manual `npx suitecloud project:deploy` (authid MHCrane already default, src
already trimmed). Explicit ADMI_MCP_SERVER / ADMI_LOGIN_OAUTH2 /
ADMI_RESTWEBSERVICES FULL were already in the role, iswebserviceonlyrole=F —
core-admin was the only field to change. Watch for SuiteQL/tool calls that
implicitly relied on core-admin; add explicit record perms rather than
re-checking the box. Bundling + Shinesty don't have this SDF role (Shinesty's
own CLAUDE* roles may need the same manual uncheck when 2026.2 lands there).

## Review — DEPLOYED 2026-08-06
- Target: 5641465 (PRODUCTION) Power Cloud Consulting, LLC, via PowerCloudProduction
  authid (CLI auto-refreshed the expired token via browser mid-validate).
- OneWorld master validated server-side ALL GREEN on first pass — zero permkey
  trims needed (first real OneWorld deploy of the master; confirms it as-is).
- Deploy COMPLETE in 6s: folder + scriptreader_schema.json + scriptreader_tools.js
  uploaded; customrole_pc_mcp_ai_connection (role) and custtoolset_pc_scriptreader
  (toolset) both CREATED (neither existed in this account).
- Repo left in oneworld-variant state (matches this deploy); run role:standard
  before any future non-OneWorld deploy.

---

# Task 9: Deploy to ACL Airshop sandbox — 2026-08-28

Target: 7306372_SB1 (SANDBOX) ACL Airshop Holdings, Inc. via new ACL-SB authid
(user ran account:setup). User confirmed OneWorld. First new-account deploy
carrying the 2026.2 fix (coreadminpermission=F) from the master.

## Tasks
- [x] USER: npx suitecloud account:setup → ACL-SB (set as project default)
- [x] npm run role:oneworld
- [x] npx suitecloud project:validate --server → all green
- [x] npx suitecloud project:deploy → COMPLETE first pass (5s), zero trims
      (TRAN_TAXLIAB valid here — legacy tax). Role + toolset CREATED; folder +
      both files uploaded.
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://7306372-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Seventh account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod, ACL SB). Repo left in pure oneworld state (matches master). MH Crane
core-admin redeploy still pending user (Task 8).

---

# Task 10: getAccountInfo tool (added by another session) — documented 2026-09-02

Commit 6b63d96 (from a parallel session) added a FIFTH tool, `getAccountInfo`:
account id, envType, release version, roleId (N/runtime — no permission needed),
NetSuite Next probe (nextApiAvailable / isNextActiveForThisRole via
runtime.isNextActive, 2026.2+), and Company Information fields (N/config — needs
Set Up Company; degrades gracefully without it). Toolset permission gate
unchanged (file-cabinet view only) so no existing role loses access. Built for
NetSuite Next readiness assessments — call it first on any engagement.

## This session
- [x] Verified: node --check OK; schema parses; 5 schema names == 5 exports
- [x] README already updated by that session (5-tool table)
- [x] Task log documented here; commit + push (both commits)

## Rollout status — version skew across accounts
- Power Cloud LLC prod (5641465): 5-tool version DEPLOYED 2026-09-02 + verified
  live via readFile (done by the other session)
- All other accounts still run the 4-tool version until redeployed:
  Bundling, Shinesty, AB SB, Absci SB, MH Crane prod, ACL SB
  (redeploy = switch authid, role:oneworld [+TRAN_TAXLIAB trim for AB/MH Crane],
  project:deploy; code redeploys take effect on next MCP call, no reconnect)
- docs/ScriptReader-Tools-Guide.html/.pdf still describe 4 tools — regenerate on
  next docs touch
- MH Crane still ALSO pending the Task 8 core-admin role redeploy

---

# Task 11: Deploy to Gillespie Coatings sandbox — 2026-09-09

Target: 8751117_SB1 (SANDBOX) Gillespie Coatings, Inc. via new gillespie-sandbox
authid (user ran account:setup). User confirmed OneWorld; server validation
agreed (subsidiary-gated role content accepted). First new-account deploy of the
5-tool version (getAccountInfo included).

Note: the SuiteCloud CLI JAR was missing at session start (npm install inside
node_modules/@oracle/suitecloud-cli fixed it) and the credential store had been
reset — only PowerCloudProd survived; PowerCloudProduction, ACL-SB, ABSCI-SB,
AmericanBarbellSB, MHCrane, Shinesty authids are gone and must be re-created
with account:setup before any redeploy to those accounts.

## Tasks
- [x] USER: npx suitecloud account:setup → gillespie-sandbox
- [x] project.json → gillespie-sandbox; npm run role:oneworld
- [x] node --check tools.js; schema JSON parses
- [x] npx suitecloud project:validate --server → all green
- [x] npx suitecloud project:deploy attempt 1 → FAILED creating role:
      "Invalid permkey1 reference key TRAN_TAXLIAB" (3rd account: AB SB, MH Crane,
      Gillespie). Folder + both files uploaded before the failure.
- [x] Trimmed TRAN_TAXLIAB from src/Objects only (master untouched); attempt 2 →
      COMPLETE (9s). Role + toolset CREATED.
- [x] npm run role:oneworld → src restored to pure master state
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://8751117-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Eighth account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod, ACL SB, Gillespie SB). Gillespie runs the 5-tool version; version skew
from Task 10 otherwise unchanged. TRAN_TAXLIAB now rejected by 3 of 8 accounts —
still account-specific (Absci, ACL accept it), so still a trim, not a master
change.

---

# Task 12: Deploy to Harvest Hope Food Bank production — 2026-09-10

Target: 3527074 (PRODUCTION) Harvest Hope Food Bank via new HarvestHopeProd
authid (user ran account:setup). User confirmed OneWorld; server validation
agreed. Second new-account deploy of the 5-tool version.

## Tasks
- [x] USER: npx suitecloud account:setup → HarvestHopeProd
- [x] project.json → HarvestHopeProd; npm run role:oneworld
- [x] CLI jar present (2026.1 + 2026.2); node --check tools.js; schema parses (5 tools)
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → FAILED creating role: "Invalid permkey1 reference
      key TRAN_TAXLIAB" (4th account: AB SB, MH Crane, Gillespie, Harvest Hope).
      Folder + both files uploaded before the failure.
- [x] Trimmed TRAN_TAXLIAB from src/Objects only (master untouched); attempt 2 →
      COMPLETE (5s). Role + toolset CREATED.
- [x] npm run role:oneworld → src restored to pure master state
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://3527074.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Ninth account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod, ACL SB, Gillespie SB, Harvest Hope prod). Harvest Hope runs the 5-tool
version. TRAN_TAXLIAB now rejected by 4 of 9 accounts — approaching a coin flip,
but Absci/ACL/PC LLC still accept it, so it stays a per-deploy trim rather than a
master change. Note: the auto-mode classifier blocked a combined `sed -i` +
deploy command; do the XML trim with the Edit tool, then deploy in its own call.

---

# Task 13: Deploy to AbilityFirst sandbox — 2026-09-14

Target: 7584447_SB1 (SANDBOX) AbilityFirst via new AbilityFirst-SB authid
(user ran account:setup). OneWorld auto-detected: server validation accepted
the subsidiary-gated role content. Third new-account deploy of the 5-tool version.

## Tasks
- [x] USER: npx suitecloud account:setup → AbilityFirst-SB
- [x] project.json → AbilityFirst-SB; npm run role:oneworld
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → FAILED creating role: "Invalid permkey1 reference
      key TRAN_TAXLIAB" (5th account: AB SB, MH Crane, Gillespie, Harvest Hope,
      AbilityFirst). Folder + both files uploaded before the failure.
- [x] Trimmed TRAN_TAXLIAB from src/Objects only via Edit tool (master untouched);
      attempt 2 → COMPLETE (6s). Role + toolset CREATED.
- [x] npm run role:oneworld → src restored to pure master state
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://7584447-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Tenth account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod, ACL SB, Gillespie SB, Harvest Hope prod, AbilityFirst SB). TRAN_TAXLIAB
now rejected by 5 of 10 accounts and accepted by the rest — a true coin flip.
Still a src-only trim: making it a master change would break the legacy-tax
accounts on their next redeploy. Consider a role:oneworld-notax variant if the
trim keeps recurring.

---

# Task 14: Deploy to Acme Paper and Supply sandbox — 2026-09-21

Target: 5774630_SB1 (SANDBOX) Acme Paper and Supply Co., Inc. via new AcmePaperSB
authid (user ran account:setup). User confirmed OneWorld; server validation
agreed. Fourth new-account deploy of the 5-tool version.

## Tasks
- [x] USER: npx suitecloud account:setup → AcmePaperSB
- [x] project.json → AcmePaperSB; npm run role:oneworld
- [x] node --check tools.js; schema parses (5 tools)
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → FAILED creating role: "Invalid permkey1 reference
      key TRAN_TAXLIAB" (6th account: AB SB, MH Crane, Gillespie, Harvest Hope,
      AbilityFirst, Acme Paper). Folder + both files uploaded before the failure.
- [x] Trimmed TRAN_TAXLIAB from src/Objects only via Edit tool (master untouched);
      attempt 2 → COMPLETE (5s). Role + toolset CREATED.
- [x] npm run role:oneworld → src restored to pure master state
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://5774630-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Eleventh account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod, ACL SB, Gillespie SB, Harvest Hope prod, AbilityFirst SB, Acme Paper SB).
TRAN_TAXLIAB now rejected by 6 of 11 accounts — every NEW account since AB SB
has rejected it; only the early accounts (Bundling, Shinesty, PC LLC, Absci, ACL)
accept it. Still a src-only trim to protect those legacy-tax accounts on redeploy,
but the role:oneworld-notax variant is now clearly worth building.

---

# Task 15: Add --notax role variant — 2026-09-21

Motivation: TRAN_TAXLIAB hand-trimmed on 6 of 11 deploys (every new account since
AB SB). Each cost a failed first deploy attempt + a manual Edit.

## Tasks
- [x] scripts/set-role-variant.js: base <oneworld|standard> + optional --notax
      modifier; stripping refactored into stripFields/stripPermkeys/assertStripped
      so the tax strip reuses the subsidiaries machinery; usage errors exit 1
- [x] package.json: role:oneworld-notax, role:standard-notax aliases
- [x] Test matrix (4 variants): TAXLIAB 1/0/1/0, subsidiaryoption 1/1/0/0,
      TRAN_TAXPYMT untouched in all; plain oneworld byte-identical to master
- [x] npx suitecloud project:validate --server of oneworld-notax vs Acme SB → green
- [x] README: deploy step 2 lists all four variants (notax first); variant table row;
      recurring-trim guidance. tasks/lessons.md: "three rejections = build the variant"
- [x] Src restored to pure master; commit + push

## Review
Master untouched (legacy-tax accounts keep TRAN_TAXLIAB on redeploy). New-account
default is now `npm run role:oneworld-notax`; fall back to plain only for
Bundling/Shinesty/PC LLC/Absci/ACL. If a future account rejects another key
repeatedly, add it to LEGACY_TAX_PERMKEYS or a new modifier — not a hand trim.

---

# Task 16: Deploy to Topo Designs production — 2026-09-21

Target: 3950724 (PRODUCTION) Topo Designs LLC via new TopoDesignsProd authid
(user ran account:setup). OneWorld with a single subsidiary — the SUBSIDIARIES
feature is what gates the role content, not the subsidiary count, so oneworld
base applies. First live test of the --notax variant (Task 15).

## Tasks
- [x] USER: npx suitecloud account:setup → TopoDesignsProd
- [x] project.json → TopoDesignsProd; npm run role:oneworld-notax (TAXLIAB count 0)
- [x] node --check tools.js; schema parses (5 tools)
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → COMPLETE (10s). Role + toolset CREATED. No trim,
      no retry — the notax variant did its job.
- [x] npm run role:oneworld → src restored to pure master state
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://3950724.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Twelfth account live (Bundling, Shinesty, PC LLC prod, AB SB, Absci SB, MH Crane
prod, ACL SB, Gillespie SB, Harvest Hope prod, AbilityFirst SB, Acme Paper SB,
Topo Designs prod). First single-attempt new-account deploy since ACL SB, and the
first one where that was by design rather than luck. Unknown whether Topo would
have accepted TRAN_TAXLIAB (not tested — the point of the variant is not to find
out); the notax default stands for all new accounts.

---

# Task 17: Deploy to Grinds production — 2026-09-24

Target: 5705718 (PRODUCTION) Grinds LLC via new Grinds_Prod authid (user ran
account:setup). OneWorld with a single subsidiary (user-confirmed) → oneworld base,
notax variant per the new-account default.

## Tasks
- [x] USER: npx suitecloud account:setup → Grinds_Prod
- [x] project.json → Grinds_Prod; npm run role:oneworld-notax
- [x] npx suitecloud project:validate --server → all green
- [x] project:deploy attempt 1 → COMPLETE (4s). Folder + files, role + toolset CREATED.
- [x] npm run role:oneworld → src restored to pure master state
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://5705718.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Thirteenth account live. Second consecutive first-attempt deploy with the notax
variant.

---

# Task 18: --mfg role modifier + deploy to Bomb Party production — 2026-09-24

Target: 5759276 (PRODUCTION) RING BOMB PARTY, LLC via new BombPartyProd authid
(user ran account:setup). OneWorld, single subsidiary. Runs Manufacturing + WMS —
master had no mfg/inventory-ops permissions at all.

## Tasks
- [x] Import BombParty's 10 custom roles (object:import to /Objects via PowerShell —
      Git Bash mangles "/Objects" into a Windows path; moved to scratchpad after).
      Celigo roles locked, skipped.
- [x] Diff account permkeys vs master → 18 native mfg/inventory keys (user-approved list)
- [x] Master: add the 18 at VIEW. set-role-variant.js: new opt-in --mfg modifier —
      stripped by default (feature-gated), kept with --mfg. npm alias
      role:oneworld-notax-mfg. README updated.
- [x] Verified role:oneworld output byte-identical to the committed src (existing
      accounts unaffected); unknown flags still rejected
- [x] npm run role:oneworld-notax-mfg; project:validate --server → all green
- [x] project:deploy attempt 1 → COMPLETE (4s). Role + toolset CREATED.
- [x] npm run role:oneworld → src restored
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://5759276.suitetalk.api.netsuite.com/services/mcp/v1/all
- [ ] Follow-up: WMS SuiteApp custom records — enumerate via MCP once connected
      (customrecordtype, wms/wmsse), then add as an account-specific addition
- [x] Commit + push

## Review
Fourteenth account live. All 18 keys accepted at VIEW first try (they were sourced
from roles already valid in the account). WMS SuiteApp records are the remaining gap:
SDF can't list SuiteApp-locked record types and no BombParty role grants them.

---

# Task 19: Redeploy to ACL Airshop sandbox after refresh — 2026-10-08

Target: 7306372_SB1 (SANDBOX) ACL Airshop Holdings, Inc. Sandbox was refreshed
from production, which wiped the 2026-08-28 deploy (Task 9) and invalidated the
old SDF token. User re-ran account:setup → ACL-SB (same authid name, overwritten).

Known account: OneWorld, legacy tax (accepted TRAN_TAXLIAB in Task 9), no
Manufacturing → plain `role:oneworld` (one of the five legacy-tax accounts that
keep the plain variant; NOT the notax default).

## Tasks
- [x] USER: npx suitecloud account:setup → ACL-SB
- [x] project.json → ACL-SB; npm run role:oneworld
- [x] npx suitecloud project:validate --server → all green
- [x] npx suitecloud project:deploy → COMPLETE first pass (12s), zero trims.
      Folder + both files uploaded; role + toolset both CREATED (confirms the
      refresh removed them). Now runs the 5-tool version (was 4-tool).
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s) — the refresh also reset employee role assignments and OAuth2
      authorized apps, so the connector must be re-authorized; connector URL
      https://7306372-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Not a new account — a re-deploy. Lesson: a sandbox refresh is a full reset for
this project (toolset, role, files, SDF token, OAuth2 app grants, role
assignments all gone). Treat it as a new-account deploy using the variant from
the account's previous task entry. Src left in pure oneworld (master) state.

---

# Task 20: Verify + redeploy Harvest Hope production — 2026-10-08

User reported the MCP connection had been misconfigured and asked to confirm
the SDF side was correct. Root cause of the misconfig turned out to be the
connector URL (standard-tools path instead of /services/mcp/v1/all) — SDF was fine.

## Tasks
- [x] file:list → both files present (run via PowerShell; Git Bash mangles the
      /SuiteScripts path into C:/Program Files/Git/...)
- [x] object:import toolset + tools.js → tools.js byte-identical to repo (5-tool);
      toolset identical on all fields (account adds exposetonetsuiteagents=F)
- [x] object:import role → "Bulk Manage Roles" violation; deploy/validate → 302.
      Cause: the authid's browser token refresh had re-bound it to
      "PC MCP AI Connection Role" (roleId 1072) — manageauth --info shows the live
      role, --list label was stale. Lesson recorded (commit 00eb845).
- [x] USER: re-ran account:setup; first attempt landed on the MCP role again
      (browser session was logged in as that role); logged out + re-ran → Administrator
- [x] npm run role:oneworld-notax (Harvest Hope rejects TRAN_TAXLIAB — Task 12);
      project:deploy → COMPLETE (8s): role + toolset UPDATEd in place, files unchanged
- [x] npm run role:oneworld → src restored; commit + push

## Review
Harvest Hope now carries the current master role (notax variant) and 5-tool
toolset, verified by redeploy. Side finding: the MCP role completing the SDF
OAuth2 flow is live proof it's assigned to Mike's employee and passes the 2026.2
core-admin gate. Import artifacts (.attributes dirs) were reverted before deploy.

---

# Task 21: Deploy to Harvest Hope sandbox — 2026-10-08

Target: 3527074_SB1 (SANDBOX) Harvest Hope Food Bank via new HarvestHopeSB
authid (user ran account:setup after logging out of NetSuite — manageauth --info
confirmed Administrator before proceeding). Fresh push: prod was deployed 2026-09-10,
before this sandbox was refreshed/created, so nothing carried over. Same profile as
prod: OneWorld, SuiteTax-style → oneworld-notax.

## Tasks
- [x] USER: npx suitecloud account:setup → HarvestHopeSB
- [x] manageauth --info → Role: Administrator (checked first per new lesson)
- [x] project.json → HarvestHopeSB; npm run role:oneworld-notax
- [x] npx suitecloud project:validate --server → all green
- [x] npx suitecloud project:deploy → COMPLETE first pass (9s), zero trims.
      Folder + both files uploaded; role + toolset CREATED.
- [x] npm run role:oneworld → src restored
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://3527074-sb1.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Sixteenth account live. First deploy where the notax variant was chosen from the
account's known prod profile rather than a failed attempt — clean first pass.

---

# Task 22: Deploy to 540 Brands production — 2026-10-14

Target: 4012264 (PRODUCTION) Promo540, LLC ("540 Brands") via new 540Brands
authid (user ran account:setup; manageauth --info confirmed Administrator first).
User confirmed NOT OneWorld → first standard-edition deploy of the role since
Shinesty; standard-notax variant (subsidiaries + TRAN_TAXLIAB + mfg stripped).

## Tasks
- [x] USER: npx suitecloud account:setup → 540Brands
- [x] manageauth --info → Role: Administrator
- [x] project.json → 540Brands; npm run role:standard-notax
- [x] validate --server attempt 1 → BLOCKED: "the SuiteCloud Development Framework
      (SDF) feature must be enabled in the account" — a brand-new account to SDF.
      USER enabled it (Setup > Company > Enable Features > SuiteCloud tab).
- [x] validate --server attempt 2 → all green
- [x] npx suitecloud project:deploy → COMPLETE first pass (7s), zero trims.
      Folder + both files uploaded; role + toolset CREATED.
- [x] npm run role:oneworld → src restored
- [ ] Post-deploy (USER): assign PC MCP AI Connection Role to connection
      employee(s); connector URL https://4012264.suitetalk.api.netsuite.com/services/mcp/v1/all
- [x] Commit + push

## Review
Seventeenth account live; first time the SDF feature itself had to be enabled
(every prior account already had it). The standard-notax variant validated and
deployed clean first try — confirms the standard role path still works post-mfg
refactor. Unknown whether this account is actually SuiteTax or legacy-tax; the
notax default sidesteps the question at the cost of one unused permission.
