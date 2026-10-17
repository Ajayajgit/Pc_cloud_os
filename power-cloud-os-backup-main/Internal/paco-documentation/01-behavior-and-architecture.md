# Paco — behavior and architecture

Status date: September 14, 2026.

## 1. Purpose and boundaries

Google Meet artifacts can remain in a person's My Drive where Power Cloud OS cannot reliably discover them by watching its shared drive alone. The ingestion service links meeting evidence to Calendar occurrences, suggests a client destination, and files supported artifacts into existing Power Cloud OS client folders after organizer selection.

The implementation is a standalone Python service on the existing VPS. It is separate from the future Power Cloud OS application and can serve that application later. Paco is a reusable Chat front end; meeting filing is one capability, Monday notifications another.

The uploaded `MEETING_INGEST_PLAN.md` was the original build specification. Subsequent explicit product decisions changed the folder convention, confirmation flow, rollout scope, and onboarding. The original uploaded note should be retained with the OS design history; this handoff does not reproduce it or claim every proposed phase was implemented.

## 2. Current consultant experience

1. A scheduled scan reads meetings organized by the consultant and discovers supported files.
2. If an eligible meeting needs filing, Paco sends a private review card in that consultant's DM.
3. A recognized client appears as a button. With no match, the card says it could not confidently match a client and offers **Choose a client**.
4. The consultant clicks a client or replies with its name in that meeting's thread. The selection authorizes filing into that client's `source` folder.
5. Paco silently prepares and validates the plan, then executes it on a subsequent job pass.
6. After verified completion, Paco sends a short message with the meeting title, destination, and folder link.

Example completion:

> Filed PP Meeting in Preferred Plastics/source/.
> [destination folder link]

There is no “I am preparing…” message and no routine second confirmation. The old exact-preview/nonce path remains in code for legacy previews and controlled modes, but is not the active selection flow.

### Thread association

Buttons include the meeting ID. Typed client names must be replies in the meeting thread; an unthreaded name is not assigned to the oldest pending meeting. The event actor and verified private space determine who may act. Button parameters cannot override identity.

### Other actions

| Action | Behavior |
|---|---|
| Somewhere else | Used when a destination was suggested; asks for a client name in the thread |
| Choose a client | Used when there was no suggestion |
| Internal, no client | Keeps the meeting out of client folders |
| Private, skip | Keeps the meeting out of client folders |
| `list` | Shows indexed root client names |
| `status` | Shows pending meeting states |
| `prospect <name>` | Holds prospect material without creating a client folder |
| Legacy `cancel` / nonce confirmation | Supports pending legacy previews; not an undo for completed filing |

### Quiet-by-default policy

No supported recording, transcript, or notes means no consultant prompt. No missing-recording reminders are scheduled. A lower-level dry-run decision can classify a client-domain meeting with no artifacts as a completeness gap; that result is not sent to Chat. Group spaces are not used for private meeting decisions.

The user also mentioned attachment files as potential evidence. The current adapter recognizes supported Meet artifacts **through Calendar attachments**; it does not generically ingest PDFs, arbitrary Docs, spreadsheets, or all attachment MIME types. This is an implementation limit, not a reason to ask consultants about empty meetings.

## 3. Scheduling and rollout window

| Component | Actual mechanism |
|---|---|
| Meeting collection | `paco-scan.timer`, 15 minutes after the preceding service becomes inactive, with up to 20 seconds randomized delay |
| Chat queue processing | `paco-chat.timer`, 10-second idle interval; blocking API pulls and work add latency |
| Plan preparation and filing | `paco-preview.timer`, 10-second idle interval; historical service name retained |
| Monday dashboard generation | Existing NetSuite schedule and on-demand Suitelet |

These are polling jobs, not a live Calendar/Drive listener. “Every 15 minutes” is an operating approximation, not a maximum-latency guarantee: scan duration, scheduling accuracy, Google artifact availability, and API delays contribute. The Chat worker also checks the separate Monday queue before the interaction queue.

