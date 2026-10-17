---
name: transcribe
description: Turn a client-provided recording (video or audio) in source/ into a speaker-labeled transcript in working/transcripts/, via the shared transcribe.py script and AssemblyAI. Use when the user says "transcribe this recording", "there's only a video / audio file", "turn the call recording into a transcript", or when any skill's source inventory finds a recording with no matching transcript. This skill only produces the transcript; it does not summarize or mine it, and hands back to the skill that needed it (usually rapid-assessment stage 02). v0.1, DRAFT 2026-09-03 pending Mike's review and the first live run.
---

# Transcribe

One job: a recording in `source/` becomes a transcript Claude can read, with speaker turns and timestamps, in `working/transcripts/`. Everything else about the recording (what it means, what to mine from it) belongs to the calling skill.

The work is done by `../.claude/scripts/transcribe.py`, a stdlib-only script that uploads the file to AssemblyAI, waits for the diarized transcript, writes two files, and purges the vendor copy. It is hosted on purpose: consultants run the OS on very different laptops, and a hosted call gives the same result on all of them with no GPU, no model download, and no ffmpeg. Details, flags, and output format are in the script docstring (`--help`).

Three rules from `../DATA_CONNECTORS.md` govern this skill: the key is per-machine and never on the shared Drive (rule 1), consent is a record in CONTEXT.md before anything is uploaded (rule 3), and `source/` is read-only, so transcripts land in `working/transcripts/` and never beside the recording.

## Procedure

### 1. Inventory

List recordings in `source/` and one level of subfolders (a `Recordings/` folder is common). Recording types: mp4, m4a, mp3, wav, mov, webm, mkv, aac, ogg, flac, wma, avi. For each one, check whether a transcript already exists: `working/transcripts/{stem}.md`, or a same-stem `.txt / .md / .docx / .vtt / .srt` beside it in `source/` (the client supplied one). The script does this check itself; `--dry-run` prints the result:

```powershell
python "../.claude/scripts/transcribe.py" --dry-run
```

Report the list in one or two lines. If nothing needs transcribing, say so and stop.

### 2. Consent gate

Open CONTEXT.md and look for the transcription line under `## Access & consent`:

```
- Recording transcription (AssemblyAI): approved by {name} on {date}
```

If it is missing, **stop before uploading anything.** Tell the consultant that AssemblyAI is a sub-processor of the client's audio, that the access & consent pack's Block 1 already carries the disclosure sentence, and that approval has to be logged first. Offer the CONTEXT.md line above for them to fill once the client has approved. Do not proceed on "they'll be fine with it." If the line reads `n-a` or `declined`, transcription is off the table for this client; say so and hand back.

### 3. Key check

The dry run in step 1 also prints whether `ASSEMBLYAI_API_KEY` is set on this machine. If it is not, point the consultant at `../ONBOARDING.md` section 1.6 (AssemblyAI account with free credit, then one user environment variable) and stop. A new terminal is needed after setting it.

### 4. Run

```powershell
python "../.claude/scripts/transcribe.py"                            # everything queued in the dry run
python "../.claude/scripts/transcribe.py" "source/Kickoff call.mp4"  # one file
```

Use PowerShell and quote paths (the workspace path has spaces). Transcription takes a few minutes per hour of audio; the script prints status lines while it waits. Let it finish. Do not re-run a job that is still polling, and do not pass `--force` unless the consultant asked for a re-transcription, since every run is billed per minute of audio.

Outputs per recording: `working/transcripts/{stem}.md` (the transcript) and `{stem}.json` (the raw response, kept so the markdown can be re-cut without paying for the audio again). The `.md` header records the source file, duration, date, transcript id, and whether the vendor copy was purged.

If the script exits non-zero, read its stderr. A `FAILED:` line names the file and the vendor's error; a config exit (code 2) names the missing key or path. Fix and re-run; do not work around the script with a manual upload.

### 5. Speaker map

The transcript labels speakers A, B, C. Read it and propose who each letter is, from self-introductions, people being addressed by name, and the attendee list in CONTEXT.md or the meeting invite. Put the proposal to the consultant in one message, one line per speaker, and ask them to confirm or correct.

Once confirmed, replace the `Speaker map: unconfirmed (...)` header line in the `.md` with the confirmed map, for example:

```
- Speaker map: A = Jane Doe (client, Controller); B = {consultant} (Power Cloud); C = unidentified
```

Leave a letter unmapped rather than guessing. Stage 02 of rapid-assessment already treats attribution on group calls as approximate, and a wrong name on a quote is worse than a letter.

### 6. Record and hand back

Add one line to CONTEXT.md, under the source-material notes if there are any or under `## Key decisions` otherwise:

```
- Transcribed source/{file} to working/transcripts/{stem}.md on {date} (AssemblyAI, remote copy purged, speaker map confirmed by {name} / unconfirmed)
```

Then return to the calling skill. For rapid-assessment, the transcript is mined from `working/transcripts/` exactly like a transcript in `source/`, with the same source-integrity check first.

## What this skill does not do

- It does not summarize, extract decisions, or build evidence. That is stage 02.
- It does not transcribe anything for a client whose consent is not logged, and it does not run a local model as a way around that.
- It does not move or rename anything in `source/`.

## Cost and vendor notes

AssemblyAI bills per minute of audio (well under a dollar per hour of recording with speaker labels); a signup carries free credit that covers ordinary occasional use. Audio and transcript are deleted from the vendor by the script as soon as the local copies are written; `--keep-remote` exists for debugging and should not be used on client material. Rates and retention terms belong in `../CAPABILITIES.md` once verified, not here.

## Governance

Shared skill, so A3 applies: it lives here and nowhere else, changes get a dated line in `../CHANGELOG.md`, and no client specifics get hard-coded into it.
