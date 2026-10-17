---
name: customer-exec-summary
description: Produce a Power Cloud customer executive summary for a reporting period, built from Asana, NetSuite time entries, Gmail, the customer's Drive folder, meeting notes, and the internal project chat space, with a cross-reference that catches meeting commitments missing from Asana. Use whenever the user asks for an "executive summary", "exec summary", "client status report", "weekly/biweekly customer update", or a project status summary for a named customer, or wants to know what was accomplished for a customer across those sources, even if they name only one or two. Also triggers when the user names a customer and a Drive folder and asks "what happened".
---

# Customer Executive Summary

A recurring status deliverable, run on demand from inside the client's folder. Its distinctive value is not the recap; it is the **cross-reference**, which catches commitments made in meetings that never became Asana tasks. That is consistently where work slips.

**Start with the [Preflight](#preflight-check-the-connectors-before-gathering-anything).** This document is built from five systems, and a run that discovers a missing connector at the end has wasted the consultant's time and produced a document shaped around a hole.

## The reporting window (two windows, not one)

**Time entries are not reliably submitted until the Monday after the week they cover.** Every other source is live to the minute. So the document runs on two windows, and says so:

- **Narrative window** (Asana, Gmail, Drive, meetings): through today. What happened, up to the moment of writing.
- **Hours window**: the **trailing two full weeks**, Monday through the most recent completed Sunday. This is not a formatting preference. It is the boundary of trustworthy time data, and it is why full weeks beat a rolling fourteen days: consecutive summaries stay comparable and nothing falls in a gap between them.

State both on the page. A reader who sees hours through the 16th next to meetings from the 20th must not conclude the hours are missing; they are simply not in yet.

**Never extend the hours window to today to make it match.** The current week is partially submitted by definition, so a total that includes it reads as a real number while being understated, which is worse than a number that stops where the data does.

## Two documents, not one

This is the rule that keeps candid analysis out of a client's inbox. The OS pattern applies here exactly as it does to an assessment:

- **`working/exec_summary_{YYYY-MM-DD}.md`**: the full internal picture, including the blunt health assessment, anything mined from internal-only meetings, and every gap the cross-reference found. Never sent.
- **`deliverables/{Client}_Executive_Summary_{YYYY-MM-DD}.docx`**: the client-facing document, drafted from the internal one after a human decides what belongs in it.

Draft the internal version first and review it with the consultant before rendering anything. Softening a document at send time relies on somebody catching it; separating them means the client-facing version is safe by construction.

## Evidence tiers apply

Everything here is read from a system, so tiering is cheap, and it is the discipline that catches an invented line. Tag each material claim in the internal draft **[Verified]** (read from Asana, NetSuite, Gmail or Drive), **[Reported]** (stated by someone, not confirmed in a system), **[Inferred]** (our read of the pattern). A health verdict is [Inferred] and should say so. "No defined next steps" is the specific hallucination this catches: absence in Asana is [Verified] absence in Asana, not [Verified] absence of next steps.

Tiers stay in `working/`. They never appear in the client-facing document (`../../WRITING_STANDARDS.md`).

## Inputs (read CONTEXT.md first, ask only for what is still missing)

The client's `CONTEXT.md` carries an `## Operating context` block where onboarding recorded
most of what follows. **Read it before asking anything.** When a field there is absent or
still in `{braces}`, ask the consultant once and **write the answer back into the block**, so
the next run inherits it instead of asking again. Drifting answers between runs is what that
block exists to stop.

- **Customer name** (required). NetSuite, Asana and folder names drift apart, so search on short fragments and match loosely. The client's `CONTEXT.md` carries the authoritative `NetSuite customer:` line. Note that NetSuite time entries are keyed by the **job**, not the customer, so the name is a descriptive job title rather than a clean customer name: real examples include `N. Teppermans Limited`, `Atlanta Community Food Bank - Rapid Assessment`, `Harvest Hope Task Work` and `Harvest Hope Managed Services`. One client routinely has several, and all of them belong to that client; a client's `CONTEXT.md` repeats the `NetSuite customer:` line once per job, so read every one of them. Job names also tend to encode the engagement type (`- Rapid Assessment`, `Managed Services`, `VAS`, `Support`, `Task Work`), which is a useful hint but never a substitute for the `NetSuite customer:` line.
- **Reporting period** (default as above).
- **Asana project**: take the URL from Operating context. Only when it is absent, find via `search_objects` (resource_type "project"). Empty results or "Not Authorized" usually means the connector is pointed at the wrong workspace; ask for the project URL or a re-authorization rather than reporting an empty project.
- **Email domains**: from Operating context. This drives the Gmail pass, and a missing domain returns nothing, which reads as "no correspondence" rather than as a gap. Derive from project members or contact emails where the block is empty, then write it back.
- **Where the material lives**: this OS folder *is* the client's Drive folder, so current documents, notes and recordings are here. A `Legacy folder:` line in Operating context points at pre-OS history under `Power Cloud Project Folders`; it is read-only and worth checking for anything predating the engagement.
- **Power Cloud team on the account** and the **reporting cadence and recipients**: both from Operating context. The team list is what makes the missing-timesheet check meaningful.

If a prompt was copied from a previous customer and still carries the old name in places, assume the new customer throughout, say so in one line, and proceed.

## When the customer has no client folder

**A customer gets a folder when we produce work product for them, and this document counts** (Mike, 2026-09-11, amending the 2026-08-18 "engagements only" decision). It is still not every billing relationship: NetSuite bills several times as many customers as the workspace holds records for, and a folder nobody ever writes into is noise.

So if someone asks for a summary for a customer with no folder, **stop and offer to onboard them**, rather than either refusing outright or stamping a folder silently. The request is itself the qualifying event, so the answer is usually yes; it just has to be a decision rather than a side effect. Run the `new-engagement` skill in **operational onboarding** mode: it takes the basics (NetSuite job name, Asana project, email domains, reporting cadence, who logs hours) and is the same interview this document would otherwise conduct piecemeal every run. Then come back here.

One thing onboarding cannot shortcut: **the hours arrive on the next Monday run.** A folder created today holds no `time_entries_*.json` until then. So a summary written the same day either runs on the other four sources and says plainly why hours are missing, or waits for Monday.

## Preflight: check the connectors before gathering anything

**Run the connector check first, before touching any source.** A partial run discovered at the
end is worse than a refusal at the start: the consultant has already waited, the document is
already drafted around a hole, and the missing source is usually the one that would have changed
a finding. Call `mcp__ccd_connectors__session_connectors_status`, map the result against the table
below, and **report the verdict before gathering anything.**

That tool is the desktop app's. If it is not present in this session, fall back to reading the
session's own tool list: a connector that is attached contributes its tools (an Asana connector
brings `get_project` / `get_tasks`, Gmail brings `search_threads`, Drive brings `search_files`).
Absent tools mean an absent connector, and the same table applies.

