# Sales team interview: answers and design impact

> Mined 2026-10-09 by the orchestrator from `Internal/sales/source/2026-10-09 Sales Team Process Interview - transcript.txt` (and the summary beside it) against `SALES_TEAM_INTERVIEW_GUIDE.md`. **Mike answered every block himself**; Steve, Jason and Chris McDonald were not in the room, so answers about their habits are Mike's account of them [Reported], not theirs. Design consequences are the orchestrator's reading and are confirmed by Mike at the field-set review. Internal.

## A. Entry and record

| Question | Answer | Changes the design? |
|---|---|---|
| Who hears first | Steve Haim, by email, occasionally a call; almost always through a relationship (NetSuite, Anderson Frank); direct inbound is rare. Chris McDonald expected to bring deals later. | no; confirms the capture bar |
| First 24 hours | Email to schedule a call; NetSuite often sends background. No opportunity yet. | no |
| Recording | Every prospect call is recorded. AF and direct: Power Cloud hosts on Google Meet, titles inconsistent (booking-link meetings read "one hour meeting with Steve"). NetSuite-run deals: Zoom hosted by NetSuite, transcript and summary via Granola only, no full recording. | **yes**: the `{Prospect} \| {topic}` title rule only works for meetings we host; deal-intake must accept Granola exports as a source and Paco filing needs the title fixed after the fact |
| Where information lives | Pre-Sales Projects folder, already moving to the OS folder; recordings and shared documents land reliably, email exports inconsistently. | no |
| When an opportunity is created | Once the deal is "real"; Steve asks Jason Kramer to create it soon after the first call. Mike wants it earlier. | no; the lifecycle's stage 1 (after the first discovery call) is the agreed bar |

## B. Direct versus subcontract

| Question | Answer | Changes the design? |
|---|---|---|
| Recent mix | All recent deals through a partner; over 80 percent of current work through Anderson Frank. Three big open deals are NetSuite co-sell. | no |
| Which partners, and what kind | **Subcontract (we bill the partner):** Anderson Frank, SystemsAccountants; Sererra has legacy projects, not pursued. **Referral only (we bill the end client):** NetSuite, RunDTC; Playa Technologies was the same and is no longer active. | **yes**: the channel table needs a relationship type (subcontract, referral, direct), not just a billing party |
| Contacts per side | One sales rep at AF or SystemsAccountants, kept because billing problems route through them. NetSuite: sales rep (the one to track), often the sales manager and a solutions consultant, sometimes specialists. | no; one Referral Contact (the rep) plus further contacts on the Partner record |
| Who we invoice | The partner on subcontract deals; the end client on NetSuite, RunDTC and direct. Opportunities are usually in the end client's name "because it is easier to see". | confirms entity rule (a) |
| Company field today | Usually the end client; the button reads class and switches the parent. Not 100 percent consistent. | confirms entity rule (a) |
| Tracked on partner deals | Rate (for T&M), whether the customer is T&M or managed services (not fully worked out yet), project type (implementation, support, rapid assessment) and status. Tasks usually come later, after the technical people decide. | **yes**: add a Commercial model field; Task 1 cannot be a readiness-gate requirement |
| Reporting on channel | Wants the income statement, close rates, average bill rate and profitability by channel, driven through to the posting transactions including cost of goods from the post-time process. | **yes**: class propagation covers time entries and the post-time journal, not only invoices |

## C. Referrals

| Question | Answer | Changes the design? |
|---|---|---|
| Last referrers | No names to hand; last three big deals from NetSuite, one lead from RunDTC last week, AF quiet. | no |
| How a referral arrives | Email, text or call. | no |
| Where it is noted | A free-text field on the opportunity, not maintained or checked. | confirms Referral Contact |
| Do referrers expect to hear | AF stays through the project; RunDTC earns a commission and gets an automatically generated report. | no; the report keys on the existing Partner field, so Partner stays mandatory on referral deals |
| What the field needs | The standard Contact record (name, email, phone, title, maybe supervisor). | no |

## D. Proposals and numbers

| Question | Answer | Changes the design? |
|---|---|---|
| Where a proposal starts | In the OS, from templates and the call transcripts. | no |
| Who owns the numbers | The OS proposes; Mike checks and sets realistic technical hours; Steve adjusts for the commercial offering and rounding. | no; the LOE checkpoint has two reviewers |
| MSA and SOW library | The OS produces them; occasional samples; no perfect library. | no |
| Where the numbers end up | The proposal and the customer folder only; never NetSuite; no task breakdown except sometimes on a rapid assessment; no NetSuite budgets. | **yes**: Task 1/2/3 are optional at creation; the suitelet defaults a single task at the billable rate when none is set |
| NetSuite estimates | Sometimes, not often. | decision 4: out of v1 |

## E. The win

