# Pre-Checkpoint QA

Run the matching section before presenting work at any checkpoint. Fix failures before presenting; anything that can't be fixed gets named explicitly when presenting. This file grows; propose additions whenever a checkpoint catches something this list missed.

## Before checkpoint 1 (pre-onsite agenda review)

- Every question in `working/onsite_prep.md` ties to a specific verification result or evidence gap, not a generic template question
- The NetSuite verification pass covers the full list (features, bundles/SuiteApps, custom records/fields/forms, scripts and workflows and their error logs, integrations, saved searches, volumes), not a partial scan
- Any intro/discovery transcript claims are cross-referenced against verification results; disagreements are flagged, not quietly resolved
- If the Script Reader toolset (`listScripts`/`readScriptSource`/`getScriptDeployments`/`readFile`) is available on this account, scripts tied to an intro-call claim were actually read, not just confirmed by name; if it's not available, that gap is noted rather than papered over
- The client-facing one-pager contains only the agenda skeleton (time blocks, topic headers); no findings detail, evidence tags, or verification specifics leaked in
- CONTEXT.md engagement status, account ID, and NetSuite release are current

## Before checkpoint 2 (findings review)

- Every claim in `working/evidence.md` carries source file, approximate timestamp, and speaker
- Every verification query and its result is logged in `working/verification.md`
- Each finding carries exactly one evidence tier; no Reported or Inferred item reads as Verified
- Call-vs-account disagreements are listed explicitly as findings
- Sandbox-sensitive findings (volumes, error logs, zero-values, integration activity) carry the refresh-date caveat and a production-confirmation flag
- Numbers anyone repeated casually on calls (counts, percentages) are verified or marked unverifiable
- Any finding describing what a script *does* (not just that it exists) is backed by an actual `readScriptSource` read when the Script Reader toolset is available; without it, that finding is tagged [Reported] or [Inferred], never [Verified]
- The `NETSUITE_PLAYBOOK.md` completeness checklist was run against the transcript: each process area logged a finding or an explicit "not discussed / not applicable" note, so no material item that was actually discussed fell off (the customer-deposit-methodology miss is the cautionary case)
- Material items that read as minor or ambiguous were raised with the consultant (interview) rather than silently dropped or silently promoted to a work item
- Source-integrity check ran before mining: each `source/` file confirmed a full transcript (not a thin notes-only stub), embedded images/screenshots read rather than skipped, and any thin-for-size, image-heavy, or unopenable file flagged to the consultant instead of mined as-is
- `working/candidates.md` exists and is exhaustive: every pain point, workaround, complaint, wish, anomaly, dormant tool, and script-only pattern from every source (transcripts and account) is captured at a low threshold, including one-line and passing mentions; account-only findings with no call coverage are present, not just what was discussed
- Every candidate carries a disposition (promoted to a named work item / fast-follow / dropped-with-reason); none is left with no disposition, and no drop lacks its one-line reason
- The full candidate register was walked with the consultant at findings review, so materiality was a human decision over a complete list, not a silent extraction call

## Before checkpoint 3 (draft review)

