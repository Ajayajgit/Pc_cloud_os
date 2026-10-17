# Power Cloud OS Roadmap

Drafted 2026-08-10 by Claude Code for Mike's review. Sources: all four AI Summit transcripts (July 28-31, roughly 22 hours of sessions, mined in full), the current workspace as built, and the ICM (Interpretable Context Methodology) reference. Full evidence reports with timestamps live in `AI Summit Discussion Transcripts/working/mining/`. Speaker attribution in the transcripts is unreliable (two mics captured the room), so quotes below are attributed cautiously.

Status: reviewed with Mike 2026-08-11. Eleven of the twelve original open questions are decided (see Decisions section); the remaining opens are in the parking lot. Extended 2026-08-22 with section 6a, the decisions and new items from the 2026-08-21 Mike and Taha discussion. Cleaned up 2026-09-11 after the Portal Beta Plan (v5) and the September 2026 independent review: Section B now points at the plan instead of carrying a parallel phase list, AI-engineer references are retired, and section 6b records the review decisions.

---

## 1. The vision

The summit said it plainly: the current setup is the proving ground, not the product. "The interface that you guys are using today is like kindergarten. What we're about to build is a professional version" [Day 1]. The destination is an operating system for the consulting practice: every consultant does all of their work out of it, every client conversation lands in it, and "anybody else continuing a conversation in that same folder will be talking to a being that understands it" [Day 4].

The OS is three layers, and only one of them is software to be built:

1. **The methodology** (what exists today): folder structure, skills, reference files, checkpoints, evidence tiers. This is the moat. It is what makes the output come "up the same way no matter who runs it" [Day 2].
2. **The engine**: Claude Code plus MCP connections (NetSuite, Asana, Celigo, Google). Rented, swappable, model-portable by design [Day 2].
3. **The shell** (in build): the Power Cloud Portal. A professional face over layers 1 and 2, built by Mike with Claude Code doing the work (decision 2026-08-22). It earns its existence only where files and prompts genuinely lose. Spec: `Internal/PORTAL_BETA_PLAN.md`.

The two roadmap sections below map to that split: Section A is what the folder structure + Claude Code can carry now; Section B is what belongs in the custom tool.

---

## 2. What the summit proved

### 2.1 Validated: keep and double down

- **MCP-verified evidence mining is the differentiator.** The Shinesty returns discrepancy (25-30% claimed vs under 1% in the account, with script-level proof) was the finding "neither one of us would have taken the time to dig up" [Day 1]. Pre-kickoff MCP analysis means "they're asking you questions which nobody even asked" [Day 4].
- **The rapid assessment is transformational already.** "Spending eight hours creating from my notes a rapid assessment... using a transcript and spending 2 hours is a transformational change" [Day 4]. Report generation dropped from 10 hours to 4 [Day 3].
- **Execution works end to end.** Tepperman's price-tag suitelet: seven pain points identified from a transcript plus an Asana task number, patched, and deployed to sandbox in a day. "Nobody touched the script. Only Claude touched the script" [Day 3]. Reverse engineering, "the hardest thing we do," became a patch-vs-rebuild choice offered to the client [Day 3].
- **Greenfield implementation is viable.** The 44 Pro prototype went from discovery transcripts to implementation plan to feature enablement to a 126-account chart of accounts loaded from a raw multi-tab Excel file, "pretty spot-on" versus weeks of back-and-forth the old way [Day 4].
- **The executive summary skill is a breakout product.** It replaces "all green, nothing to report" consultant updates with MCP-backed substance, and caught real gaps (work done but never recorded in Asana) [Day 4].
- **The folder-as-memory architecture holds.** Files survive `/clear`, context persists across days, one-sentence prompts work because CLAUDE.md carries the process [Days 1, 3].
- **ScriptReader and the standard MCP role close the verification gap.** "Extremely, extremely helpful, specifically at Tepperman's" [Day 4].

### 2.2 Broken or missing: the demand signal

Grouped by theme. These drive the roadmap items in Sections A and B.

| Theme | What happened |
|---|---|
| Provisioning and onboarding | A consultant was blocked all week: no license granted, login link never sent, Drive access failing, account-merge confusion. "If we just roll it out with documentation... he ran a roadblock and now he's not doing anything" [Day 4]. |
| Usage and cost opacity | Overnight runs died on limits, a consultant was capped mid-exercise, an accidental Fable-effort setting burned a day's quota. "It might be cheaper to give you guys a higher seat or... allow some overage. The truth is I have no idea" [Day 4]. |
| Engagement lifecycle gaps | Pre-sales context is "context I haven't put into the tool yet" [Day 3]. The duplicate Asana project happened because the tool did not know pre-sales already created one. Access requests (sandbox, MCP consent) are chased ad hoc and arrive wrong (production instead of sandbox). |
| The vetting tax | "If each time you're proofreading eight pages, that's why it takes a while" [Day 3]. Human review is now the bottleneck, and the only defense against confident errors (the Inventory Received Not Billed remapping near-miss, the "150 orders" claim, the missed billing-schedule option). |
| Knowledge lives in heads | The deposit-as-deferred-revenue pattern, one-way item settings, UOM rules, "65 hours for a Shopify integration": all taught orally at the summit. "Instead of me asking Taha or Mike, this database should at least give me step one, two, three" [Day 2]. |
| Capture pipeline fragility | A truncated Google Doc copy (11KB of a 126KB doc) caused the biggest quality failure of the week. A client call transcript silently never materialized. Recordings land in personal folders. Speaker attribution is broken on room recordings. |
| Skill sprawl and governance | The exec-summary skill leaked MSP language into a non-MSP client because client specifics were hard-coded; outputs differ per consultant; "I'd rather not update a skill that we're all using for every customer" without review [Day 4]. Skills live scattered across personal setups, claude.ai projects, and this workspace. |
| Non-assessment work is homeless | Support tickets, dev requests, status calls, invoices, and internal ops already happen here but outside the documented structure (loose folders like `Brixton/Commissions Reporting`, `Upward Projects/Bulk AP Invoice Approvals`, `ReatainerEstimate`). |
| Silo risk | "The thing I did for GW, nobody else knows that I did that" [Day 4]. AI-accelerated individual work reduces natural collaboration. |

### 2.3 Already closed since the summit

