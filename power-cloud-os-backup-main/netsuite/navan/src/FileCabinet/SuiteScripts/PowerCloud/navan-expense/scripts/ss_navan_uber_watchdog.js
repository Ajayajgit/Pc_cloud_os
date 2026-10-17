/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 * @description Power Cloud - Navan Uber Watchdog. The relay's Uber poll checks in with the Uber
 *              attach RESTlet after every run, stamping the config's Uber Poll Last Check-in. This
 *              daily script emails the alert address when that stamp is missing or older than
 *              UBER_WATCHDOG.MAX_AGE_HOURS. It catches failures the relay can't report itself:
 *              a revoked/disabled TBA token or role, the relay box being down, or a broken timer.
 * @author Power Cloud Consulting
 */
define([
    'N/log',
    '../lib/powercloud_navan_constants',
    '../lib/powercloud_navan_config',
    '../lib/powercloud_navan_alert'
], function (log, constants, config, alert) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanUberWatchdog';

    /**
     * Main entry point. Alerts if the Uber poll hasn't checked in recently.
     * @param {Object} context - Scheduled script context
     */
    function execute(context) {
        try {
            const cfg = config.load();
            const maxAgeHours = constants.UBER_WATCHDOG.MAX_AGE_HOURS;
            const lastOkMs = cfg.uberLastOk ? Date.parse(cfg.uberLastOk) : NaN;
            const ageHours = isNaN(lastOkMs) ? null : (Date.now() - lastOkMs) / 3600000;

            if (ageHours !== null && ageHours <= maxAgeHours) {
                log.audit({ title: SCRIPT_NAME, details: 'Uber poll healthy; last check-in ' + cfg.uberLastOk + ' (' + ageHours.toFixed(1) + 'h ago)' });
                return;
            }

            const since = ageHours === null
                ? 'has never checked in (Uber Poll Last Check-in is empty)'
                : 'last checked in ' + cfg.uberLastOk + ' UTC, ' + Math.floor(ageHours) + ' hours ago';
            log.error({ title: SCRIPT_NAME, details: 'Uber poll stale: ' + since });

            alert.send('Uber Poll Not Checking In',
                'The relay\'s daily Uber poll ' + since + ' (alert threshold ' + maxAgeHours + 'h).\n\n' +
                'Uber rides are not being imported. Likely causes:\n' +
                '- NetSuite rejecting the relay\'s access token: check Setup > Users/Roles > View Login ' +
                'Audit Trail for failures from the relay box\'s IP (e.g. EntityOrRoleDisabled, TokenRevoked)\n' +
                '- The relay box is down or its timer stopped: systemctl list-timers | grep uber\n' +
                '- The poll is failing: journalctl -u pc-navan-uber-poll.service -n 50\n\n' +
                'Nothing is lost: rides are only marked imported after NetSuite accepts them, so the ' +
                'next successful run catches up.');
        } catch (e) {
            log.error({ title: SCRIPT_NAME, details: 'Watchdog failed: ' + e.message + '\n' + e.stack });
        }
    }

    return {
        execute: execute
    };
});
