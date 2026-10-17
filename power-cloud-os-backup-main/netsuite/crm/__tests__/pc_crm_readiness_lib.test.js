/**
 * Acceptance tests for PC | Readiness Gate (pc_crm_readiness_lib.js).
 * One test per acceptance criterion (R1 to R11) in the approved plan block (T2, Power Cloud NS/CRM/PLAN.md).
 * Each title starts with the criterion ID. The three sibling libraries are mocked by factory, so the library's
 * own imports are the only real code under test. Ids, deal UUIDs and channel values are test fixtures, not account values.
 */
import readiness from 'SuiteScripts/PC/pc_crm_readiness_lib';
import channelLib from 'SuiteScripts/PC/pc_crm_channel_lib';
import typesLib from 'SuiteScripts/PC/pc_crm_types_lib';
import ledgerLib from 'SuiteScripts/PC/pc_crm_ledger_lib';
import search from 'N/search';

jest.mock('N/search', () => ({
    create: jest.fn(),
    lookupFields: jest.fn(),
    Type: { JOB: 'job' }
}));

jest.mock('N/log', () => ({
    audit: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_channel_lib', () => ({
    resolve: jest.fn(),
    isBillingParty: jest.fn(),
    ERR_UNMAPPED: 'PC_CHANNEL_UNMAPPED',
    ERR_AMBIGUOUS: 'PC_CHANNEL_AMBIGUOUS'
}));

jest.mock('SuiteScripts/PC/pc_crm_types_lib', () => ({
    toJobType: jest.fn()
}));

jest.mock('SuiteScripts/PC/pc_crm_ledger_lib', () => ({
    ACTION_CREATE_PROJECT: 'create_project',
    findByOpp: jest.fn()
}));

const OPP_ID = '1001';
const PARAMS = { supportTypeId: 99 };
const DEAL_EXTERNAL_ID = 'pc_proj_d1';
const DEAL_PROJECT_ID = 321;
const OTHER_PROJECT_ID = 900;
const OTHER_PROJECT_ID_2 = 901;
const DONE_ROW = { rowId: 77, status: 'done', step: 6 };
const SUBCONTRACT_CHANNEL = { relationship: 'Subcontract', billingPartyId: 136 };

/** A complete, ready opportunity. Test data only. */
const READY_VALUES = {
    custbody_pc_project_type: 3,
    custbody_pc_deal_uuid: 'd1',
    custbody_pc_referral_end_user: 855,
    class: 5,
    custbody_pc_billing_party: 136,
    partner: '',
    custbody_pc_commercial_model: 1,
    custbody_opp_rate: 205,
    custbody_opp_principal: 12,
    custbody_pc_signed_date: new Date(2026, 8, 30),
    entitystatus: 24,
    custbody_opp_proj_create: '',
    job: ''
};

/**
 * Fake opportunity record. getValue reads from a plain object keyed by field ID; overrides replace fixture values.
 */
const buildOpp = (overrides = {}) => {
    const values = Object.assign({}, READY_VALUES, overrides);
    return {
        id: OPP_ID,
        getValue: ({ fieldId }) => values[fieldId]
    };
};

/** Projects that the job search can find, keyed by external id. Reset before each test. */
let projectsByExternalId = {};

/** Makes the project with the deal's external id exist (or, with inactive true, exist but be inactive). */
const withDealProject = ({ id = DEAL_PROJECT_ID, inactive = false } = {}) => {
    projectsByExternalId[DEAL_EXTERNAL_ID] = { id: String(id), inactive };
};

/**
 * Stands in for search.create(...).run().getRange(...) on the job search. The library filters on the external id
 * in the first filter's value, so the fake returns the matching project row, or no rows.
 */
const findProjectSearch = ({ filters }) => {
    const project = projectsByExternalId[filters[0][2]];
    const rows = project
        ? [{
            id: project.id,
            getValue: ({ name }) => (name === 'isinactive' ? (project.inactive ? 'T' : 'F') : undefined)
        }]
        : [];
    return { run: () => ({ getRange: () => rows }) };
};

/** Engagement type fixture: 3 maps to job type 3, 9 is a no-project type, anything else is unmapped. */
const toJobTypeFixture = (engagementTypeId) => {
    const type = Number(engagementTypeId);
    if (type === 3) {
        return { jobTypeId: 3 };
    }
    if (type === 9) {
        return { noProject: true };
    }
    return { unmapped: true };
};

