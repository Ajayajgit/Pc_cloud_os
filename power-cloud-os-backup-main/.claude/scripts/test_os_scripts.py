# -*- coding: utf-8 -*-
"""Unit tests for the four discovery-support scripts added 2026-09-21.

Covers summarize_time_entries.py, check_candidates.py, check_crossrefs.py, and
parse_validate_log.py against small inline fixtures (temp files), so the scripts'
edge-case handling (a duplicate row, a malformed row, a broken anchor, an
unmatched ID, three sample validate-log lines) is proven rather than assumed.

Run from the Power Cloud OS root:

    python .claude/scripts/test_os_scripts.py

Or with unittest's own runner for more verbose output:

    python -m unittest .claude/scripts/test_os_scripts.py -v
"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import summarize_time_entries as ste
import check_candidates as cc
import check_crossrefs as ccr
import parse_validate_log as pvl


class TestSummarizeTimeEntries(unittest.TestCase):
    def setUp(self):
        self.tmpdir = tempfile.TemporaryDirectory()
        self.working = Path(self.tmpdir.name) / "working"
        self.working.mkdir()

    def tearDown(self):
        self.tmpdir.cleanup()

    def write_entries(self, name, entries, **meta):
        payload = {"customer_name": "Test Co", "entry_count": len(entries), **meta, "entries": entries}
        path = self.working / name
        path.write_text(json.dumps(payload), encoding="utf-8")
        return path

    def test_duplicate_row_is_skipped_and_reported(self):
        entries = [
            {"trandate": "8/10/2026", "hours": 2, "isbillable": "T", "employee_name": "Sachin Dubey"},
            {"trandate": "8/10/2026", "hours": 2, "isbillable": "T", "employee_name": "Sachin Dubey"},
        ]
        result = ste.process_entries(entries)
        self.assertEqual(result["rows_kept"], 1)
        self.assertEqual(len(result["skipped"]), 1)
        self.assertIn("duplicate", result["skipped"][0]["reason"])

    def test_malformed_row_missing_hours_is_skipped_with_reason(self):
        entries = [
            {"trandate": "8/10/2026", "hours": None, "isbillable": "T", "employee_name": "Jason Kramer"},
            {"trandate": "8/11/2026", "hours": "not-a-number", "isbillable": "F", "employee_name": "Jason Kramer"},
        ]
        result = ste.process_entries(entries)
        self.assertEqual(result["rows_kept"], 0)
        self.assertEqual(len(result["skipped"]), 2)
        for row in result["skipped"]:
            self.assertIn("hours", row["reason"])

    def test_unparseable_date_is_skipped(self):
        entries = [
            {"trandate": "not-a-date", "hours": 1, "isbillable": "T", "employee_name": "Maria Antonio"},
        ]
        result = ste.process_entries(entries)
        self.assertEqual(result["rows_kept"], 0)
        self.assertIn("unparseable date", result["skipped"][0]["reason"])

    def test_billable_vs_msp_split_by_isbillable(self):
        entries = [
            {"trandate": "8/1/2026", "hours": 3, "isbillable": "T", "employee_name": "A"},
            {"trandate": "8/1/2026", "hours": 1, "isbillable": "F", "employee_name": "B"},
        ]
        result = ste.process_entries(entries)
        self.assertEqual(result["billable_hours"], 3)
        self.assertEqual(result["msp_hours"], 1)
        self.assertEqual(result["rows_kept"], 2)

    def test_unclassified_isbillable_value_is_reported(self):
        entries = [
            {"trandate": "8/1/2026", "hours": 2, "isbillable": "maybe", "employee_name": "A"},
        ]
        result = ste.process_entries(entries)
        self.assertEqual(result["unclassified_hours"], 2)
        self.assertIn("maybe", result["unclassified_values"])

    def test_no_memo_field_is_noted_not_crashed(self):
        entries = [{"trandate": "8/1/2026", "hours": 1, "isbillable": "T", "employee_name": "A"}]
        result = ste.process_entries(entries)
        self.assertIsNone(result["memo_field"])
        self.assertEqual(result["by_resource"]["A"]["memos"], [])

    def test_find_latest_file_picks_newest_by_filename_date(self):
        self.write_entries("time_entries_2026-08-23.json", [])
        self.write_entries("time_entries_2026-09-20.json", [])
        self.write_entries("time_entries_2026-09-06.json", [])
        latest = ste.find_latest_file(self.working)
        self.assertEqual(latest.name, "time_entries_2026-09-20.json")

    def test_main_exits_0_even_with_skipped_rows(self):
        path = self.write_entries(
            "time_entries_2026-09-20.json",
            [
                {"trandate": "8/10/2026", "hours": 2, "isbillable": "T", "employee_name": "A"},
                {"trandate": "bad-date", "hours": 2, "isbillable": "T", "employee_name": "A"},
            ],
        )
        import subprocess
        proc = subprocess.run(
            [sys.executable, str(Path(__file__).resolve().parent / "summarize_time_entries.py"), "--file", str(path)],
            capture_output=True, text=True,
        )
        self.assertEqual(proc.returncode, 0)
        self.assertIn("Skipped rows (1)", proc.stdout)


class TestCheckCandidates(unittest.TestCase):
    def write(self, text):
        tmp = tempfile.NamedTemporaryFile(
            mode="w", suffix=".md", delete=False, encoding="utf-8", newline=""
        )
        tmp.write(text)
        tmp.close()
        return Path(tmp.name)

    def test_missing_disposition_is_reported_and_fails(self):
        text = (
            "## Area\n\n"
            "| ID | Candidate | Sources | Disp. |\n"
            "|---|---|---|---|\n"
            "| X-1 | something | S1 |  |\n"
        )
        rows = cc.parse_candidates(text)
        analysis = cc.analyze(rows)
        self.assertEqual(len(analysis["no_disposition"]), 1)
        self.assertTrue(cc.has_failures(analysis))

    def test_drop_with_no_reason_fails_drop_with_reason_does_not(self):
        text = (
            "## Area\n\n"
            "| ID | Candidate | Sources | Disp. |\n"
            "|---|---|---|---|\n"
            "| X-1 | bare drop | S1 | DROP |\n"
            "| X-2 | explained drop | S1 | DROP (superseded by X-1) |\n"
        )
        rows = cc.parse_candidates(text)
        analysis = cc.analyze(rows)
        dropped_ids = {r["id"] for r in analysis["drop_no_reason"]}
        self.assertEqual(dropped_ids, {"X-1"})
        self.assertTrue(cc.has_failures(analysis))

    def test_multi_disposition_is_reported_but_not_a_failure(self):
        text = (
            "## Area\n\n"
            "| ID | Candidate | Sources | Disp. |\n"
            "|---|---|---|---|\n"
            "| X-1 | combo | S1 | WI + CLIENT (screen) |\n"
        )
        rows = cc.parse_candidates(text)
        analysis = cc.analyze(rows)
        self.assertEqual(len(analysis["multi_disposition"]), 1)
        self.assertFalse(cc.has_failures(analysis))

    def test_duplicate_ids_detected(self):
        text = (
            "## Area\n\n"
            "| ID | Candidate | Sources | Disp. |\n"
            "|---|---|---|---|\n"
            "| X-1 | one | S1 | WI |\n"
            "| X-1 | again | S1 | FF |\n"
        )
        rows = cc.parse_candidates(text)
        analysis = cc.analyze(rows)
        self.assertEqual(len(analysis["duplicate_ids"]), 1)
        self.assertTrue(cc.has_failures(analysis))

    def test_decision_register_table_is_skipped_not_misread(self):
        text = (
            "## Decisions needed\n\n"
            "| ID | Decision | Sources | Owner |\n"
            "|---|---|---|---|\n"
            "| DEC-1 | pick a module | S1 | Rod |\n"
        )
        rows = cc.parse_candidates(text)
        self.assertEqual(rows, [])

    def test_clean_register_passes(self):
        text = (
            "## Area\n\n"
            "| ID | Candidate | Sources | Disp. |\n"
            "|---|---|---|---|\n"
            "| X-1 | ok | S1 | WI |\n"
            "| X-2 | also ok | S1 | FF |\n"
        )
        rows = cc.parse_candidates(text)
        analysis = cc.analyze(rows)
        self.assertFalse(cc.has_failures(analysis))
        self.assertEqual(analysis["total"], 2)


class TestCheckCrossrefs(unittest.TestCase):
    def write(self, text):
        tmp = tempfile.NamedTemporaryFile(
            mode="w", suffix=".md", delete=False, encoding="utf-8", newline=""
        )
        tmp.write(text)
        tmp.close()
        return Path(tmp.name)

    def test_slugify_matches_render_docx_convention(self):
        # bm_ prefix, punctuation collapsed to single underscores, trimmed.
        self.assertEqual(ccr.slugify("OC-1 title"), "bm_oc_1_title")
        self.assertEqual(ccr.slugify("oc-1-title"), "bm_oc_1_title")

    def test_valid_link_resolves(self):
        text = "#### OC-1 title\n\nSee [OC-1](#oc-1-title) for detail.\n"
        doc = ccr.load_doc(self.write(text))
        broken = ccr.check_links(doc)
        self.assertEqual(broken, [])

    def test_broken_link_is_reported(self):
        text = "#### OC-1 title\n\nSee [OC-2](#oc-2-title) for detail.\n"
        doc = ccr.load_doc(self.write(text))
        broken = ccr.check_links(doc)
        self.assertEqual(len(broken), 1)
        self.assertEqual(broken[0]["resolved"], "bm_oc_2_title")

    def test_deck_id_missing_from_assessment_fails_one_directional(self):
        deck_path = self.write("## Slide\n\nWe will fix R2R-1 and R2R-99.\n")
        assessment_path = self.write("## Tasks\n\n**R2R-1** is documented here.\n")
        deck = ccr.load_doc(deck_path)
        assessment = ccr.load_doc(assessment_path)
        check = ccr.check_ids("deck", deck, "assessment", assessment, bidirectional=False)
        self.assertIn("R2R-99", check["only_in_a"])
        self.assertTrue(check["fail_a"])
        # assessment covers more than the deck; that is expected, not a failure.
        self.assertFalse(check["fail_b"])

    def test_plan_assessment_mismatch_fails_both_directions(self):
        plan_path = self.write("## Tasks\n\n**SETUP-1** build steps.\n")
        assessment_path = self.write("## Tasks\n\n**SETUP-1** and **SETUP-2** documented.\n")
        plan = ccr.load_doc(plan_path)
        assessment = ccr.load_doc(assessment_path)
        check = ccr.check_ids("plan", plan, "assessment", assessment, bidirectional=True)
        self.assertIn("SETUP-2", check["only_in_b"])
        self.assertTrue(check["fail_b"])

    def test_headline_number_warning_not_a_failure(self):
        deck_path = self.write("## Slide\n\nSaves 40 hours a week.\n")
        assessment_path = self.write("## Tasks\n\nNo hour figures here.\n")
        deck = ccr.load_doc(deck_path)
        assessment = ccr.load_doc(assessment_path)
        result = ccr.build_report({"deck": deck, "assessment": assessment})
        self.assertTrue(result["headline_number_warnings"])
        self.assertFalse(ccr.has_failures(result))


class TestParseValidateLog(unittest.TestCase):
    def test_three_sample_lines(self):
        text = (
            "Validate manifest -- Success\n"
            "Line No. 13 - Error Message: bad attribute\n"
            "Line No. 1 - Warning Message: deprecated element\n"
        )
        records, unparsed = pvl.parse_lines(text)
        severities = [r["severity"] for r in records]
        self.assertEqual(severities, ["INFO", "ERROR", "WARNING"])
        self.assertEqual(unparsed, [])

    def test_unparsed_line_is_kept_not_dropped(self):
        text = "this is not a recognized validate line\n"
        records, unparsed = pvl.parse_lines(text)
        self.assertEqual(records, [])
        self.assertEqual(len(unparsed), 1)

    def test_object_id_context_attaches_to_following_line_no(self):
        text = "ObjectId: customscript_x\nLine No. 5 - Error Message: oops\n"
        records, unparsed = pvl.parse_lines(text)
        self.assertEqual(records[0]["file"], "customscript_x")

    def test_summary_counts(self):
        records = [
            {"severity": "ERROR", "file": "a.xml", "line": "1", "message": "m"},
            {"severity": "ERROR", "file": "b.xml", "line": "2", "message": "m"},
            {"severity": "WARNING", "file": "a.xml", "line": "3", "message": "m"},
        ]
        summary = pvl.summarize(records)
        self.assertEqual(summary["by_severity"]["ERROR"], 2)
        self.assertEqual(summary["by_file"]["a.xml"], 2)

    def test_json_input_shape_is_recognized(self):
        payload = json.dumps({"messages": [{"type": "ERROR", "file": "x.xml", "line": 4, "message": "bad"}]})
        records = pvl.parse_json(payload)
        self.assertIsNotNone(records)
        self.assertEqual(records[0]["severity"], "ERROR")

    def test_non_validate_json_falls_back_to_none(self):
        payload = json.dumps({"unrelated": "shape"})
        records = pvl.parse_json(payload)
        self.assertIsNone(records)


if __name__ == "__main__":
    unittest.main(verbosity=2)
