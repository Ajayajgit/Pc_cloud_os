# Sales OS phase 1: account verification

> Written 2026-10-08, session e211b3a2, by the orchestrator from read-only queries against Power Cloud's own NetSuite production account through the Power Cloud NetSuite connector, plus a read-only SDF import. Every row is **[Verified]** unless marked. This file answers the "Verify" step of `SALES_OS_PROPOSAL.md` v3 section 11 and feeds the plan block for the `Power Cloud NS/CRM` build. Internal; never client-facing.

## Account and connection

| Fact | Value |
|---|---|
| Account | 5641465, PRODUCTION, release 2026.2, connector role id 1121 |
| Sandbox | None exists (Mike, 2026-10-08). Build is production-only, additive-first. |
| Connector role | Not the standard role. Symptoms: company information blocked ("role lacks Set Up Company"), `customfield` table blocked, heavy rate limiting (roughly half of parallel calls refused), GROUP BY on several columns refused as "Invalid or unsupported search". Decision 8 (move to `customrole_pc_mcp_ai_connection`) stands and is now also a build-speed issue. |
| SDF auth profile `PowerCloudProd` | Imports scripts; refused on custom fields ("Custom Body Fields" and "Custom Entity Fields" permission) although listed as Administrator. Re-authorize under a true Administrator role before `object:import` of fields; field types below came from the REST metadata catalog instead. |
| Field type source | `ns_getRecordTypeMetadata` for `opportunity` and `job`. A reference-shaped property (id, refName, externalId) is a List/Record or select field; a string property is free text. |

## Field facts (opportunity = transaction body, project = entity)

| Field | Type | Finding | Design consequence |
|---|---|---|---|
| `custbody_pc_referral_end_user` | List/Record (reference) | Empty on every one of 184 opportunities. Target record type not readable through this role; name says end user, so Customer is likely [Inferred]. | Candidate to repurpose as **End Client** if its target is Customer; confirm the target in the UI (Customization > Lists, Records & Fields > Transaction Body Fields) before deciding repurpose versus new field. |
| `custbody_opp_proj_create` | List/Record (reference) | Set on about 22 opportunities; the button's link field. | Keep; the rewrite also sets native `job`. |
| `job` (native opportunity-to-project) | reference | Set on 8 of 184. | Set at creation. |
| `custbody_opp_af_contact`, `custbody_opp_af_contact_email`, `custbody_af_contact_phone` | free text | Empty on all 16 open opportunities. | Replace with **Partner Contact** (List/Record > Contact); hide after migration. |
| `custbody_pc_project_type` | select list | Values in use: 1 New License Deal, 2 New Implementation, 3 Rapid Assessment, 4 Use Case, 5 Project Recovery, 7 SuiteCommerce, 8 Virtual Admin, 9 Power Cloud Product, 10 NSPB. Set on all 16 open opportunities. | This is the engagement-type field; the proposal and intake skills key on it. Not in the proposal's inventory; add. |
| `custbody_opp_task1/2/3_title`, `_hrs`, `_rate` | text, float, double | All null on all 16 open opportunities. | The rebuilt suitelet builds tasks from these; the proposal skill must populate them at the Proposal stage or the readiness gate blocks every deal. |
| `custbody_opp_rate` (General Billable Rate), `custbody_opp_proj_travel` (Travel Rate) | double | Exist. | Copy to project. |
| `custbody_opp_principal`, `custbody_opp_proj_srcon`, `custbody_opp_proj_staff`, `custbody_opp_proj_leaddev` | references (employees) | The four staffing fields the suitelet copies. | Keep. |
| `custbody_opp_kickoff_meet` (date), `custbody_opp_asana_proj` (text URL), `custbody_opp_onboarding_sheet` (text URL) | date, text, text | Populated on all 13 Won - Awaiting Project opportunities. | Carry Asana and kickoff to the project. |
| `custbody_opp_next_contact` (date), `custbody_opp_rapid` (checkbox), `custbody_opp_sol_consultant`, `custbody_opp_sales_rep` | | Exist. | pipeline skill owns next contact. |
| `projectedtotal` | | 0 on 15 of 16 open opportunities. | Proposal skill sets it (Codex point 9). |
| `leadsource` | reference (campaign) | Set on 6 of 184: "1 Amura Marketing" (5692) and "2 Customer Referral" (5693). | Lead Source vocabulary from the referrer tracker still to be created; the two existing values are numbered, so the convention is `N Name`. |
| `partner` | reference | S. Hyham Consulting (125) on about 26, Oracle Netsuite (131) on 5, Kishungi53 (420) on 1. | Keep as the referring organization. |
| Project `custentity_proj_af_ref` (AF Placement Ref), `custentity_proj_af_contact`, `custentity_proj_af_contact_email`, `custentity_proj_af_contact_phone` | free text | Populated on most AF projects with recruiter names (12 distinct people on the 40 active and pre-kickoff projects). | Source for the Contact migration; then Partner Contact on the project. |
| Project `custentity_af_minimums` | select list | 1 Weekly, 2 Monthly. | Keep. |
| Project `custentity_proj_min_hrs` (Minimum Hrs), `custentity_admin_hrs` (Monthly Contracted Hrs), `custentity_job_billings` (Contract Value), `custentity_pc_project_billable_rate` | numbers | Exist; mostly empty on active projects. | Fill at creation from the opportunity. |
| Project `custentity_cus_rev_src` | select (class values) | Set on every active project; the suitelet copies class into it. | The channel marker on projects. |
| Project `custentity_pc_proj_source` | select (own list: 1 Direct, 5 Anderson Frank, 6 Netsuite) | Set on 7 of 40. | A second, older channel list. Candidate to retire; not the same list as class. |
| Project `custentity_pc_proj_asana` | List/Record (reference) | Empty on all 40 active projects, while the opportunity carries the Asana URL as text. | Decide which one carries Asana; the opportunity text URL is what is actually used. |
| Project `custentity_proj_bot_exclude` (Exclude from Bot Time Entry) | checkbox | Exists. | Precedent for an "exclude from travel lists" checkbox; a separate field is still needed. |
| Project `custentity_pc_renew_date`, `custentity_proj_billing_approver`, `custentity_weekly_reports_required`, `custentity_prop_deposit_bal`, `custentity_proj_track_dep`, `custentity_recurring_task`, `custentity_proj_avg4`, `custentity_proj_burn4`, `custentity27_2` | | Exist; not in scope. | Leave. |

