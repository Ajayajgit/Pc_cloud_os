# {Client}
## {Project name}

Date: {Month D, YYYY}
Lead Consultant: {name}

---

## Opening Statement

This Statement of Work ("SOW") dated {Month D, YYYY} describes the services to be performed by Power Cloud Consulting ("PC") for {Client}. In order to move forward with this estimate from Power Cloud Consulting, it must be signed and returned.

> The opening statement is fixed boilerplate. Only the date and the client name change; do not reword it.

## Problem Statement

{What the client cannot do today, and why the existing NetSuite behavior does not cover it. Two short paragraphs at most.}

{First paragraph: the current state and the limitation, stated as fact. Name the precise constraint rather than the frustration, for example a page size that cannot be changed through Set Preferences, Customize View, or the underlying saved search, or an architecture built for a one-to-one relationship that a new requirement breaks.}

{Second paragraph: what happens if nothing is done. Be concrete about the consequence (incorrect postings, wrong-location inventory, lost history, manual rework), because this is what justifies the customization.}

{Where an existing customization governs this area, name it with its script ID, say what it does, and state why the solution must work with it rather than around it.}

## Proposed Solution

{One sentence framing the shape of the solution.}

**Key steps:**

{Numbered or bolded steps in the order the work flows. Cover both what the user does and what the system does automatically, because this section guides the development team as well as confirming scope with the customer.}

1. **{Step name}:** {what happens, and in which system}.
2. **{Step name}:** {what happens}. {Where the solution triggers existing logic rather than reimplementing it, say so explicitly and name the exact action fired.}
3. **{Step name}:** {what happens}.
4. **UAT:** {how it will be proven, in the client's real conditions}.

{Where values are script parameters rather than hardcoded, say so and state the consequence: the tool can be repointed later without code changes.}

## Custom Fields & Records

{Everything created or reused, as a two-column table. Scripts and deployments belong here too.}

| Name | Purpose |
|---|---|
| {Field or record name} | {What it is on, and what it is used for.} |
| {Script name} | {Its role in the solution.} |
| {Existing object name} | {Reused, no changes made. What the solution does with it.} |

## Assumptions

{What has to stay true for the solution to work and keep working. Each one is a support conversation being pre-empted, so write them plainly and generously.}

- **{Assumption name}:** {the condition assumed, and what depends on it}.
- **{Assumption name}:** {object or configuration stability, and the instruction to re-validate if it changes}.
- **{Assumption name}:** {what is explicitly the client's responsibility, or scoped as separate work}.
- **{Assumption name}:** {volume or licensing ceiling, and what would be needed beyond it}.

## Level of Effort

The Level of Effort for this customization is **{N} Hours**. The Level of Effort for this customization includes:

- Custom field/Record creation and validation
- SuiteGL script development and testing
- Documentation

<!--
The three lines above are the standard boilerplate; keep the wording. Add lines where the
work genuinely includes more (the Brixton use case added "User Acceptance Testing"), and
drop a line only where it plainly does not apply.

The figure may be a range, and may be expressed per unit ("12-16 Hours per POS Location")
where the work repeats.

LOE rules (execution SKILL.md, "Custom development documentation"):
- Anchor to ../../LOE_BASELINES.md and cite the baseline used, or mark [no prior basis].
- The figure gets line-by-line human approval before this document goes out, and is logged
  in working/loe_log.md. Claude drafts; a human owns it. Binding once signed.

Before rendering: run the humanize pass, delete these notes and every placeholder, and
confirm no em-dashes. Brand per ../../POWERCLOUD_BRAND_GUIDELINES.md.
-->
