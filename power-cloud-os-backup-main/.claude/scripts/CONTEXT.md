# .claude/scripts/ — shared tooling

Scripts that belong to the practice, not to any one engagement. Anything here is called from a client
folder or from the root; nothing here is copied into a client folder.

Run from the Power Cloud OS root unless noted.

## build_engagement_log.py

Regenerates `ENGAGEMENT_LOG.md`, the catalog of who is on the shelf and how far along they are.

```powershell
python .claude/scripts/build_engagement_log.py
python .claude/scripts/build_engagement_log.py --check   # exit 1 if stale, writes nothing
```

Status is **derived from what is on disk**, not from a field anyone maintains. The assessment workflow
already writes one file per completed stage (`evidence.md`, `verification.md`, `candidates.md`,
`loe_log.md`, `retro.md`), so the log reads that surface. It also reads the **execution phase's**
surface (`execution/CLAUDE.md`, `setup_checklist.md`, `config_backlog.md`, `design/`, `build_log.md`,
plus authored SDF artifacts vs bare scaffolding), so working sessions show up as
"execution: building (N artifacts)" rather than an opaque file count, and execution work happening
without the skill's state files gets a shape-drift note. The `Engagement status:` line from each
CONTEXT.md is shown alongside it; where the two disagree, the CONTEXT.md line is usually stale.

It scans the root for client folders and then **one level deeper for custom projects**, which live at
`{Client}/{ProjectName}/` with their own `CONTEXT.md`; those appear as `Client / Project` rows. The
standard record subfolders (`source`, `working`, `deliverables`, `execution`) are skipped, so an
ordinary engagement's own folders are never mistaken for projects. A folder that has neither its own
`CONTEXT.md` nor a project inside it is still listed under "not engagement records", so build work
outside the standard shape stays visible.

Reads only each client's `CONTEXT.md` plus directory listings. It never opens client material in
`source/`, `working/`, or `deliverables/`. Rerun it after finishing a stage or stamping a client.

## fetch_time_entries.py

Pulls NetSuite time entries for a period and splits them into each client's
`working/time_entries_{date}.json`. Feeds the `customer-exec-summary` skill.

```powershell
python .claude/scripts/fetch_time_entries.py --dry-run    # match report only, no credentials needed
python .claude/scripts/fetch_time_entries.py              # trailing two full weeks
python .claude/scripts/fetch_time_entries.py --client "MH Crane"
```

**Why it exists.** An MCP connection consumes a full NetSuite user license and cannot be carried by
an Employee Center role (CAPABILITIES.md), and consultants stay on Employee Center. A token-based
integration is not a seat: it authenticates as an integration record over SuiteTalk REST, the same
posture SDF already uses. One central pull, and consultants read the artifact rather than
authenticating to NetSuite at all.

**Credentials are per-machine environment variables**, never on the shared drive: `NS_ACCOUNT`,
`NS_CONSUMER_KEY`, `NS_CONSUMER_SECRET`, `NS_TOKEN_ID`, `NS_TOKEN_SECRET`.

**Customer-to-folder mapping** comes from the `- NetSuite customer:` line in each CONTEXT.md, because
NetSuite names and folder names drift ("44 Pro Gloves" vs "44 Pro"). Without that line it guesses
conservatively from the folder name, and a custom project also inherits its parent client's name,
since NetSuite bills the client rather than the project. Anything it cannot place is reported and
never written. A client folder only ever receives its own rows.

**Status: authored 2026-08-18, not yet run against a live account.** The OAuth 1.0a signing and the
SuiteQL pagination need first-run verification; log the result to CAPABILITIES.md either way.

## transcribe.py

Turns a client recording (video or audio) in `source/` into a speaker-labeled, timestamped transcript
in `working/transcripts/`, via AssemblyAI. Owned by the `transcribe` skill; run from the client folder.

```powershell
python "../.claude/scripts/transcribe.py" --dry-run                  # list recordings, check the key, write nothing
python "../.claude/scripts/transcribe.py"                            # every recording in source/ lacking a transcript
python "../.claude/scripts/transcribe.py" "source/Kickoff call.mp4"  # one file
```

**Why it exists.** Claude cannot read audio or video, and a recording with no transcript used to stall
an assessment until a human transcribed it. The script is hosted-only and stdlib-only on purpose: the
OS runs on every consultant's laptop, so nothing may depend on a GPU, a local model, or ffmpeg. The
file is uploaded as-is, speaker labels are requested, and the result is written as `{stem}.md` (the
transcript, with a provenance header and a `Speaker map` line the skill fills after the consultant
confirms it) and `{stem}.json` (the raw response, so the markdown can be re-cut without paying again).
The vendor copy is purged with a DELETE as soon as both files are written.

