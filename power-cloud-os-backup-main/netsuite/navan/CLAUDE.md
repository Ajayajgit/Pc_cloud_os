# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Navan → NetSuite expense report integration. Polls the Navan API daily for completed travel bookings and creates draft expense reports in NetSuite, pre-populated with costs, vendor details, and invoice attachments. Consultants then add out-of-pocket expenses and submit manually.

**SDF Project**: `PowerCloud_Navan_Expense` (Account Customization)

## SDF Commands

```bash
suitecloud project:validate              # Validate SDF project
suitecloud project:deploy -p             # Deploy to sandbox
suitecloud object:import -t customrecord # Import custom records from NetSuite
```

All SDF commands run from `src/` directory.

## Architecture

### Processing Pipeline (Daily Schedule)

```
6:00 AM  →  mr_navan_expense_processor.js    (Map/Reduce: poll Navan, create draft expense reports)
7:00 AM  →  mr_navan_cancellation_handler.js (Map/Reduce: handle canceled bookings)
8:00 AM  →  ss_navan_invoice_downloader.js   (Scheduled: download PDFs, attach to expense lines)
```

### Data Flow

1. **Navan API** (`GET /v1/bookings`) → all bookings in window
2. **Filter**: skip CANCELED/VOIDED, skip bookings still in the future, skip `grandTotal <= 0`, skip bookings with no project resolvable, skip bookings already in `booking_map`
3. **Employee resolution**: `passengers[0].person.email` → NS employee search (cached per execution)
4. **Project resolution**: `customFields[name='billToClient'].value` → fall back to `TRIP_PROJECT_OVERRIDE` map → otherwise log MISSING_PROJECT and skip
5. **Find-or-create**: for each booking, look for an open (`complete=false`) expense report for same employee where any line has `customer = project`. If found, append a line; otherwise create a new report with one line. Picks the most recently created match when multiple exist.
6. **Booking map records**: track booking UUID → (expense report, line index, amount) for cancellation handling

### Custom Records

| Record | Purpose |
|--------|---------|
| `customrecord_navan_config` | Singleton. API credentials, project saved search, kill switch |
| `customrecord_navan_integration_log` | Per-booking audit trail (created/appended/missing_project/failed) |
| `customrecord_navan_booking_map` | Booking UUID → expense line mapping (dedup + cancellation) |

### Expense Report Fields

The integration does not add custom body fields to expense reports. Reports are identified by line-level metadata (`customer`, `amount`, etc.) and via the `booking_map` record. Body memo carries Navan's trip name/purpose.

### Library Modules (`lib/`)

| Module | Responsibility |
|--------|---------------|
| `powercloud_navan_constants.js` | Record types, field IDs, enums, governance costs |
| `powercloud_navan_client.js` | OAuth token management + bookings API with pagination |
| `powercloud_navan_config.js` | Config record loader (singleton pattern) |
| `powercloud_navan_logger.js` | Integration log + booking map CRUD |
| `powercloud_navan_employee.js` | Employee lookup by email (cached) |
| `powercloud_navan_expense_builder.js` | Expense report record assembly |
| `powercloud_navan_file_manager.js` | Invoice PDF download + File Cabinet upload |

## Navan API Key Details

- **Auth**: OAuth 2.0 client_credentials → `POST /ta-auth/oauth/token` (token lasts ~12hrs)
- **Bookings**: `GET /v1/bookings` — requires at least one date filter pair (`createdFrom`/`createdTo` or `updatedFrom`/`updatedTo`), paginated (0-indexed, max 100/page)
- **Booking types**: FLIGHT, HOTEL, CAR, RAIL
- **Statuses**: ACCEPTED, CONFIRMED, TICKETED, CANCELED, VOIDED
- **Invoice URLs**: `https://app.navan.com/itineraryfiles/bookings/{uuid}/invoice` (auth method TBD)
- Full API reference: `navan-api-notes.md`; OpenAPI spec: `navan-openapi-spec.json`

## Expense Line Rules

- **Category**: Always "Travel Expenses" (ID `1`) — no per-type mapping
- **Customer**: project ID from `customFields[name='billToClient'].value` (NOT the top-level `billToClient` field — that's display-only). Falls back to `TRIP_PROJECT_OVERRIDE` in constants for historical bookings made before consultants were trained.
- **Billable**: `true` unless project is PC Internal Hours (ID `282`), then `false`
- **Non-reimbursable**: Always `true` (company card charges)
- **Receipt**: Always `true`. File attachment via `expmediaitem` happens in the 8 AM downloader script (not yet working for Navan — invoice URL returns SPA HTML, not PDF).
- **Memo (`memo`)**: `headerMemo + ' : ' + expenseMemo` — replicates client script 57 (`PC | CS | Set Memo on Expense Report`).
- **Expense Memo (`custcol_pc_exp_memo`)**: Navan's `tripDescription` + ` · ` + `invoiceNumber` if present, prefixed with `[OOP reason]` when out of policy.
- **Header memo**: `tripName/purpose` composite (e.g., "GRINDS-Indianapolis Trip/Customer Visit")
- **Project list**: A saved search (configured in `custrecord_navan_project_search`) controls which NS projects are pushed to Navan as Bill To Client options

## Conventions

- SuiteScript 2.1 AMD modules, `'use strict'`
- All custom objects prefixed `powercloud_`
- Governance-aware: check remaining usage before each iteration, exit gracefully
- Idempotent: safe to re-run; dedup via trip UUID search + booking map records
