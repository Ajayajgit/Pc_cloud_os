# AF Unapproved Hours Monitor — Plan

## Verified facts (queried against Power Cloud NS, 2026-09-01)

| Fact | Finding |
|---|---|
| Invoice customer | Always **Anderson Frank** (entity `136`), never the end client |
| End client | Via invoice header field **`job`** (project) — confirmed populated |
| AF timesheet ID location | `transaction.otherrefnum` (PO #) as **free text**, e.g. `"Tepperman 2545756"` — not a bare ID |
| Match rate on sample | 9 / 16 rows matched by substring; **all 9 amounts tie to report `Pay` exactly** |
| The 7 misses | All `Period Ending 29-Aug-2026` — not yet invoiced. Expected, not an error |
| AF contact fields | `custentity_proj_af_contact` (free text), `custentity_proj_af_contact_email` on `job` |

## BLOCKER — AF contact email coverage

Of 36 AF projects invoiced since Jun 2026: contact name on 22, **email on only 11**.
For the 8 clients in this week's report, only **2** have a sendable email:

- [ ] Alastin Skincare — Erin Pryce, `e.pryce@tenthrevolution.com` OK
- [ ] Harvest Hope — Jared Brownstein OK
- [ ] ACL Airshop — Yuv Nichani, **no email**
- [ ] Rowan — Christopher O'Donnell, **no email**
- [ ] Goodheart-Wilcox SCA — Kayla Podwalny, **no email**
- [ ] Chalk Couture — `"Adam"` (first name only), **no email**
- [ ] Teppermans Limited (job 4029) — **no contact, no email**
- [ ] ABSCI Use Case — **no contact, no email**

Emails are NOT safely derivable: pattern is `f.lastname@andersonfrank.com` but
`m.mihaylov1@andersonfrank.com` carries a collision suffix. Two domains in use
(`andersonfrank.com`, `tenthrevolution.com` — the parent). Also dirty: leading
space on `" Josh Brown"`.

## Phases

### Phase 0 — Contact data cleanup (prerequisite, manual)
- [ ] Backfill `custentity_proj_af_contact_email` on all active AF projects
- [ ] Normalize `custentity_proj_af_contact` (trim, full names)
- [ ] Saved search: active AF projects missing contact email — keeps it clean going forward
- [ ] Decide: is there a fallback AF account manager for unmapped projects?

### Phase 1 — Data model  ✅ COMPLETE (validates clean)
- [x] Custom record `powercloud_af_timesheet`, one per AF `id`:
      all report columns + linked invoice + `first_seen_unapproved` (set once,
      never overwritten) + `last_seen_on_report` + status
- [x] Invoice body fields (mirror, for AR Aging / saved-search filtering):
      `custbody_pc_af_ts_status`, `custbody_pc_af_ts_id`,
      `custbody_pc_af_status_asof`, `custbody_pc_af_first_unappr`
      CHANGED from the agreed `custbody_pc_af_days_unapproved`: a stored day
      count is wrong every day after the import. Store the date, compute days
      in the search formula.
- [x] Import stamps the clean AF ID into `custbody_pc_af_ts_id` so future runs
      match exactly instead of by substring

### Phase 2 — Import Suitelet (run Thu PM / Fri AM)  [parse+match DONE, UI next]
- [ ] CSV upload (ask AF for CSV export, or Save-As from the xlsx — avoids
      bundling SheetJS for one manual click)
- [x] Match: `otherrefnum LIKE '%<id>%'` scoped to `entity = 136`; prefer exact
      `custbody_pc_af_ts_id` once populated
- [ ] **Preview screen before any write**: newly unapproved / flipping to
      approved / not yet invoiced / genuine exceptions. Confirm, then apply
- [ ] Stamp `as_of` on every touched record; stale (`as_of` > 10 days) renders
      as "Stale", not "Approved"

### Phase 3 — Friday meeting output
- [ ] Aging view: 0-14 / 15-30 / 30+ days since `first_seen_unapproved`, $ totals
- [ ] Exception list: unmatched IDs older than 10 days + any `Pay` vs invoice
      amount mismatch
- [ ] Grouped by AF contact via invoice -> job -> contact email

### Phase 4 — Review & Trigger (NO auto-send, ever)

Sender is **Steve Hyham** (employee `-5`, steve@powerclouderp.com). He is the
one with the working relationship; the mail only lands if it is genuinely his.

#### Transport decision
- [ ] **v1: Suitelet renders drafts, Steve copies into his own mail client.**
      ~6 emails/week. Zero infra, perfect fidelity, threads naturally.
- [ ] **v2: push drafts into Steve's mailbox as real drafts** (Gmail API /
      Graph). He edits and sends from his client. Target state.
