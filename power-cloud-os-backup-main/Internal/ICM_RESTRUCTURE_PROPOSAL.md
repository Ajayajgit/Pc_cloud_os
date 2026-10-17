# Power Cloud OS: ICM restructure proposal

Drafted 2026-08-16. Method: Interpretable Context Methodology (Van Clief & McDermott, arXiv:2603.16021).

## Status

**All five steps approved and done, 2026-08-16.**

- [x] **1. Stamp.** `templates/client-record/` built, plus `templates/CONTEXT.md` to route the folder.
      `MH Crane` stamped from it, the first folder created by copy rather than by hand.
- [x] **2. CLAUDE.md trim.** The CONTEXT.md template moved to `templates/client-record/CONTEXT.md`
      and is now a two-line pointer. `new-engagement/SKILL.md` and `Internal/ROLLOUT_PUNCHLIST.md`
      updated to match, so no reference points at the old location.
- [x] **3. Catalog.** `.claude/scripts/build_engagement_log.py` and the generated `ENGAGEMENT_LOG.md`.
      Zero edits to any client folder.
- [x] **4. Render toolchain extracted** to `.claude/scripts/`: `render_docx.py` (ACFB's TOC/
      bookmarks/links base plus Teppermans' tier coloring and zebra tables), `render_pptx.py`,
      `export_pdf.py` (now also does the deck PNG export), and `extract_docx_text.py` (what
      `convert_docx.py` actually was: a source-mining text extractor, not a PDF exporter). All
      parameterized; client copies left in place as engagement records. Verified end to end on a
      sample draft: TOC populated in the PDF, 10 live link annotations, PNGs inspected.
      `Upward Projects/validators/` left alone (client work, per Mike).
- [x] **5. Skill split.** `rapid-assessment/SKILL.md` is now a ~1,700-token router over
      `stages/01_pre-onsite.md` … `06_retro.md` (474 to 2,066 tokens each). Content relocated
      verbatim, spot-checked one hit per distinctive phrase; frontmatter unchanged so the trigger
      surface is identical. First live proof: MH Crane.

**Honest note on step 2:** the template payload is out of the routing file, which was the ICM point,
but three new pointer lines went in, so CLAUDE.md went 86 lines to 75 and roughly 4,900 tokens to
4,830. Effectively flat. Getting it near the 300 to 800 target needs a real L0/L1 split, which is a
larger change than was proposed here and is not recommended lightly given the silent-failure risk
measured on 2026-08-12.

## Scope, decided before drafting

**In:** the client record template, the engagement catalog, extraction of rendering tooling into a
single home, and a small trim to CLAUDE.md.

**Out, and why:**

- **Nesting the flat root.** Settled on 2026-08-12 and measured: 63 of 77 references to root files are
  bare filename mentions in prose, so nesting fails silently rather than loudly. Revisit past roughly
  25 to 30 root files.
- **Moving build work out of client folders.** Raised and rejected. The work belongs with the client
  it was done for. The template below is designed to hold build work, not to push it elsewhere.
- **The duplicate folders** (`Teppermans` / `Teppermans Rapid Assessment`, `Shinesty RA` /
  `Shinesty Redo`) and the empty `MH Crane`. Listed as open items at the bottom. No changes proposed
  until you have checked who has been working where.

## What the workspace is

A composed ICM, and mostly a correct one. The repeating unit is a **client engagement**, so the shelf
is a **record library**. Each record runs a **pipeline** (pre-onsite, assessment, execution) whose
stage contracts live in `.claude/skills/`. The root reference files are the shared **factory**.

Three things are already right and are not being touched: the factory/product split is real, skills
load on demand instead of bloating CLAUDE.md, and `working/` carries a genuine state surface
(`evidence.md`, `verification.md`, `candidates.md`, `loe_log.md`).

## Findings

| # | Finding | Evidence |
|---|---|---|
| 1 | **No record template.** New clients are created by instruction ("create source/, working/, deliverables/"), not by copying a stamp. | Six engagement folders, six shapes. Three use `Source/`, three use `source/`. |
| 2 | **Factory code lives in product folders.** Rendering has been rewritten per client. | 18 KB across 3 scripts in `Teppermans Rapid Assessment/working/`, 14 KB across 2 in `ACFB/working/`, plus ~80 KB of docx/pptx validators in `Upward Projects/validators/`. Same job, five homes. |
| 3 | **No catalog.** Answering "what is in flight" means opening ten folders. | Status exists only as a bullet inside each `CONTEXT.md`. |
| 4 | **State files vary by client.** The pipeline's own state surface is convention, not contract. | `candidates.md` exists in `44 Pro` and `ACFB`, absent in `Shinesty RA` and `Teppermans Rapid Assessment`. `loe_log.md` absent in `Teppermans Rapid Assessment`. |
| 5 | **Loose files at record roots.** The schema says client material goes in `source/`. | `Teppermans Rapid Assessment/` root holds a `.js` and a `.pdf`. |
| 6 | **CLAUDE.md carries payload.** ~4,900 tokens against an entry-file target of 300 to 800. | The `CONTEXT.md` template at the bottom is roughly 30 lines of it, and it is template content, not routing. |
| 7 | **The assessment skill is one contract doing eight jobs.** Route, pre-onsite prep, evidence mining, candidate register, verification, product fits, drafting three deliverables, humanize, render, retro. | `rapid-assessment/SKILL.md` is ~6,750 tokens, all of it loaded to do any one step. |

Findings 1, 2, and 7 are the ones that cost real time. The rest are hygiene.

### On finding 7, the cost in numbers

The skill defers its heavy reference files well ("read them when you reach the step that needs them"),
which is correct layered loading at L3. The problem is one level up: the contract itself is monolithic.

Rendering a deck currently loads CLAUDE.md (~4,900) plus the whole skill (~6,750) before reading a
single input, and the skill then routes to `WRITING_STANDARDS.md` (~3,900), `NETSUITE_PLAYBOOK.md`
(~5,800), `QA_CHECKLIST.md` (~2,700) and the brand guidelines. Call it 30,000 tokens for a step whose
actual contract is about 800 words. Pre-onsite prep, the candidate register rules, and the retro
procedure are all in that load, and none of them apply.

The ICM-native fix keeps one skill and splits the contract:

```
.claude/skills/rapid-assessment/
├─ SKILL.md              router: route-first, the three habits, a stage table
└─ stages/
   ├─ 01_pre-onsite.md
   ├─ 02_evidence-mining.md
   ├─ 03_verification.md
   ├─ 04_drafting.md
   ├─ 05_humanize-render.md
   └─ 06_retro.md
```

SKILL.md drops to roughly 1,500 tokens and each stage contract lands at 800 to 1,500, read only when
that stage is active. Same content, same rules, nothing deleted. This is the largest single quality
gain available and also the most invasive, because the skill is load-bearing for every engagement. It
should be its own approved change, not folded in with the template work.

## Target tree

Only the marked lines change.

```
Power Cloud OS/
├─ CLAUDE.md                     trimmed: template moves out
├─ ENGAGEMENT_LOG.md             NEW, generated catalog
├─ {11 reference .md files}      unchanged, flat by decision
├─ .claude/
│  ├─ skills/                    unchanged
│  ├─ hooks/                     unchanged
│  └─ scripts/
│     ├─ CONTEXT.md              NEW, how to call these
│     ├─ render_docx.py          NEW, canonical
│     ├─ render_pptx.py          NEW, canonical
│     ├─ export_pdf.py           NEW, canonical
│     ├─ validate_deliverable.py NEW, canonical
│     └─ render_os_guide.py      unchanged
├─ templates/
│  ├─ client-record/             NEW, the stamp
│  ├─ engagement/                unchanged
│  └─ data/                      unchanged
├─ fonts/ logos/ Internal/ Archive/   unchanged
└─ {Client}/                     records, shape defined by the stamp
```

`templates/` keeps its existing name rather than becoming `_templates/`. The ICM convention prefers
the underscore, but CLAUDE.md already references `../templates/` and renaming would break that for no
gain.

`ENGAGEMENT_LOG.md` goes at the root, not in `Internal/`. Consultants need it, and `Internal/` is
access-restricted precisely because nothing in the engagement workflow reads from it. Putting the log
there would break that property. It takes the root from 12 files to 13, well under the revisit
threshold.

## The stamp

```
templates/client-record/
├─ CONTEXT.md              the fact sheet, with YAML frontmatter for the catalog
├─ .claude/settings.json   the render gate, copied from hooks/client-settings-template.json
├─ source/                 client-provided material, read-only
├─ working/                scratch and state surface
├─ deliverables/           finals only
└─ execution/              build work, active from execution phase onward
```

A new client becomes a copy of this folder instead of five instructions Claude has to follow
correctly. `execution/` ships in the stamp because build work stays with the client.

The contract describing what belongs in each of the four folders lives **once**, in the factory
(CLAUDE.md and the skills already carry it), not stamped into every record. Uniform shape means the
contract belongs upstream.

The `CONTEXT.md` template is the existing one lifted out of CLAUDE.md, unchanged. No frontmatter, no
new fields, nothing to backfill. The reason is the next section.

## The status surface already exists

Checking the six records against each other turned up something better than the frontmatter scheme
originally sketched here: **the workflow already writes its own state to disk**, one file per
completed stage. Status does not need declaring, it needs reading.

| File in `working/` | Means |
|---|---|
| `onsite_prep.md` | pre-onsite prep done |
| `evidence.md` | mining done |
| `verification.md` | account verification done |
| `candidates.md` | candidate register built |
| `*draft*.md` | drafting started |
| `loe_log.md` | LOE review underway or done |
| `retro.md` | engagement closed out |
| `deliverables/*.docx` | shipped |

That is invariant 9 working already, undeclared. `evidence.md` and `verification.md` are present in
five of six records (the sixth, `American Barbell`, is an execution engagement and correctly has a
different shape). So the catalog generator reads what is on disk and needs **no edits to any client
folder at all**, which also removes the backfill step and the risk that came with it.

One caveat, and it is finding 1 again from a different angle: draft filenames have drifted badly.
`draft_assessment.md`, `assessment_draft.md`, `ACFB_Assessment_draft.md`, and `draft_project_plan.md`
are four names for one thing across four records. `candidates.md` appears in only two of six, because
it is a newer addition to the skill. The generator can glob around this, but the stamp is what stops
it recurring.

## Migration map

| Old path | New path | Role |
|---|---|---|
| CONTEXT.md template inside `CLAUDE.md` | `templates/client-record/CONTEXT.md` | catalog to factory |
| `.claude/hooks/client-settings-template.json` | also copied into the stamp | factory (stays where it is too) |
| `Teppermans Rapid Assessment/working/render_docx.py` | `.claude/scripts/render_docx.py` | product to factory |
| `Teppermans Rapid Assessment/working/render_pptx.py` | `.claude/scripts/render_pptx.py` | product to factory |
| `Teppermans Rapid Assessment/working/convert_docx.py` | fold into `export_pdf.py` | product to factory |
| `ACFB/working/render_assessment.py` | reconcile into `render_docx.py` | product to factory |
| `ACFB/working/export_pdf.py` | `.claude/scripts/export_pdf.py` | product to factory |
| `Upward Projects/validators/*` | `.claude/scripts/validate_deliverable.py` | product to factory |
| (none) | `ENGAGEMENT_LOG.md` | new catalog |
| (none) | `.claude/scripts/build_engagement_log.py` | new generator |

**Extraction is a copy, not a cut.** The client copies stay where they are. They are the record of how
that specific deliverable was rendered, and removing them would edit finished engagements to tidy the
factory. Future runs read the canonical version.

## What changes day to day

**New client, today:** Claude reads eight session-start steps and creates four folders and a settings
file by hand, getting the capitalization right or not.

**New client, after:** copy `templates/client-record/` to `{Client}/`, fill in the fact sheet. One
step, no drift.

**"What is in flight," today:** open ten `CONTEXT.md` files.

**After:** read `ENGAGEMENT_LOG.md`, regenerated by script from frontmatter.

**Rendering a deliverable, today:** find the most recent client that rendered something similar, copy
its script, adjust.

**After:** call the canonical script in `.claude/scripts/`.

## Sequence if approved

1. Scaffold `templates/client-record/`. Additive, touches no existing client folder. ~30 minutes.
   Then stamp **`MH Crane`** with it. That engagement is starting and its folder is empty, so it is
   the one place the template can be proven end to end with nothing to disturb and no migration. It
   also means the notes you are owed land in a `source/` folder that already exists.
2. Trim the template out of CLAUDE.md, add the pointer. ~10 minutes.
3. Write `build_engagement_log.py` and generate `ENGAGEMENT_LOG.md`. Reads existing CONTEXT.md files,
   writes nothing into them. ~45 minutes.
4. Extract the rendering tooling. **The big one.** Requires reading and reconciling five scripts
   totalling ~32 KB, plus deciding how much of the Upward Projects validator suite generalizes.
   Half a day, and worth scoping on its own before starting.
5. Split `rapid-assessment/SKILL.md` into a router plus six stage contracts (finding 7). Its own
   approved change, because that skill is load-bearing for every engagement. Roughly half a day, and
   the payoff is the largest of anything here.

Steps 1 to 3 are safe and additive: nothing is written into any existing client folder, and every one
of them is reversible by deleting a new file. Steps 4 and 5 are real work and each deserves its own
go-ahead.

## Walk test

The ICM validation: walk the workspace cold, as an agent with no memory. Six checks, run against the
workspace as it stands today and as it would stand after the steps above.

| Check | Before (2026-08-16) | After all five steps |
|---|---|---|
| Root answers "where am I" and "where do I go" in the entry file plus at most two reads | **Pass** | Pass |
| A stage contract names exact inputs, the job, the output, and the human check | **Partial.** One contract covered eight stages; inputs were bare filenames. | **Pass.** Six stage files, each with inputs/outputs/human-check header. |
| Pipeline status readable by scanning output folders | **Partial.** The surface existed but nothing read it. | **Pass.** `ENGAGEMENT_LOG.md`, generated. |
| No routing file carrying content payload | **Fail.** CLAUDE.md held the record template. | **Pass.** Template lives in the stamp. |
| One home per fact | **Fail.** Rendering logic had five homes. | **Pass.** Canonical toolchain in `.claude/scripts/`; client copies remain as records, not sources. |
| A step's full context lands in 2,000 to 8,000 tokens | **Fail.** A drafting step loaded roughly 30,000. | **Pass** for the stage layer: router ~1.7k + stage 0.5-2.1k. CLAUDE.md's ~4.8k still rides along on every load; acceptable, it is the always-loaded rules. |

## Open items, needing you

- **`Teppermans` vs `Teppermans Rapid Assessment`**, the second containing a nested `Teppermans/`.
  You flagged this as mostly test data pending a check on who has been working where.
- **`Shinesty RA` vs `Shinesty Redo`.** Same check.
- **No id scheme for records.** Folder names are the only identifier, which is what allows the
  ambiguity above. A scheme (`ra-04-shinesty`) would fix it but renames ten folders on a Shared Drive
  with live links. Recommend leaving alone unless the ambiguity bites again.
- ~~**Step 4 scope.** How much of `Upward Projects/validators/` is practice tooling?~~ Answered
  2026-08-16: client work, Mike was not involved. Leave it alone; step 4 covers the render scripts only.
