# T3 acceptance runbook (production, Testing deployments)

Written 2026-10-09. Runs after Mike deploys T3 (roles, RESTlet, ledger grant, suitelet audience and run-as). Unit tests cover the branching (`__tests__/pc_crm_api_rl.test.js`); these are the account tests the plan and the Codex review say only the account can prove. Every record is `ZZ TEST ...`. The orchestrator verifies by SuiteQL and records results in `build_log.md`.

## Before starting (Mike, once)

1. Integration record "Power Cloud CRM API" with OAuth 2.0 client credentials and the two certificate mappings (sales role, travel role), both mapped to **Mike's own employee record** as the entity (decided 2026-10-09: no dedicated integration user, which saves a full user license and is also what a TESTING deployment requires, since Testing answers only the script owner). Mike's record carries both roles under Access > Roles; the RESTlet allowlist keys on role and deployment, never on the user, so test 4 (Administrator refused) still holds. Until the relay exists, calls come from a small script on Mike's machine (`curl` or Node) holding the private keys; nothing on the Drive.
2. Script parameters on `customscript_pc_crm_api` (both deployments): `PC | Support Type ID` = 11; `PC | Travel Search ID` blank; `PC | Disabled Actions` blank; `PC | Fail After Step (Test)` blank; `PC | End Client Subsidiary ID` = 1 (Power Cloud Consulting, LLC; the account is OneWorld).
3. `custscript_pc_sl_allowed_roles` on the suitelet deployment = `customrole_pc_crm_sales_write` (the suitelet now executes as that role; if `runtime.getCurrentUser().roleId` reports the run-as role, the parameter keeps the role check passing). Re-run runbook step b of `T2_acceptance_runbook.md` once after the T3 deploy to confirm the button still works under the run-as role.
4. A ZZ TEST customer and the ZZ TEST opportunities from the T2 runbook (A at status 25 after its project; D the Power Cloud Product deal).

## Tests, in order

| # | Criterion | Call | Expect | Verify |
|---|---|---|---|---|
| 1 | A1 travel list | travel token, travel deployment, `listTravelProjects`, payload `{}` | `ok`, `count` 46 minus any project with Exclude From Travel Lists ticked, rows sorted by projectId, every `approverEmail` a string or null | compare with `migration/travel_search_901_2026-10-09.csv` |
| 2 | A2 travel role refused elsewhere | travel token, travel deployment, `resolveClient {name: 'ZZ'}` | `PC_API_REFUSED` | ledger: no new row |
| 3 | A3 sales role refused on travel | sales token, sales deployment, `listTravelProjects` | `PC_API_REFUSED` | |
| 4 | Administrator refused | an Administrator TBA or OAuth token (Mike's), sales deployment, `resolveClient` | `PC_API_REFUSED` (the allowlist admits only the two role and deployment pairs) | |
| 5 | A11 resolveClient | sales, `resolveClient {name: 'ZZ TEST'}` | candidates with the ZZ TEST customer, `isBillingParty` false | ledger: no row |
| 6 | createEndClient | sales, `createEndClient {clientUUID, companyName: 'ZZ TEST API Client', revenueSourceId: 1, contacts: [two]}` | customer and two contacts created with external ids `pc_client_...`, `pc_contact_..._1`, `_2` | SuiteQL on `customer.externalid`, `contact.externalid`; ledger row done |
| 7 | A9 resume | set `PC | Fail After Step (Test)` = 1; `createEndClient` with a new clientUUID `ZZ TEST API Client 2`; expect `PC_API_FAILED` step 1; clear the parameter; resend the same request id and payload | second answer `ok`, customer not duplicated, contacts created | ledger: one row, status done, step 3 |
| 8 | A7 replay | `createOpportunity` for the ZZ TEST customer (`entityStatusId` 9, class Direct, engagement type Rapid Assessment, new dealUUID) twice with the same request id | second answer `replayed: true`, same opportunityId | one opportunity with external id `pc_opp_{D}` |
| 9 | A8 same deal UUID | the same payload with a new request id | same opportunityId, `created: false` | still one opportunity |
| 10 | A10 mismatch | the first request id with a changed title | `PC_API_REPLAY_MISMATCH` | ledger row untouched |
| 11 | Deal UUID for another customer | same dealUUID, another ZZ TEST customer as entity, new request id | `PC_API_BAD_REQUEST` | |
| 12 | A4 status machine | `updateOpportunity` on that opportunity to 13, then 14, then 24 | three `PC_API_REFUSED_STATUS` answers | opportunity status unchanged; three refused ledger rows |
| 13 | open to open | `updateOpportunity` 9 to 11 with `expectedClose` | `ok` | status 11 |
| 14 | A6 close won | `closeOpportunity won` with `signedDate` | `ok`, status 24, `noProject` false; signed date set | T2 user event showed nothing wrong on save |
| 15 | A6 close refused | `closeOpportunity won` again (new request id) | `PC_API_REFUSED_STATUS` | |
| 16 | createProject through the API | `createProject {opportunityId}` after setting rate, principal, commercial model | `ok`, builder result, status 25 | project with `pc_proj_{D}`, travel exclusion ticked |
| 17 | 25 to 23 | `updateOpportunity {entityStatusId: 23, kickoffDate}` | `ok`, status 23 | |
| 18 | closed immutable | `updateOpportunity` on opportunity D (status 13 after its own close) | `PC_API_REFUSED_STATUS` | |
| 19 | logTouch | `logTouch {opportunityId, title, note, nextContact}` | phone call created with external id `pc_touch_{requestId}`, next contact set | `phonecall.externalid`; replay returns the stored result |
| 20 | A6 close lost | a second ZZ TEST opportunity, `closeOpportunity lost` with a win/loss reason id read from the UI | `ok`, status 14, reason set | if the reason lookup fails with an unknown search type, `winlossreason` is the suspect (T3 packet D1) |
| 21 | A12 kill switch | `PC | Disabled Actions` = `logTouch`; `logTouch` | `PC_API_DISABLED`; clear the parameter | |
| 22 | A12 bad requests | GET on the RESTlet; a body with an extra top-level key; a payload with an unknown key | three `PC_API_BAD_REQUEST` answers | ledger: no rows |
| 23 | relay refresh | a non-test opportunity is not used; instead confirm in the execution log that `refreshRelay` on test records logs `skipped (test record)` | | |

Permission failures: any `PC_API_FAILED` whose `errorName` is `INSUFFICIENT_PERMISSION` names the permission to add to the role, at the lowest level that passes, with a line in `build_log.md` (plan T3: levels are raised only with a ledger note). First suspects: `customrecord_navan_config` View for the sales role (relay refresh under the suitelet's run-as role), LIST_EMPLOYEE View for the travel role if `approverEmail` comes back null for every row, Custom Lists for the engagement type and commercial model list searches.

After the run: inactivate the ZZ TEST customers, contacts, opportunities, projects and the phone call; leave the ledger rows (they are the audit trail of the test).