- [ ] **REJECTED: `N/email.send({author: -5})`.** Looks like the integrated
      option, undermines the goal most. Mail leaves NetSuite servers claiming
      to be @powerclouderp.com (needs DKIM or it spam-folders), leaves no copy
      in Steve's Sent, and starts a NEW thread every week instead of
      continuing the chase conversation.

#### Grouping
- [ ] **One email per AF rep, not per client.** Reps cover multiple accounts
      (Mihaylov: Brixton + Case Worthy + Sauce Labs; Gresser: FoundRae +
      Visante; Brownstein: both Harvest Hope projects). Three separate emails
      from Steve on the same morning is the fastest possible tell.

#### Nudge history — the thing that makes tone possible
- [ ] On `powercloud_af_timesheet`: `nudge_count`, `last_nudged_on`,
      `last_nudged_by`, `snoozed_until`
- [ ] Without this every draft is a first-nudge forever, and Steve sends
      "just following up" on something brand new. This is the single most
      important field group for not sounding robotic.

#### Three real tone variants, keyed to age — not one template with a swapped adjective
- [ ] **1-2 weeks / first ask:** light, one or two sentences, names the weeks
- [ ] **3-4 weeks / second ask:** direct, acknowledges it is a repeat ask
- [ ] **30+ days:** escalate the SENDER, not just the wording. Mike joins or
      cc the AF account manager. A fourth email from Steve does nothing.

#### Anti-tells (build these as rules, not suggestions)
- [ ] **Prose, not tables, under 4 items.** A human writes "the 8/15 and 8/22
      weeks for Alastin are still sitting unapproved." The 4-column table with
      a `$` total is the giveaway. Only list when 4+ and prose reads worse.
- [ ] **Lead with hours and weeks, not dollars.** "$7,380 outstanding" reads as
      AR collections. The rep's own commission is the motivator — imply it
      ("holds up your side too"), don't invoice them. TONE CALL FOR STEVE.
- [ ] No footer, no "generated automatically", no tracking pixel, no unsubscribe
- [ ] Base text should be written BY Steve in his own voice, then have
      specifics slotted in. Not written by us and approved by him.
- [ ] Skip LLM drafting in v1 — inconsistent voice, and there is no nudge
      history to condition on yet. Revisit once Phase 4 has run ~8 weeks.

#### Review Suitelet
- [ ] One card per rep: their timesheets, age of each, **prior nudge history**,
      and what changed since last week
- [ ] Editable draft body — Steve can rewrite every word before it goes
- [ ] Per-rep action: **Send / Skip / Snooze 1 week**. Snooze matters — rep is
      on PTO, client is mid-close. Without it the only options are send or
      ignore, and ignore means it nags forever and gets tuned out
- [ ] Nothing leaves the system without an explicit per-rep action
- [ ] Log every send back onto the timesheet record

## Open questions
- [x] ~~Can the AF portal export include Approved rows?~~ **No** — no filters
      exposed, download is as-is. Negative list confirmed; `as_of` staleness
      guard in Phase 2 is therefore mandatory, not optional
- [ ] Fallback AF contact for unmapped projects?

## Phase 1 delivery notes (2026-09-01)

SDF project scaffolded, `suitecloud project:validate` passes clean.
9 objects in `src/Objects/`:

- `customrecord_pc_af_timesheet` (24 fields) — record NAME is the AF timesheet
  ID, it is the natural key from the report. No redundant ID field.
- `customrecord_pc_af_import_log` (10 fields) — auto-numbered `AFIMP0001`,
  holds the as-of date every status anchors to plus the source file
