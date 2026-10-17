# Sales Pipeline in the OS

> v3.1, amended 2026-10-09: section 15 moves every sales-process write from the MCP connector to an API (one RESTlet, OAuth 2.0 client credentials, relay-approved writes, per-caller roles), after Mike's question of 2026-10-08 and a Codex second opinion; sections 7, 8 and 11 read subject to it. The 2026-10-08 account verification is in `SALES_OS_PHASE1_VERIFICATION.md`.
>
> v3, revised 2026-10-08 after Mike's decisions in a planning session that day. Changes: CRM home decided, Sales drive and travel findings added (sections 2, 3); record model replaces "no new fields", button rebuilt not replaced, project-customer reasoning (7); close-deal calls the suitelet, Paco touch capability (8); interface now both surfaces (9); decisions 1, 2, 6, 7, 10 answered, 12 to 14 added (10); rollout replaced by the build plan (11); travel setup (13); second opinion (14). To fit the length cap, v2 inventory and narrative text in sections 2 and 4 to 8 is condensed; no v2 decision is dropped.
>
> v2, revised 2026-08-28 after Mike's review notes on the v1 draft: the folder question answered (section 6), conventions corrected (7), the Create Project button's source mined (7), a day-to-day narrative added (4). Status: decisions recorded in section 10; nothing built yet. Sources: full inventory of `G:\Shared drives\Power Cloud Sales` (2026-08-28), read-only MCP recon of Power Cloud's own NetSuite account (2026-08-28), source of scripts `customscript_ue_opp_create_proj_btn` / `customscript_cs_opp_create_proj_hdlr` / `customscript_sl_create_project` (read 2026-08-28), `SALES_TO_DELIVERY.md`, the roadmap (A5, 6a), `PORTAL_BETA_PLAN.md`, and Mike's review notes. Added in v3: the Sales drive status sheet, referrer tracker, startup checklist and onboarding template; the local Navan integration project; Oracle NetSuite Online Help pages verified 2026-10-08; a Codex read-only second opinion.

The ask: bring the sales process into the OS, from first contact through a created project in NetSuite and a scheduled kickoff, consistent for every deal, with the only hard constraint being that a won deal ends as a NetSuite project.

Companion: `SALES_TEAM_GUIDE.md` ("The Pipeline Playbook") is the team-facing day-to-day; this file is the decision record. The guide gets a v2 after the sales-team interview (section 11), plus a one-page Opportunity to Project procedure.

The one-paragraph version: **a deal is a client folder that has not won yet.** The folder is born at the OS root the day the first conversation happens, carries DEAL.md instead of CONTEXT.md, and never moves: winning adds the engagement record next to the sales record, losing just closes the file. Claude does the NetSuite entry from the call transcripts so capture costs two minutes instead of willpower, a weekly pipeline session reconciles folders against NetSuite and flags what fell through, proposals draft from the folder's evidence the way assessments do, and the close ritual drives the Create Project button, rebuilt with the same rules, minus the hardcoding (v2 said the skill replaces the button; amended 2026-10-08, section 7). Files own the knowledge, NetSuite owns the commercial state, and no third tracker gets invented.

---

## 1. Scope

Covered: lead capture, opportunity creation, pursuit tracking, proposal production, win/loss, project creation, kickoff scheduling, and the handoff into delivery. Not covered: anything downstream of the handoff (SALES_TO_DELIVERY.md, new-engagement, and rapid-assessment own that and are unchanged), marketing content, commissions and compensation, and the portal beta scope, which stays frozen as decided 2026-08-22.
---

## 2. Current state, verified

### The Drive side (inventoried 2026-08-28)

- `Pre-Sales Projects` holds 34 active deal folders plus a `Lost Dead for now` bucket with 6 more; `Signed Contrcats` holds 15 won clients. **No pipeline tracker exists anywhere on the drive**: state is only which folder a deal sits in. About 30% of deal folders are empty husks, and the `MSA and SOW/` template library is referenced by no deal folder. [Verified]
- Zellerfeld and ID Supply show the good pattern (dated call-prep cheat sheets, scoping briefs), a habit, not a rule; Bruce Bolt is a proposal precedent ($205/hr). [Verified + Reported]

### The NetSuite side (read-only MCP recon 2026-08-28, Power Cloud's own account, identity confirmed via employee-email sample)

- **The pipeline is real and maintained**: 178 opportunities from 10/2019 through 8/2026, 13 open, 64 closed won, 101 closed lost (39% win rate). Titles follow `{Client} - {Engagement Type}`, which maps onto the OS's three engagement types. A won-handoff machine exists: four won statuses (Won - Awaiting Project, Ready for Kick Off, Ready for Onboarding, Kicked Off) and an Awaiting-* saved-search family keyed to kickoff, onboarding sheet, Asana and project-creation fields. 26 statuses carry funnel probabilities (New Lead 0%, Proposal 50%, Purchasing 90%). [Verified]
- **Deal economics live in custom fields** (billable rate, travel rate, Task 1/2/3 title, hours, rate); `projectedtotal` was $0 on all 8 most recent opportunities, so native weighted pipeline reports have nothing to work with. [Verified]
- **The billing-party convention** (Mike, 2026-08-28): the opportunity's entity carries whoever we bill, the subcontracting firm on a subbed deal, the prospect on a direct deal, because the entity must become the Customer downstream. [Reported] The recon's 8-opportunity sample showed end-client names in the entity field; all direct, or practice drifts. The backfill settles it per deal. [Inferred]
- **The channel marker today is the class field**: the Create Project suitelet branches on class 5 ("Anderson Frank") to force the project's parent to the AF customer record (id 136). AF also has contact fields on opportunity and project (contact, email, phone, placement ref, minimums). The native partner field carries referral attribution (S. Hyham Consulting on 26 opportunities, Oracle NetSuite on 6). [Verified]
- The native opportunity-to-project link is set on 8 of 178 opportunities (the button sets only the custom `custbody_opp_proj_create`) and lead source on 6 of 178. [Verified] The internal MCP connection behaved like an ad-hoc role (blocked tables, heavy 429s) and does not appear to be on `customrole_pc_mcp_ai_connection`. [Verified]
- Update 2026-10-08: no NetSuite connector was attached to the planning session; field types, the class list and the AF text-field values are verified on the first connected session (section 11). The August recon is the evidence base until then.

### The Sales drive documents (read 2026-10-08)

