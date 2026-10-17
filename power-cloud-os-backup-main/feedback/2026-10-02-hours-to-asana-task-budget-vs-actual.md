---
date: 2026-10-02
from: ron
source: Foundrae
area: mike-trade-bot Monday dashboard pull (time_entries_*.json schema); customer-exec-summary
type: request
cost: -
blocking: no
frequency: every-time
status: new
---

## What happened

[Verified] The Monday `time_entries_*.json` extract carries only
`trandate, hours, isbillable, employee_name, customer_name, customer_id, project_type,
project_status`. It has no `memo` and no service item, so logged hours cannot be attributed to a
workstream, a work item, or an Asana task.

[Verified] The grain is not the problem. The extract is at individual time-entry level, not
pre-aggregated: FoundRae's 2026-09-27 file holds 132 rows across 86 employee-day combinations, and
27 of those days carry several entries. Sachin Dubey on 11 August is five separate rows (2, 2, 1, 1,
1 hours) that are byte-identical apart from the hours. The consultant split the time correctly in
NetSuite. The association was collected and then dropped in transit.

[Verified] This degraded two FoundRae deliverables. The 2026-09-14 executive summary had to state
that hours could be attributed by person but not by workstream, and that an undocumented workstream
would not surface in the run. The same limitation recurred building the 2026-10-01 resourcing brief,
where hours by person carried the argument but hours by work item would have carried it better.

[Verified] Corroborates `2026-09-21-time-extract-missing-task-memo.md` (Justin, Upward Projects),
logged there as `frequency: first-time`. Two independent consultants, two unrelated clients, two
weeks apart. That entry's frequency field now understates it and triage should treat these as one
cluster.

## What I did instead

Reported hours by resource and by week only, and said plainly in both documents that workstream
attribution was unavailable and why. On Upward, Justin ran the richer `timebill` SuiteQL manually on
a day a live Power Cloud NetSuite connector happened to be attached, which is not a repeatable path.

## Suggested fix

- [Reported] Ron: the near-term fix is adding `memo` and the service item to the extract schema. The
  longer-term opportunity is larger and is the reason for logging this separately: **tie a specific
  Asana task to its counterpart accounting and billing task, so budget versus actual is visible per
  work item, transparent to Power Cloud and to the client.** That turns the hours feed from a
  reporting input into a commercial instrument, and it is the same structure Ron is setting up by
  hand on Bomb Party, where every hour is meant to tie to a billing code for a work item defined in
  the SOW. Ron has sent Mike Flynn questions on the direction of this, so there may be a parallel
  thread to reconcile at triage.
- [Reported] Justin (2026-09-21): add task name / memo and item to the Monday extract so per-task
  reporting runs off the cached file without depending on a live connector.
- [Inferred] Claude: the two are sequential rather than alternative. Carrying `memo` and item closes
  the reporting gap and removes the "NetSuite connector unavailable" degrade path that has appeared
  in every exec-summary run so far. The Asana-to-billing-task linkage is a separate piece of work
  that needs a shared key, and the extract carrying the service item is probably its first
  prerequisite rather than a competing approach.
- [Inferred] Claude: worth noting for triage that nothing here is a NetSuite limitation.
  `timebill` already holds `memo` and `BUILTIN.DF(tb.item)`, verified 2026-09-14 against Power
  Cloud's own account. The data exists; only the pipeline drops it.

## Disposition
