# Day 4 (July 31, 2026) AI Summit — Product Feedback Mining Report

Source: `scratchpad/transcripts/day31.md` (Gemini summary notes lines 1-395, full timestamped transcript lines 397-2320, ending [03:46:05]).
Coverage: full file read start to end.

**Attribution caveat (applies throughout):** The Gemini diarization is badly interleaved. Only two mics (apparently Michael Flynn's and Taha Raja's) captured the whole room, so lines from Justin Lombardi, Imran Shabbir, and Ron Shaw are frequently mislabeled as "Michael Flynn" or "Taha Raja," and single sentences are split across both labels. Speaker names below are best-effort from context; "(attr. uncertain)" flags the shakiest ones. Long stretches from ~[01:44:55] onward carry a single "Taha Raja" label while clearly containing Justin, Imran, and Mike.

---

## 1. WHAT'S WORKING

- **[00:16:35]–[00:19:19] Tepperman's suitelet fix validated end-to-end (Mike + Taha recap, Justin involved).** Fed Claude a working-session transcript plus the Asana task number from the rapid assessment; it identified ~7 pain points in the price tag printing suitelet, "and it it nailed it. Wow." Proposed code changes were tested and deployed to sandbox the same day. "Point is, we didn't have to tell it much." Concrete wins: reprint flag fix, results-per-page converted to a droplist that "is not a deployment change and it automatically refreshes," removed an unused filter the client said they hadn't used in years, added a class filter, made the item filter a multi-select.
- **[00:18:31] Most fixes were trivial code changes** ("like an else that was needed") — low-hanging fruit is real and fast.
- **[00:21:17] Speed:** the whole suitelet exercise done "in a day. Just us first try," with the expectation it "will get faster."
- **[00:36:42]–[00:39:28] 44 greenfield implementation flow worked:** loaded only pre-sales/discovery calls into `source/`, had Claude produce an implementation plan, then push configuration. It enabled a base of features itself and "looked at the recordings and said these are the features we're going to need. I'm going to turn them on" (multi-location inventory etc.), and where it couldn't (circular references), "it documents it for you" — "I can enable these, you'll have to enable these three."
- **[00:43:14]–[00:44:17] Role permission iteration (Mike):** installing the Script Reader role into an account missing modules, "it iterated, found the differences and updated the role to their needs... 'these permissions do not exist here'... And then it kept on going. Wow." Called "awesome" live.
- **[00:57:32] Self-reporting of scope:** Mike asked for an overview and got a clean breakdown of what was done via SDF, what via MCP, and what took manual intervention. SDF enabled base features, A/R, accounting periods, assemblies, landed cost, matrix items; MCP renamed the default subsidiary, created the second, updated address, created nexus.
- **[00:59:11]–[01:12:28] Chart of accounts load from a raw client file (Taha/Justin).** Input was Ron's multi-tabbed Excel doc NOT formatted for NetSuite (included classifications, locations, departments, classes). After iterative Q&A on system-account mapping: "126 accounts created or renamed into full three-level hierarchy. 113 brand new, 11 system accounts renamed, renumbered... 13 demo accounts renamed legacy and inactivated to clear name collisions. 77 remaining demo accounts inactivated, subsidiary assignment fixed on 11 reused accounts." Verdict: "looking at this from what I know of their live account, it's pretty spot-on."
- **[01:10:30] Benchmark vs. the old way:** "Remember how many back and forths we had with RMR just to get the chart of accounts numbers list. I think it took us weeks to do this."
- **[01:16:20]–[01:18:39] Script Reader toolset praised:** "it actually has four skills... which has been extremely extremely helpful specifically at like Tepperman's." The four read-only tools (readScriptSource with line-range paging, listScripts with filters, readFile for file-cabinet text files with binary refusal, getScriptDeployments) close the gap that "the file cabinet's content isn't exposed to SuiteQL."
- **[00:47:45]–[00:51:54] Implementation methodology upgrade validated:** manual enable-features walkthroughs with clients declared "a complete waste of time" (Taha, agreeing Mike); AI pre-configuration lets walkthroughs be "very pointed to the customer's needs," and an order-to-cash cycle that "took six to seven weeks can be some hours now" (attr. uncertain, Mike/Taha interleaved).
- **[01:24:16] Overall verdict on the implementation test:** "this last part has been the most promising part... good first test. Is it great yet? No, but it's a first pass and we ran it through some walls and we pulled around them."
- **[01:29:25]–[01:30:30] Executive summary skill (Taha):** four executive summaries already produced for different customers; "the document looks great, the content looks great" (2–4 pages). Mike on the 44 one: "what you did for 44 was pretty good."
- **[02:11:08]–[02:14:24] Tepperman's executive summary live run (Justin, attr. uncertain):** "all this stuff is accurate and and very good." It caught rescheduled/slipped sessions with cause ("rescheduled multiple times due to client attendee availability") — "I like that it does that because if they keep moving it and then they come back and say oh we never did that... it's important that it's in there."
- **[02:38:47]–[02:39:54] Cross-referencing meetings vs Asana:** the summary's "action items not yet visible in Asana" section found real work done but never recorded (Justin's demand-planning comparison forwarded by email only) — "not only are we going to be able to produce something that gives a good overview, it helps us better understand how to put in better notes."
- **[02:26:42] APM analysis win (Justin, attr. uncertain):** a client asked whether they needed more SuiteCloud Plus processors/concurrency; analysis of APM screenshots concluded "basically no, you're good, it's the scripts screwing you."
- **[01:03:49] Playwright's sweet spot identified:** works well when "you're in the middle of designing something with UI... you want Claude to just open it up and check it itself and see did I do a good job of putting that button where it's supposed to go."
- **[03:20:57] Rapid assessment transformation (Imran, attr. uncertain):** "spending eight hours creating from my notes a rapid assessment... using a transcript and spending 2 hours is a transformational change in my opinion." Also [03:24:08]: pre-kickoff MCP analysis means "before the kickoff call they're asking you questions which nobody even asked."
- **[00:29:30] Plan-mode as use-case generator (Taha):** GSD / built-in plan phases produce "your use case document... it'll put assumptions, it'll ask questions" — plans double as client-approval and institutional-knowledge artifacts.

