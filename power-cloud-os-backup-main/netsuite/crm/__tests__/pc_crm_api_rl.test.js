/**
 * Acceptance tests for PC | CRM API (pc_crm_api_rl.js, the T3 RESTlet).
 * One test per acceptance criterion (A1 to A12) in packet section 9 of docs/T3_packet.md. Each title starts with the
 * criterion ID and is copied verbatim from the packet. Expectations come from the criteria and the contract in
 * sections 4.1, 4.2 and 4.4 of the packet, not from the implementation.
 * Every N module and the four sibling libraries are mocked under the SuiteScripts/PC/ paths, as the builder test does.
 * A small in-memory store stands in for records, searches and the ledger, so replay and resume behavior can be
 * observed across two post() calls that share a request id.
 */
import api from 'SuiteScripts/PC/pc_crm_api_rl';
import record from 'N/record';
import search from 'N/search';
import runtime from 'N/runtime';
import error from 'N/error';
import crypto from 'N/crypto';
import encode from 'N/encode';
import ledger from 'SuiteScripts/PC/pc_crm_ledger_lib';
import builder from 'SuiteScripts/PC/pc_crm_project_builder_lib';
import typesLib from 'SuiteScripts/PC/pc_crm_types_lib';
import channelLib from 'SuiteScripts/PC/pc_crm_channel_lib';

jest.mock('N/record', () => ({
    Type: {
        OPPORTUNITY: 'opportunity',
        CUSTOMER: 'customer',
        CONTACT: 'contact',
        PHONE_CALL: 'phonecall',
        JOB: 'job',
        CLASSIFICATION: 'classification',
        PARTNER: 'partner',
        EMPLOYEE: 'employee'
    },
    create: jest.fn(),
    load: jest.fn(),
    submitFields: jest.fn()
}));

jest.mock('N/search', () => ({
    Type: {
        OPPORTUNITY: 'opportunity',
        CUSTOMER: 'customer',
        CONTACT: 'contact',
        PHONE_CALL: 'phonecall',
        JOB: 'job',
        CLASSIFICATION: 'classification',
        PARTNER: 'partner',
        EMPLOYEE: 'employee'
    },
    Sort: { ASC: 'ASC', DESC: 'DESC' },
    create: jest.fn(),
    createColumn: jest.fn(({ name, sort }) => ({ name, sort })),
    load: jest.fn(),
    lookupFields: jest.fn()
}));

jest.mock('N/runtime', () => ({
    getCurrentScript: jest.fn(),
    getCurrentUser: jest.fn()
}));

jest.mock('N/error', () => ({
    create: jest.fn()
}));

