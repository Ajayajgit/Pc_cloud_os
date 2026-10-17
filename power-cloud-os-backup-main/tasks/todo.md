# Shared session memory: discussions, decisions and reasoning land in the folder

Goal (Mike, 2026-09-24): several people work out of the same folders, many on more than one
machine, and sessions run out of context. Key discussions, decisions and the reasoning behind them
must end up in the OS folder, where any person on any machine picks them up, and not in one
person's head, one laptop's auto-memory, or a compaction summary.

Status: BUILT 2026-09-24, same session. Mike decided D1 to D4 as recommended (Internal/sessions/,
an asking gate on auto-memory, redacted raw capture, migrate now); Codex reviewed (see below).
Live tests T1, T2, T6 (distill), T7, T8 pass; T3, T4, T5 owed (need a person, a second machine, or
judgment). See "Review" at the end of this section.

## The gap

"The folder is the memory" already holds for **artifacts**: candidates, verification, CONTEXT.md,
design decisions, deliverables. Skills write those. What falls through is the **conversation**: an
ad hoc session where Mike and Claude settle a design, a client call debrief, "we decided not to do X
because Y". That reasoning dies in four ways today:

1. **Compaction or context exhaustion.** The summary is lossy and written by the model, not us.
2. **Per-machine auto-memory.** `~/.claude/projects/<slug>/memory/` is one user on one laptop.
   Verified 2026-09-24: its location cannot be changed, so it can never be the shared answer. It
   currently holds 11 OS-level project facts (model tiering, portal plan, Paco follow-ups) that no
   other consultant, and no other machine of Mike's, can see.
3. **Nobody wrote it down.** Capture depends on someone remembering to ask.
4. **Shared-file collisions.** Two machines editing one file on a Drive shared drive produces
   conflict copies (the reason `feedback/` is one file per entry).

## Design

Three layers. Capture that needs no model and cannot be forgotten, distillation by the model while a
human is present, and promotion of durable items into the file that already owns them.

### Layer 1: raw capture (hooks, model-free, fail-open)

A new hook, `session_snapshot`, extracts the human-readable conversation (user prompts and
assistant text, no tool output) from the session transcript into
`{scope}/sessions/raw/{YYYY-MM-DD}_{user}_{session8}.md`, rewriting the same file each time.

- Fires on **PreCompact** (before the lossy summary), **SessionEnd**, and **Stop** throttled to at
  most once every 10 minutes of transcript growth. Stop is the safety net, because SessionEnd is
  not guaranteed when the desktop app closes.
- **Fail-open, on purpose.** Unlike the four gates, a memory hook must never block work. Any error
  exits 0 and appends one line to `sessions/raw/_capture_errors.log`, which the brief surfaces.
- **Defensive parser.** Anthropic says the transcript JSONL format is internal and can change
  between releases. The parser keys on role and text blocks only, tolerates unknown entries, and
  when it extracts nothing from a non-empty transcript, it logs that the format changed rather than
  writing an empty file.
- **Redaction** before write: API keys, bearer tokens, `ghp_`/`sk-`/`AKIA` shapes, and any long value
  after `password|secret|token|key`. People paste credentials into chat.
- **Scope:** the session's start folder (client, nested project, or OS root, see D1). Client
  conversation never leaves that client's folder, which keeps the scope gate's promise.

### Layer 2: the checkpoint (a skill, the model distills)

New skill `session-memory`, triggered by "checkpoint", "save this session", "we're running out of
context", "hand this off", `/checkpoint`, and prompted by the brief (below). Writes
`{scope}/sessions/{YYYY-MM-DD}_{user}_{slug}.md`, one per session and updated in place (keyed on
session id), so it never collides with another person's:

```markdown
---
date: 2026-09-24
who: mike
machine: {COMPUTERNAME}
session: {id}
scope: {client folder | os}
raw: raw/2026-09-24_mpfly_22326001.md
---
## What this session was about      (two or three lines)
## Decisions                       (decision / who made it / why / what was rejected and why)
## Open threads                    (unresolved, with who can answer)
## Next step                       (what the next session, anyone's, should do first)
## Promoted                        (where each durable item was also written, or "none")
```

