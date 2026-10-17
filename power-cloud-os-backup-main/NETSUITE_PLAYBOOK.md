# NetSuite Domain Playbook (AFA / DTC / Wholesale / Retail / Nonprofit Distribution)

Domain knowledge for assessment work. Verifying what a client said is not the same as knowing what "good" looks like for their process area. This file is that second thing: the patterns a strong NetSuite consultant recognizes, so a finding gets caught because we know the shape of the problem, not because we got lucky.

Two jobs:
1. **Recognition.** When a transcript or the account shows a fit signal below, the matching pattern is a candidate finding. Weight revenue-recognition, cash-matching, and payout/settlement patterns highly; they are high-value and easy to under-weight because clients describe them as small monthly annoyances.
2. **Completeness.** The evidence-mining step runs the transcript against the process-area checklist at the bottom. A material item that was actually discussed must not fall on the floor just because it read as a minor aside. (This is exactly how the customer-deposit methodology got missed on Shinesty: it was discussed on a call, but nothing forced a check that it had been captured.)

Maintained by Mike. Claude proposes additions after each engagement (patterns that recurred, misses that should have been caught); Mike commits them. Same convention as [PRODUCTS.md](PRODUCTS.md) and [LOE_BASELINES.md](LOE_BASELINES.md).

Each pattern carries: **Fit signals** (what in the calls or account points to it), **Check / ask** (what to verify via MCP or ask the consultant/client), **Solution shapes** (native first, then Power Cloud product, then third-party; never product-only). Products cross-reference [PRODUCTS.md](PRODUCTS.md).

---

## Order to Cash (e-commerce, retail, subscriptions)

### Revenue recognition timing: order vs fulfillment vs payment
The single most under-weighted O2C pattern. Get the payment/deposit/revenue chain end to end before writing anything.

**Fit signals:** Shopify (or another cart) charges the card at order placement, but NetSuite only creates a Sales Order at that point; the Cash Sale (which drives revenue and COGS) is not created until Item Fulfillment. Pre-sale / pre-order / backorder widen the gap. Cash from the processor arrives before fulfillment, so there is no deferred revenue, AR, or cash-sale transaction to match it against. Symptoms the client will name: "reconciliation is hard," "cash never ties out," a manual monthly deferral entry they started and later dropped.

**Check / ask:** Walk the exact transaction chain: does a Customer Deposit get created at order placement? What triggers the Cash Sale or Invoice? Is a payment method recorded on the SO (which forces cash-sale-on-fulfillment behavior)? Was the "bill unfulfilled items" preference ever toggled, and did toggling it to fix a wholesale invoicing problem leave a gap on the e-commerce side? If the client uses custom integration flows rather than the Shopify connector, deposits are often skipped because they are harder to script than the app does natively.

**Solution shapes:** Record a **Customer Deposit** at e-commerce order placement, converting to recognized revenue and COGS at Item Fulfillment, so the books match when money actually moves (this is also what the card networks recommend: do not charge until you fulfill, though almost nobody does). Confirm the fix does not reintroduce whatever wholesale unfulfilled-billing issue led to a preference being disabled. Native, no product required; the work is in the integration flow and preferences.

### Payout and settlement reconciliation
**Fit signals:** Payouts arrive on a delay (Shopify roughly 48h from order date) and across more than one processor. Data brought in by manual monthly CSV export instead of an automated feed. An automated payout integration was started but never finished. Amazon settlements needing a manual fix "almost every month" for years. Social-commerce settlement (Meta/TikTok) handled by separate custom scripts from card-processor settlement.

**Check / ask:** How many processors, and which (e.g., Nimbus/ePay, Solupay, Versapay, Cybersource)? Is there a payout flow at all, or only order flow? Are Amazon fees landing in the right GL accounts, or is a needed mapping (e.g., cost of advertising) missing from the settlement drop-list? Treat card-processor settlement and social-commerce settlement as **separate reconciliation workstreams** with separate owners and error rates.

**Solution shapes:** Complete/deploy an automated daily payout import (often Celigo), mapped by processor. Sequence this **after** the revenue-recognition fix so each payout has a matching NetSuite transaction to reconcile against. Native mapping fixes for settlement fee accounts.

### Inventory sync and oversell
**Fit signals:** Cart-to-NetSuite inventory sync runs on a short delta (5 to 15 min), creating an oversell window during launches/sales. Dedicated scripts already exist to detect oversold conditions after the fact. Ad-hoc manual reallocation for urgent orders.

