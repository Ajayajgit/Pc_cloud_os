---
date: 2026-09-15
from: mike
source: Nation's Best Sports
area: CLAUDE.md (Engagement types) + skills routing
type: request
cost: -
blocking: no
frequency: every-time
class: in-the-way
autonomy: n-a
status: new
---

## What happened
[Verified] Session goal was to rebuild a pre-sales pitch deck for a prospect in a structured
partner selection: a one-hour presentation to the prospect's C-suite, explicitly not a demo and
not an RFP response, with the top two or three vendors advancing to discovery.

None of the three engagement types in CLAUDE.md fits. Rapid assessment / recovery, implementation,
and custom project all assume an existing customer and a signed or in-flight relationship. All
three ship deliverables this work does not produce (assessment document, execution plan, Use Case),
and none ships the one it does (a deck, alone, with no LOE and no commercial framing).

The consequences were concrete rather than theoretical:
- **No skill owns the work.** `rapid-assessment` owns "build the presentation deck," but its
  procedure is six stages of evidence mining and NetSuite MCP verification against a client
  account. There is no account here and no access, so the skill could not be run as written.
- **CONTEXT.md has no valid value** for `Engagement type`. Recorded it as
  `{pre-sales pitch, non-standard}` rather than force-fitting one of the three.
- **The deliverable naming convention does not cover it.** Used the Presentation pattern
  (`{Client}_Presentation_{YYYY-MM-DD}.pptx`) since it was the closest fit.
- **Checkpoints partially apply.** Checkpoint 3 (draft review) fit cleanly. Checkpoint 4 (LOE and
  commercial review) is inapplicable, since a pre-sales pitch in this format carries no hours.

Nothing was blocked. The work was completed by borrowing the pieces that transfer:
`WRITING_STANDARDS.md`, `POWERCLOUD_BRAND_GUIDELINES.md`, `QA_CHECKLIST.md`'s deck section, the
client-record stamp, and evidence tiers.

Worth noting what the OS *did* carry well here even without a type: the source-attribution rule in
`WRITING_STANDARDS.md` ("No overreach; attribute the source") was the single most valuable thing in
the session. The prior deck had adopted a third-party selection consultant's opinions about the
prospect as though the prospect shared them. That rule is what caught it.

## What I did instead
Ran it as an ad-hoc workflow. Stamped the client record normally, wrote CONTEXT.md, evidence log
and candidate register by hand rather than via a skill, and pulled the deck standards from the root
reference files directly. Recorded the type as non-standard in CONTEXT.md with a pointer to this
entry.

## Suggested fix
- [Reported] Mike: not specified; agreed it was worth logging when Claude raised it.
- [Inferred] Claude, three options, roughly in increasing cost:
  - **Do nothing, document the gap.** Add a line to CLAUDE.md's Engagement types section saying
    pre-sales work is out of scope for the three types and is run ad hoc from the root reference
    files. Cheapest, and honest; sales-stage work may not be worth systematizing.
  - **Add a `pre-sales` commercial posture rather than a fourth type.** Posture is already a
    separate axis from type (`pre-agreement` / `under agreement`). A `pre-sales` posture on an
    unassigned type would legitimize the CONTEXT.md value and let checkpoint 4 switch off cleanly,
    without a new skill.
  - **A fourth type with a thin skill,** in the shape of `custom-project` (which is already thin
    by design): folder stamp, what discovery means with no system access, the deck as the sole
    deliverable, and the rule that public research substitutes for MCP verification. Most work,
    and only worth it if Power Cloud does enough competitive pitches for it to pay back.
- [Inferred] Claude, one observation that may matter more than the fix: with no account access,
  **the client's public website was the only verifiable source in the engagement.** Everything else
  was second-hand through an intermediary. The existing rule that business-overview research is
  required, not optional, turned out to carry far more weight here than it does on a normal
  engagement, and it produced a factual correction to the prior deck plus five business lines the
  intermediary never mentioned. Any pre-sales path should make that step mandatory and early.

## Disposition
