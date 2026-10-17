# Stage 03 — Verification, product fits, findings review

One job: confirm or refute every account claim with read-only queries, map findings to product candidates, and walk the complete findings with the consultant before a word gets drafted.

- Working inputs: `working/evidence.md`, `working/candidates.md`, the live MCP connection
- Reference: `../PRODUCTS.md` (product fits), `../CAPABILITIES.md` (check before assuming a tool capability), `../QA_CHECKLIST.md` section 2
- Outputs: `working/verification.md`, updated tiers in `working/evidence.md` and `working/candidates.md`
- Human check: the findings-review checkpoint below ends this stage.

## Verification (read-only)

The point of MCP access is that we do not take call statements at face value. Full detail in CLAUDE.md's non-negotiables; the essentials:

- **Read-only, no exceptions.** SuiteQL, record reads, saved-search runs, metadata only. Never create/update/delete.
- Verify enabled features, bundles/SuiteApps, custom records/fields/forms, scripts and workflows (and error logs), integrations, saved searches, transaction/item/customer volumes. Log every query and result in `working/verification.md`. **Delegate:** when a result spills to a file of hundreds of free-text rows or more (script inventories, saved-search lists, error logs), save it under `working/` and hand the file to `pc-data-condenser` (Haiku) for the grouped table with counts and window; counts you need exactly come from a script or the query itself, not the worker. The tier and the finding are yours.
- Script and saved-search names are cheap, high-value verification. If the Power Cloud Script Reader toolset is connected, read the actual body of scripts tied to a claimed pain point (`readScriptSource`), confirm deployment (`getScriptDeployments`), read referenced File Cabinet configs (`readFile`). Without it, any claim about what a script *does* is [Reported]/[Inferred], never [Verified].
- **Celigo/iPaaS verification (when access exists).** Use the **`celigo` skill**; it owns the inventory and triage procedure. In short: read-only, flows and their enabled/disabled state, schedules and cadence, mappings, connections, and error/job history, inventoried rather than assumed, because flows are customer-specific. This is how "an automated payout integration was started but never completed" or an unexplained sync cadence gets [Verified] instead of [Reported]. If no Celigo access exists, note that integration-layer findings are call-reported and flag access as worth requesting.
- **Other source systems in the stack (Shopify, QuickBooks).** Where the client runs one and connector access exists, run the read-only data profile from `../DATA_CONNECTORS.md` (identity check first, artifacts to `working/data_profile_{source}.md`). Its job is to turn the design decisions it surfaces (item identity, customer hierarchy, chart-of-accounts consolidation) into candidates with a [Verified] tier, replacing "send us a spreadsheet and we will see". Credentials stay on the holder's machine, never in the client folder.
- **Sandbox caveats:** SB is frozen at last refresh; integrations often disconnected; scheduled scripts may be undeployed. Absence of activity in SB is not evidence of a production problem. Date-stamp volume/error findings and flag production-confirmation needs.
- Tag every finding [Verified]/[Reported]/[Inferred]. Where a call claim and the account disagree, that is a finding; call it out. Verify numbers anyone repeated casually (script counts, volumes, percentages) before they ship.
- Docs: prefer Oracle NetSuite Online Help; resolve conflicts in Oracle's favor; note the release when behavior is version-dependent.

## Product fits

When a finding maps to a Power Cloud product (`PRODUCTS.md`), recommend it as a candidate: what it solves, license/subscription cost kept separate from LOE, and always a native or third-party alternative named alongside. A sandbox prototype/demo is a valid low-effort shape. Propose catalog additions to the user; do not edit PRODUCTS.md yourself.

## Checkpoint: findings review

Run QA_CHECKLIST section 2. Review `working/candidates.md`, `working/evidence.md`, and `working/verification.md` with the user before drafting. The candidate register is the centerpiece of this checkpoint: walk the full list so the consultant confirms or changes each disposition. This is where a human applies materiality judgment to a complete list, rather than being relied on to remember an item unprompted.