Worth naming, because it proves the self-improvement loop works and this roadmap builds on it rather than re-litigating it. Between July 31 and today the workspace shipped: the exhaustive candidate register with dispositions (the fix for the missed payout/customer-deposit topics), WRITING_STANDARDS with the no-novel, no-overreach, quote-cap rules, the humanizer pass, verification-stays-internal, fast-follow sections, the hyperlinked TOC and appendix cross-links, the standard MCP connection role and ScriptReader as standard install, CAPABILITIES.md as the tested can/cannot register, LOE baselines with the loe_log calibration loop, source-integrity checks on transcripts, ONBOARDING.md, the execution skill with two human gates, and the learnings-triage retro. The summit's single most repeated complaint (silent omissions) and its single most repeated style complaint (verbose novels) both have structural fixes in place today.

---

## 3. Operating principles

Carried through every item below. Most were said out loud at the summit; the rest fall out of the ICM canon.

1. **Files own engagement knowledge.** Every skill and portal feature reads and writes the same folders for anything a future session or human must reconstruct the engagement from. The database owns the interactive coordination layer formerly in Asana (tasks, comments, approvals, notifications, telemetry), and generated snapshots keep the folder narrative complete (amended 2026-08-22, Portal Beta Plan decision 2). Neither becomes a second source of truth for what the other owns.
2. **Human gates sit where liability sits.** Plan approval and production deploys stay human. "One small bit of damage... will be a liability of $1 million to my company" [Day 4].
3. **Evidence tiers everywhere.** Verified / Reported / Inferred discipline extends beyond assessments to exec summaries, status updates, and any client-facing claim.
4. **Check before create.** The duplicate-Asana-project rule, generalized: every artifact-creating flow checks for an existing artifact first.
5. **Consent is a record, not a memory.** MCP connections, ScriptReader installs, and write access get logged per client with date and approver.
6. **Succinct by design.** Format controls volume. "A burned client wants brass tacks, not a novel."
7. **Token discipline and model routing.** "You don't need Fable to write a PDF" [Day 4]. Default cheap, escalate deliberately, make cost visible. *Desktop mechanism shipped 2026-09-21:* root `.claude/agents/` workers (`pc-sdf-author` and `pc-transcript-miner` on Sonnet; `pc-code-chores`, `pc-data-condenser`, `pc-qa-inspector` on Haiku; `pc-escalation` on Fable behind a permission hook), `Delegate:` seams in the skills, and the "Model tiering" section of root `CLAUDE.md`. The portal's per-session-type routing (PORTAL_BETA_PLAN 3.2) inherits these names and tiers rather than inventing a second table. Cost visibility is still `/cost` by hand.
8. **Every correction becomes a rule.** The overnight-iteration loop that rebuilt the assessment process during the summit is the permanent operating mode: correction, rule, retest.
9. **Diverge on options, never on facts or commitments.** Creativity is invited in the solution space (lanes, spikes, off-label patterns); evidence claims, LOE numbers, billing language, and production changes stay conservative.

---

## Section A. What we do now: folder structure + Claude Code

Three waves. Each item lists what it is, why (summit evidence), and its shape (skill, reference file, convention, hook, or scheduled job). Everything here is buildable with what exists today, no custom software.

**Status snapshot, 2026-09-11 (artifact exists on disk; says nothing about adoption).** Wave 1: A1 (`ONBOARDING.md`, `Internal/provisioning/roster.md`), A2 (`Internal/SESSION_NORMS.md`), A3 (`.claude/skills/CHANGELOG.md`, skills registry at root), A4 (`new-engagement` skill, v0.2), A5 (`Internal/SALES_TO_DELIVERY.md`), A6 (access and consent pack inside `new-engagement`), A9 (`customer-exec-summary` skill in the registry), A11 (`ASANA_CONVENTIONS.md`), A12 (`DATA_CONNECTORS.md`, sandbox legs proven), A13 (done 2026-08-22), A14 (done), A17 (`feedback` skill, `feedback/`, generated `FEEDBACK.md`), A18 (all-hands held 2026-09-03). Wave 2: B8 (`celigo` skill), B11 (`PROMPT_PATTERNS.md`), plus the `transcribe` skill for recordings without transcripts (A7-adjacent). Not verified in this pass: A7, A8, A10, A16, the rest of Wave 2, all of Wave 3. A15 and A19 were removed from this roadmap on 2026-09-11 and are addressed in the portal (decision 26).

### Wave 1 (August): adoption and hardening

The Wednesday Aug 12 training meeting and the full-team rollout are the forcing function. These items make the rollout survivable.

