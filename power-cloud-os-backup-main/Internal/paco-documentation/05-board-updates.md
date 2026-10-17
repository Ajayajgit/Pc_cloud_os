# Paco — weekly board updates (exec summary link + tasks needing attention)

Status date: September 14, 2026. **Deployed and live.** Built, deployed to the VPS and posted to its first client the same day (Claude Code session with Mike, over SSH). Timer next fires Monday 2026-09-21 10:00 Eastern. Bixbi and 44 Pro are mapped; 44 Pro is waiting only on Paco being added to its space. Every other client needs the two CONTEXT.md lines (section 7). `.claude/scripts/check_board_mapping.py --all` in the OS workspace reports who is ready.

## 1. Purpose and boundaries

Once a week Paco posts into each mapped client's internal team space:

1. **The executive summary link.** Paco looks in the client's OS folder for this week's summary and links it: the internal draft `working/exec_summary_{YYYY-MM-DD}.md`, and the rendered client-facing `deliverables/{Client}_Executive_Summary_{YYYY-MM-DD}.docx` or `.pdf` when a consultant has produced it. Only files dated within the last seven days count. Paco is the courier, not the author: the customer-exec-summary skill still produces the document and a consultant still reviews it before the client sees it.
2. **Tasks needing attention**, computed from the Asana board: past due, due this week, active but untouched for 14 days, no owner, no due date. Separate message, so it can be acted on in the chat.

This is the third capability behind the Paco identity and follows the reuse contract in `PACO.md` section 7: same outbox and Chat identity, its own configuration and authorization, private by default, destinations only from configuration.

Decisions taken in the build session (Mike confirmed the time, the exec-summary link and the separate attention message on 2026-09-14):

| Decision | Reason |
|---|---|
| Internal team spaces only; never a space with a client in it | Roadmap decision 1: executive summaries are always human-reviewed before a client sees them. An automated post cannot be. The footer of every post states the audience. |
| Destination from the client's CONTEXT.md, gated by a live membership check | Replaced the static allowlist on 2026-09-14. Before every post Paco reads the space membership and refuses unless every person is verified internal staff. A list could not notice a client being added to an approved space later; this can. The human gate is that somebody has to add Paco to the space. |
| Monday 10:00 America/New_York | Mike's call, 2026-09-14. Asana is live data, so the hours-lag rule from the exec summary does not apply; the summary itself has to be in the folder before the run. |
| One post of each kind per client per ISO week | Deterministic outbox IDs; a re-run posts nothing. `--rerun` forces a second post deliberately. |
| Facts deterministic; health read optional and off | Everything in the attention message is computed in Python. `board_health_read: true` adds a Claude paragraph labelled inferred; it fails soft to facts only. |
| Paco links the summary, it does not write it | Generating the five-source summary autonomously is a separate decision (section 9). |
| No writes into client folders | Read-only Drive access. A generated `working/` snapshot is a follow-up. |

## 2. Flow

```text
paco-board.timer (Mon 10:00 ET, Persistent=true)
  → meeting_ingest.paco_board.run
      → read paco-state/client-index.json (rebuilt by paco-scan every ~15 min)
      → if the Asana token file is missing: one private note to board_admin, stop
      → for each record with asana_project AND chat_space (deduplicated by the pair):
            Asana REST: project, sections, all tasks (paged, 100 per page)
            review()           deterministic facts
            find_summaries()   Drive: newest exec summary in working/ and deliverables/ dated this week
            render_summary()   link message (only when a summary exists)
            render_attention() tasks-needing-attention message, trimmed to fit 4,000 characters
            audit_audience()   refuse unless every person in the space is verified internal staff
      → wait for the ledger lock (the Chat worker holds it during its blocking pull), then:
            queue()        INSERT one paco_outbox row per message per client per run key
            notify_admin() one private DM to board_admin listing holds and errors, if any
  → paco-chat (existing, every ~10 s plus a blocking pull of up to 40 s) flushes the outbox as Paco
```

