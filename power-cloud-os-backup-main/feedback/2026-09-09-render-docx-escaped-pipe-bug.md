---
date: 2026-09-09
from: justin
source: Bixbi
area: .claude/scripts/render_docx.py
type: bug
cost: 10m
blocking: no
frequency: first-time
status: new
---

## What happened
[Verified] Rendering the Bixbi SO Removed Line Log FDD & TDD handover, a markdown table row containing `PC \| SO Removed Line Log` (the escaped pipe needed because Power Cloud's standard `PC | ` script-naming convention puts a literal `|` in the name) broke the table: `parse_markdown_table`'s naive `line.split('|')` read the escaped pipe as a real column separator, shifting every cell after it into the wrong column. Justin caught this from a screenshot of the rendered docx. After a first fix (protecting/restoring escaped pipes during table-row splitting), a second screenshot showed the same `\|` sequence leaking literally into the rendered text elsewhere in the document, this time inside a plain bullet (not a table), which the first fix didn't cover since it only touched the table-parsing path.

## What I did instead
Fixed both paths in the shared `render_docx.py`: `parse_markdown_table` now protects escaped pipes before splitting a row on `|` and restores them after, and `add_rich_text` (the one function shared by bullets, paragraphs, and table cells) now unescapes `\|` to `|` as its first step, so any future doc using this renderer is covered regardless of where the escaped pipe appears. Re-rendered and re-exported the handover doc twice (once per fix) and verified via a direct read of the generated docx (table cell contents, and a scan for any remaining `\|` in paragraph text) before sending the corrected PDF back.

## Suggested fix
- [Reported] Justin: caught via visual inspection of the rendered PDF, no fix proposed beyond "this looks wrong."
- [Inferred] Claude: fixed at the source in the shared renderer (see above); no further action needed there. Worth a one-time check of already-shipped docs built with this renderer before the fix that use the `PC \| Script Name` pattern in a table or bullet - specifically Bixbi's own signed Use Case (`Bixbi_UseCase_SO_Removed_Line_Log_2026-09-02.docx`) and UAT Test Steps doc, neither of which has been re-rendered or visually re-checked since. Not urgent (the Use Case is already signed and the table-shift bug, if present, doesn't change any commercial figure), but worth a quick look next time either doc is touched.

## Disposition
