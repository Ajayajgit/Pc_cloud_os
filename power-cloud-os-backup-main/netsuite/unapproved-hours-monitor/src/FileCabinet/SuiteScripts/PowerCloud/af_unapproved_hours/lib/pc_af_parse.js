/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: report parsing
 * @author Power Cloud Consulting
 *
 * Pure parsing logic with no N/ dependencies, so it is unit testable outside
 * NetSuite. Anderson Frank gives us no API and no filters - this consumes the
 * one export they allow us to download, as-is.
 */
define([], function () {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_AFParse';

    /** Header labels in the AF export, mapped to our row property names. */
    const COLUMN_MAP = {
        'id': 'afId',
        'contractor': 'contractor',
        'ltd company name': 'ltdCompany',
        'provider': 'provider',
        'client': 'client',
        'placement': 'placement',
        'placement start': 'placementStart',
        'placement end': 'placementEnd',
        'period ending': 'periodEnding',
        'status': 'afStatus',
        'hours': 'hours',
        'units': 'units',
        'pay': 'pay',
        'pay currency': 'payCurrency',
        'paid date': 'paidDate'
    };

    const REQUIRED_COLUMNS = ['afId', 'client', 'periodEnding', 'pay'];
    const DATE_COLUMNS = ['placementStart', 'placementEnd', 'periodEnding', 'paidDate'];
    const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    /**
     * Splits CSV text into a grid of strings. RFC 4180: honours quoted fields,
     * doubled quotes, embedded commas and embedded newlines.
     *
     * Required, not optional - the Contractor column is "Hyham, Steve", so a
     * naive split on comma silently shifts every column after it by one.
     *
     * @param {string} text - raw file contents
     * @returns {Array<Array<string>>} rows of cell strings
     */
    function parseCsv(text) {
        if (typeof text !== 'string') {
            throw new Error(SCRIPT_NAME + ': parseCsv expects a string');
        }
        // Excel writes a UTF-8 BOM; it would otherwise corrupt the first header.
        const s = text.replace(/^\uFEFF/, '');

        const grid = [];
        let row = [];
        let field = '';
        let inQuotes = false;
        let i = 0;

        while (i < s.length) {
            const c = s[i];
            if (inQuotes) {
                if (c === '"') {
                    if (s[i + 1] === '"') { field += '"'; i += 2; continue; }
                    inQuotes = false; i += 1; continue;
                }
                field += c; i += 1; continue;
            }
            if (c === '"') { inQuotes = true; i += 1; continue; }
            if (c === ',') { row.push(field); field = ''; i += 1; continue; }
            if (c === '\r' || c === '\n') {
                // Treat CRLF as a single terminator.
                if (c === '\r' && s[i + 1] === '\n') { i += 1; }
                row.push(field); field = '';
                grid.push(row); row = [];
                i += 1; continue;
            }
            field += c; i += 1;
        }
        // A trailing field only counts if the file did not end on a newline.
        if (field !== '' || row.length > 0) { row.push(field); grid.push(row); }
        return grid;
    }

    /**
     * Converts the AF Hours cell to decimal hours.
     * Accepts "14:30:00", "14:30", or an already-decimal "14.5".
     *
     * @param {string} raw
     * @returns {{value: number|null, warning: string|null}}
     */
    function parseHours(raw) {
        const t = String(raw == null ? '' : raw).trim();
        if (t === '') { return { value: null, warning: null }; }

        if (t.indexOf(':') !== -1) {
            const parts = t.split(':');
            if (parts.length < 2 || parts.length > 3) {
                return { value: null, warning: 'Unrecognised Hours format "' + t + '"' };
            }
            const nums = parts.map(function (p) { return Number(p); });
            if (nums.some(function (n) { return !isFinite(n); })) {
                return { value: null, warning: 'Non-numeric Hours "' + t + '"' };
            }
            const h = nums[0] + (nums[1] / 60) + ((nums[2] || 0) / 3600);
            // AF reports to the quarter hour; round to kill float noise.
            return { value: Math.round(h * 10000) / 10000, warning: null };
        }

        const n = Number(t);
        if (!isFinite(n)) {
            return { value: null, warning: 'Non-numeric Hours "' + t + '"' };
        }
        return { value: n, warning: null };
    }

    /**
     * Parses an AF date cell.
     *
     * AF exports "03-May-2026", which is unambiguous. Excel may reformat to
     * "5/3/2026" on Save-As, which is read as US M/D/YYYY - correct for this
     * account, but recorded as a warning because it is an assumption about the
     * exporter's locale rather than a fact about the file.
     *
     * @param {string} raw
     * @returns {{value: Date|null, warning: string|null}}
     */
    function parseAfDate(raw) {
        const t = String(raw == null ? '' : raw).trim();
        if (t === '') { return { value: null, warning: null }; }

        let m = /^(\d{1,2})-([A-Za-z]{3})[a-z]*-(\d{4})$/.exec(t);
        if (m) {
            const mi = MONTHS.indexOf(m[2].toLowerCase());
            if (mi === -1) {
                return { value: null, warning: 'Unknown month in date "' + t + '"' };
            }
            return { value: new Date(Number(m[3]), mi, Number(m[1])), warning: null };
        }

        m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
        if (m) {
            return {
                value: new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])),
                warning: null
            };
        }

        m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
        if (m) {
            return {
                value: new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])),
                warning: 'Date "' + t + '" read as US M/D/YYYY. Prefer the ' +
                         'DD-MMM-YYYY format AF exports natively.'
            };
        }

        return { value: null, warning: 'Unrecognised date "' + t + '"' };
    }

    /**
     * Parses a money cell, tolerating thousands separators, a leading currency
     * symbol and parenthesised negatives.
     *
     * @param {string} raw
     * @returns {{value: number|null, warning: string|null}}
     */
    function parseMoney(raw) {
        let t = String(raw == null ? '' : raw).trim();
        if (t === '') { return { value: null, warning: null }; }
        let negative = false;
        if (/^\(.*\)$/.test(t)) { negative = true; t = t.slice(1, -1); }
        t = t.replace(/[^0-9.\-]/g, '');
        if (t === '' || t === '-' || t === '.') {
            return { value: null, warning: 'Non-numeric amount "' + raw + '"' };
        }
        const n = Number(t);
        if (!isFinite(n)) {
            return { value: null, warning: 'Non-numeric amount "' + raw + '"' };
        }
        return { value: negative ? -n : n, warning: null };
    }

    /**
     * Parses a full AF report file into normalised row objects.
     *
     * Columns are located by header name, not position, so AF adding or
     * reordering a column does not silently shift the data.
     *
     * @param {string} text - raw CSV contents
     * @returns {{rows: Array<Object>, warnings: Array<string>, headers: Array<string>}}
     */
    function parseReport(text) {
        const grid = parseCsv(text);
        const warnings = [];

        let headerIdx = -1;
        for (let r = 0; r < grid.length; r += 1) {
            const hit = grid[r].some(function (c) {
                return String(c).trim().toLowerCase() === 'id';
            });
            if (hit) { headerIdx = r; break; }
        }
        if (headerIdx === -1) {
            throw new Error(SCRIPT_NAME + ': no header row found. Expected a ' +
                            'column named "id". Is this the AF timesheet export?');
        }

        const headers = grid[headerIdx].map(function (h) { return String(h).trim(); });
        const posByProp = {};
        headers.forEach(function (h, idx) {
            const prop = COLUMN_MAP[h.toLowerCase()];
            if (prop && !(prop in posByProp)) { posByProp[prop] = idx; }
        });

        const missing = REQUIRED_COLUMNS.filter(function (p) { return !(p in posByProp); });
        if (missing.length) {
            throw new Error(SCRIPT_NAME + ': report is missing required column(s): ' +
                            missing.join(', ') + '. Found headers: ' + headers.join(' | '));
        }

        const rows = [];
        const seen = {};

        for (let r = headerIdx + 1; r < grid.length; r += 1) {
            const cells = grid[r];
            const isBlank = cells.every(function (c) { return String(c).trim() === ''; });
            if (isBlank) { continue; }

            const rowWarnings = [];
            const get = function (prop) {
                const idx = posByProp[prop];
                if (idx === undefined) { return ''; }
                return String(cells[idx] == null ? '' : cells[idx]).trim();
            };

            const afId = get('afId');
            if (!afId) {
                warnings.push('Row ' + (r + 1) + ' skipped: no AF id.');
                continue;
            }
            if (!/^\d+$/.test(afId)) {
                warnings.push('Row ' + (r + 1) + ' skipped: AF id "' + afId +
                              '" is not numeric.');
                continue;
            }
            if (seen[afId]) {
                warnings.push('Row ' + (r + 1) + ' skipped: AF id ' + afId +
                              ' already appeared on row ' + seen[afId] + '.');
                continue;
            }
            seen[afId] = r + 1;

            const row = {
                afId: afId,
                rowNumber: r + 1,
                contractor: get('contractor'),
                ltdCompany: get('ltdCompany'),
                provider: get('provider'),
                client: get('client'),
                placement: get('placement'),
                afStatus: get('afStatus'),
                payCurrency: get('payCurrency'),
                warnings: rowWarnings
            };

            DATE_COLUMNS.forEach(function (prop) {
                const parsed = parseAfDate(get(prop));
                row[prop] = parsed.value;
                if (parsed.warning) { rowWarnings.push(prop + ': ' + parsed.warning); }
            });

            const hrs = parseHours(get('hours'));
            row.hours = hrs.value;
            if (hrs.warning) { rowWarnings.push('hours: ' + hrs.warning); }

            const pay = parseMoney(get('pay'));
            row.pay = pay.value;
            if (pay.warning) { rowWarnings.push('pay: ' + pay.warning); }

            row.units = parseMoney(get('units')).value;

            if (!row.periodEnding) {
                rowWarnings.push('periodEnding is empty or unparseable - aging ' +
                                 'and the not-yet-invoiced rule both depend on it.');
            }

            rowWarnings.forEach(function (w) {
                warnings.push('Row ' + row.rowNumber + ' (AF ' + afId + '): ' + w);
            });
            rows.push(row);
        }

        return { rows: rows, warnings: warnings, headers: headers };
    }

    return {
        parseCsv: parseCsv,
        parseHours: parseHours,
        parseAfDate: parseAfDate,
        parseMoney: parseMoney,
        parseReport: parseReport,
        COLUMN_MAP: COLUMN_MAP
    };
});
