/**
 * Acceptance tests for PC | Channel Map Guard (pc_crm_channel_map_ue.js).
 * One test per acceptance criterion in the approved plan block (T1). Each title starts with the criterion ID.
 */
import script from 'SuiteScripts/PC/pc_crm_channel_map_ue';
import search from 'N/search';
import log from 'N/log';

jest.mock('N/search', () => ({
    create: jest.fn(),
    lookupFields: jest.fn()
}));

jest.mock('N/error', () => ({
    create: jest.fn((options) => {
        const err = new Error(options.message);
        err.name = options.name;
        return err;
    })
}));

jest.mock('N/log', () => ({
    audit: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));

const RECORD_TYPE = 'customrecord_pc_channel_map';
const RELATIONSHIP_LIST = 'customlist_pc_cm_relationship';

// 'isinactive' is the native flag on every custom record. A row is active when it is not 'T'.
const FIELD = {
    class: 'custrecord_pc_cm_class',
    relationship: 'custrecord_pc_cm_relationship',
    billingParty: 'custrecord_pc_cm_billing_party',
    inactive: 'isinactive'
};

// Internal ids of the list values used as test data. Subcontract is the list value the guard looks up by name.
const SUBCONTRACT_VALUE_ID = '1';
const OTHER_RELATIONSHIP_VALUE_ID = '3';

const USER_EVENT_TYPE = {
    CREATE: 'create',
    EDIT: 'edit',
    XEDIT: 'xedit',
    VIEW: 'view',
    DELETE: 'delete'
};

/**
 * Minimal user event context. getValue and getText read from plain objects keyed by field ID.
 * getFields returns the edited field IDs, which the guard uses on XEDIT.
 */
const buildContext = ({ type = USER_EVENT_TYPE.CREATE, id, values = {}, texts = {}, editedFields = [] }) => ({
    type,
    UserEventType: USER_EVENT_TYPE,
    newRecord: {
        id,
        type: RECORD_TYPE,
        getValue: ({ fieldId }) => values[fieldId],
        getText: ({ fieldId }) => texts[fieldId],
        getFields: () => editedFields
    }
});

/**
 * A new (CREATE) row. The relationship is carried as a list value id: '1' is Subcontract, '3' is any other value.
 * isinactive is 'F' for an active row and 'T' for an inactive one. Test data only; the ids are fixtures, not account values.
 */
const newRow = ({
    inactive = false,
    classValue = '12',
    relationshipValue = OTHER_RELATIONSHIP_VALUE_ID,
    billingParty = '44'
} = {}) =>
    buildContext({
        type: USER_EVENT_TYPE.CREATE,
        values: {
            [FIELD.class]: classValue,
            [FIELD.relationship]: relationshipValue,
            [FIELD.billingParty]: billingParty,
            [FIELD.inactive]: inactive ? 'T' : 'F'
        }
    });

// Rows the duplicate search on the channel map record returns. The guard only checks whether any row comes back.
let duplicateRows = [];

/** Sets the rows the duplicate search on the channel map record returns. */
const searchReturns = (rows) => {
    duplicateRows = rows;
};

/**
 * Routes search.create by the record or list type it is given. The relationship list lookup returns one row
 * for Subcontract (id '1'); the channel map duplicate search returns duplicateRows.
 */
const installSearchRouter = () => {
    search.create.mockImplementation(({ type }) => ({
        run: () => ({
            getRange: () => {
                if (type === RELATIONSHIP_LIST) {
                    return [{
                        id: SUBCONTRACT_VALUE_ID,
                        getValue: ({ name }) => (name === 'name' ? 'Subcontract' : undefined)
                    }];
                }
                return duplicateRows;
            }
        })
    }));
};

/** Calls fn and reports whether it threw, plus the thrown object, without failing the test. */
const capture = (fn) => {
    try {
        fn();
    } catch (thrown) {
        return { threw: true, error: thrown };
    }
    return { threw: false, error: undefined };
};

describe('PC | Channel Map Guard acceptance criteria', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        search.create.mockReset();
        search.lookupFields.mockReset();
        duplicateRows = [];
        installSearchRouter();
    });

    it('AC1: a new active row whose class already has another active row is refused with error name PC_CHANNEL_DUPLICATE', () => {
        searchReturns([{ id: '7' }]);

        const result = capture(() => script.beforeSubmit(newRow({ inactive: false, classValue: '12' })));

        expect(result.threw).toBe(true);
        expect(result.error.name).toBe('PC_CHANNEL_DUPLICATE');
    });

    it('AC2: a new row whose relationship text is Subcontract and whose billing party is empty is refused with error name PC_CHANNEL_NO_BILLING_PARTY', () => {
        searchReturns([]);

        const result = capture(() => script.beforeSubmit(newRow({
            relationshipValue: SUBCONTRACT_VALUE_ID,
            billingParty: ''
        })));

        expect(result.threw).toBe(true);
        expect(result.error.name).toBe('PC_CHANNEL_NO_BILLING_PARTY');
    });

    it('AC3: a new active Subcontract row with a billing party and no other active row for its class saves without error', () => {
        searchReturns([]);

        expect(() => script.beforeSubmit(newRow({
            inactive: false,
            relationshipValue: SUBCONTRACT_VALUE_ID,
            billingParty: '44'
        }))).not.toThrow();
    });

    it('AC4: an inactive row with a duplicate class saves without error', () => {
        searchReturns([{ id: '7' }]);

        expect(() => script.beforeSubmit(newRow({ inactive: true, classValue: '12' }))).not.toThrow();
    });

    it('AC5: on XEDIT the guard reads unedited fields through search.lookupFields and still refuses a duplicate class', () => {
        search.lookupFields.mockReturnValue({
            [FIELD.class]: [{ value: '12', text: 'Brand A' }],
            [FIELD.relationship]: [{ value: SUBCONTRACT_VALUE_ID, text: 'Subcontract' }],
            [FIELD.billingParty]: [{ value: '44', text: 'Partner Co' }],
            [FIELD.inactive]: 'F'
        });
        searchReturns([{ id: '7' }]);

        // Only the record name was edited, and the guard does not read it. Every guard field, including
        // isinactive, is therefore unedited and must come from the lookup.
        const ctx = buildContext({
            type: USER_EVENT_TYPE.XEDIT,
            id: '5',
            values: {},
            editedFields: ['name']
        });

        const result = capture(() => script.beforeSubmit(ctx));

        expect(search.lookupFields).toHaveBeenCalledWith(expect.objectContaining({ type: RECORD_TYPE, id: '5' }));
        expect(search.lookupFields).toHaveBeenCalledWith(expect.objectContaining({
            columns: expect.arrayContaining([FIELD.inactive])
        }));
        expect(search.create).toHaveBeenCalledWith(expect.objectContaining({
            filters: expect.arrayContaining([[FIELD.class, 'anyof', '12']])
        }));
        expect(result.threw).toBe(true);
        expect(result.error.name).toBe('PC_CHANNEL_DUPLICATE');
    });

    it('AC6: when the duplicate search itself throws, the save is refused (fail closed) and log.error is called', () => {
        search.create.mockImplementation(() => {
            throw new Error('search unavailable');
        });

        const result = capture(() => script.beforeSubmit(newRow()));

        expect(result.threw).toBe(true);
        expect(result.error.message).toBe('search unavailable');
        expect(log.error).toHaveBeenCalledTimes(1);
    });
});