| # | Item | What and why | Shape |
|---|---|---|---|
| A1 | Provisioning gate | A single checklist per consultant: Claude seat granted and merged, **$25/month usage-credit limit set** (no bulk default exists on the Team plan), Drive access verified, fonts installed, Python toolchain, MCP visibility, first session smoke test. Nobody "follows the doc" alone; a colleague lost a week that way [Day 4]. ONBOARDING.md becomes the script for a hands-on session, not a self-serve doc. | Checklist in ONBOARDING.md + a `provisioning/` roster file with per-person status |
| A2 | Session and usage norms | Written norms for: new session per task, clear-vs-continue, model selection and when to escalate, effort settings, "give it a big chunk before you walk away," parallel billable work while AI runs. All were confusion points [Days 3, 4]. | One-page reference file (`SESSION_NORMS.md`), taught Aug 12 |
| A3 | Skill governance | Shared skills get: a single home (this workspace), a changelog, and a review-before-change rule for anything multiple consultants run. Client specifics move to per-client instructions (CONTEXT.md or Claude Project instructions), never hard-coded in shared skills. Fixes the MSP leakage class of bug [Day 4]. | Convention + `.claude/skills/` as the canonical registry + CHANGELOG.md (git deferred, decision 2026-08-11) |
| A4 | Engagement scaffolder ("intake wizard" as a skill) | One command creates a new client: folder structure, CONTEXT.md pre-filled from an interview (engagement type, URL for website research, billing channel boilerplate, key contacts), access-request tracker, and a check for existing Asana projects and folders before creating anything. This is the summit's intake wizard, no UI needed yet [Days 1, 2, 3]. | New skill: `new-engagement` |
| A5 | Pre-sales and kickoff-prep stage | Extend the lifecycle upstream: ingest sales notes and pre-sales transcripts, run MCP discovery, research the website, and emit a kickoff agenda plus questions to send the client before the call. "The thing the customers hate most is repeating themselves" [Day 3]. The internal turnover process (who creates the project, email group, folder) gets written down as machine-readable context. | Extend rapid-assessment skill routing with a `kickoff-prep` path + a `SALES_TO_DELIVERY.md` reference |
| A6 | Access and consent pack | Standard access-request package fired at engagement start: MCP consent email template (with MSA language), sandbox request (not production), ScriptReader install notification, connector-role details. Tracked in CONTEXT.md with dates. Kills the "asked for sandbox, got production" loop [Day 3] and makes consent auditable [Day 4]. | Templates in `templates/engagement/` + CONTEXT.md fields |
| A7 | Ingest pipeline and integrity | Adopt Taha's Apps Script org-wide: recordings auto-file into the client's `source/` with alias mapping and a confirm prompt. Add a completeness check: every scheduled client call must produce a transcript or raise a flag (a call silently produced none [Day 1]). Source-integrity checks already exist in the skill; the missing piece is the transport and the alarm. | **Design note 2026-09-11: `Internal/MEETING_INGEST_PLAN.md`**, pulled forward because the portal's index pipeline only sees client folders. Central job on the VPS via domain-wide delegation, four-rung identification ladder (attendee domains, title convention, transcript content, ask the organizer), two-way Google Chat confirm loop, `source/meetings/` filing with Markdown exports, generated `working/meetings_log.md` with the completeness flag. **Built and live 2026-09-14 as Paco** (collaborator build; handoff at `Internal/paco-documentation/`, session-facing `PACO.md` at root, 27-account roster, Monday dashboard delivery moved onto the same identity). Departures from the design note: flat `{Client}/source/` rather than `source/meetings/`; no classifier rung and no alias learning; client selection is the approval, no second confirmation; no missing-recording reminders (silence by design); forward-only scan window from rollout. A third capability, the **weekly board update**, was built and deployed 2026-09-14 in the same session that documented the handoff: every Monday at 10:00 ET Paco links the week's executive summary and posts the Asana tasks needing attention into each mapped client's internal team space, gated by a live check that every member of the space is Power Cloud staff (`Internal/paco-documentation/05-board-updates.md`). Open follow-ups from the handoff: credential-expiry ownership and state backup, arbitrary-attachment support, late-artifact pickup, undo, prospect adoption into `new-engagement`, `build_engagement_log.py` meeting columns |
| A8 | Read-only enforcement, defense in depth | Today read-only during discovery is a CLAUDE.md rule; the team themselves briefly conflated rule and role [Day 2]. Add mechanical backstops: a Claude Code hook that blocks `ns_createRecord`/`ns_updateRecord` outside an `execution/` working directory, and longer term a read-only variant of the connector role for discovery connections. | Hook in `.claude/settings.json` + role variant in ScriptReader project |
| A9 | Exec-summary hardening | The Day 4 fix list, shipped as one release: MSP via per-client instructions, trailing two full weeks, draft-then-approve flow with a customer-facing folder (mirrors working/ vs deliverables/), parse subtask statuses and latest comments, standardized template, 4-5 slide branded deck output, and the interview step that reconciles Asana against the assessment. Plus evidence tiers: "no defined next steps" was a hallucination the discipline would have caught [Day 4]. | Update the exec-summary skill; move it into this workspace's registry |
| A10 | File naming and versioning | Version numbers on generated deliverables, standard session titles (client + environment), standard meeting titles (the "NetSuite work session" x12 problem). Small, cheap, repeatedly requested [Days 3, 4]. | Convention lines in CLAUDE.md + skill templates |
| A11 | Asana hygiene conventions | Statuses including "not started," sections, owners, due dates, deliverables attached to tasks, point-person tag per task. Every exec-summary defect traced to input hygiene: "s*** in, s*** out" [Day 4]. Scoped as interim: the minimum the exec-summary and task-intake flows need until the portal's work layer replaces Asana (decision 2026-08-11). | One-page convention + enforced by the exec-summary skill's checks |
| A12 | Source-connector feasibility spike (QB + Shopify) | Prove tier-2 data connections with zero customer involvement, using our own properties and free developer sandboxes. QuickBooks: Intuit's official QBO MCP server (145 tools, OAuth, sandbox mode, and `QUICKBOOKS_DISABLE_WRITE/UPDATE/DELETE` flags for read-only operation) against a free Intuit developer sandbox company. Shopify: the official **Shopify AI Toolkit** plugin (installed 2026-08-11, user scope) covers docs/schema lookup, GraphQL/Liquid validation, and CLI-authenticated store management; first test is whether its authenticated surface covers the data reads the spike needs, falling back to a read-only Admin API custom app (`read_products`, `read_orders`) against FMW's live store or a free Partner development store if not. Definition of done: pull customers/items/orders read-only from each source, generate a data profile, produce a mapping spec to NetSuite templates, dry-load into the 44 demo account, reconcile counts via MCP reads. Every result lands in CAPABILITIES.md. **Status 2026-08-11: both sandbox connections proven and profiled same-day (QBO via official Intuit MCP server; Shopify via client-credentials grant); runbook written (`DATA_CONNECTORS.md`). Remaining: mapping specs, dry-load (needs 44 connector re-auth), and the two production verifications parked below.** | Spike, this month; feeds B12/B13 |

### Wave 2 (September-October): the OS covers the whole job

Today the workspace covers assessment and execution. Consultants also run support tickets, status calls, client comms, billing, and internal work. The folders already show this happening unsupported.