- Structure matches the assessment spec in CLAUDE.md; no section skipped silently
- Every pain point traces to an evidence.md entry; every Identified item has a stated rationale
- Every number in the deck traces to the document body; the phasing table's per-phase hours are recomputed from the per-item LOEs in the section tables, never hand-copied; there is no separate consolidated per-item hours table
- Work item and execution plan task cross-references resolve in both directions
- Quotes are lightly cleaned (fillers and transcription artifacts removed), no named executive criticizes their own past decisions, and the appendix carries the lightly-edited-for-clarity note
- Style: zero em-dashes, zero banned filler, US spelling throughout (`WRITING_STANDARDS.md`, Spelling), client name spelled consistently and matching the client's own usage (apostrophes, punctuation)
- The humanize pass ran and the scanner is clean, which covers both the AI copy tells and British spellings. From the client folder: `python "../.claude/skills/humanizer/scripts/copy_scan.py" working/draft_assessment.md working/draft_proposal_deck.md` (`python3` on Mac). Every hit is fixed, or is marked `copy-ignore` and raised here for a decision. The execution plan is internal and is not scanned. This is the mechanical half of the style rule above; cadence and structure still need reading
- Tone is factual, not storytelling: no "this is a story about...", no scale-as-antagonist metaphor carrying the document; the problem-is-scale-not-incompetence point is made once, plainly (`WRITING_STANDARDS.md`)
- No editorial judgment or flowery/connective language anywhere: the system is not called mature, careful, careless, impressive, or "unusually" anything; debt is not "overdue in the best sense"; no line reassures or narrates ("two pieces of good news," "real and fixable," "unlocks disproportionate value," "the story of this assessment"). Findings, recommendations, and effort only; the scale-came-from-growth reassurance is absent unless the consultant asked for it
- A clickable table of contents follows the cover, linking every top-level section and each per-area task table (the doc is built for readers who jump to the tasks or the phasing, not only cover-to-cover readers)
- Document order is Customer Summary, then a high-level NetSuite environment/tech-stack overview, then the tasks; no narrative executive summary; the commercial roll-up (hours, phasing, recommended first phase, single decision) comes after the tasks, not before
- Tasks are laid out as one table per process area with short-field rows (ID, Issue, Recommendation, Priority, LOE, tags); verbose per-task detail lives in a linked Appendix A (each row ID links to its entry), not inline; no body section is a wall of prose
- The phasing / recommended-start section is developed, not a terse roll-up: presented as a Phase | Scope | Work Items | Business Outcome | Est. Hrs table with phases, the outcome each buys, dependencies, and a named first phase with the single decision. The per-phase hours are the effort roll-up (no separate consolidated per-item hours table). This is the document's strategic focus
- The deliverable matches the engagement type: a commercial assessment carries LOE columns, phasing hours, the single decision, and billing; an implementation roadmap (customer already under agreement) omits all of those and frames phasing as a project plan (milestones/sequencing/dependencies/target-state). The two are not mixed
- Candidate-to-draft survival: every candidate in `working/candidates.md` marked promoted or fast-follow actually appears in the draft, and every drop carries its logged reason. Nothing the mining captured (e.g., a [Verified] root cause like the customer-deposit finding) silently vanished or got shrunk below what the evidence warrants
- The executive summary ends with the recommended starting package and a single decision, and no phase-one detail appears before the business overview
- LOE figures either cite a baseline from `LOE_BASELINES.md` or carry the `[no prior basis]` marker; none do neither
- Verification stays internal: no "what we could not verify and why" section in the client doc; real gaps are framed as next-steps ("confirm X in production"), not as disclosures of what our tooling could not query. Only the three to five verified stats that land hardest appear in the body; the exec summary and all slides are essentially tag-free
- No overreach: every characterization of the client traces to a source (transcript line, verification query, or public site); no inferred strategic conclusion (considering leaving the platform, replacing a system, unhappy with a vendor) is stated as fact
- The document is internally self-consistent: no two statements contradict on the same fact (a system is not both "unused" and "actively maintained")
- Length budget met: company understanding is one to two paragraphs, then the issues; each pain point / work item is two to three sentences plus its recommendation; no single problem is re-explained in full across multiple sections
- Requested and Identified sets are de-duplicated: each concern appears once, labeled one or the other, never both
- Quotes are capped and not echoed back: each quote earns its place (adds what a paraphrase cannot), no slide or section is a stack of quotes, and no named executive is quoted criticizing their own past decisions
- A fast-follow / supplemental section captures low-priority "noted but not urgent" items (a sentence each, often no LOE) rather than dropping them or over-detailing them
- The deck is held to the same rules as the document, with one exception: slides are concise (one idea each, real talking points in speaker notes), no overreach on any slide, slides essentially tag-free, quotes capped at two or three across the whole deck, one ask on the final slide. The only deck liberty is that speaker notes may be narrative; the document and slide text stay factual. Deck and document do not contradict each other on any fact
- The deck leads with and highlights the two or three most critical points (highest-impact issues, priorities, dollar signal); it is selective, not a complete menu (completeness is the document's job)

## Before checkpoint 4 (LOE and commercial review)

- Hours presented as a reviewable list: work item, range, anchored or `[no prior basis]`, TBD/discovery status
- Exclusions stated beneath the phasing table's hours (TBD items, per-unit work, PM/UAT coordination percentage)
- Billing language matches the standard terms; any deviation is flagged, not silent
- Every net-new custom development task is flagged as such in the execution plan, and its LOE accounts for the Use Case and the FDD & TDD handover it will owe at build

## Before a Use Case goes to the client (custom development, any engagement type)

- Opening Statement uses the fixed boilerplate verbatim; only the date and the client name differ
- All six sections present: Opening Statement, Problem Statement, Proposed Solution, Custom Fields & Records, Assumptions, Level of Effort
- Problem Statement names the precise limitation and the consequence of doing nothing, not just the frustration
- Proposed Solution covers both what the user does and what the system does automatically (it guides development, not only the customer)
- Every existing object the solution depends on is named with its ID, and marked as unchanged where it is
- Assumptions cover object stability, permissions, who maintains what, and volume ceilings
- LOE anchored to `LOE_BASELINES.md` with the baseline cited, or marked `[no prior basis]`; approved line by line and logged in `working/loe_log.md`
- Humanize pass run and the scanner is clean (copy tells and British spellings); no em-dashes; US spelling throughout; no placeholders or internal notes left in the document

## Before an FDD & TDD handover ships

- One document, both halves present and kept distinct
- FDD half readable by the customer: no evidence tiers, no verification furniture, no unexplained jargon
- "Out of scope" and "Limitations" written generously, including anything built but switched off and any known cosmetic gap
- Every ID in the TDD half verified against the account, not recalled
- Design decisions recorded with their reasons, including any deviation from sandbox-first and the containment used
- Rollout steps stated where the solution is not yet at full production availability
- Humanize pass run over the FDD half and the scanner is clean (copy tells and British spellings); no em-dashes; US spelling throughout

## Before delivery (after rendering)

_The mechanical items here can be pre-read by `pc-qa-inspector` and `check_crossrefs.py`; the orchestrator reads their tables and owns every fix and every check mark below._

- Deck exported to PNG and visually inspected slide by slide: text overflow, logo placement, contrast, alignment
- Docx visually inspected at minimum: cover page, one full work item, the hours table; Montserrat and Barlow actually applied; no table overflow or orphaned headings
- The clickable table of contents follows the cover and every entry resolves in the exported PDF; the task-table-to-Appendix-A links resolve too (spot-check several)
- Rendered files contain exactly the approved markdown content; rendering changed form, never substance
- PDF generated alongside both the .pptx and .docx
- File names follow the convention and use the client's preferred name

## Before closing a production deploy (execution, any engagement type)

- "Deployed" checkbox confirmed checked on the script deployment record, not just `Status` (they are independent; `Status: Released` with `Deployed` unchecked is a valid, silent, fully inactive state)
- A real trigger observed to fire in production (an actual record save or integration write producing the expected result), not just that `project:deploy` exited cleanly
- Rollback path documented before promotion, per the execution skill's guardrails