---

## 2. PAIN POINTS & FAILURES

### Onboarding / provisioning / access
- **[00:00:31]–[00:01:55] Remote colleague dead in the water.** He hit errors following "Mike's document" (how-to-perform-the-assessment); the doc exists in two places ("in the Atlanta thing" and "our assessments folder"); it turned out he was never granted a license/access at all — "that would be pretty confusing if you tried to follow those instructions." Mike also never sent him the login link ("he said I didn't send him the link to log into CL").
- **[00:53:37] Same colleague's triple blocker:** personal Claude account needs merging, a CLI issue, and Google Drive access to the assessment folder failing ("his error is a G drive" — likely missing Drive for Desktop streaming).
- **[03:03:18]–[03:06:20] Account-merge quirks:** personal accounts under the same domain can merge; different domain cannot. Justin's Gmail vs justin@powercloud confusion; Taha juggles dual logins (FMW team account + Power Cloud) by switching accounts. "Those things may be things we need to talk about with all team members."
- **[03:01:04] Documentation alone fails:** "if we just roll it out with documentation — prime example — he ran a roadblock and now he's not doing anything until I get with it." [03:02:19] Skill levels vary widely (Maria: "So what is MCP and what does that do?"); baseline expectations need a hands-on mandatory session.
- **[01:44:55]–[01:46:41] Skill discoverability:** Imran (attr. uncertain) couldn't see the executive summary skill in his UI; needed walk-through of where skills live, that a skill is a slash command, and that it should self-invoke "but I just do it explicitly."
- **[01:50:15] Prompt copy bug:** Justin's prompt "was messed up. It says 44 and then it says Tepperman's" because he copied Taha's 44 prompt — per-client parameterization is fragile.

### Usage limits / tokens / model management
- **[00:01:55] "I just kicked off the 44 thing again. I told you... I was out of usage."** Overnight CoA run died on usage limits [01:10:30]: "I tried to run it last night and I ran out of tokens."
- **[02:24:14] Justin hit his daily limit mid-exercise.** Mike: "this is on my to-do list... how much usage we'd actually need here... it might be cheaper to give you guys a higher seat or it might be cheaper to just allow some overage. The truth is I have no idea."
- **[02:25:27] Model picker confusion:** "Is Opus 3 higher than 4.6? ... they changed so much I'd have to go look it up." Effort setting was silently on high: "It was on high effort."
- **[02:52:28]–[02:53:28] Top-up didn't take:** after Mike granted "$5 worth of usage" the app still said limit reached; suspected logout/login needed.
- **[03:36:55] Forgot to downshift model:** "we bumped it to Opus 5 just to do a deeper dive into accounting practices... I should have immediately backed it back down and I didn't. I only ran a couple commands after that, but it was like boom, you're done."
- **[03:38:17] Token limits are a black box:** "they publish it in proportion... nobody really knows. It's a little bit of a black box, but again, I think by design." Fable "is almost on its own meter... its own pool" [03:39:14] — reason they avoided Fable during the summit.
- **[01:56:46] Token-burn worry about broad scanning:** "if it starts scanning everything then are you burning tokens?" (Google Chat scanning).
- **[00:04:01] Wrong-account token anxiety:** "Wait, s***, I'm in the wrong freaking cloud because I was logged into one, not the other" — personal vs org billing hygiene.

### NetSuite SDF/MCP capability gaps hit live
- **[00:40:15]–[00:41:58] Accounting preferences are fully inaccessible** to SDF/MCP ("it does not have access to any of the accounting preferences") — must be manual; team rationalized it (accounting black box, deliberate protection) but it's unverified guesswork.
- **[00:39:28] Circular-reference features** can't be enabled by the tool; **supply allocation** needs a data check even with no data.
- **[01:00:57] Manual interventions list:** inventory, multi-location, advanced shipping/receiving, token-based auth, custom records, "use account numbers" (an accounting preference). MCP role lacked "list subsidiaries" permission — couldn't even read subsidiaries until it was added (fed back to Mike for the SDF role).
- **[01:07:07] Silent failure:** "SuiteFlow I enabled it but they came back not enabled." Also blocked/not done: 2FA policy, IP security ("no API path there"), admin email reassignment, location/department/classes explicitly deferred.
- **[01:01:50] Cannot install SuiteApps:** "installing a suite app feels like a bridge too far" — so the MCP SuiteApp + role install stays a manual bootstrap step. [00:37:45] A blank account needs ~5 manual settings before SDF can even connect.
- **[00:56:27]/[00:54:32] Demo account problems:** 90-day expiry, need to keep alive; the "blank" 44 demo account wasn't blank — "it had a chart of accounts loaded into it for some reason... what clouded us yesterday" — created name collisions the AI had to clean up (77 demo accounts inactivated). AFA dataset not available with NetSuite Next; demo accounts lack SCM/WMS, which "dramatically held us up on Bomb Party."
- **[01:12:28] Questionable AI decision needing review:** "one system account deferred revenue deactivated. I don't know why we would have done that... it'll become a problem." Undeposited funds still needs a number manually.
- **[01:00:02] Interaction design flaw:** CoA loader ASKED the consultant what to combine with system accounts instead of proposing — "which caused confusion... we teach it: propose, and then the consultant can make a decision."