**Credentials are per-machine environment variables**, never on the shared drive: `ASSEMBLYAI_API_KEY`
(setup in `ONBOARDING.md` section 1.6). **Consent is a record**: AssemblyAI is a sub-processor, and the
skill checks the client's CONTEXT.md for the logged approval before the first upload. The script itself
does not check, so it is not to be run around the skill.

**Status: authored 2026-09-03, not yet run against a live account.** First-run verification is the
synthetic two-voice test in the skill's plan; log the result to CAPABILITIES.md either way.

## The render toolchain

Consolidated 2026-08-16 from the per-client scripts in `Teppermans/working/` (folder renamed 2026-09-11, formerly `Teppermans Rapid Assessment`) and
`ACFB/working/` (those copies stay put as the record of their own engagements; improve these
canonical ones rather than forking new per-client copies). All three are parameterized; run
`--help` on any of them for the full argument list. Each run from the client folder:

```powershell
python "../.claude/scripts/render_docx.py" --md working/draft_assessment.md --out "deliverables/{Client}_Assessment_{date}.docx" --client "{Client}" --client-logo source/logo.png --cover-line "Onsite {dates}"
python "../.claude/scripts/render_pptx.py" --md working/draft_proposal_deck.md --out "deliverables/{Client}_Presentation_{date}.pptx" --client "{Client}" --client-logo source/logo.png
python "../.claude/scripts/export_pdf.py" "deliverables/{Client}_Assessment_{date}.docx" "deliverables/{Client}_Presentation_{date}.pptx" --png
```

- **render_docx.py**: markdown draft to branded .docx. Clickable TOC field, bookmarked headings,
  `[text](#anchor)` appendix links, tier-tag coloring, zebra-striped tables with repeating header
  rows. The TOC populates at PDF export (or F9 in Word).
- **render_pptx.py**: slide-markdown draft to branded .pptx. The slide format (`## Slide N`,
  `Title:`, bullets, `Featured stat/quote:`, `Speaker notes:`) is documented in the script docstring.
  A content slide may also carry a markdown table (`| a | b |` rows; added 2026-09-08 for the
  per-project timeline and investment slides on a sales deck): Deep Blue header, zebra body, a bold
  row when the first cell starts with "Total", bullets rendered as a compact strip above it.
  Same day it gained four visual blocks, because a sales deck built from bullets came back "too
  text heavy": `Flow:` (process boxes joined by arrows, with captions), `Stat:` (big-number
  tiles), `Card:` (light panels with a title and one line) and `Gantt:` (week-based timeline
  bars). Blocks lay out top to bottom in draft order and spread to fill the slide; the
  docstring shows the syntax. Reach for these before a bullet list on any client deck. A `Kicker:` line
  renders as letterspaced Sky Blue caps above the headline (section or project name), so titles can be
  sentences that state the point while the kicker carries the label.
  A card row that is the only block on a slide fills the canvas: larger type, a Sky Blue accent rule
  under each title, the first sentence bold Deep Blue (the rule) and the rest grey (the reason), with a
  pale oversized step numeral watermarked behind the text. Stat tiles use the same light panel (Sky bar, hero number in Deep Blue, accent rule, grey caption)
  so tiles and cards read as one system; long "numbers" such as "5 to 7 days" step down to fit one line.
  Flow steps use the same panel too (title, accent rule, caption, watermark step number) with Sky Blue
  arrows between them, so a process slide and a card slide share one look.
  The Gantt block takes an optional fifth field per row (a lighter continuation tail to that week) and a
  `Gantt marker: week | label | region label` line that draws a Grass Green rule with light shading to its
  right, for "all live, iteration from here" moments.
- **render_docx.py + render_pptx.py both read the shared logo** from `logos/Powercloud_Logo-01.png`
  automatically; the client logo is a parameter.
- **export_pdf.py**: .docx/.pptx to PDF via Office COM. Updates fields (this is what fills the TOC),
  and `--png` exports deck slides for the mandatory visual inspection. Fonts must be installed for
  all users or COM substitutes them (`fonts/README.md`).
- **extract_docx_text.py**: pulls plain text from `source/` .docx files into `working/extracted/`
  for evidence mining; the word-count summary doubles as the stage-02 source-integrity check.