Mike retains the rolling 30-day Calendar window. Other current staff start at `2026-09-14T16:26:35.697947+00:00` (12:26:35 PM Eastern). Their lower bound is the later of that activation time and the rolling 30-day boundary. This deliberately avoids historical prompt floods. Calendar's time-window semantics govern events overlapping the boundary; the service does not perform a historical backfill.

## 4. Artifact discovery

Discovery begins with Calendar events from each allowed organizer's primary calendar. Recurring instances are expanded; cancelled events, explicit private tags, and events organized by someone else are excluded. Incomplete attendee lists or incomplete API results are treated as errors rather than successful complete reads.

For each event:

1. Read Drive metadata for Calendar attachment `fileId` values.
2. Ignore trashed files and unsupported artifact kinds.
3. Recognize videos as recordings. Recognize native Google Docs with transcript naming or “Notes by Gemini” naming as transcript/notes artifacts.
4. Use a linked artifact's exact occurrence stem—title, date, time, timezone—to find sibling artifacts in verified Meet storage.
5. Support observed `Meet Recordings` / `Legacy Meet Recordings` folders and meeting folders below `Google Meet`.
6. Never take every file in a recurring-series folder merely because its name matches.

There is no unrestricted My Drive crawler or filename-only global association. No Calendar anchor can leave discovery incomplete even when an artifact exists elsewhere. Files merely shared with an attendee are not automatically treated as that attendee's organized meeting.

Calendar time drives the generated meeting filename. Original artifact filenames are preserved. A manually constructed Calendar test can therefore have different dates in original and generated filenames; this does not, on its own, prove the wrong artifact was selected.

## 5. Client index and routing

### Index source

The index reads existing client folders and their `CONTEXT.md` files from the Power Cloud OS shared drive. A local mounted-folder builder is also available for offline validation. It includes root client records and one level of nested custom project records, without recursively reading source evidence.

Fields used:

```markdown
- NetSuite customer: Preferred Plastics
- Email domains: customer.example
- Meeting aliases: Preferred Plastics
```

Folder paths and leaf names also become names. Comma-separated values are supported. Placeholder values such as `none`, `n/a`, `tbd`, `unknown`, and template braces are ignored. Duplicate `CONTEXT.md` files are rejected. Hidden/system folders and standard evidence folders are excluded from client discovery.

Nested records remain visible in the index, but scheduled filing selects **root clients only**. Existing `source` and `working` folders must resolve unambiguously. The service does not create new clients, prospect folders, or arbitrary destination trees.

### Implemented ladder

| Stage | Decision |
|---|---|
| Explicit exclusions / rung 0 | Private tags, confirmed event exclusions, cancelled/empty/incomplete cases |
| Rung 1 | Exact attendee-domain matches against maintained client domains, excluding internal and known vendor domains |
| Rung 2 | Confirmed configured aliases and title matching; ordinary titles can contain a full client name without `|` |
| Unresolved | Private client selection; no classifier call |

Important details:

- Domain matches precede title matching. Multiple clients are held for human selection; originals are not assigned multiple parents.
- Vendor domains such as NetSuite, SPS Commerce, Celigo, and Anderson Frank indicate third-party participation, not a particular client.
- Internal-only calls can still be client work when a deterministic client title is present. Otherwise they are silently excluded by the current internal-only rule.
- Confirmed explicit event exclusions take precedence over later routing.
- `44 Pro Internal Test` now suggests `44 Pro`; the previous implementation only tested title conventions with `|`.
- `PP Meeting` is not expanded to Preferred Plastics by guessing initials. The user can select the client. That reply does **not** automatically teach a persistent alias.
- Ordinary-title matching uses word boundaries and conservative short-name rules. It does not mean all informal abbreviations are supported.
- The core accepts provenance-bearing title/series aliases, but the scheduled collector does not currently load a separate learned-alias store. `CONTEXT.md` aliases participate in name matching. Do not document automatic alias learning as live.

An index match alone never causes unattended filing. The scanner queues a review card; the user's explicit choice is the authorization.

## 6. Storage convention and generated files

```text
Power Cloud OS shared drive/
  Client/
    CONTEXT.md
    source/
      Original recording (same file ID and name)
      Original transcript or Gemini notes (same file ID and name)
      YYYY-MM-DD Meeting title [event hash] - notes [artifact hash].md
      YYYY-MM-DD Meeting title [event hash] - meeting.md
    working/
      meetings_log.md
```

