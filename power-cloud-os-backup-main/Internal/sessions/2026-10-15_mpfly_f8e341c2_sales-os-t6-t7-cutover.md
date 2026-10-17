---
date: 2026-10-15
who: mike
session: f8e341c2-86cf-4c5f-83d1-8351ccbcec94
covers_through: 31
raw: raw/2026-10-15_mpfly_f8e341c2.md
---

## What this session was about
Sales OS phase 1, resumed from checkpoint 88c67b4c: step 0 (backup sync, ZZ TEST check, the six searches), T6 migration (contacts, projects, opportunities by CSV import, reconciled, AF text fields hidden) and the T7 cutover window (release, legacy off, three test deals through the UI, cleanup). Both done. Detail and every id in `Power Cloud NS/CRM/build_log.md` (2026-10-15 sections).

## Decisions
- **decided** (Mike, "sync"): T5 work committed and pushed to the OS backup repo as `cdd4e48` after a clean credential and vendored-tree scan.
- **decided** (Mike, "Can't you do the import?" then "Yes, run it in Chrome"): the orchestrator runs the CSV imports in Mike's Chrome (Claude in Chrome; the built-in pane cannot attach files), Mike confirming each run. Rejected: Mike running the Import Assistant himself; connector writes (his standing rule and the concurrency limit).
- **decided** (Mike): contacts imported with server scripts off (Celigo real-time runner on Contact). Contact Role left unset: the Contacts Only import does not offer it and no CRM code reads it.
- **decided** (Mike): keep OPP0173 and OPP0182 End Clients as filed (4026, 4049) although their projects carry 4046 Travel Only and 5708 Shinesty Direct.
- **decided** (Mike): opportunities imported with server scripts on so the guard fills Billing Party. Deal UUID and Partner Contact were dropped silently twice; root cause (Mike): both fields sat on a hidden subtab of the PC Opportunity form. Mike made the subtab visible; the retry on that form landed. Rejected: switching the import to Standard Opportunity (does not change the form the update applies through).
- **decided** (Mike): 12 opportunity periods moved to Oct 2026 by the CSV saves are fine.
- **decided** (Mike, "Deploy the six hidden AF fields"): six AF contact text fields set to HIDDEN by SDF, values kept. `custentity_proj_af_ref` and `custentity_af_minimums` untouched.
- **decided** (Mike, T7 interview): Create Project by Administrator only for now; Support Type ID 11 on suitelet and guard; orchestrator drives in Chrome, Mike confirms each save; T4 released in the window; legacy client script undeployed too; test principal Mike (3).
- **decided** (orchestrator, netsuite-sdf production gate): log level ERROR on guard and suitelet, AUDIT on T4 (the plan asks one log line per changed record).
- **decided** (Mike): test records built through the T3 API driver after Chrome autofill wrote a login email into the UI customer form; the cutover test itself (Create Project, faults, Resume) ran in the UI.
- **decided** (Mike): T2 (h) substitute: class is not inline-editable on opportunity lists, so an inline edit of Expected Close on the subcontract deal proved Billing Party survives XEDIT (stayed 136); new guard unit tests cover the branch (Jest 63/63, mutation-checked).
- **proposed** (orchestrator, not yet Mike's): the builder marks earlier failed ledger rows of the same opportunity as superseded when a Resume completes, so the ledger recon search stops flagging finished deals. Alternative: accept the noise.

## Open threads
- Mike: fix the two T5 search defects: `customsearch_pc_inv_no_class_90d` formula error; `customsearch_pc_recon_links` lists deals whose native `job` is set (its join reads the wrong Project field).
- Mike: the stale failed ledger rows a UI Resume leaves (proposal above), plus the 3 failed test rows of 2026-10-09.
- Mike: native Project link on the 6 legacy direct deals (OPP0123, 0125, 0150, 0155, 0174, 0175).
- Mike: rotate the sales certificate (key files confirmed gone from the Drive root); Erin Maher's email (emaher@ vs e.pryce@tenthrevolution.com).
- T8 (relay) is next; the RESTlet deployments stay TESTING until then.
- Retro: four CAPABILITIES entries of 2026-10-15 (CSV form drop and hidden subtab, HIDDEN on body fields, period reset on save, the invisible Import Assistant warning).

## Next step
- Decide the two T5 search fixes and the ledger-supersede proposal, then start T8 (relay) in a fresh session. Final sync done: `e96f7ce`.

## Promoted
- `Power Cloud NS/CRM/build_log.md`: step 0, T6 imports and reconciliation, AF fields, the T7 window W1 to W6.
- `Power Cloud NS/CRM/PLAN.md`: T3 permission lists refreshed from the role XML; file path and script id note; T6 done, T7 tested.
- `Power Cloud NS/CRM/docs/T7_cutover_plan.md` (new), `docs/FDD_TDD_tables.md` (new), `__tests__/pc_crm_opp_ue.test.js` (new), `migration/build_import_files.py`, `migration/import/*`, `migration/id_map.csv` (new), six AF field objects and three script objects (status, log level), role XML comments.
- `CAPABILITIES.md`: four dated [unreviewed] entries (2026-10-15).
- `tasks/todo.md`: T6 and T7 ticked with results; open items.
