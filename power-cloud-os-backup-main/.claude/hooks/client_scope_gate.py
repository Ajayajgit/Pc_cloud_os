#!/usr/bin/env python3
"""client_scope_gate.py - keep a client session, and every worker agent inside it, in its lane.

CLAUDE.md has always said "never read other client subfolders during an engagement; sibling folders
are other clients' confidential material." Until now that was prose. A cross-client data bleed
reached an executive summary on 2026-09-17 (feedback entry of that date), and the model-tiering
work (2026-09-21) adds worker subagents whose only path discipline is the prompt they were given.
This hook makes the rule mechanical for the orchestrator and the workers alike.

Wired as a PreToolUse hook on Read, Write, Edit, NotebookEdit, Glob and Grep from each client
folder's `.claude/settings.json`, through `pc_hooks.py`. PreToolUse hooks fire for subagent tool
calls too, and the payload then carries `agent_id`, which is how worker calls are told apart.

Decision table. "Session client" is the top-level folder under the OS root that holds
CLAUDE_PROJECT_DIR (a nested custom project belongs to its parent client). "Target" is the real
path (junctions and `..` resolved) the tool is about to touch.

    session started at the OS root, or outside it, or in a non-client top folder
                                                    -> no decision (this gate is for client sessions)
    target outside the OS root (scratchpad, home)   -> no decision (not this gate's job)
    target is a root file, .claude/, templates/, logos/, fonts/, feedback/, tasks/
        orchestrator                                -> no decision
        worker (agent_id present), Write/Edit       -> DENY  (workers never write outside the client)
    target is the OS root itself, Glob or Grep      -> ASK   (a search from the root spans every client)
    target in Internal/ or Archive/                 -> ASK   (never read by the engagement path)
    target in the session client's own folder       -> no decision
    target in any other client folder               -> DENY

Failure posture: on any error (unreadable payload, path that will not resolve) the gate returns
ASK with the error in the reason. It never fails open silently, and it never fails closed in a way
that kills a session over a hook bug: the human sees one prompt and decides.

Override for tests only: PC_OS_ROOT points the gate at a fake OS root.
"""

import json
import os
import sys
from pathlib import Path

PATH_KEYS = {
    "Read": ("file_path",),
    "Write": ("file_path",),
    "Edit": ("file_path",),
    "NotebookEdit": ("notebook_path",),
    "Glob": ("path",),
    "Grep": ("path",),
}
WRITE_TOOLS = {"Write", "Edit", "NotebookEdit"}
SEARCH_TOOLS = {"Glob", "Grep"}
# Top-level folders under the OS root that are not client folders. Lowercase, because norm()
# lowercases paths on Windows (case-insensitive file system).
SHARED_TOP = {".claude", "templates", "logos", "fonts", "feedback", "tasks"}
RESTRICTED_TOP = {"internal", "archive"}
NON_CLIENT_TOP = SHARED_TOP | RESTRICTED_TOP


def decide(kind: str, reason: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": kind,
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


def norm(path) -> str:
    return os.path.normcase(os.path.realpath(str(path)))


def os_root() -> Path:
    override = os.environ.get("PC_OS_ROOT")
    if override:
        return Path(override)
    return Path(__file__).resolve().parents[2]


def top_component(target_n: str, root_n: str):
    """Return the first path component under the OS root, or None for the root and root files."""
    rel = target_n[len(root_n):].lstrip("\\/")
    if not rel:
        return None
    parts = rel.replace("/", "\\").split("\\")
    # A bare root file (CLAUDE.md) has one component and is not a folder we know; report None
    # so it is treated as a shared reference file.
    if len(parts) == 1 and not os.path.isdir(os.path.join(root_n, parts[0])):
        return None
    return parts[0]


def main() -> int:
    try:
        raw = sys.stdin.buffer.read().decode("utf-8-sig", errors="replace").strip()
        payload = json.loads(raw) if raw else {}
    except Exception as exc:
        decide("ask", f"Scope gate could not read the hook payload ({exc}). Confirm the path is inside this client's folder before allowing.")

    try:
        tool = payload.get("tool_name", "")
        keys = PATH_KEYS.get(tool)
        if not keys:
            return 0

        tool_input = payload.get("tool_input") or {}
        raw_path = next((tool_input.get(k) for k in keys if tool_input.get(k)), None)
        cwd = payload.get("cwd") or os.getcwd()
        project = os.environ.get("CLAUDE_PROJECT_DIR") or cwd

        root_n = norm(os_root())
        sep = os.sep
        project_n = norm(project)

        # Only client sessions are scoped.
        if not project_n.startswith(root_n + sep):
            return 0
        session_client = top_component(project_n, root_n)
        if session_client is None or session_client in NON_CLIENT_TOP:
            return 0

        if raw_path is None:
            # Glob/Grep with no path search the cwd.
            target_n = norm(cwd)
        else:
            p = Path(str(raw_path))
            target_n = norm(p if p.is_absolute() else Path(cwd) / p)

        if target_n != root_n and not target_n.startswith(root_n + sep):
            return 0

        is_worker = bool(payload.get("agent_id"))
        is_write = tool in WRITE_TOOLS

        if target_n == root_n:
            if tool in SEARCH_TOOLS:
                decide("ask", (
                    f"Scope gate: a {tool} rooted at the Power Cloud OS root would span every client "
                    f"folder. This session is scoped to '{session_client}'. Point the search at this "
                    "client's folder or at a root reference folder (.claude, templates) instead."
                ))
            return 0

        target_top = top_component(target_n, root_n)

        if target_top is None or target_top in SHARED_TOP:
            if is_worker and is_write:
                decide("deny", (
                    "Scope gate: worker agents never write outside the client folder. "
                    f"'{raw_path}' is a shared OS file. Hand the change back to the orchestrator "
                    "in your Handback instead."
                ))
            return 0

        if target_top in RESTRICTED_TOP:
            decide("ask", (
                f"Scope gate: '{raw_path}' is under {target_top}/, which the engagement path never "
                "reads (Internal is Power Cloud's own strategy material; Archive is superseded). "
                "Allow only if this is deliberate OS work, not client work."
            ))

        if target_top != session_client:
            decide("deny", (
                f"Scope gate: '{raw_path}' is in another client's folder ('{target_top}'). This session "
                f"is scoped to '{session_client}'. Sibling client folders are confidential; "
                "cross-engagement learning lives only in the root reference files "
                "(NETSUITE_PLAYBOOK.md, LOE_BASELINES.md, PRODUCTS.md, CAPABILITIES.md, templates/)."
            ))

        return 0
    except SystemExit:
        raise
    except Exception as exc:
        decide("ask", f"Scope gate error ({exc}). Confirm the path is inside this client's folder before allowing.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