Outbox ID prefixes: `client-board-summary-` (link message), `client-board-` (attention message), `client-board-admin-` (private note). The worker (`paco_worker.py`) keeps only the `enable_board_delivery` pause switch for the first two, because the audience check that matters already ran at queue time. It delivers each board row inside a per-row guard: a failure leaves the row unsent and the loop continues. That guard is load-bearing. Before it existed, one undeliverable board row would have raised out of the flush loop and blocked meeting filing and the Monday dashboard behind it, silently and indefinitely. Anything left unsent is reported by the next weekly run. Other row types still raise on purpose, and admin notes take the normal allowlisted-DM path.

The Drive lookup uses the same delegated read-only session the index builder uses (`survey-config.json`: key, subject, allowed organizers). If Drive is unreachable the attention message still posts, with its "no executive summary dated this week" line, and the admin note names the failure.

## 3. What the messages contain

**Link message** (only when at least one summary dated within seven days exists):

```
*{Client} executive summary · week of {Monday}*
Internal draft: <link|exec_summary_2026-09-14.md>
Client-facing render: <link|{Client}_Executive_Summary_2026-09-14.docx>

_The internal draft is the full picture, hours and all. The client-facing version goes out only after a consultant reviews it._
```

**Attention message**, lists capped and trimmed until the text fits:

- Header: client folder name, ISO week start; project link, open and done counts with percent complete, number closed this week, age of the current status update (flagged stale past 14 days, or "no status update on the project").
- **Past due**: open tasks due before today (Eastern), owner, due date, days over.
- **Due this week**: open tasks due today through +7 days.
- **In progress but untouched 14+ days**: open tasks whose `modified_at` is older than 14 days and whose section name contains none of: backlog, done, complete, closed, with client, waiting, blocked, on hold, deferred, released.
- **Hygiene**: counts of open tasks with no owner and with no due date, pointing at `ASANA_CONVENTIONS.md`.
- "Nothing on the board needs attention this week." when all four are empty.
- **Thin data**: named when the board is empty, no status update has ever been posted or the last is over 30 days old, or most open tasks are unowned or undated.
- **Health read (Paco, inferred)**: only with `board_health_read: true`. System prompt in `paco_board.SYSTEM_PROMPT`.
- "_No executive summary dated this week in working/ yet._" when the link message was not posted.
- Footer: read time, "Internal team view, not for the client", and that Paco does not read replies in the space.

Completed work and the open-by-stage breakdown are computed but not posted; they belong in the summary.

## 4. Source and tests

Local development area (not a git repository):

```text
C:\Development\projects\Netsuite Development\Power Cloud NS\Monday Morning\meeting_ingest\
  paco_board.py            new: AsanaReader, review, find_summaries, render_summary, render_attention, narrative, acquire_ledger, queue, notify_admin, targets, run, CLI
  core.py                  changed: asana_project_gid(), chat_space_name(); client_record() gains asana_project and chat_space
  paco_worker.py           changed: board_destination_allowed(); board rows gated and skipped, not raised
  test_paco_board.py       new: 29 tests
  deploy/paco-board.service, deploy/paco-board.timer
```

Suite: **144 tests**, green on Python 3.13 locally and Python 3.10 on the VPS (2026-09-14). Run from the package parent exactly as the operations file says (`-t .` matters):

```bash
cd /opt/powercloud-meeting-ingest
venv/bin/python -m unittest discover -s meeting_ingest -t . -p 'test*.py'
```

Deployed copies live in `/opt/powercloud-meeting-ingest/meeting_ingest/` and `/etc/systemd/system/paco-board.*`; the files as shipped are also kept under `/opt/powercloud-meeting-ingest/incoming-board/` with the deploy script that installed them.

## 5. Configuration

Keys added to `/etc/powercloud/meeting-ingest/paco-config.json` on 2026-09-14 (backup `paco-config.json.before-board-{timestamp}` beside it):

| Key | Live value | Meaning |
|---|---|---|
| `enable_board_delivery` | `true` | Master switch. `false` stops queueing and leaves any already-queued board rows unsent. |
| `board_internal_domain_id` | `3hq9vy0` | The Workspace domain ID every member of a space must carry, checked alongside the `affiliation` flag. Omit it and the affiliation flag is the only signal. Replaced `board_spaces`, which was removed 2026-09-14. |
| `board_admin` | Mike | Email (must also be in `allowed_users`) whose private DM receives one note per run listing holds and errors. |
| `asana_token_path` | `/etc/powercloud/meeting-ingest/asana-token` | File holding the Asana personal access token. Created 2026-09-14, mode 600, authenticating as Mike. |
| `anthropic_key_path` | `/etc/powercloud/meeting-ingest/anthropic.key` | Created 2026-09-14 from the dashboard config, mode 600. Only used when the health read is on. |
| `board_model` | `claude-opus-5` | Health-read model. |
| `board_effort` | `medium` | Health-read effort: low, medium, high, xhigh, max. |
| `board_health_read` | `false` | Adds the Claude paragraph to the attention message when `true`. |

