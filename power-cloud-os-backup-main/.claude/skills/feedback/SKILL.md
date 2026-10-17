---
name: feedback
description: Capture feedback about the Power Cloud OS itself (friction, bugs, ideas, feature requests) into the root feedback/ inbox, and triage what has collected there. Use when the user says "log this as feedback", "add this to the feedback file", "file a bug", "feature request", "that was annoying", "this keeps breaking", "this should have worked", or types /feedback. Also use for "triage the feedback", "what feedback has come in", or "review the feedback folder". This is for feedback about the tooling and process, not about a client's NetSuite account.
---

# Feedback

Two jobs in one skill, because they share a format and serve the same loop: **capture** (anyone, mid-session, in seconds) and **triage** (Mike and the AI engineer, periodically, over the whole folder).

The inbox is `feedback/` at the workspace root, one file per entry. From a client subfolder that is `../feedback/`. Format and field meanings are in `../feedback/README.md`.

**What belongs here:** anything about the OS itself. A skill that did the wrong thing, a step that wasted time, a rule that is wrong, a missing capability, an idea for the portal. **What does not:** anything about a client's NetSuite account or engagement, which belongs in that client's own files, and NetSuite or process knowledge, which belongs in the retro's learnings triage.

---

## Mode 1: capture

### The governing constraint

The people most worth hearing from are the ones who hit friction, worked around it, and moved on. They are mid-task and irritated. **If this costs two minutes, they will skip it, and the folder fills up with entries from the two people who were going to tell you anyway.** Target the whole interaction at fifteen seconds.

That is achievable because you already know most of the answer. Harvest, then confirm. Do not interview.

### Step 1: harvest the session

Before asking anything, reconstruct the entry from context you already have:

- **What they were trying to do**: the task in play, not the symptom.
- **What happened instead**: the actual failure, error, or wrong output.
- **What they did about it**: the correction, retry, workaround, or abandonment.
- **`area`**: which skill, stage, script, or reference file is implicated. Be specific (`rapid-assessment/05`, `render_pptx.py`, `CLAUDE.md read-only rule`) rather than vague.
- **`source`**: the client folder this happened in, or `internal`.
- **`from`**: whose session this is.
- **`type`**: `friction`, `bug`, `idea`, or `request`.

If `/feedback` arrived with text after it, that text is the seed. Use it as the complaint and still harvest around it.

If there is no session context to mine, which is normally the case for an idea someone walked in with, skip to step 2 and ask what happened in one question.

### Step 2: read it back, and ask the three

Show the drafted entry in three or four lines, then ask the only things you cannot infer. Ask them together, not as a sequence of prompts:

1. **How much time did it cost, and were you blocked or just annoyed?**
2. **First time, or does it happen every time?**

That is the whole required interaction. Correct the draft from whatever they say and write the file.

### Step 3: the expensive-item branch

**Gate on the answer to the cost question.** If it cost under about fifteen minutes, is not blocking, and is a first occurrence: write the file and get out of the way. Say nothing else.

If it cost real time, is recurring, or blocked them, this entry is going to get worked, and their context is about to evaporate. Spend a few more seconds:

**The diagnostic pair.** Both are one word to answer and they sort the folder better than any solution guess.

- **Was it wrong, or right but in the way?** (`class: wrong` vs `class: in-the-way`.) A correctness defect and a friction defect get fixed in different places by different people.
- **Did you expect it to just do the thing, or expect it to ask you first?** (`autonomy: expected-do` vs `expected-ask`.) A capability gap and an autonomy miscalibration look identical in a complaint and have opposite fixes.

**Then the this-versus-that, drawn from the real system.** You know which stage ran and what the file actually says, so make the options concrete and name the real mechanism:

> Two ways this could go: the check moves earlier into stage 02 so you find out before drafting, or the skill just does it and tells you after. Or something else, or leave it with me.

