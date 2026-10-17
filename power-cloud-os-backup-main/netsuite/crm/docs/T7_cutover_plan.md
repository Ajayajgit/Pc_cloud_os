# T7: cutover plan (one controlled window)

Written 2026-10-15 (session f8e341c2), after T6 closed clean. Account: Power Cloud production 5641465, no sandbox. Every account change below happens only on Mike's word; deploys use a narrowed `deploy.xml`, restored after each.

## State going in (verified 2026-10-15)

| Object | Now | After T7 |
|---|---|---|
| `customscript_pc_crm_opp_ue` / `customdeploy_pc_crm_opp_ue` (Opportunity guard: Billing Party, End Client default, button) | TESTING, owner Mike (fires for Mike only) | RELEASED |
| `customscript_pc_crm_create_project_sl` / `customdeploy_pc_crm_create_project_sl` (builder service) | TESTING, audience Administrator and `customrole_pc_crm_sales_write`, runs as the sales write role | RELEASED |
| `customscript_ue_opp_create_proj_btn` / `customdeploy1` (legacy button, beforeLoad, UI) | RELEASED | not deployed |
| `customscript_sl_create_project` / `customdeploy_sl_create_project` (legacy suitelet) | RELEASED | not deployed |
| `customscript_cs_opp_create_proj_hdlr` (legacy client script on Opportunity) | RELEASED | not deployed (Mike, 2026-10-15); the file stays |
| `customscript_pc_crm_class_propagate_ue` (T4, three deployments) | TESTING | RELEASED (Mike, 2026-10-15) |
| RESTlet deployments (T3) | TESTING | unchanged until T8 |

No opportunity sits at status 24 (T6 moved the 13), so no deal is mid-flight when the button changes hands.

## Answers (Mike, 2026-10-15)

1. Create Project is pressed by Administrator only for now: suitelet audience unchanged (Administrator is always allowed by the service; the sales write role stays in the audience for the API path).
2. `PC | Support Type ID` = 11 on the suitelet and on the guard.
3. The orchestrator drives the UI in Chrome; Mike confirms each save.
4. T4 class propagation is released in the same window.
5. The legacy client script `customscript_cs_opp_create_proj_hdlr` is undeployed too (W2), so nothing legacy loads on opportunities.
6. Principal on the test deals: Mike (employee 3).

## The window

W1. **Release (SDF, narrowed deploy).** Scope: the guard and suitelet script objects with their script files (a script object needs its file in scope), plus the T4 object and file. Change: `<status>RELEASED</status>` on each deployment; audience per question 1. `project:validate`, deploy, restore `deploy.xml`, confirm by SuiteQL on `scriptdeployment`.

W2. **Legacy off (UI).** Customization > Scripting > Script Deployments: `customdeploy_sl_create_project`, the legacy button's `customdeploy1` and the legacy client script's deployment, untick Deployed, save. Confirm by SuiteQL (`isdeployed` F on all three). The old scripts and files stay.

W3. **Test deals (production, ZZ TEST, travel exclusion and relay skip apply).** One test end client "ZZ TEST Cutover Client" (Revenue Source required) and three opportunities, each with class, End Client, engagement type Rapid Assessment (3), commercial model Time and materials, rate 205, principal, signed date, Task 1 title, hours and rate, status Won - Awaiting Project (24):

| Deal | Class | Fault injected | Proves |
|---|---|---|---|
| ZZ TEST Cutover A | Direct (1) | `PC | Fail After Step (Test)` = 1 | T2 (e) step 1, end to end through the UI button, native link set |
| ZZ TEST Cutover B | Anderson Frank (5) | = 2 | T2 (e) step 2, subcontract parent 136, `nativeLink` false |
| ZZ TEST Cutover C | Direct (1) | = 3 | T2 (e) step 3 |

For each: set the parameter on the suitelet deployment; open the deal; the guard shows Create Project; click it; expect the injected fault and the state `partial` (Resume Project Setup shown). Clear the parameter; click Resume; expect `complete`, status 25, one project with external id `pc_proj_{D}`, tasks by `pc_task_{D}_n` with no duplicates, one ledger row done. Checks by SuiteQL after each.

W4. **T2 (h) XEDIT.** On deal C, inline-edit Class in an opportunity list (Direct to Anderson Frank): Billing Party must become 136. Inline-edit back to Direct: Billing Party empty again. SuiteQL after each.

W5. **Searches and record.** The six PC searches (opp missing End Client stays 0 apart from any open test deal; status-24 recon 0). Record every step, id and result in `build_log.md`.

W6. **Cleanup.** Parameter cleared (checked). Mike deletes the test records: project tasks first (removes planned time), then projects, opportunities, the test client and its contacts. SuiteQL: zero ZZ TEST records. Ledger rows stay as the audit trail.

## Rollback

Any failure in W3 or W4 that is not the injected fault: set the guard and suitelet deployments back to TESTING (same narrowed deploy, status reverted) and re-tick Deployed on the two legacy deployments. Data written by T6 is untouched by T7; test records are deleted as in W6.

## After the window

- PLAN.md T3 permission lists refreshed from `src/Objects/Roles/*.xml` (orchestrator).
- FDD and TDD tables under `docs/` from the code (pc-code-chores), reviewed.
- Open, not T7: native `job` link on the 6 legacy direct deals; the 3 failed test ledger rows of 2026-10-09; the invoice search formula (T5).
