# Functional & Technical Design Document
## {Client} - {Solution name}

{Where the solution has multiple parts or flows, list them here, one per line.}

Platform / stack: {e.g. SuiteScript 2.1, Celigo integrator.io, Shopify Admin API}
Combined FDD + TDD
Version {1.0}
Date: {Month D, YYYY}
Prepared by: {Lead Engineer name}

---

> **One document, two halves, two readers.** The FDD is written for the customer and for whoever
> has to explain the solution later: what it does, what it deliberately does not do, how the
> process flows. The TDD is written for whoever maintains it in two years: IDs, mappings,
> parameters, failure behavior. Keep the halves distinct rather than blending them; a reader
> should be able to stop at the end of the FDD and still understand the solution.

---

# Functional Design Document (FDD)

## 1. Overview

{What was built and what it replaces or adds, in one paragraph. Where it is delivered as several
interconnected parts rather than independent pieces, say so and name what they achieve together.}

## 2. Business Objective

{Why the client needed this. The outcome in business terms: what is faster, what limit is gone,
what manual step disappeared, what error class stops happening.}

## 3. Components / source and destination systems

{For custom development: each script, record and pre-existing object, with its type and role.
For an integration: each system, its role as source or destination, and the connection used.}

| Component | Type | Role |
|---|---|---|
| {name} | {Suitelet / Map-Reduce / Custom Record / Scheduled Script / Celigo flow} | {what it does, in plain language} |
| {existing object name} | {Native NetSuite {type} (pre-existing)} | {Owns the real logic. This solution triggers it; nothing about it was changed.} |

**How they interconnect:** {which part is the thin front end, where the record-changing work actually
happens, why it runs asynchronously if it does, and what stays untouched.}

## 4. Data description

{The records and fields involved, where data originates, and what shape it is in at each step.}

## 5. Scope

**In scope**
- {what was delivered}

**Out of scope**
- {what was deliberately excluded, and where it belongs instead}

{Repeat per flow or per component where the solution has several. Out of scope is the section that
prevents most "I thought it would also..." conversations, so write it generously.}

## 6. Business process flow

{The flow in plain language, from the trigger through to the result. A numbered walkthrough or a
diagram, whichever reads more clearly. Name the actor at each step.}

## 7. Assumptions and limitations

**Assumptions**
- {what must stay true, carried forward from the Use Case and updated with anything learned in build}

**Limitations**
- {ceilings, caps, and anything switched off}
- {anything temporary by design, e.g. a log with a retention window, plus where the permanent record lives}
- {known cosmetic gaps, named honestly}
- {current access restrictions, and the fact that broadening them is an explicit step}

## 8. Scripts, functional description

{One entry per script or hook: what it does, when it runs, and what it changes. Plain language, no
code. Where a standard hook was deliberately left empty, say so rather than omitting it.}

---

# Technical Design Document (TDD)

## 1. System introduction

{The technical shape: the objects that work together, which holds the UI, which mutates data, and how
control passes between them. State explicitly where a component does NOT mutate data directly.}

**Design decisions.** {Any choice a future maintainer would otherwise second-guess, with the reason and
the containment mechanism that made it safe. Deviations from the standard sandbox-first path belong
here, named as decisions with their rationale, never omitted.}

### Files

| File | Script Type | Script ID |
|---|---|---|
| {path/to/file.js} | {Suitelet} | {customscript_...} |
| {Objects/customrecord_....xml} | {Custom Record Type} | {customrecord_...} |

## 2. Component breakdown

{Per component or per Celigo tile: its type and role, inputs and outputs, important configuration
parameters, and any associated hook or script.}

## 3. Entry points and request modes

{How each component is invoked. For a Suitelet, each GET/POST mode and what it renders or does. For a
scheduled or Map/Reduce script, its trigger and stages. For a flow, its export/import mechanism.}

## 4. Data source and field mappings

{Saved searches and their internal IDs. Target objects, workflow and action IDs. Every custom record's
field list.}

| Field ID | Label | Type | Purpose |
|---|---|---|---|
| {custrecord_...} | {label} | {type} | {what it stores} |

## 5. Execution / data flow

```
{ASCII diagram: trigger through to result, showing which component acts at each step and where the
 boundary between synchronous and asynchronous work sits.}
```

## 6. Function inventory

| Function | File | Purpose |
|---|---|---|
| {name} | {file} | {what it does} |

## 7. Authentication & configuration

{Script parameters with IDs, types and current values. Connections and their auth mode. Deployment
status and audience. Execution context and role.}

**Rollout:** {what has to change to move from the current posture to full production availability,
step by step.}

## 8. Dependencies

{Native features, pre-existing custom objects, bundles, external services, API versions.}

## 9. Error handling & limits

{Per-record failure behavior, where failures are logged and visible, retry behavior, and the
governance ceilings that apply.}

## 10. Known limitations / issues / future enhancements

{What was deferred and why, what is built but switched off, what a future version would address.}

<!--
The FDD half is client-facing: run the humanize pass over it, no evidence tiers, no verification
furniture. The TDD half is technical and skips the humanize pass, like the execution plan.

No em-dashes in either half; the CLAUDE.md rule covers everything the practice writes.

Every ID in the TDD is verified against the account, never recalled.

Delete these notes and every placeholder before rendering. Brand per
../../POWERCLOUD_BRAND_GUIDELINES.md.
-->
