import pino from 'pino';
import { createRun, markItem, finishRun } from './db.js';
import { getAuthenticatedContext, fetchInvoicePdf } from './navan.js';
import { postInvoice, postAuthAlert } from './netsuite.js';

const log = pino({ name: 'pc-navan-relay:worker' });

/**
 * Processes one run: logs into Navan once, then for each booking fetches the
 * invoice PDF and posts it to the NetSuite RESTlet. Failures are per-booking and
 * do not abort the run. Designed to be called fire-and-forget after the server
 * returns 202.
 *
 * @param {string} runId
 * @param {Array<{bookingUuid:string, invoiceUrl:string}>} bookings
 */
export async function processRun(runId, bookings) {
    createRun(runId, bookings);
    log.info({ runId, count: bookings.length }, 'run started');

    let context;
    try {
        context = await getAuthenticatedContext();
    } catch (e) {
        log.error({ runId, err: e.message }, 'Navan login failed; whole run aborted');
        for (const b of bookings) {
            markItem(runId, b.bookingUuid, 'failed', 'login failed: ' + e.message);
        }
        // Dead session needs a manual bootstrap — tell NetSuite to alert an operator.
        await postAuthAlert('Navan login failed for relay run ' + runId + ': ' + e.message);
        finishRun(runId);
        return;
    }

    let first = true;
    let successCount = 0;
    let sessionExpirySuspected = false;
    for (const booking of bookings) {
        // Space out RESTlet posts to stay under NetSuite's concurrency governance.
        if (!first) { await new Promise((r) => setTimeout(r, 2000)); }
        first = false;
        try {
            const { pdfBase64, filename } = await fetchInvoicePdf(context, booking);
            const result = await postInvoice({ bookingUuid: booking.bookingUuid, pdfBase64, filename });
            if (result && result.success) {
                successCount++;
                markItem(runId, booking.bookingUuid, 'success');
                log.info({ runId, booking: booking.bookingUuid, fileId: result.fileId }, 'attached');
            } else {
                markItem(runId, booking.bookingUuid, 'failed', (result && result.error) || 'unknown RESTlet error');
                log.warn({ runId, booking: booking.bookingUuid, result }, 'RESTlet rejected');
            }
        } catch (e) {
            // PDF not ready yet (timeout) is an expected transient — leave it for the next run.
            if (/session may be expired/.test(e.message)) { sessionExpirySuspected = true; }
            markItem(runId, booking.bookingUuid, 'failed', e.message);
            log.warn({ runId, booking: booking.bookingUuid, err: e.message }, 'booking failed');
        }
    }

    await context.close();
    finishRun(runId);
    log.info({ runId, successCount }, 'run finished');

    // Session passed the initial check but every fetch came back as login HTML — the
    // session is half-dead and needs a fresh bootstrap. Alert once for the whole run.
    if (sessionExpirySuspected && successCount === 0) {
        await postAuthAlert('Navan session appears expired for relay run ' + runId +
            ': all invoice fetches returned non-PDF (login) content.');
    }
}
