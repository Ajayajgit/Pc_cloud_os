# {Client Name}

- NetSuite account: prod {ID} / sandbox {ID}
- Account status: {pre-go-live / live}. Mirrors the `status` on the production connector's entry in `.claude/hooks/ns_connectors.json` (pre-go-live: creates and updates do not prompt). Flip both at go-live.
- Sandbox refresh: {date or best estimate, and how it was estimated}
- MCP connection: {name} (account verified {date})
- NetSuite release: {e.g., 2026.1}
- Script Reader toolset: {deployed {date} / not deployed}
- NetSuite customer: {the customer/job name in **Power Cloud's own** NetSuite, exactly as it reads there, e.g. `44 Pro Gloves` where the folder says `44 Pro`. Routes the weekly time-entry extract to this folder. The new-engagement skill asks for this at setup. Write the bare job name here (nothing after it on the line; the parser splits on commas). Three conventions: a real name routes; `none` deliberately opts out (a test or inactive folder); leaving it in `{braces}` means unset, which falls back to guessing from the folder name and is flagged in ENGAGEMENT_LOG.md until resolved. If no Power Cloud NetSuite job exists yet, write `{pending: no NetSuite job yet}` and note it in Open Questions. A nested custom project inherits its parent client's job, so it can leave this unset. **If this client bills to more than one job, add another `- NetSuite customer:` line directly beneath this one, one job per line** (e.g. `Harvest Hope Task Work` and `Harvest Hope Managed Services` are one client). Every declared line routes to this folder}
- Key contacts: {name, role, email}
- Engagement status: {pre-onsite / discovery / findings reviewed / draft approved / delivered}
- Engagement type: {rapid assessment / recovery | implementation | custom project}. One of the three in CLAUDE.md "Engagement types". Drives the workflow and the deliverables; if it is unclear, ask rather than guess
- Commercial posture: {pre-agreement (LOE + billing + a funding decision) / under agreement (no commercial framing)}. Independent of engagement type: any type can be either
- Format: {onsite / remote}. Applies to the discovery-led types. Client-facing names are **Rapid Assessment** (on-site, two full days) and **Fast Track Discovery** (remote, roughly two-hour chunks); use those names in anything the client reads
- Parent client: {custom projects only: the client folder this project sits under, e.g. `Upward Projects`}
- Promised deliverable: {default by type: assessment with LOE estimates (rapid assessment / recovery), implementation roadmap (implementation), Use Case then the combined FDD & TDD handover (custom project). Any net-new custom development inside the other two types carries that same pair, scoped to the work item. Note any engagement-specific commitments from sales material, or "no sales material" if none}
- Vertical notes: {AFA specifics: wholesale, DTC, 3PL, marketplaces, matrix items}

## Operating context

Where this client's work lives and how it is reached. The new-engagement skill fills this
at onboarding so downstream skills read it instead of asking again every run. Same
conventions as the hours line above: a real value is used, `none` is a deliberate opt-out,
and anything still in `{braces}` reads as unset.

- Asana project: {URL of the existing project. Pre-sales usually created one, so check before creating. `none` if this client has no project}
- Project chat: {the Google Chat space where the Power Cloud team on this account talks, as the room URL or `spaces/ID`. Paco posts the weekly Asana board update there every Monday morning (`PACO.md` section 6b), and the executive summary reads the space as a source and cross-references commitments made there against Asana. Internal team spaces only: the post is candid and never human-reviewed, so a space with a client in it must not be named here. Paco checks that itself before every post and refuses if anyone outside Power Cloud is in the space, so naming the wrong one fails safe rather than leaking. The one manual step is Mike adding Paco to the space. `none` if there is no team space or no Asana project}
- Email domains: {the client's own mail domain(s), comma separated, e.g. `teppermans.com, tepperman.com`. This is what the executive summary searches Gmail on, so a missing one silently returns no correspondence. Paco also matches meeting attendees on these domains to suggest this client for a recording (`PACO.md`)}
- Legacy folder: {path under `G:\Shared drives\Power Cloud Project Folders\` if this client has history there, else `none`. Read-only annex: old notes, meeting records, prior project documents. Nothing moves wholesale; copy a specific document into `source/` only when the work needs it, materialized as a real file (export Google Docs, never Explorer-copy a `.gdoc` link). **Going forward this OS folder is the client's Drive folder**, so new material lands here, not there. When a legacy folder exists, add that one path to this folder's `.claude/settings.json` under `permissions.additionalDirectories`}
- Meetings and recordings: {how this client's Meet recordings and notes reach `source/` today. Default: Paco files them after the organizer picks the client in Chat (`PACO.md`), which is why `working/meetings_log.md` exists. Note anything different (a client who sends Zoom or Teams recordings, an old Recordings subfolder), and whether the team puts the client's full name in Calendar titles, since that is what earns a confident suggestion}
- Meeting aliases: {other names or abbreviations this client appears under in Calendar titles, comma separated, e.g. `PP, Pref Plastics`. Paco reads this line to suggest the client; picking the client from a card does not teach it. `none` if the folder name and NetSuite customer name are enough}
- Reporting: {cadence and recipients for the executive summary, e.g. `biweekly, sent Monday, to {name} and {name}`. `none` if we do not report on this client}
- Power Cloud team: {who logs hours to this client, with role. The executive summary uses this to spot a completed week where someone who normally logs has nothing in}
- Billing channel: {Anderson Frank pass-through / direct. Selects the billing boilerplate in a pre-agreement deliverable}
- Website: {URL. Feeds the required business-overview research}

## Key decisions
- {date}: {decision}

## Open questions
- {question, and who can answer it}
