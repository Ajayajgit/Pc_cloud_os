# Paco — deployment and operations

Status date: September 14, 2026. Operational commands below are for authorized maintainers. They are instructions, not actions performed by reading this document.

## 1. Infrastructure inventory

| Resource | Value |
|---|---|
| Google Cloud project | `powerprojects` |
| Project number / Chat app ID | `708119474528` |
| Workspace domain | `powerclouderp.com` |
| Main service account | `power-cloud-meetings@powerprojects.iam.gserviceaccount.com` |
| Delegated client ID | `111586252817570907407` |
| Chat bot user | `users/107846244075773787655` |
| Power Cloud OS shared drive | `0AGVh-3eyJ6Z2Uk9PVA` |
| VPS | `178.156.153.168` |
| Installation | `/opt/powercloud-meeting-ingest` |
| Python executable | `/opt/powercloud-meeting-ingest/venv/bin/python` |
| Configuration directory | `/etc/powercloud/meeting-ingest` |
| Runtime state | `/opt/powercloud-meeting-ingest/paco-state` |
| Interaction topic | `projects/powerprojects/topics/paco-interactions` |
| Interaction subscription | `projects/powerprojects/subscriptions/paco-interactions-sub` |
| Add-on event publisher | `service-708119474528@gcp-sa-gsuiteaddons.iam.gserviceaccount.com` |

The local Python source is at:

```text
C:\Development\projects\Netsuite Development\Power Cloud NS\Monday Morning\meeting_ingest
```

The local NetSuite repository is:

```text
C:\Development\projects\Netsuite Development\Power Cloud NS\Monday Morning\ns-dashboard
```

The Python tree and isolated VPS installation were not Git repositories during this work. The NetSuite repository contains other pre-existing/uncommitted changes; do not treat its entire working-tree diff as this project's change set. Deploy only reviewed relevant files. Do not replace the broader Monday application with the local parent directory.

## 2. Services

| Service/timer | Responsibility |
|---|---|
| `paco-scan.service` / `.timer` | Read Calendar/Drive, rebuild index, queue actionable private reviews |
| `paco-chat.service` / `.timer` | Consume Monday notifications and trusted Chat interactions, flush outbox |
| `paco-preview.service` / `.timer` | Prepare immutable plans and execute organizer-authorized filing |

`paco-preview` is a historical name. Its current command does **not** include `--preview-only`. It runs `meeting_ingest.paco_jobs` against the live Paco config. The service has a five-minute timeout and restricts filesystem writes to the state directory using systemd settings including `ProtectSystem=strict`, `ProtectHome=true`, `PrivateTmp=true`, `NoNewPrivileges=true`, and `UMask=0077`. The collector's observed timeout is 12 minutes.

These hardening settings do not narrow the scope of Google credentials. Application checks remain essential.

## 3. Configuration map

`/etc/powercloud/meeting-ingest/paco-config.json`:

| Field | Meaning/current setting |
|---|---|
| `survey_config` | Path to `survey-config.json` |
| `chat_key_path` | Path to the service-account credential file |
| `database` | `paco-state/paco.db` |
| `index_path` | `paco-state/client-index.json` |
| `plans_path` | `paco-state/plans` |
| `allowed_users` | Explicit 27-person rollout list |
| `enable_confirmed_filing` | `true`; master filing gate |
| `file_on_selection` | `true`; explicit client selection skips the second confirmation |
| `interaction_topic` / `subscription` | Trusted Chat interaction transport |
| `enable_monday_ingress` | `true` |
| `enable_monday_delivery` | `true` |
| `monday_subscription` | Dedicated notification subscription |
| `monday_routes` | Fixed `test` and `live` destinations; see Monday document |

`survey-config.json`:

| Field | Meaning |
|---|---|
| `key_path` | Google credential file path |
| `subject` | Mike; identity used to build the central client index |
| `allowed_organizers` | Explicit scanned account list; each must also be in `allowed_users` |
| `internal_domains` | Currently `powerclouderp.com` |
| `os_root_id` | Power Cloud OS shared drive ID |
| `exclusions_path` | Provenance-bearing confirmed private/internal event exclusions |
| `scan_since` | Per-person rollout lower bound for new accounts |

