/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Invoice PDF Download and File Cabinet Upload
 * @author Power Cloud Consulting
 */
define([
    'N/file',
    'N/log',
    './powercloud_navan_constants',
    './powercloud_navan_config',
    './powercloud_navan_client'
], function (file, log, constants, config, navanClient) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanFileManager';

    /**
     * Downloads an invoice PDF from Navan and uploads it to the File Cabinet.
     * @param {Object} params
     * @param {string} params.invoiceUrl - Navan invoice URL
     * @param {string} params.bookingUuid - Booking UUID (used for filename)
     * @param {string} params.bookingType - FLIGHT/HOTEL/CAR
     * @param {string} params.tripUuid - Trip UUID (for folder organization)
     * @returns {number|null} File Cabinet file internal ID, or null on failure
     */
    function downloadAndUploadInvoice(params) {
        const cfg = config.load();

        if (!cfg.invoiceFolder) {
            log.error({ title: SCRIPT_NAME, details: 'Invoice folder not configured in Navan config record.' });
            return null;
        }

        if (!params.invoiceUrl) {
            log.debug({ title: SCRIPT_NAME, details: 'No invoice URL for booking: ' + params.bookingUuid });
            return null;
        }

        log.debug({ title: SCRIPT_NAME, details: 'Downloading invoice for booking: ' + params.bookingUuid });

        const response = navanClient.downloadFile(params.invoiceUrl);

        if (response.code === 404 || response.code === 403) {
            log.debug({
                title: SCRIPT_NAME,
                details: 'Invoice not available yet (HTTP ' + response.code + '). Booking: ' + params.bookingUuid
            });
            return null;
        }

        if (response.code !== 200) {
            log.error({
                title: SCRIPT_NAME,
                details: 'Invoice download failed. HTTP ' + response.code + '. Booking: ' + params.bookingUuid
            });
            return null;
        }

        // Determine file type from response headers or default to PDF
        const contentType = response.headers ? (response.headers['Content-Type'] || response.headers['content-type'] || '') : '';
        const isPdf = contentType.indexOf('pdf') > -1 || !contentType;
        const fileType = isPdf ? file.Type.PDF : file.Type.PLAINTEXT;
        const extension = isPdf ? '.pdf' : '.txt';

        const fileName = 'Navan_' + params.bookingType + '_' + params.bookingUuid.substring(0, 8) + extension;

        try {
            const invoiceFile = file.create({
                name: fileName,
                fileType: fileType,
                contents: response.body,
                folder: cfg.invoiceFolder
            });
            invoiceFile.isOnline = false;

            const fileId = invoiceFile.save();

            log.audit({
                title: SCRIPT_NAME,
                details: 'Invoice uploaded. File ID: ' + fileId + ', Name: ' + fileName
            });

            return fileId;
        } catch (e) {
            log.error({
                title: SCRIPT_NAME + ':uploadFailed',
                details: 'Booking: ' + params.bookingUuid + ', Error: ' + e.message
            });
            return null;
        }
    }

    return {
        downloadAndUploadInvoice: downloadAndUploadInvoice
    };
});
