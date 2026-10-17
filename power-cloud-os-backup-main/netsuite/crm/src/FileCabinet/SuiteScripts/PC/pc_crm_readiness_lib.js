/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
/**
 * PC | Readiness Gate
 * Purpose: decide whether a won opportunity may have its project created or resumed, and report its setup state (fresh, partial, complete, conflict) and what is missing.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: none (library)
 */
define([
    'N/search',
    'N/log',
    './pc_crm_channel_lib',
    './pc_crm_types_lib',
    './pc_crm_ledger_lib'
], (search, log, channelLib, typesLib, ledgerLib) => {
    const STATUS_WON_AWAITING_PROJECT = 24;
    const STATUS_WON_READY_FOR_KICKOFF = 25;
    const RELATIONSHIP_SUBCONTRACT = 'Subcontract';
    const RELATIONSHIP_REFERRAL = 'Referral';

    const toId = (value) => {
        const n = parseInt(value, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    };
    const toBool = (value) => value === true || value === 'T';
    const isBlank = (value) => value === null || value === undefined || value === '';

    const MSG = {
        complete: 'A project has already been created for this opportunity.',
        conflictLinks: 'The two project links on this opportunity point at different projects.',
        conflictInactive: 'The project for this opportunity is inactive.',
        foreign: 'This opportunity is linked to a project created outside the builder.',
        conflictForeign: 'A link on this opportunity points at a different project than the one built for this deal.',
        conflictLedger: 'The ledger shows a completed run, but the project cannot be found.'
    };

    /**
     * Finds the project built for a deal by external id pc_proj_{dealUuid}. Returns {id, inactive} or null.
     * Inactive projects are included so an inactive project is reported rather than recreated.
     */
    const findProject = (dealUuid) => {
        const rows = search.create({
            type: search.Type.JOB,
            filters: [['externalidstring', 'is', `pc_proj_${dealUuid}`]],
            columns: ['isinactive']
        }).run().getRange({ start: 0, end: 1 });
        if (rows.length === 0) {
            return null;
        }
        return {
            id: parseInt(rows[0].id, 10),
            inactive: toBool(rows[0].getValue({ name: 'isinactive' }))
        };
    };

    /**
     * Setup state from both opportunity links, the project with external id pc_proj_{D}, and the ledger.
     * fresh: no links, no project, no pending or failed row. partial: a project exists or a row is pending or
     * failed. complete: the project is linked and a ledger row is done, or a link points at a project made
     * outside the builder. conflict: the links disagree or the project is inactive.
     */
    const computeState = (oppRecord, params) => {
        const oppId = toId(oppRecord.id);
        const dealUuid = oppRecord.getValue({ fieldId: 'custbody_pc_deal_uuid' });
        const customLink = toId(oppRecord.getValue({ fieldId: 'custbody_opp_proj_create' }));
        const nativeLink = toId(oppRecord.getValue({ fieldId: 'job' }));

        const project = dealUuid ? findProject(dealUuid) : null;
        const rows = oppId
            ? ledgerLib.findByOpp(oppId, ledgerLib.ACTION_CREATE_PROJECT, params.excludeLedgerRowId)
            : [];
        const hasDone = rows.some((r) => r.status === 'done');
        const hasOpen = rows.some((r) => r.status === 'pending' || r.status === 'failed');
        const projectId = project ? project.id : null;

        const result = (state, message) => ({ state, message: message || '', projectId });

        if (project && project.inactive) {
            return result('conflict', MSG.conflictInactive);
        }
        if (customLink && nativeLink && customLink !== nativeLink) {
            return result('conflict', MSG.conflictLinks);
        }
        const foreignLink = (customLink && customLink !== projectId) || (nativeLink && nativeLink !== projectId);
        // Decided 2026-10-09 (orchestrator): a link to a project without external id pc_proj_{D} (the legacy
        // button's projects) is complete, not a conflict. If a pc_proj_{D} project also exists and a link points
        // elsewhere, the deal is a conflict instead.
        if (foreignLink && !project) {
            return result('complete', MSG.foreign);
        }
        if (foreignLink) {
            return result('conflict', MSG.conflictForeign);
        }
        if (hasDone && !project) {
            return result('conflict', MSG.conflictLedger);
        }
        // Decided 2026-10-09 (orchestrator): complete is the custom link plus a done ledger row; the native
        // job link is optional because it cannot be set on Subcontract deals.
        if (project && customLink && hasDone) {
            return result('complete', MSG.complete);
        }
        if (project || hasOpen || customLink) {
            return result('partial');
        }
        return result('fresh');
    };

    /**
     * Checks an opportunity record (loaded record or beforeLoad newRecord; only getValue is used).
     * params: { supportTypeId, excludeLedgerRowId } where excludeLedgerRowId is the caller's own claimed row, so
     * it does not count as evidence of earlier work.
     * Returns {ok, missing, noProject, state, stateMessage, projectId, channel, jobTypeId}. ok is true only when
     * the state is fresh or partial, no project-free engagement type applies, and nothing is missing.
     */
    const check = (oppRecord, params) => {
        const p = params || {};
        const val = (fieldId) => oppRecord.getValue({ fieldId });
        const missing = [];

        const stateInfo = computeState(oppRecord, p);
        const out = {
            ok: false,
            missing,
            noProject: false,
            state: stateInfo.state,
            stateMessage: stateInfo.message,
            projectId: stateInfo.projectId,
            channel: null,
            jobTypeId: null
        };

        // Engagement type.
        const engagementTypeId = val('custbody_pc_project_type');
        if (isBlank(engagementTypeId)) {
            missing.push('Engagement type');
        } else {
            const mapped = typesLib.toJobType(engagementTypeId, p.supportTypeId);
            if (mapped.noProject) {
                out.noProject = true;
                return out;
            }
            if (mapped.unmapped) {
                missing.push('Engagement type has no project mapping');
            } else {
                out.jobTypeId = mapped.jobTypeId;
            }
        }

        if (isBlank(val('custbody_pc_deal_uuid'))) {
            missing.push('Deal UUID');
        }
        if (isBlank(val('custbody_pc_referral_end_user'))) {
            missing.push('End Client');
        }

        // Class and channel map.
        const classId = val('class');
        if (isBlank(classId)) {
            missing.push('Class');
        } else {
            try {
                out.channel = channelLib.resolve(classId);
            } catch (e) {
                if (e.name === channelLib.ERR_UNMAPPED) {
                    missing.push('Class has no active channel map row');
                } else if (e.name === channelLib.ERR_AMBIGUOUS) {
                    missing.push('Class has more than one active channel map row');
                } else {
                    log.error({
                        title: `check failed resolving channel on opportunity ${oppRecord.id}`,
                        details: `${e.name}: ${e.message}\n${e.stack}`
                    });
                    throw e;
                }
            }
        }

        if (out.channel) {
            const ch = out.channel;
            const billingParty = toId(val('custbody_pc_billing_party'));
            if (ch.relationship === RELATIONSHIP_SUBCONTRACT && !ch.billingPartyId) {
                missing.push('Channel map row has no billing party');
            }
            if (billingParty !== ch.billingPartyId) {
                missing.push('Billing Party is out of step with the channel map (save the opportunity)');
            }
            if (ch.relationship === RELATIONSHIP_REFERRAL && isBlank(val('partner'))) {
                missing.push('Partner (required for a referral channel)');
            }
        }

        if (isBlank(val('custbody_pc_commercial_model'))) {
            missing.push('Commercial Model');
        }
        if (!(Number(val('custbody_opp_rate')) > 0)) {
            missing.push('Rate');
        }
        if (isBlank(val('custbody_opp_principal'))) {
            missing.push('Principal');
        }
        if (isBlank(val('custbody_pc_signed_date'))) {
            missing.push('Signed Agreement Date');
        }

        // Decided 2026-10-09 (orchestrator): status 24, or 25 on a partial state (a run that stopped after step 5).
        const status = toId(val('entitystatus'));
        const statusOk = status === STATUS_WON_AWAITING_PROJECT
            || (out.state === 'partial' && status === STATUS_WON_READY_FOR_KICKOFF);
        if (!statusOk) {
            missing.push('Status must be Won - Awaiting Project');
        }

        out.ok = (out.state === 'fresh' || out.state === 'partial') && missing.length === 0;
        return out;
    };

    return { check, findProject };
});