- `Sales Stuses 8-28-26`: the 16-status vocabulary with stage and probability, no procedure. Four oddities: Closed Won and Won - Kicked Off share a description; Won - Awaiting Project and Won - Ready for Onboarding share one; Won - Awaiting Project and Closed Lost are staged Prospect while the other Won statuses are Customer. [Verified]
- `Project Startup Checklist Template` (2025) and `New Customer On Boarding Template` (2024): project with assignments and rates, group email, folder, sanitized SOW copy, kickoff agendas. Neither mentions Navan, Uber, Asana, or expense setup. [Verified]
- `power-cloud-referrer-tracker` (Emily, July 2026): referral-partner outreach, 35 target firms in four waves (factors, CFO firms, selection consultants, ecosystem, PE), fee rules by tier, and the rule "every contact and referral goes into NetSuite with a source and a dollar value". Source values: Referrer-Factor / -CFO / -Selection / -Ecosystem / -PE, NetSuite-AE, NetSuite-SuiteWorld, Reactivation, SuiteApp, AF, which become the Lead Source vocabulary. [Verified]
- With `SALES_TEAM_GUIDE.md`, the status sheet is the "previously documented workflow"; `SALES_TO_DELIVERY.md` has five `[confirm]` questions open.

### Travel integrations (local Navan project, live in production since 2026-05-28)

- **Navan**: a daily Map/Reduce polls the BookingData API and creates draft expense reports. The project comes from the admin-configured **Bill To Client** field (Name, ID = NetSuite project internal id, Approver); no resolvable project logs MISSING_PROJECT and the booking is skipped. The config record's **Project Saved Search** field (`custrecord_navan_project_search`) was meant to define the option list, but no code reads it: the push to Navan was never built and the SOW left list sync out of scope. OAuth is bookings:read only. [Verified]
- **Uber for Business**: a Hetzner relay pulls daily trip CSVs over Uber's SFTP and posts one expense line per transaction to a RESTlet. The project comes from the **Expense Code** `{projectId}-{Name}`, with a hand-maintained override map for codes typed wrong; codes are bulk-loaded by CSV, and non-numeric or rejected codes leave the customer blank. [Verified]
- The failure Mike describes is the unbuilt sync: nobody adds a new project to Navan's list and Uber's codes, so rides and flights land with no project. Both lists are keyed to the project internal id, so the sync is deterministic (section 13). [Inferred]
- `PowerCRM` (SuiteApp, v1.0, never deployed) is out of scope: Mike's read 2026-10-08 is that it is immature and not a candidate for our own CRM.

### The diagnosis

NetSuite is ahead of the Drive. The pipeline process exists but runs on hand entry, so deals enter late or not at all (the "fuzzy validation" problem is a data-entry-friction problem), the knowledge behind the statuses sits in a folder pile the process never reads, proposals are built by hand from it, and the win handoff moves files instead of standing up a delivery record. The fix is not a new system; it is connecting the two that exist and letting Claude do the typing.

---

## 3. Design principles

1. **Files own knowledge; NetSuite owns commercial state.** Recordings, notes, research, and drafts live in the deal folder; status, dates, channel, economics, and the eventual project live in NetSuite. No spreadsheet tracker, ever.
2. **Build on the machinery that exists.** The status funnel, title convention, won-handoff ladder, saved searches, and the Create Project button's rules stay.
3. **Zero-friction capture beats validation discipline.** Every real conversation gets a folder; every folder with a call gets an opportunity within a week. Claude drafts the entry and the human confirms.
4. **Channel is data, not a fork.** One process for every deal; Direct vs Subcontract is carried by fields (entity, End Client, and class or a Channel Partner field, section 7) that drive mapping differences at defined points, never a separate workflow.
5. **A deal is a client folder that has not won yet.** Same shape, same home, no movement at any transition.
6. **Sales sessions write only to Power Cloud's own NetSuite.** Account ID pinned and verified at session start, every write confirmed by the human before it fires, record types allowlisted (customer, contact, opportunity, task, project). The client-account read-only rule is untouched.
7. **Proposals are client-facing deliverables.** WRITING_STANDARDS, brand templates, the render gate, and the LOE checkpoint apply. Claude drafts the numbers, a human owns them, and `working/loe_log.md` logs them.

**CRM home. Decided 2026-10-08 (Mike): the CRM stays in NetSuite; no custom CRM.** The pipeline there is real and maintained, and a won deal must end as a NetSuite project, which carries the billing and staffing layer. A custom CRM would be a third system between the Drive and NetSuite, which principle 1 rules out. The needs are light (contacts, referral attribution, status, next touch) and native CRM covers them once relationships are records. The portal stays sales-free. If NetSuite proves insufficient, the fallback is an external CRM, not PowerCRM, and the section 7 record cleanup is its prerequisite too.

---

## 4. How the sales team works, day to day

`SALES_TEAM_GUIDE.md` expands this target week. It is written from the design plus the artifacts sales leaves behind; **a 30-minute interview with the people who actually run deals is phase 1 work** (section 11), because this narrative was drafted by people who do not do the job.

**Tuesday, 10:40am. A discovery call just ended.** The seller says: "New deal. Acme Apparel, direct, here's the intro call." Claude stamps the folder at the OS root, files the Gemini notes into `source/`, drafts DEAL.md, then drafts the NetSuite entry: the end-client Customer record with its main contact, opportunity `Acme Apparel - Rapid Assessment`, status Qualified, next contact date from the call. The seller reads the two-line summary, says yes, and the writes fire. About two minutes; nothing typed into NetSuite by a person.

**Thursday, 4:15pm. A touch, not a milestone.** "Log on Acme: sent the case study, they want a demo week after next, next contact 9/8." DEAL.md and the opportunity both update. One sentence at the moment something happens is the whole discipline. (Since 2026-10-08 the Paco touch capability carries this in Google Chat, sections 8 and 9.)

**Monday, 8:40am. Before the pipeline review.** The Monday review meeting already exists; the OS preps it rather than replacing it. "Prep me for the pipeline review" produces talking points per deal plus everything out of true: calls with no opportunity, no next contact date, a proposal 32 days old (with a drafted nudge for a human to send), a closed-won deal whose close ritual never ran. Gaps get fixed in the prep session and PIPELINE.md regenerates. Before a prospect call, "prep me for tomorrow's Zellerfeld call" produces a one-page cheat sheet (who is on the call, what they already told us, must-answer questions, the goal), and the session stays open during the call as the deal's source of truth. [Reported: Mike 2026-08-28]

