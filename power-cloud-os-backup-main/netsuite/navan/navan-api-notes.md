# Navan API Reference Notes

Last updated: 2026-03-19
Based on: Live API testing against Power Cloud Consulting account

## Authentication

- **Token endpoint**: `POST https://api.navan.com/ta-auth/oauth/token`
- **Grant type**: `client_credentials`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Token lifetime**: ~12 hours (43,199 seconds)

### Request

```
POST https://api.navan.com/ta-auth/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}
```

### Response

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 43199,
  "scope": "bookings:read liquid:read",
  "company_uuid": "cdb3a299-9eeb-4503-b0ce-637dbee89c9d",
  "allowed_ips": null
}
```

### Credentials

- **Client ID**: `e08e8163-642e-49a7-b621-7ee1f68e2b8e`
- **Client Secret**: `8e7ea809bcab4b55a21a21f655eca580`
- Credentials are shown only once at creation in the Navan Admin dashboard. Cannot be retrieved again.

### Granted Scopes

| Scope | Access |
|---|---|
| `bookings:read` | `GET /v1/bookings` — confirmed working |
| `liquid:read` | Unknown endpoint — `/v1/liquid` returned 404 |

### Endpoints That Require Additional Scopes (returned 403)

- `/v1/users`
- `/v1/trips`
- `/v1/invoices`
- `/v1/travelers`
- `/v1/company`
- `/v1/booking-data`

---

## Bookings Endpoint

### `GET /v1/bookings`

The primary (and currently only accessible) data endpoint. Returns paginated booking records.

**Base URL**: `https://api.navan.com`
**Authorization**: `Bearer {access_token}`

### Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `createdFrom` | Unix timestamp (seconds) | Yes* | Start of creation date range |
| `createdTo` | Unix timestamp (seconds) | Yes* | End of creation date range |
| `updatedFrom` | Unix timestamp (seconds) | Yes* | Start of last-modified date range |
| `updatedTo` | Unix timestamp (seconds) | Yes* | End of last-modified date range |
| `startDateFrom` | Unix timestamp (seconds) | No | Filter by travel start date |
| `startDateTo` | Unix timestamp (seconds) | No | Filter by travel start date |
| `bookingType` | Enum | No | `FLIGHT`, `HOTEL`, `CAR`, `RAIL`, `TRANSPORTATION`, `BLACK_CAR` |
| `bookingStatus` | Enum | No | `CANCELED`, `VOIDED`, `CONFIRMED`, `TICKETED`, `ACCEPTED` |
| `bookingUuid` | String | No | Lookup a specific booking by UUID |
| `tripUuid` | String | No | Lookup all bookings for a specific trip |
| `includeTransactions` | Boolean | No | Include transaction details (default: false) |
| `page` | Integer | No | Page number, 0-indexed (default: 0) |
| `size` | Integer | No | Page size, 1-100 (default: 10) |

*At least one date filter pair (created or updated) is required. The API returns 400 if none provided.

### Response Structure

```json
{
  "data": [ ...booking objects... ],
  "page": {
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 10,
    "totalElements": 2
  }
}
```

---

## Booking Object — Field Reference

Based on actual API responses from test bookings.

### Identity & Status

| Field | Type | Example | Notes |
|---|---|---|---|
| `uuid` | String | `"6fb25485-c23f-..."` | Unique booking identifier |
| `bookingId` | String | `"SJYWHL"` | Human-readable booking reference |
| `confirmationNumber` | String | `"B3JX31"` | Vendor confirmation number |
| `bookingType` | String | `"FLIGHT"` | FLIGHT, HOTEL, CAR, RAIL, etc. |
| `bookingStatus` | String | `"ACCEPTED"` | ACCEPTED, CONFIRMED, CANCELED, VOIDED, TICKETED |
| `created` | ISO 8601 | `"2026-03-19T20:33:15.986528Z"` | When booking was created |
| `lastModified` | ISO 8601 | `"2026-03-19T20:33:16.309941Z"` | Last update timestamp |
| `cancelledAt` | ISO 8601 | `null` | When booking was cancelled (if applicable) |
| `cancellationReason` | String | `""` | Reason for cancellation |
| `approvalStatus` | String | `"APPROVED"` | Approval workflow status |

### Trip Grouping (Key for NetSuite Integration)

| Field | Type | Example | Notes |
|---|---|---|---|
| `tripUuids` | String[] | `["48b736ea-fd08-..."]` | **Links bookings to the same trip. This is the grouping key for expense reports.** |
| `tripName` | String | `"Houston"` | User-entered trip name |
| `tripDescription` | String | `"United, BOS to IAH, Mar 25"` | Auto-generated description |
| `reason` | String | `"Houston"` | Trip reason |
| `purpose` | String | `"NA"` | Trip purpose |

### Traveler / Employee (Key for NetSuite Employee Lookup)

The `booker` object and `passengers` array both contain employee details.

