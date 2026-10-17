# T5: the four saved searches and the review of customsearch901

Written 2026-10-09 (session bb920280). **Why this is a build sheet and not SDF XML:** Oracle's SDF reference for the `savedsearch` object says its `definition` element is system-generated and must not be hand-written; the supported path is to build the search in the UI and `object:import` it into the project (the CMT project learned the same thing: hand-written `<customsearch>` XML was ignored on every deploy and moved to `reference/saved-searches-not-sdf-deployable/`). So T5 ships as: build each search in the UI from the sheet below, confirm it with the SuiteQL query beside it, then `suitecloud object:import -t savedsearch` the four script ids into `src/Objects/SavedSearches/` so the project carries them. Ids and labels follow the netsuite-sdf standards (`PC | ...`, `customsearch_pc_...`).

## 1. PC | Opportunities missing End Client

- Script id `customsearch_pc_opp_no_end_client`, type Opportunity, public.
- Criteria: Main Line is true; Status is any of the open set (Demo'd Customer, Pre-Demo'd Prospect, Proposal, In Negotiation, Purchasing, Life Support, New Lead, On Hold) plus Won - Awaiting Project, Won - Ready for Kick Off, Won - Kicked Off; PC | End Client (`custbody_pc_referral_end_user`) is empty.
- Results: Internal ID, Number, Title, Customer, Status, Class, PC | Billing Party, Date Created. Sort by Number.
- SuiteQL check (expect the same row count):
  `SELECT t.id, t.tranid, t.title, t.entitystatus FROM transaction t WHERE t.type = 'Opprtnty' AND t.entitystatus IN (6,7,8,9,10,11,12,18,19,21,24,25,23) AND t.custbody_pc_referral_end_user IS NULL ORDER BY t.tranid`
- Today: 37 rows (every open and won-ladder opportunity; the field is empty everywhere until T6 runs). After T6 the search should return 0 and then stays as the daily exception list.

## 2. PC | Projects (subcontract) missing Partner Contact

