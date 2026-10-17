# Session State — Navan Integration

**Last Updated**: 2026-10-08

## 2026-10-08: Navan session expired; re-bootstrapped (from the Power Cloud OS planning session)

- **Symptom:** daily "Your Navan login link" emails to relay@ from Sep 29, and the relay journal showing `Navan login failed; whole run aborted` on every 4:00 AM PT invoice run from Sep 28 through Oct 8 (11 runs). Expense-report creation and the Uber poll were unaffected; only invoice PDFs stopped attaching.
- **Cause:** the cached Navan storageState expired. Each daily run then attempts a fresh login, Navan sends a browser-bound magic link, the headless login cannot complete, and the run aborts. Measured session life: May 28 bootstrap to about Sep 27, roughly four months. Expect the next expiry around late January 2027 unless the automation below ships.
- **Fix applied:** ran `bootstrap-session.mjs` on the box (root over SSH to 178.156.254.136; the `pcrelay` SSH alias exists only on the original machine), pulled the magic link from the relay@ email through the Gmail connector, dropped it in `/tmp/magic_link.txt`. `RESULT: SUCCESS - session fully established + cached` at 02:54 UTC on Oct 9. The backlog of unattached bookings should catch up on the next scheduled run; verify in the relay journal or the integration log.
- **Owed changes (planned as part of the travel-sync work, see `Internal/SALES_OS_PROPOSAL.md` v3 section 13 in the Power Cloud OS):**
  1. In `src/navan.js` / the worker: after one failed login, alert once and back off until a re-bootstrap, instead of retrying every morning (each retry sends another magic-link email and burns a token).
  2. Automate the re-bootstrap: the relay reads relay@ (Gmail API) for the newest magic link and opens it in the same browser context, so the four-monthly manual step disappears.
  3. Redact the `x-pc-secret` header from the request logger; today the shared secret is written to the journal in clear text.
  4. Ask Navan's account manager (same conversation as the checkout-field SFTP feed) whether the relay user can be exempted from new-device verification.
- **New in the same plan:** a daily `project-sync` job on this box that writes the active-project list to Uber's `to_uber/expense_codes` (full-list replace) and to Navan's Bill To Client SFTP feed, sourced from the config record's Project Saved Search through a new RESTlet. This is the sync the SOW left out of scope.


## Uber for Business Integration — LIVE & AUTONOMOUS (2026-05-29)

