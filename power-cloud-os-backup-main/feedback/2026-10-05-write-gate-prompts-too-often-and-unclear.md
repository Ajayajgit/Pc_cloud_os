---
date: 2026-10-05
from: julie
source: MH Crane
area: .claude/hooks/pc_hooks.py ns_write_gate (NetSuite production write guardrail)
type: friction
cost: -
blocking: no
frequency: every-time
class: in-the-way
autonomy: n-a
status: shipped
---

## What happened
[Verified] During a Julie-approved production load of about 95 list-record updates and 9 record creates (item naming codes and configuration, session b2eec997, 2026-10-02 to 2026-10-05), the write guardrail's approval pop-up appeared multiple times again. The approval is scoped per environment, record type and create/update combination for about 2 hours, so one approved task spanning six list record types and two new record types produced a separate prompt for each combination. The same behavior was reported in an earlier MH Crane session, where parallel write streams were also treated as new approvals.

[Reported] Julie: the pop-up text reads like code, so it is not clear what is being approved. The result is that she clicks "allow once" every time without reading it, which defeats the purpose of the gate.

## What I did instead
Clicked "allow once" on every prompt so the approved load could finish.

## Suggested fix
- [Reported] Julie: allow any add or update of any record type once per day, rather than once every 2 hours per environment, record type and create/update combination. Make the pop-up plain English so the user can see what they are approving.
- [Inferred] Claude: the production write gate is a deliberate hard rule (CLAUDE.md: "a NetSuite production data-write prompts"), so any fix has to keep a real human approval for production writes. Options that keep it while cutting the noise:
  1. **Approve the task, not the record type:** one prompt per declared batch, worded in plain English (for example "Update 95 list values on 6 lists in MH Crane production: Wire Rope Hoist codes. Approved in chat by Julie."), covering every record type in that batch for the session.
  2. **Key the approval to the session and environment,** not to each stream, record type or operation, so parallel calls and mixed create/update do not count as new approvals.
  3. Julie's daily window, with the prompt naming the client, environment, and a plain description of the writes, so one considered approval replaces many blind ones.
- [Inferred] Claude: whichever option, the prompt text itself needs rewriting. A gate the user approves without reading gives no protection, so clarity is part of the safety, not just comfort.

## Disposition

**2026-10-06, shipped (Claude Code, OS-root session with Mike).** Gate v5. Julie's once-per-day proposal landed as a sliding 24-hour approval per session per connection, covering creates and updates of every record type from the main conversation and every agent, so one considered approval replaces the stream of blind ones. Deletes keep a separate once-per-session approval (Mike's call: never per record, but a session's first delete still gets a human look). The prompt now reads in plain English and leads with what is being approved ("Approve creates and updates on NetSuite PRODUCTION, MH Crane for this session? First one: Create a 'bom' record (...)"). Codex reviewed the change; its real findings were adopted (fail-to-ask on any hook error or slow scan, no sandbox inferred from a connector's name, strict evidence matching, no future-dated proof). Root cause of the parallel-agent storm recorded in CAPABILITIES.md (2026-10-06): each agent has its own transcript, so the old gate could not see another agent's approval. Auto mode remains a separate layer; import sessions should run in the default permission mode. Tests: `.claude/hooks/test_write_gate.py`.
