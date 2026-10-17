---
name: execution
description: Execute an approved Power Cloud plan for a client, task by task, using SuiteCloud SDF (and MCP for data operations). Three modes, rescue/optimization (work the approved task backlog), new implementation (base setup, then design sessions per process area that produce configuration tasks), and custom project (build one signed Use Case). Any net-new custom development in any mode owes a Use Case before build and an FDD & TDD handover at ship, both written by the customization-docs skill. Use when the user wants to start execution, "work on task X/Y/Z", "do Phase 1", derive the setup, "prep the O2C design session", or build/deploy a change. Runs write-enabled and sandbox-first from a client's execution/ subfolder. Covers backlog sync, setup derivation, design-session prep and mining, per-task planning, SDF/N-config/MCP/manual routing, sandbox-first build and test, production gates, and feeding actual hours back to baselines.
---

# Execution

The phase after the assessment is signed off. Discovery already identified and scoped the tasks; this skill turns the approved execution plan into deployed change with maximum automation and human gates only where they matter. It runs from `{Client}/execution/` (a subfolder of the discovery folder), so all discovery history is one level up.

**This is write-enabled work, unlike the assessment.** The read-only rule is scoped to assessment/discovery; here writes are permitted under the guardrails below. Never let write behavior leak back into a discovery session.

The SDF mechanics are handled by existing skills, do not reimplement them: `sdf-scaffold` (scaffold a project to Power Cloud standards), `netsuite-sdf` (SuiteScript/SDF authoring standards), `sdf-deploy` (deploy to sandbox/production), `ralph-loop` (bounded autonomous batches). This skill orchestrates the phase around them.

## Guardrails (always)

- **Sandbox-first, always.** Every change deploys and is tested in sandbox before production. Never deploy or data-write to production without an explicit human approval, one per deploy.
- **SDF is the default change mechanism** (version-controlled in git, reviewable as a diff, revertible). Prefer an SDF object over an ad-hoc MCP write wherever the change can be an SDF object.
- **MCP data-writes target the sandbox connection.** A production data-write requires explicit human go-ahead and a stated reason. SDF deploys via its own token, separate from MCP. The production write gate (`.claude/hooks/block-netsuite-writes.py`) asks once per session per connection for creates and updates, and once for deletes: issue the first production write of a session alone from the main conversation, and parallel agents are covered after it runs. Run import sessions in the default permission mode; auto mode's classifier blocks bulk writes and treats retries as bypass attempts.
- **Rollback note per task** before promotion; the execution-plan block already carries one.
- **Two human gates per task:** approve the plan, and approve the production deploy. Everything between (scaffold, author, validate, sandbox deploy, test) is automated.

## Setup (first run in a client's execution/ folder)

1. If `execution/` doesn't exist, create it and drop in `execution/CLAUDE.md` from `execution-CLAUDE.md.template` (in this skill folder), filling the `{Client}` and connection placeholders. Confirm with the user you are entering the execution phase.
2. Read the build spec and history: `../deliverables/{Client}_Execution_Plan.md` (the technical source of truth for how to build), `../CONTEXT.md`, `../working/evidence.md`. The discovery folder is read-only history; execution artifacts live in `execution/`.
3. Confirm the connection posture: a **sandbox** target for SDF and any MCP data-writes; the discovery prod connection stays read-only. If no sandbox connection is wired yet, execution is SDF-to-sandbox only until one is; say so rather than writing to prod.
4. **Backlog sync:** push the approved work items into Asana (the backlog/ticketing layer, swappable) if not already there, each ticket carrying its ID, priority, LOE, and a link back to its execution-plan block. The execution plan `.md` stays the source of truth for *how* to build; Asana mirrors human-facing *status*. Keep them in sync as tasks complete. Follow `../../ASANA_CONVENTIONS.md`: the status reporting runs on that data, and every reporting defect so far has traced to input hygiene rather than to the report.

## Three modes (read the engagement type from ../CONTEXT.md)

