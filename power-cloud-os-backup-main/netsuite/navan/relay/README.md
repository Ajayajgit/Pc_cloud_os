# PC Navan Relay

Headless-browser relay that fetches Navan invoice PDFs (which are walled behind
Navan's SPA + interactive auth, unreachable via the public API) and posts them to
NetSuite, where the `rl_navan_invoice_attach` RESTlet attaches each to its expense
report line.

```
NetSuite (daily SS)                    GCE e2-micro (this app)
ss_navan_invoice_downloader  ──POST /navan/invoices──►  Express (X-PC-Secret)
  builds batch from booking_map         │ 202 accepted
                                        ▼
                              worker: Chromium login (cached session)
                                        │ per booking: fetch invoice PDF
                                        ▼
rl_navan_invoice_attach  ◄──POST {bookingUuid,pdfBase64} (TBA)──  netsuite.js
  file.create + attach + booking_map.invoice_file_id
```

## Status

- **NS side (Layers A + B): DONE and deployed to PowerCloudProd.**
- **Relay app (this dir): Phase-1 skeleton.** Server, auth, SQLite, NS TBA client,
  and worker orchestration are implemented. The Navan login selectors and the exact
  invoice-PDF capture flow in `src/navan.js` are **Phase-2 stubs** — they must be
  confirmed against a live logged-in session before the relay works end-to-end.

## Phase 1 — provision + deploy skeleton

### 1. GCE VM
- Create an `e2-micro`, Ubuntu 24.04 LTS, region `us-west1` (Always-Free eligible).
- Reserve a **static external IP** and attach it.
- Firewall: allow tcp/80 + tcp/443 inbound (for Caddy/Let's Encrypt). Nothing else.

### 2. DNS
- Add an A record: `relay.powerclouderp.com` → the VM's static IP.

### 3. Base software (on the VM)
```bash
sudo useradd --system --create-home --home-dir /opt/pc-navan-relay pcrelay
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs caddy
sudo -u pcrelay bash -c 'cd /opt/pc-navan-relay && git clone <repo> . && npm ci && npx playwright install --with-deps chromium'
sudo mkdir -p /var/lib/pc-navan-relay && sudo chown pcrelay:pcrelay /var/lib/pc-navan-relay
```

### 4. Config / secrets
- Copy `.env.example` → `/etc/pc-navan-relay/relay.env`, fill in. Prefer pulling
  values from **GCP Secret Manager** at boot over committing them.
- `PC_RELAY_SECRET`: generate a strong random string (`openssl rand -hex 32`).
  Put the SAME value in NetSuite: config record → **Relay Shared Secret**.

### 5. TLS + service
```bash
sudo cp Caddyfile /etc/caddy/Caddyfile && sudo systemctl reload caddy
sudo cp pc-navan-relay.service /etc/systemd/system/ && sudo systemctl daemon-reload
sudo systemctl enable --now pc-navan-relay
curl https://relay.powerclouderp.com/health   # {"ok":true,...}
```

## NetSuite TBA (relay → NS auth)

The relay calls the RESTlet with Token-Based Auth. In NetSuite:
1. **Enable** Token-Based Authentication (Setup → Company → Enable Features → SuiteCloud).
2. **Integration record** (Setup → Integration → Manage Integrations → New): name it
   "PC Navan Relay", enable Token-Based Auth, **uncheck** TBA: Authorization Flow.
   Save → record the **Consumer Key/Secret** (shown once).
3. **Access token** (Setup → Users/Roles → Access Tokens → New): pick the integration,
   a user with the right permissions, and a role that can edit Expense Reports + the
   custom records. Save → record the **Token ID/Secret** (shown once).
4. Put all four into `relay.env` (`NS_CONSUMER_KEY/SECRET`, `NS_TOKEN_ID/SECRET`).
5. **Lock down the RESTlet**: tighten `customscript_pc_navan_invoice_attach` deployment
   audience to that role, and add an IP address rule restricting it to the VM's static IP.

## Navan service account

- Provision a dedicated `relay@powerclouderp.com` Navan user (view/expense role).
- If MFA is enforced, capture the TOTP base32 secret → `NAVAN_TOTP_SECRET`.
- ToS: soft-cleared 2026-05-26 (Navan rep: no objection, no written approval).

## Config record (NetSuite)

On the Navan Integration Config singleton:
- **Relay Base URL**: `https://relay.powerclouderp.com`
- **Relay Shared Secret**: same value as `PC_RELAY_SECRET`
- **Invoice Folder ID**: a File Cabinet folder internal ID for storing PDFs (the
  RESTlet errors without it).

## Session bootstrap (required before first run, and to re-auth)

Navan logs in via Auth0 (email+password) and triggers **Descope new-device email
verification** when the login comes from the box's datacenter IP. The magic link is
**browser-bound** (must open in the browser that started the login) and **single-use**.
So the session is established with a one-time human-assisted bootstrap, then cached and
reused by the relay until it expires.

**Procedure (run `bootstrap-session.mjs` on the box):**
```bash
ssh <box> 'rm -f /tmp/magic_link.txt; \
  systemd-run --pipe --wait --collect --property User=pcrelay \
  --property EnvironmentFile=/etc/pc-navan-relay/relay.env \
  --property WorkingDirectory=/opt/pc-navan-relay --setenv=HOME=/opt/pc-navan-relay \
  /usr/bin/node /opt/pc-navan-relay/bootstrap-session.mjs'
```
1. The box logs in headless and parks at "check your inbox". Navan emails a magic link
   to the `relay@` group.
2. In your email, **right-click the newest verification link → Copy link address. DO NOT
   click it** (clicking opens it in the wrong browser → "not the same browser" error, and
   burns the single-use token).
3. Drop the copied URL on the box: `ssh <box> 'cat > /tmp/magic_link.txt' <<< '<URL>'`
   (must be the link from the *current* run — each run rebinds to a new browser).
4. The box opens it in a 2nd tab of the same browser, lets the OAuth callback settle,
   confirms it reaches the app home, and caches the session (`navan_session` table).
   `RESULT: SUCCESS` = done.

Notes:
- `/tmp/magic_link.txt` written over SSH is `root`-owned; the pcrelay process can read but
  not delete it. The bootstrap clears it at start as root-via-the-launching-command, so
  always `rm` it (as root) before a run to avoid opening a stale/dead link.
- Session longevity is unmeasured. When it expires, `fetchInvoicePdf` will get a non-PDF
  (login redirect) and throw — hook an alert to that and re-run this bootstrap.

## Invoice fetch mechanism (resolved 2026-05-28)

The PDF is NOT reachable by calling `/api/v1/invoicesinternal/download/{uuid}` directly
(401 — needs the SPA's JWT + same-origin headers). Instead, `fetchInvoicePdf` navigates the
authenticated page to `/itineraryfiles/bookings/{uuid}/invoice`; the SPA makes the
authenticated call and auto-triggers a PDF **download**, which Playwright captures.

## Operations

- Logs: `journalctl -u pc-navan-relay -f`
- Run history + per-booking status: SQLite at `DB_PATH` (`runs`, `run_items`).
- Re-runs are safe: NS only sends bookings whose `invoice_file_id` is still empty,
  so a failed/transient booking is retried on the next daily push.