### Playwright / browser automation
- **[01:03:49]–[01:07:07] Fails on fuzzy, variable UIs.** FMW vendor-site scraping: "If it opens Edge, it can't find it. If it opens Chrome, it can find it... The AI is having trouble making the decision in the gray area"; form-A/form-B variation on the same record type "would shut itself down." Taha: "this is endless endless amount of instructions and I'm back to programming again." Decision: defer Playwright this iteration.

### Executive summary skill defects seen live
- **[02:28:22]–[02:31:40] MSP leakage:** Tepperman's summary referenced MSP/billable flags although the client has no MSP contract; root cause: MSP logic hard-coded in BOTH the sample prompt and the shared skill. Concern raised (Justin, attr. uncertain): "I'd rather not update a skill that we're all using for every customer" without review.
- **[02:21:51]/[02:26:42] Missed context:** summary said "no defined next steps" although the last Asana update comment literally had a "next steps" section; missed remaining subtasks.
- **[02:10:17]–[02:16:22] False "yellow / at risk" health:** early-stage projects with loaded-but-unstarted tasks read as lagging ("only 5% complete"). Root cause is Asana data hygiene: blank statuses, no "not started" label, no due dates, sections not used consistently. "Classic rule of data... s*** in, s*** out."
- **[02:23:00] Format drift:** Taha's and Justin's outputs differ; "there should be some standardization in the template also because mine looks different from his."
- **[02:23:00] File-context boundary:** the hours CSV uploaded in a different chat was not available in the new project — had to re-provide.
- **[01:29:25] Validation bottleneck:** "I can't validate it because only the consultant who's working that could validate that."
- **[02:44:08] One-way flow:** answers given in Claude don't propagate back to Asana; "I don't want you to make a change in the document without Asana being aware."
- **[02:35:40] Meeting-name garbage-in:** recurring calls all titled "NetSuite work session" make the summary misleading — "That's an administration thing on our end, not a Claude thing."

### Data-input friction
- **[01:39:16]–[01:48:44] Hours data is manual:** consultants lack permission for the Power Cloud NetSuite MCP connector, so hours come from a manual employee-center CSV export per client, filtered to the previous two weeks by hand.
- **[01:58:51]–[02:00:13] Licensing wall:** employee center roles cannot be given MCP/API permissions ("I've tried it, dude. It just doesn't allow it... by design"); full user licenses would be needed. Counterpoint floated: "as long as the MCP connection doesn't get any more permissions than your employee role, why shouldn't it be able to connect?"
- **[01:30:30] No Google Chat connector:** chat data excluded from summaries; [01:56:46] group vs individual vs sub-team chats complicate it.

### Process / organizational
- **[00:26:41]–[00:28:37] Dev queue congestion (Foundrae):** client keeps piling on requests — "it would really help if you'd stop putting f***ing cars on the tollway"; a bandwidth hire lasted a week ("we had to move on with Shabbir" — attr./name garbled). AI-shortened dev cycles are the hoped-for fix but handoff latency ("now we're in the queue... for a week") is a live pain.
- **[00:55:36] Context-free partner handoff:** handing the Bomb Party WMS demo need to NetSuite "got very convoluted and they began trying to sell a whole bunch of other s***... they didn't have the context of everything I had just walked through on site."
- **[03:39:14]–[03:40:15] Hours-logging confusion for internal AI work:** no task/customer code exists; "The PC internal hours doesn't have a task for this"; Taha to put the right code in chat.
- **[03:07:25]–[03:08:23] Silo risk observed in the room:** "the thing I did for GW — nobody else knows that I did that" (Justin, attr. uncertain; used jQuery data tables no one else uses).

---

## 3. EXPLICIT FEATURE REQUESTS & IDEAS

