# Feedback on the OS

GENERATED 2026-10-14 by `.claude/scripts/build_feedback_index.py`. Do not hand-edit;
rerun the script instead. Entries live in `feedback/`, one file each; this is only the
index over them. Log an item by saying "log this as feedback" in any session, or `/feedback`.

**19 open**, 2 closed. 1 blocking, 6 happening every time. Reported time lost across open items: 3.1h.

Reporters: justin 9, julie 4, mike 4, ron 3, imran 1. A folder dominated by one name says more about who is not
reporting than about what is broken.

## Open, ranked

Blocking items first, then cost times frequency. Rank is the script's, not a judgement.

| # | Item | Type | Area | Cost | Freq | Blk | From | Status |
|---|---|---|---|---|---|:--:|---|---|
| 1 | [Deployed the standard PC MCP AI Connection role + ScriptReader toolset to GW's sandbox (9514504-sb1) and production (9514504) via SDF, with client...](feedback/2026-09-17-scriptreader-coreadminpermission-blocks-oauth2.md) | bug | ScriptReader project (C:\Users\lombo\NetSuiteDev\ScriptReader), customrole_pc_mcp_ai_connection role template | 25m | first-time | Y | justin | new |
| 2 | [During a 1,117-item assembly import in a client's production account (one BOM create and one item create per row, run one call at a time), the...](feedback/2026-10-02-mcp-connector-intermittent-5xx-errors.md) | friction | NetSuite MCP connector (ns_createRecord, ns_updateRecord, ns_runCustomSuiteQL), CAPABILITIES.md | 30m | sometimes | . | julie | triaged |
| 3 | [During the Bixbi Pet SO Removed Line Log Use Case render, the brand Montserrat static font files at ../fonts/ ( Montserrat-Regular.ttf...](feedback/2026-09-02-montserrat-static-fonts-pdf-embedding.md) | bug | fonts/README.md | 45m | first-time | . | justin | new |
| 4 | [While authoring pc sl monthly sales channel.js (GW's "Monthly Sales by Channel" Suitelet), the file header claimed two things were "resolved while...](feedback/2026-09-21-deployed-script-not-tested-end-to-end.md) | bug | execution / custom-project (script authoring verification step) | 30m | first-time | . | justin | new |
| 5 | [SuiteApp configuration records are unreadable through the MCP connector, with a misleading error, because the permission that grants them sits on a...](feedback/2026-10-02-mcp-role-custom-record-entries-permission.md) | friction | CAPABILITIES.md MCP role guidance, CLAUDE.md session start step 5, customrole_pc_mcp_ai_connection role template | 30m | first-time | . | ron | new |
| 6 | [Two related failures in one run of customer-exec-summary , both rooted in the skill never checking its inputs before using them. 1. No connector...](feedback/2026-09-14-exec-summary-no-connector-preflight.md) | bug | .claude/skills/customer-exec-summary (generalizes to any multi-source skill) | 10m | sometimes | . | mike | new |
| 7 | [The Electric Blue hex value in POWERCLOUD BRAND GUIDELINES.md contains a Cyrillic capital DE (U+0414) where the hex digit D belongs. It is not a...](feedback/2026-09-15-brand-guidelines-electric-blue-cyrillic-char.md) | bug | POWERCLOUD_BRAND_GUIDELINES.md | - | every-time | . | mike | new |
| 8 | [Session goal was to rebuild a pre-sales pitch deck for a prospect in a structured partner selection: a one-hour presentation to the prospect's...](feedback/2026-09-15-no-engagement-type-for-pre-sales-pitch.md) | request | CLAUDE.md (Engagement types) + skills routing | - | every-time | . | mike | new |
| 9 | [The customer-exec-summary skill produces two artifacts: the internal draft in working/ and the rendered client-facing document in deliverables/ . It...](feedback/2026-09-17-exec-summary-no-covering-email-body.md) | request | .claude/skills/customer-exec-summary | - | every-time | . | mike | new |
| 10 | [The scheduled-tasks MCP tool ( create scheduled task / update scheduled task ) has no working-directory or cwd parameter in its schema. The only...](feedback/2026-09-17-scheduled-tasks-no-cwd-control.md) | bug | os / scheduled-tasks tool | - | every-time | . | justin | new |
| 11 | [Julie has been running multiple sessions under the MH Crane client folder (several short-lived ones alongside the long-running production-build...](feedback/2026-10-01-cross-session-checkpoint-debt-noise.md) | friction | session-memory (brief / checkpoint debt reporting) | - | every-time | . | julie | new |
| 12 | [The Monday time entries .json extract carries only trandate, hours, isbillable, employee name, customer name, customer id, project type, project...](feedback/2026-10-02-hours-to-asana-task-budget-vs-actual.md) | request | mike-trade-bot Monday dashboard pull (time_entries_*.json schema); customer-exec-summary | - | every-time | . | ron | new |
| 13 | [Rendering the Bixbi SO Removed Line Log FDD & TDD handover, a markdown table row containing PC \ SO Removed Line Log (the escaped pipe needed because...](feedback/2026-09-09-render-docx-escaped-pipe-bug.md) | bug | .claude/scripts/render_docx.py | 10m | first-time | . | justin | new |
| 14 | [Running the customer executive summary for Upward Projects, the routine pulled Brixton information into Upward's report. Justin Lombardi caught it...](feedback/2026-09-17-exec-summary-cross-client-data-bleed.md) | bug | customer-exec-summary | - | sometimes | . | justin | new |
| 15 | [The Monday time entries .json extract carries trandate, hours, isbillable, employee name, customer name, customer id, project type, project status...](feedback/2026-09-21-time-extract-missing-task-memo.md) | idea | mike-trade-bot Monday dashboard pull (time_entries_*.json schema) | - | first-time | . | justin | new |
| 16 | [Mid-session, Claude was asked to load the Hoists Chain and Hoists Manual item categories into NetSuite. The session's own prior checkpoint (and the...](feedback/2026-10-01-checkpoint-stale-after-compaction.md) | bug | session-memory (checkpoint vs. compaction) | - | first-time | . | julie | new |
| 17 | [A recurring weekly session (Tue 10/6, 12:00 CT) was adjourned after 4 minutes and rescheduled to Wed 10/7, 15:00 CT. Paco filed the 10/6 Gemini notes...](feedback/2026-10-08-paco-misfiles-rescheduled-meeting.md) | bug | Paco meeting filer (PACO.md) | 5m | first-time | . | imran | new |
| 18 | [In a long-running P9 session under Teppermans/Directed Putaway & AsIs Segregation/ , the session snapshot hook stopped appending to the raw capture...](feedback/2026-10-12-raw-session-capture-stopped-silently.md) | bug | session-memory (session_snapshot hook, .claude/hooks/pc_hooks.py) | - | first-time | . | ron | new |
| 19 | [The session brief on 2026-10-14 reported two capture errors on this machine: - 2026-10-13T08:09 Stop: 130 conversation entries read but no turns...](feedback/2026-10-14-capture-hook-no-turns-extracted.md) | bug | session-memory (session_snapshot hook, .claude/hooks/pc_hooks.py) | - | first-time | . | justin | new |

**Areas with more than one open item:** `session-memory (session_snapshot hook, .claude/hooks/pc_hooks.py)` (2). Worth reading together at
triage; entries that look unrelated often share one cause.

**Diagnostics** (asked only on expensive items, 14 of 19 open): 11 did the wrong thing, 3 were right but in the way. Autonomy: 0 expected it to ask first, 3 expected it to just act.

## Closed

| Item | Status | Disposition | From |
|---|---|---|---|
| [During a Julie-approved production load of about 95 list-record updates and 9 record creates (item naming codes and configuration, session b2eec997...](feedback/2026-10-05-write-gate-prompts-too-often-and-unclear.md) | shipped | 2026-10-06, shipped (Claude Code, OS-root session with Mike). Gate v5. Julie's once-per-day proposal landed... | julie |
| [Stamped GW/Monthly Sales Reporting/ as a nested custom-project folder from templates/client-record/ . The template's .claude/settings.json PreToolUse...](feedback/2026-09-01-nested-project-render-gate-hook-path.md) | shipped | 2026-09-21, shipped (Claude Code, session with Mike). Justin's diagnosis was right and the fix took his first... | justin |
