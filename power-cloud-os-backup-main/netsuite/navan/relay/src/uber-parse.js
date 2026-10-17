import { parse } from 'csv-parse/sync';

// Columns we pull out of the ~57-column Uber daily trip CSV, addressed by header name so
// added/reordered columns don't break us.
export const COL = {
    tripId: 'Trip/Eats ID',
    email: 'Email',
    expenseCode: 'Expense Code',
    txnType: 'Transaction Type',
    amountUsd: 'Transaction Amount USD',
    txnId: 'Network Transaction Id',
    dropDateLocal: 'Drop-off Date (Local)',
    reqDateLocal: 'Request Date (Local)',
    txnTimestampUtc: 'Transaction Timestamp (UTC)',
    city: 'City',
    pickupAddress: 'Pickup Address',
    dropoffAddress: 'Drop-off Address',
    distance: 'Distance (mi)',
    receipt: 'Receipt'
};

/**
 * Parses one daily trip CSV buffer into transaction objects. The file has 4 metadata lines and
 * a "Transactions" line before the real header row (which starts with "Trip/Eats ID").
 * Zero/credit rows and header echoes are skipped here; NetSuite handles dedup.
 * @param {Buffer|string} buf
 * @returns {Array<Object>}
 */
export function parseDailyCsv(buf) {
    const records = parse(buf, { relax_column_count: true, skip_empty_lines: true, trim: true });

    const headerIdx = records.findIndex((row) => row[0] === COL.tripId);
    if (headerIdx === -1) {
        return [];
    }
    const header = records[headerIdx];
    const idx = {};
    Object.keys(COL).forEach((key) => { idx[key] = header.indexOf(COL[key]); });

    const out = [];
    for (let i = headerIdx + 1; i < records.length; i++) {
        const row = records[i];
        const get = (key) => (idx[key] >= 0 ? row[idx[key]] : '');

        const txnId = get('txnId');
        const amountUsd = parseFloat(get('amountUsd'));
        if (!txnId || !(amountUsd > 0)) {
            continue;
        }

        const txnType = (get('txnType') || '').trim();
        const city = (get('city') || '').trim();
        // Cancellation fees have no drop-off ("--"), so fall through to request date, then the
        // charge timestamp.
        const expenseDate = toIsoDate(cleanCell(get('dropDateLocal')))
            || toIsoDate(cleanCell(get('reqDateLocal')))
            || toIsoDate(cleanCell(get('txnTimestampUtc')));

        out.push({
            txnId: txnId,
            tripId: get('tripId'),
            employeeEmail: (get('email') || '').trim(),
            expenseCode: (get('expenseCode') || '').trim(),
            transactionType: txnType,
            amountUsd: amountUsd,
            expenseDate: expenseDate,
            description: buildDescription({
                pickup: get('pickupAddress'),
                dropoff: get('dropoffAddress'),
                distanceMi: get('distance'),
                fallbackCity: city,
                txnType: txnType
            }),
            receiptUrl: cleanCell(get('receipt'))
        });
    }
    return out;
}

// "Uber - Pasadena → BUR · 14.8 mi" / "Uber in Austin · 7.5 mi". Never show street addresses —
// people's home addresses end up in Uber's pickup/dropoff data, and these memos flow onto
// customer-facing invoices. City + airport-code granularity is the privacy floor.
export function buildDescription({ pickup, dropoff, distanceMi, fallbackCity, txnType }) {
    const fromLoc = locationLabel(pickup);
    const toLoc = locationLabel(dropoff);
    const distPart = formatDistance(distanceMi);
    const typePart = txnType && txnType.toLowerCase() !== 'fare' ? ' (' + txnType + ')' : '';
    const head = 'Uber' + typePart;

    let routePart;
    if (fromLoc && toLoc && fromLoc === toLoc) {
        routePart = head + ' in ' + fromLoc;
    } else if (fromLoc && toLoc) {
        routePart = head + ' - ' + fromLoc + ' → ' + toLoc;
    } else if (fromLoc || toLoc) {
        routePart = head + ' - ' + (fromLoc || toLoc);
    } else if (fallbackCity) {
        routePart = head + ' - ' + fallbackCity;
    } else {
        routePart = head;
    }
    return distPart ? routePart + ' · ' + distPart : routePart;
}

// City or IATA/ICAO airport code. Returns '' when nothing meaningful can be extracted; the
// caller falls back to the trip's City field.
export function locationLabel(address) {
    const a = cleanCell(address);
    if (!a) { return ''; }
    const segs = a.split(',').map((s) => s.trim()).filter(Boolean);
    if (segs.length === 0) { return ''; }

    // An airport in the address wins regardless of position — "Terminal B, ...Airport (MCO), ..."
    // and "...Airport (IAH), Houston, ..." should both render as the code.
    for (const seg of segs) {
        const m = seg.match(/\(([A-Z]{3,4})\)/);
        if (m) { return m[1]; }
    }

    // US-formatted addresses: [street, city, "STATE ZIP", "US"]. Take the segment before
    // the state+zip block.
    const stateZipIdx = segs.findIndex((s) => /^[A-Z]{2}\s+\d{5}(-\d{4})?$/.test(s));
    if (stateZipIdx > 0) { return segs[stateZipIdx - 1]; }

    // Generic terminal labels carry no info on their own — skip past them if we ended up here.
    const usable = segs.find((s) => !/^Terminal\s+\w+$/i.test(s));
    return usable || segs[0];
}

export function formatDistance(mi) {
    const n = parseFloat(mi);
    if (!Number.isFinite(n) || n <= 0) { return ''; }
    return n.toFixed(1) + ' mi';
}

// Uber emits "MM/DD/YYYY"; NetSuite-side wants "YYYY-MM-DD".
export function toIsoDate(mdy) {
    if (!mdy) { return ''; }
    const s = String(mdy).trim();
    // ISO date or timestamp (e.g. "2026-09-30" / "2026-09-30T14:02:11Z"): keep the date part.
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) { return `${iso[1]}-${iso[2]}-${iso[3]}`; }
    // M/D/YYYY, optionally followed by a time.
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s|$)/);
    if (!m) { return ''; }
    const pad = (p) => (p.length === 1 ? '0' + p : p);
    return `${m[3]}-${pad(m[1])}-${pad(m[2])}`;
}

// Uber uses "--" for empty cells.
export function cleanCell(v) {
    const s = (v || '').trim();
    return s === '--' ? '' : s;
}