**Check / ask:** What is the sync cadence and does it read available or on-hand? Counterintuitive but important: **syncing more often can make oversell worse.** If the cart is the only channel drawing from the pool, the cart decrements on order (before NetSuite sees the fulfillment); a sync that fires in the gap can push the cart quantity back up and cause the oversell. Establish whether they allow out-of-stock/backorder selling. Document the allocation strategy in use (immediate / future / pre-book).

**Solution shapes:** Tune sync frequency and triggers rather than reflexively adding concurrency. Remediate the underlying allocation defects instead of relying on after-the-fact detection scripts. Evaluate **PowerCommitment** for controlled, rules-based override of automatic allocation on high-priority orders.

### Returns and exchange reconciliation
**Fit signals:** A returns platform (e.g., Loop) automates return authorization, but reconciliation gaps persist on edge cases: gift-card usage, partial refunds, shipping-protection products (e.g., Navidium). Return-shipping label costs not tracked at order/item level. Complex exchanges (refund plus new order) hard to tie to processor payouts. Watch the classic apparel case: high reported return rate but near-zero return-authorization volume in NetSuite, because refunds are issued without the item coming back (the goods are not resellable). The refund posts with quantity zero, which is fine for inventory but distorts average-sales-price reporting.

**Check / ask:** Where does the return actually get recorded (returns platform, NetSuite, or a manual journal)? Is it refund-only or return-with-receipt? If refund-only, where does that data live and how does it hit the GL? This is a prime example of a [Reported] vs [Verified] gap worth leading the onsite with.

**Solution shapes:** Resolve individual edge cases against the returns platform and processor data; add return-shipping cost capture; formalize a payout-variance reconciliation procedure (tag to dedicated GL accounts to shorten investigation).

### Subscriptions and deferred revenue
**Fit signals:** Annual prepaid subscriptions handled by manual workarounds because the cart's selling-plan model is limited. Subscription orders post as single line items despite annual prepayment. Deferred-to-recognized adjustments done by manual monthly journal entries. Subscription platform slated for deprecation (e.g., Order Groove). Often NetSuite is not even aware of the concept of a subscription: the cart just auto-creates a recurring sales order, and if payment is only taken at each order it is really a recurring order, not a prepaid subscription. Prepaid-up-front is the case that needs real deferred-revenue handling.

**Check / ask:** Is payment taken up front (needs deferral) or per shipment (does not)? Is NetSuite aware of subscriptions at all, or only of the resulting orders? What replaces the deprecating platform?

**Solution shapes:** A NetSuite process (custom record or a **PowerGL** template) to automate deferred-revenue recognition ahead of the platform transition, removing the manual monthly journals.

### Retail / POS and cycle counts
**Fit signals:** Kiosk/POS orders as cash sales with fast fulfillment. Oversell from immediate return/resell cycles and thin inter-location transfer visibility. Cycle counts tracked in spreadsheets and uploaded via manual CSV rather than scan-based WMS.

**Check / ask:** Are retail cycle counts integrated to WMS scanning or manual? Is inter-location transfer visibility adequate to prevent retail oversell?

---

## Order to Cash (wholesale, EDI, marketplace)

### Wholesale allocation strategy (immediate / future / pre-book)
**Fit signals:** Committed stock stripped from wholesale orders even after the item is picked. Short-shipped, PO-linked orders left open, causing a new wholesale order to allocate against stale quantity. Pre-book/bulk commitments consumed by the faster real-time cart sync. Public intake forms introducing data-integrity issues. Unused commission scripts still active.

**Check / ask:** How are the three allocation types configured? What strips a commitment after pick (this should not happen once committed and allocated)? Procedure for closing short-shipped PO-linked orders?

**Solution shapes:** Formal review of allocation config and intake validation; retire unused scripts; repeatable short-ship closure procedure. Evaluate **PowerBulkOrder** to reserve bulk/pre-book commitments without immediate fulfillment.

### Discounting: header vs line-level
**Fit signals:** Header-level discounts used to consolidate line/order discounting because of integration constraints. A custom customer-level discount (e.g., a flat 5%) handled outside native discount logic. Carts (Shopify, NuORDER) that allow order-level and line-level discounts simultaneously, which the client believes NetSuite cannot represent, so a custom script converts them. Verify that belief before repeating it; state the source.

