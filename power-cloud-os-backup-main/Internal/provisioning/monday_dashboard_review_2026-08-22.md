# Monday Morning Dashboard: Design Review & Cleanup

Fresh look at the whole system, 2026-08-22, by Claude Code (four parallel reviewers: correctness, security, architecture, operations) against the live production code, the staged May-11 rewrite, and the trigger server. Companion to the operational doc of record, [netsuite_time_integration.md](netsuite_time_integration.md).

**The one rule this review runs under:** the Monday 2026-08-24 09:30 ET run verifies everything we changed this week (the duplicate-cron fix and the first-ever client-extract delivery). Nothing that changes runtime behavior gets touched before it runs. Every fix below is sequenced after, except one, which is a *removal* of risk.

> **2026-08-24 VERDICT: clean run, baseline confirmed.** Single run (no duplicate), 490s vs the ~815s doubled runs, one transient 429 that self-healed vs the prior 10-13 collision storms. First extract delivery wrote 7 correct per-client files. **This confirms the duplicate-cron theory and condemns the staged May-11 inversion** (delete once it is in git history; do not deploy). All post-Monday fixes below are now cleared to begin from a verified-good baseline. The trigger server was taken down 2026-08-22 and is rebuilt secured per [monday_dashboard_security_plan.md](monday_dashboard_security_plan.md).

---

## Headline verdict

The core design is right and should survive: one Python file, a weekly systemd timer, a live SuiteQL pull over token auth, rendering delegated to Google, a Chat notification. The problems are not architectural. They are operational hygiene (no git, an orphaned public dev server, plaintext secrets, silent failure modes), one genuine security exposure that went live this week (the unauthenticated Apps Script endpoint now writes into client folders), and one piece of speculative complexity (the May-11 inversion) built to fix a problem that was probably self-inflicted. **Keep the shape, fix the hygiene, harden the endpoint, delete the speculation.**

What the code already does well, and any rewrite must preserve: the delivery ordering (Sheet, then Chat, then extracts, with extracts additive and swallowed so the new thing can never break the old thing); atomic extract writes via temp-plus-rename with a manifest; the rate-limit discipline and the deterministic SS666-to-time-entry matching by project ID; and the logging that made the double-run diagnosis possible in the first place.

---

## The manual trigger: keep it, secure it (decision by Mike, 2026-08-22)

The manual-run URL is a wanted feature — Mike and team members use it for on-demand runs. So the earlier "kill the server" recommendation is **overruled**: keep the button, make it safe. The scheduled Monday run is independent either way (systemd timer runs `dashboard.py` directly; it never touches `server.py`), so none of this affects the 8/24 run.

Context that settles what the button's real risk is: the Chat error messages Mike has seen "at times" are the **429 rate-limit failures from the duplicate-cron double-run**, confirmed in the logs (every Monday through 8/17 shows paired 09:30-EDT / 13:30-UTC 429 retries: one instant, two writers). That cause was removed 8/18; 8/24 is the first clean single run and the proof. The button did not cause the historical errors, **but it can reproduce them**: the server's overlap check is a check-then-act race (HIGH-1/HIGH-2), so two fast clicks, or a click during the Monday run, collide on NetSuite concurrency and re-create the identical 429 failure.

Target posture (all after 8/24):
1. **`flock` guard in `dashboard.py` main** — a second overlapping run (button-during-timer, two clicks, timer catch-up) exits cleanly instead of colliding. This is the piece that protects the button by making overlaps harmless, and it closes all three double-run paths at once.
2. **Tailscale on the box, bind the server to the tailnet** — the URL keeps working for Mike and the team from anywhere, with no new password and no TLS to renew, but it is no longer exposed to the internet's scanners. Keep the shared key as defense-in-depth.
3. **Put `server.py` under systemd with `Restart=always`** — today it is a 4-month-old `nohup` orphan that the next reboot kills silently (button gone, no signal why). systemd also routes its log to journald, ending the unbounded `server.log`.
4. Move the key out of the query string (into a header/POST body so it stops landing in logs), rotate it, and `chmod 600 config.json`.

