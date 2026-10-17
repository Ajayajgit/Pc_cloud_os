import pino from 'pino';
import { fetchUberTransactions } from './uber.js';
import { postUberTransactions, postUberHeartbeat } from './netsuite.js';
import { getUberSeen, markUberSeen } from './db.js';

const log = pino({ name: 'pc-navan-relay:uber-poll' });

/**
 * Daily Uber poll: pull every trip CSV from the SFTP folder, parse to transactions, filter out
 * ones already imported (local seen-set — immediately consistent, unlike NetSuite's lagging
 * custom-column search index), and POST the rest (chunked) to the Uber attach RESTlet. Late tips
 * arriving in older files are still caught because they're new Network Transaction Ids.
 * Ends every run with a heartbeat to NetSuite: a NetSuite watchdog alerts when check-ins stop
 * (e.g. NetSuite rejecting the token), and NetSuite emails per-ride failures right away.
 * Run by a systemd timer / cron.
 */
async function main() {
    const startedAt = Date.now();
    const transactions = await fetchUberTransactions();

    const seen = getUberSeen();
    const toSend = transactions.filter((t) => !seen.has(t.txnId));
    log.info({ parsed: transactions.length, alreadySeen: transactions.length - toSend.length, toSend: toSend.length }, 'dedup filter applied');

    if (toSend.length === 0) {
        log.info('nothing new to post');
        await postUberHeartbeat({ ok: true, counts: { created: 0, appended: 0, skipped: 0, failed: 0 }, failures: [] });
        return;
    }

    const { counts, batches, results } = await postUberTransactions(toSend);

    // Mark imported (success) and already-in-NetSuite (skipped) so we never resend them. Failures
    // are left unmarked so they retry next run (e.g. after an employee's Uber email is populated).
    const done = results.filter((r) => r.txnId && (r.status === 'success' || r.status === 'skipped')).map((r) => r.txnId);
    markUberSeen(done);

    const byTxnId = new Map(toSend.map((t) => [t.txnId, t]));
    const failures = results.filter((r) => r.status === 'failed').map((r) => {
        const t = byTxnId.get(r.txnId) || {};
        return { txnId: r.txnId, employeeEmail: t.employeeEmail, expenseDate: t.expenseDate, amountUsd: t.amountUsd, error: r.error };
    });
    for (const f of failures) {
        log.warn(f, 'uber ride failed to import');
    }

    log.info(
        { batches, counts, posted: toSend.length, marked: done.length, ms: Date.now() - startedAt },
        'uber poll complete'
    );

    await postUberHeartbeat({ ok: true, counts, failures });
}

main().catch(async (e) => {
    log.error({ err: e.message, stack: e.stack }, 'uber poll failed');
    // Best-effort immediate alert. If NetSuite itself is what's failing this can't land, and the
    // NetSuite watchdog alerts on the missed check-in instead.
    try {
        await postUberHeartbeat({ ok: false, error: e.message });
    } catch (hbErr) {
        log.error({ err: hbErr.message }, 'failure heartbeat could not reach NetSuite');
    }
    process.exit(1);
});