**Check / ask:** Where is the discount recorded (separate line vs on the item line)? What does the custom conversion script actually do (read it if Script Reader is available)? Does the finding rest on a [Reported] limitation or a [Verified] one?

**Solution shapes:** Evaluate **PowerDiscount** for true line-level discount on the SO line with automatic GL correction, replacing the header-level workaround and custom customer-discount logic. Name native SuitePromotions reconfiguration as the alternative.

### EDI document automation
**Fit signals:** SPS Commerce (or similar) across multiple trading partners and document types. ASN (856) works for drop-ship partners but is blocked for non-drop-ship by insufficient package/SKU-level data granularity. Bulk 855 PO-acknowledgment automation needs logic to confirm allocation before acknowledging. A second wholesale integration (e.g., MarketTime) possibly live alongside the primary (e.g., NuORDER) and never mentioned.

**Check / ask:** Which trading partners, which doc types, which are automated vs manual? Confirm whether a second wholesale integration is active or legacy.

### Amazon settlement reconciliation
**Fit signals:** FBM orders as SO + invoice with fast fulfillment; FBA orders as invoices without fulfillment records. Settlement mismatches and manual tracking, split across separate core and FBA SKU series. Fee types not landing in the right account because the mapping is missing from the settlement drop-list.

**Check / ask:** Where do the mismatches originate in the Celigo Amazon settlement mapping? Can the missing fee mapping (e.g., advertising cost) be added?

---

## Warehouse, fulfillment, inventory

### Dual / parallel warehouse systems
**Fit signals:** A natively-built custom object model (batches, totes, packages, shipping events, a WHM suitelet) running alongside a separately licensed scanning solution (e.g., RF-SMART), with no documented ownership boundary. Legacy footprints (e.g., Ship Hawk) still present but inactive.

**Check / ask:** Which system owns which part of the warehouse, and why are both maintained? Any legacy tool safe to retire? A custom, well-liked warehouse build is often the reason a client stays on NetSuite; treat it as an asset to protect, not debt to remove.

### Dormant but licensed apps
**Fit signals:** A full install of a paid app (e.g., RF-SMART) sitting inactive, with legacy fields/forms retained for reporting. The client is likely still paying the license.

**Check / ask:** Is the license still being paid? Which fields/forms are still referenced, and can they be retired to drop the license? Do not assert "not used" and "actively maintained" about the same system in the same document; resolve it or ask.

### Split-location / packaging strategy
**Fit signals:** Inventory bifurcated into retail-packaged vs flat-packed formats requiring split warehouse locations, with a stated goal to unify SKUs/packaging. A long custom workflow that picks a fulfillment location, and if stock is not there, auto-creates a transfer order from the other location so no order is lost.

**Check / ask:** What drives the split, and what breaks if it is removed? Sequence any consolidation to avoid disrupting active fulfillment.

---

## Record to Report (close, GL, reporting)

### Month-end close duration and manual reclass
**Fit signals:** Close spanning 8 to 10 days, driven by manual reconciliation. Manual month-end GL reclassification between accounts to reflect sales channels. $0-revenue manual orders (influencer/affiliate) reclassed to advertising expense monthly via a saved-search-driven process. Purchase clearing accounts needing frequent manual adjustment to resolve bill vs item-receipt discrepancies. (Note: 8 to 10 days is not necessarily "slow"; state it factually, do not editorialize.)

**Check / ask:** Which steps actually consume the days? Is the purchase-clearing variance systemic (a fixable root cause) or one-off?

**Solution shapes:** Evaluate **PowerGL** for no-code reusable reclassification templates that repost on save/edit (including historical transactions in the open period): a strong fit for the $0-order-to-advertising reclass, sub-channel segmentation, and purchase-clearing corrections. Name manual journals / saved searches as the status quo being replaced. Build a close checklist targeting a shorter cycle.

### Revenue segmentation
**Fit signals:** Reporting relies on manual reclass because channel detail is not captured natively. Desire to expand to sub-channels (Amazon FBA vs FBM, cart sub-channels) and move to segment-based reporting, reducing redundancy between custom order classes and GL accounts.

**Solution shapes:** Design an expanded classes/segments model to capture sub-channel detail at order entry. Pair with PowerGL for the reclass automation.

### Fixed assets and prepaids off-system
**Fit signals:** Fixed assets and prepaid expenses tracked in external spreadsheets (or ad-hoc automation) rather than native modules; late postings after close.

