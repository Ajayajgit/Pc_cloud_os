/**
 * Acceptance tests for PC | Class Propagation (pc_crm_class_propagate_ue.js).
 * One test per acceptance criterion in the approved plan block (T4). Each title starts with the criterion ID.
 */
import script from 'SuiteScripts/PC/pc_crm_class_propagate_ue';
import record from 'N/record';
import search from 'N/search';
import runtime from 'N/runtime';
import log from 'N/log';

jest.mock('N/record', () => ({
    load: jest.fn(),
    Type: { INVOICE: 'invoice', CREDIT_MEMO: 'creditmemo', TIME_BILL: 'timebill' }
}));

jest.mock('N/search', () => ({
    lookupFields: jest.fn(),
    Type: { JOB: 'job' }
}));

jest.mock('N/runtime', () => ({
    getCurrentScript: jest.fn()
}));

jest.mock('N/log', () => ({
    audit: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
}));

const PROJECT_ID = '4051';
const PROJECT_CLASS = '5';
const PROJECT_CLASS_FIELD = 'custentity_cus_rev_src';

const RECORD_TYPE = { INVOICE: 'invoice', TIME: 'timebill' };

const USER_EVENT_TYPE = {
    CREATE: 'create',
    EDIT: 'edit',
    XEDIT: 'xedit',
    VIEW: 'view',
    DELETE: 'delete'
};

/**
 * Fake NetSuite record. Header fields live in values; item lines live in lines (one object per line, keyed by field ID).
 * Every get and set goes through a jest.fn, so tests assert on setValue and setSublistValue calls directly.
 * The values and lines objects are copies, so the test's literals are not mutated by the script.
 */
const buildRecord = ({ type, id, values = {}, lines = [] }) => {
    const rec = {
        type,
        id,
        values: { ...values },
        lines: lines.map((line) => ({ ...line })),
        getValue: jest.fn(({ fieldId }) => rec.values[fieldId]),
        setValue: jest.fn(({ fieldId, value }) => {
            rec.values[fieldId] = value;
        }),
        getLineCount: jest.fn(() => rec.lines.length),
        getSublistValue: jest.fn(({ fieldId, line }) => rec.lines[line][fieldId]),
        setSublistValue: jest.fn(({ fieldId, line, value }) => {
            rec.lines[line][fieldId] = value;
        })
    };
    return rec;
};

/** Minimal user event context. The script reads newRecord, type and UserEventType. */
const contextFor = (newRecord, type = USER_EVENT_TYPE.CREATE) => ({
    type,
    UserEventType: USER_EVENT_TYPE,
    newRecord
});

/** The error NetSuite raises when an id does not resolve to a record (a plain customer, for example). */
const recordNotFound = () => {
    const err = new Error('Record not found');
    err.name = 'RCRD_DSNT_EXIST';
    return err;
};

/** Default lookup: project 4051 carries class 5; any other id throws as a plain customer would. */
const defaultLookup = ({ id }) => {
    if (String(id) === PROJECT_ID) {
        return { [PROJECT_CLASS_FIELD]: [{ value: PROJECT_CLASS, text: 'Anderson Frank' }] };
    }
    throw recordNotFound();
};