The preflight runs in two passes, because the second one needs facts from the client folder:

1. **Presence** (this table). No prerequisites. Do it before anything else.
2. **Scope** (below). Needs `CONTEXT.md`, so it runs right after you read it and before the
   Gathering steps.

| Source | Needs | If missing |
|---|---|---|
| NetSuite hours | Power Cloud's own NetSuite connector | **Degrade.** Fall back to `working/time_entries_{date}.json`. Say which path was used. |
| Asana | Asana connector | **Stop.** No fallback exists, and the cross-reference is the reason this document exists. |
| Gmail | Gmail connector | **Stop.** |
| Drive folder | Google Drive connector | **Stop.** |
| Meeting notes | Google Drive connector (plus the client folder on disk) | Covered by Drive. |
| Project chat | Google Chat connector | **Degrade**, and say so. Plenty of clients legitimately have no space. |

**Stop means stop.** Report every missing connector in one message, name what each one costs the
document, and wait. Do not gather four sources and mention the fifth at the end. The consultant
can reconnect in a minute; tell them to type `/mcp` in this session or open Settings > Connectors,
then say "connected" and you re-run the preflight and continue.

Two connectors degrade rather than block, and only these two:

- **NetSuite.** The extract is a genuine fallback. But **prefer the direct SuiteQL path whenever
  the connector is attached, even if a fresh extract exists**, because only SuiteQL carries `memo`
  and service item. The extract tells you how many hours; the memos tell you what they were spent
  on, which is where undocumented workstreams surface. Run both when you can and reconcile them;
  a mismatch is itself a finding.
- **Asana when the project is genuinely absent** rather than the connector being down. That is a
  data finding, not a tooling gap, and the run continues.
- **Google Chat.** The `Project chat` line is allowed to be `none`. But an absent connector and an
  absent space are different facts, and the internal draft must say which one it hit.

### Connected is not the same as scoped correctly