- 4 invoice body fields, all `displaytype=LOCKED` (display, never hand-edited)
- 2 custom lists, 1 `Anderson Frank` invoice subtab

Deliberate choices worth knowing:
- **`FLOAT` not `CURRENCY`** for Pay and Variance. Custom-record currency fields
  drag in a currency-context requirement for no benefit; the report is USD and
  the currency code is captured as text.
- **`enablenumbering=F` on the timesheet record** — AF's ID is the identity.
  Generating our own number alongside it invites the two drifting apart.
- **`Not Yet Invoiced` is a first-class match status**, not an error bucket.
  7 of 16 sample rows are in it and all 7 are correct.

## Deployed to PRODUCTION 2026-09-01 14:18 PST (user-authorized)

`project:validate --server` clean, then `project:deploy` — 49 objects created,
0 errors, 15 seconds. Account 5641465 Power Cloud Consulting, LLC.

Verified present via `suitecloud object:list --type customrecordtype`:
`customrecord_pc_af_timesheet`, `customrecord_pc_af_import_log`.
All 4 `custbody_pc_af_*` fields confirmed queryable on `transaction`.

Open: the two custom record tables are not yet visible to SuiteQL or the REST
metadata-catalog. Expected propagation lag, not a deploy failure — recheck
before Phase 2 writes anything, since the import Suitelet depends on them.

## RESOLVED — sandbox concern

`suitecloud account:manageauth --list` shows `PowerCloudProd` and
`PowerCloudProduction`, both Administrator @ Power Cloud Consulting, LLC.
**No sandbox.** `project.json` currently points `defaultAuthId` at
`PowerCloudProd`, which means a bare `project:deploy` would hit PRODUCTION.
User explicitly accepted a production deploy of net-new objects.
- [x] Production deploy authorized and completed
- [ ] Still worth standing up a Power Cloud sandbox before Phase 2 ships
      script logic that WRITES to invoices — objects are one thing, a bad
      Map/Reduce stamping 7,687 invoices is another

## Phase 2 progress (2026-09-01) — parsing and matching complete

`node src/FileCabinet/SuiteScripts/PowerCloud/af_unapproved_hours/tests/run_tests.js`
**32 passed, 0 failed.** Two dependency-free AMD modules, both pure functions so
the entire diff is exercised offline before it can touch a record.

- `lib/pc_af_parse.js` — RFC 4180 CSV, BOM, CRLF, HH:MM:SS to decimal hours,
  DD-MMM-YYYY dates, header-name column lookup (not position)
- `lib/pc_af_match.js` — token matching, classification, `buildDiff` preview

The fixture is the real report and the nine real invoices from the account. The
suite asserts the exact live answer: **16 rows, 9 matched, 7 not yet invoiced,
0 exceptions, every variance 0.00.**

Design points the tests pin down:
- **Whole digit-token matching, not substring.** AF id `2545756` must not match
  a PO containing `12545756` or `25457569`. SuiteQL `LIKE` prefilters cheaply;
  `confirmCandidates` rejects what it lets through. Two stages on purpose.
- **Grace boundary is exact**: 10 days old is informational, 11 is an exception.
- **Ambiguous never first-wins.** One AF id on two invoices returns no invoice
  and raises an exception, rather than silently picking one.
- **`firstSeen` is asserted immovable** across a second run.
- **A matched row with a pay variance counts as both matched and an exception**,
  and `counts.matched` is counted rather than derived by subtraction.
- Dates are refused rather than guessed; M/D/YYYY parses but warns that US
  ordering was assumed.

`tests/` is deliberately excluded from `deploy.xml` — it stays in the repo and
never reaches the production File Cabinet.

### Next: the Suitelet (upload, preview, apply)
- [ ] Still blocked on SuiteQL visibility of `customrecord_pc_af_timesheet`
      (deployed and confirmed via `object:list`, not yet queryable). The
      Suitelet must read existing timesheet records to build the diff.

## Phase 2 complete in code (2026-09-01) — AWAITING DEPLOY APPROVAL

Tests: **32 passed, 0 failed.**
`suitecloud project:validate` clean. `suitecloud project:validate --server`
clean against account 5641465 (zero warnings after removing `defaultfunction`,
which the server reported as ignored for suitelets).

