"""Regenerate ENGAGEMENT_LOG.md from what is on disk.

The assessment workflow already writes its own state, one file per completed stage
(evidence.md, verification.md, candidates.md, loe_log.md, retro.md). This reads that
surface and rebuilds the catalog. It is a generated file: edit the workspace, not the log.

Reads only each client's CONTEXT.md plus directory listings. Never opens client material
in source/, working/, or deliverables/.

Run from the Power Cloud OS root:

    python .claude/scripts/build_engagement_log.py

Add --check to exit non-zero if the log is out of date without rewriting it.
"""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path

# Folders at the root that are not client records.
NOT_CLIENTS = {
    ".claude", "fonts", "logos", "templates", "Internal", "Archive",
    ".playwright-mcp", "execution", "feedback", "tasks",
}

# The standard client-record subfolders, skipped when looking one level down for
# nested custom projects.
RECORD_SUBFOLDERS = {"source", "working", "deliverables", "execution"}

# working/ filename -> stage marker, in pipeline order.
STAGE_FILES = [
    ("onsite_prep", "prep"),
    ("evidence", "evid"),
    ("verification", "verif"),
    ("candidates", "cand"),
    ("draft", "draft"),
    ("loe_log", "loe"),
    ("retro", "retro"),
]

FINAL_SUFFIXES = {".docx", ".pptx", ".pdf"}


def is_placeholder(value: str) -> bool:
    """Template text still in braces, or empty, counts as unset."""
    return not value or value.startswith("{") or value == "-"


def read_context_field(context: Path, label: str) -> str:
    """Pull '- Label: value' out of a CONTEXT.md. Returns '' if absent."""
    try:
        text = context.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""
    match = re.search(rf"^-\s*{re.escape(label)}\s*:\s*(.+)$", text, re.MULTILINE)
    if not match:
        return ""
    return match.group(1).strip()


def clean_cell(raw: str, width: int) -> str:
    """Make free prose safe and short enough for a table cell.

    These fields are written by hand and contain bold markers, pipes, and whole
    paragraphs. Truncating naively splits a `**` pair and breaks the table.
    """
    if is_placeholder(raw):
        return "not set"
    # Drop emphasis and code markers rather than risk an unbalanced pair.
    value = re.sub(r"[*`_]+", "", raw)
    # Keep the first clause; the rest is usually guidance text from the template.
    value = re.split(r"[.(]", value, maxsplit=1)[0]
    value = re.sub(r"\s+", " ", value).replace("|", "/").strip(" ,;:-")
    if not value:
        return "not set"
    if len(value) <= width:
        return value
    clipped = value[:width].rsplit(" ", 1)[0].rstrip(" ,;:-")
    return (clipped or value[:width]) + "..."


def short_status(raw: str) -> str:
    return clean_cell(raw, 34)


def short_type(raw: str) -> str:
    """The engagement-type line carries a paragraph of guidance; keep the label."""
    if is_placeholder(raw):
        return "not set"
    lowered = raw.lower()
    # Most specific first. The three current types are recovery / implementation /
    # custom; "commercial" alone is a pre-three-type record whose type line actually
    # recorded the commercial posture, so it falls through to a legacy label.
    for needle, label in (
        ("custom project", "custom"),
        ("recovery", "recovery"),
        ("rapid assessment", "recovery"),
        ("rescue", "recovery"),
        ("implementation project", "implementation"),
        ("implementation roadmap", "implementation"),
        ("new implementation", "implementation"),
        ("implementation", "implementation"),
        ("commercial", "commercial (legacy)"),
    ):
        if needle in lowered:
            return label
    return clean_cell(raw, 18)


def source_dir(client: Path) -> Path | None:
    """Older records use Source/ rather than source/.

    Listed rather than probed: Windows path lookups are case-insensitive, so
    (client / "source").is_dir() matches Source/ too and hides the drift.
    """
    try:
        for child in client.iterdir():
            if child.is_dir() and child.name.lower() == "source":
                return child
    except OSError:
        pass
    return None


# SDF project scaffolding: presence proves a scaffold, not authored work.
EXEC_SCAFFOLD = {'manifest.xml', 'deploy.xml', 'project.json', 'suitecloud.config.js'}


