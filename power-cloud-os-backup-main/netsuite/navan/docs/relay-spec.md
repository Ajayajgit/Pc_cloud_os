# PC Browser Relay — SPEC (draft)

**Status:** Draft, 2026-05-13
**Author:** Mike Flynn / Power Cloud
**Decision-level:** Architecture choice, not yet committed

## Problem

Navan's per-booking invoice URL (`https://app.navan.com/itineraryfiles/bookings/{uuid}/invoice`) does not return a PDF — it returns the SPA shell, which then fetches the binary from an internal `/api/...` endpoint behind session-cookie + JWT auth that is **not exposed to Navan API customers** (confirmed 2026-05-13: `tripactions.TripActionsToken` Bearer plus `CF_Authorization` cookie required; bare OAuth `bookings:read` token returns 401, public `/v1/invoices` returns 403). Manual stub-link attachments and headerless HTML attachments are unacceptable as compliance artifacts. We need a real binary PDF on every expense line.

## Scope

This SPEC covers a **general-purpose headless-browser relay** owned by Power Cloud, used initially for Navan invoice retrieval and designed for reuse by:
- Uber for Business receipt PDF fetches (same SPA-walled-binary pattern)
- Future SFTP egress for partners that require static-IP allowlisting (NS has no static outbound IP — see [[ns_egress_ip_constraint]])
- Any partner integration where NS REST + scheduled scripts can't satisfy auth or IP constraints

**Non-goals:**
- Replacing the existing Navan OAuth bookings poll (`/v1/bookings`) — that stays in NS
- Real-time / per-booking event-driven attachment (daily batch is fine)
- Multi-tenant — this is Power Cloud's relay, not a customer-facing service

## Architecture

```
                  ┌─────────────────────────────────────────────┐
                  │ NetSuite (sandbox + prod)                   │
                  │                                             │
   8:00 AM  ───►  │  ss_navan_invoice_downloader.js (Scheduled) │
                  │     1. SuiteQL: pending booking_map rows    │
                  │        where receipt_attached = F           │
                  │     2. POST JSON batch to relay             │
                  │     3. Receives 202 + run_id                │
                  │                                             │
                  │  rl_navan_invoice_attach.js (RESTlet)       │
                  │     POST { bookingUuid, pdfBase64 }         │
                  │     → file.create() → expmediaitem attach   │
                  └─────────────────────────────────────────────┘
                            │ HTTPS POST                ▲ HTTPS POST per PDF
                            ▼                           │
                  ┌─────────────────────────────────────────────┐
                  │ GCE e2-micro VM (static IP)                 │
                  │ relay.powerclouderp.com                     │
                  │                                             │
                  │  Node + Express + Playwright (Chromium)     │
                  │   POST /navan/invoices                      │
                  │     1. Validate HMAC + batch JSON           │
                  │     2. Enqueue run, return 202              │
                  │     3. Worker: login (cached session) →     │
                  │        for each UUID, fetch invoice page,   │
                  │        intercept PDF response, POST to      │
                  │        NS RESTlet                           │
                  │                                             │
                  │  Secrets: GCP Secret Manager                │
                  │   - navan service account creds             │
                  │   - NS TBA token + secret                   │
                  │   - HMAC shared secret                      │
                  └─────────────────────────────────────────────┘
```

### Flow per daily run
1. **8:00 AM PT** — `ss_navan_invoice_downloader.js` runs in NS. Queries `customrecord_navan_booking_map` for rows where `receipt_attached = F` AND `created_date < now() - 1h` (give Navan time to materialize the invoice).
2. Posts batch `{ run_id, bookings: [{ uuid, expenseReportId, lineIndex }] }` with HMAC signature to relay. Receives `202 { run_id }`.
3. Relay queues the run, worker picks it up. Loads cached Navan session (cookie jar from previous run). If expired, re-login via stored service-account creds.
4. For each booking: navigate Chromium to invoice URL, wait for PDF blob (`waitForResponse` filter on `application/pdf`), capture binary.
5. POST PDF to NS RESTlet: `{ bookingUuid, pdfBase64, filename }`. RESTlet creates File Cabinet record, attaches to expense line via `record.attach` + `expmediaitem` sublist, updates `booking_map.receipt_attached = T`.
6. On failure, relay logs the booking UUID + reason and continues. NS gets a final summary POST with successes/failures.

## Components

| Component | Tech | Notes |
|---|---|---|
| Host | GCP Compute Engine `e2-micro` | Free tier eligible, $7/mo otherwise. Static external IP free. us-west1. |
| OS | Ubuntu 24.04 LTS | Pinned base image, unattended-upgrades for security only |
| Runtime | Node 22 LTS + Playwright 1.5x | `npx playwright install --with-deps chromium` |
| Web | Express + Pino logging | Single HTTPS endpoint per partner (`/navan/invoices`, `/uber/receipts`, etc.) |
| Reverse proxy | Caddy | TLS via Let's Encrypt, autoreload |
| Secrets | GCP Secret Manager | Accessed via attached service-account, never on disk |
| Persistence | SQLite (file) | Run history, cookie jar cache, failure log. ~MB scale. |
| Process manager | systemd | Auto-restart, journal logs |
| Monitoring | GCP Cloud Logging agent | Forward stdout + structured Pino logs |
| Alerts | GCP log-based alert → email | Failure rate > 20% in a run, login failure, 5xx from NS |

