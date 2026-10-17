# Power Cloud Portal: Beta Plan and Architecture

Drafted 2026-08-22 by Claude Code. Status: v5, decisions recorded. v1 was revised the same day after a three-reviewer adversarial pass (roadmap fidelity, technical/security, product/delivery); the material changes were the Beta 1 / Beta 2 split, the removal of an unimplementable Drive write primitive, and named security mechanisms where v1 had assertions. v3 added section 3.4 (modularity and exit paths) per Mike's direction: the AI engine, Vercel, and Supabase must all be swappable, including a path to open-weight models. v4 records Mike's decisions from the 2026-08-22 interview (section 8), including the two headline changes: **one continuous build with a single launch** (no separate Beta 1 release; the split survives as build order), and **Mike builds it with Claude Code doing the work** (the AI engineer is not joining). v5 (2026-09-11) records the outcome of the September 2026 independent review: architecture confirmed; two phase 0 schema additions (a domain events table and the customer, engagement, workstream hierarchy); shared project conversation added as a post-launch item; the review's OpenAI orchestration backbone and managed-host runner declined. Decisions and reasoning in roadmap section 6b.

Sources: `POWERCLOUD_OS_ROADMAP.md` (Section B, decisions 3, 8, 16, items A15/A17/A19), the 2026-08-21 Mike + Taha discussion notes, the workspace as built, and six research passes run 2026-08-22 (OS capability inventory, Claude Agent SDK docs, portal product patterns, multi-tenant security, data architecture, stack selection). Load-bearing external claims carry citations inline.

---

## 1. What we are building

The Power Cloud Portal. A web app where:

1. **The work layer replaces Asana** (roadmap decision 3, made 2026-08-11): tasks with statuses, owners, due dates, estimates, comments, attachments, and a migration path for open Asana tasks.
2. **Clients get a portal**: they see their client-visible work items and tasks, comment, and formally approve work items and LOEs. The approval record is the mechanism behind decision 16 / item A15 (no build without verified client approval), moved from "a comment on an Asana task" to a first-class, tamper-evident record.
3. **Consultants work engagements through our own interface**: client tiles, engagement status, dashboards, and, in Beta 2, live agent sessions running the same skills this workspace runs today, streamed into the browser.

**Two roadmap amendments, made explicit rather than smuggled in. Both decided yes by Mike, 2026-08-22 (section 8):**

- **Decision 8 is amended.** Its recorded core is "nothing built until the portal proves itself internally." Building client view/comment/approve now changes that sequencing. What stays intact is the v0.4 phase description's constraint set: clients never trigger agent sessions, never see AI output a human has not promoted, and never burn tokens. Consent and MSA language were already kept compatible, so the amendment is about timing, and it is still an amendment.
- **The boundary rule is extended, not quoted.** The roadmap's rule is "index in a database, own in files," unqualified. This plan grants the database *ownership* of one layer: tasks, comments, approvals, notifications, telemetry. The argument: the doctrine protects engagement knowledge, the material a future session or human must reconstruct the engagement from. The interactive coordination layer was never file-owned; it lived in Asana, and decision 3 already sanctioned replacing Asana. Replacing it with Postgres rows changes the vendor, not the doctrine. Everything that is engagement knowledge stays markdown on the shared drive, and the portal renders generated snapshots into the folders so the walk test survives (section 3.3). Proposed amended wording: **files own engagement knowledge; the database owns the interactive coordination layer formerly in Asana; generated snapshots keep the folder narrative complete.**

### The beta in one sentence per audience

For consultants: one place to see every engagement, work every task, and stop paying for Asana. For clients: one page that shows what needs their decision, and a real record of what they decided. For the practice: the A15 approval gate becomes queryable instead of archaeological, and token spend becomes visible instead of guessed.

---

## 2. Beta scope

The scope is split in two. **Per Mike's decision (2026-08-22), the split is build order, not release order: there is one continuous build and a single launch, no separate Beta 1 release.** Track 1 is built and dogfooded first because it earns the success metrics and surfaces the data model; track 2 is the largest engineering and security surface and builds against a live, already-dogfooded system. Every gate below survives as a build-order milestone.

### Beta 1: work layer, approvals, client portal

| Slice | What |
|---|---|
| **Work layer** | Work items as a first-class object (finding, proposed solution, LOE, priority, phase, mirroring the assessment document structure) with tasks beneath them. Task fields: title, description, status (Backlog / In Progress / Waiting on Client / In Review / Done), single assignee, due date, priority, **estimate (hours, from the LOE)**, **point-person (client contact)**, **link to its execution-plan block**, labels including **Deferred**, comments, attachments, client-visible flag. **Engagement-level status updates** (author, timestamp, text), because the exec-summary skill reads recency of these as a health signal today. A **"My tasks" view** (assignee, due-date sorted, across all clients) and basic task/comment search, because the daily driver in Asana is "what is on my plate," not a project page. |
| **Approvals** | Per-work-item approve / decline-with-comment / defer, plus package-level approval of a phase's approved set with its total. Snapshot-and-hash ceremony, append-only ledger, confirmation email. The "pending your approval" dashboard Mike sketched on the 8/21 call. Full design in section 4. |
| **Client access** | Invite-only magic-link login **with a 6-digit OTP code in the same email as a prefetch-proof fallback** (corporate mail scanners such as SafeLinks and Mimecast consume single-use links; the OTP path is what survives them). One client-scoped page: their work items, statuses, items awaiting their action on top. Two-lane comments (internal default, client lane by explicit toggle with a confirm step naming the client org, plus a "preview as client" view for consultants). Client-facing status vocabulary mapped from internal statuses (a client sees "Planned / In progress / Waiting on you / In review / Complete", never "Backlog"). Action-centric notification emails: immediate for action-required, digest for status changes. |
| **Portal MCP tool** | A small MCP server consultants add to their desktop Claude Code setup: read tasks, update status, add comment, query approval state. Load-bearing, not optional: without it, a desktop session that just made a task true forces the consultant to alt-tab to a browser to flip the status, which is the exact friction that sends people back to Asana. Also the thing the A15 gate flip calls in the execution skill. Auth is a per-consultant portal token, a new credential class handled like the others (per-machine, never on the Drive). |
| **Telemetry, honestly scoped** | Audit trail and per-client/per-seat cost dashboards for **portal-launched work** (in Beta 1 that is background jobs; in Beta 2, agent sessions). This does **not** answer the seats-vs-overage question for consultants' desktop Claude usage; no interim session-log script is being built either (roadmap item A19 was removed 2026-09-11, roadmap decision 26). Desktop-usage, friction, and off-the-books-work telemetry is a **portal post-launch item**, out of the beta; recording that here so it leaves scope by decision, not omission. |
| **Deliverable previews** | The existing render pipeline already exports a PDF alongside every docx/pptx deliverable. The portal stores and displays those PDFs (pdf.js) with "download original." No server-side Office conversion in the beta at all. |