| # | Item | What and why | Shape |
|---|---|---|---|
| B1 | Support/ticket work mode | A lightweight structure for ongoing work that is not an assessment: task folder under the client, Asana task as source of record ("grab it from the task title and get all the information from there" [Day 3]), plan-before-build gate, the dev-approval handoff. Absorbs the loose `Brixton`/`Upward Projects` pattern into the standard. | Extension to the execution skill (task intake path) + folder convention |
| B2 | Client comms drafting | Standard skills for the writing consultants already do here ad hoc: status updates with human-controlled disclosure ("it'll be done, but don't even mention it" [Day 3]), billable-rework notices in non-apologetic language [Day 2], proceed-gate messages ("we're at the 4-6 hours, are we good to proceed?" [Day 3]). | `client-comms` skill with message patterns |
| B3 | Hours and billing artifacts | Draft timesheet narratives and invoice-comment cleanups from the work record. The 44 Pro dispute was fueled by jumbled invoice comments, and "bill to the specific task" depends on memory today [Days 2, 3]. See also C2. | Skill + NetSuite MCP (internal connection) once consultant access is solved |
| B4 | Deliverable ledger and scope-of-record | Per engagement: what was promised, delivered, tested, communicated, and what was explicitly out of scope. The Retrofit AR dispute and the 44 Pro scope fight were both archaeology exercises through emails and memories [Days 2, 3]. CONTEXT.md grows a Deliverables and Scope section that skills maintain. | CONTEXT.md sections + update discipline in skills |
| B5 | Stakeholder registry | Per-client contact map: role, Asana access, tagging rules, who owns what. Built by contact enrichment from meeting attendees and email [Day 3]. Ends transcript archaeology ("Ann was the one who first started..."). | CONTEXT.md Key contacts, auto-enriched by a skill |
| B6 | UAT checklist generation | Generate per-work-item UAT scripts from the assessment and execution plans. "Their UAT sucked" is the root of the 44 Pro dispute; the client's own 25-use-case list impressed [Day 2]. Sellable artifact. | Skill fed by execution plan blocks |
| B7 | Templated task library | The repeatedly named candidates: unused item/vendor identification, UOM audit, supply-allocation enablement with prerequisites, approval workflows via script, item-master cleanup, APM concurrency read from screenshots, vendor-comparison matrices (WMS, demand planning). Each becomes a small skill with an LOE baseline. | Skills + LOE_BASELINES entries |
| B8 | Integration monitor foundations | Celigo MCP/API connection as a standard onboarding step next to NetSuite (44 sandbox as test bed, permission already granted [Day 4]). Error triage patterns (200 failures, 30 real) become a skill; the portal later gets the dashboard (D-phase). | CAPABILITIES-verified connection + `celigo-triage` skill |
| B9 | Setup playbook and preflight | Ashot's SDF+MCP setup playbook, formalized: the five manual settings before SDF connects, feature dependency order, role permission self-check on connect ("run these six queries; any Record-not-found means fix the role first"), bundle/managed-bundle distribution of the role so updates propagate [Days 3, 4]. | `SETUP_PLAYBOOK.md` + preflight step in sdf-scaffold/sdf-deploy + ScriptReader packaging decision |
| B10 | Adversarial QA pass | Formalize what worked ad hoc: an independent second-pass review of client-facing drafts in a fresh context (optionally a different model), checking against evidence.md and the option-completeness question ("did you consider the native feature?"). The doc-vs-doc comparison was the best QA tool of Day 1; option-completeness was the Day 3 worry. | QA_CHECKLIST step + a `red-team` skill run before checkpoint 3 |
| B11 | Prompt pattern library | The hard-won techniques, written down: context-without-leading, current-state-before-design, greenfield reframe ("don't assume anything has to stay"), side-question audits, "what's your source?", never give it the out of "check with the customer." Taught Aug 12, embedded in skills over time. | `PROMPT_PATTERNS.md` reference |
| B12 | Data as a formal workstream | Data becomes the third thing a project delivers, alongside configuration and code, with its own pipeline: (1) **profile** the source (entities, volumes, anomalies; formalizes the NSID-column interrogation the 44 Pro test showed spontaneously); (2) **design decisions** surfaced explicitly, because matrix-vs-attributes and customer parent/child are decisions expressed as data, and one-way-door settings (matrix, costing method, UOM, serialization) get a named checklist; (3) **mapping spec as the contract**: source field, target field, rule, example rows, edge-case counts. The human reviews the mapping, not ten thousand rows (the Inventory Received Not Billed near-miss is the argument); (4) **dry run in sandbox** verified by MCP reads (counts, referential integrity, spot checks), reconciliation report as a client deliverable; (5) **production load at a human gate**, pipeline re-runnable with external-ID discipline. | Assessment skill (data profile in discovery) + execution skill (migration task type) + mapping-spec template + playbook data section |
| B13 | Source-system connector tier | Tiered acquisition, read-only, same consent rules as NetSuite: tier 1 files (with integrity checks, proven); tier 2 direct API/MCP for systems that have them, QuickBooks (official Intuit QBO MCP server, write tools disabled) and Shopify (Admin API read scopes) first, each proven once via A12 and logged in CAPABILITIES.md; tier 3 no-API legacy lands as SQL/report exports, which is tier 1 with extra steps. UI scraping stays off the table (Playwright deferred, Day 4). | Connector register in CAPABILITIES.md + per-source setup notes |
| B14 | Data Readiness Assessment (product proposal) | A sellable pre-implementation engagement: profile the client's source data, find the cleanup work (unused items, UOM conversions, duplicate customers, attribute normalization), deliver a readiness report and cleanup backlog before migration is scoped. The ABC Guitar lesson ("a project to clean up everything on Shopify before they even got started would have been a gigantic improvement" [Day 3]) plus the Grinds item-master slog. Directly feeds the 15-day-implementation thesis, where "data readiness is the wild card." Proposed for PRODUCTS.md; Mike commits catalog entries. | PRODUCTS.md candidate + LOE baselines per entity as actuals accrue |
| B15 | Solution lanes + fitness screen (creativity, bounded) | Diverge on options, never on facts or commitments. Every material problem gets candidates from five lanes: native feature (Oracle-doc-checked), creative use of native tools (the deposit-as-deferred-revenue lane), config/script patch, custom interface inside NetSuite (the GW dashboard lane), product/third-party. An empty lane must say "none viable" explicitly; the billing-schedule miss was a skipped lane, not a creativity failure [Day 3]. Survivors pass a fitness screen before reaching a client or build plan: native alternative checked, total cost of ownership and who-maintains-it, upgrade risk (no DOM hacks), evidence tier of assumptions, effort class. Failed ideas go to the ideas log, not the trash. Anti-anchoring passes (greenfield reframe, steelman-the-alternative, consultant preference withheld until after the first proposal) join B11's library. Deliverables carry one "alternate approaches considered" sentence per major item. Playbook gains a **creative patterns** section: tool-off-label patterns with the when, the why, and the risks, because the tool transfers patterns well but cannot invent what it was never shown [Day 3]. | Solution-research step in the assessment skill + playbook section + WRITING_STANDARDS line + ideas log |

### Wave 3 (Q4): the knowledge flywheel

The summit's flagship request: "if this was smart enough to come back and say 'we've already done this and here's what we did' without me having to ask" [Day 2].

