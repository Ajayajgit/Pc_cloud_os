---
name: new-engagement
description: Set up a client in the Power Cloud OS workspace, from inside the client's own folder, and capture once the facts every other skill would otherwise ask for every run. Use when the user says "new client", "onboard {client}", "set up {client}", "run the setup interview", "run session start" in a bare or unfiled folder, "this is new work for {old client}", or wants a customer wired up so the Monday hours print lands and executive summaries can run. Files loose documents into source/, checks for existing artifacts before creating anything, interviews the consultant, fills CONTEXT.md, links the legacy folder, verifies hours routing, and drafts the access and consent pack. v0.2, 2026-09-11.
---

# Client Setup (v0.2)

Turns a folder into a working client home, and runs the interview that stocks it. Two things depend on this and nothing else supplies them:

- **The folder has to exist, with a `- NetSuite customer:` line in its `CONTEXT.md`.** The Monday dashboard writes each client's time entries into `{Client}/working/time_entries_{date}.json` by reading that line. No folder, or no line, means the hours never arrive and the executive summary has no numbers.
- **The facts live in one place.** Email domain, Asana project, reporting cadence, who logs hours. Without them every executive summary run starts with the same five questions, and the answers drift between runs.

Invoke it as `/new-engagement` from inside the client's folder. Session start routes here automatically when the folder is bare or holds only unfiled documents. The consultant's flow (per the OS guide, Part 4): create a plain-name folder for the client under the workspace root (no "RA" or engagement suffixes; the folder outlives any one engagement), drop any documents in loose, open Claude Code there, and say "New client. Run session start."

## Three routes, same machinery

| Route | When | What it does |
|---|---|---|
| **New engagement** (default) | a fresh sale or assessment | Basics, then the engagement track, then the access and consent pack |
| **Adoption** | the user says "in-flight", "existing project", "ongoing client" | an engagement already running under the old way |
| **Operational onboarding** | a customer we produce work product for with no sale behind it: managed services, support, a recurring executive summary | Basics only. No engagement type, format or posture, no discovery, no access pack. Done when hours route and the summary can run |

**Adoption** differs like this: the check-before-create hits are expected (link the existing Asana project, set the legacy-folder pointer); the interview asks about the present (phase, current agreement for the scope-of-record, existing access, stakeholders on recent calls) instead of the sale; CONTEXT.md status is "in-flight as of {date}" and the deliverables/scope ledger opens with as-of-adoption entries; consent is a delta (if AI/MCP use was never formally disclosed, send Block 1 now and log it; upgrade ad-hoc roles / missing ScriptReader), not a full pack; ingest only recent material (last few weeks of recordings into source/, transcribed via the transcribe skill where no transcript came with them, open Asana tasks as the backlog), never the full history: the legacy annex is readable on demand and retroactive mining is the knowledge builder's job. Adoption should take an hour, not a day.

**Who gets a folder** (Mike, 2026-09-11, amending the 2026-08-18 decision): a customer gets one when **we produce work product for them**, and a recurring executive summary counts. It is still not every billing relationship. NetSuite bills several times as many customers as the workspace holds records for, and a folder nobody ever writes into is noise. Asked for a summary, asked for a status report, or actively supported means onboard them. Billed once for a one-off does not.

## Gap-fill mode

If the folder already has a `CONTEXT.md`, **do not re-interview**. Read it, and ask only about what is missing:

1. List every field still in `{braces}` (unset), absent entirely, or carrying prose where a bare value belongs.
2. Ask those questions only, batched.
3. Write the answers back. **Never overwrite a field that already holds a real value.** If an answer contradicts what is there, show both and let the consultant pick, then log the change under `## Key decisions`.

This is the mode to run when another skill reports a missing field, or when a folder predates a template change. Existing folders are not swept proactively; they get filled in when something needs them.

## 1. Check before create (never skip)

The duplicate-Asana-project incident is the reason this skill exists in this order.

