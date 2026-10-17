# Prompt Patterns

> DRAFT built overnight 2026-08-12, pending Mike's review. Teaching material for the rollout meeting.

The techniques that worked at the summit and on live engagements, written down so they stop being tribal knowledge. Each pattern: when to use it, how to say it. These get baked into skills over time; until then, use them by hand.

## Getting honest answers

**1. Context without leading.** Give everything you know before asking, but do not reveal your preferred answer. "Here's how their subscription flow works today [detail]. What are the options for handling the prepaid balance?" Not: "Should we use a deferred revenue item for the prepaid balance?" It defers to you; once your idea is in the prompt, the objectivity is gone.

**2. Current state before design.** Make it explain how the thing works today before proposing anything. "Walk me through what this script actually does" first; "how would you fix it" second. Skipping step one produces confident redesigns of a system it never understood.

**3. State the problem, not the solution.** "This process is not viable at the customer's scale" outperforms "build a Map/Reduce version." Name the constraint and let it search the solution space; you review the options instead of pre-picking one.

**4. What's your source?** For any claim that smells off, ask exactly that: "Where did you find this? What's your source?" It traces back honestly, and a claim that traces to a stretch (the leaving-NetSuite incident) dies before it reaches a client. Never lead with "are you sure?", which invites apologetic flip-flopping.

## Widening the option space

**5. The greenfield reframe.** "Forget the current setup and current constraints. If you were designing this from scratch, how would you handle it?" Kills inherited-flaw anchoring. Use in solution design and rescue work; skip when the constraint genuinely binds.

**6. Steelman the alternative.** After it proposes A: "Make the strongest case for a completely different approach." One prompt, and you have a real comparison instead of a single track. Pair with withholding your own preference until after the first proposal.

**7. The side-question audit.** At natural pauses: "In your opinion, are we missing any low-hanging fruit here?" and "Did you consider [the native feature]? What problems would come up?" The billing-schedule miss happened because nobody asked question two.

**8. Don't hand it the escape hatch.** If you say "we can always check with the customer," it will take that exit instead of reasoning. Withhold the out; make it commit to a recommendation, then decide yourself whether the customer needs to weigh in.

## Working discipline

**9. Plan before build.** "Write the full plan first: approach, assumptions, what you'll test to validate your own assumptions. Don't build until I approve the plan." No code, no config, no client artifact without this gate. This is house policy, not preference.

**10. Big-chunk delegation with a judgment license.** When stepping away: "I'm gone for two hours. Work through [the chunk]. Where you'd normally ask me, use your best judgment and log the decision; only stop for anything touching a client system."

**11. Interview me.** When it is missing context, make it ask instead of assume: "Before you start, interview me: ask the questions you need answered to do this well." The skill-based flows do this automatically; use it manually everywhere else.

**12. Diverge on options, never on facts.** Creative exploration is welcome in solution design (see the five lanes in the roadmap). Numbers, evidence claims, LOE figures, and billing language stay conservative and verified. If an idea and a fact are in the same sentence, split the sentence.

## Sessions

A session is one named piece of work, in one folder, with one permission posture. When any of the three changes, start a new one. The folder is the memory, so a fresh session loses conversation, not knowledge.

**13. Start a new session when the work changes shape.** A new import category, a new design area, a new deliverable stage. If you cannot name the session in a few words, it is two sessions. Never two clients in one session. Discovery stays read-only and execution runs from the `execution/` folder, so moving from one to the other is a new session, not a declaration mid-stream.

**14. One permission mode per session.** Imports and other production writes run in the default mode. Read-heavy research can run in auto mode. Do not flip modes inside a long session: the classifier remembers earlier denials and treats later attempts as attempts to get around them.

**15. A compaction means the session is overdue.** The summary is lossy and written by the model. Say "checkpoint" and start fresh; it costs a minute and beats trusting the summary. The 543-item near-duplicate on MH Crane (2026-10-01) came from a session that lived through a compaction.

**16. Restart after the harness changes.** Settings or permission rules edited, a connector reconnected, hooks misbehaving. All of that is read at session start only. (The hook scripts themselves are read on every call, so a change to a gate's code reaches an open session; a change to the settings file does not.)

**17. Leave by checkpointing, arrive by reading the brief.** Say "checkpoint" before you go: decisions, open threads and the next step land in the folder, and the next session's brief hands them back. On arrival, read the brief, let it distill any checkpoint debt in one line, paste the suggested `/rename` so the session has a name, pick the permission mode before the first tool call, and give the task in one message with the file paths to work from rather than a re-explanation. Before any write, let the session confirm which account and environment it is connected to.

**18. When the session is fighting you, leave it.** Repeated denials, stale tool lists, prompts that make no sense. Checkpoint and start clean rather than pushing through; the next session starts without the history that is causing it.