def execution_state(client: Path) -> dict:
    """What the execution phase has left on disk under execution/.

    Markers follow the execution skill's state surface: CLAUDE.md (phase entered),
    setup_checklist.md, config_backlog.md, design/, build_log.md, learnings.md.
    'artifacts' counts authored work (SDF Objects/FileCabinet/AccountConfiguration
    files, csv-import files), which is distinct from bare project scaffolding.
    """
    ex = client / "execution"
    state = {"active": False, "entered": False, "setup": False, "backlog": False,
             "design": False, "logged": False, "learn": False, "artifacts": 0}
    if not ex.is_dir():
        return state
    try:
        files = [p for p in ex.rglob("*") if p.is_file() and p.name != ".gitkeep"]
    except OSError:
        return state
    for p in files:
        state["active"] = True
        name = p.name.lower()
        rel = "/" + p.relative_to(ex).as_posix().lower()
        if name == "claude.md":
            state["entered"] = True
        elif name == "setup_checklist.md":
            state["setup"] = True
        elif name == "config_backlog.md":
            state["backlog"] = True
        elif name == "build_log.md":
            state["logged"] = True
        elif name == "learnings.md":
            state["learn"] = True
        elif name not in EXEC_SCAFFOLD and (
                "/objects/" in rel or "/filecabinet/" in rel
                or "/accountconfiguration/" in rel or "/csv-import/" in rel):
            state["artifacts"] += 1
    return state


def stage_markers(client: Path) -> tuple[dict[str, bool], int]:
    """Which pipeline stages left a file in working/, and how many files are there."""
    working = client / "working"
    found = {marker: False for _, marker in STAGE_FILES}
    if not working.is_dir():
        return found, 0
    try:
        # .gitkeep ships with the stamp and is not work.
        names = [
            p.name.lower() for p in working.iterdir()
            if p.is_file() and p.name != ".gitkeep"
        ]
    except OSError:
        return found, 0
    for needle, marker in STAGE_FILES:
        found[marker] = any(needle in name for name in names)
    return found, len(names)


def derived_stage(client: Path, markers: dict[str, bool], finals: int, working_files: int,
                  exec_state: dict) -> str:
    """Latest stage the filesystem can evidence. Ordered most advanced first."""
    # Execution is the latest phase; activity there wins over assessment stages.
    if exec_state["active"]:
        if exec_state["artifacts"]:
            plural = "" if exec_state["artifacts"] == 1 else "s"
            return f"execution: building ({exec_state['artifacts']} artifact{plural})"
        if exec_state["setup"] or exec_state["backlog"] or exec_state["design"]:
            return "execution: setup/design"
        return "execution: started"
    if markers["retro"]:
        return "closed out"
    if finals:
        return "delivered"
    if markers["loe"]:
        return "LOE review"
    if markers["draft"]:
        return "drafting"
    if markers["cand"] or markers["evid"] or markers["verif"]:
        return "mining/verify"
    if markers["prep"]:
        return "pre-onsite prep"
    # Some engagements keep real work in working/ under their own filenames.
    # Absence of the assessment markers is not absence of work.
    if working_files:
        plural = "" if working_files == 1 else "s"
        return f"in progress ({working_files} working file{plural})"
    if (client / "CONTEXT.md").is_file():
        return "stamped, no work yet"
    return "no record"


def count_finals(client: Path) -> int:
    deliverables = client / "deliverables"
    if not deliverables.is_dir():
        return 0
    try:
        return sum(
            1 for p in deliverables.iterdir()
            if p.is_file() and p.suffix.lower() in FINAL_SUFFIXES
        )
    except OSError:
        return 0


def last_activity(client: Path) -> str:
    """Most recent mtime anywhere under the client folder."""
    newest = 0.0
    for path in client.rglob("*"):
        try:
            if path.is_file():
                newest = max(newest, path.stat().st_mtime)
        except OSError:
            continue
    if not newest:
        return "-"
    return dt.datetime.fromtimestamp(newest).strftime("%Y-%m-%d")


