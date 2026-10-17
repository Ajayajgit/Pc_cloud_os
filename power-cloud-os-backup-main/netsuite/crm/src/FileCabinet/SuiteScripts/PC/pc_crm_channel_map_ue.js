/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**
 * PC | Channel Map Guard
 * Purpose: refuse a PC | Channel Map save when another active row carries the same class, or when the relationship is Subcontract and no billing party is set.
 * Plan task: T1 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: customdeploy_pc_crm_channel_map_ue (customrecord_pc_channel_map, beforeSubmit)
 */
define(['N/search', 'N/error', 'N/log'], (search, error, log) => {
    const RECORD_TYPE = 'customrecord_pc_channel_map';
    const FIELD_CLASS = 'custrecord_pc_cm_class';
    const FIELD_RELATIONSHIP = 'custrecord_pc_cm_relationship';
    const FIELD_BILLING_PARTY = 'custrecord_pc_cm_billing_party';
    // Native flag on every custom record. A row is active when this is not T.
    const FIELD_INACTIVE = 'isinactive';

    const RELATIONSHIP_LIST = 'customlist_pc_cm_relationship';
    const SUBCONTRACT_NAME = 'Subcontract';

    const ERR_DUPLICATE = 'PC_CHANNEL_DUPLICATE';
    const ERR_NO_BILLING_PARTY = 'PC_CHANNEL_NO_BILLING_PARTY';
    const ERR_LIST_MISSING = 'PC_CHANNEL_LIST_MISSING';

    const toBool = (value) => value === true || value === 'T';

    // Internal id of the Subcontract value (val_pc_rel_sub). List value ids are assigned at deploy time, so the
    // id is read from the list once per execution and compared by value. Select display text is never used:
    // outside the UI a submitted record has no display text for a select field, and reading it throws.
    let subcontractId = null;

    const subcontractValueId = () => {
        if (subcontractId !== null) {
            return subcontractId;
        }
        const rows = search.create({
            type: RELATIONSHIP_LIST,
            filters: [['name', 'is', SUBCONTRACT_NAME]],
            columns: ['name']
        }).run().getRange({ start: 0, end: 1 });
        if (rows.length === 0) {
            throw error.create({
                name: ERR_LIST_MISSING,
                message: `Value "${SUBCONTRACT_NAME}" was not found in ${RELATIONSHIP_LIST}.`,
                notifyOff: true
            });
        }
        subcontractId = parseInt(rows[0].id, 10);
        return subcontractId;
    };

    /**
     * Reads the values the guard needs. On CREATE and EDIT the submitted record carries every field. On XEDIT
     * (inline edit, REST PATCH, mass update) it carries only the edited fields, so unedited fields come from
     * the stored record through a single lookup, and edited fields win.
     */
    const readValues = (context) => {
        const rec = context.newRecord;
        let stored = null;
        let edited = null;

        if (context.type === context.UserEventType.XEDIT) {
            edited = new Set(rec.getFields());
            stored = search.lookupFields({
                type: RECORD_TYPE,
                id: rec.id,
                columns: [FIELD_CLASS, FIELD_RELATIONSHIP, FIELD_BILLING_PARTY, FIELD_INACTIVE]
            });
        }

        const pick = (fieldId) => {
            if (edited === null || edited.has(fieldId)) {
                return rec.getValue({ fieldId });
            }
            const s = stored[fieldId];
            if (Array.isArray(s)) {
                return s.length ? s[0].value : '';
            }
            return s;
        };

        return {
            classValue: pick(FIELD_CLASS),
            relationshipValue: pick(FIELD_RELATIONSHIP),
            billingParty: pick(FIELD_BILLING_PARTY),
            active: !toBool(pick(FIELD_INACTIVE))
        };
    };

    const hasOtherActiveRowForClass = (classValue, ownId) => {
        const filters = [
            [FIELD_CLASS, 'anyof', classValue],
            'AND', ['isinactive', 'is', 'F']
        ];
        if (ownId) {
            filters.push('AND', ['internalid', 'noneof', ownId]);
        }
        const rows = search.create({ type: RECORD_TYPE, filters, columns: ['internalid'] })
            .run()
            .getRange({ start: 0, end: 1 });
        return rows.length > 0;
    };

    const beforeSubmit = (context) => {
        const rec = context.newRecord;
        const UET = context.UserEventType;
        if (context.type !== UET.CREATE && context.type !== UET.EDIT && context.type !== UET.XEDIT) {
            return;
        }

        try {
            const v = readValues(context);

            if (v.active && v.classValue && hasOtherActiveRowForClass(v.classValue, rec.id)) {
                throw error.create({
                    name: ERR_DUPLICATE,
                    message: 'Another active Channel Map row already exists for this class. Inactivate it first, '
                        + 'or mark this row inactive.',
                    notifyOff: true
                });
            }

            if (v.relationshipValue && Number(v.relationshipValue) === subcontractValueId() && !v.billingParty) {
                throw error.create({
                    name: ERR_NO_BILLING_PARTY,
                    message: 'A Subcontract row needs a Billing Party.',
                    notifyOff: true
                });
            }
        } catch (e) {
            if (e.name === ERR_DUPLICATE || e.name === ERR_NO_BILLING_PARTY) {
                // Deliberate refusal: record it at audit, then let the save fail with the readable message.
                log.audit({
                    title: `beforeSubmit refused ${RECORD_TYPE} ${rec.id || 'new'}`,
                    details: e.name
                });
                throw e;
            }
            log.error({
                title: `beforeSubmit failed on ${RECORD_TYPE} ${rec.id || 'new'}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            // Decided 2026-10-09 (orchestrator): fail closed. Reference data that could not be checked is not
            // saved; the error above carries the cause.
            throw e;
        }
    };

    return { beforeSubmit };
});
