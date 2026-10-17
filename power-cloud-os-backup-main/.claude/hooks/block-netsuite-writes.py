#!/usr/bin/env python3
"""Power Cloud write guardrail (A8, v5). ACTIVE through the client stamp
(templates/client-record/.claude/settings.json, via pc_hooks.py "ns_write_gate").

Design (2026-08-12, per Mike): enforcement keys off the CONNECTION, not the session folder, and
production writes are a legitimate, gated part of the lifecycle (sandbox-verified changes promote
to production). The hook never hard-blocks the workflow; it guarantees that no production write
happens without a human having approved writes of that kind on that connection in that session.

What this gate is, and is not. It guards against ACCIDENTAL and UNREVIEWED production writes: a
session that drifts from discovery into writing, an agent that starts a load nobody approved. Its
proof lives in Claude Code's transcript files, which the model does not write but a shell can. It
is therefore not a defense against a model deliberately forging a transcript to dodge the prompt;
that behavior is what the harness's own permission layer and the read-only NetSuite role on
discovery connections are for. The read-only role remains the hard guarantee for discovery.

History:
  v4 (2026-09-23, per Mike): one approval per batch (same tool, same record type) instead of one per
  record. A 200-item import was prompting 200 times.
  v5 (2026-10-06, per Mike, from Julie's MH Crane feedback 2026-10-05): one approval per SESSION per
  CONNECTION, covering creates and updates of every record type, visible from every subagent of the
  session, and a separate once-per-session approval for deletes. v4 keyed on record type, so a task
  touching eight record types prompted eight times, and it read proof only from the calling
  transcript, so writes run through parallel agents (each agent has its own transcript file, and
  agent calls never appear in the parent's) prompted on every single call. The prompt text was
  rewritten in plain English after Julie reported clicking "allow once" without reading it. Codex
  review (2026-10-06) added: fail to "ask" on any internal error or slow scan, no sandbox inference
  from connector names, strict evidence matching, rejection of future-dated timestamps.

Behavior for NetSuite MCP write tools (ns_createRecord/ns_updateRecord/ns_deleteRecord), keyed on
the connector segment of the tool name (mcp__<connector>__ns_createRecord):

  Environment: ns_connectors.json (next to this file) maps connector IDs to prod/sandbox. ONLY a
  registry entry can make a connector a sandbox. Anything unlisted is treated as production.
  A production entry may carry "status": "pre-go-live" (per Mike, 2026-10-06: an account that is
  still being built needs no more protection than a sandbox, and a binary flag beats a go-live
  date that slips). Pre-go-live: creates and updates flow like sandbox; deletes keep their
  once-per-session prompt, because nothing refreshes a pre-go-live account and a bad bulk delete
  is real cleanup. Any other or missing status means live. Flip the status at go-live.

  - SANDBOX connector (registered) -> allowed through the normal permission flow, no output.
  - PRODUCTION or unlisted, create/update -> forced "ask" on the first write of the session on
    that connection. Once a human has approved one and it ran, every further create or update on
    the same connection, any record type, from the main conversation or any subagent of the session,
    is allowed until APPROVAL_WINDOW passes with no successful write of that kind.
  - PRODUCTION or unlisted, delete -> the same, in its own bucket: the first delete of the session
    on that connection asks, further deletes ride on that approval. A create/update approval never
    covers a delete, and the reverse (per Mike, 2026-10-06: deletes may not prompt per record, but
    a session's first delete still gets a human look).

  Approval proof: a prior tool_use of the same bucket on the same connection, in an assistant
  message, paired with a tool_result in a user message whose is_error is absent or false, carrying
  a timezone-aware timestamp inside the window and not in the future. A denial is recorded with
  is_error true, so it never counts. The session family is the file in transcript_path plus the
  parent {session}.jsonl and every {session}/subagents/*.jsonl; symlinks and junctions are skipped,
  and if session_id disagrees with the path, only the calling transcript is read.

  Failure posture: ASK. Malformed input, an unreadable transcript, an unexpected shape, an internal
  error, or a scan that approaches the hook timeout all end in "ask", never in silence. (A hook
  that crashes or times out is ignored by Claude Code, and a permissions.allow rule would then let
  the write through unprompted.)

  Writes issued concurrently before any has completed all ask, because none has a result yet. So
  the first production write of a session goes out alone, from the main conversation; once it has
  run, parallel agents are covered. The approval is sliding: steady work keeps it alive, including
  across a resumed session; a day of silence ends it.

Auto mode's classifier is a separate layer this hook does not control: it still evaluates every
call, whatever this hook decides.

Contract: hook JSON on stdin. Exit 0 with no output = normal flow. JSON on stdout with
permissionDecision "ask" = force the confirmation prompt; "allow" = skip the prompt.
"""
import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

