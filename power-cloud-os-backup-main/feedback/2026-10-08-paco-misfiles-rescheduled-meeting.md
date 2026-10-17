---
date: 2026-10-08
from: imran
source: SHINESTY
area: Paco meeting filer (PACO.md)
type: bug
cost: 5m
blocking: no
frequency: first-time
class: n-a
autonomy: n-a
status: new
---

## What happened
[Verified] A recurring weekly session (Tue 10/6, 12:00 CT) was adjourned after 4 minutes and rescheduled to Wed 10/7, 15:00 CT. Paco filed the 10/6 Gemini notes and recording into `SHINESTY/source/` under a 10/7 filename (`2026-10-07 Shinesty - PC Weekly working session [1a4ef43da8] - notes [f158e5].md`; content dated Oct 6), and `working/meetings_log.md` lists a 2026-10-07T15:00 entry whose calendar event instance is `..._20261006T170000Z` and which points at the 10/6 recording and notes. The actual 10/7 15:00 CDT "Notes by Gemini" doc (in imran@'s Drive) was never filed. Likely cause: the rescheduled instance kept the original instance ID, and Paco matched artifacts by instance rather than by the meeting that actually occurred at the new time.

## What I did instead
Found the 10/7 notes in Drive by title and read them directly. Anyone trusting `source/` would have read the wrong meeting.

## Suggested fix
- [Reported] Imran: not sure.
- [Inferred] Claude: when an event instance has been moved, file the artifacts whose Meet conference time matches the new start time (or file both, labeled by actual date), and log a warning in `meetings_log.md` when an instance's original and actual dates differ.

## Disposition