**`suitecloud project:deploy` was blocked by the Claude Code permission
classifier. Nothing new is in NetSuite yet.** The Phase 1 objects deployed
earlier are still there; the Suitelet and the four lib modules are not.

New files:
- `lib/pc_af_config.js` — every script id in one place. Custom list VALUES are
  resolved by name at runtime, never hardcoded, so the same code works in an
  account where the internal ids differ.
- `lib/pc_af_data.js` — all NetSuite I/O. SuiteQL invoice prefilter (chunked,
  parameterised, scoped to AF customer 136 and non-voided), timesheet reads,
  project/AF-contact lookup, and `applyDiff`.
- `scripts/pc_af_import_sl.js` — the upload/preview/confirm Suitelet.
- `Objects/customscript_pc_af_import_sl.xml` — deployment restricted to
  ADMINISTRATOR, `isonline=F`, loglevel AUDIT.

Decisions worth knowing:
- **The diff is rebuilt from live NetSuite state on confirm, not replayed from
  the preview.** The preview stores only the uploaded file id. A stale preview
  therefore cannot be applied, and both paths run the identical `buildFor`.
- **`loadExistingForDiff` loads the union** of ids in the file AND every record
  still marked Unapproved. Loading only the file's ids would make the
  flip-to-approved step silently do nothing — the bug this design avoids.
- **Governance guard**: refuses to start under 150 units, stops cleanly at 60
  and reports partial progress. Re-running is safe; records key on the AF id.
- Writes are per-row try/caught so one bad row cannot abandon the rest.

### Known gaps before this is trustworthy
- [ ] **Not yet executed against real data.** Validation proves it compiles and
      references resolve; it does not prove the writes behave.
- [x] ~~customrecord invisible to SuiteQL~~ RESOLVED, and my diagnosis was
      wrong. It was never propagation lag: the MCP connection role cannot query
      ANY custom record in this account, including `customrecord_ach_config`
      which long predates this work. The records were fine from the moment they
      deployed. Scripts running as Administrator are unaffected.
- [ ] First real run should be on a week where the expected answer is known
      (the current fixture: 9 matched, 7 pending, 0 exceptions).

## Deployed to PRODUCTION 2026-09-01 14:51 PST — Suitelet live

`project:deploy` complete, 20 seconds. Script internal id **2605**,
deployment internal id **1**, status RELEASED, log level AUDIT,
restricted to ADMINISTRATOR, isonline=F.

**URL:** https://5641465.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2605&deploy=1

Everything from Phases 1 and 2 is now in the account. Nothing has run yet.

## Phase 2b — the promptly-approved gap (2026-09-01) DEPLOYED

Mike caught a real hole: hours approved in a timely manner never appear on ANY
unapproved report, so an approach that only learns from report rows leaves
those invoices blank forever. Blank then meant four things at once (approved
before we saw it / not a timesheet invoice / predates the tool / import never
run) - unusable as an A/R filter, and exactly the negative-list risk raised in
the very first message. The `as_of` guard covered a different failure and did
nothing for this one.

**Fix: invert the universe.** The invoice population is the truth; the report is
only a filter over it. AF timesheet invoices are identifiable with no report at
all - invoice to AF carrying a seven-digit token in the PO number.

Account shape: 5,552 non-voided AF invoices since Jul 2019.
**3,538 carry a timesheet id; 2,014 do not** (rev share, balance transfers, MSP).

Decisions taken:
- Backfill **all history since 2019**
- **Do not** stamp the 2,014 non-timesheet invoices

Those combine well: with a full backfill, blank on an AF invoice comes to mean
exactly one thing - not a timesheet invoice. So the planned "No Timesheet ID"
list value was not needed. Only "Too Recent To Judge" was added.

Per-invoice rule (`matcher.classifyInvoice`, pure and unit tested):

| Condition | Status |
|---|---|
| Timesheet id on the latest report | Unapproved |
| Has id, absent from report, invoiced >= 10 days before it | Approved |
| Has id, absent from report, invoiced < 10 days before it | Too Recent To Judge |
| No seven-digit id | untouched, stays blank |