| # | Item | What and why | Shape |
|---|---|---|---|
| C1 | Feedback-loop knowledge builder | A scheduled process outside any client context that walks new recordings, session retros, and learnings files, and proposes playbook/capabilities/baseline entries with the curation gate the team demanded (nothing enters doctrine without human approval; entries carry the when and the why, not bare rules). Includes retroactive ingestion of historical docs. Extends the existing learnings-triage loop from per-engagement to firm-wide. | Scheduled Claude Code job + triage queue file the user reviews |
| C2 | Session-to-timesheet drafts | Claude Code session logs know which client folder was active and what was done. Draft time entries and task-level billing notes from them for the consultant to confirm. Attacks the "bill to the specific task" memory problem and the internal-hours confusion [Days 3, 4]. | Skill over session logs; later a portal feature |
| C3 | Release-notes ingestion | Each NetSuite release feeds the knowledge builder: flag stale workarounds ("you used to do X, 2026.2 does it natively"), new-feature candidates enter the playbook as alternates until confirmed, staleness dates on entries [Day 2]. | Semi-annual scheduled job + playbook convention |
| C4 | Per-customer feature registry | A registry of what each client uses (features, integrations, key scripts) so a platform change maps to affected clients within minutes ("Shopify changes its API: which of our customers did we configure this flow for?" [Day 2]). Doubles as the dormant-account discovery substrate. | `REGISTRY.md` per client, generated from verification passes; roll-up index generated by script |
| C5 | Factory change log (git deferred) | Decision 2026-08-11: no git for now. In its place, A3's convention does the work: a `CHANGELOG.md` next to the skills recording every shared-skill and reference-file change (date, who, why), plus review-before-change for anything multiple consultants run. Revisit git if the convention proves too weak. The portal itself lives in its own private repo (plan decision 4), and the plan names a git-canonical OS as the post-beta end state; neither changes the no-git rule for the methodology layer today. | CHANGELOG.md + review convention |
| C6 | Golden-engagement regression suite | The Shinesty redo was, accidentally, an eval: same inputs, improved process, compare outputs. Keep one anonymized engagement as a fixture and re-run it when skills or models change materially, diffing against the approved finals. This is how process changes stop being vibes. | Fixture folder + a `regression-run` skill and comparison checklist |
| C7 | Dormant-account discovery | For clients under contract with MCP access: a periodic, read-only health pass that surfaces findings worth a conversation. Anderson Frank's "50 clients but the hours don't reflect it" is the commercial case [Day 4]. Guardrails: read-only role, consent already on record, human reviews before anything reaches the client. | Scheduled job per consenting client + findings queue |
| C8 | Innovation pass | Quarterly per active client: "given everything in this folder, what would we build that nobody asked for?" Candidates run the B15 lanes and fitness screen, then land in the opportunities/fast-follow list for the consultant to pitch or park. The "opening new doors" thesis in tool form, and the one place where escalating to the frontier model on high effort is worth the tokens. | Scheduled pass + opportunities log per client |

---

## Section B. What gets built into the custom tool

### The boundary rule

Build custom software exactly where the file-based approach structurally loses, and nowhere else. ICM names the losing conditions precisely, and they match the summit's asks one for one:

| Files lose at... | Summit demand it maps to |
|---|---|
| High concurrency, many users on one pipeline | Whole-team + eventually customers using the same system |
| Real-time monitoring and messaging | Integration monitors, proactive chat agent, usage dashboards |
| State isolation and permissions | Customer access with token/privacy guardrails; consultant vs dev vs client roles |
| Automated mid-pipeline branching | Model routing, token budgets, "backend picks the model and temperature" |
| UI affordances | Buttons for standard processes, intake forms, tiles per customer, approval workflows |

Everything else stays in the methodology layer. The rule as amended 2026-08-22 (Portal Beta Plan decision 2): **files own engagement knowledge; the database owns the interactive coordination layer formerly in Asana; generated snapshots keep the folder narrative complete.** In practice: CONTEXT.md, candidates, evidence, verification, drafts, deliverables, execution plans, and retros stay markdown on the shared drive, because they are what a future session or human reconstructs the engagement from. Tasks, statuses, assignees, comments, approvals, notifications, telemetry, and audit live in Postgres, because they were never file-owned (they lived in Asana) and they need typed fields, permissions, and concurrency. The portal renders `working/tasks.md` and `working/approvals.md` into each client folder so the walk test survives: any consultant can still open the folder and understand the state, the system stays model-portable, and the portal can fail without the practice failing. The database-versus-markdown debate from the summit [Day 2] is closed on these terms; the September 2026 independent review reached the same split on its own (section 6b).

### Portal build plan

The build spec is `Internal/PORTAL_BETA_PLAN.md` (v5). This roadmap no longer carries a parallel phase list. The v0.1 to v0.4 sketch from August maps onto the plan's phases as follows, kept so older references still resolve:

| August sketch | Where it landed in the plan |
|---|---|
| v0.1 read-only dashboard (client tiles, usage telemetry) | Phase 0 Foundations: client tiles from CONTEXT.md frontmatter, audit stream, domain events table, cost telemetry for portal-launched work. Desktop-usage, friction, and bypass telemetry (formerly A19) is a portal post-launch item, not a roadmap item (decision 26). |
| v0.2 buttons and intake | Phase 4 Agent workbench (Beta 2 track): two to three buttons (exec summary, new-engagement wizard, draft use case), model routing and budget caps, behind the per-session container jail and egress allowlist. |
| v0.3 work layer, Asana replacement | Phase 1 Work layer plus phase 3 Cutover: work items, tasks, two-lane comments, portal MCP tool, Asana import, per-consultant cutover waves. Integration-monitor tab deferred; the `celigo` skill covers it from the desktop. |
| v0.4 outward-facing | Phase 2 Approvals and client portal, pulled forward by decision 8 as amended: clients view, comment, and approve; no agent access, no token burn. Proactive chat agent and mood tracking cut from the beta. |
| (not in the sketch) | D1 shared project conversation and D2 permission-filtered context assembly, both post-launch (section 6b). |

**Build ownership.** Mike builds it with Claude Code doing the work (decision 2026-08-22; the AI engineer did not join). The framing from the August handover notes that still holds: the methodology layer is the spec and the portal wraps it rather than working around it; Claude Agent SDK for the engine, behind the runner's own event API so the engine stays swappable (plan section 3.4); MCP as the integration spine; usage observability is a P1 feature with the seats-versus-overage decision waiting on it; and the golden-engagement suite (C6) is the eval harness for every engine, model, or prompt change.

---

## 4. Recommendations the summit did not ask for

From comparing the transcripts against the workspace and the ICM canon. Ranked by conviction.

1. **Mechanical read-only enforcement (A8).** The read-only rule is currently a promise in a markdown file. A permissions hook plus a read-only discovery role makes the $1M-liability framing structural. Cheap, do it first.
2. **Session-to-timesheet drafts (C2).** Nobody proposed it, but three separate pain points (task-level billing, internal-hours confusion, invoice-comment disputes) share this fix, and the data already exists in session history.
3. **A consent and governance record per client (A6 extension).** Date-stamped record of MCP consent, ScriptReader install notification, write authorizations, and who approved. The team's own liability instincts demand an audit trail, not just a habit.
4. **The golden-engagement eval (C6).** The practice now changes its own process weekly. Without a fixture to re-run, every process change is judged by anecdote. This is the single highest-leverage quality investment available.
5. **Treat Power Cloud itself as a client folder.** Internal ops (retainer estimates, MSA templates, hours analysis, the summit itself) already squat in the workspace. Give "Power Cloud Internal" the same structure as a client: CONTEXT, source, working, deliverables. The OS should run the firm, not just the engagements.
6. **Vetting-tax reduction as a design goal.** The bottleneck is human proofreading. Skills should emit diffs-only updates on iteration, confidence flags on claims, and keep client-facing drafts inside the length budget so review is minutes, not hours. Measure review time per deliverable as a KPI of the whole system.
7. **An engagement template, extracted.** ICM's method-vs-instance rule: the blank client-folder structure (with stage contracts and empty registers) should exist as a template separate from any real client, versioned with the factory. The scaffolder (A4) instantiates it.
8. **Silo countermeasure as a ritual, not a hope.** The shared folder mitigates silos only if work lands there. A weekly ten-minute "what did you build this week" round, fed by C1's digest of session activity, turns the knowledge builder into a social loop. GW-dashboard-style wins stop being invisible.