**Proposal week and the win.** "Build the proposal for Acme." Claude runs the evidence pass over `source/`, asks what the folder cannot answer, drafts for the engagement type, then stops for the LOE checkpoint: every hours figure and rate confirmed line by line by the human, logged to `working/loe_log.md`. Human sends it; Claude sets status to Proposal with the economics, projected total and expected close. On "Acme signed" the close ritual (section 7) walks the existing ladder, creates the project through the rebuilt suitelet, proposes kickoff times for the human to send, and checks Asana first. The folder graduates in place: CONTEXT.md appears next to DEAL.md and the consultant gets a turnover briefing. A loss is a status and a one-line reason in DEAL.md; the folder stays.
---

## 5. The lifecycle

| Stage | Trigger | Drive and NetSuite | Exit |
|---|---|---|---|
| **0. Contact** | Any real conversation with a prospect | Folder stamped at the OS root from the `deal-record` template; notes and recordings into `source/`; nothing in NetSuite yet | A call worth pursuing happened |
| **1. Logged** | First discovery call done (the new "validated" bar) | `deal-intake` fills DEAL.md; Claude drafts the end-client Customer and contacts plus the opportunity (title `{Client} - {Type}`, status, entity, End Client, channel); human confirms; MCP creates | Opportunity number in DEAL.md |
| **2. Pursuit** | Ongoing | Calls land in `source/`, cheat sheets in `working/`; one-line updates keep status and next contact; Monday prep reconciles | Proposal requested, or Life Support |
| **3. Proposal** | Enough discovery to scope | `proposal` skill mines `source/`, interviews the seller, drafts, renders branded; status to Proposal, Task 1/2/3 economics, `projectedtotal`, expected close | LOE checkpoint passed, proposal sent |
| **4. Decision** | Client answers | DEAL.md gets the outcome and, on a loss, the reason; Won enters the existing ladder, Lost becomes Closed Lost with reason | Won or lost |
| **5. Won-handoff** | Won | CONTEXT.md created next to DEAL.md, folder does not move; `close-deal` walks the ladder: project created by the rebuilt suitelet (section 7), both links set, Asana checked, kickoff scheduled | Turnover done; delivery takes over in the same folder |

Two cross-checks run in the weekly pipeline session: **any folder with a call but no opportunity** gets flagged (the catch-more mechanism), and **any opportunity with no folder** gets one stamped. `Lost Dead for now` retires; a lost deal keeps its folder with `Status: lost {date}` and a one-line reason.

---

## 6. The deal record and where it lives

### The folder question, answered concretely

Mike posed the two models directly: (A) a folder in the OS, just like the project folders, that never has to move, or (B) a folder somewhere else that moves if and when the deal closes.

**Recommendation: A. The deal folder is the client folder, at the OS root, born at first contact, and it never moves.** (Decided 2026-10-08: option A, decision 1.) It carries DEAL.md where a client carries CONTEXT.md; winning adds CONTEXT.md next to it. The handoff is a reading exercise, not a data migration.

- **PIPELINE.md vs ENGAGEMENT_LOG.md.** DEAL.md without CONTEXT.md is pipeline (one rule added to `build_engagement_log.py`); both files means a won client with sales history.
- **Lost deals** keep the folder with status lost; a later sweep can move long-dead prospects to `Archive/`. **Repeat business:** DEAL.md carries the active deal plus a deal log.
- **The sharing tradeoff, stated plainly.** Deals at the OS root are visible to everyone with OS drive access from day one, including rates and economics. Today that audience is the delivery team, which already sees LOE numbers. If sales staff who must not see client folders (or the reverse) are ever hired, revisit with option B. Mike owns Drive sharing.

**Option B, named so it is rejected by decision:** a restricted `Sales/` area inside the OS drive with a same-drive move to the root on win. It buys sales-material privacy at the cost of a move step, a second place to look, and a permission model. The old v1 recommendation (keep everything in the separate Sales drive and copy on win) is withdrawn: it optimizes for a privacy boundary that is not a requirement.

**The Sales drive.** `Pre-Sales Projects` becomes a read-only legacy annex: each stamped deal records `Legacy folder: {path}`, and material is copied in only when needed. The backfill stamps the 13 open opportunities' deals at the OS root. `Signed Contrcats` and `MSA and SOW/` stay put; the three proposal templates are copied into OS `templates/sales/`.

