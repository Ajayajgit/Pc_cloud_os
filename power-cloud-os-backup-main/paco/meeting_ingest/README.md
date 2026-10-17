# Google Meet ingestion — first safe milestone

## Justin pilot and ownership guard — 2026-09-11

Mike explicitly authorized a separate read-only pilot as `justin@powerclouderp.com`.
It uses `/etc/powercloud/meeting-ingest/justin-survey-config.json`; Mike's own pilot
configuration and confirmed exclusions remain unchanged. This does not authorize
impersonating any other consultant or running roster-wide filing.

The pilot found 98 organized events and 40 with discovered artifacts. Inspection
of 75 artifact references found 73 shared-drive files and two personal-Drive files
owned by Ron, despite Justin being the Calendar organizer. The ingestor now reads
Drive ownership and shared-drive IDs. It marks all-shared artifacts `already-shared`
and holds mixed storage, missing ownership, or owner/organizer mismatches as
`owner-review`. Neither state proposes move destinations. `already-shared` means
preserve the current location; it does not mean the files are in Power Cloud OS or
that their current client/project destination has been validated.

These guards follow explicit private/internal exclusions. Event-specific confirmed
exclusions can be supplied through `--exclusions` or `exclusions_path` in the survey
configuration; they require confirmation provenance and do not generalize by title.
The test suite now contains 35 tests. No original-file mutations are implemented.

---

## Setup update — 2026-09-11

The initial-build notes below describe the earlier offline milestone. Since then,
Mike authorized setup and read-only Google access. A dedicated service account
`power-cloud-meetings@powerprojects.iam.gserviceaccount.com` now has Calendar and
Drive read-only domain-wide delegation. Its private key was generated on the VPS
and remains under `/etc/powercloud/meeting-ingest/` with root-only permissions.
Only its public certificate was registered with Google; it expires 2026-12-10.
Client ID: `111586252817570907407`. No broader scopes or project roles were granted.

An isolated manual-run installation is at `/opt/powercloud-meeting-ingest/`, with
its own Python environment. The existing Monday dashboard has not been changed.
No timer, Chat sending, or original-file mutation has been enabled. Mike's identity
and Power Cloud OS shared drive were verified via successful read-only API calls.

Live evidence confirmed both `Google Meet` and `Meet Recordings` folders coexist,
and recordings as well as documents can be Calendar attachments. Discovery now
uses a Calendar-linked artifact's exact title/date/time stem to find siblings in
legacy or recurring folders. It never collects a whole recurring folder. Events
with no discovered artifacts stay out of the queue; unknown discovery is counted
separately and does not claim there was no recording. Full unanchored discovery is
still deferred. Tests now total 29, passing locally and on the VPS.

Google setup is no longer blocked. Review results before moving to filing; domain
fields remain unpopulated, and unclear destination decisions still need human input.

---

Built against MEETING_INGEST_PLAN.md (2026-09-11). This is an offline-validated,
read-only foundation, **not a completed phase-one exit gate or deployed service**.
No production writes were made. Only this new `meeting_ingest/` directory was added
to the existing local Monday Morning Python development tree. The local tree and
the VPS directory are not Git repositories. Existing dashboard code and configuration
were not changed, and nothing was copied onto the VPS or shared drive.

## What is implemented

- CONTEXT.md index builder for root clients and one-level nested custom projects,
  both from a mounted OS and through read-only Drive API calls. Reads folder names,
  NetSuite customer names, Email domains, and Meeting aliases; ignores placeholders
  and `none`. Uses the hours-extract exclusions and normalization, with a stricter
  short-name/initialism containment guard to preserve the GW lesson.
- Rungs 0–2: private exclusions, no-artifact/completeness outcomes, attendee domains,
  vendor/internal fallthrough, exact and conservative title matching, confirmed
  aliases, explicit Internal destinations, ambiguous-name queueing, and prospect holds.
- SQLite dry-run ledger, keyed by organizer and Calendar occurrence ID, with rung,
  decisions, source artifact IDs, timestamps, and reserved moved/export/card fields.
  Simulated reruns update one row, preserve first-seen time, and reevaluate late
  artifacts. They never count as actual filings. There is no production ledger writer.
- Generated local QUEUE.md for unresolved/prospect/multi-client decisions, with
  escaped Markdown cells. Never labels an unsent Chat card `asked`.
- Mandatory `--dry-run`. Default uses in-memory SQLite and stdout only. Optional
  explicit local output writes survey.sqlite3, decisions.json, QUEUE.md, client-index.json.
  No Drive mutation, exports, folder creation, Chat sends, or alias learning exists.
