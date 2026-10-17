/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Expense Report Processor.
 *              Polls Navan for completed bookings and appends each to the appropriate
 *              open expense report (find-or-create by employee + project).
 * @author Power Cloud Consulting
 */
define([
    'N/log',
    'N/search',
    'N/email',
    'N/runtime',
    '../lib/powercloud_navan_constants',
    '../lib/powercloud_navan_config',
    '../lib/powercloud_navan_client',
    '../lib/powercloud_navan_employee',
    '../lib/powercloud_navan_expense_builder',
    '../lib/powercloud_navan_logger'
], function (log, search, email, runtime, constants, config, navanClient, employee, expenseBuilder, logger) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanExpenseProcessor';

    /**
     * Polls Navan for bookings eligible for import and returns one entry per booking.
     */
    function getInputData() {
        log.audit({ title: SCRIPT_NAME + ':getInputData', details: 'Starting Navan expense processing run' });

        let cfg;
        try {
            cfg = config.load();
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':getInputData', details: 'Config load failed: ' + e.message });
            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.AUTH_FAILURE,
                status: 'failed',
                errorMessage: 'Config load failed: ' + e.message
            });
            return [];
        }

        // Date window — by CREATION date, not modification date. Creation date is stable,
        // so a trip booked well in advance and never re-modified is still captured once its
        // travel completes. (Windowing by updatedFrom missed early-booked/unmodified trips.)
        // Use a generous window (>= 90 days) since trips are created before travel; dedup
        // (booking_map) + the "travel completed" filter keep re-scans idempotent.
        const now = new Date();
        const lookbackDays = Math.max(parseInt(cfg.lookbackDays, 10) || 0, 90);
        const fromDate = new Date(now.getTime() - lookbackDays * 24 * 60 * 60 * 1000);

        let allBookings;
        try {
            allBookings = navanClient.getBookings({
                createdFrom: Math.floor(fromDate.getTime() / 1000),
                createdTo: Math.floor(now.getTime() / 1000)
            });
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':getInputData', details: 'Navan API failed: ' + e.message });
            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.AUTH_FAILURE,
                status: 'failed',
                errorMessage: 'Navan API failed: ' + e.message
            });
            sendAlertEmail(cfg, 'Navan API Error', 'Failed to fetch bookings: ' + e.message);
            return [];
        }

        log.audit({
            title: SCRIPT_NAME + ':getInputData',
            details: 'Fetched ' + allBookings.length + ' bookings from Navan'
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter to eligible: not canceled/voided, completed travel, has $ on it.
        // No-project bookings ARE imported (customer left blank; an NS workflow assigns the
        // customer later) since Navan can't backfill billToClient after the fact.
        const eligible = [];
        let noProjectCount = 0;
        allBookings.forEach(function (booking) {
            if (constants.EXCLUDED_STATUSES.indexOf(booking.bookingStatus) > -1) {
                return;
            }
            if (!booking.endDate) {
                return;
            }
            const endDate = new Date(booking.endDate + 'T23:59:59');
            if (endDate >= today) {
                return; // Travel hasn't occurred yet.
            }
            const amount = parseFloat(booking.grandTotal) || 0;
            if (amount <= 0) {
                return;
            }
            if (!expenseBuilder.resolveProjectId(booking)) {
                noProjectCount++;
            }
            eligible.push(booking);
        });

        log.audit({
            title: SCRIPT_NAME + ':getInputData',
            details: 'Eligible: ' + eligible.length + ' (' + noProjectCount + ' with no project → blank customer)'
        });

        // Dedup: skip bookings already imported (booking_map exists for the booking UUID).
        const eligibleUuids = eligible.map(function (b) { return b.uuid; });
        const alreadyImported = findExistingBookingUuids(eligibleUuids);

        const toProcess = eligible.filter(function (b) {
            return alreadyImported.indexOf(b.uuid) === -1;
        });

        log.audit({
            title: SCRIPT_NAME + ':getInputData',
            details: 'To process: ' + toProcess.length + ' (' + alreadyImported.length + ' already imported)'
        });

        // Update last poll time
        config.updateLastPollTime(now.toISOString());

        return toProcess;
    }

    /**
     * Processes a single booking: resolves employee, find-or-create report, append line.
     */
    function map(context) {
        const booking = JSON.parse(context.value);

        log.audit({
            title: SCRIPT_NAME + ':map',
            details: 'Processing booking ' + booking.uuid + ' (' + booking.bookingType + ', $' + booking.grandTotal + ')'
        });

        try {
            const travelerEmail = getTravelerEmail(booking);
            if (!travelerEmail) {
                throw new Error('No traveler email in booking');
            }

            const emp = employee.findByEmail(travelerEmail);
            if (!emp) {
                throw new Error('Employee not found in NetSuite for email: ' + travelerEmail);
            }

            const result = expenseBuilder.processBooking({ booking: booking, employee: emp });
            if (!result) {
                context.write({
                    key: booking.uuid,
                    value: JSON.stringify({ status: 'skipped' })
                });
                return;
            }

            logger.createBookingMap({
                bookingUuid: booking.uuid,
                tripUuid: (booking.tripUuids || [])[0] || '',
                expenseReportId: result.expenseReportId,
                lineIndex: result.lineIndex,
                bookingType: result.bookingType,
                amount: result.amount,
                invoiceUrl: result.invoiceUrl
            });

            logger.createLog({
                eventType: result.action === 'created'
                    ? constants.LOG_EVENT_TYPES.EXPENSE_CREATE
                    : constants.LOG_EVENT_TYPES.APPENDED,
                tripUuid: (booking.tripUuids || [])[0] || '',
                employeeId: emp.id,
                expenseReportId: result.expenseReportId,
                status: 'success',
                bookingCount: 1,
                totalAmount: result.amount
            });

            context.write({
                key: booking.uuid,
                value: JSON.stringify({
                    status: 'success',
                    action: result.action,
                    expenseReportId: result.expenseReportId,
                    lineIndex: result.lineIndex,
                    amount: result.amount
                })
            });
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':map', details: 'Booking ' + booking.uuid + ' failed: ' + e.message });

            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.EXPENSE_CREATE,
                tripUuid: (booking.tripUuids || [])[0] || '',
                status: 'failed',
                errorMessage: e.message,
                rawPayload: {
                    bookingUuid: booking.uuid,
                    bookingId: booking.bookingId,
                    bookingType: booking.bookingType,
                    grandTotal: booking.grandTotal
                }
            });

            context.write({
                key: booking.uuid,
                value: JSON.stringify({ status: 'failed', error: e.message })
            });
        }
    }

    function summarize(summary) {
        let createdCount = 0;
        let appendedCount = 0;
        let skippedCount = 0;
        let failCount = 0;
        const failures = [];

        summary.output.iterator().each(function (key, value) {
            const result = JSON.parse(value);
            if (result.status === 'success') {
                if (result.action === 'appended') {
                    appendedCount++;
                } else {
                    createdCount++;
                }
            } else if (result.status === 'failed') {
                failCount++;
                failures.push({ bookingUuid: key, error: result.error });
            } else {
                skippedCount++;
            }
            return true;
        });

        log.audit({
            title: SCRIPT_NAME + ':summarize',
            details: 'Complete. Created: ' + createdCount +
                     ', Appended: ' + appendedCount +
                     ', Skipped: ' + skippedCount +
                     ', Failed: ' + failCount
        });

        if (summary.mapSummary && summary.mapSummary.errors) {
            summary.mapSummary.errors.iterator().each(function (key, error) {
                log.error({ title: SCRIPT_NAME + ':mapError', details: 'Key: ' + key + ', Error: ' + error });
                return true;
            });
        }

        if (failCount > 0) {
            try {
                const cfg = config.load();
                const body = 'Navan Expense Processor completed with ' + failCount + ' failure(s).\n\n' +
                    'Created: ' + createdCount + ', Appended: ' + appendedCount +
                    ', Skipped: ' + skippedCount + ', Failed: ' + failCount + '\n\n' +
                    'Failed bookings:\n' +
                    failures.map(function (f) { return '  - ' + f.bookingUuid + ': ' + f.error; }).join('\n');
                sendAlertEmail(cfg, 'Navan Expense Processor - ' + failCount + ' Failure(s)', body);
            } catch (e) {
                log.error({ title: SCRIPT_NAME + ':summarize', details: 'Alert email failed: ' + e.message });
            }
        }
    }

    // ---- Helpers ----

    function getTravelerEmail(booking) {
        if (booking.passengers && booking.passengers.length > 0 && booking.passengers[0].person) {
            return booking.passengers[0].person.email;
        }
        if (booking.booker && booking.booker.email) {
            return booking.booker.email;
        }
        return null;
    }

    /**
     * Returns the subset of booking UUIDs that already have a booking_map record.
     */
    function findExistingBookingUuids(bookingUuids) {
        if (!bookingUuids || bookingUuids.length === 0) {
            return [];
        }
        const existing = [];
        const batchSize = 50;
        for (let i = 0; i < bookingUuids.length; i += batchSize) {
            const batch = bookingUuids.slice(i, i + batchSize);

            const flatFilters = [];
            batch.forEach(function (uuid, idx) {
                if (idx > 0) {
                    flatFilters.push('OR');
                }
                flatFilters.push([constants.BOOKING_MAP_FIELDS.BOOKING_UUID, 'is', uuid]);
            });

            try {
                const bmSearch = search.create({
                    type: constants.RECORD_TYPES.BOOKING_MAP,
                    filters: flatFilters,
                    columns: [constants.BOOKING_MAP_FIELDS.BOOKING_UUID]
                });

                bmSearch.run().each(function (result) {
                    const uuid = result.getValue(constants.BOOKING_MAP_FIELDS.BOOKING_UUID);
                    if (uuid && existing.indexOf(uuid) === -1) {
                        existing.push(uuid);
                    }
                    return true;
                });
            } catch (e) {
                log.error({ title: SCRIPT_NAME + ':findExistingBookingUuids', details: e.message });
            }
        }
        return existing;
    }

    function sendAlertEmail(cfg, subject, body) {
        if (!cfg || !cfg.alertEmail) {
            return;
        }
        try {
            const empResults = search.create({
                type: 'employee',
                filters: [['email', 'is', cfg.alertEmail]],
                columns: ['internalid']
            }).run().getRange({ start: 0, end: 1 });
            if (!empResults.length) {
                log.error({ title: SCRIPT_NAME + ':sendAlertEmail', details: 'No employee found with email ' + cfg.alertEmail });
                return;
            }
            email.send({
                author: empResults[0].id,
                recipients: cfg.alertEmail,
                subject: '[PowerCloud] ' + subject,
                body: body
            });
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':sendAlertEmail', details: e.message });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        summarize: summarize
    };
});