Pre-Monday: nothing required. Behavioral only: **do not press the trigger near 09:30 Monday** (until the `flock` guard lands, an overlap re-creates the 429s and would muddy the verification).

---

## After Monday: the correctness fixes that affect the numbers

These change what the dashboard reports, so they wait for a verified-clean baseline. Ranked.

- **Cross-process single-run guard (`flock` in `dashboard.py` main).** The 8/18 cron removal closed one of *three* double-run paths. Two remain: `server.py`'s single-flight check is a check-then-act race outside its own lock (two fast triggers both start), and nothing stops the timer and a manual run from overlapping. A single `fcntl.flock` on a lockfile at the top of `main()` closes all of it forever, on one VM, boring. (Killing the server this week removes the trigger-side paths in the interim.)
- **SS666 total-failure masquerades as "nobody filed a summary."** If the status query fails after retries, the code returns an empty list, and then every active project trips a P2 "no executive summary filed" alert, moods show Unknown, and the Claude narrative reports the false pile as fact. Leadership would chase PMs over an outage artifact. Fix: distinguish a query exception from genuinely-zero rows, suppress P2s in that case, and print one line ("SS666 statuses unavailable this run") in the Sheet and Chat.
- **Main Apps Script POST has no retry.** Every NetSuite call gets the retry wrapper; the single most valuable POST of the run, after ~13 minutes of expensive work, gets a bare `requests.post`. One transient Google-side blip discards the whole run. Route it through the existing retry helper.
- **All-zeros "success."** If the `'Actual Time'` display label ever changes or the time query returns empty, the pipeline ships a clean-looking dashboard of 0.0 hours and 0 projects. Eight weeks of genuinely zero hours is not a real state for this business, so treat empty time data as a failure alert, not a green Sheet.
- **Configurable-`weeks` trend bug (latent).** The 4-and-4 trend split is hardcoded four times while `weeks` is a config knob; set it to anything but 8 and every trend number is wrong. One helper (`half = weeks // 2`) called from all four sites. Latent today, a landmine for the next person who changes the config.
- **Hours logged against a customer instead of a job vanish silently** (needs one SuiteQL count to confirm it happens here). At minimum, count and log dropped rows each run so the gap is visible.

## After Monday: the correctness fixes in the new extract code (first run is 8/24, so watch the log, fix after)

- **Chunk-failure aborts all remaining chunks.** `post_client_extracts` promises "a partial failure still leaves most clients updated," but any error in one chunk propagates and skips the rest, and on later Mondays that leaves stale week-old JSONs that the exec-summary tool reads as current. Wrap each chunk's POST in its own try/except that logs and continues, and log "delivered X of Y."
- **Slug collisions overwrite one client's extract with another's.** Two similar NetSuite names can produce the same filename; the manifest then points both at one file. Key files by customer ID or detect and suffix collisions.
- **Watch on 8/24:** confirm "PC Internal Hours" lands in `unmatched` (it is exported like a customer; the denylist should catch it) and that the run's elapsed time is well under the doubled ~815s (a number near 815+ on a single run means the 429 theory is wrong and the inversion decision reopens).

---

## After Monday: the security hardening

The dominant exposure went live *this week*, so it leads. All of it is post-Monday because every fix touches the Apps Script or the send path, both on the critical path.