WRITE_TOOLS = ("ns_createRecord", "ns_updateRecord", "ns_deleteRecord")
# Approval buckets: one approval covers the other ops in its bucket, never the other bucket.
BUCKETS = {"ns_createRecord": ("ns_createRecord", "ns_updateRecord"),
           "ns_updateRecord": ("ns_createRecord", "ns_updateRecord"),
           "ns_deleteRecord": ("ns_deleteRecord",)}
APPROVAL_WINDOW = timedelta(hours=24)
CLOCK_SKEW = timedelta(minutes=5)       # a result stamped slightly in the future is a clock, not a forgery
SCAN_BUDGET_SECONDS = 6.0               # the stamp gives the hook 10 s; past this we stop and ask
CONNECTORS_FILE = Path(os.environ.get("PC_NS_CONNECTORS_FILE") or (Path(__file__).resolve().parent / "ns_connectors.json"))
VERB = {"ns_createRecord": "Create", "ns_updateRecord": "Update", "ns_deleteRecord": "Delete"}
NAME_KEYS = ("name", "itemid", "tranid", "entityid", "title")
ID_KEYS = ("id", "recordId", "internalId", "internalid")


def emit(decision: str, reason: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": decision,
            "permissionDecisionReason": reason,
        }
    }))


def split_tool(tool) -> tuple:
    """mcp__<connector>__ns_createRecord -> (connector, 'ns_createRecord')."""
    tool = tool if isinstance(tool, str) else ""
    head, _, op = tool.rpartition("__")
    connector = head[len("mcp__"):] if head.startswith("mcp__") else head
    return connector, op


def environment(connector: str):
    """Return (env, label, status). env is 'prod', 'sandbox' or 'unknown'; status is 'live' or
    'pre-go-live' and only a registry entry with env prod can say pre-go-live."""
    try:
        entry = json.loads(CONNECTORS_FILE.read_text(encoding="utf-8-sig"))["connectors"].get(connector)
    except Exception:
        entry = None
    if isinstance(entry, dict) and entry.get("env") in ("prod", "sandbox"):
        status = "pre-go-live" if entry["env"] == "prod" and entry.get("status") == "pre-go-live" else "live"
        return entry["env"], str(entry.get("name") or connector), status
    if "prod" in connector.lower():
        return "prod", connector, "live"
    return "unknown", connector, "live"


def clean(text, limit=60) -> str:
    """Printable characters only, bounded, for the prompt text."""
    s = "".join(ch for ch in str(text) if ch.isprintable()).strip()
    return s[:limit]


def record_type(tool_input) -> str:
    if not isinstance(tool_input, dict):
        return ""
    return clean(tool_input.get("recordType", ""), 40).lower()


def record_handle(tool_input) -> str:
    """Best-effort human handle for the record: name and/or id, for the prompt text only."""
    if not isinstance(tool_input, dict):
        return ""
    holders = [tool_input] + [tool_input.get(k) for k in ("values", "fields", "data")]
    name = rid = ""
    for h in holders:
        if not isinstance(h, dict):
            continue
        for k in NAME_KEYS:
            v = h.get(k)
            if not name and isinstance(v, (str, int)) and clean(v):
                name = clean(v)
        for k in ID_KEYS:
            v = h.get(k)
            if not rid and isinstance(v, (str, int)) and clean(v, 20):
                rid = clean(v, 20)
    parts = [p for p in (name, f"id {rid}" if rid else "") if p]
    return ", ".join(parts)


