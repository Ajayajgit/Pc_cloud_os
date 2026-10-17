
## 2026-09-03: Design for the fleet, not this machine
- Correction: I recommended a GPU-local Whisper install after checking the RTX 5070 on Mike's machine. The OS runs on every consultant's laptop, so hardware is not a design input.
- Rule: any OS tooling proposal must work identically on an arbitrary Windows laptop with no GPU. Never probe local hardware to shape an OS-level recommendation; probe only to confirm a hosted or CPU-only path runs here.
- Rule: for compute-heavy needs (transcription, OCR, rendering), default to a hosted API with a per-user key stored per DATA_CONNECTORS.md rule 1, or a CPU-safe fallback. Local acceleration is a nice-to-have, never the path.

## 2026-09-08: Sales decks are light; numbers live in a separate document
- Correction: the first Preferred Plastics management deck ran five long bullets plus a cost table per slide. Mike: too dense and text heavy; pull the hours and dollars out of the deck and put them in a separate estimate document.
- Rule: on a sales or management deck, a bullet is a phrase (about 12 words), four or five per slide, and the argument lives in the speaker notes. If a slide needs a paragraph to make sense, the paragraph belongs in the notes or in a document.
- Rule: hours and dollars never go on slides in a pre-agreement pitch. Timelines in weeks are fine. Costs go in a separate estimate document the client can read after the meeting, which also keeps the commercial review (Steve and Mike own the figures) separate from the deck review.
- Rule: propose one solution shape per project, not a menu. Alternatives and the buy comparison go in the notes and the estimate document.

## 2026-09-08 (second pass): a slide is a picture with a headline, not a list
- Correction: after the bullets were cut, Mike still found the deck too text heavy and the titles flat ("Project 1, Customer order automation").
- Rule: every content slide on a sales deck carries one visual (process flow, stat tiles, cards, a timeline) and at most one or two supporting lines. Short bullets alone are still a text slide.
- Rule: slide titles are headlines that state the point in the client's terms ("Invoice on delivery day, not a week later"), never labels ("Project 3"). Title case and colons do not make a label interesting.
- Rule: the shared renderer now has Flow / Stat / Card / Gantt blocks (render_pptx.py). Reach for them first; a table is for numbers, not for prose.

## 2026-09-11: Do not record a pointer to something the OS already is
- Correction: I proposed a "Client Drive folder" field for CONTEXT.md so the exec summary could find the client's material. Mike: the OS client folder IS the client's Drive folder going forward; the only Drive pointer worth keeping is the legacy one under `Power Cloud Project Folders`, which is read-only history (old notes, meeting records).
- Rule: before adding a field that points at an external location, ask whether the OS folder already is that location. A pointer that duplicates the workspace's own structure goes stale and invites material to land outside the folder.
- Rule: `Power Cloud Project Folders` is frozen. New client material lands in `{Client}/source/`, never back in the legacy folder; documents come forward one at a time, materialized as real files.

## 2026-09-14: A check at the moment of action beats a list somebody maintains
- Correction: I designed the board update's safety gate as a static allowlist of approved Chat spaces on the VPS. Mike asked what a new customer costs to set up, which exposed it as both the most annoying step (edit a config file per client) and the weakest one. A list cannot notice a client being added to a space that was approved last month, and the MH Crane space really does hold an outside consultancy.
- Rule: when the risk is "the world changed since someone approved this", verify at the moment of action rather than recording an approval. Ask what the gate cannot see, not just what it blocks.
- Rule: prefer a gate the system can evaluate itself (read the membership) over one a human curates (maintain the list). The human step that remains should be the one that carries intent, here adding Paco to a space, not bookkeeping that restates it.
- Rule: "how many steps does a new customer take" is a design question, not a support question. Ask it of any capability that needs per-client setup, and count the systems involved, not just the steps.

