# MCP Read-Only Admin role — research summary (2026-07-09)

Resume kit for building `src/Objects/customrole_pc_mcp_readonly.xml`.
Raw data in this folder: `ids_levels.tsv` (682 documented permission IDs with
valid levels), `permkeys.txt` (730 SDF `generic_permission` enum values),
`oracle_permissions.json` (Oracle's official name↔ID list), `final_list.txt`.

## SDF customrole XML — key facts
- Root element is `<role scriptid="customrole_...">` (NOT `<customrole>`).
  Scriptid max 40 chars, must begin `customrole`. File in `src/Objects/`.
- Element order: scalar fields ALPHABETICAL, then `<permissions>` last
  (verified against real `object:import` output in public repos).
- Planned scalars (alphabetical): centertype=BASIC, coreadminpermission=F,
  employeerestriction=NONE, employeeselectionunrestricted=F, isinactive=F,
  ispartnerrole=F, issalesrole=F, issinglesignononly=F, issupportrole=F,
  name="PC MCP Read-Only Admin", restrictbydevice=F, restricttimeandexpenses=F,
  subsidiaryoption=ALL, tfarequired=OFF, permissions.
- OMIT feature-gated role fields: iswebserviceonlyrole (needs WEBSERVICES in
  manifest; also OAuth2 browser login must stay possible), issuerole,
  subsidiaryviewingallowed, accountingbooksoption, restrictip, tfaduration.
- Permission entry: `<permission><permkey/><permlevel/></permission>`;
  `<restriction>` only for custom-object permkeys — omit for standard perms.
  Duplicate permkeys = validation failure.

## AI Connector (MCP) hard requirements on the connecting role
| permkey | level | note |
|---|---|---|
| ADMI_MCP_SERVER | FULL | "MCP Server Connection"; None/Full only; missing from generic_permission docs page but provably deploys via SDF |
| ADMI_LOGIN_OAUTH2 | FULL | None/Full only; needs OAUTH2 feature |
| ADMI_RESTWEBSERVICES | FULL | None/Full only; for MCP Standard Tools SuiteApp |
| REPO_ANALYTICS | EDIT | SuiteAnalytics Workbook — **None/Edit only, VIEW is INVALID** |
| LIST_FIND | FULL | Perform Search (valid N/V/F) |
- Admin role AND "roles that have full permissions to access NetSuite features"
  are rejected by the AI Connector → keep everything else at VIEW.
- No 2FA requirement for these; do NOT add 2FA-mandatory perms
  (ADMI_KERNEL, ADMI_INTEGRAPP, ADMI_MANAGE_OAUTH_TOKENS, ADMI_MANAGE_OAUTH2,
  ADMI_DEVICE_ID, ADMI_VIEWCREDITCARDS, SSO setup perms...).
- MCP endpoint: https://<acct>.suitetalk.api.netsuite.com/services/mcp/v1/all

## Generation rules for the permissions block (~525 entries)
From `ids_levels.tsv`:
- TRAN_/LIST_/REPO_/REGT_ rows: emit at VIEW where View is a valid level.
- ADMI_ rows: emit at VIEW only where View is valid (~60 of 210; the other
  ~150 are None/Full only and MUST NOT get VIEW).
- Force-include: the 5 MCP-required rows above, plus ADMI_AUDITLOGIN FULL and
  ADMI_DELETEDRECORD FULL (view-only in effect, but Full-only level),
  GRAP_AP/AR/EXP/INC/NETWORTH VIEW (enum-only, deploy at VIEW),
  LIST_SYSTEMNOTES VIEW + LIST_MESSAGE_UNRESTRICTED VIEW ("...for Analytics
  and REST" — valuable for SuiteQL; docs-enum lag, verify on validate),
  LIST_BULK_PROCESSING VIEW + LIST_ENTITYSUBSIDIARYRELATION VIEW (seen deployed).
- Deliberate exclusions: LIST_EMPLOYEESSN (PII), 2FA-mandatory perms,
  action-only perms with no VIEW level (LIST_EXPORT, LIST_BIG_SEARCH,
  REPO_SCHEDULE, REPO_GRANT_ACCESS, TRAN_AUTO_CASH...), NLCORP-internal
  (ADMI_PROVISION, ADMI_TSTDRV_MASTER), unproven enum-missing IDs
  (ADMI_PROMPTS, ADMI_RAG, LIST_LICENSEPLATE, LIST_PRICINGRECORDS,
  LIST_SAASMETRIC, LIST_TIMEOFF, LIST_VENDOR_ACH, LIST_PICKDECOMPOSITION),
  REPO_PAYROLLHIDEFINEMPINFO (behavior-changing, not access-granting).
- Sort all permission entries alphabetically by permkey.
- Feature-gated perms will fail server validation in accounts lacking the
  feature → generate maximal list, then trim from `project:validate` errors
  (they name the offending permkey). Expect possible manifest feature
  dependency errors too (validator names the feature to declare).

## Validation loop (once auth works)
1. `npx suitecloud project:validate` (local schema/enum check, no account)
2. `npx suitecloud project:validate --server` with an ADMIN authid
   (`PC_SDN_BUNDLING_ADMIN` — token EXPIRED as of 2026-07-09, needs browser re-auth)
3. Trim/adjust per error list, repeat, then deploy.

## Gotchas
- SDF's own `object:import` can emit XML that fails validation (UI stores
  levels the XML validator refuses) — never trust imported roles blindly.
- Alias IDs appear twice in docs (ADMI_ACCTSETUP, ADMI_WEBSERVICES...) — one
  entry per ID.
- UI-only, cannot ship in XML: subsidiary multi-select, Forms/Searches/
  Dashboard sublists.
- The toolset gate (custtoolset_pc_scriptreader.xml) requires LIST_FILECABINET
  VIEW on the connecting role — included in the VIEW sweep.
