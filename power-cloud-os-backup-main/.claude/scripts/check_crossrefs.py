# -*- coding: utf-8 -*-
"""Cross-check the assessment, deck, and execution-plan drafts before rendering.

WHY THIS EXISTS
---------------
Stage 04 (rapid-assessment) drafts three markdown files that all trace back to the
same work items, and stage 05 renders them to .docx/.pptx before a checkpoint. A
broken internal link renders as a dead hyperlink in the delivered .docx (caught, if
at all, only by the mandatory PDF visual inspection); a work item ID the deck
mentions but the assessment never documents is a silent gap a reader can hit but a
consultant proofreading top to bottom easily misses. This runs before rendering so
those two things are caught by a machine instead of by the client.

ANCHOR CHECKING, MATCHED TO render_docx.py
--------------------------------------------
render_docx.py bookmarks every heading and resolves `[text](#anchor)` links by
running its OWN slugify() over both the heading text and the anchor text typed
after the `#`:

    def slugify(anchor_text):
        return 'bm_' + re.sub(r'[^a-z0-9]+', '_', anchor_text.lower()).strip('_')

That is copied verbatim here (see slugify() below) so a link this script calls
valid is guaranteed to resolve at render time, and one it calls broken is
guaranteed to render as a dead link. This means anchors use underscores, not
hyphens, despite how a heading slug often reads in other tools; matching the
renderer's actual code, not the general convention, is the whole point.

WORK ITEM / TASK ID CROSS-REFERENCING
----------------------------------------
The 44 Pro fixture (working/draft_project_plan.md, an implementation-roadmap
engagement that combines the assessment and the execution plan into one file) uses
one ID namespace throughout: WORKSTREAM-N, such as R2R-1, O2C-9, SETUP-2, DEC-10.
The execution plan's own task IDs are the same work item IDs (04_drafting.md:
"Each task is self-contained: ID + title cross-referenced to its work item").
WORK_ITEM_RE below is that one pattern, used for both "work item ID" and "task ID"
purposes; there is no second ID scheme to detect in the material available.

Chosen direction for the cross-checks, because the deck and, to a lesser extent,
the execution plan are deliberately selective while the assessment is the complete
register (WRITING_STANDARDS / 04_drafting.md: "the deck is selective...
completeness is the document's job, not the deck's"):

  * deck -> assessment: FAILS if the deck mentions an ID the assessment never
    documents. Not required in reverse: the assessment covers far more than the
    10-15 slide deck ever will, by design.
  * plan <-> assessment: FAILS in both directions. A build task should always
    trace to a documented item, and a promoted work item that never got a plan
    task is worth flagging (it may be intentionally CLIENT/DEC-gated and not
    buildable yet, but that is exactly the kind of thing worth a human glance
    before render).

Headline numbers (bare integers, currency, percentages, hours figures) that
appear in the deck but nowhere in the assessment are listed as a WARNING only,
never a failure: this is a fuzzy text match against normalized digits, meant to
catch an obviously invented number, not to gate on it.

USAGE
-----
Run from the client folder, any subset of the three:

    python "../.claude/scripts/check_crossrefs.py" --assessment working/draft_assessment.md --deck working/draft_proposal_deck.md --plan "44 Pro_Execution_Plan.md"
    python "../.claude/scripts/check_crossrefs.py" --plan working/draft_project_plan.md --json

Only the paths given are opened; nothing else in working/, source/, or
deliverables/ is touched.

Exit 1 on any broken internal link or any failing ID mismatch (see direction
rules above). Exit 0 otherwise. Headline-number warnings never affect exit code.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$", re.MULTILINE)
LINK_RE = re.compile(r"\[([^\]]+)\]\(#([^)]+)\)")

# Prefix is 3-8 characters starting with a letter, digits allowed after the
# first character (R2R, O2C, P2P are real prefixes in the candidate/work-item
# vocabulary, not just letter-only ones like SETUP or TAX). The 3-character
# floor is deliberate: it excludes the evidence-ref and candidate-source-ref
# schemes used in the same drafts (E1-037, E2-062, C1-001, C2-041), which are
# exactly a single letter plus a single digit and would otherwise be mistaken
# for work item IDs, polluting the cross-file ID comparison. Every real work
# item prefix observed (R2R, TAX, ITEM, O2C, P2P, INV, INT, MIG, GOV, CLIENT,
# DEC, SETUP) is 3 characters or longer. The number is capped at 3 digits so a
# bare year or a larger number in prose (2026, 44100) is not mistaken for a
# work item ID; the biggest ID seen in practice is two digits (DEC-10). An
# optional trailing lowercase letter covers split items like "R2R-1a".
WORK_ITEM_RE = re.compile(r"\b[A-Z][A-Z0-9]{2,7}-\d{1,3}[a-z]?\b")

# Bare integers, currency, percentages, and hours/week figures. Deliberately
# loose: this feeds a warning list, not a failure.
HEADLINE_NUM_RE = re.compile(
    r"\$\s?\d[\d,]*(?:\.\d+)?\s?[MKk]?\b"
    r"|\b\d[\d,]*(?:\.\d+)?\s?%"
    r"|\b\d[\d,]*(?:\.\d+)?\s?(?:hours?|hrs|weeks?|days?)\b"
)


def slugify(anchor_text: str) -> str:
    """Copied from render_docx.py so this matches the renderer exactly."""
    return "bm_" + re.sub(r"[^a-z0-9]+", "_", anchor_text.lower()).strip("_")


def load_doc(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    headings = {}  # slug -> heading text (first one wins, mirrors Word bookmarks)
    for match in HEADING_RE.finditer(text):
        heading_text = match.group(2)
        slug = slugify(heading_text)
        headings.setdefault(slug, heading_text)

    links = []  # {text, anchor_raw, resolved_slug}
    for match in LINK_RE.finditer(text):
        link_text, anchor_raw = match.group(1), match.group(2)
        links.append(
            {"text": link_text, "anchor_raw": anchor_raw, "resolved": slugify(anchor_raw)}
        )

    ids = set(WORK_ITEM_RE.findall(text))
    numbers = {normalize_number(m) for m in HEADLINE_NUM_RE.findall(text)}
    numbers.discard("")

    return {"path": path, "text": text, "headings": headings, "links": links, "ids": ids, "numbers": numbers}


def normalize_number(raw: str) -> str:
    return re.sub(r"[\s,]", "", raw).lower()


def check_links(doc: dict) -> list[dict]:
    broken = []
    for link in doc["links"]:
        if link["resolved"] not in doc["headings"]:
            broken.append(
                {
                    "file": str(doc["path"]),
                    "text": link["text"],
                    "anchor_raw": link["anchor_raw"],
                    "resolved": link["resolved"],
                }
            )
    return broken


def check_ids(name_a: str, doc_a: dict, name_b: str, doc_b: dict, bidirectional: bool) -> dict:
    """IDs in A missing from B always fail. IDs in B missing from A fail only
    when bidirectional=True (see docstring: deck->assessment is one-directional
    because the deck is deliberately selective; plan<->assessment is checked
    both ways)."""
    only_a = sorted(doc_a["ids"] - doc_b["ids"])
    only_b = sorted(doc_b["ids"] - doc_a["ids"])
    return {
        "name_a": name_a,
        "name_b": name_b,
        "only_in_a": only_a,
        "only_in_b": only_b,
        "fail_a": bool(only_a),
        "fail_b": bool(only_b) and bidirectional,
    }


def check_headline_numbers(deck: dict, assessment: dict) -> list[str]:
    missing = sorted(deck["numbers"] - assessment["numbers"])
    return missing


def build_report(docs: dict) -> dict:
    result = {
        "files": sorted(docs.keys()),
        "broken_links": [],
        "id_checks": [],
        "headline_number_warnings": [],
    }

    for name, doc in docs.items():
        result["broken_links"].extend(check_links(doc))

    if "deck" in docs and "assessment" in docs:
        result["id_checks"].append(
            check_ids("deck", docs["deck"], "assessment", docs["assessment"], bidirectional=False)
        )
        result["headline_number_warnings"] = check_headline_numbers(docs["deck"], docs["assessment"])

    if "plan" in docs and "assessment" in docs:
        result["id_checks"].append(
            check_ids("plan", docs["plan"], "assessment", docs["assessment"], bidirectional=True)
        )

    return result


def has_failures(result: dict) -> bool:
    if result["broken_links"]:
        return True
    for check in result["id_checks"]:
        if check["fail_a"] or check["fail_b"]:
            return True
    return False


def render_report(result: dict) -> str:
    lines = [f"Cross-reference check: {', '.join(result['files'])}", ""]

    lines.append(f"Broken internal links ({len(result['broken_links'])}):")
    if not result["broken_links"]:
        lines.append("  none")
    else:
        for link in result["broken_links"]:
            lines.append(
                f"  {link['file']}: [{link['text']}](#{link['anchor_raw']}) "
                f"-> resolves to '{link['resolved']}', no matching heading"
            )
    lines.append("")

    for check in result["id_checks"]:
        a, b = check["name_a"], check["name_b"]
        lines.append(f"ID check, {a} vs {b}:")
        tag_a = "FAIL" if check["fail_a"] else ("info" if check["only_in_a"] else "ok")
        tag_b = "FAIL" if check["fail_b"] else ("info" if check["only_in_b"] else "ok")
        lines.append(
            f"  only in {a} [{tag_a}] ({len(check['only_in_a'])}): "
            f"{', '.join(check['only_in_a']) or 'none'}"
        )
        lines.append(
            f"  only in {b} [{tag_b}] ({len(check['only_in_b'])}): "
            f"{', '.join(check['only_in_b']) or 'none'}"
        )
        lines.append("")

    lines.append(
        f"Headline numbers in the deck not found anywhere in the assessment "
        f"({len(result['headline_number_warnings'])}, warning only):"
    )
    if not result["headline_number_warnings"]:
        lines.append("  none")
    else:
        for num in result["headline_number_warnings"]:
            lines.append(f"  {num}")
    lines.append("")

    lines.append("Result: FAIL" if has_failures(result) else "Result: PASS")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--assessment", type=Path, default=None)
    parser.add_argument("--deck", type=Path, default=None)
    parser.add_argument("--plan", type=Path, default=None)
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of a text report.")
    args = parser.parse_args()

    given = {"assessment": args.assessment, "deck": args.deck, "plan": args.plan}
    given = {k: v for k, v in given.items() if v is not None}
    if not given:
        print("error: give at least one of --assessment, --deck, --plan", file=sys.stderr)
        return 1

    docs = {}
    for name, path in given.items():
        if not path.is_file():
            print(f"error: {name} file not found: {path}", file=sys.stderr)
            return 1
        docs[name] = load_doc(path)

    result = build_report(docs)

    if args.json:
        print(json.dumps(result, indent=2, default=str))
    else:
        print(render_report(result))

    return 1 if has_failures(result) else 0


if __name__ == "__main__":
    raise SystemExit(main())