## 2026-09-14 (second): a shared queue needs per-item failure isolation
- Correction: the Chat worker flushed the whole outbox in one loop and raised on the first failed send. Adding a second producer to that queue meant one undeliverable board post could block meeting filing and the Monday dashboard behind it, silently and forever. I only found it because a live test hit lock contention and made me read the loop.
- Rule: before putting a new producer on an existing shared queue, read the consumer and ask what one poisoned item does to everything behind it. Isolate the new traffic; leave the existing failure semantics alone unless there is a reason to change them.
- Rule: a job on a weekly timer has no retry behind it. Any transient failure it can hit, lock contention included, costs a week and shows up as silence, so wait and retry in the job rather than relying on the schedule.

## 2026-09-14 (third): a missing tool may be inside the thing you cannot reach yet
- Correction: the OS backup looked broken (no local repo, no auth), so I wrote a replacement sync script on the drive. Once authentication was sorted and the repo cloned, `sync-backup.ps1` was sitting inside it, more thorough than what I had written: mirrored deletes, stale root-file pruning, repo-owned file protection, and a `.gitignore` tuned to keep OS CONTEXT.md files while excluding client ones. I deleted mine and extended the real one.
- Rule: "check before create" applies to tooling, not just folders and Asana projects. When something is missing, ask where it would have lived and whether that place is merely unreachable right now, rather than gone.
- Rule: when a backup or recovery tool cannot be found, restoring access comes before rebuilding. An unreachable repo is a credentials problem wearing a tooling problem's clothes.
- Rule: two implementations of a backup is worse than none, because the stale one still runs. If a replacement is genuinely needed, delete what it replaces in the same change.


## 2026-09-21: A second opinion is input, not a verdict
- Correction: after a Codex review of the model-tiering plan, I folded in nearly everything it said, including a verification matrix (time-zone fixtures, a dedicated clean laptop, a full defect taxonomy) that was more than a first pass needed. Mike: do not take the Codex review as fact; it is only a second opinion.
- Rule: after any external review, sort its points into three bins before editing the plan: real holes I would have been wrong to ship (adopt), fair points with a cost I have to name (adopt with the reservation written down), and overreach (decline with a reason). Present the bins, not just the revised plan.
- Rule: a reviewer that finds real holes earns trust on those holes, not on everything else it says. Adopt point by point; do not let a strong first section carry a weak fifth one.
- Rule: verification scope is a design decision. Ask what a staff engineer would actually run before the first rollout, and put the rest in a later-pass list rather than the plan.

## 2026-09-21: Enforcement is a hook, prose is a reminder
- Correction (self, via the review): my first plan claimed "client isolation" and "permission enforced" on the strength of instructions in agent bodies and a fail-open hook. Instructions are not a boundary and a gate that fails open is not a gate.
- Rule: when a plan says "enforced", name the mechanism the harness runs (a PreToolUse hook, a tool allowlist, a script) and its failure posture. If the only mechanism is text the model reads, write "asked", not "enforced".
- Rule: a worker with Bash has everything. No tool restriction survives a shell. Give workers the narrowest tool set and let the orchestrator run commands and hand back the output.
- Rule: check where a hook actually loads before trusting it. The NetSuite write guardrail sat in root settings for six weeks and never ran on an engagement, because client sessions do not load root settings.

## 2026-09-24: Test what the harness executes, not the part you remember changing
- Correction (self, via the first live run): I generated the new hook entries in settings with a script that took the first argument (`-c`) as if it were the launcher, so every session hook ran `python -c session_snapshot` and failed silently. 45 unit tests were green, because the new test checked only the hook name at the end of the argument list. One `claude -p` run from a client folder caught it.
- Rule: when a test guards generated configuration, assert the whole executed form (command, every argument, argument count), not the field the change was about.
- Rule: a fail-open hook fails invisibly. Before re-stamping 50 folders, one live run with `--debug` from a stamped folder is part of done, not an optional extra.
- Rule: AskUserQuestion answers arrive as tool results. Any capture of "what the human said" must include them, or it drops exactly the decisions made most deliberately.

