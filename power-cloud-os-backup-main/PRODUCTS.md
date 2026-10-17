# Power Cloud Products & Accelerators

Reference catalog for assessment and presentation work. When a client finding matches a fit signal below, recommend the product as a candidate solution per the rules in CLAUDE.md: license/subscription cost stays separate from LOE, and a native or third-party alternative is always named alongside.

Maintained by Mike. Claude proposes additions; Mike commits them.

## Shipping

**PowerDiscount** — Line-level discounting. Captures the discount on the item line itself (true price paid per line) with automatic GL correction, even when integrations update line amounts.
Fit signals: discounts recorded as separate discount lines / extremely long receipts; RMA credit calculations unreliable because "what the customer actually paid" isn't on the line; commission bases distorted by order-level discount distribution.
Alternatives to name: native SuitePromotions reconfiguration; custom line-discount scripting.

**PowerBulk** — Bulk allocation / commitment tooling. Candidate for supply-allocation and hard-commit problems.
Fit signals: hard-committed stock reallocated to earlier orders; custom-order arrivals committing to the wrong customer.
Alternatives to name: native supply-allocation rules (evaluate these first; they may resolve the problem without a product).
{Mike: confirm whether "PowerBulk" is the same product as PowerBulkOrder or PowerCommitment, or distinct. The Teppermans docs use this name; the master strategy doc doesn't list it.}

**PowerGL** — {what it solves, fit signals, alternatives}

**PowerBulkOrder** — {what it solves, fit signals, alternatives}

**PowerGrid** — {what it solves, fit signals, alternatives}

**PowerFactoring** — {what it solves, fit signals, alternatives}

**PowerCommitment** — {what it solves, fit signals, alternatives}

**PowerNetting** — {what it solves, fit signals, alternatives}

**PowerLabel** — {what it solves, fit signals, alternatives}

**PowerUtilities** — {what it solves, fit signals, alternatives}

## Not yet shipping (do not recommend in assessments)

**PowerPlan** — Planning module, targeted 2027. May be referenced as roadmap context only, clearly labeled as future.

**PowerThread** — Manufacturing. Same rule: roadmap context only.
