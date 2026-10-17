---
name: customization-docs
description: Write the two documents every net-new customization owes: the Use Case the client signs before build (from transcripts, consultant interviews, and discovery), and the combined FDD & TDD handover when it ships (from what was actually built). Callable from any engagement type, a rapid assessment / recovery, an implementation, or a custom project. Use when the user says "write the use case", "draft a use case from this transcript / call", "draft the SOW for this build", "produce the handover", "write the FDD / TDD", "document what we built", or a build is ready to close.
---

# Customization documents

Two documents attach to any **net-new custom development**: a **Use Case** before it is built, and a combined **FDD & TDD** handover when it ships. They belong to the work, not to the engagement type, so this skill is called the same way inside a recovery, an implementation, or a custom project.

**Triggers:** new SuiteScripts of any type, new custom applications, new integrations or integration flows. **Does not trigger:** a custom field or form added inside a larger configuration project, native preference configuration, saved-search and role changes, one-off data fixes. At the boundary (a substantial rework of an existing script, say), ask the consultant rather than deciding either way.

Templates: `templates/custom-dev/use_case.md` and `templates/custom-dev/handover_fdd_tdd.md` at the OS root. Root reference files are `../` from a client folder and `../../` from a custom project's own folder.

---

## 1. The Use Case (before build; the client signs it)

It doubles as the SOW, so no build starts against an unsigned one. Its three jobs at once explain its shape: **customer confirmation, development-team guidance, and documentation.** That is why the Proposed Solution has to cover both what the user does and what the system does automatically.

Fixed sections, fixed opening boilerplate, from the template: Opening Statement, Problem Statement, Proposed Solution, Custom Fields & Records, Assumptions, Level of Effort. Only the date and client name change in the opening statement; do not reword it.

### Building it from the sources

Work from whatever the engagement actually has, in this order of preference:

1. **Transcripts** in `source/`: the call where the client described the problem, and any follow-up. Mine them the same way discovery does, quoting the constraint rather than the frustration. Where a transcript is the only source for a claim, it is [Reported] until the account confirms it.
2. **Existing discovery**, where the engagement has it: `working/evidence.md`, `working/verification.md`, `working/scoped_discovery.md`, and the work item's execution-plan block. Do not re-derive what discovery already established.
3. **The account itself**, read-only. Confirm the current behavior, the limitation being worked around, and every object the solution will touch or reuse. Read the body of any in-scope script with Script Reader rather than trusting its name. Collect the exact IDs; the Use Case cites them and the handover will need them again.
4. **The consultant**, interviewed. This is expected, not a fallback. A Use Case commits Power Cloud to an approach and a number, so any gap in the problem statement, the approach, or the assumptions is a question, never a plausible guess. Batch the questions.

Check Oracle's documentation before asserting what NetSuite can or cannot do natively. Where the approach depends on behavior nobody has confirmed in this account, prove it against a single test record before quoting hours.

### The Level of Effort

Draft a figure anchored to `LOE_BASELINES.md` with the baseline cited, or marked `[no prior basis]`. A range, or a per-unit figure where the work repeats, is often the honest answer. It then takes the standard line-by-line human approval and is logged in `working/loe_log.md` before the document goes out. **Claude drafts; a human owns it; it is binding once signed.**

Keep the boilerplate list under the figure as written in the template, adding a line where the work genuinely includes more.

### Before it goes out

Run the humanize pass, then `QA_CHECKLIST.md` section "Before a Use Case goes to the client". Record the client's signature date in `CONTEXT.md`.

---

## 2. The FDD & TDD handover (when the work ships)

One document, two halves, two readers. Ship it before the task closes; a customization delivered without it is unfinished work.

- **FDD half**, for the customer and whoever explains the solution later: what it does, what it deliberately does not do, how the process flows.
- **TDD half**, for whoever maintains it in two years: IDs, mappings, parameters, failure behavior, and the design decisions worth preserving.

### Building it from what was built

The handover is written from the work itself, not from the Use Case. The Use Case describes what was promised; this describes what exists. Where they diverge, the handover is right and the divergence is worth a sentence.

Sources, all of which the build already produced:

- **The SDF project and the scripts**, read directly. Function inventory, entry points and request modes come from the code, not from memory.
- **`execution/build_log.md` and `working/testing_plan.md`**: what was tried, what failed, what was proven, and the acceptance criteria that passed.
- **The account, read-only**: every ID in the TDD half is verified against the deployed objects rather than recalled. Deployment status, script parameters, audience and role come from the deployment record.
- **The decisions made during build**: anything a future maintainer would otherwise second-guess, with its reason. A deviation from sandbox-first belongs here, named as a decision with the containment used, never omitted.
- **The consultant**, for intent that the artifacts do not carry.

Write the "what it does not do" and "limitations" sections generously. They include anything built but switched off, any access restriction still in place, any temporary retention window, and known cosmetic gaps. This section prevents most post-delivery surprises, so it is the last place to be sparing.

### Before it ships

Humanize the FDD half; the TDD half skips it, like the execution plan. Then run `QA_CHECKLIST.md` section "Before an FDD & TDD handover ships".

---

## Scope note

Inside a recovery or an implementation, both documents are scoped to the **work item**, not the engagement. They sit alongside the assessment, the roadmap, and the execution plan rather than replacing anything; the execution-plan block stays the internal build spec. In a custom project the scope happens to be the whole engagement, which changes nothing about how either document is written.
