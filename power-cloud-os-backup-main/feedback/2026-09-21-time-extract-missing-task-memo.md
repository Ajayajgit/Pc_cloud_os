---
date: 2026-09-21
from: justin
source: Upward Projects
area: mike-trade-bot Monday dashboard pull (time_entries_*.json schema)
type: idea
cost: -
blocking: no
frequency: first-time
status: new
---

## What happened
[Verified] The Monday `time_entries_*.json` extract carries `trandate, hours, isbillable, employee_name, customer_name, customer_id, project_type, project_status` but no task/memo or item field, so it cannot support per-task hour reporting as cached. This surfaced on Upward Projects: Chris Watts (client CFO contact) asked for a cumulative per-task hours pivot, and building it required a live NetSuite MCP connection to Power Cloud's own account to run the richer `timebill` SuiteQL query directly (with `memo` and `BUILTIN.DF(tb.item)`), a connector that has not been reliably available in scheduled/headless sessions.

## What I did instead
Ran the SuiteQL query manually when a live connector happened to be available (2026-09-17) to build a one-off cumulative pivot. No automated, repeatable path exists today, and Employee Center (the role most consultants use) has no automated-email report option, so any recurring task-level report would need to be built and sent by hand unless the source data carries the task association.

## Suggested fix
- [Reported] Justin: add task name / memo (and item) to the Monday extract schema, so per-task reporting can run off the cached file without depending on a live NetSuite MCP connector each time. Not urgent, no time lost so far; flagged because this is likely to recur, both for Upward's own standing ask and, guessing, for other clients' consultants who get asked for task-level breakdowns.
- [Inferred] Claude: this would also remove the "NetSuite connector unavailable" degrade path noted repeatedly in the Upward exec-summary runs (2026-09-14, 2026-09-17, 2026-09-21), since the cached extract would become sufficient for task-level detail on its own.

## Disposition
