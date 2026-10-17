---
date: 2026-09-14
from: mike
source: Bixbi
area: .claude/skills/customer-exec-summary (generalizes to any multi-source skill)
type: bug
cost: 10m
blocking: no
frequency: sometimes
class: wrong
autonomy: n-a
status: new
---

## What happened

[Verified] Two related failures in one run of `customer-exec-summary`, both rooted in the skill
never checking its inputs before using them.

**1. No connector preflight, so a partial run was only discovered at the end.** The skill gathered
NetSuite hours, Gmail, Drive, meeting notes and project files to completion before reporting that
no Asana connector was attached. Asana has no fallback and it carries the cross-reference, which is
the stated reason the document exists. The internal draft was written around the hole (section 2
carried Sep 11 figures forward, tiered to that date), presented, then the connector was attached
and the whole run repeated. The re-run corrected two figures the stale carry-forward had wrong:
open task count (8, not 9) and the previous run's headline finding, which had already been resolved
in Asana 90 minutes after that run was written.

**2. Connected is not the same as scoped correctly, and this one nearly shipped a false finding.**
Gmail was attached and healthy, and returned zero client threads across 21- and 45-day passes. The
draft-in-progress line was "no substantive correspondence in the period," which reads as a client
going quiet. It was wrong: the correspondence exists, it is in the delivery consultant's mailbox,
and the connected account was Mike's. A connector-presence check would have shown Gmail green and
caught nothing. Same exposure on Calendar, which returned empty for the same reason.

The second failure is `class: wrong` rather than in-the-way. The first is in-the-way on its own,
but it is what left the run dependent on stale carried-forward data, so they are logged together.

Marked `sometimes` rather than `first-time` because sessions starting under-connected is a regular
occurrence (Mike, 2026-09-14). The scope half is effectively `every-time` on any client where the
connected mailbox is not the delivery consultant's, which is most of them.

## What I did instead

Delivered the partial internal draft with the Asana gap named and tiered to its real as-of date,
then re-ran the whole gather once the connector was attached. Wrote "not auditable from this
session" for Gmail instead of the absence claim.

Fixed in-session: `customer-exec-summary` now opens with a two-pass **Preflight**. Pass 1 checks
connector presence via `mcp__ccd_connectors__session_connectors_status` (with a fallback to reading
the session tool list, since that tool is the desktop app's) against a per-source table of
stop-versus-degrade. Pass 2 runs after `CONTEXT.md` and checks scope: whose Gmail mailbox, which
NetSuite account, whose calendar. Supporting edits to the NetSuite, Gmail and closing sections.
`CHANGELOG.md` line added.

## Suggested fix

- [Reported] Mike: logged after the fix was applied; no separate fix proposed.
- [Inferred] Claude: the skill-local fix is done. **The open question is whether this generalizes.**
  Every skill that reads several systems has the same exposure, and the scope half of it is
  invisible to any connector check. Three ways it could go: (a) leave it skill-local and let each
  multi-source skill grow its own preflight when it bites; (b) a shared preflight block in
  `CLAUDE.md` or a small reference file that skills point at, so the stop-versus-degrade table and
  the identity checks are written once; (c) a script that reports connector presence plus scope
  (connected Gmail address, NetSuite account id) that any skill can call in one line. (c) is the
  only one that makes the scope check cheap enough that skills will actually do it, but it is also
  the most work. Not sure, and worth deciding at triage with the whole folder in view rather than
  from this one incident.

## Disposition
