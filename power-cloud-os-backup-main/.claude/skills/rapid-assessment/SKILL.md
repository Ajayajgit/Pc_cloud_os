---
name: rapid-assessment
description: Produce Power Cloud NetSuite discovery deliverables for a client engagement, either a commercial rapid assessment (LOE, billing, funding decision) or, for a customer already under agreement, an implementation roadmap / project plan (no LOE or commercial framing). Also preps onsites. Covers the two discovery-led engagement types only; a custom project (hired for one specific function) belongs to the custom-project skill instead. Use when the user asks to "run the assessment", "prepare the rapid assessment / fast discovery", "build the implementation roadmap / project plan", "build the presentation deck" (also "proposal deck", the old name), "produce the deliverables", or "prep for the onsite" from inside a client folder that has transcripts (or recordings the transcribe skill can turn into transcripts) in source/. Covers evidence mining, NetSuite MCP verification, solution research, and drafting.
---

# Rapid Assessment

Produces the client deliverables. The always-loaded rules (folder layout, session start, read-only NetSuite, brand, gotchas) live in the root `CLAUDE.md`. This file routes; **the procedure lives in per-stage contracts under `stages/`, and you read exactly one stage file at a time, when that stage starts.** Do not read them all up front; do not work a stage without its file open.

Reference files (root = the Power Cloud OS folder, one level up from the client folder, so `../NETSUITE_PLAYBOOK.md` etc.): each stage file names the references it needs and the step to read them at. `QA_CHECKLIST.md` runs before every checkpoint.

## Route first

Complete Session start from CLAUDE.md (CONTEXT.md, folder inventory, account verification, Script Reader check). Then:

**This skill owns the two discovery-led engagement types only.** Read `Engagement type` from CONTEXT.md first (the three types are defined in CLAUDE.md):

- **custom project** → stop. This skill does not apply. Route to the [custom-project skill](../custom-project/SKILL.md), which runs a scoped discovery on the named function rather than a whole-account assessment, and ships a Use Case and two handover documents instead of these three deliverables.
- **rapid assessment / recovery** or **implementation** → continue below.

Then route by where the engagement stands:

- **No onsite/discovery transcript or recording in `source/`, or Engagement status "pre-onsite"** → stage 01.
- **Discovery/onsite transcripts present (or recordings only, in which case the [transcribe skill](../transcribe/SKILL.md) runs first) and the ask is to produce deliverables** → stages 02 through 06 in order.

If the format is unclear (remote vs onsite), that is a one-question interview before you start, not a guess. The client-facing name follows the format: on-site is a **Rapid Assessment**, remote is a **Fast Track Discovery**. Remote engagements also carry honest non-final LOEs (WRITING_STANDARDS).

**Two fields, read both, because they do different jobs.** Discovery, mining, verification, and the tasks-by-area tables are identical across both types; the type and the commercial posture together decide the framing.

**Engagement type** decides what the document *is*:
- **Rapid assessment / recovery**: an existing NetSuite customer having a hard time. The document finds what is wrong and presents the work-item menu that gets them running again.
- **Implementation**: a blank or greenfield account. The document is a roadmap to a target state rather than a remediation menu, and phasing becomes a project plan (milestones, sequencing, dependencies, target state).

**Commercial posture** decides whether it sells:
- **Pre-agreement**: the full commercial treatment, with LOE columns, a phasing table with hours, a recommended first phase and the single decision to start, and a billing section. Its job is to help the client decide what to fund.
- **Under agreement**: nothing is being sold, so no LOE/pricing column, no billing section, no commercial close. Effort tracks internally in the execution plan, never as client-facing LOE.

Both fields are independent. A recovery engagement already under agreement drops the commercial framing; an implementation still being sold keeps it. Do not infer one from the other, and if either is unclear, ask.

## The stages

| # | Stage | Read | Start when | Ends with |
|---|---|---|---|---|
| 01 | Pre-onsite prep | `stages/01_pre-onsite.md` | pre-onsite, per routing above | checkpoint 1, agenda sent |
| 02 | Evidence mining + candidates | `stages/02_evidence-mining.md` | discovery transcripts in `source/` (or transcribed into `working/transcripts/`) | `evidence.md`, `candidates.md` complete |
| 03 | Verification + product fits | `stages/03_verification.md` | evidence log exists (or alongside 02) | checkpoint 2, findings review |
| 04 | Draft the three deliverables | `stages/04_drafting.md` | findings review passed | three drafts in `working/` |
| 05 | Humanize, review, render | `stages/05_humanize-render.md` | drafts complete | checkpoints 3+4, finals in `deliverables/` |
| 06 | Retro + learnings triage | `stages/06_retro.md` | finals shipped | retro walked with the user |

`working/evidence.md` and `working/verification.md` from stage 01 carry forward as-is into stages 02-03.

## Work the problem, do not just transcribe it

These habits apply at every stage. They are the difference between a consultant's document and a stenographer's.

1. **Research and reason (required, not optional).** Use the web actively; do not work from memory.
   - **Customer website:** research the client's public site to build the Business Overview (founding, ownership, history, stated values, channels, store/kiosk locations). This is required, not "allowed." The Shinesty Business Overview that the team singled out as strong was strong precisely because this research was done. Never put client *data* (account IDs, configs, pain points, financials) into a web query; researching their public identity is expected.
   - **NetSuite behavior:** for any claim about what NetSuite can or cannot do natively, or how a native feature behaves, check Oracle's official docs (`https://docs.oracle.com/en/cloud/saas/netsuite/index.html` and the NetSuite Online Help within it) before writing it. Resolve conflicts in Oracle's favor and note the release when behavior is version-dependent. This is the guard against a "NetSuite cannot do X" claim that turns out to be wrong (e.g., the discounting claim on Shinesty).
   - For each material pain point, also query the live account (NetSuite MCP, read-only) to confirm how it is actually configured, then reason about the approach (native reconfiguration vs Power Cloud product vs third-party) rather than restating the pain. The `NETSUITE_PLAYBOOK.md` pattern for that area is the starting point, not the finish line.
2. **Interview to close gaps.** Pause and interview the consultant whenever you hit a material gap, a low-confidence inference, or a [Reported]-vs-[Verified] conflict. Ask rather than guess or silently drop. A thin inference (e.g., "are they considering leaving NetSuite?") is a question for the consultant, never an assertion in the document. Use AskUserQuestion for discrete choices; ask in prose for open ones. Batch questions so you are not interrupting constantly.
3. **Completeness over convenience.** A material item that was actually discussed must not fall off because it read as a minor aside. The candidate register (stage 02) and the playbook completeness checklist are the mechanisms.
4. **Log learnings in the moment.** Before assuming what the tooling can do, check `CAPABILITIES.md` (root); it wins until re-tested. Whenever a capability assumption is proven right or wrong, append a dated `[unreviewed]` entry to `CAPABILITIES.md` and note it in `working/learnings.md`. Whenever a notable business or design decision is made, log it in `working/learnings.md` as a best-practice candidate. Capture at the moment of discovery, never from memory at the retro.