Strong vs weak approval is readable with no extra field: **Approved with
`custbody_pc_af_first_unappr` populated** means we watched it go unapproved then
absent. **Approved with it blank** means it was never seen unapproved at all.

`scripts/pc_af_sweep_mr.js` serves as both the one-time backfill and the ongoing
weekly reconciliation.
- **Refuses to run with no import log.** Without a report there is nothing to be
  absent from, and running anyway would mark ~3,500 invoices approved on the
  strength of nothing.
- All decisions happen in `getInputData`; only invoices needing a change are
  emitted, so map just writes. A repeat run over a correct account writes
  nothing and leaves no system notes.
- `runSuiteQLPaged` - a single `runSuiteQL` caps at 5,000 rows and this account
  already has 5,552 AF invoices. The naive version would have silently truncated.
- Never touches `first_unappr`. Set once by the import, aging depends on it.
- Optional `custscript_pc_af_sweep_from` date narrows a run without changing
  how any status is decided.

Tests: **39 passed, 0 failed.** Local and server validation clean, deployed.

### Order of operations matters
1. Import Suitelet (writes timesheet records + the import log)
2. Sweep Map/Reduce (reads that log for its as-of date)

The sweep hard-fails if run first, by design.

## First live run: FAILED then FIXED (2026-09-01 15:08)

`Invalid Field Value 61898 for custrecord_pc_afil_file` - the source-file
pointer was a SELECT with a guessed `selectrecordtype` of -10, which is not
Document. Both local and server validation had passed it; only a real save
catches a wrong record-type reference.

**Nothing was written.** `createImportLog` runs first in `applyDiff`, so it
failed before any timesheet record or invoice stamp. The only side effect was
the uploaded CSV landing in the File Cabinet as file 61898 - harmless.

Fixed two ways:
1. Field changed to the native **DOCUMENT** fieldtype - no selectrecordtype at
   all, so there is no longer a guess to be wrong.
2. `createImportLog` now catches at `save()`, drops the file link and retries.
   An audit pointer can no longer abort the import it is describing.

Deployed. Re-running the deploy came back with no warning, confirming the
fieldtype change settled.

## First successful import, and the silent bug it hid (2026-09-01 15:13)

Import ran. Timesheet records created, 9 invoices stamped. Verified by querying
the invoices back rather than trusting the success screen - which is the only
reason the following was caught:

`custbody_pc_af_ts_id` was **null on all 9**. Status, as-of and first-unapproved
were all correct, so the UI looked entirely fine.

`buildDiff` exposed the id only at `entry.row.afId`, but four consumers read
`entry.afId`: the invoice stamp, two error messages, and both preview tables.
`submitFields` accepted `undefined` without complaint.

Fixed: `afId` lifted to the top of the entry object, plus a guard so an absent
value is skipped rather than written as undefined. Regression test added and
**proved to fail without the fix** (reintroduced the bug, watched it go red,
restored). 40 tests passing. Deployed.

Consequence: the 9 invoices carry a correct status but no AF id, so matching
would fall back to the SuiteQL LIKE prefilter instead of exact. Re-running the
import over the same file repairs them - it is idempotent, and first-seen is
already pinned at 9/1/2026 so nothing ages incorrectly.

## Go-live operating model (2026-09-01 15:40) DEPLOYED

The accountant never deploys. Deployments are one-time setup, or a code change.
That is Mike's job and it is not part of the weekly cycle.

**Weekly, for the accountant:**
1. Customers -> Custom -> **AF Unapproved Hours Import** (a real menu item)
2. Upload the CSV, set Report As Of
3. Preview, then Confirm & Apply
4. Done - the sweep queues itself

Changes made:
- **`runasrole` = ADMINISTRATOR** on the Suitelet deployment. The script does
  its work with admin rights, so the accountant needs NO permission on invoices,
  either custom record, or the File Cabinet. Better security posture than
  granting a human standing invoice-edit rights: the script can only do the one
  thing it is written to do.
- **Menu links in both centers**: `ACCOUNTCENTERCUSTOMERSCUSTOM` (Accounting
  Center, for the accountant) and `BASICTRANSACTIONSCUSTOMERS` (classic center,
  for Mike as admin). No more raw scriptlet URL.
