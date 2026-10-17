# T6 migration: files, Mike's columns, and the reconciliation checklist

Prepared 2026-10-09 (session bb920280) read-only from production 5641465 by SuiteQL. Nothing here has been written to the account. PLAN.md T6 (amended): every bulk step is a CSV import Mike runs; the connector is used only for spot checks. Order: contacts first (so the Partner Contact column can resolve), then projects, then opportunities, then the status-24 moves, then reconcile, then hide the AF text fields.

## Files

| File | What it is | Rows |
|---|---|---|
| `before_opportunities.csv` | Snapshot of every opportunity (184) with every field T6 touches: entity, status, class (from the mainline), partner, engagement type, End Client, Billing Party, Partner Contact, Referral Contact, commercial model, signed date, Deal UUID, both project links, the three AF text fields, kickoff, Asana, onboarding sheet, projected total, rate, external id | 184 |
| `before_projects.csv` | Snapshot of every project (270): parent, jobtype, status, inactive, class copy, End Client, Partner Contact, commercial model, Deal UUID, Asana URL, travel exclusion, the four AF fields, principal, external id, start date | 270 |
| `contacts_af_recruiters.csv` | The deduped recruiter list: one proposed Contact row per person named in the AF text on the 47 active, pre-kickoff or post-go-live projects and on the 37 open or won-ladder opportunities. `externalid` = `pc_contact_af_{slug}` (replay-safe), company 136 unless the note says otherwise, title Recruiter | 14 |
| `after_opportunities.csv` | Per open or won-ladder opportunity (37): current and proposed End Client, Billing Party, Deal UUID, Partner Contact, and for the 13 at status 24 the kicked-off question | 37 |
| `after_projects.csv` | Per active project (47): current and proposed jobtype, End Client, Partner Contact, Deal UUID, with the linked opportunity | 47 |
| `build_after_files.py` | Rebuilds the three after-files from the two before-files. `--keep` reuses the Deal UUIDs already in `after_opportunities.csv`. Run it again only if the snapshots are re-exported | |
| `id_map.csv` | Written after the contact import: `externalid, internal id` for every created contact (Mike exports it from the import results or the orchestrator reads it by SuiteQL on `contact.externalid`) | |

The Deal UUIDs in the after-files were generated once (uuid4) and are the values to import; the same UUID goes on an opportunity and its linked project.

## Columns Mike fills (search each file for `FILL`)

1. `after_projects.csv`, `mike_end_client_id`: 29 projects whose parent is a channel billing party (Anderson Frank 28, Sererra 1). The end client is the company the work is for, usually the first words of the project name (for example "Clenera - Rapid Assessment" is Clenera). Enter the customer internal id; if that customer record does not exist, create it first (it is a real customer of ours even if AF bills them) and note the new id. One more project has no parent at all.
2. `after_opportunities.csv`, `mike_end_client_id`: OPP0038 "Composite - Power Label" (entity is Anderson Frank itself). Every other subcontract opportunity already carries the end client as its entity (practice (a)) and is proposed as is; glance at those rows.
3. `after_opportunities.csv`, `mike_kicked_off_yes_no`: the 13 opportunities at Won - Awaiting Project. Jason states each deal's real state; `yes` becomes status 23 (Won - Kicked Off), `no` becomes 25 (Won - Ready for Kick Off). Never inferred from the kickoff date.
4. `contacts_af_recruiters.csv`, `contactrole`: the id of a Recruiter contact role (Setup > Sales > CRM Lists > Contact Roles; create it if absent; `contactrole` was not readable under the connector role). Rows with `existing_contact_id` set (Erin Maher, 235) are not created: the existing contact is linked instead, and the note lists the newer email seen in the source (e.pryce@tenthrevolution.com, Tenth Revolution being AF's parent group) for you to update or leave.
5. `after_projects.csv`, `proposed_jobtype` = `FILL`: three untyped projects with no linked opportunity (Goodheart-Wilcox SCA 3268, Goodheart-Wilcox CRM 4017, 540Brands 4596). Pick the type from the project itself. The other three untyped projects take the type from their opportunity's engagement type (Onward Reserve and Acme Paper: Rapid Assessment = 3; Upper Echelon: Project Recovery = 3).

## Import mapping (CSV import, Setup > Import/Export > Import CSV Records)

- Contacts: `contacts_af_recruiters.csv` minus the rows with `existing_contact_id`. Map externalid, firstname, lastname, email, phone, company (internal id), title, contact role. Add, not update.
- Projects: `after_projects.csv`, key on internal id, update only. Map `proposed_jobtype` to Project Type, `proposed_end_client` or `mike_end_client_id` to End Client, `proposed_partner_contact_externalid` to Partner Contact by external id (the import can match a List/Record field by external id when the column is mapped with the external id reference option), `proposed_deal_uuid` to PC | Deal UUID.
- Opportunities: `after_opportunities.csv`, key on internal id, update only. Map End Client, PC | Deal UUID, Partner Contact (same external id matching). **Do not map Billing Party**: the opportunity user event sets it from the class on every save (CSV import is in its execution context), so the import itself fills it. Status for the 13 at 24 goes in as 23 or 25 from `mike_kicked_off_yes_no`; nothing else moves status.
- Every import runs the T1 and T2 user events (CSVIMPORT is in their contexts). The Deal UUID duplicate guard will refuse a row whose UUID is already on another opportunity; that is the guard working.

## Reconciliation (orchestrator, read-only SuiteQL, after each import)

- [ ] Contacts: `COUNT(*) FROM contact WHERE externalid LIKE 'pc_contact_af_%'` equals the number of rows imported; every externalid in `contacts_af_recruiters.csv` resolves to exactly one id; `id_map.csv` written.
- [ ] Projects, per field: End Client set on all 47 active projects; Partner Contact set on the 24 that carried AF text (and matches the recruiter the text named); jobtype set on all 47 (0 untyped); Deal UUID set on the projects linked to the 37 open or won-ladder opportunities and equal to the opportunity's.
- [ ] Opportunities: End Client set on all 37; Billing Party equals the channel map's billing party for the class (null on Direct and Referral rows, 136 / 198 / 514 on Subcontract rows); Deal UUID set on all 37 and unique (`GROUP BY custbody_pc_deal_uuid HAVING COUNT(*) > 1` returns nothing); Partner Contact set where proposed.
- [ ] Parent versus channel map: every active project with class Anderson Frank, Sererra or SystemsAccountants has parent 136, 198 or 514; every project with a Direct or Referral class has a parent that is not a billing party.
- [ ] Status versus ledger: no opportunity remains at 24 with a project linked; the 13 moved to 23 or 25 per Jason's answers; the ledger has no rows for these (they were built by the legacy button, so the readiness state reads `complete` through the custom link, never `partial`).
- [ ] Task external ids: `COUNT(*) FROM projecttask WHERE externalid LIKE 'pc_task_%'` is 0 before any builder run on a migrated deal (pre-existing tasks are left as they are).
- [ ] Counts per field before and after match the row counts in the after-files; every `FILL` cell was filled or deliberately left with a reason written in the `note` column.
- [ ] Only after every line above is clean: hide the AF text fields (display type hidden) on opportunity and project; values stay for rollback.

## Rollback

The before-files hold every old value. A wrong import is reversed by importing the same rows from the before-file (update only, keyed on internal id). Contacts created by the import are inactivated, never deleted.
