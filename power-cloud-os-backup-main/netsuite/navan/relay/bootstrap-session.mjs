/**
 * One-time (re-)bootstrap of the Navan browser session for the relay.
 *
 * Navan triggers new-device email verification (Descope magic link) from the
 * relay's datacenter IP. The link is BROWSER-BOUND: it must be opened in the same
 * browser that initiated the login (confirmed 2026-05-28: clicking it elsewhere
 * gives "not the same browser you tried to log in from"). So this tool logs in
 * headless from the box, parks, and waits for the link URL to be dropped into
 * /tmp/magic_link.txt. A human COPIES the link from the relay@ email WITHOUT
 * clicking it (clicking burns the token + wrong-browsers it), and this same box
 * session opens it -> completes -> caches the storageState for reuse.
 *
 * Run as the pcrelay user with the relay EnvironmentFile so NAVAN_* + DB_PATH load.
 */
import { chromium } from 'playwright';
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { config } from './src/config.js';
import { saveSession } from './src/db.js';

const LINK_FILE = '/tmp/magic_link.txt';
const APP_RE = /app\.navan\.com\/app\//;

// Clear any stale link from a prior run so we never open a dead link.
try { unlinkSync(LINK_FILE); } catch {}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext();
const page = await ctx.newPage();

try {
    await page.goto('https://app.navan.com/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /email/i }).fill(config.navan.email);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('textbox', { name: /password/i }).fill(config.navan.password);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.waitForTimeout(4000);
    console.log('STEP: parked (this is browser B) at', page.url());
    console.log('Waiting for the COPIED magic-link URL in', LINK_FILE, '(do NOT click the link in email)...');

    let link = null;
    for (let i = 0; i < 156; i++) { // ~13 min
        if (existsSync(LINK_FILE)) {
            link = readFileSync(LINK_FILE, 'utf8').trim();
            try { unlinkSync(LINK_FILE); } catch {}
            break;
        }
        await new Promise((r) => setTimeout(r, 5000));
    }
    if (!link) {
        console.error('RESULT: TIMEOUT - no link provided within the window');
        process.exit(1);
    }

    // Keep the poller page (P1) alive; open the link in a SECOND tab of the SAME
    // browser so Descope completes the flow execution and P1 advances to the app.
    console.log('STEP: opening link in a 2nd tab; poller (P1) stays alive...');
    const linkPage = await ctx.newPage();
    await linkPage.goto(link, { waitUntil: 'domcontentloaded' }).catch((e) => console.log('linkPage nav note:', e.message));

    let landed = false;
    for (let i = 0; i < 40; i++) { // up to ~2 min
        for (const p of [page, linkPage]) {
            try { await p.getByRole('button', { name: /continue without passkeys/i }).click({ timeout: 800 }); } catch {}
            if (APP_RE.test(p.url())) { landed = true; break; }
        }
        if (landed) break;
        await page.waitForTimeout(3000);
    }

    console.log('STEP: poller(P1) url =', page.url());
    console.log('STEP: linkTab url   =', linkPage.url());

    if (!landed) {
        console.error('RESULT: did not reach app');
        process.exit(2);
    }

    // Settle the session: the app URL we first see is .../auth/callback?code=...,
    // which still has to exchange the OAuth code for real session tokens. Wait for
    // that to finish, then navigate to the app home and confirm we are NOT bounced
    // back to login BEFORE caching the storageState.
    const appPage = APP_RE.test(linkPage.url()) ? linkPage : page;
    await appPage.waitForLoadState('networkidle').catch(() => {});
    await appPage.waitForTimeout(5000);
    try { await appPage.getByRole('button', { name: /continue without passkeys/i }).click({ timeout: 1500 }); } catch {}
    await appPage.goto('https://app.navan.com/app/liquid/home', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await appPage.waitForTimeout(6000);
    console.log('STEP: settle url =', appPage.url());

    if (appPage.url().includes('login.navan.com')) {
        console.error('RESULT: session did not fully establish (bounced to login)');
        process.exit(2);
    }
    await saveSession(await ctx.storageState());
    console.log('RESULT: SUCCESS - session fully established + cached');
} finally {
    await browser.close();
}
