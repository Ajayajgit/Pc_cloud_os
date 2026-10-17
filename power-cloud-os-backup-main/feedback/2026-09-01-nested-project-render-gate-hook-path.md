---
date: 2026-09-01
from: justin
source: GW
area: templates/client-record (.claude/settings.json render_gate hook)
type: bug
cost: -
blocking: no
frequency: every-time
class: wrong
autonomy: n-a
status: shipped
---

## What happened
[Verified] Stamped `GW/Monthly Sales Reporting/` as a nested custom-project folder from `templates/client-record/`. The template's `.claude/settings.json` PreToolUse Bash hook runs `python "../.claude/hooks/render_gate.py"`, which is correct for a client root folder (one level below the Power Cloud OS root) but wrong one level deeper for a nested custom-project folder — it needs an extra `../` to reach the OS root's `.claude/hooks/`. I hand-edited the nested settings.json to `../../.claude/hooks/render_gate.py`, but Bash calls inside that folder still threw errors trying to open a path like `GW\Monthly Sales Reporting\.claude\hooks\render_gate.py`. Resolution appears to depend on the Bash tool's current shell cwd at the moment the hook fires (which can drift via `cd` inside a session), not purely on the settings.json's own relative path — so a fixed `../../` isn't reliably correct either. Not blocking: worked around it for the rest of the session by using Glob/Read instead of Bash in that folder.

## What I did instead
Avoided the Bash tool inside the nested project folder for the remainder of the session; used Glob and Read instead.

## Second occurrence (2026-09-14, Bixbi, Claude Code session with Mike)

[Verified] Hit again, this time in a **client root** folder rather than a nested project, which
confirms this entry's own diagnosis that the trigger is shell cwd drift and not the settings.json
path depth. A single `cd "…/Bixbi/working"` inside a Bash call persisted (the Bash tool keeps its
working directory between calls), so the hook's relative `../.claude/hooks/render_gate.py` resolved
to `Bixbi/.claude/hooks/` and every subsequent Bash call failed on the PreToolUse hook, **including
the `cd` needed to undo it.** Escaped via the PowerShell tool, which carries its own working
directory: `Set-Location` back to the client root restored it.

Cost roughly 5 minutes. Frequency bumped `first-time` to `sometimes` on this second sighting.

Workaround for a session: never `cd` into a subfolder; run everything from the client folder root
with relative paths (`working/foo.json`). If it happens anyway, `Set-Location` from the PowerShell
tool is the way out.

[Inferred] A fix that does not depend on cwd at all: resolve the hook path against the settings
file's own location rather than the shell's, or write an absolute path at stamp time. Either
removes both the nested-folder case and the cwd-drift case.

## Third occurrence (2026-09-17, Teppermans, session with Ron)

[Verified] Hit again, with a **new trigger that the existing workaround does not cover**. Nobody ran
`cd`. The session was started from the wrong client folder (`Bomb Party`), and moved to
`Teppermans/Directed Putaway & AsIs Segregation` with the directory-change tool. The move succeeded,
but the hook loaded at session start stayed loaded, and its relative `../.claude/hooks/render_gate.py`
then resolved against the new, two-levels-deeper cwd to `Teppermans/.claude/hooks/`. Every Bash call
in the session failed from that point. The call that tripped it was a heredoc writing a CONTEXT.md,
not a render.

This matters because the standing workaround in this entry is "never `cd` into a subfolder," and that
is no longer sufficient: a supported, one-call directory change breaks it with no `cd` involved and
no way to undo it in-session. Escaped the same way Mike did, via the PowerShell tool, and used
Write/Edit for file creation since the matcher is Bash-only. Cost roughly 5 minutes. Frequency bumped
`sometimes` to `every-time`: with this trigger the failure is deterministic, not occasional.

[Verified] Confirmed the self-heal: once the session's working directory settled in the new folder,
its own `.claude/settings.json` (with the correct `../../`) loaded and Bash worked normally again.

[Inferred] Adds nothing to Justin's diagnosis, which was already right, but it does raise the
priority: this is now three sightings across three clients (GW, Bixbi, Teppermans) and three
different people. A fourth option worth considering alongside the two below, as a cheap cap on blast
radius rather than a cause fix: have `render_gate.py` exit clean when it cannot locate itself, so a
misresolved path degrades to "gate did not run" instead of "Bash is dead for the session."

## Suggested fix
- [Reported] Justin: make the hook cwd-independent — resolve `render_gate.py`'s path relative to the settings.json file's own location rather than the shell's current working directory, so it works at any folder depth without per-folder edits.
- [Inferred] Claude: alternative — have the new-engagement/custom-project skill's folder-stamping step compute and write the correct number of `../` segments based on actual folder depth at stamp time, rather than copying the template's hook command verbatim.

## Disposition

**2026-09-21, shipped (Claude Code, session with Mike).** Justin's diagnosis was right and the fix
took his first option, generalized: every hook entry in the client stamp now runs a one-line launcher
that walks up from `CLAUDE_PROJECT_DIR` (the folder the session started in, which never drifts) to the
folder holding `.claude/hooks/pc_hooks.py`, then dispatches by hook name. Depth no longer matters, a
`cd` inside a Bash call no longer matters, and a mid-session directory change no longer matters. If no
OS root is found above the session folder the launcher exits 0 and the gate simply does not run, which
is the fourth option raised on 2026-09-17 (degrade to "gate did not run", never "Bash is dead"). All 50
client and nested-project folders were re-stamped. Tested from three levels deep and from outside the
OS (`.claude/hooks/test_hooks.py`). The same change carried three more gates into the stamp (scope,
escalation, NetSuite write guardrail); see `CAPABILITIES.md`, "Subagents and model routing".
