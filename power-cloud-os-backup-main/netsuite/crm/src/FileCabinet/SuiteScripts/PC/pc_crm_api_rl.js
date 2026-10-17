/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
/**
 * PC | CRM API
 * Purpose: the one write path for the sales process: domain actions on end clients, opportunities, touches, close and project creation, idempotent by request id, plus the travel project list for the relay.
 * Plan task: T3 (Power Cloud NS/CRM/PLAN.md), proposal section 15
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: customdeploy_pc_crm_api_sales (customrole_pc_crm_sales_write), customdeploy_pc_crm_api_travel (customrole_pc_crm_travel_read)
 */
define([
    'N/record',
    'N/search',
    'N/runtime',
    'N/error',
    'N/log',
    'N/crypto',
    'N/encode',
    './pc_crm_ledger_lib',
    './pc_crm_project_builder_lib',
    './pc_crm_types_lib',
    './pc_crm_channel_lib'
], (record, search, runtime, error, log, crypto, encode, ledgerLib, builderLib, typesLib, channelLib) => {
    // Module scope holds string literals, numbers and regular expressions only. No N module is called or read
    // here: record and search types are strings, and enums (crypto.HashAlg, encode.Encoding, search.Sort) are
    // read inside functions.

    // ---- Script parameters ----
    const PARAM_SUPPORT_TYPE = 'custscript_pc_api_support_type_id';
    const PARAM_FAIL_AFTER_STEP = 'custscript_pc_api_fail_after_step';
    const PARAM_TRAVEL_SEARCH = 'custscript_pc_travel_search_id';
    const PARAM_DISABLED_ACTIONS = 'custscript_pc_api_disabled_actions';
    // OneWorld: every customer the sales process creates belongs to one subsidiary (Mike, 2026-10-09); its id is a
    // deployment parameter, never a literal here.
    const PARAM_SUBSIDIARY = 'custscript_pc_api_subsidiary_id';
    const DEFAULT_TRAVEL_SEARCH = 'customsearch901';
    const TRAVEL_SEARCH_ID = /^[A-Za-z0-9_]{1,64}$/;

    // ---- Record and list types (string literals) ----
    const T_CUSTOMER = 'customer';
    const T_CONTACT = 'contact';
    const T_OPPORTUNITY = 'opportunity';
    const T_PHONECALL = 'phonecall';
    const T_PROJECT = 'job';
    const T_CLASS = 'classification';
    const T_PARTNER = 'partner';
    const T_EMPLOYEE = 'employee';
    const LIST_ENGAGEMENT_TYPE = 'customlist_pc_proj_types';
    const LIST_COMMERCIAL_MODEL = 'customlist_pc_commercial_model';
    // Confirmed from Oracle's search.Type enum (WIN_LOSS_REASON), exercised at the first lost close.
    const LIST_WIN_LOSS_REASON = 'winlossreason';

    // Builder refusal code to API code (the builder's refused result carries `code`); anything else is NOT_READY.
    const BUILDER_CODES = {
        PC_REPLAY_MISMATCH: 'PC_API_REPLAY_MISMATCH',
        PC_IN_PROGRESS: 'PC_API_IN_PROGRESS',
        PC_RESULT_UNREADABLE: 'PC_API_FAILED'
    };

    const NOT_FOUND_ERRORS = ['RCRD_DSNT_EXIST', 'SSS_RECORD_TYPE_MISMATCH', 'INVALID_KEY_OR_REF'];

    // ---- Actions, deployments, roles ----
    const ACTIONS = [
        'resolveClient',
        'createEndClient',
        'createOpportunity',
        'updateOpportunity',
        'logTouch',
        'closeOpportunity',
        'createProject',
        'listTravelProjects'
    ];
    const LEDGERED_ACTIONS = ['createEndClient', 'createOpportunity', 'updateOpportunity', 'logTouch', 'closeOpportunity'];
    const REQUEST_ID_OPTIONAL = ['resolveClient', 'listTravelProjects'];
    const ROUTES = [
        {
            deployment: 'customdeploy_pc_crm_api_sales',
            role: 'customrole_pc_crm_sales_write',
            actions: [
                'resolveClient',
                'createEndClient',
                'createOpportunity',
                'updateOpportunity',
                'logTouch',
                'closeOpportunity',
                'createProject'
            ]
        },
        {
            deployment: 'customdeploy_pc_crm_api_travel',
            role: 'customrole_pc_crm_travel_read',
            actions: ['listTravelProjects']
        }
    ];
    const TOP_KEYS = ['action', 'requestId', 'payload'];

    // ---- Error codes ----
    const E_BAD_REQUEST = 'PC_API_BAD_REQUEST';
    const E_REFUSED = 'PC_API_REFUSED';
    const E_DISABLED = 'PC_API_DISABLED';
    const E_REPLAY_MISMATCH = 'PC_API_REPLAY_MISMATCH';
    const E_IN_PROGRESS = 'PC_API_IN_PROGRESS';
    const E_REFUSED_STATUS = 'PC_API_REFUSED_STATUS';
    const E_NOT_READY = 'PC_API_NOT_READY';
    const E_NOT_FOUND = 'PC_API_NOT_FOUND';
    const E_FAILED = 'PC_API_FAILED';

    // ---- Status machine ----
    const OPEN_STATUSES = [6, 7, 8, 9, 10, 11, 12, 18, 19, 21];
    const STATUS_KICKED_OFF = 23;
    const STATUS_AWAITING_PROJECT = 24;
    const STATUS_READY_FOR_KICKOFF = 25;
    const STATUS_CLOSED_WON = 13;
    const STATUS_CLOSED_LOST = 14;

    // ---- Limits and patterns ----
    const USAGE_FLOOR = 200;
    const TEST_PREFIX = 'ZZ TEST';
    const MAX_ID = 999999999999999;
    const MAX_MONEY = 100000000000;
    const MAX_HOURS = 100000;
    const MAX_CONTACTS = 10;
    const MAX_CANDIDATES = 10;
    const TRAVEL_PAGE_SIZE = 1000;
    const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const ID_STRING = /^[1-9][0-9]{0,14}$/;
    const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
    const EMAIL_DOMAIN = /^[a-z0-9.-]+\.[a-z]{2,}$/;

    // updateOpportunity: payload key to opportunity field id and value kind.
    const UPDATE_FIELDS = {
        entityStatusId: { fieldId: 'entitystatus', kind: 'status' },
        nextContact: { fieldId: 'custbody_opp_next_contact', kind: 'date' },
        expectedClose: { fieldId: 'expectedclosedate', kind: 'date' },
        projectedTotal: { fieldId: 'projectedtotal', kind: 'money' },
        task1Title: { fieldId: 'custbody_opp_task1_title', kind: 'title' },
        task2Title: { fieldId: 'custbody_opp_task2_title', kind: 'title' },
        task3Title: { fieldId: 'custbody_opp_task3_title', kind: 'title' },
        task1Hours: { fieldId: 'custbody_opp_task1_hrs', kind: 'hours' },
        task2Hours: { fieldId: 'custbody_opp_task2_hrs', kind: 'hours' },
        task3Hours: { fieldId: 'custbody_opp_task3_hrs', kind: 'hours' },
        task1Rate: { fieldId: 'custbody_opp_task1_rate', kind: 'money' },
        task2Rate: { fieldId: 'custbody_opp_task2_rate', kind: 'money' },
        task3Rate: { fieldId: 'custbody_opp_task3_rate', kind: 'money' },
        rate: { fieldId: 'custbody_opp_rate', kind: 'money' },
        principalId: { fieldId: 'custbody_opp_principal', kind: 'employee' },
        seniorConsultantId: { fieldId: 'custbody_opp_proj_srcon', kind: 'employee' },
        staffConsultantId: { fieldId: 'custbody_opp_proj_staff', kind: 'employee' },
        leadDeveloperId: { fieldId: 'custbody_opp_proj_leaddev', kind: 'employee' },
        commercialModelId: { fieldId: 'custbody_pc_commercial_model', kind: 'model' },
        asanaUrl: { fieldId: 'custbody_opp_asana_proj', kind: 'link' },
        onboardingSheet: { fieldId: 'custbody_opp_onboarding_sheet', kind: 'link' },
        kickoffDate: { fieldId: 'custbody_opp_kickoff_meet', kind: 'date' }
    };

    /** An expected, answerable failure. Carries the response code, a human message and safe details. */
    class ApiError extends Error {
        constructor(code, message, details) {
            super(message);
            this.name = 'ApiError';
            this.code = code;
            this.details = details || {};
        }
    }

    const bad = (message) => new ApiError(E_BAD_REQUEST, message);
    const notFound = (field) => new ApiError(E_NOT_FOUND, `${field} was not found or is inactive.`);

    // ---------------------------------------------------------------------------------------------
    // Responses
    // ---------------------------------------------------------------------------------------------

    const okResponse = (action, requestId, result, replayed) => ({
        ok: true,
        action: action || null,
        requestId: requestId || null,
        replayed: Boolean(replayed),
        result: result === undefined ? null : result,
        error: null
    });

    const errorResponse = (action, requestId, code, message, details, replayed) => ({
        ok: false,
        action: action || null,
        requestId: requestId || null,
        replayed: Boolean(replayed),
        result: null,
        error: { code, message, details: details || {} }
    });

    // ---------------------------------------------------------------------------------------------
    // Small helpers
    // ---------------------------------------------------------------------------------------------

    const makeError = (name, message) => error.create({ name, message, notifyOff: true });

    const ensureUsage = (what) => {
        if (runtime.getCurrentScript().getRemainingUsage() < USAGE_FLOOR) {
            throw makeError('PC_USAGE_LOW', `Governance floor reached before ${what}. Retry the request to continue.`);
        }
    };

    const param = (name) => runtime.getCurrentScript().getParameter({ name });

    const sha256Hex = (text) => {
        const hash = crypto.createHash({ algorithm: crypto.HashAlg.SHA256 });
        hash.update({ input: text, inputEncoding: encode.Encoding.UTF_8 });
        return hash.digest({ outputEncoding: encode.Encoding.HEX });
    };

    /** JSON with object keys sorted recursively; arrays keep their order. */
    const canonicalJson = (value) => {
        if (Array.isArray(value)) {
            return `[${value.map(canonicalJson).join(',')}]`;
        }
        if (value !== null && typeof value === 'object') {
            const parts = Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`);
            return `{${parts.join(',')}}`;
        }
        return JSON.stringify(value);
    };

    const toId = (value) => {
        if (typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= MAX_ID) {
            return value;
        }
        if (typeof value === 'string' && ID_STRING.test(value)) {
            return parseInt(value, 10);
        }
        return null;
    };

    const isUuidV4 = (value) => typeof value === 'string' && UUID_V4.test(value);

    /** True for yyyy-mm-dd that is a real calendar date. */
    const isIsoDate = (value) => {
        if (typeof value !== 'string') {
            return false;
        }
        const m = ISO_DATE.exec(value);
        if (!m) {
            return false;
        }
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const d = parseInt(m[3], 10);
        const date = new Date(y, mo - 1, d);
        return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
    };

    const toDate = (value) => {
        const m = ISO_DATE.exec(value);
        return new Date(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10));
    };

    const isText = (value, max, min) => {
        if (typeof value !== 'string') {
            return false;
        }
        const len = value.trim().length;
        return len >= (min === undefined ? 1 : min) && len <= max;
    };

    const isMoney = (value) => typeof value === 'number'
        && Number.isFinite(value)
        && value >= 0
        && value <= MAX_MONEY
        && Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

    const isHours = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_HOURS;

    const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

    const onlyKeys = (obj, allowed) => Object.keys(obj).every((k) => allowed.includes(k));

    const isEmail = (value) => {
        if (!isText(value, 254, 5) || /\s/.test(value)) {
            return false;
        }
        const parts = value.split('@');
        return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0;
    };

    const interleave = (list, op) => {
        if (list.length === 1) {
            return list[0];
        }
        const out = [];
        list.forEach((item, i) => {
            if (i > 0) {
                out.push(op);
            }
            out.push(item);
        });
        return out;
    };

    const firstValueId = (selectValue) => (Array.isArray(selectValue) && selectValue.length
        ? toId(selectValue[0].value)
        : null);

    /**
     * Reader over one payload object: rejects unknown keys up front, then each accessor checks type, length and
     * range and throws a BAD_REQUEST that names the field, never the value. Absent optional keys give undefined.
     * A key that is present is always checked, so null is a bad value, not an absent one.
     */
    const makeReader = (payload, allowed) => {
        if (!isPlainObject(payload)) {
            throw bad('payload must be a JSON object.');
        }
        if (!onlyKeys(payload, allowed)) {
            throw bad('Payload contains an unexpected field.');
        }
        const has = (k) => Object.prototype.hasOwnProperty.call(payload, k) && payload[k] !== undefined;
        const gate = (k, required) => {
            if (has(k)) {
                return true;
            }
            if (required) {
                throw bad(`${k} is required.`);
            }
            return false;
        };
        return {
            has,
            raw: (k) => payload[k],
            id: (k, required) => {
                if (!gate(k, required)) {
                    return undefined;
                }
                const v = toId(payload[k]);
                if (!v) {
                    throw bad(`${k} must be a positive integer.`);
                }
                return v;
            },
            uuid: (k, required) => {
                if (!gate(k, required)) {
                    return undefined;
                }
                if (!isUuidV4(payload[k])) {
                    throw bad(`${k} must be a UUID v4.`);
                }
                return payload[k].toLowerCase();
            },
            text: (k, max, min, required) => {
                if (!gate(k, required)) {
                    return undefined;
                }
                if (!isText(payload[k], max, min)) {
                    throw bad(`${k} must be text of ${min === undefined ? 1 : min} to ${max} characters.`);
                }
                return payload[k].trim();
            },
            email: (k, required) => {
                if (!gate(k, required)) {
                    return undefined;
                }
                if (!isEmail(payload[k])) {
                    throw bad(`${k} must be an email address.`);
                }
                return payload[k].trim();
            },
            date: (k, required) => {
                if (!gate(k, required)) {
                    return undefined;
                }
                if (!isIsoDate(payload[k])) {
                    throw bad(`${k} must be a date as yyyy-mm-dd.`);
                }
                return toDate(payload[k]);
            },
            money: (k, required) => {
                if (!gate(k, required)) {
                    return undefined;
                }
                if (!isMoney(payload[k])) {
                    throw bad(`${k} must be an amount of zero or more with two decimals or fewer.`);
                }
                return payload[k];
            }
        };
    };

    // ---------------------------------------------------------------------------------------------
    // Existence checks (search.lookupFields on the record type; custom lists through a search)
    // ---------------------------------------------------------------------------------------------

    const safeLookup = (type, id, columns) => {
        try {
            return search.lookupFields({ type, id, columns });
        } catch (e) {
            if (NOT_FOUND_ERRORS.includes(e.name)) {
                return null;
            }
            throw e;
        }
    };

    const requireActive = (type, id, field) => {
        ensureUsage(`lookup of ${field}`);
        const found = safeLookup(type, id, ['isinactive']);
        if (!found || typeof found.isinactive === 'undefined' || found.isinactive === true || found.isinactive === 'T') {
            throw notFound(field);
        }
    };

    const requireListValue = (listType, id, field) => {
        if (!listType) {
            return;
        }
        ensureUsage(`lookup of ${field}`);
        const rows = search.create({
            type: listType,
            filters: [['internalid', 'anyof', id], 'AND', ['isinactive', 'is', 'F']],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        if (rows.length === 0) {
            throw notFound(field);
        }
    };

    const requireOpportunity = (id, field) => {
        ensureUsage(`lookup of ${field}`);
        const found = safeLookup(T_OPPORTUNITY, id, ['entitystatus']);
        if (!found || typeof found.entitystatus === 'undefined') {
            throw notFound(field);
        }
    };

    const requireOpenStatus = (id, field) => {
        if (!OPEN_STATUSES.includes(id)) {
            throw bad(`${field} must be an open opportunity status.`);
        }
    };

    const findIdByExternalId = (type, externalId, extraFilters) => {
        const filters = [['externalidstring', 'is', externalId]];
        (extraFilters || []).forEach((f) => {
            filters.push('AND', f);
        });
        const rows = search.create({ type, filters, columns: ['internalid'] }).run().getRange({ start: 0, end: 1 });
        return rows.length ? parseInt(rows[0].id, 10) : null;
    };

    /** Saves a new record. If the save fails and a record with the external id now exists, that one is used. */
    const saveOrFind = (rec, type, externalId, extraFilters) => {
        try {
            return { id: parseInt(rec.save({ ignoreMandatoryFields: false }), 10), created: true };
        } catch (e) {
            const again = findIdByExternalId(type, externalId, extraFilters);
            if (again) {
                log.audit({
                    title: `save of ${type} lost a race`,
                    details: `Using existing ${type} ${again}`
                });
                return { id: again, created: false };
            }
            throw e;
        }
    };

    const setIfPresent = (rec, fieldId, value) => {
        if (value !== undefined && value !== null && value !== '') {
            rec.setValue({ fieldId, value });
        }
    };

    // ---------------------------------------------------------------------------------------------
    // Payload validation, two parts per action. The shape part (SHAPES) checks types, lengths, ranges, required
    // keys and the rules that need no record, and returns the normalized payload; it touches no record. The
    // reference part (REFS) checks every id against the live account. For ledgered actions the order in handle()
    // is shape, ledger claim (a stored answer is returned without any live lookup), then references, then the
    // action, so a replay of a finished request never re-checks references that may have changed since.
    // Whole request rejected on any bad value; nothing is written.
    // ---------------------------------------------------------------------------------------------

    const shapeResolveClient = (payload) => {
        const r = makeReader(payload, ['name', 'emailDomain']);
        const p = { name: r.text('name', 100, 2) };
        if (r.has('emailDomain')) {
            const d = r.raw('emailDomain');
            if (typeof d !== 'string' || d.length > 253 || !EMAIL_DOMAIN.test(d)) {
                throw bad('emailDomain must be a lowercase domain name.');
            }
            p.emailDomain = d;
        }
        if (p.name === undefined && p.emailDomain === undefined) {
            throw bad('name or emailDomain is required.');
        }
        return p;
    };

    const shapeCreateEndClient = (payload) => {
        const r = makeReader(payload, ['clientUUID', 'companyName', 'revenueSourceId', 'website', 'phone', 'email', 'contacts']);
        const p = {
            clientUUID: r.uuid('clientUUID', true),
            companyName: r.text('companyName', 83, 1, true),
            revenueSourceId: r.id('revenueSourceId', true),
            website: r.text('website', 100, 1),
            phone: r.text('phone', 21, 1),
            email: r.email('email'),
            contacts: []
        };
        if (r.has('contacts')) {
            const list = r.raw('contacts');
            if (!Array.isArray(list) || list.length > MAX_CONTACTS) {
                throw bad(`contacts must be a list of at most ${MAX_CONTACTS} items.`);
            }
            list.forEach((item) => {
                const c = makeReader(item, ['firstName', 'lastName', 'email', 'phone', 'title']);
                p.contacts.push({
                    firstName: c.text('firstName', 32, 1, true),
                    lastName: c.text('lastName', 32, 1, true),
                    email: c.email('email'),
                    phone: c.text('phone', 21, 1),
                    title: c.text('title', 100, 1)
                });
            });
        }
        return p;
    };

    const shapeCreateOpportunity = (payload) => {
        const r = makeReader(payload, [
            'dealUUID', 'title', 'entityId', 'endClientId', 'classId', 'partnerId', 'referralContactId',
            'engagementTypeId', 'commercialModelId', 'nextContact', 'expectedClose', 'principalId',
            'seniorConsultantId', 'staffConsultantId', 'leadDeveloperId', 'rate', 'entityStatusId', 'memo'
        ]);
        const p = {
            dealUUID: r.uuid('dealUUID', true),
            title: r.text('title', 200, 1, true),
            entityId: r.id('entityId', true),
            endClientId: r.id('endClientId'),
            classId: r.id('classId', true),
            partnerId: r.id('partnerId'),
            referralContactId: r.id('referralContactId'),
            engagementTypeId: r.id('engagementTypeId', true),
            commercialModelId: r.id('commercialModelId'),
            nextContact: r.date('nextContact'),
            expectedClose: r.date('expectedClose'),
            principalId: r.id('principalId'),
            seniorConsultantId: r.id('seniorConsultantId'),
            staffConsultantId: r.id('staffConsultantId'),
            leadDeveloperId: r.id('leadDeveloperId'),
            rate: r.money('rate'),
            // Required: an explicit open status at intake, no silent account default.
            entityStatusId: r.id('entityStatusId', true),
            memo: r.text('memo', 999, 1)
        };
        requireOpenStatus(p.entityStatusId, 'entityStatusId');
        if (p.referralContactId !== undefined && p.partnerId === undefined) {
            throw bad('Referral Contact requires a Partner.');
        }
        return p;
    };

    const refsCreateEndClient = (p) => {
        requireActive(T_CLASS, p.revenueSourceId, 'revenueSourceId');
    };

    const refsCreateOpportunity = (p) => {
        requireActive(T_CUSTOMER, p.entityId, 'entityId');
        if (p.endClientId !== undefined) {
            requireActive(T_CUSTOMER, p.endClientId, 'endClientId');
            ensureUsage('billing party check');
            // Only an explicit endClientId is checked: a channel billing party is never chosen as End Client.
            if (channelLib.isBillingParty(p.endClientId)) {
                throw bad('End Client cannot be a channel billing party.');
            }
        }
        requireActive(T_CLASS, p.classId, 'classId');
        if (p.partnerId !== undefined) {
            requireActive(T_PARTNER, p.partnerId, 'partnerId');
        }
        if (p.referralContactId !== undefined) {
            ensureUsage('lookup of referralContactId');
            const contact = safeLookup(T_CONTACT, p.referralContactId, ['company', 'isinactive']);
            if (!contact || typeof contact.isinactive === 'undefined' || contact.isinactive === true || contact.isinactive === 'T') {
                throw notFound('referralContactId');
            }
            if (firstValueId(contact.company) !== p.partnerId) {
                throw bad('Referral Contact does not belong to the Partner.');
            }
        }
        requireListValue(LIST_ENGAGEMENT_TYPE, p.engagementTypeId, 'engagementTypeId');
        if (p.commercialModelId !== undefined) {
            requireListValue(LIST_COMMERCIAL_MODEL, p.commercialModelId, 'commercialModelId');
        }
        ['principalId', 'seniorConsultantId', 'staffConsultantId', 'leadDeveloperId'].forEach((k) => {
            if (p[k] !== undefined) {
                requireActive(T_EMPLOYEE, p[k], k);
            }
        });
    };

    const shapeUpdateOpportunity = (payload) => {
        const r = makeReader(payload, ['opportunityId', 'fields']);
        const p = { opportunityId: r.id('opportunityId', true), fields: {}, values: {} };
        if (!r.has('fields')) {
            throw bad('fields is required.');
        }
        const f = makeReader(r.raw('fields'), Object.keys(UPDATE_FIELDS));
        const keys = Object.keys(r.raw('fields'));
        if (keys.length === 0) {
            throw bad('fields must contain at least one key.');
        }
        keys.forEach((k) => {
            const spec = UPDATE_FIELDS[k];
            let value;
            switch (spec.kind) {
                case 'status':
                    value = f.id(k, true);
                    break;
                case 'date':
                    value = f.date(k, true);
                    break;
                case 'money':
                    value = f.money(k, true);
                    break;
                case 'hours':
                    if (!isHours(f.raw(k))) {
                        throw bad(`${k} must be a number of zero or more.`);
                    }
                    value = f.raw(k);
                    break;
                case 'title':
                    value = f.raw(k) === '' ? '' : f.text(k, 200, 1, true);
                    break;
                case 'employee':
                    value = f.raw(k) === '' ? '' : f.id(k, true);
                    break;
                case 'model':
                    value = f.id(k, true);
                    break;
                default:
                    // link
                    value = f.text(k, 300, 1, true);
            }
            p.fields[k] = value;
            p.values[spec.fieldId] = value;
        });
        return p;
    };

    const refsUpdateOpportunity = (p) => {
        requireOpportunity(p.opportunityId, 'opportunityId');
        Object.keys(p.fields).forEach((k) => {
            const spec = UPDATE_FIELDS[k];
            if (spec.kind === 'employee' && p.fields[k] !== '') {
                requireActive(T_EMPLOYEE, p.fields[k], k);
            }
            if (spec.kind === 'model') {
                requireListValue(LIST_COMMERCIAL_MODEL, p.fields[k], k);
            }
        });
    };

    const shapeLogTouch = (payload) => {
        const r = makeReader(payload, ['opportunityId', 'title', 'note', 'occurredAt', 'nextContact', 'contactId']);
        return {
            opportunityId: r.id('opportunityId', true),
            // 100 characters: the Phone Call subject limit.
            title: r.text('title', 100, 1, true),
            note: r.text('note', 4000, 1),
            occurredAt: r.date('occurredAt'),
            nextContact: r.date('nextContact'),
            contactId: r.id('contactId')
        };
    };

    const refsLogTouch = (p) => {
        requireOpportunity(p.opportunityId, 'opportunityId');
        if (p.contactId !== undefined) {
            requireActive(T_CONTACT, p.contactId, 'contactId');
        }
    };

    const shapeCloseOpportunity = (payload) => {
        const r = makeReader(payload, ['opportunityId', 'outcome', 'signedDate', 'winLossReasonId', 'memo']);
        const p = {
            opportunityId: r.id('opportunityId', true),
            outcome: r.raw('outcome'),
            signedDate: undefined,
            winLossReasonId: undefined,
            memo: r.text('memo', 999, 1)
        };
        if (p.outcome !== 'won' && p.outcome !== 'lost') {
            throw bad('outcome must be won or lost.');
        }
        if (p.outcome === 'won') {
            if (r.has('winLossReasonId')) {
                throw bad('winLossReasonId applies to lost only.');
            }
            p.signedDate = r.date('signedDate', true);
        } else {
            if (r.has('signedDate')) {
                throw bad('signedDate applies to won only.');
            }
            p.winLossReasonId = r.id('winLossReasonId', true);
        }
        return p;
    };

    const refsCloseOpportunity = (p) => {
        requireOpportunity(p.opportunityId, 'opportunityId');
        if (p.winLossReasonId !== undefined) {
            requireListValue(LIST_WIN_LOSS_REASON, p.winLossReasonId, 'winLossReasonId');
        }
    };

    const shapeCreateProject = (payload) => {
        const r = makeReader(payload, ['opportunityId']);
        return { opportunityId: r.id('opportunityId', true) };
    };

    const refsCreateProject = (p) => {
        requireOpportunity(p.opportunityId, 'opportunityId');
    };

    const shapeListTravelProjects = (payload) => {
        makeReader(payload, []);
        return {};
    };

    const noRefs = () => undefined;

    const SHAPES = {
        resolveClient: shapeResolveClient,
        createEndClient: shapeCreateEndClient,
        createOpportunity: shapeCreateOpportunity,
        updateOpportunity: shapeUpdateOpportunity,
        logTouch: shapeLogTouch,
        closeOpportunity: shapeCloseOpportunity,
        createProject: shapeCreateProject,
        listTravelProjects: shapeListTravelProjects
    };

    const REFS = {
        resolveClient: noRefs,
        createEndClient: refsCreateEndClient,
        createOpportunity: refsCreateOpportunity,
        updateOpportunity: refsUpdateOpportunity,
        logTouch: refsLogTouch,
        closeOpportunity: refsCloseOpportunity,
        createProject: refsCreateProject,
        listTravelProjects: noRefs
    };

    /** Commits a ledger step once. Written right after a mutation so a retry never repeats it. */
    const commitStep = (run, n) => {
        if (n > run.reached) {
            ledgerLib.step(run.rowId, n);
            run.reached = n;
        }
    };

    // ---------------------------------------------------------------------------------------------
    // Actions
    // ---------------------------------------------------------------------------------------------

    const hostFromUrl = (raw) => {
        const s = String(raw || '').trim().toLowerCase();
        if (!s) {
            return null;
        }
        const host = s
            .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
            .split(/[/?#]/)[0]
            .split('@')
            .pop()
            .split(':')[0];
        return host || null;
    };

    const domainFromEmail = (raw) => {
        const s = String(raw || '').trim().toLowerCase();
        const at = s.lastIndexOf('@');
        return at >= 0 && at < s.length - 1 ? s.slice(at + 1) : null;
    };

    /** Read-only. Never creates a record and never touches the ledger. */
    const runResolveClient = (p) => {
        const tokens = p.name ? p.name.split(/\s+/).filter((t) => t.length > 0) : [];
        const alternatives = [];
        if (tokens.length) {
            alternatives.push(interleave(tokens.map((t) => ['companyname', 'contains', t]), 'AND'));
        }
        if (p.emailDomain) {
            alternatives.push(['url', 'contains', p.emailDomain]);
            alternatives.push(['email', 'contains', `@${p.emailDomain}`]);
        }
        ensureUsage('client search');
        const rows = search.create({
            type: T_CUSTOMER,
            filters: [['isinactive', 'is', 'F'], 'AND', interleave(alternatives, 'OR')],
            columns: [
                search.createColumn({ name: 'companyname', sort: search.Sort.ASC }),
                'entityid',
                'stage',
                'url',
                'email'
            ]
        }).run().getRange({ start: 0, end: MAX_CANDIDATES });

        const candidates = [];
        rows.forEach((row) => {
            ensureUsage('billing party check');
            const id = parseInt(row.id, 10);
            candidates.push({
                id,
                stage: row.getValue({ name: 'stage' }) || null,
                name: row.getValue({ name: 'companyname' }) || row.getValue({ name: 'entityid' }) || null,
                domain: hostFromUrl(row.getValue({ name: 'url' })) || domainFromEmail(row.getValue({ name: 'email' })),
                isBillingParty: channelLib.isBillingParty(id)
            });
        });
        return { candidates, count: candidates.length };
    };

    const runCreateEndClient = (p, run) => {
        const isTest = p.companyName.indexOf(TEST_PREFIX) === 0;
        const failAfter = toId(param(PARAM_FAIL_AFTER_STEP));

        // Records the step in the ledger once, then applies the test fault. A fault fires only after a step that
        // did work in this run, so a retry of the same request id resumes instead of failing again.
        const advance = (n, didWork) => {
            if (n > run.reached) {
                ledgerLib.step(run.rowId, n);
                run.reached = n;
            }
            if (didWork && isTest && failAfter === n) {
                throw makeError('PC_TEST_FAULT', `Injected test fault after step ${n}.`);
            }
        };

        // Step 1: the customer, by external id.
        const clientExternalId = `pc_client_${p.clientUUID}`;
        ensureUsage('customer lookup');
        let customerId = findIdByExternalId(T_CUSTOMER, clientExternalId);
        let customerCreated = false;
        if (!customerId) {
            ensureUsage('customer save');
            const rec = record.create({ type: T_CUSTOMER, isDynamic: false });
            rec.setValue({ fieldId: 'isperson', value: 'F' });
            rec.setValue({ fieldId: 'companyname', value: p.companyName });
            rec.setValue({ fieldId: 'custentity_cus_rev_src', value: p.revenueSourceId });
            const subsidiaryId = toId(param(PARAM_SUBSIDIARY));
            if (subsidiaryId) {
                rec.setValue({ fieldId: 'subsidiary', value: subsidiaryId });
            }
            setIfPresent(rec, 'url', p.website);
            setIfPresent(rec, 'phone', p.phone);
            setIfPresent(rec, 'email', p.email);
            rec.setValue({ fieldId: 'externalid', value: clientExternalId });
            const saved = saveOrFind(rec, T_CUSTOMER, clientExternalId);
            customerId = saved.id;
            customerCreated = saved.created;
        }
        advance(1, customerCreated);

        // Step 1 + i: contact i, by external id. A retry resumes at the first missing contact.
        const contacts = [];
        p.contacts.forEach((c, index) => {
            const i = index + 1;
            const contactExternalId = `pc_contact_${p.clientUUID}_${i}`;
            ensureUsage(`contact ${i} lookup`);
            let contactId = findIdByExternalId(T_CONTACT, contactExternalId);
            let contactCreated = false;
            if (!contactId) {
                ensureUsage(`contact ${i} save`);
                const rec = record.create({ type: T_CONTACT, isDynamic: false });
                rec.setValue({ fieldId: 'company', value: customerId });
                rec.setValue({ fieldId: 'firstname', value: c.firstName });
                rec.setValue({ fieldId: 'lastname', value: c.lastName });
                setIfPresent(rec, 'email', c.email);
                setIfPresent(rec, 'phone', c.phone);
                setIfPresent(rec, 'title', c.title);
                rec.setValue({ fieldId: 'externalid', value: contactExternalId });
                const saved = saveOrFind(rec, T_CONTACT, contactExternalId);
                contactId = saved.id;
                contactCreated = saved.created;
            }
            advance(1 + i, contactCreated);
            contacts.push({ index: i, id: contactId, created: contactCreated });
        });

        return { customerId, created: customerCreated, contacts };
    };

    const runCreateOpportunity = (p) => {
        const externalId = `pc_opp_${p.dealUUID}`;
        // No mainline filter: an opportunity search rejects it (SSS_INVALID_SRCH_FILTER, production 2026-10-09).
        ensureUsage('opportunity lookup');
        const existing = findIdByExternalId(T_OPPORTUNITY, externalId);
        if (existing) {
            // A Deal UUID already in use must belong to the same customer; otherwise it is a different deal.
            ensureUsage('existing opportunity read');
            const found = safeLookup(T_OPPORTUNITY, existing, ['entity']);
            if (!found || firstValueId(found.entity) !== p.entityId) {
                throw bad('This Deal UUID is already used by an opportunity for a different customer.');
            }
            return { opportunityId: existing, created: false };
        }

        ensureUsage('opportunity save');
        const rec = record.create({ type: T_OPPORTUNITY, isDynamic: false });
        rec.setValue({ fieldId: 'externalid', value: externalId });
        rec.setValue({ fieldId: 'title', value: p.title });
        rec.setValue({ fieldId: 'entity', value: p.entityId });
        rec.setValue({ fieldId: 'custbody_pc_referral_end_user', value: p.endClientId || p.entityId });
        rec.setValue({ fieldId: 'class', value: p.classId });
        setIfPresent(rec, 'partner', p.partnerId);
        setIfPresent(rec, 'custbody_pc_referral_contact', p.referralContactId);
        rec.setValue({ fieldId: 'custbody_pc_project_type', value: p.engagementTypeId });
        setIfPresent(rec, 'custbody_pc_commercial_model', p.commercialModelId);
        setIfPresent(rec, 'custbody_opp_next_contact', p.nextContact);
        setIfPresent(rec, 'expectedclosedate', p.expectedClose);
        setIfPresent(rec, 'custbody_opp_principal', p.principalId);
        setIfPresent(rec, 'custbody_opp_proj_srcon', p.seniorConsultantId);
        setIfPresent(rec, 'custbody_opp_proj_staff', p.staffConsultantId);
        setIfPresent(rec, 'custbody_opp_proj_leaddev', p.leadDeveloperId);
        setIfPresent(rec, 'custbody_opp_rate', p.rate);
        rec.setValue({ fieldId: 'custbody_pc_deal_uuid', value: p.dealUUID });
        rec.setValue({ fieldId: 'entitystatus', value: p.entityStatusId });
        setIfPresent(rec, 'memo', p.memo);

        const saved = saveOrFind(rec, T_OPPORTUNITY, externalId);
        return { opportunityId: saved.id, created: saved.created };
    };

    /** Reads columns of an opportunity that validation already confirmed; NOT_FOUND if it vanished since. */
    const readOpportunity = (id, columns) => {
        ensureUsage('opportunity read');
        const found = safeLookup(T_OPPORTUNITY, id, columns);
        if (!found) {
            throw notFound('opportunityId');
        }
        return found;
    };

    const runUpdateOpportunity = (p, run) => {
        // Resumed run: the write was committed before the failure, so it is not repeated.
        if (run.reached >= 1) {
            return { opportunityId: p.opportunityId, updated: Object.keys(p.values), resumed: true };
        }

        const current = readOpportunity(p.opportunityId, ['entitystatus', 'custbody_opp_kickoff_meet']);
        const currentStatus = firstValueId(current.entitystatus);

        // Closed deals (13, 14) are immutable through the API, whether or not a status is in the call.
        // Non-status updates at 24 and 25 stay allowed (kickoff date, Asana URL, onboarding sheet).
        if (currentStatus === STATUS_CLOSED_WON || currentStatus === STATUS_CLOSED_LOST) {
            throw new ApiError(
                E_REFUSED_STATUS,
                `The opportunity is at status ${currentStatus} and is closed to API updates.`,
                { from: currentStatus }
            );
        }

        if (p.fields.entityStatusId !== undefined) {
            const next = p.fields.entityStatusId;
            const bothOpen = OPEN_STATUSES.includes(currentStatus) && OPEN_STATUSES.includes(next);
            const kickoffPresent = p.fields.kickoffDate !== undefined || Boolean(current.custbody_opp_kickoff_meet);
            const kickoffMove = currentStatus === STATUS_READY_FOR_KICKOFF && next === STATUS_KICKED_OFF && kickoffPresent;
            if (!bothOpen && !kickoffMove) {
                throw new ApiError(
                    E_REFUSED_STATUS,
                    `A change from status ${currentStatus} to status ${next} is not allowed through the API.`,
                    { from: currentStatus, to: next }
                );
            }
        }

        ensureUsage('opportunity update');
        record.submitFields({
            type: T_OPPORTUNITY,
            id: p.opportunityId,
            values: p.values,
            options: { enableSourcing: false, ignoreMandatoryFields: true }
        });
        commitStep(run, 1);
        return { opportunityId: p.opportunityId, updated: Object.keys(p.values) };
    };

    const runLogTouch = (p, run) => {
        const externalId = `pc_touch_${run.requestId}`;
        ensureUsage('phone call lookup');
        let callId = findIdByExternalId(T_PHONECALL, externalId);
        let created = false;
        if (!callId) {
            const opp = readOpportunity(p.opportunityId, ['entity']);
            ensureUsage('phone call save');
            const rec = record.create({ type: T_PHONECALL, isDynamic: false });
            rec.setValue({ fieldId: 'externalid', value: externalId });
            rec.setValue({ fieldId: 'title', value: p.title });
            setIfPresent(rec, 'message', p.note);
            const occurred = p.occurredAt || new Date();
            rec.setValue({ fieldId: 'startdate', value: occurred });
            rec.setValue({ fieldId: 'completeddate', value: occurred });
            rec.setValue({ fieldId: 'status', value: 'COMPLETE' });
            setIfPresent(rec, 'company', firstValueId(opp.entity));
            setIfPresent(rec, 'contact', p.contactId);
            rec.setValue({ fieldId: 'transaction', value: p.opportunityId });
            const saved = saveOrFind(rec, T_PHONECALL, externalId);
            callId = saved.id;
            created = saved.created;
        }
        // Step 1: the phone call exists. On a resumed run it is found by external id above, never created twice.
        commitStep(run, 1);

        let nextContactSet = false;
        if (p.nextContact !== undefined) {
            // Step 2: the next-contact write is committed; a resumed run (reached >= 2) skips it.
            if (run.reached < 2) {
                ensureUsage('next contact update');
                record.submitFields({
                    type: T_OPPORTUNITY,
                    id: p.opportunityId,
                    values: { custbody_opp_next_contact: p.nextContact },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                commitStep(run, 2);
            }
            nextContactSet = true;
        }
        return { callId, created, nextContactSet };
    };

    const runCloseOpportunity = (p, run) => {
        // Resumed run: the close was committed before the failure. Report the current record, no status check.
        if (run.reached >= 1) {
            const now = readOpportunity(p.opportunityId, ['entitystatus']);
            const nowStatus = firstValueId(now.entitystatus);
            return {
                opportunityId: p.opportunityId,
                status: nowStatus,
                noProject: nowStatus === STATUS_CLOSED_WON,
                resumed: true
            };
        }

        const current = readOpportunity(p.opportunityId, ['entitystatus', 'custbody_pc_project_type']);
        const currentStatus = firstValueId(current.entitystatus);
        if (!OPEN_STATUSES.includes(currentStatus)) {
            throw new ApiError(
                E_REFUSED_STATUS,
                `The opportunity is at status ${currentStatus} and cannot be closed through the API.`,
                { from: currentStatus }
            );
        }

        const values = {};
        let status;
        let noProject = false;
        if (p.outcome === 'won') {
            const mapped = typesLib.toJobType(
                firstValueId(current.custbody_pc_project_type),
                toId(param(PARAM_SUPPORT_TYPE))
            );
            if (mapped.unmapped) {
                throw bad('Engagement type has no project mapping; set it before closing.');
            }
            noProject = Boolean(mapped.noProject);
            status = noProject ? STATUS_CLOSED_WON : STATUS_AWAITING_PROJECT;
            values.entitystatus = status;
            values.custbody_pc_signed_date = p.signedDate;
        } else {
            status = STATUS_CLOSED_LOST;
            values.entitystatus = status;
            values.winlossreason = p.winLossReasonId;
        }
        // Decided 2026-10-09 (orchestrator): memo is written for either outcome when supplied.
        if (p.memo !== undefined) {
            values.memo = p.memo;
        }

        ensureUsage('opportunity close');
        record.submitFields({
            type: T_OPPORTUNITY,
            id: p.opportunityId,
            values,
            options: { enableSourcing: false, ignoreMandatoryFields: true }
        });
        commitStep(run, 1);
        return { opportunityId: p.opportunityId, status, noProject };
    };

    /** The builder claims and owns its own ledger row; this action never claims one. */
    const runCreateProject = (p, requestId, role) => {
        try {
            const result = builderLib.build(p.opportunityId, requestId, {
                action: 'create',
                supportTypeId: toId(param(PARAM_SUPPORT_TYPE)),
                failAfterStep: toId(param(PARAM_FAIL_AFTER_STEP)),
                roleId: role
            });
            if (result && result.refused) {
                const details = { state: result.state || null, missing: result.missing || [] };
                if (result.projectId) {
                    details.projectId = result.projectId;
                    details.projectUrl = result.projectUrl || null;
                }
                const code = Object.prototype.hasOwnProperty.call(BUILDER_CODES, result.code)
                    ? BUILDER_CODES[result.code]
                    : E_NOT_READY;
                return new ApiError(code, result.reason || 'The opportunity is not ready for project creation.', details);
            }
            return result;
        } catch (e) {
            log.error({
                title: `createProject failed, request ${requestId}, opportunity ${p.opportunityId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            const message = typeof e.name === 'string' && e.name.indexOf('PC_') === 0
                ? e.message
                : 'Project setup stopped. Check the PC Operation Ledger for this request id, then retry.';
            throw new ApiError(E_FAILED, message, { step: null, errorName: e.name });
        }
    };

    /**
     * Exactly one column whose custom label equals label (case-insensitive, trimmed); if none, exactly one whose
     * lowercase field name is in fallbackNames (exact match). Zero or several in the deciding pass breaks the contract.
     */
    const findColumn = (columns, label, fallbackNames) => {
        const inventory = columns.map((c) => ({
            name: c.name === undefined ? null : String(c.name),
            join: c.join === undefined || c.join === null ? null : String(c.join),
            label: c.label === undefined || c.label === null ? null : String(c.label),
            formula: c.formula === undefined || c.formula === null ? null : String(c.formula),
            summary: c.summary === undefined || c.summary === null ? null : String(c.summary)
        }));
        const wanted = label.toLowerCase();
        const byLabel = columns.filter((c) => String(c.label || '').trim().toLowerCase() === wanted);
        if (byLabel.length > 1) {
            throw new ApiError(E_FAILED, `Travel search has more than one ${label} column`, { wanted: label, columns: inventory });
        }
        if (byLabel.length === 1) {
            return byLabel[0];
        }
        const names = fallbackNames || [];
        const byName = columns.filter((c) => names.indexOf(String(c.name || '').toLowerCase()) !== -1);
        if (byName.length > 1) {
            throw new ApiError(E_FAILED, `Travel search has more than one ${label} column (by field name)`, { wanted: label, columns: inventory });
        }
        if (byName.length === 0) {
            throw new ApiError(E_FAILED, `Travel search has no ${label} column`, { wanted: label, columns: inventory });
        }
        return byName[0];
    };

    /** Read-only. The saved search rows minus projects flagged Exclude From Travel Lists, by project id. */
    const runListTravelProjects = () => {
        const configured = String(param(PARAM_TRAVEL_SEARCH) || '').trim();
        const searchId = configured || DEFAULT_TRAVEL_SEARCH;
        if (!TRAVEL_SEARCH_ID.test(searchId)) {
            throw new ApiError(E_FAILED, 'Travel search id is not valid.');
        }

        ensureUsage('travel search load');
        const loaded = search.load({ id: searchId });
        const columns = loaded.columns || [];
        const nameColumn = findColumn(columns, 'Name', ['companyname', 'entityid', 'altname']);
        const emailColumn = findColumn(columns, 'Email', ['email']);

        // Oracle requires a sort in the search definition before paging; project id ascending.
        loaded.columns.push(search.createColumn({ name: 'internalid', sort: search.Sort.ASC }));

        const rows = [];
        const paged = loaded.runPaged({ pageSize: TRAVEL_PAGE_SIZE });
        paged.pageRanges.forEach((range) => {
            ensureUsage('travel search page');
            const page = paged.fetch({ index: range.index });
            page.data.forEach((result) => {
                const email = result.getValue(emailColumn);
                const name = result.getValue(nameColumn);
                rows.push({
                    projectId: parseInt(result.id, 10),
                    name: name === '' || name === undefined ? null : name,
                    approverEmail: email === '' || email === undefined || email === null ? null : String(email)
                });
            });
        });

        ensureUsage('travel exclusion search');
        // Paged (with a sort in the definition) so no excluded project is missed however long the list is.
        const excludedIds = new Set();
        const excludedPaged = search.create({
            type: T_PROJECT,
            filters: [['custentity_pc_travel_exclude', 'is', 'T']],
            columns: [search.createColumn({ name: 'internalid', sort: search.Sort.ASC })]
        }).runPaged({ pageSize: TRAVEL_PAGE_SIZE });
        excludedPaged.pageRanges.forEach((range) => {
            ensureUsage('travel exclusion page');
            const page = excludedPaged.fetch({ index: range.index });
            page.data.forEach((row) => {
                excludedIds.add(parseInt(row.id, 10));
            });
        });

        const projects = rows.filter((row) => !excludedIds.has(row.projectId));
        projects.sort((a, b) => a.projectId - b.projectId);
        return {
            searchId,
            projects,
            count: projects.length,
            excluded: rows.length - projects.length
        };
    };

    // ---------------------------------------------------------------------------------------------
    // Request handling
    // ---------------------------------------------------------------------------------------------

    /** Step 1: shape. Sets ctx.action and ctx.requestId only from values that passed their checks. */
    const parseRequest = (body, ctx) => {
        if (!isPlainObject(body)) {
            throw bad('Request body must be a JSON object.');
        }
        if (!onlyKeys(body, TOP_KEYS)) {
            throw bad('Request contains an unexpected field.');
        }
        if (typeof body.action !== 'string' || !ACTIONS.includes(body.action)) {
            throw bad('action is not a known action.');
        }
        ctx.action = body.action;

        const hasRequestId = Object.prototype.hasOwnProperty.call(body, 'requestId') && body.requestId !== undefined;
        if (hasRequestId) {
            if (!isUuidV4(body.requestId)) {
                throw bad('requestId must be a UUID v4.');
            }
            ctx.requestId = body.requestId.toLowerCase();
        } else if (!REQUEST_ID_OPTIONAL.includes(body.action)) {
            throw bad('requestId is required.');
        }
        if (!isPlainObject(body.payload)) {
            throw bad('payload must be a JSON object.');
        }
        return { action: body.action, requestId: ctx.requestId, payload: body.payload };
    };

    /** Step 2: role and deployment pair against the allowlist, before any record is touched. */
    const authorize = (action) => {
        const role = String(runtime.getCurrentUser().roleId || '').toLowerCase();
        const deployment = String(runtime.getCurrentScript().deploymentId || '').toLowerCase();
        const route = ROUTES.find((r) => r.role === role && r.deployment === deployment);
        if (!route || !route.actions.includes(action)) {
            log.audit({
                title: 'PC_API_REFUSED',
                details: `role ${role}, deployment ${deployment}, action ${action}`
            });
            throw new ApiError(E_REFUSED, 'This role or deployment may not run this action.');
        }
        return role;
    };

    /** Step 3: kill switch. */
    const checkKillSwitch = (action) => {
        const disabled = String(param(PARAM_DISABLED_ACTIONS) || '')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s.length > 0);
        if (disabled.includes(action.toLowerCase())) {
            throw new ApiError(E_DISABLED, 'This action is switched off.');
        }
    };

    /**
     * Step 5: claims the ledger row and applies the replay rules. Returns {rowId, reached} to run, or
     * {response} when the request is answered from the stored row.
     */
    const claimRow = (ctx, req, payloadHash, oppId, role) => {
        const claimed = ledgerLib.claim(req.action, req.requestId, payloadHash, oppId, role);
        if (!claimed.existing) {
            return { rowId: claimed.rowId, reached: 0 };
        }
        if (claimed.hash !== payloadHash) {
            throw new ApiError(E_REPLAY_MISMATCH, 'This request id was already used for a different request.');
        }
        if (claimed.status === 'done') {
            if (!claimed.result) {
                throw new ApiError(E_FAILED, 'This request id was completed, but its stored result is unreadable.');
            }
            return { response: okResponse(req.action, req.requestId, claimed.result, true) };
        }
        if (claimed.status === 'refused') {
            const stored = claimed.result || {};
            const code = typeof stored.code === 'string' && stored.code.indexOf('PC_API_') === 0
                ? stored.code
                : E_NOT_READY;
            const details = Object.assign({}, stored);
            delete details.refused;
            delete details.reason;
            delete details.code;
            return {
                response: errorResponse(
                    req.action,
                    req.requestId,
                    code,
                    stored.reason || 'This request was refused.',
                    details,
                    true
                )
            };
        }
        if (claimed.status === 'pending') {
            throw new ApiError(E_IN_PROGRESS, 'This request is already in progress. Wait, or start a new request.');
        }
        // failed: put the row back to pending and run again from the step reached.
        ledgerLib.reopen(claimed.rowId);
        return { rowId: claimed.rowId, reached: claimed.step };
    };

    const markRow = (fn, rowId, ctx, what) => {
        try {
            fn();
        } catch (e) {
            log.error({
                title: `${what} failed on ledger row ${rowId}, action ${ctx.action}, request ${ctx.requestId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
        }
    };

    /** Step 6: runs a ledgered action, then stores its result or its refusal or its failure on the row. */
    const runLedgered = (ctx, req, p, rowId, reached) => {
        const run = { rowId, reached, requestId: req.requestId };
        try {
            // Reference checks run after the claim, inside the try: a failed reference is stored on the row as a
            // refusal, so the request id is never left pending.
            REFS[req.action](p);
            let result;
            switch (req.action) {
                case 'createEndClient':
                    result = runCreateEndClient(p, run);
                    break;
                case 'createOpportunity':
                    result = runCreateOpportunity(p);
                    break;
                case 'updateOpportunity':
                    result = runUpdateOpportunity(p, run);
                    break;
                case 'logTouch':
                    result = runLogTouch(p, run);
                    break;
                default:
                    result = runCloseOpportunity(p, run);
            }
            ledgerLib.done(rowId, result);
            log.audit({
                title: `${req.action} done`,
                details: `request ${req.requestId}, opportunity ${ctx.oppId}, ledger row ${rowId}`
            });
            return okResponse(req.action, req.requestId, result, false);
        } catch (e) {
            if (e instanceof ApiError) {
                // An expected refusal after the claim (status machine, vanished record): stored on the row.
                markRow(
                    () => ledgerLib.refuse(rowId, e.message, Object.assign({ code: e.code }, e.details)),
                    rowId,
                    ctx,
                    'refuse'
                );
                log.audit({
                    title: `${req.action} answered ${e.code}`,
                    details: `request ${req.requestId}, opportunity ${ctx.oppId}, ledger row ${rowId}`
                });
                return errorResponse(req.action, req.requestId, e.code, e.message, e.details, false);
            }
            log.error({
                title: `${req.action} failed, request ${req.requestId}, opportunity ${ctx.oppId}, ledger row ${rowId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            markRow(
                () => ledgerLib.fail(rowId, { name: e.name, message: e.message, step: run.reached }),
                rowId,
                ctx,
                'fail'
            );
            const message = typeof e.name === 'string' && e.name.indexOf('PC_') === 0
                ? e.message
                : 'The request stopped part way. Send it again with the same request id to resume.';
            return errorResponse(req.action, req.requestId, E_FAILED, message, { step: run.reached, errorName: e.name }, false);
        }
    };

    const handle = (body, ctx) => {
        const req = parseRequest(body, ctx); // step 1
        const role = authorize(req.action); // step 2
        checkKillSwitch(req.action); // step 3
        const p = SHAPES[req.action](req.payload); // step 4, shape part: no record is read
        ctx.oppId = p.opportunityId || null;

        if (req.action === 'resolveClient') {
            REFS.resolveClient(p);
            const result = runResolveClient(p);
            return okResponse(req.action, req.requestId, result, false);
        }
        if (req.action === 'listTravelProjects') {
            REFS.listTravelProjects(p);
            const result = runListTravelProjects();
            return okResponse(req.action, req.requestId, result, false);
        }
        if (req.action === 'createProject') {
            REFS.createProject(p);
            const outcome = runCreateProject(p, req.requestId, role);
            if (outcome instanceof ApiError) {
                return errorResponse(req.action, req.requestId, outcome.code, outcome.message, outcome.details, false);
            }
            return okResponse(req.action, req.requestId, outcome, false);
        }

        // Ledgered actions: claim first (a stored answer returns here with no live lookup), then the reference
        // part, then the action, both inside runLedgered.
        if (!LEDGERED_ACTIONS.includes(req.action)) {
            throw bad('action is not a known action.');
        }
        const payloadHash = sha256Hex(`${req.action}:${canonicalJson(req.payload)}`);
        const claimed = claimRow(ctx, req, payloadHash, ctx.oppId, role);
        if (claimed.response) {
            return claimed.response;
        }
        return runLedgered(ctx, req, p, claimed.rowId, claimed.reached);
    };

    // ---------------------------------------------------------------------------------------------
    // Entry points
    // ---------------------------------------------------------------------------------------------

    const post = (requestBody) => {
        const ctx = { action: null, requestId: null, oppId: null };
        try {
            return handle(requestBody, ctx);
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.code === E_FAILED) {
                    log.error({
                        title: `post failed, action ${ctx.action}, request ${ctx.requestId}, opportunity ${ctx.oppId}`,
                        details: `${e.name}: ${e.message}\n${e.stack}`
                    });
                } else {
                    // Expected answer to a bad, refused or replayed request; audit only, no payload.
                    log.audit({
                        title: `post answered ${e.code}`,
                        details: `action ${ctx.action}, request ${ctx.requestId}, opportunity ${ctx.oppId}`
                    });
                }
                return errorResponse(ctx.action, ctx.requestId, e.code, e.message, e.details, false);
            }
            log.error({
                title: `post failed, action ${ctx.action}, request ${ctx.requestId}, opportunity ${ctx.oppId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            const message = typeof e.name === 'string' && e.name.indexOf('PC_') === 0
                ? e.message
                : 'The request could not be processed. Nothing was written. Try again, or ask for help with this request id.';
            return errorResponse(ctx.action, ctx.requestId, E_FAILED, message, { step: null, errorName: e.name }, false);
        }
    };

    /** A wrong verb never produces a NetSuite error page. */
    const wrongVerb = (verb) => {
        try {
            log.audit({ title: 'PC_API_BAD_REQUEST', details: `${verb} is not supported` });
            return errorResponse(null, null, E_BAD_REQUEST, 'POST required.', {}, false);
        } catch (e) {
            log.error({ title: `${verb} refusal failed`, details: `${e.name}: ${e.message}\n${e.stack}` });
            return errorResponse(null, null, E_BAD_REQUEST, 'POST required.', {}, false);
        }
    };

    const get = () => wrongVerb('GET');
    const put = () => wrongVerb('PUT');
    const del = () => wrongVerb('DELETE');

    return { get, post, put, delete: del };
});
