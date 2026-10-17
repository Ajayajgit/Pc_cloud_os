import crypto from 'node:crypto';
import { config } from './config.js';

/**
 * Posts one invoice PDF to the rl_navan_invoice_attach RESTlet using NetSuite
 * Token-Based Auth (OAuth 1.0a, HMAC-SHA256). Returns the parsed RESTlet response.
 *
 * @param {Object} params
 * @param {string} params.bookingUuid
 * @param {string} params.pdfBase64
 * @param {string} params.filename
 */
export async function postInvoice({ bookingUuid, pdfBase64, filename }) {
    const body = JSON.stringify({ bookingUuid, pdfBase64, filename });
    // NetSuite's per-account web-services concurrency is low; rapid RESTlet posts
    // get SSS_REQUEST_LIMIT_EXCEEDED. Retry that specific error with backoff,
    // re-signing each attempt (OAuth nonce + timestamp must be fresh).
    const maxAttempts = 6;
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const res = await fetch(config.netsuite.restletUrl, {
            method: 'POST',
            headers: {
                'Authorization': buildAuthHeader(config.netsuite.restletUrl),
                'Content-Type': 'application/json'
            },
            body
        });
        const text = await res.text();

        if (res.ok) {
            try { return JSON.parse(text); }
            catch { throw new Error(`NS RESTlet returned non-JSON: ${text.slice(0, 300)}`); }
        }

        if (/SSS_REQUEST_LIMIT_EXCEEDED/.test(text) && attempt < maxAttempts) {
            const waitMs = 2000 * Math.pow(2, attempt - 1); // 2,4,8,16,32s
            lastErr = `concurrency limit (attempt ${attempt}/${maxAttempts}), backing off ${waitMs}ms`;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
        }
        throw new Error(`NS RESTlet HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    throw new Error(`NS RESTlet still rate-limited after ${maxAttempts} attempts (${lastErr})`);
}

/**
 * Notifies NetSuite that the relay's Navan session is dead so it can email the
 * configured alert recipient. Best-effort: a single attempt, errors are swallowed
 * (the caller is already in a failure path and must not throw).
 * @param {string} message - human-readable reason for the alert
 */
export async function postAuthAlert(message) {
    const body = JSON.stringify({ action: 'auth_alert', message });
    try {
        const res = await fetch(config.netsuite.restletUrl, {
            method: 'POST',
            headers: {
                'Authorization': buildAuthHeader(),
                'Content-Type': 'application/json'
            },
            body
        });
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Posts parsed Uber transactions to the Uber attach RESTlet, in chunks to stay under the
 * RESTlet's governance ceiling (each dedup-skip is a search). NetSuite owns dedup, so the
 * caller can safely send the whole folder's worth of transactions every run.
 * @param {Array<Object>} transactions
 * @returns {Promise<{counts:Object, batches:number}>}
 */
export async function postUberTransactions(transactions) {
    const url = config.netsuite.uberRestletUrl;
    if (!url) {
        throw new Error('NS_UBER_RESTLET_URL is not configured');
    }
    const chunkSize = config.uber.postChunkSize;
    const totals = { created: 0, appended: 0, skipped: 0, failed: 0 };
    const results = [];
    let batches = 0;

    for (let i = 0; i < transactions.length; i += chunkSize) {
        const chunk = transactions.slice(i, i + chunkSize);
        const body = JSON.stringify({ run_id: 'uber_' + Date.now() + '_' + batches, transactions: chunk });
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': buildAuthHeader(url),
                'Content-Type': 'application/json'
            },
            body
        });
        const text = await res.text();
        if (!res.ok) {
            throw new Error(`Uber RESTlet HTTP ${res.status}: ${text.slice(0, 300)}`);
        }
        let parsed;
        try { parsed = JSON.parse(text); }
        catch { throw new Error(`Uber RESTlet returned non-JSON: ${text.slice(0, 300)}`); }
        if (parsed && parsed.counts) {
            totals.created += parsed.counts.created || 0;
            totals.appended += parsed.counts.appended || 0;
            totals.skipped += parsed.counts.skipped || 0;
            totals.failed += parsed.counts.failed || 0;
        }
        if (parsed && parsed.results) {
            for (const r of parsed.results) { results.push(r); }
        }
        batches++;
    }
    return { counts: totals, batches: batches, results: results };
}

/**
 * Generic POST to the Uber attach RESTlet for non-transaction actions (e.g. memo / receipt-url
 * rewrites). Retries SSS_REQUEST_LIMIT_EXCEEDED with exponential backoff (same pattern as
 * postInvoice); each attempt re-signs because OAuth nonce + timestamp must be fresh.
 */
export async function postUberRestlet(payload) {
    const url = config.netsuite.uberRestletUrl;
    if (!url) {
        throw new Error('NS_UBER_RESTLET_URL is not configured');
    }
    const body = JSON.stringify(payload);
    const maxAttempts = 6;
    let lastErr;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': buildAuthHeader(url),
                'Content-Type': 'application/json'
            },
            body
        });
        const text = await res.text();
        if (res.ok) {
            try { return JSON.parse(text); }
            catch { throw new Error('Uber RESTlet returned non-JSON: ' + text.slice(0, 400)); }
        }
        if (/SSS_REQUEST_LIMIT_EXCEEDED/.test(text) && attempt < maxAttempts) {
            const waitMs = 2000 * Math.pow(2, attempt - 1);
            lastErr = 'concurrency limit (attempt ' + attempt + '/' + maxAttempts + '), backing off ' + waitMs + 'ms';
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
        }
        throw new Error('Uber RESTlet HTTP ' + res.status + ': ' + text.slice(0, 400));
    }
    throw new Error('Uber RESTlet still rate-limited after ' + maxAttempts + ' attempts (' + lastErr + ')');
}

/**
 * Uber-poll check-in. ok=true stamps NetSuite's Uber Poll Last Check-in (a NetSuite watchdog
 * alerts when it goes stale); ok=false or any failures makes NetSuite email the alert address.
 * @param {{ok:boolean, error?:string, counts?:Object, failures?:Array<Object>}} status
 */
export async function postUberHeartbeat(status) {
    return postUberRestlet({ action: 'heartbeat', ...status });
}

// Builds a fresh NetSuite TBA OAuth 1.0a (HMAC-SHA256) Authorization header for a target URL.
function buildAuthHeader(restletUrl) {
    const ns = config.netsuite;
    const url = new URL(restletUrl);
    const oauthParams = {
        oauth_consumer_key: ns.consumerKey,
        oauth_nonce: crypto.randomBytes(16).toString('hex'),
        oauth_signature_method: 'HMAC-SHA256',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_token: ns.tokenId,
        oauth_version: '1.0'
    };
    // Include query-string params (script, deploy) in the signature base; not the body.
    const allParams = { ...oauthParams };
    for (const [k, v] of url.searchParams.entries()) { allParams[k] = v; }

    const baseString = [
        'POST',
        encodeRfc3986(`${url.origin}${url.pathname}`),
        encodeRfc3986(buildParamString(allParams))
    ].join('&');
    const signingKey = `${encodeRfc3986(ns.consumerSecret)}&${encodeRfc3986(ns.tokenSecret)}`;
    const signature = crypto.createHmac('sha256', signingKey).update(baseString).digest('base64');

    const headerParams = { ...oauthParams, oauth_signature: signature, realm: ns.accountId };
    return 'OAuth ' + Object.keys(headerParams)
        .map((k) => `${encodeRfc3986(k)}="${encodeRfc3986(headerParams[k])}"`)
        .join(', ');
}

// OAuth 1.0a parameter string: sorted, RFC3986-encoded key=value joined by &.
function buildParamString(params) {
    return Object.keys(params)
        .sort()
        .map((k) => `${encodeRfc3986(k)}=${encodeRfc3986(params[k])}`)
        .join('&');
}

function encodeRfc3986(str) {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
    );
}