- **The Suitelet queues the sweep** via `N/task` after a successful apply. This
  removes the second manual step AND enforces the ordering the sweep requires,
  since it reads the import log for its as-of date.

### The interlock that matters
`queueSweep` refuses to queue if the apply stopped early or logged any row
error. The sweep marks any AF invoice whose id is absent from the unapproved
set as Approved - so after a PARTIAL import, the rows that were never written
are not in that set, and the sweep would mark genuinely unapproved invoices as
approved. A partial import must never be followed by a sweep. The result screen
says so explicitly and tells the user to re-run the import.

### BLOCKED on one input
- [ ] **Which custom role does the accountant use?** The account has 17 custom
      roles with opaque ids (customrole1000, customrole1115, ...) and the `role`
      table is not queryable through the MCP connection. `audslctrole` is still
      ADMINISTRATOR only. One line changes once named, then redeploy.

## Weekly sweep cost — corrected (2026-09-01 16:05)

Mike asked whether the weekly sweep would really be slow. It would have been,
because of a flaw in my own "writes only on change" claim:

```js
if (String(inv.cur_asof || '') !== asOfStr) { values[STATUS_ASOF] = asOfStr; }
```

The status does not change week to week but the as-of date does, so every
timesheet invoice looked changed. **~3,538 writes every week**, each with a
system note, to restore one number.

Root mistake: I made staleness a per-invoice property. It is a property of the
SYSTEM. "When was the last import?" has one answer; if it is three weeks old,
everything is stale. Storing that on 3,538 rows is storing one number 3,538
times and paying weekly to refresh it.

Fixes:
1. **`AF Status As Of` renamed `AF Status Established`** - the report date on
   which the status BECAME what it is. Written only when the status moves.
   Global staleness comes from the newest import log record.
2. Same fix applied to the import (`applyDiff`), which had the identical flaw
   on its 16 report rows. It now writes nothing at all for a row that was
   already unapproved last week.

## Approval is terminal (2026-09-01)

Mike: "Hours are never un-approved. No reason to look backwards."

The sweep now **excludes already-Approved invoices in SQL**, at source. Effect:
- First backfill: ~3,538 timesheet invoices, one big run
- Every week after: only those still Unapproved, Too Recent, or newly created -
  realistically a few dozen

Not the same as being blind to them: the IMPORT works straight from report rows,
so if AF ever did re-list an approved timesheet it would still be set back to
Unapproved regardless of what the sweep looks at.

## Access and navigation — DONE
- `audslctrole` = `ADMINISTRATOR|[scriptid=customrole1000]` (the accountant)
- `customrole1000` declared as a manifest dependency - SDF rejects a reference
  to an object the project neither owns nor declares
- Menu links deployed in BOTH centers:
  - `ACCOUNTCENTERCUSTOMERSCUSTOM` - Accounting Center, Customers > Custom
  - `BASICTRANSACTIONSCUSTOMERS` - classic center, Transactions > Customers

## Sweep scoping — closed periods (2026-09-01 16:58) DEPLOYED

The all-history backfill produced a wall of closed-period errors. Body-field
writes throw on invoices in closed / AR-locked periods.

**This REVERSES the earlier "backfill everything since 2019" decision.** That
choice was made before the closed-period constraint was known; it is not
achievable and would not be useful if it were - nobody chases a 2021 timesheet.

Fix, per Mike: floor the sweep at **the earliest AF invoice this feature has
ever stamped**, computed each run rather than hardcoded so the window is
anchored to real data instead of a date that rots. The
`custscript_pc_af_sweep_from` parameter still overrides for one-off runs.
If nothing is stamped yet, falls back to asOf minus 90 days rather than all
history, so a first run cannot stampede into closed periods.

Also: closed-period write failures now get their own `SKIPPED_CLOSED_PERIOD`
bucket and log at AUDIT rather than ERROR, so a stray real failure stays
visible instead of drowning.

I raised an ongoing concern - an invoice lingering unapproved past its period
close would error weekly forever. **Mike: periods are not closed fast enough for
this to matter; an invoice is marked unapproved within a week of creation.**
Concern dropped, no further engineering for it.

