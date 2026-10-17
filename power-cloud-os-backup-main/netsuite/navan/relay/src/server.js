import crypto from 'node:crypto';
import express from 'express';
import pinoHttp from 'pino-http';
import { config, assertServerConfig } from './config.js';
import { processRun } from './worker.js';
import { shutdown } from './navan.js';

assertServerConfig();

// Playwright's Chromium keeps the process alive, so close it on shutdown signals,
// otherwise systemd restarts hang until the stop timeout SIGKILLs us.
for (const sig of ['SIGTERM', 'SIGINT']) {
    process.on(sig, async () => {
        try { await shutdown(); } catch {}
        process.exit(0);
    });
}

const app = express();
app.use(pinoHttp());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'pc-navan-relay' });
});

/**
 * NetSuite posts a batch here. We authenticate with a shared bearer secret
 * (constant-time compared), accept the work, return 202 immediately, and process
 * the run in the background. The relay posts each PDF back to NS via TBA.
 */
app.post('/navan/invoices', (req, res) => {
    if (!verifySecret(req.get('X-PC-Secret'))) {
        return res.status(401).json({ error: 'unauthorized' });
    }

    const { run_id: runId, bookings } = req.body || {};
    if (!runId || !Array.isArray(bookings) || bookings.length === 0) {
        return res.status(400).json({ error: 'run_id and non-empty bookings[] required' });
    }

    res.status(202).json({ run_id: runId, accepted: bookings.length });

    // Fire-and-forget; processRun records its own progress in SQLite.
    processRun(runId, bookings).catch((e) => {
        req.log.error({ runId, err: e.message }, 'processRun crashed');
    });
});

function verifySecret(provided) {
    if (!provided) return false;
    const a = Buffer.from(provided);
    const b = Buffer.from(config.relaySecret);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

app.listen(config.port, '127.0.0.1', () => {
    // Bind to localhost only; Caddy terminates TLS and proxies to us.
    console.log(`pc-navan-relay listening on 127.0.0.1:${config.port}`);
});
