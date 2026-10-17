---
date: 2026-10-01
from: julie
source: MH Crane
area: session-memory (checkpoint vs. compaction)
type: bug
cost: "-"
blocking: no
frequency: first-time
class: wrong
autonomy: expected-do
status: new
---

## What happened
[Verified] Mid-session, Claude was asked to load the Hoists Chain and Hoists Manual item categories into NetSuite. The session's own prior checkpoint (and the session-start brief) stated these categories were "not yet imported." That claim was false: 543 items and their BOMs had already been fully built earlier in this same session, before a context compaction. The compaction wiped the completed work from visible context, and neither the compaction summary nor the written checkpoint file caught that the work had actually happened, so the stale "not done" claim carried forward as if it were current. Claude built full create payloads for all 543 items and was about to issue the first `ns_createRecord` call for a duplicate batch in production NetSuite. It was caught only because of an unrelated, pre-existing habit (checking for itemid collisions against live NetSuite before any create batch, per the "look up IDs before load" rule) - nothing in the session-memory system itself flagged the staleness.

Contained this time (543 items, caught before any write), but Julie noted duplicate items would have been a real problem, and the exposure scales with batch size: a larger or less lucky batch would have cost real cleanup time.

## What I did instead
Verified every itemid against live NetSuite before creating anything, discovered 543 of 544 items already existed and fully built, stopped, and corrected course: backfilled the Excel's NetSuite Internal ID column against the live records instead of creating duplicates, and wrote up the correction in `production_tasks.md` and the session checkpoint.

## Suggested fix
- [Reported] Julie: not sure, leave it to Mike and the AI engineer to figure out the right fix at triage.
- [Inferred] Claude: two directions were offered and neither was picked outright (Julie chose "something else / not sure"): (1) treat a checkpoint's "not yet done" claims about live system state as a planning aid, not a source of truth, and lean harder on verify-before-write habits rather than changing the skill; or (2) change the compaction process so a checkpoint is forced or strongly offered immediately before compaction happens, so completed-but-uncommitted work can't silently fall out of the session's own record. Worth considering together rather than either/or: habit reinforcement only works if the checkpoint-stale scenario doesn't recur; a pre-compaction checkpoint would reduce how often it can recur in the first place.

## Disposition
