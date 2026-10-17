---
date: 2026-10-08
who: mike
session: 3c7f7fad-787e-48ae-91fc-90b92130d75f
covers_through: 11
distilled_by: claude (session 88c67b4c, 2026-10-12, from the raw file)
raw: raw/2026-10-08_mpfly_3c7f7fad.md
---

## What this session was about
Planning session on bringing the sales team into the OS, cleaning Power Cloud's own NetSuite as the CRM, smoothing Opportunity to Project creation, and stopping lost Navan and Uber project setup. Produced `Internal/SALES_OS_PROPOSAL.md` v3 (v2 archived), a Codex second opinion folded in, the initiative on `tasks/todo.md`, and two lessons. Also diagnosed and repaired the Navan relay login (invoice PDFs had not attached since Sep 28).

## Decisions
- **decided** (Mike): CRM stays in NetSuite; no custom CRM. Why: the pipeline, funnel, won ladder and project record already live there and a won deal must end as a NetSuite project. Rejected: PowerCRM (Mike: immature, little value); an external CRM is the only fallback if NetSuite proves insufficient.
- **decided** (Mike): the end client always gets its own Customer record with native Contacts, linked from Opportunity and Project by a new End Client field; both fields are set on every deal, and on a direct deal End Client points at the same record as the entity, defaulting from it. Why: uniform reporting and a derivable direct-versus-subbed check. Supersedes the v2 "no new fields" channel model (Mike's own 2026-08-28 convention), because the end client and its people must be records, not title text.
- **decided** (Mike, "I prefer script if possible"): Opportunity to Project is a rewritten suitelet with a server-side idempotent readiness gate, and the close-deal skill calls it through a RESTlet. Why: deterministic work is a script, identical whoever triggers it, usable without a session. Rejected: the agent creating the project field by field through MCP (v2 decision 10, now amended).
- **decided** (Mike): deal folders use option A (born at the OS root at first contact, never move; CONTEXT.md joins DEAL.md on a win).
- **decided** (Mike): first sellers with sessions and connections are Steve, Jason and Chris (new fractional resource), with Mike guiding, troubleshooting and testing. Emily has left.
- **decided** (Mike): referrer-program ownership after Emily is parked; existing referrer contacts load as records in phase 1.
- **proposed**, approved with the plan (Mike said "go for phase 0" after reading it): the project's Customer on a subbed deal is the billing party (Anderson Frank, Playa Tech, Systems Accountants), with End Client carrying the end user. Why: Invoice Billable Customers invoices the project's customer, confirmed by the Task to Invoice work. Mike had flagged this as still open; the plan answered it with the billing reason.
- **proposed**, approved with the plan: travel sync is one daily job on the existing relay box that writes the full project list to Uber's SFTP (`to_uber/expense_codes`, full-list replace) and to Navan's checkout-field SFTP feed once the account manager enables it, with a shrink guard and email alerts. Why: both vendors accept a full-list CSV over SFTP, the relay already has the Uber key, timer and watchdog, and the May Navan SOW left this sync out of scope.
- **proposed**, approved with the plan: both interfaces for the sales team, Claude Code sessions for intake, proposal and close, and a Paco capability in Google Chat for daily touches (phase 3b). Why: Mike said the team lives in Chat and touches NetSuite only when unavoidable; capture only sticks where people already are. Rejected: sessions only (my first recommendation, revised on that answer); Chat only.
- **decided** (Mike): Anderson Frank stays one Customer record with its recruiters as Contacts and Lead Source = AF; no Partner record needed. Decided by the orchestrator from the Oracle docs and recorded in v3 without objection.
- **decided** (Mike): no custom live subagent dashboard; the app's built-in tasks pane is enough.
- **decided** (Mike, "bootstrap"): re-establish the relay's Navan session by running the bootstrap on the Hetzner box with the magic link pulled from the relay@ email. Result: success, session cached 2026-10-09 02:54 UTC; the backlog of unattached invoices catches up on the next 4:00 AM Pacific run.

- **decided** (Mike, turn 11, distilled: "yes write the note"): the Navan relay session fix was recorded at the top of the Navan project's `session.md` (symptom, cause, fix, measured session life, the four owed relay changes, the planned project-sync job). Already listed under Promoted.
## Open threads
- Enable the Power Cloud NetSuite connector in the phase 1 session and move it to `customrole_pc_mcp_ai_connection`; nothing in the account could be re-verified today. Mike.
- Navan account manager: enable the checkout-field SFTP feed against the relay's public key, confirm the Bill To Client system name and replace-versus-upsert, ask about exempting the relay user from new-device verification. Mike.
- Relay hardening before phase 2: fail once and alert instead of retrying login daily, automate the magic-link re-bootstrap by reading relay@, redact the shared secret header from the request log. Session lasts about four months (May 28 to Sep 27), so the next manual expiry is around late January 2027 if the automation does not ship.
- Open v2 decisions still unanswered: 3 (native values), 4 (estimates), 5 (losses), 8 (connector role), 9 (who runs the Monday prep), 11 (Sales drive cleanup), and whether anyone sells folder-only.
- Verify in phase 1: `custbody_pc_referral_end_user` type, class usage on transactions and reports (else a Channel Partner field), the Consolidate Projects preference, the 26 statuses by id and their dependents.
- Sales-team interview (Steve, Jason, Chris) is the first step of phase 1, before the field set is frozen.

## Next step
- Phase 1, first connected session: enable the connector, run the sales-team interview, verify the field and class facts, then build `Power Cloud NS/CRM` (End Client, Referral Contact, Partner Contact, saved searches, readiness gate, rewritten suitelet, project-sync RESTlet) sandbox first. Checklist on `tasks/todo.md`.
- Confirm on 2026-10-09 that the Navan invoice run succeeded (relay log on the box, or the integration log in NetSuite).

## Promoted
- `Internal/SALES_OS_PROPOSAL.md` v3 (the decision record; v2 at `Archive/SUPERSEDED 2026-10-08 - SALES_OS_PROPOSAL.md`).
- `tasks/todo.md`: the initiative with phases 0 to 3b.
- `tasks/lessons.md`: ask where the team already works before recommending an interface; research workers write their report to a file.
- Navan project `session.md` (local, under Netsuite Development/Navan on Mike's machine): the 2026-10-08 re-bootstrap, the four-month session life, and the four owed relay changes.
