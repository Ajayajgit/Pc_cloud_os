# T2 and T4 acceptance runbook (production, Testing deployments)

Written 2026-10-09. The new scripts are deployed with status Testing, so they run only for the user who deployed them (Mike, the SuiteCloud profile user). Mike drives the UI; the orchestrator verifies every step with read-only SuiteQL through the connector and records results in `build_log.md`. Nothing here touches a real deal: every record is titled `ZZ TEST ...`, which makes the builder set the travel exclusion and skip the relay call.

## Before starting (Mike, once)

1. Customization > Scripting > Scripts > "PC | Create Project Service" > Deployments > the deployment > Parameters: `PC | Support Type ID` = **11**. Same on "PC | Opportunity CRM Guard" > its deployment > `PC | Support Type ID` = **11**. Leave `PC | Allowed Role Script IDs` blank and `PC | Fail After Step (Test)` blank.
2. Create a test customer "ZZ TEST Direct Client" (Lists > Relationships > Customers > New; company; nothing else required).

## Test records

Create two opportunities (Transactions > Sales > Create Opportunities). Save each, then re-open in view.

| Field | Opportunity A (direct) | Opportunity B (subcontract) |
|---|---|---|
| Company | ZZ TEST Direct Client | ZZ TEST Direct Client (the end client; the parent will be Anderson Frank) |
| Title | ZZ TEST Direct - Rapid Assessment | ZZ TEST Subbed - Rapid Assessment |
| Class (Revenue Source) | Direct | Anderson Frank |
| Status | Won - Awaiting Project | Won - Awaiting Project |
| Project Type (opportunity) | Rapid Assessment | Rapid Assessment |
| PC \| Commercial Model | Time and materials | Time and materials |
| General Billable Rate | 205 | 205 |
| Solution Principal | Mike | Mike |
| Senior Consultant | any employee | leave empty |
| PC \| Signed Agreement Date | today | leave **empty** on first save |
| PC \| Deal UUID | `11111111-1111-4111-8111-111111111111` | `22222222-2222-4222-8222-222222222222` |
| Task 1 Title / Est. Hrs / Hrly Rate | Discovery / 10 / 205 | leave all task fields empty |
| Task 2 Title / Est. Hrs / Hrly Rate | Build / 20 / 205 | |
| Projected Total | 6150 | 4100 |

On save the guard sets **PC | Billing Party** (A: ZZ TEST Direct Client; B: Anderson Frank) and **End Client** (A: the company; B: the company). Check both after saving.

## Steps, in order

| # | Plan criterion | Do | Expect |
|---|---|---|---|
| a | gate blocks | Open B in view | A yellow "Project setup is not ready. Missing:" block listing Signed Agreement Date; no button |
| b | gate passes, project built | Edit B, set the signed date, save, view. Click **Create Project** | "Project ready" message, page reloads; status now Won - Ready for Kick Off; no button (state complete) |
| c | replay by button | View B again, confirm no button; open A, create its project the same way | A gets its project; B unchanged |
| e | partial then resume | Edit the suitelet deployment: `PC | Fail After Step (Test)` = **2**. Create a third opportunity C like A but Deal UUID `33333333-3333-4333-8333-333333333333`, title `ZZ TEST Fault - Rapid Assessment`. Click Create Project | Error message "Injected test fault after step 2"; reload shows **Resume Project Setup** |
| e2 | resume | Clear the parameter (blank), view C, click Resume Project Setup | "Project ready"; one project, tasks created once |
| f | channel rules | (verified by query on A and B) | A: parent = ZZ TEST Direct Client, native link set. B: parent = Anderson Frank, native link not set, custom link set |
| g | no project for product deals | Create opportunity D like A with Project Type = Power Cloud Product, Deal UUID `44444444-4444-4444-8444-444444444444` | View shows "No project is created for this engagement type."; no button |
| h | XEDIT updates Billing Party | On the opportunities list, inline-edit A's class to Anderson Frank, then back to Direct | Billing Party follows each change (query) |
| T4-1 | invoice class | Create an invoice for ZZ TEST Direct Client with project = A's project, one service line, class empty | After save header class and line class = Direct (query) |
| T4-2 | time entry class | Enter one time entry on A's project with class empty | After save class = Direct (query) |
| d | concurrency | Skipped in the UI (one user cannot double-submit; covered by the unit test and the ledger's external id claim) | |

After the run: inactivate opportunities A to D and their projects, delete the test invoice and time entry, inactivate the test customer. The orchestrator confirms by query that every ZZ TEST project carries the travel exclusion.

## What the orchestrator queries after each step

Opportunity: `entitystatus`, `custbody_pc_billing_party`, `custbody_pc_referral_end_user`, `custbody_opp_proj_create`, `job`. Project: `parent`, `jobtype`, `externalid`, `custentity_pc_end_client`, `custentity_cus_rev_src`, `custentity_pc_travel_exclude`, tasks by `externalid` with assignee hours. Ledger: rows by opportunity with status and step. Invoice and time entry: header and line `class`.
