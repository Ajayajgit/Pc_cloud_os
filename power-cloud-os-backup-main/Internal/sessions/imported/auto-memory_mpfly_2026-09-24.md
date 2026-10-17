---
date: 2026-09-24
who: mike
source: auto-memory import from DESKTOP-D9N9HIP (user mpfly)
---

# Imported auto-memory (Mike, 2026-09-24)

These were Claude Code auto-memory entries on one of Mike's machines, which no other consultant or machine could see. Imported verbatim when session memory shipped (tasks/todo.md, "Shared session memory", D4). Each reflects what was true on its own date; the spec it names wins where they disagree. Only "mike-owns-google-drive-admin" stays active in local memory, because it is about the person.

## jev-evaluated-parked

_TypeSafe AI's Jev decision model was evaluated 2026-09-21 and parked; no fit for the folder-based OS, possible fit for the portal later_ (last modified 2026-09-21)

On 2026-09-21 Mike asked whether Jev (TypeSafe AI's "System One" typed-decision model, launched 2026-09-15) could replace OS functions and save Claude usage. Decision: **no action now, revisit in later revisions.**

**Why:** Jev returns probabilities over a fixed answer set and cannot write. OS usage is consultants' Claude Code sessions reading transcripts and drafting deliverables, so Jev cannot remove those tokens. The OS has almost no programmatic model calls to swap (render gate is regex, Paco routing is deterministic by design, only Paco's off-by-default health read calls the Anthropic API). Using it would also add TypeSafe as a sub-processor needing client consent.

**How to apply:** Do not re-research Jev from scratch. The candidate fits, if ever revisited, are Celigo error-row classification (the one place it would remove session tokens) and the portal's own branch points (intake routing, task-state classification, tool-call guardrails). Never use it to pre-filter transcript chunks; that contradicts exhaustive candidate capture. See [[portal-beta-plan]].

## loe-stakes-and-msp-pivot

_LOE always gets human eyes, and the practice may pivot from LOE to MSP pricing; keep LOE calibration effort light_ (last modified 2026-08-17)

Mike's guidance (2026-08-16, after the first ACFB retro surfaced a ~1.5x draft-vs-delivered gap):
LOE figures will "almost always" get human eyes and tweaks before anything ships, so the human review
is the standing control, and there is "a really good chance" the practice pivots away from LOE-based
commercial framing toward forcing clients into MSP (managed services) arrangements. "No concerns for
now."

**Why:** the LOE calibration loop (loe_log comparisons, baseline harvesting) is a drafting aid, not a
high-stakes accuracy program. Its value is making the human review faster, not replacing it. And if
the MSP pivot happens, hours-based framing in the assessment deliverable may be replaced wholesale.

**How to apply:** keep retros light on LOE harvesting (confirm-or-tweak, not deep comparisons); do not
build more LOE calibration machinery without being asked; treat `LOE_BASELINES.md` entries as
first-draft anchors. If the MSP pivot becomes real, the assessment's commercial framing (LOE columns,
phasing hours, funding decision) becomes a skill/WRITING_STANDARDS change, and that is Mike's call to
initiate. MSP strategy is internal; never write it into client-facing files or shared skills
(the MSP-leakage bug in the changelog is the cautionary case). See [[powercloud-os-workspace-conventions]].

## meeting-ingest-plan

_Paco (roadmap A7, live 2026-09-14) files Meet recordings and delivers the Monday dashboard; a third capability, the weekly board update (exec summary link + Asana tasks needing attention) to each client internal team space, was built, DEPLOYED and posted live to Bixbi on 2026-09-14; PACO.md at root is the session-facing spec, Internal/paco-documentation/ (files 01-05) the private runbook_ (last modified 2026-09-14)

Mike raised meeting ingest on 2026-09-11 as a must-have before the portal. A collaborator built it in the
following days and handed off on 2026-09-14 as **Paco**: a Google Chat app with a private DM to each of 27
staff accounts, three polling jobs on the Monday-dashboard VPS, and a SQLite ledger. Mike wants Paco treated
as a **reusable Chat identity** for future OS capabilities, not a one-off meeting bot.

