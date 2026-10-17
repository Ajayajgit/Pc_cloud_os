/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
/**
 * PC | Opportunity CRM Guard
 * Purpose: keep Billing Party and End Client in step with the channel map on every save, and show the Create Project or Resume button only when the readiness gate passes.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: customdeploy_pc_crm_opp_ue (OPPORTUNITY, beforeSubmit and beforeLoad)
 */
define([
    'N/record',
    'N/search',
    'N/runtime',
    'N/log',
    'N/error',
    'N/ui/serverWidget',
    './pc_crm_channel_lib',
    './pc_crm_readiness_lib'
], (record, search, runtime, log, error, serverWidget, channelLib, readinessLib) => {
    // String literal, not record.Type: no N module may be called while the define callback runs.
    const OPP_TYPE = 'opportunity';
    const FIELD_DEAL_UUID = 'custbody_pc_deal_uuid';
    const ERR_DEAL_UUID_DUPLICATE = 'PC_DEAL_UUID_DUPLICATE';
    const PARAM_SUPPORT_TYPE = 'custscript_pc_ue_type_support_id';
    const FIELD_BILLING_PARTY = 'custbody_pc_billing_party';
    const FIELD_END_CLIENT = 'custbody_pc_referral_end_user';
    const STATUS_AWAITING_PROJECT = 24;
    const STATUS_READY_FOR_KICKOFF = 25;
    const CLIENT_MODULE_PATH = './pc_crm_opp_cs.js';

    const toId = (value) => {
        const n = parseInt(value, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    };

    const escapeHtml = (text) => String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    /**
     * Refuses a Deal UUID already carried by another opportunity. Runs when the value is set and differs from the
     * stored value: on CREATE, on EDIT, and on XEDIT when the field is among the edited ones. Throws
     * PC_DEAL_UUID_DUPLICATE, the one error beforeSubmit lets refuse a save.
     */
    const checkDealUuid = (context, rec, stored) => {
        const UET = context.UserEventType;
        let newValue;
        let oldValue = '';
        if (context.type === UET.XEDIT) {
            if (rec.getFields().indexOf(FIELD_DEAL_UUID) === -1) {
                return;
            }
            newValue = rec.getValue({ fieldId: FIELD_DEAL_UUID });
            oldValue = stored.getValue({ fieldId: FIELD_DEAL_UUID });
        } else {
            newValue = rec.getValue({ fieldId: FIELD_DEAL_UUID });
            if (context.type === UET.EDIT) {
                oldValue = context.oldRecord.getValue({ fieldId: FIELD_DEAL_UUID });
            }
        }
        const next = String(newValue === null || newValue === undefined ? '' : newValue).trim();
        const prev = String(oldValue === null || oldValue === undefined ? '' : oldValue).trim();
        if (!next || next === prev) {
            return;
        }

        // No mainline filter: an opportunity search rejects it (SSS_INVALID_SRCH_FILTER, seen in production
        // 2026-10-09). Existence is all that matters here, so one row of any kind is enough.
        const filters = [
            [FIELD_DEAL_UUID, 'is', next]
        ];
        if (rec.id) {
            filters.push('AND', ['internalid', 'noneof', rec.id]);
        }
        const rows = search.create({
            type: search.Type.OPPORTUNITY,
            filters,
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        if (rows.length > 0) {
            throw error.create({
                name: ERR_DEAL_UUID_DUPLICATE,
                message: 'Another opportunity already carries this Deal UUID. A Deal UUID must be unique.',
                notifyOff: true
            });
        }
    };

    /**
     * Refuses a duplicate Deal UUID, sets Billing Party from the class through the channel map, and defaults End
     * Client from the entity. Writes only when a value actually changes.
     */
    const beforeSubmit = (context) => {
        const UET = context.UserEventType;
        if (context.type !== UET.CREATE && context.type !== UET.EDIT && context.type !== UET.XEDIT) {
            return;
        }
        const rec = context.newRecord;
        try {
            // XEDIT submits only the edited fields, so read class, entity and End Client from the full record.
            const source = context.type === UET.XEDIT
                ? record.load({ type: OPP_TYPE, id: rec.id })
                : rec;

            checkDealUuid(context, rec, source);

            // Billing Party: resolved from the class; cleared when the class has no active row.
            let billingPartyId = null;
            const classId = toId(source.getValue({ fieldId: 'class' }));
            if (classId) {
                try {
                    billingPartyId = channelLib.resolve(classId).billingPartyId;
                } catch (e) {
                    if (e.name === channelLib.ERR_UNMAPPED) {
                        billingPartyId = null;
                    } else if (e.name === channelLib.ERR_AMBIGUOUS) {
                        // Decided 2026-10-09 (orchestrator): more than one active row clears Billing Party and
                        // logs at audit (the Channel Map Guard prevents this state).
                        billingPartyId = null;
                        log.audit({
                            title: `beforeSubmit found ambiguous channel on ${rec.type} ${rec.id || 'new'}`,
                            details: `class ${classId}`
                        });
                    } else {
                        throw e;
                    }
                }
            }
            if (toId(source.getValue({ fieldId: FIELD_BILLING_PARTY })) !== billingPartyId) {
                // An empty select is written as '' (not null).
                rec.setValue({ fieldId: FIELD_BILLING_PARTY, value: billingPartyId === null ? '' : billingPartyId });
            }

            // End Client: default from the entity only when empty and the entity is not a channel billing party.
            const endClient = source.getValue({ fieldId: FIELD_END_CLIENT });
            const entityId = toId(source.getValue({ fieldId: 'entity' }));
            if ((endClient === null || endClient === undefined || endClient === '')
                && entityId
                && !channelLib.isBillingParty(entityId)) {
                rec.setValue({ fieldId: FIELD_END_CLIENT, value: entityId });
            }
        } catch (e) {
            if (e.name === ERR_DEAL_UUID_DUPLICATE) {
                // Deliberate refusal: record it at audit, then let the save fail with the readable message.
                log.audit({
                    title: `beforeSubmit refused ${rec.type} ${rec.id || 'new'}`,
                    details: e.name
                });
                throw e;
            }
            log.error({
                title: `beforeSubmit failed on ${rec.type} ${rec.id || 'new'}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            // Decided 2026-10-09 (orchestrator): any other failure is logged and the save goes ahead with
            // Billing Party unchanged; the readiness gate refuses project creation while it is out of step.
        }
    };

    const renderMessage = (form, title, lines) => {
        const field = form.addField({
            id: 'custpage_pc_readiness',
            type: serverWidget.FieldType.INLINEHTML,
            label: 'Project readiness'
        });
        const items = lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('');
        field.defaultValue = '<div style="margin:8px 0;padding:8px 12px;border:1px solid #c8c8c8;'
            + 'background:#fff8e1;font-size:13px;">'
            + `<b>${escapeHtml(title)}</b>${items ? `<ul style="margin:6px 0 0 18px;">${items}</ul>` : ''}</div>`;
    };

    /** VIEW only: the Create Project or Resume button, or a block listing what is missing. */
    const beforeLoad = (context) => {
        const rec = context.newRecord;
        try {
            if (context.type !== context.UserEventType.VIEW) {
                return;
            }
            // Project setup applies to deals at Won - Awaiting Project, or Won - Ready for Kick Off when a run
            // stopped part way. The status is read by lookup so the answer does not depend on the form layout.
            const found = search.lookupFields({ type: OPP_TYPE, id: rec.id, columns: ['entitystatus'] });
            const status = Array.isArray(found.entitystatus) && found.entitystatus.length
                ? toId(found.entitystatus[0].value)
                : null;
            if (status !== STATUS_AWAITING_PROJECT && status !== STATUS_READY_FOR_KICKOFF) {
                return;
            }

            // Load the record so readiness never depends on which fields the form shows.
            const full = record.load({ type: OPP_TYPE, id: rec.id });
            const supportTypeId = toId(runtime.getCurrentScript().getParameter({ name: PARAM_SUPPORT_TYPE }));
            const result = readinessLib.check(full, { supportTypeId });
            const form = context.form;

            // A deal at Won - Ready for Kick Off shows nothing unless a run stopped part way.
            if (status === STATUS_READY_FOR_KICKOFF && result.state !== 'partial') {
                return;
            }
            if (result.noProject) {
                renderMessage(form, 'No project is created for this engagement type.', []);
                return;
            }
            if (result.state === 'complete') {
                return;
            }
            if (result.state === 'conflict') {
                renderMessage(form, `Project setup is blocked: ${result.stateMessage}`, []);
                return;
            }

            if (result.ok && result.state === 'fresh') {
                form.clientScriptModulePath = CLIENT_MODULE_PATH;
                form.addButton({ id: 'custpage_pc_create_project', label: 'Create Project', functionName: 'createProject' });
            } else if (result.ok && result.state === 'partial') {
                form.clientScriptModulePath = CLIENT_MODULE_PATH;
                form.addButton({
                    id: 'custpage_pc_resume_project',
                    label: 'Resume Project Setup',
                    functionName: 'resumeProject'
                });
            } else {
                renderMessage(form, 'Project setup is not ready. Missing:', result.missing);
            }
        } catch (e) {
            // The record must still open; the error is on record.
            log.error({
                title: `beforeLoad failed on ${rec.type} ${rec.id}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
        }
    };

    return { beforeLoad, beforeSubmit };
});
