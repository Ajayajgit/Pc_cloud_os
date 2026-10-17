# LOE Baselines

Unit costs harvested from shipped Power Cloud assessments. New estimates anchor here when a comparable task exists; the assessment draft cites which baseline it used. Figures with no baseline get the `[no prior basis]` marker for commercial review.

Rules: no client names; source is engagement type and date. Claude proposes additions after each engagement (from the shipped, human-approved figures, never from its own drafts); Mike commits them. Ranges are preliminary until they recur across two or more engagements.

## Update protocol

Three feeds, in increasing order of value:

1. **Checkpoint 3 overrides.** Every engagement's `working/loe_log.md` records Claude's figure vs. the approved figure per line item. Overrides are the strongest estimate signal; confirmations increment n.
2. **Harvest.** Any approved Power Cloud assessment, SOW, or estimate, including pre-Claude back-catalog documents, can be fed in on request; Claude proposes normalized entries, deduped against existing ones, with conflicts flagged.
3. **Actuals.** When execution-plan tasks complete, actual hours attach to the matching entry with a delivery-mode note (human or agent-assisted). Actuals beat estimates. The gap between human-delivered and agent-assisted actuals on the same task type is the productivity measurement the platform investment case depends on; never blend the two modes into one range.

Conflict rule: never silently average. A new observation that disagrees with a baseline gets flagged with its scale context; Mike adjudicates whether the range widens or the entry splits into variants (e.g., simple form vs. script-laden form).

Entry lifecycle: preliminary (single source) → corroborated (2+ estimate observations) → calibrated (actuals attached). Every entry carries n. All entries below are currently n=1, preliminary, no actuals.

## Drafting rules (from loe_log calibration)

- **Draft up on review/governance items.** On the first full loe_log comparison (2026-08 nonprofit distribution), delivered figures ran ~1.5x Claude's drafts at the median across ~30 matched items. The gap concentrates where the practice widens scope from "fix the named defect" to "review the area, fix, and establish controls" (largest observed deltas: 2.4-3.6x). When drafting a review/governance/integration item, size the widened scope, not the point fix. n=1; recalibrate on the next loe_log comparison.
- **Prefer committed tight ranges over "discovery + build TBD."** The delivered document converted every TBD into a committed range protected by "any additional effort identified will be scoped and quoted separately." Same commercial safety, more decisive read for the client. Reserve TBD for items where even the review scope is unknowable. (`[no prior basis]` markers for internal review are unaffected.)

Format: task type | hours range | scale context | source

## Discovery and audit

- Script inventory, profiling, and performance baseline (initial discovery) | 8-12 hrs | ~2,000-script estate; scale with footprint | 2026-06 retail
- Functional-area deep dive session (promotions, cash balancing, commissions, etc.) | 1-5 hrs | per area | 2026-06 retail
- Single-defect discovery (root-cause an isolated reported bug before sizing the fix) | 1-2 hrs | per defect | 2026-06 retail

## Forms and UI

- Role-based custom form simplification | 2-3 hrs per form | dependency map must exist first | 2026-06 retail
- Unified view / field surfacing on a transaction form (e.g., available credit, payment breakdown on SO) | 3-4 hrs | per cluster of related fields | 2026-06 retail
- Small UI convenience (button, default value, dropdown cleanup) | 1-2 hrs | per item | 2026-06 retail

## Scripts and validation

- Hide-button plus on-submit validation (e.g., duplicate-contract prevention) | 6-8 hrs | per transaction type | 2026-06 retail
- Save-time alert or validation (e.g., credit-limit warning, special-character restriction) | 1-2 hrs | per rule | 2026-06 retail
- Restore or correct an existing saved-search-driven trigger | 4-6 hrs | pending initial investigation | 2026-06 retail

## Custom development (SuiteScript / custom objects)

- Custom record + capture script (User Event) + merged reporting Suitelet, combined | 19 hrs actual (originally estimated 20-28 hrs `[no prior basis]`) | one custom record (5 fields), one UE script diffing a transaction's sublist before/after save, one Suitelet with date-range filter, results grid, CSV export, and a summary rollup; agent-assisted delivery (Claude built and deployed via SDF, consultant scoped/tested/approved) | 2026-09 custom project (pet food/CPG)
- Single User Event script, one transaction record type, multi-field correction on save (header + line memo + line department, triggered by an existing custom field) | 6 hrs actual (estimated 4-6 hrs, scaled from "Save-time alert or validation," 1-2 hrs per rule) | one beforeSubmit script, three field corrections, no new custom fields/records; included a mid-build trigger-field correction, an SDF role/audience tooling limitation discovered and worked around, and a post-activation "not firing" diagnosis (Status vs. Deployed, not a script defect); agent-assisted delivery (Claude built, deployed, and diagnosed via SDF/MCP, consultant scoped/tested/approved and performed all live-account UI actions) | 2026-09 custom project (restaurant group), n=1
- Monthly KPI snapshot: custom record + scheduled script writing one record per month | 6-8 hrs estimate, no actuals yet (scaled from the 19 hr custom record + script + Suitelet entry above) | about 15 fields (agency counts by status and program, new, closed, utilization rate, average compliance score, lbs by donor category). Split: record, form and permissions 1.5-2; script 3-4; sandbox test against live searches and deploy 1.5-2. About 5-6 hrs at about 8 fields | 2026-10 nonprofit distribution (food bank), n=1, preliminary

## Configuration and data

- New payment method or list-value setup | 1-2 hrs | per item | 2026-06 retail
- Form default change (e.g., checkbox default) | 1-2 hrs | per form family | 2026-06 retail
- Accrued purchases / reconciling saved search cleanup | 4-6 hrs | single-subsidiary scale | 2026-06 retail

## Review, remediation, and reporting sprints

All from one delivered commercial assessment (2026-08 nonprofit distribution, ~120-user OneWorld, heavy middleware); T&M, delivered figures, no actuals yet.

- Saved-search / report build | 4-10 hrs | by complexity: single-purpose daily view at the bottom (2 hrs floor), consolidated multi-attribute reporting at the top | 2026-08 nonprofit distribution
- Native-feature sandbox demo or pilot (amortization, customer statements, inventory status, replenishment) | 2-6 hrs | demo/validate scope; configuration beyond the pilot quoted separately | 2026-08 nonprofit distribution
- Native module remediation (FAM, Grant Management, intercompany close) | 6-10 hrs | fix existing config in sandbox, validate with Finance; historical migration quoted separately | 2026-08 nonprofit distribution
- Area governance design (item master, inventory adjustments, master-data ownership) | 6-10 hrs | define ownership, required fields, controlled review process | 2026-08 nonprofit distribution
- Integration review sprint (sequencing, pack/ship visibility, architecture rationalization) | 7-12 hrs | per integration area; third-party vendor participation may gate | 2026-08 nonprofit distribution
- Approval-workflow alignment to stated policy | 4-6 hrs | per transaction type | 2026-08 nonprofit distribution
- Transaction-level data architecture change (preserve values at transaction time vs live master data) | 16-18 hrs | the weight/rate case; large because history and dependent calculations are in scope | 2026-08 nonprofit distribution

## Standard adders

- Project management, UAT coordination, post go-live hypercare | +15-20% of total implementation effort | always stated as an exclusion under the hours table | 2026-06 retail
