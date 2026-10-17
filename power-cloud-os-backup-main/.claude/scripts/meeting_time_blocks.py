"""Per-session meeting time allocation.

Gemini meeting notes carry time-anchored headers roughly once a minute plus a
closing duration line. That is enough to say how long a session spent on each
topic, which is enough to allocate a billed hour across work items.

The split of deterministic from judgment work is deliberate:

  this script   parses transcripts, computes durations, totals and rolls up,
                and reports gaps or overlaps in an allocation that was written
                by hand.
  the session   decides which work item a time window belongs to. That is a
                materiality call and is never delegated, to a script or to a
                worker model.

So the flow is: `--blocks` prints the windows, the session assigns work items
into `working/time_allocation.md`, and `--check` proves the arithmetic.

Run from the Power Cloud OS root.

    python .claude/scripts/meeting_time_blocks.py --blocks "{Client}/source/<notes>.md"
    python .claude/scripts/meeting_time_blocks.py --pending "{Client}"
    python .claude/scripts/meeting_time_blocks.py --stub "{Client}/source/<notes>.md"
    python .claude/scripts/meeting_time_blocks.py --check "{Client}"
"""

import argparse
import os
import re
import sys

ALLOCATION_FILE = os.path.join("working", "time_allocation.md")

HEADER_RE = re.compile(r"^### \*\*(\d{1,2}:\d{2}:\d{2})\*\*.*$", re.M)
DURATION_RE = re.compile(r"Transcription ended after\s+(\d{1,2}:\d{2}:\d{2})")
TITLE_RE = re.compile(r"^## \*\*(.+?)\*\*\s*$", re.M)
# Gemini files land as "YYYY-MM-DD {Client} - {Title} [hash] - notes [hash].md"
NOTES_NAME_RE = re.compile(r"^(\d{4}-\d{2}-\d{2}) (.+?) \[[0-9a-f]+\] - notes \[[0-9a-f]+\]\.md$")
ROW_RE = re.compile(
    r"^\|\s*(\d{1,2}:\d{2}:\d{2})\s*\|\s*(\d{1,2}:\d{2}:\d{2})\s*\|([^|]*)\|([^|]*)\|(.*)\|\s*$"
)
SESSION_RE = re.compile(r"^## (\d{4}-\d{2}-\d{2})\s+(.*?)\s*$", re.M)


def to_seconds(stamp):
    parts = [int(p) for p in stamp.split(":")]
    while len(parts) < 3:
        parts.insert(0, 0)
    h, m, s = parts
    return h * 3600 + m * 60 + s


def to_stamp(seconds):
    seconds = int(round(seconds))
    return f"{seconds // 3600:02d}:{seconds % 3600 // 60:02d}:{seconds % 60:02d}"


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def condense(text, width):
    text = re.sub(r"\s+", " ", text).replace("**", "").strip()
    return text[:width]


def parse_transcript(path):
    """Return the title, total duration and the per-anchor blocks of one file."""
    text = read(path)

    duration = DURATION_RE.search(text)
    duration = to_seconds(duration.group(1)) if duration else None

    title = None
    base = os.path.basename(path)
    named = NOTES_NAME_RE.match(base)
    if named:
        title = named.group(2)
    else:
        found = TITLE_RE.search(text)
        if found:
            title = found.group(1).replace("\\", "").strip()

    marks = [(m.group(1), m.end()) for m in HEADER_RE.finditer(text)]
    blocks = []
    for i, (stamp, pos) in enumerate(marks):
        if i + 1 < len(marks):
            body = text[pos : marks[i + 1][1] - len(marks[i + 1][0]) - 12]
            end = to_seconds(marks[i + 1][0])
        else:
            body = text[pos:]
            end = duration if duration else to_seconds(stamp)
        blocks.append(
            {
                "start": to_seconds(stamp),
                "end": end,
                "stamp": stamp,
                "body": body,
            }
        )
    return {"path": path, "title": title, "duration": duration, "blocks": blocks}


def date_of(path):
    named = NOTES_NAME_RE.match(os.path.basename(path))
    return named.group(1) if named else ""


def find_transcripts(client_dir):
    """Gemini notes exports in a client's source/, newest name first.

    Skips the '- meeting.md' provenance stubs Paco writes alongside them, and
    anything without the notes naming shape.
    """
    source = os.path.join(client_dir, "source")
    if not os.path.isdir(source):
        return []
    found = [
        os.path.join(source, name)
        for name in sorted(os.listdir(source))
        if NOTES_NAME_RE.match(name)
    ]
    return found


def parse_allocation(client_dir):
    """Read working/time_allocation.md into {source basename: [segments]}."""
    path = os.path.join(client_dir, ALLOCATION_FILE)
    if not os.path.isfile(path):
        return {}, path
    text = read(path)
    sessions = {}
    current = None
    for line in text.splitlines():
        source = re.match(r"^source:\s*(.+?)\s*$", line)
        if source:
            current = os.path.basename(source.group(1))
            sessions.setdefault(current, [])
            continue
        row = ROW_RE.match(line)
        if row and current:
            sessions[current].append(
                {
                    "start": to_seconds(row.group(1)),
                    "end": to_seconds(row.group(2)),
                    "item": row.group(3).strip(),
                    "billed": row.group(4).strip(),
                    "topic": row.group(5).strip(),
                }
            )
    return sessions, path


