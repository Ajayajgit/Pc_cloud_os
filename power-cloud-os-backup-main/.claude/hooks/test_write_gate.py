#!/usr/bin/env python3
"""Synthetic-payload tests for the NetSuite write guardrail (v5).

Builds a fake Claude Code transcript layout in a temp dir:
    <tmp>/<session>.jsonl                       main conversation
    <tmp>/<session>/subagents/agent-<id>.jsonl  one per subagent
and runs the gate as a subprocess, the way pc_hooks.py does. A temp connector registry is passed
through PC_NS_CONNECTORS_FILE so the suite does not depend on the live one.
"""
import json
import os
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
GATE = HERE / "block-netsuite-writes.py"
PROD = "cf679a55-6cb4-4b61-aae4-90eb9ff6697b"
OTHER_PROD = "c7a4517d-2d89-4be3-8a97-2d8c91f163a9"
SANDBOX = "1b2c3d4e-0000-0000-0000-sandboxsandbo"
UNKNOWN = "00000000-0000-0000-0000-000000000000"
PREGO = "2c3d4e5f-0000-0000-0000-pregolivepre0"
ODDSTATUS = "3d4e5f60-0000-0000-0000-oddstatusodd0"
SID = "11111111-2222-3333-4444-555555555555"
REGISTRY = {"connectors": {
    PROD: {"name": "NetSuite production (MH Crane)", "env": "prod"},
    OTHER_PROD: {"name": "NetSuite production (acct 5641465)", "env": "prod"},
    SANDBOX: {"name": "NetSuite sandbox (test)", "env": "sandbox"},
    PREGO: {"name": "NetSuite production (building)", "env": "prod", "status": "pre-go-live"},
    ODDSTATUS: {"name": "NetSuite production (odd)", "env": "prod", "status": "pre go live"},
}}


def tool(conn, op):
    return f"mcp__{conn}__{op}"


class WriteGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.regdir = Path(tempfile.mkdtemp(prefix="pcreg_"))
        cls.registry = cls.regdir / "ns_connectors.json"
        cls.registry.write_text(json.dumps(REGISTRY), encoding="utf-8")

    def run_gate(self, payload, raw=None, env_extra=None):
        env = {**os.environ, "PC_NS_CONNECTORS_FILE": str(self.registry), **(env_extra or {})}
        data = raw if raw is not None else json.dumps(payload).encode()
        proc = subprocess.run([sys.executable, str(GATE)], input=data, capture_output=True, timeout=60, env=env)
        out = proc.stdout.decode().strip()
        return proc.returncode, (json.loads(out)["hookSpecificOutput"] if out else None), proc.stderr.decode()

    def decision(self, payload, **kw):
        rc, d, err = self.run_gate(payload, **kw)
        self.assertEqual(rc, 0, err)
        return d["permissionDecision"] if d else None

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix="pcgate_"))
        self.main = self.tmp / f"{SID}.jsonl"
        self.main.write_text("", encoding="utf-8")
        self.subdir = self.tmp / SID / "subagents"
        self.subdir.mkdir(parents=True)
        self.n = 0

    def pair(self, conn, op, rtype, ok=True, age=timedelta(minutes=5), tid=None, use_role="assistant",
             result_role="user", is_error="auto", ts_override=None):
        self.n += 1
        tid = tid or f"toolu_{self.n:04d}"
        ts = ts_override or (datetime.now(timezone.utc) - age).isoformat().replace("+00:00", "Z")
        use = {"timestamp": ts, "type": use_role, "message": {"role": use_role, "content": [
            {"type": "tool_use", "id": tid, "name": tool(conn, op), "input": {"recordType": rtype}}]}}
        res_block = {"type": "tool_result", "tool_use_id": tid, "content": "x"}
        if is_error == "auto":
            if not ok:
                res_block["is_error"] = True
        elif is_error != "omit":
            res_block["is_error"] = is_error
        res = {"timestamp": ts, "type": result_role, "message": {"role": result_role, "content": [res_block]}}
        return json.dumps(use) + "\n" + json.dumps(res) + "\n"

    def write(self, path, *args, **kw):
        with open(path, "a", encoding="utf-8") as fh:
            fh.write(self.pair(*args, **kw))

    def agent(self, name="agent-aaaa.jsonl"):
        p = self.subdir / name
        if not p.exists():
            p.write_text("", encoding="utf-8")
        return p

    def payload(self, conn, op, rtype="bom", transcript=None, name=None, sid=SID):
        ti = {"recordType": rtype}
        if name:
            ti["values"] = {"name": name}
        return {"session_id": sid, "transcript_path": str(transcript or self.main),
                "tool_name": tool(conn, op), "tool_input": ti}

    # --- first write / wording ---------------------------------------------------------------
    def test_first_prod_write_asks_plain_english(self):
        rc, d, _ = self.run_gate(self.payload(PROD, "ns_createRecord", name="AEC8X11.5-38RML REV1"))
        self.assertEqual(d["permissionDecision"], "ask")
        r = d["permissionDecisionReason"]
        self.assertTrue(r.startswith("Approve creates and updates on NetSuite PRODUCTION, NetSuite production (MH Crane) for this session?"), r)
        self.assertIn("First one: Create a 'bom' record (AEC8X11.5-38RML REV1)", r)
        self.assertIn("DECLINE", r)
        self.assertIn("including writes run by agents", r)
        self.assertIn("until 24 hours pass with no successful write", r)
        self.assertIn("Deletes have their own separate approval", r)
        self.assertNotIn("ns_createRecord", r)  # no code in the human prompt

    def test_record_handle_shows_id_and_strips_control_chars(self):
        p = self.payload(PROD, "ns_updateRecord", "item")
        p["tool_input"] = {"recordType": "item", "id": "15905", "values": {"itemid": "AEC6x8.2\x07-62RNC"}}
        _, d, _ = self.run_gate(p)
        self.assertIn("(AEC6x8.2-62RNC, id 15905)", d["permissionDecisionReason"])

    def test_unknown_connector_asks_and_names_registry(self):
        _, d, _ = self.run_gate(self.payload(UNKNOWN, "ns_updateRecord", "item"))
        self.assertEqual(d["permissionDecision"], "ask")
        self.assertIn("UNREGISTERED", d["permissionDecisionReason"])
        self.assertIn("ns_connectors.json", d["permissionDecisionReason"])

    def test_registered_sandbox_no_decision(self):
        self.assertIsNone(self.decision(self.payload(SANDBOX, "ns_createRecord")))

    def test_sandbox_looking_name_is_not_trusted(self):
        # v5: only the registry can make a sandbox; a name is not evidence
        for conn in ("acme_sb1", "netsuite-sandbox", "demo-account", "frog"):
            self.assertEqual(self.decision(self.payload(conn, "ns_createRecord")), "ask", conn)

    def test_registry_unreadable_still_gates(self):
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord"),
                                       env_extra={"PC_NS_CONNECTORS_FILE": str(self.tmp / "missing.json")}), "ask")

    def test_read_tool_ignored(self):
        self.assertIsNone(self.decision({"tool_name": tool(PROD, "ns_runCustomSuiteQL"), "tool_input": {}}))

    # --- pre-go-live production ----------------------------------------------------------------
    def test_pre_go_live_creates_and_updates_flow_like_sandbox(self):
        self.assertIsNone(self.decision(self.payload(PREGO, "ns_createRecord")))
        self.assertIsNone(self.decision(self.payload(PREGO, "ns_updateRecord", "item")))

    def test_pre_go_live_delete_still_asks_once_per_session(self):
        _, d, _ = self.run_gate(self.payload(PREGO, "ns_deleteRecord", "bom"))
        self.assertEqual(d["permissionDecision"], "ask")
        r = d["permissionDecisionReason"]
        self.assertTrue(r.startswith("Approve DELETES on NetSuite production (PRE-GO-LIVE), NetSuite production (building)"), r)
        self.assertIn("change its status to live", r)
        self.write(self.main, PREGO, "ns_deleteRecord", "bom")
        self.assertEqual(self.decision(self.payload(PREGO, "ns_deleteRecord", "item")), "allow")

    def test_misspelled_status_means_live(self):
        self.assertEqual(self.decision(self.payload(ODDSTATUS, "ns_createRecord")), "ask")

    def test_status_ignored_without_registry_entry(self):
        # status lives only in the registry; nothing in the tool input or name can claim it
        p = self.payload(UNKNOWN, "ns_createRecord")
        p["tool_input"]["status"] = "pre-go-live"
        self.assertEqual(self.decision(p), "ask")

    # --- failure posture: always ask, never silent, never crash --------------------------------
    def test_malformed_stdin_asks(self):
        self.assertEqual(self.decision(None, raw=b"not json"), "ask")

    def test_non_object_payload_asks(self):
        self.assertEqual(self.decision(None, raw=b"[]"), "ask")

    def test_odd_shapes_do_not_crash(self):
        p = self.payload(PROD, "ns_createRecord")
        p["tool_input"] = ["not", "a", "dict"]
        self.assertEqual(self.decision(p), "ask")
        p["tool_input"] = None
        self.assertEqual(self.decision(p), "ask")
        p["transcript_path"] = 12345
        self.assertEqual(self.decision(p), "ask")

    def test_garbage_transcript_lines_are_skipped(self):
        with open(self.main, "a", encoding="utf-8") as fh:
            fh.write("[]\n{\"message\": 5}\n{\"message\": {\"content\": [1, 2]}}\n"
                     "{\"timestamp\": \"x\", \"message\": {\"role\": \"assistant\", \"content\": [{\"type\": \"tool_use\", \"id\": null, \"name\": null}]}}\n")
        self.write(self.main, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "allow")

    def test_missing_transcript_asks(self):
        p = self.payload(PROD, "ns_createRecord")
        p["transcript_path"] = str(self.tmp / "nope.jsonl")
        self.assertEqual(self.decision(p), "ask")

    # --- session approval --------------------------------------------------------------------
    def test_same_type_approved_allows(self):
        self.write(self.main, PROD, "ns_createRecord", "bom")
        _, d, _ = self.run_gate(self.payload(PROD, "ns_createRecord", "bom"))
        self.assertEqual(d["permissionDecision"], "allow")
        self.assertIn("Covered by this session's approval", d["permissionDecisionReason"])

    def test_other_record_type_and_other_op_covered(self):
        self.write(self.main, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", "serializedassemblyitem")), "allow")
        self.assertEqual(self.decision(self.payload(PROD, "ns_updateRecord", "customrecord_hoist_code")), "allow")

    def test_other_connector_not_covered(self):
        self.write(self.main, OTHER_PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", "bom")), "ask")

    def test_error_result_is_not_approval(self):
        self.write(self.main, PROD, "ns_createRecord", "bom", ok=False)
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", "bom")), "ask")

    def test_is_error_absent_or_false_counts_other_values_do_not(self):
        self.write(self.main, PROD, "ns_createRecord", "bom", is_error="omit")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "allow")
        self.main.write_text("", encoding="utf-8")
        self.write(self.main, PROD, "ns_createRecord", "bom", is_error=False)
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "allow")
        for bad in ("true", "false", 0, 1, [], {}):
            self.main.write_text("", encoding="utf-8")
            self.write(self.main, PROD, "ns_createRecord", "bom", is_error=bad)
            self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask", repr(bad))

    def test_use_without_result_is_not_approval(self):
        ts = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        use = {"timestamp": ts, "message": {"role": "assistant", "content": [
            {"type": "tool_use", "id": "toolu_x", "name": tool(PROD, "ns_createRecord"), "input": {"recordType": "bom"}}]}}
        self.main.write_text(json.dumps(use) + "\n", encoding="utf-8")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", "bom")), "ask")

    def test_wrong_roles_do_not_count(self):
        self.write(self.main, PROD, "ns_createRecord", "bom", use_role="user")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")
        self.main.write_text("", encoding="utf-8")
        self.write(self.main, PROD, "ns_createRecord", "bom", result_role="assistant")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")

    def test_duplicate_tool_use_id_is_poisoned(self):
        self.write(self.main, PROD, "ns_createRecord", "bom", tid="toolu_dup", ok=False)
        self.write(self.main, PROD, "ns_createRecord", "bom", tid="toolu_dup", ok=True)
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")

    def test_window_expiry_and_future_timestamps(self):
        self.write(self.main, PROD, "ns_createRecord", "bom", age=timedelta(hours=25))
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")
        self.write(self.main, PROD, "ns_createRecord", "bom", age=timedelta(hours=23))
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "allow")
        self.main.write_text("", encoding="utf-8")
        self.write(self.main, PROD, "ns_createRecord", "bom", age=timedelta(days=-365))  # far future
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")
        self.main.write_text("", encoding="utf-8")
        self.write(self.main, PROD, "ns_createRecord", "bom", age=timedelta(minutes=-2))  # clock skew
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "allow")

    def test_naive_or_bad_timestamps_do_not_count(self):
        naive = datetime.now().isoformat()
        self.write(self.main, PROD, "ns_createRecord", "bom", ts_override=naive)
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")
        self.main.write_text("", encoding="utf-8")
        self.write(self.main, PROD, "ns_createRecord", "bom", ts_override="yesterday")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")

    # --- delete bucket -----------------------------------------------------------------------
    def test_delete_not_covered_by_create_approval(self):
        self.write(self.main, PROD, "ns_createRecord", "bom")
        self.write(self.main, PROD, "ns_updateRecord", "bom")
        _, d, _ = self.run_gate(self.payload(PROD, "ns_deleteRecord", "bom"))
        self.assertEqual(d["permissionDecision"], "ask")
        self.assertTrue(d["permissionDecisionReason"].startswith("Approve DELETES on NetSuite PRODUCTION"), d["permissionDecisionReason"])

    def test_delete_covered_by_prior_delete_any_type(self):
        self.write(self.main, PROD, "ns_deleteRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_deleteRecord", "item")), "allow")
        self.assertEqual(self.decision(self.payload(PROD, "ns_deleteRecord", "bom", transcript=self.agent())), "allow")

    def test_create_not_covered_by_delete_approval(self):
        self.write(self.main, PROD, "ns_deleteRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", "bom")), "ask")

    # --- subagents ---------------------------------------------------------------------------
    def test_approval_in_main_covers_subagent_call(self):
        self.write(self.main, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", transcript=self.agent())), "allow")

    def test_approval_in_sibling_agent_covers_other_agent_and_main(self):
        a1 = self.agent("agent-a1.jsonl")
        a2 = self.agent("agent-a2.jsonl")
        self.write(a1, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", transcript=a2)), "allow")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", transcript=self.main)), "allow")

    def test_other_session_agents_not_counted(self):
        other = self.tmp / "99999999-0000-0000-0000-000000000000" / "subagents"
        other.mkdir(parents=True)
        self.write(other / "agent-z.jsonl", PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")

    def test_session_id_mismatch_reads_only_calling_transcript(self):
        a1 = self.agent("agent-a1.jsonl")
        self.write(a1, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", sid="some-other-session")), "ask")
        self.write(self.main, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", sid="some-other-session")), "allow")

    def test_session_id_case_insensitive(self):
        a1 = self.agent("agent-a1.jsonl")
        self.write(a1, PROD, "ns_createRecord", "bom")
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord", sid=SID.upper())), "allow")

    @unittest.skipUnless(os.name == "nt", "junction test is Windows-only")
    def test_junctioned_subagents_dir_is_ignored(self):
        other = self.tmp / "99999999-0000-0000-0000-000000000000" / "subagents"
        other.mkdir(parents=True)
        self.write(other / "agent-z.jsonl", PROD, "ns_createRecord", "bom")
        self.subdir.rmdir()
        r = subprocess.run(["cmd", "/c", "mklink", "/J", str(self.subdir), str(other)], capture_output=True)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "ask")

    def test_large_transcript_is_fast(self):
        import time
        with open(self.main, "a", encoding="utf-8") as fh:
            for i in range(20000):
                fh.write(json.dumps({"timestamp": "x", "type": "assistant", "message": {"content": [
                    {"type": "text", "text": "filler " * 50}]}}) + "\n")
        self.write(self.main, PROD, "ns_createRecord", "bom")
        t0 = time.time()
        self.assertEqual(self.decision(self.payload(PROD, "ns_createRecord")), "allow")
        self.assertLess(time.time() - t0, 5.0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