jest.mock('N/log', () => ({
    audit: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));

// Listed in packet section 4 although not in the dependency list of the brief. Mocked so the module can load either way.
jest.mock('N/url', () => ({
    resolveRecord: jest.fn()
}));

jest.mock('N/crypto', () => ({
    HashAlg: { SHA256: 'SHA256' },
    createHash: jest.fn()
}));

jest.mock('N/encode', () => ({
    Encoding: { UTF_8: 'UTF_8', HEX: 'HEX' },
    convert: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_ledger_lib', () => ({
    ACTION_CREATE_PROJECT: 'create_project',
    claim: jest.fn(),
    step: jest.fn(),
    done: jest.fn(),
    fail: jest.fn(),
    refuse: jest.fn(),
    reopen: jest.fn(),
    findByOpp: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_project_builder_lib', () => ({
    build: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_types_lib', () => ({
    toJobType: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_channel_lib', () => ({
    resolve: jest.fn(),
    isBillingParty: jest.fn()
}));

// Roles and deployments exactly as packet sections 3 and 4.5 name them.
const SALES_ROLE = 'customrole_pc_crm_sales_write';
const SALES_DEPLOY = 'customdeploy_pc_crm_api_sales';
const TRAVEL_ROLE = 'customrole_pc_crm_travel_read';
const TRAVEL_DEPLOY = 'customdeploy_pc_crm_api_travel';
const ADMIN_ROLE = 'administrator';

// Valid UUID v4 strings, lowercase. Test data only.
const REQUEST_IDS = [
    '6f1c2d3e-4a5b-4c6d-8e7f-900112233445',
    'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    '0b9c8d7e-6f5a-4b3c-9d2e-1f0a9b8c7d6e',
    '3c4d5e6f-7a8b-4c9d-8e0f-1a2b3c4d5e6f',
    '7d8e9f0a-1b2c-4d3e-9f4a-5b6c7d8e9f0a'
];
const REQUEST_ID = REQUEST_IDS[0];
const DEAL_UUID = 'd2b8c7e0-1f3a-4b5c-9d6e-7f8a9b0c1d2e';
const CLIENT_UUID = 'c3e5f7a9-2b4d-4e6f-8a1c-3d5e7f9b1a2c';

// Internal ids for the seeded reference records. Test data only.
const OPP_ID = 1001;
const CUSTOMER_ID = 855;
const CLASS_ID = 1;
const PARTNER_ID = 40;
const EMPLOYEE_IDS = { principal: 12, senior: 13, staff: 14, lead: 15 };

const DEFAULT_PARAMS = {
    custscript_pc_api_disabled_actions: '',
    custscript_pc_travel_search_id: '',
    custscript_pc_api_support_type_id: 2,
    custscript_pc_api_fail_after_step: null
};

const TRAVEL_COLUMNS = [
    { name: 'internalid', label: 'ID' },
    { name: 'altname', label: 'Name' },
    { name: 'email', label: 'Email' }
];

const SELECT_FIELDS = ['entitystatus', 'custbody_pc_project_type', 'entity', 'company'];

// Test-scope state. Reset in beforeEach.
let store;          // { recordType: { id: fields } }
let idCounter;      // last internal id handed out by save()
let params;         // script parameters, keyed by parameter id
let session;        // { role, deployment } as the runtime mock reports them
let ledgerRows;     // Map from request id to the in-memory ledger row
let nextRowId;
let travelPages;    // pages of saved search rows for A1

/** Empty store with one bucket per record type the RESTlet touches. */
const emptyStore = () => ({
    customer: {},
    contact: {},
    opportunity: {},
    job: {},
    phonecall: {},
    classification: {},
    partner: {},
    employee: {},
    // Custom lists the RESTlet checks a select id against (packet 4.3): the engagement type list, the commercial
    // model list and the native win/loss reason list.
    customlist_pc_proj_types: {},
    customlist_pc_commercial_model: {},
    winlossreason: {}
});

/** Adds a record to the store. Every seeded record is active unless the test says otherwise. */
const seed = (type, id, fields) => {
    store[type][String(id)] = Object.assign({ id: String(id), isinactive: false }, fields);
};

/** Reference records every action can point at. The opportunity starts open at status 12. */
const seedReferenceData = () => {
    seed('customer', CUSTOMER_ID, {
        companyname: 'Acme Apparel',
        entityid: 'Acme Apparel',
        stage: 'CUSTOMER',
        url: 'https://acme.example',
        email: ''
    });
    seed('classification', CLASS_ID, { name: 'Direct' });
    seed('customlist_pc_proj_types', 3, { name: 'Rapid Assessment' });
    seed('customlist_pc_proj_types', 9, { name: 'Power Cloud Product' });
    seed('customlist_pc_commercial_model', 1, { name: 'Time and materials' });
    seed('winlossreason', 4, { name: 'Budget' });
    seed('partner', PARTNER_ID, { companyname: 'Partner Co' });
    Object.values(EMPLOYEE_IDS).forEach((id) => seed('employee', id, {}));
    seed('opportunity', OPP_ID, {
        entitystatus: '12',
        custbody_pc_project_type: '3',
        entity: CUSTOMER_ID,
        custbody_opp_kickoff_meet: '',
        externalid: ''
    });
};

const oppRecord = () => store.opportunity[String(OPP_ID)];

/** Reads a column name from a column object or a plain string. */
const colName = (col) => (typeof col === 'string' ? col : col.name);

/** Search result with id and getValue, reading by column object or name. */
const toResult = (rec) => ({
    id: String(rec.id),
    getValue: (col) => {
        const name = colName(col);
        if (name === 'internalid') {
            return String(rec.id);
        }
        return rec[name] === undefined ? '' : rec[name];
    }
});

/** lookupFields: returns the requested columns, with select fields in NetSuite's [{value, text}] form. */
const lookupRecord = (type, id, columns) => {
    const rec = (store[type] || {})[String(id)];
    if (!rec) {
        return {};
    }
    const names = columns ? [].concat(columns).map(colName) : Object.keys(rec);
    const out = {};
    names.forEach((name) => {
        const raw = rec[name] === undefined ? '' : rec[name];
        const isSelect = SELECT_FIELDS.indexOf(name) !== -1 && !Array.isArray(raw) && raw !== '';
        out[name] = isSelect ? [{ value: String(raw), text: '' }] : raw;
    });
    return out;
};

/**
 * Search over the store. External id filters match only on the quoted token, so pc_contact_X_1 never matches
 * pc_contact_X_10. The travel exclusion search returns jobs flagged custentity_pc_travel_exclude.
 */
const runSearch = (opts) => {
    const type = opts.type;
    const json = JSON.stringify(opts.filters || []);
    const rows = Object.values(store[type] || {});
    if (type === 'job' && json.indexOf('custentity_pc_travel_exclude') !== -1) {
        return rows.filter((r) => r.custentity_pc_travel_exclude === true).map(toResult);
    }
    if (json.indexOf('externalid') !== -1) {
        return rows
            .filter((r) => Boolean(r.externalid) && json.indexOf(JSON.stringify(r.externalid)) !== -1)
            .map(toResult);
    }
    if (json.indexOf('"internalid","anyof"') !== -1) {
        // Existence check on a list value: internalid anyof <id>, inactive rows excluded.
        const wanted = (opts.filters[0] || [])[2];
        return rows.filter((r) => String(r.id) === String(wanted) && !r.isinactive).map(toResult);
    }
    if (type === 'customer') {
        return rows.filter((r) => !r.isinactive).map(toResult);
    }
    return [];
};

/** Fake record for record.create. Field values are kept on the object and copied into the store on save(). */
const makeFakeRecord = (type) => {
    const values = {};
    const fieldKey = (arg) => (arg && typeof arg === 'object' ? arg.fieldId : arg);
    return {
        type,
        values,
        setValue: jest.fn((arg, value) => {
            values[fieldKey(arg)] = arg && typeof arg === 'object' ? arg.value : value;
        }),
        getValue: jest.fn((arg) => values[fieldKey(arg)]),
        setSublistValue: jest.fn(),
        insertLine: jest.fn(),
        save: jest.fn(() => {
            idCounter += 1;
            if (!store[type]) {
                store[type] = {};
            }
            store[type][String(idCounter)] = Object.assign({ id: String(idCounter), isinactive: false }, values);
            return idCounter;
        })
    };
};

/** Hash stand-in: digest returns everything fed to update, so different payloads hash differently. */
const makeHash = () => {
    let accumulated = '';
    return {
        update: jest.fn((arg) => {
            accumulated += typeof arg === 'object' && arg !== null ? String(arg.input) : String(arg);
        }),
        digest: jest.fn(() => accumulated)
    };
};

/** yyyy-mm-dd of a Date written by the RESTlet (dates are converted with new Date(y, m - 1, d), packet 4.3). */
const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Sends a body through the RESTlet's post(). */
const send = (body) => api.post(body);

/** Builds a request body in the shape of packet section 4.1. requestId is left out when undefined. */
const actionBody = (action, payload, requestId) => (
    requestId === undefined ? { action, payload } : { action, requestId, payload }
);

/** Valid createOpportunity payload. Required keys only, plus the optional rate and memo are left out. */
const createOpportunityPayload = (overrides) => Object.assign({
    dealUUID: DEAL_UUID,
    title: 'Acme Apparel Rapid Assessment',
    entityId: CUSTOMER_ID,
    classId: CLASS_ID,
    engagementTypeId: 3,
    // Required at intake (packet 4.4, createOpportunity): an explicit open status, 12 Purchasing here.
    entityStatusId: 12,
    principalId: EMPLOYEE_IDS.principal,
    seniorConsultantId: EMPLOYEE_IDS.senior,
    staffConsultantId: EMPLOYEE_IDS.staff,
    leadDeveloperId: EMPLOYEE_IDS.lead
}, overrides);

/** Valid createEndClient payload with two contacts. */
const endClientPayload = (overrides) => Object.assign({
    clientUUID: CLIENT_UUID,
    companyName: 'Acme Apparel',
    revenueSourceId: CLASS_ID,
    website: 'https://acme.example',
    phone: '555-0100',
    email: 'ops@acme.example',
    contacts: [
        { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@acme.example', title: 'Buyer' },
        { firstName: 'Grace', lastName: 'Hopper', email: 'grace@acme.example' }
    ]
}, overrides);

/** Asserts a refusal envelope with the given error code. */
const expectError = (res, code) => {
    expect(res.ok).toBe(false);
    expect(res.error).toBeTruthy();
    expect(res.error.code).toBe(code);
};

/** Records created of one type since the last clear. */
const recordCreates = (type) => record.create.mock.calls.filter((call) => call[0].type === type);

/** Opportunity writes made through record.submitFields since the last clear. */
const oppWrites = () => record.submitFields.mock.calls
    .map((call) => call[0])
    .filter((call) => call.type === 'opportunity');

/** The most recent opportunity write. */
const lastOppWrite = () => {
    const writes = oppWrites();
    return writes[writes.length - 1];
};

/** Ledger functions. A write to the ledger means one of these was called. */
const ledgerWriteFns = () => [ledger.claim, ledger.step, ledger.done, ledger.fail, ledger.refuse, ledger.reopen];

/** Asserts that no record, search, lookup, ledger or builder call happened since the last clear. */
const expectNoRecordAccess = () => {
    [
        record.create, record.load, record.submitFields,
        search.create, search.load, search.lookupFields,
        ledger.claim, ledger.step, ledger.done, ledger.fail, ledger.refuse, ledger.reopen,
        builder.build
    ].forEach((fn) => expect(fn).not.toHaveBeenCalled());
};

/** Roles and deployment pairs the allowlist must refuse (packet section 4.2, step 2). */
const UNKNOWN_PAIRS = [
    [ADMIN_ROLE, SALES_DEPLOY],
    [ADMIN_ROLE, TRAVEL_DEPLOY],
    [SALES_ROLE, TRAVEL_DEPLOY],
    [TRAVEL_ROLE, SALES_DEPLOY],
    [SALES_ROLE, 'customdeploy_pc_crm_api_unknown'],
    ['customrole_unknown', TRAVEL_DEPLOY],
    ['customrole_pc_mcp_ai_connection', TRAVEL_DEPLOY]
];

describe('PC | CRM API acceptance criteria', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        store = emptyStore();
        seedReferenceData();
        idCounter = 5000;
        params = Object.assign({}, DEFAULT_PARAMS);
        session = { role: SALES_ROLE, deployment: SALES_DEPLOY };
        ledgerRows = new Map();
        nextRowId = 7;
        travelPages = [];

        runtime.getCurrentUser.mockImplementation(() => ({ roleId: session.role }));
        runtime.getCurrentScript.mockImplementation(() => ({
            deploymentId: session.deployment,
            getParameter: ({ name }) => params[name],
            getRemainingUsage: () => 4800
        }));

        error.create.mockImplementation(({ name, message }) => {
            const err = new Error(message);
            err.name = name;
            return err;
        });

        crypto.createHash.mockImplementation(() => makeHash());
        encode.convert.mockImplementation(({ string }) => string);

        record.create.mockImplementation(({ type }) => makeFakeRecord(type));
        record.load.mockImplementation(() => undefined);
        record.submitFields.mockImplementation(({ type, id, values }) => {
            const rec = (store[type] || {})[String(id)];
            if (rec) {
                Object.assign(rec, values);
            }
        });

        search.create.mockImplementation((opts) => ({
            run: () => ({
                getRange: ({ start, end }) => runSearch(opts).slice(start, end)
            }),
            // Paged form (packet 4.4, listTravelProjects exclusion search): one page holding every row.
            runPaged: () => {
                const results = runSearch(opts);
                return {
                    pageRanges: results.length ? [{ index: 0 }] : [],
                    fetch: () => ({ data: results })
                };
            }
        }));
        search.lookupFields.mockImplementation(({ type, id, columns }) => lookupRecord(type, id, columns));
        search.load.mockImplementation(({ id }) => ({
            id,
            columns: TRAVEL_COLUMNS,
            runPaged: () => ({
                pageRanges: travelPages.map((page, index) => ({ index })),
                fetch: ({ index }) => ({ data: travelPages[index].map(toResult) })
            })
        }));

        // In-memory ledger keyed by request id. Replays see the stored row, as the real ledger would.
        ledger.claim.mockImplementation((action, requestId, hash, oppId, role) => {
            const existing = ledgerRows.get(requestId);
            if (existing) {
                return {
                    rowId: existing.rowId,
                    existing: true,
                    status: existing.status,
                    step: existing.step,
                    hash: existing.hash,
                    oppId: existing.oppId,
                    result: existing.result
                };
            }
            const row = {
                rowId: nextRowId,
                requestId,
                action,
                hash,
                oppId,
                role,
                status: 'pending',
                step: 0,
                result: null,
                failure: null
            };
            nextRowId += 1;
            ledgerRows.set(requestId, row);
            return { rowId: row.rowId, existing: false };
        });
        const rowById = (rowId) => Array.from(ledgerRows.values()).find((row) => row.rowId === rowId);
        ledger.step.mockImplementation((rowId, n) => {
            rowById(rowId).step = n;
        });
        ledger.done.mockImplementation((rowId, result) => {
            const row = rowById(rowId);
            row.status = 'done';
            row.result = result;
        });
        ledger.fail.mockImplementation((rowId, info) => {
            const row = rowById(rowId);
            row.status = 'failed';
            row.step = info && info.step !== undefined ? info.step : row.step;
            row.failure = info;
        });
        ledger.refuse.mockImplementation((rowId, reason, details) => {
            const row = rowById(rowId);
            row.status = 'refused';
            row.result = Object.assign({ reason }, details || {});
        });
        ledger.reopen.mockImplementation((rowId) => {
            rowById(rowId).status = 'pending';
        });

        typesLib.toJobType.mockImplementation((engagementTypeId) => (
            String(engagementTypeId) === '9' ? { noProject: true } : { jobTypeId: 3 }
        ));
        channelLib.isBillingParty.mockImplementation(() => false);
        builder.build.mockImplementation(() => ({ ok: true }));
    });

    /**
     * A1: listTravelProjects under the travel deployment and travel role returns the saved search rows minus projects
     * flagged Exclude From Travel Lists, in internal id ascending order, every row with an approverEmail string or null.
     */
    it('A1: listTravelProjects under the travel deployment and travel role returns the saved search rows minus projects flagged Exclude From Travel Lists, in internal id ascending order, every row with an approverEmail string or null.', () => {
        session = { role: TRAVEL_ROLE, deployment: TRAVEL_DEPLOY };
        seed('job', 30, { custentity_pc_travel_exclude: false });
        seed('job', 44, { custentity_pc_travel_exclude: true });
        seed('job', 12, { custentity_pc_travel_exclude: false });
        seed('job', 21, { custentity_pc_travel_exclude: false });
        // Rows come back out of id order and across two pages, so the sort and the paging are both exercised.
        travelPages = [
            [
                { id: '30', altname: 'Acme Apparel Travel', email: 'approver@client.example' },
                { id: '44', altname: 'Delta Excluded Trip', email: 'excluded@client.example' }
            ],
            [
                { id: '12', altname: 'Beta Footwear Trip', email: '' },
                { id: '21', altname: 'Gamma Retail Trip', email: 'travel@gamma.example' }
            ]
        ];

        const res = send(actionBody('listTravelProjects', {}));

        expect(res.ok).toBe(true);
        expect(res.action).toBe('listTravelProjects');
        expect(search.load).toHaveBeenCalledWith(expect.objectContaining({ id: 'customsearch901' }));
        expect(res.result.projects).toEqual([
            { projectId: 12, name: 'Beta Footwear Trip', approverEmail: null },
            { projectId: 21, name: 'Gamma Retail Trip', approverEmail: 'travel@gamma.example' },
            { projectId: 30, name: 'Acme Apparel Travel', approverEmail: 'approver@client.example' }
        ]);
        res.result.projects.forEach((project) => {
            expect(project.approverEmail === null || typeof project.approverEmail === 'string').toBe(true);
        });
    });

    /**
     * Fallback case, added on top of the packet's A1 to A12: with no custom label on the Name and Email columns, the
     * RESTlet resolves them by field name (Name: companyname, entityid or altname; Email: email) and returns the same rows as A1.
     */
    it('A1b: listTravelProjects resolves the Email and Name columns by field name when the saved search carries no custom label for them.', () => {
        session = { role: TRAVEL_ROLE, deployment: TRAVEL_DEPLOY };
        seed('job', 30, { custentity_pc_travel_exclude: false });
        seed('job', 44, { custentity_pc_travel_exclude: true });
        seed('job', 12, { custentity_pc_travel_exclude: false });
        seed('job', 21, { custentity_pc_travel_exclude: false });
        travelPages = [
            [
                { id: '30', altname: 'Acme Apparel Travel', email: 'approver@client.example' },
                { id: '44', altname: 'Delta Excluded Trip', email: 'excluded@client.example' }
            ],
            [
                { id: '12', altname: 'Beta Footwear Trip', email: '' },
                { id: '21', altname: 'Gamma Retail Trip', email: 'travel@gamma.example' }
            ]
        ];
        // Name carries an empty label and Email carries no label key, so both must resolve by field name.
        search.load.mockImplementation(({ id }) => ({
            id,
            columns: [{ name: 'internalid', label: 'ID' }, { name: 'altname', label: '' }, { name: 'email' }],
            runPaged: () => ({
                pageRanges: travelPages.map((page, index) => ({ index })),
                fetch: ({ index }) => ({ data: travelPages[index].map(toResult) })
            })
        }));

        const res = send(actionBody('listTravelProjects', {}));

        expect(res.ok).toBe(true);
        expect(res.error).toBeFalsy();
        expect(res.result.projects).toEqual([
            { projectId: 12, name: 'Beta Footwear Trip', approverEmail: null },
            { projectId: 21, name: 'Gamma Retail Trip', approverEmail: 'travel@gamma.example' },
            { projectId: 30, name: 'Acme Apparel Travel', approverEmail: 'approver@client.example' }
        ]);
    });

    /**
     * Fallback case, added on top of the packet's A1 to A12: when neither a labeled nor a field-named Email column exists
     * in the travel saved search, listTravelProjects refuses with PC_API_FAILED and names the missing column.
     */
    it('A1c: listTravelProjects fails with PC_API_FAILED when neither a labeled nor a field-named Email column exists.', () => {
        session = { role: TRAVEL_ROLE, deployment: TRAVEL_DEPLOY };
        travelPages = [
            [
                { id: '30', altname: 'Acme Apparel Travel', email: 'approver@client.example' },
                { id: '44', altname: 'Delta Excluded Trip', email: 'excluded@client.example' }
            ],
            [
                { id: '12', altname: 'Beta Footwear Trip', email: '' },
                { id: '21', altname: 'Gamma Retail Trip', email: 'travel@gamma.example' }
            ]
        ];
        // No column carries the Email label or the field name email.
        search.load.mockImplementation(({ id }) => ({
            id,
            columns: [{ name: 'internalid', label: 'ID' }, { name: 'altname', label: 'Name' }, { name: 'phone', label: 'Phone' }],
            runPaged: () => ({
                pageRanges: travelPages.map((page, index) => ({ index })),
                fetch: ({ index }) => ({ data: travelPages[index].map(toResult) })
            })
        }));

        const res = send(actionBody('listTravelProjects', {}));

        expectError(res, 'PC_API_FAILED');
        expect(res.error.message).toBe('Travel search has no Email column');
        expect(res.error.details.wanted).toBe('Email');
        expect(res.error.details.columns).toEqual([
            { name: 'internalid', join: null, label: 'ID', formula: null, summary: null },
            { name: 'altname', join: null, label: 'Name', formula: null, summary: null },
            { name: 'phone', join: null, label: 'Phone', formula: null, summary: null }
        ]);
    });

    /**
     * A2: every action other than listTravelProjects under the travel deployment and travel role, sent as a structurally
     * valid request, is refused with PC_API_REFUSED and no record is read or written.
     */
    it('A2: every action other than listTravelProjects under the travel deployment and travel role, sent as a structurally valid request, is refused with PC_API_REFUSED and no record is read or written.', () => {
        session = { role: TRAVEL_ROLE, deployment: TRAVEL_DEPLOY };
        const otherActions = [
            ['resolveClient', { name: 'Acme Apparel' }],
            ['createEndClient', endClientPayload()],
            ['createOpportunity', createOpportunityPayload()],
            ['updateOpportunity', { opportunityId: OPP_ID, fields: { entityStatusId: 24 } }],
            ['logTouch', { opportunityId: OPP_ID, title: 'Discovery call' }],
            ['closeOpportunity', { opportunityId: OPP_ID, outcome: 'lost', winLossReasonId: 4 }],
            ['createProject', { opportunityId: OPP_ID }]
        ];
        expect(otherActions).toHaveLength(7);

        otherActions.forEach(([action, payload]) => {
            // resolveClient takes no request id; every other action takes one.
            const requestId = action === 'resolveClient' ? undefined : REQUEST_ID;
            expectError(send(actionBody(action, payload, requestId)), 'PC_API_REFUSED');
        });

        expectNoRecordAccess();
    });

    /**
     * A3: listTravelProjects under the sales deployment and sales role is refused with PC_API_REFUSED; any unknown role
     * or deployment pair (including Administrator) is refused.
     */
    it('A3: listTravelProjects under the sales deployment and sales role is refused with PC_API_REFUSED; any unknown role or deployment pair (including Administrator) is refused.', () => {
        session = { role: SALES_ROLE, deployment: SALES_DEPLOY };
        expectError(send(actionBody('listTravelProjects', {})), 'PC_API_REFUSED');

        UNKNOWN_PAIRS.forEach(([role, deployment]) => {
            session = { role, deployment };
            expectError(send(actionBody('listTravelProjects', {})), 'PC_API_REFUSED');
            expectError(send(actionBody('resolveClient', { name: 'Acme Apparel' })), 'PC_API_REFUSED');
        });
    });

    /**
     * A4: updateOpportunity to status 13, 14 or 24 is refused with PC_API_REFUSED_STATUS and the opportunity is not
     * written (the ledger row records the refusal).
     */
    it('A4: updateOpportunity to status 13, 14 or 24 is refused with PC_API_REFUSED_STATUS and the opportunity is not written (the ledger row records the refusal).', () => {
        const targets = [13, 14, 24];

        targets.forEach((target, i) => {
            oppRecord().entitystatus = '12';
            const requestId = REQUEST_IDS[i];
            const res = send(actionBody(
                'updateOpportunity',
                { opportunityId: OPP_ID, fields: { entityStatusId: target } },
                requestId
            ));

            expectError(res, 'PC_API_REFUSED_STATUS');
            expect(ledgerRows.get(requestId).status).toBe('refused');
        });

        expect(oppWrites()).toHaveLength(0);
        expect(ledger.refuse).toHaveBeenCalledTimes(targets.length);
    });

    /**
     * A5: updateOpportunity from 25 to 23 is accepted only when a kickoff date is in the call or already on the record.
     */
    it('A5: updateOpportunity from 25 to 23 is accepted only when a kickoff date is in the call or already on the record.', () => {
        const cases = [
            // Kickoff date in the call.
            { requestId: REQUEST_IDS[0], fields: { entityStatusId: 23, kickoffDate: '2026-10-09' }, onRecord: '', accepted: true },
            // Kickoff date already on the record.
            { requestId: REQUEST_IDS[1], fields: { entityStatusId: 23 }, onRecord: '2026-10-12', accepted: true },
            // No kickoff date in the call or on the record.
            { requestId: REQUEST_IDS[2], fields: { entityStatusId: 23 }, onRecord: '', accepted: false }
        ];

        cases.forEach((c) => {
            oppRecord().entitystatus = '25';
            oppRecord().custbody_opp_kickoff_meet = c.onRecord;
            const writesBefore = oppWrites().length;

            const res = send(actionBody('updateOpportunity', { opportunityId: OPP_ID, fields: c.fields }, c.requestId));

            if (c.accepted) {
                expect(res.ok).toBe(true);
                expect(oppWrites()).toHaveLength(writesBefore + 1);
                expect(String(lastOppWrite().values.entitystatus)).toBe('23');
            } else {
                expectError(res, 'PC_API_REFUSED_STATUS');
                expect(oppWrites()).toHaveLength(writesBefore);
            }
        });
    });

    /**
     * A6: closeOpportunity won on a status-13 record is refused with PC_API_REFUSED_STATUS; closeOpportunity won on an
     * open status sets the signed date and status 24, or 13 when the engagement type has no project; closeOpportunity
     * lost sets 14 with the reason.
     */
    it('A6: closeOpportunity won on a status-13 record is refused with PC_API_REFUSED_STATUS; closeOpportunity won on an open status sets the signed date and status 24, or 13 when the engagement type has no project; closeOpportunity lost sets 14 with the reason.', () => {
        const wonPayload = { opportunityId: OPP_ID, outcome: 'won', signedDate: '2026-10-09' };

        // Won on a status-13 record: refused, nothing written.
        oppRecord().entitystatus = '13';
        expectError(send(actionBody('closeOpportunity', wonPayload, REQUEST_IDS[0])), 'PC_API_REFUSED_STATUS');
        expect(oppWrites()).toHaveLength(0);

        // Won on an open status with a project engagement type: status 24.
        oppRecord().entitystatus = '12';
        oppRecord().custbody_pc_project_type = '3';
        let res = send(actionBody('closeOpportunity', wonPayload, REQUEST_IDS[1]));
        expect(res.ok).toBe(true);
        expect(isoDay(lastOppWrite().values.custbody_pc_signed_date)).toBe('2026-10-09');
        expect(String(lastOppWrite().values.entitystatus)).toBe('24');
        expect(String(res.result.status)).toBe('24');

        // Won on an open status with an engagement type that has no project: status 13.
        oppRecord().entitystatus = '12';
        oppRecord().custbody_pc_project_type = '9';
        res = send(actionBody('closeOpportunity', wonPayload, REQUEST_IDS[2]));
        expect(res.ok).toBe(true);
        expect(isoDay(lastOppWrite().values.custbody_pc_signed_date)).toBe('2026-10-09');
        expect(String(lastOppWrite().values.entitystatus)).toBe('13');

        // Lost on an open status: status 14 with the reason.
        oppRecord().entitystatus = '12';
        res = send(actionBody(
            'closeOpportunity',
            { opportunityId: OPP_ID, outcome: 'lost', winLossReasonId: 4, memo: 'Budget moved' },
            REQUEST_IDS[3]
        ));
        expect(res.ok).toBe(true);
        expect(String(lastOppWrite().values.entitystatus)).toBe('14');
        expect(String(lastOppWrite().values.winlossreason)).toBe('4');
    });

    /**
     * A7: createOpportunity twice with one request id and the same payload returns one opportunity id and the second
     * response is marked replayed.
     */
    it('A7: createOpportunity twice with one request id and the same payload returns one opportunity id and the second response is marked replayed.', () => {
        const payload = createOpportunityPayload();

        const first = send(actionBody('createOpportunity', payload, REQUEST_ID));
        const second = send(actionBody('createOpportunity', payload, REQUEST_ID));

        expect(first.ok).toBe(true);
        expect(first.replayed).toBe(false);
        expect(first.result.opportunityId).toBeTruthy();
        expect(second.ok).toBe(true);
        expect(second.replayed).toBe(true);
        expect(second.result.opportunityId).toBe(first.result.opportunityId);
        expect(recordCreates('opportunity')).toHaveLength(1);
    });

    /**
     * A8: createOpportunity twice with two request ids and the same deal UUID returns the same id and creates one record
     * (external id pc_opp_{D}).
     */
    it('A8: createOpportunity twice with two request ids and the same deal UUID returns the same id and creates one record (external id pc_opp_{D}).', () => {
        const first = send(actionBody('createOpportunity', createOpportunityPayload(), REQUEST_IDS[0]));
        const second = send(actionBody('createOpportunity', createOpportunityPayload(), REQUEST_IDS[1]));

        expect(first.ok).toBe(true);
        expect(second.ok).toBe(true);
        expect(second.result.opportunityId).toBe(first.result.opportunityId);
        expect(recordCreates('opportunity')).toHaveLength(1);

        const withExternalId = Object.values(store.opportunity)
            .filter((rec) => rec.externalid === `pc_opp_${DEAL_UUID}`);
        expect(withExternalId).toHaveLength(1);
    });

    /**
     * A9: createEndClient with a forced failure after the customer save marks the ledger row failed; a retry with the
     * same request id resumes and creates the contacts without creating a second customer.
     */
    it('A9: createEndClient with a forced failure after the customer save marks the ledger row failed; a retry with the same request id resumes and creates the contacts without creating a second customer.', () => {
        // Fault injection (packet 4.4): throws after step 1 (the customer) for a ZZ TEST company.
        params.custscript_pc_api_fail_after_step = 1;
        const payload = endClientPayload({ companyName: 'ZZ TEST Acme Apparel' });

        const first = send(actionBody('createEndClient', payload, REQUEST_ID));

        expectError(first, 'PC_API_FAILED');
        expect(first.error.details).toEqual(expect.objectContaining({ step: 1, errorName: 'PC_TEST_FAULT' }));
        const rowId = ledgerRows.get(REQUEST_ID).rowId;
        expect(ledgerRows.get(REQUEST_ID).status).toBe('failed');
        expect(ledger.fail).toHaveBeenCalledWith(rowId, expect.objectContaining({ step: 1 }));
        expect(recordCreates('customer')).toHaveLength(1);

        // Retry with the same request id and the fault switched off.
        params.custscript_pc_api_fail_after_step = null;
        const retry = send(actionBody('createEndClient', payload, REQUEST_ID));

        expect(retry.ok).toBe(true);
        expect(ledger.reopen).toHaveBeenCalledWith(rowId);
        expect(recordCreates('customer')).toHaveLength(1);
        expect(recordCreates('contact')).toHaveLength(2);
        expect(ledgerRows.get(REQUEST_ID).status).toBe('done');
        const customersForClient = Object.values(store.customer)
            .filter((rec) => rec.externalid === `pc_client_${CLIENT_UUID}`);
        expect(customersForClient).toHaveLength(1);
        const contactExternalIds = Object.values(store.contact).map((rec) => rec.externalid).sort();
        expect(contactExternalIds).toEqual([
            `pc_contact_${CLIENT_UUID}_1`,
            `pc_contact_${CLIENT_UUID}_2`
        ]);
    });

    /**
     * A10: the same request id with a different payload or action is refused with PC_API_REPLAY_MISMATCH and the stored
     * row is untouched.
     */
    it('A10: the same request id with a different payload or action is refused with PC_API_REPLAY_MISMATCH and the stored row is untouched.', () => {
        const first = send(actionBody('createOpportunity', createOpportunityPayload(), REQUEST_ID));
        expect(first.ok).toBe(true);

        const rowBefore = JSON.stringify(ledgerRows.get(REQUEST_ID));
        const createsBefore = recordCreates('opportunity').length;

        // Same request id, same action, different payload.
        const changedPayload = send(actionBody(
            'createOpportunity',
            createOpportunityPayload({ title: 'Acme Apparel Changed Title' }),
            REQUEST_ID
        ));
        expectError(changedPayload, 'PC_API_REPLAY_MISMATCH');
        expect(JSON.stringify(ledgerRows.get(REQUEST_ID))).toBe(rowBefore);

        // Same request id, different action.
        const differentAction = send(actionBody(
            'logTouch',
            { opportunityId: OPP_ID, title: 'Discovery call' },
            REQUEST_ID
        ));
        expectError(differentAction, 'PC_API_REPLAY_MISMATCH');
        expect(JSON.stringify(ledgerRows.get(REQUEST_ID))).toBe(rowBefore);

        expect(recordCreates('opportunity')).toHaveLength(createsBefore);
        expect(ledger.reopen).not.toHaveBeenCalled();
        expect(ledger.refuse).not.toHaveBeenCalled();
    });

    /**
     * A11: resolveClient never creates a record and never writes a ledger row.
     */
    it('A11: resolveClient never creates a record and never writes a ledger row.', () => {
        const res = send(actionBody('resolveClient', { name: 'Acme Apparel', emailDomain: 'acme.example' }));

        expect(res.ok).toBe(true);
        expect(Array.isArray(res.result.candidates)).toBe(true);
        expect(record.create).not.toHaveBeenCalled();
        expect(record.submitFields).not.toHaveBeenCalled();
        expect(record.load).not.toHaveBeenCalled();
        ledgerWriteFns().forEach((fn) => expect(fn).not.toHaveBeenCalled());
    });

    /**
     * A12: an action listed in the disabled-actions parameter is refused with PC_API_DISABLED before any record access;
     * a non-POST verb, a malformed body or an unknown payload key returns PC_API_BAD_REQUEST and writes nothing.
     */
    it('A12: an action listed in the disabled-actions parameter is refused with PC_API_DISABLED before any record access; a non-POST verb, a malformed body or an unknown payload key returns PC_API_BAD_REQUEST and writes nothing.', () => {
        // (a) Kill switch: a listed action is refused before any record access.
        params.custscript_pc_api_disabled_actions = 'logTouch, closeOpportunity';
        const disabled = send(actionBody(
            'logTouch',
            { opportunityId: OPP_ID, title: 'Discovery call' },
            REQUEST_ID
        ));
        expectError(disabled, 'PC_API_DISABLED');
        expectNoRecordAccess();

        // Control: an action that is not listed is not refused by the kill switch.
        const control = send(actionBody('resolveClient', { name: 'Acme Apparel' }));
        expect(control.error ? control.error.code : null).not.toBe('PC_API_DISABLED');
        // The control call is a read by design; it must not count against the no-access checks below.
        jest.clearAllMocks();

        // (b) Wrong verb through get(), put() and delete(): a bad request, nothing written.
        params.custscript_pc_api_disabled_actions = '';
        const verbBody = { action: 'logTouch', requestId: REQUEST_ID, payload: { opportunityId: OPP_ID, title: 'Call' } };
        ['get', 'put', 'delete'].forEach((verb) => {
            const res = api[verb](verbBody);
            expect(res.ok).toBe(false);
            expect(res.error.code).toBe('PC_API_BAD_REQUEST');
            expect(res.error.message).toBe('POST required.');
        });
        expectNoRecordAccess();

        // (c) Malformed bodies: not an object, an array, an unknown action, a bad request id, a non-object payload.
        const malformedBodies = [
            null,
            [],
            { action: 'notAnAction', requestId: REQUEST_ID, payload: {} },
            { action: 'logTouch', requestId: 'not-a-uuid', payload: { opportunityId: OPP_ID, title: 'Call' } },
            { action: 'logTouch', requestId: REQUEST_ID, payload: [] }
        ];
        malformedBodies.forEach((body) => expectError(send(body), 'PC_API_BAD_REQUEST'));
        expectNoRecordAccess();

        // (d) Unknown payload key rejects the whole request.
        const unknownKey = send(actionBody(
            'logTouch',
            { opportunityId: OPP_ID, title: 'Discovery call', bogusField: 'x' },
            REQUEST_ID
        ));
        expectError(unknownKey, 'PC_API_BAD_REQUEST');
        expectNoRecordAccess();
    });
});
