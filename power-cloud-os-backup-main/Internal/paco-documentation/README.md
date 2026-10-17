# Paco and Google Meet ingestion — Power Cloud OS handoff

Status date: September 14, 2026. Audience: Power Cloud OS maintainers, administrators, and future implementers.

This package describes the implemented system at the end of this project. It consolidates the conversation, source inspection, deployment records, and a final read-only production check. It is intended to be incorporated into the broader Power Cloud OS documentation.

## Read this first

Paco is the reusable Google Chat identity for Power Cloud OS. Two capabilities are live: private meeting filing assistance and delivery of the existing NetSuite Monday dashboard. A third, the weekly Asana board update, was built and tested on 2026-09-14 in a Claude Code session with Mike and is documented in file 05; it is not deployed.

Meeting scanning is enabled for 27 active Workspace staff accounts. All 27 passed Calendar and Drive read-access checks and have distinct, verified private Paco chats. Staff do **not** need to send “hi.” Paco contacts an organizer when a supported meeting artifact needs a destination. The organizer selects a client button or replies with a client name in the meeting thread. That selection authorizes filing; there is no second confirmation in the current flow. Paco reports completion after verified filing.

No supported files means no prompt or reminder. New staff coverage starts from rollout time to avoid a backlog. Meeting questions stay in private DMs; the Monday dashboard goes to its existing executive Chat space.

The Monday schedule remains in NetSuite. This project changed notification delivery to Paco and repaired extract-receipt reporting; it did not move Monday scheduling to the VPS.

## Documents

| Document | Purpose |
|---|---|
| [01 — Behavior and architecture](01-behavior-and-architecture.md) | Product decisions, routing, discovery, folder layout, processing, and data model |
| [02 — Deployment and operations](02-deployment-and-operations.md) | Infrastructure inventory, configuration, onboarding, credentials, monitoring, and recovery |
| [03 — Monday integration](03-monday-integration.md) | NetSuite producer, message transport, Apps Script receipts, validation, and rollback |
| [04 — Validation and remaining work](04-validation-and-remaining-work.md) | Evidence, incident fixes, limitations, and implementation priorities |
| [05 — Weekly board updates](05-board-updates.md) | Asana reader, facts, health read, per-client team spaces, allowlist, configuration, deployment, and rollback. Built and tested 2026-09-14, not deployed |

## Current state versus older notes

Earlier `PACO_BUILD_STATUS.md`, `MONDAY_PACO_MIGRATION.md`, and the source package README contain chronological pilot updates. Their opening sections are not current operating instructions. This package supersedes these historical claims:

| Historical statement | Current state |
|---|---|
| Read-only, offline foundation only | Production scanning, private Chat, guarded filing, and Monday delivery are deployed |
| Only Mike can use Paco | 27 explicitly configured active staff accounts |
| Users must say “hi” | Private chats were established and registered centrally |
| Every selection needs another preview confirmation | Client selection is approval; the internal immutable plan remains |
| Automatic confirmed filing is disabled | `enable_confirmed_filing` and `file_on_selection` are both true |
| The preview service forces `--preview-only` | The historically named service now executes organizer-authorized filing |
| Existing meeting logs cannot be updated | Paco-generated logs support guarded appends; arbitrary/manual logs still hold |
| Monday extracts appear not to have arrived | 22 files were verified refreshed; receipt recovery was added |
| Paco avatar is wrong | Mike verified the correct avatar on mobile; desktop caching was suspected |

## Interpretation of “automatic”

Scanning, artifact checks, post-selection execution, completion delivery, and scheduled Monday transport are automatic. A confident route is still a **suggestion**, not permission to move files without an organizer's selection. There is no AI classifier in the active routing ladder.

## Verification boundaries

The final read-only check found 27 configured users, 27 distinct Chat identities, 27 private chats, filing enabled, three filed rows in the Paco meeting ledger, and no pending outgoing messages. The three rows include the disposable test and the two real-calendar validation meetings; they are not the entire historical filing record. The earlier Teppermans manual filing has its own plan/journal.

All 115 Python tests passed during the final onboarding deployment. This documentation task did not perform new production writes or re-file meetings. All-staff access and chat setup were checked; full real-meeting filing was not separately exercised for every consultant.

## Handling this package

These files contain internal architecture, account names, deployment identifiers, and operational paths. Keep them in internal Power Cloud OS documentation. They contain no private keys, access tokens, webhook secrets, actual meeting transcripts, or recordings. Relative links are used within the package so the directory can be moved as a unit.