- **Backups are not run from here.** The OS is mirrored into a private git repo by
  `sync-backup.ps1`, which lives in that repo rather than on the drive. On a machine that has
  the clone it is at `~/source/repos/power-cloud-os-backup`; on one that does not, get it with
  `gh repo clone powercloud-mike/power-cloud-os-backup` and run `.\sync-backup.ps1` from there.
  Git is never run inside the shared drive: Drive for Desktop can capture `.git` mid-write and
  has no locking between machines, so two mounted computers can corrupt the object store. The
  Since 2026-10-12 the same script also mirrors Power Cloud's own NetSuite projects from the dev
  tree into `netsuite/` (crm, task-to-invoice, unapproved-hours-monitor, scriptreader, navan),
  canonical there like Paco; client projects and products with their own repos (PowerStripe,
  the Power* line) stay out. The
  repo also holds the Paco service source under `paco/`, where it is canonical rather than a
  copy, because that tree is under version control nowhere else.
- **check_board_mapping.py**: is this client wired up for Paco's Monday board update. Reads only
  CONTEXT.md (`Asana project` and `Project chat`), so no credentials and no network. Run it in a
  client folder, or `--client {Name}`, or `--all` for the whole workspace. Exit 0 means mapped.
  The parsing mirrors Paco's own index builder; Paco's copy is the source of truth if they drift.

## summarize_time_entries.py

Reads a client's `working/time_entries_{date}.json` (the extract `fetch_time_entries.py`
writes) and prints the arithmetic a consultant would otherwise do by eye: the date window
covered, MSP vs. billable hours split with percentages, per-resource hours and row counts,
and each resource's memos as a plain list (so a model drafting a status update has raw
material for a focus line instead of guessing).

```powershell
python "../.claude/scripts/summarize_time_entries.py"
python "../.claude/scripts/summarize_time_entries.py" --file working/time_entries_2026-09-20.json
python "../.claude/scripts/summarize_time_entries.py" --json
```

Run from the client folder. With no `--file` it picks the newest `working/time_entries_*.json`
by the date in the filename. Every skipped row (missing hours, unparseable date, a duplicate
by employee+date+hours+memo) is reported, never silently dropped. MSP vs. billable is read
from an `isbillable` T/F flag in every extract seen so far; a service/item-name mapping
(`SERVICE_ITEM_BUCKET`, a small constant at the top of the script) takes over automatically
if a future extract carries that field instead, and anything neither flag nor mapping can
place is reported as "unclassified" rather than guessed. No extract seen so far carries a
memo/description field; the script says so rather than pretending to have one. Exit code is
always 0; this is a report, not a gate. **Status: authored 2026-09-21, tests green.**

## meeting_time_blocks.py

Says where a meeting's time went, by work item, so a billed hour can be allocated instead of
estimated from memory. Gemini writes time-anchored headers into its meeting notes roughly once
a minute, plus a closing `Transcription ended after HH:MM:SS` line; that is enough to measure a
topic's share of a session.

```powershell
python .claude/scripts/meeting_time_blocks.py --pending "{Client}"
python .claude/scripts/meeting_time_blocks.py --blocks "{Client}/source/<notes>.md"
python .claude/scripts/meeting_time_blocks.py --stub   "{Client}/source/<notes>.md"
python .claude/scripts/meeting_time_blocks.py --check  "{Client}"
```

Run from the Power Cloud OS root. `--pending` lists Gemini notes exports in a client's `source/`
with no allocation yet, which is the per-session trigger. `--blocks` prints the time windows and
condensed text of one transcript. `--stub` prints a blank allocation section to paste and fill in.
`--check` rolls up the result and proves it: gaps, overlaps, segments that end before they start,
non-numeric billed values, and any session whose segments do not cover its duration.

**The split of deterministic from judgment work is the point.** The script parses, totals and
checks; **deciding which work item a window belongs to stays with the session and the consultant**,
because it is a materiality call that feeds a billed figure. It is never delegated to a worker
model. The output lands in the client's `working/time_allocation.md`, where the work item column is
the **billing destination** and the topic column records what the window actually contained, so a
roll-up stays visible rather than being flattened away.

Reads only the named client's `source/` and `working/time_allocation.md`. Anything without the
Gemini notes naming shape is skipped, including the `- meeting.md` provenance stubs Paco writes
alongside them. A transcript with no time anchors is reported as such rather than guessed at;
AssemblyAI transcripts from the `transcribe` skill carry none and have to be allocated by hand.
Exit code is 1 only for `--check` problems and unreadable input; this is a report, not a gate.
**Status: authored 2026-10-01 for Bomb Party, first run green against a 64.9 minute session.**

