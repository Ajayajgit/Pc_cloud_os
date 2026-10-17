---
date: 2026-10-01
from: julie
source: MH Crane
area: session-memory (brief / checkpoint debt reporting)
type: friction
cost: "-"
blocking: no
frequency: every-time
status: new
---

## What happened
[Verified] Julie has been running multiple sessions under the MH Crane client folder (several short-lived ones alongside the long-running production-build session). She's noticed that when she opens a new session, the session-start brief reports unresolved checkpoints and "checkpoint debt" that reads as if it belongs to the session she's currently in, when it actually originates from other, different sessions in the same client folder (e.g. raw capture files from sessions `2a04e8d9`, `b2eec997`, `521a3a33`, `10225709`, several of them very short, 2-6 turns). She flagged it as noise or confusing rather than something that has caused a wrong action so far: it isn't clear at a glance which reported debt is actually hers to act on right now versus leftover from an abandoned short session elsewhere in the folder.

This may be working as designed: CLAUDE.md's session-memory section says the brief is meant to surface the latest checkpoints and debt across the whole client folder, since several people/sessions share one folder's memory on purpose. But the result in practice, at least for a single consultant running several sessions against one client, is a brief that repeats old, possibly-abandoned debt every time, without a clear signal for "this is someone else's open thread" versus "this is actually stale and nobody is coming back for it."

## What I did instead
Nothing yet; flagged it during an unrelated feedback-logging conversation rather than working around it.

## Suggested fix
- [Reported] Julie: not sure, just flagging it as something to look into.
- [Inferred] Claude: possible directions for triage to weigh, none committed: distinguish short/abandoned raw-capture debt (a handful of turns, never checkpointed, likely a false start) from substantive debt in the brief's presentation; or let the brief label which session each piece of debt/checkpoint actually belongs to more prominently so it reads as "FYI, elsewhere" rather than "yours, now"; or a lightweight rule for when old debt stops being worth repeating in every new brief.

## Disposition
