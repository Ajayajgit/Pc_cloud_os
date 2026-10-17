/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Integration Logger and Booking Map CRUD
 * @author Power Cloud Consulting
 */
define([
    'N/record',
    'N/search',
    'N/log',
    './powercloud_navan_constants'
], function (record, search, log, constants) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanLogger';

    /**
     * Creates an integration log entry.
     * @param {Object} params
     * @param {string} params.eventType - LOG_EVENT_TYPES value
     * @param {string} [params.tripUuid]
     * @param {string} [params.employeeId]
     * @param {string} [params.expenseReportId]
     * @param {string} params.status - success/failed/skipped
     * @param {number} [params.bookingCount]
     * @param {number} [params.totalAmount]
     * @param {string} [params.errorMessage]
     * @param {string} [params.rawPayload]
     * @returns {number} Log record internal ID
     */
    function createLog(params) {
        try {
            const logRec = record.create({ type: constants.RECORD_TYPES.INTEGRATION_LOG });

            logRec.setValue({ fieldId: constants.LOG_FIELDS.EVENT_TYPE, value: params.eventType });
            logRec.setValue({ fieldId: constants.LOG_FIELDS.STATUS, value: params.status });
            logRec.setValue({ fieldId: constants.LOG_FIELDS.TIMESTAMP, value: new Date() });

            if (params.tripUuid) {
                logRec.setValue({ fieldId: constants.LOG_FIELDS.TRIP_UUID, value: params.tripUuid });
            }
            if (params.employeeId) {
                logRec.setValue({ fieldId: constants.LOG_FIELDS.EMPLOYEE, value: params.employeeId });
            }
            if (params.expenseReportId) {
                logRec.setValue({ fieldId: constants.LOG_FIELDS.EXPENSE_REPORT, value: params.expenseReportId });
            }
            if (params.bookingCount) {
                logRec.setValue({ fieldId: constants.LOG_FIELDS.BOOKING_COUNT, value: params.bookingCount });
            }
            if (params.totalAmount) {
                logRec.setValue({ fieldId: constants.LOG_FIELDS.TOTAL_AMOUNT, value: params.totalAmount });
            }
            if (params.errorMessage) {
                logRec.setValue({ fieldId: constants.LOG_FIELDS.ERROR_MESSAGE, value: params.errorMessage });
            }
            if (params.rawPayload) {
                const payload = typeof params.rawPayload === 'string'
                    ? params.rawPayload
                    : JSON.stringify(params.rawPayload);
                logRec.setValue({ fieldId: constants.LOG_FIELDS.RAW_PAYLOAD, value: payload.substring(0, 100000) });
            }

            return logRec.save();
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':createLog', details: e.message });
            return null;
        }
    }

    /**
     * Creates a booking map record linking a Navan booking to an expense report line.
     * @param {Object} params
     * @param {string} params.bookingUuid
     * @param {string} params.tripUuid
     * @param {number} params.expenseReportId
     * @param {number} params.lineIndex
     * @param {string} params.bookingType
     * @param {number} [params.amount]
     * @param {string} [params.invoiceUrl]
     * @returns {number} Booking map record internal ID
     */
    function createBookingMap(params) {
        const bmRec = record.create({ type: constants.RECORD_TYPES.BOOKING_MAP });

        bmRec.setValue({ fieldId: 'name', value: (params.bookingUuid || 'unknown').substring(0, 250) });

        bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.BOOKING_UUID, value: params.bookingUuid });
        bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.TRIP_UUID, value: params.tripUuid });
        bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT, value: params.expenseReportId });
        bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.LINE_INDEX, value: params.lineIndex });
        bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.BOOKING_TYPE, value: params.bookingType });
        bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.STATUS, value: constants.BOOKING_MAP_STATUS.ACTIVE });

        if (params.amount) {
            bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.AMOUNT, value: params.amount });
        }
        if (params.invoiceUrl) {
            bmRec.setValue({ fieldId: constants.BOOKING_MAP_FIELDS.INVOICE_URL, value: params.invoiceUrl });
        }

        return bmRec.save();
    }

    /**
     * Searches for booking map records by booking UUID.
     * @param {string} bookingUuid
     * @returns {Array} Booking map search results
     */
    function findBookingMap(bookingUuid) {
        const bmSearch = search.create({
            type: constants.RECORD_TYPES.BOOKING_MAP,
            filters: [
                [constants.BOOKING_MAP_FIELDS.BOOKING_UUID, 'is', bookingUuid]
            ],
            columns: [
                constants.BOOKING_MAP_FIELDS.TRIP_UUID,
                constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT,
                constants.BOOKING_MAP_FIELDS.LINE_INDEX,
                constants.BOOKING_MAP_FIELDS.BOOKING_TYPE,
                constants.BOOKING_MAP_FIELDS.AMOUNT,
                constants.BOOKING_MAP_FIELDS.STATUS,
                constants.BOOKING_MAP_FIELDS.INVOICE_FILE_ID
            ]
        });

        return bmSearch.run().getRange({ start: 0, end: 10 });
    }

    /**
     * Searches for booking map records by trip UUID.
     * @param {string} tripUuid
     * @returns {Array} Booking map search results
     */
    function findBookingMapsByTrip(tripUuid) {
        const bmSearch = search.create({
            type: constants.RECORD_TYPES.BOOKING_MAP,
            filters: [
                [constants.BOOKING_MAP_FIELDS.TRIP_UUID, 'is', tripUuid],
                'AND',
                [constants.BOOKING_MAP_FIELDS.STATUS, 'is', constants.BOOKING_MAP_STATUS.ACTIVE]
            ],
            columns: [
                constants.BOOKING_MAP_FIELDS.BOOKING_UUID,
                constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT,
                constants.BOOKING_MAP_FIELDS.LINE_INDEX,
                constants.BOOKING_MAP_FIELDS.BOOKING_TYPE,
                constants.BOOKING_MAP_FIELDS.AMOUNT
            ]
        });

        return bmSearch.run().getRange({ start: 0, end: 100 });
    }

    /**
     * Updates a booking map record status.
     * @param {number} recordId - Booking map internal ID
     * @param {string} status - New status value
     */
    function updateBookingMapStatus(recordId, status) {
        record.submitFields({
            type: constants.RECORD_TYPES.BOOKING_MAP,
            id: recordId,
            values: {
                [constants.BOOKING_MAP_FIELDS.STATUS]: status
            }
        });
    }

    /**
     * Updates the invoice file ID on a booking map record.
     * @param {number} recordId - Booking map internal ID
     * @param {number} fileId - File Cabinet file internal ID
     */
    function updateBookingMapInvoice(recordId, fileId) {
        record.submitFields({
            type: constants.RECORD_TYPES.BOOKING_MAP,
            id: recordId,
            values: {
                [constants.BOOKING_MAP_FIELDS.INVOICE_FILE_ID]: fileId
            }
        });
    }

    /**
     * Finds booking maps where invoice has not been downloaded yet.
     * @returns {Array} Booking map search results
     */
    function findBookingsMissingInvoice() {
        const bmSearch = search.create({
            type: constants.RECORD_TYPES.BOOKING_MAP,
            filters: [
                [constants.BOOKING_MAP_FIELDS.STATUS, 'is', constants.BOOKING_MAP_STATUS.ACTIVE],
                'AND',
                [constants.BOOKING_MAP_FIELDS.INVOICE_URL, 'isnotempty', ''],
                'AND',
                [constants.BOOKING_MAP_FIELDS.INVOICE_FILE_ID, 'isempty', '']
            ],
            columns: [
                constants.BOOKING_MAP_FIELDS.BOOKING_UUID,
                constants.BOOKING_MAP_FIELDS.TRIP_UUID,
                constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT,
                constants.BOOKING_MAP_FIELDS.LINE_INDEX,
                constants.BOOKING_MAP_FIELDS.BOOKING_TYPE,
                constants.BOOKING_MAP_FIELDS.INVOICE_URL
            ]
        });

        return bmSearch.run().getRange({ start: 0, end: 1000 });
    }

    return {
        createLog: createLog,
        createBookingMap: createBookingMap,
        findBookingMap: findBookingMap,
        findBookingMapsByTrip: findBookingMapsByTrip,
        updateBookingMapStatus: updateBookingMapStatus,
        updateBookingMapInvoice: updateBookingMapInvoice,
        findBookingsMissingInvoice: findBookingsMissingInvoice
    };
});