Existing keys the capability reuses: `database`, `index_path`, `survey_config` (Drive lookup identity), `allowed_users`, `chat_key_path` (through the worker).

Client-side mapping, per client, in the Operating context block of `{Client}/CONTEXT.md`:

```markdown
- Asana project: https://app.asana.com/1/89396020630874/project/1209498416538424
- Project chat: https://chat.google.com/room/AAQAxxxxxxx
```

Accepted shapes: the `/1/{workspace}/project/{gid}` URL with or without a `/board/...` suffix, the legacy `/0/{gid}/...` URL, or a markdown link around either; for the space, a `chat.google.com/room/{id}` URL, a Gmail-embedded `#chat/space/{id}` URL, or bare `spaces/{id}`. Placeholders in braces, `none`, `n/a`, `tbd` are ignored. Two distinct values on either line means the client is skipped (a hold, not a guess). Only the `- Asana project:` line is read; a `- Task tracking:` line (American Barbell) is not, and needs renaming or duplicating.

## 6. Credentials and dependencies

- **Asana personal access token.** Done: created 2026-09-14 from the Asana developer console (`https://app.asana.com/0/my-apps`, the personal access tokens area, not the create-an-app flow, which yields an OAuth client ID and secret instead and is not what Paco uses). Stored at `/etc/powercloud/meeting-ingest/asana-token`, mode 0600, root-owned, one line. **It authenticates as Mike and therefore inherits Mike's Asana access**, which is why two projects are currently invisible (section 9). Asana tokens do not expire on a schedule but die with the account, so this is a personal dependency: replace it with a service login when one exists.
- **Anthropic API key.** Done: copied from `/root/monday-dashboard/config.json` into `/etc/powercloud/meeting-ingest/anthropic.key` by the deploy script, never printed. Same rotation ownership as the dashboard's key.
- **Python packages.** `anthropic` 1.5.0 installed in the Paco venv; `requests` was already present through `google-auth[requests]`. `requirements.txt` on the box gained the `anthropic` line.
- Never place either credential on the shared drive, in a ticket, or in Chat.

## 7. Turning on a client (the first one is done)

Bixbi was turned on this way on 2026-09-14 and posted live. For each further client:

1. Confirm the Asana token can read that client's project (section 9 lists the two that currently fail):

```bash
cd /opt/powercloud-meeting-ingest
venv/bin/python -m meeting_ingest.paco_board --config /etc/powercloud/meeting-ingest/paco-config.json --dry-run
```

   An unmapped client prints nothing; a project the token cannot see prints its Asana error.

2. Identify or create the client's **internal** team space and add Paco to it in Google Chat: open the space, click its name, apps and integrations, add apps, search Paco. That is the whole gate. There is no allowlist to edit any more, because Paco reads the membership itself before every post and refuses if anyone in the space is not verified Power Cloud staff. To see what it will decide, before Monday does:

```bash
cd /opt/powercloud-meeting-ingest
venv/bin/python - <<'PY'
import json
from meeting_ingest.paco_board import ChatDirectory, audit_audience, NotInSpace, AudienceUnsafe
cfg = json.load(open('/etc/powercloud/meeting-ingest/paco-config.json'))
space = 'spaces/REPLACE_ME'
try:
    print('OK', audit_audience(ChatDirectory.from_config(cfg), space, cfg.get('board_internal_domain_id')))
except (NotInSpace, AudienceUnsafe) as refusal:
    print('REFUSED:', refusal)
PY
```

   A refusal naming a person is the check working, not a bug: that space has somebody outside Power Cloud in it and must never carry candid internal commentary. `MH Crane` is the live example, because it includes Julie Fitzpatrick of Meriture. A refusal saying Paco is not a member means step 2 has not been done yet.