**Solution shapes:** Evaluate native **Fixed Assets Management** and amortization schedules to replace the spreadsheets.

### Late postings after period lock
**Fit signals:** Transactions posting after the period is closed; suspected integration-driven. Trial balance and aging reports disagreeing.

**Check / ask:** Understand the mechanism before writing it up: a period can be soft-locked (journals only) or fully locked. With a full lock you can still post on a date in the locked period, but the posting period follows to the next open period. Then an aging report keyed on transaction date will age from the original invoice date while the financials show the later posting period, so trial balance vs aging can mismatch. Confirm whether this was a material issue or a passing mention before it earns a work item; not everything discussed belongs in the document (it may belong in the fast-follow list instead).

---

## Procure to Pay

### Bill processing and vendor prepayments
**Fit signals:** An expense/bill tool (e.g., Ramp) integrated for standard bills, but product-related vendor bills still routed through a manual/Celigo process. Vendor deposits recorded as non-inventory PO line items because native prepayment is bypassed, with adoption stalled over unverified limitations. A single fragile custom bill-import flow.

**Check / ask:** What are the actual limitations that stalled native prepayment adoption, and do they still hold? Can bill automation extend to product-related bills?

### Landed cost and PO tracking
**Fit signals:** PO tracking on an external board (e.g., Monday.com) rather than native landed-cost templates, often justified by DDP shipping terms; low multi-shipment volume and negligible (under 5%) vendor variances.

**Check / ask:** Given DDP and low variance, is native landed cost worth it, or is the external board fine for now? Do not over-scope where the current process is defensible; note the threshold that would change the answer.

### Banking and treasury footprint
**Fit signals:** A substantial bank integration (e.g., J.P. Morgan: ACH, wire, bill pay, positive pay, statement feeds) plus a separate embedded-banking integration (e.g., Fispan), both active and never walked through with finance.

**Check / ask:** Which functions are actually in use, is there redundancy between the two, and what manual workarounds remain? This is usually a scoped discovery, not a build.

---

## E-commerce platform and integration layer

### Custom flows vs connector/template
**Fit signals:** A developer proud that nothing is out-of-the-box; all cart flows (order, inventory, product, subscription) custom-scripted rather than using the connector. Often the reason given is a specific incompatibility (e.g., subscriptions), but the whole integration ends up custom as a result.

**Check / ask:** Is it the connector, the integration app, or a template with modifiable base flows? What was the original incompatibility, and does it still justify a fully custom stack? A custom stack is a maintenance liability and a candidate for consolidation, but confirm before recommending a rebuild.

### iPaaS review vs new product
**Fit signals:** An iPaaS (e.g., Celigo) already in place as the integration layer.

