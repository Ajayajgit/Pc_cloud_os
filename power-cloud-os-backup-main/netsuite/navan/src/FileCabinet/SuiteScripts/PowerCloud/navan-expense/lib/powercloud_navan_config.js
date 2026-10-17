/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Config Record Loader (Singleton)
 * @author Power Cloud Consulting
 */
define([
    'N/search',
    'N/record',
    'N/log',
    './powercloud_navan_constants'
], function (search, record, log, constants) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanConfig';
    let cachedConfig = null;

    /**
     * Loads the singleton Navan config record.
     * Caches after first load within the script execution context.
     * @returns {Object} Config values
     * @throws {Error} If no active config record is found (kill switch: mark the singleton config inactive to disable the integration)
     */
    function load() {
        if (cachedConfig) {
            return cachedConfig;
        }

        const configSearch = search.create({
            type: constants.RECORD_TYPES.CONFIG,
            filters: [['isinactive', 'is', 'F']],
            columns: Object.values(constants.CONFIG_FIELDS)
        });

        const results = configSearch.run().getRange({ start: 0, end: 1 });
        if (!results || results.length === 0) {
            throw new Error('No active Navan config record found. Create one at Lists > Custom > Navan Integration Config.');
        }

        const r = results[0];
        cachedConfig = {
            id: r.id,
            clientId: r.getValue(constants.CONFIG_FIELDS.CLIENT_ID),
            clientSecret: r.getValue(constants.CONFIG_FIELDS.CLIENT_SECRET),
            apiBaseUrl: r.getValue(constants.CONFIG_FIELDS.API_BASE_URL) || 'https://api.navan.com',
            lookbackDays: parseInt(r.getValue(constants.CONFIG_FIELDS.LOOKBACK_DAYS), 10) || 7,
            projectSavedSearch: r.getValue(constants.CONFIG_FIELDS.PROJECT_SAVED_SEARCH) || null,
            invoiceFolder: parseInt(r.getValue(constants.CONFIG_FIELDS.INVOICE_FOLDER), 10) || null,
            alertEmail: r.getValue(constants.CONFIG_FIELDS.ALERT_EMAIL),
            lastPollTime: r.getValue(constants.CONFIG_FIELDS.LAST_POLL_TIME),
            relayUrl: r.getValue(constants.CONFIG_FIELDS.RELAY_URL) || null,
            relaySecret: r.getValue(constants.CONFIG_FIELDS.RELAY_SECRET) || null,
            uberLastOk: r.getValue(constants.CONFIG_FIELDS.UBER_LAST_OK) || null
        };

        log.debug({ title: SCRIPT_NAME, details: 'Config loaded. Lookback: ' + cachedConfig.lookbackDays + ' days' });
        return cachedConfig;
    }

    /**
     * Updates the last poll time on the config record.
     * @param {string} isoTimestamp - ISO 8601 timestamp string
     */
    function updateLastPollTime(isoTimestamp) {
        const config = load();
        record.submitFields({
            type: constants.RECORD_TYPES.CONFIG,
            id: config.id,
            values: {
                [constants.CONFIG_FIELDS.LAST_POLL_TIME]: isoTimestamp
            }
        });
        cachedConfig.lastPollTime = isoTimestamp;
        log.debug({ title: SCRIPT_NAME, details: 'Last poll time updated to: ' + isoTimestamp });
    }

    /**
     * Runs the configured project saved search and returns project internal IDs.
     * Used to determine which projects should be available in Navan as Bill To Client options.
     * @returns {Array} Array of project internal ID strings, or empty array if no search configured
     */
    function getNavanProjects() {
        const cfg = load();
        if (!cfg.projectSavedSearch) {
            return [];
        }

        const projectIds = [];
        const savedSearch = search.load({ id: cfg.projectSavedSearch });
        savedSearch.run().each(function (result) {
            projectIds.push(result.id);
            return true;
        });

        log.debug({ title: SCRIPT_NAME, details: 'Navan projects from saved search: ' + projectIds.length });
        return projectIds;
    }

    /**
     * Clears the cached config (for testing or forced reload).
     */
    function clearCache() {
        cachedConfig = null;
    }

    return {
        load: load,
        updateLastPollTime: updateLastPollTime,
        getNavanProjects: getNavanProjects,
        clearCache: clearCache
    };
});