def _is_link(p: Path) -> bool:
    try:
        if p.is_symlink():
            return True
        is_junction = getattr(p, "is_junction", None)
        return bool(is_junction()) if is_junction else False
    except Exception:
        return True  # cannot tell: do not trust it


def session_transcripts(transcript_path: str, session_id: str):
    """The calling transcript first, then the rest of its session family.

    Layout (Claude Code): .../projects/<slug>/<session>.jsonl and
    .../projects/<slug>/<session>/subagents/agent-<id>.jsonl. The hook may be handed either.
    If session_id is present and disagrees with the path, only the calling transcript is read.
    """
    if not transcript_path:
        return []
    t = Path(transcript_path)
    if _is_link(t) or not t.is_file():
        return []
    files = [t]
    seen = {str(t.resolve())}

    if t.parent.name == "subagents":
        session_dir = t.parent.parent
    elif t.suffix == ".jsonl":
        session_dir = t.with_suffix("")
    else:
        return files
    if session_id and session_dir.name.lower() != str(session_id).lower():
        return files

    candidates = [session_dir.parent / (session_dir.name + ".jsonl")]
    sub = session_dir / "subagents"
    if sub.is_dir() and not _is_link(sub) and not _is_link(session_dir):
        try:
            candidates.extend(sorted(sub.glob("*.jsonl")))
        except Exception:
            pass
    for p in candidates:
        try:
            if _is_link(p) or not p.is_file():
                continue
            key = str(p.resolve())
        except Exception:
            continue
        if key not in seen:
            seen.add(key)
            files.append(p)
    return files


def parse_ts(value):
    """Timezone-aware datetime or None."""
    try:
        ts = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except Exception:
        return None
    return ts if ts.tzinfo is not None else None


def approved_write_in(path: Path, connector: str, ops, now: datetime, deadline: float):
    """A timestamp of an approved write of bucket `ops` on `connector` inside the window, or None.

    Returns the first qualifying result found; raises TimeoutError past `deadline`.
    """
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            lines = fh.read().splitlines()
    except Exception:
        return None
    uses = {}          # tool_use id -> True (awaiting its one result)
    seen_ids = set()   # every tool_use id ever seen in this file; a repeat disqualifies the id for good
    for i, line in enumerate(lines):
        if (i & 1023) == 0 and time.monotonic() > deadline:
            raise TimeoutError
        if "ns_" not in line and "tool_result" not in line:
            continue  # cheap prefilter; transcripts get large during imports
        try:
            entry = json.loads(line)
        except Exception:
            continue
        if not isinstance(entry, dict):
            continue
        msg = entry.get("message")
        if not isinstance(msg, dict):
            continue
        role = msg.get("role")
        content = msg.get("content")
        if not isinstance(content, list):
            continue
        for block in content:
            if not isinstance(block, dict):
                continue
            btype = block.get("type")
            if btype == "tool_use" and role == "assistant":
                c, op = split_tool(block.get("name"))
                if c != connector or op not in ops:
                    continue
                bid = block.get("id")
                if not isinstance(bid, str) or not bid:
                    continue
                if bid in seen_ids:
                    uses.pop(bid, None)
                    continue
                seen_ids.add(bid)
                uses[bid] = True
            elif btype == "tool_result" and role == "user":
                rid = block.get("tool_use_id")
                if not isinstance(rid, str) or rid not in uses:
                    continue
                uses.pop(rid)  # one result per use
                ie = block.get("is_error")
                if ie is not None and ie is not False:  # identity, not ==: 0 == False in Python
                    continue
                ts = parse_ts(entry.get("timestamp"))
                if ts is None:
                    continue
                age = now - ts
                if -CLOCK_SKEW <= age <= APPROVAL_WINDOW:
                    return ts
    return None