def cmd_blocks(args):
    parsed = parse_transcript(args.blocks)
    if not parsed["blocks"]:
        print(f"no time anchors found in {args.blocks}", file=sys.stderr)
        print("Gemini only writes them on some exports; allocate by hand.", file=sys.stderr)
        return 1
    print(f"{parsed['title'] or os.path.basename(args.blocks)}")
    print(f"duration {to_stamp(parsed['duration']) if parsed['duration'] else 'unknown'}, "
          f"{len(parsed['blocks'])} anchors")
    print()
    for block in parsed["blocks"]:
        span = (block["end"] - block["start"]) / 60
        print(f"[{block['stamp']}] ({span:4.1f}m) {condense(block['body'], args.width)}")
    return 0


def cmd_stub(args):
    """Print a ready-to-paste allocation section with the work item column blank."""
    parsed = parse_transcript(args.stub)
    rel = args.stub.replace("\\", "/")
    print(f"## {date_of(args.stub)} {parsed['title'] or ''}".rstrip())
    print(f"source: {rel}")
    print(f"duration: {to_stamp(parsed['duration']) if parsed['duration'] else 'unknown'}")
    print()
    print("| start | end | work item | billed | topic |")
    print("|---|---|---|---|---|")
    for block in parsed["blocks"]:
        print(f"| {to_stamp(block['start'])} | {to_stamp(block['end'])} |  |  | "
              f"{condense(block['body'], 60)} |")
    print()
    print("Merge adjacent rows that share a topic before assigning work items.")
    return 0


def cmd_pending(args):
    allocated, path = parse_allocation(args.pending)
    found = find_transcripts(args.pending)
    if not found:
        print(f"no Gemini notes exports in {args.pending}/source/")
        return 0
    pending = [p for p in found if os.path.basename(p) not in allocated]
    print(f"{len(found)} transcript(s), {len(pending)} not yet in {ALLOCATION_FILE}")
    for item in pending:
        parsed = parse_transcript(item)
        anchors = len(parsed["blocks"])
        duration = to_stamp(parsed["duration"]) if parsed["duration"] else "unknown"
        flag = "" if anchors else "   [no time anchors: allocate by hand]"
        print(f"  {date_of(item)}  {duration}  {parsed['title'] or ''}{flag}")
        print(f"      {item}")
    return 0


def cmd_check(args):
    """Prove the hand-written allocation against the transcripts it claims to cover."""
    allocated, path = parse_allocation(args.check)
    if not allocated:
        print(f"no allocation file at {path}")
        return 1

    by_item = {}
    billed_by_item = {}
    problems = []
    total = 0

    for name, segments in sorted(allocated.items()):
        source = os.path.join(args.check, "source", name)
        duration = None
        if os.path.isfile(source):
            duration = parse_transcript(source)["duration"]
        else:
            problems.append(f"{name}: source file not found, arithmetic unchecked")

        segments = sorted(segments, key=lambda s: s["start"])
        covered = 0
        for i, seg in enumerate(segments):
            span = seg["end"] - seg["start"]
            if span <= 0:
                problems.append(f"{name}: {to_stamp(seg['start'])} ends at or before it starts")
                continue
            covered += span
            total += span
            item = seg["item"] or "(unassigned)"
            by_item[item] = by_item.get(item, 0) + span
            if seg["billed"]:
                try:
                    billed_by_item[item] = billed_by_item.get(item, 0) + float(seg["billed"])
                except ValueError:
                    problems.append(f"{name}: billed value {seg['billed']!r} is not a number")
            if i + 1 < len(segments):
                gap = segments[i + 1]["start"] - seg["end"]
                if gap > 0:
                    problems.append(
                        f"{name}: {gap / 60:.1f}m unaccounted between "
                        f"{to_stamp(seg['end'])} and {to_stamp(segments[i + 1]['start'])}"
                    )
                elif gap < 0:
                    problems.append(
                        f"{name}: segments overlap at {to_stamp(segments[i + 1]['start'])}"
                    )

        if duration:
            # the lead-in before the first anchor is not a gap worth reporting
            missing = duration - covered - segments[0]["start"] if segments else duration
            if abs(missing) > 90:
                problems.append(
                    f"{name}: segments cover {covered / 60:.1f}m of a "
                    f"{duration / 60:.1f}m session ({missing / 60:+.1f}m)"
                )

    print(f"{len(allocated)} session(s), {total / 60:.1f} min allocated\n")
    width = max((len(k) for k in by_item), default=10)
    print(f"{'work item':<{width}}  {'min':>7}  {'share':>6}  {'billed':>7}")
    for item, seconds in sorted(by_item.items(), key=lambda kv: -kv[1]):
        billed = billed_by_item.get(item)
        billed = f"{billed:.2f}" if billed is not None else ""
        print(f"{item:<{width}}  {seconds / 60:>7.1f}  {seconds / total * 100:>5.1f}%  {billed:>7}")
    if billed_by_item:
        print(f"\n{'total billed':<{width}}  {'':>7}  {'':>6}  {sum(billed_by_item.values()):>7.2f}")

    if problems:
        print("\nproblems:")
        for problem in problems:
            print(f"  {problem}")
        return 1
    print("\nno gaps, overlaps or arithmetic problems")
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--blocks", metavar="TRANSCRIPT",
                       help="print the time-anchored windows of one transcript")
    group.add_argument("--stub", metavar="TRANSCRIPT",
                       help="print a blank allocation section to paste and fill in")
    group.add_argument("--pending", metavar="CLIENT_DIR",
                       help="list transcripts with no allocation yet")
    group.add_argument("--check", metavar="CLIENT_DIR",
                       help="roll up the allocation and prove it against the transcripts")
    parser.add_argument("--width", type=int, default=230,
                        help="characters of block text to show (default 230)")
    args = parser.parse_args()

    if args.blocks:
        return cmd_blocks(args)
    if args.stub:
        return cmd_stub(args)
    if args.pending:
        return cmd_pending(args)
    return cmd_check(args)


if __name__ == "__main__":
    sys.exit(main())
