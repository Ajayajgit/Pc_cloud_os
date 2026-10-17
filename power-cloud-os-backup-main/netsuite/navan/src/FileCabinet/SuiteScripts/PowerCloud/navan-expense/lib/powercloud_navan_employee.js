/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Employee Lookup by Email (Cached)
 * @author Power Cloud Consulting
 */
define([
    'N/search',
    'N/log',
    './powercloud_navan_constants'
], function (search, log, constants) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanEmployee';
    const employeeCache = {};

    /**
     * Looks up a NetSuite employee by email address. Matches either the corporate email
     * (Navan) or the Uber Expense Email custom field (Uber riders on personal accounts) —
     * one search covers both so callers don't need to know which platform the email came from.
     * Results are cached within the script execution context.
     * @param {string} email - Employee email address (corporate or personal Uber)
     * @returns {Object|null} Employee object { id, name, email, subsidiary } or null if not found
     */
    function findByEmail(email) {
        if (!email) {
            return null;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (employeeCache[normalizedEmail]) {
            return employeeCache[normalizedEmail];
        }

        const empSearch = search.create({
            type: search.Type.EMPLOYEE,
            filters: [
                [
                    ['email', 'is', normalizedEmail],
                    'OR',
                    [constants.EMPLOYEE_FIELDS.UBER_EMAIL, 'is', normalizedEmail]
                ],
                'AND',
                ['isinactive', 'is', 'F']
            ],
            columns: [
                'internalid',
                'entityid',
                'email',
                'subsidiary'
            ]
        });

        const results = empSearch.run().getRange({ start: 0, end: 1 });

        if (!results || results.length === 0) {
            log.error({ title: SCRIPT_NAME, details: 'Employee not found for email: ' + normalizedEmail });
            return null;
        }

        const r = results[0];
        const employee = {
            id: r.id,
            name: r.getValue('entityid'),
            email: r.getValue('email'),
            subsidiary: r.getValue('subsidiary')
        };

        employeeCache[normalizedEmail] = employee;
        log.debug({ title: SCRIPT_NAME, details: 'Found employee: ' + employee.name + ' (ID: ' + employee.id + ')' });
        return employee;
    }

    /**
     * Clears the employee cache (for testing).
     */
    function clearCache() {
        Object.keys(employeeCache).forEach(function (key) {
            delete employeeCache[key];
        });
    }

    return {
        findByEmail: findByEmail,
        clearCache: clearCache
    };
});