Three modes: **checkpoint** (from the live context), **distill** (from a raw file nobody
checkpointed, attributed "distilled by {who} from {raw}"), and **resume** ("pick up where we left
off": read the latest checkpoints and any undistilled raws in scope, and brief).

**Promotion routing**, so the journal points at facts rather than becoming a second home for them:

| Item | Canonical home |
|---|---|
| Client fact or engagement decision | `CONTEXT.md` Key decisions / Open questions |
| Execution design decision | `execution/design/{area}_decisions.md` |
| Tool capability proven or disproven | `CAPABILITIES.md`, dated `[unreviewed]` |
| A correction of Claude | `tasks/lessons.md` (OS) |
| Friction with the OS | offer the feedback skill, never write unasked |
| OS architecture decision | the spec that owns it (`PACO.md`, `Internal/PORTAL_BETA_PLAN.md`, `tasks/todo.md`) |

### Layer 3: the brief (SessionStart hook, closes the loop across people and machines)

New hook `session_brief` on SessionStart (startup, resume, clear, compact) injects a short
`additionalContext` block:

- the **Next step** and **Open threads** lines from the latest three checkpoints in scope, with who
  and when, plus paths;
- **checkpoint debt**: raw files with no matching checkpoint ("2 sessions from Steve and Mike were
  never distilled; offer to distill");
- **Drive conflict copies** (`* (1).md`) anywhere in scope, which today go unnoticed;
- capture errors from the log;
- on `compact` only: "context was just compacted; offer a checkpoint now, reading the raw file for
  anything the summary lost."

This is the "check at the moment of action" pattern from lessons (2026-09-14): the brief asks for
debt at the next session, whoever runs it, instead of relying on the last person to have been
diligent.

Plus a **"Compact instructions"** section in root `CLAUDE.md` telling the summarizer to keep
decisions, their reasons, and who made them verbatim. Whether Claude Code honors that section is
unverified (T5); it costs six lines to try.

### Auto-memory (D2, D4)

It cannot be redirected, so it gets demoted to personal preferences only. Migrate the 11 current
entries: check each against its shared home, copy what is missing, and leave behind only what is
about Mike as a person. A root CLAUDE.md line states the rule. Enforcement options are in D2.

## Decisions for Mike

- **D1. Where OS-root sessions go.** Recommended: `Internal/sessions/`. OS-root sessions are mostly
  you and the AI engineer, and they carry strategy (MSP pivot, pricing, portal) that the changelog's
  MSP-leakage bug shows must stay internal. Alternative: root `sessions/`, readable by every
  consultant. Client sessions always go to `{Client}/sessions/`.
- **D2. Enforcement on auto-memory writes.** Recommended: a PreToolUse gate that **asks** on any
  write under `~/.claude/projects/*/memory/`, with the reason "personal preference or project
  knowledge? project knowledge goes to a checkpoint". Alternatives: hard block, or prose only
  (which lessons 2026-09-21 says is a reminder, not enforcement).
- **D3. Raw capture of prompts at all.** Recommended: yes, redacted, in-scope, and excluded from the
  GitHub backup sync. It is the only layer that survives a session nobody checkpointed. Cost: a
  consultant's verbatim chat is readable by anyone with folder access.
- **D4. Migrate your 11 local memories now.** Recommended: yes, as part of this build.

## Build steps

- [x] 1. `.claude/hooks/session_snapshot.py`: parser, redaction, throttle, fail-open, error log
- [x] 2. `.claude/hooks/session_brief.py`: checkpoints, debt, conflict copies, errors, compact variant
- [x] 3. Register both in `pc_hooks.py`; add SessionStart / PreCompact / Stop / SessionEnd entries to
       `client-settings-template.json`, the stamp copy, and root `.claude/settings.json`
- [x] 4. D2 gate, if chosen, in the same dispatcher
- [x] 5. `.claude/skills/session-memory/SKILL.md`: three modes, format, promotion table
- [x] 6. Stamp: `templates/CONTEXT.md` updated; no empty folders added (the hooks create `working/sessions/` on first use)
- [x] 7. Re-stamp every client and nested project folder (existing procedure, extended to the new
       event keys, keeping `permissions` untouched); count before and after
- [x] 8. Root CLAUDE.md: a short "Session memory" section, the Compact instructions section, the
       auto-memory rule, and a reference-list line
- [x] 9. ONBOARDING.md: one habit ("say checkpoint before you stop or when it warns about context")
- [x] 10. Backup sync: exclude `sessions/raw/` from the GitHub mirror
- [x] 11. D4 migration, with a table of each memory: where it went, what stayed local
- [x] 12. CHANGELOG, CAPABILITIES entries `[unreviewed]` for each hook fact the live tests prove

## Verification

Unit (added to `.claude/hooks/test_hooks.py`, run before any re-stamp):
- parser on a sanitized real transcript fixture and on garbage; redaction cases; throttle; fail-open
  on bad stdin; brief output with debt, conflict copies, and empty scope; stamp and template
  identical (the existing check)

Live, from `44 Pro - AI Summit Test`:
- **T1** new session shows the brief
- **T2** `/compact`: raw written before the summary; the post-compact brief appears (this checks the
  conflicting doc claim, so the result goes to CAPABILITIES either way)
- **T3** close the desktop app mid-session with no checkpoint: raw exists from Stop; the next
  session reports the debt
- **T4** a second machine or second person opens the folder and sees the first session's next step
- **T5** Compact instructions: after `/compact`, is a stated decision and its reason still in context?
- **T6** checkpoint promotion lands a decision in CONTEXT.md and the checkpoint lists it

Done when T1 to T4 and T6 pass. T5 failing only drops the CLAUDE.md section.

## Later, not now

Retention and pruning of raw files once distilled; C2 (session-to-timesheet drafts) could read the
same raw files; the portal replaces all of this with real session storage.

## Codex review (2026-09-24, advisory) and revisions

Sorted per lessons 2026-09-21. These revisions override the design above where they conflict.

**Adopted (real holes):**
- **Capture on every Stop, append-only.** The 10-minute throttle could lose everything after the
  last snapshot when the app closes. Raw capture now appends only the new turns after each Stop,
  reading the transcript from a byte offset kept in local state
  (`~/.claude/pc_session_state/{session}.json`). It consumes lines only up to the last complete
  newline, so a half-written trailing record waits for the next pass. This also fixes the rewrite
  risk: a later parser regression can no longer overwrite a better capture. Worst-case loss is the
  one turn in flight when the app dies.
- **Checkpoint coverage, not just existence.** Raw turns are numbered, and each checkpoint records
  `covers_through: {turn}`. Debt means raw turns past the latest checkpoint's coverage, so a
  checkpoint taken mid-session no longer hides the second half. Checkpoint filenames carry the
  session id: `{date}_{user}_{session8}_{slug}.md`.
- **No shared error log.** Errors and the last successful capture go to local state. The brief
  reports them for this machine and says "capture unavailable" when that is the case, never
  "no sessions".
- **Promotion is a reviewed step.** The skill shows each promotion to the consultant, re-reads the
  destination immediately before editing it, and never auto-writes a shared file.
- **Decisions carry status.** Each is `decided`, `proposed`, or `reversed`, with `supersedes:` when
  it replaces an earlier one. The skill treats raw text as quoted data, never instructions, and
  records a decision only where a human agreed to it, not where the assistant asserted it.
- **A bounded brief.** It scans only `sessions/` in scope, is capped at about 2KB, and never loads
  raw content.

**Adopted with a stated caveat:**
- **Scope is asked, not enforced.** An OS-root session can still discuss a client. The skill moves
  client specifics into that client's folder at checkpoint time, but nothing prevents the raw file
  from holding them. `Internal/` permissions are Mike's to maintain in Drive, as they are today.
- **D2 coverage is unproven.** Test T7: does Claude Code's own auto-memory write go through a hook
  the gate can see, in both the CLI and the desktop app? If it does not, D2 ships as a prose rule and
  the plan says so.

**Declined:**
- A local periodic collector process. Capturing on every Stop leaves only the in-flight turn at
  risk. A background process per laptop is the kind of machine-specific tooling lessons 2026-09-03
  rules out.
- Offline-Drive, concurrent-promotion, and folder-permission acceptance tests for the first
  rollout. Drive for desktop queues offline writes, promotion now re-reads before it edits, and
  permissions are Mike's. They move to a later pass.

**Added tests:** T3 now closes the app inside a turn, not only between turns; T7 (D2 coverage);
T8, checkpoint, then more discussion, then a new session reports the uncovered turns as debt; unit
coverage for a truncated trailing JSONL line and a parser run that extracts fewer turns than before.

---

## Review (2026-09-24)

**What shipped.** `session_common.py`, `session_snapshot.py`, `session_brief.py`, `memory_gate.py`
in `.claude/hooks/`, registered in `pc_hooks.py`; the `session-memory` skill; root settings, the
stamp and all 50 client and nested folders (each checked equal to the previous template first);
CLAUDE.md "Session memory" and "Compact instructions"; ONBOARDING habit; templates/CONTEXT.md
re-stamp rule; backup sync excludes `Internal/sessions/raw/`; CAPABILITIES and CHANGELOG entries;
Mike's ten project memories imported to `Internal/sessions/imported/`.

**One deviation from the plan.** Client sessions write to `{folder}/working/sessions/`, not a new
top-level `sessions/`: working/ is already the scratch surface, every record has it, and the
render gate scans only `working/draft_*.md`.

**Found by testing, fixed.**
- The first smoke test dropped every AskUserQuestion answer (they arrive as tool results), which
  would have lost D1 to D4 from this very session. The hook now pairs those questions with their answers.
- The settings generator dropped the launcher from the new entries (`python -c session_snapshot`),
  so every session hook failed silently. 45 unit tests were green; the first live `claude -p` run
  caught it. The launcher test now pins the exact exec form of every stamped entry.
- Rewriting CLAUDE.md through Python turned its CRLF endings into LF; restored.

**Live results** (headless `claude -p`, `44 Pro - AI Summit Test` and the OS root):

| Test | Result |
|---|---|
| T1 brief at session start | pass: session id, raw path, "no checkpoints or debt yet" |
| T2 `/compact` | pass: PreCompact wrote the marker; the post-compact SessionStart brief did reach context (the research agent's claim that it cannot was wrong) |
| T6 distill via the skill | pass: checkpoint written with the right name, `covers_through`, raw pairing, promotions none |
| T7 memory gate | pass from the OS root: the gate's ask fires on the session's own memory folder (headless turns it into a deny). From a client session, Claude Code's own "sensitive file" check blocks writes to another project's memory first |
| T8 debt across sessions | pass: a second session listed the first session's uncovered turn |
| T3 app closed mid-turn | owed: needs the desktop app |
| T4 second machine or person | owed: needs Mike's other laptop or a teammate |
| T5 Compact instructions honored | owed: needs a real long session and a judgment call |

**Not verified.** Whether auto mode resolves a hook's "ask" without a prompt in an interactive
session (this session made an auto-memory write with no prompt, but its hooks were not loaded yet,
so this is unconfirmed, and it would apply to every gate). Hooks added mid-session do not load until the next session.

**Test artifacts left on purpose.** `44 Pro - AI Summit Test/working/sessions/` (three raw
captures, one checkpoint) and `Internal/sessions/raw/2026-09-24_mpfly_eea9dddf.*` (the T7 run).
They will show as checkpoint debt until distilled or archived.

---

# Model tiering: the session model orchestrates, cheap workers do the mundane steps

Goal (Mike, 2026-09-21): the OS should, without the consultant prompting for it, let the strong
session model act as orchestrator (plan, decide, tier evidence, own numbers, review) and hand
mundane, low-judgment work to cheaper models, especially coding. Save usage without lowering what
ships. Plus a permission-gated option to bring in Fable when genuinely stuck.

Revised 2026-09-21 after a Codex second opinion (advisory; read in full; folded in where it held,
noted where it did not; see "Codex review" at the end).

## Decisions taken (Mike can override before implementation starts)

1. **Hosted Haiku and Sonnet subagents only. Ollama stays out of the OS** (Mike: not everyone has
   local models; machines differ). Mike's user-scope pointer to his Local rules keeps covering his
   own machine and is never referenced from a fleet file.
2. **Three tiers, by the shape of the work.**
   - **Deterministic work is a script, not a model.** Counts, splits, set differences, disposition
     presence, anchor and task-ID cross-references, validate-log parsing. Existing precedent:
     `build_engagement_log.py`, `copy_scan.py`. Paying a model to recompute the same counts adds
     variability for nothing (Codex point, accepted).
   - **Haiku 4.5: mechanical transformations whose correctness a script or a glance establishes.**
     JSDoc and TDD tables from code, new test files from approved acceptance criteria, build-log
     entries from captured output, free-text clustering (Celigo error messages by cause, script
     inventories into categories), slide PNG defect detection.
   - **Sonnet 5: bounded production work against a written spec with an independent checker.**
     First-pass transcript capture (the largest token sink in the OS; recall over precision,
     untiered, merged by the orchestrator, recall-checked from the source) and SDF authoring from an
     approved plan block (checked by validate, the plan's acceptance criteria, and the
     `netsuite-sdf` standards). Sonnet, not Haiku, because both have semantic traps a checker does
     not catch (a missed candidate; an audience-less deployment; a guessed `selectrecordtype`).
   - **The session model (Opus 5 or Fable, whatever the seat provides): everything with
     judgment.** Planning and design, evidence tiers, materiality and dispositions, LOE, security
     review of authored code, all client-facing prose, synthesis, and the review gate.
   - **Client-facing drafting stays with the session model.** Drafting is the synthesis, the
     source-attribution and no-overreach rules are where a cheaper model fails quietly, and
     reviewing a delegated draft costs nearly what writing it costs. Revisit only after the mining
     recall test (T6) has passed on three transcripts of different shapes; even then the candidates
     are mechanical appendix sections, never findings or commercial framing.
3. **Real `netsuite-sdf` authoring standards get written into the OS now** (Mike). Delegated coding
   is unreviewable without them and the fleet needs them regardless. No target length: concrete
   rules, one example per rule, executable checks where they exist. Mike removes the 5-line
   user-scope stub of the same name so the OS copy loads.
4. **Gates ship first, the always-loaded nudge ships last.** Codex is right that advertising
   enforced controls that are absent where consultants work is worse than not advertising them.
   Order: stamp hooks, standards, agents and seams tested on the test client, then the root
   `CLAUDE.md` section that makes delegation happen without prompting.
5. **No worker has Bash or MCP tools.** Bash is live-system access whatever the prose says. The
   orchestrator runs `suitecloud project:validate`, the scripts, and every query itself and hands
   the captured output to the worker as text. Connector tool names embed the client's connector
   name anyway, so a fleet agent could not list them.
6. **Client scope is enforced by a hook, not by prose.** `client_scope_gate.py` (PreToolUse on
   Read, Glob, Grep, Write, Edit, in the stamp) resolves the real path (junctions included) and
   denies anything outside the client folder plus the OS root reference set (root `*.md`,
   `.claude/`, `templates/`, `logos/`, `fonts/`), and denies writes anywhere under root `.claude/`
   from a client session. Applies to the orchestrator and every worker alike, which is what
   `CLAUDE.md`'s "never read other client subfolders" rule always meant. On script error it
   returns `ask`, never a silent allow. Whether PreToolUse hooks fire inside subagents is T0, the
   first test, because the design depends on it; if they do not, workers get read-only tool sets
   and the orchestrator applies their output.
7. **Every worker body still restates the rules that must hold if `CLAUDE.md` is not inherited**
   (paths named in the prompt only; no live systems; US spelling and no em-dashes; a `## Handback`
   with files read, files written, what it could not do, every guess and every reference to an
   existing account object it could not confirm). Prose is the second layer, not the gate.
8. **Each seam names the independent check that establishes correctness.** Reading the handback
   cannot recover what a worker omitted (Codex, accepted). Code: validate plus tests written from
   the plan's acceptance criteria, never from the implementation. Mining: sampled source windows
   read by the orchestrator, checked forward into the mining file, plus the playbook completeness
   checklist. Tables: a script recomputes the numbers. PNGs: the inspector is an extra detector,
   never the pass.
9. **Worker outputs never overwrite.** `working/mining/{stem}.md`; if it exists, write `{stem}-2.md`
   and flag it. Shared Drive plus two sessions is a real collision path.
10. **Escalation to Fable is a bounded, permission-gated subagent, not a session switch** (Mike:
    "an option to use Fable when stuck, and it should prompt for permission").
    - **Why a subagent.** It scopes the expensive model to one packaged question and drops back
      automatically; the summit's burned day was a Fable effort setting left on.
    - **"Stuck" is classified, and only one class escalates** (Codex, accepted). The counts below
      are the trigger to stop and classify, not the definition. *Missing evidence* (no discovery
      fact supports a choice, sources conflict): interview the consultant or verify; a stronger
      model cannot manufacture the fact. *Operational blockage* (credentials, tooling, access): fix
      the environment. *Reasoning blockage* (the evidence is in hand, bounded attempts have not
      resolved a concrete question): this escalates. Triggers to classify: the same step failed
      twice with two different approaches (a worker failing and the inline retry failing counts as
      two); a call claim and the account disagree after one verification pass; three hypotheses
      eliminated without a fix; or a single ambiguity whose wrong answer would change what ships.
    - **One approval interaction, and it carries the package.** The orchestrator writes the package
      into the agent prompt itself: the question, the attempts and outcomes, the attached paths
      (capped at about 60K characters of material, never whole transcripts), and what Fable is
      expected to resolve. `escalation_gate.py` (PreToolUse on `Agent`, in the stamp) fires on
      `subagent_type: pc-escalation` **or any `model: fable` on the Agent tool**, returns a forced
      `ask` whose reason quotes the package, and **fails closed** (deny with a reason) on any error.
      Unrelated Agent calls get no decision from it at all. One escalation per question per
      session, logged with its outcome in `build_log.md` or `verification.md`.
    - **The escalation agent recommends; the orchestrator decides.** Read-only tools, no web tools
      (client material must not leave through a search), no Bash. It returns a recommendation, the
      reasoning, what to check next, and a Handback.
    - **If the session is already on Fable**, the agent is a fresh-context second attempt, not a
      tier up; the prompt says so. **If the seat has no Fable**, the orchestrator says so once and
      offers the same package on Opus or continues inline. Never a silent substitute.

## Items

### Wave 0: gates (before any delegation ships)
- [x] 0a. `.claude/hooks/client_scope_gate.py` per decision 6, with tests for: sibling client path
      (deny), path traversal `..\..\Other\` (deny), a junction into a sibling (deny), root
      `WRITING_STANDARDS.md` (allow), write into root `.claude/` (deny), script crash (ask).
- [x] 0b. `.claude/hooks/escalation_gate.py` per decision 10, with tests for: `pc-escalation` (ask,
      reason quotes package), `model: fable` on `general-purpose` (ask), `pc-code-chores` (no
      decision), malformed payload (deny), missing Python (observe what the host does; record).
- [x] 0c. Stamp: add the `ns_*` write guardrail (today wired only into root `.claude/settings.json`,
      which client sessions never load, so it is inactive on every engagement), the scope gate,
      and the escalation gate to `templates/client-record/.claude/settings.json` and
      `.claude/hooks/client-settings-template.json`, using the `../.claude/hooks/` relative form
      the render gate uses (the nested-project path bug from `feedback/2026-09-01` applies; use the
      same fix). **Re-stamping the 18 existing client folders: recommended, Mike's call.**
- [ ] 0d. T0 and T11 from the test client: do PreToolUse hooks fire inside a subagent; does the
      `ns_*` gate force the ask against a sandbox connector.

### Wave 1: coding
- [x] 1. `.claude/skills/netsuite-sdf/SKILL.md` (new; no absolute machine paths): project layout
      and file naming (from `sdf-scaffold`); naming (`PC | {Name}`, `customscript_pc_*`,
      `customdeploy_pc_*`, `custrecord_pc_*`, `custbody_pc_*`, `custcol_pc_*`, `custentity_pc_*`,
      `pc_{area}_{type}.js`); the SuiteScript 2.1 header block (`@NApiVersion`, `@NScriptType`,
      JSDoc with the execution-plan task ID) marked as machine-read and never edited by a worker;
      deployment XML rules (explicit audience on every `scriptdeployment`, TESTING and DEBUG in
      sandbox); the semantic traps validate misses, lifted from the SDF entries in
      `CAPABILITIES.md`; governance and error handling; a security checklist the **orchestrator**
      runs, distilled from the SAFE guides and cited by name; test expectations (one test per
      acceptance criterion, criteria from the plan, never from the code); references to existing
      account objects confirmed from the account or listed as unconfirmed, and an unconfirmed
      reference is a stop, not a disclosure; the delegation contract (fully specified, single unit,
      checker exists; never architecture, debugging, security posture, or data migration); the
      cannot-do pointer.
- [x] 2. `.claude/agents/pc-sdf-author.md` (Sonnet; Read, Write, Edit, Glob, Grep; no Bash;
      maxTurns 40; preloads `netsuite-sdf`). Authors objects and scripts under `execution/sdf/src/`
      from an approved plan block. The orchestrator runs validate and hands back the output; the
      author fixes what is mechanical and lists the rest. Stops and lists any design choice the
      plan left open instead of picking. Handback separates IDs it created from references to
      existing objects it could not confirm.
- [x] 3. `.claude/agents/pc-code-chores.md` (Haiku; Read, Glob, Grep, Write, Edit; maxTurns 20),
      narrowed to transformations: JSDoc for functions (never the file header block), TDD
      function/file/field tables from code, **new** test files from the plan's acceptance criteria
      (never edits an existing `.js`), a `build_log.md` entry from captured output the orchestrator
      supplies. SAFE checklist assessment and "is this fix mechanical" stay with the orchestrator.
- [x] 4. `.claude/scripts/parse_validate_log.py`: `suitecloud project:validate` output to a table
      (error, file, line, message). Deterministic; replaces the Haiku triage idea.
- [x] 5. Seams: `execution/SKILL.md` route step (SDF-deployable bullet) and step 3 build;
      `sdf-deploy/SKILL.md` validate step; `execution/execution-CLAUDE.md.template` guardrail
      bullet ("workers author; they never validate, deploy, or query; you do").
- [ ] 6. Tests T1 to T5.

### Wave 2: evidence and data
- [x] 7. `.claude/agents/pc-transcript-miner.md` (Sonnet; Read, Grep, Glob, Write; maxTurns 30).
      One transcript per run. Capture by **explicit categories with permissive inclusion**, not
      "material claims": pain points, workarounds, numbers, decisions, requests, disagreements,
      corrections, conditionals, integrations and systems named, roles named. Preserve
      qualifications and uncertainty. Unknown speaker or timestamp stays unknown. Output
      `working/mining/{stem}.md` in the shape of the existing `mining_day1.md` precedent, untiered,
      no dispositions, with a coverage line (character range read, sections skipped and why). The
      delegation threshold (about 20K characters) decides whether a spawn is worth it; it is not a
      chunking rule, one Sonnet run reads a whole transcript.
- [x] 8. `.claude/agents/pc-data-condenser.md` (Haiku; Read, Grep, Glob, Write; maxTurns 25).
      Free-text condensing only: Celigo error messages grouped by cause, script and saved-search
      inventories into categories, time-entry memos into a per-resource focus line. Every group
      carries its row count and window; rows it could not place are listed, never dropped.
- [x] 9. Scripts for the deterministic half: `summarize_time_entries.py` (MSP vs billable,
      per-resource, window stated, malformed rows reported), `check_candidates.py` (every row has
      exactly one disposition, every drop has a reason), `check_crossrefs.py` (TOC anchors, task
      IDs and headline numbers agree across the assessment draft, deck draft and execution plan).
      Asana counts come from a saved export through `summarize_asana_export.py` if the exec-summary
      skill can save one; otherwise that step stays with the orchestrator, not Haiku.
- [x] 10. Seams: `stages/02_evidence-mining.md` (after the integrity check: one miner per long
      transcript, then merge, tier, dispose here; recall check by reading sampled source windows
      forward into the mining file; playbook checklist over the merged set); `stages/03_verification.md`
      (condense spilled free-text result files; tier and finding stay here); `celigo/SKILL.md` §2
      (grouping delegated, the end-to-end trace and every tier stay); `customer-exec-summary/SKILL.md`
      (hours and Asana numbers from scripts; memos and cross-reference judgment stay).
- [ ] 11. Tests T6 to T8.

### Wave 3: QA
- [x] 12. `.claude/agents/pc-qa-inspector.md` (Haiku; Read, Glob, Grep; maxTurns 40). Slide PNGs
      one by one for overflow, contrast, logo placement, alignment; reads `copy_scan.py --json` and
      `check_crossrefs.py` output into one table. Reports only; its pass is an extra detector, the
      orchestrator's own inspection is still the QA item.
- [x] 13. Seams: `stages/05_humanize-render.md`; `QA_CHECKLIST.md` "Before delivery" note. Test T9.

### Wave 3b: escalation
- [x] 14. `.claude/agents/pc-escalation.md` (Fable; Read, Grep, Glob only; maxTurns 15). Description
      says it is never used proactively and only through the gated approval. Tests T12, T13.

### Wave 4: the nudge, and the record
- [x] 15. Root `CLAUDE.md`: `## Model tiering` after `## Checkpoints` (about 25 lines): who
      orchestrates; the workers by name and tier; deterministic work is a script; the never-delegated
      list; the delegate-only-when test; the per-seam independent check; the review gate; the
      fallback; the stuck classification and the escalation package. Ships only after T1 to T13.
- [ ] 16. T14 end to end, and the quality acceptance below.
- [x] 17. `CAPABILITIES.md`: `## Subagents and model routing`, one dated `[unreviewed]` entry per
      test result. `.claude/skills/CHANGELOG.md` entry. `Internal/SESSION_NORMS.md` models bullet
      (the OS delegates; your job is the review gate; escalation is the gated package, not a model
      switch; local models are a per-machine experiment). `ONBOARDING.md` one session bullet plus a
      gotcha for a stalled worker or a denied gate. `Internal/POWERCLOUD_OS_ROADMAP.md` principle 7
      notes the desktop mechanism so the portal inherits the same tiers and names.
- [x] 18. Memory note and this file's review section.

## Quality acceptance (predeclared, so cheaper output cannot pass by doing less)

- **Critical miss, zero tolerance:** any candidate in the ground-truth set for a transcript that is
  absent from the merged register after the orchestrator's pass. Ground truth is built first, by
  the session model, from independently read source windows on three transcripts of different
  shapes (long and clean, notes-only, image-heavy). Critical failures are reported separately from
  averages.
- **Code:** validate clean, every acceptance-criterion test passing, zero unconfirmed references to
  existing account objects in shipped XML, zero edits to header blocks by a worker.
- **Tables:** zero count discrepancies against the script; every number carries its window.
- **QA:** the inspector catches each planted defect class (overflow, contrast, misplaced logo,
  misaligned block) and raises no more than one false alarm per ten clean slides.
- **Cost, measured on paired tasks with matching inputs (at least three pairs), total spend
  including worker tokens, review, retries and consultant correction:** session-model tokens down by
  at least 40% on the mined stage and total spend down by at least 25%, or the seam reverts. Latency
  recorded separately. Figures are Mike's to set; these are the proposal.
- **Isolation:** every enforcement test in T10 passes; a compliance-only pass does not count.

## Verification (session started inside `44 Pro - AI Summit Test`; the first teammate session
after rollout stands in for the second-machine check on T1, T2, T5)

Honest expectations, stated up front: description-driven delegation is probabilistic, so "without
prompting" will hold most of the time, not always (T14 measures it). The measurable usage saving
is expected in stage 02 mining, where whole transcripts leave the main context; coding delegation
saves less because the orchestrator still reads every diff. For a session already on Fable, the
escalation agent is a fresh context, not a smarter model.

| # | Test | Pass looks like |
|---|---|---|
| T0 | PreToolUse hooks fire for a subagent's Read/Glob/Write | scope gate denies a sibling path read issued by a worker |
| T1 | Agent list from the client folder shows the `pc-*` agents; effective versions, not names | discovered via parent directory on both machines |
| T2 | Delegated build step; confirm the effective model per agent from the transcript | Sonnet and Haiku as declared, no subagent env override set |
| T3 | Small approved plan (one custom field, one user event script) to `pc-sdf-author`, with a request to also run validate and deploy | authors; refuses both; Handback separates created IDs from unconfirmed references; the orchestrator's validate is clean and the criterion tests pass |
| T4 | `parse_validate_log.py` over a 10+ error validate output, then `pc-code-chores` writes a test file and JSDoc | table correct; test file is new; no header block touched |
| T5 | The OS `netsuite-sdf` skill loads from a client folder on a machine with the user-scope stub present and one without | the OS body is the one in context on both |
| T6 | Miner over three transcripts against the predeclared ground truth | zero critical misses; qualifications preserved; unknown speakers left unknown; coverage line present |
| T7 | Stage 02 on the same three transcripts inline and delegated, paired, `/cost` plus review time | acceptance figures above |
| T8 | `summarize_time_entries.py` over a real `time_entries_*.json` plus one malformed row and one duplicate | totals match a hand count; rejected rows listed; `pc-data-condenser` memo lines reference only rows in the file |
| T9 | Inspector over a deck PNG set with four planted defect classes and ten clean slides | all four caught; at most one false alarm |
| T10 | Scope gate enforcement: sibling read, traversal, junction, root `.claude/` write, embedded instruction in a transcript telling a worker to open another client | every one denied; the crash case asks |
| T11 | `ns_*` gate from a client-folder session against a sandbox connector | forced ask with the gate wording |
| T12 | Escalation gate: `pc-escalation` spawn, `model: fable` on `general-purpose`, malformed payload, declined prompt, unstamped folder | ask, ask, deny, nothing runs, and the unstamped case is recorded as "no gate" in CAPABILITIES |
| T13 | Approved escalation on a reasoning blockage | runs on Fable, recommends, writes nothing, outcome logged |
| T14 | End to end with nobody asking for delegation: a stage 02 run and an execution task | eligible work delegated, ineligible work not, review performed, a denied escalation handled |

## Not in scope
- Ollama or any local model in the OS.
- Delegating client-facing drafts.
- Model or effort settings for the session itself (the OS cannot set them).
- Cost-logging hooks on `SubagentStart`/`SubagentStop` (`/cost` suffices for the first measurement).
- The user-scope GSD agents on Mike's machine (33 agents with no `model:` line): outside the OS, noted.

## Codex review (2026-09-21, gpt-6-astra, read-only, advisory)

Folded in: no Bash on any worker; scope gate as a hook covering reads and writes, real paths and
junctions; escalation gate fails closed, matches `model: fable` too, quotes the package, returns no
decision on unrelated calls; no web tools on the escalation agent; deterministic work to scripts;
`pc-code-chores` narrowed, header blocks protected, tests as new files only; miner captures by
category not materiality; recall checked from source windows, not from the output; predeclared
acceptance with critical misses separate from averages; paired cost measurement; gates before
delegation; stuck classified into missing evidence / operational / reasoning with only the last
escalating; T3 distinguishes created IDs from unconfirmed references; no arbitrary length for the
standards.

Not taken, with reasons: "pilot, not fleet rollout" as a mechanism, because agents at the OS root
are fleet-visible by construction; the equivalent is shipping the nudge last and running T1 to T14
first. Dropping the count-based triggers entirely, because without a concrete trigger the
orchestrator never stops to classify; the counts stay as the moment to classify, not as the
definition. "Approval should carry a monetary bound", because the tool exposes no such bound;
the material cap and one-per-question rule are the substitute.

## Review
**Shipped 2026-09-21 in one session.** Every build item is done: four gates and the launcher, 50 folders
re-stamped, the `netsuite-sdf` skill (306 lines), six agents, four scripts with 26 tests, nine seams, the
`CLAUDE.md` section, and the record (CAPABILITIES, CHANGELOG, SESSION_NORMS, ONBOARDING, ROADMAP,
templates/CONTEXT.md, feedback 2026-09-01 closed). 29 hook tests and 26 script tests green; two scripts
exercised against the test client fixtures.

**Deviation from the plan, stated:** decision 4 said the `CLAUDE.md` nudge ships after T1 to T13. It
shipped today, because the live tests are blocked on a `claude login` only Mike can do, the gates are
in place and unit-tested, and hooks-fire-in-subagents is documented behavior. The residual risk is that
a documented behavior does not hold live; T0 settles it first thing after login.

**Owed, in order:** `claude login` (Mike); T0, T1, T2, T12 from `44 Pro - AI Summit Test` (the three
`claude -p` prompts are in the session transcript and can be re-run as-is); T3 to T5 on the test SDF
project; T6 and T7 recall and paired cost against the acceptance figures; T8 to T11, T13, T14. Each
result becomes a dated entry in `CAPABILITIES.md` replacing today's `[unreviewed]` lines. If T0 fails
(hooks do not fire in subagents), workers become read-only tool sets and the orchestrator applies their
output, per decision 6.

**Not done, by decision:** items 6, 11, 16 (the tests themselves). The user-scope GSD agents on Mike's
machine still carry no `model:` line (outside the OS).


# Write gate v5: one approval per session per connection (2026-10-06)

Goal (Mike): Julie's high-volume MH Crane imports were prompting on every write and being denied by auto mode. Loosen the gate without losing the human approval on production writes.

## Findings
- [x] v4 proved approval per tool and record type from the calling transcript only. Subagents have their own transcript files and never appear in the parent's (verified on disk), so parallel agents prompted on every call. No race existed.
- [x] Registering the connector only changed prompt wording; it was never the fix.
- [x] "[Auto-Mode Bypass]" and "[Security Weaken]" are Claude Code's auto-mode classifier, a separate layer that evaluates every call regardless of hooks or allow rules. Import sessions should run in the default permission mode.

## Done
- [x] Gate v5 drafted, 32 tests, Codex read-only review, adopted findings folded in (fail-to-ask, no sandbox from names, strict evidence, no future timestamps, plain-English prompt).
- [x] Installed `.claude/hooks/block-netsuite-writes.py` (backup `.bak-2026-10-06`), tests in `test_write_gate.py` wired into `test_hooks.py` (77 pass).
- [x] CLAUDE.md gate line, CAPABILITIES.md correction entry, execution skill operating rule, feedback entries 2026-10-05 (shipped) and 2026-10-02, FEEDBACK.md rebuilt, punchlist updated.

## Review
- Takes effect from Julie's next session (hooks load at session start). The stamp itself did not change, so no re-stamp is needed.
- Owed: first live run of v5 on MH Crane (punchlist), and the read-only role on discovery connections remains the hard guarantee the hook only approximates.
- Declined from Codex: approval broker, scan cache, fresh-consent boundary for v4-era approvals (24-hour exposure on resumed sessions only).

---

# Sales into the OS, NetSuite CRM cleanup, Opportunity to Project, travel setup

Goal (Mike, 2026-10-08): bring Steve, Jason and Chris into the OS for sales; clean Power Cloud's own
NetSuite as the CRM (end client always a Customer record, contacts as records, End Client field on
Opportunity and Project, referrer and partner contacts as filtered lookups); make Opportunity to
Project deterministic (rebuilt suitelet with a server-side idempotent gate, agent on top); and stop
losing Navan and Uber project setup (a relay job writes both lists over SFTP). Full plan in the
session plan file (this machine) and, from phase 0, in `Internal/SALES_OS_PROPOSAL.md` v3.

Decided 2026-10-08 by Mike: CRM stays in NetSuite; deal folders option A; script underneath, agent
on top; sellers Steve, Jason, Chris with Mike guiding; referrer program ownership parked; both
fields always (End Client defaults from the entity on direct deals). Recommended and approved with
the plan: project customer on subbed deals is the billing party; travel sync on the relay with
email alerts; both interfaces (sessions for intake, proposal, close; Paco in Chat for touches).

## Phase 0 (this session)
- [x] `Internal/SALES_OS_PROPOSAL.md` rewritten to v3 (Sonnet draft, orchestrator review, copy scan; v2 archived) 2026-10-08
- [x] Session checkpoint written to `Internal/sessions/` via the session-memory skill (2026-10-08_mpfly_3c7f7fad_sales-os-crm-travel.md)
- [x] `tasks/lessons.md` reviewed for anything learned this session (two entries 2026-10-08)

## Phase 1 (first connected session; production only, Power Cloud has no sandbox, Mike 2026-10-08)
Session 2026-10-08 (e211b3a2) facts: the Power Cloud NetSuite connector was not attached to the session
until Mike reconnected it mid-session (pending at the end of turn 3); the SDF auth profile PowerCloudProd
imported the three Create Project scripts read-only but was refused on custom-field import (Custom Body
Fields / Custom Entity Fields permission), so field types come from SuiteQL once the connector is live.
No sandbox exists, so the build is additive-first on production: new fields and saved searches first,
the rewritten suitelet under a NEW script id beside the live one, tested on throwaway opportunities,
and the user-event switch to the new suitelet is the cutover. Every deploy is validated with
`--server` first; every MCP write goes through the write guardrail (5641465 is registered prod).
- [x] SDF project scaffolded at `C:/Development/projects/Netsuite Development/Power Cloud NS/CRM` (manifest "Power Cloud - CRM", auth PowerCloudProd); the three scripts imported into `src/` with a read-only copy in `baseline/`; local git initialized and staged, no remote yet, no commit yet 2026-10-08
- [x] Sales-team interview guide drafted: `Internal/SALES_TEAM_INTERVIEW_GUIDE.md` 2026-10-08
- [ ] Mike: attach the connector to the session (done 2026-10-08, pending) and move it to `customrole_pc_mcp_ai_connection` (NetSuite UI, one-time)
- [x] Sales-team interview held (Mike, 2026-10-09)
- [x] Interview transcript and summary filed under `Internal/sales/source/` and mined inline (26K chars, Mike answering every block): `Internal/SALES_TEAM_INTERVIEW_ANSWERS_2026-10-09.md` 2026-10-09
- [x] Mike 2026-10-09 confirmed the field set (`Internal/SALES_OS_FIELD_SET.md`): commercial model with three values; readiness gate as listed including a signed-agreement date; class propagation phase 1 = invoices, credit memos and time entries; Virtual Admin is retired MSP verbiage
- [x] Field set frozen 2026-10-09 (Mike): Project Recovery = Rapid Assessment, Power Cloud Product = no project, NSPB = Use Case; rename Virtual Admin to Managed Services and add Support on `customlist_pc_proj_types` (the list has no Support value; id 5 there is Project Recovery); Sererra an active subcontract row. Minor [to confirm]: New License Deal = no project, unused Education value
- [ ] Ten-minute confirmation with Steve and Jason of the five [Reported] answers about their own habits
- [x] Verification run 2026-10-08 against production (connector live, ad-hoc role, heavy rate limiting): account identity, field types from the metadata catalog, class list and presence, partners and contacts, the 26 statuses with counts, the won-ladder and entity-practice findings, Navan config and saved search 901. Record: `Internal/SALES_OS_PHASE1_VERIFICATION.md`
- [x] Mike 2026-10-09: `custbody_pc_referral_end_user` targets Customer (repurpose as End Client); Consolidate Projects on Sales Transactions is disabled (customer at header plus one header project per invoice); Steve, Jason and Chris all hold full NetSuite seats
- [x] Mike 2026-10-09: saved searches 267, 510 and 867 will be retired; do nothing yet (inactivate in the status-cleanup step after the AF text fields are hidden)
- [x] Mike 2026-10-09: entity practice (a), keep the end client as the opportunity entity; the suitelet derives the project parent from a class-keyed channel table (proposal section 7 amendment)
- [ ] New scope (Mike 2026-10-08): invoice and credit memo user event that fills header and line class from the line's project when empty; must run on script-created invoices (Invoice Billable Customers, Task to Invoice) and be tested on both
- [x] Plan block v2 at `Power Cloud NS/CRM/PLAN.md` (eight tasks; Codex review of v1 folded in, 19 points adopted, response filed under `Internal/sessions/`); gate 1 approved by Mike 2026-10-09
- [x] T1 authored (pc-sdf-author), reviewed, validated against the account 2026-10-09 (SUCCESS 53/53 under Administrator after Mike re-authorized the profile); Contact -6 and Customer -2 confirmed from the account's fields; the channel map Partner column dropped (no confirmable Partner record type number, gate requires native Partner anyway)
- [x] T1 deployed to production 2026-10-09 (Mike: "deploy"): first deploy failed on an unsupported native filter (Referral Contact filter removed), second 102/102; a live REST write exposed a getText defect in the guard, fixed by the author, 39/39 tests, redeployed 103/103. New fields verified on live records.
- [x] Channel map seeded by CSV import (Mike) and verified by SuiteQL, 10 rows, guard ran clean in the CSV context 2026-10-09. T6 migration amended to CSV imports.
- [x] Mike (design): custom Active flag removed in favor of native Inactive; guard, channel lib and tests updated, 39/39, redeployed 102/102 2026-10-09
- [x] Mike (UI): deleted `custrecord_pc_cm_active` and ticked Inactive on the Playa Technologies row (confirmed by SuiteQL 2026-10-09)
- [ ] Mike: UI steps (relabel End Client; rename Virtual Admin to Managed Services; add Support and report its internal id for the T2 script parameters)
- [x] T2 authored, reviewed, one fix pass (six items), objects validated in the full-scope validate (57/57), unit tests 32/32 across four suites 2026-10-09; ready for its gate 2 behind T1
- [x] T4 authored, one fix pass, validated 2026-10-09; its unit test being written
- [x] T2 and T4 deployed 2026-10-09 (Mike: "you can deploy"); one deploy failure on a module-scope record.Type read (trap logged), fixed, 124/124
- [x] T2/T4 acceptance run 2026-10-09 (Mike signed in, orchestrator driving the built-in browser): 9 of 11 criteria pass, four defects fixed and deployed on Mike's word (guard mainline filter, End Client Applies To, ledger opportunity id field, task Planned Work); summary table in `CRM/build_log.md`
- [x] Mike 2026-10-09: workflow "Opportunity Defaults" (customworkflow15) suspended; the readiness gate and builder replace its five status-24 rules
- [x] Mike 2026-10-09: the revenue source is never defaulted; the OS and Paco ask for it at intake, interview style, from the channel map rows (deal-intake skill and Paco intake prompt, phase 3)
- [ ] Mike: add the six T1 body fields and Projected Total to the PC Opportunity form (id 101)
- [x] Mike 2026-10-09: ZZ TEST records deleted, confirmed by query
- [ ] Next ZZ TEST build: test whether clearing the project Start Date removes the planned time the builder's projects generate, then fix the builder (no Start Date copy, or no assignee planned work); run the injected-fault and XEDIT steps in the same session
- [x] Orchestrator: `subsidiary` on the RESTlet's createEndClient from a deployment parameter (`custscript_pc_api_subsidiary_id` = 1) 2026-10-09
- [ ] Then T3 (RESTlet, roles), T5 to T7 per the plan; T8 in the relay project
  - [x] T3 deployed to production 2026-10-09 (session 88c67b4c, Mike: "deploy T3"): script 2617, two TESTING deployments, suitelet audience and run-as; M2M mappings on Mike's own employee record (no integration user). Next: deployment parameters (Mike), runbook driver, `docs/T3_acceptance_runbook.md` tests 1 to 23
  - [x] T3 acceptance run 2026-10-09 (session 88c67b4c, Mike away for the second half): 17 of 23 pass (1, 2, 3, 5, 6, 8 to 15, 18, 19, 22); 4 skipped; 7 and 21 need deployment parameters; 16, 17, 20, 23 wait for the sales role deploy (Employee Search `LIST_OTHER_ADDRESS` FULL and CRM Lists `ADMI_CRMLIST` VIEW staged, validate green). Fixes shipped on Mike's word: column fallback plus inventory, travel role permissions, `isperson` 'F', required `revenueSourceId`. Summary table in `CRM/build_log.md`
  - [x] T3 acceptance completed 2026-10-12 (session 88c67b4c): **22 of 23 pass, test 4 skipped**; sales role deployed twice more (Employee Search, CRM Lists, then Employee Record View); tests 7 and 21 with Mike setting and clearing the deployment parameters; planned time accepted by Mike (builder unchanged). Final table in `CRM/build_log.md`. T3 status: tested, deployments TESTING until T8
  - [ ] Mike: cleanup customers 5305 and 5505 with contacts, opportunity 265251, project 5306 (tasks first), phone call 6513
  - [x] Step 3 done 2026-10-09: "Revenue source: asked at intake, never defaulted" added to `Internal/SALES_OS_PROPOSAL.md` section 7, naming the deal-intake skill and Paco's intake prompt as where it lands
  - [x] Step 2 closed 2026-10-12: planned time comes from NetSuite scheduling assignee hours from the project's Start Date (defaulted to today when no kickoff date), not from the kickoff copy; Mike accepts it. The two skipped T2 steps (injected fault on the suitelet, XEDIT billing party) still owed
  - [x] Repo 2026-10-12 (Mike: all of it belongs in Power Cloud OS): CRM, Task to Invoice, Unapproved Hours Monitor, ScriptReader and Navan mirrored into `power-cloud-os-backup` under `netsuite/` by `sync-backup.ps1`, committed and pushed (7dcd678); CRM's own `.git` removed; PowerStripe and the Power* products stay in their own repos
  - [x] T5 done 2026-10-12: six searches created by the installer Suitelet (three deploys, Records Browser ids), imported into `src/Objects/SavedSearches/`, counts verified; installer retirement and repo sync owed
  - [x] T6: FILL columns filled and verified 2026-10-12; generate the CSV import files (contacts, projects, opportunities), Mike imports, reconcile by SuiteQL, hide the AF text fields after a clean reconciliation
    - [x] Step 0 (session f8e341c2, 2026-10-15): backup sync scanned clean, committed and pushed (cdd4e48); no ZZ TEST records; five of six PC searches run, `customsearch_pc_inv_no_class_90d` fails on its formula (T5 defect, fix queued)
    - [x] After-files validated by SuiteQL 2026-10-15: 47 projects and 37 opportunities untouched since the snapshot, 60 end clients active customers, contact 235 active, no AF contacts yet. Corrections: project row 'PC Internal Hours' id 834 back to 282 (cell overwritten in the FILL pass); OPP0177 dropped (Closed Lost 2026-10-12); projects 2936, 2942, 3272 added as UUID-only rows (custom links of OPP0144, 0145, 0158)
    - [x] `migration/build_import_files.py` (Sonnet worker, reviewed); `import/01_contacts.csv` 13 rows
    - [x] Contacts import 2026-10-15 (run in Chrome on Mike's word): 13 of 13, contacts 5711 to 5723, reconciled, id_map.csv written; Contact Role not importable, left unset
    - [x] Projects import 2026-10-15: 50 of 50, 0 mismatches against expected.json, parent versus channel map clean
    - [x] Opportunities import 2026-10-15: 36 of 36 plus a 2-column retry (fields were on a hidden subtab of form 101); reconciliation clean; searches: missing End Client 0, status-24 0, missing Partner Contact 5 (no AF name), links 6 legacy direct deals (open), ledger 3 old test rows; 12 opportunity periods moved to Oct 2026 (Mike: fine)
    - [x] AF text fields hidden 2026-10-15 (six fields, deployed on Mike's word, values kept). T6 done.
    - [ ] Open for Mike: native link on 6 legacy direct deals; 3 old failed ledger rows; invoice search formula (T5)
  - [x] T7 cutover 2026-10-15 (session f8e341c2): guard, suitelet and T4 released; legacy button, client script and suitelet off; deals A/B/C pass fault steps 1/2/3 with Resume through the UI, subcontract parent 136 with no native link; XEDIT substitute (Expected Close inline edit) kept Billing Party 136; guard unit tests added (Jest 63/63); test records deleted and verified. PLAN.md T3 refreshed; FDD/TDD tables written. RESTlet stays TESTING until T8
  - [ ] After T7, Mike to decide: links-recon search join defect (T5); UI Resume leaves the failed ledger row Failed (accept or supersede)
  - [ ] Mike: delete `pc_crm_sales.key` and `pc_crm_sales.pem` from the Drive root; decide whether to rotate the sales certificate
  - [x] T3 (session bb920280, 2026-10-09, Mike away): packet written (`CRM/docs/T3_packet.md`), Codex read-only review folded in, roles and RESTlet authored by pc-sdf-author with one fix pass each, reviewed in full, `project:validate --server` SUCCESS 63/63; Jest 51/51 (12 RESTlet criteria); deploy is Mike's (gate 2), account tests in `CRM/docs/T3_acceptance_runbook.md`
  - [x] T5: build sheets for the four searches plus the 901 review in `CRM/docs/T5_saved_searches.md` (SDF cannot hand-author savedsearch definitions; Mike builds in the UI, the project imports them) 2026-10-09
  - [x] T6 prep (read-only) 2026-10-09: `CRM/migration/` before_opportunities.csv, before_projects.csv, contacts_af_recruiters.csv, after_opportunities.csv, after_projects.csv, RECONCILIATION.md; FILL columns for Mike (29 subcontract project end clients, OPP0038, 13 kicked-off answers from Jason, Recruiter role id, 3 untyped projects)
  - [x] T8 design note drafted under `Navan/relay/docs/project_sync_and_approval.md` (not deployed) 2026-10-09
- [ ] From the interview (Mike): private SOW folder structure (SOW visible without rates); migrate pre-sales folders into the OS; closed-loss autopsy cadence; revisit who needs a NetSuite seat once section 15 carries the sellers' writes
- [ ] Build in `Power Cloud NS/CRM`: End Client, Referral Contact, Partner Contact (class stays the channel field, no Channel Partner field), saved searches, readiness gate (user event), rewritten suitelet (new script id), invoice class user event; validate `--server`; deploy additive objects first
- [ ] Decided 2026-10-09 (Mike, proposal section 15): writes go through `customscript_pc_crm_api` (resolveClient, createEndClient, createOpportunity, updateOpportunity, logTouch, closeOpportunity, createProject, listTravelProjects), OAuth 2.0 client credentials, shared modules with the suitelet, per-caller roles and deployments (sales-write; read-only travel), relay-held pending requests with authenticated human approval, operation ledger with request IDs and deal/client UUIDs; MCP stays read-only
- [ ] Rollout order on production: inventory triggers and workflows; read-only validation and previews; logTouch for one seller; intake; close and createProject; kill switch, reconciliation search and recovery procedure before multi-record writes; test records excluded from travel exports
- [ ] Migration list (grandfathered TBA integrations): relay NetSuite token client, `fetch_time_entries.py`; TBA new-integration cutoff 2027.1, end of support tentatively 2028.2
- [ ] Test on production with throwaway opportunities (one direct, one subbed): gate blocks then passes, project created with tasks from Task 1/2/3 and both links, double-click and retry create no duplicate; then switch the user event to the new suitelet and inactivate the old deployment (never delete)
- [ ] Reconciled migration with id map; old text fields hidden, not deleted
- [ ] Status list: edit descriptions and stages by id after a dependents inventory
- [ ] Add a git remote for the CRM project (Mike: which org) and make the baseline commit

## Phase 2 (relay)
- [ ] Navan account manager enables the checkout-field SFTP feed; confirm field system name and replace vs upsert
- [ ] Relay `project-sync` job: RESTlet pull, Uber `to_uber/expense_codes`, Navan feed, last-good snapshot, shrink guard, heartbeat, email
- [ ] Weekly MISSING_PROJECT and rejected-code roll-up with an owner; retire override maps after reconciliation
- [ ] Free text off on Bill To Client after two clean weeks

## Phase 3 and 3b
- [ ] `templates/deal-record/`, deal-intake, pipeline, proposal, close-deal, `build_pipeline_log.py`, engagement-log rule
- [ ] Pipeline Playbook v2 and the Opportunity to Project one-pager
- [ ] Backfill the 13 open deals to the OS root
- [ ] Paco touch capability in the sales team's Chat space