def shape_notes(client: Path) -> list[str]:
    """Where this record deviates from the stamp."""
    notes = []
    if not (client / "CONTEXT.md").is_file():
        notes.append("no CONTEXT.md")
    src = source_dir(client)
    if src is None:
        notes.append("no source/")
    elif src.name == "Source":
        notes.append("Source/ not source/")
    for name in ("working", "deliverables"):
        if not (client / name).is_dir():
            notes.append(f"no {name}/")
    if not (client / ".claude" / "settings.json").is_file():
        notes.append("no render gate")
    return notes


def build_record(folder: Path, display: str, is_nested: bool = False) -> dict:
    markers, working_files = stage_markers(folder)
    finals = count_finals(folder)
    exec_state = execution_state(folder)
    context = folder / "CONTEXT.md"
    notes = shape_notes(folder)
    # Hours routing, judged on evidence rather than on the line alone. A nested custom
    # project inherits the parent client's job and is exempt. An explicit `none` is a
    # deliberate opt-out and is not a placeholder, so it never flags.
    #
    # An extract already sitting in working/ proves the routing works, whether it got
    # there from a declared line or from the folder-name fallback, so those folders are
    # not flagged at all. Without one, the severity depends on whether the fallback can
    # ever succeed: it matches the folder name against the NetSuite job name by
    # containment, and only for keys of five characters or more. An initialism folder
    # (`GW`) is below that threshold, so it can never match and will drop its hours
    # silently until a job name is declared. Anything longer may simply have no hours
    # logged yet, which is normal for a pre-sale or a brand-new record.
    if context.is_file() and not is_nested:
        unset = is_placeholder(read_context_field(context, "NetSuite customer"))
        landed = any(folder.glob("working/time_entries_*.json"))
        if unset and not landed:
            key = re.sub(r"[^a-z0-9]", "", folder.name.lower())
            if len(key) < 5:
                notes.append("hours CANNOT route: folder name too short to match a job "
                             "name, declare NetSuite customer")
            else:
                notes.append("no hours yet (NetSuite customer unset)")
    # Execution drift: authored work without the skill's state surface around it.
    if exec_state["active"] and not exec_state["entered"]:
        notes.append("execution work but no execution/CLAUDE.md")
    if exec_state["artifacts"] and not exec_state["logged"]:
        notes.append("authored SDF but no build_log.md")
    return {
        "name": display,
        "declared": short_status(read_context_field(context, "Engagement status")),
        "type": short_type(read_context_field(context, "Engagement type")),
        "derived": derived_stage(folder, markers, finals, working_files, exec_state),
        "finals": finals,
        "activity": last_activity(folder),
        "markers": markers,
        "exec": exec_state,
        "notes": notes,
        "has_context": context.is_file(),
    }


def nested_projects(client: Path) -> list[Path]:
    """Custom projects live at {Client}/{ProjectName}/ with their own CONTEXT.md.

    The standard record subfolders are skipped so an ordinary engagement's own
    source/working/deliverables/execution are never mistaken for projects.
    """
    found = []
    for sub in sorted(client.iterdir(), key=lambda p: p.name.lower()):
        if not sub.is_dir() or sub.name.startswith("."):
            continue
        if sub.name.lower() in RECORD_SUBFOLDERS:
            continue
        if (sub / "CONTEXT.md").is_file():
            found.append(sub)
    return found


def collect(root: Path) -> list[dict]:
    records = []
    for child in sorted(root.iterdir(), key=lambda p: p.name.lower()):
        if not child.is_dir() or child.name in NOT_CLIENTS or child.name.startswith("."):
            continue
        has_context = (child / "CONTEXT.md").is_file()
        if has_context:
            records.append(build_record(child, child.name))
        projects = nested_projects(child)
        for project in projects:
            records.append(build_record(project, f"{child.name} / {project.name}", is_nested=True))
        # A folder that is neither an engagement nor a container for one still gets
        # listed, so build work sitting outside the standard shape stays visible.
        if not has_context and not projects:
            records.append(build_record(child, child.name))
    return records