## NS side

| Object | Purpose | New? |
|---|---|---|
| `ss_navan_invoice_downloader.js` | Daily 8AM batch trigger (push to relay) | Exists, needs rewrite |
| `rl_navan_invoice_attach.js` | RESTlet accepting `{ bookingUuid, pdfBase64 }` | **New** |
| `customrecord_navan_relay_run` | Run audit (run_id, started, finished, success_count, fail_count) | **New** |
| `custrecord_navan_relay_url` | Config record: relay base URL | **New field on existing config** |
| `custrecord_navan_relay_hmac_key` | HMAC shared secret (sensitive, encrypted) | **New field on existing config** |

The existing `powercloud_navan_file_manager.js` `downloadAndUploadInvoice()` gets deleted — its job moves to the relay.

## Auth & secrets

- **Service account at Navan:** Mike provisions a dedicated `relay@powerclouderp.com` user inside Navan with view-only or relevant minimum role. Confirm with Navan rep this is permitted under ToS before launch.
- **Session caching:** Relay logs in once per ~12h, persists cookies to SQLite. Fresh login only when session is rejected.
- **NS auth:** Token-based auth (TBA) issued for a dedicated `Power Cloud Relay` integration user in NS. Token + secret stored in GCP Secret Manager.
- **NS → relay auth:** HMAC-SHA256 over request body using shared secret. No JWT, no OAuth — single-purpose, trusted-pair.
- **Relay → NS auth:** Standard TBA OAuth 1.0a on the RESTlet calls.
- **IP allowlist:** NS RESTlet restricted via IP rules to the GCE static IP. Relay's inbound `/navan/invoices` allowlisted to NS data center CIDRs.

## Failure modes & handling

| Failure | Detection | Response |
|---|---|---|
| Navan session expired | Login redirect detected | Re-login, retry batch once |
| Navan login fails | Login flow throws | Mark whole run failed, alert |
| Invoice PDF not ready (TICKETED but no doc) | `waitForResponse` timeout (30s) | Log per booking, leave row unprocessed, retry next day |
| Relay unreachable from NS | Connection error | NS Scheduled Script logs + email alerts ops; retry next day's run picks up backlog |
| NS RESTlet 5xx during PDF post | HTTP error from relay → NS | Retry 3x with backoff per PDF, then mark booking failed |
| Navan SPA structure change | Playwright selector / waitForResponse breaks | Daily smoke test (see below) catches within 24h |

**Smoke test:** Relay runs a separate cron at 7 AM PT against one known-good test booking. Failure pages on-call.

## Rollout

1. **Phase 0** (this week) — confirm Navan ToS via support rep
2. **Phase 1** — provision GCE VM, deploy Caddy + Node skeleton, TLS up at `relay.powerclouderp.com`
3. **Phase 2** — implement Navan login flow + PDF capture against sandbox NS (test invoice from one real booking end-to-end)
4. **Phase 3** — production NS rollout (Scheduled Script + RESTlet)
5. **Phase 4** — monitoring, smoke test, runbook

## Open questions

- **Navan ToS:** Is a service-account-driven headless browser allowed? Need explicit answer from Navan integrations team before Phase 2 starts.
- **Service account 2FA:** If Navan enforces MFA on the relay account, we need either a TOTP shared secret (workable, automatable) or to negotiate SSO/SAML exemption.
- **Per-booking timing:** How long after `bookingStatus=TICKETED` is the invoice PDF available? Needs measurement during Phase 2 — drives the `created_date < now() - Xh` filter.
- **Uber on the same box:** Uber for Business uses a different SPA but same architectural pattern. Plan: add `/uber/receipts` endpoint to same relay process after Navan ships, share Chromium pool.
- **Cost ceiling:** GCE e2-micro + static IP + Secret Manager < $15/mo. NAT for outbound? Free for direct outbound from VM. Cloud Logging within free tier at our volume. No surprises expected.

## Risks

- **SPA brittleness** — Navan rewrites their invoice page → break. Mitigated by smoke test + alert. Real failure mode: a week of broken receipts before someone notices, if smoke test isn't trustworthy.
- **ToS / account lockout** — Navan flags the automation, suspends the service account. Mitigated by ToS conversation up front. Worst case: revert to manual attachment until binary API is granted.
- **Single host failure** — GCE VM goes down. Mitigated by: daily batch tolerates 1-day delay, GCE has 99.5% SLA. Not worth HA for this workload.
