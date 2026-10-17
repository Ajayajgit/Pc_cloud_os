# Paco — NetSuite Monday integration and extract receipts

Status date: September 14, 2026.

## 1. Ownership of the workflow

NetSuite generates and schedules the Monday dashboard. The existing Monday 9:30 AM Eastern deployment and on-demand dashboard Suitelet remain the entry points. Paco is the Chat sender and delivery transport. No second VPS/Codex Monday scheduler was introduced.

Mike confirmed the Monday, September 14 run worked. Earlier validation also exercised a normal Suitelet Run now and verified that the resulting Chat sender was Paco. This confirmation should not be expanded into an unperformed fresh audit of every extract written by the September 14 run.

## 2. Flow

```text
NetSuite scheduled deployment or Suitelet Run now
  → existing dashboard calculations and formatter
  → certificate-signed publisher authentication
  → dedicated Monday notification Pub/Sub topic
  → Paco notification validator
  → durable SQLite outbox
  → Google Chat message sent as Paco
```

The snapshot/extract generation pipeline remains part of the existing dashboard. Only relevant notification integration and extract acknowledgement handling were changed. The user identified NetSuite as the current scheduler; historical VPS migration plans must not be deployed over it.

## 3. Deployment inventory

| Resource | Identifier |
|---|---|
| NetSuite account | `5641465` |
| Existing dashboard Suitelet | `script=2603&deploy=1` |
| Scheduled script | `customscript_pc_monday_run_ss` |
| Weekly deployment | `customdeploy_pc_monday_run_schd` |
| Run-now deployment | `customdeploy_pc_monday_run_ss` |
| Publisher account | `paco-monday-publisher@powerprojects.iam.gserviceaccount.com` |
| Publisher service-account ID | `107401193415251807067` |
| Notification topic | `projects/powerprojects/topics/paco-monday-notifications` |
| Notification subscription | `projects/powerprojects/subscriptions/paco-monday-notifications-sub` |
| Live room | `spaces/AAQA9f6K0zw` — Monday Executive Call |
| Test destination | `spaces/4agUhSAAAAE` — Mike's private Paco DM |
| Actual NetSuite certificate ID | `custcertificatecustcertificate_paco_monday` |

The double `custcertificate` prefix is the actual deployed ID, not a typo to “correct.” The certificate was restricted to the Monday scheduled script and Paco connection-test script. Its recorded expiry is September 11, 2027; reminders were configured.

## 4. Relevant source components

In the NetSuite repository, under `src/FileCabinet/SuiteScripts/PowerCloud/monday_dashboard/`:

| File | Role |
|---|---|
| `cust_monday_run_sched.js` | Existing scheduled entry point integrated with notification adapter |
| `lib/pc_paco_publish.js` | Certificate-based RS256 JWT and dedicated Pub/Sub publication |
| `lib/pc_monday_notify.js` | Uses existing formatting; chooses Paco or legacy delivery according to configuration |
| `lib/pc_extract_transport.js` | Single POST plus bounded receipt recovery for client extracts |
| `lib/pc_monday_data.js` | Existing data layer calls the new extract transport |
| `cust_paco_connection_test.js` | Restricted connection diagnostic |
| `cust_extract_receipt_test.js` | Restricted empty-batch receipt diagnostic |

Associated script records include `customscript_pc_paco_test_sl` and `customscript_pc_extract_test_sl`. The isolated SuiteCloud projects used during deployment avoided replacing the main repository's project setup. The current repository contains unrelated working changes; a bulk deployment is not an appropriate way to reproduce this integration.

## 5. Notification contract and isolation

The notification consumer accepts exactly this shape:

```json
{
  "version": 1,
  "id": "stable-logical-run-id",
  "channel": "live",
  "text": "formatted Monday dashboard"
}
```

`channel` must be `test` or `live`. IDs have a restricted character set and length; text must be nonempty and within the byte limit. The producer cannot provide an arbitrary Chat space or meeting-action payload. The consumer resolves the channel using its fixed route map.

