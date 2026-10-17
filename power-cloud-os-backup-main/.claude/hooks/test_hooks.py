#!/usr/bin/env python3
"""test_hooks.py - synthetic-payload tests for the Power Cloud OS hooks.

Runs each gate as a subprocess with the JSON a PreToolUse hook receives on stdin and checks the
decision it prints. Uses a temporary fake OS root (PC_OS_ROOT) so no real client folder is
touched, and builds a Windows junction inside it to prove resolved paths are what get judged.

    python .claude/hooks/test_hooks.py          (from the OS root)
"""

import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HOOKS = Path(__file__).resolve().parent
sys.path.insert(0, str(HOOKS))
from test_write_gate import WriteGateTests  # noqa: E402,F401  (runs under this same command)
SCOPE = HOOKS / "client_scope_gate.py"
ESC = HOOKS / "escalation_gate.py"
DISPATCH = HOOKS / "pc_hooks.py"
TEMPLATE = HOOKS / "client-settings-template.json"


def run(script, payload, env_extra=None, args=()):
    env = {**os.environ, **(env_extra or {})}
    proc = subprocess.run(
        [sys.executable, str(script), *args],
        input=json.dumps(payload).encode("utf-8") if payload is not None else b"not json",
        capture_output=True, env=env, timeout=30,
    )
    out = proc.stdout.decode("utf-8", errors="replace").strip()
    decision = None
    if out:
        decision = json.loads(out)["hookSpecificOutput"]
    return proc.returncode, decision, proc.stderr.decode("utf-8", errors="replace")


class FakeRoot:
    """A throwaway OS root: two clients, a nested project, Internal/, .claude/, a junction."""

    def __init__(self):
        self.dir = Path(tempfile.mkdtemp(prefix="pcos_"))
        self.root = self.dir / "Power Cloud OS"
        for sub in ("ClientA/working", "ClientA/Proj/working", "ClientB", "Internal", ".claude/agents",
                    "templates", "Archive"):
            (self.root / sub).mkdir(parents=True)
        (self.root / "CLAUDE.md").write_text("root", encoding="utf-8")
        (self.root / "ClientB" / "CONTEXT.md").write_text("secret", encoding="utf-8")
        (self.root / "ClientA" / "CONTEXT.md").write_text("mine", encoding="utf-8")
        self.junction = self.root / "ClientA" / "working" / "link"
        self.has_junction = False
        if os.name == "nt":
            r = subprocess.run(["cmd", "/c", "mklink", "/J", str(self.junction), str(self.root / "ClientB")],
                               capture_output=True)
            self.has_junction = r.returncode == 0

    def env(self, project):
        return {"PC_OS_ROOT": str(self.root), "CLAUDE_PROJECT_DIR": str(self.root / project)}

    def cleanup(self):
        if self.has_junction:
            try:
                os.rmdir(self.junction)
            except OSError:
                pass
        shutil.rmtree(self.dir, ignore_errors=True)


def payload(tool, cwd, agent=False, **tool_input):
    p = {"hook_event_name": "PreToolUse", "tool_name": tool, "tool_input": tool_input, "cwd": str(cwd)}
    if agent:
        p["agent_id"] = "agent_123"
        p["agent_type"] = "pc-code-chores"
    return p


class ScopeGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fr = FakeRoot()
        cls.a = cls.fr.root / "ClientA"
        cls.envA = cls.fr.env("ClientA")

    @classmethod
    def tearDownClass(cls):
        cls.fr.cleanup()

    def scope(self, pl, env=None):
        return run(SCOPE, pl, env or self.envA)

    def test_sibling_read_denied(self):
        _, d, _ = self.scope(payload("Read", self.a, file_path=str(self.fr.root / "ClientB" / "CONTEXT.md")))
        self.assertEqual(d["permissionDecision"], "deny")
        self.assertIn("ClientB", d["permissionDecisionReason"])

    def test_traversal_relative_denied(self):
        _, d, _ = self.scope(payload("Read", self.a, file_path="..\\ClientB\\CONTEXT.md"))
        self.assertEqual(d["permissionDecision"], "deny")

    def test_junction_denied(self):
        if not self.fr.has_junction:
            self.skipTest("junction could not be created on this machine")
        _, d, _ = self.scope(payload("Read", self.a, file_path=str(self.fr.junction / "CONTEXT.md")))
        self.assertEqual(d["permissionDecision"], "deny")

    def test_own_folder_allowed(self):
        _, d, _ = self.scope(payload("Read", self.a, file_path=str(self.a / "CONTEXT.md")))
        self.assertIsNone(d)

    def test_root_reference_read_allowed(self):
        _, d, _ = self.scope(payload("Read", self.a, file_path=str(self.fr.root / "CLAUDE.md")))
        self.assertIsNone(d)

    def test_orchestrator_root_write_allowed(self):
        _, d, _ = self.scope(payload("Edit", self.a, file_path=str(self.fr.root / "CLAUDE.md")))
        self.assertIsNone(d)

    def test_worker_root_write_denied(self):
        _, d, _ = self.scope(payload("Write", self.a, agent=True, file_path=str(self.fr.root / ".claude" / "agents" / "x.md")))
        self.assertEqual(d["permissionDecision"], "deny")
        self.assertIn("worker", d["permissionDecisionReason"].lower())

    def test_worker_own_folder_write_allowed(self):
        _, d, _ = self.scope(payload("Write", self.a, agent=True, file_path=str(self.a / "working" / "out.md")))
        self.assertIsNone(d)

    def test_internal_asks(self):
        _, d, _ = self.scope(payload("Read", self.a, file_path=str(self.fr.root / "Internal" / "plan.md")))
        self.assertEqual(d["permissionDecision"], "ask")

    def test_grep_at_root_asks(self):
        _, d, _ = self.scope(payload("Grep", self.a, pattern="x", path=str(self.fr.root)))
        self.assertEqual(d["permissionDecision"], "ask")

    def test_glob_without_path_uses_cwd(self):
        _, d, _ = self.scope(payload("Glob", self.a, pattern="**/*.md"))
        self.assertIsNone(d)

    def test_nested_project_reads_parent_client(self):
        env = self.fr.env("ClientA/Proj")
        _, d, _ = self.scope(payload("Read", self.a / "Proj", file_path=str(self.a / "CONTEXT.md")), env)
        self.assertIsNone(d)

    def test_nested_project_sibling_denied(self):
        env = self.fr.env("ClientA/Proj")
        _, d, _ = self.scope(payload("Read", self.a / "Proj", file_path=str(self.fr.root / "ClientB" / "CONTEXT.md")), env)
        self.assertEqual(d["permissionDecision"], "deny")

    def test_root_session_unrestricted(self):
        env = {"PC_OS_ROOT": str(self.fr.root), "CLAUDE_PROJECT_DIR": str(self.fr.root)}
        _, d, _ = self.scope(payload("Read", self.fr.root, file_path=str(self.fr.root / "ClientB" / "CONTEXT.md")), env)
        self.assertIsNone(d)

    def test_outside_os_root_ignored(self):
        _, d, _ = self.scope(payload("Read", self.a, file_path=str(self.fr.dir / "elsewhere.txt")))
        self.assertIsNone(d)

    def test_unrelated_tool_ignored(self):
        _, d, _ = self.scope(payload("Bash", self.a, command="dir"))
        self.assertIsNone(d)

    def test_malformed_payload_asks(self):
        _, d, _ = run(SCOPE, None, self.envA)
        self.assertEqual(d["permissionDecision"], "ask")


