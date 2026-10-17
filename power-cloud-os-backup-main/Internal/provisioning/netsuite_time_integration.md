# NetSuite time entries for the exec summary

> Rewritten 2026-08-18 after finding the existing pipeline. The earlier version of this
> file described provisioning a new integration record; that is unnecessary. One already
> exists and has been running weekly since at least June.

## The problem

The `customer-exec-summary` skill needs `timebill` rows from Power Cloud's own NetSuite
account. An MCP connection consumes a full user license and cannot be carried by an
Employee Center role (`CAPABILITIES.md`, verified twice), and consultants stay on
Employee Center. So consultants cannot query NetSuite, and the data has to reach them
as a file.

## What already exists

The **Monday dashboard**, on the Hetzner box `mike-trade-bot` (178.156.153.168) at
`/root/monday-dashboard/`. It runs every Monday at 09:30 America/New_York via
`monday-dashboard.timer`, and it already:

- authenticates to NetSuite with **token-based auth** (an integration record plus access
  token, in `config.json`), which is not a user seat and so sidesteps the licence problem
  entirely;
- pulls **8 weeks** of time entries (`pull_time_entries`), joined to job and employee, and
  filtered to `Actual Time`;
- pulls saved search 666 for project statuses, generates a narrative via the Claude API,
  posts a Google Sheet through an Apps Script web app, and notifies Google Chat;
- exposes an HTTP trigger (`server.py`, port 8090, `trigger_key`) for on-demand runs.

**Nothing needs provisioning in NetSuite.** No new role, no new integration record, no
Web Services Only licence question. That work was already done for this dashboard.

## What was added, 2026-08-18

`export_client_extracts()` in `dashboard.py`, called after the Sheet and Chat delivery
inside a `try/except` that logs and swallows any failure. It is additive by construction:
the existing Monday output cannot be affected by it.

It groups the pulled rows by customer and writes one JSON file per customer into
`export_dir` (default `exports/`), plus a `manifest.json`. The full 8-week window is
exported rather than a two-week slice, so a reader can show trend and choose its own
window.

Backups before the change: `dashboard.py.bak.20260818-205815`, `/root/crontab.bak.*`.

## Also fixed, 2026-08-18

The dashboard was running **twice, simultaneously, every Monday**: a root cron entry
(`30 13 * * 1`) and `monday-dashboard.timer` both fired at the same instant. The service
sets `TZ=America/New_York` so its log lines read 09:30 while cron's read 13:30 UTC, which
disguised the duplication as two different jobs. Every recent Monday showed two runs and
9 to 13 NetSuite `429` rate-limit events, almost certainly the two processes colliding on
SuiteTalk concurrency; the run spent minutes in `waiting 120s` backoffs as a result.

The cron line was removed and the systemd timer kept (it sets the timezone explicitly).
The unrelated `kalshi-weather-bot` cron entry was left alone.

## Delivery

**Resolved 2026-08-18.** The Apps Script already writes into a Shared drive: the Monday
Sheets land in `Power Cloud Owners Folder / Monday Exec Summaries`. So the mechanism
exists; it just pointed at the wrong drive. Two details make the rest work:

- That folder is **owners-restricted**, so nothing consultants need can live there.
  Extracts go to `Power Cloud OS / {Client}/working/`.
- The Monday files are `.gsheet` **pointers**, 177 bytes, because native Google Sheets
  live in Google rather than on disk. **JSON is not a native Google format**, so a `.json`
  written to Drive syncs as a real, readable file on every consultant's machine. That is
  what makes the file-handoff work with no credentials and no server access.

**What was written** (both pieces are additive and currently inert):

