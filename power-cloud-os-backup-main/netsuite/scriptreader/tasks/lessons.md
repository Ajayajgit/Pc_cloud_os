# Lessons — Script Reader

## SDF deploy/validate requires the "SuiteApp Deployment" permission (ADMI_APP_DEPLOYMENT)
**Symptom:** `suitecloud project:validate --server` (and deploy) fails with
`... idevalidationhandler.nl - Moved Temporarily` (HTTP 302). The error is opaque on the
console — the real cause is in the redirect `Location` header, which deeplinks to a
permission-violation page. Decode the base64 `errorMessage` param to read it.
**Root cause here:** the project was authenticated (via `account:setup`) using the account's
**non-Admin MCP role** ("PC MCP AI Connection Role", roleId 1009), which lacks SDF deploy rights.
**Rule:** SDF validate/deploy needs a role with **SuiteApp Deployment** permission (Administrator
or a dedicated SDF-developer role) — this applies to BOTH SuiteApp and ACCOUNTCUSTOMIZATION
projects (the endpoint is historically named `/app/suiteapp/...` but gates all SDF deploys).
Keep this separate from the AI Connector run-time role, which must stay non-Admin and minimal.
**How to apply:** when an SDF server call 302-redirects, read `~/.suitecloud-sdk/log/<ver>/*.log`,
find the `Location:` header, base64-decode the `errorMessage`. Re-auth with an admin/deploy role.

## CLI version must match the account's NetSuite release
@oracle/suitecloud-cli: 3.0.x=2025.1, 3.1.x=2025.2, 3.2.x=2026.1. The Java SDK jar
(`~/.suitecloud-sdk/cli/cli-<ver>.jar`) does the real work; `--version` only shows the Node
wrapper. Pin per-project via devDependency + `npx suitecloud` to avoid disturbing the global CLI.

## The "object will be categorized as a data file" warning is benign for tool/toolset
Custom-tool objects (`tool` 2025.2 / `toolset` 2026.1) aren't in the offline SDF schema, so local
validation always flags them as data files. They still validate/deploy server-side. Don't chase it.

## `project:validate --server` does NOT catch every invalid role permkey — deploy is the final gate
**Symptom (American Barbell SB, 2026-08-13):** full `--server` validation ALL GREEN, then
`project:deploy` failed creating the role: `Invalid permkey1 reference key TRAN_TAXLIAB`
(legacy Pay Sales Tax — not a valid permission in accounts on SuiteTax-style config).
**Rule:** the validate → deploy ladder is local validate (noisy, schema lag) < server validate
(catches most, e.g. SUBSIDIARIES-gated keys) < deploy-time object creation (authoritative for
feature-gated permkeys). A green server validation does not guarantee the role will create.
**How to apply:** treat first deploy to a new account as part of validation. On
`Invalid permkey1 reference key X`, trim X from the src/Objects generated copy only (master
untouched unless it's a platform rule), redeploy — errors surface one key per attempt.
Failed deploys are not atomic: files uploaded before the failing object stay uploaded; the
retry just skips/re-uploads and continues.

## 2026.2: MCP/AI Connector roles must NOT have Core Administration Permissions
**Symptom:** after an account's 2026.2 upgrade, MCP OAuth2 reauth fails with "Your role does
not support OAuth2 login" on a role that worked on 2026.1.
**Cause:** NetSuite always documented that the AI Connector won't run for Administrator or
"full permissions" roles; 2026.2 started enforcing it at the OAuth handshake (unannounced —
not in release notes). `coreadminpermission=T` puts a custom role in that bucket.
**Fix:** coreadminpermission F (baked into the role master), then revoke the client's entry
under Setup > Integration > OAuth 2.0 Authorized Applications and reconnect. Keep
ADMI_MCP_SERVER / ADMI_LOGIN_OAUTH2 / ADMI_RESTWEBSERVICES FULL explicit, and
iswebserviceonlyrole=F (web-services-only blocks the consent flow — separate failure, similar
look). If a query/tool breaks after the change, core-admin was silently covering a permission —
add it explicitly, don't re-check the box.

## Some documented record columns are NOT_EXPOSED to SuiteQL — verify before shipping a query
`ScriptDeployment.StartDate` exists in the SuiteScript Records Browser but throws
`Field 'StartDate' for record 'scriptDeployment' was not found. Reason: NOT_EXPOSED - Not
available for channel SEARCH` when queried via N/query/SuiteQL. The error is a compile-time
failure (no rows ever return), so a single bad column breaks the whole query.
**Rule:** don't trust the Records Browser alone for SuiteQL column availability — probe each
column against the live account (ns_runCustomSuiteQL or query.runSuiteQL) before relying on it.
Other ScriptDeployment columns (Status, IsDeployed, ExecutionContext, RecordType, LogLevel) are
fine. Wrapping every tool query in try/catch (as we did) turns this into a clean error, not a crash.

## Verify EVERY tool path live — listing/reading passing doesn't mean all paths pass
3 of 4 tools worked first try; the 4th (getScriptDeployments) had the StartDate bug. Only a live
call against real data surfaced it. Test each distinct code path, not just the happy one.

## Custom tools missing from an MCP client? Check the connector URL path FIRST
**Symptom (Shinesty, 2026-07-09):** toolset deployed clean, visible in Custom Tools UI, every
role passed the permission gate — yet Claude's connector only listed standard ns_* tools, even
after a full connector remove + fresh OAuth.
**Root cause:** the NetSuite MCP endpoint path scopes toolsets.
`.../services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools` (the setup-guide default) serves
ONLY the standard tools SuiteApp; ACP-deployed toolsets require
`.../services/mcp/v1/all` (docs section_0714082142).
**Rule:** when deployed MCP tools don't appear in a client, verify the endpoint URL scope before
theorizing about caching, OAuth grants, or role permissions. Hours of diagnosis, one URL segment.
**Order of checks:** 1) connector URL path → 2) toolset deployed + exposetoaiconnector=T →
3) role passes the toolset <permissions> gate → 4) reconnect/re-auth the client.