### Beta 2: the agent workbench

Live agent sessions server-side: a consultant opens a client, presses a button (run exec summary, new-engagement wizard, draft use case), the same skill runs via the Claude Agent SDK with output streamed to the browser, and checkpoints surface as in-app approve/deny prompts. Two to three buttons maximum, drafts always landing internal-first. Design in section 3.2; **hard entry gates in section 6** (the per-session container jail, egress allowlist, and runner auth must exist before any server-side session touches real client data).

Track 2 builds second because it is the largest engineering surface, the largest security surface, and the only slice with a hard external dependency set, while serving none of track 1's success metrics directly. It is the product thesis, so it is sequenced, not cut, and it ships in the same single launch.

### Explicitly cut from the beta (both halves)

Time tracking and budget burn in-app (NetSuite owns hours; the A16 per-client hours log continues), Gantt/dependencies, custom statuses and workflow engines, client file-upload workflows, client-facing chat or AI, shared project conversation (post-launch, roadmap D1), in-browser document editing, server-side Office conversion (Gotenberg), integration-monitor dashboards (Celigo tab waits), proactive chat agents, mood tracking, self-serve signup, billing/invoicing, desktop-usage, friction, and bypass telemetry (formerly roadmap A19; a portal post-launch item since 2026-09-11). The execution build loop (SDF deploys) stays in Claude Code permanently; only its gates surface in the app.

### Beta success metrics

1. **Approval cycle time**, request-to-decision, versus the current email/PDF baseline. Before phase 2, pull 5-10 historical approval threads and record the actual baseline dates, or this metric has no denominator.
2. **Percent of approvals captured with a full audit record.**
3. **Work-layer adoption**: engagements where the portal, not Asana, is the record; share of approvals still arriving via the email fallback (should trend to zero per client after their second portal approval).
4. **Review time per AI deliverable** (the vetting-tax KPI), measured once Beta 2 lands.

---

## 3. Architecture

### 3.1 System diagram

```
                       ┌─────────────────────────────────────────────┐
                       │                Browser                       │
                       │  Staff (Google SSO)   Clients (magic link   │
                       │                        + OTP fallback)       │
                       └──────────┬──────────────────┬───────────────┘
                                  │                  │
                       ┌──────────▼──────────────────▼───────────────┐
                       │        Web app: Next.js (Vercel)            │
                       │  client tiles · my tasks · work layer ·     │
                       │  approvals · dashboards · admin             │
                       └───────┬──────────────────────┬──────────────┘
                               │                      │ Beta 2: SSE direct
                  ┌────────────▼───────────┐   ┌──────▼───────────────────────┐
                  │  Supabase (Postgres)   │   │  Runner VM (Linux)           │
                  │  RLS multi-tenant      │◄──┤  Beta 1: index pipeline,     │
                  │  work items · tasks    │   │   pg-boss jobs, webhook      │
                  │  approvals ledger      │   │   receiver, snapshot render  │
                  │  comments · notifs     │   │  Beta 2: Agent SDK service,  │
                  │  usage events · audit  │   │   one jailed container per   │
                  │  markdown index        │   │   session                    │
                  │  Auth · Realtime ·     │   └──────┬───────────┬───────────┘
                  │  Storage               │          │           │
                  └────────────▲───────────┘   ┌──────▼─────┐ ┌───▼──────────┐
                               │               │ Secrets    │ │ Anthropic    │
                  ┌────────────┴───────────┐   │ manager    │ │ API          │
                  │  Google Shared Drive   │   └────────────┘ └──────────────┘
                  │  (owns engagement      │
                  │  knowledge)            │◄── consultants' desktop Claude
                  │  changes.watch ────────┼──► Code sessions, unchanged
                  └────────────────────────┘
```

Components:

- **Web tier: Next.js 16 (App Router, TypeScript), shadcn/ui + Tailwind, on Vercel.** Chosen for AI-agent output reliability and ecosystem depth, which compounds for a solo builder using Claude Code.
- **Supabase: Postgres + Auth + Realtime + Storage.** Staff auth is Google OAuth with the `hd` claim verified server-side against powerclouderp.com. Client auth is invite-only OTP/magic-link with `shouldCreateUser: false` (the Supabase default mints a user for any email; that default is off, explicitly). Tenancy in section 6.
- **All data stays in the US (hard constraint, Mike, 2026-08-22).** Every component is pinned to US regions: Supabase US, the VM in a US datacenter, Vercel US, US email routing. One build-time check: Hetzner's Ashburn and Hillsboro datacenters keep data on US soil, but Hetzner is a German company; if the constraint means US-owned vendors as well as US soil, the VM moves to a US provider at the same price class (DigitalOcean, AWS Lightsail/EC2) with no design change.
- **Runner VM: one Linux VM (Hetzner CPX31-class to start, US region, subject to the check above).** In Beta 1 it runs the index pipeline, the `changes.watch` webhook receiver (a verified HTTPS endpoint, so the VM is internet-facing and treated as such: TLS, rate limiting, uptime monitoring), pg-boss workers, and snapshot rendering. In Beta 2 it also runs the Agent SDK service. A VM rather than serverless because agent sessions are long-lived `claude` subprocesses owning a shell, a working directory, and session files on disk ([hosting docs](https://code.claude.com/docs/en/agent-sdk/hosting)); sizing floor roughly 1 GiB RAM per concurrent session.
- **Google Shared Drive stays canonical for engagement knowledge**, accessed by the server through the **Drive API directly** with a service account that is a member of the client-folders scope only. **The service account is not a member of `Internal/` at all**; its restriction is a Drive permission, not a filter in pipeline code. Deliberately not a second sync client on the VM (rclone or Drive for Desktop): two sync clients on the same files is the textbook conflicted-copy generator. Consultants' desktop workflow is untouched.
- **Server write policy (the honest version).** Drive API v3 has no conditional-write primitive, and a revision check cannot see a desktop edit that has not synced yet, so "compare-and-swap against Drive" is not a real guarantee. The design therefore avoids the problem instead of claiming to solve it: **in Beta 1 the server writes only portal-owned generated files** (`working/tasks.md`, `working/approvals.md`), which nothing else writes, and never touches shared knowledge files at all. Beta 2's session write-back is designed in section 3.2. Conflicts with desktop edits on portal-owned files are detected after the fact from Drive revision history, diffed, archived, and reported, never silently eaten.
- **Secrets manager** (cloud provider's, or Vault): per-client NetSuite MCP tokens by environment, the Anthropic API key, portal MCP consultant tokens, magic-link signing keys. Never in env files, the repo, the DB, or the Drive.
- **Email: Resend**, with SPF/DKIM/DMARC from day one, delivery webhooks stored (provider message-ID, bounce, complaint) because SMTP acceptance is not delivery. **Errors: Sentry. Uptime: an external pinger on the webhook endpoint and the web app.** **Deploy: Docker Compose + GitHub Actions** from a documented, re-runnable setup; the VM must be rebuildable from the repo in hours, not from memory.

Infrastructure cost, excluding Claude API tokens: roughly **$65-110/month at beta scale**, $145-225 at 3x. Token spend will dominate the real bill.

### 3.2 The agent engine (Beta 2, designed now so Beta 1 doesn't paint over it)

The Claude Agent SDK is Claude Code as a library: the identical harness (skills, CLAUDE.md, hooks, subagents, permissions) embeddable in a Node service. Verified against current docs 2026-08-22. The essentials:

- **The runner is a seam, not a merger.** The web app and database never touch the Agent SDK directly; they talk to the runner's own small API in our own event vocabulary (section 3.4). The SDK's message format is translated at the runner boundary and never leaks into app code, the DB schema, or the UI.

- **Workspace layout: a synthetic root per session.** Skills and CLAUDE.md load by parent-directory traversal, so a bare checkout of one client folder would find no skills at all. Each session gets a deterministic workspace (`/workspaces/{client}/{purpose}`) containing the shared doctrine files and `.claude/` tree **read-only**, plus the one client folder writable, with `cwd` inside the client folder. Deterministic paths also keep SessionStore resume working (its lookup key derives from the working directory). Add `systemPrompt: {type: "preset", preset: "claude_code"}`, since the SDK's default system prompt is minimal. One known CLI difference: a skill's `allowed-tools` frontmatter is ignored in SDK sessions, so the launcher supplies equivalent `allowedTools` per session type.
- **Sessions stream to the browser directly from the runner** (Vercel functions cannot hold an hours-long SSE stream). That makes the runner an auth boundary: it validates Supabase JWTs against the shared JWKS, checks the consultant-to-client assignment on every stream and every checkpoint response, and logs the responding identity on every `canUseTool` answer into the audit stream. A pending checkpoint whose session dies shows "session lost, restart" rather than pretending durability; sessions are declared non-durable in beta.
- **Checkpoints become UI** via `canUseTool`, which pauses execution until the app answers: LOE confirmation, plan approval (gate 1), production-deploy approval (gate 2), and clarifying questions all render as in-app prompts.
- **Read-only discovery becomes mechanical.** The engagement carries a `mode` field (discovery | execution) set only by a human. In discovery mode, NetSuite write tools are excluded via `disallowedTools` (removes the tool definition entirely; holds even in bypassPermissions mode) plus a PreToolUse deny hook as the second layer.
- **Per-client MCP wiring.** `mcpServers` is per-session; the launcher injects exactly one client's credentials, fetched at spawn, delivered inside the session container (below), never via an environment another process can read. The launcher verifies the connected NetSuite account ID against the client record before the session starts.
- **Session write-back, honest version.** The server session writes its local checkout; write-back to Drive goes file by file with a Postgres write lease serializing portal writers per client, post-write verification (re-read `headRevisionId`, confirm the write landed as head, alert if not), and conflict detection from revision history. A detected conflict writes `{name}.portal-proposed.md` and opens a portal conflict item; the plan makes no auto-merge promise. Desktop sync lag means a conflict can still surface late; that is stated, monitored, and permanently dissolved only by the git-canonical end state.
- **Model routing and budgets.** `model` and `effort` per session type (Haiku for chores, Sonnet for drafting and mining, Opus/Fable for synthesis and LOE reasoning). `maxBudgetUsd` is a **soft, client-side-estimated stop**, per the docs, so the runner also enforces an aggregate daily cap per client and per seat from the `usage_events` table, denying new session spawns over threshold. Every result message's usage and per-model cost is written to `usage_events` tagged with user and client.
- **Email tools, precisely scoped:** no send-capable email or messaging tools in any session that reads client content; sending stays a human action through beta. Read-only Gmail access is permitted for the exec-summary session type, which requires it as a source; its draft-to-client follow-up stays a desktop/human action.
- **Client-authored text never enters any agent session automatically.** Not just write-capable sessions: none. A consultant explicitly quotes a client comment into a session if it is needed, which doubles as the human checkpoint against injection riding portal comments. This keeps "clients never burn tokens" true by construction.

### 3.3 Data architecture: what lives where

| Postgres (owns) | Files on the shared drive (own) |
|---|---|
| Work items and approval state | CONTEXT.md, candidates.md, evidence.md, verification.md |
| Tasks, statuses, assignees, estimates | loe_log.md (consultant/desktop-owned), drafts, deliverables |
| Approval ledger (append-only) | Execution plans, retro.md, learnings |
| Comments (both lanes), notifications, read receipts | Everything any skill reads or writes today |
| Engagement status updates | Root doctrine files (PLAYBOOK, BASELINES, etc.) |
| Usage telemetry, audit log, markdown index | |

**The file-export contract keeps the walk test alive.** Following the ENGAGEMENT_LOG.md pattern (generated, never hand-edited), the server renders per client folder:

- `working/tasks.md`: timestamped, human-readable task snapshot, debounced. Desktop sessions read task state here and write it only through the portal MCP tool.
- `working/approvals.md`: the approval narrative (what was approved, by whom, when, version hash, decline and defer comments, and approval-adjacent client-lane threads), because a client's written position on a work item is engagement knowledge under this plan's own definition, and the folder walk must see it. Portal-owned and generated, so the server never appends to the consultant-owned `loe_log.md`.

**Index pipeline:** `changes.watch` webhook kicks a cursor-driven `changes.list` drain, filters to markdown under client folders, parses, upserts. Channels renewed on schedule; the reconcile walk runs on VM boot and hourly (not nightly; a dropped webhook should mean minutes of staleness, not a day). Structured fields come only from a small schema-versioned YAML frontmatter block on CONTEXT.md; prose feeds full-text search only. **All indexed content is treated as untrusted input**: rendered as escaped text or sanitized markdown (never raw HTML, because `source/` files are client-authored and stored XSS into staff browsers is otherwise a real path), YAML safe-loaded, and frontmatter-derived fields trusted only from files attributable to staff or the portal itself. Parse failures queue visibly. Knowledge files: file wins on any disagreement. Generated snapshots: DB wins, but a detected hand-edit is diffed, archived, and reported to the editor.

**End state (not beta): git-canonical.** The existing GitHub backup mirror is the seed. Eventually the repo becomes canonical, agent sessions become worktrees with real merge semantics, and Drive becomes a generated human-facing export. It waits until the portal has earned trust, because it changes every consultant's muscle memory at once.

### 3.4 Modularity and exit paths (requirement from Mike, 2026-08-22)

Nothing in this stack is a marriage. The rule applied throughout: **own the assets, rent the engines, and keep every seam cheap to cut.** Three seams, in order of how much they matter.

**The AI engine.** The honest statement first: the Claude Agent SDK is Claude-only. It runs across clouds (Anthropic API, AWS Bedrock, Google Vertex, Microsoft Foundry, a config change if data residency or procurement terms ever demand it), but it does not drive open-weight models. Model modularity therefore cannot come from the SDK; it comes from where the seam sits:

- **The runner boundary is the seam.** The runner exposes a small internal API in our own event vocabulary: create session (client, session type, prompt), stream events (text, tool call, checkpoint request, usage), answer checkpoint, cancel. App code, the DB schema, and the UI speak only this vocabulary. A future runner-v2 wrapping an open-weight serving stack (vLLM or equivalent) plus an MCP-speaking open harness implements the same API, and the rest of the portal cannot tell the difference.
- **Everything the engine consumes is engine-neutral by construction, and already is.** Skills are markdown, CLAUDE.md is markdown, integrations are MCP (an open standard any serious harness now speaks), gates and modes are rows in Postgres. Hooks and disallowedTools are how the Claude engine *enforces* policy, but the policy source of truth is the database, so a replacement engine reads the same policy and enforces it with its own mechanisms.
- **Nothing product-critical depends on SDK internals.** The audit record and telemetry live in Postgres in our schema (provider and model are just columns), never in SDK session transcripts; sessions are already declared non-durable.
- **The golden-engagement fixture suite (roadmap C6, already scheduled as Beta 2's skill-parity harness) is the model-portability insurance.** Any engine or model swap re-runs the fixture engagement and diffs outputs against approved finals. Without it a swap is vibes; with it, a swap is a test run.
- **Swap triggers worth naming:** token economics inverting (open-weight serving plus GPU cost beating API pricing at our volume), a residency or client-contract demand the Claude clouds cannot meet, or quality parity on the fixture suite. Infra note for the trigger math: open weights mean GPU serving, a different tier than the beta VM.

**Vercel.** Used purely as a Next.js host with CI previews; **no Vercel-proprietary services, ever** (KV, Postgres, Blob, Edge Config). The Next.js standalone Docker build runs in CI from phase 0 so self-hosting stays a proven path rather than a theory; the runner-up (Coolify on the VM) is documented. Expected steady state $20-40/month; **sustained spend above ~$100/month triggers a hosting review.** The traffic profile that makes Vercel expensive (consumer-scale bandwidth and function invocations) structurally cannot come from a portal with tens of users.

**Supabase.** Postgres is the asset; Supabase is the operator. Guardrails: schema migrations live in the repo and apply via CI, never dashboard-clicked; RLS policies are plain Postgres and export with the schema; **weekly `pg_dump` to the backup store** (the approval ledger's 6-year retention wants this anyway); Realtime usage sits behind a thin wrapper so a swap to SSE or polling is contained; Storage is just files, movable to S3/R2. Auth is the stickiest piece and mild here: clients are email-OTP (re-inviting on a new provider is a non-event), staff are Google SSO (re-pointed in an afternoon), and there are no passwords to migrate. The database only owns the interactive layer, so a Supabase exit is a task-layer migration, not a move-the-practice event. Expected $25-100/month even at 3-5x growth; **sustained spend above ~$150/month triggers a review.** The scale that makes Supabase expensive (hundreds of thousands of MAU, terabyte egress) is consumer-app scale this product cannot generate; the scenario that legitimately outgrows it is the portal becoming a product sold to other firms, at which point re-platforming is justified by revenue.

---

## 4. The approval system (the commercial heart)

LOE approvals are commercially binding, so each approval is a small e-signature transaction. Design synthesized from clickwrap-enforceability practice, PandaDoc/Ignition audit patterns, and Jira Service Management's approver UX.

1. **The approvable object is split in two.** An immutable **commercial-terms snapshot** (scope statement, hours, price, terms) that is hashed, versioned, and what the client actually approves; and mutable descriptive prose that never enters the hash. "Material change" is therefore structural (any change to the terms object voids the approval and re-enters the queue), not an editorial judgment call, and fixing a typo in the description can never silently invalidate or falsely preserve an approval.
2. **Snapshot what was shown.** At request time the app freezes the rendered document (the work-item package as presented) plus its SHA-256. The client approves a hash, never "the current version of" a mutable record. **The snapshot renderer is a phase 0 exit criterion, brand-verified**: approval packages render from HTML templates with the brand fonts to PDF via headless Chromium on the VM. This is the firm's flagship commercial ceremony; a layout-mangled PDF there is not a beta rough edge.
3. **The ceremony.** Explicit consent language next to an affirmative, never pre-checked control ("By approving, you authorize Power Cloud to proceed with the work described, at the estimated hours shown"). Approve or decline-with-comment; either transitions the workflow. The approval action requires fresh authentication within the last N minutes, **via the typed OTP path** (a second clickable link would just re-run the prefetch gauntlet mid-ceremony).
4. **The record.** Append-only `approvals` table (INSERT-only grants), hash-chained rows. **The chain head is appended daily to the existing private GitHub backup repo**, one cron line, so tamper evidence does not live solely inside the database it protects. Each row: approver identity (user, invited email, auth method, auth event), server timestamp, IP and user agent, terms-object version hash, pointer to stored snapshot bytes, and the presented figures denormalized into the row. A confirmation email with the snapshot PDF goes to the approver as a courtesy copy; the ledger stores the send attempt, provider message-ID, and bounce/complaint webhooks rather than asserting delivery.
5. **Granularity.** Per-work-item approve / decline / defer, plus a package-level approval of a phase's approved set with its total. Clients never edit hours; a decline reopens the line for the consultant to revise and resend as a new version.
6. **ESIGN/UETA posture, the lightweight path:** one-time electronic-records consent at client onboarding, explicit clickwrap per approval, the ledger as the attribution record, retention 6+ years. MSA language states the client is responsible for the invited mailbox. Attribution ultimately rests on control of that inbox, which is the accepted e-sign norm, but for repeat approvers **passkey enrollment is offered from day one for the client-approver role specifically** (viewer roles can wait). Engagement-level signatures (SOW, MSA) stay wherever they are signed today.
7. **MSP-proof by design.** The commercial-terms object carries line hours under LOE framing and scope/terms under an MSP arrangement. Ledger, ceremony, and versioning are identical either way, so a pricing pivot does not touch this system.
8. **The A15 gate lands here.** "Build may start" becomes a computed property: the work item has an approval row matching the current hash of its terms object. The execution skill's gate check queries the portal (via the portal MCP tool) instead of parsing Asana comments. The watch variant Taha asked for becomes a notification rule. Email approvals remain a sanctioned fallback, recorded as `approval_via_email` ledger entries with the source cited; per client, the email path is offered only until their second portal approval, then retired, and its share is tracked as an adoption metric. **Transition rule:** until phase 2 ships, approvals for any cutover client continue to land on the Asana task per the current convention (the cutover renames the project and freezes task edits; comments stay open exactly for this), so no approval is ever homeless mid-migration.

---

## 5. Replacing Asana

The dependency map (ASANA_CONVENTIONS.md plus the exec-summary and execution skills) is fully covered by the Beta 1 work layer: statuses including explicit Not Started, owner and due date, **estimate on the task**, **point-person tag**, deliverables attached to the task, comments with the Next Steps convention, comments as the approval record (superseded by real approvals), subtask needs (a checklist field), sections as stages, one project per engagement, **project-level status updates** (now engagement status updates), and the **Deferred label**.

**Migration, per consultant, not per client.** A consultant carries several clients; per-client waves would leave every consultant straddling two systems for the whole transition, which is where migrations die. Instead:

1. Prove the pipeline on one internal engagement (no client users), imported via the Asana API (projects, sections, tasks with full fields, stories for comments, attachments), keyed by `asana_gid` so re-imports are idempotent. Native CSV exports omit comments; the API path is required. **Imported comments are forced internal-lane, no exceptions, verified in the migration checklist**: they were written with zero expectation of client eyes.
2. Then cut over **per consultant**: all of one person's clients in one pass, so each individual lives in exactly one system. Verify counts with them, spot-check, rename each Asana project "(MOVED to portal)," freeze task edits, keep comments open for the approval-transition rule above.
3. Re-run the delta import just before each flip. During the transition the exec-summary skill reads the portal API for cutover clients and Asana for the rest; the `tasks.md` snapshot names which system is live so no session guesses.

No dual-write, ever: it means building and debugging a reverse Asana sync we intend to throw away. Compressed per-consultant cutover finishes in a couple of weeks once phase 1 has proven one engagement.

---

## 6. Security model

Threat framing: the crown jewels are cross-client confidentiality, approval integrity, NetSuite credentials, and token spend. The carried principle: prompt rules are UX; **containers, grants, RLS, and hooks are security.**

**Tenancy: pooled control plane, siloed data plane.** The web app is a pooled multi-tenant app on Postgres RLS. One predicate model, used everywhere: **policies key on JWT claims** (custom `org_id`/role claims), because Supabase Realtime and the client SDK authorize via JWT and a second `SET LOCAL`-based model for server code would mean two enforcement paths that can disagree. Server-side code touching tenant rows uses tenant-scoped JWTs, not the `service_role` key; `service_role` is reserved for the index pipeline's non-tenant tables. Realtime authorization is explicitly configured (it is not on by default for Postgres changes). `FORCE ROW LEVEL SECURITY`, fail-closed when claims are absent (an org-less authenticated user sees nothing), and app-layer scoping on top so RLS is the backstop rather than the only filter.

**The agent session jail (Beta 2 entry gate, named mechanism, not posture):** one rootless container (Podman) per session; the synthetic workspace root bind-mounted as the container's only volume; distinct UID per session; the client's MCP server runs **inside the same container** so its credential scope equals the jail scope; secrets delivered via per-container tmpfs file or stdin, never via an environment readable from `/proc` by the session's own shell. `cwd` scoping and the PreToolUse path-canonicalization hook remain as early-failure conveniences, but the container boundary is the security claim: a fully injection-hijacked session's world contains one client's checkout, read-only doctrine, and one client's read-scoped credentials, and nothing else.

**Egress control (Beta 2 entry gate, not deferrable):** the session container's network namespace allows only the Anthropic API, that client's NetSuite host, and googleapis.com; research-session types add an explicit docs allowlist. This is what makes "assume injection sometimes succeeds" survivable: a hijacked session with Bash and open egress can exfiltrate an entire client folder with one curl, and no tool-layer hook sees it. Web-tool domain policy hooks and the "no client data in outbound queries" scanner run on top, as the audit-visible layer.

**Roles:** admin (Mike/Taha), consultant (assigned clients only, the app-layer twin of the folder rule), dev reviewer (build artifacts, the A15 dev-review step), client-approver, client-viewer. "Trigger agent runs" is a permission no client role possesses at the API layer. AI drafts and everything mirroring `working/` (verification, evidence tiers, candid internal exec-summary drafts, loe_log) are internal states clients structurally cannot see: visibility is an RLS-enforced state on the row, and no agent has a tool that can change it. Promotion to client-visible is a logged human action.

**Secrets:** managed store only; per-client, per-environment; the launcher fetches one client's token at spawn, delivered inside the jail. Engagement close runs a teardown checklist (revoke tokens, delete secrets, disable launches, archive read-only, audit entry), productizing the DATA_CONNECTORS.md mandate.

**Audit:** one append-only stream shipped to an external sink (a DB compromise cannot rewrite history). Human events: logins and auth method, role changes, draft promotions, LOE edits with old/new values, approvals, engagement mode changes, checkpoint answers with responder identity. Agent events (Beta 2): session start with tool-manifest hash, every tool call with the deciding permission layer, every hook denial (the injection-attempt detector), files written, SuiteQL text (the "what did the AI look at in our account" answer a client will eventually request).

**Non-negotiable in Beta 1:** RLS with fail-closed JWT claims, invite-only client auth with `shouldCreateUser: false`, clients-cannot-trigger-anything at the permission layer, internal-first visibility states with human promotion, the approval ledger with snapshots and e-records consent, secrets in a managed store, both audit families, domain-enforced staff SSO, short-lived single-use OTP/links, sanitized rendering of all indexed markdown, the service account not a member of `Internal/`. **Gate before any client invite (end of phase 1): an automated tenancy-isolation test suite** probing every tenant-scoped endpoint cross-tenant, verifying RLS fails closed, and testing client-visible-flag leakage. A cross-tenant leak shown to a real client is the single worst outcome available to a firm whose pitch is trust, so this is a test suite, not a review.

**Non-negotiable before Beta 2 serves real client data:** the container jail, the egress allowlist, runner JWT auth with per-checkpoint identity logging, write tools absent (not just denied) in discovery mode, and a scoped injection red-team (client-comment and transcript payloads) as an exit criterion of the workbench's first phase, not an afterthought.

**Deferrable beyond beta:** WORM-grade anchoring beyond the GitHub chain-head cron, SIEM-grade alerting (start with four hand-built alerts: hook denials above baseline, write-tool attempts in discovery mode, foreign-tenant requests, sessions launched outside business hours), automated teardown (beta: human checklist that logs to audit), third-party e-sign.

---

## 7. Build plan

Builder: **Mike, with Claude Code doing the work** (decided 2026-08-22; the AI engineer is not joining). Sessions run against the portal's own private repo with the OS methodology layer as the spec; this plan is the standing brief a build session orients from. The honest constraint this creates: Mike's time is the bottleneck and the support desk is one person deep, which is why the ops gate names Taha as the trained second admin and why dogfooding happens during the build rather than after. **Hard prerequisite: A13, the shared-drive migration (decided: a new dedicated shared drive with the OS at its root; the old drive legacied with a shortcut), lands before phase 0**, so the index pipeline, service-account membership, and every stored path are built once against the new drive, not migrated later.

**Launch shape (decided 2026-08-22):** one continuous build, one launch. Mike runs his own client book in the portal from the moment phase 1 is usable (the builder finds the sharp edges, not a consultant). Consultants join at launch; clients are invited after the first walkthrough calls. The phase tables below are build milestones with gates, not releases.

### Beta 1 (target 10-13 weeks)

| Phase | Weeks | Ships | Exit gate |
|---|---|---|---|
| **0. Foundations** | 2 | Repo, Supabase schema + RLS (JWT-claims model), staff SSO, VM + deploy pipeline + uptime monitoring, Drive service account (client folders only) + index pipeline + CONTEXT.md frontmatter, client tiles (read-only dashboard), audit stream, **domain events table** (task, approval, file, message, and agent-run events as first-class rows feeding pg-boss and the audit stream; added 2026-09-11), **customer, engagement, workstream hierarchy in the schema** (folders stay nested; CONTEXT.md frontmatter is the link; added 2026-09-11) | Tiles live for every client; **approval snapshot renderer chosen and brand-verified**; VM rebuildable from the repo; standalone Next.js Docker build green in CI; migrations-in-repo discipline in place; weekly `pg_dump` cron running |
| **1. Work layer** | 3-4 | Work items + tasks (full schema incl. estimate, point-person, plan-block link, labels), engagement status updates, "My tasks" + search, two-lane comments, attachments, Asana import, `tasks.md` snapshot, **portal MCP tool**, notification emails | One internal engagement fully lived-in; **tenancy-isolation test suite green**; import-forces-internal verified |
| **2. Approvals + client portal** | 3-4 | Terms-object + snapshot ceremony + ledger + GitHub chain anchor, OTP/magic-link client auth, client-scoped page, "pending your approval" view, `approvals.md` snapshot, confirmation emails with delivery webhooks, preview-as-client, client status vocabulary | First real approval executed together with a friendly client on a call; **baseline approval-cycle measurement recorded beforehand**; OTP path tested against an Outlook/365 tenant with SafeLinks on |
| **3. Cutover + hardening** | 2-3 | Per-consultant Asana cutover waves, exec-summary skill reads portal API for cutover clients, A15 gate flipped to portal, remaining alert wiring | Asana cancelable. **Ops gate:** written runbook; **Taha trained as second admin** (restart + restore); one rehearsed Postgres + snapshot-store restore; email approval documented as the sanctioned outage fallback so a down portal never blocks commerce |

### Beta 2 (target 6-8 weeks, after Beta 1 stabilizes)

| Phase | Ships | Entry/exit gates |
|---|---|---|
| **4. Agent workbench** | Runner service with jailed per-session containers, SSE streaming with runner-side JWT auth, 2-3 buttons (run exec summary first; new-engagement wizard; draft use case), canUseTool checkpoint UI, per-session MCP wiring, discovery read-only enforcement, model routing + aggregate budget caps, session cost dashboards | **Entry:** container jail + egress allowlist working against a fixture client. **Exit:** scoped injection red-team passed; a headless skill-parity smoke test (each button's skill run against a fixture client, output diffed against a desktop run; the C6 golden-engagement idea doubles as this harness) |

Total: roughly 16-21 weeks of engineering work across both tracks. With Mike building part-time alongside running the practice and Claude Code doing the work, calendar time is governed by Mike's available hours, so progress is measured against the milestone gates, not the week counts. The honest expectation stands that from the first cutover the builder is also the support desk. If early proof of "same skills, our interface" is wanted for morale during track 1, a single read-only exec-summary button against a fixture client is the demo, not an early full runner.

**Beta clients:** 2-3 friendly accounts, picked for an active engagement with pending approvals and a contact who tolerates rough edges. Onboard personally: demo live in a meeting, do the first approval together on a call. Portal-adoption research is unambiguous that portals die from having no job to complete; approvals answerable only in the portal (after the per-client email-fallback window closes) is the recurring reason to show up.

---

## 8. Decisions (recorded 2026-08-22, interview with Mike)

These override anything to the contrary above. The plan text has been updated to match; this list is the record.

1. **Roadmap decision 8 amended.** Clients get view/comment/approve in this build. The v0.4 constraint set stays: no agent access, no token burn, human-promoted content only.
2. **Boundary rule amended.** Files own engagement knowledge; the database owns the interactive coordination layer formerly in Asana; generated snapshots (`tasks.md`, `approvals.md`) keep the folder narrative complete.
3. **One continuous build, single launch.** No separate Beta 1 release. The track 1 / track 2 split survives as build order, with every gate intact as a build milestone.
4. **Repo: a new private repo**, separate from the OS backup mirror.
5. **Builder: Mike, with Claude Code doing the work.** The AI engineer decided not to come on board. Ripple: the roadmap's "Notes for the AI engineer" section and the A17 feedback-triage pairing ("Mike and the AI engineer") were updated 2026-09-11 (roadmap section 6b amendments).
6. **A13 shape: a new dedicated shared drive** with the OS at its root; the old `Power Cloud Project Folders` drive is legacied with a shortcut back. (Settles the roadmap parking-lot sub-question.)
7. **Name: Power Cloud Portal.**
8. **All data stays in the US.** Hard constraint; every component pinned to US regions, with the Hetzner-ownership check in section 3.1.
9. **First users: Mike dogfoods his own book during the build.** Consultants join at launch; clients are invited after the first walkthrough calls.
10. **MSA path: Mike hands over the current MSA**, Claude drafts the e-records consent, approval clause, and invited-mailbox responsibility language into it, attorney reviews after (the mechanics roadmap decision 6 already prescribed).
11. **Second admin: Taha**, trained on the runbook (restart + restore) at the ops gate.
12. **Session budgets approved as starting values:** $2 chores / $10 drafting / $25 synthesis per session; aggregate caps ~$50 per seat and ~$75 per client per day; recalibrated from telemetry after two weeks of real use.

### Still open

- **Which 2-3 clients get the first portal invites.** Decide near invite time; criteria stand (active engagement, pending approvals, tolerant contact).
- **The US-soil vs US-owned-vendor check** on the VM provider (build-time, phase 0).
- **The MSA handoff itself.** Mike owes the current MSA version; the candidate copy at `ReatainerEstimate/` is unconfirmed.
- **A13 execution: DONE 2026-08-22.** The OS now lives at the root of its own `Power Cloud OS` shared drive; move verified against the manifest, path sweep applied (`Internal/A13_MIGRATION_PLAN.md` tracks the remaining follow-ups: team re-share verification, DLP review, Monday-job re-pointing). Portal phase 0 is unblocked.

---

## 9. Risks

| Risk | Posture |
|---|---|
| **Desktop and server writes colliding on Drive files.** No conditional-write primitive exists, and desktop sync lag hides edits from any revision check. | Designed around, not away: Beta 1 server writes touch only portal-owned generated files; Beta 2 write-back uses leases + post-write verification + revision-history conflict detection, no auto-merge claim; git-canonical dissolves it permanently. |
| **Schedule slip.** Five products hide inside one app; the reviewers' honest read of the v1 plan was 20-28 weeks. | Beta 1 restructured to the metric-earning slices (10-13 weeks); the workbench sequenced second; further cuts pre-agreed in order: conflict-file-only write-back stays, dashboards become SQL views, buttons drop to one. |
| **Cross-tenant leak shown to a real client.** | Tenancy test suite as a phase 1 exit gate, before any invite; single JWT-claims RLS model; no `service_role` in tenant paths. |
| **Magic links eaten by corporate mail security.** | OTP code in the same email; fresh-auth via OTP; tested against a SafeLinks tenant before the first invite; Postmark as the deliverability fallback. |
| **Internal candor leaking to the client lane.** | Internal default, distinct composer styling, confirm-naming-the-org step, preview-as-client, import forces internal. |
| **Prompt injection via client comments or transcripts (Beta 2).** | Client-authored text never auto-enters sessions; container jail + egress allowlist as entry gates; red-team as exit gate; hook denials alerted. |
| **VM as single point of failure.** | Honest posture: rebuild-from-repo in hours, reconcile on boot + hourly (webhook loss means minutes of staleness, not a day), sessions non-durable with visible "session lost" UX, pg-boss state in Postgres, uptime pinger, email approval as the sanctioned outage fallback. |
| **Adoption: consultants drift back to Asana or email.** | Per-consultant cutover (nobody lives in two systems), "My tasks" + search from day one, portal MCP tool so desktop sessions update state without alt-tabbing, exec summary and the A15 gate read only from the portal after cutover, email-approval window time-boxed per client. |
| **Walk-test erosion.** | Two generated files per client (`tasks.md`, `approvals.md`), frontmatter capped to a handful of keys, per-change walk test stays the release gate for workspace-touching changes (the quarterly sweep is additional, not a replacement). |
| **The MSP pivot changes the commercial object mid-build.** | The approvable is a versioned commercial-terms object; LOE and MSP are renderings of the same record. |
| **Vendor or model lock-in.** | Section 3.4's seams: the engine behind our own event API; engine-neutral assets (markdown skills, MCP, policy in Postgres); the C6 fixture suite as the swap test; standalone-build CI, migrations in repo, weekly `pg_dump`; named cost triggers (~$100/mo Vercel, ~$150/mo Supabase) so "watch the bill" is a rule, not a vibe. |

Open questions parked for build week one: SessionStore adapter choice (official Postgres example exists), the exact frontmatter schema for CONTEXT.md (coordinate with the A13 path sweep so files are touched once), and whether the runner exposes the portal MCP tool itself or a thin REST client wrapped as MCP.

---

## 10. What this plan deliberately does not change

- The six-stage assessment, the execution guardrails, the checkpoints, evidence tiers, the render gate: unchanged. The portal surfaces them; it does not own them.
- Claude Code desktop sessions keep working exactly as today, before, during, and after the beta. The portal is additive until a workflow is explicitly cut over (Asana being the first and only planned cutover).
- Production NetSuite writes stay human-gated per deploy. No portal button will ever deploy to production.
- LOE figures: drafted by Claude, owned by a human, binding once sent. The portal adds evidence of who approved what and when; it does not soften the human ownership.
- `Internal/` stays outside the portal entirely, by Drive permission rather than by code.
