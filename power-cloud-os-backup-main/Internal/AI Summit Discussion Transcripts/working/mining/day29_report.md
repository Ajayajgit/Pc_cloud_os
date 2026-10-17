# Day 2 Mining Report — AI Summit, July 29, 2026 (day29.md)

**Source:** `scratchpad/transcripts/day29.md` (~6,827 lines: Gemini quick notes, Gemini full notes + decisions + next steps, then full timestamped transcript 00:02:03–05:32:26). Read in full, start to end.

**Attribution caveat:** The transcript was captured by two logged-in mics; Gemini frequently splits one person's sentence across two speaker labels and assigns room speech to whoever was logged in. Speaker names below are best-effort; items marked *(attr?)* are uncertain. In several passages Mike/Taha/Imran labels are clearly interleaved mid-sentence.

**Session shape:** Morning = live re-run of the rebuilt rapid-assessment skill on "Shinesty redo" folder + review of the new CLAUDE.md/skill/reference-file architecture (built by Mike the night before) + report format debate. Midday = folder/workflow standardization, PM-tool vision, lunch. Afternoon = Shinesty execution-plan review, "what can AI execute" session, scripting-vs-workflow debate, 44 Pro billing dispute, wrap-up planning for Day 3 ("actionable").

---

## 1. WHAT'S WORKING

- [00:08:38] Taha (attr?): the executive-summary skill is being enforced across his team on multiple projects; "it's becoming a really good process." Mike noticed the skill appear in the shared setup immediately.
- [00:12:34] Taha's personal voice skill: he had Claude scour 3 years of his personal documents, Synology files, and emails so generated documents "look more and more like me," not AI. Team agreed every person should do this ("I wanted my voice though. AI is my assistant. It's not speaking for me").
- [00:12:34] Taha's end-of-day wrap-up skill: "wrap up my day with this project... everything's saved, backed up... I just go slap and it's done" (save-to-memory + push-to-git chained into one skill).
- [00:16:30] The skill self-enforced writing rules live: "it literally said Mike hates M dashes. Make sure we go through scrub all these dashes."
- [00:17:27] Skill creation is easy: "I've just had Claude write the skills" — low barrier confirmed by Imran ("recreating a skill is fairly [easy]").
- [00:22:29]/[00:21:27] The reworked skill now interviews the consultant instead of assuming: "it's going to make less assumptions and it's going to ask you questions... I think the results will be better." Mike had already used this pattern manually on Tepperman's ("here's what I remember about their environment... do you have any checks on my accuracy?").
- [00:32:15]–[00:38:58] Artifacts moment of delight: Mike published a shareable artifact ("Assessment changes") to explain overnight process changes to the team. All it took: "Can you give me a presentable breakdown of what changes we made in the process?" — Claude itself suggested "This is a good fit for a sharable page the team can review. Let me build it as an artifact." Team resolved to research artifacts further as a possible client-deliverable vehicle (HTML flexibility praised: "the look/feel is unlimited basically").
- [00:33:05] The core promise of the rebuild validated in the artifact text and endorsed aloud: the assessment "comes up the same way no matter who runs it" — Imran: "that's perfect... my goal is to make this repeatable."
- [00:33:05] Architecture praised: replaced a 27KB monolithic instruction file ("output quality rose or fell [based on] whatever consultant happened to prompt it") with lean orientation CLAUDE.md + load-on-demand skill + reference files (NETSUITE_PLAYBOOK, WRITING_STANDARDS, QA checkpoints).
- [00:41:51]–[00:42:52] Self-check pass: the skill re-ran the Shinesty output against its own quality checks overnight, failed a few, and reported it had mechanisms in place to catch those failures downstream.
- [01:23:34]–[01:26:30] Two-step markdown-then-render workflow validated by the group: review/edit the markdown working draft, then render polished finals — "Once it does the PDFing and stuff, it doesn't have to go back. That's great." Compared to briefing a designer: "edit my source text document... then go render the nice stuff."
- [01:37:48] The assessment surfaced NetSuite-native SuitePromotions (supporting combined item-level discounts) from Oracle documentation — a feature the team had not mentioned and didn't know: "Did you even know that? No. So we didn't bring it up... we can see a change." (Oracle-docs research instruction paying off.)
- [01:44:26]–[01:45:34] Rendered document included the client logo after Mike nudged it mid-run ("go to the website to grab the logo") — output "looking pretty much exact... pretty close" to what they wanted; layout with per-task separation liked.
- [01:33:19] Business overview built from web research beyond the client's website (picked up the "ugly Christmas sweater" origin story, likely from press) — deemed accurate and impressive.
- [02:04:14]–[02:09:32] Introspection worked: asked why it missed the Shopify order-flow topic, Claude produced a specific, honest post-mortem: the source had only one line and "I underweighted a thin looking line relative to a loud one," while pointing out that its evidence.md HAD captured the item — the miss was downstream weighting. This diagnostic led directly to discovery of the corrupted source file.
- [02:22:21]–[02:23:17] Second impressive self-diagnosis: Mike gave Claude the new document with no pointed prompt ("what do you think?") and it immediately flagged the same missing topics AND identified that the source document was incomplete, then went looking for the full document on its own.
- [02:26:22] Evidence extraction accuracy confirmed on business figures: $43M revenue, e-commerce split, etc. captured correctly.
- [02:36:30] After the corrupted source was replaced, the rerun elevated the previously missed Shopify order flow to "the number one pain point" — correct prioritization once data was complete.
- [02:25:32] Overall verdict on the process: "What we're doing right now is a dramatic improvement... infinitely more detailed and faster" than the manual days; 80/20 accepted as the bar with iteration.
- [02:04:14] Claude ran a rendered-PDF readability comparison of two format variants (Flesch scores, page-by-page) and recommended the numbered narrative style — team mostly agreed with its recommendation.
- [02:19:37]–[02:21:23] Taha's Google Apps Script for auto-filing meeting recordings into client folders already exists and mostly works (naming convention `Customer | Title`, alias list for folder-name mismatches like 44 Pro, fuzzy matching to "barbell", error surfaced when it can't route).
- [03:52:10]/[04:26:29 area] MCP verification during execution-plan build: customer-deposit claim checked via script/query — "it has never created a single customer deposit... verified" (returned zero). Evidence-tier verification working in anger.
- [04:23:15] Brixton vendor-price rounding (item record save + PO CSV path): two scripts produced via the use-case-generator → Claude Code → SDF flow; Mike "was way more confident doing it in cloud with the script" than building workflows.
- [04:27:35] APM workaround succeeded: Claude couldn't pull APM data (Suitelets) but consumed pasted screenshots of the APM pages and used them for the Tepperman's concurrency analysis ("okay this is good, this is what I need").
- [05:15:41] Claude proactively suggested the right next process step: asked how it should be used in the execution phase, it said it should first write the tasks over to Asana — Mike: "You're right. You probably should. I didn't think about that."
- [04:19:01] Voice input adoption: "Justin doesn't type anymore" (WhisperFlow); Mike admits he underuses it.
- [04:47:28] Client-side validation of the AI-forward approach: PSG's admin "dove head first into AI," self-managing imports and her own scripts after minimal coaching.

