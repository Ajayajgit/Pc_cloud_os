---
date: 2026-09-24
who: mike
session: eea9dddf-84e7-4dc7-9713-aa0fec862429
covers_through: 1
raw: raw/2026-09-24_mpfly_eea9dddf.md
distilled_by: claude (session 85b1cdc1, with Mike, 2026-10-06)
---

## What this session was about
Test T7 of the shared session-memory rollout (see `2026-09-24_mpfly_22326001_shared-session-memory.md`): a non-interactive `claude -p` run from the OS root was told to write one word into this machine's auto-memory folder, to see whether the memory gate fires.

## Decisions
- None. A test run, no human decision taken in it.

## Findings
- The memory gate fired and the write did not happen. In a non-interactive run the hook's "ask" surfaced as an error returned to the model, with no prompt shown, and the model did not retry. The gate message read as intended (auto-memory is for facts about the person; project knowledge goes to the shared folder).
- Two unrelated notices at session start: about 49 claude.ai connectors needed sign-in on that machine, and the "claude.ai Power Cloud Netsuite" connector failed with HTTP 429.

## Open threads
- None. T7 was recorded as passing in `tasks/todo.md` the same day.

## Next step
- None owed.

## Promoted
- none (the T7 result already lives in `tasks/todo.md`, 2026-09-24 review section)
