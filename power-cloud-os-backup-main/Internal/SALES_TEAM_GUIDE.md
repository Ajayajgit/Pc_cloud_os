# The Pipeline Playbook

> DRAFT 2026-08-28. The team-facing companion to `SALES_OS_PROPOSAL.md`: what the sales team sees and does, first call through consultant handover. Folder location, tooling, and NetSuite schema decisions live in the proposal and are Mike's; none of them appear here, and this guide reads the same whichever way they land. Once the design is approved, this file's home moves to the sales workspace root as its orientation guide.

## What changes for you

Every deal gets one folder and one NetSuite opportunity, and Claude keeps both current. You talk; it types.

What you stop doing:

- Entering NetSuite records by hand, or deciding whether a deal is "worth" entering
- Digging through notes and old emails at proposal time
- Walking into a call trying to reconstruct the deal from memory
- Re-explaining a deal to the consultant who takes it over
- Compiling pipeline updates for anyone, ever

What stays yours:

- The relationship. Claude never sends anything: every email, proposal, and invite goes out by your hand.
- The numbers. Every hour and rate in a proposal is confirmed by you, line by line, before it renders. Numbers are binding once sent.
- The final word. Claude confirms with you before every NetSuite write, and it only ever touches our own account.

## The one habit: capture

The whole system runs on one behavior: if a real conversation happened, it gets captured.

- **Record every prospect call.** Title the meeting `{Prospect} | {topic}`. The title is what routes notes and recordings to the right deal folder.
- **After the first real call, tell Claude "new deal"** and point it at the transcript. That is the entire intake. Two minutes.
- **Anything the prospect sends you** (requirements, org charts, exports) goes into the deal folder, or you hand it to Claude and it files it.
- **If a call did not record**, one line to Claude keeps the record honest: "Talked to Acme, they asked about consolidated invoicing, next touch Friday."

The bar: every real conversation is in the system by Monday's pipeline review. No judgment call, no form to fill.

## Your week

**Monday, 8:40am. Before the pipeline review.** The Monday pipeline review already exists; Claude preps you for it instead of replacing it. "Prep me for the pipeline review." You get talking points for your book: where each deal stands, what changed last week, what is next and when. Plus anything out of true: a call with no opportunity behind it, a missing next-contact date, a proposal quiet for 30 days with a nudge already drafted, an "unknown" from earlier in the week it still needs. You fix gaps right there ("log the Thursday call I never captured") and walk into the meeting already reconciled. The meeting itself does not change.

**Tuesday, 10:40am. A discovery call just ended.** The meeting notes exist the moment the call ends. You open a session: "New deal. Acme Apparel, direct, here's the intro call." Claude builds the deal folder, files the notes, drafts the fact sheet from the transcript, then asks you the intake questions below. You answer, it shows you the NetSuite entry it is about to create, you say yes. Done. Nothing was typed into NetSuite by a person.

**Wednesday, 4:45pm. Prep for tomorrow's call.** "Prep me for tomorrow's Zellerfeld call." Claude builds a one-page cheat sheet from the folder: where the deal stands, who is on the call and who to focus on, what they have already told us (so you never re-ask), the must-answer questions still open, and what a win for this call looks like. This is the pattern that already worked on the Zellerfeld pursuit; now it is standard for every call that matters.

**Thursday, 10:00am. On the call.** Keep the session open during the call. It is the deal's source of truth when memory fails: "What did they say about ShipStation?" "How many SKUs?" "What did we quote for phase one?" Answers come back in seconds, from their own words in the folder, while you keep talking. After the call, the notes land in the folder and the loop continues.

**Thursday, 4:15pm. A touch, not a milestone.** "Log on Acme: sent the case study, they want a demo week after next, next contact 9/8." The fact sheet and the opportunity both update. One sentence at the moment something happens, instead of a NetSuite tab and six fields from memory on Friday.

**Proposal week.** "Build the proposal for Acme." Claude reads every call and document in the folder, asks you the proposal questions below, drafts in the right shape for what we are selling, and then stops for the number check: every hour and rate, line by line, with you. Then it renders the branded document, you send it, and the opportunity updates itself (status, value, expected close).

**The win.** "Acme signed." Claude asks the close-out questions below, creates the project, proposes kickoff times for you to send, checks whether an Asana project already exists before creating one, and preps the consultant handover. The deal folder simply becomes the client folder; nothing moves, nothing gets re-entered.

**The loss.** "Preferred Plastics went with their sister company's integrator." One line on why, and the file closes. Twelve months of those one-liners is how our pricing and pitch get better.

## What Claude asks you, and why it asks so directly

Claude asks pointed questions at each step because every answer lands in a specific NetSuite field or the deal record. It will not silently skip a blank: anything you do not know becomes an open question it re-asks when you prep for Monday's pipeline review, until answered. Say "unknown" and move on. Never guess, and it never guesses either.

**New deal (about two minutes):**

- Who is the client? Company, website, main contact with role and email.
- Direct, or through a partner (Anderson Frank or another firm)? If a partner: who is our contact there (name, email, phone), and who exactly are we billing?
- Did anyone refer this to us?
- What are they running today? NetSuite already? What ecommerce, accounting, other systems?
- What are we likely selling: rapid assessment, implementation, or a custom build?
- When do we talk to them next, and about what?
- Rough expected close date?

**Every touch (about thirty seconds):** what happened, what is next, and when. Claude proposes the pipeline status (Demo'd, In Negotiation, and so on); you confirm or correct.

**At proposal time:**

- What are we selling, confirmed: rapid assessment, implementation, or custom build?
- Commercial model: time and materials, Power Suite subscription, or managed services?
- The work breakdown: task names, estimated hours, and rates. Claude drafts these from the calls and our baselines; you confirm or change every line. This checkpoint is slow on purpose.
- Is a rapid assessment in scope? Any travel?
- Expected close date, and any dates we committed to on calls.

**At the win:**

- Signed date, and where the signed contract lives.
- Kickoff timing preferences. Claude proposes slots; you send the invite.
- Staffing: principal, senior consultant, staff consultant, lead developer.
- Partner deals only: placement reference, minimums, monthly contracted hours.

**At a loss:** who won and why, best guess, one line.

## Won: through the handover

Winning starts a short, scripted sequence. Same information you already gave; none of it gets asked twice.

1. **The close ritual.** Claude sets the won status, creates the NetSuite project with the right fields for the deal type, links it to the opportunity, and checks for an existing Asana project before creating anything.
2. **The turnover briefing.** Claude preps a one-page briefing from the folder: what we promised (the proposal plus every commitment made on calls), who the contacts are, what systems they run, and the story of the deal so far.
3. **The turnover session.** You and the assigned consultant walk through the briefing together, once. The folder does the remembering; you add the color that never makes it into notes.
4. **The introduction.** You introduce the consultant to the client by email. Claude drafts it; you send it.
5. **Kickoff.** The consultant preps the kickoff from the same folder your calls landed in, so the client never has to repeat what they already told you. That is the standard we are holding: the kickoff proves we listened.

After the handover, the consultant owns delivery. You stay the commercial contact for the account, and because the deal folder became the client folder, everything you knew is still exactly where you left it.

## Ground rules

- Never edit the files in the folder's `source/` area. That is the client's words as recorded; work from copies.
- Proposals only go out after the line-by-line number check, from the folder's finals area, in the branded format.
- Claude confirms before every NetSuite write, and it writes only to our own account, never a client's.
- If it did not get captured, it did not happen. Monday's prep can only flag the deals it can see.
