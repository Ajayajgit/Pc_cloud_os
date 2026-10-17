import { chromium } from 'playwright';
import { authenticator } from 'otplib';
import { config } from './config.js';
import { loadSession, saveSession } from './db.js';

const NAVAN_BASE = 'https://app.navan.com';
// Confirmed 2026-05-28 (live recon): navigating an authenticated browser to this
// URL makes the SPA fetch the invoice and auto-trigger a PDF *download*. The SPA
// internally calls /api/v1/invoicesinternal/download/{uuid} with its own auth
// headers (JWT + same-origin); calling that endpoint directly via the request API
// returns 401, so we drive it through the page and capture the download instead.
const itineraryFileUrl = (uuid) => `${NAVAN_BASE}/itineraryfiles/bookings/${uuid}/invoice`;

let browser;

async function getBrowser() {
    if (!browser) {
        browser = await chromium.launch({
            headless: true,
            // --disable-dev-shm-usage: VPS /dev/shm is tiny (64MB) and crashes Chromium.
            args: ['--no-sandbox', '--disable-dev-shm-usage']
        });
    }
    return browser;
}

/**
 * Returns a Navan-authenticated browser context. Reuses the cached session
 * (storageState) if still valid; otherwise logs in fresh and caches it.
 */
export async function getAuthenticatedContext() {
    const b = await getBrowser();
    const stored = loadSession();
    let context = await b.newContext(stored ? { storageState: stored } : {});

    if (stored && (await sessionValid(context))) {
        return context;
    }

    // No/expired session: log in fresh.
    await context.close();
    context = await b.newContext();
    const page = await context.newPage();
    try {
        await login(page);
        await saveSession(await context.storageState());
    } finally {
        await page.close();
    }
    return context;
}

async function sessionValid(context) {
    const page = await context.newPage();
    try {
        await page.goto(`${NAVAN_BASE}/app/liquid/home`, { waitUntil: 'domcontentloaded' });
        // The SPA shell can load before its client-side auth check redirects to
        // login, so a short wait gives false positives. Wait for the redirect to
        // settle (networkidle + a generous pause), then confirm we're not on login.
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.waitForTimeout(6000);
        return !page.url().includes('login.navan.com');
    } catch {
        return false;
    } finally {
        await page.close();
    }
}

/**
 * Auth0 identifier-first login, confirmed against the live flow 2026-05-28:
 *   email -> Continue -> password -> Continue -> "Continue without passkeys" -> app
 */
async function login(page) {
    await page.goto(`${NAVAN_BASE}/`, { waitUntil: 'domcontentloaded' });

    await page.getByRole('textbox', { name: /email/i }).fill(config.navan.email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await page.getByRole('textbox', { name: /password/i }).fill(config.navan.password);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    if (config.navan.totpSecret) {
        try {
            const code = authenticator.generate(config.navan.totpSecret);
            await page.getByRole('textbox', { name: /code/i }).fill(code, { timeout: 8000 });
            await page.getByRole('button', { name: 'Continue', exact: true }).click();
        } catch { /* MFA not prompted */ }
    }

    // Passkey-enrollment interstitial appears after password; skip it if shown.
    try {
        await page.getByRole('button', { name: /continue without passkeys/i }).click({ timeout: 10000 });
    } catch { /* not shown */ }

    await page.waitForURL(/app\.navan\.com\/app\//, { timeout: 25000 });
}

/**
 * Fetches the invoice PDF for a booking as base64, using the authenticated
 * context's cookies (no page navigation needed). Guards against a stale session
 * silently returning an HTML login page instead of a PDF.
 * @returns {Promise<{ pdfBase64: string, filename: string }>}
 */
export async function fetchInvoicePdf(context, booking) {
    const page = await context.newPage();
    try {
        const downloadPromise = page.waitForEvent('download', { timeout: config.pdfWaitTimeoutMs });
        // The navigation is interrupted once the download starts, which throws
        // "Download is starting" — expected, so swallow goto errors and rely on the event.
        await page.goto(itineraryFileUrl(booking.bookingUuid), { waitUntil: 'domcontentloaded' }).catch(() => {});
        const download = await downloadPromise;

        const stream = await download.createReadStream();
        const chunks = [];
        for await (const chunk of stream) { chunks.push(chunk); }
        const buffer = Buffer.concat(chunks);

        if (buffer.subarray(0, 5).toString() !== '%PDF-') {
            throw new Error(`invoice for ${booking.bookingUuid} is not a PDF — session may be expired`);
        }
        return { pdfBase64: buffer.toString('base64'), filename: `${booking.bookingUuid}.pdf` };
    } finally {
        await page.close();
    }
}

export async function shutdown() {
    if (browser) {
        await browser.close();
        browser = undefined;
    }
}
