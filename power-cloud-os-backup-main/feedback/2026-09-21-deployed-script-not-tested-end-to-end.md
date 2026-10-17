---
date: 2026-09-21
from: justin
source: GW
area: execution / custom-project (script authoring verification step)
type: bug
cost: 30m
blocking: no
frequency: first-time
class: wrong
autonomy: expected-do
status: new
---

## What happened
[Verified] While authoring `pc_sl_monthly_sales_channel.js` (GW's "Monthly Sales by
Channel" Suitelet), the file header claimed two things were "resolved while authoring
(verified against the account via SuiteQL)": the transaction-type filter and the
itemtype filter field names. Both of those checks were real, but they only confirmed
that individual referenced fields/tables existed and carried the expected values in
isolation. The composed query as a whole, and the deployed Suitelet itself, were never
actually run end-to-end before the task was marked done and deployed to sandbox.

Justin loaded the deployed Suitelet in sandbox and it threw "Search error occurred:
Invalid or unsupported search." Root cause, found only by then running the composed SQL
directly against the account: `BUILTIN.FISCAL_MONTH_PERIOD(t.trandate)` is not a real
SuiteQL function (fabricated during authoring, never checked against Oracle's docs or a
live query), and `transactionline.itemid` does not exist as a column (the old NSAW/ORDS
warehouse-view schema exposed a flat text item code that way; NetSuite's native schema
puts it on `item.itemid` instead, reachable only via a join). Neither bug would have
survived actually running the query once.

## What I did instead
Reproduced both errors in isolation via direct SuiteQL against GW sandbox (through the
NetSuite MCP connector), root-caused each one, fixed the script (`BUILTIN.DF(t.postingperiod)`
in place of the fake function; `LEFT JOIN item i ON i.id = tl.item` plus `i.itemid` in
place of the nonexistent column), validated, and redeployed to sandbox from the isolated
SDF project. Confirmed the composed query returns real rows before handing back to Justin
to retest in the browser.

## Suggested fix
- [Reported] Justin: "worth noting - this was not checked and gave me an error until I
  checked it" — log it as feedback to verify when creating deployments that should be
  active.
- [Inferred] Claude: after deploying any script meant to actually load/run (Suitelet,
  Scheduled Script, RESTlet, etc.), invoke it end-to-end (or at minimum its core
  query/logic, e.g. via direct SuiteQL for a SuiteQL-heavy script) before calling the task
  done or reporting fields/logic as "verified." Spot-checking that referenced tables/columns
  exist in isolation is not the same claim as the composed logic actually running, and
  authoring-stage confidence language ("verified," "resolved") should be reserved for the
  latter. This likely belongs as an explicit step in the execution skill's per-task loop
  (between sandbox deploy and calling a build task complete), not just consultant judgment.

## Disposition
