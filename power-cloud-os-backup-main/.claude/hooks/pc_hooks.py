#!/usr/bin/env python3
"""pc_hooks.py - single entry point for every Power Cloud OS hook.

Why this exists. Client folders carry a `.claude/settings.json` (stamped from
`templates/client-record/`) because Claude Code loads settings only from the folder a session
starts in. Those settings used to call `python "../.claude/hooks/render_gate.py"`, a path relative
to the shell's working directory. That broke three times across three clients (feedback
2026-09-01): a nested custom project needs `../../`, a `cd` inside a Bash call drifts the cwd, and
a supported directory change mid-session re-resolves the path against the new folder. Each time,
every Bash call in the session died on the hook.

The fix is to stop depending on the cwd. The stamped settings run one Python launcher that walks
UP from `CLAUDE_PROJECT_DIR` (the folder the session started in, which never drifts) until it finds
the folder holding this file, then runs this dispatcher with the hook name. Works at any depth. If
no OS root is found above the session folder, the launcher exits 0 and the gate simply did not run,
which is the degraded mode the feedback entry asked for instead of a dead Bash tool.

Usage (from settings.json, exec form):

    "command": "python",
    "args": ["-c", "<launcher one-liner, see client-settings-template.json>", "scope_gate"]

Hook names and what they guard:

    render_gate       Bash        blocks a deliverable render while drafts carry copy tells
    scope_gate        Read/Write/Edit/Glob/Grep/NotebookEdit
                                  keeps a client session, and every worker agent inside it,
                                  out of other clients' folders
    escalation_gate   Agent       forces the permission prompt on any Fable escalation
    ns_write_gate     mcp ns_*    forces the prompt on NetSuite production data-writes
    memory_gate       Write/Edit/NotebookEdit
                                  asks before project knowledge goes into per-machine auto-memory

Session memory (not gates; both fail open and never block work):

    session_snapshot  Stop, PreCompact, SessionEnd
                                  appends the new conversation turns to the folder's sessions/raw/
    session_brief     SessionStart
                                  injects the latest checkpoints, checkpoint debt, capture errors

Each gate owns its own failure posture (see its docstring). This dispatcher itself never decides:
an unknown or missing hook name exits 0 with no output.
"""

import runpy
import sys
from pathlib import Path

HOOKS = {
    "render_gate": "render_gate.py",
    "scope_gate": "client_scope_gate.py",
    "escalation_gate": "escalation_gate.py",
    "ns_write_gate": "block-netsuite-writes.py",
    "memory_gate": "memory_gate.py",
    "session_snapshot": "session_snapshot.py",
    "session_brief": "session_brief.py",
}


def main() -> int:
    name = sys.argv[1] if len(sys.argv) > 1 else ""
    target = HOOKS.get(name)
    if not target:
        return 0
    path = Path(__file__).resolve().parent / target
    if not path.is_file():
        return 0
    # run_name="__main__" so each gate's `if __name__ == "__main__"` block fires; the gate's own
    # sys.exit propagates as SystemExit, which is the exit code the host sees.
    runpy.run_path(str(path), run_name="__main__")
    return 0


if __name__ == "__main__":
    sys.exit(main())
