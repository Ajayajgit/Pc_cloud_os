#!/usr/bin/env python3
"""render_gate.py - block a client deliverable render while the drafts still carry AI copy tells
or British spellings.

Wired as a PreToolUse hook on Bash from each client folder's .claude/settings.json
(template: client-settings-template.json next to this file). Reads the hook payload
on stdin and ignores every command that is not a deliverable render, so ordinary
shell calls pay nothing.

Scans the client-facing drafts only. The execution plan is an internal artifact and
is deliberately excluded, matching the humanize pass in the rapid-assessment skill.

Fails OPEN: a missing scanner, an unreadable draft, or any unexpected error lets the
render proceed with a warning. A broken gate must never stop a delivery.
"""

import glob
import json
import os
import re
import subprocess
import sys
from pathlib import Path

RENDER_RE = re.compile(r"render_(docx|pptx)\.py", re.IGNORECASE)
INTERNAL_RE = re.compile(r"execution", re.IGNORECASE)
# Drafts are found under the folder the session started in (CLAUDE_PROJECT_DIR), never the shell's
# working directory, which drifts (feedback 2026-09-01). Falls back to the cwd when the variable is
# absent, which is the pre-2026-09-21 behavior.
DRAFT_GLOB = os.path.join(os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd(), "working", "draft_*.md")
SCANNER = Path(__file__).resolve().parent.parent / "skills" / "humanizer" / "scripts" / "copy_scan.py"


def allow():
    sys.exit(0)


def warn(message):
    print(json.dumps({"systemMessage": f"Humanize gate skipped: {message}"}))
    sys.exit(0)


def deny(report):
    reason = (
        "Client-facing drafts still carry mechanical copy tells or British spellings, so the "
        "render is blocked. Run the humanizer skill's humanize pass over the drafts "
        "(WRITING_STANDARDS.md is the voice file; numbers, LOE, billing language, product names, "
        "and quotes are untouchable), clear each hit, then render again. Each hit below carries "
        "its own fix. To keep an intentional hit, such as a proper noun spelled the client's own "
        "way, mark that line `copy-ignore` and raise it at the draft-review checkpoint.\n\n" + report
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


def read_payload():
    # utf-8-sig: a PowerShell pipeline prepends a BOM, which plain json.load rejects.
    raw = sys.stdin.buffer.read().decode("utf-8-sig", errors="replace").strip()
    return json.loads(raw) if raw else None


def main():
    try:
        payload = read_payload()
    except Exception as exc:
        # Never fail open silently: an unreadable payload means the gate is not
        # protecting anything, and that has to be visible.
        warn(f"could not parse hook payload ({exc})")
    if payload is None:
        allow()

    command = (payload.get("tool_input") or {}).get("command") or ""
    if not RENDER_RE.search(command):
        allow()

    if not SCANNER.is_file():
        warn(f"scanner not found at {SCANNER}")

    drafts = [p for p in sorted(glob.glob(DRAFT_GLOB)) if not INTERNAL_RE.search(os.path.basename(p))]
    if not drafts:
        allow()

    try:
        # Force UTF-8 both ways: the Windows locale codepage mangles the em dash,
        # which is the one character this report most needs to show correctly.
        result = subprocess.run(
            [sys.executable, str(SCANNER), "--strict", *drafts],
            capture_output=True, encoding="utf-8", errors="replace", timeout=60,
            env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        )
    except Exception as exc:
        warn(f"scanner failed to run ({exc})")

    if result.returncode == 0:
        allow()
    if result.returncode != 1:
        warn(f"scanner exited {result.returncode}: {result.stderr.strip()[:300]}")

    deny(result.stdout.strip())


if __name__ == "__main__":
    main()