Historical `time_min` / `time_max` fields may remain in the survey file. The scheduled collector calculates its own current window and applies `scan_since`; do not use stale saved timestamps to infer active scan coverage.

## 4. Current roster

All names below are the local part of an address at `powerclouderp.com`:

```text
ali          bhavani      bhavesh     brandy      chris
deepak       imran        irfan       jason       josh
justin       lokmata      maria       melna       mike
mukula       qainan       ramith      ron         sachin
santhosh     sherlene     srinivas    stephanie   steve
taha         vedmata
```

The list came from the single-page Google Admin directory of 27 active named users. Each passed a delegated primary-Calendar read and Drive user read. Each now has a separately verified private Paco space. This verifies access/setup, not every person's real meeting filing or every client's shared-drive permissions.

Chat API visibility was expanded to this list. An existing `emily@powerclouderp.com` visibility entry was preserved, but Emily was not present in the active directory list and is not in the scanner/actor allowlists. Visibility and execution authorization are separate settings.

## 5. Central Chat onboarding

The final solution uses the Chat API's `spaces.setup` with:

```json
{
  "space": {
    "spaceType": "DIRECT_MESSAGE",
    "singleUserBotDm": true
  },
  "requestId": "stable UUID derived from the user's email"
}
```

The call uses delegated user authentication for the allowlisted employee. It creates or reuses that employee's DM with the calling Paco app. This is **not** a published Marketplace listing or a domain-wide Marketplace installation.

`paco_onboard.py` then:

1. Lists the space's members using Paco app authentication.
2. Requires an app DM and exactly one joined human member; rejects unexpected pagination.
3. Calls `spaces.findDirectMessage` for the canonical human ID and checks the space agrees.
4. Registers email, human ID, and space in the ledger.
5. Rejects identity changes or a space already assigned to someone else.

It does not post a greeting. `ADDED_TO_SPACE` events also register silently. All 27 registrations were read back and checked for unique identities and spaces. “Say hi once” is no longer an onboarding requirement.

### Adding future staff

This is an explicit roster, not an automatic directory sync:

1. Verify the active Workspace account and approved rollout scope.
2. Add the account to Chat app visibility and both runtime allowlists.
3. Set its `scan_since` timestamp, with timezone, to avoid unintended historical prompts.
4. Verify delegated Calendar/Drive access and appropriate client-folder access.
5. Run the explicit central onboarding command below.
6. Verify the new private binding and the next scan's success.

```bash
cd /opt/powercloud-meeting-ingest
venv/bin/python -m meeting_ingest.paco_onboard --config /etc/powercloud/meeting-ingest/paco-config.json
```

The command iterates the configured allowlist and safely reuses existing chats; it can take time and uses the ledger lock during final registration. If lock contention occurs, rerun after the active worker finishes. Do not edit a failed identity binding blindly.

For offboarding, remove the person from both active allowlists and app visibility through the normal administrative process. Retain audit state according to company retention policy. Removing an allowlist entry is not deletion of past shared-drive files or a previously created Chat space.

## 6. Credentials and trust boundaries

The main service account has domain-wide delegation for:

```text
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/chat.spaces.create
```

Read-only scans request read-only scopes. Filing explicitly requests Drive write scope. Onboarding requests `chat.spaces.create`. Chat transport uses app authentication with `chat.bot`; Pub/Sub processing uses the corresponding Pub/Sub scope and configured IAM grants.

Full Drive delegation is broader than one folder. Scope restrictions alone do not enforce the Power Cloud OS boundaries; the explicit user lists, owner checks, selected destination, immutable plan, and operation checks constrain execution.

Credential locations include `/etc/powercloud/meeting-ingest/service-account.json` and protected PEM material in that directory. The dedicated Monday publisher has separate credential material under the protected Monday publisher directory. Do not print or copy these into documentation, source archives, tickets, or Chat.

Recorded rotation dates from setup:

| Credential | Recorded deadline |
|---|---|
| Original Google certificate registered during the initial setup | December 10, 2026 |
| NetSuite Monday publisher certificate | September 11, 2027 |

Inventory the actually active key/certificate before rotating; more than one credential artifact exists. These are recorded deployment deadlines, not a fresh certificate inventory performed during documentation. NetSuite reminders were configured for its certificate. Do not assume an equivalent independent alert exists for every Google credential.

## 7. Routine checks

Read-only host checks:

```bash
systemctl list-timers --all 'paco-*'
systemctl status paco-scan.service paco-chat.service paco-preview.service --no-pager
journalctl -u paco-scan.service -n 30 --no-pager
journalctl -u paco-chat.service -n 30 --no-pager
journalctl -u paco-preview.service -n 30 --no-pager
```

An inactive oneshot service between timer invocations is normal. Examine its exit result and timer state. A collector may complete other accounts and still fail overall to report a particular organizer's access problem.

Private SQL checks, using an authorized SQLite client:

```sql
SELECT state, COUNT(*) FROM paco_meetings GROUP BY state;
SELECT COUNT(*) FROM paco_outbox WHERE sent = 0;
SELECT COUNT(*) FROM paco_users;
SELECT COUNT(*) FROM paco_notification_rejections;
```

Keep titles, payloads, and plans out of general operational channels. Logs/state can contain sensitive meeting information even though they are not copied to the shared drive yet.

Run code validation from the package parent:

```bash
cd /opt/powercloud-meeting-ingest
venv/bin/python -m unittest discover -s meeting_ingest -t . -p 'test*.py'
```

The `-t .` matters because the tests use package-relative imports. The last complete suite ran 115 tests successfully. Do not test production write behavior by repeatedly running the Monday dashboard or arbitrary meetings.

## 8. Pausing and recovering

### Stop new filing

Set `enable_confirmed_filing` to `false` in the live config to stop subsequent execution passes. This does not undo files or necessarily interrupt an already-running write. If immediate quiescence is needed, an authorized operator should stop the filing timer/service and inspect any in-progress operation journal. Do not destroy state to clear a queue.

Keeping scanning and Chat active while filing is disabled can still generate previews or pilot-status replies. Pausing all meeting behavior requires considering all three workers; stopping the Chat worker also delays Monday delivery.

### “Original changed” or another hold

Inspect the row, frozen plan, per-meeting journal, and current Drive metadata. Determine whether any operations completed. An original's version may change while Google finalizes a newly created document or when a user edits it. Never simply replace the expected version or set a row to `filed`.

For PP Meeting, the journal had no operations and the notes version had advanced while ownership, file identity, and source folder were unchanged. The old plan directory was preserved, a fresh plan was built under the user's selected destination, and guarded execution succeeded. That was a reviewed recovery, not an automatic rule to overwrite any changed source.

### Buttons fail but text replies work

All outgoing card actions, including edits to existing messages, must pass through `paco_worker.delivery_body`. Internally the function placeholder is `meeting`; the delivered Workspace add-on action must name `projects/powerprojects/topics/paco-interactions`, with the asynchronous load-indicator behavior configured by the adapter. A direct Chat PATCH with an unconverted internal action caused the observed “unable to process” errors. Read back patched actions, not only the visible text.

### No prompt for a meeting

Check rollout window, actual organizer, supported Calendar-linked artifacts, discovery completeness, ownership/shared storage, exclusions, existing ledger state, registered private DM, and outbox/timer health. Do not respond to missing artifacts by sending reminders; silence is intentional.

## 9. Backup and restore

A complete recovery set includes reviewed source, protected credential/configuration backups, `paco.db`, the client index, all per-meeting plans/journals, and relevant deployment units. Capture a consistent SQLite backup or quiesce writers; copying only one live database file can omit transactional state. Secure backups like the production state itself.

Automated backup integration, retention enforcement, disaster recovery, and a restore drill were not established in this project. Source ZIPs are not state/credential backups. Restoring old outbox or filing state can replay work; reconcile deterministic message IDs, reserved file IDs, and actual Drive locations before resuming.