## 2026-09-28: Evidence borrowed from next door, and evidence generalized from a slice
- Correction (Ron): I attributed Tepperman's 30 to 40 second RF gun latency to putaway, and then used it to constrain a design decision, arguing against adding a field to the mobile putaway page. Ron: that latency is receiving, item receipt creation and label printing, which is P8 scope. Checking all three sources confirmed he was right; every reference ties it to the label Suitelet and the P8-1A script fixes. The putaway page does not carry that defect.
- Correction (self, via production): I reported Max Fill Percentage as only 0.70 and 0.80 and told the consultant that the client's "85 or 90" was wrong. That came from one exported saved search filtered to a single category (every row width 142, upholstery). Production across 20,660 bins carries six values: 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, plus 850 unset. The client was right and I had contradicted him on the strength of a filtered extract.
- Rule: a symptom belongs to the process area where it was observed, not to every process that shares the device. Two mobile screens in the same app are different screens. Before carrying a number across a boundary, find the sentence that ties it to the area you are about to apply it to.
- Rule: never generalize a distribution from a filtered extract. A client's export exists because someone filtered it for their own purpose, and that filter is usually invisible in the rows. Check the population before contradicting anyone, and especially before contradicting the person who built the extract.
- Rule: the more confidently a finding contradicts the client, the more it has to be verified against the whole population first. "The client misremembers their own configuration" is the premise of the whole verification step, which makes it the easiest thing to reach for and the easiest to get wrong.
- Rule: a raw count from a table named "open" may not mean open. `customrecord_wmsse_trn_opentask` holds completed tasks too; 101,066 putaway rows read as a crisis backlog and were in fact a clean completed history. Check the status field before a count becomes a headline.

## 2026-09-24: A markup parser that trims blindly, and an overwrite without a look
- Correction (Mukula): the ACFB weekly status footnote rendered "logged next wee". My `add_runs` helper treated any piece starting with `**` as bold and stripped two characters from each end, and a lone `**` footnote marker triggered it. I had checked the page image and missed the lost characters.
- Correction (self): I copied a re-rendered .docx over the deliverable right after the consultant closed Word, without checking whether they had saved edits while reviewing it.
- Rule: inline-markup helpers strip delimiters only when the piece both opens and closes with them. Footnote markers use a glyph (†, ‡) that the parser does not know.
- Rule: after a render, check that the extracted PDF text ends every sentence you wrote. A thumbnail will not show two missing characters.
- Rule: before overwriting a deliverable the consultant has had open, compare its modified time to your last write. If it is newer, ask first.

## 2026-09-29: Withdrawing a correct finding because the consultant pushed back
- Correction (self, via Ron): I flagged that WI-1001 and WI-1002 on the client's Asana board were marked Owner = Bomb Party when both are Power Cloud work items carrying Power Cloud hours. Ron replied that the ownership column is a baton that flips to whoever holds the next action and does not have to map to the SOW. I withdrew the finding. He then clarified that **Assignee** is the baton and **Owner** is the fixed responsibility field he built. The original finding was right, and I had given it up without checking which field he meant.
- Rule: when a consultant's pushback and your finding can both be true under different readings of the same artifact, establish which reading is in force before conceding. One question ("do you mean Assignee or the Owner column?") would have settled it.
- Rule: a correction from the consultant is evidence, not a verdict. Weigh it against what the artifact actually shows. Folding immediately is as much a failure of judgment as defending a wrong call, and it costs the consultant the finding they were paying for.
- Rule: when a client builds a custom field whose semantics are not self-evident from its name, ask what it means once and write the answer down. Two people had different models of the same column, and neither had said so out loud.

## 2026-10-02: Judging open tasks without reading the status field, and calling a closed thread open
- Correction (Mukula): I called four open Asana tasks overdue and neglected from their due dates and completed flags. The project has a custom Task Status field and all four were On Hold, a client-side hold. I never requested custom fields.
- Correction (Mukula): I listed an inventory discrepancy as unresolved because the email thread stopped at a question. It had been resolved over two calls and a report that never appeared as thread text.
- Rule: request custom fields (`custom_fields.name,custom_fields.display_value`) when reading tasks, before judging any open task. A past due date on an On Hold task is a parked item, not neglect.
- Rule: an email thread that ends is not an open item. Work closes over calls and attachments the inbox cannot show, so ask the consultant before listing anything as open in an internal draft.