describe('PC | Class Propagation acceptance criteria', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        search.lookupFields.mockReset();
        search.lookupFields.mockImplementation(defaultLookup);
        record.load.mockReset();
        runtime.getCurrentScript.mockReturnValue({ getRemainingUsage: () => 5000 });
    });

    it('C1: an invoice with an empty header class and project 4051 gets header class 5 and every empty item line class 5', () => {
        const invoice = buildRecord({
            type: RECORD_TYPE.INVOICE,
            id: '101',
            values: { class: '', job: PROJECT_ID },
            lines: [{ class: '' }, { class: '' }]
        });

        script.beforeSubmit(contextFor(invoice));

        expect(search.lookupFields).toHaveBeenCalledWith(expect.objectContaining({ type: search.Type.JOB, id: PROJECT_ID }));
        expect(invoice.setValue).toHaveBeenCalledTimes(1);
        expect(invoice.setValue).toHaveBeenCalledWith({ fieldId: 'class', value: PROJECT_CLASS });
        expect(invoice.setSublistValue).toHaveBeenCalledTimes(2);
        expect(invoice.setSublistValue).toHaveBeenNthCalledWith(1, { sublistId: 'item', fieldId: 'class', line: 0, value: PROJECT_CLASS });
        expect(invoice.setSublistValue).toHaveBeenNthCalledWith(2, { sublistId: 'item', fieldId: 'class', line: 1, value: PROJECT_CLASS });
    });

    it('C2: an invoice whose header class is set and whose lines are blank gets the lines filled from the header without a project lookup', () => {
        const invoice = buildRecord({
            type: RECORD_TYPE.INVOICE,
            id: '102',
            values: { class: '12', job: PROJECT_ID },
            lines: [{ class: '' }, { class: '' }]
        });

        script.beforeSubmit(contextFor(invoice));

        expect(search.lookupFields).not.toHaveBeenCalled();
        expect(invoice.setValue).not.toHaveBeenCalled();
        expect(invoice.setSublistValue).toHaveBeenCalledTimes(2);
        expect(invoice.setSublistValue).toHaveBeenNthCalledWith(1, { sublistId: 'item', fieldId: 'class', line: 0, value: '12' });
        expect(invoice.setSublistValue).toHaveBeenNthCalledWith(2, { sublistId: 'item', fieldId: 'class', line: 1, value: '12' });
    });

    it('C3: an invoice with every class already set is left untouched and no lookup runs', () => {
        const invoice = buildRecord({
            type: RECORD_TYPE.INVOICE,
            id: '103',
            values: { class: '12', job: PROJECT_ID },
            lines: [{ class: '7' }, { class: '7' }]
        });

        script.beforeSubmit(contextFor(invoice));

        expect(search.lookupFields).not.toHaveBeenCalled();
        expect(invoice.setValue).not.toHaveBeenCalled();
        expect(invoice.setSublistValue).not.toHaveBeenCalled();
        expect(invoice.values).toEqual({ class: '12', job: PROJECT_ID });
        expect(invoice.lines).toEqual([{ class: '7' }, { class: '7' }]);
    });

    it('C4: a time entry whose customer is a plain customer (lookup throws) is left untouched and nothing is thrown', () => {
        const plainCustomerId = '999';
        const timeEntry = buildRecord({
            type: RECORD_TYPE.TIME,
            id: '104',
            values: { class: '', customer: plainCustomerId }
        });

        expect(() => script.beforeSubmit(contextFor(timeEntry))).not.toThrow();

        // The lookup was attempted and threw, so the untouched result comes from the throw path.
        expect(search.lookupFields).toHaveBeenCalledWith(expect.objectContaining({ id: plainCustomerId }));
        expect(timeEntry.setValue).not.toHaveBeenCalled();
        expect(timeEntry.setSublistValue).not.toHaveBeenCalled();
        expect(timeEntry.values.class).toBe('');
    });

    it('C5: a time entry whose customer is project 4051 gets class 5', () => {
        const timeEntry = buildRecord({
            type: RECORD_TYPE.TIME,
            id: '105',
            values: { class: '', customer: PROJECT_ID }
        });

        script.beforeSubmit(contextFor(timeEntry));

        expect(search.lookupFields).toHaveBeenCalledWith(expect.objectContaining({ type: search.Type.JOB, id: PROJECT_ID }));
        expect(timeEntry.setValue).toHaveBeenCalledTimes(1);
        expect(timeEntry.setValue).toHaveBeenCalledWith({ fieldId: 'class', value: PROJECT_CLASS });
        expect(timeEntry.values.class).toBe(PROJECT_CLASS);
    });

    it('C6: on XEDIT the record is loaded in full, only the header class is written and no line is touched', () => {
        const fullInvoice = buildRecord({
            type: RECORD_TYPE.INVOICE,
            id: '106',
            values: { class: '', job: PROJECT_ID },
            lines: [{ class: '' }, { class: '' }]
        });
        record.load.mockReturnValue(fullInvoice);

        // On XEDIT the newRecord carries only the edited fields, so it has no class or job value of its own.
        const editedRecord = buildRecord({ type: RECORD_TYPE.INVOICE, id: '106', values: {} });

        script.beforeSubmit(contextFor(editedRecord, USER_EVENT_TYPE.XEDIT));

        expect(record.load).toHaveBeenCalledWith({ type: RECORD_TYPE.INVOICE, id: '106' });
        expect(search.lookupFields).toHaveBeenCalledWith(expect.objectContaining({ id: PROJECT_ID }));
        expect(editedRecord.setValue).toHaveBeenCalledTimes(1);
        expect(editedRecord.setValue).toHaveBeenCalledWith({ fieldId: 'class', value: PROJECT_CLASS });
        expect(editedRecord.setSublistValue).not.toHaveBeenCalled();
        expect(fullInvoice.setValue).not.toHaveBeenCalled();
        expect(fullInvoice.setSublistValue).not.toHaveBeenCalled();
    });

    it('C7: when the lookup throws unexpectedly on an invoice the save is not blocked and the failure is logged at audit', () => {
        search.lookupFields.mockImplementation(() => {
            const err = new Error('Unexpected lookup failure');
            err.name = 'UNEXPECTED_ERROR';
            throw err;
        });
        const invoice = buildRecord({
            type: RECORD_TYPE.INVOICE,
            id: '107',
            values: { class: '', job: PROJECT_ID },
            lines: [{ class: '' }]
        });

        expect(() => script.beforeSubmit(contextFor(invoice))).not.toThrow();
        expect(log.audit).toHaveBeenCalled();
        expect(log.error).not.toHaveBeenCalled();
    });
});
