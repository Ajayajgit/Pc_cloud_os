# Sept 3 All-Hands: Presenter Run Sheet

Companion to the deck `Internal/PowerCloud OS Roll Out - All Hands 2026-09-03.pptx` (53 slides, PDF alongside, speaker notes on every slide; current build is the `_v2` file). Built 2026-09-03 from `SEPT3_ALLHANDS_AGENDA.md`, `SEPT3_PRESENTER_BRIEF.md`, `ONBOARDING.md`, the capabilities guide and the roadmap's 6a proof points. Rebuild after edits with `python "Internal/sept3_deck/build_deck.py"` then `python .claude/scripts/export_pdf.py "Internal/PowerCloud OS Roll Out - All Hands 2026-09-03.pptx" --png`.

## Slide map against the run of show

| Time | Segment | Slides | Live demo |
|---|---|---|---|
| 0:00 | Open | 1 to 3 | none |
| 0:05 | What the OS is, the workbench habit, how you get in, first time in Claude Code | 4 to 10 | Slide 8: the five steps done live on screen. Slide 9: point at the running session |
| 0:18 | The folder is the memory, own vs rent, the skills, proof points, the shelf | 11 to 15 | Optional: open `ENGAGEMENT_LOG.md` at slide 15 |
| 0:24 | One engagement end to end | 16 to 33 | Slides 17 to 18: the twelve-step arc with who-acts badges. Slide 19: show the demo folder's CONTEXT.md |
| 0:36 | The weekly executive summary | 34 to 39 | Slide 39: internal draft next to client-facing doc |
| 0:40 | Case studies | 40 (hand-off divider only) | Mike hands off; presenters over their own folders |
| 1:10 | Announcements | 41 to 43 | none |
| 1:22 | The ask, Q&A | 44 to 45 | none |
| as needed | Appendix | 46 to 53 | Function menu, habits, prompting, developer view, gotchas, rules |

Section 01 (slides 4 to 10) is for people opening Claude Code for the first time: what the OS is in three parts, the workbench habit (brainstorm, plan, execute, deliver, all inside the client's folder), what Claude Code is compared to Claude in a browser, the five steps to get in, what the screen shows and how to work with it (the assistant analogy), and the homework: bring one of your own clients in by creating a new folder and running session start. Slide 10 and the ask (slide 44) say the same thing. Slide 13 lays out the eleven skills (skill, what it does, fires when); the point to make is that nobody invokes one by name. It takes about 13 minutes with the live demo, which squeezes the narrative walk to roughly 13 minutes plus 4 for the exec summary.

Section 02 opens with the arc as a two-slide timeline (17 and 18): twelve steps from sales handover to retro, each badged by who acts (tool, human, client) with the real files each step writes. Then one slide per stop, then the six gates, then "What the arc is actually doing" (32): capture exhaustively and cheaply, then put a human where judgment or liability sits. If time is short, the slides that must be said are the arc (17 and 18), the six stages (24), the tiers (25), what ships (27), the six gates (31) and the arc summary (32), and in the exec summary section, what it is (35) and two documents (37).

## Live demos: prep and fallback

**Slide 8, how you get in.** The main demo. Do the five steps exactly as the slide shows them: open the Claude desktop app, Code tab, open the client folder, say the session-start line, paste the /rename line. Pick a client folder whose MCP connection is present in your session, so the identity check has something to confirm, and run session start once in that folder before the meeting: the second run is faster and you already know what it will say. Narrate what it reads while it runs. Leave the session on screen for slide 9 and point at the pieces (steps, permission prompt if one appears, the answer, the files in Explorer). Fallback: walk CONTEXT.md in Explorer and describe the identity check. Do not run a fresh "New client. Run session start" live; the interview takes too long for the slot.

**Slide 15, the shelf.** Rerun `python .claude/scripts/build_engagement_log.py` before the meeting so the counts on the slide (10 clients, 18 records, 31 finals, 8 in execution) match the file. Rebuilt this morning; they matched. If the counts move, the slide is one line in `build_deck.py`.

**Slides 17 to 18, the arc.** Optional: have the demo folder's `working/` open in Explorer so the right-hand column (the files each step writes) is visibly real.

**Slide 39, exec summary pair.** Open side by side: `Teppermans Rapid Assessment/working/exec_summary_2026-08-28.md` and `Teppermans Rapid Assessment/deliverables/Teppermans_Executive_Summary_2026-08-28.pdf`. Point at three things: the two windows stated on the page, a tiered claim in the internal draft, and something candid that did not carry to the client version. Do not run a summary live; five connectors take several minutes.

**Announcement 5, feedback.** Show `FEEDBACK.md` at the root rather than filing an entry live. Two open entries, both from Justin, is a useful line: a folder dominated by one name says more about who is not reporting than about what is broken.

## Language to get right

- Announcement 3 (approval and dev-review gate): policy in effect by convention. Do not say it is mechanically enforced; the gate is not built.
- Announcement 4 (hours lag): the per-client hours log was verified live on the August 24 Monday run, so "live" is accurate.
- Proposal is gone; the deck deliverable is the Presentation.
- The shared-drive move is not announced. Nobody outside the pilot team knew the old location, and the pilot team already knows. The path is on slide 8.
- The two offerings: Rapid Assessment onsite, Fast Track Discovery remote.

## Pre-flight, today

- [ ] Rerun the engagement log and confirm slide 15's counts.
- [ ] Open the deck in PowerPoint, Presenter View on, speaker notes visible. Fonts render: Montserrat and Barlow were installed per-user on this machine this morning. For future PDF exports install them for all users (`fonts/README.md`).
- [ ] Explorer open at `G:\Shared drives\Power Cloud OS` and at the demo client folder.
- [ ] Claude Code session open in the demo folder, session start already run once, session renamed.
- [ ] Teppermans exec summary pair open (see above).
- [ ] Case studies: no slides in the deck beyond the hand-off divider (40). Presenters bring their own material or talk over their folders. Ron is out; confirm who fills the third slot or shorten the segment.
- [ ] From the logistics tracker, still to confirm on the day: India attendance through Besh, the A17 decision (session-end interview always asks the feedback question, or only on visible failure).