1. **[00:23:56]–[00:24:56] "Send to development for approval" button** in the future portal: Claude drafts a change, a button routes it to the dev team, on approval "it just executes it and pushes it," with dev's own internal validation steps. Goal: make the consultant→dev turnover cheap so governance doesn't cost speed.
2. **[00:44:17]–[00:45:56] Script Reader in the standard install package:** "the script reader should probably just be in the package that we have here... it should just know to install that automatically." Consensus yes (read-only), with client-permission language embedded in the MSA plus an inform-at-install notification.
3. **[00:45:56]–[00:46:49] Automated pre-kickoff MCP access email:** when sales introduces the consultant, an email "just fires off" requesting MCP install/access before the kickoff call.
4. **[01:00:02] CoA loader should PROPOSE system-account mappings** rather than ask open questions; make that standard skill behavior.
5. **[01:13:48]–[01:15:02] Agent feedback loop / self-updating knowledge base:** "every time we make a call or a decision... update its own knowledge base." Rule proposed: MCP/SDF capability learnings get recorded automatically; business-process/customer decisions trigger a question — "ask me if this is a best practice that should be added to our best practice list or if this was a one-time customer decision."
6. **[01:25:11]–[01:26:56] Setup playbook to kill run-into-the-wall discovery:** Ashot to compile a playbook for SDF + MCP setup ("if you have to enable four features just so that it can turn on two, it probably makes sense for you to click all five boxes"); outline manual features up front, hook SDF, install MCP app, then "what's next? Boom" — even spawn an agent for the next step [01:26:56].
7. **[01:22:24]–[01:24:16] Integration monitor in the portal:** "a Celigo monitor for every account we have... in a broader sense, integration monitor... in this integration tab, which are the systems that we're monitoring for this client, and the AI is aware of all this." Prereq: configure Celigo MCP server (44 sandbox as test bed, permission already granted [01:21:18]).
8. **Executive summary skill enhancements (the largest cluster):**
   - **[01:42:33]–[01:43:29] Interview component:** the skill asks the consultant what's next, reconciles Asana vs the rapid assessment document, and accepts "no, that was purposely deferred."
   - **[01:43:29] Deferred/nice-to-have tracker:** resurface items floated earlier in the project when hours dip ("this customer is on MSP, they're not using many hours right now" — even the joke item, "NetSuite makes coffee for them").
   - **[02:30:14]–[02:32:39] MSP handling via project-level instructions**, with the skill amended to "pay attention to the instructions to determine whether you need to break it down by MSP."
   - **[02:33:45] Trailing two FULL weeks** hours window regardless of report day; tool should know each client's executive-call weekday and auto-generate the night before / morning of.
   - **[02:42:55]–[02:45:14] Draft→polish two-step workflow:** generate into a private draft view; consultant reviews, updates Asana, regenerates or edits; "upon approval it moves to a customer-facing folder or something like that... kind of like the working and deliverables" split. Sections 5/6 (risks/untracked) stay internal.
   - **[02:44:08] Bidirectional Asana sync:** corrections made in the Claude conversation must make it back to Asana ("maybe it can already fix it in Asana for us").
   - **[02:50:32]–[02:52:28] Auto-generate a 4–5 slide PowerPoint** from the summary for the executive meeting, using the team-level brand guidelines markdown ("It should always follow the brand guidelines").
   - **[02:16:22]–[02:18:07] Not-started segregation:** standardize an Asana "not started"/section convention and teach the skill to move those to a future-state section "so it's not jumbled" and doesn't generate "nobody's worked on this for two weeks" noise.
   - **[02:21:51]/[02:26:42] Parse subtask statuses and latest update comments** for next steps.
   - **[02:23:00] Standardized output template** across consultants.
9. **[01:40:33]/[01:58:51]/[02:01:27] Automate hours ingestion:** "build it so it just uses an API call... put the customer ID somewhere in the tool and it'll know how to go into NetSuite and find the tasks"; alternative floated: schedule the NetSuite dashboard to email hours weekly/bi-weekly; alternative: an API token embedded in the skill/script.
10. **[02:18:07]–[02:20:46] Claude Projects as the per-client container:** shared projects per client (e.g., "Tepperman's weekly executive") in the Power Cloud org so "other people can see it and run it"; put the primary prompt into project instructions; trick shared live: "take the prompt, put it in a chat and say 'Format this as project instructions'... and just write 'Give me the weekly assessment.'" Skill = 80–90% generic, project instructions = the remaining 10–20% client-specific [02:18:07].
11. **[02:59:52]–[03:01:04] Meta-analysis of the summit itself:** run the week's recordings, resulting documents, skills, and instructions through Claude in a separate subfolder of the assessments folder — "What are we missing?... make our current tool set a little bit closer to what we're trying to get to."
12. **[03:01:04] Folder structure decision (Mike owns):** "figure out exactly what the folder structure needs to look like... we can use the project folder on some level, but do we need to move the source documents? Open question."
13. **[03:35:31]–[03:36:55] Model routing / good-better-best:** "You don't need Fable to write a PDF... you go to the oldest model in the world to put that into a PDF file"; the portal should handle model handoff points so consultants don't have to; "which at what point should it hand off... good better best."
14. **[01:37:00] Proactive account health check:** "add the MCP server as a way for Claude to even look in their system saying, 'Hey, is everything okay? Are there any major red flags?'" and proactively message the customer with findings as visible value.
15. **[02:56:56]/[03:25:10]–[03:27:37]/[03:43:37] Dormant-account discovery agent:** "for even a relatively silent customer, as long as we have access and we're still under contract, let the AI do some discovery periodically and give you some thoughts"; lifetime transcript history feeds it; offering MCP setup itself is the door-opener to revive dormant accounts.
16. **[01:07:07]–[01:09:25] Interview-script for junior setup execution:** an interview produces a click-script "junior personnel or an AI could follow" — acknowledged as aimed at simpler deals than Power Cloud's usual $100k+ segment.
17. **[00:33:22] Solution documentation registry:** "some sort of table of contents for our solutions — the documents just get stored on the script record or something like that."
18. **[00:29:30]–[00:32:22] Plan documents as client-facing use cases:** initialization + plan prompts produce use-case docs with assumptions/preconditions; assumptions become the contract ("in order for this script to work you must have checked this checkbox"); deliver to client for approval, hand implementation plan to dev.
19. **[01:20:07] Retro-evaluation of design decisions:** feed the matrix-items working session in and ask "did we make the right decision?"
20. **[01:53:26]–[01:54:30] Asana replacement / lighter-weight ticketing:** email-to-ticket generation ("even the email comes in, it generates into a ticket"), auto-post group addresses into the tracker, possibly "a different repository than Asana... something lighter weight or something we build."
21. **[00:54:32] NetSuite Next demo account for everyone** (nonprofit dataset requested since AFA unavailable); [02:53:28] "Everybody in this room should now also have access to an account with NetSuite Next on it."
22. **[01:37:00] Customer mood tracking:** "customer mood is something we have to solve. I think that's still important" — flagged as unsolved input to summaries.

