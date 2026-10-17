/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
/**
 * PC | Channel Resolver
 * Purpose: resolve a class to its single active PC | Channel Map row (relationship, billing party), and answer whether a customer is a channel billing party.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: none (library)
 */
define(['N/search', 'N/error', 'N/log'], (search, error, log) => {
    const RECORD_TYPE = 'customrecord_pc_channel_map';
    const FIELD_CLASS = 'custrecord_pc_cm_class';
    const FIELD_RELATIONSHIP = 'custrecord_pc_cm_relationship';
    const FIELD_BILLING_PARTY = 'custrecord_pc_cm_billing_party';

    const ERR_UNMAPPED = 'PC_CHANNEL_UNMAPPED';
    const ERR_AMBIGUOUS = 'PC_CHANNEL_AMBIGUOUS';

    const toIntOrNull = (value) => {
        const n = parseInt(value, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    };

    /**
     * Returns {relationship, billingPartyId} from the single active row for the class. A row is active when its
     * native Inactive flag is off; a retired row is marked Inactive, there is no separate Active field.
     * relationship is the list value label (Subcontract, Referral or Direct); billingPartyId is a positive
     * integer or null.
     * Throws PC_CHANNEL_UNMAPPED when no active row exists and PC_CHANNEL_AMBIGUOUS when more than one does.
     */
    const resolve = (classId) => {
        const classValue = toIntOrNull(classId);
        if (!classValue) {
            throw error.create({
                name: ERR_UNMAPPED,
                message: 'No class was supplied, so no channel map row can be resolved.',
                notifyOff: true
            });
        }

        const rows = search.create({
            type: RECORD_TYPE,
            filters: [
                [FIELD_CLASS, 'anyof', classValue],
                'AND', ['isinactive', 'is', 'F']
            ],
            columns: [FIELD_RELATIONSHIP, FIELD_BILLING_PARTY]
        }).run().getRange({ start: 0, end: 2 });

        if (rows.length === 0) {
            throw error.create({
                name: ERR_UNMAPPED,
                message: `Class ${classValue} has no active channel map row.`,
                notifyOff: true
            });
        }
        if (rows.length > 1) {
            throw error.create({
                name: ERR_AMBIGUOUS,
                message: `Class ${classValue} has more than one active channel map row.`,
                notifyOff: true
            });
        }

        const row = rows[0];
        return {
            relationship: row.getText({ name: FIELD_RELATIONSHIP }) || null,
            billingPartyId: toIntOrNull(row.getValue({ name: FIELD_BILLING_PARTY }))
        };
    };

    /**
     * True when the customer is the billing party on any channel map row, including retired (Inactive) rows.
     * Used so a billing party is never defaulted in as an End Client.
     */
    const isBillingParty = (customerId) => {
        const id = toIntOrNull(customerId);
        if (!id) {
            return false;
        }
        try {
            const rows = search.create({
                type: RECORD_TYPE,
                filters: [[FIELD_BILLING_PARTY, 'anyof', id]],
                columns: ['internalid']
            }).run().getRange({ start: 0, end: 1 });
            return rows.length > 0;
        } catch (e) {
            log.error({
                title: `isBillingParty failed on ${RECORD_TYPE}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            throw e;
        }
    };

    return { resolve, isBillingParty, ERR_UNMAPPED, ERR_AMBIGUOUS };
});
