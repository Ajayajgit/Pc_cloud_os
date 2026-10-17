---
date: 2026-09-17
from: justin
source: internal
area: os / scheduled-tasks tool
type: bug
cost: "-"
blocking: no
frequency: every-time
class: wrong
autonomy: n-a
status: new
---

## What happened
[Verified] The `scheduled-tasks` MCP tool (`create_scheduled_task` / `update_scheduled_task`) has no working-directory or `cwd` parameter in its schema. The only place a scheduled task can state which client folder it belongs to is a "Working directory: X" line of prose inside its own `SKILL.md` prompt — there is no mechanism that actually launches the session rooted in that folder.

Confirmed via the `upward-projects-exec-summary-draft` scheduled task's run on 2026-09-14, discovered in a follow-up session on 2026-09-17: the task fired and its prompt correctly named `H:\Shared drives\Power Cloud OS\Upward Projects` as the working directory, but the session's actual OS-level `cwd` (confirmed with `pwd`) was `H:\Shared drives\Power Cloud OS\Brixton`, and Brixton's `CLAUDE.md` (not Upward Projects') was the one re-read into context at session start. The five per-client exec-summary tasks that fired that day (Brixton, Upward Projects, Teppermans, American Barbell, 44 Pro) all show `lastRunAt` timestamps within seconds of each other, consistent with all five running from the same underlying session/cwd context regardless of which client's task fired.

Impact: `../CLAUDE.md` documents that the per-client render gate (`.claude/settings.json`) loads "from the folder the session started in" and does not look at parent/sibling folders. So every scheduled run currently has the WRONG client's settings.json in effect (whichever client happens to be the session's real starting folder), not the settings.json of the client the task is actually for. This particular run stayed read-only / internal-draft-only by design (the task's own hard-stop instructions) and used fully-qualified absolute paths for every file operation, so nothing was written to or read from the wrong client's files. But nothing in the tool architecture guarantees that outcome — it depends entirely on the prompt reliably using absolute paths every time, and on the task never needing folder-scoped settings (like the render gate) to behave correctly. The moment a scheduled task's scope grows to include a client-facing render, this becomes a live risk rather than a theoretical one.

## What I did instead
Hardened all five existing scheduled-task `SKILL.md` prompts (Brixton, Upward Projects, Teppermans, American Barbell, 44 Pro) with an explicit warning that the session's actual `cwd` cannot be trusted to match the intended client, an instruction to use only fully-qualified absolute paths for every file operation, and an explicit block on ever using ambient `.claude/settings.json` (the render gate) for a client-facing render from within a scheduled run — that must wait for an interactive session confirmed to be rooted in the correct folder. Did not attempt to change the scheduled-tasks tool itself; no such control exists to change.

## Suggested fix
- [Reported] Justin: log it and hardened the existing tasks in the meantime; no immediate fix requested beyond that.
- [Inferred] Claude: (a) add a real `cwd`/working-directory parameter to `create_scheduled_task`/`update_scheduled_task` so a task actually launches rooted in its intended folder, closing this at the source; or (b) short of that, the scheduled-tasks harness could at least surface the session's actual starting directory prominently at the top of context (it already does, via the Environment block) and the product should treat "task prompt names one folder, environment block names another" as a detectable, flaggable mismatch rather than something only caught by a human reading closely.

## Disposition