1. **Folder variants**: does ANOTHER folder for this client already exist at the workspace root (abbreviations, old "Rapid Assessment"/"RA" suffixed names)? If yes, stop and ask the consultant: is that the real home to resume in, or does its content fold into this one?
2. **Asana**: if an Asana MCP connection is available, search for an existing project for this client (pre-sales usually creates one). If found, record its URL in CONTEXT.md instead of ever creating a new one. If Asana is not reachable this session, write `{check before creating: pre-sales may have one}` on the `Asana project:` line and add it to Open Questions.
3. **Prior material**: ask the consultant where sales notes, recordings, or a proposal live, and whether an email group exists for this client. Existing material moves into `source/` (copies, never originals of anything shared).
4. **Legacy folder**: check `G:\Shared drives\Power Cloud Project Folders\` for this client's historical folder (watch name variants and abbreviations; confirm ambiguous matches with the consultant). If one exists: record it on the `Legacy folder:` line in CONTEXT.md, and add that one path to the client's own `.claude/settings.json` under `permissions.additionalDirectories` so this client's sessions can read it without prompts (sibling folders stay out of scope). It is a read-only annex for old notes, meeting records and prior project documents; never reorganize it, and nothing moves wholesale. **Going forward this OS folder is the client's Drive folder**, so new material lands here, not there. Copy specific documents into `source/` only when the engagement actively needs them, materialized properly: export Google Docs to real files, never Explorer-copy `.gdoc` links.

## 2. The basics (every route, every time)

Batch these with AskUserQuestion where the answers are discrete. Do not guess an unanswered item; record it in Open Questions so it keeps surfacing.

- **Client name**, exactly as the folder should be named.
- **NetSuite customer/job name in Power Cloud's OWN NetSuite**, exactly as it reads there (the descriptive job title, e.g. `44 Pro Gloves` or `N. Teppermans Limited`, not a tidied client name). This is the single field the weekly hours print depends on, so ask it now rather than leaving it to a later edit, which is how folders end up unmatched. Four cases:
  - known: write the bare job name, **nothing after it on the line**. Trailing prose becomes part of the match key and routes only by containment luck.
  - **more than one job** (`Harvest Hope Task Work` and `Harvest Hope Managed Services` are one client): repeat the line, one job per line. Every declared line routes to this folder.
  - the job exists but the exact string is unknown: record what they have and add "confirm exact NetSuite job name" to Open Questions.
  - no Power Cloud NetSuite job exists yet (common on a brand-new sale): write `{pending: no NetSuite job yet}` and add it to Open Questions.

  A **custom project** nested under an existing client skips this: the project inherits the parent client's job, because NetSuite bills the client rather than the project, unless the consultant says it bills separately.

  **An initialism folder name makes this field mandatory, not optional.** With no declared line the extract falls back to matching the folder name against the job name by containment, and only for keys of five characters or more. `GW` is two, so it matches nothing and drops its hours silently. Any folder whose name is under five letters once punctuation is stripped (`GW` is 2, `ACFB` is 4) has to declare the job name or it will never route. `ACFB` does declare one and routes correctly; `GW` does not and drops everything.
- **Asana project URL** (from step 1.2), or `none` if this client has no project.
- **Project chat**: the internal Google Chat space for the Power Cloud team on this account, as the room URL or `spaces/ID`, or `none`. Paco posts the weekly Asana board update there every Monday (`../../PACO.md` section 6b), and the `customer-exec-summary` skill reads the space as a source. Worth getting right: on the Bixbi run of 2026-09-14 one chat message answered two questions no other system could. Internal spaces only, never one the client sits in, and tell the consultant that Mike has to add Paco to the space before the first post appears.
- **Client email domain(s)**. This is what the executive summary searches Gmail on. A missing domain returns no correspondence and reads as "nothing happened", which is worse than an obvious gap.
- **Key contacts**: name, role, email.
- **Power Cloud team on the account**: who logs hours to this client, with role. The summary uses it to spot a completed week where someone who normally logs has nothing in.
- **Reporting**: is there a recurring executive summary, at what cadence, and to whom. `none` is a valid answer.
- **Meetings and recordings**: Paco files Meet recordings and notes into `source/` after the organizer picks the client in Chat (`../../PACO.md`), so the question is what is different for this client (Zoom or Teams recordings the client sends, an old Recordings subfolder) and whether the team puts the client's full name in Calendar titles. Ask for **meeting aliases** at the same time: every abbreviation or nickname the client appears under in titles (`PP` for Preferred Plastics). Paco suggests the client only from the folder name, the NetSuite customer name, the email domains and this line; a consultant picking the client from a card teaches it nothing.
- **Billing channel**: Anderson Frank pass-through vs direct.
- **Client website URL** (feeds the required business-overview research later).
- **Tech stack known so far**: NetSuite account IDs (production and sandbox) if known, e-commerce platform, accounting system, iPaaS, EDI, WMS. Shopify or QuickBooks in the stack triggers the connector blocks in the consent pack (see `DATA_CONNECTORS.md`).

## 3. The engagement track (skip entirely for operational onboarding)

- **Engagement type**, one of the three in CLAUDE.md: **rapid assessment / recovery** (existing NetSuite customer having a hard time), **implementation** (blank account configured from scratch), or **custom project** (hired for one specific thing, usually custom development). This drives the whole workflow and the deliverables, so do not infer it from the folder name.
- **Commercial posture**: pre-agreement (LOE + billing + a funding decision) vs under agreement (no commercial framing). Ask separately; it is independent of the type.
- **Format**, for the two discovery-led types: on-site (two full days = Rapid Assessment) vs remote in roughly 2-hour chunks (= Fast Track Discovery). Use these names client-facing. Skip for a custom project.
- For a **custom project** only: the project name (it becomes the folder), the specific function in scope, and where the request or SOW lives.
- Any **committed dates or engagement-specific promises** from sales.

## 4. Scaffold (in place)

The client folder already exists; complete it:

1. **Stamp the folder** from `../templates/client-record/`, which brings `CONTEXT.md`, `.claude/settings.json`, and the `source/`, `working/`, `deliverables/`, `execution/` folders in one step. Copy in only what the folder is missing, never over an existing file. Then **file any loose documents into `source/`** (client-provided material) or `working/` (our own notes), telling the consultant what went where.
2. Fill in the stamped `CONTEXT.md` from the interview: the header fields, and the `## Operating context` block that holds the rest. **Replace every `{braced}` placeholder you have an answer for.** Braced text reads as "unset" to the hours extract and to the engagement log's routing check, so a left-behind placeholder is the same as no answer.
3. Add the legacy folder (if found in step 1.4) to `permissions.additionalDirectories` in the stamped `.claude/settings.json`.
4. Set `Engagement status:` to `pre-onsite` (new engagement), `in-flight as of {date}` (adoption), or `operational, onboarded {date}` (operational onboarding).

