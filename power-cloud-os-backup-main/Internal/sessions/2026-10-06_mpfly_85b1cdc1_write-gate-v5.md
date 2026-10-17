---
date: 2026-10-06
who: mike
session: 85b1cdc1-5b54-4b54-ad92-be830a0690a5
covers_through: 12
raw: raw/2026-10-06_mpfly_85b1cdc1.md
distilled_by: claude (session 88c67b4c, 2026-10-12, from the raw file)
---

## What this session was about
Julie's MH Crane imports (BOM revisions, items) were hitting a permission prompt on every write and auto-mode denials ("[Auto-Mode Bypass]", "[Security Weaken]"). Mike asked to loosen the permissions. Diagnosed both layers, rewrote the NetSuite production write gate as v5, had Codex review it, installed it.

## Decisions
- **decided** (Mike): approval scope is one approval per session per NetSuite connection, covering creates and updates of every record type, from the main conversation and every subagent, sliding 24 hours after the latest successful write. Why: v4 keyed on record type and read proof only from the calling transcript; each subagent has its own transcript (verified on disk), so parallel agents prompted on every call, and a task touching eight record types prompted eight times. Julie reported clicking "allow once" blindly, which defeats the gate. Rejected: keeping per-record-type scope with only the cross-agent fix; a session with no time limit.
- **decided** (Mike): deletes may not prompt per record either. Implemented as a separate once-per-session approval per connection, so a session's first delete still gets a human look. Why: Mike's words, "delete cannot be every record"; the separate bucket was Claude's conservative reading and Mike approved installing it over the alternative of one shared approval.
- **decided** (Mike): Codex second opinion before installing; adopted findings: fail to "ask" on any hook error, timeout or malformed input (a crashed hook is ignored and an allow rule would then let a production write through); only the registry can make a connector a sandbox, names no longer count; strict evidence matching (string ids, assistant/user roles, `is_error` absent or exactly false, one result per id); future-dated and naive timestamps rejected; prompt leads with the breadth of what is approved. Declined: a trusted approval broker, a persisted scan cache, a fresh-consent boundary for v4-era approvals. Reservation recorded in the hook docstring: transcripts are not authenticated proof, so this is a guard against accidental and unreviewed writes, not against deliberate forgery; the read-only NetSuite role on discovery connections remains the hard guarantee.
- **decided** (Mike): install now. Installed `.claude/hooks/block-netsuite-writes.py` (v4 kept as `.bak-2026-10-06`), tests in `.claude/hooks/test_write_gate.py` running inside `test_hooks.py` (77 pass). Takes effect from each consultant's next session; the stamp did not change, so no re-stamp.

- **decided** (Mike): a production account that has not gone live needs no more protection than a sandbox, expressed as a binary status, not a go-live date. Why: dates slip and move. Rejected: a `go_live` date in the registry that flips automatically (Claude's proposal). Implemented as `status: pre-go-live` on a prod registry entry: creates and updates flow like sandbox, deletes keep the once-per-session prompt (nothing refreshes a pre-go-live account), any other value means live. MH Crane marked pre-go-live; flip at go-live (execution skill step 5, CONTEXT.md `Account status`). 81 tests pass.
- **noted**: the auto-mode classifier blocked the pre-go-live edit from this session with no reason given; Mike switched the session out of auto mode and it went through. Same wall Julie hit.

## Findings worth keeping (already promoted)
- Registering connector `cf679a55-...` as production (done 2026-10-05) changes only the prompt wording; it was never the cause of the popups.
- The auto-mode classifier is a separate layer that evaluates every call regardless of hooks or allow rules, and after one denial treats retries through agents, scripts or later turns as a bypass. Import sessions should run in the default permission mode. Operating rule: first production write of a session alone from the main chat, then parallel agents are covered.
- Julie's allow rule for `ns_createRecord` sits in MH Crane's shared `.claude/settings.json`, not `settings.local.json`; a future re-stamp would overwrite it. It is not needed for the gate to work in default mode.

- **decided** (Mike, turn 9, distilled: "Yes, add it to PROMPT_PATTERNS.md"): a **Sessions** section, patterns 13 to 18, added to `PROMPT_PATTERNS.md`: start a new session when the work changes shape (never two clients, never discovery and execution in one); one permission mode per session, default mode for writes; a compaction means the session is overdue; restart after settings or connector changes; leave by checkpointing and arrive by reading the brief, naming the session, picking the mode and confirming the account; leave a session that is fighting you.
- Guidance given, not a decision (turns 6 to 12): a ten-minute test script for Julie (create without a prompt, a parallel batch, one delete prompt, an update); she does not need to restart her long session because the hook launcher re-reads the gate script and connector registry on every call while only the settings file is cached at session start; a conversational summary of both causes (the narrow gate, auto mode's own classifier) and of the compaction near-miss; her "a new field re-prompts" observation explained by record-type and create-versus-update buckets, failed first writes, agents and the two-hour window, all but the failed-first-write case removed by gate v5.
## Open threads
- First live run of gate v5 on MH Crane (one create alone, then a parallel batch, then a delete): Julie, with Mike told the result. Logged on `Internal/ROLLOUT_PUNCHLIST.md`.
- Read-only NetSuite role on discovery connections: still the owed hard guarantee (punchlist).
- Checkpoint debt from 2026-09-24 (two raw files, one turn each) was reported by the brief and not distilled this session.

- Julie's test results against gate v5 (one create, a parallel batch, one delete prompt, an update), and whether the first delete prompt read well.
- Known residual on a live account: a failed first write leaves no proof, so the retry asks once more; told to Julie so it does not read as a bug.
## Next step
- Tell Julie: open a fresh MH Crane session in the default permission mode. Creates and updates no longer prompt at all (pre-go-live); the first delete of a session asks once. Parallel agents are fine.

## Promoted
- CAPABILITIES.md, NetSuite MCP section: 2026-10-06 entry correcting the race and registration theories, recording v5, the auto-mode layer, and the pre-go-live status.
- `.claude/hooks/ns_connectors.json`: MH Crane entry marked pre-go-live. `templates/client-record/CONTEXT.md`: `Account status` line. `MH Crane/CONTEXT.md`: Account status pre-go-live (2026-10-06, Mike).
- CLAUDE.md: write guardrail description updated to once per session per connection.
- `.claude/skills/execution/SKILL.md`: operating rule next to the MCP data-write line.
- `feedback/2026-10-05-write-gate-prompts-too-often-and-unclear.md` shipped; `feedback/2026-10-02-mcp-connector-intermittent-5xx-errors.md` disposition note; FEEDBACK.md rebuilt.
- `tasks/lessons.md`: 2026-10-06 entry (loosen a gate uniformly; hooks on write tools fail to ask; inspect a real transcript before writing a matcher).
- `tasks/todo.md`: write gate v5 section with review.
- `Internal/ROLLOUT_PUNCHLIST.md`: live-test item updated to v5.
- Codex review text saved at `Internal/sessions/raw/2026-10-06_codex-review_write-gate-v5.txt`.
