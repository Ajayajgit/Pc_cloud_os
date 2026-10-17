# -*- coding: utf-8 -*-
"""Summarize a client's working/time_entries_{date}.json for the weekly review.

WHY THIS EXISTS
---------------
fetch_time_entries.py drops one JSON extract per client per pull, and a consultant
opening a client folder still has to eyeball 60-plus rows to answer "how much MSP
time, how much billable, who worked on what, does anything look wrong." This script
does that arithmetic and prints a report, so the read is a summary instead of a
raw dump. It never fetches anything itself; it only reads what is already on disk.

SHAPE OF THE INPUT
-------------------
The extract observed from fetch_time_entries.py (44 Pro fixture, 2026-09) is a dict
with top-level `entries: [...]` plus header metadata (`customer_name`, `period_start`,
`period_end`, `entry_count`, `total_hours`). Each entry has been seen with these
fields, and no others: `trandate` (M/D/YYYY, sometimes zero-padded), `hours` (a
number OR a numeric string), `isbillable` ("T" / "F"), `employee_name`,
`customer_name`, `customer_id`, `project_type`, `project_status`. There is no memo,
description, or service-item field in the fixture data pulled so far. The field
names below are candidate lists rather than a fixed schema, because NetSuite saved
search column names drift between accounts; the script picks the first candidate
present on the first entry and reports which one it used.

MSP VS. BILLABLE
-----------------
The fixture classifies purely by the `isbillable` flag (T/F); there is no service
or item field to key off in the data seen so far. If a future extract carries a
service/item column instead, map its values in SERVICE_ITEM_BUCKET below (a small,
editable constant) and the script prefers that mapping over isbillable whenever the
field is present and the value is mapped. Anything that is neither mappable by item
nor a recognized T/F value is reported separately as "unclassified" rather than
silently guessed into a bucket.

USAGE
-----
Run from the client folder:

    python "../.claude/scripts/summarize_time_entries.py"
    python "../.claude/scripts/summarize_time_entries.py" --file working/time_entries_2026-09-20.json
    python "../.claude/scripts/summarize_time_entries.py" --json

With no --file, the newest working/time_entries_*.json is picked by the date in
its filename (falling back to file mtime if a filename cannot be parsed). This
never opens anything else in working/ or source/; only the one JSON file named or
selected.

Exit code: always 0. This is a report, not a gate; skipped rows are surfaced in
the output, never silently dropped.
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

# Candidate field names, in preference order. The first one present on the first
# entry is used for the whole file; NetSuite saved-search exports rename columns
# between clients more often than the data itself changes shape.
EMPLOYEE_FIELDS = ("employee_name", "employee", "resource")
DATE_FIELDS = ("trandate", "date")
HOURS_FIELDS = ("hours",)
ISBILLABLE_FIELDS = ("isbillable", "billable")
ITEM_FIELDS = ("service_item", "item", "itemname", "serviceitem")
MEMO_FIELDS = ("memo", "description", "note", "notes")

# Configure this when a client's extract carries a service/item field instead of
# (or in addition to) isbillable. Keys are lowercased item names, values are
# "billable" or "msp". Preferred over isbillable when the field is present and the
# row's value is a mapped key; falls through to isbillable otherwise. Empty by
# default because no extract seen so far carries this field.
SERVICE_ITEM_BUCKET: dict[str, str] = {
    # "msp retainer": "msp",
    # "project - implementation": "billable",
}

TRUE_VALUES = {"t", "true", "1", "yes", "y"}
FALSE_VALUES = {"f", "false", "0", "no", "n"}

DATE_FORMATS = ("%m/%d/%Y", "%-m/%-d/%Y", "%Y-%m-%d", "%m-%d-%Y")


def first_present(entry: dict, candidates: tuple[str, ...]) -> str | None:
    for name in candidates:
        if name in entry:
            return name
    return None


def parse_date(raw) -> "datetime | None":
    text = str(raw).strip()
    if not text:
        return None
    # Windows Python does not support the "-m"/"-d" no-pad strptime directives
    # portably, so pad manually and try the padded format instead of relying on
    # DATE_FORMATS entries that only work on some platforms.
    parts = text.replace("-", "/").split("/")
    if len(parts) == 3 and len(parts[0]) <= 2 and len(parts[2]) == 4:
        try:
            month, day, year = (int(p) for p in parts)
            return datetime(year, month, day)
        except ValueError:
            pass
    for fmt in ("%Y-%m-%d", "%m-%d-%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def parse_hours(raw) -> "float | None":
    if raw is None:
        return None
    try:
        value = float(str(raw).strip())
    except (TypeError, ValueError):
        return None
    if value < 0:
        return None
    return value


def classify_row(entry: dict, item_field: str | None, bill_field: str | None) -> str:
    if item_field:
        raw = str(entry.get(item_field, "")).strip().lower()
        bucket = SERVICE_ITEM_BUCKET.get(raw)
        if bucket:
            return bucket
    if bill_field:
        raw = str(entry.get(bill_field, "")).strip().lower()
        if raw in TRUE_VALUES:
            return "billable"
        if raw in FALSE_VALUES:
            return "msp"
    return "unclassified"


def find_latest_file(working_dir: Path) -> "Path | None":
    candidates = sorted(working_dir.glob("time_entries_*.json"))
    if not candidates:
        return None

    def sort_key(path: Path):
        stem = path.stem  # time_entries_2026-09-20
        date_part = stem.replace("time_entries_", "", 1)
        try:
            return (0, datetime.strptime(date_part, "%Y-%m-%d"))
        except ValueError:
            try:
                return (1, datetime.fromtimestamp(path.stat().st_mtime))
            except OSError:
                return (1, datetime.min)

    return max(candidates, key=sort_key)


def process_entries(entries: list[dict]) -> dict:
    result = {
        "rows_total": len(entries),
        "rows_kept": 0,
        "skipped": [],  # list of {index, reason}
        "date_min": None,
        "date_max": None,
        "billable_hours": 0.0,
        "msp_hours": 0.0,
        "unclassified_hours": 0.0,
        "unclassified_values": set(),
        "by_resource": {},  # name -> {"hours": float, "rows": int, "memos": [str]}
        "fields_used": {},
        "memo_field": None,
    }
    if not entries:
        return result

    first = entries[0]
    employee_field = first_present(first, EMPLOYEE_FIELDS)
    date_field = first_present(first, DATE_FIELDS)
    hours_field = first_present(first, HOURS_FIELDS)
    bill_field = first_present(first, ISBILLABLE_FIELDS)
    item_field = first_present(first, ITEM_FIELDS)
    memo_field = first_present(first, MEMO_FIELDS)
    result["fields_used"] = {
        "employee": employee_field,
        "date": date_field,
        "hours": hours_field,
        "isbillable": bill_field,
        "item": item_field,
        "memo": memo_field,
    }
    result["memo_field"] = memo_field

    seen_keys = set()

    for idx, entry in enumerate(entries, start=1):
        employee = str(entry.get(employee_field, "")).strip() if employee_field else ""
        if not employee:
            result["skipped"].append({"index": idx, "reason": "missing employee name"})
            continue

        hours = parse_hours(entry.get(hours_field)) if hours_field else None
        if hours is None:
            result["skipped"].append({"index": idx, "reason": "missing or unparseable hours"})
            continue

        raw_date = entry.get(date_field) if date_field else None
        parsed_date = parse_date(raw_date)
        if parsed_date is None:
            result["skipped"].append(
                {"index": idx, "reason": f"unparseable date ({raw_date!r})"}
            )
            continue

        memo = str(entry.get(memo_field, "")).strip() if memo_field else ""
        dedup_key = (employee, parsed_date.date().isoformat(), hours, memo)
        if dedup_key in seen_keys:
            result["skipped"].append(
                {"index": idx, "reason": "duplicate row (same employee, date, hours, memo)"}
            )
            continue
        seen_keys.add(dedup_key)

        result["rows_kept"] += 1
        if result["date_min"] is None or parsed_date < result["date_min"]:
            result["date_min"] = parsed_date
        if result["date_max"] is None or parsed_date > result["date_max"]:
            result["date_max"] = parsed_date

        bucket = classify_row(entry, item_field, bill_field)
        if bucket == "billable":
            result["billable_hours"] += hours
        elif bucket == "msp":
            result["msp_hours"] += hours
        else:
            result["unclassified_hours"] += hours
            if item_field:
                result["unclassified_values"].add(str(entry.get(item_field, "")).strip())
            elif bill_field:
                result["unclassified_values"].add(str(entry.get(bill_field, "")).strip())

        resource = result["by_resource"].setdefault(
            employee, {"hours": 0.0, "rows": 0, "memos": []}
        )
        resource["hours"] += hours
        resource["rows"] += 1
        if memo:
            resource["memos"].append(memo)

    return result


def render_report(result: dict, source: Path, meta: dict) -> str:
    lines = []
    lines.append(f"Time entries summary: {source}")
    if meta.get("customer_name"):
        lines.append(f"Customer (as pulled): {meta['customer_name']}")
    lines.append("")

    if result["date_min"] and result["date_max"]:
        window = (
            f"{result['date_min'].date().isoformat()} to "
            f"{result['date_max'].date().isoformat()}"
        )
    else:
        window = "no usable rows"
    lines.append(f"Date window covered: {window}")
    lines.append(
        f"Rows: {result['rows_total']} total, {result['rows_kept']} counted, "
        f"{len(result['skipped'])} skipped"
    )
    if meta.get("entry_count") is not None and meta["entry_count"] != result["rows_total"]:
        lines.append(
            f"  note: file header says entry_count={meta['entry_count']}, "
            f"but {result['rows_total']} rows were read"
        )
    lines.append("")

    total = result["billable_hours"] + result["msp_hours"] + result["unclassified_hours"]
    lines.append("MSP vs. billable hours:")
    if total <= 0:
        lines.append("  no counted hours")
    else:
        for label, hours in (
            ("Billable", result["billable_hours"]),
            ("MSP / non-billable", result["msp_hours"]),
            ("Unclassified", result["unclassified_hours"]),
        ):
            pct = (hours / total) * 100 if total else 0.0
            lines.append(f"  {label}: {hours:.2f}h ({pct:.1f}%)")
    if result["unclassified_values"]:
        values = ", ".join(sorted(v for v in result["unclassified_values"] if v))
        lines.append(f"  unclassified values seen: {values or '(blank)'}")
    fields = result["fields_used"]
    classifier = "item field" if fields.get("item") else "isbillable field"
    lines.append(
        f"  classified by: {classifier} "
        f"(isbillable field used: {fields.get('isbillable') or 'none found'})"
    )
    lines.append("")

    lines.append("Per resource:")
    if not result["by_resource"]:
        lines.append("  none")
    else:
        for name in sorted(result["by_resource"]):
            r = result["by_resource"][name]
            lines.append(f"  {name}: {r['hours']:.2f}h across {r['rows']} rows")
    lines.append("")

    if result["memo_field"] is None:
        lines.append("Memos: no memo/description field found in this data source.")
    else:
        lines.append(f"Memos per resource (field: {result['memo_field']}):")
        any_memo = False
        for name in sorted(result["by_resource"]):
            memos = result["by_resource"][name]["memos"]
            if memos:
                any_memo = True
                lines.append(f"  {name}:")
                for memo in memos:
                    lines.append(f"    - {memo}")
        if not any_memo:
            lines.append("  field present but every row's memo was blank")
    lines.append("")

    lines.append(f"Skipped rows ({len(result['skipped'])}):")
    if not result["skipped"]:
        lines.append("  none")
    else:
        for row in result["skipped"]:
            lines.append(f"  row {row['index']}: {row['reason']}")

    return "\n".join(lines)


def to_json_result(result: dict, source: Path, meta: dict) -> dict:
    return {
        "source": str(source),
        "customer_name": meta.get("customer_name"),
        "rows_total": result["rows_total"],
        "rows_kept": result["rows_kept"],
        "skipped": result["skipped"],
        "date_min": result["date_min"].date().isoformat() if result["date_min"] else None,
        "date_max": result["date_max"].date().isoformat() if result["date_max"] else None,
        "billable_hours": round(result["billable_hours"], 2),
        "msp_hours": round(result["msp_hours"], 2),
        "unclassified_hours": round(result["unclassified_hours"], 2),
        "unclassified_values": sorted(v for v in result["unclassified_values"] if v),
        "fields_used": result["fields_used"],
        "memo_field": result["memo_field"],
        "by_resource": {
            name: {
                "hours": round(r["hours"], 2),
                "rows": r["rows"],
                "memos": r["memos"],
            }
            for name, r in sorted(result["by_resource"].items())
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--file", type=Path, default=None,
        help="Explicit time_entries_*.json path. Defaults to the newest one in --dir.",
    )
    parser.add_argument(
        "--dir", type=Path, default=Path("working"),
        help="Folder to look for time_entries_*.json in when --file is not given (default: working).",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of a text report.")
    args = parser.parse_args()

    source = args.file
    if source is None:
        source = find_latest_file(args.dir)
        if source is None:
            print(f"error: no time_entries_*.json found under {args.dir}", file=sys.stderr)
            return 1

    if not source.is_file():
        print(f"error: {source} does not exist", file=sys.stderr)
        return 1

    try:
        data = json.loads(source.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"error: could not read/parse {source}: {exc}", file=sys.stderr)
        return 1

    entries = data.get("entries", []) if isinstance(data, dict) else []
    meta = {k: v for k, v in data.items() if k != "entries"} if isinstance(data, dict) else {}

    result = process_entries(entries)

    if args.json:
        print(json.dumps(to_json_result(result, source, meta), indent=2))
    else:
        print(render_report(result, source, meta))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