| Question | Answer | Changes the design? |
|---|---|---|
| Who hears | Steve, then Jason and Chris (the accountant, not Chris McDonald). | no |
| Status changes | Jason walks the ladder (Awaiting Project, Ready for Kick Off, Ready for Onboarding, Kicked Off) by hand because every step is manual. | **yes**: the account shows 13 deals stuck at Awaiting Project, so the suitelet advances the status itself |
| Who creates the project | Chris (accountant), with the Create Project button; resources sometimes filled in by hand afterwards. | no; the rewrite copies resources and rate |
| Needed before creation | A signed agreement; sometimes the rate and resources have to be chased. | **yes**: gate on billable rate and at least one resource; add a signed-agreement date |
| Navan and Uber | "Our biggest gap": full-list export and re-import, done inconsistently, missed more often than not; travelers pick generic values and fix expense reports later. | confirms phase 2 |
| Asana | Jason creates the project and ticks the field; works, could be automated. | no |
| Email group | Steve creates it; no naming convention (for example barbell@ for American Barbell). | no; close-deal proposes a name, Steve creates |
| Kickoff | Jason schedules and sends the invite. | no |
| Handover | Historically weak; better since recordings land in the OS. | no |

## F. Losses

Folder sits forever; opportunity marked Closed Lost; no autopsy; the native lost-reason field exists and is unused; feedback is hard to get from a declined direct customer. **Decision 5: yes**, status plus a one-line reason, no folder move; use the native Win/Loss Reason plus a memo line.

## G. Monday pipeline review

Mike, Taha, Steve, Jason and Bhavesh, one hour. Part 1: pipeline, from the saved search "PC Opportunity Dashboard" (customsearch692), run by Steve, the shorter part. Part 2: open projects from the script-generated Monday executive dashboard (hours, lead temperature, hourly trends, consultant load); nobody preps it. **Decision 9: Steve keeps running it; one person preps the whole pipeline; "a better dashboard than one saved search, maybe".** PIPELINE.md plus the reconciliation flags is that dashboard.

## H. Where they work, licenses

Steve and Jason live in Google Chat, calls and email; NetSuite only for what this interview covers; Claude Code barely touched. Chris McDonald not onboarded yet. A Chat command to log a touch "seems like the most useful way to interact"; a session with the interview function might work as well. **Everybody has a NetSuite seat today; Mike wants to revisit that**, since Jason and Chris McDonald only do what the interview describes. Folder-only selling: undecided; would need an individual dashboard rather than a wall of text.

## I. Sales-to-delivery open items

1. Asana project and email group: the same people every time (Jason, Steve).
2. Folder: starts and stays in one OS folder; permissioning if needed (decided).
3. No reusable introduction email; typed each time. Template goes to `templates/sales/`.
4. SOWs lived in the pre-sales folder, not the project folder. **Mike wants a private place where the delivery team can see the SOW without rates or prices.** New action item; Mike owns Drive sharing.
5. MCP-access commitment is in the master services agreement, so it ships with every proposal. Resolved.

## J. Open decisions

- **3 Native values:** projected total is not used today, no objection to the proposal skill setting it; lead source is set by hand but "used the same as class", and class is the financial field, so **class is the channel and lead source is not built on**; the opportunity-to-project link is set by the script. Resolved.
- **4 Estimates:** not used. Out of v1. Resolved.
- **5 Losses:** status plus one-line reason, no folder move. Resolved.
- **9 Pipeline prep:** Steve runs it; one person preps the whole pipeline. Resolved.
- **11 Cleanup:** pre-sales folders and the MSA/SOW library are in use; a read-only legacy folder is fine; Mike wants everything into the OS folders (migration action item). Resolved.
- **Folder-only sellers:** open, pending the process and an individual dashboard.

## Facts checklist (from the guide)

1 Monday review exists: yes. 2 Calls recorded with notes right after: yes, but NetSuite-hosted calls have Granola transcripts only. 3 Titles follow `{Prospect} | {topic}`: **no**, inconsistent. 4 One-line touch updates: not today. 5 Call-prep sheet reusable: not asked. 6 Consultant introduced by email: yes, no template. 7 Staffing chosen at the win: yes, sometimes chased. 8 Rapid assessment and travel in scope sometimes: yes. 9 Placement ref, minimums, monthly hours on partner deals: yes. 10 Asana may already exist at a win: Jason creates it; check-before-create stands. 11 Deal is real at the first discovery call: today a little later; agreed direction. 12 Thirty-day stale proposal nudge: not asked. 13 Discovery call produces Gemini notes: **different**, Meet recordings or Granola. 14 Entity on subcontract opportunities is the partner: **different**, the end client. 15 Titles follow `{Client} - {Engagement Type}`: yes in the account.

## Action items from the interview (owner Mike unless noted)

1. Private SOW folder structure (SOW visible without rates and prices).
2. Migrate pre-sales folders into the OS folder structure (decision 11).
3. Closed-loss autopsy process (the loss line plus a quarterly read).
4. Automate the Navan and Uber project lists (phase 2, already planned).
5. Revisit who needs a NetSuite seat once the API path (section 15) carries the sellers' writes.
6. Confirm with Steve and Jason directly the five answers marked [Reported] about their own habits (recording titles, email filing, Chat preference, Claude Code use, who they tell at a win): ten minutes, not a second interview.