1. `Internal/provisioning/apps_script_client_extracts.gs` — paste into the *same* Apps
   Script project that builds the dashboard Sheet. It adds a `clientExtracts` action plus
   a four-line guard at the top of the existing `doPost()`; an unrecognised payload falls
   straight through to today's behaviour. It reads each client's `CONTEXT.md` for the
   `- NetSuite customer:` line, so **the mapping stays in CONTEXT.md** rather than being
   duplicated on the server, and it handles custom projects nested one level down. It
   **overwrites in place** rather than creating, which is the direct lesson from the
   ` (1)` duplicates in the Monday Sheets folder.
2. `post_client_extracts()` in `dashboard.py`, called from inside the existing guarded
   export step. Sends in chunks of 8 customers so one oversized request cannot fail the
   whole delivery.

**It is switched off.** `deliver_extracts` is absent from `config.json`, which reads as
false, so the next Monday run behaves exactly as today plus local exports to `exports/`.

### To turn it on

> **Status 2026-08-22: all six steps DONE.** `Extracts.gs` pasted into the Monday Morning Dashboard project with the `doPost()` guard in `Code.gs`; `POWER_CLOUD_OS_FOLDER_ID` set to the new shared drive root (`0AGVh-3eyJ6Z2Uk9PVA`); identity grant not needed (web app executes as Mike, a member of the new drive); `testClientExtracts()` ran green; web app redeployed (Version 4 after the folder-denylist patch), same deployment ID and URL; `deliver_extracts: true` set on the server (config backed up as `config.json.bak.20260822`).
>
> **Status 2026-08-24: VERIFIED LIVE.** First real run wrote 7 per-client `time_entries_2026-08-23.json` files (period end is the last completed Saturday): 44 Pro, American Barbell, Shinesty RA, ACFB, Upward Projects/Bulk AP, and Teppermans RA + Teppermans/Promotions Issues (both via the shared `N. Teppermans Limited` job). Content confirmed real (e.g. American Barbell 26 entries/44.25 hrs; N. Teppermans 120/243; ACFB 2/20). Shinesty Redo correctly excluded (`NetSuite customer: none`); MH Crane had no in-window hours. The run was single (no duplicate), 490s (vs ~815s when doubled), with one transient 429 that self-healed, confirming the 2026-08-18 duplicate-cron removal fixed the collision storms. **Next: repoint the exec-summary skill to read these per-client logs** (was blocked on this verification).

1. Paste the `.gs` file into the Apps Script project and add the guard block to `doPost()`.
2. Script Properties: `POWER_CLOUD_OS_FOLDER_ID` = the ID of the **Power Cloud OS shared drive root** (since the 2026-08-22 migration the OS is its own shared drive; the old `Power Cloud OS` folder ID is dead).
3. Grant the script's identity edit access to the **Power Cloud OS shared drive** (membership on the new drive; the old drive grant does not carry over).

> **Migration note (2026-08-22):** if this was configured before the shared-drive move, both items above are broken until re-done: re-point `POWER_CLOUD_OS_FOLDER_ID` to the new drive root ID and re-add the script identity as a member of the new drive, then verify the next Monday run writes into `{Client}/working/`.
4. Run `testClientExtracts()` from the editor. It writes one harmless file into whichever
   folder matches and logs what it did.
5. Redeploy the web app (a new deployment version, or the existing one if it tracks head).
6. Add `"deliver_extracts": true` to `config.json` on the server.

Untested end to end, because the Apps Script side cannot be reached from here. Step 4 is
the real verification.

## Customer-to-folder mapping

`customer_name` comes back as the **job** `entityid`, which is a descriptive job title
rather than a clean customer name. Real examples from the 3-16 Aug window:
`N. Teppermans Limited`, `Atlanta Community Food Bank - Rapid Assessment`,
`Harvest Hope Task Work` and `Harvest Hope Managed Services` (one client, two jobs).
Mapping happens where the client folders are visible (the OS side), not on the server. The `- NetSuite customer:` line in each `CONTEXT.md` is
the authoritative mapping; `fetch_time_entries.py --dry-run` reports which folders still
lack one.

## Coverage, measured 2026-08-18