describe('PC | Readiness Gate acceptance criteria', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        projectsByExternalId = {};
        search.create.mockImplementation(findProjectSearch);
        channelLib.resolve.mockImplementation(() => ({ ...SUBCONTRACT_CHANNEL }));
        channelLib.isBillingParty.mockImplementation(() => false);
        typesLib.toJobType.mockImplementation(toJobTypeFixture);
        ledgerLib.findByOpp.mockImplementation(() => []);
    });

    it("R1: a ready opportunity with no links, no project and no ledger rows is ok with state fresh", () => {
        const result = readiness.check(buildOpp(), PARAMS);

        expect(result.state).toBe('fresh');
        expect(result.ok).toBe(true);
        expect(result.missing).toEqual([]);
    });

    it("R2: a project with the deal's external id and no done ledger row gives state partial", () => {
        withDealProject({ id: DEAL_PROJECT_ID });

        const result = readiness.check(buildOpp(), PARAMS);

        expect(result.state).toBe('partial');
        expect(result.projectId).toBe(DEAL_PROJECT_ID);
    });

    it("R3: a custom link to the deal's project plus a done ledger row gives state complete and ok false", () => {
        withDealProject({ id: DEAL_PROJECT_ID });
        ledgerLib.findByOpp.mockImplementation(() => [DONE_ROW]);

        const result = readiness.check(buildOpp({ custbody_opp_proj_create: DEAL_PROJECT_ID }), PARAMS);

        expect(result.state).toBe('complete');
        expect(result.ok).toBe(false);
    });

    it("R4: a custom link to a project without the deal's external id, when no such project exists, gives state complete with the outside-builder message", () => {
        // No project with external id pc_proj_d1 exists (projectsByExternalId is empty).
        const result = readiness.check(buildOpp({ custbody_opp_proj_create: OTHER_PROJECT_ID }), PARAMS);

        expect(result.state).toBe('complete');
        expect(result.stateMessage).toMatch(/outside the builder/);
    });

    it("R5: custom and native links pointing at different projects give state conflict", () => {
        const result = readiness.check(
            buildOpp({ custbody_opp_proj_create: OTHER_PROJECT_ID, job: OTHER_PROJECT_ID_2 }),
            PARAMS
        );

        expect(result.state).toBe('conflict');
    });

    it("R6: an inactive project with the deal's external id gives state conflict", () => {
        withDealProject({ id: DEAL_PROJECT_ID, inactive: true });

        const result = readiness.check(buildOpp(), PARAMS);

        expect(result.state).toBe('conflict');
    });

    it("R7: each empty required field is reported by label: Engagement type, Deal UUID, End Client, Class, Commercial Model, Rate, Principal, Signed Agreement Date", () => {
        const requiredFields = [
            ['custbody_pc_project_type', 'Engagement type'],
            ['custbody_pc_deal_uuid', 'Deal UUID'],
            ['custbody_pc_referral_end_user', 'End Client'],
            ['class', 'Class'],
            ['custbody_pc_commercial_model', 'Commercial Model'],
            ['custbody_opp_rate', 'Rate'],
            ['custbody_opp_principal', 'Principal'],
            ['custbody_pc_signed_date', 'Signed Agreement Date']
        ];

        requiredFields.forEach(([fieldId, label]) => {
            const result = readiness.check(buildOpp({ [fieldId]: '' }), PARAMS);
            expect(result.missing).toContain(label);
        });
    });

    it("R8: engagement type 9 returns noProject true and ok false", () => {
        const result = readiness.check(buildOpp({ custbody_pc_project_type: 9 }), PARAMS);

        expect(result.noProject).toBe(true);
        expect(result.ok).toBe(false);
    });

    it("R9: a Referral channel with no partner adds the Partner line to missing", () => {
        channelLib.resolve.mockImplementation(() => ({ relationship: 'Referral', billingPartyId: 136 }));

        const result = readiness.check(buildOpp({ partner: '' }), PARAMS);

        expect(result.missing.some((line) => line.startsWith('Partner'))).toBe(true);
        expect(result.ok).toBe(false);
    });

    it("R10: a Billing Party that differs from the channel map adds its line to missing", () => {
        const result = readiness.check(buildOpp({ custbody_pc_billing_party: 999 }), PARAMS);

        expect(result.missing.some((line) => line.startsWith('Billing Party'))).toBe(true);
        expect(result.ok).toBe(false);
    });

    it("R11: status 25 is accepted on a partial state and refused on a fresh state", () => {
        // Partial: a project with the deal's external id exists and no ledger row is done.
        withDealProject({ id: DEAL_PROJECT_ID });
        const partial = readiness.check(buildOpp({ entitystatus: 25 }), PARAMS);

        expect(partial.state).toBe('partial');
        expect(partial.missing.some((line) => line.startsWith('Status'))).toBe(false);
        expect(partial.ok).toBe(true);

        // Fresh: no project, no links, no ledger rows.
        projectsByExternalId = {};
        const fresh = readiness.check(buildOpp({ entitystatus: 25 }), PARAMS);

        expect(fresh.state).toBe('fresh');
        expect(fresh.missing.some((line) => line.startsWith('Status'))).toBe(true);
        expect(fresh.ok).toBe(false);
    });
});
