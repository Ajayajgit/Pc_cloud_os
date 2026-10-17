# Session Norms

> DRAFT 2026-08-12, pending Mike's review. Audience: Claude sessions and whoever runs onboarding walkthroughs, NOT end users. The human-facing session practices live in the guide ("How to Work in the Power Cloud OS", Part 4); this file adds the tool-parameter layer (model and usage policy) that end users shouldn't have to think about.

How to run Claude Code sessions at Power Cloud. One page. The folder structure and hard rules live in CLAUDE.md; this is the operating habit layer.

## Sessions

- **One task, one session.** Start a clean session for each new task or client. Your files survive: everything written to the client folder persists across sessions and `/clear`. Clearing a session does not erase work, it erases conversation memory. The folder is the memory.
- **Always work from inside the client's subfolder.** Never from the root, never from a personal folder. The session inherits the client's context and the workspace rules from there. Same starting point for every phase; the execution skill manages its own subfolder.
- **No production write ever happens silently.** Build work targets sandbox connections. Sandbox-verified changes promote to production behind an explicit confirmation, one per write; the prompt restates the gate. If that prompt appears during a discovery session, the answer is decline: discovery is read-only, no exceptions.
- **Name sessions client + environment** ("Teppermans SB suitelet fix", not "work session"). Session start proposes a paste-ready `/rename` line (Claude cannot rename sessions itself; the consultant pastes it). Truncated generic titles have already caused prod/sandbox confusion, and named sessions are what make running several in parallel manageable.
- **Pick up where you left off** works: reopen the project, say "pick up where you left off." Prefer that over re-explaining.

## Models, effort, and cost

- **The session model orchestrates; the OS hands mundane steps to Haiku and Sonnet workers itself** (root `CLAUDE.md`, "Model tiering", 2026-09-21). You will see `pc-*` agents run without asking for them. Your job is the review gate: read the Handback the way you would read a junior's pull request. "You don't need Fable to write a PDF."
- **Escalation to Fable is a gated package, not a model switch.** When a session is stuck on a reasoning problem it writes the question, the attempts, and the attached files into a `pc-escalation` spawn, and a hook prompts you for permission with that package on screen. Approve it if the package is real; decline it if the problem is missing evidence or a tooling issue. Do not switch the whole session to Fable by hand; that is how a day's quota went at the summit. Local models (Ollama) are a per-machine experiment, never an OS dependency.
- **Watch the effort setting.** High effort on the wrong task burned a full day's quota at the summit. Check it when a session feels slow or expensive.
- **Your usage-credit limit is $25/month.** Hitting it pauses extra usage until month-end; your included seat usage keeps working. Hitting the cap is not a failure, it is a signal: tell Mike, that conversation is how premium seats get assigned.
- **Work account only.** Being signed into a personal Claude account burns the wrong pool and loses org context. Check which account you are in before long work.

## Delegation habits

- **Give a big chunk, then walk away.** Before stepping out, hand the session something substantial: "I'm away for two hours, use your best judgment instead of waiting on me where possible."
- **Never stare at the screen while it works.** Waiting on AI is not billable. Line up parallel work: another client, review of a draft, the thing you postponed.
- **You are managing, not typing.** Check in like you would on a colleague you delegated to: read what it did, correct course, hand it the next chunk.

## Guardrails (non-negotiable, from CLAUDE.md)

- **Read-only during assessment and discovery.** No writes to any client system, ever, in that phase. Write work happens only in the execution phase, sandbox-first, with human gates.
- **Never bypass permissions mode.** Deploy and write actions must ask. Auto-accept for file edits in a working session is fine; "bypass permissions" is not.
- **Proofread everything before it leaves the building.** Every client-facing sentence gets human eyes. You own what you send; "the AI wrote it" is not a defense, it is the failure.
- **Correct it out loud.** When Claude gets something wrong and you fix it, say so in the session and tell it to remember. That is how the correction becomes a rule instead of a repeat.

## Where things go

- `source/` is the client's material: read-only, never edited.
- `working/` is scratch: drafts, evidence, profiles, anything in progress.
- `deliverables/` is finals only: nothing in progress, nothing unreviewed.
- Meet recordings and notes reach `source/` through Paco (`PACO.md`): put the client's full name in the Calendar title so the card suggests the right folder, and answer the card in the meeting's thread. Nothing Paco writes gets hand-edited.
- Credentials and tokens: never in the shared Drive. Local machine only.
- Did something notable, learned something, built something? It belongs in the client folder or the shared root files, not in your head. "Anybody continuing a conversation in that same folder will be talking to a being that understands it."
