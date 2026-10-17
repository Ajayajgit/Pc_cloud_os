---
date: 2026-09-02
from: justin
source: internal
area: fonts/README.md
type: bug
cost: 45m
blocking: no
frequency: first-time
class: wrong
autonomy: n-a
status: new
---

## What happened
[Verified] During the Bixbi Pet SO Removed Line Log Use Case render, the brand Montserrat static font files at `../fonts/` (`Montserrat-Regular.ttf`, `Montserrat-Medium.ttf`, `Montserrat-SemiBold.ttf`, `Montserrat-Bold.ttf`) failed to embed correctly in a Word-COM PDF export (both `SaveAs` and `ExportAsFixedFormat` affected). The font installed cleanly, registered correctly in the Windows registry, was visible to GDI (`System.Drawing.Text.InstalledFontCollection`), and Word's own `Selection.Font.Name` correctly reported "Montserrat" as applied after setting it, but the exported PDF silently substituted Arial for every Montserrat run regardless of weight. Barlow, the other brand font, embedded correctly through the identical install process, ruling out a general install-process problem.

Root cause found via `fontTools` inspection: the static Montserrat `.ttf` files carry a leftover `STAT` table, a variable-font "style attributes" construct normally only meaningful alongside an `fvar` table, which these static files do not have. Barlow's static files carry no `STAT` table. This is the same family-shadowing category of issue already documented in `../fonts/README.md` for the *variable* Montserrat font, but here it affects files that were supposed to be the clean static fix.

Troubleshooting tried this session (admin access via the user, not the agent): raw file copy to `C:\Windows\Fonts` (did not register the font at all), Explorer "Install for all users" (registered it properly, confirmed via registry), removing the shadowing variable font file and its registry entries, restarting the Windows Font Cache service, restarting the Print Spooler, a full machine reboot, and stripping the `STAT` table from the four static files with `fontTools` and reinstalling. None of it fixed the PDF embedding outcome; the on-screen/GDI path works fine (confirmed by `InstalledFontCollection` and Word's `Selection.Font.Name`), but Word's PDF/XPS export path specifically keeps substituting Arial for Montserrat regardless of weight.

## What I did instead
Shipped the Bixbi Use Case `.docx`/`.pdf` with headings rendering in Arial instead of Montserrat (client approved deprioritizing this rather than continuing to chase it). Body text (Barlow) is unaffected and embeds correctly throughout.

## Suggested fix
- [Reported] Justin: pull a fresh, clean static Montserrat build from Google Fonts' official source to replace the current files in `../fonts/`, on the theory that the current static files likely came from a variable-font export tool that leaves stray tables in, and a canonical static release probably doesn't have this problem.
- [Inferred] Claude: alternative if the Google Fonts static build has the same issue, re-export static weights from the variable font using `fonttools varLib.instancer` with explicit table stripping during the export itself (not patching an existing file after the fact, which did not fix it here). Also worth testing whether the same PDF-embedding failure reproduces via LibreOffice/`soffice` (not installed on this machine, untested), to isolate whether it is Word-COM-specific or a property of the font file itself that any renderer would choke on.

## Disposition