A read-only pull over 3-16 Aug returned **452 entries across 41 customers**. Matched against
the workspace's 9 engagement records:

- **5 folders matched**: 44 Pro (`44 Pro Gloves`), American Barbell, Shinesty RA
  (`Shinesty - Rapid Assessment`), and two via their parent client, Teppermans/Promotions
  Issues (`N. Teppermans Limited`) and Upward Projects/Bulk AP Invoice Approvals.
- **4 folders did not**: `ACFB` (NetSuite calls it `Atlanta Community Food Bank - Rapid
  Assessment`, an acronym the matcher cannot infer), `Teppermans Rapid Assessment` (its
  sibling project absorbed the hours instead), `Shinesty Redo` (ambiguous against
  `Shinesty - Rapid Assessment`), and `MH Crane` (no entries in the window, which may
  simply mean no hours were logged).
- **36 NetSuite customers had no folder at all**, including the largest biller in the
  window at 152 hours.

**Decision (Mike, 2026-08-18): the OS covers engagements, not every billing relationship.**
The 36 are not a backlog to work through. The exec summary serves clients that have an
engagement record, and a customer without one gets told so rather than having a folder
stamped silently to make the request succeed.

The four unmatched folders still need a `- NetSuite customer:` line before their hours will
route. Mike deferred writing them pending his own review of the match report.

## The local dev folder (found 2026-08-22)

The dashboard's original development copy lives at `C:\Development\Projects\Netsuite Development\Monday Morning\` (its own CLAUDE.md and session.md; the deployed Code.gs is mirrored there as `apps_script_dashboard.js`). **Warning: that folder's `dashboard.py` is a staged 2026-05-11 rewrite that was never deployed.** It inverts the data pull (NetSuite SuiteScript SFTPs a feed file; Python stops calling NetSuite) to fix the 429 failures, but the NS-side SuiteScript push was never built, the VPS feed directory is empty, and the staged file predates the client-extract functions. Deploying it as-is would break the Monday run and silently kill the per-client extracts; the folder's CLAUDE.md carries the full landmine note and a snapshot of the live server file (`dashboard.server-20260822.py`). Since the 2026-08-18 duplicate-cron fix may have removed the 429 root cause, whether the inversion is still wanted is an open question for Mike after the 2026-08-24 run.

## The manual fallback

`.claude/scripts/fetch_time_entries.py` stays as the on-demand path for anyone holding
credentials who wants a refresh outside the Monday rhythm. It is a second implementation
against the same account, so if the two ever disagree, the server is the source of truth.

## Design review (2026-08-22)

A full four-lens review (correctness, security, architecture, operations) lives at [monday_dashboard_review_2026-08-22.md](monday_dashboard_review_2026-08-22.md), with a sequenced fix plan. Headline: keep the design, fix the hygiene, harden the unauthenticated Apps Script endpoint (which now writes into client folders), and delete the staged May-11 inversion once 8/24 confirms the duplicate-cron theory. One pre-Monday action recommended there: kill the orphaned public trigger server (`server.py`), since the Monday timer never uses it and it is the system's main attack surface. Everything else is sequenced after the 8/24 run. Non-invasive box cleanup (log archive/truncate, pycache, logrotate) was done 2026-08-22; the deploy folder is down from 10.3 MB to 1.8 MB.

## Still open

- Which delivery option above, and who does it.
- Whether `server.py` should get log rotation: `logs/server.log` was at 10 MB and growing,
  while `dashboard.py` already rotates its own logs.
- ~~Confirm on the next Monday run (24 Aug) that the 429s disappear now that the duplicate
  is gone.~~ **DONE 2026-08-24: confirmed.** Single run, 490s, one transient 429 (self-healed) vs
  the prior 10-13 collision storms. The duplicate-cron diagnosis holds, which condemns the staged
  May-11 SFTP inversion as unnecessary complexity (see the design review; delete it, keep in git history).