class EscalationGateTests(unittest.TestCase):
    def test_pc_escalation_asks_with_package(self):
        _, d, _ = run(ESC, {"tool_name": "Agent", "tool_input": {"subagent_type": "pc-escalation", "prompt": "QUESTION: why does validate loop", "description": "x"}})
        self.assertEqual(d["permissionDecision"], "ask")
        self.assertIn("QUESTION: why does validate loop", d["permissionDecisionReason"])

    def test_fable_on_any_agent_asks(self):
        _, d, _ = run(ESC, {"tool_name": "Agent", "tool_input": {"subagent_type": "general-purpose", "model": "Fable", "prompt": "p"}})
        self.assertEqual(d["permissionDecision"], "ask")

    def test_other_worker_no_decision(self):
        _, d, _ = run(ESC, {"tool_name": "Agent", "tool_input": {"subagent_type": "pc-code-chores", "prompt": "p"}})
        self.assertIsNone(d)

    def test_haiku_general_no_decision(self):
        _, d, _ = run(ESC, {"tool_name": "Agent", "tool_input": {"subagent_type": "general-purpose", "model": "haiku", "prompt": "p"}})
        self.assertIsNone(d)

    def test_unrelated_tool_no_decision(self):
        _, d, _ = run(ESC, {"tool_name": "Bash", "tool_input": {"command": "dir"}})
        self.assertIsNone(d)

    def test_malformed_payload_denies(self):
        _, d, _ = run(ESC, None)
        self.assertEqual(d["permissionDecision"], "deny")

    def test_missing_tool_input_denies(self):
        _, d, _ = run(ESC, {"tool_name": "Agent"})
        self.assertEqual(d["permissionDecision"], "deny")

    def test_long_prompt_truncated(self):
        _, d, _ = run(ESC, {"tool_name": "Agent", "tool_input": {"subagent_type": "pc-escalation", "prompt": "x" * 5000}})
        self.assertIn("[...]", d["permissionDecisionReason"])
        self.assertLess(len(d["permissionDecisionReason"]), 2500)


SNAP = HOOKS / "session_snapshot.py"
BRIEF = HOOKS / "session_brief.py"
MEMGATE = HOOKS / "memory_gate.py"


def human(text, ts):
    return {"type": "user", "origin": {"kind": "human"}, "timestamp": ts, "message": {"role": "user", "content": text}}


def claude(text, ts, blocks=None):
    return {"type": "assistant", "timestamp": ts,
            "message": {"role": "assistant", "content": blocks or [{"type": "text", "text": text}]}}


def run_raw(script, stdin_bytes, env):
    proc = subprocess.run([sys.executable, str(script)], input=stdin_bytes, capture_output=True,
                          env={**os.environ, **env}, timeout=30)
    return proc.returncode, proc.stdout.decode("utf-8", errors="replace").strip()


