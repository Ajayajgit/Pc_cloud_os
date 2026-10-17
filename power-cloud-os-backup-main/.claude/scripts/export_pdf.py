# -*- coding: utf-8 -*-
"""Export rendered deliverables to PDF (and deck slides to PNG) via Office COM.

Canonical exporter, consolidated 2026-08-16 from ACFB/working/export_pdf.py,
generalized to take any .docx or .pptx path and to handle the PNG inspection
export the render stage requires.

    python "../.claude/scripts/export_pdf.py" deliverables/Client_Assessment.docx
    python "../.claude/scripts/export_pdf.py" deliverables/Client_Presentation.pptx --png

For .docx the fields are updated before export, which is what populates the TOC
built by render_docx.py; confirm every TOC entry and appendix link resolves in
the PDF. For .pptx, --png also exports one PNG per slide into a sibling folder
named {deck}_png for the mandatory visual inspection.

Fonts must be installed for all users or Office COM will substitute them in the
PDF (fonts/README.md). If a save hits a file lock, kill orphaned Office
processes and rerun.
"""
import argparse
import sys
from pathlib import Path

import comtypes.client

WD_FORMAT_PDF = 17
PP_FORMAT_PDF = 32


def export_docx(path: Path) -> Path:
    pdf = path.with_suffix('.pdf')
    word = comtypes.client.CreateObject('Word.Application')
    word.Visible = False
    try:
        doc = word.Documents.Open(str(path))
        doc.Fields.Update()
        try:
            doc.TablesOfContents(1).Update()
        except Exception as e:
            print(f"TOC update note: {e}")
        doc.Save()
        doc.SaveAs(str(pdf), FileFormat=WD_FORMAT_PDF)
        doc.Close()
    finally:
        word.Quit()
    return pdf


def export_pptx(path: Path, png: bool) -> Path:
    pdf = path.with_suffix('.pdf')
    powerpoint = comtypes.client.CreateObject('PowerPoint.Application')
    try:
        pres = powerpoint.Presentations.Open(str(path), WithWindow=False)
        pres.SaveAs(str(pdf), PP_FORMAT_PDF)
        if png:
            png_dir = path.parent / f"{path.stem}_png"
            png_dir.mkdir(exist_ok=True)
            for i, slide in enumerate(pres.Slides, start=1):
                slide.Export(str(png_dir / f"slide_{i:02d}.png"), "PNG", 1920, 1080)
            print(f"Slides exported to: {png_dir}")
        pres.Close()
    finally:
        powerpoint.Quit()
    return pdf


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('files', nargs='+', help='.docx and/or .pptx files to export')
    ap.add_argument('--png', action='store_true',
                    help='for .pptx inputs, also export one PNG per slide for visual inspection')
    args = ap.parse_args()

    failures = 0
    for f in args.files:
        path = Path(f).resolve()
        if not path.exists():
            print(f"error: not found: {path}", file=sys.stderr)
            failures += 1
            continue
        suffix = path.suffix.lower()
        try:
            if suffix == '.docx':
                print(f"Exported: {export_docx(path)}")
            elif suffix == '.pptx':
                print(f"Exported: {export_pptx(path, args.png)}")
            else:
                print(f"error: unsupported type {suffix}: {path}", file=sys.stderr)
                failures += 1
        except Exception as e:
            print(f"error exporting {path.name}: {e}", file=sys.stderr)
            failures += 1
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