What was built (differs from the 2026-09-11 design note): flat `{Client}/source/` filing (no
`source/meetings/`); originals moved with IDs preserved plus a `- notes [hash].md` export and a
`- meeting.md` provenance file; generated `working/meetings_log.md`; routing = attendee domains then full-name
title match, then ask the organizer; **no classifier, no alias learning, no reminders, no second
confirmation** (clicking the client is the approval). Index reads `NetSuite customer`, `Email domains`,
`Meeting aliases` from each CONTEXT.md; the template gained the aliases line 2026-09-14. Monday dashboard
delivery also moved onto Paco (NetSuite still schedules; Paco is the sender via a sealed Pub/Sub queue).

Where things live: root `PACO.md` (what sessions and consultants need, no infra identifiers);
`Internal/paco-documentation/` (five-file handoff: architecture, ops runbook, Monday integration,
validation and remaining work); Python source and NetSuite scripts under the Power Cloud NS development
area on Mike's machine (paths in the runbook, not a git repo at handoff).

**How to apply:** for a new Paco capability, follow the six-point contract in PACO.md section 7 (reuse
identity and outbox, own authorization and state, private by default, silent registration, suggestions
are not permission). Open follow-ups from the handoff: credential-expiry ownership and state backups,
arbitrary attachments, late artifacts, undo, prospect adoption into new-engagement, engagement-log meeting
columns. Related: [[portal-beta-plan]], [[os-runs-on-heterogeneous-machines]],
[[powercloud-os-workspace-conventions]].

**Third capability, built and deployed 2026-09-14: the weekly board update.** Mike amended the first cut the same day: Monday 10:00 ET, post the exec summary as a link (Paco finds `working/exec_summary_{date}.md` and the rendered deliverable in Drive; it does not write the summary), and call out tasks needing attention as a separate message. Deployed over SSH (root@178.156.153.168, key `~/.ssh/id_ed25519`; box is Python 3.10, hostname mike-trade-bot); timer live; token-missing admin note verified in Mike's DM. Went live the same session: Mike made the Asana token and added Paco to the Bixbi space, all six members were verified against the staff roster before the space was allowed, and both messages delivered. Live lesson: `paco-chat` holds the SQLite ledger lock during its blocking pull, so any new Paco job must wait for the lock rather than try once; a weekly job that loses that race loses a week (`acquire_ledger`, and note the lock raises `PermissionError` on Windows, `BlockingIOError` on Linux). The Asana token inherits Mike's own access, so `44 Pro` and TipHaus are 403 until he joins those projects, and only six of thirty-three records declare an Asana project at all. The static `board_spaces` allowlist was then removed in favour of a live audience check: before every post Paco reads the space membership and refuses unless every person is internal (Chat returns `affiliation` and `domainId` per member, plus a joined-count that catches truncated reads). A list could not see a client joining an approved space later, and the MH Crane space really does hold an outside consultancy. Onboarding a client is now the interview plus adding Paco to the space; `.claude/scripts/check_board_mapping.py` reports readiness with no credentials. Open: whether a scheduled routine should generate the exec summary draft weekly, and whether to take the `chat.memberships.app` delegation scope so Paco can join spaces itself. Mike asked
for the exec summary's Asana review made proactive, posted by Paco into each project's Google Chat the way
the Monday dashboard is. Code: `meeting_ingest/paco_board.py` (+ `core.py` index fields `asana_project`,
`chat_space`; `paco_worker.py` board gate; `deploy/paco-board.*`; 25 tests, suite green at 140) in the
Monday Morning development area. Decisions taken in the session, for Mike to confirm before deploy:
internal team spaces only (roadmap decision 1 makes client-facing summaries human-reviewed, an automated
post cannot be); mapping via CONTEXT.md `Asana project` + new `Project chat` line, gated by a VPS
`board_spaces` allowlist; Monday 08:30 ET before the dashboard; one post per client per ISO week;
Claude health read (Opus 5 default, configurable) fails soft to facts only; nothing written to client
folders yet. Runbook with config keys, credentials (Asana PAT + Anthropic key on the VPS) and deploy
steps: `Internal/paco-documentation/05-board-updates.md`. Still owed after deploy: ONBOARDING.md bullet
and re-render, a `working/` board snapshot for the exec summary. Tooling fact recorded in CAPABILITIES:
stock Windows Python has no IANA tz database, so OS scripts needing Eastern time ship a fallback.

## mike-owns-google-drive-admin

_Mike handles Google Drive permissions and sharing himself; don't research or explain that mechanism to him_ (last modified 2026-08-12)

Mike administers the Power Cloud shared drive and is fluent in Drive permissions. When he asks for a folder whose visibility will be restricted, build the folder structure and stop there.