- **Rescue / optimization** (engagement type: rapid assessment / recovery): the tasks were fully identified in discovery. Work the backlog via **Kickoff by selection** and **The per-task loop** below.
- **New implementation** (engagement type: implementation, greenfield or re-implementation): the roadmap sets direction, but the detailed configuration work emerges in stages, base setup first, then per-process-area design sessions that each produce configuration tasks. Run **Implementation cadence** below; its output feeds the same per-task loop.
- **Custom project** (engagement type: custom project): one signed Use Case, worked as one or a few tasks. The [custom-project skill](../custom-project/SKILL.md) owns the scoped discovery before this point; this skill owns the build. Skip backlog sync and the implementation cadence entirely: the Use Case's proposed solution is the spec and its assumptions are the constraints. Go straight to **The per-task loop**, and do not invent a phasing structure for a single named deliverable. Note that a custom project's folder is `{Client}/{ProjectName}/execution/`, so the root reference files are three levels up (`../../../`) rather than two.

## Kickoff by selection

Execution starts when the user names what to work on: specific task IDs ("O2C.3, W.1") or a phase ("do Phase 1"). Pull those task blocks from the execution plan. Do not re-discover or re-scope the whole plan; work the selection.

## Implementation cadence (new implementations)

The rhythm is: base setup → design sessions per process area → configuration tasks → build. The tool's job across all of it is continuity: nothing from discovery or any design session may be lost on the way into configuration. Working structure inside `execution/`: `setup_checklist.md`, `design/{area}_brief.md`, `design/{area}_decisions.md`, `config_backlog.md`.

### 1. Base setup derivation
Derive the account setup from discovery, not from a generic template: every line traces to a discovery fact (subsidiaries/OneWorld posture, currencies, locations/bins, matrix items and other AFA features, approvals, roles). Route each line by the classification tiers below: emit a deployable `features.xml` for feature enablement, an `N/config` setup script for accounting/general preferences and company information, and a click-by-click checklist only for the true manual residue. Deploy to sandbox, then **verify via MCP reads that every setting actually landed as specified**, and record the result in `setup_checklist.md`. Same artifacts redeploy to production at the gate.

