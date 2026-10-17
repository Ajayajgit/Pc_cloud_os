# Monday Dashboard: Trigger Security Plan

Companion to [monday_dashboard_review_2026-08-22.md](monday_dashboard_review_2026-08-22.md). This is the ready-to-run plan for bringing the manual trigger back, secured. **Execute after the 2026-08-24 09:30 ET run verifies clean.**

## Status

- **2026-08-22: trigger server taken down.** The orphaned `nohup python3 server.py` (bash PID 1263714 → python 1263715, port 8090) was killed. Port 8090 is closed; nothing on the box restarts it (no `@reboot` cron, no rc.local, no systemd unit), so it stays down until this plan rebuilds it. The scheduled Monday run is unaffected (it is the `monday-dashboard.timer` systemd unit, which runs `dashboard.py` directly and never touched the trigger server). `server.py` and `config.json` are untouched on disk.
- **Interim:** on-demand runs are `ssh root@178.156.153.168 'systemctl start monday-dashboard.service'`. The web button returns once this plan runs.

## How it was running (for a faithful rebuild)

Started 2026-04-13, never under process management:
```
bash -c cd /root/monday-dashboard && nohup python3 server.py >> logs/server.log 2>&1 &
```
Flask dev server (werkzeug), `app.run(host="0.0.0.0", port=8090)`, auth = static `trigger_key` from `config.json` compared against `request.args.get("key")` (query string). Web UI at `http://178.156.153.168:8090/?key=...`. This is exactly what the plan replaces.

## Why it came down (recap)

The URL is genuinely useful (Mike + team, on-demand runs) and is being kept. But as it stood it was the system's main attack surface: Flask dev server open to the whole internet on an unfirewalled box, static key in the URL (so in cleartext in `server.log`), unauthenticated `/health` and `/status`, running next to the owner's trading bots. And the server's overlap check is a check-then-act race, so two clicks (or a click during the Monday run) collide on NetSuite concurrency and reproduce the exact 429 Chat errors the 8/18 cron fix just eliminated. Down now = a clean, uncontestable 8/24 verification; back after = same button, none of the exposure.

## The plan (after 8/24, one sitting, in order)

### 1. Overlap guard in `dashboard.py` — the piece that makes the button safe
Add an `fcntl.flock` on a lockfile at the top of `main()`. A second concurrent run (button-during-timer, two fast clicks, a timer catch-up) fails to acquire the lock, logs "another run in progress," and exits 0 without touching NetSuite. Closes all three double-run paths (the removed cron was only one). Test: start a run, start a second while it runs, confirm the second exits clean and only one hits NetSuite.

### 2. Tailscale — private reachability, no new password, no TLS
- Install Tailscale on the VPS (`curl -fsSL https://tailscale.com/install.sh | sh`; `tailscale up`), join the same tailnet as Mike's and team members' devices. Enable MagicDNS.
- The button URL becomes the tailnet name (e.g. `http://monday-box:8090/`) reachable only by devices on the tailnet. No public exposure, nothing to renew.
- Team access = add each person's device to the tailnet (or an ACL group). This is the access-control layer, replacing "anyone who knows the URL."

### 3. `server.py` under systemd (survives reboot, logs to journald)
Create `/etc/systemd/system/monday-trigger.service`:
```
[Unit]
Description=Monday Dashboard manual trigger
After=network-online.target
Wants=network-online.target
[Service]
WorkingDirectory=/root/monday-dashboard
ExecStart=/root/monday-dashboard/venv/bin/python server.py   # venv from step 5; use /usr/bin/python3 if venv not yet done
Restart=always
RestartSec=10
[Install]
WantedBy=multi-user.target
```
`systemctl daemon-reload && systemctl enable --now monday-trigger.service`. This ends the nohup-orphan problem (a reboot silently killing the button) and stops `server.log` growing (journald caps itself).

### 4. Bind to the tailnet + move the key off the query string
In `server.py`: change `app.run(host="0.0.0.0", ...)` to bind the Tailscale interface (or `127.0.0.1` if only accessed via the tailnet name through a local bind). Accept the key from a header or POST body instead of `?key=` (query strings land in logs), and use `hmac.compare_digest` for the compare. Rotate `trigger_key` in `config.json` (the old one is in cleartext logs) and scrub it from the dev machine's `session.md`. Serve via waitress (`waitress-serve`) rather than the werkzeug dev server — one dependency, one line.

### 5. Hygiene folded into the same pass (from the review)
- `pip freeze > requirements.lock`; create a venv; point both systemd units' `ExecStart` at `venv/bin/python`.
- `chmod 600 config.json`; `shred -u config.json.bak`.
- Keep `ufw` off if Tailscale is the boundary, or if enabled, allow only SSH + the tailnet; never expose 8090 publicly again.

### Verification after the rebuild
- Button loads over the tailnet from a team device; loads from a non-tailnet network fails (proves no public exposure).
- Trigger a run, then immediately trigger a second: the second exits clean, only one run hits NetSuite (proves the overlap guard).
- Reboot the box (or `systemctl restart`): the button comes back on its own (proves systemd management).
- `ss -tlnp | grep 8090` shows it bound to the tailnet/loopback, not `0.0.0.0`.

## Not in this plan (tracked in the review, later)
Retiring the public Apps Script endpoint via a Google service account (the durable fix for the extract-write exposure), the dead-man's-switch and `OnFailure=` alerting, and the git-repo professionalization. Those are independent of the trigger and sequenced in the review's step list.