**booker** (person who made the booking):
| Field | Path | Example |
|---|---|---|
| UUID | `booker.uuid` | `"e9444e2e-4ba2-..."` |
| Name | `booker.name` | `"Michael Flynn"` |
| Email | `booker.email` | `"mike@powerclouderp.com"` |
| Department | `booker.department` | `"*Unassigned department"` |
| Cost Center | `booker.costCenter` | `"*Unassigned cost center"` |
| Subsidiary | `booker.subsidiary` | `"*Unassigned subsidiary"` |

**passengers[].person** (actual travelers — may differ from booker):
Same fields as booker, plus `passport` info and `billableEntity`.

**Employee lookup strategy**: Use `passengers[0].person.email` (the actual traveler) to match the NetSuite employee record via email address. Employee emails in Navan will match their Power Cloud email, which is the same email on their NetSuite employee record. No UUID mapping or separate user endpoint needed — email is the shared key.

### Pricing

| Field | Type | Example | Notes |
|---|---|---|---|
| `grandTotal` | Decimal | `766.80` | Total cost in booking currency |
| `usdGrandTotal` | Decimal | `766.8` | Total in USD |
| `basePrice` | Decimal | `684.65` | Pre-tax price |
| `tax` | Decimal | `82.15` | Tax amount |
| `currency` | String | `"USD"` | Booking currency code |
| `unitaryPrice` | Decimal | `766.80` | Per-unit price (per night for hotels) |
| `netCharge` | Decimal | `766.80` | Net charge amount |
| `travelSpend` | Decimal | `766.80` | Travel spend amount |

### Travel Dates & Location

| Field | Type | Example | Notes |
|---|---|---|---|
| `startDate` | Date | `"2026-03-25"` | Trip start date |
| `endDate` | Date | `"2026-03-27"` | Trip end date |
| `bookingDuration` | Integer | `2` | Duration in days/nights |
| `origin.city` | String | `"Boston"` | Origin city |
| `origin.airportCode` | String | `"BOS"` | Origin airport (flights) |
| `destination.city` | String | `"Houston"` | Destination city |
| `destination.airportCode` | String | `"IAH"` | Destination airport (flights) |

### Segments (Flight Legs / Hotel Stays)

Array of individual travel segments within a booking.

**Flight segment fields:**
- `departure.airportCode`, `departure.city`, `departure.country`
- `arrival.airportCode`, `arrival.city`, `arrival.country`
- `startLocalDateTime`, `endLocalDateTime`
- `providerName` (airline name), `flightNumber`
- `cabin`, `fareClass`

**Hotel segment fields:**
- `departure.address`, `departure.city` (hotel address)
- `startLocalDateTime` (check-in), `endLocalDateTime` (check-out)
- `providerName` (hotel name)
- `hotelChain`, `hotelSuperChain`

### Documents

| Field | Type | Example | Notes |
|---|---|---|---|
| `invoice` | URL | `"https://app.navan.com/itineraryfiles/bookings/{uuid}/invoice"` | Booking invoice PDF |
| `pdf` | URL | `"https://app.navan.com/itineraryfiles/bookings/{uuid}"` | Itinerary PDF |
| `invoiceNumber` | String | `""` | Invoice number (was empty in test) |
| `etickets` | String[] | `[]` | E-ticket numbers |

**Note**: Invoice/PDF URLs likely require authentication to download. Need to test whether the Bearer token works or if session auth is needed.

### Custom Fields

| Field | Type | Example |
|---|---|---|
| `customFields` | Array of `{name, value}` | `[{"name": "tripName", "value": "Houston"}, {"name": "tripPurpose", "value": "NA"}]` |
| `projects` | Unknown | `null` (not populated in test) |
| `billToClient` | Object | `null` in test — contains `Name`, `ID`, `Approver` when populated |

**`billToClient`** is the designated field for project/client association. The `ID` property will hold the NetSuite project internal ID. This is a built-in Navan field configured in admin — no custom field needed.

**Current custom fields observed**: `tripName` and `tripPurpose` (auto-populated), plus car-specific fields (`is_collect_provided`, `car_booking_uuid`, `is_delivery_provided`).

### Payment

| Field | Type | Example |
|---|---|---|
| `paymentMethod` | String | `"VISA 1752"` |
| `nameOnCreditCard` | String | `"Michael P Flynn"` |
| `companyPaymentMethod` | String | `"true"` |
| `paymentSchedule` | String | `"NOW"` (flights) / `"LATER"` (hotels) |
| `expensed` | Boolean | `false` |

---

## Observed Booking Statuses

| bookingType | bookingStatus Observed | Notes |
|---|---|---|
| FLIGHT | `ACCEPTED` | Flight confirmed |
| HOTEL | `CONFIRMED` | Hotel confirmed |
| CAR | `CONFIRMED` | Car rental confirmed |

## Car Rental Specific Fields

The CAR booking type includes a few unique fields:
- `carType`: `"COMPACT"` — vehicle class
- `cnr.cnrCodes`: `["JB6321"]` — corporate negotiated rate code
- `cnr.cnrSources`: `["TRIPACTIONS"]` — rate source
- Extra `customFields` on car bookings: `is_collect_provided`, `car_booking_uuid`, `is_delivery_provided`

## API Propagation Delay

