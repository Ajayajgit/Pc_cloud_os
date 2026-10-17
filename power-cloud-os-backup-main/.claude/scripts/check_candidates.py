# -*- coding: utf-8 -*-
"""Check working/candidates.md for disposition gaps before findings review.

WHY THIS EXISTS
---------------
The candidate register (rapid-assessment stage 02) is the promise that no
discovered item quietly disappears: every candidate leaves the list only by
becoming a work item, moving to fast-follow, becoming a client-side action, a
decision, or being dropped with a reason. That promise depends on every row
actually carrying a disposition. This script reads the register and reports what
would otherwise only be caught by a consultant rereading a 700-plus-line table by
eye at checkpoint 2.

TABLE SHAPE (from the 44 Pro fixture, working/candidates.md)
--------------------------------------------------------------
The register is a series of "## Area" sections, each holding one markdown table.
Candidate tables end their header row in a "Disp." column:

    | ID | Candidate | Sources | Disp. |
    |---|---|---|---|
    | R2R-1 | ... | C1-001, C1-002 | WI (foundation) |

Only tables whose header's last column is "Disp." (case-insensitive) are treated
as candidate rows. The fixture also has a "Decisions needed" table with a
different last column ("Owner") that is a decision register, not a disposition
list, and is intentionally skipped by this check rather than misread as "no
disposition."

Disposition vocabulary, from the fixture's own legend: **WI** (work item), **FF**
(fast-follow), **CLIENT** (client-side action), **DEC** (decision needed), **DROP**
(dropped, with a reason). A cell can legitimately combine more than one, e.g.
"WI + CLIENT (screen)" or "FF (agreed on-site) with WI (demo, small)": the fixture
sample has 20-plus such rows, all deliberate per its own findings-review note. So
"more than one disposition" is reported for visibility but is NOT treated as a
failure on its own; only a genuinely EMPTY cell fails. DROP is different: DROP
with no parenthetical or trailing explanation is treated as a reason-less drop and
DOES fail, because "DROP (with reason)" is the register's own stated rule.

USAGE
-----
Run from the client folder:

    python "../.claude/scripts/check_candidates.py"
    python "../.claude/scripts/check_candidates.py" --file working/candidates.md --json

Never opens anything outside the one candidates.md path given or defaulted.

Exit 1 if there is any row with no disposition, any DROP with no reason, or any
duplicate candidate ID. Exit 0 otherwise. Rows with more than one disposition tag
are reported but do not affect the exit code (see above).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

DISPOSITION_TOKENS = ("WI", "FF", "CLIENT", "DEC", "DROP")
TOKEN_RE = re.compile(r"\b(" + "|".join(DISPOSITION_TOKENS) + r")\b")


SEPARATOR_RE = re.compile(r"^\|[\s:|-]+\|?$")


def split_row(line: str) -> "list[str] | None":
    """Split a '| a | b | c |' markdown table row into trimmed cells, or None
    if the line is not a table row at all (a separator row still returns cells;
    callers that need to skip it check is_separator separately)."""
    stripped = line.strip()
    if not stripped.startswith("|"):
        return None
    cells = [c.strip() for c in stripped.strip("|").split("|")]
    return cells


def is_separator(line: str) -> bool:
    return bool(SEPARATOR_RE.match(line.strip()))


def parse_candidates(text: str) -> dict:
    """Walk the markdown, collecting rows from tables whose header ends 'Disp.'.

    State machine per table: the first pipe-row after a non-table line is the
    header (checked for a trailing "Disp." column); the immediately following
    "|---|---|" separator row is skipped without disturbing that state; every
    pipe-row after that is data, until a non-table line ends the table.
    """
    rows = []  # list of {section, id, disposition, line}
    section = "(no section)"
    in_disp_table = False
    header_seen = False

    for lineno, raw_line in enumerate(text.splitlines(), start=1):
        if raw_line.startswith("## "):
            section = raw_line[3:].strip()
            in_disp_table = False
            header_seen = False
            continue

        cells = split_row(raw_line)
        if cells is None:
            in_disp_table = False
            header_seen = False
            continue

        if is_separator(raw_line):
            # Belongs to the table whose header was just read; carries no data.
            continue

        if not header_seen:
            header_seen = True
            last = cells[-1].lower().rstrip(".") if cells else ""
            in_disp_table = last == "disp"
            continue

        if not in_disp_table:
            continue

        if len(cells) < 2:
            continue
        row_id = cells[0]
        disposition = cells[-1]
        rows.append(
            {"section": section, "id": row_id, "disposition": disposition, "line": lineno}
        )

    return rows


def analyze(rows: list[dict]) -> dict:
    no_disposition = []
    multi_disposition = []
    drop_no_reason = []
    unrecognized = []
    seen_ids: dict[str, int] = {}
    duplicate_ids = []

    for row in rows:
        rid = row["id"]
        if rid in seen_ids:
            duplicate_ids.append({"id": rid, "first_line": seen_ids[rid], "dup_line": row["line"]})
        else:
            seen_ids[rid] = row["line"]

        disp = row["disposition"]
        if not disp or disp in {"-", "TBD", "tbd"}:
            no_disposition.append(row)
            continue

        tokens = sorted(set(TOKEN_RE.findall(disp)))
        if not tokens:
            unrecognized.append(row)
            continue
        if len(tokens) > 1:
            multi_disposition.append(row)

        if "DROP" in tokens:
            # A reason is anything beyond the bare word DROP: a parenthetical,
            # or trailing text after it (e.g. "DROP, superseded by R2R-1").
            remainder = TOKEN_RE.sub("", disp, count=0).strip(" ,.-()")
            has_paren = "(" in disp and ")" in disp
            if not remainder and not has_paren:
                drop_no_reason.append(row)

    return {
        "total": len(rows),
        "no_disposition": no_disposition,
        "multi_disposition": multi_disposition,
        "drop_no_reason": drop_no_reason,
        "unrecognized": unrecognized,
        "duplicate_ids": duplicate_ids,
    }


def render_report(analysis: dict, source: Path) -> str:
    lines = [f"Candidate register check: {source}", ""]
    lines.append(f"Total candidate rows: {analysis['total']}")
    lines.append("")

    def section(title, items, formatter):
        lines.append(f"{title} ({len(items)}):")
        if not items:
            lines.append("  none")
        else:
            for item in items:
                lines.append(f"  {formatter(item)}")
        lines.append("")

    section(
        "Rows with no disposition", analysis["no_disposition"],
        lambda r: f"line {r['line']}: {r['id']} ({r['section']})",
    )
    section(
        "DROP rows with no reason given", analysis["drop_no_reason"],
        lambda r: f"line {r['line']}: {r['id']} ({r['section']}) -> {r['disposition']!r}",
    )
    section(
        "Duplicate candidate IDs", analysis["duplicate_ids"],
        lambda d: f"{d['id']}: first at line {d['first_line']}, again at line {d['dup_line']}",
    )
    section(
        "Rows with more than one disposition tag (informational, not a failure)",
        analysis["multi_disposition"],
        lambda r: f"line {r['line']}: {r['id']} -> {r['disposition']!r}",
    )
    section(
        "Rows with an unrecognized disposition value (not blank, not WI/FF/CLIENT/DEC/DROP)",
        analysis["unrecognized"],
        lambda r: f"line {r['line']}: {r['id']} -> {r['disposition']!r}",
    )

    failing = (
        bool(analysis["no_disposition"])
        or bool(analysis["drop_no_reason"])
        or bool(analysis["duplicate_ids"])
    )
    lines.append("Result: FAIL" if failing else "Result: PASS")
    return "\n".join(lines)


def has_failures(analysis: dict) -> bool:
    return bool(analysis["no_disposition"]) or bool(analysis["drop_no_reason"]) or bool(
        analysis["duplicate_ids"]
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--file", type=Path, default=Path("working/candidates.md"),
        help="Path to candidates.md (default: working/candidates.md).",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of a text report.")
    args = parser.parse_args()

    if not args.file.is_file():
        print(f"error: {args.file} does not exist", file=sys.stderr)
        return 1

    text = args.file.read_text(encoding="utf-8", errors="replace")
    rows = parse_candidates(text)
    analysis = analyze(rows)

    if args.json:
        print(json.dumps(analysis, indent=2, default=str))
    else:
        print(render_report(analysis, args.file))

    return 1 if has_failures(analysis) else 0


if __name__ == "__main__":
    raise SystemExit(main())
