# Stage 05 — Humanize, review, render

One job: strip the AI copy tells, get every draft and every hours figure explicitly approved, then render the approved markdown into branded finals.

- Working inputs: the three drafts in `working/`, `working/candidates.md`, `working/loe_log.md`
- Reference: `../QA_CHECKLIST.md` sections 3, 4, and "before delivery"; `../POWERCLOUD_BRAND_GUIDELINES.md`; `../LOE_BASELINES.md`; `../fonts/README.md`
- Outputs: humanized drafts, completed `working/loe_log.md`, finals in `deliverables/` (.docx, .pptx, PDFs)
- Human check: the draft review + LOE/commercial checkpoint below; nothing renders before it passes.

## Humanize pass (after drafting, before draft review)

Run the `humanizer` skill (installed at `.claude/skills/humanizer`, project root) over the client-facing drafts (assessment document and deck; the execution plan is internal and skips this) so the human reviews humanized text at the checkpoint. Rules of engagement: document type is "client-facing commercial document"; `WRITING_STANDARDS.md` (root) is the voice file and wins any conflict with the skill; numbers, LOE figures, priorities, product names, billing language, and attributed quotes are untouchable (flag concerns at the checkpoint, never rewrite them silently). Then run the deterministic scanner and clear every hit or consciously waive it (mark the line `copy-ignore` with a reason; a waived hit gets mentioned at the checkpoint):

```
python "../.claude/skills/humanizer/scripts/copy_scan.py" working/draft_assessment.md working/draft_proposal_deck.md
```

(Run from the client folder, same `../` root convention as the playbook files; `python3` on Mac. Scan any additional client-facing drafts the same way.)

This mechanically enforces the WRITING_STANDARDS bans (em-dashes, filler) plus the wider AI-tell library. A `structural-humanizer` pass is optional and limited to its business-documents calibration (theme restatement, reference specificity); tidy, resolved, linear structure is correct in these deliverables.

## Checkpoint: draft review + LOE/commercial review

Run QA_CHECKLIST sections 3 and 4. First reconcile the draft against `working/candidates.md`: every candidate promoted or marked fast-follow appears in the draft, and every drop carries its logged reason. Nothing the mining captured (for example a [Verified] root cause like the customer-deposit / revenue-recognition finding) may silently vanish in drafting or get quietly shrunk into a smaller item than the evidence warrants. The LOE review is line-by-line and must be called out, not assumed: every hours figure, priority, and the billing language get explicit confirmation before rendering. Figures marked `[no prior basis]` get first attention. Log every line in `working/loe_log.md` (Claude's figure, approved figure, one-line reason for changes; unchanged logs as confirmed). LOE numbers are commercially binding once sent: Claude drafts, a human owns.

## Render

Only after markdown drafts are approved. Read `POWERCLOUD_BRAND_GUIDELINES.md`. If branded templates exist at `templates/`, start from those. The canonical render scripts live at `../.claude/scripts/` (`render_docx.py`, `render_pptx.py`, `export_pdf.py`; see `../.claude/scripts/CONTEXT.md` for usage); start from those rather than writing new ones, and propose improvements back to the canonical copies rather than forking per client. python-docx/python-pptx for files, Office COM for PDF export. The .docx must render a working, clickable **table of contents** and the **task-table-to-Appendix-A cross-reference links**; python-docx does not produce these out of the box (they need bookmarks plus hyperlink/TOC fields, and the TOC field is updated on open via Office COM), so build them explicitly and confirm every TOC entry and appendix link resolves in the exported PDF. Export deck slides to PNG and inspect visually before delivering. Send a PDF alongside the .pptx and .docx. Run QA_CHECKLIST "before delivery." **Delegate:** run `python "../.claude/scripts/check_crossrefs.py"` and `check_candidates.py` for the mechanical reconciliation, then hand the PNG folder and the two scripts' JSON output to `pc-qa-inspector` (Haiku) for the slide-by-slide read and the hit table. Its report is an extra detector: every failure it lists is fixed or named at the checkpoint by you, and its pass does not replace your own look at the cover, one full work item, and the hours table.

**Fonts (this is where renders break).** Before rendering, verify Montserrat and Barlow are available; the brand fonts are bundled at `fonts/` (root) so a machine that is missing them can install rather than fail. Two gotchas, both documented in `fonts/README.md`: (1) fonts installed for the current user only are often invisible to Office COM during PDF export, so they must be installed **for all users** (into `C:\Windows\Fonts`); (2) prefer the **static** weight files over `Montserrat-VariableFont_wght.ttf`, which python-pptx/COM frequently substitute. If Montserrat substitutes in the render, the variable font is the first suspect. Flag a genuinely unresolvable font gap rather than shipping a substituted render.
