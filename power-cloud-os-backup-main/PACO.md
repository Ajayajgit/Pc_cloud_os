# Paco

Paco is the Power Cloud OS Google Chat assistant: one reusable Chat identity the OS speaks through, with capabilities added behind it one at a time. Two are live as of 2026-09-14. **Meeting filing** moves Google Meet recordings, transcripts and Gemini notes out of the organizer's personal Drive into the client's `source/` after the organizer picks the client in Chat. **Monday dashboard delivery** makes Paco the sender of the existing NetSuite Monday dashboard. A third, **weekly board updates** (section 6b), was built and deployed on 2026-09-14 and posted live to its first client the same day. This file is what every session and every consultant needs to know about all three, plus the contract for adding another.

The private runbook (infrastructure identifiers, service names, configuration map, roster procedure, recovery steps) is `Internal/paco-documentation/`, access-restricted. Nothing in an engagement depends on reading it; this file carries everything the engagement path needs.

Built in September 2026 by a collaborator working from the design note `Internal/MEETING_INGEST_PLAN.md`. Several decisions changed between the note and the build. This file describes what was built, not what was planned.

## 1. What Paco is

- A Google Chat app in Power Cloud's Workspace with a private DM to each staff account on the roster (27 accounts at rollout). The DMs were created centrally; nobody has to find Paco or say hello first.
- Three polling jobs on the Power Cloud VPS, the same box that runs the Monday dashboard: one scans Calendar and Drive for meeting artifacts, one processes Chat interactions and the outbound message queue, one prepares and executes filing plans. Polling, not live listeners, so "within about 15 minutes" is the working expectation and not a guarantee.
- A durable ledger (SQLite on the VPS) of users, meetings, callback events and outbound messages. State lives there, never in the shared drive.
- Delivery infrastructure any capability can reuse: a verified identity and DM per user, a durable outbox with deterministic message IDs so a retry never double-posts, and a separate sealed inbound queue per capability.

Paco runs no AI classifier in the meeting-routing path, does not learn aliases from replies, and never posts meeting material into a group space.

## 2. Meeting filing: what a consultant sees

1. A consultant organizes a Meet call that produces a recording, a transcript or Gemini notes. Google leaves those in the organizer's My Drive, where the OS cannot see them.
2. Within roughly 15 minutes of the artifacts appearing, Paco sends the **organizer** a private card: the meeting title, the artifacts found, and either a **client button** (routing was confident) or **Choose a client** (it was not).
3. The organizer clicks the client, or replies with the client's name **in that meeting's thread**. That click or reply is the authorization. There is no second confirmation.
4. Paco moves the originals, writes the generated files (section 3), and posts a short completion message with the destination and a folder link.

Other things a consultant can do in the DM:

| Action | Effect |
|---|---|
| **Somewhere else** or **Choose a client** | Asks for a client name, typed as a reply in the meeting's thread |
| **Internal, no client** | Keeps the meeting out of client folders |
| **Private, skip** | Same, for personal or sensitive meetings |
| `list` | Shows the client names Paco knows |
| `status` | Shows that consultant's pending meetings |
| `prospect <name>` | Holds a sales-cycle meeting without creating a client folder |

**Silence is normal.** A meeting with no recording, transcript or notes produces no prompt and no reminder, by design. A meeting the consultant did not organize produces nothing for them. Meetings that started before a consultant's rollout date (2026-09-14 for everyone except Mike, who keeps a rolling 30-day window) are never picked up. If a prompt seems missing, the runbook has a checklist; the answer is never to nag people about empty meetings.

**Titles help but are not required.** A Calendar title containing the client's full folder name (`Teppermans | Weekly Status`, or plainly `Teppermans Weekly Status`) gets a confident suggestion. Attendees on the client's declared email domains do the same. `PP Meeting` for Preferred Plastics does not; the organizer picks the client from the card, and that pick does **not** teach Paco the abbreviation. To make it match next time, add the abbreviation to `Meeting aliases` in the client's CONTEXT.md (section 4).

## 3. Meeting filing: what lands in the folder

Flat, into the client's existing `source/` and `working/`. No `source/meetings/`, no per-meeting subfolder.

```
{Client}/
  source/
    {Original recording}                                moved: same Drive file ID and name
    {Original transcript or Gemini notes}               moved: same ID and name; shows as .gdoc in Drive for desktop
    YYYY-MM-DD {Title} [event hash] - notes [hash].md   exported text of the notes or transcript; the readable copy
    YYYY-MM-DD {Title} [event hash] - meeting.md        provenance: event, organizer, owner, start, destination, links
  working/
    meetings_log.md                                     one entry per filed meeting
```

How a session reads these:

- **The `- notes [hash].md` export is the readable transcript.** The moved `.gdoc` beside it is a Drive link, not a file, and will not open from disk. Mine the export. A meeting with a Recording and no notes export has no transcript; that is a `transcribe` skill job.
- **`- meeting.md` is provenance, not a summary.** Nobody wrote it; it records what was filed and from where. Never cite it as evidence of what was said.
- **Everything Paco writes carries `<!-- Generated by powercloud-meeting-ingest-v1 -->`.** Those files and `working/meetings_log.md` are generated and never hand-edited, the same rule as `ENGAGEMENT_LOG.md`. A hand-edited log stops Paco from appending to it; the next meeting for that client holds for review instead of filing.
- **Moved originals in `source/` are still the client's words** and stay read-only like any other `source/` file.
- **A Recording or `.gdoc` in `source/` with no matching `- meeting.md` was not filed by Paco.** Someone moved it by hand, or the earlier Apps Script did. Treat it as ordinary source material.
- Calendar time names the generated files; original filenames are preserved. The two dates can differ, and that alone does not mean the wrong artifact was filed.

## 4. What drives routing: three CONTEXT.md lines

Paco rebuilds its client index from every `CONTEXT.md` in the shared drive on every scan (root clients, plus custom projects one level down, though scheduled filing targets root clients only). It reads three lines:

| Line | Used for |
|---|---|
| `- NetSuite customer:` | Another name the client goes by in Calendar titles |
| `- Email domains:` | Attendee-domain matching: a meeting with someone `@teppermans.com` suggests Teppermans |
| `- Meeting aliases:` | Other names or abbreviations the client appears under in titles, comma separated |

The folder name itself is always a name. Placeholders (`{braces}`, `none`, `tbd`, `n/a`) are ignored. Internal (`powerclouderp.com`) and known vendor domains (NetSuite, SPS Commerce, Celigo, Anderson Frank) never identify a client on their own. Two clients matching at once hold for a human choice. Domain matches take precedence over title matches.

So the fix for "Paco never suggests this client" lives in the client's own CONTEXT.md: declare the domains and add the aliases. The new-engagement skill asks for both at setup and in gap-fill mode.

## 5. Safeguards worth knowing

- A confident match is a **suggestion**. Only the organizer's selection files anything.
- Before executing, Paco freezes a plan (source IDs and versions, destination, generated content) and re-checks all of it at execution. If an original changed in between, the meeting **holds** for review rather than filing.
- Paco moves files only when the organizer also owns them. Already-shared originals stay where they are; mixed-ownership cases hold. The one owner-assisted filing on record (Teppermans, 2026-08-20) was a separately approved manual operation, not a rule.
- Moves are conditional writes with readback; a lost response is reconciled on retry, never redone blindly. This is forward recovery, with no automatic undo. Held cases and undo requests are runbook work for Mike.
- Meeting content and pending plans stay in the organizer's private DM and on the VPS until a client is selected. After filing, the shared drive's own permissions apply, and the card says so.

## 6. Monday dashboard delivery

NetSuite still owns the Monday 9:30 AM Eastern dashboard: the scheduled script, the calculations, and the per-client hours extracts into each `working/time_entries_{date}.json`. What changed in September 2026 is the messenger. The dashboard text is published to a dedicated Paco queue and Paco posts it into the Monday Executive Call space. That queue is isolated from meeting interactions with a fixed destination map, so nothing in a dashboard payload can become a meeting command. Rolling back to the old webhook sender is a NetSuite configuration flag, not a redeploy. The same project also repaired the extract-receipt problem where NetSuite reported failures on extracts that had in fact been written. Details in `Internal/paco-documentation/03-monday-integration.md`.

## 6b. Weekly board updates (deployed 2026-09-14)

Every Monday at 10:00 Eastern, Paco posts into each mapped client's **internal** team space. Two messages, when there is material for both:

1. **The executive summary link.** Paco looks in the client's own folder for this week's summary: the internal draft `working/exec_summary_{date}.md` and, when a consultant has rendered it, the client-facing `deliverables/{Client}_Executive_Summary_{date}.docx` or `.pdf`. It links whichever exist, dated within the last seven days. Paco does not write the summary; it delivers the one the customer-exec-summary skill produced. If none is dated this week, the second message says so in one line and nothing else is posted about it.
2. **Tasks needing attention**, read from the Asana board: past-due items with owner and days over, what is due this week, active tasks untouched for two weeks, and the hygiene gaps `ASANA_CONVENTIONS.md` asks people to close (no owner, no due date), under a one-line header with open and closed counts and the age of the project status update. Closed work and stage breakdowns stay in the summary, not the chat. An optional Claude **health read** can be switched on in Paco's configuration; it is off by default and, when on, is labelled as inferred.

