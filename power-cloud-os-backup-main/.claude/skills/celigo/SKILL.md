---
name: celigo
description: Work a client's Celigo integrator.io layer. Inventory what actually exists (read-only, during discovery), triage flow errors so real failures separate from noise, and change flows during execution under the production gate. Use when the user says "check their Celigo", "what integrations do they have", "why is this flow failing", "triage these errors", "fix/complete the Celigo flow", "how are orders syncing", or when discovery reveals Celigo in the client's stack.
---

# Celigo (integrator.io)

Power Cloud is a Celigo Platinum partner, so the integration layer is core delivery rather than an occasional side quest. This skill covers three jobs: **inventory**, **error triage**, and **change**.

**The governing principle: flows are customer-specific.** There is no standard flow set to pattern-match against, and assuming one is how you end up describing an integration the client does not have. Always inventory what this account actually runs before reasoning about it. That applies even where the client uses a prebuilt Integration App, because IA settings and any custom flows around it vary per customer.

## Access

- **The integrator.io REST API (bearer token) is the full capability surface** and the preferred method in a Claude Code session: CRUD on connections, exports, imports, flows, integrations and scripts, plus error and job data.
- **Celigo's first-party MCP server is a curated projection** of that API, reaching only what has been published to it. It is the right layer for governed team access and for claude.ai sessions where raw API calls are not available.
- **Credentials never touch the shared Drive.** The bearer token lives on the connection holder's machine, one folder per client, exactly as `../../DATA_CONNECTORS.md` rule 1 requires. Artifacts go in the client folder; keys do not.
- **Identity check before anything else.** Confirm the connected integrator.io account belongs to this client, and record it in `CONTEXT.md`. Same rule and same reason as the NetSuite account check.

Check `../../CAPABILITIES.md` before assuming a capability; it wins until re-tested.

## 1. Inventory (read-only, discovery)

The point is the same as NetSuite MCP access: we do not take call descriptions of the integration at face value. Without this, every integration-layer claim is `[Reported]` at best.

Capture into `working/verification.md`, logging each call and its result:

- **Every flow**, with its enabled/disabled state. A disabled flow that everyone believes is running is a finding.
- **Schedules and sync cadence**, including anything real-time via webhook listener versus scheduled export.
- **Connections** and what each one points at, including the auth mode and the API version in use.
- **Mappings** for any flow in scope, and any hooks or scripts attached to an export or import.
- **Error and job history**: volume, recency, and which flows produce them.

Two findings this step is especially good at surfacing, both of which have real precedent: an integration that was **started and never completed**, and a sync cadence nobody can explain. Both become candidates with a `[Verified]` tier.

Where no Celigo access exists, say so plainly: integration-layer findings stay `[Reported]`, and connector access goes on the access request list rather than being quietly skipped.

## 2. Error triage

Raw failure counts mislead. A few hundred logged errors routinely reduce to a much smaller number of real problems, and the value here is the reduction, not the list.

**Delegate:** save the error export under `working/` and hand it to `pc-data-condenser` (Haiku) for steps 1 to 3 below: grouped by apparent cause with a representative row, class labels, row counts and the window. Step 4, the end-to-end trace, and every evidence tier stay here; a worker's group label is a hypothesis, never a `[Verified]` cause.

Work it in this order:

1. **Group by cause, not by count.** One upstream condition usually produces many rows. Collapse them before anyone reacts to a headline number.
2. **Separate the classes.** Transient and retried, and therefore already resolved. Data-quality rejections, which are a client-side fix rather than a flow defect. Mapping or configuration defects, which are ours. Genuine platform or API failures.
3. **Date-stamp and check recency.** Errors from a since-fixed condition are history, not a backlog. State the window every count covers.
4. **Trace one example end to end** before asserting a cause: the record in the source, what the mapping did to it, and what the destination returned. A cause inferred from an error message alone is `[Inferred]`, not `[Verified]`.
5. **Report the reduction.** "N logged errors over the window, M distinct causes, K needing action" is the useful sentence, and the count and the window always travel together.

## 3. Change (execution only)

Never during discovery. Changing flow configuration, mappings, schedules, or completing a half-built flow is execution work under the execution skill's guardrails.

- **API-first**, for the same reason SDF is the default in NetSuite: the change is inspectable and repeatable rather than a remembered click.
- **Custom flows are fully API-manageable. Prebuilt Integration App settings are only partially API-reachable**, and the exact boundary is still `[unconfirmed]` in `../../CAPABILITIES.md`. Confirm reachability for the specific setting before promising automation, and fall back to a click-by-click checklist for whatever the API does not expose. When the boundary gets tested, append a dated entry to CAPABILITIES.md.
- **Test against the Celigo sandbox or test store where one exists.** Where none exists, say so, and treat the change as production work rather than pretending there was a rehearsal.
- **A change to a live production flow is a production deploy** and takes its own human gate, one per change, exactly like an SDF promotion.
- **Record the before state** so there is a rollback path: the prior mapping or setting, captured before it is overwritten.

## Documentation

Completing or building an integration flow is **net-new custom development**, so it owes a Use Case before build and an FDD & TDD handover at ship, per the `customization-docs` skill. Because flows are customer-specific, the handover's functional half is often the only written description of that client's integration that exists anywhere. Write it accordingly.