## check_candidates.py

Reads `working/candidates.md` and reports what the register's own rule (every candidate
leaves the list only by becoming a work item, fast-follow, client-side action, decision, or a
logged drop) depends on a human catching by eye otherwise: rows with no disposition, DROP
rows with no reason given, and duplicate candidate IDs. Only tables whose header ends in
"Disp." are read as candidate rows, so the register's separate "Decisions needed" table
(header ends "Owner") is correctly left alone rather than misread as all-blank.

```powershell
python "../.claude/scripts/check_candidates.py"
python "../.claude/scripts/check_candidates.py" --file working/candidates.md --json
```

Run from the client folder. Rows combining more than one disposition tag (e.g. "WI + CLIENT
(screen)") are reported for visibility but are not a failure on their own: the fixture register
has 12 such rows, all deliberate per its own findings-review note. Exit 1 if any row has no
disposition, any DROP has no reason, or any candidate ID repeats; exit 0 otherwise.
**Status: authored 2026-09-21, tests green.**

## check_crossrefs.py

Cross-checks the assessment, deck, and execution-plan markdown drafts before stage 05
renders them: every `[text](#anchor)` internal link resolves to a real heading, and every
work item ID mentioned in the deck or plan traces back to the assessment. The anchor check
runs `render_docx.py`'s own `slugify()` (copied verbatim, `bm_` prefix and all) over both the
heading text and the anchor text, so a link this script calls valid is guaranteed to resolve
at render time.

```powershell
python "../.claude/scripts/check_crossrefs.py" --assessment working/draft_assessment.md --deck working/draft_proposal_deck.md --plan "{Client}_Execution_Plan.md"
python "../.claude/scripts/check_crossrefs.py" --plan working/draft_project_plan.md --json
```

Any subset of `--assessment` / `--deck` / `--plan` is accepted; only the paths given are
opened. Because the deck is deliberately selective (WRITING_STANDARDS: completeness is the
document's job, not the deck's), a deck ID missing from the assessment fails, but the reverse
does not; the plan is checked bidirectionally against the assessment instead, since a build
task should always trace to a documented item. Headline numbers (bare integers, currency,
percentages, hours/weeks figures) that appear in the deck but nowhere in the assessment print
as a warning list, never a failure, since this is a fuzzy text match meant to catch an
obviously invented number, not to gate on it. Exit 1 on a broken link or a failing ID mismatch;
exit 0 otherwise. **Status: authored 2026-09-21, tests green.**

## parse_validate_log.py

Turns `suitecloud project:validate` output (file or stdin) into a severity/file/line table
with counts by severity and by file, so a 40-plus-line validate transcript does not hide the
two lines that matter. The step-status lines (`Validate manifest -- Success`) and the
`Line No. {n} - {message}` message format are confirmed against Oracle's own SDF CLI docs;
beyond that, the exact human-readable severity/file pairing varies by SDK version and is not
guessed into fact. This is deliberately a TOLERANT line-based parser: bracket- and
colon-prefixed severity lines are also matched as a generic fallback, and anything left over
is printed in an "unparsed" bucket rather than silently dropped. If the whole input parses as
the CLI's own `--json` output, that is read directly instead.

```powershell
python .claude/scripts/parse_validate_log.py path/to/validate_output.txt
suitecloud project:validate --server | python .claude/scripts/parse_validate_log.py
python .claude/scripts/parse_validate_log.py --json
```

Run from anywhere; it only reads the file given or stdin. Exit code is always 0: it reports
what is in the log, it does not judge whether the run passed.
**Status: authored 2026-09-21, tests green.**

## test_os_scripts.py

Unittest coverage for the four scripts above, with small inline fixtures (temp files) rather
than depending on any client's data: a duplicate and a malformed time-entry row, a candidate
row with a missing disposition and a DROP with no reason, a broken anchor link and an
unmatched work item ID, and three sample `validate` log lines (one of each severity).

```powershell
python .claude/scripts/test_os_scripts.py
```

Run from the Power Cloud OS root. 26 tests, all green as of authoring. Also exercised by hand
against the `44 Pro - AI Summit Test` fixture data (a real, if synthetic, client folder safe
to open) during authoring; that folder is not part of the automated suite; it is exploratory
sample data, not a regression fixture, so it may change without the tests noticing.

## render_os_guide.py

Renders `How to Work in the Power Cloud OS.docx` and its PDF from the markdown source.