- Script id `customsearch_pc_proj_sub_no_partner_cont` (NetSuite caps saved search ids at 40 characters; the sheet's longer id was truncated at creation), type Project, public.
- Criteria: Inactive is false; Status is any of In Progress, Awarded - Pre-Kickoff, Post Go Live; Parent Company is any of Anderson Frank (136), Sererra (198), SystemsAccountants (514), Playa Technologies (6) (the channel map's billing parties; update the list when a Subcontract row is added); PC | Partner Contact (`custentity_pc_partner_contact`) is empty.
- Results: Internal ID, ID, Name, Parent Company, Status, Project Type, AF Contact (`custentity_proj_af_contact`, until the field is hidden), Date Created. Sort by Name.
- SuiteQL check:
  `SELECT j.id, j.entityid, j.companyname, j.parent, j.entitystatus, j.custentity_proj_af_contact FROM job j WHERE j.isinactive = 'F' AND j.entitystatus IN (2,5,17) AND j.parent IN (136,198,514,6) AND j.custentity_pc_partner_contact IS NULL ORDER BY j.companyname`
- Today: 29 rows (28 Anderson Frank, 1 Sererra). After T6: the rows whose AF text named nobody.

## 3. PC | Invoices missing class (last 90 days)

- Script id `customsearch_pc_inv_no_class_90d`, type Transaction, public.
- **As built (2026-10-15 fix):** Type is Invoice; Date on or after 90 days ago; Class is none (`class anyof @NONE@`); Tax Line false (`taxline`); Shipping Line false (`shipping`); COGS Line false (`cogs`). Header rows are never tax, shipping or COGS lines, so one AND list covers both cases. The formula below failed ("unrecognized field": the shipping flag's id is `shipping`, not `shippingline`) and was replaced.
- Original criteria: Type is Invoice; Date is on or after 90 days ago (relative); either Main Line is true and Class is empty, or Main Line is false and Class is empty and Tax Line is false and Shipping Line is false and COGS Line is false (two saved searches are simpler than one with parentheses: build `_hdr` for the header rows and `_line` for item lines, or use the Formula (Numeric) criterion `CASE WHEN {mainline}='T' AND {class} IS NULL THEN 1 WHEN {mainline}='F' AND {class} IS NULL AND {taxline}='F' AND {shippingline}='F' AND {cogs}='F' THEN 1 ELSE 0 END` equal to 1).
- Results: Internal ID, Number, Date, Customer, Project (`job`), Main Line, Item, Class, Amount. Sort by Date descending.
- SuiteQL check (header rows):
  `SELECT t.id, t.tranid, t.trandate, t.entity FROM transaction t JOIN transactionline tl ON tl.transaction = t.id AND tl.mainline = 'T' WHERE t.type = 'CustInvc' AND t.trandate >= SYSDATE - 90 AND tl.class IS NULL ORDER BY t.trandate DESC`
  and item lines:
  `SELECT t.tranid, tl.id, tl.item FROM transaction t JOIN transactionline tl ON tl.transaction = t.id WHERE t.type = 'CustInvc' AND t.trandate >= SYSDATE - 90 AND tl.mainline = 'F' AND tl.taxline = 'F' AND tl.class IS NULL AND tl.item IS NOT NULL`
- This is the T4 exception list: once the class propagation user event is Released, new rows should stop appearing except for invoices whose project carries no class.

## 4. PC | CRM reconciliation

Three conditions the plan names; they are different record types, so this is three searches that share a prefix, each a reconciliation line in `migration/RECONCILIATION.md` and in the T7 cutover check.

4a. `customsearch_pc_recon_links` (Opportunity): Main Line is true; `custbody_opp_proj_create` is not empty; `job` (Project) is empty (**as built: `jobmain.internalid anyof @NONE@`**; the opportunity's native Project is reachable only through the `jobmain` join, Job (Main Line); the `job` join is empty on every opportunity header and listed deals whose Project was set, fixed 2026-10-15); Class is none of Anderson Frank, Sererra, SystemsAccountants, Playa Technologies (on a Subcontract deal the native link cannot be set, so only non-subcontract deals are exceptions). Results: Number, Title, Customer, Class, PC | Project (custom link), Project (native). SuiteQL: `SELECT t.tranid, t.custbody_opp_proj_create, t.job, tl.class FROM transaction t JOIN transactionline tl ON tl.transaction = t.id AND tl.mainline = 'T' WHERE t.type = 'Opprtnty' AND t.custbody_opp_proj_create IS NOT NULL AND t.job IS NULL AND (tl.class IS NULL OR tl.class NOT IN (5,6,110,3))`. Today: 14 rows, all legacy-button deals (the old suitelet never set the native link); after T6 and T7 the list should hold only subcontract deals, which the class filter removes, so the target is 0.

4b. `customsearch_pc_recon_status24` (Opportunity): Main Line is true; Status is Won - Awaiting Project; `custbody_opp_proj_create` is not empty (a project exists but the status never moved). SuiteQL: `SELECT t.tranid, t.custbody_opp_proj_create FROM transaction t WHERE t.type = 'Opprtnty' AND t.entitystatus = 24 AND t.custbody_opp_proj_create IS NOT NULL`. Today: 13 rows; T6 step 4 moves them to 23 or 25; the builder keeps it at 0 afterwards.

4c. `customsearch_pc_recon_ledger` (PC | Operation Ledger): Status is any of failed, pending; Date Created is before one hour ago (relative: "not within last 1 hour" or Formula (Date) `{created}` before `{now}-1/24`). Results: Name (request id), PC | Action, PC | Opportunity, PC | Step, PC | Status, PC | Error, Date Created. SuiteQL: `SELECT l.id, l.name, l.custrecord_pc_ol_action, l.custrecord_pc_ol_opp_id, l.custrecord_pc_ol_step, BUILTIN.DF(l.custrecord_pc_ol_status) AS status, l.created FROM customrecord_pc_op_ledger l WHERE BUILTIN.DF(l.custrecord_pc_ol_status) IN ('failed','pending') AND l.created < SYSDATE - 1/24 ORDER BY l.created`. Today: 0 rows (the ledger is empty). A pending row here is a run that died before marking itself failed and is reset by hand (set Status to failed) before the request id is retried.

## 5. Review of customsearch901 "Navan Project Export"

What the connector can and cannot read: the definition (criteria, column sources) is not readable through the connector (no SuiteQL table exposes saved search definitions and `ns_listSavedSearches` returns id, title, record type and public only), so the criteria below are **inferred** from the result set against the project snapshot of the same day, and the real definition is read in the UI (Lists > Search > Saved Searches > Navan Project Export > Edit) before T8 goes live. [Inferred] unless marked.

- [Verified] Script id `customsearch901`, title "Navan Project Export", record type Project, public. Result columns labeled exactly `ID`, `Name`, `Email` (the RESTlet reads Name and Email by label and takes the internal id from the result). 46 rows on 2026-10-09; full list in `migration/travel_search_901_2026-10-09.csv`.
- [Verified] Email is the project principal's email: every row's address matches `custentity_pc_proj_principal` (employee 4 = taha@, 3 = mike@, and the three rows with principal `-5` show steve@; `-5` on an employee field is unusual and worth a look in the UI on projects 282, 853 and 3268).
- [Inferred] Criteria: Status is any of In Progress (2) and Post Go Live (17); Inactive is **not** filtered (five inactive projects are in the output: LotusBev 907, Origin Acoustics Travel Expenses 344, Palmetto VAS 774, Qardio 853, TSA Rapid Assessment 399); Awarded - Pre-Kickoff (5) is excluded (the three pre-kickoff projects are missing). Three active In Progress Support projects are also missing (Solidcore Holdings 831, Glowforge Support 2390, New Avenues for Youth 3274), so there is at least one more criterion the result set does not reveal (a field those three share; check in the UI).
- Plan T5 says add nothing to the criteria (exclusion is applied by the RESTlet through `custentity_pc_travel_exclude`). Two findings for Mike's review of the definition, both outside the RESTlet's remit: inactive projects should probably fall off (add Inactive is false, or inactivate them with the travel exclusion ticked), and new pre-kickoff projects are not bookable until kickoff, which may be what the business wants (travel is booked after kickoff) or not (onsites during a rapid assessment start before status 2). Either is a criteria change in the UI, not code.
