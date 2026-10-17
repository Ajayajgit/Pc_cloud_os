"""Regenerate FEEDBACK.md from the feedback/ inbox.

One entry per file in feedback/, written by the `feedback` skill. This reads their
frontmatter and rebuilds the index. It is a generated file: edit the entries, not
the index.

Ranking is blocking first, then cost times frequency. That ordering is the whole
point of asking for cost and frequency at capture, so it lives here rather than in
anyone's judgement at triage time.

Run from the Power Cloud OS root:

    python .claude/scripts/build_feedback_index.py

Add --check to exit non-zero if the index is out of date without rewriting it.
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

OPEN_STATUSES = ("new", "triaged", "doing")
CLOSED_STATUSES = ("shipped", "declined")

# Multipliers on cost, so a papercut that fires every time can outrank a
# one-off that cost an afternoon.
FREQUENCY_WEIGHT = {"every-time": 4.0, "sometimes": 2.0, "first-time": 1.0}

TYPE_ORDER = ("bug", "friction", "request", "idea")


def parse_frontmatter(text: str) -> dict[str, str]:
    """Pull the leading --- block into a dict. Returns {} if there isn't one."""
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not match:
        return {}
    fields = {}
    for line in match.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, sep, value = line.partition(":")
        if not sep:
            continue
        fields[key.strip().lower()] = value.strip().strip("'\"")
    return fields


def parse_cost(raw: str) -> float:
    """Minutes from '45m', '2h', '1.5h', '90'. Unparseable or '-' is 0."""
    value = (raw or "").strip().lower()
    if not value or value in {"-", "n/a", "na", "none", "unknown"}:
        return 0.0
    match = re.match(r"^([\d.]+)\s*([hmd]?)", value)
    if not match:
        return 0.0
    try:
        number = float(match.group(1))
    except ValueError:
        return 0.0
    unit = match.group(2)
    if unit == "h":
        return number * 60
    if unit == "d":
        return number * 60 * 8
    return number


def humanize_cost(minutes: float) -> str:
    if minutes <= 0:
        return "-"
    if minutes < 60:
        return f"{int(round(minutes))}m"
    hours = minutes / 60
    if abs(hours - round(hours)) < 0.05:
        return f"{int(round(hours))}h"
    return f"{hours:.1f}h"


def first_section(text: str, heading: str, limit: int = 150) -> str:
    """First sentence-ish of a '## Heading' section, flattened for a table cell."""
    pattern = rf"^##\s+{re.escape(heading)}\s*\n(.*?)(?=\n##\s|\Z)"
    match = re.search(pattern, text, re.DOTALL | re.MULTILINE | re.IGNORECASE)
    if not match:
        return ""
    body = match.group(1).strip()
    # Drop the evidence-tier marker; the index is a pointer, not the evidence.
    body = re.sub(r"\[(Verified|Reported|Inferred)\]\s*", "", body)
    body = re.sub(r"[*`_|]+", " ", body)
    body = re.sub(r"\s+", " ", body).strip()
    if not body:
        return ""
    if len(body) <= limit:
        return body
    return body[:limit].rsplit(" ", 1)[0].rstrip(" ,;:-") + "..."


def score(entry: dict) -> float:
    weight = FREQUENCY_WEIGHT.get(entry["frequency"], 1.0)
    # A blocking item leads regardless of how little time it happened to cost.
    blocking_bonus = 100000.0 if entry["blocking"] == "yes" else 0.0
    # Floor of 5 minutes so a reported item with no cost still sorts by frequency.
    return blocking_bonus + max(entry["cost_minutes"], 5.0) * weight


def collect(inbox: Path) -> tuple[list[dict], list[str]]:
    entries: list[dict] = []
    problems: list[str] = []
    for path in sorted(inbox.glob("*.md")):
        if path.name.lower() == "readme.md":
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            problems.append(f"{path.name}: unreadable ({exc})")
            continue
        fields = parse_frontmatter(text)
        if not fields:
            problems.append(f"{path.name}: no frontmatter block")
            continue
        status = fields.get("status", "new").lower()
        if status not in OPEN_STATUSES + CLOSED_STATUSES:
            problems.append(f"{path.name}: unknown status '{status}'")
            status = "new"
        entries.append({
            "file": path.name,
            "date": fields.get("date", "-"),
            "who": fields.get("from", "-"),
            "source": fields.get("source", "-"),
            "area": fields.get("area", "-"),
            "type": fields.get("type", "-").lower(),
            "cost_minutes": parse_cost(fields.get("cost", "")),
            "blocking": fields.get("blocking", "no").lower(),
            "frequency": fields.get("frequency", "first-time").lower(),
            "klass": fields.get("class", "-").lower(),
            "autonomy": fields.get("autonomy", "-").lower(),
            "status": status,
            "summary": first_section(text, "What happened"),
            "disposition": first_section(text, "Disposition", 110),
        })
    return entries, problems