Rules for this question:
- **At most three named options.** More is a survey.
- **Always offer "something else" and "not sure, you figure it out",** and mean the second one. Most reporters know the symptom and not the fix; forcing a pick manufactures a signal that triage will later trust.
- **Never propose a fix that weakens a hard rule** (read-only during discovery, human gates, evidence tiers, LOE human ownership). If the friction *is* one of those rules, log it as a rule complaint and say plainly that the rule is deliberate and the fix has to preserve it.

### Step 4: write the file

`../feedback/YYYY-MM-DD-short-slug.md`, slug drawn from the complaint (`render-gate-blocks-approved-draft`, not `problem-1`). If that filename exists, add `-2`.

Fill the frontmatter per `../feedback/README.md`. Body:

```markdown
## What happened
[Verified] {what the session shows: the task, the failure, the workaround}

## What I did instead
{their workaround, or "abandoned it"}

## Suggested fix
- [Reported] {name}: {what they said would fix it, or "not sure"}
- [Inferred] Claude: {the options offered, one line each}

## Disposition
{left empty at capture; triage fills it}
```

**Keep the tiers honest.** Observed behavior is `[Verified]` because the session is the evidence. Everything about what would fix it is `[Reported]` or `[Inferred]`, never `[Verified]`. This is the same discipline as the assessment workflow and it exists here for the same reason: to stop a tired 4pm guess from reading later as a requirement.

Then rebuild the index:

```
python "../.claude/scripts/build_feedback_index.py"
```

Confirm in one line: what was logged, where, and the rank it landed at. Do not summarize the entry back at them.

### Offering unprompted

CLAUDE.md carries the standing instruction to offer this when friction shows up. When you offer, **offer once, in one line, and take no for an answer.** Signals worth offering on: the same correction given twice in a session, a skill step that failed outright, a render or script that broke, a documented path that did not resolve, or an explicit expression of annoyance. Do not offer on a normal iteration or a routine correction, and never write an entry without being asked or agreed to.

---

## Mode 2: triage

Run when the user asks to triage, review, or clear the feedback folder. This is where the real thinking happens, because **capture-time solution guesses are low-confidence by nature and five entries that look unrelated often share one cause.** You can only see that with the whole folder in view.

1. **Rebuild the index and read every open entry in full**, not just the index. `status: new` and `status: triaged` are open; `doing`, `shipped`, and `declined` are closed.

2. **Cluster before ranking.** Group entries by underlying cause rather than by area or type. Say so explicitly when several entries collapse into one fix, and name which entries the cluster covers. A cluster of five cheap papercuts sharing one cause usually outranks a single expensive one-off.

3. **Rank by cost times frequency, with blocking on top.** Anything `blocking: yes` leads. Then recurring items, then one-offs by time lost. State the ranking rather than implying it through order.

4. **Propose a disposition for each cluster or entry**, and be willing to propose a decline:
   - **Roadmap item**: real work, not now. Which section, and a one-line item in the existing A/B/C grammar.
   - **Punchlist line**: small, near-term, do it this cycle.
   - **Doctrine**: the fix is a rule or a playbook entry, not code. Route to the normal learnings triage rather than deciding it here.
   - **Fix now**: small enough to do in this session. Offer to do it.
   - **Decline**: with the reason written into the entry. A decline is a real outcome and must never be a silent deletion.

5. **Apply what the user accepts.** Write the disposition into each entry's `## Disposition` section with the date, set `status`, and make the corresponding edit to `Internal/POWERCLOUD_OS_ROADMAP.md` or `Internal/ROLLOUT_PUNCHLIST.md`. Rebuild the index afterwards.

**Two things to watch for as a reviewer.** First, an entry whose `[Inferred]` fix looks obvious deserves more suspicion than less, because it was written in the moment by a model that had just failed at something. Second, a single loud reporter can dominate the folder; check `from` distribution and say so if one person is writing most of it, because that is a signal about who is *not* reporting rather than about what is broken.

---

## Governance

Shared skill, so A3 applies: it lives here and nowhere else, changes get a dated line in `../CHANGELOG.md`, and no client specifics get hard-coded into it.