The dedicated NetSuite publisher has publication rights on the notification topic, not the trusted interaction topic. This matters because a compromised or malformed dashboard payload must not authorize meeting filing. Invalid notifications are recorded minimally and acknowledged to avoid permanently poisoning the queue.

The logical run ID and channel generate a deterministic outbox ID. Identical delivery retries reuse that ID; conflicting content for the same logical ID is rejected. Chat custom message IDs protect ambiguous response retries. This is not a blanket exactly-once guarantee across every system or a substitute for checking conflicting replay failures.

The producer does not fall back to the old webhook after an ambiguous Paco publication failure. Doing so could produce duplicate posts. The legacy webhook remains available for an explicit configuration rollback.

## 6. Configuration and rollback

The production NetSuite `paco.enabled` setting was set to `true` and read back. To restore the previous Chat sender for subsequent runs, set it to `false` using the established dashboard configuration process. Preserve the old webhook securely; do not paste it into documentation.

A rollback of notification delivery does not require changing the NetSuite schedule, rebuilding calculations, changing the Apps Script receiver, or deploying a different Monday architecture. Inspect whether a run already published before manually retrying it.

## 7. Extract acknowledgement problem

NetSuite reported HTTP 405/timeouts while the Apps Script receiver had actually refreshed the files. Read-only Drive verification found all 22 expected current extract files refreshed by the earlier run. The problem was response acknowledgement, not evidence that those files were absent.

The fix:

1. NetSuite sends the extract batch once with a cryptographically random receipt ID.
2. Apps Script records a pending receipt, performs the existing extract work, and records the result.
3. If the original response is uncertain, NetSuite uses bounded GET-only receipt checks.
4. Only a matching, complete, successful receipt counts as confirmed delivery.
5. An absent, failed, or expired receipt remains unconfirmed. The transport does not resubmit the batch to “make sure.”

The receipt cache lasts up to six hours and may be evicted earlier. It is acknowledgement recovery, not a durable work queue or exactly-once write protocol. The implementation uses four bounded receipt checks and restricts followed content-service redirects to the expected Google host.

The receiver also isolates extract errors so an extract exception cannot fall through into unrelated spreadsheet creation.

## 8. Apps Script deployment

| Resource | Identifier |
|---|---|
| Script project | `14LXSjUJ2fu4x1e0VkofZ9241ErfoZInkqroa1BhQoL0-l5AFP0gCf-GF` |
| Existing web deployment | `AKfycbzsYDFjdDnKNVIW4RvG4v7IkaLSg5UQbbVQlWzkCC2tVVkmKi3jwvVlKURBEGuwTpXY` |
| Deployed version after fix | `5` |

Only `doGet`/`doPost` and receipt helpers in `Code.gs` were changed. Existing builder functions and `Extracts.gs` were preserved. Local `apps-script/Code.entrypoints.gs` and `Receipts.gs` are fragments representing those changed portions, not necessarily whole replacement files. The existing execution identity and access settings were preserved.

For rollback, restore the previous `pc_monday_data.js` caller from the reviewed pre-change readback. The version-5 receiver supports old callers. If necessary, return the receiver deployment to version 4 afterward. Keep sender and schedule changes separate from receipt rollback.

## 9. Validation and operational limits

- Private connection test received by Mike.
- Normal Run now delivered a dashboard in Monday Executive Call; API readback verified Paco as sender and outbox marked sent.
- Mike confirmed the September 14 Monday run worked.
- Publisher/notification tests and existing dashboard numeric-parity validation passed.
- NetSuite compatibility fixes included valid multiline annotations and removal of an optional signing input-encoding argument unsupported by the runtime.
- Receipt tests covered timeout/405 recovery, correlation, bounded polling, missing receipts, rejected redirects, and extract failure isolation.
- A live restricted diagnostic returned “Extract receipt test passed. Confirmed zero client files written.”
- The production data-layer upload was read back against source.

The empty-batch test does not validate nonempty extraction semantics. The earlier 22-file readback and the later user confirmation are different evidence, from different runs. Automated backup/restore, comprehensive operational alerting, and certificate rotation drills were not completed here.
