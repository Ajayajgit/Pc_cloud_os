#!/usr/bin/env node
/**
 * Power Cloud - MCP role variant switcher
 *
 * Single source of truth: roles/customrole_pc_mcp_ai_connection.master.xml
 * (full OneWorld functionality, legacy tax). This script writes the deployable
 * copy into src/Objects/, stripping content the target account cannot accept:
 *
 *   base variant (required)
 *     oneworld  -> master as-is (most accounts)
 *     standard  -> SUBSIDIARIES-gated content stripped (e.g. Shinesty). Deploying
 *                  that content to a non-OneWorld account fails server validation
 *                  ("the SUBSIDIARIES feature must be enabled").
 *
 *   --notax modifier (optional)
 *     strips legacy-tax permkeys (TRAN_TAXLIAB) that SuiteTax-style accounts
 *     reject at deploy time with "Invalid permkey1 reference key TRAN_TAXLIAB".
 *     Server validation does NOT catch this — the role creation step does. As of
 *     2026-09 every new account since American Barbell has rejected it, so
 *     default to --notax for a new account and drop it only if the account is
 *     known to run legacy tax (Bundling, Shinesty, PC LLC, Absci, ACL).
 *
 *   --mfg modifier (optional, OPT-IN)
 *     keeps the manufacturing + inventory/warehouse permkeys (work orders, BOMs,
 *     assembly builds, locations, bins, transfers, counts — all VIEW). They are
 *     feature-gated (WORKORDERS, ASSEMBLIES, BINMANAGEMENT, …), so they are
 *     stripped by default and only kept for accounts running those features.
 *     Keys sourced from roles already valid in Bomb Party prod (2026-09).
 *
 * Usage:
 *   npm run role:oneworld          -> master as-is (minus mfg)
 *   npm run role:oneworld-notax    -> master minus legacy-tax permkeys
 *   npm run role:oneworld-notax-mfg -> as above, plus mfg/inventory permkeys
 *   npm run role:standard          -> subsidiaries content stripped
 *   npm run role:standard-notax    -> both stripped
 *
 * Always server-validate before deploying to a new account:
 *   npx suitecloud project:validate --server
 */
'use strict';
const fs = require('fs');
const path = require('path');

const MASTER = path.join(__dirname, '..', 'roles', 'customrole_pc_mcp_ai_connection.master.xml');
const TARGET = path.join(__dirname, '..', 'src', 'Objects', 'customrole_pc_mcp_ai_connection.xml');

const SUBSIDIARY_FIELDS = ['subsidiaryoption', 'subsidiaryviewingallowed'];
const SUBSIDIARY_PERMKEYS = [
    'LIST_CONTACTSUBSIDIARYRELATION',
    'LIST_ENTITYSUBSIDIARYRELATION',
    'REPO_CONSOLIDATED_REPORTING'
];
const LEGACY_TAX_PERMKEYS = ['TRAN_TAXLIAB'];
const MFG_PERMKEYS = [
    'LIST_BOM', 'LIST_ITEM_REVISION', 'LIST_BILLOFMATERIALSINQUIRY', 'LIST_COMPONENTWHEREUSEDINQUIRY',
    'TRAN_WORKORD', 'TRAN_BUILD', 'TRAN_UNBUILD',
    'LIST_LOCATION', 'LIST_BIN', 'LIST_INBOUNDSHIPMENT',
    'TRAN_INVADJST', 'TRAN_INVTRNFR', 'TRAN_TRNFRORD', 'TRAN_INVCOUNT', 'TRAN_INVWKSHT',
    'TRAN_BINTRNFR', 'TRAN_BINWKSHT', 'REPO_INVENTORY'
];
const KNOWN_FLAGS = ['--notax', '--mfg'];

const args = process.argv.slice(2);
const flags = args.filter(function (a) { return a.indexOf('--') === 0; });
const positional = args.filter(function (a) { return a.indexOf('--') !== 0; });
const base = positional[0];
const notax = flags.indexOf('--notax') !== -1;
const mfg = flags.indexOf('--mfg') !== -1;
const unknownFlags = flags.filter(function (f) { return KNOWN_FLAGS.indexOf(f) === -1; });

if ((base !== 'oneworld' && base !== 'standard') || positional.length !== 1 || unknownFlags.length) {
    console.error('Usage: node scripts/set-role-variant.js <oneworld|standard> [--notax] [--mfg]');
    process.exit(1);
}

let xml = fs.readFileSync(MASTER, 'utf8');

/**
 * Removes whole <field>…</field> lines from the role XML.
 * @param {string[]} fields
 */
function stripFields(fields) {
    fields.forEach(function (field) {
        xml = xml.replace(new RegExp('[ \\t]*<' + field + '>[^<]*</' + field + '>\\r?\\n', 'g'), '');
    });
}

/**
 * Removes whole <permission> blocks for the given permkeys.
 * @param {string[]} permkeys
 */
function stripPermkeys(permkeys) {
    permkeys.forEach(function (permkey) {
        xml = xml.replace(
            new RegExp('[ \\t]*<permission>\\s*<permkey>' + permkey + '</permkey>[\\s\\S]*?</permission>\\r?\\n', 'g'),
            ''
        );
    });
}

/**
 * Fails loudly if any token survived stripping — the master format changed.
 * @param {string[]} tokens
 */
function assertStripped(tokens) {
    const leftover = tokens.filter(function (token) { return xml.indexOf(token) !== -1; });
    if (leftover.length) {
        console.error('ERROR: failed to strip: ' + leftover.join(', ') + ' — master format changed?');
        process.exit(1);
    }
}

const stripped = [];
if (base === 'standard') {
    stripFields(SUBSIDIARY_FIELDS);
    stripPermkeys(SUBSIDIARY_PERMKEYS);
    assertStripped(SUBSIDIARY_FIELDS.concat(SUBSIDIARY_PERMKEYS));
    stripped.push('subsidiaries');
}
if (notax) {
    stripPermkeys(LEGACY_TAX_PERMKEYS);
    assertStripped(LEGACY_TAX_PERMKEYS);
    stripped.push('legacy tax (' + LEGACY_TAX_PERMKEYS.join(', ') + ')');
}
if (!mfg) {
    stripPermkeys(MFG_PERMKEYS);
    assertStripped(MFG_PERMKEYS.map(function (k) { return '<permkey>' + k + '</permkey>'; }));
    stripped.push('mfg/inventory (' + MFG_PERMKEYS.length + ' permkeys)');
}

fs.writeFileSync(TARGET, xml);
const label = base + (notax ? '-notax' : '') + (mfg ? '-mfg' : '');
console.log('Wrote "' + label + '" role variant -> ' + path.relative(process.cwd(), TARGET)
    + (stripped.length ? ' (stripped: ' + stripped.join('; ') + ')' : ' (master as-is)'));
console.log('Before deploying to a new account run: npx suitecloud project:validate --server');
