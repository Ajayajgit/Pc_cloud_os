#!/usr/bin/env python3
"""session_common.py - shared helpers for the session-memory hooks.

Not a hook itself. `session_snapshot.py` (capture) and `session_brief.py` (the SessionStart brief)
both need the same three answers: which folder a session's memory belongs to, who and where this
is, and where this machine keeps its private capture state. Keeping those in one place means the
two hooks can never disagree about where a session's files live.

Scope rule (tasks/todo.md, "Shared session memory", decision D1):

    session started in a client folder or a nested project   -> {that folder}/working/sessions/
    session started at the OS root or in a non-client folder
    (.claude, templates, Internal, tasks, feedback, ...)     -> Internal/sessions/
    session started outside the OS root                      -> None (not ours; capture nothing)

`working/` rather than a new top-level folder, because working/ is already the record's scratch
and state surface and every stamped folder has it. The render gate scans only working/draft_*.md,
so session files never block a render.

Overrides for tests only: PC_OS_ROOT (fake OS root), PC_SESSION_STATE (fake local state folder).
"""

import json
import os
import re
from pathlib import Path

NON_CLIENT_TOP = {".claude", "templates", "logos", "fonts", "feedback", "tasks", "internal", "archive"}


def os_root() -> Path:
    override = os.environ.get("PC_OS_ROOT")
    if override:
        return Path(override)
    return Path(__file__).resolve().parents[2]


def _norm(path) -> str:
    return os.path.normcase(os.path.realpath(str(path)))


def project_dir(payload: dict) -> Path:
    return Path(os.environ.get("CLAUDE_PROJECT_DIR") or payload.get("cwd") or os.getcwd())


def scope_dir(project: Path):
    """Return (sessions_dir, scope_label) for a session that started in `project`, or (None, None)."""
    root = os_root()
    root_n, proj_n = _norm(root), _norm(project)
    if proj_n == root_n:
        return root / "Internal" / "sessions", "os"
    if not proj_n.startswith(root_n + os.sep):
        return None, None
    rel_parts = proj_n[len(root_n):].lstrip("\\/").replace("/", "\\").split("\\")
    if rel_parts[0] in NON_CLIENT_TOP:
        return root / "Internal" / "sessions", "os"
    # A client folder or a project nested under one: memory lives with the folder the session
    # started in, because a nested custom project is its own record (CLAUDE.md, Engagement types).
    real_project = Path(os.path.realpath(str(project)))
    return real_project / "working" / "sessions", real_project.name


def user_slug() -> str:
    name = os.environ.get("USERNAME") or os.environ.get("USER") or "unknown"
    return re.sub(r"[^a-z0-9]+", "", name.lower()) or "unknown"


def machine() -> str:
    return os.environ.get("COMPUTERNAME") or os.environ.get("HOSTNAME") or "unknown"


def state_dir() -> Path:
    override = os.environ.get("PC_SESSION_STATE")
    if override:
        return Path(override)
    return Path.home() / ".claude" / "pc_session_state"


def load_state(session_id: str) -> dict:
    try:
        return json.loads((state_dir() / f"{session_id}.json").read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_state(session_id: str, state: dict) -> None:
    d = state_dir()
    d.mkdir(parents=True, exist_ok=True)
    tmp = d / f"{session_id}.json.tmp"
    tmp.write_text(json.dumps(state, indent=1), encoding="utf-8")
    os.replace(tmp, d / f"{session_id}.json")


def read_payload() -> dict:
    import sys
    raw = sys.stdin.buffer.read().decode("utf-8-sig", errors="replace").strip()
    data = json.loads(raw) if raw else {}
    return data if isinstance(data, dict) else {}
