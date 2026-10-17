/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: Friday review and nudge
 * @author Power Cloud Consulting
 *
 * One card per Anderson Frank rep: what of theirs is outstanding, how old, what
 * we already said to them, and a draft to send.
 *
 * NOTHING IS EMAILED FROM HERE, deliberately. NetSuite would send from its own
 * servers, leave no copy in Steve's Sent folder, and start a fresh thread every
 * week instead of continuing one chase conversation. The whole point is that
 * these read as genuinely from him. So this composes the draft, Steve copies it
 * into his own mail client, and "Mark as Sent" records that it went - which is
 * what lets next week's draft know what was already said.
 */
define([
    'N/ui/serverWidget', 'N/runtime', 'N/log', 'N/url',
    '../lib/pc_af_config', '../lib/pc_af_match', '../lib/pc_af_data', '../lib/pc_af_draft'
], function (ui, runtime, log, url, cfg, matcher, data, drafter) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_AFReviewSL';
    const TITLE = 'Anderson Frank - Unapproved Hours Review';
    const SNOOZE_DAYS = 7;

    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function money(n) {
        if (n === null || n === undefined || n === '' || isNaN(n)) { return '0.00'; }
        const neg = Number(n) < 0;
        const fixed = Math.abs(Number(n)).toFixed(2);
        const parts = fixed.split('.');
        return (neg ? '-' : '') +
               parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + parts[1];
    }

    function fmtDate(d) {
        if (!d) { return ''; }
        return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    }

    const CSS =
        '<style>' +
        '.pcaf{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' +
        'font-size:13px;color:#1a1a1a;max-width:1100px;}' +
        '.pcaf h3{margin:20px 0 4px;font-size:14px;font-weight:600;}' +
        '.pcaf .sub{color:#666;font-size:12px;margin:0 0 10px;}' +
        '.pcaf .tiles{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 16px;}' +
        '.pcaf .tile{border:1px solid #d8dbe0;border-radius:6px;padding:10px 14px;min-width:104px;}' +
        '.pcaf .tile .n{font-size:20px;font-weight:600;line-height:1.1;}' +
        '.pcaf .tile .l{font-size:11px;color:#666;text-transform:uppercase;' +
        'letter-spacing:.03em;margin-top:2px;}' +
        '.pcaf .bad{border-color:#c0392b;}.pcaf .bad .n{color:#c0392b;}' +
        '.pcaf .card{border:1px solid #d8dbe0;border-radius:8px;padding:14px 16px;' +
        'margin-bottom:14px;background:#fff;}' +
        '.pcaf .card.stale{border-left:4px solid #c0392b;}' +
        '.pcaf .card.warn{border-left:4px solid #b7791f;}' +
        '.pcaf .card.fresh{border-left:4px solid #1e7e34;}' +
        '.pcaf .card.blocked{border-left:4px solid #999;background:#fafafa;}' +
        '.pcaf .who{font-size:15px;font-weight:600;}' +
        '.pcaf .mail{color:#666;font-weight:400;font-size:12px;}' +
        '.pcaf .meta{color:#666;font-size:12px;margin:2px 0 10px;}' +
        '.pcaf table{border-collapse:collapse;width:100%;margin:8px 0;}' +
        '.pcaf th{text-align:left;background:#f4f5f7;border-bottom:1px solid #d8dbe0;' +
        'padding:5px 8px;font-size:11px;font-weight:600;text-transform:uppercase;' +
        'letter-spacing:.03em;color:#555;}' +
        '.pcaf td{border-bottom:1px solid #eceef1;padding:5px 8px;}' +
        '.pcaf td.num{text-align:right;font-variant-numeric:tabular-nums;}' +
        '.pcaf textarea{width:100%;box-sizing:border-box;font-family:ui-monospace,' +
        'SFMono-Regular,Consolas,monospace;font-size:12px;line-height:1.5;padding:10px;' +
        'border:1px solid #d8dbe0;border-radius:6px;background:#fcfcfd;}' +
        '.pcaf .subj{font-size:12px;margin:8px 0 4px;}' +
        '.pcaf .subj b{font-weight:600;}' +
        '.pcaf .acts{margin-top:10px;display:flex;gap:8px;align-items:center;}' +
        '.pcaf button{font:inherit;padding:6px 12px;border-radius:6px;cursor:pointer;' +
        'border:1px solid #c3c7cd;background:#fff;}' +
        '.pcaf button.primary{background:#1a1a1a;color:#fff;border-color:#1a1a1a;}' +
        '.pcaf .hist{font-size:11px;color:#777;white-space:pre-wrap;margin-top:8px;' +
        'padding-top:8px;border-top:1px dashed #e2e4e8;}' +
        '.pcaf .note{background:#fbf7e8;border-left:3px solid #b7791f;padding:10px 12px;' +
        'margin:12px 0;font-size:12px;}' +
        '.pcaf .err{background:#fdf0ee;border-left:3px solid #c0392b;padding:10px 12px;' +
        'margin:12px 0;font-size:12px;}' +
        '.pcaf .ok{background:#eef7f0;border-left:3px solid #1e7e34;padding:10px 12px;' +
        'margin:12px 0;font-size:12px;}' +
        '.pcaf .tag{display:inline-block;font-size:10px;text-transform:uppercase;' +
        'letter-spacing:.04em;padding:2px 7px;border-radius:10px;background:#eceef1;' +
        'color:#555;margin-left:8px;vertical-align:middle;}' +
        '</style>';

    function tile(n, label, cls) {
        return '<div class="tile ' + (cls || '') + '"><div class="n">' + n +
               '</div><div class="l">' + esc(label) + '</div></div>';
    }

    function ageClass(days) {
        if (days >= drafter.ESCALATE_DAYS) { return 'stale'; }
        if (days >= drafter.SECOND_ASK_DAYS) { return 'warn'; }
        return 'fresh';
    }

    function tierLabel(tier) {
        if (tier === drafter.TIER.ESCALATE) { return 'escalate'; }
        if (tier === drafter.TIER.SECOND) { return 'second ask'; }
        return 'first ask';
    }

    /** Renders one rep's card. */
    function renderCard(bundle, idx, actionUrl, blocked) {
        const d = bundle.draft;
        const cls = blocked ? 'blocked' : ageClass(d.oldestDays);
        let h = '<div class="card ' + cls + '">';

        h += '<div class="who">' + esc(bundle.contactName || '(no contact on the project)') +
             (bundle.contactEmail
                ? ' <span class="mail">' + esc(bundle.contactEmail) + '</span>'
                : ' <span class="mail">no email on file</span>') +
             '<span class="tag">' + esc(tierLabel(d.tier)) + '</span></div>';

        h += '<div class="meta">' + d.itemCount + ' timesheet' +
             (d.itemCount === 1 ? '' : 's') + ' &middot; ' + d.totalHours + ' hrs &middot; $' +
             money(d.totalPay) + ' &middot; oldest ' + d.oldestDays + ' day' +
             (d.oldestDays === 1 ? '' : 's') + '</div>';

        h += '<table><tr><th>AF ID</th><th>Client</th><th>Week ending</th>' +
             '<th class="num">Hours</th><th class="num">Pay</th>' +
             '<th class="num">Days</th><th class="num">Asked</th></tr>';
        bundle.timesheets.slice().sort(function (a, b) {
            return (a.periodEnding || 0) - (b.periodEnding || 0);
        }).forEach(function (t) {
            h += '<tr><td>' + esc(t.afId) + '</td><td>' + esc(t.client) + '</td><td>' +
                 fmtDate(t.periodEnding) + '</td><td class="num">' + t.hours +
                 '</td><td class="num">' + money(t.pay) + '</td><td class="num">' +
                 t.daysUnapproved + '</td><td class="num">' + t.nudgeCount + '</td></tr>';
        });
        h += '</table>';

        if (blocked) {
            h += '<div class="err">No AF contact email on the project, so there is ' +
                 'nowhere to send this. Add one to <b>AF Email</b> on the project ' +
                 'record and it will appear above with a draft next week.</div>';
        } else {
            const ta = 'pcaf_body_' + idx;
            h += '<div class="subj"><b>Subject:</b> ' + esc(d.subject) + '</div>';
            h += '<textarea id="' + ta + '" rows="' +
                 Math.min(20, d.body.split('\n').length + 2) + '">' +
                 esc(d.body) + '</textarea>';
            h += '<div class="acts">' +
                 '<button type="button" onclick="pcafCopy(\'' + ta + '\',this)">' +
                 'Copy draft</button>' +
                 '<button type="button" class="primary" onclick="pcafGo(\'' +
                 esc(actionUrl) + '&pcaf_action=sent&pcaf_key=' +
                 encodeURIComponent(bundle.key) + '\')">Mark as Sent</button>' +
                 '<button type="button" onclick="pcafGo(\'' + esc(actionUrl) +
                 '&pcaf_action=snooze&pcaf_key=' + encodeURIComponent(bundle.key) +
                 '\')">Snooze ' + SNOOZE_DAYS + ' days</button>' +
                 '</div>';
        }

        const history = bundle.timesheets.map(function (t) { return t.nudgeLog; })
            .filter(function (x) { return !!x; }).join('\n');
        if (history) {
            h += '<div class="hist"><b>Already said:</b>\n' + esc(history) + '</div>';
        }

        h += '</div>';
        return h;
    }

    const JS =
        '<script>' +
        'function pcafCopy(id, btn){' +
        ' var el=document.getElementById(id); el.select();' +
        ' try{document.execCommand("copy"); btn.textContent="Copied";' +
        '  setTimeout(function(){btn.textContent="Copy draft";},1500);}' +
        ' catch(e){ btn.textContent="Select and copy manually"; }' +
        '}' +
        'function pcafGo(u){ window.location.href = u; }' +
        '</script>';

    function onRequest(context) {
        const request = context.request;
        const response = context.response;

        try {
            const today = new Date();
            const scriptObj = runtime.getCurrentScript();
            const actionUrl = url.resolveScript({
                scriptId: scriptObj.id, deploymentId: scriptObj.deploymentId
            }) + '&_ts=' + Date.now();

            let flash = '';
            const action = request.parameters.pcaf_action;
            const key = request.parameters.pcaf_key;

            let rows = data.loadUnapprovedForReview(today);

            if (action && key) {
                const bundles = drafter.bundleByRep(rows);
                const all = bundles.sendable.concat(bundles.unsendable);
                let target = null;
                all.forEach(function (b) { if (b.key === key) { target = b; } });

                if (!target) {
                    flash = '<div class="err">That group is no longer on the list - ' +
                            'it may have been approved since the page loaded.</div>';
                } else if (action === 'sent') {
                    const n = data.recordNudge(target.timesheets, {
                        when: today,
                        subject: target.draft.subject,
                        userId: runtime.getCurrentUser().id
                    });
                    flash = '<div class="ok">Recorded a nudge against ' + n +
                            ' timesheet' + (n === 1 ? '' : 's') + ' for ' +
                            esc(target.contactName || 'that group') +
                            '. Next week\'s draft will know this was already asked.</div>';
                } else if (action === 'snooze') {
                    const until = new Date(today.getTime());
                    until.setDate(until.getDate() + SNOOZE_DAYS);
                    const n = data.snooze(target.timesheets, until);
                    flash = '<div class="ok">Snoozed ' + n + ' timesheet' +
                            (n === 1 ? '' : 's') + ' until ' + fmtDate(until) + '.</div>';
                }
                rows = data.loadUnapprovedForReview(today);
            }

            const bundles = drafter.bundleByRep(rows);
            let totalPay = 0;
            let oldest = 0;
            rows.forEach(function (r) {
                totalPay += r.pay || 0;
                oldest = Math.max(oldest, r.daysUnapproved || 0);
            });

            let h = CSS + JS + '<div class="pcaf">' + flash;

            h += '<div class="tiles">';
            h += tile(rows.length, 'timesheets');
            h += tile('$' + money(totalPay), 'at stake');
            h += tile(bundles.sendable.length, 'reps to chase');
            h += tile(oldest, 'oldest (days)', oldest >= drafter.ESCALATE_DAYS ? 'bad' : '');
            h += tile(bundles.unsendable.length, 'blocked, no email',
                      bundles.unsendable.length ? 'bad' : '');
            h += '</div>';

            if (!rows.length) {
                h += '<div class="ok"><b>Nothing outstanding.</b> Either everything ' +
                     'is approved or no import has run yet.</div>';
            }

            if (bundles.sendable.length) {
                h += '<h3>Ready to send (' + bundles.sendable.length + ')</h3>';
                h += '<p class="sub">Oldest first. Copy the draft into your own mail ' +
                     'client, send it from there, then click Mark as Sent.</p>';
                bundles.sendable.forEach(function (b, i) {
                    h += renderCard(b, i, actionUrl, false);
                });
            }

            if (bundles.unsendable.length) {
                h += '<h3>Blocked - no AF contact email (' + bundles.unsendable.length + ')</h3>';
                h += '<p class="sub">These are outstanding but there is nobody to send ' +
                     'to. Fixing the project records is what unblocks them.</p>';
                bundles.unsendable.forEach(function (b, i) {
                    h += renderCard(b, 1000 + i, actionUrl, true);
                });
            }

            const missing = data.findProjectsMissingContact();
            if (missing.length) {
                h += '<h3>Projects missing an AF contact email (' + missing.length + ')</h3>';
                h += '<p class="sub">Active AF projects invoiced in the last year with ' +
                     'no <b>AF Email</b>. This is the worklist that unblocks the nudges - ' +
                     'the address cannot be guessed, because the pattern breaks ' +
                     '(m.mihaylov1@andersonfrank.com).</p>';
                h += '<table><tr><th>Project</th><th>AF Contact on file</th></tr>';
                missing.forEach(function (m) {
                    h += '<tr><td>' + esc(m.projectName) + '</td><td>' +
                         (m.contact ? esc(m.contact)
                                    : '<i>none - needs a name too</i>') + '</td></tr>';
                });
                h += '</table>';
            }

            h += '<div class="note"><b>Nothing is emailed from NetSuite.</b> These ' +
                 'drafts are placeholders written by us - Steve should rewrite the ' +
                 'base wording in his own voice before any of it goes out. ' +
                 'Mark as Sent only records that a nudge happened; it sends nothing.</div>';
            h += '</div>';

            const form = ui.createForm({ title: TITLE });
            form.addField({
                id: 'custpage_review', type: ui.FieldType.INLINEHTML, label: ' '
            }).defaultValue = h;
            response.writePage(form);

        } catch (e) {
            log.error({ title: SCRIPT_NAME + ': unhandled', details: e.stack || e.message });
            const form = ui.createForm({ title: TITLE + ' - Error' });
            form.addField({
                id: 'custpage_err', type: ui.FieldType.INLINEHTML, label: ' '
            }).defaultValue = CSS + '<div class="pcaf"><div class="err"><b>' +
                esc(e.message) + '</b></div><p class="sub">This screen only reads, ' +
                'except for Mark as Sent and Snooze. Check the script execution log ' +
                'for the trace.</p></div>';
            context.response.writePage(form);
        }
    }

    return { onRequest: onRequest };
});
