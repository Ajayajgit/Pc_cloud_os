---
date: 2026-09-24
who: mike
session: 22326001-904d-4bbc-aad2-53fd9ab78fc9
covers_through: 3
raw: raw/2026-09-24_mpfly_22326001.md
---

## What this session was about
Designed, reviewed and built shared session memory for the OS: several people and machines per
folder, sessions running out of context. Plan, Codex review and results are in `tasks/todo.md`
("Shared session memory"). This session started before its own hooks existed; its raw file was
backfilled by hand through turn 3.

## Decisions
- **decided** (Mike): three layers: model-free raw capture by hooks, checkpoints by the
  session-memory skill, and a SessionStart brief that reports checkpoint debt.
  Why: capture must not depend on a person remembering or on a lossy compaction summary.
- **decided** (Mike, D1): OS-root sessions write to `Internal/sessions/`. Why: they carry strategy
  (MSP, pricing, portal). Rejected: root `sessions/`, readable by every consultant.
- **decided** (Mike, D2): an asking gate on auto-memory writes. Rejected: a hard block (too blunt for
  personal preferences), and prose only (a reminder, not enforcement).
- **decided** (Mike, D3): redacted raw capture, excluded from the GitHub backup. Rejected:
  checkpoints only (a session that dies before a checkpoint is lost).
- **decided** (Mike, D4): migrate the ten OS project memories to the shared folder now.
- **decided** (Mike): capture after every reply. Why: measured at about 150 ms and zero tokens,
  small next to the scope gate's per-tool-call cost. Rejected: a local buffer flushed at
  compaction or session end, which strands the last stretch on one laptop.
- **decided** (Claude, within the approved plan): client sessions write to `working/sessions/`, not a
  new top-level folder, so the record layout is unchanged.

## Open threads
- T3 (close the desktop app mid-turn), T4 (second machine or teammate), T5 (are Compact instructions honored): Mike.
- Does auto mode resolve a hook's "ask" without a prompt? It would affect every gate: test in an interactive session.
- Test artifacts in `44 Pro - AI Summit Test/working/sessions/` and `Internal/sessions/raw/*eea9dddf*` will show as debt: distill or archive.

## Next step
- Open a fresh desktop session in `44 Pro - AI Summit Test`, confirm the brief appears, then run T3 and T4.

## Promoted
- `tasks/todo.md` (plan, Codex review, review section), `tasks/lessons.md` (2026-09-24),
  `CAPABILITIES.md` (five `[unreviewed]` entries), `.claude/skills/CHANGELOG.md`, CLAUDE.md, ONBOARDING.md.
