/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Alert Email. Sends an operator alert to the config record's
 *              Alert Email. email.send needs a real author (not the system user), so the author is
 *              the employee whose email matches the alert address.
 * @author Power Cloud Consulting
 */
define([
    'N/email',
    'N/log',
    'N/search',
    './powercloud_navan_config'
], function (email, log, search, config) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanAlert';

    /**
     * Sends an alert email. Never throws: an alert failure must not mask the original problem.
     * @param {string} subject - subject line (prefixed with [PowerCloud])
     * @param {string} body - plain-text body
     * @returns {boolean} true if sent
     */
    function send(subject, body) {
        try {
            const cfg = config.load();
            if (!cfg.alertEmail) {
                log.error({ title: SCRIPT_NAME, details: 'No Alert Email on config; not sent: ' + subject });
                return false;
            }
            const empResults = search.create({
                type: 'employee',
                filters: [['email', 'is', cfg.alertEmail]],
                columns: ['internalid']
            }).run().getRange({ start: 0, end: 1 });
            if (!empResults.length) {
                log.error({ title: SCRIPT_NAME, details: 'No employee found with email ' + cfg.alertEmail });
                return false;
            }
            email.send({
                author: empResults[0].id,
                recipients: cfg.alertEmail,
                subject: '[PowerCloud] ' + subject,
                body: body
            });
            return true;
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'Alert email failed (' + subject + '): ' + e.message });
            return false;
        }
    }

    return {
        send: send
    };
});