- GET-only Google adapter with delegated Calendar/Drive read-only scopes, single
  organizer allowlist, pagination, organized-event filtering, expanded recurring
  instances, and errors on partial reads. Attachment metadata is checked through
  Drive; siblings are discovered only inside a Calendar-anchored per-meeting Google
  Meet folder. Ambiguous/unanchored discovery remains unresolved.
- Seed vendor list and optional additional domains via `--vendors`; confirmed alias
  inputs via `--aliases`. No aliases are written from dry-run evidence.
- Standard-library tests and synthetic fixtures. Google dependencies are optional
  for offline operation and isolated in this directory's requirements.txt.

## Run locally

From the existing Monday Morning development directory:

```powershell
python -m unittest meeting_ingest.test_meeting_ingest -v
python -m meeting_ingest --dry-run --events meeting_ingest/fixtures/events.json --os-root meeting_ingest/fixtures/os --internal-domain firm.example
```

Add `--output-dir` pointing to a private local scratch/report directory to persist
the survey. Do not select a sync folder, shared drive, or production state directory.
Known Windows shared-drive and source-tree destinations are rejected; on Linux the
operator must ensure the chosen local directory is not a mounted production target.
Reports contain meeting metadata and should stay private during validation.

Offline events use Calendar's `id`, `summary`, `organizer.email`, `start`, `attendees`,
and optional `recurringEventId`, plus an `artifacts` array of file metadata and a
`discovery_complete` boolean. Missing `discovery_complete` means the fixture author
asserts discovery was complete. The live reader sets it explicitly. Use occurrence
IDs, never only recurring-series IDs. Exact attendee domains are used; subdomains
must be listed explicitly. Vendor domains cannot accidentally identify a client.

Confirmed alias JSON shape (paths must exist in the current index):

```json
{
  "titles": {
    "weeklyacme": {
      "client": "Acme",
      "confirmed_by": "organizer@example.com",
      "confirmed_at": "2026-09-11T15:00:00Z"
    }
  },
  "series": {}
}
```

Use `prospect` instead of `client` to hold a named prospect. Keys in `series` are
Calendar recurringEventId values. Alias inputs are trusted operator-maintained
configuration; Chat confirmation authentication is not implemented in this milestone.

## Observed environment and blockers

Read-only inspection on 2026-09-11 confirmed:

- Live VPS dashboard: `/root/monday-dashboard/`. Its production CLAUDE.md warns
  against replacing it with the different local staged dashboard architecture.
  This module is independent; do not deploy the whole parent directory.
- Mounted OS indexing succeeded: **29 records, 12 nested projects, zero populated
  Email domains fields**. Rung 1 has no real domain mapping yet. Populate those
  source fields through the normal OS maintenance process; no fields were changed.
- The roster records people by name, without Workspace email addresses. Mike's
  subject email and internal domain list must be confirmed before impersonation.
  Phase one requires a one-person allowlist; roster-wide operation is not shipped.
- No meeting-ingest configuration/key was found at the checked integration paths:
  `/root/monday-dashboard/meeting_ingest/google-config.json` and
  `/etc/powercloud/meeting-ingest-service-account.json`. Existing production secret
  configuration was not read or copied. This does not establish whether a suitable
  service account exists elsewhere in the Cloud project.
- Taha's auto-filing script and confirmed aliases were not available in the inspected
  provisioning directory. No message was sent to Taha. The spec's step 0 remains open.

## Next read-only gate

1. Obtain/review Taha's old script and aliases. Inspect one real recorded meeting to
   establish the attachment and new/legacy folder relationships (spec step 0).
2. Provide the approved service-account key on the VPS only, the shared-drive root ID,
   Mike's Workspace email, and confirmed internal domains. Configure DWD for
   `calendar.readonly` and **`drive.readonly` for this milestone**. This is deliberately
   narrower than the spec's later filing scope `drive`; DWD authorization must include
   the exact read-only scope requested, even if full Drive was already authorized.
3. On an isolated VPS development/staging location after the no-production-write
   restriction is cleared for staging, install this module's optional dependencies,
   create a private config based on google-config.example.json, and run:

   ```text
   python -m meeting_ingest --dry-run --google-config /private/path/google-config.json
   ```

   Omit output-dir for no persistent report writes. Set an explicit 30-day window
   ending at the survey time; the example dates are illustrative, not a moving window.
4. Resolve unanchored attachment discovery based on the real evidence. This milestone
   deliberately does **not** associate legacy/unattached recordings by filename alone.
   Full fallback discovery without a Calendar anchor remains to implement and validate.
5. Hand-check every decision in Mike's last 30 days. Mock/fixture tests do not meet
   this acceptance gate. Record errors and correct mapping before any real filing.

## Deliberate boundaries and remaining work

