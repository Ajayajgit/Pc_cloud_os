---
date: 2026-10-14
from: justin
source: Brixton
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

[Verified] The session brief on 2026-10-14 reported two capture errors on this machine:

- `2026-10-13T08:09 Stop: 130 conversation entries read but no turns extracted; the transcript format may have changed`
- `2026-10-13T08:11 SessionEnd: 130 conversation entries read but no turns extracted; the transcript format may have changed`

The hook read the transcript but extracted nothing from it, so that stretch of the 2026-10-13 session was not captured. Capture in the other Brixton sessions that week kept working (this session's metadata shows turns advancing through 2026-10-14). It appears to be specific to that transcript, not a total halt.

Distinct from `2026-10-12-raw-session-capture-stopped-silently`: there the hook stopped with no error at all. Here it reported an error but the cause is unknown.

## What I did instead

Wrote the checkpoint from live context in the current session. Nothing about the 2026-10-13 session was recovered.

## Suggested fix

- [Inferred] Claude: log which transcript entry types the hook saw in the failing session, since "130 entries, 0 turns" suggests a new entry shape (for example a changed user or assistant message wrapper after a Claude Code update) rather than an empty session.
- [Inferred] Claude: the brief could say which session the error belongs to, so the person can check it.

## Disposition