---

## 5. ICM alignment

You built ICM by instinct; the audit confirms it. Mapping against the five-layer canon:

| ICM layer | Power Cloud today | Verdict |
|---|---|---|
| L0 routing (CLAUDE.md, 300-800 tokens) | CLAUDE.md at ~3,500 words | Overweight: it absorbed payload (MCP diagnostics, template). Trim toward routing; push detail into L3 files |
| L1/L2 contracts (CONTEXT.md per stage) | Client CONTEXT.md exists; working folders have no contracts | Adopt stage contracts for `execution/` task folders and the new work modes (B1), where a session must orient fast |
| L3 factory (references) | PLAYBOOK, WRITING_STANDARDS, PRODUCTS, LOE_BASELINES, QA, CAPABILITIES | Strong. Add internal routers as they grow (the playbook already needs per-area jump markers, requested Day 2) |
| L4 product (run artifacts) | source/ working/ deliverables/ | Strong; matches ICM's pipeline form exactly |
| Library rules | Mostly followed | Gaps: no generated indexes (client registry, feature registry should be script-built), method and instance not yet separated (recommendation 7) |

Adopt deliberately for everything new: `_templates/` and `_shared/` naming for meta folders, one-fact-one-home linking, generated-never-hand-edited indexes, and the **walk test as the release gate** for any workspace or skill change: an agent with no memory must orient, act, and report status from the files alone. Skip: renumbering existing client folders or retrofitting stage numbers onto shipped engagements; disruption without payoff.

For future add-ons, pick the ICM form first: new workflow = pipeline; client estate = record library; playbook growth = knowledge bundle; the firm itself = context map. The icm-architect skill is already installed for exactly this.

---

## 6. Decisions from the 2026-08-11 review

Interview with Mike, 2026-08-11. These override anything to the contrary above.

1. **Exec summaries are always human-reviewed. Permanent policy.** Draft, consultant approve, customer-facing folder. No graduation criteria; announce at the Aug 12 rollout.
2. **Two offerings, two names.** On-site engagements of two full days are **Rapid Assessments**. Remote assessments run in a handful of 2-hour chunks are **Fast Track Discovery**. Follow-up: reflect this naming in WRITING_STANDARDS and the rapid-assessment skill's remote-engagement framing (internal file and skill names stay as they are).
3. **The portal replaces Asana.** v0.3 is designed as the replacement from day one; Asana investment between now and then is the interim minimum needed by the exec-summary and task-intake flows (A11), plus a migration path for open tasks.
4. **No git for now.** Skill governance runs on the single-home + CHANGELOG.md + review-before-change convention (A3, C5 revised). Revisit if the convention proves too weak.
5. **Dormant-account discovery is per-client opt-in**, pitched as a periodic account health check (C7 proceeds under that posture). It doubles as the dormant-account door-opener.
6. **Data handling goes into the MSA.** Mike provides the current MSA; the AI/data-handling language gets drafted into it directly (attorney review after) rather than as a standalone policy document.
7. **The Day 3 "MCP project shelved" note is dropped.** Past project, not relevant to what is being built.
8. **Customer portal access: posture yes, build later.** v0.4 stands as planned; consent and MSA language stay compatible; nothing built until the portal proves itself internally.
9. **NetSuite-only, stay portable.** Methodology stays structurally platform-neutral; zero investment in other platforms until a real deal appears.
10. **Anthropic certifications: technical staff only.** Consultants prove competence through the rollout instead.
11. **Compensation model is out of scope for this roadmap.** Handled in a separate business planning track.
12. **Data becomes a formal workstream** (added in the same review): profile, explicit design decisions on one-way doors, mapping spec as the human-gated contract, sandbox dry run with MCP reconciliation, gated production load (B12-B14). Feasibility of QuickBooks and Shopify connections gets proven now against our own properties and free developer sandboxes, no customer needed (A12).
13. **Creativity gets structure, not a leash** (same review): five solution lanes with explicit "none viable" declarations, a fitness screen before anything reaches a client or build plan, anti-anchoring prompt passes, a creative-patterns playbook section, and a quarterly innovation pass per client (B15, C8, principle 9).

## 6a. Decisions and additions from the 2026-08-21 discussion (Mike + Taha)

Source: `Internal/Taha Mike - PowerCloud OS Discussion - 2026_08_21 13_13 EDT - Notes by Gemini.md` (full transcript with timestamps). Additive to section 6, and overrides anything to the contrary above.

### Decisions

14. **PowerCloud OS becomes its own Google shared drive.** The old `Power Cloud Project Folders` drive gets legacied or archived, with a shortcut back into it so legacy client material stays reachable [00:02:58]. Motive is short, clean paths and an isolated structure; the setup stays portable as long as the move is re-shared properly [00:05:05]. Open sub-question Mike still owes: rename the existing drive versus stand up a new one.
15. **"Proposal" is renamed "Presentation."** Taha's point: "proposal" implies we are still trying to win the work, which is the wrong language for a deliverable that walks a client through findings [00:17:36]. Applies to the `.pptx` deliverable name, the CLAUDE.md deliverables section, the rapid-assessment drafting stage, ONBOARDING, and the all-hands narrative. Internal file and skill names are unaffected.
16. **No development or deployment begins without verified client approval, and the dev team sits in the loop.** The consultant still owns the use case and the client relationship. Claude does not start building until it can confirm approval on the referenced Asana task (or an approval email brought in and pasted onto the task with the source cited), and scripted work routes through the development team for a build-quality review before it goes back to the consultant for testing [00:24:34, 00:25:46, 00:27:43]. Taha's stated risk is twofold: consultants bypassing process and self-deploying, and the model making confidently wrong calls in gray areas where it has no judgment. This gate migrates into the work layer when the portal replaces Asana (decision 3 stands).
17. **Rollout all-hands: September 3, 90 minutes, mandatory, titled "PowerCloud roll out."** Step-zero setup is a prerequisite, with calendar time from Mike for anyone who gets stuck [00:35:50, 00:44:51, 00:46:28]. Note: the Gemini "Decisions" block in the notes says September 11; that was an intermediate option they reverted from. September 3 is what was scheduled on the call and what the next-steps list carries.

