import Database from 'better-sqlite3';
import { config } from './config.js';

const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS runs (
        run_id TEXT PRIMARY KEY,
        received_at TEXT NOT NULL,
        finished_at TEXT,
        requested INTEGER NOT NULL DEFAULT 0,
        success INTEGER NOT NULL DEFAULT 0,
        failed INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'queued'
    );

    CREATE TABLE IF NOT EXISTS run_items (
        run_id TEXT NOT NULL,
        booking_uuid TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        error TEXT,
        PRIMARY KEY (run_id, booking_uuid)
    );

    -- Single-row cookie jar: cached Navan browser session (storageState JSON).
    CREATE TABLE IF NOT EXISTS navan_session (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        storage_state TEXT,
        updated_at TEXT
    );

    -- Uber dedup seen-set: Network Transaction Ids already imported into NetSuite. This is the
    -- PRIMARY dedup (immediately consistent), since NetSuite's custom-column search index lags
    -- behind newly-created lines and can't be trusted for back-to-back runs.
    CREATE TABLE IF NOT EXISTS uber_seen (
        txn_id TEXT PRIMARY KEY,
        seen_at TEXT NOT NULL
    );
`);

export function createRun(runId, bookings) {
    const insertRun = db.prepare(
        'INSERT OR REPLACE INTO runs (run_id, received_at, requested, status) VALUES (?, ?, ?, ?)'
    );
    const insertItem = db.prepare(
        'INSERT OR REPLACE INTO run_items (run_id, booking_uuid, status) VALUES (?, ?, ?)'
    );
    const tx = db.transaction(() => {
        insertRun.run(runId, new Date().toISOString(), bookings.length, 'queued');
        for (const b of bookings) {
            insertItem.run(runId, b.bookingUuid, 'pending');
        }
    });
    tx();
}

export function markItem(runId, bookingUuid, status, error) {
    db.prepare(
        'UPDATE run_items SET status = ?, error = ? WHERE run_id = ? AND booking_uuid = ?'
    ).run(status, error || null, runId, bookingUuid);
}

export function finishRun(runId) {
    const counts = db.prepare(
        `SELECT
            SUM(status = 'success') AS success,
            SUM(status = 'failed') AS failed
         FROM run_items WHERE run_id = ?`
    ).get(runId);
    db.prepare(
        'UPDATE runs SET finished_at = ?, success = ?, failed = ?, status = ? WHERE run_id = ?'
    ).run(new Date().toISOString(), counts.success || 0, counts.failed || 0, 'done', runId);
}

/** Returns the set of Network Transaction Ids already imported into NetSuite. */
export function getUberSeen() {
    const rows = db.prepare('SELECT txn_id FROM uber_seen').all();
    return new Set(rows.map((r) => r.txn_id));
}

/** Records Network Transaction Ids as imported so future runs skip them (idempotent). */
export function markUberSeen(txnIds) {
    if (!txnIds || txnIds.length === 0) {
        return;
    }
    const insert = db.prepare('INSERT OR IGNORE INTO uber_seen (txn_id, seen_at) VALUES (?, ?)');
    const now = new Date().toISOString();
    const tx = db.transaction(() => {
        for (const id of txnIds) { insert.run(id, now); }
    });
    tx();
}

export function loadSession() {
    const row = db.prepare('SELECT storage_state FROM navan_session WHERE id = 1').get();
    return row ? JSON.parse(row.storage_state) : null;
}

export function saveSession(storageState) {
    db.prepare(
        `INSERT INTO navan_session (id, storage_state, updated_at) VALUES (1, ?, ?)
         ON CONFLICT(id) DO UPDATE SET storage_state = excluded.storage_state, updated_at = excluded.updated_at`
    ).run(JSON.stringify(storageState), new Date().toISOString());
}

export default db;
