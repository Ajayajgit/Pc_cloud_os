---
date: 2026-10-09
who: mike
session: e211b3a2-57cf-4d3b-bc51-8b5871bfebbc
covers_through: 16
distilled_by: claude (session 88c67b4c, 2026-10-12, from the raw file)
raw: raw/2026-10-08_mpfly_e211b3a2.md
---

## What this session was about
Phase 1 of the Sales OS (Internal/SALES_OS_PROPOSAL.md): the first connected session on Power Cloud's own NetSuite. Verified the account, mined the sales-team interview, froze the field set, planned the build with a Codex review, built the SDF project `Power Cloud NS/CRM` through worker agents, and deployed T1 (fields, channel map, ledger, guard), T2 (project builder, suitelet, opportunity guard) and T4 (class propagation) to production. T3 (RESTlet, roles) and the migration remain.

## Decisions
- **decided** (Mike): writes from the sales process go through an API, not the MCP connector: one RESTlet with domain actions, OAuth 2.0 client credentials (Oracle retires new TBA integrations in 2027.1), relay-held pending requests with authenticated human approval, per-caller roles, an operation ledger with request ids and deal UUIDs. Proposal section 15, after a Codex read-only review (15 points adopted, 2 corrected my draft: enforced gate, seat saving not established). Rejected: MCP writes with the hook as the gate; plain REST record API as a second write path.
- **decided** (Mike): the opportunity entity stays the end client (practice on every subcontract deal); the rebuilt suitelet derives the project parent from a class-keyed channel map. Class stays the channel field; no Channel Partner field. Rejected: re-entitying subbed deals to the billing party.
- **decided** (Mike): `custbody_pc_referral_end_user` (List/Record > Customer) is repurposed as End Client; Consolidate Projects on Sales Transactions is disabled (one header project per invoice); Steve, Jason and Chris all hold full NetSuite seats.
- **decided** (Mike): invoice class gap is in scope; phase 1 propagates class to invoices, credit memos and time entries, expense reports later.
- **decided** (Mike): engagement-type mapping: Project Recovery = Rapid Assessment, Power Cloud Product and New License Deal = no project, NSPB = Use Case; rename Virtual Admin to Managed Services and add Support (id 11) on the opportunity list; Sererra an active subcontract row.
- **decided** (Mike): saved searches 267, 510 and 867 will be retired, nothing touched yet; the sales-team interview was already held, transcript supplied.
- **decided** (Mike): no custom Active flag on the channel map; the native Inactive box is the switch. Why: duplicative. The deployed field `custrecord_pc_cm_active` is deleted in the UI by Mike.
- **decided** (Mike): the channel map seed and the migration's bulk writes go by CSV import; the connector's integration has no concurrency to spare (record writes return CONCURRENCY_LIMIT_EXCEEDED).
- **decided** (orchestrator, recorded in PLAN.md and the field set): the channel map has no Partner column (no confirmable Partner record type number; the gate requires the native Partner field on referral deals); the native opportunity-to-project link cannot be set on subcontract deals, so the custom link is the link of record there; a legacy-button project reads as complete, not conflict; a blank task rate falls back to the general rate; the guard fails closed.
- **reversed** (Mike): the project-list rename of Virtual Admin to Managed Services, which produced two Managed Services values; reverted, merge planned later.
- **proposed**: the three Codex plan points held rather than adopted (429s may not be capacity; measure after the connector moves to the standard role).

- **decided** (Mike, turns 14 to 16, distilled): the resume prompt for the next session was rewritten to run autonomously for a few hours (no deploy, no NetSuite writes, no commit, no messages; validate allowed; T3 packet and build, T5, T6 read-only prep, and the T8 relay design note "if time remains"). Mike asked whether item 4 was still phase 1; it is phase 2, and he pasted the prompt with it included (session bb920280 ran it). Evidence of the choice is the next session, not words in this one.
## Open threads
- Mike: set both Support-id script parameters to 11, create the ZZ TEST records, and drive `CRM/docs/T2_acceptance_runbook.md` with the orchestrator verifying by query; delete `custrecord_pc_cm_active` and tick Inactive on the Playa row.
- Mike: move the connector to `customrole_pc_mcp_ai_connection` (still ad-hoc: company info and customfield blocked); merge project type 8 into 9; GitHub org for the CRM remote and the baseline commit (56 files staged, no commit).
- T3 (RESTlet, two roles, two certificates), T5 searches, T6 migration by CSV, T7 cutover window, T8 relay (pending-request queue, ledger, OAuth 2.0 client, project-sync).
- Confirm with Steve and Jason the five [Reported] interview answers about their own habits (ten minutes).
- Interview action items for Mike: private SOW folder, pre-sales folder migration, closed-loss autopsy cadence, revisit NetSuite seats.

## Next step
- Run the T2 and T4 acceptance tests from the runbook on ZZ TEST records (gate blocks then passes, resume after a forced fault, subcontract parent, product deal refused, class on invoice and time entry), log results in `CRM/build_log.md`, then author T3.

## Promoted
- `Internal/SALES_OS_PROPOSAL.md` v3.1: section 15 (API writes), section 7 amendments (entity rule, End Client repurpose, Consolidate Projects), decisions 3, 4, 5, 9, 11 resolved.
- `Internal/SALES_OS_FIELD_SET.md` (frozen, with 6a amendments), `Internal/SALES_OS_PHASE1_VERIFICATION.md`, `Internal/SALES_TEAM_INTERVIEW_GUIDE.md`, `Internal/SALES_TEAM_INTERVIEW_ANSWERS_2026-10-09.md`, `Internal/sales/source/` (interview transcript and summary), `Internal/sessions/2026-10-08_codex_api_vs_mcp_response.md`, `Internal/sessions/2026-10-09_codex_crm_plan_response.md`.
- `tasks/todo.md` Phase 1 block; `tasks/lessons.md` (a data pattern is not a preference setting).
- `CAPABILITIES.md`: three dated [unreviewed] entries (SDF filter validate/deploy mismatch; getText in beforeSubmit on REST-created records plus connector concurrency; module-scope N module reads fail script creation).
- `Power Cloud NS/CRM`: PLAN.md v2, build_log.md, handbacks, tests (39 of 39), `docs/T2_acceptance_runbook.md`, `migration/channel_map_seed.csv`.
