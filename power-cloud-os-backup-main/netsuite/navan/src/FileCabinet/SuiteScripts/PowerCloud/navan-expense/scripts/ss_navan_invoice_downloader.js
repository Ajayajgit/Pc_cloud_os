/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Invoice Push. Finds booking-map rows whose invoice PDF
 *              has not yet been attached and pushes a batch to the PC Browser Relay. The
 *              relay logs into Navan with a real browser, captures each PDF, and posts it
 *              back to the rl_navan_invoice_attach RESTlet (which does the actual attach).
 *
 *              This replaces the old in-NetSuite download path: Navan's invoice URL returns
 *              SPA HTML, not a PDF, so it can only be retrieved from a real browser session.
 *
 * @author Power Cloud Consulting
 */
define([
    'N/log',
    'N/https',
    'N/record',
    '../lib/powercloud_navan_constants',
    '../lib/powercloud_navan_config',
    '../lib/powercloud_navan_logger'
], function (log, https, record, constants, config, logger) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanInvoicePush';
    const RELAY_ENDPOINT = '/navan/invoices';

    /**
     * Main entry point. Builds a batch of bookings missing invoices and POSTs it to the relay.
     * @param {Object} context - Scheduled script context
     */
    function execute(context) {
        log.audit({ title: SCRIPT_NAME, details: 'Starting invoice push run' });

        let cfg;
        try {
            cfg = config.load();
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'Config load failed: ' + e.message });
            return;
        }

        if (!cfg.relayUrl || !cfg.relaySecret) {
            log.audit({ title: SCRIPT_NAME, details: 'Relay URL or shared secret not configured. Nothing to do.' });
            return;
        }

        const bookings = logger.findBookingsMissingInvoice();
        if (!bookings || bookings.length === 0) {
            log.audit({ title: SCRIPT_NAME, details: 'No bookings missing invoices. Done.' });
            return;
        }

        const runId = 'run_' + Date.now();
        const batch = bookings.map(function (bm) {
            return {
                bookingUuid: bm.getValue(constants.BOOKING_MAP_FIELDS.BOOKING_UUID),
                expenseReportId: parseInt(bm.getValue(constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT), 10),
                lineIndex: parseInt(bm.getValue(constants.BOOKING_MAP_FIELDS.LINE_INDEX), 10),
                invoiceUrl: bm.getValue(constants.BOOKING_MAP_FIELDS.INVOICE_URL),
                bookingType: bm.getValue(constants.BOOKING_MAP_FIELDS.BOOKING_TYPE)
            };
        });

        const relayRunId = createRelayRun(runId, batch.length);
        const payload = JSON.stringify({ run_id: runId, bookings: batch });
        const url = cfg.relayUrl.replace(/\/+$/, '') + RELAY_ENDPOINT;

        log.audit({ title: SCRIPT_NAME, details: 'Pushing ' + batch.length + ' bookings to relay (' + runId + ')' });

        try {
            const response = https.post({
                url: url,
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'X-PC-Secret': cfg.relaySecret,
                    'X-PC-Run-Id': runId
                }
            });

            if (response.code === 202 || response.code === 200) {
                updateRelayRun(relayRunId, { status: 'accepted' });
                log.audit({ title: SCRIPT_NAME, details: 'Relay accepted run ' + runId + ' (HTTP ' + response.code + ')' });
            } else {
                updateRelayRun(relayRunId, { status: 'rejected:' + response.code });
                log.error({ title: SCRIPT_NAME, details: 'Relay rejected run ' + runId + '. HTTP ' + response.code + ': ' + response.body });
            }
        } catch (e) {
            updateRelayRun(relayRunId, { status: 'error' });
            log.error({ title: SCRIPT_NAME, details: 'Relay POST failed for run ' + runId + ': ' + e.message });
        }
    }

    /**
     * Creates a relay-run audit record. Per-PDF results are recorded by the RESTlet as the
     * relay posts each invoice back.
     * @returns {number} relay_run record internal ID
     */
    function createRelayRun(runId, requestedCount) {
        try {
            const rec = record.create({ type: constants.RECORD_TYPES.RELAY_RUN });
            rec.setValue({ fieldId: constants.RELAY_RUN_FIELDS.RUN_ID, value: runId });
            rec.setValue({ fieldId: constants.RELAY_RUN_FIELDS.STARTED, value: new Date() });
            rec.setValue({ fieldId: constants.RELAY_RUN_FIELDS.REQUESTED_COUNT, value: requestedCount });
            rec.setValue({ fieldId: constants.RELAY_RUN_FIELDS.STATUS, value: 'sent' });
            return rec.save();
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':createRelayRun', details: e.message });
            return null;
        }
    }

    function updateRelayRun(relayRunId, values) {
        if (!relayRunId) {
            return;
        }
        try {
            const fieldValues = {};
            if (values.status) {
                fieldValues[constants.RELAY_RUN_FIELDS.STATUS] = values.status;
            }
            fieldValues[constants.RELAY_RUN_FIELDS.FINISHED] = new Date();
            record.submitFields({
                type: constants.RECORD_TYPES.RELAY_RUN,
                id: relayRunId,
                values: fieldValues
            });
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':updateRelayRun', details: e.message });
        }
    }

    return {
        execute: execute
    };
});
