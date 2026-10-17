/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * PC | Create Project Service
 * Purpose: create or resume the project for a won opportunity through the shared builder, POST only, idempotent by request id.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: customdeploy_pc_crm_create_project_sl
 */
define(['N/runtime', 'N/search', 'N/record', 'N/log', './pc_crm_project_builder_lib'], (
    runtime,
    search,
    record,
    log,
    builderLib
) => {
    const PARAM_ALLOWED_ROLES = 'custscript_pc_sl_allowed_roles';
    const PARAM_SUPPORT_TYPE = 'custscript_pc_type_support_id';
    const PARAM_FAIL_AFTER_STEP = 'custscript_pc_fail_after_step';

    const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const ID_STRING = /^[1-9][0-9]{0,14}$/;
    const ACTIONS = ['create', 'resume'];
    const ALLOWED_KEYS = ['opportunityId', 'requestId', 'action'];
    const ROLE_ADMINISTRATOR = 'administrator';

    const respond = (context, payload) => {
        context.response.setHeader({ name: 'Content-Type', value: 'application/json' });
        context.response.write(JSON.stringify(payload));
    };

    const failure = (message, extra) => Object.assign({
        success: false,
        projectId: null,
        projectUrl: null,
        missing: [],
        state: null,
        resumed: false,
        error: message
    }, extra || {});

    const toPositiveIntOrNull = (value) => {
        const n = parseInt(value, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    };

    /**
     * Parses and validates the body. Returns {value} or {error}. Any bad value rejects the whole request:
     * unknown keys, a wrong type, a non-positive or non-integer id, a request id that is not a UUID v4, an
     * action outside create or resume.
     */
    const parseBody = (rawBody) => {
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            return { error: 'Request body must be JSON.' };
        }
        if (body === null || typeof body !== 'object' || Array.isArray(body)) {
            return { error: 'Request body must be a JSON object.' };
        }
        if (Object.keys(body).some((k) => !ALLOWED_KEYS.includes(k))) {
            return { error: 'Request contains an unexpected field.' };
        }

        const rawId = body.opportunityId;
        let opportunityId = null;
        if (typeof rawId === 'number' && Number.isInteger(rawId) && rawId > 0 && rawId <= 999999999999999) {
            opportunityId = rawId;
        } else if (typeof rawId === 'string' && ID_STRING.test(rawId)) {
            opportunityId = parseInt(rawId, 10);
        }
        if (!opportunityId) {
            return { error: 'opportunityId must be a positive integer.' };
        }
        if (typeof body.requestId !== 'string' || !UUID_V4.test(body.requestId)) {
            return { error: 'requestId must be a UUID v4.' };
        }
        if (typeof body.action !== 'string' || !ACTIONS.includes(body.action)) {
            return { error: 'action must be create or resume.' };
        }
        return {
            value: {
                opportunityId,
                requestId: body.requestId.toLowerCase(),
                action: body.action
            }
        };
    };

    const isRoleAllowed = (roleId, allowedParam) => {
        const allowed = String(allowedParam || '')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s.length > 0);
        allowed.push(ROLE_ADMINISTRATOR);
        return allowed.includes(String(roleId || '').toLowerCase());
    };

    const opportunityExists = (opportunityId) => {
        try {
            const found = search.lookupFields({
                type: record.Type.OPPORTUNITY,
                id: opportunityId,
                columns: ['entitystatus']
            });
            return found !== null && typeof found === 'object';
        } catch (e) {
            return false;
        }
    };

    const onRequest = (context) => {
        const request = context.request;
        let opportunityId = null;
        try {
            // Both branches write output: a blank page must never be the answer.
            if (request.method !== 'POST') {
                respond(context, { success: false, error: 'POST required' });
                return;
            }

            const parsed = parseBody(request.body);
            if (parsed.error) {
                respond(context, failure(parsed.error));
                return;
            }
            const input = parsed.value;
            opportunityId = input.opportunityId;

            const script = runtime.getCurrentScript();
            const roleId = runtime.getCurrentUser().roleId;
            if (!isRoleAllowed(roleId, script.getParameter({ name: PARAM_ALLOWED_ROLES }))) {
                log.audit({
                    title: `Create Project refused for opportunity ${opportunityId}`,
                    details: `Role ${roleId} is not on the allowed list.`
                });
                respond(context, failure('Your role may not create projects.'));
                return;
            }

            if (!opportunityExists(opportunityId)) {
                respond(context, failure('Opportunity not found.'));
                return;
            }

            const result = builderLib.build(opportunityId, input.requestId, {
                action: input.action,
                supportTypeId: toPositiveIntOrNull(script.getParameter({ name: PARAM_SUPPORT_TYPE })),
                failAfterStep: toPositiveIntOrNull(script.getParameter({ name: PARAM_FAIL_AFTER_STEP })),
                roleId
            });

            if (result.refused) {
                respond(context, failure(result.reason, {
                    projectId: result.projectId || null,
                    projectUrl: result.projectUrl || null,
                    missing: result.missing || [],
                    state: result.state || null
                }));
                return;
            }

            respond(context, {
                success: true,
                projectId: result.projectId,
                projectUrl: result.projectUrl,
                missing: [],
                state: 'complete',
                resumed: Boolean(result.resumed),
                error: null
            });
        } catch (e) {
            log.error({
                title: `onRequest failed on opportunity ${opportunityId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            // Named PC errors carry a message written for the user; anything else is shown generically.
            const safe = typeof e.name === 'string' && e.name.indexOf('PC_') === 0
                ? e.message
                : 'Project setup stopped. Check the PC Operation Ledger for this request, then resume.';
            respond(context, failure(safe));
        }
    };

    return { onRequest };
});