---

## 2. PAIN POINTS & FAILURES

**Data/pipeline failures (the day's biggest incident)**
- [00:02:03]–[00:03:22] Gemini meeting notes produced a 22-second transcript for a 65-minute meeting; summary had to be recreated; re-running video in a new meeting loses speaker context.
- [02:12:01]–[02:16:48] Corrupted source document: copying Google Docs via Windows Explorer produced a truncated file (3 pages/11KB vs. the real 65–100 pages/126KB). Root cause: pure Google Docs in the Drive filesystem are links, not files; Windows copy silently breaks them ("a big shortcoming"). This invalidated the morning's test and caused the missed-topics failure. Google's tabbed docs also behave as "two subdocuments within a document... which is just f***** up" (summary vs. transcript tabs).
- [03:17:13]–[03:19:46] Moving 44 Pro source docs required manual zip upload → Zip Extractor → select-7-files-download gymnastics; downloads inconsistently converted to Word docs; had to spot-check page counts to trust the copies.
- [02:17:50]–[02:19:37] Meet recordings always land in the owner's "My Recordings"; Taha's auto-move script failed the prior day because the meeting title didn't match the naming convention; alias list needed when folder names differ from customer names; manual title-editing workaround.

**Model/report quality misses**
- [02:02:22]–[02:04:14] Report omitted two key topics (Shopify order flow with orders coming in without customer deposits, and payout mismatches) — raised twice (first iteration also missed them). Root cause chain: truncated source + underweighting a single-sentence mention.
- [01:28:40]–[01:30:40] Fresh output still violated the new writing standards: adverbs/judgments ("heavily customized," "unusual"), business overview buried below summary bullets despite yesterday's feedback.
- [01:34:32] "Two pieces of good news to build on" — condemned as "used car salesman s***," "almost parental"; verbal framing okay, never in a formal document.
- [01:35:21] Report over-weighted a topic that got only "the last 15 minutes of the fourth call" while missing the bigger one — weighting by transcript airtime is unreliable in both directions.
- [00:35:11]/[01:01:39] Prior format carried "[Reported]/[Verified]" tags on nearly every line plus a "what we could not verify and why" section — created noise; verification must stay internal.
- [00:34:12] Old instruction file literally told Claude to "tell a story" (inherited from the "Source" AI-company demo) — cause of the flowery 12–14 page, problem-retold-3x novels.
- [00:40:50] Run stalled asking questions the team thought were answered ("start completely fresh?" / logo) — "it's a little smarter than we wanted it to be."
- [01:44:26] Logo not pulled without explicit instruction; Mike had to intervene live during rendering.
- [05:00:52] (also [04:59:43]) Claude confidently blesses flawed script approaches: "it'll catch the error this way and thinks it's great... unless you have some knowledge of what to catch you're not going to know"; it also backtracks instantly when challenged ("Hey, good catch... Oh s***").

**Tooling/infra friction**
- [00:04:23] MCP connection sharing unclear: team members must re-authenticate to use the shared NetSuite MCP connection.
- [00:28:51] Model management in the standard interface: one model per session; switching mid-session "sometimes... starts over, doesn't remember properly"; no per-subtask model routing.
- [00:30:02]–[00:31:09] Permission-mode confusion: accept-edits vs. approve-everything vs. bypass permissions ("that's like god mode... it might rewrite Windows for you"); no agreed policy on when auto mode is safe (Imran's open question: "At what point do we feel like it is okay to do that?"); consensus only that deploy steps must still ask.
- [00:10:39] Blank-slate problem: every Claude Code session starts fresh, no endless memory — the driver for skills, but still felt as friction.
- [00:39:52] Artifact links don't open for people outside the Claude team/in private windows — limits client sharing.
- [00:41:51]/[00:43:57] Font availability: rendering depends on everyone having the official fonts installed ("the real answer is we probably just have everybody download our official fonts").
- [03:52:10]–[03:54:39] Live MCP failures: "couldn't connect" to Shinesty production; execution plan shipped without the environment/account ID ("for some reason I couldn't get that... I should have been able to").
- [04:26:29]–[04:27:35] Suspected root cause: they connected using the client's pre-existing ad-hoc role — "we used their role... which maybe is part of the problem why it keeps giving us errors."
- [04:26:29] Claude cited two structural blockers verbatim: "no sandbox access exists yet and the connected MCP role is read-only and that's a hard rule not a preference" — team noted read-only is actually a CLAUDE.md rule, not a role limitation, and the distinction was muddy even to them.
- [04:27:35] APM performance data not reachable via MCP (data lives in Suitelets); manual screenshot paste was the workaround; NetSuite ACS has backend tools Power Cloud lacks.
- [04:28:26]–[04:29:47] Scale limit: account has 658–700 scripts (client had claimed ~200); Claude asked whether to read more scripts; global scans deemed inefficient and wrong — reads must be task-targeted.
- [02:14:02] Speaker attribution: conference-room clients all get logged as the one signed-in user; "making reference of who made that comment is important"; only workaround is going back to the video/timestamps.
- [02:10:51]/[03:05:43] Claude cannot consume video or audio in the current setup — transcripts only; tone/human-interaction context lost; tokenization cost acknowledged if it ever becomes possible.
- [00:48:37]–[00:53:30] Token/bloat worry on knowledge files: a best-practice lookup currently means reading the whole playbook; needs section markers/hierarchy so it reads only the relevant process area.
- [00:51:31]–[00:52:27] NETSUITE_PLAYBOOK.md came out Shinesty-specific ("it's the one customer you used to build it," TikTok references) — needs generalization discipline and a gate on what enters the general knowledge base.
- [00:47:29] Playbook priority ratings were inferred from one conversation ("cash matching... high impact") — "how this document gets updated is a question."

**Workflow/knowledge gaps (people side)**
- [00:09:20] Imran: "what is a skill?" — core concepts (skills, hooks, CLAUDE.md vs. skill vs. prompt, artifacts) new to part of the team mid-summit; training gap explicit.
- [00:25:49]–[00:26:47] "We are still figuring it out when to use the skill versus... what should be a prompt? What should be in the standards?" — no settled decision framework.
- [01:07:16]–[01:08:55] Live run asked about billing/budget context they hadn't standardized (Anderson Frank vs. direct) — placeholder answers given; boilerplate missing.
- [02:24:29] Human backstop is fragile: "if it missed it and I missed it, then what am I checking against?" Taha still keeps manual notes of "topics worth remembering" — memory in heads.
- [04:33:48]–[04:35:16] 44 Pro invoice artifacts: jumbled/overlapping comments per date, words not matching timestamps — invoice/time-log presentation is confusing enough to fuel a client dispute.
- [02:43:01] Tepperman's client feedback on the dense deliverable: "It felt like drinking from a fire hose"; 3–4 stakeholders "didn't get anything out of it"; 14-participant meetings made an unstructured verbose doc fail.
- [01:07:16] Client on a call referred to the tool as "cloud/clawed" — naming/what-is-this confusion leaks to clients.

---

## 3. EXPLICIT FEATURE REQUESTS & IDEAS

- [00:27:42]–[00:28:51] **Per-subtask model routing via a custom-built tool**: default model for orchestration, higher model for intensive sub-agents, lightweight model for document writing; "when you develop your own tool using AI you can give it specific instructions that on this task use this model" (from AI-engineer candidate's interview). Fine-tuning postponed until the AI developer starts.
- [00:54:42]–[00:57:30] **Feedback loop / knowledge-base builder**: a process outside any project context "that just listens to every recording and looks at every session we've done" (plus chats, and historical docs back to Homefield) and proposes knowledge-base entries; semi-annual retroactive ingestion; goal: "if I was trying to solve a problem... this was smart enough to come back and say 'we've already done this and here's what we did' without me having to ask." Revives the failed Santos-era script-library ambition.
- [01:15:17]–[01:19:25] **Release-notes ingestion loop**: feed each NetSuite release into the feedback loop; it flags stale workarounds ("you used to do this; this new feature might solve that — should we consider?"), proactively alerts the team, includes a "time bomb"/staleness check on entries; new features enter as "possible alternate solution" until confirmed, never auto-replacing best practice [01:20:27].
- [01:21:24]–[01:22:29] **Per-customer feature/config usage registry**: "can we keep some sort of a knowledge base of every feature or function that each one of our customers is using?" so a Shopify API change → "which of our customers did we configure this flow for that we need to reach back out to." (Also in Gemini next steps as a group action.)
- [01:46:59]–[01:52:44], [02:49:34]–[02:52:23] **Standard report structure**: summary table first (number, issue, proposed solution, LOE min/max, priority, brief notes), hyperlinks from each row to a verbose appendix section at the end; organized by workstream so each stakeholder reads their own section; summary-of-hours table adjacent; recommended-phasing table; add a table of contents [02:44:58]; trim/merge exec summary into 1–2 sentences with business overview + current NetSuite state up front [02:37:34–02:41:05].
- [01:53:43] **Auto-generate a spreadsheet/Sheet version of the work-item table** alongside the doc ("because AI is doing it, it's not going to cost us any more effort"); Taha already had Claude produce an Asana-loadable sheet and let it push to Asana directly [01:54:37].
- [02:23:17]–[02:24:29] **Elevate evidence.md to a formal reference/QA checklist**: beef up instructions so it captures everything "without any judgment about how important it [is]"; the human cross-checks the deliverable against evidence.md.
- [02:02:22]–[02:03:19] **"Why did you miss X?" diagnostic as standard practice**: when a topic is missing, ask Claude to trace back to transcripts and explain the omission (Gemini next-step assigned to Taha).
- [02:08:26] **Per-transcript fine-tooth-comb pre-pass**: "it needs to go through each transcript with a fine tooth comb and extract task-based [bullets]... then that becomes a reference document." *(attr? Mike/Imran interleaved)*
- [00:49:37]/[00:53:30] **Hierarchical/indexed MD knowledge files**: top-level topic markers (order-to-cash, procure-to-pay) so the AI jumps to the relevant section only; possibly master file + sub-files; explicitly a question for the incoming AI engineer.
- [01:03:09] **Use 5–7 exemplar assessments** instead of a single reference doc ("use all of these and come up with the best of all").
- [01:03:09]–[01:05:06] **Two complete procedural paths**: rapid assessment (rescue) vs. new implementation — separate skills/questions/timelines; implementation to be standardized (chart of accounts basics first) [01:06:07].
- [01:44:26] **Explicit logo-retrieval instruction** in the skill: "if we don't provide the logo, grab it from [the customer website]" (Gemini next step: standardize logo retrieval).
- [03:04:21] **Billing boilerplate in context files**: two verbatim blurbs (Anderson Frank pass-through rates vs. direct customer); the run asks once per engagement and stores it in the client context file.
- [02:17:50]–[02:21:23] **Recording auto-filing**: adopt/extend Taha's Apps Script org-wide; Google Workspace workflow so recordings land in the client project folder automatically; fuzzy matching plus confirm-prompt ("I think this should be moved here"); Mike: "we will need something like this."
- [01:54:37]–[01:59:25] **Database-backed core**: "should all of these things go into some sort of database... these docs are outputs of the database"; improves AI memory; counter-argument that AI crawls flat markdown well is an acknowledged open debate; flat files judged unmanageable once portal-style task updates/logs accumulate [02:00:26]. Asked Claude itself which format is better [02:01:11].
- [02:55:38] **UI over prompts**: "we will not be using prompts... a user interface to answer a few questions and then it goes in the back, picks up the correct model, correct temperature."
- [03:05:43]–[03:11:59] **The Power Cloud OS / "onboarding app" vision (most concrete articulation)**: sales/admin creates a new lead/customer → tool creates folder structure, Google chat group, email alias; pre-sales calls attach into it (drag-drop/attach button); status tracking; buttons for standard processes ("Prep for onsite") with a modal for extra instructions [03:08:55]; embedded chat to continue conversations; tasks generated and rendered in-tool; customers access/comment on tasks; privacy controls so customers can't burn tokens or trigger the AI [03:07:55]; replaces Asana (they use ~none of its depth — "essentially a ticket/task management tool") [03:11:59]; project management = Claude synthesizing tasks + meeting notes + email into executive summaries, past-due tracking [03:13:00]; built on Google infrastructure underneath; scope explicitly "task management," not MS-Project-style PM [03:11:59]. Reference point: "Source" company's UI (project list down one side, document stream + chat window, notebook-LM-ish) [03:08:55].
- [01:56:31] **Model portability requirement**: "however we build this, it probably should be built so that your model can be changed out on the back"; evaluate Gemini's workspace indexes vs. Anthropic access to Drive.
- [02:10:51] **Video/audio as added context**: explore whether Claude can consume the actual meeting video/audio for tone and human interaction; acknowledge token cost; "maybe that's a question for the AI [engineer]."
- [00:57:30]–[00:58:21] **Requirements document for the AI engineer**: compile the summit's topics/knowledge base as his starting point (Gemini next step: Mike, Imran, Taha).
- [04:06:55]–[04:17:52] **Library of templated common tasks**: unused-item/vendor identification (no transactions in N years, no stock), UOM audit (volume vs. weight conversions — Grinds case), supply-allocation enablement with prerequisites + form updates ("go enable supply allocation and update all the transaction forms"), approval workflows via script; build these "ready to go for clients" especially on the implementation side [05:14:31].
- [05:14:31] **Incorporate Taha's "weekly executive summary" skill** into the shared setup for the execution phase.
- [03:01:21] **CLAUDE.md line for ongoing work**: "we'll also be using this folder structure for ongoing work... use the MCP connection if specified and the recordings/transcripts."
- [03:02:22] **Claude-driven folder reorg**: have Claude create `source/` subfolders and classify existing files (use cases → source, handover docs → deliverables); Taha volunteered to lead; Mike halted it pending investigation ("Don't do any moving yet. I want to investigate what's needed") [03:03:15].
- [04:56:38] **Pre-work-session question generation**: before a work session, the tool evaluates the chosen tasks and produces the 10–15 questions that must be answered; Mike's pivot: let it ask questions and the consultant decides whether a work session is needed — three exits: answer from knowledge, schedule follow-up, or proceed [04:57:53].
- [00:23:30]-context / [02:56:44]–[03:00:23] **Folder standardization**: single Assessments (possibly renamed) folder as the home for all client work; existing client folders moved under it; cross-pollination/shortcut with the traditional project folder still to solve [02:59:15].

---

## 4. IMPLICIT NEEDS (nobody proposed a tool, but the pain begs one)

- **Source-integrity verification before any run**: the truncated-Google-Doc incident shows the pipeline needs an automatic completeness/size sanity check of source files (Claude spotted 11KB vs 126KB only after a failure). Also a safe Drive→local ingestion path that materializes real files from Google Doc links.
- **Speaker diarization / identity capture** for multi-person client calls; current transcripts attribute everything to the login user; team called who-said-what "important" with no answer beyond re-watching video [02:14:02].
- **Account-identity hard gate**: the execution plan rendered with environment/account ID unresolved and nobody stopped [03:54:39]; a should-be-blocking check passed silently.
- **Standardized MCP connector role**: errors traced to using the client's ad-hoc role [04:26:29]; a Power-Cloud-standard role install per engagement is implied (precursor to the ScriptReader role standard).
- **Read-only enforcement clarity**: read-only lives in CLAUDE.md, not in the role; the team themselves briefly conflated the two [04:26:29] — enforcement should not depend on prompt files alone.
- **Immediate post-meeting processing discipline**: "you need to do this exercise right after... don't wait days or weeks. And that's part of our requirement" [02:07:27] — a process rule with no mechanism behind it.
- **A less prompt-dependent entry point**: Taha: "ultimately I want something that knows what to do with less of a prompt" [00:26:47]; prompts varied per person and results with them.
- **Knowledge-base curation gate**: proposal that the system interview the team before an insight enters the general playbook ("is this something that belongs in our general knowledge base?") [00:52:27]; truths need when/why context attached, not bare rules ("the truth needs both sides... the when and the why") [01:08:55–01:13:35].
- **Client-onboarding data checklist**: recurring "they didn't give us access to the recording / sandbox / environment" moments ([03:08:55] modal example, [04:46:22] PSG sandbox access) imply a standard engagement-setup checklist the tool tracks.
- **Time/billing artifact generation**: 44 Pro's jumbled invoice comments and Imran not wanting to trawl his own logs ("go in and see my recent logs to see how many hours I spent... I don't want to do that") [03:21:32, 04:33:48] — hours-summary and invoice-narrative generation is a real need.
- **Dispute-evidence mining**: using Amazon Seller Central first-order dates and menus to establish when stores were activated [04:53:11, 04:55:20] — external-system forensics as a repeatable capability.
- **UAT support**: 44 Pro's dispute is rooted in "their UAT sucked"; the client's new developer's 25-use-case list impressed [05:06:52–05:07:50]; generating UAT use-case checklists per implementation is an obvious product of the assessment data.
- **Scope registry**: "I can't promise you that it explicitly came out that this is not MSP" [04:51:45] — scope statements live in memories and email threads; the folder/OS needs a scope-of-record.
- **Blank/demo account testing**: Mike obtained a blank demo NetSuite account [03:15:03]; the team has "barely even tried" AI-driven greenfield setup [01:06:07] — implies a sandboxed implementation-automation test harness need.
- **Aliasing/mapping layer between customer names, meeting titles, and folder names** (44 Pro vs. actual folder name) [02:20:30].
- **Cheap Oracle-docs retrieval**: consensus that crawling the full help center per run is impossible/too costly; targeted per-problem lookup only [01:16:02–01:16:54] — a curated retrieval index is implied.
- **LOE presentation/ownership workflow**: LOE numbers were "placeholders anyway" [01:32:20]; hourly LOE checkpoints appeared mid-run [01:22:29]; range framing to clients ("15 to 20 hours... that's our guesstimate") [03:37:05-area] — calibration and explicit human sign-off on hours is an unfinished process.
- **Delete/stale-context hygiene**: old meeting summaries with outdated comments must be deleted before reruns so the AI doesn't ingest them ("delete the 44 pro meeting summary... it might have some previous comments") [04:02:32, Gemini next steps] — implies need for systematic context freshness management.
- **Knowledge transfer between generations of consultants**: "Other people existed at Homefield five years ago" [00:56:35] — institutional memory only in recordings/docs nobody reads.

---

## 5. BUSINESS & STRATEGY SIGNALS

- **AI engineer hire**: India-based, signed, starts ~Aug 18 [03:46:41, 04:44:45-area]; interview format = homework (design a solution to their stated goal) + present it; winning candidate was transparent about using AI and could explain everything, "as opposed to other candidates which didn't even know what AI had created" [00:50:36]. Autonomy fine-tuning, token-efficiency design, and DB-vs-markdown questions all deferred to him.
- **Managing AI like staff / delegation model**: consultant = guide, AI = prep and nuts-and-bolts. "We are most valuable when we are working with the customer guiding them towards decision making, not turning the nuts and bolts" [04:14:36]; AI gathers lists/data so consultants spend time on advisory [04:15:55]; "instead of you spending an hour and a half creating fields and scripts... that cuts that part out. But that doesn't mean that decisions and the strategy... is away from you" [04:59:43].
- **Human-in-the-loop as policy**: "In the execution piece I want to be extremely careful because we're touching the customer's system" [04:59:43]; full-autonomy explicitly rejected ("what I don't think is feasible is to just say... go do it all" [04:15:55]); developers review AI scripts before deploy; sandbox-first, break-it-in-sandbox accepted [04:58:48].
- **Follow-own-advice restraint**: "we tell our customers don't completely automate everything until you've used it for a while" [00:22:29]; okay if the process still takes 12 hours early on.
- **Transparency stance**: "We're not trying to hide the AI... we're transparent that we're using it" but output must carry the person's voice; computer-generated-feeling content is "not being respectful" and gets discarded by recipients 90% of the time [00:13:37–00:15:34].
- **Billing posture**: rework is billable project work; requires an Asana ticket and explicit approval before starting; "do not ever feel... emotionally apologetic that you're charging them... as soon as you sound apologetic... they capitalize on it" [03:21:32–03:23:14].
- **44 Pro dispute economics**: concede 20–30 hours as future credit (not free NSviews) to preserve renewal/long-term relationship; "both sides share responsibility" [05:16:35–05:18:51]; client's refusal of the "all-you-can-eat" (MSP/unlimited) model is "biting them... it's going to cost them 15–20 hours" [04:53:11–04:54:20] — appetite visible for MSP-style pricing.
- **Deliverable economics shift**: extra formats are near-free — "because AI can do it... for the people who want the verbose information, it satisfies that for them. If you'd put it on my plate in the old days... f***, I can add an appendix" [01:52:44]; spreadsheet exports "not going to cost us any more effort" [01:53:43].
- **Service-scope exclusion**: no SaaS/recurring-revenue software-sales practice — "strangely enough, since we're in that business, we don't really know how to run that business" [01:19:25–01:20:27]; release-note topics on software sales can be ignored.
- **Vendor strategy**: model-agnostic architecture; weigh Anthropic vs. Gemini on workspace/Drive indexing access [01:56:31]; skills/plugins "are free right now... they will [monetize] soon" [00:17:27, 00:20:30]; Asana subscription on the chopping block if the internal tool lands [03:10:43] ("if we get rid of Asana [we're] paying his salary" — the tool partially self-funds the AI engineer *(attr?)*).
- **Competitive positioning**: "Source" (another AI company) demoed a narrative-style assessment the team found "terrible" but its portal UI is the visual reference for their own tool [00:34:12, 03:08:55]; NetSuite ACS has backend performance tooling they can't match via MCP [04:27:35]; prediction that NetSuite's own AI will erode workflow-builder use ("I'm not sure the workflow interface will even exist once the NetSuite AI becomes intelligent") [04:25:21].
- **Client adoption spectrum**: PSG admin self-serving with AI (initially "terrifying," concluded fine — "we get more work") vs. RMR needing everything explained repeatedly ("tale of two cities") [04:47:28–04:48:34] — the OS must serve both client archetypes.
- **Client-facing communication standards**: succinctness as billable-time ethics ("if you spend 10 minutes explaining which can be done in 30 seconds, those 9½ minutes are gone" — Imran quoting Oracle training [03:49:49]); US-facing consultant owns the relationship, developers coached not to send long emails [05:00:52–05:01:44]; counter-example: Foundry contractor Vinnie's three-page emails for simple asks [03:48:21].
- **Engagement terminology settled for positioning**: "rapid assessment" historically used for everything; going forward rescue-vs-implementation are distinct offerings with distinct deliverables (SOW out of implementations) [01:04:05–01:05:06].
- **Deck vs. document**: PowerPoint is the meeting vehicle; the document remains the deliverable/reference AND the structured feed into the future system ("our next objective is to feed this into a [system]... would the table and verbose help the AI properly create the right text and billing categories") [01:52:44].
- **Customer consent/pilot approach to format changes**: produce both formats, pick one, solicit feedback from a friendly customer, watch unsolicited reactions in reviews [01:49:00–01:50:51].
- **Physical ops footnote**: flex-space/warehouse office exploration [03:24:20–03:30:26]; warehouse fire/burned-items incident handled in parallel [02:01:11] — the business runs distributed, meetings + AI carry the coordination load.

---

## 6. DECISIONS & NORMS AGREED

(Cross-checked against the Gemini "Aligned" decisions list [lines 203–247] and the transcript.)

**Writing/deliverable norms**
- No em-dashes anywhere; no flowery/verbose language; no adverbs, judgments, opinions, or subjective language in client-facing reports [00:16:30, 01:28:40–01:29:41]. No "good news" salesmanship in documents [01:34:32]. Quote cap: 2–3 strong quotes across the whole document [00:36:03].
- Verification stays internal; client document shows only the few verified numbers that land hardest [00:35:11, 01:01:39].
- Standard structure: summary table at front (issue, solution, LOE min/max, priority) → workstream sections → verbose detail as linked appendix at the end; phasing table; hours-summary table adjacent; TOC [01:46:59–01:49:52, 02:49:34–02:52:23].
- Executive summary trimmed to ~1–2 sentences; business overview + current NetSuite state lead the document; merge/eliminate redundant sections [02:37:34–02:41:05].
- Numbered narrative style adopted (validated by Claude's readability comparison) [02:04:14, Gemini decisions].
- Budget/billing hours of the assessment itself excluded from the report [01:07:16].
- Business overview researched from the client's public web presence — required, not optional [01:00:36].
- Deck carries the 5–10 critical items; table of 47 points stays in the document [02:41:05–02:42:08].

**Workflow norms**
- All drafting in markdown first; human reviews/edits markdown; then render finals [01:22:29–01:26:30].
- Two distinct procedural paths: rapid assessment (rescue) vs. new implementation [01:03:09–01:05:06].
- Evidence file is a required component of the process and the human's cross-check reference [02:23:17, Gemini decisions].
- Do the review exercise immediately after meetings ("that's part of our requirement") [02:07:27].
- 80/20 accuracy accepted; iterate rather than chase 100% [02:23:17–02:25:32].
- When a topic is missed, interrogate Claude for the why and trace to transcripts [02:02:22].
- Delete stale/outdated meeting summaries before reruns [04:02:32].
- All meeting recordings stored in the client's project folder; naming convention + Apps Script automation; alias mapping where names differ [02:17:50–02:21:23].
- Existing folder structure retained for all projects (no big-bang reorg); existing client folders to be consolidated under the Assessments structure; ongoing projects need no new instruction sets — point Claude Code at the customer folder and rely on prompts [02:56:44–03:01:21]. Mike to add the ongoing-work line to CLAUDE.md. No file moves until Mike investigates what `source/` migration requires [03:03:15].
- Billing/rates boilerplate verbatim per customer type (Anderson Frank vs. direct), stored in the client context file, asked once [03:04:21].
- Billable rework: formal Asana ticket + explicit customer approval before work begins; factual, non-apologetic language [03:21:32–03:23:14].
- Read-only MCP access during engagements (CLAUDE.md hard rule); no writes to customer systems during assessment [04:26:29].
- Script reading targeted to prioritized tasks only; never "go read every script in the system" (Tepperman's was the exception, not the rule) [04:28:26–04:29:47].
- Human-in-the-loop for all AI planning and execution; consultant explicitly pulls a task ("I want to work on task 24-1") rather than AI self-directing; AI-generated scripts reviewed before deployment; sandbox-first [04:29:47–04:31:25, 04:57:53–04:59:43].
- Scripting preferred over workflows unless the customer needs UI-based self-service — and even then, script parameters/custom-record config can serve that need [04:20:09–04:23:15]. New NetSuite features enter the playbook as alternates until confirmed [01:20:27].
- Autonomy/model fine-tuning postponed until the AI developer is onboarded [00:28:51, Gemini decisions].
- Auto-accept edits mode acceptable for working sessions; deploy actions still require explicit approval; bypass-permissions mode off-limits [00:30:02–00:31:09].
- SaaS/recurring-revenue business excluded from service focus [01:20:27].
- 44 Pro: future-credit concession approved (20–30 hrs), relationship preservation over scope dispute [05:16:35–05:18:51].

---

## 7. NOTABLE QUOTES

- [00:33:05] (artifact text, endorsed by room): the assessment "**comes up the same way no matter who runs it**."
- [00:26:47] Taha: "**Ultimately I want something that knows what to do with less of a prompt.**"
- [00:28:51] Taha: "When you develop your own tool... you can give it specific instructions that **on this task use this model, on this task use this model**."
- [00:14:35]-area Mike *(attr?)*: "The way we do business and the way we work evolves very slowly and **now all of a sudden it's super rapid**."
- [00:13:37] Taha: "When people receive those type of emails... people lose interest because it's like, **okay, this is computer-generated. I'm not going to closely read this.**"
- [00:15:34] Taha: "**AI is my assistant. It's not speaking for me.**"
- [00:59:26] (writing standard, read aloud): "**A burned client wants brass tacks, not a novel.**"
- [00:57:30] Taha: "If this was smart enough to come back and say, '**Hey, we've already done this and here's what we did**' without me having to ask — that's what it is."
- [01:14:23] Imran: "Build the knowledge base based on 100 projects Mike, Taha, everyone has worked on... **instead of me asking Taha or Mike, this database should at least give me step one, two, three.**"
- [01:52:44] Mike: "**Because AI can do it**... if you're putting it on my plate in the old days and said 'also add this,' I'd be like, 'f***, I can add an appendix.'"
- [01:58:24] Mike *(attr?)*: "If a human being is going to be involved in making sure it's stored here, there or the other place, **guaranteed chaos**."
- [02:09:32] Claude's own post-mortem, read aloud: "**I underweighted a thin-looking line relative to a loud one.**"
- [02:25:32]–[02:26:22]: "We're never going to get to 100%... **What we're doing right now is a dramatic improvement — infinitely more detailed and faster.**"
- [02:43:01] Tepperman's feedback: "**It felt like drinking from a fire hose.**"
- [04:14:36] Mike: "**We are most valuable when we are working with the customer guiding them towards decision making, not turning the nuts and bolts.**"
- [04:25:21] *(attr? Mike/Taha)*: "In the world of AI, **I'm not sure that the workflow interface will even exist once the NetSuite AI becomes intelligent.**"
- [04:59:43] Mike: "**In the execution piece I want to be extremely careful because we're touching the customer's system.**"
- [05:00:52] *(attr?)*: "With scripts... **unless you have some knowledge of what to catch, you're not going to know.**"
- [03:23:14] Imran *(attr?)*: "As soon as you sound apologetic... **the human being on the other side senses that and they capitalize on it.**"
- [00:30:02] Taha, on bypass permissions: "**That's like god mode... it might rewrite Windows for you.**"
- [05:05:29] Mike: "**Customers don't know what they don't know.** So when they say something generic like 'I want my Shopify integrated'... part of it's on us to dig further." (context: 44 Pro scope dispute)
- [00:16:30] Taha, reading Claude's run log: "It literally said **Mike hates M dashes. Make sure we go through, scrub all these dashes.**"
- [02:24:29] Taha: "**If it missed it and I missed it, then what am I checking against?**"
- [05:15:41] Mike: "I just asked it how it thinks it should be used for this phase, and it's like, 'well, I should first write the tasks over to Asana.' I'm like, **you're right. You probably should. I didn't think about that.**"

---

## 8. UNRELATED-BUT-REVEALING (client work observed → what an OS must support)

- **44 Pro (implementation dispute + kickoff)** [04:33:48–04:55:20, 05:16:35–05:18:51, 03:13:00–03:19:46]: Amazon Canada/Mexico/Brazil stores existed pre-go-live with minimal activity, never surfaced in scope; separate-menu navigation contributed to the miss; client UAT failed to catch it for 6 months; resolution = 20–30 hr future credit. Invoice artifacts jumbled (combined per-date comments not matching timestamps). Team simultaneously kicked off a 44 Pro implementation folder (pre-sales transcripts, BRD from Steve, day-2 notes at 84 pages) for Claude to derive SDF content overnight for Day 3. → OS needs: scope-of-record, UAT checklist generation, invoice/time-log clarity, external-system evidence mining (Seller Central first-order dates), sales→delivery transcript continuity, deliberately withholding later docs to "keep it honest" when testing AI derivation [03:16:11].
- **Shinesty (the day's live test case)**: existing heavily-customized account (client said ~200 scripts; actually 658–700), Shopify orders arriving without customer deposits → payout mismatches; customer deposit payment-link validation; member portal returns/exchanges; Amazon settlement reconciliation; inventory sync; month-end close; vendor prepayment workaround vs. native feature; Celigo integration layer deliberately deferred ("NetSuite-native first") [03:56:33–04:00:26]. Rapid assessment approved by client → the "what next after approval?" question drove the whole afternoon.
- **Grinds (manufacturing rescue)** [04:06:55–04:12:33]: legacy BOMs; base UOM in grams for liquids bought in gallons; item-master cleanup (unused items, wrong conversions) done manually via saved searches over multiple meetings — cited as the archetype of automatable prep work ("would have saved me and them time. That is something I can ask Claude").
- **Brixton** [04:23:15]: vendor pricing at 4-decimal precision rounded to 2 via two Claude-written scripts (item save + PO CSV import path) — the pattern for small script tasks including use case → plan mode → git project → SDF deploy → sandbox test [04:58:48].
- **Tepperman's** [02:43:01–02:54:25, 00:22:29]: huge stakeholder meetings (10–14 people per call); "fire hose" deliverable feedback; sales-order script sprawl (commissions, promotions, discounts, delivery, transfers) across departments and outside software; APM concurrency investigated via screenshots; Mike primes Claude with his own memory of the environment and asks for accuracy checks. → OS needs: workstream-segmented deliverables, per-audience views, APM data access.
- **Lole** [01:38:49–01:43:41]: Power Discount (their product) conflicting with a custom customer-level discount script for six months; price-level vs. discount-item debate; revenue-recognition compliance position — posting markdowns as discounts to inflate top-line revenue "is illegal" (validated with Hussein); the "why" behind config choices (auth-at-order/capture-at-fulfillment vs. customer deposit) is exactly what belongs in the playbook, not Oracle docs [01:08:55–01:13:35].
- **PSG** [04:46:22–04:48:34]: sandbox refresh/access and documentation challenges; client admin self-managing AI-built scripts and imports — both a support risk and a service-model signal.
- **Barbell / RMR / RM**: staffing churn at Barbell ("dumpster fire," warehouse manager gone) [04:48:34–04:50:34]; RMR's CFO created financial-term confusion (imprecise language on "cost") [04:50:34–04:51:45]; RM out of contract, meetings canceled [03:50:54]. → OS needs: client-contact history, relationship state, contract status tracking.
- **Foundry** [03:48:21]: outside contractor Vinnie's three-page technical emails for simple asks; Satchin meeting to keep "myriad of tasks" moving. → synthesis/summarization of inbound verbosity is a daily consulting need.
- **Homefield** [00:55:38–00:56:35]: five-year-old documents from a prior business era acknowledged as worth ingesting into the knowledge loop — institutional memory recovery.
- **Warehouse fire incident** [00:24:42, 02:01:11]: burned items found, ozone treatment maybe unneeded — ops runs over chat channels in parallel with the summit; the team reflexively checks Ron's channel updates mid-session.
- **Anderson Frank** [01:07:16, 03:04:21]: staffing-agency-intermediated engagements have different rate visibility — billing language must fork by channel.
- **Gemini/Meet/Granola/Notebook LM ecosystem** [00:02:03, 02:21:23, 02:18:46]: they run Gemini meeting notes, Granola on personal calendars, Notebook LM for project forensics — the OS must either subsume or interoperate with these capture tools ("if our tool is going to be the way to do things, we're going to need it [to do what] NotebookLM [does]").

---

## Coverage note

Read 100% of the file sequentially (summary notes lines 1–497; transcript lines ~499–6827; recording ends 05:32:26, transcript text ends ~05:18:51 with wrap-up). Sections skimmed for relevance but containing no tooling signal: cultural/Japan/Singapore diversion [02:28:50–02:36:30], sports/youth-athletics diversion [04:36:31–04:46:22], lunch ordering [03:34:51–03:46:41], flex-space/man-cave real estate [03:24:20–03:30:26], evening logistics [05:07:50–05:13:13]. Anything in those stretches with business relevance (office strategy, communication norms) was extracted above.
