# Stage 02 — Evidence mining and the candidate register

One job: turn everything in `source/` into a complete, tiered evidence log and an exhaustive candidate list. Surfacing every potential task item is the single most important thing the assessment does.

- Working inputs: everything in `source/`, `working/verification.md` (if stage 03 has run or is running alongside)
- Reference: `../NETSUITE_PLAYBOOK.md` (completeness checklist, read it at the checklist step)
- Outputs: `working/evidence.md`, `working/candidates.md`
- Human check: none inside this stage; the findings-review checkpoint at the end of stage 03 walks the outputs.

## Evidence mining

Build `working/evidence.md`: every material claim about the business, their NetSuite setup, or a pain point, with source file, approximate timestamp, and speaker. Transcript rules:

- **Source-integrity check first.** For each file in `source/`, confirm it is a full transcript, not a thin notes-only stub (compare text length across files; a session an order of magnitude shorter than its peers is a stub, as RA-1 was on the Shinesty redo at 4.6K chars vs 100K+ for its peers). Read embedded images/screenshots in transcripts rather than skipping them (a 476KB file that is mostly two JPEGs, as RA-4 was, carries content a text-only read misses). A recording (mp4, m4a, mp3 and the like) with no matching transcript is a flag too: run the [transcribe skill](../../transcribe/SKILL.md) before mining, and mine its output from `working/transcripts/`. Flag any file that is thin-for-its-size, image-heavy, or will not open, and surface it to the consultant before mining rather than working from partial input. Meetings Paco filed (`../../../PACO.md`) follow a fixed shape: the `- notes [hash].md` export is the transcript or Gemini notes to mine, the `.gdoc` original beside it is a Drive link that will not open from disk (not a broken file), and the `- meeting.md` is provenance rather than content. `working/meetings_log.md` lists them.
- **Delegate the first pass, keep the judgment.** After the integrity check, run each transcript over about 20K characters through `pc-transcript-miner` (Sonnet), one transcript per spawn, in parallel where there are several; it writes `working/mining/{stem}.md` by category, untiered, with no dispositions and a coverage line. Shorter files you read inline. Then the work that is yours: merge the mining files into `working/evidence.md`, assign every tier and every disposition, and **recall-check from the source**, not from the output: pick at least three windows per transcript (opening, a dense middle passage, the closing next-steps), read them yourself, and confirm each capturable item is in the mining file. A miss found this way is logged in the Handback review and the window count doubles for that transcript. The playbook checklist below then runs over the merged set.
- Work from transcripts, either in `source/` or generated into `working/transcripts/` by the transcribe skill. Never work from a recording directly, and never transcribe by any other route (a manual upload to some tool skips the consent gate the skill enforces).
- Mine AI-notes **Decisions** and **Next steps** explicitly: agreed items become "Aligned on-site" tags (need sign-off, not persuasion); items already actioned become "In motion" (zero/reduced effort). Both show momentum and prevent double-billing.
- Speaker labels and proper nouns are unreliable on group calls; treat attribution as approximate, note the caveat, attach a name to a client-facing quote only when substance and speaker are both clear.
- **Then run the `NETSUITE_PLAYBOOK.md` completeness checklist.** For each area, log a finding or explicitly note "not discussed / not applicable." Ambiguous-but-possibly-material items are interview candidates, not silent drops. (This is the step that would have caught the customer-deposit methodology on Shinesty.)

## Candidate task register (exhaustive capture — the highest-priority job)

Surfacing every potential task item must never depend on the consultant happening to remember an item, or on a transcript being complete. Build `working/candidates.md`: one row per candidate, capturing every potential task from every source at a deliberately low threshold. Capture first, judge later.

Sweep for, and log as a candidate, every one of these:

- every pain point, complaint, manual workaround, inefficiency, or "we wish it did X" in any transcript, including a single passing mention and including mentions in a thin or partial source;
- every anomaly, dormant tool, redundant integration, or script-only pattern found in the account during verification. These have no call coverage and are the easiest to lose (the Meta/TikTok settlement scripts are the cautionary case);
- items the client is already fixing (mark In motion) and items agreed on a call (Aligned on-site).

Each candidate carries: short description, source ref(s), evidence tier, and a **disposition**. Every candidate must end with exactly one disposition: promoted to a work item (name it), moved to fast-follow, or dropped **with a one-line reason**. A candidate may never simply be absent. When unsure whether something is material, capture it and raise it at findings review; materiality is a human decision at triage, not a silent call during extraction. The playbook completeness checklist is the pattern-based backstop on top of this exhaustive capture, not a substitute for it.
