---
date: 2026-09-17
from: justin
source: GW
area: ScriptReader project (C:\Users\lombo\NetSuiteDev\ScriptReader), customrole_pc_mcp_ai_connection role template
type: bug
cost: 25m
blocking: yes
frequency: first-time
class: wrong
autonomy: n-a
status: new
---

## What happened
[Verified] Deployed the standard PC MCP AI Connection role + ScriptReader toolset to GW's sandbox (9514504-sb1) and production (9514504) via SDF, with client go-ahead. Both deploys validated and installed cleanly. Production's OAuth2 login (Claude AI Connector) worked; sandbox's did not, failing with NetSuite's own message: "Your role does not support OAuth2 login, please select a different one." The role's assigned permissions (`ADMI_LOGIN_OAUTH2` FULL, `iswebserviceonlyrole=F`, `issinglesignononly=F`, `tfarequired=OFF`) were all correct, and the role was confirmed properly assigned to the connecting employee's Access tab in sandbox — ruled both out before finding the real cause.

Root cause: the role template (`roles/customrole_pc_mcp_ai_connection.master.xml`) had `<coreadminpermission>T</coreadminpermission>` with `<parentrolescriptid>CEO</parentrolescriptid>`, which makes the role administrator-equivalent in NetSuite's eyes even though it isn't literally named "Administrator." NetSuite's OAuth2 authorization flow rejects administrator-equivalent roles for this login type, the same restriction TBA already applies to the literal Administrator role. This directly contradicts the project's own README ("the AI Connector does not support Administrator... keep it minimal"), so the template itself was inconsistent with its own stated design intent, not something specific to GW's account. Any future engagement deploying this project fresh would hit the identical failure, silently, until diagnosed the same way.

## What I did instead
Set `coreadminpermission` to `F` in the master template, regenerated the OneWorld deployable variant (`npm run role:oneworld`), redeployed to sandbox first, confirmed the OAuth2 login succeeded, then redeployed the same fix to production. Fixed at the master-template source, not just patched in GW's deployed copy, so the next engagement to deploy this project inherits the fix.

## Suggested fix
- [Reported] Justin: not asked directly this time (fix was applied and confirmed working in the moment); worth a quick look at whether the `standard` (non-OneWorld) role variant has the same flag and needs the same fix.
- [Inferred] Claude: add a note to the ScriptReader README's deploy section calling out that `coreadminpermission` must stay `F` for this exact reason (OAuth2 login on admin-equivalent roles is rejected), so a future edit to the master template doesn't reintroduce this silently. Also worth a fast smoke test (attempt the OAuth2 login) as a stated step right after every fresh deploy, rather than assuming success from a clean SDF validate/deploy, since SDF deployment succeeding says nothing about whether the role can actually authenticate.

## Disposition

