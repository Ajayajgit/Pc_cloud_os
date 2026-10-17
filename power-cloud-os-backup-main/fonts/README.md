# Brand fonts

Montserrat and Barlow (the Power Cloud brand fonts, both SIL Open Font License, free to bundle and redistribute). Stored here so any consultant's machine can render deliverables with correct fonts, and so the render step can install them if they are missing rather than failing mid-render.

## The render-failure gotcha

The fonts being "installed" is not enough on its own. Two things bite:

1. **Per-user vs all-users install.** Double-clicking a `.ttf` and choosing "Install" installs it for the current user only (`%LOCALAPPDATA%\Microsoft\Windows\Fonts`). Office automation via COM (which we use to export PDFs) often cannot see per-user fonts and substitutes silently. **Install for all users** (right-click the file, "Install for all users", which needs admin and writes to `C:\Windows\Fonts`) so the PDF export sees them.
2. **Variable font.** `Montserrat-VariableFont_wght.ttf` is a single variable file. python-pptx / python-docx and PowerPoint COM handle static weight files far more reliably. Prefer the static weights (`Montserrat-Regular/Medium/SemiBold/Bold`) and the matching Barlow statics; treat the variable file as a fallback, not the primary. If Montserrat still substitutes during render, the variable font is the first suspect.

## If Montserrat exports as Calibri: uninstall the variable font (no admin needed)

Confirmed on MH Crane, 2026-08-17. **Installing the statics is not enough if the variable font is also installed.** It declares its legacy family as `Montserrat Thin` while claiming `Montserrat` as its *typographic* family, so it shadows the static faces and Word binds to an instance it cannot embed. Every naming fails: `Montserrat`+bold, `Montserrat` plain, `Montserrat SemiBold`, `Montserrat Medium`, `Montserrat Bold` all came out as Calibri.

**Fix, 30 seconds, no admin:** `Win+R` -> `ms-settings:fonts` -> search `Montserrat` -> click the face named **Montserrat Thin** (that is the variable file, the name is misleading) -> Uninstall. Or:

```powershell
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts" -Name "Montserrat Thin (TrueType)"
Remove-Item "$env:LOCALAPPDATA\Microsoft\Windows\Fonts\Montserrat-VariableFont_wght.ttf" -Force
```

You lose only Thin/Light/ExtraLight/ExtraBold/Black, which that file alone provided and the brand does not use. Regular/Medium/SemiBold/Bold are separate static files and stay.

**The diagnostic that separates the two failure modes:** if one brand font embeds correctly and the other does not, it is family shadowing, not install scope, and an all-users install will not help. On MH Crane Barlow embedded fine from the per-user folder while Montserrat failed from the same folder.

**Verify after any font change** rather than trusting the look of a thumbnail:

```python
import fitz
d = fitz.open("deliverables/<file>.pdf")
fonts = {x[3].split("+")[-1] for p in d for x in p.get_fonts()}
print(sorted(fonts))          # want Montserrat-*, Barlow-*
print([f for f in fonts if "Calibri" in f] or "clean")
```

## If Montserrat renders correctly on-screen/in Word's own model but still substitutes (Arial/Times/Calibri) specifically during Save-As-PDF, with no variable font present

Found on this machine, 2026-09-03, while rendering the GW Monthly Sales Reporting Use Case. Symptoms that distinguish this from the variable-font case above:

- No `Montserrat-VariableFont_wght.ttf` installed anywhere (checked `C:\Windows\Fonts` and `%LOCALAPPDATA%\Microsoft\Windows\Fonts`).
- `Word.Application.FontNames` (COM) lists `Montserrat` as available, and a paragraph's `Font.Name` property correctly reads back `"Montserrat"` after setting it, both interactively and headless.
- Barlow (same install method, same OS/2 `fsType`/`fsSelection`/`usWeightClass` bits, same `name` table structure per `fontTools`) embeds correctly in the exported PDF (`Barlow-Regular`, `Barlow-Bold` show up in `fitz`'s `get_fonts()`); Montserrat, in every family-string variant tried (`Montserrat`, `Montserrat Regular`, `Montserrat SemiBold`, `Montserrat Bold`, with and without the bold flag), does not, embedding as `ArialMT`/`Arial-BoldMT`/`Cambria`/`Calibri` instead.
- `doc.EmbedTrueTypeFonts = True` before `SaveAs` PDF does not change the outcome.

**One real difference found and fixed, but it did not resolve the PDF-export symptom:** Montserrat had a duplicate per-user registration (`%LOCALAPPDATA%\Microsoft\Windows\Fonts\Montserrat-*.ttf` plus matching `HKCU:\...\Fonts` entries) alongside the all-users `C:\Windows\Fonts` copy; Barlow only had the all-users copy. Removed the per-user duplicate (files + registry values) as the same-class fix the variable-font section above documents. Font-model-level behavior (`FontNames`, `Font.Name`) was unaffected either way; PDF-export substitution persisted after the removal.

**Not yet tried, and not something Claude should do on its own:** a Windows Font Cache service (`FontCache`) restart, or a reboot, to clear whatever GDI/print-driver-level cache is still holding a bad Montserrat mapping specifically for the embedding/print path. That crosses into a system-level change and needs the consultant's own hands, not an agent session's. If a consultant hits this, that is the next thing to try, and worth a one-line follow-up here on whether it worked.

## Install (all users, PowerShell as admin)

```powershell
$fonts = "G:\Shared drives\Power Cloud OS\fonts"
Get-ChildItem $fonts -Filter *.ttf | Where-Object { $_.Name -notmatch 'VariableFont' } | ForEach-Object {
  Copy-Item $_.FullName "C:\Windows\Fonts" -Force
}
```

(Copying into `C:\Windows\Fonts` registers the font for all users on modern Windows. If a font does not show up, add the registry value under `HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts`.)

## Files

Static weights (use these): Barlow Regular/Medium/SemiBold/Bold, Montserrat Regular/Medium/SemiBold/Bold. Plus `Montserrat-VariableFont_wght.ttf` (fallback only).
