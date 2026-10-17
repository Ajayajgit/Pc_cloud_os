/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
/**
 * PC | Saved Search Installer
 * Purpose: create the six public CRM saved searches (T5) with search.create and Search.save, idempotent by search id, GET only. ?mode=apply&ids=a,b rewrites the filters of existing searches from DEFINITIONS (2026-10-15 fix). Inactivate after the searches are imported into the project.
 * Plan task: T5 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-12
 * Deployments: customdeploy_pc_crm_search_installer_sl
 */
define(['N/runtime', 'N/search', 'N/log'], (runtime, search, log) => {
    const USAGE_FLOOR = 100;

    // Plain data only. Each filter is [name, operator, values], [name, operator, values, formula] or
    // [name, operator, values, null, join]. Each column is { name, sort, join }; sort is 'ASC', 'DESC' or omitted.
    // Records Browser (2026.1): on a transaction search Project is only reachable through the `job` join; on a
    // project search the parent customer is `customer` and `parent` means the parent project. The search type is a string
    // resolved in onRequest ('transaction', 'job' or a custom record script id).
    const DEFINITIONS = [
        {
            id: 'customsearch_pc_opp_no_end_client',
            title: 'PC | Opportunities missing End Client',
            type: 'transaction',
            filters: [
                ['type', 'anyof', ['Opprtnty']],
                ['mainline', 'is', ['T']],
                ['entitystatus', 'anyof', ['6', '7', '8', '9', '10', '11', '12', '18', '19', '21', '24', '25', '23']],
                ['custbody_pc_referral_end_user', 'anyof', ['@NONE@']]
            ],
            columns: [
                { name: 'internalid' },
                { name: 'tranid', sort: 'ASC' },
                { name: 'title' },
                { name: 'entity' },
                { name: 'entitystatus' },
                { name: 'class' },
                { name: 'custbody_pc_billing_party' },
                { name: 'datecreated' }
            ]
        },
        {
            // NetSuite caps a saved search script id at 40 characters and truncated the sheet's id to this.
            id: 'customsearch_pc_proj_sub_no_partner_cont',
            title: 'PC | Projects (subcontract) missing Partner Contact',
            type: 'job',
            filters: [
                ['isinactive', 'is', ['F']],
                // Project status: filter id is `status`, column id is `entitystatus` (Records Browser, job).
                ['status', 'anyof', ['2', '5', '17']],
                ['customer', 'anyof', ['136', '198', '514', '6']],
                ['custentity_pc_partner_contact', 'anyof', ['@NONE@']]
            ],
            columns: [
                { name: 'internalid' },
                { name: 'entityid' },
                { name: 'companyname', sort: 'ASC' },
                { name: 'customer' },
                { name: 'entitystatus' },
                { name: 'jobtype' },
                { name: 'custentity_proj_af_contact' },
                { name: 'datecreated' }
            ]
        },
        {
            id: 'customsearch_pc_inv_no_class_90d',
            title: 'PC | Invoices missing class (last 90 days)',
            type: 'transaction',
            filters: [
                ['type', 'anyof', ['CustInvc']],
                ['trandate', 'onorafter', ['daysago90']],
                // 2026-10-15: native filters replace the original formula, which failed with "unrecognized
                // field". Header rows are never tax, shipping or COGS lines, so these cover both cases.
                ['class', 'anyof', ['@NONE@']],
                ['taxline', 'is', ['F']],
                ['shipping', 'is', ['F']],
                ['cogs', 'is', ['F']]
            ],
            columns: [
                { name: 'internalid' },
                { name: 'tranid' },
                { name: 'trandate', sort: 'DESC' },
                { name: 'entity' },
                { name: 'entityid', join: 'job' },
                { name: 'mainline' },
                { name: 'item' },
                { name: 'class' },
                { name: 'amount' }
            ]
        },
        {
            id: 'customsearch_pc_recon_links',
            title: 'PC | CRM reconciliation: links',
            type: 'transaction',
            filters: [
                ['type', 'anyof', ['Opprtnty']],
                ['mainline', 'is', ['T']],
                ['custbody_opp_proj_create', 'noneof', ['@NONE@']],
                // The opportunity's native Project is the `jobmain` join (Job (Main Line)); the `job` join is empty on
                // every opportunity header row, so it matched deals whose Project was set (probe, 2026-10-15).
                ['internalid', 'anyof', ['@NONE@'], null, 'jobmain'],
                ['class', 'noneof', ['5', '6', '110', '3']]
            ],
            columns: [
                { name: 'tranid', sort: 'ASC' },
                { name: 'title' },
                { name: 'entity' },
                { name: 'class' },
                { name: 'custbody_opp_proj_create' },
                { name: 'entityid', join: 'jobmain' }
            ]
        },
        {
            id: 'customsearch_pc_recon_status24',
            title: 'PC | CRM reconciliation: status 24 with a project',
            type: 'transaction',
            filters: [
                ['type', 'anyof', ['Opprtnty']],
                ['mainline', 'is', ['T']],
                ['entitystatus', 'anyof', ['24']],
                ['custbody_opp_proj_create', 'noneof', ['@NONE@']]
            ],
            columns: [
                { name: 'tranid', sort: 'ASC' },
                { name: 'title' },
                { name: 'custbody_opp_proj_create' }
            ]
        },
        {
            id: 'customsearch_pc_recon_ledger',
            title: 'PC | CRM reconciliation: stale ledger rows',
            type: 'customrecord_pc_op_ledger',
            filters: [
                // Status list values: Pending 1, Failed 3.
                ['custrecord_pc_ol_status', 'anyof', ['1', '3']],
                [
                    'formulanumeric',
                    'equalto',
                    ['1'],
                    'CASE WHEN {created} < SYSDATE - 1/24 THEN 1 ELSE 0 END'
                ]
            ],
            columns: [
                { name: 'name' },
                { name: 'custrecord_pc_ol_action' },
                { name: 'custrecord_pc_ol_opp_id' },
                { name: 'custrecord_pc_ol_step' },
                { name: 'custrecord_pc_ol_status' },
                { name: 'custrecord_pc_ol_error' },
                { name: 'created', sort: 'ASC' }
            ]
        }
    ];

    // Rewrites the filters and columns of an existing saved search from DEFINITIONS (title and audience kept).
    const applyOne = (def, script) => {
        const s = search.load({ id: def.id });
        s.filters = buildFilters(def.filters);
        s.columns = buildColumns(def.columns);
        if (script.getRemainingUsage() < USAGE_FLOOR) {
            throw new Error('Governance floor reached before saving the search.');
        }
        s.save();
        return { id: def.id, action: 'updated' };
    };

    const respond = (context, payload) => {
        context.response.setHeader({ name: 'Content-Type', value: 'application/json' });
        context.response.write(JSON.stringify(payload));
    };

    /**
     * Builds every filter as a Filter object. Array filters and Filter objects cannot be mixed in one
     * filters value, and three of the six searches carry a formula filter, so all six use objects.
     */
    const buildFilters = (filterDefs) => filterDefs.map((f) => {
        const options = { name: f[0], operator: f[1], values: f[2] };
        if (f.length > 3 && f[3]) {
            options.formula = f[3];
        }
        if (f.length > 4 && f[4]) {
            options.join = f[4];
        }
        return search.createFilter(options);
    });

    const buildColumns = (columnDefs) => columnDefs.map((c) => {
        const options = { name: c.name };
        if (c.join) {
            options.join = c.join;
        }
        if (c.sort === 'ASC') {
            options.sort = search.Sort.ASC;
        } else if (c.sort === 'DESC') {
            options.sort = search.Sort.DESC;
        }
        return search.createColumn(options);
    });

    const searchExists = (id) => {
        try {
            search.load({ id });
            return true;
        } catch (e) {
            // Not loadable: treated as absent. A real create failure (duplicate id, permission) surfaces
            // on the create path and is logged and reported there.
            log.debug({ title: `Search ${id} not loaded`, details: `${e.name}: ${e.message}` });
            return false;
        }
    };

    const installOne = (def, script) => {
        if (searchExists(def.id)) {
            return { id: def.id, action: 'exists' };
        }
        const s = search.create({
            type: def.type,
            filters: buildFilters(def.filters),
            columns: buildColumns(def.columns)
        });
        s.id = def.id;
        s.title = def.title;
        s.isPublic = true;
        if (script.getRemainingUsage() < USAGE_FLOOR) {
            throw new Error('Governance floor reached before saving the search.');
        }
        s.save();
        return { id: def.id, action: 'created' };
    };

    const onRequest = (context) => {
        try {
            // Both branches write output: a blank page must never be the answer.
            if (context.request.method !== 'GET') {
                respond(context, { ok: false, error: 'GET required.' });
                return;
            }

            const script = runtime.getCurrentScript();
            const mode = context.request.parameters.mode || 'create';
            const only = (context.request.parameters.ids || '').split(',').filter(Boolean);
            const results = [];
            let failures = 0;

            DEFINITIONS.filter((def) => mode !== 'apply' || only.indexOf(def.id) >= 0).forEach((def) => {
                try {
                    results.push(mode === 'apply' ? applyOne(def, script) : installOne(def, script));
                } catch (e) {
                    failures += 1;
                    log.error({
                        title: def.id,
                        details: `${e.name}: ${e.message}`
                    });
                    results.push({ id: def.id, action: 'failed', errorName: e.name, message: e.message });
                }
            });

            respond(context, { ok: failures === 0, results });
        } catch (e) {
            log.error({
                title: 'Saved Search Installer failed',
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            respond(context, { ok: false, error: 'Installer stopped. Check the script execution log.' });
        }
    };

    return { onRequest };
});
