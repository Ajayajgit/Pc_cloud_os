#!/usr/bin/env python3
"""memory_gate.py - ask before project knowledge goes into one laptop's private memory.

Decision D2 of shared session memory (tasks/todo.md, 2026-09-24). Claude Code's auto-memory lives
at ~/.claude/projects/<slug>/memory/, which is one user on one machine, and its location cannot be
changed (checked 2026-09-24). Before this gate it held eleven OS-level project facts that no other
consultant, and none of Mike's other machines, could see. Project knowledge belongs in the shared
folder (a session-memory checkpoint, CONTEXT.md, or the spec that owns it); auto-memory is for
facts about the person.

Wired as a PreToolUse hook on Write, Edit and NotebookEdit through pc_hooks.py, from root settings
and every client stamp. Any write whose target resolves under a `.claude/projects/*/memory/`
folder gets a forced ASK carrying the question. Every other write gets no decision.

Coverage, stated honestly: this sees auto-memory writes made through the Write/Edit tools, which is
how Claude Code writes memory today. It cannot see a write made through Bash or PowerShell. Live
test T7 records whether the harness routes its own memory writes through a hookable tool.

Failure posture: OPEN (no decision) on an unreadable payload. The gate is a question, not a
boundary; failing closed would block a person's own preference notes over a hook bug.
"""

import json
import os
import re
import sys

MEMORY_PATH = re.compile(r"[\\/]\.claude[\\/]projects[\\/][^\\/]+[\\/]memory([\\/]|$)", re.I)
PATH_KEYS = ("file_path", "notebook_path")


def main() -> int:
    try:
        raw = sys.stdin.buffer.read().decode("utf-8-sig", errors="replace").strip()
        payload = json.loads(raw) if raw else {}
        tool_input = payload.get("tool_input") or {}
        target = next((tool_input.get(k) for k in PATH_KEYS if tool_input.get(k)), None)
        if not target:
            return 0
        target_n = os.path.normcase(os.path.abspath(os.path.expanduser(str(target))))
        if not MEMORY_PATH.search(target_n):
            return 0
    except Exception:
        return 0

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": (
                "Memory gate: this writes to auto-memory, which only this user on this machine will "
                "ever see. Allow it only for a fact about the person (a preference, how they like to "
                "work). Project knowledge (a decision, its reason, a client fact, an OS design choice) "
                "belongs in the shared folder: a session-memory checkpoint, CONTEXT.md, or the spec "
                "that owns it. Deny and ask Claude to checkpoint it instead."
            ),
        }
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