**Check / ask:** If Celigo access is available (integrator.io API or Celigo's MCP server), inventory the layer directly: flows and enabled state, schedules, mappings, error history. Half-finished flows (started but never deployed) and stale schedules are common, cheap-to-verify findings.

**Solution shapes:** Recommend a configuration review of the existing layer, not a new integration product. Celigo-side fixes (completing a payout flow, cadence tuning, mapping corrections) are directly executable in the execution phase via the API/MCP; prebuilt Integration App settings may need UI work where the API does not reach.

---

## Platform and cross-cutting governance

### Large custom-script estate
**Fit signals:** A very large active custom-script count (well over 200), the majority client-specific, accumulated through years of piecemeal customization. No consolidated review of scripts, workflows, and logging ever performed. Performance addressed by buying concurrency licenses rather than tuning.

**Check / ask:** Verify the script count against the account (numbers repeated casually on calls are frequently wrong; a client admin can check ours). Read the highest-traffic O2C and warehouse scripts if Script Reader is available. Is the Application Performance Management (APM) SuiteApp installed but unused?

**Solution shapes:** Activate APM and run a full analysis; inventory and audit scripts/workflows/logs for consolidation or retirement, highest-traffic first. Reassess concurrency needs after tuning, not before.

### Duplicate customer records
**Fit signals:** Customers created via public intake forms with no de-dup, producing a known duplicate problem significant enough that a dedicated alert script already exists. Or one-customer-per-order creation from the cart producing very high customer counts (e.g., 1.84M records), which slows customer-list and record rendering.

**Check / ask:** Is the pain duplicates specifically, or record volume degrading performance? For per-order customers, one-to-one is expected (a reorder reuses the customer); the fix is usually better report scoping or deactivating long-inactive customers, not a mass merge. **Connector caveat:** inactivating a customer can break the integration if the account number/external ID must stay unique and reusable; a mass merge of a million records is not realistic. Confirm the connector's behavior before recommending either.

**Solution shapes:** De-duplication and intake validation (matching rules or a merge workflow) at the source for the public-form case; report-scoping or inactivate-after-N-years for the volume case, with the connector caveat checked first.

### Portal / saved-search performance
**Fit signals:** A third-party or custom portal (e.g., a wholesale payment portal) with latency traced to query logic that loads excessive history rather than customer-scoped data. Prior fixes were license purchases, not query optimization.

**Solution shapes:** Audit the underlying saved searches/scripts and scope queries to customer-specific data; reassess license needs after.

### Custom record types read and loaded through the MCP connector
Added 2026-09-20 from one engagement (item-attribute records converted from custom lists, then loaded by MCP). Single-source until a second engagement corroborates.

**Fit signals:** Attribute or lookup values kept as custom record types (often converted from custom lists), read and written through the MCP connector during a data migration. A record reads fine one ID at a time but SuiteQL or a REST collection search returns "Record 'customrecord_x' was not found". Or the connector role shows Full on the type yet gets a 403 (`INSUFFICIENT_PERMISSION`).

**Check / ask:**
- **Access Type.** With "Require Custom Record Entries Permission", the type can be read by ID but not listed. Set Access Type to **Use Permission List** and put every role that needs the type, including the MCP connector role, on its Permissions tab. Make this the default for every custom record type we specify, whether in SDF or in instructions for a UI build, and check it on existing types.
- **Owner.** A type converted from a custom list can have a blank Owner. On a 403 for a type the role lists at Full, check and set the Owner first. This is a check, not a rule: one type with a blank owner worked once the role was added, so do not assume it is always the cause.
- **IDs are not sequential.** New custom record values do not get the next ID (parallel creates land at scattered IDs). Never infer an ID from a pattern and never conclude a value is missing from a short probe range. Log the `recordId` from every create by value name, and before any item load rebuild the value-to-ID map from live NetSuite (SuiteQL once the type lists, otherwise read each mapped ID and confirm name, active, and uniqueness). Do not reuse a saved ID map without that check. After a create, read the record back and count entries for that name.

**Solution shapes:** Fix Access Type and Owner in the record type definition so SuiteQL works, then do duplicate checks and value-to-ID lookups from live data. Load one test record with a full read-back, then batch, then verify with counts and checksums against the source file. The connector cannot delete, so a duplicate value must be removed by hand or by a Map/Reduce mass-delete script, which is why the lookup before the load matters.

### Reusing existing fields and lists when designing item attributes
Added 2026-10-02 `[unreviewed]` from one engagement (item attribute design for a manufacturer's item master, Julie's rule). Single-source until a second engagement corroborates.

**Fit signals:** A naming book, spec sheet or source file labels an attribute differently from the account's existing fields and lists, and a new field or list is about to be proposed for it. Typical overlaps: Material, Size, Length, Amperage, Voltage, Capacity, Wire Gauge, Quantity, Color, Finish.

**Check / ask:**
- Before proposing any new attribute field or list, compare the values the source gives against the lists the account already has. If the values overlap an existing list, the concept is the same even when the label differs (on MH Crane the book's "Finish" for threaded rod and wire rope held galvanized and stainless, which is the existing Material list, so Material carries it and no Finish field was created).
- Tell the user about every overlap you find instead of deciding silently, and let them confirm the reuse. A book's labels are often inconsistent between pages, so the label alone is not evidence of a new concept.

**Solution shapes:** One field per concept across every item category (one Size, one Length, one Amperage, one Wire Gauge), reused wherever the values match. New value sets that do not overlap are built once, in the same SDF project as the rest of the attribute design, before any item load. The reason to hold the line: each duplicate field or list multiplies what has to be built, permissioned and maintained across the whole item schema.

---

## Nonprofit distribution (food banks, agency-partner models)

Added 2026-08-16 from one delivered engagement (nonprofit food bank, Feeding America network); patterns confirmed billable there and reported common at peer food banks on the same implementation-vendor stack. Single-source until a second nonprofit engagement corroborates.

### Fund accounting and classification architecture
**Fit signals:** Restricted-fund tracking absent from the GL string (tracked via memo fields or a custom field instead of native Class/segments); program-vs-department reporting that cannot produce budget-to-actual by program; official financial reports built as custom reports plus Excel manipulation; operating vs non-operating classification via manual VLOOKUP each board cycle.

**Check / ask:** Where does program/fund classification actually live (Class, segment, custom field, memo)? Can they produce budget-to-actual by program natively? Which reports leave NetSuite for Excel, and why? A classification migration (custom field to Class) gates everything downstream; design it before automating dependent reporting.

### Donor duality and donated-inventory valuation
**Fit signals:** The same organization existing as both vendor and donor (often duplicated records); product sourced three ways (government-funded e.g. TEFAP/CSFP, donated, purchased) with different prescribed valuation rates; purchased-for-donation variance between actual cost and prescribed donated value uncaptured; donated receipts stuck "received not yet billed" when auto-billing config misses a category; transformation/repack activity creating zero-value inventory.

**Check / ask:** How is donated product valued and at what rate authority (Feeding America publishes prescribed values)? Standard Cost pilot is the natural solution shape for fixed per-pound values. Where does purchased-vs-donated variance go? Who maintains the donated-category billing config?

### Agency distribution model
**Fit signals:** "Customers" are partner agencies (pantries, kitchens, shelters), not paying wholesale accounts; custom Agency Deposit/Payment/Refund transaction types; partner eligibility restrictions (TEFAP and program rules) existing as data but unenforced at order entry; recurring partner orders manually recreated on known cadences; pounds-and-meals metrics needed alongside dollars; partner master data owned in an external CRM (e.g., Dynamics) and synced in.

**Check / ask:** Which system owns partner master data and holds? Are eligibility restrictions enforced or advisory? What share of orders follow a known cadence (recurring-order automation candidate)? What are the pounds/meals reporting obligations and where do those numbers come from?

### Food-bank WMS and integration landscape
**Fit signals:** A specialty food-bank WMS (e.g., Waerlinx) plus a partner-ordering front end (e.g., eHarvest) plus CRM, stitched with custom middleware (e.g., Azure Logic Apps) owning mission-critical business rules; lot/expiration control and recall traceability requirements; weight driving valuation, rates, and transportation math; fulfillment discrepancies surfacing after invoicing.

**Check / ask:** Which system is authoritative for each rule, and what does the WMS vendor claim is "not possible" (verify independently; vendor claims of impossibility have proven false)? Walk lot traceability from receipt through agency distribution. Where does weight live at transaction time vs item master? Same dual-WMS ownership questions as the core warehouse section.

---

## Evidence-mining completeness checklist

Run the transcript against this at the end of the evidence-mining step. For each area, either log a finding or explicitly note "not discussed / not applicable." The point is that a material item that WAS discussed cannot silently fall off; if it is ambiguous whether something is material, that is a candidate to interview the consultant about, not to drop.

- **O2C revenue recognition:** deposit vs cash-sale-at-fulfillment chain walked end to end?
- **Payouts/settlement:** every processor and marketplace accounted for; card vs social settlement separated?
- **Inventory sync/oversell:** cadence and decrement behavior understood?
- **Returns:** where recorded, refund-only vs return-with-receipt, reporting impact?
- **Subscriptions:** prepaid-up-front vs per-shipment; is NetSuite aware of them?
- **Wholesale allocation:** immediate/future/pre-book; commitment-stripping; short-ship closure?
- **Discounting:** header vs line; source of any "NetSuite cannot" claim verified?
- **EDI:** partners, doc types, automated vs manual; second wholesale integration confirmed?
- **Warehouse:** ownership of parallel systems; dormant-but-licensed apps; split-location driver?
- **Nonprofit clients only:** fund/program classification architecture walked? Donated-inventory valuation and donor duality? Agency eligibility enforcement? Lot/recall traceability? (Section above.)
- **Close/GL:** what consumes the days; reclass automation; purchase-clearing root cause?
- **Segmentation:** sub-channel capture at order entry?
- **Fixed assets/prepaids:** on-system or spreadsheets?
- **P2P:** bill automation coverage; native prepayment blockers; banking-footprint redundancy?
- **Integration layer:** custom-vs-connector rationale; iPaaS config review?
- **Governance:** script-count verified; APM installed/used; duplicate/volume customer pattern; portal query scoping?