**Why:** On 2026-08-12 he asked for an `Internal/` folder he could "restrict visibility to." I started researching Google's limited-access feature for shared drives and he cut it off: "I'm comfortable with google drive permissions. No need to take care of that part for me." The research was real but he already knew it, so it was wasted turn time on a task he'd scoped narrower than I read it.

**How to apply:** For anything Drive-side (sharing, member access, restricted folders, trash recovery), do the filesystem work and hand off the permission step with one sentence. He'll say if he wants the mechanism explained. Same instinct generalizes: he scopes his asks tightly, so treat an unstated adjacent step as his rather than mine unless he says otherwise. Related: [[powercloud-os-workspace-conventions]].

## model-tiering-shipped

_Model tiering shipped 2026-09-21 (six pc-* worker agents, gates in the client stamp, Fable escalation behind a hook); live in-session confirmation still owed, blocked on claude login_ (last modified 2026-09-21)

On 2026-09-21 Mike approved and Claude shipped the model-tiering layer for the Power Cloud OS: the session model orchestrates, six worker agents at root `.claude/agents/` (Sonnet: `pc-sdf-author`, `pc-transcript-miner`; Haiku: `pc-code-chores`, `pc-data-condenser`, `pc-qa-inspector`; Fable: `pc-escalation`) take mundane steps by default, deterministic work went to four new scripts, and a real `netsuite-sdf` skill now lives in the OS (Mike's user-scope stub deleted with his go-ahead). Four gates ride the client stamp through a cwd-independent launcher (`pc_hooks.py`): render, scope, escalation (fails closed), NetSuite write guardrail. All 50 client and nested folders re-stamped.

**Decisions Mike made:** Ollama stays out of the OS (heterogeneous machines). Tiering by shape of work, client-facing drafting stays with the session model. Codex review used as advisory input only; Mike explicitly said not to take it as fact.

**Why:** "You don't need Fable to write a PDF" (roadmap principle 7); usage opacity and a burned day's quota at the summit; Mike wants strong models orchestrating and cheap models on mundane work, especially coding, without prompting.

**How to apply:** The plan and its verification table are `tasks/todo.md` in the OS root. **Owed:** live tests T0, T1, T2, T12 to T14 from a session started inside `44 Pro - AI Summit Test` (the `claude -p` runs failed on an expired CLI OAuth session; `claude login` is Mike's step), then the stage 02 recall and paired cost measurements (T6, T7) with the predeclared acceptance figures. Do not re-plan this; pick up at the owed tests. Related: [[loe-stakes-and-msp-pivot]], [[os-runs-on-heterogeneous-machines]], [[portal-beta-plan]], [[jev-evaluated-parked]].

## os-backup-repo

_Where the Power Cloud OS backup repo lives and how to snapshot it_ (last modified 2026-08-17)

The Power Cloud OS files are backed up (as of 2026-08-16) to a git repo at
`C:\Users\mpfly\source\repos\power-cloud-os-backup`, pushed to the private GitHub repo
`powercloud-mike/power-cloud-os-backup`. Google Drive stays the working and sharing copy;
the repo is backup and version history only.

**Checked 2026-09-14: the local repo path no longer exists on this machine, `~/source` is gone, git has no global user identity configured, and `gh` is not authenticated.** Nothing can be committed or pushed from a session until one of those is restored, and whether the GitHub repo still exists could not be verified without auth. Treat the backup as lapsed, not working. Separately, the Paco service source (`Monday Morning/meeting_ingest/`) has never been a git repository, so the board-update code written on 2026-09-14 exists only on Mike's machine and the VPS.

**Why:** git cannot run safely inside the Shared Drive folder. Drive for Desktop syncs the
many small files in `.git`, can capture them mid-write, and has no locking between machines,
so two mounted computers can corrupt the object store.

**How to apply (2026-09-14 onward):** run `python ".claude/scripts/sync_os_backup.py"` from the
OS workspace. That script replaced `sync-backup.ps1` and lives on the drive rather than in the
repo, which is the fix for the failure that prompted it: the old script existed only inside one
machine's clone, so from any other machine there was no way to back anything up. It mirrors the
same allowlist (root files, `.claude/`, `fonts/`, `logos/`, `templates/`, `Internal/`) into `os/`,
adds the Paco service source under `paco/`, excludes client folders structurally, and stops on an
unrecognised top-level folder. `core.autocrlf=false` plus `* -text` keep restores byte-identical.
`--dry-run` reports without writing; `--push` needs credentials.

**Paco counts as part of the OS** (Mike, 2026-09-14), so its source is inside this repo rather
than a separate one. Under `paco/` the repo is the canonical copy, not a mirror: that tree has
never been version controlled anywhere else. A machine without the dev tree keeps whatever the
repo already had rather than deleting it.

**What the repo is for** (Mike, 2026-09-14): a git copy of the OS itself, without client material, to branch from when Power Cloud builds its own platform and leaves the folder structure behind. Backup is a side benefit, not the point, because Drive already covers that. The sync therefore runs one way only, Drive to repo, and **that is the finished design rather than half of one**: do not build a repo-to-Drive publish direction without checking the decision has changed, since it would create two writable copies of the same methodology. `sync-backup.ps1` now refuses to run off `main` or with a dirty tree, because its mirror copy would otherwise commit Drive state onto a branch or silently destroy uncommitted work.

**Client information:** no client folders or material of any kind, enforced by the allowlist plus `.gitignore`. Client *names* appear throughout the kept docs (about thirty files mention Teppermans), because the methodology is taught through real examples, and a few named individuals appear too. Fine for a private repo; needs a scrub before anything is shared outside Power Cloud.

**Resolved 2026-09-14:** the repo was found unreachable (clone on another machine, no auth here). Mike ran `gh auth login`; the remote existed and was cloned to this machine, so the August history survived and everything since is pushed. A replacement sync script written while it was unreachable was deleted, because `sync-backup.ps1` was inside the repo all along and better. See [[portal-beta-plan]] for the platform work the branching is aimed at.


See [[powercloud-os-workspace-conventions]].

## os-runs-on-heterogeneous-machines

_The OS runs on every consultant's own laptop; hardware varies, so tooling must never depend on the current machine's GPU or specs_ (last modified ?)

Any tooling added to the Power Cloud OS must work the same on an arbitrary consultant's Windows laptop with no GPU. Mike corrected a GPU-local transcription proposal on 2026-09-03 for this reason.

**Why:** The OS is a shared Drive folder used by the whole team; Mike's machine (RTX 5070) is not representative. A tool that only runs well here creates a two-tier experience.

**How to apply:** Do not probe local hardware to shape an OS-level recommendation. Default to hosted APIs (per-user key kept off the shared Drive, see DATA_CONNECTORS.md rule 1) or a CPU-safe fallback. Related: [[powercloud-os-workspace-conventions]], [[team-facing-os-guides]].

## portal-beta-plan

_Internal/PORTAL_BETA_PLAN.md is v5 (2026-09-11): Mike's 2026-08-22 decisions (one continuous build, Mike + Claude Code build it, US-only data) plus the Sept 2026 independent review outcome (architecture confirmed, events table + customer/engagement/workstream hierarchy in phase 0, shared conversation post-launch, OpenAI backbone and managed-host runner declined)_ (last modified 2026-08-22)

On 2026-08-22 Mike asked to plan the Power Cloud app beta (own interface, same skills, replace Asana,
client comments and LOE approvals). The plan lives at `Internal/PORTAL_BETA_PLAN.md` (draft v2, revised
after a three-reviewer adversarial pass same day) and as a private artifact at
https://claude.ai/code/artifact/3ac5cc5a-f478-4128-b9eb-9d7d2cdeed51 (favicon 🏗️, keep URL stable on updates).

Key structure: Beta 1 (10-13 wks) = work layer replacing Asana + approval ledger + client portal;
Beta 2 (6-8 wks) = agent workbench on the Claude Agent SDK, gated on a per-session container jail and
egress allowlist. Stack: Next.js/Vercel + Supabase (JWT-claims RLS) + one Linux VM + Drive API direct
(no second sync client). Server writes only portal-owned generated files (tasks.md, approvals.md) in
Beta 1 because Drive API has no conditional write.

**Decisions recorded 2026-08-22 (interview, plan section 8):** decision 8 and the boundary rule are
AMENDED (yes on both); one continuous build with a single launch, the Beta 1/2 split is build order
only; **the AI engineer is not joining; Mike builds it with Claude Code doing the work** (roadmap's
"Notes for the AI engineer" section is now stale, flagged but not edited); new dedicated shared drive
for A13 (OS at drive root, old drive legacied with shortcut); name = Power Cloud Portal; **all data
stays in US** (Hetzner US-soil vs US-owned-vendor check open); Mike dogfoods his own book during build;
MSA: Mike hands it over, Claude drafts, attorney reviews; Taha is second admin; session budgets
$2/$10/$25 + ~$50/seat/day and ~$75/client/day approved as starting values. Still open: which 2-3
clients get first invites, the MSA handoff itself, A13 execution (before Sept 3 ideally). The approvable
object is a commercial-terms snapshot, deliberately MSP-proof (see [[loe-stakes-and-msp-pivot]]).

**Modularity is a requirement, not a preference (Mike, 2026-08-22):** the AI engine, Vercel, and
Supabase must all be swappable, including a future path to open-weight models. Carried as plan section
3.4: the runner exposes our own event API (SDK message format never leaks into app/DB/UI), skills/MCP/
Postgres-policy stay engine-neutral, C6 fixture suite is the swap test, no Vercel-proprietary services,
migrations in repo, weekly pg_dump, cost triggers ~$100/mo Vercel and ~$150/mo Supabase.

**How to apply:** if work starts on the portal, the plan is the spec and its section 8 decision list is
the open-items register; check whether Mike has reviewed before building. A13 (shared-drive migration,
see [[powercloud-os-workspace-conventions]]) is a hard prerequisite of phase 0.

**Sept 2026 independent review (recorded 2026-09-11, roadmap section 6b, plan bumped to v5):** the outside
evaluation converged on the plan's stack and file/DB split; Mike agreed with treating it as confirmation.
Adopted: domain events table and customer > engagement > workstream hierarchy in the phase 0 schema; D1 shared
project conversation (post-launch, seeded from two-lane comments, AI participant gated on the phase 4 jail);
D2 permission-filtered context assembly (noted, not scheduled). Declined: OpenAI Agents SDK as orchestration
backbone (Agent SDK runs skills/hooks/MCP natively; portability lives at the runner seam), Railway/Fly for the
runner (jail + egress allowlist need an owned VM), conversation-before-work-model ordering, moving
candidates/evidence/verification out of files. Roadmap Section B now maps the old v0.1-v0.4 sketch onto the
plan's phases and carries no parallel phase list; AI-engineer references are retired. Review docs filed at
`Internal/2026-09 Independent Review - *.md`.

**2026-09-11 (Mike):** roadmap items A15 (client-approval + dev-review gate) and A19 (adoption/friction telemetry) were
removed from the roadmap; no interim Asana gate or session-log script gets built. Both live in the portal (roadmap decision
26; A15 = plan section 4 item 8, phase 3 flip; A19 = post-launch telemetry). Mike also declined any further status marking
or re-sequencing of Waves 2 and 3 (decision 27): the unbuilt items stay as written and surface during the build.

## powercloud-os-workspace-conventions

_Why the Power Cloud OS root is deliberately flat, and what Internal/ Archive/ logos/ are for_ (last modified 2026-08-17)

The workspace root is **deliberately flat** and should stay that way. On 2026-08-12 Mike asked whether the loose reference files should be nested into a folder structure. We measured it and decided against.

**Why:** Of 77 references to the 11 root reference files across CLAUDE.md, the skills, and the templates, only 14 are real paths (`../WRITING_STANDARDS.md`). The other 63 are bare filename mentions in prose ("read `WRITING_STANDARDS.md` before drafting"). Nesting would not break loudly, it would fail silently: Claude gets told to consult a file, looks one level up from the client folder where every other reference lives, doesn't find it, and proceeds without the rules that govern client-facing voice. The deliverable still renders, just worse, and nobody catches it. A 95%-complete version of that change is worse than not doing it. The second reason is that CLAUDE.md's reference section already *is* the index; a folder tree would be a redundant second copy of it that can drift. Revisit only past roughly 25-30 root files, when the list stops being scannable.

**How to apply:** Add new shared reference files flat at the root and add a pointer line to CLAUDE.md's reference section. Don't propose a `reference/` folder again unless the file count roughly doubles.

Three root folders carry rules worth knowing:

- **`Internal/`** is Power Cloud's own strategy and ops, access-restricted in Drive by Mike. Nothing in the engagement workflow reads from it, which is the property that makes the restriction safe: a consultant without access still runs the whole process. Never copy its contents into a client deliverable, never put client material in it. Holds the OS roadmap, AI summit transcripts, session norms, sales-to-delivery, `provisioning/`, and `ROLLOUT_PUNCHLIST.md`.
- **`Archive/`** is superseded material, named `SUPERSEDED {date} - {original name}`. Never cited or updated. Archiving beats deleting here and Mike has accepted that call repeatedly; it's reversible and Drive trash only holds 30 days.
- **`logos/`** holds Power Cloud's mark plus vendor/platform logos (NetSuite, Celigo, SPS). **Client logos never go there** - they stay in that client's folder, as the client's asset licensed for their engagement, not for reuse across the practice.

**Client work stays in the client folder.** On 2026-08-16 an ICM restructure proposed moving the
build/dev project folders (`Teppermans`, `Upward Projects`, `Brixton`) out to the Netsuite Development
area. Mike rejected it: the work belongs with the client it was done for, regardless of whether it is
assessment artifacts or SDF/script development. Structures must be designed to hold build work inside
the client record, never to relocate it. Practice *tooling* (render scripts, validators) is the one
exception and even then it is extracted by copy, leaving the client's copy as the record of that run.

**A client folder is a copy of `templates/client-record/`**, not folders created by hand (added
2026-08-16). `ENGAGEMENT_LOG.md` at root is generated by `.claude/scripts/build_engagement_log.py`
from what each engagement wrote to disk; never hand-edit it.

Related: [[mike-owns-google-drive-admin]], [[os-backup-repo]].

## sales-os-proposal

_Sales pipeline design at Internal/SALES_OS_PROPOSAL.md, v2 2026-08-28, awaiting Mike's 11 decisions_ (last modified 2026-08-28)

`Internal/SALES_OS_PROPOSAL.md` (v2, 2026-08-28) proposes bringing the sales process into the OS. Core design after Mike's v1 review: **a deal is a client folder that has not won yet**, born at the OS root with DEAL.md (CONTEXT.md's sales sibling), never moves; winning adds CONTEXT.md next to it. Four skills (deal-intake / pipeline / proposal / close-deal), generated PIPELINE.md; the enforcement loop is PREP for the already-existing Monday pipeline review meeting (talking points + flags, gaps fixed in the prep session), not a new meeting. The pipeline skill also does call prep (cheat sheet: must-answer questions, who to focus on, formalizing the Zellerfeld pattern Mike liked) and the open in-call session as source of truth. NetSuite channel model uses NO new fields: entity = billing party (subcontractor on subbed deals, per Mike), class = channel (class 5 = Anderson Frank, verified from the Create Project suitelet source, script 1820 chain), native partner field stays referral attribution. close-deal replaces the Create Project button (kept as fallback, then retired). No new interface; portal convergence post-beta.

**Why:** Mike's corrections 2026-08-28: wanted the folder question answered concretely (he leaned never-moves), gave the entity convention, pointed at script 1820, and asked for a day-in-the-life narrative because he does not do the sales job himself.

**How to apply:** 11 decisions in section 10; phases 1-2 need only decisions 1, 6, 7. The section 4 narrative and channel mapping are hypotheses to validate in a sales-team interview (phase 1). Companion: `Internal/SALES_TEAM_GUIDE.md` ("The Pipeline Playbook") is the team-facing version, day-to-day only, architecture and decisions stripped (Mike decides those privately); it includes the stage-by-stage field interview lists and the through-handover sequence, and stays location-agnostic so it survives the folder decision either way. Related: [[portal-beta-plan]], [[loe-stakes-and-msp-pivot]].

## team-facing-os-guides

_The two documents the team reads about the OS, and where each is published from_ (last modified 2026-08-22)

Two team-facing guides explain the OS, and they are produced differently.

1. **"How to Work in the Power Cloud OS"** (.docx + .pdf at the workspace root). The practical how-to Mike distributes. **Generated from `ONBOARDING.md`** by `.claude/scripts/render_os_guide.py`; edit the markdown and re-render, never the docx.
2. **"The Power Cloud OS"** capabilities briefing, published as an artifact at https://claude.ai/code/artifact/8a9558a4-e806-473f-bfa7-f9b5c4cfb608 and shared with specific people, who see updates immediately. Source is `The Power Cloud OS.html` at the workspace root; republish with that URL so the link stays stable. Favicon ☁️ (the original could not be recovered on 2026-08-22, so this may differ from the first publish).

Both name the workspace root path throughout, so the pending shared-drive move ([[powercloud-os-workspace-conventions]]) will force a pass on both.
