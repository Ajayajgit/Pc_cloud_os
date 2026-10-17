# -*- coding: utf-8 -*-
"""Turn `suitecloud project:validate` output into a severity/file/line table.

WHY THIS EXISTS
---------------
project:validate (sdf-deploy skill, and the execution skill's sandbox-first build
loop) prints a mix of step-status lines, warnings, and errors that are easy to
skim past when a validate run has 40-plus lines and only two of them matter. This
turns that transcript into one small table, sorted by severity, so a broken build
does not slip through because a warning scrolled off the terminal.

FORMAT, AND WHAT IS CONFIRMED VS. ASSUMED
--------------------------------------------
Confirmed from Oracle's own SDF CLI docs (SuiteCloud Project Validation,
docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4719750997.html and
section_4788674371.html, read 2026-09):
  * Human-readable output includes step-status lines like
    "Validate manifest -- Success" and "Validate objects -- Success".
  * Validation messages are formatted "Line No. {n} - {message}", e.g.
    "Line No. 13 - The attribute "position" is invalid, no attributes are
    expected."
  * A `--json` CLI flag exists (not `--format json`) for the CLI's own JSON
    output, though its error-detail fidelity is reported to vary by SDK version
    (github.com/oracle/netsuite-suitecloud-sdk issue #1165).

NOT independently confirmed: the exact human-readable prefix that pairs a
severity word (ERROR/WARNING) with a specific object or file for every SDK
version, and the precise field names inside `--json` output across versions.
Rather than hardcode a guess as fact, this is a TOLERANT, documented, line-based
parser:
  * `Line No. <n> - <message>` lines are matched directly (LINE_NO_RE). The
    severity is read from the message text itself ("Error Message:" / "Warning
    Message:" prefixes, seen in Oracle's own examples); if neither is present,
    the line is recorded as INFO. The file/object comes from the most recent
    line that looked like a file path or an "ObjectId:" line above it.
  * `[SEVERITY] ...` and `SEVERITY: ...` prefixed lines are matched
    (BRACKET_RE, PREFIX_RE) as a generic fallback for CLI/SDK versions that use
    those shapes instead.
  * `Validate <step> -- Success` / `-- Failed` step lines are recorded as INFO /
    ERROR respectively (STATUS_RE).
  * Anything left over is kept in an "unparsed" bucket and printed at the end
    rather than silently dropped, since a tolerant parser that hides its own
    gaps is worse than one that admits them.
  * If the WHOLE input parses as JSON, that is tried first (see parse_json());
    it looks for common shapes (`messages`/`results`/`errors`/`warnings` lists,
    or a bare top-level list) and reads severity/file/line/message under several
    plausible key spellings. If the JSON does not match a recognized shape, the
    original text is re-run through the line-based parser instead of failing.

USAGE
-----
    python .claude/scripts/parse_validate_log.py path/to/validate_output.txt
    suitecloud project:validate --server | python .claude/scripts/parse_validate_log.py
    python .claude/scripts/parse_validate_log.py --json   (emit the parsed table as JSON)

Never opens anything other than the file given or stdin. Exit code is always 0:
this reports what is in the log, it does not judge whether the run passed.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

LINE_NO_RE = re.compile(r"^\s*Line No\.\s*(\d+)\s*-\s*(.+)$")
BRACKET_RE = re.compile(
    r"^\s*\[(ERROR|WARNING|INFO)\]\s*(?:([^\s:]+?)(?::(\d+))?:\s*)?(.+)$", re.IGNORECASE
)
PREFIX_RE = re.compile(
    r"^\s*(ERROR|WARNING|INFO)\s*:\s*(?:([^\s:]+?)(?::(\d+))?:\s*)?(.+)$", re.IGNORECASE
)
STATUS_RE = re.compile(r"^\s*(Validate .+?)\s*--\s*(Success|Failed)\s*$", re.IGNORECASE)
OBJECT_ID_RE = re.compile(r"^\s*ObjectId:\s*(\S+)", re.IGNORECASE)
FILE_PATH_RE = re.compile(r"^\s*(?:File:\s*)?(/[\w./-]+\.\w+)\s*$")
BLANK_OR_BANNER_RE = re.compile(
    r"^\s*$|^\s*Validating using account|^\s*The project was validated", re.IGNORECASE
)

SEVERITIES = ("ERROR", "WARNING", "INFO")


def parse_json(text: str) -> "list[dict] | None":
    """Try the input as the CLI's own --json output. Returns None if the shape
    is not recognized, so the caller falls back to line parsing."""
    try:
        data = json.loads(text)
    except (json.JSONDecodeError, ValueError):
        return None

    candidates = None
    if isinstance(data, list):
        candidates = data
    elif isinstance(data, dict):
        for key in ("messages", "results", "issues", "errors", "warnings"):
            value = data.get(key)
            if isinstance(value, list):
                candidates = value
                break
    if candidates is None:
        return None

    records = []
    for item in candidates:
        if not isinstance(item, dict):
            continue
        severity = str(
            item.get("type") or item.get("severity") or item.get("level") or "INFO"
        ).upper()
        if severity not in SEVERITIES:
            severity = "INFO"
        file_ = item.get("file") or item.get("filename") or item.get("objectId") or ""
        line = item.get("line") or item.get("lineNumber") or item.get("line_no") or ""
        message = str(
            item.get("message") or item.get("text") or item.get("description") or item
        )
        records.append(
            {"severity": severity, "file": str(file_), "line": str(line), "message": message}
        )
    return records


def parse_lines(text: str) -> tuple[list[dict], list[str]]:
    records = []
    unparsed = []
    current_file = ""

    for raw_line in text.splitlines():
        line = raw_line.rstrip("\n")

        if BLANK_OR_BANNER_RE.match(line):
            continue

        obj_match = OBJECT_ID_RE.match(line)
        if obj_match:
            current_file = obj_match.group(1)
            continue

        file_match = FILE_PATH_RE.match(line)
        if file_match:
            current_file = file_match.group(1)
            continue

        status_match = STATUS_RE.match(line)
        if status_match:
            step, outcome = status_match.groups()
            severity = "ERROR" if outcome.lower() == "failed" else "INFO"
            records.append({"severity": severity, "file": current_file, "line": "", "message": step})
            continue

        line_no_match = LINE_NO_RE.match(line)
        if line_no_match:
            num, message = line_no_match.groups()
            lowered = message.lower()
            if "error" in lowered:
                severity = "ERROR"
            elif "warning" in lowered:
                severity = "WARNING"
            else:
                severity = "INFO"
            records.append(
                {"severity": severity, "file": current_file, "line": num, "message": message.strip()}
            )
            continue

        bracket_match = BRACKET_RE.match(line)
        if bracket_match:
            severity, file_, lineno, message = bracket_match.groups()
            records.append(
                {
                    "severity": severity.upper(),
                    "file": file_ or current_file,
                    "line": lineno or "",
                    "message": message.strip(),
                }
            )
            continue

        prefix_match = PREFIX_RE.match(line)
        if prefix_match:
            severity, file_, lineno, message = prefix_match.groups()
            records.append(
                {
                    "severity": severity.upper(),
                    "file": file_ or current_file,
                    "line": lineno or "",
                    "message": message.strip(),
                }
            )
            continue

        unparsed.append(line)

    return records, unparsed


def summarize(records: list[dict]) -> dict:
    by_severity = {}
    by_file = {}
    for rec in records:
        by_severity[rec["severity"]] = by_severity.get(rec["severity"], 0) + 1
        key = rec["file"] or "(no file)"
        by_file[key] = by_file.get(key, 0) + 1
    return {"by_severity": by_severity, "by_file": by_file}


def render_report(records: list[dict], unparsed: list[str], summary: dict, source: str) -> str:
    lines = [f"Validate log: {source}", ""]

    if not records:
        lines.append("No recognizable severity/message lines found.")
    else:
        widths = {
            "severity": max(len("SEVERITY"), max(len(r["severity"]) for r in records)),
            "file": max(len("FILE"), max(len(r["file"]) for r in records)),
            "line": max(len("LINE"), max(len(r["line"]) for r in records)),
        }
        header = (
            f"{'SEVERITY'.ljust(widths['severity'])}  "
            f"{'FILE'.ljust(widths['file'])}  "
            f"{'LINE'.ljust(widths['line'])}  MESSAGE"
        )
        lines.append(header)
        lines.append("-" * len(header))
        for rec in records:
            lines.append(
                f"{rec['severity'].ljust(widths['severity'])}  "
                f"{rec['file'].ljust(widths['file'])}  "
                f"{rec['line'].ljust(widths['line'])}  {rec['message']}"
            )
    lines.append("")

    lines.append("Counts by severity:")
    if not summary["by_severity"]:
        lines.append("  none")
    else:
        for sev in SEVERITIES:
            if sev in summary["by_severity"]:
                lines.append(f"  {sev}: {summary['by_severity'][sev]}")
    lines.append("")

    lines.append("Counts by file:")
    if not summary["by_file"]:
        lines.append("  none")
    else:
        for file_, count in sorted(summary["by_file"].items()):
            lines.append(f"  {file_}: {count}")
    lines.append("")

    lines.append(f"Unparsed lines ({len(unparsed)}):")
    if not unparsed:
        lines.append("  none")
    else:
        for line in unparsed:
            lines.append(f"  {line}")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "file", nargs="?", type=Path, default=None,
        help="Path to a saved validate log. Omit to read from stdin.",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of a text report.")
    args = parser.parse_args()

    if args.file is not None:
        if not args.file.is_file():
            print(f"error: {args.file} does not exist", file=sys.stderr)
            return 1
        text = args.file.read_text(encoding="utf-8", errors="replace")
        source = str(args.file)
    else:
        text = sys.stdin.read()
        source = "(stdin)"

    records = parse_json(text)
    unparsed: list[str] = []
    if records is None:
        records, unparsed = parse_lines(text)

    summary = summarize(records)

    if args.json:
        print(json.dumps({"source": source, "records": records, "unparsed": unparsed, "summary": summary}, indent=2))
    else:
        print(render_report(records, unparsed, summary, source))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
