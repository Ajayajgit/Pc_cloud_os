# -*- coding: utf-8 -*-
"""Extract plain text from client .docx files in source/ for evidence mining.

Canonical version, consolidated 2026-08-16 from Teppermans Rapid Assessment/
working/convert_docx.py. Walks --src recursively, writes one .txt per document
into --out, preserving paragraph order and flattening tables to pipe-separated
rows. Prints a word-count summary, largest first, which doubles as the stage-02
source-integrity check: a file an order of magnitude smaller than its peers is
probably a notes-only stub, and image-heavy files need their images read
separately.

Run from the client folder:

    python "../.claude/scripts/extract_docx_text.py"
    python "../.claude/scripts/extract_docx_text.py" --src source --out working/extracted
"""
import argparse
import glob
import os
import sys

from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph


def extract(path):
    doc = Document(path)
    lines = []
    for el in doc.element.body.iter():
        tag = el.tag.split('}')[-1]
        if tag == 'p':
            t = Paragraph(el, doc).text.strip()
            if t:
                lines.append(t)
        elif tag == 'tbl':
            for row in Table(el, doc).rows:
                cells = [c.text.strip() for c in row.cells]
                if any(cells):
                    lines.append(" | ".join(cells))
    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--src', default='source', help='folder to scan for .docx (default: source)')
    ap.add_argument('--out', default=os.path.join('working', 'extracted'),
                    help='output folder for .txt files (default: working/extracted)')
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    results = []
    for path in glob.glob(os.path.join(args.src, "**", "*.docx"), recursive=True):
        name = os.path.basename(path)
        if name.startswith('~$'):  # Office lock files
            continue
        safe = name.replace(".docx", "").replace("/", "_").replace(":", "")
        try:
            text = extract(path)
        except Exception as e:
            print(f"error: could not read {name}: {e}", file=sys.stderr)
            continue
        outpath = os.path.join(args.out, safe + ".txt")
        with open(outpath, "w", encoding="utf-8") as f:
            f.write(text)
        results.append((name, len(text.split()), outpath))

    for name, wc, _ in sorted(results, key=lambda x: -x[1]):
        print(f"{wc:>7} words | {name}")
    print(f"\nTotal files: {len(results)}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