**Template `templates/deal-record/`:** the client-record stamp plus `DEAL.md` (CONTEXT.md's sales sibling), render-gate settings, `source/`, `working/` (drafts, evidence notes, loe_log.md), `deliverables/` (finals only).

**DEAL.md fields (sketch):** company (the end client, always), key contacts (and the partner's contact on subbed deals); **channel** (direct | subcontract via {partner}, never hard-coded) and **billing entity** (the NetSuite entity); referral source and the referring person by name (maps to Partner, Lead Source, Referral Contact); likely engagement type and commercial model (T&M LOE | Power Suite subscription | managed services), either may start unknown; **NetSuite opportunity** number or pending; **status** (contact | logged | pursuit | proposal issued {date} | won {date} | lost {date}: {reason}); **next contact**; stack notes, deal log, open questions.

**PIPELINE.md, generated** by `build_pipeline_log.py` (derived from disk, never hand-edited): deal, channel, status, opportunity number, next contact, proposal date and value, last activity, and flags (no opportunity, no next contact, overdue, stale proposal over 30 days). The weekly session regenerates it, works the flags, and reconciles NetSuite live via MCP.

---

## 7. NetSuite design

### Keep as-is

The status funnel and probabilities, title convention, four won stages and saved searches, kickoff/onboarding/Asana fields, economics fields, project custom layer. The skills adopt these.

### The record model: the end client always exists as its own record

v2 said the channel was already fully expressible with what exists (entity = billing party, class = channel, end client in the title plus `custbody_pc_referral_end_user`, AF text fields for partner contacts), so no new fields. Decided 2026-10-08 (Mike): the end client and its people always exist as records, and referrer contacts stop living in free text, because CRM stays in NetSuite and relationships must be records to be queried and synced.

| Concept | Record / field | Rule |
|---|---|---|
| Billing party | Opportunity and Project entity (Company) | Unchanged: whoever we invoice; becomes the project parent. |
| End client | A Customer record of its own, always, even if never billed | Created at intake on every deal, with its Contacts (main contact at intake, attendees after each call). Direct: the billing party itself. Subbed: a second Customer with no transactions. |
| End client link | New field **End Client** (List/Record > Customer) on Opportunity and Project | Required on every deal; copied to the project at creation. |
| Channel | Class field, pending the phase 1 inventory; else a **Channel Partner** field | Class 5 = Anderson Frank today and the button branches on it. Before Playa Tech and Systems Accountants become values, inventory how class is used on transactions and reports; if it does financial segmentation, channel moves to a dedicated List/Record field (Codex point 10). |
| Referral source | Native Partner field plus Lead Source | Partner = the referring organization (Oracle NetSuite, S. Hyham, tracker firms); Lead Source uses the tracker vocabulary. Distinct from channel. |
| Referral contact | New field **Referral Contact** (List/Record > Contact), filtered to the selected Partner's contacts | The person who sent the lead; contacts live on the Partner with primary Company = Partner (Sourcing & Filtering subtab), with the native Contact Role list ("Referral partner", "Recruiter"). Retires the tracker's Outreach tab as system of record. |
| Partner placement contact | New field **Partner Contact** (List/Record > Contact) on Opportunity and Project, filtered to the entity's contacts | Replaces the AF contact, email and phone text fields; values migrate into Contacts under the AF customer, then the text fields are hidden. Placement ref and minimums stay. |

**Amended 2026-10-09 (Mike, phase 1 interview).** (1) On the opportunity the entity stays the **end client**, which is the practice on every subcontracted deal in the account (verification file, Opportunities section); the project's parent, the billing party, is derived by the rewritten suitelet from a channel table keyed on class (5 Anderson Frank to customer 136, 3 Playa Technologies to 6, 110 SystemsAccountants to 514, direct and every other class to the entity). The "Billing party" row above therefore reads: opportunity entity = end client; project entity = billing party. End Client still defaults from the opportunity entity and is always set. (2) `custbody_pc_referral_end_user` is List/Record > Customer (Mike read the field definition), so it is repurposed as End Client: relabeled, kept on Opportunity, with a matching entity field on Project. (3) Consolidate Projects on Sales Transactions is **disabled**: an invoice carries the customer (for example Anderson Frank) in the Customer field and one project in the header project field. The invoice-class user event reads the header project.

**End Client rules, including the direct-deal rule.** Both fields are always set: on a direct deal End Client points at the same Customer as the entity (Mike, 2026-10-08: yes, both fields, always), so reporting is uniform. It defaults from the entity when empty, so only a subbed deal is typed by hand. End Client = entity reads direct, a difference reads subcontracted, and the weekly review cross-checks that against the channel marker. Contacts always live on the End Client record, which on a direct deal is also the billing record. `custbody_pc_referral_end_user` is repurposed if already List/Record > Customer, else replaced and its text values migrated [verify type]. Intake asks "Did anyone refer this? Who, by name?"; the weekly review flags a Partner with no Referral Contact and any empty Lead Source.

**Revenue source: asked at intake, never defaulted (Mike, 2026-10-09).** The class is the channel, and the channel decides the billing party and the project parent, so the OS and Paco ask the seller for it at intake, interview style, with the channel map's active rows as the choices, and never default it from the customer's Revenue Source as the retired "Opportunity Defaults" workflow did. The same answer feeds both API calls: `createEndClient` (`revenueSourceId`, the customer's mandatory Revenue Source) and `createOpportunity` (`classId`). Lands in the deal-intake skill (phase 3) and Paco's intake prompt; the RESTlet already requires both keys.

**Oracle Online Help (verified 2026-10-08).** Contacts attach to lead, prospect, customer, vendor, partner and project records with a role per attachment; one contact can attach to several records with one primary Company (confirm in sandbox); custom entity fields apply to projects; an unbilled company can sit at Customer stage; no Referred By field exists beyond Lead Source and Partner. **Anderson Frank** stays one Customer record, the billing party, with its recruiters as Contacts and Lead Source = AF; no Partner record is needed, since Partner and Referral Contact are for organizations that refer and are not billed (orchestrator decision, as is the SDF project location `Power Cloud NS/CRM`). Backfill settles the end-client-in-entity sample per deal and sets End Client on every open opportunity and active project.

### Who is the customer on a subbed project (decision 12)

Three subcontracting partners are in play (Anderson Frank, Playa Tech, Systems Accountants), so the rule must be generic. Recommended, approved with the plan: **the project's Customer is the billing party, always.** NetSuite bills project time to the project's customer, and the Task to Invoice work (September 2026) confirmed Power Cloud invoices through the native Invoice Billable Customers workflow, which invoices the customer carried by the time entries. The end user there would break billing on every subbed deal or force a manual re-entity on every invoice, and invoices, deposits, minimums and contract value all describe whoever pays. The end user stays first-class through End Client, so reports group by end client while billing stays correct. This is Mike's 2026-08-28 convention with the billing reason written down and the end user promoted to a record.

### What the Create Project button does today (source read 2026-08-28)

A user-event script shows the button only when status = Won - Awaiting Project and no project is linked, a client handler calls a suitelet, and the suitelet does the work. Its rules, which the rebuild inherits:

| Rule | Today (verified from source) | Keep / fix |
|---|---|---|
| Name, status, setup | Title as name; Awarded - Pre-kickoff; time and expenses enabled; four staffing fields copied down | Keep |
| Project parent | Class = Anderson Frank forces the AF customer record (hardcoded id 136); otherwise the entity | Keep the rule, drop the hardcoding: parent = entity, the billing party in both channels |
| Tasks | Always a "Netsuite Configuration" task at the opportunity rate; a "Rapid Assessment" task at a hardcoded $106.25 when the RA flag is set | Build tasks from the opportunity's own Task 1/2/3 titles, hours, and rates, which the button ignores today; rates come from the record, not code |
| Link back | Sets only the custom field `custbody_opp_proj_create` | Also set the native opportunity-to-project link |
| Not copied today | Contract value, billable rate, monthly/minimum hours, AF placement ref and minimums, kickoff date, Asana link | Fill at creation |

### Disposition: the button is rebuilt, not replaced (amends decision 10)

v2 said the close-deal skill replaces the button flow, with the button kept untouched as the non-Claude fallback until phase 3 proved out, then retired or rewritten. Decided 2026-10-08: the button is not retired. The suitelet is rewritten and becomes the single creation path for everyone, with or without a Claude session, because project creation is deterministic work and the OS rule is that deterministic work is a script, not a model: twenty-odd fields, tasks, links and staffing through MCP writes would be slower, cost tokens every run and vary between runs, while a script behaves identically whoever triggers it, including Mike pressing the button with no session open. Script underneath, agent on top (Mike: "I prefer script if possible"). The suitelet source exists only in the account and is imported into the SDF project first.

- **Mapping.** The table above, plus End Client and Partner Contact copied down, Asana and kickoff fields carried, the project marked travel-eligible by default, and the relay's travel refresh called (section 13).
- **Readiness gate, server-side and idempotent.** The user-event script shows the button only when the required fields are present (End Client, channel, staffing, billable rate, Task 1 at minimum) and otherwise lists what is missing. The suitelet re-validates the same rules, so a RESTlet caller or a double-click cannot bypass them. It refuses when a project is already linked, writes the link before building tasks, and resumes a partial project on retry instead of creating a second (Codex point 2).
- **Around the button.** close-deal (section 8) owns the interview, Asana check, kickoff proposals and turnover; it calls the suitelet through its RESTlet and never re-implements the mapping.
- **Native alternatives rejected.** There is no native Create Project action on an opportunity; the bulk "Create Projects From Sales Transactions" keys on service items with the Create Project box, and our deal economics live in custom Task 1/2/3 fields, not items (Codex point 12, disagreed).
- **The $0 pipeline** is fixed upstream: the proposal skill sets `projectedtotal` and expected close at the Proposal stage. Deal value is authoritative on the opportunity; the project copies it (Codex point 9).
- **Status cleanup** (the four oddities, section 2) edits the existing status records, never deleting or re-creating them, after a by-internal-id inventory of the 26 statuses and every saved search and workflow that references them. Onboarding progress after Won stays in the kickoff and onboarding fields, because NetSuite forces Closed Won once a sales transaction references the opportunity (Codex point 8).

### Channel-dependent project creation [confirm]

**Direct:** parent = the prospect; End Client = the entity; rate and contract value from the proposal; Power Cloud paper; kickoff with the client. **Subcontract (AF today):** parent = the subcontracting firm; End Client field (v2: project name + referral end-user field) plus the AF placement ref, minimums and monthly hours; partner's paper terms, ours stays internal; kickoff per partner arrangement [confirm].

### Make the native links and values real

Set `projectedtotal` at stage 3, the native opportunity-to-project link at conversion, and lead source at intake (6 of 178 today). Estimates stay optional in v1.

### Access and guardrails

- NetSuite writes happen in the sessions of whoever owns deals, via the internal MCP connection. A connection consumes a full NetSuite license (CAPABILITIES.md), so decision 7 names the people; anyone without one works the folder side and the weekly review carries their NetSuite updates in batch. Later, the `fetch_time_entries.py` pattern extends to a token-based SuiteTalk sync.
- Every write is confirmed by the human before it fires; the pinned account ID is verified at session start; record types are allowlisted (customer, contact, opportunity, task, project; customer and contact because intake creates the end client and its contacts). A settings hook can enforce the allowlist, same pattern as A8.
- **Write contract** (Codex point 11): a deal is identified by its opportunity number once logged, never by name alone; DEAL.md owns narrative and open questions, NetSuite owns status, dates, economics and links, and the Monday prep reconciles when they disagree; every write is attributed in the opportunity's system notes to the seller's own connection.
- **Move the internal connector to `customrole_pc_mcp_ai_connection`.** The recon hit ad-hoc-role symptoms on our own account, the exact failure mode we tell clients to avoid. One-time dogfooding fix.

---

## 8. The skills

Four skills in the OS skill registry, governed like every shared skill (changelog, review before change), plus a fifth row that is a Paco capability, not a skill:

| Skill | Job | NetSuite writes (all human-confirmed) |
|---|---|---|
| `deal-intake` | Stamp the folder at the root, fill DEAL.md from the first transcript plus a short interview (including who referred it, by name), create the end-client Customer and contacts and the opportunity per the section 7 record model | Create customer and contacts, create opportunity |
| `pipeline` | One-line updates any day; call-prep cheat sheets and the open in-call session; Monday prep: talking points per deal, reconcile folders against NetSuite both directions, work the flags, regenerate PIPELINE.md | Update status, next contact, expected close |
| `proposal` | Evidence pass over `source/`, commercial-model and type interview, draft per type, LOE checkpoint line by line, render branded, log to loe_log.md | Status to Proposal, Task 1/2/3 economics, projected total |
| `close-deal` | Won: walk the ladder, run the close-out interview for the readiness-gate fields, call the rebuilt Create Project suitelet through its RESTlet instead of creating the project itself (v2: the skill did; the script now owns the mapping, section 7), check Asana first, propose kickoff times, create CONTEXT.md from DEAL.md, run the SALES_TO_DELIVERY turnover. Lost: status, reason, learnings line | Close opportunity, create kickoff task; the suitelet creates the project |
| Paco touch capability (phase 3b) | Google Chat, sales team's space: "log on {deal}: ...", "where does {deal} stand", "prep me for {deal}". Updates DEAL.md and, after an in-thread confirmation, the opportunity's status and next contact. Follows the Paco capability contract (`PACO.md`): Chat text is data | Update status, next contact (allowlist: opportunity, task) |

**All four skills interview the seller directly for the NetSuite values their stage owns** (question lists in `SALES_TEAM_GUIDE.md`). A required field is asked for point-blank, never guessed; "unknown" becomes an open question in DEAL.md that the weekly review re-asks until it closes.

Proposal structure varies by engagement type (assessment with the MCP-access commitment language, implementation in the Bruce Bolt shape, custom build Use-Case-shaped and priced), all from `templates/sales/` versions built off the `MSA and SOW/` library; the AI and data-handling MSA language (roadmap decision 6) rides along once Mike hands over the current MSA. Kickoff scheduling: the skill proposes times and drafts the invite; a human sends it.

---

## 9. Interface: the answer to "should we use our own interface"

v2 said: now, no new interface; Claude Code plus the Drive plus NetSuite. Decided 2026-10-08 (Mike, asking whether letting the team decide "in human language" and stay out of NetSuite is overkill): it is not overkill; two layers.

**What the sales team touches: both surfaces, Chat for the daily motion.** Steve, Jason and Chris live in Google Chat and touch NetSuite only when unavoidable; keeping them out of NetSuite forms is the point (they talk, the agent types). Claude Code sessions in the deal folder carry the three heavy moments, intake, proposal and close, with Mike guiding the first ones. A Paco capability in Google Chat carries the daily touches ("log on Acme: demo Tuesday", "where does Acme stand", "prep me for tomorrow's call"), because a capture habit only sticks where people already are. It is built in phase 3b right after the skills, not deferred, under Paco's capability contract (`PACO.md`): Chat text is data, every NetSuite write is confirmed in the thread first, and DEAL.md is what it updates, so a session and a Chat touch write to the same record.

**What creates the project: a script, with the agent on top.** The agent collects answers in plain language and on "yes" calls the rewritten suitelet through its RESTlet (reasoning in section 7).

**Later.** DEAL.md at the OS root is indexable by the portal the way CONTEXT.md is, so a read-only pipeline tile and proposal acceptance on the approval ledger are post-beta candidates, not commitments; sales adds no beta scope. This also resolves SALES_TO_DELIVERY.md's open items: folder location (the OS root), artifact creation (close-deal, check-before-create), signed SOW location (Sales drive contract library, redacted copy to `source/`), MCP-commitment language (proposal boilerplate), and the intro-email template (`templates/sales/`).

---

## 10. Decisions for Mike

1. **Folder model**: confirm option A (deal folders at the OS root, born at first contact, never move; CONTEXT.md joins DEAL.md on a win), accepting the stated sharing tradeoff, with option B (restricted Sales/ area plus same-drive move on win) as the fallback if sales-material privacy is required.
   - Decided 2026-10-08: option A.
2. **Conventions as channel model**: confirm entity = billing party and class = channel as the formal rules (no new fields), with the end-user field mandatory on subbed deals, and a class-list inventory in phase 3 before doctrine.
   - Decided 2026-10-08: superseded by the record model (section 7): End Client on every deal, channel is class pending the inventory (now phase 1) else a Channel Partner field, referrer and partner contacts become Contact records. "No new fields" is withdrawn because the end client and its people must be records, not text.
3. **Native values**: start populating projected total, the native opportunity-to-project link, and lead source (recommended yes on all three).
   - Resolved 2026-10-09 (interview): projected total is unused today, the proposal skill sets it; the native link is set by the script; lead source is "used the same as class" and class is the financial field, so class is the channel and lead source is not built on.
4. **Estimates**: confirmed out of the standard flow for v1?
   - Resolved 2026-10-09 (interview): not used; out of v1.
5. **Losses**: retire `Lost Dead for now` folder moves in favor of DEAL.md status + reason (recommended yes)?
   - Resolved 2026-10-09 (interview): yes; the native Win/Loss Reason plus a memo line, no folder move; the lost-reason field has never been used and no autopsy happens today, so a quarterly read is an action item.
6. **The capture bar**: every recorded prospect call gets a folder, and every folder with a call gets an opportunity by the next weekly review. This is the catch-more mechanism; it only works as a stated rule.
   - Decided 2026-10-08: carried as a stated rule in the Playbook v2.
7. **Who runs deals with the tool**: name the seller(s) who get Claude Code sessions and the internal MCP connection (license constraint), and whether anyone sells folder-only with the weekly session carrying their NetSuite updates.
   - Decided 2026-10-08: Steve, Jason, and Chris (new fractional resource), with Mike guiding, troubleshooting and testing. Emily has left. Folder-only sellers: open.
8. **Internal connector role**: move it to `customrole_pc_mcp_ai_connection` (recommended, one-time fix).
   - Open as a recorded decision; the plan puts the three seller connections plus Mike's on that role.
9. **Pipeline-review prep**: the Monday pipeline review meeting already exists; confirm the enforcement loop (reconciliation, flags, PIPELINE.md) rides its prep rather than a separate session, and who runs that prep: each seller for their own book, or one owner for the whole pipeline.
   - Resolved 2026-10-09 (interview): Steve keeps running it from the PC Opportunity Dashboard search; one person preps the whole pipeline; PIPELINE.md plus the flags is the "better dashboard, maybe".
10. **Create Project button disposition**: close-deal replaces the flow, button kept untouched as the non-Claude fallback until phase 3 proves out, then retire or rewrite (recommended).
    - Decided 2026-10-08, amended: rebuild the button as the single creation path, with a server-side idempotent readiness gate; close-deal calls it through its RESTlet (section 7).
11. **Cleanup license**: `Pre-Sales Projects` becomes a read-only legacy annex; rename `Signed Contrcats` (typo) and file the ~40 loose Sales-drive root files while at it. Mike's drive to tidy.
    - Resolved 2026-10-09 (interview): a read-only legacy folder causes no problem; Mike wants everything into the OS folders, so the migration of the pre-sales folders is an action item he owns.
12. **Project customer on subbed deals**: the project's Customer is the billing party, always, with End Client carrying the end user (section 7).
    - Recommended; approved with the plan 2026-10-08.
13. **Travel sync**: one scheduled job on the existing relay box writes the Navan and Uber lists, with email alerts (section 13), rather than a NetSuite scheduled script.
    - Recommended; approved with the plan 2026-10-08.
14. **Referrer program ownership after Emily**: who owns the outreach program in her tracker.
    - Decided 2026-10-08: park it. Existing referrer contacts load as records in phase 1; the program gets an owner later.

---

## 11. Build plan

Replaces the v2 rollout table: v2 phases 1 to 3 (record, proposal, close) are now phase 3; phases 0 to 2 and 3b are new. v2's "Later" items (token-based sync, portal pipeline tile, proposal acceptance on the approval ledger) stay post-beta; button retirement is dropped (decision 10).

**Phase 0: decide and record.** This revision, then a decisions checkpoint into `Internal/sessions/` (session-memory skill).

**Phase 1: record model and the button** (first connected session; sandbox first, Power Cloud's own account).
- **Start with the sales-team interview** (Steve, Jason, Chris), thirty minutes on how deals actually run, before the field set is frozen (Codex point 12; v2 had it inside its phase 1 build). It feeds Playbook v2 and the Opportunity to Project one-pager.
- **Verify:** field types (`custbody_pc_referral_end_user`, the AF contact fields), the class list and its use, Partner records, the Consolidate Projects preference (it decides whether the native link is a header or line field and can source service items onto the opportunity; compare lines and totals before and after on a test record, Codex point 6), and the current Navan and Uber lists against the project saved search.
- **Build** a new SDF project `Power Cloud NS/CRM` beside the Navan and Task to Invoice projects (none has a git remote; add one): the new fields (the suitelet copies between opportunity body fields and project entity fields by script id), saved searches, the readiness gate, the rewritten suitelet. Worker: `pc-sdf-author` from the approved plan block; the orchestrator validates with `--server` and deploys.
- **Migration** (human-gated production writes), a reconciled load, not a spot-checked one (Codex point 7): export current values of every field being replaced; dedupe companies and contacts before creating any; keep a source-to-target id map in the SDF project; backfill every open opportunity and active project before any new field becomes mandatory; reconcile counts per field; keep the old text fields populated and hidden until the first month closes clean. `pc-data-condenser` takes the value inventory and dedupe candidates; writes stay with the orchestrator.

**Phase 2: travel sync** (the relay, `Navan/relay/`). Ask Navan's account manager to enable the checkout-field SFTP feed against the relay's public key and confirm the Bill To Client system name and replace-versus-upsert. Build relay job `project-sync`: pull the saved-search projects through the RESTlet, write the Uber file to `to_uber/expense_codes` (test first in `test_to_uber`) and the Navan file to its SFTP, heartbeat, per-run email, daily after the Uber poll, plus the weekly roll-up. Retire `UBER_CODE_OVERRIDE` and `TRIP_PROJECT_OVERRIDE` once the lists are generated.

**Phase 3: the deal record and the skills** (v2 phases 1 to 3, unchanged in shape): `templates/deal-record/`, `deal-intake`, `pipeline`, `build_pipeline_log.py` and the engagement-log rule, backfill of the 13 open deals; `templates/sales/` and the `proposal` skill with the LOE checkpoint wired to LOE_BASELINES and loe_log; `close-deal` driving the rebuilt button through its RESTlet, graduation, SALES_TO_DELIVERY integration, new-engagement reading DEAL.md. Then Playbook v2 and the one-pager. Mike runs the first intake, proposal and close alongside the deal owner. Access: three seller connections plus Mike's on `customrole_pc_mcp_ai_connection` (decision 8).

**Phase 3b: Paco touch capability.** The three Chat commands (section 8) under the Paco capability contract; the write allowlist (opportunity, task) applies.

**Verification**
- **Sandbox:** one subbed and one direct test opportunity end to end (readiness gate blocks then passes; the button creates the project with End Client, Partner Contact, tasks from Task 1/2/3, both links, travel refresh fired). Then double-click, retry, and a forced failure between project and task creation: one project, no duplicates, resumable.
- **Billing through:** enter approved time and an expense on each test project and run Invoice Billable Customers; the invoice goes to the billing party at the task rate, with minimums and multiple resources exercised on the subbed one (Codex point 1).
- Saved searches return the expected rows; the travel-eligible project list matches what the relay job sends.
- **Migration:** per-field counts before and after, the id map complete, every open opportunity and active project carrying End Client, no AF text field populated without a matching Contact, hidden old fields intact for rollback.
- **Travel:** create a project; confirm the on-create refresh and the daily run produce the full lists in test, then live; book a test ride and flight and confirm the expense lines land on the project. Force a short export and confirm the job alerts instead of sending.
- **Skills:** one real deal through intake and one through close in the first live week, DEAL.md and loe_log checked by hand.

## 12. What this does not change

The client-account read-only rule and every execution guardrail. The three engagement types and their deliverables. The portal beta scope and sequencing. The assessment process from kickoff onward. Asana's interim role (close-deal checks-before-creates exactly as new-engagement does, and the A15 gate migration to the portal proceeds independently).

---

## 13. Travel setup: Navan and Uber

Vendor research (session scratchpad report, every claim with a URL and a confidence mark) settles it: one scheduled job writes both lists over SFTP.

- **Uber for Business** has no API for expense codes, but the SFTP account that already delivers the daily trip CSVs also accepts uploads: a headerless CSV (`Expense Code, Description, Employee Emails`) dropped in `to_uber/expense_codes` is live within the hour. Semantics are full-list replace: a code missing from the next file is deactivated, an empty file is ignored. Confidence: high.
- **Navan** offers four paths. Bill To Client is one of three default checkout fields with Name, ID and Approver per option. Options load by CSV in the admin UI; by an SFTP feed Navan's account manager enables against our public key (file `companyname_customfield_yyyyMMdd.csv`, columns Custom Field Name, Name, ID, Default, Approver); by an Expense API batch endpoint with UPSERT and DELETE (needs an enablement our bookings:read credential lacks); or by a manual one-click sync from the Navan Expense NetSuite SuiteApp (only if we had Navan Expense). Confidence: high on the SFTP feed. To confirm at setup: the field's system name, and whether the file replaces or upserts.
- Travelers can type a free-text client at checkout when the field allows it, which produces mistagged bookings; free text goes off once the list is automated.

**Design.** One scheduled job reads the active-project list and writes both files. Source of truth is the Project Saved Search already on the Navan config record (today unused), served to the relay by a small RESTlet that runs it with `N/search` (SuiteQL cannot execute a saved search by id; Codex point 5). The rewritten Create Project suitelet makes every new project eligible by default, with a project checkbox to exclude internal or non-travel projects, and calls the relay's refresh endpoint on creation so a new project is bookable the same hour (Codex point 4). The job runs daily on the existing relay box, which already holds the Uber SFTP key, a NetSuite token client, a timer, and the heartbeat watchdog. Uber gets `{id}-{name}` rows; Navan gets `customFieldN, name, id, FALSE, approver` rows. Closed projects fall off both lists by omission.

**Replace-list safety** (Codex point 3): because Uber deactivates any code missing from the file, the job never sends a list that is empty, truncated, or more than a set percentage smaller than the last-good snapshot it keeps; it alerts instead. The Navan feed is treated the same until Navan confirms replace-versus-upsert. Manual upload in both admin UIs stays the documented fallback; free text on Bill To Client goes off only after both feeds run clean for two weeks.

**Alerts and recovery.** The config record's Alert Email receives the per-run summary plus a weekly roll-up of the MISSING_PROJECT bookings and rejected Uber codes the integrations already log. Those exceptions already persist in the integration-log custom record; the roll-up names an owner, and replay is the existing idempotent re-run after the project is added. The override maps stay until historical bookings are reconciled. No new project fields are needed for the happy path; the list is derived, never ticked by hand. The relay, not a NetSuite scheduled script, is the recommendation (decision 13): the credentials, timer and watchdog are already there, and NetSuite has no static outbound IP for the day Navan asks for one. Alerting stays on email.

---

## 14. Second opinion

Codex (gpt-6-astra, read-only, 2026-10-08) returned twelve points; disposition by number. Folded in as changes: 1 (billing-through test), 2 (server-side idempotent gate), 3 (replace-list safety), 5 (saved search via RESTlet, not SuiteQL), 7 (reconciled migration). Folded in as verification or scope notes: 4 (on-demand refresh; exception recovery already exists), 6 (Consolidate Projects and link sourcing), 8 (status ids and dependents), 9 (projected total set at Proposal), 10 (class inventory before new values), 11 (write contract), 12 (interview moved earlier). Disagreed: the native bulk Create Projects path in 12, for the reason in section 7.

---

## 15. Writes through an API, not the MCP connector (amendment, 2026-10-09)

Mike asked on 2026-10-08 whether leads, opportunities and projects could be created and updated through an API instead of the MCP connector. Decided 2026-10-09 (Mike, after a Codex read-only second opinion, folded in below): **yes**. Every NetSuite write the sales process makes goes through one RESTlet in the `Power Cloud NS/CRM` project; the MCP connector stays for reads and exploration inside a session and is not used for writes. This amends section 7 (Access and guardrails), section 8 (the writes column) and the phase 1 build plan in section 11. The reasons are the ones already behind the rebuilt button: identical behavior whoever triggers it, usable with no session open (Paco, the Monday prep, the relay), validation and mapping in one server-side place, and none of the per-session connector limits seen in the 2026-10-08 verification (ad-hoc role, about half of parallel calls rate-limited).

**The RESTlet.** `customscript_pc_crm_api`, SuiteScript 2.1, domain actions rather than generic record writes: `resolveClient` (candidate matches by name and domain for a human to pick from, never an automatic merge), `createEndClient` (customer plus contacts), `createOpportunity`, `updateOpportunity` (status within the allowed transitions, next contact, expected close, projected total, Task 1/2/3 economics; cannot set won or lost), `logTouch` (an activity record plus next contact, not an overwritten memo), `closeOpportunity` (won or lost with reason, the only path to those statuses), `createProject` (the rewritten suitelet logic, idempotent, advances the won ladder), and `listTravelProjects` (runs the Navan project saved search by id). The suitelet and the RESTlet share SuiteScript modules; the RESTlet never calls the UI suitelet over HTTP. No second generic write path through the REST record API, because status, economics, class and close dates carry business rules and a second path would bypass them.

**Authentication.** OAuth 2.0 client credentials (machine to machine, certificate-backed), not Token-Based Authentication: Oracle's 2026.2 release notes say no new TBA integrations from 2027.1, with TBA end of support tentatively 2028.2 (verified 2026-10-09). Certificate rotation is planned from day one. The relay's existing token client and `fetch_time_entries.py` keep working as grandfathered integrations and go on a migration list. Credentials live in per-machine environment variables and on the relay box, never on the shared Drive.

**Roles and deployments per caller.** One integration user, but separate roles and deployments: the sales-write role (customer, contact, opportunity, project, project task, the touch activity) for sessions and Paco; a read-only role whose deployment exposes only `listTravelProjects` for the relay's travel sync. Paco's deployment cannot reach `createProject` or the economics fields. No role is widened to Administrator to cure a permission failure; a failure gets the specific permission added and recorded.

**The human gate stays enforced, not advisory.** A model that promises to wait for "yes" is not a gate, and an agent that can read the credentials can bypass a client-side wrapper. So every mutation is a pending request: the caller (session or Paco) submits the action and payload to the relay, the relay records it and asks the human (in the Chat thread or the session) to approve the exact operation with the resolved records and before-and-after values, and only an authenticated approval executes the RESTlet call. The approver and the requester are taken from the authenticated session or the verified Chat sender, never from a parameter the agent fills in. That replaces the "logged by" idea and the MCP hook's per-session prompt for this path.

**Identity and idempotency.** A deal gets a durable UUID at intake (recorded in DEAL.md and on the opportunity) and an end client gets one after a human resolves the match; name and domain only suggest candidates. Every mutation carries a request ID generated and persisted by the client before sending; retries reuse it. The relay keeps an operation ledger (request ID, canonical payload hash, state, result IDs, requester, approver, outcome): the same key with the same payload returns the recorded result, the same key with a different payload fails, keys are claimed atomically rather than search-then-create. Multi-record actions record each completed step so a customer saved before a contact failed, or a project saved before its tasks, is resumed rather than duplicated; a timeout after a save and before the ledger write is reconciled before any retry.

**Rollout on production, no sandbox.** Inventory triggered scripts, workflows, email notifications and downstream exports first. Deploy read-only validation and resolved previews (what would be written) before any write. Then one narrow action, `logTouch`, for one seller on allowlisted records; then intake; then close and `createProject`. An action-level kill switch, a reconciliation saved search and a written recovery procedure exist before the first multi-record write. Test opportunities and projects are excluded from the travel exports. Writes are serialized with backoff and the same request ID on retry; read concurrency is bounded. The connector still moves to `customrole_pc_mcp_ai_connection` (decision 8) so that reads stop failing, and the rate limiting is measured again before it is blamed on account concurrency.

**Licensing, corrected.** The MCP connector is free; what it needs is a licensed user, so sellers who already hold seats consume nothing extra, and a shared integration identity saves seats only if seats would otherwise have been bought for this tooling. Who holds a seat is an interview question (`SALES_TEAM_INTERVIEW_GUIDE.md`, block H), not a design assumption.

**Second opinion, disposition.** Codex (gpt-6-astra, read-only, 2026-10-08) returned fifteen points. Adopted: 1 (OAuth 2.0 over TBA, verified against Oracle), 3 (RESTlet with domain actions, shared modules, no second path), 4 (per-caller roles), 5 (enforced gate on the relay), 6 (ledger attribution over a logged-by parameter), 8 and 9 (UUIDs and request IDs over natural keys), 10 (partial-failure recovery), 11 (transition model, activity record for touches), 14 (rollout order). Adopted as a correction: 2 (seat saving not established). Noted, already covered by the deal-level channel design: 12. Held: 13 (the 2026-10-08 429s were parallel reads under an ad-hoc role; measure after the role move before blaming capacity). Not needed: 15 (custom MCP tools over the same module later, if per-user MCP writes ever matter). Full response: `Internal/sessions/2026-10-08_codex_api_vs_mcp_response.md`.
