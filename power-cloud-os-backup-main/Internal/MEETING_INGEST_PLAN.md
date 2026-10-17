# Meeting Ingest: Design Note (roadmap A7)

Drafted 2026-09-11 by Claude Code from a working session with Mike. Status: **BUILT 2026-09-14, read as design history.** This note was the original spec. The implementation (Paco) departed from it in several places, and the built system is described in `paco-documentation/` (private runbook) and the root `PACO.md` (session-facing). Departures: flat `{Client}/source/` instead of `source/meetings/`; no transcript classifier (rung 3) and no alias learning from answers; the organizer's client selection in Chat is the approval, with no second confirmation; no missing-recording reminders; an explicit 27-account roster with a forward-only scan window rather than an hourly org-wide backfill. Nothing below is current operating instruction. This is the build spec for getting Google Meet recordings, transcripts, and Gemini notes out of personal Drives and into the client folders where the OS, and later the portal, can see them.

Sources: the 2026-09-11 session; roadmap item A7 and the summit evidence behind it (`AI Summit Discussion Transcripts/working/mining/day29_report.md`, 02:17:50 to 02:21:23, Taha's auto-filing script); `provisioning/netsuite_time_integration.md` and `provisioning/apps_script_client_extracts.gs` (the hours-extract pattern this reuses); `provisioning/monday_dashboard_security_plan.md` (the VPS posture this has to respect); Google documentation checked 2026-09-11 (section 10).

---

## 1. The problem

Power Cloud runs on Google Meet. Every recording, transcript, and Gemini notes document lands in the **meeting organizer's personal My Drive**, in a "Google Meet" folder with a sub-folder per meeting. Google shares them automatically with same-organization invitees and attaches the transcript to the Calendar event. Nobody else can see them, and nothing in the OS knows they exist. A consultant who was not on the call cannot find it; a Claude Code session opening the client folder has no idea a call happened; the exec-summary skill reports on meetings it cannot read.

The portal makes this worse, not better. Its Drive index pipeline (Portal Beta Plan section 3.3) indexes client folders only. Meetings outside those folders stay invisible to the portal exactly as they are invisible to the OS today. That is why this lands before the portal, not inside it.

Two facts shape the design:

- **Google changed the folder structure in July 2026.** The old "Meet Recordings" folder was renamed "Legacy Meet Recordings" and moved inside a new "Google Meet" folder; new files go into per-meeting sub-folders. Taha's summit-era Apps Script watched the old folder by name and has to be assumed broken until checked (section 9, step 0).
- **Attendees do not identify the client.** Three kinds of meeting matter: a call with the client, an internal meeting about a client, and a third-party meeting about a client (NetSuite in the sales cycle, a 3PL or SPS Commerce during a project). Only the first has the client in the room. Identification therefore has to be a ladder of signals, not a domain lookup.

## 2. What the job does, in one paragraph

A scheduled job on the existing Power Cloud VPS acts as each consultant through domain-wide delegation, reads the meetings they organized, decides which client or prospect each meeting belongs to by walking a four-rung ladder (attendee domains, title convention, transcript content, ask the organizer in Google Chat), moves the recording and documents into `{Client}/source/meetings/`, writes Markdown exports the OS can read beside them, and appends a line to a generated `working/meetings_log.md` in that client folder. Anything it cannot place confidently becomes a Chat card to the organizer with a guess and buttons. Confirmed answers teach the alias map so the same recurring meeting never asks twice.

## 3. Where it runs and what it reuses

| Piece | Choice | Why |
|---|---|---|
| Runtime | Python job on the Power Cloud VPS (the Monday dashboard box), as a systemd timer next to `monday-dashboard.timer` | Already exists, already scheduled, already notifies Google Chat, already holds the Monday config. One more timer, not a new machine. |
| Identity | One Google service account in a Power Cloud Cloud project, US region, with domain-wide delegation to Calendar (read-only) and Drive scopes | Reading other people's calendars and moving files they own is impossible any other way. The hours extract's plan already calls for a service account to retire the public Apps Script endpoint; this is the same account. |
| Client index | Built from every `CONTEXT.md` in the shared drive, the same way `apps_script_client_extracts.gs` builds its index from the `NetSuite customer:` lines | The mapping lives where the client folders are visible, in files humans already maintain. No second registry. |
| Confirm surface | A Google Chat app, installed for the organization by the admin, backed by a Pub/Sub topic the VPS pulls from | Chat is where the team lives. Pub/Sub means no public HTTPS endpoint on the VPS, which the security plan just closed. |
| Classifier | A hosted model call for the transcript-content rung, provider behind a one-function seam, Gemini via Vertex AI in the same US project as the default | The transcript is already Google's; classifying it inside Google adds no sub-processor. Anthropic or another provider is a config change if quality demands it. |
| Fallback transcription | The existing `transcribe` skill and `transcribe.py` | Covers recordings with no Meet transcript and recordings a client sends from Zoom or Teams. This job never re-transcribes what Meet already transcribed. |

Everything the job writes to the shared drive is either a moved original (ownership passes to the drive) or a **generated** file that is never hand-edited, following the `ENGAGEMENT_LOG.md` pattern.

## 4. The identification ladder

Applied in order; the first rung that produces a confident answer wins. Every filing records which rung decided it.

**Rung 0, exclusions.** Skip before anything else: meetings whose title carries the tag `| private` (or `[private]`); meetings with no recording, no transcript, and no notes (nothing to file, though see the completeness flag in section 7); meetings the job has already processed (event ID in the ledger).

**Rung 1, attendee domains.** Collect attendee email domains from the Calendar event. Match against the `Email domains` line of every client `CONTEXT.md`. One client match files to that client. Two or more client matches file to each (rare: a vendor review covering several accounts; the card in rung 4 lets the organizer trim). A match against the **vendor list** (section 6) with no client match marks the meeting `third-party` and falls through; vendors tell you the meeting is about some client, not which one. All-Power-Cloud attendee lists mark the meeting `internal` and fall through.

**Rung 2, title convention.** Parse the Calendar title against `{Client} | {topic}`. The left segment is matched against client folder names, the `NetSuite customer:` names, and the **alias map** (section 6), using the same normalize-then-exact, then conservative containment matching the hours extract uses (the GW lesson applies: an initialism never matches by containment; it needs an alias). `Internal | {topic}` files to `Internal/`. `{Name} | Sales | ...` with no folder match is a **prospect** (section 5). This rung is what makes internal and third-party meetings deterministic, so the title convention becomes a team calendar norm (section 9, step 4).

**Rung 3, transcript content.** Only for meetings still unresolved that have a transcript or notes document. The classifier receives: the meeting title, date, attendee domains (not names), the first and last 3,000 words of the transcript, the list of client names and aliases from the index, the vendor list, and the prospect names currently held in the queue. It returns one of: `client:{name}`, `prospect:{name}`, `internal-no-client`, `unsure`, with a confidence and a one-sentence reason quoting the evidence. Rules: a `client` or `prospect` answer at or above the confidence bar (start at 0.85; recalibrate from the first month of confirmations) files directly **only after the burn-in period**; during burn-in (first four weeks, or the first 50 classifications, whichever is later) every rung 3 answer goes to rung 4 as a pre-filled guess. `internal-no-client` for an internal-only meeting is a silent skip, never a card (section 8, privacy).

**Rung 4, ask the organizer.** A Chat card (section 6) with the best guess and buttons. The meeting waits in the **unfiled queue** until answered. A reminder goes out after three days; after fourteen unanswered days the meeting is parked as `unfiled` in the queue file and stops nagging. The answer is applied on the next run and, when it names a client or prospect, written to the alias map keyed on the normalized title and the recurring-event ID, so rung 2 catches the next occurrence.

## 5. Two cases with their own rule

**Prospects.** Sales-cycle meetings, typically with NetSuite, happen before a client folder exists, and folder creation is a decision under the `new-engagement` policy, not a side effect. The job never stamps a folder. Prospect meetings are **held** in the queue under the prospect's name, with their artifacts left in place in the organizer's Drive and recorded by file ID. When the folder is stamped, the `new-engagement` skill gains one step: check the queue for held meetings whose prospect name matches, and adopt them (move and export exactly as a live filing). This is also how the pre-sales record reaches the engagement, the gap roadmap item A5 has been chasing.

**Firm meetings.** All-hands, internal planning, the summit itself. These reach the end of the ladder as `internal-no-client`, or carry an `Internal |` title. They file to `Internal/meetings/` when titled that way, and are otherwise skipped silently. The OS never asks a consultant to classify an internal 1:1.

## 6. Data the job owns

**Client index** (rebuilt every run from the shared drive): for every folder with a `CONTEXT.md`, plus nested custom projects one level down: folder path, folder name, `NetSuite customer:` names, `Email domains`, and any `Meeting aliases` line. **One new optional CONTEXT.md line**, added to the template's Operating context block:

```
- Meeting aliases: {other names this client appears under in calendar titles, comma separated, e.g. `44Pro, Forty Four Pro`. `none` if the folder name is enough}
```

**Vendor list**: `Internal/provisioning/meeting_ingest/vendors.md`, hand-maintained, short. One domain per line with a label. Seed: `oracle.com` and `netsuite.com` (NetSuite), `spscommerce.com` (SPS Commerce), `celigo.com` (Celigo), `andersonfrank.com` (Anderson Frank), plus any 3PL or partner domain a client's CONTEXT.md names. A match here never files anything by itself.

**Alias map**: `Internal/provisioning/meeting_ingest/aliases.json` on the VPS, mirrored as a generated `aliases.md` beside `vendors.md` for humans to read. Keys: normalized title left-segment, and recurring-event series ID. Values: client folder path or prospect name, who confirmed, when. Written only by confirmed rung 4 answers and by rung 1 or 2 filings of recurring events.

**Ledger**: SQLite on the VPS. One row per Calendar event processed: event ID, organizer, start time, rung that decided, decision, artifacts moved (Drive file IDs before and after), export files written, card message ID if asked, timestamps. This is the idempotency guard and the audit trail. Backed up with the Monday dashboard's existing backup.

**Unfiled queue**: rows in the ledger with state `asked`, `reminded`, `held-prospect`, or `unfiled`, rendered every run as a generated `Internal/provisioning/meeting_ingest/QUEUE.md`: one line per meeting with date, organizer, title, attendee domains, guess, state. This is what a human reads to see what is stuck, and what the `new-engagement` adoption step reads.

## 6a. The Chat conversation (two-way, not a webhook)

Mike's requirement, 2026-09-11: the consultant has to be able to **reply** with a project name, and the bot has to **confirm which folder it found** before filing. Everything the team has used in Chat so far was an incoming webhook, which posts into a space and cannot hear anything back. This is a **Chat app**, which is a different thing: Google sends the app an interaction event for every message a user types to it in a DM or @mention, every button click, and every dialog submit, with the message text, the sender, the space, and the thread in the payload. The app answers either synchronously (return a message within 30 seconds) or asynchronously by posting through the Chat API into the same thread. Both directions are verified in section 10.

**The card.** Posted to the organizer's DM with the app when a meeting reaches rung 4:

> **Where does this meeting belong?**
> Teppermans | SPS onboarding call, Thu Sep 11, 10:00 to 10:45
> Attendees: teppermans.com (2), spscommerce.com (1), powerclouderp.com (2)
> Transcript and recording found. Guess: **Teppermans** (title match; attendee domain match).
> [File to Teppermans] [Somewhere else] [Internal, no client] [Private, skip]

**The reply grammar.** Any of these work, typed as a plain reply to the card's thread or as a fresh DM to the app:

- A client or project name: `Teppermans`, `MH Crane`, `Upward Projects / Bulk AP Invoice Approvals` (a nested custom project takes the `Client / Project` form the engagement log uses).
- A prospect: `prospect Acme Fasteners`.
- `internal`, `skip`, or `private`.
- `list` to get the client list, `status` to see the sender's own unfiled meetings, `undo` within 24 hours of a filing to move everything back.

The app resolves the name against the client index with the same normalize-then-containment matching as rung 2, plus the alias map. Three outcomes:

1. **One folder matches.** The app replies with the confirmation the requirement asks for, and only then files:
   > Found **Teppermans** at `Teppermans/`. I will move the recording, the transcript, and the Gemini notes to `Teppermans/source/meetings/2026-09-11 Teppermans | SPS onboarding call/` and log it. [Confirm] [Cancel]
   A click on Confirm, or a reply of `yes`, files it. The card then updates in place to `Filed to Teppermans/source/meetings/... (confirmed by Taha, Sep 11 11:02)` with a Drive link. Auto-confirm can be turned on per user once the match is trusted; the default is confirm.
2. **Several folders match.** `Shinesty` would hit `Shinesty RA` and `Shinesty Redo`. The app lists the candidates as numbered buttons and asks which. The answer is written to the alias map so it does not ask again.
3. **Nothing matches.** The app says so, lists the three closest names, and offers `prospect {name}` if this is a sale in progress. It never creates a folder.

**Mechanics.** Answers arrive on the Pub/Sub topic; the VPS job pulls the subscription every minute (the filing itself happens on the next run, so the confirmation text says "I will move" rather than "moved" and the card update comes when it is done). Each card carries the ledger row ID, so a reply in a card's thread is unambiguous; a fresh DM naming a client applies to the sender's oldest unanswered meeting and says which one it applied to. The Chat app's "Receive 1:1 messages" functionality has to be on in its configuration, and the org-wide install (section 9, step 3) is what gives every consultant a DM with it on day one.

## 7. What lands in the client folder

```
{Client}/
├── source/
│   └── meetings/
│       └── 2026-09-11 Teppermans | SPS onboarding call/
│           ├── Teppermans | SPS onboarding call (2026-09-11 at 10:02 GMT-4).mp4     moved original
│           ├── Teppermans | SPS onboarding call (2026-09-11) - Transcript              moved original (Google Doc)
│           ├── Teppermans | SPS onboarding call (2026-09-11) - Notes by Gemini         moved original (Google Doc), when present
│           ├── transcript.md                                                          generated export (text/markdown)
│           ├── notes.md                                                               generated export, when present
│           └── meeting.md                                                             generated header: event, attendees, rung, links
└── working/
    └── meetings_log.md                                                                generated, one line per meeting, newest first
```

- **Originals are moved, not copied.** Moving a My Drive file into a shared drive transfers ownership to the drive, which is the point: the recording stops living in one person's account, and it stops counting against that person's storage. The move is performed as the organizer (the owner) via delegation, into a folder on a shared drive the organizer is already a member of.
- **Exports are what the OS reads.** Drive for Desktop shows Google Docs as `.gdoc` stubs that Claude Code cannot open. `transcript.md` and `notes.md` are `files.export` to `text/markdown`, written by the service account. `meeting.md` carries the Calendar event ID, title, start and end, organizer, attendee domains (names only for Power Cloud staff), the rung and reason, and the Drive links, so a session or the exec-summary skill has provenance without opening Calendar.
- **`source/` stays client material.** Recordings and transcripts are the client's words, which is why they belong in `source/` per CLAUDE.md, and why the job never edits them after the move. The `transcribe` skill's rule that it writes to `working/transcripts/` is unchanged; that skill handles recordings without a Meet transcript.
- **`meetings_log.md`** is the OS's memory that the meeting exists. Format, one line per meeting: date, title, kind (`client`, `internal`, `third-party:{vendor}`), organizer, attendee domains, what landed (`recording, transcript, notes`), path. A **completeness flag** rides on this file: a client meeting (rung 1, client domain present) that produced no transcript and no recording gets a line reading `no transcript (recording not started)`, so the gap is visible at session start rather than discovered during an assessment. Internal and third-party meetings without artifacts are not flagged; there is nothing to say about them.

Downstream hooks, each a small later change and out of this build's scope: CLAUDE.md session start reads `working/meetings_log.md` alongside `source/`; `build_engagement_log.py` adds meeting count and last-meeting date; the exec-summary skill reads the log for its meeting-notes source; the portal's index pipeline picks up `source/meetings/` with no change at all.

## 8. Security and privacy posture

- **Delegation scope is the minimum that works.** `calendar.readonly` for events, `drive` for the move (moving a file the user owns cannot be done with a narrower Drive scope). No Gmail, no Admin SDK. The service account key lives on the VPS only, under the same handling as the Monday config, never on the shared drive (`DATA_CONNECTORS.md` rule 1 posture).
- **Delegation is a broad credential.** It is bounded by the scope list, by the roster (the job impersonates only people on `provisioning/roster.md`), and by the ledger (every action is attributable). It follows the security plan: the VPS is reachable over the tailnet only, the job runs under systemd, secrets are outside the repo.
- **Visibility changes on purpose.** Today a client call is visible to invitees. After filing it is visible to everyone with access to that client folder. That is the goal, and the `| private` tag is the escape hatch for the exceptions.
- **Internal meetings default to silence.** An internal-only meeting that matches no client by title or content is never surfaced anywhere, not even as a card. Personal 1:1s do not become an OS artifact. Only an internal meeting that names a client or prospect enters the pipeline.
- **The classifier sees the minimum.** Title, attendee domains, and transcript excerpts. Not attendee names, not the recording. With Gemini in the same Google project, the transcript does not leave the sub-processor that produced it. If the provider is ever switched, that becomes a consent-pack disclosure like the AssemblyAI sentence.
- **Consent for recording is unchanged.** Recording a client call already sits under the access and consent pack. The job files what was recorded; it does not decide what gets recorded. The meetings log makes the record of what exists auditable.
- **US only.** Cloud project, Pub/Sub topic, and Vertex region pinned to US, matching the portal decision.

## 9. Admin steps, build sequence, and gates

**Step 0, before anything: two checks.** (a) Ask Taha whether his auto-filing script has filed anything since the July folder change, and read it; the alias list and naming convention carry forward even if the code does not. (b) Confirm on one recent recorded meeting whether the recording appears as a Calendar event attachment or only the transcript does. The design reads attachments first and falls back to the per-meeting sub-folder under the organizer's "Google Meet" folder; the check decides how much the fallback matters.

**Admin steps (Mike, Workspace and Cloud admin):**

1. Cloud project for the job (or the existing dashboard project), US region; enable Calendar, Drive, Chat, Pub/Sub, and Vertex AI APIs; create the service account; download one key to the VPS.
2. Domain-wide delegation in the Workspace admin console for that service account's client ID, scopes `https://www.googleapis.com/auth/calendar.readonly` and `https://www.googleapis.com/auth/drive`.
3. Chat app configuration: name "Power Cloud Meetings", avatar, connection type Pub/Sub with the job's topic; install for the organization (or the consultant group) so a DM exists between the app and every user.
4. Announce the calendar norm: `{Client} | {topic}`, `{Prospect} | Sales | {topic}`, `Internal | {topic}`, `| private` to opt out. One line in `SESSION_NORMS.md` and a mention at the next team touchpoint. Meet names recordings after the title, so the convention pays off in Drive too.

**Build phases (Claude Code, on the VPS repo):**

| Phase | Ships | Exit gate |
|---|---|---|
| 1. Read-only survey | Delegated Calendar and Drive reads; client index from CONTEXT.md; rungs 0 to 2; ledger; `--dry-run` that prints what would file where and why; QUEUE.md rendering | Dry run over Mike's last 30 days of organized meetings; every decision hand-checked; zero writes |
| 2. Filing | Move originals as organizer; Markdown exports; `meeting.md`; `meetings_log.md`; prospect hold; `Internal/meetings/` | Three real meetings filed, one of each kind (client, internal-about-client, third-party), verified in Explorer and readable by a Claude Code session in the client folder |
| 3. Chat confirm loop | Chat app, cards, Pub/Sub pull, answer handling, alias map writes, reminders and parking | One card answered end to end by Mike; one by Taha; the recurring meeting it named files itself the following week |
| 4. Classifier | Rung 3 behind the provider seam; burn-in mode; confidence logging | Burn-in report after four weeks: agreement rate between guess and confirmation; confidence bar set from it |
| 5. Rollout | Timer hourly; roster-wide impersonation; failure alert to Mike in Chat (reusing the dashboard's notifier); `new-engagement` adoption step; the `Meeting aliases` CONTEXT.md line | Two weeks on the full roster with no unexplained skips; QUEUE.md reviewed once; then the downstream hooks in section 7 get scheduled as their own small items |

Order matters: Mike dogfoods phases 1 and 2 on his own calendar before anyone else is impersonated, and nothing files for the roster until the Chat loop exists to catch mistakes.

**Effort.** Roughly two to three build days with Claude Code doing the work, plus the admin steps, which are an hour if the Cloud project already exists. Calendar time is governed by Mike's hours, as with the portal.

## 10. Open questions and what was verified

Open:

- Recording as Calendar attachment or transcript only (step 0b).
- Whether Taha's script and alias list survive (step 0a).
- Delegation approval is Mike's call; the fallback without it is a per-user Apps Script each consultant installs, which works but re-creates the "one person silently unwired" failure the roster exists to prevent.
- Whether the existing dashboard Cloud project is the right home or the job gets its own.

Verified against Google documentation on 2026-09-11:

- Recordings and transcripts save to the organizer's Drive under "Google Meet" with per-meeting sub-folders; the July 2026 rename of "Meet Recordings" to "Legacy Meet Recordings"; same-organization participants get automatic access; the transcript is attached to the Calendar event and a recording started on time links to it. (Meet Help: Record a video meeting; Use transcripts in Google Meet.)
- The Meet REST API lists only conferences the caller organized, and its participant records carry no email addresses, which is why Calendar is the spine and Meet API is not used. (Meet API: Work with conferences; conferenceRecords.participants.)
- Google Docs export to `text/markdown` and `text/plain`. (Drive API export formats.)
- A file owner can move a My Drive file into a shared drive; permissions set on the file survive, inherited ones do not. (Drive API: shared drive versus My Drive differences.)
- A Chat app using app authentication can send cards with buttons and receives button clicks as `CARD_CLICKED` events over an HTTPS endpoint, Apps Script, or a Pub/Sub topic; it can only post into DMs it is a member of; an admin installing the app for the organization creates a DM between the app and every user. (Chat API: Create messages; Receive and respond to interactions; Find a direct message; Workspace Updates 2023-03 and 2025-09.)
- A Chat app receives a `MESSAGE` interaction event when a user messages it or @mentions it, carrying the message, the user who interacted, the space, and the thread; it can respond synchronously by returning a Message within 30 seconds or asynchronously via `spaces.messages.create`. This is the two-way capability an incoming webhook does not have. (Chat API: Receive and respond to interactions; Event reference.)

---

## Relationship to the rest of the OS

- **Roadmap:** this is item A7, pulled forward because the portal depends on it. It stays a methodology-layer item; nothing here is portal software.
- **Portal Beta Plan:** unchanged. The index pipeline indexes `source/meetings/` the moment files are there. D1 (shared project conversation) and the exec-summary button both get better inputs for free.
- **Skills touched later, each a small item:** `new-engagement` (adopt held prospect meetings), `customer-exec-summary` (read `meetings_log.md`), `transcribe` (unchanged, now explicitly the fallback), CLAUDE.md session start (read the log), `build_engagement_log.py` (meeting columns).
- **Templates touched:** `templates/client-record/CONTEXT.md` gains the `Meeting aliases` line; `SESSION_NORMS.md` gains the calendar title norm.