There is no `source/meetings/` or per-meeting subfolder. Original files are moved, not routinely copied. Native notes/transcripts are exported into Markdown-compatible text artifacts; the meeting Markdown contains provenance/metadata and links to originals. It is **not an AI-written executive summary**. Recording-only meetings need not produce a transcript export.

The user's broader OS convention places executive summaries in project folders and feedback/reactions in private Chat. Generating those summaries or implementing their feedback workflow was not completed in this project.

Generated names include stable hashes to reduce same-title collisions. Generated Drive files carry the marker `powercloud-meeting-ingest-v1` plus role/plan properties. Existing originals retain their IDs and names, but moving them changes their storage and effective shared-drive access. The review card states that shared-drive members will gain access.

## 7. Filing safeguards and recovery model

Preparation freezes source IDs, original versions/parents, destination IDs, generated contents, and any approved log update into a hashed plan. The second user-facing preview was removed; these internal safeguards were retained.

Execution checks organizer approval, owner identity, unchanged plan digest, destination structure, original versions, existing names, and generated content. Scheduled operation requires the organizer to own personal originals. All-shared artifacts are preserved; mixed storage or owner/organizer mismatch is held outside routine filing. The earlier Teppermans owner-assisted manual filing was a separately approved operation, not a general delegation rule.

Drive v2 metadata/conditional updates supply ETags for guarded original moves and log updates. Stale conditional writes are rejected. A SQLite operation journal records pending/done moves and reserved generated-file IDs. Readback verifies results; uncertain responses are reconciled on retry instead of blindly creating another file.

This provides forward recovery, not a distributed transaction or automatic rollback. An error can occur after some operations completed. Always inspect the journal and actual Drive state before rebuilding or retrying a held plan.

Existing `working/meetings_log.md` is appended only when recognized as a Paco-generated log and its metadata/content match the planned baseline. Manual/unrecognized logs, duplicate names, changed content, or concurrent edits cause a hold. A lost-response retry recognizes the already-written final content to avoid duplicate entries.

## 8. Runtime state

| Store | Role |
|---|---|
| Offline `survey.sqlite3` | Dry-run decisions; explicitly marked dry-run; never promoted into a production filing ledger |
| `paco.db / paco_users` | Verified email → canonical Chat user ID → private space |
| `paco.db / paco_meetings` | Event payload, organizer, title, target, state, plan hash, approval provenance, thread |
| `paco.db / paco_events` | Durable responses, including silent `null` results, to deduplicate callbacks |
| `paco.db / paco_outbox` | Durable outbound messages with sent state and deterministic IDs |
| `paco.db / paco_notification_rejections` | Minimal Monday ingress rejection records |
| Per-meeting `filing-plan.json` and `journal.db` | Immutable plan and operation-level recovery evidence |
| `client-index.json` | Latest indexed destinations |

Principal state progression is `pending → preparing → approved → filing → filed`. Preparation and execution happen on separate job passes. `awaiting-confirmation` remains for the legacy preview path. Other outcomes include `needs-review`, `internal`, `private`, and `held-prospect`.

Organizer plus Calendar occurrence ID defines meeting identity. Cross-organizer lookups use both values; two staff accounts with the same event ID cannot cross-route. A process lock coordinates shared ledger work. Lock contention and bounded network pulls can delay processing; they are not evidence of a lost event.

## 9. Privacy and reuse

Paco checks allowed users, canonical actor identity, and the verified DM before acting. Installation events register silently. Central onboarding verifies each space is a single-human app DM and cross-checks the app's direct-message lookup. Conflicting existing identity/space bindings are rejected.

Meeting data and pending plans are private operational records on the VPS; they are not posted into the Monday room. After a user chooses a client, the approved files become available under that shared drive's permissions. Monday notifications use an isolated ingress topic and fixed destination map; notification text cannot become a meeting command.

Future Paco capabilities should preserve this separation: reusable identity and delivery infrastructure, capability-specific authorization and state, private feedback by default, and explicit shared destinations for approved team outputs.
