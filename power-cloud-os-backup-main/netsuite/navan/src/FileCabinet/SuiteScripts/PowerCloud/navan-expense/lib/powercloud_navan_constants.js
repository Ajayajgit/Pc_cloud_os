/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Integration Constants
 * @author Power Cloud Consulting
 */
define([], function () {
    'use strict';

    const RECORD_TYPES = {
        CONFIG: 'customrecord_navan_config',
        INTEGRATION_LOG: 'customrecord_navan_integration_log',
        BOOKING_MAP: 'customrecord_navan_booking_map',
        RELAY_RUN: 'customrecord_navan_relay_run'
    };

    // Custom fields on the standard employee record.
    const EMPLOYEE_FIELDS = {
        // Personal Uber account email → keys Uber CSV rows to the NS employee. Formula-defaults
        // to the corporate email; overridden per-employee when they use a personal Uber account.
        UBER_EMAIL: 'custentity_pc_uber_email'
    };

    // Uber tracking lives on the expense line itself (no separate map record): each line is
    // tagged with its Network Transaction Id (dedup key) and Trip/Eats ID (groups Fare+Tip,
    // supports cancellation). Dedup = a line search for the txn id; the matching line IS the
    // location, so there's no stored line index to drift when a line is removed.
    const UBER_LINE_FIELDS = {
        TXN_ID: 'custcol_navan_uber_txn_id',
        TRIP_ID: 'custcol_navan_uber_trip_id',
        RECEIPT_URL: 'custcol_navan_uber_receipt_url'
    };

    // Remap specific Uber expense codes (lowercased, trimmed) to an NS customer/project internal
    // ID. Use when the code's numeric prefix points at the wrong entity — e.g. AbilityFirst's Uber
    // code resolves to customer 4037, but we want project 4027 so the Uber rides attach to the
    // same expense report Navan builds for AbilityFirst — or when riders free-typed a non-standard
    // code (e.g. "abi", "Abili"). Long-term fix is correcting the codes in the Uber dashboard.
    const UBER_CODE_OVERRIDE = {
        '4037-abilityfirst': '4027',
        'abi': '4027',
        'abili': '4027'
    };

    const CONFIG_FIELDS = {
        CLIENT_ID: 'custrecord_navan_client_id',
        CLIENT_SECRET: 'custrecord_navan_client_secret',
        API_BASE_URL: 'custrecord_navan_api_base_url',
        LOOKBACK_DAYS: 'custrecord_navan_lookback_days',
        INVOICE_FOLDER: 'custrecord_navan_invoice_folder',
        ALERT_EMAIL: 'custrecord_navan_alert_email',
        LAST_POLL_TIME: 'custrecord_navan_last_poll_time',
        PROJECT_SAVED_SEARCH: 'custrecord_navan_project_search',
        RELAY_URL: 'custrecord_navan_relay_url',
        RELAY_SECRET: 'custrecord_navan_relay_secret',
        UBER_LAST_OK: 'custrecord_navan_uber_last_ok'
    };

    // Relay Uber-poll heartbeat: the watchdog alerts when no successful check-in is this old.
    const UBER_WATCHDOG = {
        MAX_AGE_HOURS: 36
    };

    const RELAY_RUN_FIELDS = {
        RUN_ID: 'custrecord_navan_relay_run_id',
        STARTED: 'custrecord_navan_relay_started',
        FINISHED: 'custrecord_navan_relay_finished',
        REQUESTED_COUNT: 'custrecord_navan_relay_requested',
        SUCCESS_COUNT: 'custrecord_navan_relay_success',
        FAIL_COUNT: 'custrecord_navan_relay_fail',
        STATUS: 'custrecord_navan_relay_status'
    };

    const LOG_FIELDS = {
        EVENT_TYPE: 'custrecord_navan_log_event_type',
        TRIP_UUID: 'custrecord_navan_log_trip_uuid',
        EMPLOYEE: 'custrecord_navan_log_employee',
        EXPENSE_REPORT: 'custrecord_navan_log_expense_report',
        STATUS: 'custrecord_navan_log_status',
        BOOKING_COUNT: 'custrecord_navan_log_booking_count',
        TOTAL_AMOUNT: 'custrecord_navan_log_total_amount',
        ERROR_MESSAGE: 'custrecord_navan_log_error_message',
        RAW_PAYLOAD: 'custrecord_navan_log_raw_payload',
        TIMESTAMP: 'custrecord_navan_log_timestamp'
    };

    const LOG_EVENT_TYPES = {
        EXPENSE_CREATE: '1',
        CANCELLATION: '2',
        INVOICE_DOWNLOAD: '3',
        AUTH_FAILURE: '4',
        ERROR: '5',
        APPENDED: '6',
        MISSING_PROJECT: '7',
        MISSING_EMPLOYEE: '8',
        UBER_IMPORT: '9'
    };

    const BOOKING_MAP_FIELDS = {
        BOOKING_UUID: 'custrecord_navan_bm_booking_uuid',
        TRIP_UUID: 'custrecord_navan_bm_trip_uuid',
        EXPENSE_REPORT: 'custrecord_navan_bm_expense_report',
        LINE_INDEX: 'custrecord_navan_bm_line_index',
        BOOKING_TYPE: 'custrecord_navan_bm_booking_type',
        AMOUNT: 'custrecord_navan_bm_amount',
        STATUS: 'custrecord_navan_bm_status',
        INVOICE_URL: 'custrecord_navan_bm_invoice_url',
        INVOICE_FILE_ID: 'custrecord_navan_bm_invoice_file_id'
    };

    const BOOKING_MAP_STATUS = {
        ACTIVE: 'active',
        CANCELLED: 'cancelled'
    };

    const BOOKING_TYPES = {
        FLIGHT: 'FLIGHT',
        HOTEL: 'HOTEL',
        CAR: 'CAR',
        RAIL: 'RAIL'
    };

    const EXCLUDED_STATUSES = ['CANCELED', 'VOIDED'];

    const EXPENSE = {
        TRAVEL_CATEGORY_ID: '1',
        PC_INTERNAL_HOURS_PROJECT_ID: '282',
        EXPENSE_MEMO_COLUMN: 'custcol_pc_exp_memo',
        // Corporate card (accounting requirement). Body field = Account for Corporate Card
        // Expenses, set to the Chase Premiere Ink Card account (internal id 473). Line field
        // = the "Corporate Card" checkbox. VERIFY CORP_CARD_LINE_FIELD against a live ER form.
        CORP_CARD_ACCOUNT_ID: '473',
        CORP_CARD_BODY_FIELD: 'acctcorpcardexp',
        CORP_CARD_LINE_FIELD: 'corporatecreditcard',
        // Header memo the Uber poll puts on a report it creates. Uber gives us no trip name, so
        // when Navan later appends to the same report it overwrites this with its real trip name.
        UBER_PLACEHOLDER_MEMO: 'Uber Travel',
        // Replicates client script 57 (PC | CS | Set Memo on Expense Report).
        // Client scripts don't fire for REST/server-side creates, so the integration
        // produces the same concatenation server-side.
        composeStandardMemo: function (headerMemo, expenseMemo) {
            return (headerMemo || '') + ' : ' + (expenseMemo || '');
        }
    };

    // Trip UUID → NetSuite project (Customer/Job) internal ID.
    // Used as a fallback when a booking has no customFields[name="billToClient"] entry.
    // Long-term fix is consultants populating Bill To Client in Navan at booking time.
    const TRIP_PROJECT_OVERRIDE = {
        '70b7ca25-d66d-41d8-a66b-aac1ef9d3ee7': '4011', // imran GRINDS-Indianapolis
        '3600a8a0-d08c-46eb-b0e0-ef761185e6e0': '4011', // stephanie Grinds RA - Indianapolis
        'eb05adcf-b51f-4f07-b2aa-842955240153': '282',  // steve Boston (PC Internal)
        'bdecd21d-5331-4062-af06-970b9b528a4c': '282',  // steve Visit NS Austin Office (PC Internal)
        'a7eb8cf9-a549-4b00-bf5f-c2cf86ce2685': '4027', // irfan Pasadena (AbilityFirst)
        '536c04a5-190c-4e2a-9213-d313e6ccb1e1': '4027', // mukula Burbank (AbilityFirst)
        'debce773-8fb8-480b-b0bf-586b32fb047b': '698'   // ron Montgomery (Bomb Party)
    };

    const NAVAN_API = {
        TOKEN_PATH: '/ta-auth/oauth/token',
        BOOKINGS_PATH: '/v1/bookings',
        PAGE_SIZE: 100,
        GRANT_TYPE: 'client_credentials'
    };

    const GOVERNANCE = {
        MR_MAP_THRESHOLD: 500,
        SS_THRESHOLD: 200,
        SEARCH_COST: 10,
        RECORD_CREATE_COST: 20,
        RECORD_LOAD_COST: 10,
        HTTP_COST: 10,
        FILE_COST: 20
    };

    return {
        RECORD_TYPES: RECORD_TYPES,
        CONFIG_FIELDS: CONFIG_FIELDS,
        EMPLOYEE_FIELDS: EMPLOYEE_FIELDS,
        UBER_LINE_FIELDS: UBER_LINE_FIELDS,
        UBER_CODE_OVERRIDE: UBER_CODE_OVERRIDE,
        LOG_FIELDS: LOG_FIELDS,
        LOG_EVENT_TYPES: LOG_EVENT_TYPES,
        BOOKING_MAP_FIELDS: BOOKING_MAP_FIELDS,
        BOOKING_MAP_STATUS: BOOKING_MAP_STATUS,
        BOOKING_TYPES: BOOKING_TYPES,
        EXCLUDED_STATUSES: EXCLUDED_STATUSES,
        EXPENSE: EXPENSE,
        TRIP_PROJECT_OVERRIDE: TRIP_PROJECT_OVERRIDE,
        NAVAN_API: NAVAN_API,
        RELAY_RUN_FIELDS: RELAY_RUN_FIELDS,
        UBER_WATCHDOG: UBER_WATCHDOG,
        GOVERNANCE: GOVERNANCE
    };
});
