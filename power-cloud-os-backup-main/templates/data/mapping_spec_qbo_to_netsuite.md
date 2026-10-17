# Mapping Spec: QuickBooks Online → NetSuite

> TEMPLATE (DRAFT 2026-08-12, pending review). Copy to `{Client}/working/mapping_spec_qbo.md` and fill. This document is the human-gated contract of the B12 pipeline: the consultant approves THIS, not ten thousand rows. Example rows below come from the A12 spike profile (Intuit sandbox company).

**Client:** {Client} · **Source:** QBO company {realm ID, name verified} · **Target:** NetSuite {account ID, environment} · **Profile run:** {date, link to data_profile_qbo.md} · **Spec status:** draft / approved by {name, date}

## 0. Design decisions this mapping depends on (resolve BEFORE approving)

| # | Decision | Evidence from profile | Resolution |
|---|---|---|---|
| D1 | Customer hierarchy: flatten or keep parent/child? | e.g. spike profile: 3/29 customers carry ParentRef | |
| D2 | Item identity: what becomes the NetSuite item name/number when SKUs are sparse? | e.g. 0/18 items had SKUs | |
| D3 | CoA: map to client's target CoA or restructure? Number assignment scheme? | e.g. 44/89 accounts were Expense type | |
| D4 | Open-transaction strategy: open balances only, current-year detail, or full history? | counts from profile | |
| D5 | One-way doors confirmed (see checklist at bottom) | | |

## 1. Chart of Accounts (load first; everything references it)

QBO AccountType → NetSuite account type baseline (adjust per client):

| QBO AccountType | NetSuite type | Notes |
|---|---|---|
| Bank | Bank | |
| Accounts Receivable | Accounts Receivable | NetSuite allows one primary A/R posting flow; extra QBO A/R accounts need a decision |
| Accounts Payable | Accounts Payable | same caution |
| Other Current Asset / Fixed Asset / Other Asset | Other Current Asset / Fixed Asset / Other Asset | |
| Other Current Liability / Long Term Liability | Other Current Liability / Long Term Liability | Deferred revenue: mind feature-gated account types (see one-way doors) |
| Credit Card | Credit Card | |
| Income / Other Income | Income / Other Income | one income account + segmentation beats per-channel accounts (house standard, Day 4) |
| Cost of Goods Sold | Cost of Goods Sold | |
| Expense / Other Expense | Expense / Other Expense | consolidation candidate when Expense count is bloated |
| Equity | Equity | retained earnings and system equity accounts: never repurpose, map around |

Rules: **never repurpose NetSuite system accounts** (Inventory Received Not Billed is not A/P; the spike near-miss). Legacy QBO IDs are not NetSuite internal IDs; ignore them except as external IDs. Load in dependency order (parents before children).

## 2. Customers

| QBO field | NetSuite field | Rule |
|---|---|---|
| DisplayName | Company Name / entity name per D2-style naming decision | |
| CompanyName | companyname | fallback to DisplayName when empty (spike: 20/29 filled) |
| GivenName/FamilyName | contact record | individual vs company flag decision |
| PrimaryEmailAddr.Address | email | |
| PrimaryPhone | phone | |
| BillAddr.* | default billing address | |
| ShipAddr.* | default shipping address | fallback to BillAddr when empty |
| ParentRef | parent customer | per D1 |
| Balance | opening balance via {invoice detail / opening-balance journal} per D4 | never as a bare field |
| Taxable / tax codes | tax item/schedule mapping | own mini-table per client nexus |
| Id | externalid (`QBO-CUST-{Id}`) | re-runnability depends on this |

## 3. Items

| QBO field | NetSuite field | Rule |
|---|---|---|
| Name | item name/number per D2 | |
| Type Service / NonInventory / Inventory | Service / Non-inventory / Inventory item | Inventory type is a one-way door; confirm each |
| Description | sales description | |
| UnitPrice | base price | price levels decision if QBO used price overrides |
| PurchaseCost | purchase price | |
| IncomeAccountRef / ExpenseAccountRef / AssetAccountRef | corresponding item accounts | resolves through the §1 CoA map |
| TrackQtyOnHand / QtyOnHand | quantity via **inventory adjustment at cutover**, never a field on the item | date-stamped, counted, signed off |
| Id | externalid (`QBO-ITEM-{Id}`) | |

## 4. Vendors

Same shape as customers (DisplayName, email, phone, addresses, terms, externalid `QBO-VEND-{Id}`). 1099 tracking flags per client decision.

## 5. Open transactions (per D4)

| Object | Strategy options | Chosen |
|---|---|---|
| Open invoices | line-level detail vs single-line balance per invoice | |
| Open bills | same | |
| Unapplied payments/credits | apply-in-QBO-first beats migrating unapplied | |
| Historical closed transactions | summary journals by period vs skip vs full detail (cost warning) | |

## 6. One-way door checklist (initial each before load)

- [ ] Inventory costing method per item type confirmed ("everybody has f***ed up costing at some point")
- [ ] Matrix decision n/a for QBO source (no variants) unless client sells variants outside QBO
- [ ] UOM: only where a real conversion exists
- [ ] Serialized/lot: confirmed per item class
- [ ] Deferred-revenue account types vs enabled features checked
- [ ] Subsidiary assignment (OneWorld) locked before any record loads

## 7. Dry run and reconciliation (sandbox, MCP-verified)

- Counts match per entity: source count = loaded count + logged exclusions (no silent drops)
- Referential integrity: every child has its parent; every item resolves its three accounts
- Trial balance of opening entries = QBO trial balance as of cutover date
- Spot checks: {N} records per entity compared field-by-field
- Reconciliation report saved to `working/` and reviewed at the load gate
