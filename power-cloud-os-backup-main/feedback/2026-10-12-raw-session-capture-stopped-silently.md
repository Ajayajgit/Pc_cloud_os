---
date: 2026-10-12
from: ron
source: Teppermans
area: session-memory (session_snapshot hook, .claude/hooks/pc_hooks.py)
type: bug
cost: "-"
blocking: no
frequency: first-time
class: wrong
autonomy: n-a
status: new
---

## What happened

[Verified] In a long-running P9 session under
`Teppermans/Directed Putaway & AsIs Segregation/`, the `session_snapshot` hook **stopped appending
to the raw capture file and never resumed.** The metadata froze:

```json
{ "session": "1f111d4c-d92f-48f3-869b-33a290187845",
  "turns": 24, "last_capture": "2026-10-09T10:09:28" }
```

By 2026-10-12 the session had run many more turns across three calendar days, and `turns` was still
24. Nothing errored, nothing appeared in the session brief as a capture error, and the brief kept
reporting the same stale checkpoint debt because no new turns were being recorded to be in debt
about.

**What was not captured:** a full production verification pass against NetSuite, analysis of a
client meeting on 2026-10-09 at which the engagement was unexpectedly revived, research into
Advanced Item Location Configuration and ABC velocity including two corrections to earlier findings,
and four LOE-gating data questions answered by query. Several days of substantive work.

This is distinct from the two existing session-memory entries. `2026-10-01-cross-session-checkpoint-debt-noise`
is about how the brief *presents* debt; `2026-10-01-checkpoint-stale-after-compaction` is about a
checkpoint's *content* going stale after compaction. This one is the capture mechanism itself
halting.

**Why it matters more than the zero time cost suggests.** CLAUDE.md documents the snapshot hook as
failing open, which is right for a single turn. Failing open silently for three days is a different
thing, because the scenario raw capture exists to protect against is exactly a session that ends or
compacts without anyone writing a checkpoint. Here a checkpoint happened to be requested, so nothing
was lost. Had it not been, the only record of that work would have been gone.

## What I did instead

Noticed the frozen metadata while preparing a checkpoint, wrote the checkpoint entirely from live
context, and added a `capture_note:` line to the checkpoint frontmatter recording that raw capture
stalled at turn 24 and that everything after is from live context only. No work was lost.

## Suggested fix

- [Reported] Ron: not discussed, logged at Claude's offer.
- [Inferred] Claude, roughly ascending effort:
  - **Make the stall visible.** The session brief already reports capture errors. It could also
    compare `last_capture` against the session's actual age and say so when capture has gone quiet
    for an implausibly long stretch. Cheapest change, and it turns a silent failure into a visible
    one without touching the hook.
  - **Find out why it stopped.** Worth checking whether the hook errored once and was disabled, hit
    a file lock on the shared Drive, or failed on a path. The raw file is on a Google shared drive,
    which is a plausible source of transient write failures, and a hook that fails open will swallow
    them.
  - **Offer a checkpoint when capture has gone quiet.** If the brief can detect the stall, the
    natural response is to prompt for a checkpoint, since that is the only remaining record.

## Disposition