## 5. Verify the routing before saying it is done

A setup that looks right and routes nothing is the failure mode this step exists to catch.

```powershell
python "../.claude/scripts/fetch_time_entries.py" --dry-run --client "{Folder}"
```

It needs no credentials; it reports folder matching only. Confirm the line reads `declared: '{the job name}'` rather than `guessing from:`, and that the job name carries no prose after it. `guessing from:` is survivable for a folder whose name resembles the job name, and fatal for a short one (see the initialism note above). Then rebuild the log so the client appears in it:

```powershell
python "../.claude/scripts/build_engagement_log.py"
```

Then check the client is wired up for Paco's Monday board update, which needs an Asana project **and** a project chat space:

```powershell
python "../.claude/scripts/check_board_mapping.py"
```

It reads CONTEXT.md only, so it needs no credentials. `OK` means both lines parse; the one remaining step is Mike adding Paco to the space in Chat, which the script prints. Anything else is a missing or unusable line, and the script says which. Do not treat a missing chat space as a failure: plenty of clients have no team space, and `none` is a valid answer.

Hours arrive on the **next Monday run** (09:30 ET), covering eight weeks back, so a folder set up on a Wednesday stays empty until then. Say that plainly rather than letting the consultant read an empty `working/` as a broken setup. If a summary is needed sooner, `fetch_time_entries.py` with credentials is the manual pull.

## 6. Draft the access and consent pack (new engagement; a delta for adoption; skip for operational onboarding)

Copy `templates/engagement/access_and_consent_pack.md` blocks that apply (always Block 1; others per the tech stack) into `working/access_pack_draft.md` with placeholders filled. Flag it for the consultant to review and send; the skill never sends anything.

## 7. Hand off

Tell the consultant what remains manual, with owners:

- MCP connector creation is centralized: send Mike or Taha the account ID (per ONBOARDING.md Part 0).
- ScriptReader install: Mike, Taha, or Dev only, after client go-ahead.
- Calendar/recording hygiene: put the client's full name in meeting titles so Paco suggests the right folder, and answer Paco's card in the meeting thread so the recording and notes land in `source/`.
- Anything left in Open Questions, with who can answer it.

Then route: pre-onsite prep belongs to the rapid-assessment skill when the consultant is ready. After an operational onboarding, the next step is usually the customer-exec-summary skill.

## Guardrails

- Never overwrite or merge into an existing client folder without explicit confirmation.
- Never overwrite a CONTEXT.md field that already holds a real value. Gap-fill adds; it does not correct silently.
- Never create Asana artifacts when an existing project might exist and Asana is unreachable.
- Do not stamp a folder for a customer nobody is producing work product for, just because they appear in NetSuite billing.
- Client-facing text drafted here follows WRITING_STANDARDS.md (no em-dashes, brass tacks).
