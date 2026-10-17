/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan API Client (OAuth + Bookings + Pagination)
 * @author Power Cloud Consulting
 */
define([
    'N/https',
    'N/log',
    './powercloud_navan_constants',
    './powercloud_navan_config'
], function (https, log, constants, config) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanClient';
    let accessToken = null;
    let tokenExpiry = 0;

    /**
     * Authenticates with Navan OAuth and caches the token.
     * @returns {string} Bearer access token
     * @throws {Error} On auth failure
     */
    function authenticate() {
        const now = Date.now();
        if (accessToken && now < tokenExpiry) {
            return accessToken;
        }

        const cfg = config.load();
        const tokenUrl = cfg.apiBaseUrl + constants.NAVAN_API.TOKEN_PATH;

        log.debug({ title: SCRIPT_NAME, details: 'Authenticating with Navan OAuth...' });

        const response = https.post({
            url: tokenUrl,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'grant_type=' + constants.NAVAN_API.GRANT_TYPE +
                  '&client_id=' + encodeURIComponent(cfg.clientId) +
                  '&client_secret=' + encodeURIComponent(cfg.clientSecret)
        });

        if (response.code !== 200) {
            throw new Error('Navan auth failed. HTTP ' + response.code + ': ' + response.body);
        }

        const tokenData = JSON.parse(response.body);
        accessToken = tokenData.access_token;
        // Expire 5 minutes early to avoid edge-case failures
        tokenExpiry = now + ((tokenData.expires_in - 300) * 1000);

        log.debug({ title: SCRIPT_NAME, details: 'Authenticated. Token expires in ' + tokenData.expires_in + 's' });
        return accessToken;
    }

    /**
     * Fetches bookings from the Navan API with auto-pagination.
     * @param {Object} params - Query parameters
     * @param {number} [params.updatedFrom] - Unix timestamp (seconds)
     * @param {number} [params.updatedTo] - Unix timestamp (seconds)
     * @param {number} [params.createdFrom] - Unix timestamp (seconds)
     * @param {number} [params.createdTo] - Unix timestamp (seconds)
     * @param {string} [params.bookingStatus] - Filter by status
     * @param {string} [params.bookingType] - Filter by type
     * @returns {Array} All booking objects across all pages
     */
    function getBookings(params) {
        const token = authenticate();
        const cfg = config.load();
        const baseUrl = cfg.apiBaseUrl + constants.NAVAN_API.BOOKINGS_PATH;
        const allBookings = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
            const queryParams = Object.assign({}, params, {
                page: page,
                size: constants.NAVAN_API.PAGE_SIZE
            });

            const queryString = Object.keys(queryParams)
                .filter(function (k) { return queryParams[k] !== undefined && queryParams[k] !== null; })
                .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]); })
                .join('&');

            const url = baseUrl + '?' + queryString;
            log.debug({ title: SCRIPT_NAME, details: 'GET ' + url.replace(/client_secret=[^&]+/, 'client_secret=***') });

            const response = https.get({
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Accept-Encoding': 'identity',
                    'User-Agent': 'PowerCloud-Navan-Integration/1.0'
                }
            });

            const bodyLen = response.body ? response.body.length : 0;
            const bodyPreview = response.body ? response.body.substring(0, 200) : '(empty)';
            log.debug({
                title: SCRIPT_NAME,
                details: 'Response code=' + response.code + ' bodyLen=' + bodyLen + ' preview=' + bodyPreview
            });

            if (response.code !== 200) {
                throw new Error('Navan bookings request failed. HTTP ' + response.code + ': ' + response.body);
            }

            if (!response.body) {
                throw new Error('Navan bookings request returned empty body (HTTP ' + response.code + ')');
            }

            const data = JSON.parse(response.body);
            if (data.data && data.data.length > 0) {
                allBookings.push.apply(allBookings, data.data);
            }

            if (data.page) {
                totalPages = data.page.totalPages || 1;
            }

            page++;
            log.debug({
                title: SCRIPT_NAME,
                details: 'Page ' + page + '/' + totalPages + ', fetched ' + (data.data ? data.data.length : 0) + ' bookings'
            });
        }

        log.audit({ title: SCRIPT_NAME, details: 'Total bookings fetched: ' + allBookings.length });
        return allBookings;
    }

    /**
     * Downloads a file from a Navan URL using the current auth token.
     * @param {string} url - Full URL to download
     * @returns {Object} Response object with code and body
     */
    function downloadFile(url) {
        const token = authenticate();
        return https.get({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'User-Agent': 'PowerCloud-Navan-Integration/1.0'
            }
        });
    }

    /**
     * Clears cached auth token (for testing).
     */
    function clearToken() {
        accessToken = null;
        tokenExpiry = 0;
    }

    return {
        authenticate: authenticate,
        getBookings: getBookings,
        downloadFile: downloadFile,
        clearToken: clearToken
    };
});
