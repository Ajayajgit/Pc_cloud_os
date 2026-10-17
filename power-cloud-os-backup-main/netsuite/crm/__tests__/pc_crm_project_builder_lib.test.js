/**
 * Acceptance tests for PC | Project Builder (pc_crm_project_builder_lib.js).
 * One test per acceptance criterion (B1 to B10) in the approved plan block (T2). Each title starts with the criterion ID.
 * The builder requires ./pc_crm_readiness_lib and ./pc_crm_ledger_lib. Both are mocked entirely, under the
 * SuiteScripts/PC/ paths that the existing test style uses; they resolve to the same files as the builder's relative requires.
 */
import builder from 'SuiteScripts/PC/pc_crm_project_builder_lib';
import record from 'N/record';
import search from 'N/search';
import runtime from 'N/runtime';
import error from 'N/error';
import https from 'N/https';
import url from 'N/url';
import crypto from 'N/crypto';
import readiness from 'SuiteScripts/PC/pc_crm_readiness_lib';
import ledger from 'SuiteScripts/PC/pc_crm_ledger_lib';

jest.mock('N/record', () => ({
    Type: { OPPORTUNITY: 'opportunity', JOB: 'job', PROJECT_TASK: 'projecttask' },
    create: jest.fn(),
    load: jest.fn(),
    submitFields: jest.fn()
}));