- **The Apps Script endpoint is unauthenticated, runs as the owner, and now writes into the shared drive.** It must stay `access: Anyone` for the server's POST to work, and it takes a bare JSON body with no secret. Anyone who learns the `/exec` URL (it is in `config.json`, in `.bak` files, in the dev machine's `session.md`, and rides every POST, so treat it as discoverable) can: write fabricated hours into a real client's folder that the exec-summary tool then trusts; overwrite the legitimate extract with garbage; enumerate the client roster via the `matched`/`unmatched` response; and burn the owner's Drive/Apps Script quota. Fixes, in order: a shared secret in the body checked against a Script Property (the 90% fix), then HMAC-over-body-plus-timestamp to defeat replay, size caps, `periodEnd` format validation, an exact-match folder allowlist, and returning counts instead of names.
- **Rotate `trigger_key` and scrub it from `session.md`** (moot if the server stays dead, but do it if it comes back).
- **Get secrets out of cleartext:** `chmod 600 config.json`, and rotate the NetSuite token and Anthropic key once, since they have sat in plaintext on an internet-exposed box for months. No vault needed.
- **The durable answer** (see architecture) retires the public endpoint entirely by writing extracts and building the Sheet from Python with a Google service account, which is the same primitive the client portal already requires.

---

## After Monday: the operational safety net

The system's single worst property: its most likely total-failure modes are **silent**. A broken config, an import crash from an `apt upgrade`, a dead timer, or a box that is simply down all fail with no alert, because the only failure notification lives inside `dashboard.py` and needs the run to get far enough to send it.

- **Dead-man's switch (closes every silent hole at once).** A free healthchecks.io check scheduled for Monday mornings, pinged by an `ExecStartPost=curl` on the service (fires only on a zero exit). No ping by the grace deadline, it emails or hits the Chat webhook. One line in the unit, one free account.
- **`OnFailure=` alert unit** for a fast, specific Chat message on any nonzero exit, covering the pre-logging crashes the in-app alert never sees.
- **Pin dependencies now, venv when convenient.** `pip freeze > requirements.lock` immediately after 8/24 (rebuild insurance, one command); then a venv so an `apt upgrade` on this shared box can't break Monday.
- **Put the trigger under systemd** (if it lives at all) with `Restart=always`, which also ends the unbounded `server.log` by logging to journald.
- **Weekly verify in one glance:** extend the Chat success message with the extract counts ("Extracts: N clients, M files"), so a healthy Monday is one message that says everything. Until then: `systemctl list-timers monday-dashboard.timer` (proves it fired once) plus a tail of `dashboard.log`.

---

## The architecture rethink (the "knowing everything now" answer)

- **Data pull: keep live SuiteQL, delete the inversion.** Two light queries once a week is trivial load; the 429s are fully explained by two identical pipelines firing at once (the 8/17 runs both *succeeded*, just slowly). The staged SFTP-feed rewrite answered an undiagnosed problem and is strictly worse now: it needs a NetSuite SuiteScript that was never built, an SFTP server on the VPS, and a staleness failure mode, and it splits every Monday failure across two systems. **Fate: if 8/24 is clean, delete `dashboard.staged-may11.py` once it lives in git history; if 429s persist, still don't deploy it first** — cheaper rungs are checking for other integrations sharing the concurrency pool at 09:30, moving the timer to 06:30 ET, and lengthening the backoff. The inversion is plan C at best, and if revived should use an authenticated HTTPS POST from the SuiteScript, not SFTP.
- **Delivery: move to Sheets API + Drive API with a service account.** Not for aesthetics, for security: it kills the public unauthenticated endpoint, puts all the code in git instead of hand-deployed Apps Script snapshots, and lets the extracts be written to the drive directly. Migrate the **extract writer first** (smallest, newest, highest-exposure), the 8-tab Sheet renderer later in a quiet week. This is the same service-account primitive the portal plan already provisions, so it is practice, not throwaway.
- **Extract leg: keep it in-process for now.** It reuses the same in-memory pull; a separate job would double the 429 surface or reintroduce a file-handoff staleness bug. The failure isolation already exists (runs last, swallowed). The portal eventually owns this leg; the least-work bridge is the direct-Drive-API write above.
- **Narrative: keep it** (a cent a week, degrades gracefully, it is the line humans actually read). **Delete the dead `fuzzy_match_names` and `ns_test_connectivity`** functions so no future editor wires them back in.
- **Structure, the minimal professionalization a solo owner will actually maintain:** a git repo seeded from the *box's* copy (it is the truth; the Windows dev copy has drifted), venv, pinned deps, a five-line `deploy.sh`, the Apps Script source committed alongside. Explicitly **not** worth it: a test suite beyond one dry-run smoke path, CI, Docker, type checking, splitting the 1,300-line file, a secrets manager, or a second VM.
- **Scheduling: better than it looks.** `Persistent=true` covers a powered-off Monday and `compute_date_range` normalizes any run day back to the right Monday. Add a same-week success stamp so every re-run path is idempotent (the fix for the historical " (1)" duplicate Sheets), and an `OnFailure=` alert. Do **not** add `Restart=` to the oneshot pipeline; that invents new ways to double-run.

