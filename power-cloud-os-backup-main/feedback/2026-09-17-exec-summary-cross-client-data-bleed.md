---
date: 2026-09-17
from: justin
source: Upward Projects
area: customer-exec-summary
type: bug
cost: "-"
blocking: no
frequency: sometimes
class: wrong
autonomy: n-a
status: new
---

## What happened

[Verified] Running the customer executive summary for Upward Projects, the routine pulled
**Brixton** information into Upward's report. Justin Lombardi caught it during review and said
that if he had not caught it, it would have been bad. He indicated he knows the cause but did
not state it on the call.

Reported on the Upward Bi-Weekly Internal Status call, 2026-09-17, around 00:11:29. Source notes:
`Upward Projects/source/Upward | Bi-Weekly Internal Status - 2026 09 17 09 29 EDT - Notes by Gemini`
(Drive id `1pwlwlsZ1Z-9UqnTeQZ--xk7y3TYyzqM8qvkl3GfPu58`).

**Why this ranks above an ordinary correctness bug:** the executive summary is a client-facing
deliverable, so this is one client's information reaching another client's report. It is a
confidentiality failure mode, not only a wrong-output one. It was caught by a human reading
carefully, which is not a control we can rely on. CLAUDE.md already forbids reading sibling
client folders during an engagement; this is the same boundary being crossed somewhere inside
the summary pipeline rather than by a session reading across folders.

## What I did instead

[Reported] Justin caught the contamination in review, excluded it, and flagged the routine as
needing a fix. The Upward report itself was not sent with Brixton content in it.

## Suggested fix

- [Reported] Justin: said he knows why it happened, cause not captured on the call. **Ask him
  before triage guesses.** That one question is worth more than everything below.
- [Inferred] Claude: three plausible shapes, none confirmed:
  - The customer-name match is too loose. The skill tells the reader to "search on short
    fragments and match loosely" because NetSuite job names drift, which is exactly the
    instruction that would pull a second client in on a partial match.
  - A source query (Asana, Gmail, Drive, or NetSuite `timebill`) was not constrained to the one
    customer, so a workspace-wide or mailbox-wide result set carried a neighbor's rows.
  - Scheduled or routine execution ran from a context where the client folder was ambiguous.
    Compare `2026-09-17-scheduled-tasks-no-cwd-control.md`, which may be the same root cause.
- [Inferred] Claude, independent of cause: the pipeline has **no cross-client contamination
  check** before a client-facing render. A cheap guard would be scanning the draft for any other
  client folder name at the workspace root and refusing the render on a hit, in the same spirit
  as the existing render gate for AI copy tells and British spellings.

## Disposition
