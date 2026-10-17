/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
/**
 * PC | Project Builder
 * Purpose: create or resume the project, tasks and links for a won opportunity, idempotent by request id and by namespaced external ids.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: none (library)
 */
define([
    'N/record',
    'N/search',
    'N/runtime',
    'N/error',
    'N/log',
    'N/https',
    'N/url',
    'N/crypto',
    'N/encode',
    './pc_crm_readiness_lib',
    './pc_crm_ledger_lib'
], (record, search, runtime, error, log, https, url, crypto, encode, readinessLib, ledgerLib) => {
    // String literal, not record.Type: no N module may be called while the define callback runs.
    const OPP_TYPE = 'opportunity';
    const TEST_PREFIX = 'ZZ TEST';
    const STATUS_AWAITING_PROJECT = 24;
    const STATUS_READY_FOR_KICKOFF = 25;
    const PROJECT_STATUS_AWARDED_PRE_KICKOFF = 5;
    const PROJECT_EXPENSE_TYPE = -2;
    const RELATIONSHIP_SUBCONTRACT = 'Subcontract';
    const SERVICE_ITEM_CONSULTANT = 6;
    const SERVICE_ITEM_LEAD_DEV = 7;
    const DEFAULT_TASK_TITLE = 'NetSuite Configuration';
    const USAGE_FLOOR = 150;
    const RELAY_PATH = '/refresh-projects';
    const RELAY_SECRET = '{custsecret_pc_relay}';
    const RELAY_CONFIG_TYPE = 'customrecord_navan_config';
    const RELAY_URL_FIELD = 'custrecord_navan_relay_url';

    // Staffing fields in role order, with the service item each role bills at (6 principal, senior and staff
    // consultants; 7 lead developer, from the legacy suitelet).
    const STAFF_FIELDS = [
        { fieldId: 'custbody_opp_principal', serviceItem: SERVICE_ITEM_CONSULTANT },
        { fieldId: 'custbody_opp_proj_srcon', serviceItem: SERVICE_ITEM_CONSULTANT },
        { fieldId: 'custbody_opp_proj_staff', serviceItem: SERVICE_ITEM_CONSULTANT },
        { fieldId: 'custbody_opp_proj_leaddev', serviceItem: SERVICE_ITEM_LEAD_DEV }
    ];

    const toId = (value) => {
        const n = parseInt(value, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    };
    const isBlank = (value) => value === null || value === undefined || value === '';
    const round2 = (n) => Math.round(n * 100) / 100;
    const isDate = (value) => Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());

    const setIfPresent = (rec, fieldId, value) => {
        if (!isBlank(value)) {
            rec.setValue({ fieldId, value });
        }
    };

    const makeError = (name, message) => error.create({ name, message, notifyOff: true });

    const ensureUsage = (what) => {
        if (runtime.getCurrentScript().getRemainingUsage() < USAGE_FLOOR) {
            throw makeError('PC_USAGE_LOW', `Governance floor reached before ${what}. Resume to continue.`);
        }
    };

    const sha256Hex = (text) => {
        const hash = crypto.createHash({ algorithm: crypto.HashAlg.SHA256 });
        hash.update({ input: text, inputEncoding: encode.Encoding.UTF_8 });
        return hash.digest({ outputEncoding: encode.Encoding.HEX });
    };

    // code tells a caller (the RESTlet) which refusal this is, without parsing the reason text:
    // PC_REPLAY_MISMATCH, PC_IN_PROGRESS, PC_NOT_READY (the default) or PC_RESULT_UNREADABLE.
    const refused = (reason, extra) => Object.assign({ refused: true, reason, code: 'PC_NOT_READY', state: null, missing: [] }, extra || {});

    /** Splits hours across n assignees to two decimals; the last line takes the rounding remainder. */
    const splitHours = (hours, count) => {
        if (count <= 0) {
            return [];
        }
        const each = round2(hours / count);
        const parts = new Array(count).fill(each);
        parts[count - 1] = round2(hours - each * (count - 1));
        return parts;
    };

    const findTask = (externalId) => {
        const rows = search.create({
            type: search.Type.PROJECT_TASK,
            filters: [['externalidstring', 'is', externalId]],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        return rows.length ? parseInt(rows[0].id, 10) : null;
    };

    /**
     * Project record in one save. Returns the project id. If the save fails and the project with this external
     * id now exists (a concurrent request won the race), that project is used instead.
     */
    const createProject = (opp, dealUuid, readiness, isTest) => {
        const channel = readiness.channel;
        const proj = record.create({ type: record.Type.JOB, isDynamic: false });

        proj.setValue({ fieldId: 'externalid', value: `pc_proj_${dealUuid}` });
        proj.setValue({ fieldId: 'companyname', value: opp.getValue({ fieldId: 'title' }) });
        proj.setValue({
            fieldId: 'parent',
            value: channel.relationship === RELATIONSHIP_SUBCONTRACT
                ? channel.billingPartyId
                : opp.getValue({ fieldId: 'entity' })
        });
        proj.setValue({ fieldId: 'entitystatus', value: PROJECT_STATUS_AWARDED_PRE_KICKOFF });
        proj.setValue({ fieldId: 'jobtype', value: readiness.jobTypeId });

        setIfPresent(proj, 'custentity_pc_end_client', opp.getValue({ fieldId: 'custbody_pc_referral_end_user' }));
        setIfPresent(proj, 'custentity_cus_rev_src', opp.getValue({ fieldId: 'class' }));
        setIfPresent(proj, 'custentity_pc_commercial_model', opp.getValue({ fieldId: 'custbody_pc_commercial_model' }));
        setIfPresent(proj, 'custentity_pc_partner_contact', opp.getValue({ fieldId: 'custbody_pc_partner_contact' }));
        proj.setValue({ fieldId: 'custentity_pc_deal_uuid', value: dealUuid });
        setIfPresent(proj, 'custentity_pc_asana_url', opp.getValue({ fieldId: 'custbody_opp_asana_proj' }));
        setIfPresent(proj, 'custentity_pc_project_billable_rate', opp.getValue({ fieldId: 'custbody_opp_rate' }));
        setIfPresent(proj, 'custentity_job_billings', opp.getValue({ fieldId: 'projectedtotal' }));
        setIfPresent(proj, 'custentity_pc_proj_principal', opp.getValue({ fieldId: 'custbody_opp_principal' }));
        setIfPresent(proj, 'custentity_pc_sen_consultant', opp.getValue({ fieldId: 'custbody_opp_proj_srcon' }));
        setIfPresent(proj, 'custentity_pc_proj_staff_cons', opp.getValue({ fieldId: 'custbody_opp_proj_staff' }));
        setIfPresent(proj, 'custentity_proj_lead_dev', opp.getValue({ fieldId: 'custbody_opp_proj_leaddev' }));

        // startdate only when the kickoff field holds a date.
        const kickoff = opp.getValue({ fieldId: 'custbody_opp_kickoff_meet' });
        if (isDate(kickoff)) {
            proj.setValue({ fieldId: 'startdate', value: kickoff });
        }

        proj.setValue({ fieldId: 'allowtime', value: true });
        proj.setValue({ fieldId: 'allowexpenses', value: true });
        proj.setValue({ fieldId: 'allowallresourcesfortasks', value: true });
        proj.setValue({ fieldId: 'projectexpensetype', value: PROJECT_EXPENSE_TYPE });

        // Test isolation: the exclusion flag is set in the first save so a test project never reaches a travel list.
        if (isTest) {
            proj.setValue({ fieldId: 'custentity_pc_travel_exclude', value: true });
        }

        try {
            return parseInt(proj.save({ ignoreMandatoryFields: false }), 10);
        } catch (e) {
            const again = readinessLib.findProject(dealUuid);
            if (again) {
                log.audit({
                    title: `createProject lost a race on opportunity ${opp.id}`,
                    details: `Using existing project ${again.id}`
                });
                return again.id;
            }
            throw e;
        }
    };

    /** Staffing from the four opportunity fields, one entry per distinct employee, in role order. */
    const readAssignees = (opp) => {
        const seen = new Set();
        const list = [];
        STAFF_FIELDS.forEach((s) => {
            const id = toId(opp.getValue({ fieldId: s.fieldId }));
            // Decided 2026-10-09 (orchestrator): one assignee line per employee; the first role in the order
            // principal, senior, staff, lead developer keeps the service item.
            if (id && !seen.has(id)) {
                seen.add(id);
                list.push({ resource: id, serviceItem: s.serviceItem });
            }
        });
        return list;
    };

    /**
     * Creates one project task with externalid, estimatedwork and assignee lines unless it already exists.
     * Returns {id, created}.
     */
    const ensureTask = (externalId, projectId, title, hours, rate, assignees) => {
        const existing = findTask(externalId);
        if (existing) {
            return { id: existing, created: false };
        }
        ensureUsage(`task ${externalId}`);

        const task = record.create({ type: record.Type.PROJECT_TASK, isDynamic: false });
        task.setValue({ fieldId: 'externalid', value: externalId });
        task.setValue({ fieldId: 'company', value: projectId });
        task.setValue({ fieldId: 'title', value: title });
        // Planned Work is mandatory on a project task in this account (USER_ERROR on save, 2026-10-09); the
        // legacy suitelet set it too. Estimated Work carries the same hours.
        task.setValue({ fieldId: 'plannedwork', value: hours });
        task.setValue({ fieldId: 'estimatedwork', value: hours });

        const shares = splitHours(hours, assignees.length);
        assignees.forEach((a, index) => {
            task.insertLine({ sublistId: 'assignee', line: index });
            task.setSublistValue({ sublistId: 'assignee', fieldId: 'resource', line: index, value: a.resource });
            task.setSublistValue({ sublistId: 'assignee', fieldId: 'serviceitem', line: index, value: a.serviceItem });
            task.setSublistValue({ sublistId: 'assignee', fieldId: 'unitprice', line: index, value: rate });
            task.setSublistValue({ sublistId: 'assignee', fieldId: 'plannedwork', line: index, value: shares[index] });
            task.setSublistValue({ sublistId: 'assignee', fieldId: 'estimatedwork', line: index, value: shares[index] });
        });

        try {
            return { id: parseInt(task.save(), 10), created: true };
        } catch (e) {
            const again = findTask(externalId);
            if (again) {
                log.audit({
                    title: `ensureTask lost a race on project ${projectId}`,
                    details: `Using existing task ${again}`
                });
                return { id: again, created: false };
            }
            throw e;
        }
    };

    /** Reads the relay URL from the Navan config record. Returns null when missing or not https. */
    const readRelayUrl = () => {
        const rows = search.create({
            type: RELAY_CONFIG_TYPE,
            columns: [RELAY_URL_FIELD]
        }).run().getRange({ start: 0, end: 1 });
        if (rows.length === 0) {
            return null;
        }
        const raw = String(rows[0].getValue({ name: RELAY_URL_FIELD }) || '').trim().replace(/\/+$/, '');
        return /^https:\/\//i.test(raw) ? raw : null;
    };

    /**
     * Relay refresh. Never fatal. Returns 'sent', 'skipped (test record)', 'skipped (no relay url)' or
     * 'failed'; failures are logged and left to the relay's daily sync.
     */
    const refreshRelay = (oppId, isTest) => {
        if (isTest) {
            return 'skipped (test record)';
        }
        try {
            const relayUrl = readRelayUrl();
            if (!relayUrl) {
                log.error({
                    title: `refreshRelay skipped on opportunity ${oppId}`,
                    details: 'Relay URL is missing or not https.'
                });
                return 'skipped (no relay url)';
            }
            const response = https.post({
                url: `${relayUrl}${RELAY_PATH}`,
                headers: {
                    'Content-Type': 'application/json',
                    'x-pc-secret': https.createSecureString({ input: RELAY_SECRET })
                },
                body: JSON.stringify({})
            });
            if (response.code >= 200 && response.code < 300) {
                return 'sent';
            }
            log.error({
                title: `refreshRelay failed on opportunity ${oppId}`,
                details: `Relay answered HTTP ${response.code}`
            });
            return 'failed';
        } catch (e) {
            log.error({
                title: `refreshRelay failed on opportunity ${oppId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            return 'failed';
        }
    };

    /**
     * Builds the project for a won opportunity.
     * @param {number} oppId opportunity internal id
     * @param {string} requestId UUID v4 of the request
     * @param {{action: string, supportTypeId: number, failAfterStep: number, roleId: string}} options
     * @returns {object} on success {projectId, projectUrl, nativeLink, tasks, resumed, relay, notes}; when the
     * request is refused {refused: true, reason, state, missing} (also stored on the ledger row). Throws on an
     * unexpected failure after marking the ledger row failed.
     */
    const build = (oppId, requestId, options) => {
        const opts = options || {};
        const action = opts.action === 'resume' ? 'resume' : 'create';
        const roleId = opts.roleId || runtime.getCurrentUser().roleId;
        const payloadHash = sha256Hex(`${action}:${oppId}`);

        // Step 0: claim the ledger row and apply the replay rules.
        const claimed = ledgerLib.claim(ledgerLib.ACTION_CREATE_PROJECT, requestId, payloadHash, oppId, roleId);
        let resumed = false;
        let reached = 0;
        if (claimed.existing) {
            if (claimed.hash !== payloadHash || (claimed.oppId && claimed.oppId !== Number(oppId))) {
                // The existing row is left exactly as it is; the replay is refused, not recorded.
                return refused('This request id was already used for a different request.', { code: 'PC_REPLAY_MISMATCH' });
            }
            if (claimed.status === 'done') {
                return claimed.result || refused('This request id was completed, but its stored result is unreadable.', { code: 'PC_RESULT_UNREADABLE' });
            }
            if (claimed.status === 'refused') {
                const stored = claimed.result || {};
                return refused(stored.reason || 'This request was refused.', {
                    state: stored.state || null,
                    missing: stored.missing || []
                });
            }
            if (claimed.status === 'pending') {
                // Decided 2026-10-09 (orchestrator): a replay of a pending request id is refused as in progress;
                // a new request id resumes a stalled run.
                return refused('This request is already in progress. Wait, or start a new request.', { code: 'PC_IN_PROGRESS' });
            }
            // failed: resume from the step reached.
            resumed = true;
            reached = claimed.step;
            ledgerLib.reopen(claimed.rowId);
        }
        const rowId = claimed.rowId;
        let isTest = false;

        const advance = (n, didWork) => {
            if (n > reached) {
                ledgerLib.step(rowId, n);
                reached = n;
            }
            // Fault injection: only for ZZ TEST records, and only after a step that did work in this run.
            if (didWork && isTest && Number(opts.failAfterStep) === n) {
                throw makeError('PC_TEST_FAULT', `Injected test fault after step ${n}.`);
            }
        };

        try {
            // Step 1: state and readiness.
            const opp = record.load({ type: OPP_TYPE, id: oppId });
            const title = String(opp.getValue({ fieldId: 'title' }) || '');
            isTest = title.indexOf(TEST_PREFIX) === 0;

            const readiness = readinessLib.check(opp, {
                supportTypeId: opts.supportTypeId,
                excludeLedgerRowId: rowId
            });
            if (readiness.noProject) {
                return ledgerLib.refuse(rowId, 'No project for this engagement type.', { state: readiness.state, missing: [] });
            }
            if (readiness.state !== 'fresh' && readiness.state !== 'partial') {
                const details = { state: readiness.state, missing: [] };
                if (readiness.projectId) {
                    details.projectId = readiness.projectId;
                    details.projectUrl = url.resolveRecord({ recordType: record.Type.JOB, recordId: readiness.projectId });
                }
                return ledgerLib.refuse(rowId, readiness.stateMessage, details);
            }
            if (!readiness.ok) {
                return ledgerLib.refuse(rowId, 'The opportunity is not ready for project creation.', {
                    state: readiness.state,
                    missing: readiness.missing
                });
            }
            if (readiness.state === 'partial') {
                resumed = true;
            }
            const dealUuid = String(opp.getValue({ fieldId: 'custbody_pc_deal_uuid' }));
            const notes = [];

            // Step 2 (ledger step 1): the project, looked up by external id, otherwise created in one save.
            let projectId = readiness.projectId;
            let projectCreated = false;
            if (!projectId) {
                ensureUsage('project create');
                projectId = createProject(opp, dealUuid, readiness, isTest);
                projectCreated = true;
            }
            if (reached < 1) {
                ledgerLib.step(rowId, 1, { custrecord_pc_ol_project: projectId });
                reached = 1;
            }
            if (projectCreated && isTest && Number(opts.failAfterStep) === 1) {
                throw makeError('PC_TEST_FAULT', 'Injected test fault after step 1.');
            }

            // Step 3 (ledger step 2): links. The custom link first, then the native link, which is never fatal.
            ensureUsage('opportunity link');
            let linkWork = false;
            if (toId(opp.getValue({ fieldId: 'custbody_opp_proj_create' })) !== projectId) {
                record.submitFields({
                    type: OPP_TYPE,
                    id: oppId,
                    values: { custbody_opp_proj_create: projectId },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                linkWork = true;
            }
            let nativeLink = toId(opp.getValue({ fieldId: 'job' })) === projectId;
            if (!nativeLink) {
                try {
                    record.submitFields({
                        type: OPP_TYPE,
                        id: oppId,
                        values: { job: projectId },
                        options: { enableSourcing: false, ignoreMandatoryFields: true }
                    });
                    nativeLink = true;
                } catch (e) {
                    // Expected on Subcontract deals: the native field accepts only a project of the opportunity's
                    // own customer. Recorded as nativeLink false, never fatal.
                    nativeLink = false;
                    log.audit({
                        title: `native job link not set on opportunity ${oppId}`,
                        details: `${e.name}: ${e.message}`
                    });
                }
            }
            advance(2, linkWork);

            // Step 4 (ledger steps 3 to 5): tasks by external id.
            const assignees = readAssignees(opp);
            const oppRate = Number(opp.getValue({ fieldId: 'custbody_opp_rate' })) || 0;
            const tasks = [];
            let anyTitle = false;
            for (let n = 1; n <= 3; n += 1) {
                const taskTitle = String(opp.getValue({ fieldId: `custbody_opp_task${n}_title` }) || '').trim();
                if (!taskTitle) {
                    continue;
                }
                anyTitle = true;
                const hours = round2(Number(opp.getValue({ fieldId: `custbody_opp_task${n}_hrs` })) || 0);
                // Decided 2026-10-09 (orchestrator): a blank Task rate falls back to the general rate
                // custbody_opp_rate; a rate that is present but zero is written as zero.
                const rawRate = opp.getValue({ fieldId: `custbody_opp_task${n}_rate` });
                let rate;
                if (isBlank(rawRate)) {
                    rate = oppRate;
                    notes.push(`task ${n} rate blank, general rate used`);
                } else {
                    rate = Number(rawRate) || 0;
                }
                const saved = ensureTask(`pc_task_${dealUuid}_${n}`, projectId, taskTitle, hours, rate, assignees);
                tasks.push({ slot: String(n), id: saved.id, created: saved.created });
                advance(2 + n, saved.created);
            }
            if (!anyTitle) {
                const projectedTotal = Number(opp.getValue({ fieldId: 'projectedtotal' })) || 0;
                let defaultHours = 1;
                if (projectedTotal > 0 && oppRate > 0) {
                    defaultHours = round2(projectedTotal / oppRate);
                } else {
                    notes.push('default task hours placeholder');
                }
                const saved = ensureTask(
                    `pc_task_${dealUuid}_default`,
                    projectId,
                    DEFAULT_TASK_TITLE,
                    defaultHours,
                    oppRate,
                    assignees
                );
                tasks.push({ slot: 'default', id: saved.id, created: saved.created });
                advance(3, saved.created);
            }

            // Step 5 (ledger step 6): status 24 to 25, only when the opportunity is still at 24.
            ensureUsage('status change');
            const current = search.lookupFields({ type: OPP_TYPE, id: oppId, columns: ['entitystatus'] });
            const currentStatus = Array.isArray(current.entitystatus) && current.entitystatus.length
                ? toId(current.entitystatus[0].value)
                : null;
            let statusWork = false;
            if (currentStatus === STATUS_AWAITING_PROJECT) {
                record.submitFields({
                    type: OPP_TYPE,
                    id: oppId,
                    values: { entitystatus: STATUS_READY_FOR_KICKOFF },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                statusWork = true;
            }
            advance(6, statusWork);

            // Step 6 (ledger step 7): relay refresh, never fatal, skipped for test records.
            const relay = refreshRelay(oppId, isTest);
            advance(7, relay === 'sent' || relay === 'failed');

            const result = {
                projectId,
                projectUrl: url.resolveRecord({ recordType: record.Type.JOB, recordId: projectId }),
                nativeLink,
                tasks,
                resumed,
                relay,
                notes
            };
            ledgerLib.done(rowId, result);
            log.audit({
                title: `build done on opportunity ${oppId}`,
                details: `project ${projectId}, nativeLink ${nativeLink}, resumed ${resumed}, relay ${relay}`
            });
            return result;
        } catch (e) {
            log.error({
                title: `build failed on opportunity ${oppId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            try {
                ledgerLib.fail(rowId, { name: e.name, message: e.message, step: reached });
            } catch (ledgerError) {
                log.error({
                    title: `build could not mark ledger row ${rowId} failed`,
                    details: `${ledgerError.name}: ${ledgerError.message}\n${ledgerError.stack}`
                });
            }
            throw e;
        }
    };

    return { build };
});