---

## 4. IMPLICIT NEEDS (nobody proposed a tool, but the evidence begs for one)

- **Provisioning checklist/automation:** three separate people hit onboarding walls (license never granted [00:01:11], login link never sent [00:02:XX], Drive access missing [00:53:37], merge confusion [03:05:27]). An "is this consultant fully provisioned?" gate would have prevented a lost week.
- **Single canonical home for process docs:** "Mike's document" lives in both "the Atlanta thing" and the assessments folder [00:00:31] — duplication caused the first support ticket of the day.
- **Usage/limit observability:** repeated silent stalls (overnight run died, Justin capped, top-up not registering). Nobody can see burn rate, remaining quota, or model/effort cost implications; owner does manual $5 grants. [02:24:14]/[03:38:17]
- **A verified capability register for SDF/MCP:** the team keeps re-discovering the same can't-do list (accounting preferences, SuiteApp install, circular features, employee-center roles). The proposed playbook (item 6 above) is this; today the knowledge lives in Taha's and Mike's heads and one readme.
- **Runbook for blank-account bootstrap:** "literally five settings" must precede SDF connection [00:37:45]; known but undocumented at the time.
- **Asana data-hygiene conventions enforced at entry:** statuses, sections, owners, due dates, attachments to tasks ("that one honestly belongs in the task" [02:41:50]); every summary defect traced back to input hygiene. "The executive summary will be as good as the data behind it" [02:15:16].
- **Meeting-title conventions:** recurring "NetSuite work session" names make reports unreadable [02:35:40].
- **Cross-consultant activity visibility:** Justin's GW build was unknown to the team [03:08:23]; "consequential conversations or things you do at the client side without letting your colleague know" — the shared folder/knowledge-base structure is named as the fix [03:09:39]: "anybody else continuing a conversation in that same folder will be talking to a being that understands it."
- **Skill governance / change control:** live tension between fixing the shared skill vs per-project instructions vs one-off memory ("save that memory... don't reference MSP for this customer") [02:31:40]; no versioning/review process exists for shared skills.
- **Output validation workflow:** only the lead consultant can verify a generated summary [01:29:25]; there's no structured check step, just eyeballing.
- **Parameterized per-client prompt templates:** the 44→Tepperman's copy/paste bug [01:50:15].
- **Handoff artifact standard (use case vs implementation plan):** debated but unresolved what exactly goes to dev [00:30:40].
- **Client-consent workflow baked into engagement start:** MSA language + notify-at-install for MCP/Script Reader [00:45:03]–[00:46:49]; currently ad hoc and mid-cutover ("old agreements, but new...").
- **Institutional knowledge preservation:** Tepperman's example — "a lot of this internal knowledge is lost to time"; build/handover documents so knowledge "can be passed on from person to person" [00:32:22]–[00:33:22].
- **Internal-hours task codes:** nobody knew where to log AI summit hours [03:39:14].
- **Change-anxiety communication:** layoff fear is live in the broader team; "without information people create their own and usually it's wrong" [03:13:07]–[03:14:06]; rollout plan needs the human-element track, not just tooling.
- **Mentality/training gap for non-power-users:** "I'd ask Claude to put a training thing together — I don't know why I didn't think of that" [03:06:20]–[03:07:25]; default-to-AI habit isn't universal.
- **Accessible shared data drops:** "if it's in an accessible place that we don't have to download it and provide it" (hours, exports) [01:56:46].

---

## 5. BUSINESS & STRATEGY SIGNALS

### Governance, liability, guardrails
- **[00:21:17]–[00:22:55] Liability framing (Mike):** "one small bit of damage... will be a liability of $1 million to my company... that one single incident will pay for 10 years of your time." "I would rather burn three-four hours" of review than have an incident (Taha, attr. uncertain).
- **[00:20:17] Risk gradient articulated:** user-invoked suitelets ("I pull up the screen, I choose what to execute") are less scary than autonomous background scripts "ripping through 10,000 records."
- **[00:22:55] "It's not my sandbox. It is their sandbox"** — client environments stay protected even in sandbox; "I'm not going to jump to the end zone without going through the steps."
- **[00:19:19]/[00:28:37] Consultant/dev boundary:** consultants design and plan; development deploys. "I would have paused before we actually started writing the code, told Claude to write up a detailed plan and handed that off to development." Three-phase discipline: plan → test/validate → execute.
- **[01:01:50]–[01:02:45] Anti-complacency principle (Taha):** "managers get lazy when they turn over responsibility... AI is not going to take responsibility... the buck stops at you."
- **[00:24:56]–[00:25:53] War stories fueling caution:** plaid/bank reconciliation agent "made an assumption and started doing three things. I had to stop it"; news stories about AI deleting data / "escaped and attacked a competitor."
- **[00:23:56] Epistemic humility:** "even after this exercise we barely know what AI can and cannot do. We're still starting this journey."