- Multi-client domain matches retain every candidate but require review: Drive
  originals cannot be moved to multiple parent folders. Agree on a canonical original
  plus links/shortcuts, or another explicit policy, before implementing this case.
- Private and silent internal meetings are neither printed nor persisted, consistent
  with the privacy section. Unresolved internal meetings are skipped while content
  classification is deferred; content-only client matches can therefore be missed.
- Completeness gaps are local proposed outcomes only; no meetings_log.md is written.
  A notes-only meeting is retained for filing; richer completeness reporting and
  artifact arrival grace periods belong with the filing implementation.
- Destination previews sanitize forbidden path characters and append a stable event
  hash to avoid same-day/same-title collisions. These are proposed paths, not folders.
- Dry-run ledgers are separate from future production state. Existing unmarked or
  non-dry-run databases are rejected. Never promote survey.sqlite3 to a filing ledger.
  Persisted queues accumulate observed unresolved rows across runs; use a fresh output
  directory for a bounded acceptance survey. Production lifecycle/reconciliation is
  not implemented.
- API errors abort the survey rather than silently hiding files. Backoff/retries,
  scheduled overlap control, backup integration and operational alerts remain.
- Phase 2: moves/exports, generated meeting headers/logs, reversible action journal,
  safe retries and partial-filing recovery, real filing idempotency, prospect adoption.
- Phase 3: two-way Chat/Pub/Sub, sender authorization, folder confirmation, reminders,
  parking, alias learning and undo.
- Phase 4: classifier/provider seam, evidence/confidence logging and burn-in gate.
- Phase 5: timer, roster-wide rollout and intended template/session-norm updates.
  Downstream OS hooks remain out of scope as specified.

## API references checked

