/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Invoice Attach RESTlet. Receives invoice PDFs from the
 *              PC Browser Relay and attaches them to expense report lines. The relay sends
 *              one POST per PDF: { bookingUuid, pdfBase64, filename }. Expense report + line
 *              are resolved from the booking map (single source of truth), not trusted from
 *              the request.
 * @author Power Cloud Consulting
 */
define([
    'N/log',
    'N/file',
    'N/record',
    'N/email',
    'N/search',
    '../lib/powercloud_navan_constants',
    '../lib/powercloud_navan_config',
    '../lib/powercloud_navan_logger'
], function (log, file, record, email, search, constants, config, logger) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanInvoiceAttach';

    /**
     * POST handler. Either attaches one invoice PDF to its expense report line, or
     * (when body.action === 'auth_alert') raises a Navan session-expiry alert so an
     * operator can re-run the relay's ~2-minute session bootstrap.
     * @param {Object} body - { bookingUuid, pdfBase64, filename } | { action:'auth_alert', message }
     * @returns {Object} { success, fileId?, expenseReportId?, error? }
     */
    function post(body) {
        if (body && body.action === 'auth_alert') {
            return handleAuthAlert(body);
        }

        const bookingUuid = body && body.bookingUuid;
        const pdfBase64 = body && body.pdfBase64;

        if (!bookingUuid || !pdfBase64) {
            return { success: false, error: 'Missing bookingUuid or pdfBase64' };
        }

        try {
            const bmResults = logger.findBookingMap(bookingUuid);
            if (!bmResults || bmResults.length === 0) {
                return { success: false, error: 'No booking map found for ' + bookingUuid };
            }
            const bm = bmResults[0];
            const expenseReportId = parseInt(bm.getValue(constants.BOOKING_MAP_FIELDS.EXPENSE_REPORT), 10);
            const lineIndex = parseInt(bm.getValue(constants.BOOKING_MAP_FIELDS.LINE_INDEX), 10);

            const cfg = config.load();
            if (!cfg.invoiceFolder) {
                return { success: false, error: 'Invoice folder not configured (custrecord_navan_invoice_folder)' };
            }

            const filename = (body.filename || (bookingUuid + '.pdf')).replace(/[^\w.\-]/g, '_');
            const pdfFile = file.create({
                name: filename,
                fileType: file.Type.PDF,
                contents: pdfBase64,
                folder: cfg.invoiceFolder
            });
            const fileId = pdfFile.save();

            attachInvoiceToExpenseLine(expenseReportId, lineIndex, fileId);
            logger.updateBookingMapInvoice(bm.id, fileId);

            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.INVOICE_DOWNLOAD,
                expenseReportId: expenseReportId,
                status: 'success'
            });

            log.audit({
                title: SCRIPT_NAME,
                details: 'Attached invoice for booking ' + bookingUuid + ' (file ' + fileId +
                         ') to ER ' + expenseReportId + ' line ' + lineIndex
            });

            return { success: true, fileId: fileId, expenseReportId: expenseReportId };
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'Attach failed for ' + bookingUuid + ': ' + e.message });
            logger.createLog({
                eventType: constants.LOG_EVENT_TYPES.INVOICE_DOWNLOAD,
                status: 'failed',
                errorMessage: 'Booking ' + bookingUuid + ': ' + e.message
            });
            return { success: false, error: e.message };
        }
    }

    /**
     * Handles a relay session-expiry alert: records an AUTH_FAILURE log and emails the
     * configured alert recipient so they can re-run the relay session bootstrap. The
     * relay's own Navan login is dead at this point, but its NetSuite TBA auth is
     * independent, so this RESTlet call still succeeds.
     * @param {Object} body - { action:'auth_alert', message }
     * @returns {Object} { success }
     */
    function handleAuthAlert(body) {
        const message = (body && body.message) || 'Navan relay session expired';
        log.error({ title: SCRIPT_NAME + ':authAlert', details: message });

        logger.createLog({
            eventType: constants.LOG_EVENT_TYPES.AUTH_FAILURE,
            status: 'failed',
            errorMessage: message
        });

        try {
            const cfg = config.load();
            sendAlertEmail(cfg, 'Navan Relay Session Expired',
                'The PC Browser Relay could not authenticate to Navan and aborted its invoice run.\n\n' +
                'Detail: ' + message + '\n\n' +
                'Action required: re-run the ~2-minute relay session bootstrap (see relay/README.md ' +
                '"Session bootstrap"). Invoices will keep retrying on the next scheduled run once the ' +
                'session is restored.');
        } catch (e) {
            log.error({ title: SCRIPT_NAME + ':authAlert', details: 'Alert email failed: ' + e.message });
        }

        return { success: true };
    }

    /**
     * Sends an alert email to the configured recipient, authored by the employee whose
     * email matches cfg.alertEmail (email.send requires a real author, not the system user).
     */
    function sendAlertEmail(cfg, subject, body) {
        if (!cfg || !cfg.alertEmail) {
            return;
        }
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
    }

    /**
     * Attaches a File Cabinet file to an expense report line and marks receipt=true.
     */
    function attachInvoiceToExpenseLine(expenseReportId, lineIndex, fileId) {
        const expReport = record.load({
            type: record.Type.EXPENSE_REPORT,
            id: expenseReportId,
            isDynamic: true
        });
        expReport.selectLine({ sublistId: 'expense', line: lineIndex });
        expReport.setCurrentSublistValue({ sublistId: 'expense', fieldId: 'expmediaitem', value: fileId });
        expReport.setCurrentSublistValue({ sublistId: 'expense', fieldId: 'receipt', value: true });
        expReport.commitLine({ sublistId: 'expense' });
        expReport.save({ enableSourcing: true, ignoreMandatoryFields: false });
    }

    return {
        post: post
    };
});
