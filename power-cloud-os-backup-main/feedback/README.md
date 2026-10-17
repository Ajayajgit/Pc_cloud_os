# Feedback inbox

One file per item. Never a shared file everyone appends to, because two people writing the same file on a Google shared drive produces conflict copies.

**You do not write these by hand.** Say "log this as feedback" in any session, or type `/feedback`, and Claude writes the entry from what just happened. The format below is here so the index script and the triage pass have something stable to read, not because anyone is expected to type it.

## Entry format

Filename: `YYYY-MM-DD-short-slug.md`.

```markdown
---
date: 2026-08-22
from: mike
source: internal
area: rapid-assessment/05
type: friction
cost: 45m
blocking: no
frequency: every-time
class: in-the-way
autonomy: expected-ask
status: new
---

## What happened
...

## What I did instead
...

## Suggested fix
...
```

| Field | Values | Filled by |
|---|---|---|
| `date` | `YYYY-MM-DD` | Claude |
| `from` | first name | Claude, from the session |
| `source` | client folder name, or `internal` | Claude |
| `area` | skill, script, or reference file it touches; `os` if none | Claude |
| `type` | `friction`, `bug`, `idea`, `request` | Claude, confirmed by you |
| `cost` | time lost, e.g. `10m`, `2h`, or `-` | **asked** |
| `blocking` | `yes`, `no` | **asked** |
| `frequency` | `first-time`, `sometimes`, `every-time` | **asked** |
| `class` | `wrong` (it did the wrong thing) or `in-the-way` (right, but painful) | asked only when the item is expensive |
| `autonomy` | `expected-do`, `expected-ask`, `n-a` | asked only when the item is expensive |
| `status` | `new`, `triaged`, `doing`, `shipped`, `declined` | Claude at capture, you at triage |

`cost`, `blocking`, and `frequency` are the three Claude cannot infer, and they are how the whole folder gets ranked. `class` and `autonomy` are the diagnostic pair that sorts a correctness defect from a friction defect; they are only worth asking about when the item cost real time.

## Rules

- **Describe the friction, not the client's data.** The client's name is fine, root files already carry cross-client learnings. Account IDs, financials, and pain-point detail are not, because everyone with this drive reads root.
- **Evidence tiers apply.** What happened is `[Verified]` from the session. What the reporter thinks would fix it is `[Reported]`. What Claude proposes is `[Inferred]`. Keeping them apart is what stops triage from treating a plausible guess as a requirement.
- **This is an inbox, not a backlog.** An item leaves it by becoming a roadmap item, a punchlist line, a playbook entry, or a logged decline with a reason. Never by silent deletion.
- **`FEEDBACK.md` at the root is generated.** Rebuild it with `python .claude/scripts/build_feedback_index.py`. Do not hand-edit it.