The content is candid and internal, which is why the audience rule below is not optional.

- **Two CONTEXT.md lines map a client.** `- Asana project:` (already in the Operating context block) and the new `- Project chat:` (the space as a room URL or `spaces/ID`). Both present, the client posts. Either missing, nothing happens and nobody is nagged. Two values for either line is a hold, not a guess. A nested custom project that shares both values with its parent posts once, not twice.
- **Internal team spaces only, checked every time.** Executive summaries are always human-reviewed before a client sees them (roadmap decision 1, permanent). An automated post cannot be, so it never goes to a space with a client in it, and the footer of every post says so. Immediately before each post Paco reads the space's membership and refuses unless every person in it is verified Power Cloud staff. A space it cannot fully read is treated as unsafe rather than empty. So adding a client to a space that has been posting simply stops the posts, which is why this is a live check and not a list somebody maintains. The one human gate is that Paco has to be a member of the space, which only a person can arrange.
- **Facts are read, nothing is inferred by default.** Everything in the attention message is computed from Asana and is [Verified] in the exec-summary sense. Thin data (no status update ever, most open tasks unowned or undated, an empty board) is named as thin in the post rather than read as trouble, the same rule the exec summary follows. If the optional health read is on and Claude is unreachable, the post goes out with the facts alone.
- **One post of each kind per client per week.** A re-run in the same week posts nothing new. Paco does not read replies in the space; fix the board and next Monday's post reflects it. A same-week correction is a rerun Mike triggers.
- **Nothing lands in the client folder.** The first version posts to Chat only. A generated `working/` snapshot the exec summary could read is a follow-up.
- **The executive summary is unchanged, and Paco is its courier, not its author.** The skill still produces it, a consultant still reviews it before anything reaches the client, and the Monday post links whatever the skill left in the folder. A summary that is not in `working/` by Monday morning is simply not linked; the attention message says so.

## 7. Reusing Paco for a new capability

Paco was built to carry more than meetings. A new capability takes the shape the meeting filer and Monday delivery already share:

1. **Reuse the identity and delivery layer, never fork it.** Send through the same outbox (deterministic IDs, durable sent state) and the same per-user verified DM bindings. Card actions go through the one delivery adapter; a direct Chat API patch that skips it produces buttons that fail.
2. **Own your authorization and state.** A capability gets its own ledger tables, its own allowlist if the audience differs, and its own inbound Pub/Sub topic with a fixed route map. The Monday queue cannot trigger filing; a third capability's queue must be sealed the same way.
3. **Private by default, shared by explicit destination.** Anything about one person's work goes to their DM. Team-visible output goes to a named space listed in configuration, never a space chosen by the payload.
4. **Silent registration, no greeting rituals.** Users are onboarded centrally by roster. A capability may not require anyone to message Paco first.
5. **Suggestions are not permission.** Whatever the capability computes, a write into a client folder or a client-facing system waits for a human's explicit choice, and completion is reported only after verified readback.
6. **The rest of the OS rules apply unchanged.** No client data in group spaces, credentials never on the shared drive, `Internal/` never read by the engagement path.

Capabilities discussed and not built: full executive-summary delivery with private feedback in Chat (the board update in section 6b is the first slice of it), adopting held `prospect` meetings when new-engagement stamps the folder, late-arriving artifact pickup, alias learning from replies, an undo command. They belong on the OS roadmap until they exist.

Where the pieces live: the Python service source and the NetSuite Monday scripts are in the Power Cloud NetSuite development area on Mike's machine (paths in `Internal/paco-documentation/02-deployment-and-operations.md`). The VPS installation, configuration map, routine checks and recovery procedures are in that same folder. Adding or removing a staff account is an explicit roster step there, not an automatic directory sync, so a new hire needs Mike before Paco will prompt them.

## 8. Known limits (as of 2026-09-14)

- Only Calendar-attached recordings and natively named transcript or Gemini notes documents are recognized. Arbitrary attachments (PDFs, spreadsheets, other Docs) are not ingested.
- No Calendar link, no discovery. A file that exists only in Drive with no event anchor is never found.
- A filed meeting is closed; a transcript that arrives afterwards is not appended.
- Root clients only. Custom project folders appear in the index but are not filing destinations.
- Board updates post only to internal team spaces on Paco's allowlist, read the `- Asana project:` line only (a `Task tracking:` line is not read), carry no thread, and write nothing into the client folder.
- No alias learning from replies, no undo, no transcript classifier, no proactive alerting beyond the runbook's manual checks.

The full register with evidence is `Internal/paco-documentation/04-validation-and-remaining-work.md`, section 5. Capability-level entries also sit in `CAPABILITIES.md` under Paco.