**Second pass, run immediately after reading `CONTEXT.md`.** This is the failure the connector
list cannot see, and it has already produced a false finding once (Bixbi, 2026-09-14: Gmail was
connected and healthy, but scoped to a mailbox that carries none of that client's correspondence).
**Check identity, not just presence:**

- **Gmail.** Whose mailbox is attached? If the delivery consultant on this account is not the
  connected user, the client threads are not reachable and the Gmail pass will return automated
  noise and nothing else. Confirm against `Power Cloud team` in the Operating context block. Where
  they differ, say **"not auditable from this session"** and name the mailbox. Never write "no
  substantive correspondence in the period" on the strength of a search from the wrong mailbox;
  that reads as a client disengaging when the truth is that we were looking in the wrong inbox.
- **NetSuite.** Confirm the connector points at **Power Cloud's own account**, not the client's.
  `getAccountInfo` returns the account id. A client connector cannot see `timebill` for our jobs.
- **Calendar, when used.** Same question as Gmail. A calendar that carries none of the delivery
  consultant's client meetings returns empty, which is absence of access, not absence of meetings.
- **Google Chat.** `search_conversations` only returns spaces the connected user is a member of, so
  a consultant who is not in the client's space gets an empty result that looks like no space. If
  `Project chat` names a space the search cannot see, that is an access gap, not an absent space.

Record the answers in the internal draft's source appendix, with an as-of date per source, so a
reader can tell a real absence from an unreachable one. Where a scope gap is structural for this
client (the delivery consultant is never the connected user), write it into the client's
`CONTEXT.md` open questions so the next run inherits it instead of rediscovering it.

## Gathering

### 1. NetSuite hours (read the access note first)

**Two paths, because most of the team cannot query NetSuite directly.** An MCP connection consumes a full user license and cannot be carried by an Employee Center role (`../../CAPABILITIES.md`), and consultants stay on Employee Center.

1. **If a NetSuite MCP connection to Power Cloud's own account is available in this session**, query directly:

```sql
SELECT tb.id, tb.trandate, tb.hours, tb.memo, tb.isbillable,
       BUILTIN.DF(tb.employee) AS employee_name,
       BUILTIN.DF(tb.customer) AS customer_name,
       BUILTIN.DF(tb.item) AS item_name
FROM timebill tb
WHERE tb.trandate >= TO_DATE('<period-start>','YYYY-MM-DD')
ORDER BY tb.trandate
```

Run it with `pageSize 1000` and filter to the customer locally; large results are saved to a file, so parse with python rather than re-running.

2. **Otherwise read the extract**: `working/time_entries_{date}.json`. These are produced by the **Monday dashboard** on the `mike-trade-bot` server, which already authenticates to NetSuite with a token-based integration (not a user seat) and pulls **eight weeks** of entries every Monday at 09:30 ET. `.claude/scripts/fetch_time_entries.py` is the manual fallback for a refresh outside that rhythm; where the two disagree, the server is the source of truth. See `Internal/provisioning/netsuite_time_integration.md`.

Check `pulled_at` and the period the extract covers. **If it does not cover the reporting period, stop and say so** rather than summarizing partial hours; ask for a refresh. If there is no extract at all, produce the summary from the other four sources and state plainly that hours are missing and why.

Because the extract carries eight weeks rather than two, prefer to **show the two-week figure against the trend** rather than in isolation: a customer at 12 hours means something different in a run of 40-hour weeks than in a run of 8-hour ones. Slice the reporting window from the same file.

**State which path was used, and the data's as-of date, in the internal draft every time.**

**When both paths are available, run both.** Only SuiteQL returns `memo` and `BUILTIN.DF(tb.item)`;
the extract carries neither. That is the difference between "Justin logged 9 hours" and knowing
which workstream they went to, and it is how an undocumented workstream surfaces at all. It is also
the only way to split MSP from billable by service item rather than guessing from `isbillable`.
Reconcile the two and say so; where they disagree, that is a finding, and the server is the source
of truth.

Then split the hours two ways: **MSP versus billable** (the `isbillable` flag plus the service item: a Managed Services item is MSP; Consulting, Development and Project Mgmt are billable T&M), and **by resource**, with a one-line focus drawn from the memos. A pure implementation customer may have no MSP hours at all; say so rather than rendering an empty split. **Read timesheet gaps against the submission rhythm, not against today.** An absent current week is expected and is not a finding; reporting it as one trains people to ignore the flag. What *is* a finding is a **completed week inside the hours window with no entries from someone who normally logs to this customer**, because that week's Monday has passed and the time should be in. Flag that by name before anyone invoices against the period. If the summary is being run on a Monday, the most recent week may still be arriving that day; say so rather than flagging it. **Delegate:** the MSP versus billable split, the per-resource totals, the window, and the skipped-row report come from `python "../.claude/scripts/summarize_time_entries.py"` over the saved JSON, never from a model doing arithmetic; the per-resource focus lines from the memos are `pc-data-condenser` (Haiku) work over the SuiteQL result you saved to `working/` (the extract JSON carries no memo). The gap reading and the health verdict are yours.

### 2. Asana

1. `search_objects` for the project, then `get_project` with `include_sections: true` for counts, sections, and the current status update.
2. `get_tasks` with `opt_fields: name,completed,completed_at,due_on,assignee.name,modified_at,memberships.section.name`, paginating until `next_page` is null.
3. Compute tasks completed inside the window, open tasks by section, past-due open tasks, and whether a status update was posted recently. Zero completions in the window alongside many past-due tasks is a health signal worth naming.

Asana data quality is the known weak point (`../../ASANA_CONVENTIONS.md`): a blank status reads as stalled and produces false at-risk health. Where the data is thin, say the data is thin rather than reporting the artifact of it.

**Paco delivers this document every Monday at 10:00 Eastern** into the client's internal team space, once the client's CONTEXT.md carries both an `Asana project:` and a `Project chat:` line (`../../PACO.md` section 6b). It links the newest `working/exec_summary_{date}.md` dated within the week, plus the rendered client-facing file when one exists, and posts the Asana tasks needing attention (past due, due this week, untouched active work, no owner or due date) as a separate message. So the internal draft has to be in `working/` under that exact name before Monday morning for the team to see it; a run that finishes on Friday is what Monday links. Paco computes the attention list from Asana alone and never writes the summary itself.

### 3. Gmail

`search_threads` on the customer name for the period, then a second pass on `from:` or `to:` the domain. Capture contract and renewal threads, past-due invoices with numbers and amounts, meeting invitations establishing a new cadence, and substantive client commitments. Ignore automated noise from vendors and list mail, but **read the alerts sent to the
`{client}@powerclouderp.com` alias before dismissing them.** Recurring NetSuite script-error mail,
password-expiry warnings on the login behind our own access, and upgrade notices are real findings
that no other source carries, and they are often the highest-priority item in the document.
Sort by what repeats.

**"No substantive correspondence" is only a finding if the mailbox could have seen it.** If the
scope check found that the delivery consultant is not the connected Gmail user, the correct line is
**"not auditable from this session,"** naming the mailbox. Reporting silence from the wrong inbox
invents a disengaged client.

### 4. Drive folder

List the folder, identify what was created or modified in the period, and note strategic documents worth citing even if slightly older (go-forward plans, agreements out for signature, issue-resolution docs). Skim snippets before reading anything in full.

### 5. Meeting notes

Start in the folder. `working/meetings_log.md`, when present, lists every Meet call Paco has filed for this customer (`../../PACO.md`); the matching `YYYY-MM-DD {title} [hash] - notes [hash].md` export in `source/` is the readable notes or transcript, and the `- meeting.md` beside it is provenance only. Read the exports dated inside the period. Then search Drive for documents mentioning the customer, modified in the period, to catch notes that were never filed (a meeting someone else organized, a Zoom or Teams recording the client sent, an old Recordings subfolder). Read the quick-notes section of each. Capture decisions, blockers, and per-person action items. A meeting in the log with a Recording and no notes export has no transcript; say so rather than summarizing it from the title.

**Internal-only meetings are fair game for the internal draft and must never reach the client-facing document.** The two-document split above is what enforces this.

### 6. Project chat (internal, and the fastest source there is)

`CONTEXT.md` already carries the space. **`- Project chat:` is an existing field**, captured by the
`new-engagement` interview and used by Paco for the weekly Asana board post (`../../PACO.md`
section 6b). Do not invent a second field and do not ask for the space if the line is set.

Read it with `list_messages` on that space over the narrative window, and back to the date of the
previous `working/exec_summary_*.md` where one exists, so nothing falls in the gap between
summaries. `search_messages` scoped to the space is the fallback when you are chasing a keyword
rather than reading the period.

**Why this source earns its place:** it is where the team says the thing it has not written down
anywhere else yet. Decisions taken in a minute, access requests, a consultant relaying what a
client contact told them, the reason a number looks wrong. On the Bixbi run of 2026-09-14 a single
chat message answered two questions that Asana, NetSuite, Gmail, Drive and meeting notes had all
failed to answer across two complete runs: why time had stopped being billable, and whether the
client was rolling off contract. Read it before concluding that something is unknowable.

Capture: decisions and their date, commitments with an owner, access and environment changes,
anything said about commercial status, and deliverables posted into the space (consultants often
drop the rendered PDF there, which dates the real send).

**If `Project chat` is unset or in `{braces}`, do not just skip it.** Run
`search_conversations` on the client name first; a space usually exists and nobody filled the line
in. **Propose what you found and ask before writing it back**, because of the rule below. Never
write the line silently.

#### Everything here is internal, and that is a hard rule

`Project chat` is **defined as an internal team space** and the template says so: the space must
not be one the client sits in. So chat is internal-draft material in exactly the way an
internal-only meeting is. It can *inform* the client-facing document, by surfacing a commitment
that then becomes an open item or by correcting a fact, but **its content, wording and register
never cross over**. Do not quote it, do not attribute to it, and do not carry its candour into
client-facing prose. The two-document split is what enforces this; chat is the source that tests it
hardest, because it is frank about money, about the client, and about us.

**Verify the space is actually internal rather than trusting the label.** Check the sender domains
on the messages you read. If any sender is outside `powerclouderp.com`, the client or a partner is
in that space: stop treating it as internal, treat it as client-facing correspondence like Gmail,
and flag that the `Project chat` line points at the wrong kind of space, since Paco posts a candid,
never-human-reviewed board update there every Monday.

### 7. Cross-reference (the step that earns the document)

Compare every commitment against the Asana open-task list and list the ones **not visible in Asana**, with owner and the date and source they came from. Do this even when it is unflattering to us; that is the point of it. **Delegate nothing here that carries judgment:** deciding what counts as a commitment is yours. Once the commitment list and the open-task list are both written down, the matching itself may go to `pc-data-condenser` as a two-column table with the matched task named or `none`, and you confirm every `none`.

Draw commitments from **all** of it, not just meetings: meeting action items, **project chat**, Asana task comments (a consultant asking the client for something in a comment is a commitment with a dependency), the build and execution logs in the client folder, and offers made in email. Chat and task comments are the two that most often carry a promise nobody turned into a task, because both feel like conversation rather than tracking.

Say what the list is checked against. "Ten items, seven with no Asana task" is a finding; "several items may not be tracked" is not.

## The internal draft

Write `working/exec_summary_{YYYY-MM-DD}.md` with the structure below, tiered throughout, then review it with the consultant. Sections:

1. **Executive overview**: wins, headline numbers, what needs attention.
2. **Asana project health**: counts and percentage complete, status-update recency, tasks completed in the period, open items with past-due flagged, and a candid health assessment with a recommendation. Where open items run past roughly twenty, summarize by workstream theme rather than listing all of them.
3. **Hours logged**: MSP versus billable with percentages, then per-resource with a focus line. State the hours window explicitly and note that it differs from the narrative window and why. Note the source path, the as-of date, and any completed-week gap.
4. **Commercial and correspondence**: renewals, past-due invoices with numbers and amounts, cadence changes, documents delivered. **Project chat often carries the commercial truth before any system does** (a consultant relaying what a client contact told them about a renewal or a roll-off). Tier it [Reported] and put it here rather than burying it.
5. **Meetings, chat and action items**, then the **cross-reference** subsection of commitments not visible in Asana. Keep chat material clearly marked as internal so the person deciding what carries into the client-facing version can see it at a glance.
6. **Risks and items requiring attention**, as bold-labelled bullets.

## Checkpoint, then render

Review the internal draft with the consultant. They decide what carries into the client-facing version, and specifically whether the health assessment goes as written, softened, or not at all.

Then produce the client-facing markdown and render it branded, using the OS toolchain rather than a second one:

```powershell
python "../.claude/scripts/render_docx.py" --md working/draft_exec_summary.md --out "deliverables/{Client}_Executive_Summary_{date}.docx" --client "{Client}" --client-logo source/logo.png
python "../.claude/scripts/export_pdf.py" "deliverables/{Client}_Executive_Summary_{date}.docx"
```

Brand is Montserrat and Barlow on the Power Cloud palette (`../../POWERCLOUD_BRAND_GUIDELINES.md`), not Word defaults. Run the humanize pass over the client-facing draft first, as with any client-facing content, and the QA checklist's "Before delivery" section after rendering.

## Closing the session

Summarize in four to six bullets, one per source, including the health verdict and the hours source with its as-of date. **Name any source that was unavailable or out of scope, and what it cost the document**, so the consultant can decide whether to reconnect and re-run rather than discovering the gap when a client asks. Then offer the two follow-ups that turn the document into action: a Gmail draft to the client contacts, and creating the missing Asana tasks the cross-reference found.

Log anything the run teaches to `working/learnings.md`, and append a dated `[unreviewed]` entry to `../../CAPABILITIES.md` if it proves a tooling assumption right or wrong.