### Pricing / utilization / business model
- **[02:54:30]–[02:55:56] Imran's W/B (worked/billed) math:** with AI a 5-hour task becomes 2 worked; billing 5 for 2 worked was ruled out ("the answer was no"); path to the same 21 billed hours = more projects (4→8) and/or new opportunities per project.
- **[03:19:32]–[03:23:06] Stages of the squeeze (Imran, attr. uncertain):** T&M era → AI era where "the same amount of work was being done in two hours but we can still charge five... customers don't know" → "customers also know about this too... it's going to get worse." Big 4 anecdote: firm announced AI-accelerated audits, "at their next quarterly meeting they basically came in tears" because customers refused old pricing.
- **[03:23:06]–[03:24:08] Value thesis (Taha/Mike):** rapid assessment won't drop from 20 hours to 4, "the efficiency is not going to be there but the quality, consistency, standardization... and the density of information will increase"; optics/trust improve ("before the kickoff call they're asking you questions which nobody even asked"); token cost is a new expense line. End goals: increase revenue, decrease cost, or save time [03:24:08–03:25:10].
- **[01:31:56]–[01:33:09] MSP/retention logic:** "everybody's going to be on managed services even during the implementation phase"; weekly/bi-weekly executive touchpoints exist so the client doesn't conclude "I don't really need these guys" at renewal.
- **[01:35:57]–[01:37:00] Reporting value gap:** "there's a lot of consultants who just meaninglessly put green, nothing to report. When I go to MCP and ask what happened in two weeks, there's a lot to report on." Mike: "nothing makes me happier than all green check marks for weeks and then a call from a customer that nobody's helped me out for weeks" (sarcastic).
- **[03:27:37] Anderson Frank data point:** "you guys have 50 clients... but your hours don't reflect the number of clients" — dormant accounts are latent revenue; every consultant "might say you have four projects but you really have eight to 10."
- **[02:56:56]–[02:58:48] Proactive-consultant thesis (Taha):** "in this day of AI it's not just about efficiency. It's about opening new doors"; "the bell curve applies to those people who use the AI this way or not"; consultants must move from task-level operators to advisors — "those days are gone" [03:28:44].
- **[00:34:40]–[00:35:43] Upmarket ambition:** consultants must become "McKinsey-level strategic thinkers... McKinsey charges $1,000 an hour. They do that level of consulting and you have to elevate yourself to that level."
- **[03:28:44] Durable moat claim:** clients "will always need you... a third person to look at the system" because "the lack of bandwidth in the human mind to understand huge amounts of data and make good statistical decision is a human weakness" (verbatim says "that AI cannot solve" — likely mis-transcribed; context says AI+consultant solves it).

### Partner / competitive positioning
- **[03:29:48]–[03:31:02] Anthropic partnership:** "we're trying to become an Anthropic partner... we are conditional right now"; team certifications needed "to increase credibility to make sure that we keep our partnership." AI certification framed as the new ERP certification. Architect exam judged very hard; partner portal education to be shared with everyone [03:32:18].
- **[00:56:27]–[00:57:32] NetSuite Next:** skepticism about current capability ("what they showed last year was more reporting... I don't think it's making changes"); expectation NetSuite will eventually pre-configure accounts from pre-sales blueprint data [00:51:54]; "everything has a window... if we are the first one we have that first-mover advantage for like six months" — continuous methodology refinement is the defense. Curiosity about which engine/agent powers Next.
- **[03:34:28] Vendor-relations realism:** "these are private for-profit companies... just like how we keep in mind about Oracle... we should be saying that about Anthropic as well" — advising clients on model choice is part of the job.
- **[03:32:18]–[03:33:18] Content vetting:** third-party AI content creators "most of them are out of date already"; Boris Cherny cited: obsession with prompt engineering is "nonsense... you shouldn't be paying somebody to be a prompt engineer."
- **[00:51:54]–[00:52:49] Market segmentation:** NetSuite's free/starter "enablement" implementations vs Power Cloud's "$100,000 deal type of customers" — the tool is aimed at complex implementations, not the $5–10k segment [01:09:25].

### Client expectations & consent
- **[00:45:03]–[00:46:49] Consent norm:** even under a signed MSA, "when you do install anything in the client's computer... you need to inform them that you're doing this," with option to decline; MCP install request goes out before kickoff via sales intro email.
- **[03:22:18] Clients openly ask to use AI:** "my customers asking to use AI... it's not like a hidden tool under my toolkit."
- **[02:12:30] Tone in client-facing automation:** deflection idea — "no judgment, this is just an automated generated summary."

### Team & rollout
- **[02:58:48]–[02:59:52] Full Claude rollout decided** — "that's our tactical black and white"; only two people left without access.
- **[03:03:18] AI formally announced as a required tool** for project work; rollout limited initially to assessment piece + executive summary + projects/skills basics ("I don't think we need to roll out the implementations piece yet").
- **[03:07:25]–[03:09:39] Silo risk named as a top rollout danger** with folder structure/shared projects as mitigation; "communication is the boon of problems 80% of the time" (sic).
- **[03:12:00]/[03:18:32] Agentic engineer sequencing:** after rollout, "turn some of our attention to our agentic engineer and letting him take a pass through it first"; deploying agents to do work is explicitly "the third step."
- **[03:13:07]–[03:16:18] Anxiety management:** layoffs in the news, dev team "thought for sure they were going to get [laid off]"; transparency mandated; also bubble-risk realism: "you can't perpetually lose billions of dollars and stay in business."