3. Write `- Project chat:` into that client's CONTEXT.md Operating context block and confirm its `- Asana project:` line holds the URL. The index picks both up on the next `paco-scan` pass (about 15 minutes); a run before that rebuild simply does not see the client.
4. Dry run for that client and read the two messages:

```bash
venv/bin/python -m meeting_ingest.paco_board --config /etc/powercloud/meeting-ingest/paco-config.json --dry-run --client "Brixton"
```

5. Live run for that one client (`--client "Brixton"` without `--dry-run`). The posts appear within about a minute via `paco-chat`. Confirm the sender is Paco and the space is the intended one.
6. Repeat per client. From then on the timer does it every Monday at 10:00 Eastern.

## 8. Routine checks and rollback

```bash
systemctl list-timers --all 'paco-board*' --no-pager
journalctl -u paco-board.service -n 30 --no-pager      # the run summary is one JSON line: queued, skipped, held, facts_only, errors
```

```sql
SELECT count(*) FROM paco_outbox WHERE id LIKE 'client-board-%' AND sent=0;   -- unsent board rows
```

- `held` means the space failed the audience check. Either Paco is not a member yet, or somebody in that space is not verified Power Cloud staff and the note names them. The second case is the check working; do not work around it by posting anyway.
- `facts_only` (health read on only) means the Claude call failed for those clients; the error class is in the admin DM.
- "Asana token file is missing" in the admin DM: section 6.
- To pause: set `enable_board_delivery` to `false`. Queued board rows stay unsent and are skipped by the worker; delete them or re-enable. Meeting filing and Monday delivery are unaffected either way.
- To stop entirely: `systemctl disable --now paco-board.timer`.
- To post again in the same week after fixing a board: `--rerun --client "{Client}"`.

Verification on deploy day, in order: a manual service start with the token absent produced the expected run summary and queued one admin note, which `paco-chat` delivered to Mike's DM; the token was then created and proved able to read four of six declared client projects; a dry run for Bixbi rendered both messages; the space members were checked against the verified staff roster; the space was added to the allowlist; and the live run queued both rows, which `paco-chat` delivered with `Result=success` and an empty outbox afterwards.

**Lock contention is expected and is waited out.** The Chat worker holds the ledger lock for the length of its blocking Pub/Sub pull, up to forty seconds, and starts again ten seconds later, so a single non-blocking attempt loses a coin flip. The first live attempt died on exactly that. `acquire_ledger` now retries for up to ten minutes. This matters because the board runs weekly with no retry behind it, so a lost attempt would have been a lost week, and the failure would have been silent apart from a unit in a failed state.

## 9. Limits and follow-ups

- **Paco does not generate the executive summary.** It links whatever the customer-exec-summary skill left in `working/` and `deliverables/`. Producing the summary automatically every week (a Claude Code scheduled routine over the OS repo with the Asana, Gmail, Drive and Chat connectors, writing the internal draft into each client's `working/` before 10:00) is the natural next step and a separate decision, because it runs an LLM pipeline over five sources per client under someone's account every week.
- **Two declared client projects are invisible to the current token** (checked 2026-09-14): `44 Pro` and `Upward Projects/TipHaus Reconciliation`, both HTTP 403. The token inherits Mike's own Asana access, so the fix is to add him to those projects or move the token to an account that can see everything. Until then those two clients are skipped with an entry in the admin note rather than failing the run. `Thunderbird`, `Alastin`, `Bixbi` and `Brixton` read cleanly.
- **Only six of the thirty-three indexed records declare an Asana project, and one declares a chat space.** Coverage is a CONTEXT.md data-entry question, not a code question.
- Reads the `- Asana project:` line only. Root clients and nested custom projects are both eligible; a nested record sharing project and space with its parent posts once.
- No thread, no card, no buttons. Paco does not react to anything said in the space; the Chat worker handles DM events only.
- No client-facing mode by design (section 1).
- No folder write. Follow-up: a generated `working/board_status_{date}.md` per client through the guarded Drive write path.
- The Windows development machine has no IANA time zone database; `paco_board.py` carries a fixed US-Eastern fallback so the tests run there. The VPS uses system zone data.
- ONBOARDING.md does not mention the capability yet; add the Part 3 bullet and re-render after the first live Monday.