def session_approval(transcript_path: str, session_id: str, connector: str, ops, deadline: float):
    now = datetime.now(timezone.utc)
    for f in session_transcripts(transcript_path, session_id):
        ts = approved_write_in(f, connector, ops, now, deadline)
        if ts is not None:
            return ts
    return None


def decide(payload: dict, deadline: float) -> None:
    tool = payload.get("tool_name", "")
    connector, op = split_tool(tool)
    if op not in WRITE_TOOLS:
        return

    env, label, status = environment(connector)
    if env == "sandbox":
        return  # registered sandbox: normal permission prompts + execution gates apply
    pre_go_live = env == "prod" and status == "pre-go-live"
    if pre_go_live and op != "ns_deleteRecord":
        return  # an account still being built: creates and updates flow like sandbox

    tool_input = payload.get("tool_input")
    rtype = record_type(tool_input) or "record"
    handle = record_handle(tool_input)
    what = f"{VERB[op]} a '{rtype}' record" + (f" ({handle})" if handle else "")
    if pre_go_live:
        where = f"NetSuite production (PRE-GO-LIVE), {label}"
    elif env == "prod":
        where = f"NetSuite PRODUCTION, {label}"
    else:
        where = f"an UNREGISTERED NetSuite connection ({label}), treated as production"
    hours = int(APPROVAL_WINDOW.total_seconds() // 3600)

    bucket = BUCKETS[op]
    approved = session_approval(payload.get("transcript_path", ""),
                                str(payload.get("session_id") or ""), connector, bucket, deadline)
    if approved is not None:
        mins = int((datetime.now(timezone.utc) - approved).total_seconds() // 60)
        emit("allow", f"Power Cloud gate: {what} in {where}. Covered by this session's approval "
                      f"(an approved write of this kind ran {max(mins, 0)} min ago).")
        return

    if op == "ns_deleteRecord":
        lead = (f"Approve DELETES on {where} for this session? First one: {what}. "
                "Allowing it allows every further delete on this connection, any record type, "
                "including deletes run by agents, until "
                f"{hours} hours pass with no successful delete. Creates and updates have their own separate approval.")
    else:
        lead = (f"Approve creates and updates on {where} for this session? First one: {what}. "
                "Allowing it allows every further create and update on this connection, any record type, "
                "including writes run by agents, until "
                f"{hours} hours pass with no successful write. Deletes have their own separate approval.")
    parts = [lead]
    if env != "prod":
        parts.append("Register this connection in .claude/hooks/ns_connectors.json so the gate can name it.")
    if pre_go_live:
        parts.append("This connection is marked pre-go-live in .claude/hooks/ns_connectors.json, so creates and "
                     "updates do not prompt. When the account goes live, change its status to live there.")
    parts.append("Allow only if this is approved execution work on this account. "
                 "In a discovery or assessment session, DECLINE: discovery is read-only, no exceptions.")
    emit("ask", " ".join(parts))


def main() -> int:
    deadline = time.monotonic() + SCAN_BUDGET_SECONDS
    try:
        raw = sys.stdin.buffer.read().decode("utf-8-sig")  # tolerate BOM
        payload = json.loads(raw)
        if not isinstance(payload, dict):
            raise ValueError("payload is not an object")
    except Exception:
        # The matcher only routes NetSuite write tools here, so unreadable input still means a write.
        emit("ask", "Power Cloud gate: could not read the hook input for this NetSuite write, so it asks. "
                    "Allow only if this is approved execution work; decline in discovery.")
        return 0
    try:
        decide(payload, deadline)
    except TimeoutError:
        emit("ask", "Power Cloud gate: the session transcript is too large to confirm an earlier approval "
                    "in time, so this NetSuite write asks. Allow only if this is approved execution work.")
    except Exception as exc:  # never fail silent on a write tool
        emit("ask", f"Power Cloud gate: internal error ({type(exc).__name__}), so this NetSuite write asks. "
                    "Allow only if this is approved execution work; decline in discovery.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