---

## 6. DECISIONS & NORMS AGREED (final-day commitments, with owners)

### Process/technical decisions
1. **Revenue/channel standard:** one income account + channel segmentation; never per-channel GL accounts [00:10:53].
2. **ARM Essentials is the standard recommendation** for complex subscription/deposit clients; workarounds (customer deposit + billing schedule) are fragile and demand human-in-the-loop [00:11:39]–[00:12:34].
3. **AI development governance:** plan → validate → execute; consultants hand AI-generated code plans to development, do not deploy themselves; the line will move "as we gain confidence in not only the technology but in our process" [00:28:37]–[00:33:22].
4. **Playwright deferred** for the current iteration (reliability/complexity) [01:02:45]–[01:03:49].
5. **AI executive summaries replace manual weekly consultant reports**, built from trailing two-week data [01:35:57].
6. **Cadence:** bi-weekly executive meetings for steady-state, weekly for fast-moving projects [01:40:33]–[01:41:35].
7. **Trailing two FULL weeks** for hours in every summary regardless of generation day [02:33:45]–[02:34:55].
8. **Dedicated 30-minute PM/executive calls** separate from working sessions; agenda + hard stop announced at start; recap of agreed tasks at end to chain meetings [02:46:16]–[02:49:24].
9. **Claude Projects adopted** as the standard for shared, per-client instruction sets; skill stays generic (80–90%), client specifics live in project instructions [02:18:07].
10. **MSP logic moved to project-level instructions;** Taha updates the skill to read instructions for MSP determination [02:31:40]–[02:32:39].
11. **Asana hygiene:** standardize "not started" statuses/sections and a uniform task classification scheme across the team [02:15:16]–[02:18:07].
12. **Script Reader becomes part of the standard engagement package**, with client notification at install; MSA to carry methodology language [00:44:17]–[00:45:56].
13. **Full Claude rollout to all team members; AI formally required for project work** [02:58:48], [03:03:18].
14. **Executive summary goes live now, iterate in production:** "I don't think the process needs to be finalized, but it needs to be started to be used"; standard process for everybody/every project in the near future [02:45:14].