### 2. Design-session prep (per process area, before each session)
This is the pre-onsite-prep machinery from the rapid-assessment skill, run per area. Produce `design/{area}_brief.md`:
- Everything discovery captured about this area, requirements, pain points with quotes, volumes, current-state systems, pulled from `../working/evidence.md` and `../working/candidates.md`. The consultant must never depend on memory for what came up in discovery.
- The `../../NETSUITE_PLAYBOOK.md` patterns for the area turned into **design questions**: the specific decisions this session must exit with (e.g., for O2C: allocation strategy, deposit vs cash-sale timing, payout flow).
- Current account state: what base setup and prior sessions have already configured (verify via MCP, do not assume).
- Open items from earlier sessions or discovery that belong to this area (e.g., an unexplained integration goes on its area's agenda).
- A session agenda ordered by decision weight.

### 3. After each design session (mine and route)
The session transcript goes into `../source/` and is mined with the same candidate discipline as discovery (source-integrity check, exhaustive capture, dispositions). Two outputs:
- **`design/{area}_decisions.md`**: each decision with who made it and why. This is the contract for configuration and the memory for later sessions. Check new decisions against prior areas' decisions and flag contradictions explicitly; do not silently reconcile.
- **`config_backlog.md` entries**: the configuration tasks the decisions imply (forms, fields, custom records, workflows, scripts), each traced to its decision, classified by the routing tiers, and synced to Asana. Undecided items carry forward as open questions to the next session or a follow-up, never dropped.

### 4. Build
Config-backlog tasks flow into **The per-task loop** below, exactly like backlog tasks in rescue mode (plan if needed, build, sandbox, gate, promote, actuals). Batches of small similar config tasks (fields, forms) are natural `ralph-loop` candidates, sandbox-only as always.

## Custom development documentation (all three modes)

**Any net-new custom development owes a Use Case before it is built and an FDD & TDD handover when it ships.** The rule is attached to the work, not the engagement type, so it fires identically in all three modes. The **`customization-docs`** skill owns both documents: what triggers them, how they are written, and the LOE discipline. Call it; do not reimplement it here.

What this skill owns is the gating. The client's signed Use Case precedes gate 1 (plan approval), and the handover is a condition of closing the task. Inside a recovery or an implementation the pair is scoped to the work item, not the engagement, and the execution-plan block stays the internal build spec.

## The per-task loop

### 1. Plan the task (the step with judgment)
Research to ground the build: read the actual current scripts via Script Reader, query the account read-only to confirm current config, and check Oracle docs for the API/feature and current-release behavior. Interview the consultant to close design gaps (same habit as the assessment, now pointed at implementation choices). Then take one of **three exits**:
- **Ready to build** — enough is known; produce the implementation plan and proceed. **(Human approves the plan — gate 1.)** If the task is net-new custom development, the Use Case is written and signed first: see **Custom development documentation** above.
- **Needs the customer** — open questions only the client can answer. Produce a targeted question list / mini-agenda (the same question-list machinery the onsite-prep step builds), pause for the follow-up, bring the new transcript/notes into `../source/`, incorporate, then build.
- **Needs a spike** — the approach itself is undecided. Build a throwaway in the sandbox, demo it, let the consultant pick a route, then do the real build.

Never guess a design decision or silently drop an open question; ask or spike.

### 2. Route by the execution-plan classification
Each task is already classified. Follow it:
- **SDF-deployable** (scripts, workflows, custom records/fields/forms, saved searches, roles, **and feature enablement** via `AccountConfiguration/features.xml` in an account customization project): scaffold with `sdf-scaffold`, author to `netsuite-sdf` standards, validate locally. Exceptions on features: Terms-of-Service-gated features and Oracle's excluded list (PAYROLL, TBA, SAMLSSO, WORKFLOW, SERVERSIDESCRIPTING, etc.) cannot be set by SDF (Oracle: Account Configuration from an Account Customization Project). **Delegate:** once gate 1 has passed, hand the approved plan block, the `execution/sdf/` path, the acceptance criteria, and every existing-object ID you have confirmed from the account to `pc-sdf-author` (Sonnet); it authors to `netsuite-sdf` standards and hands back. You run `suitecloud project:validate` yourself and pass the output back for its fix pass. Review its Handback line by line: an `Unconfirmed references` entry is a stop, and an `Open decisions` entry goes back through step 1, never to the worker.
- **Script-automated config** (accounting preferences, general preferences, company information, accounting/tax periods): not SDF XML, but settable programmatically via a SuiteScript `N/config` setup script, deployed through SDF, run once, then retired (Oracle: Configuration APIs). Prefer this over manual clicking; it is auditable in git and repeatable sandbox-to-production.
- **Celigo/iPaaS change** (flow config, mappings, schedules, sync cadence, completing or fixing an integration flow): use the **`celigo` skill**, which owns the procedure and the guardrails. Headlines: API-first because the change stays inspectable and repeatable; custom flows are fully API-manageable while prebuilt Integration App settings are only partially reachable, so confirm before promising automation and fall back to a checklist for the rest; test against the Celigo sandbox or test store where one exists and say so plainly where none does; **a change to a live production flow is a production deploy and takes its own human gate**; capture the before state for rollback. Completing or building a flow is net-new custom development, so it also owes the `customization-docs` pair.
- **Scripted data fix** (SuiteQL + CSV import or Map/Reduce): build the job; run against **sandbox** first.
- **Manual config** (ToS-gated or SDF-excluded features, subsidiaries, **third-party bundle/SuiteApp installation**, and anything `N/config` does not expose): produce a click-by-click checklist for a human, with the exact navigation path. Bundle/SuiteApp installs have no programmatic path (CAPABILITIES.md); the pattern is human installs, Claude configures and operates the app afterward. Power Cloud's own SDF SuiteApps are the exception: they deploy via `suitecloud project:deploy`. This bucket should be small; before routing anything here, confirm it is genuinely not reachable by the tiers above.

### 3. Build, deploy to sandbox, test
Deploy to sandbox with `sdf-deploy`. Run the task's acceptance criteria and sandbox test plan (both already written in the execution-plan block). Capture results in `execution/build_log.md`. Iterate until the acceptance criteria pass. **Delegate:** test files written from the acceptance criteria (new files, never edits), JSDoc, the TDD tables, and the `build_log.md` entry from the captured output go to `pc-code-chores` (Haiku). The deploy, the security checklist in `netsuite-sdf`, and the pass or fail judgment stay here.

### 4. Review / UAT
Consultant, and where relevant the client, review in sandbox.

### 5. Promote to production (gate 2) and close

**At go-live** (new implementation mode): set the production connector's `status` to `live` in `.claude/hooks/ns_connectors.json` and the `Account status` line in CONTEXT.md. From then on creates and updates prompt once per session like any live account.
On sign-off, deploy to production with `sdf-deploy` (**human-approved, one gate per deploy**). Then: verify in prod against the acceptance criteria, record **actual hours** on the task, update the execution-plan status and the Asana ticket, and log the estimate-vs-actual delta for `../../LOE_BASELINES.md` (actuals beat estimates; note delivery mode). Confirm the rollback path is documented. **If the task was net-new custom development, the FDD & TDD handover ships before the task closes**, per **Custom development documentation** above; a task is not done without it.

**"Verify in prod" means confirmed active, not just deployed.** A `project:deploy` exit code of 0 and a deployment record showing `Status: Released` are not evidence the script runs. For a script deployment specifically, confirm the **`Deployed` checkbox** itself (a separate, independent switch from `Status`) and observe a **real trigger actually fire** in prod, e.g. a genuine record save or integration write producing the expected result, not merely that the object validated and uploaded cleanly. A deployment can sit fully "released" and inactive indefinitely with no error anywhere to catch it. Confirmed the hard way on Upward's Navan Integration custom project (2026-09-28): a script sat inactive in prod for three days, reported as "delivered and live," before a full troubleshooting cycle (custom-list value check, manual re-save test) traced it back to this one unchecked box.

## Interaction modes

- **Interactive per-task (default).** For anything with design judgment or production risk. Human at both gates.
- **Bounded autonomous (`ralph-loop`) for batches.** For a queue of well-specified, low-risk, similar tasks (form simplifications, field adds, small validations), loop build to validate to sandbox-test across the set and hand back a batch to review. **Autonomy stops at the sandbox; production deploys are always an individual human gate.** Log what was dropped or deferred, never silently.

## Learning capture (in flight)
Before assuming what the tooling can do, check `../../CAPABILITIES.md`; it wins until re-tested. When a build proves a capability assumption right or wrong (an SDF object type that behaves unexpectedly, an API limit hit, an N/config field that is not settable), append a dated `[unreviewed]` entry to `../../CAPABILITIES.md` and note it in `execution/learnings.md` at the moment of discovery. When a design session or task plan lands a notable business decision (a solution shape, a configuration pattern), log it in `execution/learnings.md` as a best-practice candidate; in implementation mode, the per-area decision logs feed this automatically.

## After a phase or batch ships
Update `execution/build_log.md` and propose baseline updates to `../../LOE_BASELINES.md` from the actual hours (harvest only from delivered, human-approved work, never from estimates). Note any pattern worth adding to `../../NETSUITE_PLAYBOOK.md` and any process learning. Present proposals; the user commits to the root files.

**Learnings triage (never skipped).** Walk `execution/learnings.md` with the user; every entry gets a user-decided disposition (AskUserQuestion for the promotions): capability entries confirmed or corrected in `../../CAPABILITIES.md` (drop `[unreviewed]`); decision entries promoted to `../../NETSUITE_PLAYBOOK.md` as best practice, kept engagement-specific, or discarded. Nothing promotes without the user; nothing vanishes silently.
