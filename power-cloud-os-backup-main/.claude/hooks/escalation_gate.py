#!/usr/bin/env python3
"""escalation_gate.py - the permission prompt on every Fable escalation.

Decision 10 of the model-tiering plan (2026-09-21): when the orchestrating session is stuck on a
reasoning blockage, it may package the question and hand it to the `pc-escalation` worker, which
runs on Fable. Mike's condition: it should prompt for permission. The orchestrator is told to ask
in words first, but a rule the model follows is not a gate. This hook is the gate.

Wired as a PreToolUse hook on the Agent tool from each client folder's `.claude/settings.json`,
through `pc_hooks.py`. It fires on either of:

    tool_input.subagent_type == "pc-escalation"
    tool_input.model == "fable"          (any agent type; the name check alone would be a bypass)

and returns a forced ASK whose reason quotes the package the orchestrator wrote into the agent
prompt: the question, the attempts and their outcomes, the attached paths, and what Fable is
expected to resolve. One substantive approval, carrying the actual package, is the interaction.

Every other Agent call gets no decision from this hook (exit 0, no output), so it never widens or
narrows permissions it does not own.

Failure posture: CLOSED. An unreadable payload, a non-dict tool_input, or any exception returns
DENY with the reason. Escalation is optional; a broken gate costs one Fable run that did not happen
and shows the consultant why, which is better than an ungated frontier call.

Known limit, recorded in CAPABILITIES.md: if the session itself already runs on Fable and the
Agent call carries no model (inherits), this hook cannot see that. In that case the escalation
agent is a fresh-context second attempt, not a tier up, and the pc-escalation description says so.
"""

import json
import sys

PACKAGE_CHARS = 1500


def decide(kind: str, reason: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": kind,
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


def main() -> int:
    try:
        raw = sys.stdin.buffer.read().decode("utf-8-sig", errors="replace").strip()
        payload = json.loads(raw) if raw else None
        if not isinstance(payload, dict):
            decide("deny", "Escalation gate: hook payload was empty or not an object. Escalation is unavailable until the gate is fixed.")

        tool = payload.get("tool_name", "")
        if tool not in ("Agent", "Task"):
            return 0

        tool_input = payload.get("tool_input")
        if not isinstance(tool_input, dict):
            decide("deny", "Escalation gate: Agent call carried no readable tool_input. Escalation is unavailable until the gate is fixed.")

        subagent = str(tool_input.get("subagent_type") or "")
        model = str(tool_input.get("model") or "").strip().lower()
        if subagent != "pc-escalation" and model != "fable":
            return 0

        prompt = str(tool_input.get("prompt") or "")
        package = prompt[:PACKAGE_CHARS] + (" [...]" if len(prompt) > PACKAGE_CHARS else "")
        if not package.strip():
            package = "(the agent prompt is empty; there is no package to approve)"

        route = f"agent '{subagent or tool_input.get('subagent_type', 'general-purpose')}'"
        if model:
            route += f", model '{model}'"

        decide("ask", (
            "FRONTIER ESCALATION requested: a separate Fable run over the packaged material "
            f"({route}). Approve only if the package states a concrete question, the attempts "
            "already made and their outcomes, and why this is a reasoning blockage rather than "
            "missing evidence (interview or verify instead) or a tooling problem (fix the "
            "environment instead). One escalation per question; the outcome is logged.\n\n"
            "Package:\n" + package
        ))
    except SystemExit:
        raise
    except Exception as exc:
        decide("deny", f"Escalation gate error ({exc}). Escalation is unavailable until the gate is fixed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
