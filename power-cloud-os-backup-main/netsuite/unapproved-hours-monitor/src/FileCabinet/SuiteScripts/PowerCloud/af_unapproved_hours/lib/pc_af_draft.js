/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: nudge draft composition
 * @author Power Cloud Consulting
 *
 * Composes the chase email. Pure functions, no N/ dependencies, so the wording
 * can be exercised offline.
 *
 * THE BASE TEXT BELOW IS A PLACEHOLDER. It must be rewritten by Steve, in his
 * own words, before this is used in anger. A draft written by us and approved
 * by him reads like a form letter; one written by him with the specifics
 * slotted in reads like him. Everything else here exists to serve that.
 *
 * Design rules, from the agreed plan:
 * - Three genuinely different messages keyed to age, not one template with a
 *   severity adjective swapped. The latter reads worse than obvious automation.
 * - Prose, not a table, under four items. A human writes "the 8/15 and 8/22
 *   weeks for Alastin are still sitting unapproved". The four-column table with
 *   a dollar total is the giveaway.
 * - Lead with weeks and hours, never the dollar figure. "$7,380 outstanding"
 *   reads as collections. The rep's own commission is the lever - imply it,
 *   do not invoice them.
 * - No footer, no unsubscribe, no "generated automatically".
 */
define([], function () {
    'use strict';

    /** Age in days at which the tone changes. */
    const SECOND_ASK_DAYS = 15;
    const ESCALATE_DAYS = 30;

    /** Above this many items, a list genuinely reads better than prose. */
    const PROSE_LIMIT = 3;

    const TIER = {
        FIRST: 'FIRST',
        SECOND: 'SECOND',
        ESCALATE: 'ESCALATE'
    };

    /**
     * "8/15" - short enough to read as speech rather than data.
     *
     * @param {Date} d
     * @returns {string}
     */
    function shortDate(d) {
        if (!d) { return '?'; }
        return (d.getMonth() + 1) + '/' + d.getDate();
    }

    /**
     * Joins with commas and a trailing "and", the way a person writes a list
     * inside a sentence.
     *
     * @param {Array<string>} items
     * @returns {string}
     */
    function sentenceList(items) {
        if (!items.length) { return ''; }
        if (items.length === 1) { return items[0]; }
        if (items.length === 2) { return items[0] + ' and ' + items[1]; }
        return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
    }

    /** First name only - "Hi Erin", not "Hi Erin Pryce". */
    function firstName(full) {
        const t = String(full || '').trim();
        if (!t) { return 'there'; }
        return t.split(/\s+/)[0];
    }

    /**
     * Groups a rep's timesheets by client so the sentence reads
     * "the 8/15 and 8/22 weeks for Alastin, and the 8/22 week for Brixton".
     *
     * @param {Array<Object>} timesheets
     * @returns {Array<Object>} [{ client, weeks: [Date], count }]
     */
    function groupByClient(timesheets) {
        const byClient = {};
        const order = [];
        timesheets.forEach(function (t) {
            const key = t.client || 'that placement';
            if (!byClient[key]) { byClient[key] = []; order.push(key); }
            byClient[key].push(t);
        });
        return order.map(function (client) {
            const rows = byClient[client].slice().sort(function (a, b) {
                return (a.periodEnding || 0) - (b.periodEnding || 0);
            });
            return {
                client: client,
                weeks: rows.map(function (r) { return r.periodEnding; }),
                count: rows.length
            };
        });
    }

    /**
     * "the 8/15 and 8/22 weeks for Alastin, and the 8/22 week for Brixton"
     *
     * @param {Array<Object>} groups
     * @returns {string}
     */
    function describeGroups(groups) {
        const phrases = groups.map(function (g) {
            const dates = g.weeks.map(shortDate);
            const noun = g.count === 1 ? 'week' : 'weeks';
            return 'the ' + sentenceList(dates) + ' ' + noun + ' for ' + g.client;
        });
        return sentenceList(phrases);
    }

    /**
     * Which of the three messages this rep should get.
     *
     * Driven by the OLDEST item and by how many times we have already asked -
     * not by a count of rows, and not by money.
     *
     * @param {Array<Object>} timesheets
     * @returns {string} a TIER value
     */
    function pickTier(timesheets) {
        let maxDays = 0;
        let maxNudges = 0;
        timesheets.forEach(function (t) {
            maxDays = Math.max(maxDays, t.daysUnapproved || 0);
            maxNudges = Math.max(maxNudges, t.nudgeCount || 0);
        });
        if (maxDays >= ESCALATE_DAYS || maxNudges >= 2) { return TIER.ESCALATE; }
        if (maxDays >= SECOND_ASK_DAYS || maxNudges >= 1) { return TIER.SECOND; }
        return TIER.FIRST;
    }

    /**
     * Composes the draft for one AF rep.
     *
     * @param {Object} params
     * @param {string} params.contactName
     * @param {Array<Object>} params.timesheets - {client, periodEnding, hours,
     *        pay, daysUnapproved, nudgeCount}
     * @param {string} [params.senderName]
     * @returns {Object} { subject, body, tier, itemCount, oldestDays, totalHours, totalPay }
     */
    function composeDraft(params) {
        const timesheets = params.timesheets || [];
        const name = firstName(params.contactName);
        const sender = params.senderName || 'Steve';
        const tier = pickTier(timesheets);
        const groups = groupByClient(timesheets);

        let oldestDays = 0;
        let totalHours = 0;
        let totalPay = 0;
        timesheets.forEach(function (t) {
            oldestDays = Math.max(oldestDays, t.daysUnapproved || 0);
            totalHours += (t.hours || 0);
            totalPay += (t.pay || 0);
        });

        const useProse = timesheets.length <= PROSE_LIMIT;
        const subjectClients = groups.map(function (g) { return g.client; });

        let what;
        if (useProse) {
            what = describeGroups(groups);
        } else {
            what = groups.map(function (g) {
                return '  - ' + g.client + ': ' + sentenceList(g.weeks.map(shortDate)) +
                       (g.count === 1 ? ' week' : ' weeks');
            }).join('\n');
        }

        let subject;
        let body;

        if (tier === TIER.FIRST) {
            subject = 'Timesheet approval - ' + sentenceList(subjectClients);
            body = 'Hi ' + name + ',\n\n' +
                (useProse
                    ? 'Quick one - ' + what + ' are still showing as unapproved on ' +
                      'my end. Any chance you could give them a nudge?'
                    : 'Quick one - these are still showing as unapproved on my end:\n\n' +
                      what + '\n\nAny chance you could give them a nudge?') +
                '\n\nThanks,\n' + sender;
        } else if (tier === TIER.SECOND) {
            subject = 'Following up - timesheet approval for ' + sentenceList(subjectClients);
            body = 'Hi ' + name + ',\n\n' +
                'Following up on this one. ' +
                (useProse
                    ? what.charAt(0).toUpperCase() + what.slice(1) + ' are still sitting ' +
                      'unapproved - about ' + Math.round(oldestDays / 7) + ' weeks now.'
                    : 'These are still sitting unapproved, about ' +
                      Math.round(oldestDays / 7) + ' weeks now:\n\n' + what) +
                '\n\nCould you chase whoever signs these off? It holds up your side ' +
                'as well as mine.\n\nThanks,\n' + sender;
        } else {
            subject = 'Still unapproved after ' + oldestDays + ' days - ' +
                      sentenceList(subjectClients);
            body = 'Hi ' + name + ',\n\n' +
                'I have asked a couple of times about this and it has not moved, so ' +
                'I wanted to flag it properly.\n\n' +
                (useProse ? what.charAt(0).toUpperCase() + what.slice(1) : what) +
                (useProse ? ' have been unapproved for ' + oldestDays + ' days.'
                          : '\n\nThe oldest has been unapproved for ' + oldestDays + ' days.') +
                '\n\nIs there someone else on your side, or on the client\'s, who ' +
                'should be looped in to get these signed off?\n\nThanks,\n' + sender;
        }

        return {
            subject: subject,
            body: body,
            tier: tier,
            itemCount: timesheets.length,
            oldestDays: oldestDays,
            totalHours: Math.round(totalHours * 100) / 100,
            totalPay: Math.round(totalPay * 100) / 100
        };
    }

    /**
     * Groups timesheets into one bundle per AF rep.
     *
     * One email per rep, never one per client. Reps cover several accounts
     * (Mihaylov has Brixton, Case Worthy and Sauce Labs), and three separate
     * emails landing in one inbox on the same morning is the fastest possible
     * tell that a machine sent them.
     *
     * Rows with no contact email are kept in their own bundle rather than
     * dropped, so the gap is visible instead of silent.
     *
     * @param {Array<Object>} timesheets
     * @returns {Object} { sendable: Array, unsendable: Array }
     */
    function bundleByRep(timesheets) {
        const byKey = {};
        const order = [];
        (timesheets || []).forEach(function (t) {
            const email = (t.contactEmail || '').trim().toLowerCase();
            const key = email || ('NOEMAIL::' + (t.contactName || t.client || 'unknown'));
            if (!byKey[key]) {
                byKey[key] = {
                    key: key,
                    contactEmail: email || null,
                    contactName: t.contactName || null,
                    timesheets: []
                };
                order.push(key);
            }
            byKey[key].timesheets.push(t);
            if (!byKey[key].contactName && t.contactName) {
                byKey[key].contactName = t.contactName;
            }
        });

        const sendable = [];
        const unsendable = [];
        order.forEach(function (k) {
            const bundle = byKey[k];
            bundle.draft = composeDraft({
                contactName: bundle.contactName,
                timesheets: bundle.timesheets
            });
            if (bundle.contactEmail) { sendable.push(bundle); } else { unsendable.push(bundle); }
        });

        // Oldest first - that is the order they should be worked.
        const byAge = function (a, b) { return b.draft.oldestDays - a.draft.oldestDays; };
        sendable.sort(byAge);
        unsendable.sort(byAge);
        return { sendable: sendable, unsendable: unsendable };
    }

    return {
        TIER: TIER,
        SECOND_ASK_DAYS: SECOND_ASK_DAYS,
        ESCALATE_DAYS: ESCALATE_DAYS,
        PROSE_LIMIT: PROSE_LIMIT,
        shortDate: shortDate,
        sentenceList: sentenceList,
        firstName: firstName,
        groupByClient: groupByClient,
        describeGroups: describeGroups,
        pickTier: pickTier,
        composeDraft: composeDraft,
        bundleByRep: bundleByRep
    };
});