class SessionMemoryTests(unittest.TestCase):
    """session_snapshot (capture), session_brief (SessionStart brief), memory_gate (D2)."""

    def setUp(self):
        self.fr = FakeRoot()
        self.state = self.fr.dir / "state"
        self.transcript = self.fr.dir / "t.jsonl"
        self.transcript.write_text("", encoding="utf-8")

    def tearDown(self):
        self.fr.cleanup()

    def env(self, project="ClientA"):
        return {**self.fr.env(project), "PC_SESSION_STATE": str(self.state), "USERNAME": "Tester"}

    def add(self, *entries, raw_tail=""):
        with open(self.transcript, "a", encoding="utf-8") as fh:
            for e in entries:
                fh.write(json.dumps(e) + "\n")
            fh.write(raw_tail)

    def snap(self, project="ClientA", event="Stop", sid="abcdef12-0000"):
        pl = {"session_id": sid, "transcript_path": str(self.transcript), "hook_event_name": event,
              "cwd": str(self.fr.root / project)}
        return run_raw(SNAP, json.dumps(pl).encode(), self.env(project))

    def raw_file(self, project="ClientA"):
        files = list((self.fr.root / project / "working" / "sessions" / "raw").glob("*.md"))
        self.assertEqual(len(files), 1, files)
        return files[0].read_text(encoding="utf-8")

    def brief(self, project="ClientA", source="startup", sid="new-session"):
        rc, out = run_raw(BRIEF, json.dumps({"session_id": sid, "source": source}).encode(), self.env(project))
        self.assertEqual(rc, 0)
        return json.loads(out)["hookSpecificOutput"]["additionalContext"] if out else ""

    def test_captures_prompts_and_replies_only(self):
        self.add(
            human("We decided to keep LOE light.", "2026-09-24T10:00:00Z"),
            claude("", "2026-09-24T10:00:01Z", [{"type": "thinking", "thinking": "SECRET-THOUGHT"},
                                                {"type": "tool_use", "id": "t1", "name": "Read", "input": {}}]),
            {"type": "user", "timestamp": "2026-09-24T10:00:02Z",
             "message": {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t1", "content": "TOOL-OUTPUT"}]}},
            claude("Understood, LOE stays light.", "2026-09-24T10:00:03Z"),
            {"type": "user", "origin": {"kind": "task-notification"}, "timestamp": "2026-09-24T10:00:04Z",
             "message": {"role": "user", "content": "<task-notification>NOTIFY</task-notification>"}},
            {**claude("SUBAGENT-TEXT", "2026-09-24T10:00:05Z"), "isSidechain": True},
            human("<system-reminder>REMINDER</system-reminder>Second question", "2026-09-24T10:01:00Z"),
        )
        rc, out = self.snap()
        self.assertEqual((rc, out), (0, ""))
        text = self.raw_file()
        self.assertIn("We decided to keep LOE light.", text)
        self.assertIn("Understood, LOE stays light.", text)
        self.assertIn("### Turn 2", text)
        self.assertIn("Second question", text)
        for leaked in ("SECRET-THOUGHT", "TOOL-OUTPUT", "NOTIFY", "SUBAGENT-TEXT", "REMINDER"):
            self.assertNotIn(leaked, text)

    def test_append_only_and_turns_continue(self):
        self.add(human("first", "2026-09-24T10:00:00Z"), claude("one", "2026-09-24T10:00:01Z"))
        self.snap()
        self.add(human("second", "2026-09-24T10:05:00Z"), claude("two", "2026-09-24T10:05:01Z"))
        self.snap()
        self.snap()  # nothing new: must not duplicate
        text = self.raw_file()
        self.assertEqual(text.count("first"), 1)
        self.assertEqual(text.count("### Turn"), 2)
        self.assertIn("### Turn 2", text)
        meta = json.loads(next((self.fr.root / "ClientA/working/sessions/raw").glob("*.meta.json")).read_text())
        self.assertEqual(meta["turns"], 2)

    def test_partial_trailing_line_waits(self):
        self.add(human("complete", "2026-09-24T10:00:00Z"), raw_tail='{"type": "user", "origin": {"kind": "hum')
        self.snap()
        self.assertNotIn("half", self.raw_file())
        with open(self.transcript, "a", encoding="utf-8") as fh:
            fh.write('an"}, "timestamp": "2026-09-24T10:02:00Z", "message": {"role": "user", "content": "half done"}}\n')
        self.snap()
        text = self.raw_file()
        self.assertIn("half done", text)
        self.assertEqual(text.count("### Turn"), 2)

    def test_redaction(self):
        self.add(human("key sk-ant-api03-abcdefghijklmnopqrstuv and password=hunter2hunter2 and ghp_abcdefghijklmnopqrstuvwx12",
                       "2026-09-24T10:00:00Z"))
        self.snap()
        text = self.raw_file()
        for secret in ("sk-ant-api03-abcdefghijklmnopqrstuv", "hunter2hunter2", "ghp_abcdefghijklmnopqrstuvwx12"):
            self.assertNotIn(secret, text)
        self.assertIn("[redacted:api-key]", text)
        self.assertIn("password=[redacted]", text)

    def test_ask_user_question_answer_captured(self):
        self.add(
            human("plan it", "2026-09-24T10:00:00Z"),
            claude("", "2026-09-24T10:00:01Z", [{"type": "tool_use", "id": "q1", "name": "AskUserQuestion", "input": {}}]),
            {"type": "user", "timestamp": "2026-09-24T10:00:30Z",
             "message": {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "q1",
                                                      "content": "Where?=\"Internal/sessions/\""}]}},
        )
        self.snap()
        text = self.raw_file()
        self.assertIn("tester answered:", text)
        self.assertIn("Internal/sessions/", text)

    def test_scopes(self):
        self.add(human("nested", "2026-09-24T10:00:00Z"))
        self.snap(project="ClientA/Proj")
        self.assertIn("nested", self.raw_file("ClientA/Proj"))
        self.add(human("root", "2026-09-24T10:01:00Z"))
        pl = {"session_id": "root-sess", "transcript_path": str(self.transcript), "hook_event_name": "Stop"}
        env = {**self.env(), "CLAUDE_PROJECT_DIR": str(self.fr.root)}
        run_raw(SNAP, json.dumps(pl).encode(), env)
        self.assertTrue(list((self.fr.root / "Internal" / "sessions" / "raw").glob("*.md")))
        env = {**self.env(), "CLAUDE_PROJECT_DIR": str(self.fr.dir)}
        pl["session_id"] = "outside"
        run_raw(SNAP, json.dumps(pl).encode(), env)
        self.assertFalse((self.fr.dir / "working").exists())

    def test_garbage_stdin_is_silent(self):
        self.assertEqual(run_raw(SNAP, b"not json", self.env()), (0, ""))
        self.assertEqual(run_raw(BRIEF, b"not json", self.env()), (0, ""))

    def test_transcript_shrink_does_not_duplicate(self):
        self.add(human("alpha", "2026-09-24T10:00:00Z"), human("beta", "2026-09-24T10:01:00Z"))
        self.snap()
        self.transcript.write_text("", encoding="utf-8")
        self.add(human("alpha", "2026-09-24T10:00:00Z"), human("beta", "2026-09-24T10:01:00Z"),
                 human("gamma", "2026-09-24T10:02:00Z"))
        self.snap()
        text = self.raw_file()
        self.assertEqual(text.count("alpha"), 1)
        self.assertIn("gamma", text)

    def test_format_change_is_reported(self):
        self.add(*[{"type": "assistant", "timestamp": f"2026-09-24T10:00:{i:02d}Z", "message": {"role": "assistant", "content": 42}}
                   for i in range(25)])
        self.snap()
        st = json.loads(next(self.state.glob("*.json")).read_text())
        self.assertTrue(any("format may have changed" in e["error"] for e in st["errors"]))

    def test_precompact_marker(self):
        self.add(human("before compaction", "2026-09-24T10:00:00Z"))
        self.snap(event="PreCompact")
        self.assertIn("Context compacted", self.raw_file())

    def test_brief_empty_scope_names_session_only(self):
        b = self.brief(sid="feedbeef-1234")
        self.assertIn("This session: feedbeef-1234", b)
        self.assertIn("No checkpoints or debt yet", b)
        self.assertLess(len(b), 400)

    def test_brief_reports_debt_then_coverage(self):
        self.add(human("one", "2026-09-24T10:00:00Z"), human("two", "2026-09-24T10:01:00Z"),
                 human("three", "2026-09-24T10:02:00Z"))
        self.snap()
        b = self.brief()
        self.assertIn("turns 1 to 3", b)
        self.assertIn("distill", b)
        (self.fr.root / "ClientA/working/sessions/2026-09-24_tester_abcdef12_x.md").write_text(
            "---\ndate: 2026-09-24\nwho: tester\nsession: abcdef12-0000\ncovers_through: 2\n---\n"
            "## Open threads\n- Who owns the SB refresh?\n## Next step\n- Verify the refresh date.\n", encoding="utf-8")
        b = self.brief()
        self.assertIn("turns 3 to 3", b)
        self.assertIn("Verify the refresh date", b)
        self.assertIn("Who owns the SB refresh", b)

    def test_brief_compact_and_conflicts(self):
        sess = self.fr.root / "ClientA/working/sessions"
        sess.mkdir(parents=True)
        (sess / "2026-09-24_tester_abc_x (1).md").write_text("dup", encoding="utf-8")
        b = self.brief(source="compact")
        self.assertIn("compacted", b)
        self.assertIn("(1).md", b)

    def test_brief_is_bounded(self):
        sess = self.fr.root / "ClientA/working/sessions"
        sess.mkdir(parents=True)
        for i in range(10):
            (sess / f"2026-09-{i + 10}_t_{i:08d}_x.md").write_text(
                f"---\ndate: 2026-09-{i + 10}\nwho: t\nsession: {i:08d}\ncovers_through: 1\n---\n## Next step\n- " + "x" * 800,
                encoding="utf-8")
        self.assertLessEqual(len(self.brief()), 2300)

    def test_memory_gate(self):
        mem = str(Path.home() / ".claude" / "projects" / "G--x" / "memory" / "note.md")
        _, d, _ = run(MEMGATE, {"tool_name": "Write", "tool_input": {"file_path": mem, "content": "x"}})
        self.assertEqual(d["permissionDecision"], "ask")
        _, d, _ = run(MEMGATE, {"tool_name": "Edit", "tool_input": {"file_path": str(self.fr.root / "CONTEXT.md")}})
        self.assertIsNone(d)
        _, d, _ = run(MEMGATE, None)
        self.assertIsNone(d)


