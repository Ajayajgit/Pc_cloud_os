---
date: 2026-10-02
from: julie
source: MH Crane
area: NetSuite MCP connector (ns_createRecord, ns_updateRecord, ns_runCustomSuiteQL), CAPABILITIES.md
type: friction
cost: 30m
blocking: no
frequency: sometimes
class: in-the-way
autonomy: n-a
status: triaged
---

## What happened
[Verified] During a 1,117-item assembly import in a client's production account (one BOM create and one item create per row, run one call at a time), the NetSuite MCP connector failed about 30 times with HTTP 500, HTTP 503 ("Service Unavailable") and "Connection closed". Failures hit BOM creates, item creates and even the read queries used to check state, and they came without a pattern: mostly single failures, occasionally two or three in a row (one BOM create needed three tries).

After every failure the session looked the record up in NetSuite before retrying, because a failed call might still have written something. In every case nothing had been written, so the retry went through against the BOM that already existed. The final counts matched the source exactly (no duplicate items, no orphan BOMs).

[Reported] Julie: the time estimate of about 60 extra calls, 20 to 30 minutes, "is about right". "We continue to have connector issues", so this is recurring, not a one-off.

## What I did instead
Verify-then-retry on every failure, which made each blip cost two to three extra calls instead of a clean run. The retry loop was manual, one call per turn, because writes run sequentially in this account (the parallel-write popup race, see CAPABILITIES.md).

[Reported] Julie: continuing to retry until it connected, on its own, was the right call. She did not want to be asked.

## Suggested fix
- [Reported] Julie: none offered. She was not sure how to classify it as wrong versus in the way.
- [Inferred] Claude: the connector errors may be related to the open registration gap (the connector id is not in the write-guardrail's connector list), but nothing observed proves that link. Worth Mike checking connector health and rate or timeout behavior before the next large batch.
- [Inferred] Claude: a small helper that, after a failed create, looks up the item or BOM and retries safely would turn the manual loop into one step, and keep the no-duplicates guarantee. It must not skip the lookup, and it does not weaken any write gate.
- [Inferred] Claude: the verify-before-retry practice is now recorded as an `[unreviewed]` CAPABILITIES.md entry so other sessions do it by default.

## Disposition
2026-10-02 (triage with Julie, MH Crane session):
- **Doctrine, done:** the verify-before-retry practice is already in `CAPABILITIES.md` as an `[unreviewed]` entry (2026-10-02), and the parallel-threads entry records the popup cost.
- **Punchlist line (for Mike, to add to `Internal/ROLLOUT_PUNCHLIST.md`):** before the next large MCP write batch, check connector health and register connector id `cf679a55-6cb4-4b61-aae4-90eb9ff6697b` as production in `.claude/hooks/ns_connectors.json`; see whether the 5xx errors and the per-write popups both stop. Claude cannot read or edit that file.
- **Roadmap idea (for Mike, to add to `Internal/POWERCLOUD_OS_ROADMAP.md`):** either a create-and-verify helper that looks a record up after a failed create and retries safely (must not weaken any write gate), or a standard CSV-import route for large uniform categories in the execution skill.
- Clustered with the connector registration gap (same area, possibly the same cause, unproven). Ranked: not blocking, recurring, 30 minutes per large load; below any blocking item. One reporter so far; Julie confirmed on 2026-10-02 that the errors continue.
- Written from a client session, so the `Internal/` files were not edited (scope gate); the two lines above are for Mike or an OS-root session to apply.
- 2026-10-06 (Mike, OS root): connector `cf679a55-6cb4-4b61-aae4-90eb9ff6697b` was registered as production on 2026-10-05. Registration changes only the prompt wording, never whether the gate prompts, so it was not the cause of the per-call popups (that was the per-agent transcript proof, fixed in gate v5; see the 2026-10-05 write-gate entry) and is unrelated to the 5xx errors, which remain open.