## When the same per-account trim recurs, promote it to a generator variant
TRAN_TAXLIAB was hand-trimmed from src/Objects on 6 of 11 deploys (every new account since
American Barbell) — each one a failed first deploy attempt plus a manual Edit. A pattern that
repeats across accounts belongs in `scripts/set-role-variant.js` as a modifier (`--notax`,
exposed as `npm run role:oneworld-notax` / `role:standard-notax`), not in the master (which would
break the legacy-tax accounts on redeploy) and not in a manual edit each time.
**Rule:** two rejections of the same key = coincidence; three = build the variant. Default new
accounts to `-notax`; use the plain variant only for accounts known to run legacy tax
(Bundling, Shinesty, PC LLC, Absci, ACL).

## A sandbox refresh is a full reset for this project
**Symptom (ACL Airshop SB, 2026-10-08):** sandbox refreshed from production; the toolset, role,
files, SDF auth token, OAuth2 authorized-app grants and employee role assignments were all gone
(deploy CREATED both objects rather than UPDATEd). Production never had the toolset, so the
clone brings nothing over.
**Rule:** treat a refreshed sandbox as a new-account deploy: user re-runs `account:setup`
(old token is dead even if the authid still lists), use the SAME role variant as the account's
previous task entry (legacy-tax accounts keep the plain variant, not the notax default), then
the user re-assigns the role and re-authorizes the connector. Unless production also carries
the toolset, every sandbox refresh will need this.

## A browser token refresh can silently switch the authid's role — check `manageauth --info` first on a 302
**Symptom (Harvest Hope prod, 2026-10-08):** authid had deployed fine on 2026-09-10 as Administrator.
Its token expired; the CLI auto-refreshed it in the browser and the refreshed token came back bound
to "PC MCP AI Connection Role" (the employee now has both roles and NetSuite picked the MCP one).
Result: `object:import` of the role → "Bulk Manage Roles" permission violation; `project:deploy`
and `validate --server` → 302 to the SuiteApp Deployment permission page. `manageauth --list`
still showed the stale "Administrator" label — only `account:manageauth --info <authid>` shows
the live Role.
**Rule:** on any SDF 302 or permission violation, run `npx suitecloud account:manageauth --info
<authid>` before anything else. If Role isn't Administrator (or an SDF-deploy role), the user
must re-run `account:setup` and pick Administrator explicitly; nothing else will fix it.
Side effect worth noting: the MCP role completing the SDF OAuth2 flow is live proof it passes
the 2026.2 core-admin OAuth2 gate and is assigned to that employee.