class LauncherTests(unittest.TestCase):
    """The one-liner in the stamped settings must find the real OS root from any depth."""

    def launcher_args(self):
        cfg = json.loads(TEMPLATE.read_text(encoding="utf-8"))
        entry = next(h for h in cfg["hooks"]["PreToolUse"] if h["matcher"].startswith("Agent"))
        return entry["hooks"][0]["args"]

    def test_dispatch_from_nested_depth(self):
        # Pretend the session started three levels below the real OS root; the walk-up must still
        # find .claude/hooks/pc_hooks.py and dispatch to the escalation gate.
        real_root = HOOKS.parents[1]
        deep = real_root / "templates" / "client-record" / "working"
        env = {**os.environ, "CLAUDE_PROJECT_DIR": str(deep)}
        pl = {"tool_name": "Agent", "tool_input": {"subagent_type": "pc-escalation", "prompt": "deep test"}}
        proc = subprocess.run([sys.executable, *self.launcher_args()], input=json.dumps(pl).encode(),
                              capture_output=True, env=env, timeout=30)
        out = json.loads(proc.stdout.decode().strip())["hookSpecificOutput"]
        self.assertEqual(out["permissionDecision"], "ask")
        self.assertIn("deep test", out["permissionDecisionReason"])

    def test_dispatch_outside_os_exits_clean(self):
        env = {**os.environ, "CLAUDE_PROJECT_DIR": tempfile.gettempdir()}
        pl = {"tool_name": "Agent", "tool_input": {"subagent_type": "pc-escalation", "prompt": "x"}}
        proc = subprocess.run([sys.executable, *self.launcher_args()], input=json.dumps(pl).encode(),
                              capture_output=True, env=env, timeout=30)
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stdout.strip(), b"")

    def test_template_and_stamp_identical(self):
        stamp = HOOKS.parents[1] / "templates" / "client-record" / ".claude" / "settings.json"
        self.assertEqual(json.loads(TEMPLATE.read_text(encoding="utf-8")),
                         json.loads(stamp.read_text(encoding="utf-8")))

    def test_every_stamped_hook_name_dispatches(self):
        # A typo in a stamped hook name would exit 0 silently (the dispatcher's degraded mode), so
        # session capture would never run and nothing would say so. Pin the names here.
        sys.path.insert(0, str(HOOKS))
        import pc_hooks
        cfg = json.loads(TEMPLATE.read_text(encoding="utf-8"))
        for event in ("PreToolUse", "SessionStart", "Stop", "PreCompact", "SessionEnd"):
            self.assertIn(event, cfg["hooks"])
            for entry in cfg["hooks"][event]:
                for hook in entry["hooks"]:
                    # Exec form must be exactly ["-c", <the launcher>, <name>]; a generator bug on
                    # 2026-09-24 dropped the launcher and every session hook ran `python -c name`.
                    self.assertEqual(hook["args"][:2], self.launcher_args()[:2], f"{event} launcher")
                    self.assertEqual(len(hook["args"]), 3, f"{event} arg count")
                    name = hook["args"][-1]
                    self.assertIn(name, pc_hooks.HOOKS, f"{event}: {name}")
                    self.assertTrue((HOOKS / pc_hooks.HOOKS[name]).is_file(), name)

    def test_unknown_hook_name_exits_clean(self):
        proc = subprocess.run([sys.executable, str(DISPATCH), "nope"], input=b"{}", capture_output=True, timeout=30)
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stdout.strip(), b"")


if __name__ == "__main__":
    unittest.main(verbosity=2)
