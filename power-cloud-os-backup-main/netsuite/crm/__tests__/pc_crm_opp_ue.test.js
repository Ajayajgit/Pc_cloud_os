/**
 * Acceptance tests for PC | Opportunity CRM Guard (pc_crm_opp_ue.js), beforeSubmit only.
 * One test per acceptance criterion (G1 to G9) in the approved plan block (T2, Power Cloud NS/CRM/PLAN.md).
 * Each title starts with the criterion ID. The channel and readiness libraries are mocked by factory, so the
 * script's own logic is the only real code under test. Ids, Deal UUIDs and channel values are test fixtures,
 * not account values. beforeLoad is not covered here.
 */
import script from 'SuiteScripts/PC/pc_crm_opp_ue';
import record from 'N/record';
import search from 'N/search';
import log from 'N/log';
import channelLib from 'SuiteScripts/PC/pc_crm_channel_lib';

jest.mock('N/record', () => ({
    load: jest.fn()
}));

jest.mock('N/search', () => ({
    create: jest.fn(),
    lookupFields: jest.fn(),
    Type: { OPPORTUNITY: 'opportunity' }
}));

jest.mock('N/runtime', () => ({
    getCurrentScript: jest.fn()
}));

jest.mock('N/log', () => ({
    audit: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));

jest.mock('N/error', () => ({
    create: jest.fn((options) => {
        const err = new Error(options.message);
        err.name = options.name;
        return err;
    })
}));

jest.mock('N/ui/serverWidget', () => ({
    FieldType: { INLINEHTML: 'inlinehtml' }
}));

jest.mock('SuiteScripts/PC/pc_crm_channel_lib', () => ({
    resolve: jest.fn(),
    isBillingParty: jest.fn(),
    ERR_UNMAPPED: 'PC_CHANNEL_UNMAPPED',
    ERR_AMBIGUOUS: 'PC_CHANNEL_AMBIGUOUS'
}));

jest.mock('SuiteScripts/PC/pc_crm_readiness_lib', () => ({
    check: jest.fn()
}));

const OPP_ID = '2001';
const CLASS_ID = '5';
const BILLING_PARTY_ID = 136;
const ENTITY_ID = '5811';
const OTHER_CLASS_ID = '7';

const FIELD = {
    billingParty: 'custbody_pc_billing_party',
    endClient: 'custbody_pc_referral_end_user',
    dealUuid: 'custbody_pc_deal_uuid'
};

const USER_EVENT_TYPE = {
    CREATE: 'create',
    EDIT: 'edit',
    XEDIT: 'xedit',
    VIEW: 'view',
    DELETE: 'delete'
};

/**
 * Fake NetSuite opportunity. values holds the field values by ID. fields is what getFields returns; on XEDIT
 * the guard reads it to learn which fields were edited. Every get and set goes through a jest.fn.
 */
const buildRecord = ({ id = OPP_ID, values = {}, fields = Object.keys(values) } = {}) => {
    const rec = {
        type: 'opportunity',
        id,
        values: { ...values },
        getValue: jest.fn(({ fieldId }) => rec.values[fieldId]),
        setValue: jest.fn(({ fieldId, value }) => {
            rec.values[fieldId] = value;
        }),
        getFields: jest.fn(() => fields)
    };
    return rec;
};

/** Minimal user event context. The script reads newRecord, oldRecord, type and UserEventType. */
const contextFor = (newRecord, type = USER_EVENT_TYPE.CREATE, oldRecord) => ({
    type,
    UserEventType: USER_EVENT_TYPE,
    newRecord,
    oldRecord
});

/** Sets the rows the duplicate search on the opportunity record returns. The guard only checks for any row. */
const searchReturns = (rows) => {
    search.create.mockReturnValue({
        run: () => ({
            getRange: () => rows
        })
    });
};

/** The error the channel library raises when a class has no active row. Name read from the mocked constant. */
const unmappedError = () => {
    const err = new Error('no channel row');
    err.name = channelLib.ERR_UNMAPPED;
    return err;
};

/** The error the channel library raises when a class has more than one active row. */
const ambiguousError = () => {
    const err = new Error('more than one channel row');
    err.name = channelLib.ERR_AMBIGUOUS;
    return err;
};

describe('PC | Opportunity CRM Guard acceptance criteria', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        record.load.mockReset();
        search.create.mockReset();
        channelLib.resolve.mockReset();
        channelLib.isBillingParty.mockReset();
        searchReturns([]);
        // Class 5 maps to billing party 136. Any other class has no channel row.
        channelLib.resolve.mockImplementation((classId) => {
            if (classId === 5) {
                return { billingPartyId: BILLING_PARTY_ID };
            }
            throw unmappedError();
        });
        channelLib.isBillingParty.mockReturnValue(false);
    });

    it('G1: XEDIT with the full record loaded leaves Billing Party and End Client unchanged (regression: XEDIT must not clear Billing Party)', () => {
        const stored = buildRecord({
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID
            }
        });
        record.load.mockReturnValue(stored);

        // XEDIT submits only the edited field, so the new record carries no class, entity or party value of its own.
        const edited = buildRecord({
            values: { expectedclosedate: '2026-12-01' },
            fields: ['expectedclosedate']
        });

        script.beforeSubmit(contextFor(edited, USER_EVENT_TYPE.XEDIT));

        expect(record.load).toHaveBeenCalledTimes(1);
        expect(record.load).toHaveBeenCalledWith({ type: 'opportunity', id: edited.id });
        expect(edited.setValue).not.toHaveBeenCalledWith(expect.objectContaining({ fieldId: FIELD.billingParty }));
        expect(edited.setValue).not.toHaveBeenCalledWith(expect.objectContaining({ fieldId: FIELD.endClient }));
    });

    it('G2: XEDIT with a stale Billing Party sets it to the channel value resolved from the class', () => {
        const stored = buildRecord({
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: '',
                [FIELD.endClient]: ENTITY_ID
            }
        });
        record.load.mockReturnValue(stored);

        const edited = buildRecord({
            values: { expectedclosedate: '2026-12-01' },
            fields: ['expectedclosedate']
        });

        script.beforeSubmit(contextFor(edited, USER_EVENT_TYPE.XEDIT));

        expect(edited.setValue).toHaveBeenCalledWith({ fieldId: FIELD.billingParty, value: BILLING_PARTY_ID });
    });

    it('G3: XEDIT that does not edit the Deal UUID runs no duplicate search', () => {
        const stored = buildRecord({
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID,
                [FIELD.dealUuid]: 'b9f8e7d6-stored-uuid'
            }
        });
        record.load.mockReturnValue(stored);

        // getFields excludes the Deal UUID, so the field was not among the edited ones.
        const edited = buildRecord({
            values: { expectedclosedate: '2026-12-01' },
            fields: ['expectedclosedate']
        });

        script.beforeSubmit(contextFor(edited, USER_EVENT_TYPE.XEDIT));

        expect(search.create).not.toHaveBeenCalled();
    });

    it('G4: XEDIT that edits the Deal UUID to a value another opportunity carries is refused with PC_DEAL_UUID_DUPLICATE', () => {
        const stored = buildRecord({
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID,
                [FIELD.dealUuid]: 'b9f8e7d6-stored-uuid'
            }
        });
        record.load.mockReturnValue(stored);
        searchReturns([{ id: '3001' }]);

        const edited = buildRecord({
            values: { [FIELD.dealUuid]: 'a1b2c3d4-edited-uuid' },
            fields: [FIELD.dealUuid]
        });

        let thrown;
        try {
            script.beforeSubmit(contextFor(edited, USER_EVENT_TYPE.XEDIT));
        } catch (e) {
            thrown = e;
        }

        expect(search.create).toHaveBeenCalledTimes(1);
        expect(thrown).toBeDefined();
        expect(thrown.name).toBe('PC_DEAL_UUID_DUPLICATE');
    });

    it('G5: EDIT with a class that has no channel row clears Billing Party to empty', () => {
        const oldRec = buildRecord({
            values: {
                class: OTHER_CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID
            }
        });
        const edited = buildRecord({
            values: {
                class: OTHER_CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID
            }
        });

        script.beforeSubmit(contextFor(edited, USER_EVENT_TYPE.EDIT, oldRec));

        expect(channelLib.resolve).toHaveBeenCalledWith(7);
        expect(edited.setValue).toHaveBeenCalledWith({ fieldId: FIELD.billingParty, value: '' });
    });

    it('G6: CREATE with an empty End Client and a non-billing-party entity defaults End Client from the entity', () => {
        channelLib.isBillingParty.mockReturnValue(false);

        const created = buildRecord({
            id: null,
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ''
            }
        });

        script.beforeSubmit(contextFor(created, USER_EVENT_TYPE.CREATE));

        expect(channelLib.isBillingParty).toHaveBeenCalledWith(5811);
        expect(created.setValue).toHaveBeenCalledWith({ fieldId: FIELD.endClient, value: 5811 });
    });

    it('G6b: CREATE with an empty End Client and a billing-party entity leaves End Client empty', () => {
        channelLib.isBillingParty.mockReturnValue(true);

        const created = buildRecord({
            id: null,
            values: {
                class: CLASS_ID,
                entity: '136',
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ''
            }
        });

        script.beforeSubmit(contextFor(created, USER_EVENT_TYPE.CREATE));

        expect(channelLib.isBillingParty).toHaveBeenCalledWith(136);
        expect(created.setValue).not.toHaveBeenCalledWith(expect.objectContaining({ fieldId: FIELD.endClient }));
    });

    it('G7: an ambiguous channel clears Billing Party, logs at audit and does not throw', () => {
        channelLib.resolve.mockImplementation(() => {
            throw ambiguousError();
        });

        const created = buildRecord({
            id: null,
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID
            }
        });

        expect(() => script.beforeSubmit(contextFor(created, USER_EVENT_TYPE.CREATE))).not.toThrow();

        expect(created.setValue).toHaveBeenCalledWith({ fieldId: FIELD.billingParty, value: '' });
        expect(log.audit).toHaveBeenCalled();
    });

    it('G8: an unexpected error inside beforeSubmit is logged at error and the save is not blocked', () => {
        record.load.mockImplementation(() => {
            const err = new Error('record load failed');
            err.name = 'SSS_UNEXPECTED_ERROR';
            throw err;
        });

        const edited = buildRecord({
            values: { expectedclosedate: '2026-12-01' },
            fields: ['expectedclosedate']
        });

        expect(() => script.beforeSubmit(contextFor(edited, USER_EVENT_TYPE.XEDIT))).not.toThrow();
        expect(log.error).toHaveBeenCalled();
    });

    it('G9: DELETE does nothing: no load, no duplicate search and no field write', () => {
        const deleted = buildRecord({
            values: {
                class: CLASS_ID,
                entity: ENTITY_ID,
                [FIELD.billingParty]: BILLING_PARTY_ID,
                [FIELD.endClient]: ENTITY_ID,
                [FIELD.dealUuid]: 'a1b2c3d4-edited-uuid'
            }
        });

        script.beforeSubmit(contextFor(deleted, USER_EVENT_TYPE.DELETE));

        expect(record.load).not.toHaveBeenCalled();
        expect(search.create).not.toHaveBeenCalled();
        expect(deleted.setValue).not.toHaveBeenCalled();
    });
});
