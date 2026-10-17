# Sales OS: the field set and script set for phase 1

> Draft v1, 2026-10-09, by the orchestrator from `SALES_OS_PROPOSAL.md` v3.1 (sections 7 and 15), `SALES_OS_PHASE1_VERIFICATION.md` and `SALES_TEAM_INTERVIEW_ANSWERS_2026-10-09.md`. **Status: awaiting Mike's line-by-line confirmation.** Once confirmed it freezes, and the plan block for `pc-sdf-author` is written from it. Script ids are proposals until the plan block. Internal.

## 1. Opportunity (transaction body fields)

| Field | Id | Type | Status | Rule |
|---|---|---|---|---|
| End Client | `custbody_pc_referral_end_user`, relabeled "End Client" | List/Record > Customer (existing, empty) | repurpose | Always set. Defaults from the entity (user event, before submit, when empty). Subbed deals: the end client is also the entity (rule (a)), so the two match on every deal; the project's parent differs. |
| Channel | native `class` ("Revenue Source") | existing, 167 of 184 set | keep | Required by the gate. Values stay as they are. Meaning comes from the channel map (section 3). |
| Referring organization | native `partner` | existing | keep | Required when the channel map row is of type referral (NetSuite, RunDTC); the RunDTC commission report keys on it. |
| Referral Contact | `custbody_pc_referral_contact` | List/Record > Contact | new | The person who sent the lead; filtered to contacts whose company is the selected Partner (client script sourcing filter; Oracle NetSuite alone has 630 contacts). |
| Partner Contact | `custbody_pc_partner_contact` | List/Record > Contact | new | The sales rep at the subcontracting firm; filtered to contacts of the channel map's billing party. Replaces `custbody_opp_af_contact`, `custbody_opp_af_contact_email`, `custbody_af_contact_phone`, which are migrated then hidden. |
| Commercial model | `custbody_pc_commercial_model` | List: Time and materials, Managed services, Power Suite subscription | new [from the interview] | Optional at intake, required by the gate. Copied to the project. |
| Signed agreement date | `custbody_pc_signed_date` | Date | new [from the interview] | Required by the gate ("we are supposed to have the signed agreement before we create a project"). |
| Deal UUID | `custbody_pc_deal_uuid` | Free text, 36 chars | new (section 15) | Set once at intake by the RESTlet; the idempotency and folder key. Never edited. |
| Engagement type | `custbody_pc_project_type` | existing list | keep, two value changes [proposed] | Required by the gate. Mike 2026-10-09: Virtual Admin is retired verbiage for MSP, so rename value 8 to "Managed Services" and add "Support", matching the project's native Project Type list. The suitelet maps it to the project's `jobType` (section 7), which the current button never sets. |
| Economics | `custbody_opp_rate`, `custbody_opp_proj_travel`, `custbody_opp_task1/2/3_title`, `_hrs`, `_rate`, `projectedtotal`, `expectedclosedate` | existing | keep | Billable rate required by the gate. Tasks optional: when Task 1 is empty the suitelet creates one "NetSuite Configuration" task at the billable rate (today's behavior); when set, tasks come from Task 1/2/3. The proposal skill sets projected total and expected close at Proposal. |
| Staffing | `custbody_opp_principal`, `custbody_opp_proj_srcon`, `custbody_opp_proj_staff`, `custbody_opp_proj_leaddev` | existing | keep | At least one (principal) required by the gate. |
| Onboarding | `custbody_opp_kickoff_meet`, `custbody_opp_asana_proj`, `custbody_opp_onboarding_sheet`, `custbody_opp_next_contact`, `custbody_opp_rapid` | existing | keep | Asana URL and kickoff date copied to the project. |
| Links | `custbody_opp_proj_create`, native `job` | existing | keep | Both set by the suitelet. |
| Loss reason | native `winlossreason` plus `memo` | existing | keep | `closeOpportunity` sets both on a loss. |
| Lead source | native `leadsource` | existing, 6 of 184 | leave | Not built on (Mike: used the same as class, and class is the financial field). Not required. |

## 2. Project (entity fields on job)

| Field | Id | Type | Status | Rule |
|---|---|---|---|---|
| End Client | `custentity_pc_end_client` | List/Record > Customer | new | Copied from the opportunity. On a direct deal equals the parent. |
| Partner Contact | `custentity_pc_partner_contact` | List/Record > Contact | new | Copied. Replaces `custentity_proj_af_contact`, `_email`, `_phone` (migrated then hidden). `custentity_proj_af_ref`, `custentity_af_minimums`, `custentity_proj_min_hrs`, `custentity_admin_hrs` stay. |
| Commercial model | `custentity_pc_commercial_model` | same list | new | Copied. |
| Deal UUID | `custentity_pc_deal_uuid` | Free text | new | Copied; links the project to its deal folder. |
| Asana URL | `custentity_pc_asana_url` | Free text (URL) | new | Copied from `custbody_opp_asana_proj`. The existing `custentity_pc_proj_asana` (List/Record, unused) is left alone. |
| Exclude from travel lists | `custentity_pc_travel_exclude` | Checkbox | new | Default off; the travel saved search excludes it. |
| Channel | `custentity_cus_rev_src` | existing (class values) | keep | Set from the opportunity class, as today. |
| Economics | `custentity_pc_project_billable_rate`, `custentity_job_billings`, `custentity_proj_min_hrs`, `custentity_admin_hrs` | existing | keep | Filled from the opportunity at creation. |
| Parent | native `parent` | existing | keep | The billing party from the channel map. |

## 3. Channel map (new custom record `customrecord_pc_channel_map`)

One row per class value: **Class** (List/Record > Class, unique), **Relationship** (list: subcontract, referral, direct), **Billing party** (List/Record > Customer, required for subcontract). A retired channel is marked with the native Inactive box; no custom Active flag (Mike, 2026-10-09). Seed rows: Direct (direct), Netsuite Alliance (referral, Partner = Oracle Netsuite), Playa Technologies (subcontract, 6, inactive), DSWi (direct), Anderson Frank (subcontract, 136), Sererra (subcontract, 198, inactive), Other (direct), RunDTC (referral, Partner = RunDTC LLC), Referral Rev Share (referral), SystemsAccountants (subcontract, 514). The suitelet refuses a class with no active row. Editing a row needs no deploy.

## 4. Scripts and searches

| Object | Id (proposed) | Does |
|---|---|---|
| Opportunity user event | `customscript_pc_opp_ue` (replaces `customscript_ue_opp_create_proj_btn`, which is inactivated, never deleted) | Before submit: default End Client from entity. Before load (view): show the Create Project button only when the readiness gate passes (End Client, active channel row, Partner on referral rows, engagement type, commercial model, billable rate, principal, signed date; project not yet linked) and otherwise list what is missing in a field-group message. |
| Client script | existing `customscript_cs_opp_create_proj_hdlr`, repointed | Button handler calls the new suitelet; contact filters for Referral Contact and Partner Contact. |
| Project builder module | `SuiteScripts/PowerCloud/crm/pc_project_builder.js` | The shared mapping: project from opportunity, tasks from Task 1/2/3 or the default task, both links, status 24 to 25, travel refresh call. Used by the suitelet and the RESTlet. Idempotent: refuses when a project is linked, writes the link before tasks, resumes a partial build. |
| Suitelet | `customscript_pc_create_project_sl` (new id beside `customscript_sl_create_project`, which stays live until cutover then is inactivated) | GET by opportunity id; re-validates the gate server-side; calls the builder. |
| CRM RESTlet | `customscript_pc_crm_api` | Section 15 actions: resolveClient, createEndClient, createOpportunity, updateOpportunity, logTouch, closeOpportunity, createProject, listTravelProjects. Two deployments: sales-write role; travel read-only role exposing only listTravelProjects. |
| Class propagation user event | `customscript_pc_class_propagate_ue` | Phase 1: before submit on invoice and credit memo (header project to header and line class when empty) and on time entry (project to class when empty). Follow-on: expense report lines. Runs on script-created records. Never overwrites a set value. |
| Saved searches | existing Awaiting-* family (743 to 748), `PC Opportunity Dashboard` (692), `Navan Project Export` (901, criteria reviewed to exclude `custentity_pc_travel_exclude` and closed projects) | Kept. New: "Opportunities missing End Client", "Projects missing Partner Contact (subcontract)", "Invoices missing class", the reconciliation searches for the rollout. |

## 5. Migration (human-gated, after the fields exist)

1. Export the AF text fields from every opportunity and project; dedupe the 12 recruiter names; create them as Contacts under Anderson Frank (136) with role "Recruiter"; keep the id map in the SDF project.
2. Set End Client on every open opportunity (16) and active or pre-kickoff project (40): equal to the entity on direct and referral rows; the end client named in the title on subcontract rows, resolved by a human from the candidate list.
3. Set Partner Contact from the migrated contacts; reconcile counts per field; hide the text fields; leave them populated for rollback until the first month closes clean.
4. Advance the 13 stuck Won - Awaiting Project opportunities to the status that matches their real state.

## 6. Confirmation (Mike, 2026-10-09)

1. "Support" versus Virtual Admin: **Virtual Admin = MSP, older verbiage, retired.** The Monday Morning dashboard groups projects by a combination of engagement type and status; the gate accepts the existing list and the grouping is read from that code (see section 7) rather than adding a value.
2. Commercial model values: **Time and materials, Managed services, Power Suite subscription.** Confirmed.
3. Readiness gate as listed, **including the new Signed agreement date** field. Confirmed.
4. Class propagation phase 1 scope: **invoices (and credit memos) and time entries first**; expense reports in a follow-on after the first month posts clean. Confirmed.
5. Sererra as an inactive subcontract row (parent 198) for the legacy projects: not yet asked; assumed yes [to confirm].

**Frozen 2026-10-09** after Mike's answers on the type mapping (Project Recovery = Rapid Assessment, Power Cloud Product = no project, NSPB = Use Case), the list change (rename Virtual Admin to Managed Services, add Support) and Sererra (active subcontract row). Two minor rows stay [to confirm] without blocking the build: New License Deal = no project (assumed from the product answer) and the unused Education value. The plan block is `C:\Development\projects\Netsuite Development\Power Cloud NS\CRM\PLAN.md`.

## 6a. Amendments after the Codex review of the plan (2026-10-09)

- **New opportunity field `custbody_pc_billing_party`** (List/Record > Customer, read-only in the UI), set by the user event from the channel map. It shows the resolved billing party on the record for approval and is the native sourcing filter for Partner Contact; Referral Contact filters natively on Partner. No client-side list manipulation.
- **New custom record `customrecord_pc_op_ledger`**, the NetSuite-side operation ledger (request id, payload hash, step, status, result) that the builder and the RESTlet use for idempotency and resume; the relay ledger in section 15 of the proposal sits on top of it.
- **Namespaced external ids** on opportunity, project, tasks and contacts (`pc_opp_{uuid}`, `pc_proj_{uuid}`, `pc_task_{uuid}_{n}`, `pc_contact_...`) are the uniqueness and recovery keys.
- **The native opportunity-to-project link cannot be set on subcontract deals**: NetSuite accepts only a project of the opportunity's own entity, and the project's parent is the billing party. The builder records `nativeLink: false` on those deals; the custom link is the link of record. The proposal's "set the native link at creation" holds for direct and referral deals only.
- The channel map needs no permission to read (reference data); the ledger is permissioned.
- **The channel map has no Partner column** (2026-10-09): no field in the account targets the Partner record type, so its SDF record type number could not be confirmed, and the readiness gate already requires the native Partner field on referral deals. Contact confirmed as -6 and Customer as -2 from the account's own fields.

## 7. Engagement type to project type (verified 2026-10-09)

The Monday Morning dashboard (`dashboard.py`, `categorize_project`) groups projects from the project record's **native Project Type (`jobType`)** plus status: status Post Go Live or type Support → Support-PostGoLive; Virtual Admin or Managed Services → VAS-MSP; Implementation, Rapid Assessment or Use Case → Implementation-Rapid. The account's `jobtype` list: 1 Implementation, 2 Use Case, 3 Rapid Assessment, 4 Integration, 5 Support, 6 SuiteCommerce, 7 Travel Placeholder, 8 Virtual Admin, 9 Managed Services. **The current suitelet never sets `jobType`**: six of the 47 active, pre-kickoff and post-go-live projects carry none (Acme Paper RA, 540Brands, Upper Echelon, Goodheart-Wilcox CRM and SCA, Onward Reserve), all recent button-created projects, so they fall out of every dashboard category. The builder sets it from the opportunity's engagement type, and the migration backfills the six.

| Opportunity engagement type (`custbody_pc_project_type`) | Project `jobType` |
|---|---|
| 2 New Implementation | 1 Implementation |
| 3 Rapid Assessment | 3 Rapid Assessment |
| 4 Use Case | 2 Use Case |
| 5 Project Recovery | 3 Rapid Assessment (Mike, 2026-10-09) |
| 7 SuiteCommerce | 6 SuiteCommerce |
| 8 Virtual Admin, renamed Managed Services (Mike, 2026-10-09) | 9 Managed Services |
| Support (**new** value on `customlist_pc_proj_types`; the list read 2026-10-09 has no Support value: 1 New License Deal, 2 New Implementation, 3 Rapid Assessment, 4 Use Case, 5 Project Recovery, 6 Education, 7 SuiteCommerce, 8 Virtual Admin, 9 Power Cloud Product, 10 NSPB; Mike's "id 5 is Support" is the project type list) | 5 Support |
| 6 Education (unused) | no mapping; the gate blocks with a message [to confirm, or inactivate the value] |
| 9 Power Cloud Product | **no project** (Mike, 2026-10-09): the gate refuses to create one and the close skill records the product sale without a project |
| 10 NSPB | 2 Use Case (Mike, 2026-10-09) |
| 1 New License Deal | no project [assumed from the product answer, to confirm] |

A row with no mapping blocks the gate with a message naming the type, rather than creating an untyped project. Channel map: Sererra is an **active** subcontract row (parent 198), Mike 2026-10-09.
