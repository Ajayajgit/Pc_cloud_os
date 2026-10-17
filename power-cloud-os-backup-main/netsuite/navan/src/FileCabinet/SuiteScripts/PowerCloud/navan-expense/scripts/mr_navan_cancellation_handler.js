/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Cancellation Handler. Polls Navan for canceled bookings
 *              and removes corresponding lines from draft expense reports.
 * @author Power Cloud Consulting
 */
define([
    'N/log',
    'N/record',
    'N/search',
    'N/runtime',
    'N/email',
    '../lib/powercloud_navan_constants',
    '../lib/powercloud_navan_config',
    '../lib/powercloud_navan_client',
    '../lib/powercloud_navan_logger'
], function (log, record, search, runtime, email, constants, config, navanClient, logger) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanCancellationHandler';

    /**
     * Polls Navan for canceled bookings and returns those with existing booking map records.
     * @returns {Array} Array of { bookingUuid, bookingMapId, expenseReportId, lineIndex } objects
     */
    function getInputData() {
        log.audit({ title: SCRIPT_NAME + ':getInputData', details: 'Starting cancellation processing' });

        let cfg;
        try {
            cfg = config.load();
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':getInputData', details: 'Config load failed: ' + e.message });
            return [];
        }

        // Calculate date window
        const now = new Date();
        const lookbackMs = cfg.lookbackDays * 24 * 60 * 60 * 1000;
        const fromDate = new Date(now.getTime() - lookbackMs);

        const updatedFrom = Math.floor(fromDate.getTime() / 1000);
        const updatedTo = Math.floor(now.getTime() / 1000);

        // Fetch canceled bookings from Navan
        let canceledBookings;
        try {
            canceledBookings = navanClient.getBookings({
                updatedFrom: updatedFrom,
                updatedTo: updatedTo,
                bookingStatus: 'CANCELED'
            });
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':getInputData', details: 'Navan API failed: ' + e.message });
            return [];
        }

        log.debug({ title: SCRIPT_NAME, details: 'Fetched ' + canceledBookings.length + ' canceled bookings' });

        // Look up booking map records for each canceled booking
        const cancellationsToProcess = [];

        canceledBookings.forEach(function (booking) {
            const mapResults = logger.findBookingMap(booking.uuid);

            if (!mapResults || mapResults.length === 0) {
                log.debug({ title: SCRIPT_NAME, details: 'No booking map for canceled booking: ' + booking.uuid });
                return;
            }

            const mapRecord = mapResults[0];
            const status = mapRecord.getValue(constants.BOOKING_MAP_FIELDS.STATUS);

            // Skip already-cancelled booking maps
            if (status === constants.BOOKING_MAP_STATUS.CANCELLED) {
                log.debug({ title: SCRIPT_NAME, details: 'Already cancelled: ' + booking.uuid });
                return;
            }

            cancellationsToProcess.push({
                bookingUuid: booking.uuid,
                tripUuid: booking.tripUuids ? booking.tripUuids[0] : '',
                bookingMapId: mapRecord.id,
                expenseReportId: parseInt(mapRecord.getValue(constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT), 10),
                lineIndex: parseInt(mapRecord.getValue(constants.BOOKING_MAP_FIELDS.LINE_INDEX), 10),
                bookingType: mapRecord.getValue(constants.BOOKING_MAP_FIELDS.BOOKING_TYPE),
                amount: parseFloat(mapRecord.getValue(constants.BOOKING_MAP_FIELDS.AMOUNT)) || 0
            });
        });

        log.audit({
            title: SCRIPT_NAME + ':getInputData',
            details: 'Cancellations to process: ' + cancellationsToProcess.length
        });

        return cancellationsToProcess;
    }

    /**
     * Processes a single cancellation: removes the expense line and updates the booking map.
     * @param {Object} context - Map/Reduce context
     */
    function map(context) {
        const data = JSON.parse(context.value);

        log.audit({
            title: SCRIPT_NAME + ':map',
            details: 'Processing cancellation for booking: ' + data.bookingUuid +
                     ', Expense Report: ' + data.expenseReportId + ', Line: ' + data.lineIndex
        });

        try {
            // Load the expense report to check its status
            const expReport = record.load({
                type: record.Type.EXPENSE_REPORT,
                id: data.expenseReportId,
                isDynamic: true
            });

            // Only modify open reports. NS standard `complete` flag is the source of truth.
            const isComplete = expReport.getValue({ fieldId: 'complete' }) === true;
            if (isComplete) {
                log.debug({
                    title: SCRIPT_NAME,
                    details: 'Expense report ' + data.expenseReportId + ' is complete, skipping line removal'
                });
                logger.updateBookingMapStatus(data.bookingMapId, constants.BOOKING_MAP_STATUS.CANCELLED);

                context.write({
                    key: data.bookingUuid,
                    value: JSON.stringify({ status: 'skipped', reason: 'Report already complete' })
                });
                return;
            }

            // Find the line matching this booking. Prefer amount + customer match (unique in most
            // cases under the find-or-create architecture); fall back to booking_map lineIndex.
            const lineCount = expReport.getLineCount({ sublistId: 'expense' });
            let lineRemoved = false;
            const targetAmount = parseFloat(data.amount);
            const matchByAmount = [];
            for (let i = 0; i < lineCount; i++) {
                const lineAmount = parseFloat(expReport.getSublistValue({ sublistId: 'expense', fieldId: 'amount', line: i }));
                if (!isNaN(targetAmount) && Math.abs(lineAmount - targetAmount) < 0.01) {
                    matchByAmount.push(i);
                }
            }

            let removeIndex = -1;
            if (matchByAmount.length === 1) {
                removeIndex = matchByAmount[0];
            } else if (matchByAmount.length > 1 && data.lineIndex >= 0 && matchByAmount.indexOf(data.lineIndex) > -1) {
                removeIndex = data.lineIndex;
            } else if (data.lineIndex >= 0 && data.lineIndex < lineCount) {
                removeIndex = data.lineIndex;
            }

            if (removeIndex >= 0) {
                expReport.removeLine({ sublistId: 'expense', line: removeIndex });
                lineRemoved = true;
                log.debug({ title: SCRIPT_NAME, details: 'Removed line ' + removeIndex + ' from expense report ' + data.expenseReportId });
            }

            // Check if report now has 0 lines
            const remainingLines = expReport.getLineCount({ sublistId: 'expense' });

            if (remainingLines === 0) {
                // Delete the empty expense report
                log.audit({
                    title: SCRIPT_NAME,
                    details: 'Expense report ' + data.expenseReportId + ' has 0 lines after cancellation, deleting'
                });
                // Don't save — just delete
                record.delete({ type: record.Type.EXPENSE_REPORT, id: data.expenseReportId });

                // Update all booking maps for this trip to cancelled
                const tripMaps = logger.findBookingMapsByTrip(data.tripUuid);
                tripMaps.forEach(function (mapRec) {
                    logger.updateBookingMapStatus(mapRec.id, constants.BOOKING_MAP_STATUS.CANCELLED);
                });
            } else {
                expReport.save({ enableSourcing: true, ignoreMandatoryFields: false });
            }

            // Update this booking map status
            logger.updateBookingMapStatus(data.bookingMapId, constants.BOOKING_MAP_STATUS.CANCELLED);

            // Log the cancellation
            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.CANCELLATION,
                tripUuid: data.tripUuid,
                expenseReportId: data.expenseReportId,
                status: 'success',
                errorMessage: lineRemoved ? 'Line removed' : 'Line not found but map updated'
            });

            context.write({
                key: data.bookingUuid,
                value: JSON.stringify({
                    status: 'success',
                    lineRemoved: lineRemoved,
                    reportDeleted: remainingLines === 0
                })
            });

        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':map', details: 'Cancellation failed: ' + e.message });

            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.CANCELLATION,
                tripUuid: data.tripUuid,
                expenseReportId: data.expenseReportId,
                status: 'failed',
                errorMessage: e.message
            });

            context.write({
                key: data.bookingUuid,
                value: JSON.stringify({ status: 'failed', error: e.message })
            });
        }
    }

    /**
     * Summarizes cancellation results.
     * @param {Object} summary - Map/Reduce summary
     */
    function summarize(summary) {
        let successCount = 0;
        let failCount = 0;

        summary.output.iterator().each(function (key, value) {
            const result = JSON.parse(value);
            if (result.status === 'success') {
                successCount++;
            } else if (result.status === 'failed') {
                failCount++;
            }
            return true;
        });

        log.audit({
            title: SCRIPT_NAME + ':summarize',
            details: 'Complete. Success: ' + successCount + ', Failed: ' + failCount + ', Skipped: ' + (summary.output ? 0 : 0)
        });

        if (failCount > 0) {
            try {
                const cfg = config.load();
                if (cfg.alertEmail) {
                    const empResults = search.create({
                        type: 'employee',
                        filters: [['email', 'is', cfg.alertEmail]],
                        columns: ['internalid']
                    }).run().getRange({ start: 0, end: 1 });
                    if (empResults.length) {
                        email.send({
                            author: empResults[0].id,
                            recipients: cfg.alertEmail,
                            subject: '[PowerCloud] Navan Cancellation Handler - ' + failCount + ' Failure(s)',
                            body: 'Cancellation processing completed with ' + failCount + ' failure(s).\n' +
                                  'Successes: ' + successCount
                        });
                    } else {
                        log.error({ title: SCRIPT_NAME + ':summarize', details: 'No employee found with email ' + cfg.alertEmail });
                    }
                }
            } catch (e) {
                log.error({ title: SCRIPT_NAME + ':summarize', details: 'Alert email failed: ' + e.message });
            }
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        summarize: summarize
    };
});
