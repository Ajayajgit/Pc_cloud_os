# -*- coding: utf-8 -*-
"""Transcribe a client recording into a speaker-labeled transcript in working/transcripts/.

WHY THIS EXISTS
---------------
Occasionally a client hands over a call recording (video or audio) and no transcript.
Claude cannot read audio or video, so without this the assessment stalls until a human
transcribes. This script turns the recording into a diarized markdown transcript that
the rapid-assessment skill can mine like any other file in `source/`.

It calls a hosted speech-to-text API (AssemblyAI) rather than a local model on purpose:
the OS runs on every consultant's laptop, hardware varies, and a hosted call produces
the same output on every machine with no GPU, no model download, and no ffmpeg. The
file is uploaded as-is (common video and audio formats are accepted directly, up to
2.2 GB or 10 hours per file).

The vendor copy is purged. After both output files are written, the script issues a
DELETE for the transcript, which removes the transcript and the uploaded audio from the
vendor immediately. Only billing metadata (id, duration) stays on their side. Pass
`--keep-remote` to skip the purge, for debugging only.

CREDENTIALS NEVER LIVE ON THE SHARED DRIVE (DATA_CONNECTORS.md rule 1). The key comes
from one environment variable on the machine running the transcription:

    ASSEMBLYAI_API_KEY      per consultant; set up per ONBOARDING.md section 1.6

CONSENT IS A RECORD (DATA_CONNECTORS.md rule 3). AssemblyAI is a sub-processor. The
client's approval of the AI disclosure that names it (access & consent pack, Block 1)
is logged in the client's CONTEXT.md before the first upload. The `transcribe` skill
enforces that gate; this script does not, so do not run it around the skill for a
client whose consent is not logged.

Usage, from the client folder:

    python "../.claude/scripts/transcribe.py" --dry-run                 # list recordings, check the key, write nothing
    python "../.claude/scripts/transcribe.py"                           # every recording in source/ without a transcript
    python "../.claude/scripts/transcribe.py" "source/Kickoff call.mp4" # one file
    python "../.claude/scripts/transcribe.py" --force                   # re-transcribe even if outputs exist
    python "../.claude/scripts/transcribe.py" --language en             # skip language detection

WHAT IT WRITES
--------------
Two files per recording in `working/transcripts/` (created if missing). `source/` is
never touched.

    {stem}.md     the transcript: a provenance header, then one paragraph per speaker
                  turn as `**Speaker A** [hh:mm:ss]`. Consecutive turns by the same
                  speaker within two seconds are merged for readability. The header
                  carries `Speaker map: unconfirmed`; the skill fills it after the
                  consultant confirms who A, B, C are.
    {stem}.json   the raw completed API response, so the markdown can be re-rendered
                  or re-cut later without paying for the audio again.

A recording is skipped when `working/transcripts/{stem}.md` already exists, or when a
transcript with the same stem (.txt, .md, .docx, .vtt, .srt) sits next to it in
`source/`, because then the client already supplied one. `--force` overrides both.

Exit codes: 0 all requested work done, 1 at least one transcription failed,
2 configuration problem (no key, no input, bad path).

STATUS: authored 2026-09-03, not yet run against a live account. First-run
verification is the synthetic two-voice test described in the transcribe skill; log
the result to CAPABILITIES.md either way.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

API = "https://api.assemblyai.com/v2"
KEY_VAR = "ASSEMBLYAI_API_KEY"
PROVIDER = "AssemblyAI"

RECORDING_EXTS = {
    ".mp4", ".m4a", ".mp3", ".wav", ".mov", ".webm", ".mkv",
    ".aac", ".ogg", ".flac", ".wma", ".avi",
}
TRANSCRIPT_EXTS = {".txt", ".md", ".docx", ".vtt", ".srt"}
MERGE_GAP_MS = 2000
DEFAULT_OUT = Path("working") / "transcripts"


# ---------------------------------------------------------------- credentials

def api_key(required=True):
    key = os.environ.get(KEY_VAR, "").strip()
    if not key and required:
        print(
            f"Missing {KEY_VAR} in the environment."
            "\nThe key is per-machine and never stored on the shared drive."
            "\nSet it up per ONBOARDING.md section 1.6 (AssemblyAI account, then a user"
            " environment variable), open a new terminal, and run again."
            "\nWithout it, run with --dry-run to list what would be transcribed.",
            file=sys.stderr,
        )
        sys.exit(2)
    return key


# ------------------------------------------------------------------ discovery

def find_recordings(paths):
    """Recordings under the given files/folders. Folders are searched one level deep."""
    found, problems = [], []
    for raw in paths:
        p = Path(raw)
        if p.is_file():
            if p.suffix.lower() in RECORDING_EXTS:
                found.append(p)
            else:
                problems.append(f"not a recognized recording type: {p}")
        elif p.is_dir():
            for child in sorted(p.iterdir()):
                if child.is_file() and child.suffix.lower() in RECORDING_EXTS:
                    found.append(child)
                elif child.is_dir() and not child.name.startswith("."):
                    for grand in sorted(child.iterdir()):
                        if grand.is_file() and grand.suffix.lower() in RECORDING_EXTS:
                            found.append(grand)
        else:
            problems.append(f"path not found: {p}")
    return found, problems


def skip_reason(rec, out_dir):
    md = out_dir / f"{rec.stem}.md"
    if md.exists():
        return f"already transcribed ({md.as_posix()})"
    for sibling in rec.parent.iterdir():
        if sibling != rec and sibling.stem == rec.stem and sibling.suffix.lower() in TRANSCRIPT_EXTS:
            return f"transcript supplied with the recording ({sibling.name})"
    return None


# ------------------------------------------------------------------------ http

def request(method, url, key, body=None, headers=None, timeout=120):
    hdrs = {"authorization": key}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:500]
        raise RuntimeError(f"{method} {url} -> HTTP {e.code}: {detail}") from None
    except urllib.error.URLError as e:
        raise RuntimeError(f"{method} {url} -> {e.reason}") from None
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except ValueError:
        return {"raw": raw.decode("utf-8", "replace")}


def upload(path, key):
    size = path.stat().st_size
    with path.open("rb") as fh:
        result = request(
            "POST", f"{API}/upload", key, body=fh,
            headers={"content-type": "application/octet-stream", "content-length": str(size)},
            timeout=3600,
        )
    url = result.get("upload_url")
    if not url:
        raise RuntimeError(f"upload returned no upload_url: {result}")
    return url


def create_transcript(upload_url, key, speaker_labels, language):
    body = {"audio_url": upload_url, "speaker_labels": speaker_labels}
    if language:
        body["language_code"] = language
    else:
        body["language_detection"] = True
    result = request(
        "POST", f"{API}/transcript", key,
        body=json.dumps(body).encode("utf-8"),
        headers={"content-type": "application/json"},
    )
    tid = result.get("id")
    if not tid:
        raise RuntimeError(f"transcript request returned no id: {result}")
    return tid


def poll(tid, key, interval, timeout_minutes):
    started = time.time()
    while True:
        result = request("GET", f"{API}/transcript/{tid}", key)
        status = result.get("status")
        elapsed = int(time.time() - started)
        if status == "completed":
            return result
        if status == "error":
            raise RuntimeError(f"transcription failed: {result.get('error')}")
        if elapsed > timeout_minutes * 60:
            raise RuntimeError(f"gave up after {timeout_minutes} min; last status {status}; id {tid}")
        print(f"    {status} ({elapsed}s)", file=sys.stderr)
        time.sleep(interval)


def delete_remote(tid, key):
    try:
        request("DELETE", f"{API}/transcript/{tid}", key)
        return True
    except RuntimeError as e:
        print(f"    warning: could not purge remote copy: {e}", file=sys.stderr)
        return False


# --------------------------------------------------------------------- render

def hms(ms):
    s = int(ms // 1000)
    return f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}"


def merged_turns(utterances):
    turns = []
    for u in utterances:
        if turns and turns[-1]["speaker"] == u["speaker"] and u["start"] - turns[-1]["end"] <= MERGE_GAP_MS:
            turns[-1]["text"] += " " + u["text"].strip()
            turns[-1]["end"] = u["end"]
        else:
            turns.append({"speaker": u["speaker"], "start": u["start"], "end": u["end"], "text": u["text"].strip()})
    return turns


def render_markdown(result, rec, source_label, purged):
    utterances = result.get("utterances") or []
    speakers = sorted({u["speaker"] for u in utterances})
    size_mb = rec.stat().st_size / (1024 * 1024)
    duration = result.get("audio_duration")
    lines = [
        f"# Transcript: {rec.stem}",
        "",
        f"- Source: `{source_label}` ({size_mb:.1f} MB)",
        f"- Duration: {hms(duration * 1000) if duration else 'unknown'}",
        f"- Transcribed: {date.today().isoformat()} by transcribe.py ({PROVIDER}, model {result.get('speech_model') or 'default'}, language {result.get('language_code') or 'auto'})",
        f"- Transcript id: {result.get('id')}; remote copy purged: {'yes' if purged else 'no'}",
    ]
    if utterances:
        lines.append(f"- Speakers detected: {len(speakers)}")
        lines.append("- Speaker map: unconfirmed (" + ", ".join(f"{s} = ?" for s in speakers) + ")")
    else:
        lines.append("- Speakers detected: none (speaker labels were off)")
    lines += [
        "",
        "> Speaker labels are machine-assigned. Attribution on group calls is approximate; confirm the speaker map with the consultant before attaching a name to any client-facing quote. Raw API response alongside as `.json`.",
        "",
        "---",
        "",
    ]
    if utterances:
        for t in merged_turns(utterances):
            lines.append(f"**Speaker {t['speaker']}** [{hms(t['start'])}]")
            lines.append(t["text"])
            lines.append("")
    else:
        lines.append((result.get("text") or "").strip())
        lines.append("")
    return "\n".join(lines)


def source_label(rec):
    try:
        return rec.resolve().relative_to(Path.cwd().resolve()).as_posix()
    except ValueError:
        return rec.name


# ----------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paths", nargs="*", help="recording files or folders (default: source/)")
    ap.add_argument("--out", default=str(DEFAULT_OUT), help="output folder (default working/transcripts)")
    ap.add_argument("--dry-run", action="store_true", help="list candidates and check the key; write nothing")
    ap.add_argument("--force", action="store_true", help="transcribe even if an output or supplied transcript exists")
    ap.add_argument("--keep-remote", action="store_true", help="do not purge the vendor copy afterwards (debugging only)")
    ap.add_argument("--language", default=None, help="language code, e.g. en; default detects automatically")
    ap.add_argument("--no-speaker-labels", action="store_true", help="plain transcript without diarization")
    ap.add_argument("--poll-interval", type=int, default=5, help="seconds between status checks")
    ap.add_argument("--timeout-minutes", type=int, default=90, help="give up waiting after this long")
    args = ap.parse_args()

    paths = args.paths or (["source"] if Path("source").is_dir() else [])
    if not paths:
        print("No input given and no source/ folder here. Run from a client folder or pass a file.", file=sys.stderr)
        return 2

    recordings, problems = find_recordings(paths)
    for p in problems:
        print(f"warning: {p}", file=sys.stderr)
    if not recordings:
        print("No recordings found.")
        return 2 if problems else 0

    out_dir = Path(args.out)
    todo, skipped = [], []
    for rec in recordings:
        reason = None if args.force else skip_reason(rec, out_dir)
        (skipped if reason else todo).append((rec, reason))

    for rec, reason in skipped:
        print(f"skip  {source_label(rec)}: {reason}")
    for rec, _ in todo:
        print(f"queue {source_label(rec)} ({rec.stat().st_size / (1024 * 1024):.1f} MB)")

    if args.dry_run:
        print(f"\n{KEY_VAR}: {'set' if api_key(required=False) else 'NOT SET (see ONBOARDING.md section 1.6)'}")
        print(f"Would write to {out_dir.as_posix()}/. Dry run, nothing written.")
        return 0
    if not todo:
        print("Nothing to do.")
        return 0

    key = api_key()
    out_dir.mkdir(parents=True, exist_ok=True)
    failures = 0
    for rec, _ in todo:
        label = source_label(rec)
        print(f"\n== {label}")
        try:
            print("    uploading", file=sys.stderr)
            upload_url = upload(rec, key)
            tid = create_transcript(upload_url, key, not args.no_speaker_labels, args.language)
            print(f"    transcript {tid} requested", file=sys.stderr)
            result = poll(tid, key, args.poll_interval, args.timeout_minutes)

            json_path = out_dir / f"{rec.stem}.json"
            md_path = out_dir / f"{rec.stem}.md"
            json_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
            purged = False
            if not args.keep_remote and json_path.stat().st_size > 0:
                purged = delete_remote(tid, key)
            md_path.write_text(render_markdown(result, rec, label, purged), encoding="utf-8")

            n_speakers = len({u["speaker"] for u in (result.get("utterances") or [])})
            dur = result.get("audio_duration") or 0
            print(f"    wrote {md_path.as_posix()} ({hms(dur * 1000)}, {n_speakers} speakers, remote purged: {'yes' if purged else 'no'})")
        except (RuntimeError, OSError) as e:
            failures += 1
            print(f"    FAILED: {e}", file=sys.stderr)

    if failures:
        print(f"\n{failures} of {len(todo)} recordings failed.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