### Commitments with owners (from transcript + Gemini next-steps list)
- **Everyone:** submit hours by the 31st; run the executive summary for one of your own clients this session (Justin → Tepperman's for Monday's call; Imran → Grinds) [01:39:16], [02:01:27].
- **Mike:** forward the colleague's error documentation to Taha; provision/roll out Claude to all team members and guide account merges (with "Besh"/Beves); assist the blocked colleague (merge, CLI, Google Drive); figure out the folder structure question; share partner portal access for certifications; schedule the follow-up; analyze seat-vs-overage usage economics [00:53:37], [03:01:04], [03:03:18], [03:32:18], [02:24:14].
- **Taha:** refine SDF configuration steps for new accounts; provision the NetSuite Next demo account to everyone when it lands; configure the Celigo MCP server; synthesize the 3 days into a dev-team process and hand it plus raw materials to Ashot; update the executive summary skill (MSP via instructions); reformat the exec-summary prompt as reusable project instructions; close the demand-planning Asana task, record the vendor-prepayment subtask; specify internal hours code in chat; run Bomb Party WMS notes through the system; contact the software consultant in Charleston; pursue dormant-account MCP outreach [00:54:32], [01:22:24], [01:24:16]–[01:25:11], [02:32:39], [02:19:12], [03:39:14], [03:12:00], [03:43:37].
- **Ashot (dev):** update the Claude interface/tooling and compile the SDF + MCP setup playbook to prevent deployment roadblocks [01:25:11].
- **Group:** sandbox walkthrough with the client (Tepperman's changes) [00:35:43]; next-week functional-area session (order-to-cash or procure-to-pay) [01:13:48]; matrix-items decision review [01:20:07]; analyze the week's recordings/docs for tool improvements [02:59:52].
- **Meetings scheduled:** provisioning meeting for un-provisioned team members early next week; full-team mandatory AI education/alignment meeting **Wednesday the 12th** (calendar holds placed in-session) [03:17:36]. (Gemini's "June 12" is an error; context says August.)

---

## 7. NOTABLE QUOTES (verbatim, for the roadmap doc)

- **[00:22:04] Michael Flynn:** "One small [bit of] damage... will be a liability of $1 million to my company... that one single incident will pay for 10 years of your time."
- **[00:16:35]–[00:17:43] (Taha, attr. uncertain):** "and it it nailed it. Wow." / **Mike:** "Point is, we didn't have to tell it much."
- **[00:23:56] Michael Flynn:** "Even after this exercise we barely know what AI can and cannot do. We're still starting this journey."
- **[00:24:56] (Mike/Taha interleaved):** "There's like a 'send to development for approval' button. And then when they approve it, then it just executes it and pushes it."
- **[00:47:45] Taha Raja (on client walkthroughs of enable features):** "I've come to the conclusion that that is a complete waste of time."
- **[00:51:54] (attr. uncertain):** "But now — [what] took six to seven weeks can be some hours now."
- **[01:02:45] Taha Raja:** "Managers get lazy when they turn over responsibility... AI is not going to take responsibility, right?"
- **[01:07:07] Taha Raja (on Playwright scraping):** "This is endless endless amount of instructions and I'm back to programming again."
- **[01:10:30] (Justin/Taha):** "Remember how many back and forths we had with RMR just to get the chart of accounts numbers list. I think it took us weeks to do this."
- **[01:35:57] Taha Raja:** "We've been asking for this but we've not had the ability to crunch through the data."
- **[01:36:xx] Taha Raja:** "There's a lot of consultants who just meaninglessly put green, nothing to report. When I go to MCP and ask what happened in two weeks, there's a lot to report on."
- **[01:37:00] Michael Flynn:** "Nothing makes me happier than when somebody's giving me all green check marks for weeks and I get a call from a customer that nobody's helped me out for weeks."
- **[01:52:20] (Justin, attr. uncertain, on Asana):** "It just cost way too much money for what it is. It makes me angry."
- **[02:16:22] (group):** "It's the classic rule of data, right? ... s*** in, s*** out."
- **[02:45:14] Taha Raja:** "I don't think the process needs to be finalized, but it needs to be started to be used."
- **[02:58:48] Taha Raja:** "In this day of AI it's not just about efficiency. It's about opening new doors."
- **[03:07:25] Taha Raja:** "When you have an AI agent that helps you do many things, you start operating in a silo more and your collaboration effort with your colleagues actually reduces."
- **[03:09:39] Taha Raja:** "Anybody else continuing a conversation in that same folder will be talking to a being that understands it."
- **[03:20:57] (Imran, attr. uncertain):** "Spending eight hours creating from my notes a rapid assessment... using a transcript and spending 2 hours is a transformational change."
- **[03:24:08] (Imran/Taha):** "I don't think the efficiency is going to be there, but the quality, consistency, standardization might be there, and the density of information will increase."
- **[03:27:37] Taha Raja:** "Anderson Frank keeps on telling us you guys have 50 clients... but your hours don't reflect the number of clients that you're operating."
- **[03:34:28] Taha Raja:** "When a customer uses NetSuite, what do they know about how NetSuite works? What they see... Now answer that question about AI. I'm the customer. At this point, we're just the customer."
- **[03:35:31] (Justin, attr. uncertain):** "You don't need Fable to write a PDF."
- **[03:38:17] (Mike/Justin):** "Nobody really knows. It's a little bit of a black box, but again, I think by design."
- **[03:14:06] Taha Raja:** "Without information people create their own and usually it's wrong, because it's just based on assumption. And if you add fear to that, then it just really gets crazy."

---

## 8. UNRELATED-BUT-REVEALING (client work observed → what an "OS" must support)

- **[00:06:37]–[00:15:40] Revenue recognition consulting session (client appears to be 44):** customer-deposit + billing-schedule workaround, per-channel GL accounts with month-end reclass, cash-sale order flow. Claude "did okay. It brought up some of these things. It missed some others" [00:16:35] on this judgment-heavy consultative task — the OS needs playbook-pattern recognition (ARM Essentials fit signals, channel segmentation standard) plus deliberate human-in-the-loop for workaround-grade reasoning. Also surfaced: NetSuite's customer-deposit account lock is a product constraint consultants must design around [00:13:33].
- **[00:26:41]–[00:28:37] Foundrae dev-queue firefight:** unbounded client request intake backs up the dev cycle; the OS needs request intake, queue visibility, and status reporting ("can we get an update on this?").
- **[00:54:32]–[00:56:27] Bomb Party WMS demo:** demo-account provisioning (SCM/WMS datasets, 90-day expiry, extension) is a real operational dependency; handing off to NetSuite reps without context produced a sales rabbit hole — context portability to partner interactions matters.
- **[01:04:57]–[01:07:07] FMW vendor-site scraping project (Taha's own):** browser automation for inventory/availability positioning across inconsistent vendor UIs — a class of integration work the OS can't yet absorb.
- **[02:26:42] SuiteCloud Plus concurrency question (client):** performance analysis from APM screenshots is a recurring ad-hoc task type worth a repeatable skill.
- **[02:38:47]–[02:41:50] Demand planning at Tepperman's:** deliverables sent by email never landed in Asana or Drive — the OS needs a default "attach deliverables to the system of record" habit or automation.
- **[01:34:13]–[01:35:08] Retrofit client dynamics:** an emailed exec summary listing errors was taken personally ("throwing me under the bus")— automated reporting needs tone/framing controls and the face-to-face meeting remains essential; Rod (client) hijacks calls, hence the 30-minute agenda-driven PM call norm.
- **[02:01:27] Imran ran the executive summary for Grinds** — note Grinds is both the caffeine-pouch product discussed socially [02:01:27]–[02:07:31] and an actual client (Grinds SB MCP connection exists in the toolset).
- **[03:06:20] "Train my wife on basic computer skills" anecdote:** revealed the default-to-Claude mentality gap even among heavy users.
- **[00:04:01]–[00:05:00] Org-account housekeeping chatter:** pending invite for Steve, free-vs-paid account sprawl, uncertainty about who's in the org — account administration is currently manual and error-prone.
- **[03:41:05]–[03:43:37] Food/travel/streaming chatter:** no tooling signal beyond confirming the summit's informal working culture; the final minutes loop back to the dormant-account MCP pitch [03:43:37].