## Entities: partners, subcontractors, contacts

- One entity record can carry several types in this account. Anderson Frank (136) and Playa Technologies (6) are **CustJob and Partner** on one record; S. Hyham (125), Oracle Netsuite (131) and RunDTC (947) are **Partner and Vendor**; SystemsAccountants (514) is CustJob only. The suitelet's hardcoded "customer 136" is therefore the AF record, which is also a Partner. This amends the proposal's "no Partner record is needed for AF": one already exists on the same record, with zero transactions referencing it as partner.
- 16 Partner records; 4 inactive; S. Hyham is referenced by 7,353 transactions (partner inherits onto invoices from the customer), Oracle by 5, Kishungi53 by 1, every other partner by none.
- Contacts on the partner and subcontractor records: Anderson Frank **1** (Erin Maher), Playa 1, SystemsAccountants 2, RunDTC 2, S. Hyham 0, Oracle Netsuite **630**. The AF recruiters named on projects (Jordan Levine, Steven Masetti, Daniel Gresser, Kayla Podwalny, Eugene Boggiano, Christopher O'Donnell, Jared Brownstein, Patrick Skinner, Maria Mihaylov, Josh Brown, Adam VanDelinder, Erin Pryce) do not exist as Contacts. Migration creates them under 136.
- Customer records exist for all three subcontracting firms: Anderson Frank 136, Playa Technologies 6, SystemsAccountants 514.

## Class: the channel list, and how much it does financially

Class values: 1 Direct, 2 Netsuite Alliance, 3 Playa Technologies, 4 DSWi, 5 Anderson Frank (include children T), 6 Sererra, 7 Other, 108 RunDTC, 109 Referral Rev Share, 110 SystemsAccountants. **Playa and SystemsAccountants are already class values**, so the "before they become values" inventory question is answered: they are.

Class presence (header = main line, lines = item lines):

| Type | Headers with class / total | Lines with class / total |
|---|---|---|
| Opportunity | 167 / 184 | 19 / 22 |
| Invoice | 1,250 / 7,995 | 3,615 / 70,835 |
| Journal | n/a | 4,358 / 119,824 |
| Expense report | 0 / 359 | 370 / 1,594 |
| Sales order | 3 / 203 | 3 / 456 |
| Estimate | 4 / 70 | 8 / 213 |
| Vendor bill | 0 / 2,175 | 0 / 9,982 |

Reading: class is the sales channel marker (91 percent of opportunities) with light, inconsistent financial use (16 percent of invoice headers, 5 percent of invoice lines, 4 percent of journal lines). The saved search "Project Profitability by Source" (customsearch267) and the class-by-value breakdown on invoices could not be read (GROUP BY refused under this role); check both in the UI before the decision. **Recommendation: keep class as the channel field** (the values and 167 opportunities are already there), do not add a Channel Partner field, and make the suitelet derive the billing party from the channel table (class 5 to customer 136, class 3 to 6, class 110 to 514) instead of one hardcoded branch.

**Mike, 2026-10-08, on reading the invoice numbers: the gap is that class does not natively copy from the project onto invoices, so it goes missing; close it, he would prefer to have it.** New phase 1 work item: an invoice (and credit memo) user event that, before submit, fills the header class and each line's class from the line's project (`custentity_cus_rev_src` on the job) when the class is empty, never overwriting a value someone set. Lines on one invoice can belong to different projects under Consolidate Projects, so the line is the unit; the header takes the class when every line agrees, else stays as set. Scope note: the Invoice Billable Customers flow and the Task to Invoice map/reduce both create invoices, so the user event must run on script-created records (deploy with execution context unrestricted) and be tested against both paths. With Consolidate Projects disabled the invoice carries one project in its header field, so the script reads that project's `custentity_cus_rev_src` and sets the header class and every line's class from it when empty. Fallbacks if the header project is empty: the line's `projecttask` (joinable to Project Task, whose `project` is the job) and `custcol_pc_time_entry_id` (joinable to Time Bill, whose `customer` is the project). In this account the class field is labeled **Revenue Source** on transactions, which is why the project copy is named `custentity_cus_rev_src`.

## Opportunities

- 184 total: 16 open (native status A), 65 closed won (C), 103 closed lost (D). The August recon said 178 / 13 / 64 / 101.
- 26 entity statuses by internal id, with opportunity counts. Open-stage statuses: 8 Demo'd Customer (2), 9 Pre-Demo'd Prospect (3), 10 Proposal (1), 11 In Negotiation (4), 12 Purchasing (0), 18 Life Support (1), 19 New Lead (5, **inactive** yet in use), 21 On Hold (4). Won ladder: 24 Won - Awaiting Project (13, stage PROSPECT), 25 Won - Ready for Kick Off (2), 22 Won - Ready for Onboarding (0), 23 Won - Kicked Off (2), 13 Closed Won (48). 14 Closed Lost (99, stage PROSPECT). Inactive: 3 Not Awarded, 15 Renewal, 16 Lost Customer, 19 New Lead. Project statuses share the table: 1 Completed, 2 In Progress, 4 On Hold, 5 Awarded - Pre-Kickoff, 17 Post Go Live. The four oddities from the status sheet are confirmed (24 and 14 staged PROSPECT; 13 and 23, and 24 and 22, share descriptions or lack them).
- **The won ladder is not walked.** All 13 opportunities in Won - Awaiting Project already have a project (`custbody_opp_proj_create` set), a kickoff date, an Asana link and an onboarding sheet, and are closed won; the status never moved. The Awaiting-* saved searches therefore show stale rows. The close-deal skill or the rebuilt suitelet must advance the status when the project is created.
- **Entity practice on subbed deals: the end client is the entity.** On the 16 open and 13 won-awaiting opportunities, every class 5 (Anderson Frank) deal carries the end client's name in the entity field (Nations Best Sports, Acme Paper, Gillespie, Shinesty, Teppermans, ABSCI, Upward Projects, Weathermatic, Antique Rose, Clenera); only OPP0038 carries Anderson Frank itself. The suitelet's class-5 branch is what makes the project's parent AF. This contradicts the 2026-08-28 "entity = billing party" convention as practiced and must be decided before the field set freezes: either (a) keep entity = end client on the opportunity, add End Client as the formal field anyway (defaulting from entity) and let the suitelet derive the project parent from the channel table, or (b) re-entity subbed opportunities to the billing party. (a) matches practice and needs no re-entity; the proposal's End Client rule works unchanged.
- Open opportunities: lead source empty on all 16; Task 1 fields empty on all 16; `projectedtotal` 0 on 15; next contact set on 10. Three carry Partner S. Hyham (all Power Cloud Product deals for Lole).

## Projects and the travel lists

- 40 active (status 2) or pre-kickoff (5) projects; 24 have parent Anderson Frank. `custentity_cus_rev_src` is set on all 40.
- The project record's native Project Type (`jobType`) is what the Monday Morning dashboard groups on (with status Post Go Live): list values 1 Implementation, 2 Use Case, 3 Rapid Assessment, 4 Integration, 5 Support, 6 SuiteCommerce, 7 Travel Placeholder, 8 Virtual Admin, 9 Managed Services. Of 47 active, pre-kickoff and post-go-live projects, 6 carry no type, all recent button-created ones, because the suitelet never sets it. Mapping and backfill: `SALES_OS_FIELD_SET.md` section 7.
- **Invoices are never headed by a project** (0 of 7,995); the customer is the invoice entity. **Consolidate Projects on Sales Transactions is disabled** (Mike read the preference, 2026-10-09): an invoice carries the customer (for example Anderson Frank) in the Customer field and one project in the separate header project field, one project per invoice. The earlier inference of "enabled" from the entity pattern was wrong; the pattern is the same under both settings (lesson logged in `tasks/lessons.md`). The invoice-class user event therefore reads the header project, not the lines.
- The Navan config record (`customrecord_navan_config` id 1) has Project Saved Search = **901**, which is "Navan Project Export" (customsearch901). It returns 46 projects with an approver email column, including projects outside the active set (ACL Airshop, Bomb Party, Homefield, Jaanuu, LotusBev, Origin Acoustics, Palmetto VAS, Qardio, RetroFete, TSA, Appalachian Trail, Lole Brands). Its criteria are broader than status in (2, 5); the project-sync RESTlet runs this search by id rather than re-deriving the list, as designed, and the search's criteria get a review so closed projects fall off.
- "Opportunities Awaiting Project Creation" (customsearch746) and the five sibling Awaiting searches (743, 744, 745, 747, 748) key on the won-ladder statuses and fields; "AF Projects w/out Time" (customsearch867), "Project Category/Min Hrs" (customsearch510) and "Project Profitability by Source" (customsearch267) are the project searches that may reference class or the AF fields; inventory their definitions in the UI before hiding any field.

## The three existing scripts (imported 2026-10-08 into `Power Cloud NS/CRM/baseline/`)

- `customscript_ue_opp_create_proj_btn` (user event, `opp_ue_create_project.js`): shows the button in VIEW when `entitystatus` = '24' and `custbody_opp_proj_create` is empty. No readiness check.
- `customscript_cs_opp_create_proj_hdlr` (client, `opp_cs_create_project.js`): calls the suitelet by GET with `opportunityId`.
- `customscript_sl_create_project` / `customdeploy_sl_create_project` (suitelet, `sl_create_project_from_opp.js`, runs as Administrator, all roles): creates the project (name = title, parent = 136 when class = '5' else entity, status 5, four staffing fields, `custentity_cus_rev_src` = class, time and expenses on, `projectexpensetype` -2), writes only `custbody_opp_proj_create`, then creates a "Netsuite Configuration" task at `custbody_opp_rate` with service item 6 for consultants and 7 for the lead developer, and a "Rapid Assessment" task at a hardcoded 106.25 when `custbody_opp_rapid` is true. No idempotency: a second call creates a second project. Contract value, billable rate, hours, AF fields, kickoff and Asana are not copied.

## Answered 2026-10-09 (Mike, phase 1 interview)

- `custbody_pc_referral_end_user` targets **Customer**: repurposed as End Client.
- Consolidate Projects on Sales Transactions: **disabled** (see Projects section).
- Entity practice on subbed deals: **(a)**, the end client stays the opportunity entity; the suitelet derives the project parent from a class-keyed channel table (proposal section 7 amendment).
- NetSuite seats: **Steve, Jason and Chris each hold a full seat**, so a shared integration identity saves no licenses, each seller can hold a read-only MCP connection, and per-seller tokens are possible if native attribution is ever wanted (section 15 keeps relay approval regardless).

- Saved searches 267, 510 and 867: **to be retired** (Mike, 2026-10-09), but nothing is touched yet; they are inactivated in the status-cleanup step after the AF text fields are migrated and hidden. No field-reference inventory is needed for them.
- The sales-team interview has already been held (Mike, 2026-10-09); Mike supplies the transcript, which gets filed under `Internal/sales/source/` and mined against the guide's question blocks before the field set freezes.

## Still owed before the field set freezes

1. Mike: the interview transcript. Then the orchestrator mines it against `SALES_TEAM_INTERVIEW_GUIDE.md` (worker `pc-transcript-miner` if it is over about 20K characters) and records the answers in the guide's capture table and in Playbook v2.
2. Move the connector to the standard role, which also lifts the table blocks and should ease the rate limiting.