def render(entries: list[dict], problems: list[str], stamp: str) -> str:
    open_items = [e for e in entries if e["status"] in OPEN_STATUSES]
    closed = [e for e in entries if e["status"] in CLOSED_STATUSES]
    open_items.sort(key=lambda e: (-score(e), e["date"]))
    closed.sort(key=lambda e: e["date"], reverse=True)

    out = [
        "# Feedback on the OS",
        "",
        f"GENERATED {stamp} by `.claude/scripts/build_feedback_index.py`. Do not hand-edit;",
        "rerun the script instead. Entries live in `feedback/`, one file each; this is only the",
        "index over them. Log an item by saying \"log this as feedback\" in any session, or `/feedback`.",
        "",
    ]

    if not entries:
        out += [
            "Nothing logged yet.",
            "",
            "An empty inbox after the rollout is a finding about capture, not about quality.",
            "",
        ]
        return "\n".join(out)

    blocking = sum(1 for e in open_items if e["blocking"] == "yes")
    recurring = sum(1 for e in open_items if e["frequency"] == "every-time")
    lost = humanize_cost(sum(e["cost_minutes"] for e in open_items))
    out += [
        f"**{len(open_items)} open**, {len(closed)} closed. "
        f"{blocking} blocking, {recurring} happening every time. "
        f"Reported time lost across open items: {lost}.",
        "",
    ]

    reporters = sorted({e["who"] for e in entries if e["who"] != "-"})
    if reporters:
        counts = {r: sum(1 for e in entries if e["who"] == r) for r in reporters}
        spread = ", ".join(f"{r} {counts[r]}" for r in sorted(counts, key=lambda r: -counts[r]))
        out += [
            f"Reporters: {spread}. A folder dominated by one name says more about who is not",
            "reporting than about what is broken.",
            "",
        ]

    if open_items:
        out += [
            "## Open, ranked",
            "",
            "Blocking items first, then cost times frequency. Rank is the script's, not a judgement.",
            "",
            "| # | Item | Type | Area | Cost | Freq | Blk | From | Status |",
            "|---|---|---|---|---|---|:--:|---|---|",
        ]
        for i, e in enumerate(open_items, 1):
            summary = e["summary"] or "(no What happened section)"
            out.append(
                f"| {i} | [{summary}](feedback/{e['file']}) | {e['type']} | {e['area']} | "
                f"{humanize_cost(e['cost_minutes'])} | {e['frequency']} | "
                f"{'Y' if e['blocking'] == 'yes' else '.'} | {e['who']} | {e['status']} |"
            )
        out.append("")

        by_area: dict[str, int] = {}
        for e in open_items:
            by_area[e["area"]] = by_area.get(e["area"], 0) + 1
        repeated = {a: n for a, n in by_area.items() if n > 1 and a != "-"}
        if repeated:
            listing = ", ".join(
                f"`{a}` ({n})" for a, n in sorted(repeated.items(), key=lambda kv: -kv[1])
            )
            out += [
                f"**Areas with more than one open item:** {listing}. Worth reading together at",
                "triage; entries that look unrelated often share one cause.",
                "",
            ]

        diagnostics = [e for e in open_items if e["klass"] in {"wrong", "in-the-way"}]
        if diagnostics:
            wrong = sum(1 for e in diagnostics if e["klass"] == "wrong")
            in_way = len(diagnostics) - wrong
            ask = sum(1 for e in diagnostics if e["autonomy"] == "expected-ask")
            do = sum(1 for e in diagnostics if e["autonomy"] == "expected-do")
            was = "was" if in_way == 1 else "were"
            out += [
                f"**Diagnostics** (asked only on expensive items, {len(diagnostics)} of "
                f"{len(open_items)} open): {wrong} did the wrong thing, {in_way} {was} right but "
                f"in the way. Autonomy: {ask} expected it to ask first, {do} expected it to just act.",
                "",
            ]

    if closed:
        out += [
            "## Closed",
            "",
            "| Item | Status | Disposition | From |",
            "|---|---|---|---|",
        ]
        for e in closed:
            summary = e["summary"] or e["file"]
            out.append(
                f"| [{summary}](feedback/{e['file']}) | {e['status']} | "
                f"{e['disposition'] or '(none recorded)'} | {e['who']} |"
            )
        out.append("")

    if problems:
        out += ["## Malformed entries", ""]
        out += [f"- {p}" for p in problems]
        out.append("")

    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root", type=Path, default=Path(__file__).resolve().parents[2],
        help="Power Cloud OS root (defaults to two levels above this script).",
    )
    parser.add_argument(
        "--check", action="store_true",
        help="Exit 1 if the index is out of date; do not write.",
    )
    args = parser.parse_args()

    root: Path = args.root
    if not (root / "CLAUDE.md").is_file():
        print(f"error: {root} does not look like the Power Cloud OS root", file=sys.stderr)
        return 2

    inbox = root / "feedback"
    if not inbox.is_dir():
        print(f"error: no feedback/ folder at {root}", file=sys.stderr)
        return 2

    entries, problems = collect(inbox)
    stamp = dt.date.today().isoformat()
    content = render(entries, problems, stamp)
    target = root / "FEEDBACK.md"

    if args.check:
        current = target.read_text(encoding="utf-8") if target.is_file() else ""
        # The generated stamp changes daily; compare everything else.
        strip = lambda s: re.sub(r"^GENERATED \d{4}-\d{2}-\d{2}", "GENERATED", s, flags=re.M)
        if strip(current) != strip(content):
            print("FEEDBACK.md is out of date", file=sys.stderr)
            return 1
        print("FEEDBACK.md is current")
        return 0

    target.write_text(content, encoding="utf-8", newline="\n")
    open_count = sum(1 for e in entries if e["status"] in OPEN_STATUSES)
    print(f"wrote {target.name}: {open_count} open, {len(entries)} total")
    if problems:
        print(f"warning: {len(problems)} malformed entr{'y' if len(problems) == 1 else 'ies'}",
              file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