jest.mock('N/search', () => ({
    Type: { JOB: 'job', PROJECT_TASK: 'projecttask' },
    create: jest.fn(),
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

jest.mock('N/https', () => ({
    post: jest.fn(),
    createSecureString: jest.fn()
}));

jest.mock('N/url', () => ({
    resolveRecord: jest.fn()
}));

jest.mock('N/crypto', () => ({
    HashAlg: { SHA256: 'SHA256' },
    createHash: jest.fn()
}));

jest.mock('N/encode', () => ({
    Encoding: { UTF_8: 'UTF_8', HEX: 'HEX' }
}));

jest.mock('SuiteScripts/PC/pc_crm_readiness_lib', () => ({
    check: jest.fn(),
    findProject: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_ledger_lib', () => ({
    ACTION_CREATE_PROJECT: 'create_project',
    claim: jest.fn(),
    findByOpp: jest.fn(),
    step: jest.fn(),
    done: jest.fn(),
    fail: jest.fn(),
    refuse: jest.fn(),
    reopen: jest.fn()
}));

const REQUEST_ID = '6f1c2d3e-4a5b-4c6d-8e7f-900112233445';
const OPP_ID = 1;
const ROW_ID = 7;
const PROJECT_ID = 501;
const TASK_ID = 601;
const SAVED_ID_BY_TYPE = { job: PROJECT_ID, projecttask: TASK_ID };
const RUN_OPTIONS = { action: 'create', supportTypeId: 2 };

// Fake opportunity for a ready direct deal. Test data only.
const READY_VALUES = {
    title: 'Acme Apparel - Rapid Assessment',
    entity: 855,
    class: 1,
    custbody_pc_deal_uuid: 'd1',
    custbody_pc_referral_end_user: 855,
    custbody_pc_commercial_model: 1,
    custbody_pc_partner_contact: '',
    custbody_opp_asana_proj: '',
    custbody_opp_rate: 205,
    projectedtotal: 4100,
    custbody_opp_principal: 12,
    custbody_opp_proj_srcon: 13,
    custbody_opp_proj_staff: '',
    custbody_opp_proj_leaddev: '',
    custbody_opp_kickoff_meet: '',
    custbody_opp_proj_create: '',
    job: '',
    custbody_opp_task1_title: 'Discovery',
    custbody_opp_task1_hrs: 10,
    custbody_opp_task1_rate: 205,
    custbody_opp_task2_title: '',
    custbody_opp_task3_title: ''
};

const STORED_RESULT = {
    projectId: PROJECT_ID,
    projectUrl: 'https://x/project',
    nativeLink: true,
    tasks: [{ slot: '1', id: TASK_ID, created: true }],
    resumed: false,
    relay: 'skipped (no relay url)',
    notes: []
};

// Test-scope state, reset in beforeEach. Tests change oppValues or writeState before calling run().
let oppValues = {};
const writeState = { failTaskSaves: 0 };
const createdRecords = [];

/** Fake record for record.create. Stores field values and sublist lines so tests can read them back. */
const makeRecord = (type) => {
    const rec = {
        type,
        values: {},
        sublistValues: [],
        insertedLines: [],
        setValue: jest.fn(({ fieldId, value }) => {
            rec.values[fieldId] = value;
        }),
        setSublistValue: jest.fn(({ sublistId, fieldId, line, value }) => {
            rec.sublistValues.push({ sublistId, fieldId, line, value });
        }),
        insertLine: jest.fn(({ sublistId, line }) => {
            rec.insertedLines.push({ sublistId, line });
        }),
        getValue: jest.fn(({ fieldId }) => rec.values[fieldId]),
        save: jest.fn(() => {
            if (type === 'projecttask' && writeState.failTaskSaves > 0) {
                writeState.failTaskSaves -= 1;
                throw new Error('task save failed');
            }
            return SAVED_ID_BY_TYPE[type];
        })
    };
    return rec;
};

const readyCheck = (overrides) => Object.assign({
    ok: true,
    state: 'fresh',
    missing: [],
    noProject: false,
    projectId: null,
    channel: { relationship: 'Direct', billingPartyId: null },
    jobTypeId: 3
}, overrides);

const recordsOfType = (type) => createdRecords.filter((rec) => rec.type === type);

const sublistValuesFor = (rec, sublistId, fieldId) => rec.sublistValues
    .filter((v) => v.sublistId === sublistId && v.fieldId === fieldId)
    .map((v) => v.value);

const submitFieldsCalls = () => record.submitFields.mock.calls.map((call) => call[0]);

const run = (requestId = REQUEST_ID, options = RUN_OPTIONS) => builder.build(OPP_ID, requestId, options);

describe('PC | Project Builder acceptance criteria', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        createdRecords.length = 0;
        writeState.failTaskSaves = 0;
        oppValues = Object.assign({}, READY_VALUES);

        record.create.mockImplementation(({ type }) => {
            const rec = makeRecord(type);
            createdRecords.push(rec);
            return rec;
        });
        record.load.mockImplementation(() => ({
            id: OPP_ID,
            getValue: ({ fieldId }) => oppValues[fieldId]
        }));
        record.submitFields.mockImplementation(() => undefined);

        search.create.mockImplementation(() => ({
            run: () => ({ getRange: () => [] })
        }));
        search.lookupFields.mockImplementation(() => ({ entitystatus: [{ value: '24' }] }));

        runtime.getCurrentScript.mockImplementation(() => ({ getRemainingUsage: () => 1000 }));
        runtime.getCurrentUser.mockImplementation(() => ({ roleId: 'administrator' }));

        error.create.mockImplementation(({ name, message }) => {
            const err = new Error(message);
            err.name = name;
            return err;
        });

        https.post.mockImplementation(() => ({ code: 200 }));
        https.createSecureString.mockImplementation(() => 'secret');
        url.resolveRecord.mockImplementation(() => 'https://x/project');

        crypto.createHash.mockImplementation(() => ({
            update: jest.fn(),
            digest: jest.fn(() => 'hash')
        }));

        readiness.check.mockImplementation(() => readyCheck());
        readiness.findProject.mockImplementation(() => null);

        ledger.claim.mockImplementation(() => ({
            rowId: ROW_ID,
            existing: false,
            status: 'pending',
            step: 0,
            hash: 'hash',
            oppId: OPP_ID
        }));
        ledger.refuse.mockImplementation((rowId, reason) => ({ refused: true, reason }));
    });

    it('B1: a replay whose ledger row is done returns the stored result and creates nothing', () => {
        ledger.claim.mockImplementation(() => ({
            rowId: ROW_ID,
            existing: true,
            status: 'done',
            step: 7,
            hash: 'hash',
            oppId: OPP_ID,
            result: STORED_RESULT
        }));

        const result = run();

        expect(result).toEqual(STORED_RESULT);
        expect(record.create).not.toHaveBeenCalled();
        expect(record.submitFields).not.toHaveBeenCalled();
        expect(ledger.done).not.toHaveBeenCalled();
    });

    it('B2: a replay with the same request id and a different hash is refused', () => {
        ledger.claim.mockImplementation(() => ({
            rowId: ROW_ID,
            existing: true,
            status: 'pending',
            step: 2,
            hash: 'different-hash',
            oppId: OPP_ID,
            result: null
        }));

        const result = run();

        expect(result.refused).toBe(true);
        expect(result.reason).toMatch(/different request/);
        expect(record.create).not.toHaveBeenCalled();
        expect(ledger.refuse).not.toHaveBeenCalled();
    });

    it('B3: a replay whose ledger row is pending is refused as in progress', () => {
        ledger.claim.mockImplementation(() => ({
            rowId: ROW_ID,
            existing: true,
            status: 'pending',
            step: 2,
            hash: 'hash',
            oppId: OPP_ID,
            result: null
        }));

        const result = run();

        expect(result.refused).toBe(true);
        expect(result.reason).toMatch(/already in progress/);
        expect(record.create).not.toHaveBeenCalled();
    });

    it('B4: on a fresh ready deal the project is created once with externalid pc_proj_d1, the custom link is set, the status moves to 25 and the ledger row is marked done', () => {
        const result = run();

        const projects = recordsOfType('job');
        expect(projects).toHaveLength(1);
        expect(projects[0].values.externalid).toBe('pc_proj_d1');
        expect(record.submitFields).toHaveBeenCalledWith(expect.objectContaining({
            type: 'opportunity',
            id: OPP_ID,
            values: { custbody_opp_proj_create: PROJECT_ID }
        }));
        expect(record.submitFields).toHaveBeenCalledWith(expect.objectContaining({
            type: 'opportunity',
            id: OPP_ID,
            values: { entitystatus: 25 }
        }));
        expect(ledger.done).toHaveBeenCalledWith(ROW_ID, expect.objectContaining({ projectId: PROJECT_ID }));
        expect(result.projectId).toBe(PROJECT_ID);
    });

    it('B5: on a Subcontract channel the project parent is the billing party, and a native link failure is recorded as nativeLink false without throwing', () => {
        readiness.check.mockImplementation(() => readyCheck({
            channel: { relationship: 'Subcontract', billingPartyId: 44 }
        }));
        // Only the native job link write fails. The custom link and status writes do not carry the job field.
        record.submitFields.mockImplementation(({ values }) => {
            if (Object.prototype.hasOwnProperty.call(values, 'job')) {
                throw new Error('native job link rejected');
            }
        });

        let result;
        expect(() => {
            result = run();
        }).not.toThrow();

        expect(recordsOfType('job')[0].values.parent).toBe(44);
        expect(result.nativeLink).toBe(false);
        expect(ledger.done).toHaveBeenCalledWith(ROW_ID, expect.objectContaining({ nativeLink: false }));
    });

    it('B6: with no task titles one task NetSuite Configuration is created with the general rate and hours equal to projected total divided by rate', () => {
        oppValues.custbody_opp_task1_title = '';

        run();

        const tasks = recordsOfType('projecttask');
        expect(tasks).toHaveLength(1);
        expect(tasks[0].values.title).toBe('NetSuite Configuration');
        expect(tasks[0].values.estimatedwork).toBe(4100 / 205);
        expect(sublistValuesFor(tasks[0], 'assignee', 'unitprice')).toEqual([205, 205]);
    });

    it('B7: a task with a title gets its hours split equally across the assignees and the last share carries the rounding remainder', () => {
        // Two assignees (principal 12, senior consultant 13): 10 hours split as 5 and 5.
        run();
        const twoAssignees = recordsOfType('projecttask')[0];
        expect(sublistValuesFor(twoAssignees, 'assignee', 'estimatedwork')).toEqual([5, 5]);

        // Three assignees (adds staff consultant 14): 10 hours split as 3.33, 3.33 and 3.34.
        createdRecords.length = 0;
        oppValues.custbody_opp_proj_staff = 14;
        run();
        const threeAssignees = recordsOfType('projecttask')[0];
        expect(sublistValuesFor(threeAssignees, 'assignee', 'estimatedwork')).toEqual([3.33, 3.33, 3.34]);
    });

    it('B8: a title starting with ZZ TEST sets the travel exclusion on the project and skips the relay call', () => {
        oppValues.title = 'ZZ TEST Acme Apparel - Rapid Assessment';

        run();

        expect(recordsOfType('job')[0].values.custentity_pc_travel_exclude).toBe(true);
        expect(https.post).not.toHaveBeenCalled();
    });

    it('B9: a readiness result that is not ok is refused with the missing list and nothing is created', () => {
        readiness.check.mockImplementation(() => readyCheck({ ok: false, missing: ['Rate', 'Principal'] }));

        const result = run();

        expect(result.refused).toBe(true);
        expect(ledger.refuse).toHaveBeenCalledWith(
            ROW_ID,
            expect.any(String),
            expect.objectContaining({ missing: ['Rate', 'Principal'] })
        );
        expect(record.create).not.toHaveBeenCalled();
        expect(record.submitFields).not.toHaveBeenCalled();
    });

    it('B10: an unexpected failure after the project save marks the ledger row failed and rethrows', () => {
        // The project save succeeds; the first task save throws.
        writeState.failTaskSaves = 1;

        expect(() => run()).toThrow('task save failed');

        expect(recordsOfType('job')).toHaveLength(1);
        expect(ledger.fail).toHaveBeenCalledWith(
            ROW_ID,
            expect.objectContaining({ message: 'task save failed' })
        );
    });
});