- [Calendar events.list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list)
- [Calendar event fields](https://developers.google.com/workspace/calendar/api/v3/reference/events)
- [Drive files.list](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list)
- [Drive shared-drive support](https://developers.google.com/workspace/drive/api/guides/enable-shareddrives)

No Google library packages were installed globally, no timers enabled, and no live
Calendar/Drive credential was exercised during this build.

## Flat source pilot update — September 11, 2026

Automatic routing now selects root client folders only and proposes `{Client}/source/`, without meeting or nested project folders. The index still retains nested CONTEXT records for inspection.

Added `filing.py`, `google_write.py`, and the separate `file_meeting` CLI. Preview reads existing folders and originals, exports native notes/transcripts to Markdown, and freezes the exact content and original versions in a hashed plan. Organizer and original owner remain separate. Execution is disabled unless both CLI/config write gates and the exact plan digest are supplied. Owner must be explicitly allowlisted.

A separate SQLite journal records each original move and reserved generated-file ID. Retries reconcile uncertain responses before repeating operations. Changed originals, destination collisions, modified generated content, and unexpected folder changes stop processing. This is forward recovery, not automatic rollback.

Validated live read-only preview for the August 20 Teppermans warehouse-label meeting: two originals (recording and Gemini notes), two source Markdown files (notes export and metadata), and a proposed working/meetings_log.md. No Drive writes occurred. Both source and working already exist.

CURRENT BLOCKER: the live Drive v3 metadata response did not contain the ETag required by the conditional move transport. The adapter refuses mutation without it. Do not enable production writes until conditional update behavior has been resolved and validated, followed by explicit scope/first-filing approval. Current Workspace delegation remains calendar.readonly and drive.readonly.

Pilot limits: one approved meeting per execution journal; any existing meetings_log.md is held for explicit reconciliation. Multi-meeting log maintenance, classifier rungs, Chat confirmation delivery, scheduling, and production rollout remain unimplemented. Do not describe this as an operational unattended filer.
## Conditional move update

The missing-token blocker is resolved in code by using Drive v2 metadata and v2 PATCH together for original moves. Both pilot originals returned ETags. A read-only conditional GET with the current token returned 200; a deliberately invalid token returned 412 for both originals. This verifies conditional reads, not live writes. The move adapter sends If-Match and never retries a rejected mutation blindly.

50 tests pass locally and on the isolated VPS, including token propagation, refusal when no token is available, and 412 handling. No production Drive writes have occurred. Existing delegated scopes remain read-only.

Next required authorization: add full Drive scope to service account client ID 111586252817570907407, run disposable-file conditional-move/recovery validation, and only after successful validation apply the exact Teppermans preview. Full Drive delegation is broader than one folder; application allowlisting and the immutable plan constrain this pilot, not Google's OAuth scope. No unattended schedule is enabled.

The approved-preview candidate remains d10f0056c97c6e9ac8a900cd8c09548a0dd043e532ea4988968bd9a4542f56fe. It moves the recording and Gemini notes from Ron's personal Drive into Teppermans/source, preserves original IDs/names, creates a notes Markdown export and meeting metadata Markdown in source, and creates working/meetings_log.md. Preview must be revalidated immediately before filing; any material change requires a fresh review.

Still outside this milestone: existing/multi-meeting log reconciliation, higher routing rungs, Chat delivery, scheduling and general production rollout.

# First live filing completed

The user approved Drive write delegation, disposable validation, and the exact first-filing preview. Google Admin now authorizes calendar.readonly, drive.readonly, and drive for service-account client 111586252817570907407.

The August 20 Teppermans warehouse-label follow-up was filed successfully. Its recording and Gemini notes originals moved from Ron's personal Drive to Teppermans/source, preserving their IDs and names. The notes Markdown export and meeting metadata Markdown were created in source. The generated meetings_log.md was created in working. No meetings subfolder or per-meeting folder was created.

Organizer remains Justin; original owner and filing identity was Ron. The exact approved preview digest was revalidated before execution: d10f0056c97c6e9ac8a900cd8c09548a0dd043e532ea4988968bd9a4542f56fe.

All five journal operations are verified done. A second execution with mutations forbidden completed successfully, proving the finished retry required no writes. Generated file names, parent IDs, generator properties, and content checksums were checked.

Source: https://drive.google.com/drive/folders/1QQ7vwcIgIginhfkcAofOioFP274N7Kal
Working: https://drive.google.com/drive/folders/1WHtB3kkZjf0nlBcRhEyRBi-J2u7jOiRT

## Validation

50 local/VPS automated tests passed. Live disposable validation verified a real stale ETag is rejected with HTTP 412, successful conditional moves into the shared drive, recovery after simulated lost move and upload responses, and duplicate-free completed retries. All disposable test files and folders were moved to trash; no permanent deletion was performed. Invalid fabricated ETags returned Google HTTP 500, so the live stale-token test captures a real token and changes the disposable file before testing it. Newly created Docs may change version while initializing; the unchanged-version checks correctly stop such a filing.

## Deployment and remaining work

The isolated manual service remains at /opt/powercloud-meeting-ingest; the production Monday dashboard was not modified. The first-filing journal and immutable plan remain private on the VPS. Drive delegation is write-capable, but no unattended schedule or general filing configuration has been enabled. Survey commands still request read-only scopes.

Built: CONTEXT client index, root-only rung 0–2 routing, flat source destinations, SQLite survey ledger, queue rendering, dry-run mode, owner-aware pilot filing, Markdown exports and resumable execution journal.

Remaining: multi-meeting/existing-log reconciliation, higher classification rungs, Chat confirmation integration, client-domain maintenance, scheduled rollout and broader owner validation. These require further implementation before general unattended use. No additional user action is required for this completed pilot.

## Current Paco update (September 11)

The private collector, Chat worker and preview processor are now scheduled; the preview processor remains explicitly write-disabled. Monday notifications now use Paco through the active NetSuite producer. 94 tests pass on the VPS. Approved plans can append to Paco-generated meeting logs while preserving prior text, guarded by the approved version and conditional Drive update. Manual logs still hold for reconciliation. The eligible meeting queue is empty, so the complete real-meeting Chat filing flow remains unvalidated and automatic filing stays off. See the current PACO_BUILD_STATUS.md deliverable for the authoritative rollout status.

## Pre-meeting prep DMs (quick-260922-pcp, September 22)

`paco_prep.py` is a third sealed ingress, built like Monday notifications. A meetings-kb tenant publishes `{"version":1,"id":...,"tenant":<uuid>,"expires":<UTC Z>,"text":<=4000 chars}` to its own Pub/Sub topic; the payload carries no recipient. Paco routes only through the fixed config map `prep_routes: {tenant_uuid: owner_email}`, requires the email in `allowed_users` and an existing `paco_users` DM, and queues one outbox row (`client-prep-<sha256(tenant:id)[:40]>`) plus a `paco_prep_rows` audit row. Extra/missing keys, a non-canonical tenant, a past expiry, unrouted tenants and changed replays are rejected into `paco_prep_rejections` (message ID and error class only) and acknowledged.

Ingress runs only from `deploy/paco-prep.{service,timer}` behind `enable_prep_ingress`, so a prep pull or auth failure never blocks the worker. The worker delivers prep rows only when `enable_prep_delivery` is true and, immediately before sending, re-checks that the tenant still routes to the same email, the email is still allowlisted, the DM space still matches and the row has not expired; any mismatch quarantines the row (never redirects). A failed prep send is skipped so it cannot stall filing, Monday, board or card updates. Tests: `test_paco_prep.py`.
