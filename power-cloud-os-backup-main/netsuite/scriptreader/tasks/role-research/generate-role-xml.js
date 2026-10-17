/**
 * Generates src/Objects/customrole_pc_mcp_readonly.xml from ids_levels.tsv.
 *
 * Rules (see ROLE-RESEARCH.md):
 *  - TRAN_/LIST_/REPO_/REGT_/ADMI_ permissions that accept View -> VIEW
 *  - MCP-required + Full-only-but-read-only-in-effect perms -> forced levels
 *  - sensitive / action-only / 2FA-mandatory / internal / unproven IDs -> skipped
 *  - entries sorted alphabetically by permkey; scalar role fields alphabetical
 */
'use strict';
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const OUT = path.join(HERE, '..', '..', 'src', 'Objects', 'customrole_pc_mcp_readonly.xml');

const FORCED = {
    // AI Connector (MCP) hard requirements
    ADMI_MCP_SERVER: 'FULL',        // MCP Server Connection (None/Full only)
    ADMI_LOGIN_OAUTH2: 'FULL',      // Log in using OAuth 2.0 Access Tokens (None/Full only)
    ADMI_RESTWEBSERVICES: 'FULL',   // REST Web Services (None/Full only)
    REPO_ANALYTICS: 'EDIT',         // SuiteAnalytics Workbook (None/Edit only - VIEW invalid)
    LIST_FIND: 'FULL',              // Perform Search
    // Full-only levels but read-only in effect
    ADMI_AUDITLOGIN: 'FULL',        // View Login Audit Trail
    ADMI_DELETEDRECORD: 'FULL',     // Deleted Records log
    // Not in the documented levels table; deploy at VIEW
    GRAP_AP: 'VIEW',
    GRAP_AR: 'VIEW',
    GRAP_EXP: 'VIEW',
    GRAP_INC: 'VIEW',
    GRAP_NETWORTH: 'VIEW',
    LIST_SYSTEMNOTES: 'VIEW',            // System Notes for Analytics and REST
    LIST_MESSAGE_UNRESTRICTED: 'VIEW',   // Messages for Analytics and REST
    LIST_BULK_PROCESSING: 'VIEW',
    LIST_ENTITYSUBSIDIARYRELATION: 'VIEW'
};

const SKIP = new Set([
    // sensitive PII / payment data
    'LIST_EMPLOYEESSN',
    // 2FA-mandatory permissions (would force 2FA onto the MCP role)
    'ADMI_KERNEL', 'ADMI_INTEGRAPP', 'ADMI_MANAGE_OAUTH_TOKENS', 'ADMI_MANAGE_OAUTH2',
    'ADMI_DEVICE_ID', 'ADMI_VIEWCREDITCARDS', 'ADMI_NSASOIDCPROVIDER', 'ADMI_OIDCSETUP',
    'ADMI_OPENIDSSOSETUP', 'ADMI_SAMLSSOSETUP', 'ADMI_TWOFACTORAUTHBASE',
    // behavior-changing, not access-granting
    'REPO_PAYROLLHIDEFINEMPINFO',
    // admin actions, no view level
    'REPO_GRANT_ACCESS',
    // NLCORP-internal
    'ADMI_PROVISION', 'ADMI_TSTDRV_MASTER',
    // documented but missing from SDF generic_permission enum, no deploy evidence
    'ADMI_DIRECTINVOICEPAYMENTSETUP', 'ADMI_PROMPTS', 'ADMI_RAG', 'LIST_LICENSEPLATE',
    'LIST_PICKDECOMPOSITION', 'LIST_PRICINGRECORDS', 'LIST_SAASMETRIC', 'LIST_TIMEOFF',
    'LIST_VENDOR_ACH', 'TRAN_DLTD_TXNS_SUMMARY_SBMSN'
]);

const FAMILIES = /^(TRAN|LIST|REPO|REGT|ADMI)_/;

const tsv = fs.readFileSync(path.join(HERE, 'ids_levels.tsv'), 'utf8');
// The CLI's own enum (extracted from cli-2026.1.0.jar sdf_metadata/list/generic_permission.xml)
// is the authority on what local validation accepts — the docs pages lag in both directions.
const enumKeys = new Set(
    fs.readFileSync(path.join(HERE, 'cli_permkeys.txt'), 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
);

const perms = new Map();
for (const [key, level] of Object.entries(FORCED)) perms.set(key, level);

for (const line of tsv.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const [id, , , levels] = line.split('\t');
    if (!id || perms.has(id) || SKIP.has(id) || !FAMILIES.test(id)) continue;
    if (!levels || !/\bView\b/.test(levels)) continue; // VIEW not a valid level
    perms.set(id, 'VIEW');
}

const dropped = [...perms.keys()].filter((k) => !enumKeys.has(k));
for (const k of dropped) perms.delete(k);
if (dropped.length) {
    console.warn('DROPPED (not in CLI 2026.1 enum — add manually in UI if needed):');
    console.warn('  ' + dropped.join(', '));
}

const sorted = [...perms.keys()].sort();
const permXml = sorted
    .map((k) => `        <permission>\n            <permkey>${k}</permkey>\n            <permlevel>${perms.get(k)}</permlevel>\n        </permission>`)
    .join('\n');

const xml = `<role scriptid="customrole_pc_mcp_readonly">
    <centertype>BASIC</centertype>
    <employeerestriction>NONE</employeerestriction>
    <employeeselectionunrestricted>F</employeeselectionunrestricted>
    <isinactive>F</isinactive>
    <ispartnerrole>F</ispartnerrole>
    <issalesrole>F</issalesrole>
    <issinglesignononly>F</issinglesignononly>
    <issupportrole>F</issupportrole>
    <name>PC MCP Read-Only Admin</name>
    <restrictbydevice>F</restrictbydevice>
    <restricttimeandexpenses>F</restricttimeandexpenses>
    <subsidiaryoption>ALL</subsidiaryoption>
    <tfarequired>OFF</tfarequired>
    <permissions>
${permXml}
    </permissions>
</role>
`;

fs.writeFileSync(OUT, xml);
const byLevel = {};
for (const l of perms.values()) byLevel[l] = (byLevel[l] || 0) + 1;
console.log(`Wrote ${OUT}`);
console.log(`${perms.size} permissions:`, byLevel);