def render(records: list[dict], stamp: str) -> str:
    engagements = [r for r in records if r["has_context"]]
    others = [r for r in records if not r["has_context"]]

    out = [
        "# Engagement log",
        "",
        f"GENERATED {stamp} by `.claude/scripts/build_engagement_log.py`. Do not hand-edit;",
        "rerun the script instead. Status is derived from what the workflow left on disk, so it",
        "reflects work actually done rather than a field someone remembered to update.",
        "",
        "## Engagements",
        "",
        "| Client | Type | Declared | Derived from disk | Finals | Last activity |",
        "|---|---|---|---|---|---|",
    ]
    for r in engagements:
        out.append(
            f"| {r['name']} | {r['type']} | {r['declared']} | {r['derived']} | "
            f"{r['finals'] or '-'} | {r['activity']} |"
        )

    out += [
        "",
        "Declared comes from the `Engagement status:` line in that client's CONTEXT.md.",
        "Derived comes from the files the pipeline writes. Where the two disagree, the CONTEXT.md",
        "line is usually just stale.",
        "",
        "## State surface",
        "",
        "Which pipeline stages have left a file in `working/` (assessment) or `execution/` (exec).",
        "",
        "| Client | prep | evidence | verify | candidates | draft | LOE | retro | exec |",
        "|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|",
    ]
    for r in engagements:
        cells = " | ".join(
            "x" if r["markers"][m] else "." for _, m in STAGE_FILES
        )
        exec_cell = "x" if r["exec"]["active"] else "."
        out.append(f"| {r['name']} | {cells} | {exec_cell} |")

    in_execution = [r for r in engagements if r["exec"]["active"]]
    if in_execution:
        out += [
            "",
            "## Execution phase",
            "",
            "Detail for engagements with execution/ activity. Markers follow the execution",
            "skill's state surface; artifacts counts authored SDF objects, scripts, account",
            "configuration, and csv-import files (project scaffolding excluded).",
            "",
            "| Client | entered | setup | backlog | design | build log | artifacts |",
            "|---|:--:|:--:|:--:|:--:|:--:|:--:|",
        ]
        for r in in_execution:
            e = r["exec"]
            out.append(
                f"| {r['name']} | {'x' if e['entered'] else '.'} | {'x' if e['setup'] else '.'} | "
                f"{'x' if e['backlog'] else '.'} | {'x' if e['design'] else '.'} | "
                f"{'x' if e['logged'] else '.'} | {e['artifacts'] or '-'} |"
            )

    flagged = [r for r in engagements if r["notes"]]
    if flagged:
        out += [
            "",
            "## Shape drift",
            "",
            "Records that differ from `templates/client-record/`. Older folders predate the stamp.",
            "",
            "On hours: a folder holding a `time_entries_*.json` is routing correctly and is not",
            "listed here. `no hours yet` usually just means a pre-sale or a new record with nothing",
            "logged against it. `hours CANNOT route` is the one that needs action.",
            "",
        ]
        for r in flagged:
            out.append(f"- **{r['name']}**: {', '.join(r['notes'])}")

    if others:
        out += [
            "",
            "## Not engagement records",
            "",
            "Folders with no CONTEXT.md. Build and development work lives with its client by design,",
            "so these are listed rather than flagged as a problem.",
            "",
            "| Folder | Last activity |",
            "|---|---|",
        ]
        for r in others:
            out.append(f"| {r['name']} | {r['activity']} |")

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
        help="Exit 1 if the log is out of date; do not write.",
    )
    args = parser.parse_args()

    root: Path = args.root
    if not (root / "CLAUDE.md").is_file():
        print(f"error: {root} does not look like the Power Cloud OS root", file=sys.stderr)
        return 2

    records = collect(root)
    target = root / "ENGAGEMENT_LOG.md"

    # The timestamp would make every run differ, so compare everything below the header.
    stamp = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    content = render(records, stamp)

    if args.check:
        if not target.is_file():
            print("ENGAGEMENT_LOG.md is missing")
            return 1
        old_body = target.read_text(encoding="utf-8").split("\n", 4)[-1]
        if old_body != content.split("\n", 4)[-1]:
            print("ENGAGEMENT_LOG.md is out of date")
            return 1
        print("ENGAGEMENT_LOG.md is current")
        return 0

    target.write_text(content, encoding="utf-8")
    engagements = sum(1 for r in records if r["has_context"])
    print(f"Wrote {target.name}: {engagements} engagements, {len(records) - engagements} other folders.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