### What blank means now (revised again)
Blank on an AF invoice = **not a timesheet invoice, OR dated before tracking
began.** The earlier cleaner reading (blank = not a timesheet invoice) died with
the full backfill. Dashboards should filter on AF status IS NOT NULL for the
tracked universe rather than treating blank as meaningful.

## Phase 3 + 4 review screen (2026-09-01 17:17) DEPLOYED

`customscript_pc_af_review_sl`, script 2607 / deploy 1. Menu links in both
centers, ADMINISTRATOR + customrole1000, runasrole ADMINISTRATOR.

New: `lib/pc_af_draft.js` - pure draft composition, no N/ deps, so the WORDING
is unit tested offline. 49 tests passing.

Rules the tests pin down:
- Tone tier driven by the OLDEST item and prior ask count, never by row count
  or money. Three genuinely different messages, not one template with a
  severity adjective swapped
- Prose under 4 items ("the 8/15 and 8/22 weeks for Alastin"), list above.
  Asserted that no bullet appears under the limit
- **No dollar figure anywhere in any draft body**, asserted at every tier
- No unsubscribe / "generated automatically" footer, asserted
- One bundle per REP, not per client - three clients for Mihaylov produce ONE
  email. Asserted
- Rows with no contact email land in their own visible bundle, never dropped
- Bundles ordered oldest first

Also added: `loadUnapprovedForReview` (excludes snoozed), `recordNudge`
(count + date + user + append-only log), `snooze`, `findProjectsMissingContact`.

### Deliberately NOT built
Sending. NetSuite would send from its own servers, leave nothing in Steve's Sent
folder and start a new thread weekly. Steve copies the draft into his own
client; "Mark as Sent" records only that it happened.

### Handed over
`tasks/TEST_PLAN.md` - everything to exercise tomorrow morning, with expected
numbers and the two writes to try.

### Still blocking the actual goal
26 of 30 active AF projects have no contact email. Only Alastin and Harvest Hope
are sendable today. Worklist rendered at the bottom of the review screen.

## Walkthrough doc (2026-09-02)

Google Doc: Anderson Frank - Unapproved Hours - Weekly Walkthrough
https://docs.google.com/document/d/1uroZIs9Dwi3jMsDHU_H0skk-cEmJi5RotQeZuQ69D10/edit

Written for the accountant, not a developer - no Map/Reduce or governance talk.
Covers all five steps, the preview tiles, the four statuses, why NetSuite does
not send the emails, and the known limitations.

Outstanding on the doc:
- [ ] Insert the 4 screenshots at the `[[ SCREENSHOT: <file> ]]` markers
      (Insert > Image > Upload from computer, from `Walkthru Screenshots/`).
      Could not upload them programmatically - ~1.5MB of base64 through a tool
      call is not practical.
- [ ] Check the two tables; Google's HTML converter may have left an empty row
      above each header. It mangled bold inside table cells on the first
      attempt (rendered as literal `**Rows in file**`), so they were rebuilt
      without inline bold and the broken version was trashed.

## Step 2 confirmed working — my concern was wrong

I flagged that the standard A/R Aging report might not accept a custom
transaction body field as a filter. **It does.** Mike had already built
`PC A/R Aging Summary` (report cr=338) - a standard A/R Aging Summary with
`AF Timesheet Status any of` added and nothing else changed.
https://5641465.app.netsuite.com/app/reporting/reportrunner.nl?&cr=338&whence=

## DEFERRED — drag-and-drop upload

Estimated under an hour plus a test cycle. Approach: an INLINEHTML drop zone
that assigns `e.dataTransfer.files[0]` onto NetSuite's existing file input via a
DataTransfer object, so the server side does not change at all. Select the input
defensively (`#main_form input[type=file]`) rather than guessing NetSuite's
rendered id.

**Held until a real Friday has been run**, on Mike's call. The genuinely useful
half of that work is the client-side check that warns on a dropped `.xlsx`
before submit - forgetting Save-As-CSV is the likeliest weekly mistake. The drag
zone itself saves about three seconds once a week.

## Minor polish noted, not actioned
Drafts say "Alastin Skincare Inc" where a person would write "Alastin" - it uses
AF's full legal client name. A short-name mapping would fix it; Steve rewriting
the base text may make it moot.
