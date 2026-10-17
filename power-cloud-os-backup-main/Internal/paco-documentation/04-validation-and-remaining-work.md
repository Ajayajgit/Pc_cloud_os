# Paco — validation, decisions, and remaining work

Status date: September 14, 2026.

## 1. Delivery sequence

| Stage | Work and evidence |
|---|---|
| Offline foundation | CONTEXT index, rung 0–2 routing, dry-run CLI, SQLite survey ledger, rendered queue, fixtures/tests |
| Read-only Google integration | Delegated Calendar/Drive access, pagination, attachment metadata, exact-occurrence sibling discovery |
| Ownership protection | Preserve already-shared originals; hold mixed storage and owner/organizer mismatch |
| First guarded filing | Conditional Drive writes, hashed plans, reserved generated IDs, operation journals, live Teppermans manual filing |
| Paco private workflow | Add-on Pub/Sub events, actor/DM validation, review cards, preview and completion outbox |
| Monday sender migration | Existing NetSuite schedule/formatter retained; isolated publisher and Paco Chat transport |
| Extract response repair | Single-POST receipt protocol and failure isolation; live empty-batch verification |
| Existing log support | Conditional append to recognized Paco logs with duplicate-free uncertain-response recovery |
| Disposable Chat filing | Private selection/approval, actual original move, Markdown/log creation, completion, repeat run, cleanup |
| Real Calendar validation | Friday test meetings discovered; exact-name routing and card wording corrected |
| Reduced friction | Silent selection processing, removed routine second confirmation, short verified completion |
| Staff rollout | 27-account access checks, isolated multi-organizer scans, forward rollout window, expanded visibility |
| Central DM setup | 27 distinct verified private chats; silent registration; manual “hi” removed |

## 2. Important decisions to carry into Power Cloud OS

1. **Paco is a reusable identity.** Add future capabilities behind the same assistant, with explicit capability boundaries.
2. **Calendar occurrences are the anchor.** Do not globally route recordings from filename similarity alone.
3. **Flat client source folders.** Original artifacts and generated meeting files go directly into `{Client}/source/`.
4. **Original IDs are preserved.** Move originals under guarded authorization; do not create uncontrolled duplicate evidence trees.
5. **Client selection is approval.** Do not reintroduce a second confirmation for the normal workflow without a new product decision.
6. **Routing confidence is not approval.** A suggestion still requires the organizer's choice.
7. **No files, no interruption.** Missing-recording reminders are deliberately excluded.
8. **Private meeting communications.** Review, corrections, and completion belong in the organizer's DM/thread.
9. **Prospects do not create client records automatically.** Keep prospect holds out of a shadow CRM workflow.
10. **NetSuite owns Monday scheduling.** Paco is the sender/transport, not another scheduler.
11. **Central onboarding.** Existing staff should not have to discover Paco and greet him before meeting prompts can work.
12. **Do not overclaim success.** Completion follows actual file verification; partial/uncertain work requires reconciliation.

## 3. Concrete validation evidence

### First manual filing

The August 20 Teppermans warehouse-label meeting was filed through a separately approved plan. Justin was organizer; Ron owned the originals and was the approved filing identity. Five journal operations completed: two original moves, two source Markdown files, and a generated working log. A subsequent execution with mutations forbidden completed without writes. This validated owner-assisted manual filing; it did not remove the scheduled organizer/owner guard.

### Conditional writes and retries

Live disposable tests verified real stale ETags return HTTP 412, successful conditional moves into the shared drive, recovery after simulated lost move/upload responses, and duplicate-free completed retries. A separate live log test verified stale-update rejection, preserved content/properties, and cleanup. Fabricated invalid ETags were not a reliable stale-token test; real tokens changed by a disposable update were used.

### End-to-end Chat test

A synthetic Calendar-shaped event was injected at the collector boundary with a real disposable Google Doc and disposable client folder. Genuine artifact lookup, private card callbacks, plan preparation, conditional filing, generated files, completion delivery, and repeated-run stability were verified. Files/folders were moved to Trash afterward; ledger and Chat evidence were retained. This test did not exercise actual Calendar discovery.

### Real Calendar and revised workflow

The real Calendar entries `44 Pro Internal Test` and `PP Meeting` produced private prompts. The first exposed the pipe-only title-matching limitation; the second correctly needed a client selection because `PP` was not a configured alias. Both were ultimately filed into the selected existing client source folders, with completion delivered. The repaired 44 Pro button was exercised live under the no-second-confirmation flow.

PP's original notes advanced in version after preview preparation. The existing guard stopped execution. With no operations in the journal, the superseded plan was archived and rebuilt under the selected destination before successful filing. This remains evidence that the guard works, not a reason to disable it.

### All-staff setup

The Google Admin directory showed 27 active named staff. All 27 passed read-access checks. The first all-staff collector run completed successfully. After central onboarding, the ledger held 27 unique human identities and 27 unique private spaces covering the entire allowlist. These are setup checks; they do not establish that all 27 have run a real meeting through every filing stage.

### Automated coverage

The final Python suite passed **115 tests** locally and on the VPS. Coverage includes deterministic routing, privacy exclusions, discovery/ownership rules, plan and journal behavior, conditional log updates, callback normalization, private identity enforcement, duplicate events/outbox behavior, fixed Monday routes, ordinary-title cases, silent empty meetings, cross-organizer event-ID isolation, one-account scan failure handling, and onboarding identity collision rejection.