### Target architecture, once migrated

Git repo + venv + pinned deps + deploy.sh on one VPS. `dashboard.py` pulls live SuiteQL over TBA, processes, writes the Haiku narrative, then builds the Sheet and writes the client extracts **directly via Google service account** (no Apps Script, no public endpoint). Chat webhook plus an `OnFailure=` unit and a dead-man's-switch ping for alerting. Trigger, if kept, is systemd + waitress behind Tailscale, retired when the portal owns triggering. Timer Monday 09:30 ET, `Persistent=true`, same-week success stamp making all re-runs idempotent. The staged inversion lives only in git history.

---

## Cleanup done today (non-invasive, pre-Monday)

Already executed, none of it touches runtime behavior:
- `server.log` (10 MB, ~99% internet-scanner noise) archived to a 1.4 MB gzip on the box and truncated in place (safe: the process appends by descriptor).
- `__pycache__/` removed (regenerates).
- `logrotate` drop-in installed for `server.log` and `cron.log` (weekly, keep 8, `copytruncate`; `dashboard.log` excluded since it self-rotates). Dry-run verified.
- Deploy folder went from 10.3 MB to 1.8 MB.

## Cleanup deferred to the post-Monday pass (with verdicts)

- **3x `dashboard.py.bak`**: archive into the git repo as dated commits, then delete from the box (they are currently the only version history).
- **`config.json.bak`**: `shred -u` it (plaintext credentials, zero recovery value; the live config is separately backed up). Deferred only because it pairs with the secrets rotation.
- **`server.log.archive-20260822.gz`**: delete after confirming nothing is wanted from it.
- **`/var/dashboard-feed/` empty tree**: keep until the 8/24 inversion decision, then delete (clean run) or activate (429s persist).
- **`exports/`** (created on the 8/24 run): add to the log-cleanup pass later, keep ~8 weeks.

---

## Sequenced plan

1. **This week:** nothing on the box (the trigger server stays up per Mike's decision; the button is wanted). Done today: the log/cache/logrotate cleanup.
2. **8/24, after 09:30:** read the run. Clean and fast → duplicate-cron theory confirmed, inversion condemned. 429s or ~815s+ elapsed → work the pacing ladder before anything else. Check the extract log line and the `unmatched` list.
3. **Same week:** git repo from the box's copy; reconcile the dev copy; delete the `.bak` files and dead functions; `pip freeze` the lockfile; add the Apps Script shared-secret check.
4. **Next:** venv + deploy.sh; systemd-or-Tailscale-or-retire decision for the trigger; rotate `trigger_key` and secrets; `chmod 600`.
5. **Next:** dead-man's switch + `OnFailure=` alert; same-week success stamp; extract counts in the Chat message.
6. **A quiet week:** service account; port the extract writer to direct Drive API; remove `clientExtracts` from Apps Script.
7. **Later:** port the Sheet renderer to Sheets API; delete the Apps Script web app.
8. **When the portal ships:** per-client hours delivery and the trigger move into it; the dashboard shrinks back to pull-process-render-notify.

Every step is independently shippable and reversible; nothing before step 7 changes what the Monday consumer sees.