Full Uber → NetSuite expense pipeline built, deployed, and proven end-to-end this session. Commits 9bd6230 + 14d8c99.
- **Flow (pull model):** the Hetzner relay box runs `relay/src/uber-poll.js` on a **systemd timer, daily at 12:00 UTC (5 AM PT)** → SFTPs every `from_uber/trips/daily_trips-*.csv`, parses ONE expense line per transaction (Fare/Tip), POSTs to the new `rl_navan_uber_attach` RESTlet (`customscript_pc_navan_uber_attach`). NetSuite has no scheduled script for Uber.
- **Employee match:** `custentity_pc_uber_email` (personal Uber email) with corporate-email fallback — riders keep personal accounts.
- **Project:** parse left-of-dash of the Expense Code (`ID-Name`) → NS internal id; override map `UBER_CODE_OVERRIDE` maps `4037-abilityfirst`/`abi`/`abili` → **4027** so AbilityFirst rides attach to the Navan AbilityFirst ER; NS-rejected (e.g. `296`) or non-numeric → blank customer (NS workflow assigns).
- **Dedup:** PRIMARY = relay SQLite seen-set (`uber_seen` table) — immediately consistent. NS custom-column search index LAGS for newly-created lines, so it can't be trusted for back-to-back runs (this caused a duplicate-lines incident — cleaned by delete + reimport). Secondary/locator = per-line `custcol_navan_uber_txn_id` (+ `custcol_navan_uber_trip_id`).
- **Memo:** Uber sets placeholder "Uber Travel"; when Navan later appends to the same report it overwrites with the real Navan trip name.
- **Receipts:** NOT wired yet (future — same headless-relay pattern as Navan invoices; receipt URL is parsed but not attached).
- **Proven:** clean re-import = 17 txns, $763.20, 0 dupes, 0 fails; AbilityFirst attached to ER0347 (Mukula) + ER0351 (Irfan); 2nd run = no-op (idempotent). SFTP user `259920ef`, key at `/etc/pc-navan-relay/uber_sftp` on the box; `NS_UBER_RESTLET_URL` uses scriptid strings (numeric IDs 404'd).

## Schedule (NetSuite account = Pacific) — ALL THREE NS SCHEDULES ARE UI-MANAGED
Deploying a `<recurrence>` block RESETS the live schedule (confirmed 2026-05-29: a deploy reset the
expense + cancellation times; downloader, which had no recurrence, was untouched; Mike re-fixed all
in the UI). So all three M/R/SS deployment XMLs now carry status SCHEDULED with NO `<recurrence>` —
schedules live only in the UI and survive deploys.
- Navan expense processor **3:00 AM PT**, cancellation handler **3:30 AM PT**, invoice downloader **4:00 AM PT** (UI-set).
- Uber poll **12:00 UTC = 5:00 AM PT** (systemd timer on the box, not NetSuite). Runs last so rides attach to the freshest Navan ERs.

## 2026-05-29 morning run — VERIFIED GOOD
Overnight Navan + Uber runs landed as expected (Mike confirmed the morning looked good; diffed
against his `TransactionSearchResults334.csv` baseline). Integration considered stable; Mike has
other ideas parked for a future session.

## Pending (user, NS UI)
1. ~~Verify M/R schedules~~ DONE 2026-05-29: deploy had reset expense + cancellation times; Mike fixed all manually. Recurrence now stripped from XML so future deploys won't reset them.
2. Delete orphan fields `custrecord_navan_enabled` + `custrecord_navan_relay_hmac_key`.

## Prior State (Navan core — as of 2026-05-28)

- **LIVE in PowerCloudProd (account 5641465) on a daily schedule.** (Originally 6/7 AM; now 3:00/3:30/4:00 — see Schedule above.) Verified end-to-end: historical backfill created/appended ERs for 6 employees, 0 failures.
- Deploy target is **production** (no PCC sandbox auth profile existed; user chose prod with caveats). CLAUDE.md's "sandbox first" rule was consciously overridden.
- Lookback Days = 7 (daily steady-state). Was bumped to 30 for one-time backfill, then back to 7.
- Invoice downloader deployed but **status = TESTING** (broken — Navan SPA HTML; relay replaces it).
- Receipt automation still broken (relay is the long-term plan — unchanged).
- Uber SFTP feed still empty (unchanged).
- No git remote configured. 7 commits on master from this session.

## What Was Just Done (2026-05-27 / 05-28)

Set up SuiteCloud auth (PowerCloudProd authid, re-auth'd after invalid_grant) and deployed the full bundle through ~8 iterative deploys, fixing bugs as the M/R surfaced them against real data:

1. **SDF schema fixes** — hand-written XMLs didn't match current SDF schema. Fixed: removed invalid EXPENSEREPORTS feature, `<configuration>`→`<objects>` in deploy.xml, `FREEFORMTEXT`→`TEXT`, `includename` boolean, removed `enablesysteminformation`, replaced inline `<selectoption>`. KEY LEARNING: local `project:validate` gives misleading enum errors; use `--server` for accurate validation.
2. **Dropped redundant `custrecord_navan_enabled`** — config loader already filters `isinactive='F'`, so marking the singleton config Inactive IS the kill switch. Field still orphaned in prod (needs manual delete).
3. **Added SDF Script + Deployment objects** for all 3 scripts (cancellation handler ID shortened to `_pc_navan_cancel_handler` for 40-char limit).
4. **Logger Name error** — set `includename=F` on integration_log so autonumber identifies the record.
5. **Navan HTTP 500** — root cause was NS `N/https` receiving gzipped body it couldn't parse. Fix: `Accept-Encoding: identity` + `Accept: application/json` + User-Agent headers. (Confirmed via direct curl that Navan API itself was fine.)
6. **email.send author** — was using runtime user (-5); now looks up employee by alertEmail.
7. **Currency required** — set both body currency (lookup by symbol) AND line-level currency (doesn't auto-source in dynamic mode). Line-level was the actual fix.
8. **findOpenReport** — primary line-level `customer` search filter unsupported in this account; route straight to header-search + line-inspection fallback.
9. **Employee lookup** — `r.getValue('internalid')` returned -5 for some employees; switched to `r.id`.
10. **Project 282 "Allow Expenses" was false** (NS data fix by user, not code) — was blocking Steve's PC Internal trips.

## Relay build (started 2026-05-28) — receipt PDF automation

Building the PC Browser Relay (Navan invoice PDFs). Code split into 3 layers; all
committed. See `relay/README.md` for the full architecture + infra runbook.

- **Layer A (NS receiving side): DONE + deployed.** `rl_navan_invoice_attach` RESTlet
  (RELEASED, TBA-gated), `customrecord_navan_relay_run` audit record, config fields
  Relay Base URL + Relay Shared Secret. Commit de2c802.
- **Layer B (NS sending side): DONE + deployed.** `ss_navan_invoice_downloader` rewritten
  to push a batch to `{relay_url}/navan/invoices` with `X-PC-Secret` bearer auth (not HMAC —
  see commit msg rationale). Commit 9d46e7d.
- **Layer C (relay app): Phase-1 skeleton committed (74e6a65).** Under `relay/`. server.js,
  netsuite.js (TBA OAuth 1.0a), db.js (SQLite), worker.js all implemented. `navan.js`
  (Chromium login + PDF capture) is a **Phase-2 stub** — selectors/flow need a live session.

### Relay — INFRA DONE; one step from end-to-end (2026-05-28)
Relay is live on Mike's **Hetzner box** (178.156.254.136, NOT GCE — reused existing VPS,
added 2GB swap). Node22+Caddy+Chromium+systemd; TLS at https://relay.powerclouderp.com;
NS TBA validated end-to-end against the prod RESTlet. SSH alias `pcrelay` + a scoped
allow-rule in `.claude/settings.local.json` let Claude drive the box.

**Navan headless auth — SOLVED** (Navan won't help a free-tier customer, so engineered around it).
See `relay/README.md` "Session bootstrap" + memory [[navan-invoice-url-returns-html-not-pdf]].
Mechanism: box logs in headless → parks → operator COPIES (does NOT click) the newest
Descope magic link → drops it on the box → box opens it in a 2nd tab (same browser) →
OAuth callback settles → session cached for reuse. PROVEN to log in from the box IP.

**RELAY COMPLETE & PROVEN END-TO-END (2026-05-28).** Full integrated loop ran twice:
NS downloader → relay → headless PDF fetch → RESTlet → attached to expense lines.
**9 of 10 invoices attached** to real expense lines + File Cabinet files. Config record
populated. Bootstrap + retry/throttle/SIGTERM-handler all working (commits up to dda08d4).

The 1 failure: booking 09a80e8d (Imran flight on ER0345/251788, the manually-edited
report) → "Please enter value(s) for: Amount" on save. Data issue on that hand-edited ER,
not a relay bug — a line there is missing an amount.

**Operational gotchas learned (in relay/README + memory):**
- Bootstrap: CLEAR the relay@ inbox first so the single magic link is unambiguous; COPY
  (don't click) the link; box opens it in a 2nd tab; settle before caching.
- NetSuite web-services concurrency is low → relay throttles posts 2s apart + retries
  SSS_REQUEST_LIMIT_EXCEEDED with backoff.

**What's left (operational polish, not blocking):**
1. Flip `customdeploy_pc_navan_invoice_downloader` TESTING→SCHEDULED (daily ~8 AM) so the
   relay push runs automatically after the morning expense-report run.
2. Re-auth alert: fetchInvoicePdf throws on dead session → hook an email alert → re-run the
   documented ~2-min bootstrap. Session longevity still UNMEASURED — watch the first
   scheduled runs to learn how often re-auth is needed.
3. Fix ER0345's missing-amount line, then its invoice (09a80e8d) will attach on the next run.
4. Cleanup: delete orphan custrecord_navan_enabled + custrecord_navan_relay_hmac_key fields.

## Other open items (integration core — all live)

1. **Watch the first scheduled auto-run** (~6 AM) — confirm it fires clean unattended.
2. **Test the cancellation handler M/R** — untested path. Cancel a Navan booking, verify line removal.
3. **Lower log level** DEBUG→AUDIT on scheduled deployments after a few clean runs.
4. **Delete orphan fields** in NS UI: `custrecord_navan_enabled` AND
   `custrecord_navan_relay_hmac_key` (the old PASSWORD field, replaced by `_relay_secret`).

## Done this session (2026-05-27 / 05-28)

Backfill complete (Created 3, Appended 5, Failed 0). ER0345 dupe line fixed manually. Steve Hyham confirmed as legit employee -5 (founding employee — saved to memory). Both M/Rs flipped to SCHEDULED. Integration is functionally complete and autonomous; remaining work is the receipt relay + cancellation-path testing.

## Verified Working

- OAuth, bookings fetch + pagination, eligibility filtering, employee lookup (by email→r.id), project resolution (billToClient + TRIP_PROJECT_OVERRIDE), find-or-create, currency, ER creation, booking_map dedup ("already imported" correctly skips), integration_log audit.

## Known Issues

- **Receipt automation broken** (unchanged) — Navan URL is SPA HTML. `file_manager.js` + `ss_navan_invoice_downloader` deployed but inert (TESTING). Relay replaces this.
- **Orphan `custrecord_navan_enabled` field** in prod config record — code no longer references it; needs manual delete.
- **Diagnostic DEBUG logging** left in `client.js` (response code/len/preview) and `expense_builder.js` (currency resolution) — intentional for money-path debugging; trim later if noisy.
- **ER0345 duplication risk** at Lookback=30 — accepted, manual cleanup planned.

## Git (master, no remote)

```
50fc9c1 Employee lookup: use r.id instead of r.getValue('internalid')
acf03f0 Expense builder: fix currency requirements, simplify findOpenReport
74675b7 Fix M/R end-to-end: Accept-Encoding=identity, includename=F on integration_log
cb166dc Fix three bugs surfaced by first M/R test run against PowerCloudProd
1d283f0 SDF: add Script + Script Deployment objects for the 3 Navan scripts
4beecde SDF: fix schema mismatches, deploy to PowerCloudProd, drop redundant Enabled field
8919571 Save session: relay architecture decision + Navan SPA investigation
```