Car rental bookings had a ~15-20 minute delay before appearing in the API after booking in the UI. Flight and hotel appeared within a few minutes. The integration should account for this — polling on a schedule (not real-time) mitigates this naturally.

## Invoice / Document Availability

Observed behavior in the Navan UI (2026-03-19):

| Booking Type | Document Available | Timing |
|---|---|---|
| FLIGHT | Invoice | ~2 hours after booking |
| CAR | Invoice | ~2 hours after booking |
| HOTEL | "Cost Estimate" only | **No invoice at booking time.** Final invoice likely only available post-checkout. |

**Implication for integration**: Since draft expense reports should only be created after travel has occurred (not at booking time), invoice availability is not a blocker. By the time the integration runs post-trip, flight and car invoices will be available. Hotel invoices may or may not be available via the API post-checkout — needs verification after the test trip completes.

The `invoice` URL field is present on all three booking types regardless of whether the document is ready yet:
- Flight: `https://app.navan.com/itineraryfiles/bookings/{uuid}/invoice`
- Hotel: `https://app.navan.com/itineraryfiles/bookings/{uuid}/invoice`
- Car: `https://app.navan.com/itineraryfiles/bookings/{uuid}/invoice`

---

## Test Trip Summary (2026-03-19)

**Trip UUID**: `48b736ea-fd08-4a79-9d63-1fa04885b811`
**Trip Name**: "Houston"
**Traveler**: Michael Flynn (mike@powerclouderp.com)
**Travel Dates**: Mar 25–27, 2026

| Booking | Type | ID | Amount | Vendor | Status |
|---|---|---|---|---|---|
| Flight | FLIGHT | SJYWHL | $766.80 | United (BOS→IAH round-trip) | ACCEPTED |
| Hotel | HOTEL | AQ9RN5 | $432.90 | Houston Marriott North (2 nights @ $185) | CONFIRMED |
| Car | CAR | AQA5QH | $176.17 | National Compact (IAH, 2 days @ $60) | CONFIRMED |

**Total trip cost**: $1,375.87

All three bookings share the same `tripUuids` value, confirming trip-level grouping works for expense report creation.

---

## Known Issues / Open Questions

1. **Invoice URL authentication**: The `invoice` and `pdf` URLs point to `app.navan.com`. Need to confirm whether the API Bearer token works for downloading these, or if authenticated session cookies are required. Can test after ~2hrs when flight/car invoices become available.

2. **Project mapping — RESOLVED**: The built-in `billToClient` field in Navan will be used for project association. It returns an object with `Name`, `ID`, and `Approver`. The `ID` field will store the NetSuite project internal ID, eliminating the need for a custom field or secondary lookup. The `billToClient` field was null in test bookings because it couldn't be added retroactively, but will be populated at booking time in production use.

3. **Webhook availability**: The bookings API is poll-based. Webhook support for real-time booking events (preferred architecture from SOW Option A) was not testable through this API — needs to be requested from Navan support. Given that we want to poll post-trip anyway, Option B (scheduled polling) may be the better fit.

4. **User/traveler data**: The `/v1/users` endpoint returned 403. Current scopes only include `bookings:read`. If standalone user lookups are needed, additional scopes must be requested.

5. **Employee profile fields**: `department`, `costCenter`, `subsidiary`, and `region` are all `*Unassigned` in test data. These should be configured in Navan user profiles to match NetSuite values for cleaner data flow.

6. **`includeTransactions` parameter**: Not yet tested. May provide additional financial detail useful for expense line creation.

7. **Hotel final invoice**: Need to verify after the test trip (Mar 27+) whether the hotel booking's invoice URL returns a final invoice post-checkout, or if it remains a cost estimate.

---

## OpenAPI Spec

The full OpenAPI 3.1 spec is available at:
- **URL**: `GET https://api.navan.com/v3/api-docs` (requires Bearer token)
- **Local copy**: `navan-openapi-spec.json` (saved 2026-03-19)
- **Swagger UI** (behind Cloudflare): `https://app.navan.com/open-api/trips/swagger-ui/index.html`

---

## Quick Reference — cURL Examples

### Get Token
```bash
curl -X POST "https://api.navan.com/ta-auth/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}"
```

### Get All Bookings (Last 30 Days)
```bash
CREATED_FROM=$(date -d "30 days ago" +%s)
CREATED_TO=$(date +%s)
curl -s "https://api.navan.com/v1/bookings?page=0&size=100&createdFrom=$CREATED_FROM&createdTo=$CREATED_TO" \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Bookings for a Specific Trip
```bash
curl -s "https://api.navan.com/v1/bookings?tripUuid={TRIP_UUID}&createdFrom={FROM}&createdTo={TO}" \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Only Flights
```bash
curl -s "https://api.navan.com/v1/bookings?bookingType=FLIGHT&createdFrom={FROM}&createdTo={TO}" \
  -H "Authorization: Bearer {TOKEN}"
```

### Get Cancelled Bookings
```bash
curl -s "https://api.navan.com/v1/bookings?bookingStatus=CANCELED&createdFrom={FROM}&createdTo={TO}" \
  -H "Authorization: Bearer {TOKEN}"
```