### New items

| # | Item | What and why | Shape |
|---|---|---|---|
| A13 | Shared-drive migration | Stand PowerCloud OS up as its own shared drive per decision 14, then sweep every absolute path that assumes the old root: CLAUDE.md, skills, `.claude/settings.json` and the write-guardrail hook, `.claude/scripts/`, the backup sync script, and each client `CONTEXT.md`. Re-share to the team and confirm every consultant can reach both drives before the all-hands, because a path break during rollout looks like the tool itself is broken. | Drive change (Mike owns Drive admin) + path sweep + a re-verified provisioning check |
| A14 | Presentation rename sweep | Decision 15 applied everywhere the word appears in client-facing use, including the `{Client}_Proposal_{date}.pptx` filename pattern. One pass, logged in `.claude/skills/CHANGELOG.md`. | Terminology sweep across CLAUDE.md, rapid-assessment stage 04, ONBOARDING, templates |
| A16 | Per-client hours log | The Monday NetSuite time extract gains a secondary action: write each client's weekly hours into a log inside that client's own folder, so the exec-summary skill reads locally and no consultant needs NetSuite access or a manual export [00:06:42]. Code is written, not yet deployed or tested. Carries a known one-week lag, because hours are only reliable the following Monday; that caveat must appear in the deliverable and be announced at the all-hands so a Friday summary is not read as current [00:07:42, 00:09:44]. Supersedes the central-extract path as the exec-summary skill's default hours source. | Update the Monday dashboard job + exec-summary skill hours-source section + a line in the all-hands script |
| A17 | Feedback and ideas capture | A single file the team drops feedback, friction, and feature requests into from inside a session, which Mike triages periodically for feasibility and value [00:40:00] (the AI engineer did not join, decision 2026-08-22). Distinct from C1: that one curates NetSuite and process knowledge, this one is product feedback on the OS itself. Announce it at the all-hands or it stays empty. | A root-level capture file + a capture path the skills can write to + a periodic triage ritual |
| A18 | Rollout program | The Sept 3 mechanics as a tracked item, not a hope: distribute the how-to PDF and the longer capabilities guide, mandate step zero with Mike's calendar open for blockers, walk the one-engagement-end-to-end narrative, then three ten-minute case studies from Imran, Justin, and Ron, vetted in advance by Mike and Taha for relevance and non-redundancy. Case studies must be professional-services work, not development, and must answer: what was the customer problem, how did Claude help solve it, how did it help implement it, and what was better than the old way [00:35:50, 00:38:59, 00:40:00]. India team attendance confirmed through Besh. | Agenda + presenter brief + pre-vet session |

### Amendments to existing items

- **A1 (provisioning gate)**: add a hardware baseline. Claude-heavy work is memory-bound before it is CPU-bound; the working recommendation from the call is NVMe storage, 32GB RAM as the floor with a path to 64GB, and a real GPU [00:48:03]. Also add step-zero-with-Mike as the standard unblock rather than self-serve documentation, which is the lesson the summit already taught.
- **A5 (pre-sales and kickoff prep)**: reaffirmed as the priority gap. The target sequence is explicit now: sales handover email starts the engagement, MCP access is requested and granted, and discovery runs *before* the client kickoff [00:40:00, 00:41:08]. Add the standardized access-request email as something Claude drafts and eventually sends. Mike does not expect this live by the all-hands; the interim requirement is only that the folder gets created and pre-sales calls land in it.
- **A9 (exec-summary hardening)**: hours source moves to A16's per-client log. The one-week lag becomes a stated caveat in the deliverable, not a footnote.
- **A11 and decision 3**: unchanged and reaffirmed. Asana stays the interim system of record, and A15's gate is designed to migrate into the work layer rather than be rebuilt there.
- **Section 5, ICM L0 row**: closed. Mike has since trimmed CLAUDE.md and pushed payload out into skill files [00:13:41], which was the finding.
- **Portal v0.1**: A19's adoption and friction telemetry joins usage and cost telemetry in the first read-only dashboard. Same argument, different metric: the seats-versus-overage decision needs cost data, and the portal's own feature list needs friction data.

### Proof points worth keeping

Not roadmap items, but useful at the all-hands and in sales material. Taha's FMW win: a customer complained that a fastener specification was wrong, and Claude verified the complaint, found every other category carrying the same error, and corrected them across the customer-service portal system, work that would otherwise have taken days [00:19:47]. Mike's read after several weeks of use is that data handling has been the standout: ingesting messy conversation plus raw exports and landing it in NetSuite in the right shape, better than expected [00:20:48].

## 6b. Decisions from the September 2026 independent review (recorded 2026-09-11)

Source: two review documents filed at `Internal/2026-09 Independent Review - Current State Evaluation.md` and `Internal/2026-09 Independent Review - Next-Version Architecture.md`, discussed with Mike 2026-09-11. Additive to sections 6 and 6a, and overrides anything to the contrary above.

### Decisions