## 2026-10-02: Different naming conventions get different code fields
- Correction (Julie, MH Crane): I proposed one shared code field per list, padded or reused where two naming conventions happen to use the same code. Julie: "Different naming conventions require different fields."
- Rule: in a configurable naming design, each naming convention gets its own code field on each attribute list, even where the codes currently agree. Consistency of the model beats saving a field; where identical codes make a second field look redundant, flag it for later review rather than collapsing it.
- Rule: where conventions are inconsistent with each other, propose the change to the naming book itself instead of absorbing it in the data model.

## 2026-10-06: Loosen a gate uniformly; a per-record prompt is unusable at any record type
- Correction (Mike): I proposed moving create/update approval to once per session but kept deletes prompting on every record. Mike: "delete cannot be every record." At import scale a per-record prompt trains the human to click without reading, which is the failure the gate exists to prevent, and that holds for deletes as much as creates.
- Rule: when a gate's granularity is being fixed because people click through it blindly, fix it for every operation it covers. Keep the extra caution for the riskier operation as a separate first-of-kind prompt, not as a return to per-record prompting.
- Correction (self, via Codex review): the draft compared `is_error` with `in (None, False)`, which `0` satisfies, and let a hook crash fall through to silence, which with an allow rule in place means an unprompted production write. Both were caught by review, not by my own tests.
- Rule: a hook on a write tool fails to "ask", never to silence. Test the failure paths (bad stdin, odd shapes, timeout) as deliberately as the happy path, and compare booleans by identity when the value comes from JSON.
- Rule: when a transcript or log is the evidence, inspect a real one before writing the matcher. Real results omit `is_error` on most successes; requiring `false` would have broken the gate on day one.