NetSuite publisher/notification and receipt tests plus dashboard numeric-parity checks also passed during their respective deployment stages. Counts from older milestones (29, 35, 50, 85, 94, 95, 104, 105, 107, 112) are historical, not separate current suites to add together.

## 4. Incidents and lessons

| Issue | Cause and correction |
|---|---|
| Exact folder name in ordinary title not suggested | Title matching previously depended on `|`; added conservative full-name word matching |
| “Somewhere else” without a suggestion | Card always included that label; now uses Choose a client for no-match cards |
| Too many messages | Removed preparatory acknowledgment and then routine second confirmation; retained internal plan validation |
| Refreshed buttons failed | Ad hoc PATCH bypassed `delivery_body`, leaving the internal function placeholder; repaired transport actions and tested live |
| PP Meeting held | Notes version changed; no-op journal confirmed, plan preserved/rebuilt, then filed |
| Missing Drive v3 ETag | Conditional metadata/write transport uses compatible Drive v2 operations |
| Monday message from old sender | NetSuite legacy transport was still the active path; integrated dedicated Paco publisher |
| NetSuite sign/annotation errors | Adjusted signer invocation and valid multiline script annotations |
| Extract HTTP 405/timeout despite written files | Added correlated receipt recovery without reposting the write batch |
| Staff had to say hi | Added central app-DM setup and silent identity registration |
| Correct mobile icon, stale desktop icon | User verified mobile appearance; desktop caching suspected; avoided unnecessary icon changes |

## 5. Remaining implementation limits

| Area | Current limit / next step |
|---|---|
| Arbitrary attachments | Only recognized recordings and specifically named native transcript/Gemini Docs are ingested; generic attachment support needs design and tests |
| Unanchored artifacts | No full Drive search/Meet API discovery path for missing Calendar links |
| Late-arriving files | Repeated scans can discover evidence while a meeting is unresolved, but completed meetings are not a general incremental late-artifact ingestion workflow |
| Owner mismatch | Scheduled collector preserves/holds these cases; approved manual owner-assisted handling is separate |
| Already-shared material | Left where it is; this does not validate its existing client destination |
| Manual logs | Not overwritten or automatically reconciled; require an explicit reviewed strategy |
| Alias learning | Replies do not persist learned title/series aliases automatically |
| Client domains | Rung 1 depends on maintained CONTEXT domains; early inspection found missing mappings, and completion of domain maintenance is not claimed |
| Higher routing rungs | No transcript classifier/provider integration or classifier burn-in implementation |
| Executive summaries/feedback | Broader Paco concepts agreed; not implemented as a new capability here |
| Undo | No automatic move rollback or consultant-facing undo command |
| Retention/backups | No new automated retention policy, backup integration, or restore drill established |
| Monitoring | systemd/journal and ledger checks exist; proactive operational alerting/health dashboards are not complete |
| Scale/latency | Sequential account/artifact reads, shared locks, and blocking queue pulls can delay responses; no hard real-time SLA |
| Account lifecycle | Explicit roster and onboarding command; no automatic new-hire/suspension directory synchronization |
| Marketplace | No private Marketplace publication/admin install was completed; direct API chat setup achieved the onboarding goal |

Known code-level follow-ups worth reviewing before broader capability growth: repeated hold notifications use a per-meeting stage key and may suppress a later different hold; Chat conflict readback compares text rather than every card field; repeated selection of the same still-pending client can regenerate preparation; partial preparation/network failures rely on existing job retry behavior rather than a comprehensive workflow retry policy. These were not silently changed during documentation.

## 6. Suggested maintenance order

1. Establish credential-expiry ownership, consistent state backup, restore validation, and failure alerts.
2. Observe normal consultant usage and review held cases without adding empty-meeting interruptions.
3. Maintain authoritative CONTEXT domains/aliases and define safe arbitrary-attachment support.
4. Add incremental late-artifact processing and deliberate recovery/undo behavior.
5. Add further Paco capabilities through separate authorization/state contracts.
6. Consider classifier routing only after deterministic behavior and human corrections are measured; retain the original design's conservative evaluation intent.

## 7. Source and integration references

These primary references informed implementation; the deployed source/configuration and this package describe the actual current behavior.

- [Calendar events.list](https://developers.google.com/workspace/calendar/api/v3/reference/events/list)
- [Drive shared-drive support](https://developers.google.com/workspace/drive/api/guides/enable-shareddrives)
- [Chat spaces.setup](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces/setup)
- [Chat direct-message lookup](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces/findDirectMessage)
- [Chat membership listing](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.members/list)
- [Chat message updates](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/patch)
- [Chat cards](https://developers.google.com/workspace/chat/api/reference/rest/v1/cards)
- [Workspace add-on events](https://developers.google.com/workspace/add-ons/concepts/event-objects)
- [Pub/Sub pull](https://docs.cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions/pull)
- [Apps Script Content service](https://developers.google.com/apps-script/guides/content)
- [Apps Script Cache service](https://developers.google.com/apps-script/reference/cache/cache)

## 8. Incorporating into the OS

Use the behavior/architecture file as the capability specification, the operations file as the private runbook, and the Monday file alongside existing NetSuite dashboard documentation. Retain this validation file as implementation history and a backlog reference. Do not merge old pilot paragraphs into current instructions without their dates; several were intentionally superseded during user testing.
