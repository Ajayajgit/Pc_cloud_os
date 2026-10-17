# Mapping Spec: Shopify → NetSuite

> TEMPLATE (DRAFT 2026-08-12, pending review). Copy to `{Client}/working/mapping_spec_shopify.md` and fill. The human-gated contract of the B12 pipeline. Example evidence below from the A12 spike profile (Power Cloud Apparel dev store). Note: for ongoing sync (vs one-time migration) the answer is usually the integration layer (Celigo), not this spec; this spec covers initial data load and catalog restructuring.

**Client:** {Client} · **Source:** {shop}.myshopify.com (name verified) · **Target:** NetSuite {account ID, environment} · **Profile run:** {date, link} · **Spec status:** draft / approved by {name, date}

## 0. Design decisions this mapping depends on (resolve BEFORE approving)

| # | Decision | Evidence from profile | Resolution |
|---|---|---|---|
| D1 | **Matrix items or standalone items?** The defining Shopify question: products with options (size/color) map to NetSuite matrix items, or flat items per variant? | e.g. spike: 3/17 products multi-variant; options seen: Color, Denominations; max 5 variants | |
| D2 | Item identity when SKUs are sparse: what is the NetSuite item name/number? | e.g. SKUs on 3/26 variants, barcodes 0/26 | |
| D3 | Customer scope: all Shopify customers, or purchasers only? Guest checkouts? | profile counts + withOrders split | |
| D4 | Order history: none / open orders only / N months (needs `read_all_orders` beyond 60 days) | | |
| D5 | Gift cards, subscriptions, selling plans present? Each is its own workstream, not a mapping row | e.g. "Denominations" option = gift card tell | |
| D6 | One-way doors (checklist at bottom) | | |

## 1. Products → Items

**If D1 = matrix:** product → matrix parent; options → matrix attributes (custom lists per option name); variants → matrix children. **If D1 = flat:** each variant → one item; product title + option values compose the name.

| Shopify field | NetSuite field | Rule |
|---|---|---|
| title | item name (parent) per D2 | |
| options[].name / values | matrix attributes + custom lists | attribute order matters; lock it in this spec |
| variant.sku | item name/number or UPC per D2 | sparse SKUs: define the generated-identity rule explicitly (e.g. `{handle}-{opt1}-{opt2}`) and log every generated value |
| variant.barcode | UPC code | |
| variant.price | base price | compare-at price → price-level decision |
| vendor | vendor / brand field | spike: 17/17 filled, usable |
| productType | item class/category | 16/17 filled |
| status (active/draft/archived) | inactive flag rule | archived items: load-inactive vs skip, decide |
| inventory levels | **inventory adjustment at cutover**, per location map | never a field on the item |
| id / variant id | externalid (`SHOP-PROD-{id}` / `SHOP-VAR-{id}`) | collision discipline: external IDs are how re-runs and the future connector stay sane (Shinesty lesson) |

## 2. Customers

| Shopify field | NetSuite field | Rule |
|---|---|---|
| displayName / firstName+lastName | customer name (individual) | |
| email | email | dedupe rule: email is usually the merge key; define it |
| phone | phone | |
| defaultAddress | default billing+shipping | Shopify has address lists; primary only vs all, decide |
| numberOfOrders / amountSpent | reporting only; do not load as fields | |
| tags | customer category / custom field mapping table | |
| id | externalid (`SHOP-CUST-{id}`) | 1:1 customer-per-order pollution check first (the 1.84M-record lesson): profile distinct emails vs customer count before loading |

## 3. Orders (per D4)

| Concern | Options | Chosen |
|---|---|---|
| Open/unfulfilled orders | load as NetSuite sales orders (usually via the integration layer, not CSV) | |
| Historical orders | skip / summary journals by period / full detail (cost + 60-day scope warning) | |
| Payment state | Shopify-captured vs pending; deposit/rev-rec treatment per playbook patterns | |
| Refunds/returns in history | usually reporting-only; do not reconstruct | |

## 4. One-way door checklist (initial each before load)

- [ ] Matrix vs flat locked (D1): converting later is a rebuild, not an edit
- [ ] Costing method per item type confirmed
- [ ] UOM: almost never needed from Shopify; justify any use
- [ ] Serialized/lot: confirmed n/a or scoped
- [ ] Location map (Shopify locations → NetSuite locations) locked before inventory adjustment
- [ ] Subsidiary assignment locked (OneWorld)

## 5. Dry run and reconciliation (sandbox, MCP-verified)

- Product/variant/customer counts: source = loaded + logged exclusions
- Matrix integrity: every child resolves to its parent; every attribute value exists in its list
- Inventory adjustment total = Shopify on-hand snapshot (same timestamp)
- Spot checks {N} per entity, field-by-field
- Reconciliation report saved to `working/`, reviewed at the load gate