## 2026-10-06 (second): lifecycle state is a flag someone flips, not a date someone predicts
- Correction (Mike): I proposed a `go_live` date on the connector entry so the gate would tighten automatically on that day. Mike: it needs to be a binary status; dates slip and move and get messy.
- Rule: when a protection level depends on a project phase, key it on a binary status flipped at a named step in the process (here, the execution skill's promote-to-production step), not on a predicted date. A date that slips leaves the gate wrong in one direction or the other; a flag is wrong only until someone performs the step that was going to happen anyway.
- Rule: the fail-safe for a flag is the default. Anything other than the exact relaxed value means the stricter state.

## 2026-10-08: Ask where the team already works before recommending an interface
- Correction: I recommended Claude Code sessions as the sales team's day-to-day surface because they exist today. Mike: the team lives in Google Chat, takes meetings, and touches NetSuite only when unavoidable. The recommendation flipped to Chat for the daily motion with sessions for the heavy moments.
- Rule: before recommending a surface for a new group of users, ask where they already spend the day. A capture habit only sticks where people already are; "it exists today" is an argument about build cost, not adoption.
- Rule: when the question is "agent or script", separate the interface layer from the mechanism layer before answering. They usually have different answers (agent on top, script underneath).

## 2026-10-08: Research workers must write their report to a file; the handback is not reliable
- Observation: two long research agents (88 and 56 tool calls) ended without delivering a handback, and an Explore agent stalled waiting on its own background work. Every report survived only because the prompt required writing it to a scratchpad path as well as returning it.
- Rule: every delegated research or drafting prompt names an output file path and asks for the result both in the file and in the handback. Read the file when the notification says no report was delivered, before rerunning anything.
- Rule: keep research briefs narrow. Send a refinement message with new facts when the orchestrator learns something mid-run, rather than letting a worker research a question that is already answered.

## 2026-10-09: A data pattern is not a preference setting
- Correction (Mike): I inferred that Consolidate Projects on Sales Transactions was enabled because no invoice in the account is headed by a project. Mike read the preference: it is disabled; invoices carry the customer in the Customer field and one project in a separate header field. My proxy was consistent with both settings, so it proved nothing, and the invoice-class design was drawn on the wrong shape for a turn.
- Rule: when a NetSuite preference is one click away in the UI, ask the consultant to read it rather than inferring it from transaction data. Mark any inference about a setting [Inferred] and keep it out of the design until the read lands.
- Rule: before using a data pattern as a proxy for a setting, write down what the pattern would look like under each possible value. If two values produce the same pattern, it is not a proxy.

## 2026-10-09: An untested XML syntax handed to a worker as fact costs a validate loop
- Observation (self, no user correction): I gave the pc-sdf-author a `<recordpermissions>` block for the SDF role object from memory, as if confirmed. Validate rejected the element; the real form is a `<permission>` with `permkey` `[scriptid=customrecord_...]`. The worker had no way to know and said so in its handback.
- Rule: a syntax I have not seen in an imported object or on an Oracle page goes into the packet marked "try this; validate decides", never as a confirmed shape. Prefer grepping an `object:import` of a real object of that type before writing the packet; when none exists locally, say so in the packet.

## 2026-10-09: Script parameter values live on the deployment
- Correction (Mike): I told him to set the Support Type ID on the script record's Parameters subtab. A script parameter is defined on the script record; its value is entered on each deployment's Parameters subtab.
- Rule: when naming where a NetSuite setting is entered, say the record the value is stored on, not where the field is defined. For script parameters: Customization > Scripting > Scripts > the script > Deployments > the deployment > Parameters.

## 2026-10-09: A SuiteQL column is not proof that a field exists on a record type
- Observation (self): the field set called `custbody_pc_referral_end_user` "existing, empty on 184 opportunities" because the transaction table has the column; the field's Applies To had Sale ticked and Opportunity unticked, so scripts could write the column but never read it on an opportunity, and the gate showed "Missing: End Client" for a value SuiteQL could see. One tick on the field definition fixed it after an hour of diagnosis.
- Rule: when a plan repurposes an existing custom field for a record type, confirm the record type under Applies To (UI or `object:import`) before the plan freezes, not the column in SuiteQL. Likewise a List/Record > Transaction field is not a universal transaction link; test the specific transaction type before designing around it.

## 2026-10-09: pc-code-chores writes new tests; it never edits an existing one
- Observation (self): I briefed pc-code-chores to extend an existing `it` block with two assertions. It refused on its standing rule (new test files from acceptance criteria, never edits to existing tests or report files) and handed the block back for a human to apply. The refusal was right; the brief was wrong, and the round trip cost more than the two lines.
- Rule: a change to an existing test is the orchestrator's edit, applied inline after reading the test. Delegate to pc-code-chores only a NEW test file or NEW `it` blocks appended from a written criterion, and never ask it to write a handback `.md`; its report comes back in the message.

## 2026-10-12: Scan the snapshot before committing a mirror, and never trust robocopy's defaults
- Observation (self): the first full sync into the OS repo copied a private key that had been left at the Drive root by an openssl run, and hung for 15 minutes on a `.gdoc` shortcut because robocopy retries a failed file a million times at 30-second intervals by default. Both were caught only because the run used `-NoCommit` and a credential-pattern scan ran over the staged set before the commit.
- Rule: a mirror or snapshot commit is always two steps: sync without committing, then scan the staged set for credential shapes and vendored trees, then commit. Every robocopy call gets an explicit `/R` and `/W`. Key material is excluded by pattern at the copy step, not only by `.gitignore`, because a working-tree copy on disk is already a leak.

## 2026-10-14: Only a figure the client approved is logged as approved
- Observation (consultant): I drafted an 8-10 hour LOE, the consultant said "good to go", and I logged 8-10 as the approved figure. The client had approved the original 10-12 hours.
- Rule: "approved" in `loe_log.md` and CONTEXT.md means the figure the client or consultant states as approved, never my draft plus a go-ahead to continue. If the approved figure was not stated, log my draft as `proposed` and ask which number governs.