18. **The Portal Beta Plan stands as the spec; the review confirms it.** The review independently reached the same architecture (Next.js, Postgres via Supabase with row-level security, a separate agent runner, Drive as the canonical file store, a Postgres-backed queue, application-owned audit, no Temporal, no Asana clone, no file migration) and the same file-versus-database split as plan section 3.3. Treated as confirmation, not a new direction.
19. **Agent engine: Claude Agent SDK behind the runner event API, unchanged.** The review's OpenAI Agents SDK backbone with Anthropic as a secondary provider is declined. The methodology is expressed as skills, CLAUDE.md, hooks, MCP wiring, and tool allow and deny lists, which the Agent SDK runs natively; another orchestrator would have to reimplement the skill loader, hook enforcement, and permission gates before it could execute a single stage. Provider portability comes from the runner seam and the C6 fixture suite (plan section 3.4), not from the orchestration framework.
20. **Runner hosting: owned Linux VM, unchanged.** The review's managed app host (Railway or Fly) for the agent service is declined. The runner runs agents over client-authored files, which is a prompt-injection surface; the controls are a per-session container jail and an egress allowlist, standard tooling on an owned VM and awkward or unavailable on managed hosts. The review does not address the injection surface.
21. **Adopted: domain events as a first-class table in the phase 0 schema.** Task, approval, file, message, and agent-run events written as rows at the moment of change, feeding background jobs and the audit stream. Cheap now, and the precondition for event-driven agents later instead of periodic folder crawls.
22. **Adopted: customer, engagement, workstream as the database hierarchy.** The nested `{Client}/{Project}/` folder is a workaround for a business model the folder tree cannot express. The schema carries the correct hierarchy from phase 0; folders stay nested; CONTEXT.md frontmatter is the link.
23. **Adopted as a post-launch item: shared project conversation (D1).** Sequenced after the work layer and approvals, not before them. The review's ordering (conversation in its second sprint, ahead of tasks and approvals) is declined: approvals are the job that brings people to the portal, a conversation feature competes with Slack and Google Chat for attention, and an AI participant in a shared thread cannot exist before the Beta 2 jail.
24. **Declined for the beta: moving requirements and decisions out of files.** The candidates register, evidence log, and verification file are the assessment skill's working memory and stay file-native; moving them would touch every stage of every skill. Decisions from execution design sessions may move later.
25. **Context assembly with permission filtering (D2) is noted, not scheduled.** Required before any client-facing agent exists, and client-facing agents are cut from the beta. Doctrine files keep loading whole, routed by skill stage; no chunked retrieval over the playbook. The review's own principle (data model, events, permissions, and workflows over chat plus retrieval) argues the same way.
26. **A15 and A19 removed from this roadmap; both are addressed in the portal (Mike, 2026-09-11).** No interim Asana-based approval gate or session-log telemetry script gets built. The client-approval and dev-review gate is the portal's approval ledger and computed "build may start" property (plan section 4, item 8), flipped in phase 3; the dev-reviewer role is in the plan's role model. Adoption, friction, and bypass telemetry becomes a portal post-launch item. Until then, decision 16 holds as practice: no build without the consultant confirming client approval, and scripted work goes through the development team.
27. **No further status marking or re-sequencing of Waves 2 and 3 (Mike, 2026-09-11).** The unbuilt items stay listed as written; what matters will surface naturally during the portal build.

### New items

| # | Item | What and why | Shape |
|---|---|---|---|
| D1 | Shared project conversation | Threads where several staff, later clients, and an agent work one discussion, stored in Postgres with users and agents as authors, delivered in realtime. The one idea in the review the plan did not already have. The two-lane comment tables are the seed, so the agent author is additive rather than a redesign. Post-launch; the AI participant waits on the phase 4 jail. | Postgres threads and messages extending the two-lane comment tables + Realtime behind the plan's wrapper + agent author gated on phase 4 |
| D2 | Permission-filtered context assembly | A runner-side context builder that loads core rules and the stage contract, current project state from Postgres, selected Drive files, and only then applies the user's or agent's permissions before anything enters model context. Today's CLAUDE.md plus skill routing plus CONTEXT.md is the staff-only version; the permission step is what a client-facing agent would need. Waits until one exists. | Runner-side builder; policy read from Postgres; applied before model context is assembled |

### Amendments to existing items

- **Vision layer 3, the Section B handover notes, C5, A17:** AI-engineer references retired (plan decision 5, applied here 2026-09-11). The handover notes are folded into the Section B build-ownership paragraph.
- **Principle 1 and the boundary rule:** reworded to the amended rule (plan decision 2).
- **Portal phases v0.1 to v0.4:** replaced by the mapping table onto the plan's phases 0 to 4.
- **A17:** shipped as the `feedback` skill, the `feedback/` inbox, and the generated `FEEDBACK.md`; the triage ritual is Mike's.
- **Parking lot:** items renumbered into order; no content change.
- **A15 and A19:** rows removed from the 6a new-items table (decision 26). The 6a decision 16 text and its amendments stand as the historical record of why the gate exists; the mechanism now lives in the plan.

## 7. Parking lot: still open

1. **Seats vs overages (usage policy).** Working policy set 2026-08-11: usage credits enabled; **$25/month credit limit per user**, set individually per member (the Team plan has no bulk default, so setting the limit is a line on the A1 provisioning checklist for every new member); org-wide cap as backstop; auto-reload on. A member who exhausts the $25 pauses to included seat usage until month-end, which acts as the "come talk to me" trigger. Still pending: premium seat assignments (proposed: the four proven daily drivers) and the 30-day MTD-spend review that graduates consistent heavy credit users to premium seats.
2. **MSA handoff.** Mike to confirm the current MSA version and hand it over for the AI/data-handling update (decision 6). A candidate copy exists at `ReatainerEstimate/Power Cloud Master Services Agreement - Steve Hyham Update 1162025.docx`; unconfirmed whether it is current.
3. **AI-consulting website.** "There's a chance we may pop up a new website and go to market as an actual AI consulting firm" [Day 3]. Not yet decided; affects how this workspace and its products get packaged publicly. Sensible trigger: Anthropic partner status confirmation.
4. **Connector production verification (parked 2026-08-11, external prerequisites).** Two `[to verify]` items from the A12 spike, both blocked for now: Intuit production-key unlock (Intuit has requirements Mike cannot complete at the moment) and confirming the Shopify in-admin custom app flow on a real merchant store (no real store available). Sandbox legs are proven; DATA_CONNECTORS.md carries the markers. Unblock triggers: Intuit requirements become completable, or the first real engagement with this stack (verify there with extra care, before it's in a client email).

5. **Shared-drive migration mechanics (opened 2026-08-21). RESOLVED 2026-08-22:** a new dedicated `Power Cloud OS` shared drive was created with the OS at its root; contents moved (move, not copy, preserving file IDs), verified complete against a pre-move manifest, and the path sweep applied. The old `Power Cloud Project Folders` drive remains as the legacy annex. Remaining follow-ups live in `Internal/A13_MIGRATION_PLAN.md`: team re-share verification, DLP incident review, Monday-job re-pointing, and the two cross-drive shortcuts.

---

## Appendix: sources and method

- Four summit transcripts in `AI Summit Discussion Transcripts/` (Jul 28: 4h53m; Jul 29: 5h32m; Jul 30: 8h00m; Jul 31: 3h46m), read in full by five parallel mining agents; per-day evidence reports with timestamps and quotes in `AI Summit Discussion Transcripts/working/mining/`.
- As-built review: CLAUDE.md, rapid-assessment and execution skills, CAPABILITIES.md, ONBOARDING.md, WRITING_STANDARDS.md, NETSUITE_PLAYBOOK.md, PRODUCTS.md, LOE_BASELINES.md, QA_CHECKLIST.md, plus the workspace folder inventory.
- ICM: github.com/RinDig/icm-architect and the locally installed icm-architect skill (five forms, five-layer hierarchy, library rules, walk test).
- Unrelated summit conversation (client firefighting, personal segments) was skimmed and mined only where it revealed a tooling or business need, per your caution about mixed content. Speaker attributions treated as approximate throughout.
