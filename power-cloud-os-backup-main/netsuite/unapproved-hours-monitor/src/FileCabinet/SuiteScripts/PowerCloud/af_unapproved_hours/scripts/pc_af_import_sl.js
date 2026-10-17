/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * @description Power Cloud - AF Unapproved Hours: import and review Suitelet
 * @author Power Cloud Consulting
 *
 * Thursday night / Friday morning: upload the Anderson Frank export, look at
 * what it WOULD change, then decide.
 *
 * Nothing is written on the preview step. On confirm the file is re-read and
 * the diff is rebuilt from current NetSuite state rather than replayed from the
 * preview, so a stale preview can never be applied.
 */
define([
    'N/ui/serverWidget', 'N/file', 'N/search', 'N/record', 'N/log',
    'N/url', 'N/runtime', 'N/task',
    '../lib/pc_af_config', '../lib/pc_af_parse', '../lib/pc_af_match', '../lib/pc_af_data'
], function (ui, file, search, record, log, url, runtime, task, cfg, parser, matcher, data) {
    'use strict';

    const SWEEP_SCRIPT = 'customscript_pc_af_sweep_mr';
    const SWEEP_DEPLOY = 'customdeploy_pc_af_sweep_mr';

    /**
     * Queues the invoice sweep, but ONLY after a completely clean apply.
     *
     * This interlock matters. The sweep infers approval from absence: any AF
     * invoice whose timesheet id is not in the unapproved set gets marked
     * Approved. If the apply stopped early or errored, the timesheet records
     * for the rows it never reached do not exist yet - so those rows are not in
     * the unapproved set, and the sweep would confidently mark perfectly
     * unapproved invoices as Approved.
     *
     * A partial import must therefore never be followed by a sweep.
     *
     * @param {Object} outcome - from data.applyDiff
     * @returns {Object} { queued: boolean, taskId: string|null, reason: string }
     */
    function queueSweep(outcome) {
        if (outcome.stoppedEarly || outcome.errors.length) {
            return {
                queued: false,
                taskId: null,
                reason: 'The import did not finish cleanly, so the sweep was NOT ' +
                        'queued. Running it now would mark the rows this import ' +
                        'never wrote as approved. Re-run the import first.'
            };
        }
        try {
            const t = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: SWEEP_SCRIPT,
                deploymentId: SWEEP_DEPLOY
            });
            const taskId = t.submit();
            return { queued: true, taskId: taskId, reason: null };
        } catch (e) {
            log.error({
                title: SCRIPT_NAME + ': could not queue the sweep',
                details: e.message
            });
            return {
                queued: false,
                taskId: null,
                reason: 'The import succeeded, but the sweep could not be queued (' +
                        e.message + '). Run it manually, or it will run with the ' +
                        'next import.'
            };
        }
    }

    /** This Suitelet's own URL, for the "start over" link. */
    function selfUrl() {
        try {
            const s = runtime.getCurrentScript();
            return url.resolveScript({ scriptId: s.id, deploymentId: s.deploymentId });
        } catch (e) {
            return '#';
        }
    }

    const SCRIPT_NAME = 'PowerCloud_AFImportSL';
    const TITLE = 'Anderson Frank - Unapproved Hours Import';

    /**
     * Thousands-separated to two decimals. Written out rather than using
     * toLocaleString, whose locale support is not guaranteed in the server
     * script engine.
     */
    function money(n) {
        if (n === null || n === undefined || n === '' || isNaN(n)) { return ''; }
        const neg = Number(n) < 0;
        const fixed = Math.abs(Number(n)).toFixed(2);
        const parts = fixed.split('.');
        const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (neg ? '-' : '') + withCommas + '.' + parts[1];
    }

    function esc(s) {
        return String(s === null || s === undefined ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function fmtDate(d) {
        if (!d) { return ''; }
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return mm + '/' + dd + '/' + d.getFullYear();
    }

    function parseDateInput(s) {
        const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim());
        if (!m) { return null; }
        return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
    }

    const CSS =
        '<style>' +
        '.pcaf{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' +
        'font-size:13px;color:#1a1a1a;}' +
        '.pcaf h3{margin:18px 0 6px;font-size:14px;font-weight:600;}' +
        '.pcaf .sub{color:#666;font-size:12px;margin:0 0 8px;}' +
        '.pcaf table{border-collapse:collapse;width:100%;margin-bottom:4px;}' +
        '.pcaf th{text-align:left;background:#f4f5f7;border-bottom:1px solid #d8dbe0;' +
        'padding:6px 8px;font-weight:600;font-size:12px;}' +
        '.pcaf td{border-bottom:1px solid #eceef1;padding:6px 8px;vertical-align:top;}' +
        '.pcaf td.num{text-align:right;font-variant-numeric:tabular-nums;}' +
        '.pcaf .tiles{display:flex;flex-wrap:wrap;gap:10px;margin:6px 0 14px;}' +
        '.pcaf .tile{border:1px solid #d8dbe0;border-radius:6px;padding:10px 14px;min-width:104px;}' +
        '.pcaf .tile .n{font-size:20px;font-weight:600;line-height:1.1;}' +
        '.pcaf .tile .l{font-size:11px;color:#666;text-transform:uppercase;' +
        'letter-spacing:.03em;margin-top:2px;}' +
        '.pcaf .bad{border-color:#c0392b;}.pcaf .bad .n{color:#c0392b;}' +
        '.pcaf .warn{border-color:#b7791f;}.pcaf .warn .n{color:#b7791f;}' +
        '.pcaf .good .n{color:#1e7e34;}' +
        '.pcaf .note{background:#fbf7e8;border-left:3px solid #b7791f;padding:8px 10px;' +
        'margin:10px 0;font-size:12px;}' +
        '.pcaf .err{background:#fdf0ee;border-left:3px solid #c0392b;padding:8px 10px;' +
        'margin:10px 0;font-size:12px;}' +
        '.pcaf .ok{background:#eef7f0;border-left:3px solid #1e7e34;padding:8px 10px;' +
        'margin:10px 0;font-size:12px;}' +
        '</style>';

    function tile(n, label, cls) {
        return '<div class="tile ' + (cls || '') + '"><div class="n">' + n +
               '</div><div class="l">' + esc(label) + '</div></div>';
    }

    /**
     * Renders the preview. Exceptions come first because they are the only part
     * that needs a decision; the rest is confirmation that the run looks normal.
     */
    function renderPreview(diff, warnings) {
        const c = diff.counts;
        let h = CSS + '<div class="pcaf">';

        h += '<div class="tiles">';
        h += tile(c.rowsInFile, 'rows in file');
        h += tile(c.matched, 'matched', 'good');
        h += tile(c.newlyUnapproved, 'newly unapproved');
        h += tile(c.flippedToApproved, 'now approved', 'good');
        h += tile(c.notYetInvoiced, 'not yet invoiced');
        h += tile(c.exceptions, 'exceptions', c.exceptions ? 'bad' : '');
        h += '</div>';

        if (c.exceptions) {
            h += '<h3>Exceptions - worth a look before you confirm</h3>';
            h += '<p class="sub">These will still be recorded. They are flagged, ' +
                 'not blocked.</p><table><tr><th>AF ID</th><th>Client</th>' +
                 '<th>Period</th><th class="num">Pay</th><th>What is wrong</th></tr>';
            diff.exceptions.forEach(function (e) {
                h += '<tr><td>' + esc(e.afId) + '</td><td>' + esc(e.row.client) +
                     '</td><td>' + fmtDate(e.row.periodEnding) + '</td>' +
                     '<td class="num">' + money(e.row.pay) + '</td><td>' +
                     esc(e.classification.reason) + '</td></tr>';
            });
            h += '</table>';
        } else {
            h += '<div class="ok">No exceptions. Every row either matched an ' +
                 'invoice to the penny or is too recent to have been invoiced yet.</div>';
        }

        if (c.flippedToApproved) {
            h += '<h3>Inferred approved (' + c.flippedToApproved + ')</h3>';
            h += '<p class="sub">Previously unapproved and absent from this report. ' +
                 'Anderson Frank does not tell us these were approved - we are ' +
                 'inferring it from their absence.</p>';
            h += '<table><tr><th>AF ID</th><th>Client</th><th>Last seen</th>' +
                 '<th class="num">Days unapproved</th></tr>';
            diff.flippedToApproved.forEach(function (f) {
                h += '<tr><td>' + esc(f.afId) + '</td><td>' + esc(f.prior.client) +
                     '</td><td>' + fmtDate(f.lastSeen) + '</td><td class="num">' +
                     (f.daysUnapproved === null ? '' : f.daysUnapproved) + '</td></tr>';
            });
            h += '</table>';
        }

        h += '<h3>Unapproved after this import (' +
             (c.newlyUnapproved + c.stillUnapproved) + ')</h3>';
        h += '<table><tr><th>AF ID</th><th>Client</th><th>Period</th>' +
             '<th class="num">Hours</th><th class="num">Pay</th><th>Invoice</th>' +
             '<th class="num">Days</th><th>State</th></tr>';
        diff.newlyUnapproved.concat(diff.stillUnapproved).sort(function (a, b) {
            return (b.daysUnapproved || 0) - (a.daysUnapproved || 0);
        }).forEach(function (e) {
            const inv = e.classification.invoice;
            h += '<tr><td>' + esc(e.afId) + '</td><td>' + esc(e.row.client) +
                 '</td><td>' + fmtDate(e.row.periodEnding) + '</td>' +
                 '<td class="num">' + (e.row.hours === null ? '' : e.row.hours) + '</td>' +
                 '<td class="num">' + money(e.row.pay) + '</td>' +
                 '<td>' + (inv ? esc(inv.tranid) : '<i>none</i>') + '</td>' +
                 '<td class="num">' + (e.daysUnapproved === null ? '' : e.daysUnapproved) +
                 '</td><td>' + esc(e.classification.matchStatus.replace(/_/g, ' ').toLowerCase()) +
                 '</td></tr>';
        });
        h += '</table>';

        if (warnings && warnings.length) {
            h += '<div class="note"><b>Parser warnings (' + warnings.length + ')</b><br>' +
                 warnings.slice(0, 25).map(esc).join('<br>') +
                 (warnings.length > 25 ? '<br>...' : '') + '</div>';
        }

        h += '<div class="note">Nothing has been written yet. ' +
             '<b>Confirm &amp; Apply</b> writes the changes above. To abandon this ' +
             'run, just navigate away - <a href="' + esc(selfUrl()) + '">start over</a>.</div>';
        h += '</div>';
        return h;
    }

    function renderResult(outcome, diff, sweep) {
        let h = CSS + '<div class="pcaf">';
        if (outcome.errors.length) {
            h += '<div class="err"><b>' + outcome.errors.length +
                 ' row(s) failed.</b><br>' + outcome.errors.map(esc).join('<br>') + '</div>';
        }
        if (outcome.stoppedEarly) {
            h += '<div class="err"><b>Stopped early on governance.</b> Some rows ' +
                 'were not written. Re-run the import - it is safe to repeat, ' +
                 'records are keyed on the AF id.</div>';
        }
        if (!outcome.errors.length && !outcome.stoppedEarly) {
            h += '<div class="ok"><b>Import complete.</b></div>';
        }
        h += '<div class="tiles">';
        h += tile(outcome.timesheetsWritten, 'timesheets written');
        h += tile(outcome.flipsWritten, 'marked approved');
        h += tile(outcome.invoicesStamped, 'invoices stamped');
        h += tile(diff.counts.exceptions, 'exceptions',
                  diff.counts.exceptions ? 'bad' : '');
        h += '</div>';
        if (sweep && sweep.queued) {
            h += '<div class="ok"><b>Invoice status sweep queued.</b> It runs in the ' +
                 'background and gives every other Anderson Frank timesheet invoice ' +
                 'its status - including hours approved so promptly they never ' +
                 'appeared on a report. Nothing further to do.</div>';
        } else if (sweep) {
            h += '<div class="err"><b>Sweep not queued.</b><br>' +
                 esc(sweep.reason) + '</div>';
        }
        h += '<p class="sub">Import log record #' + esc(outcome.importLogId) + '</p>';
        h += '</div>';
        return h;
    }

    /** Finds, or creates, the folder uploaded reports are retained in. */
    function getFolderId() {
        const res = search.create({
            type: 'folder',
            filters: [['name', 'is', cfg.FILE_FOLDER_NAME]],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        if (res && res.length) { return res[0].getValue('internalid'); }

        const f = record.create({ type: record.Type.FOLDER });
        f.setValue({ fieldId: 'name', value: cfg.FILE_FOLDER_NAME });
        return f.save();
    }

    /**
     * Builds the diff for a given report text and date. Used by BOTH the preview
     * and the apply, so the two can never diverge in logic.
     */
    function buildFor(text, asOf) {
        const parsed = parser.parseReport(text);
        const afIds = parsed.rows.map(function (r) { return r.afId; });
        const diff = matcher.buildDiff({
            rows: parsed.rows,
            existing: data.loadExistingForDiff(afIds),
            candidatesByAfId: data.findCandidateInvoices(afIds),
            asOf: asOf
        });
        return { parsed: parsed, diff: diff };
    }

    function showUploadForm(message) {
        const form = ui.createForm({ title: TITLE });
        form.addField({
            id: 'custpage_help', type: ui.FieldType.INLINEHTML, label: ' '
        }).defaultValue = CSS + '<div class="pcaf">' +
            (message ? '<div class="err">' + esc(message) + '</div>' : '') +
            '<p class="sub">Export the unapproved timesheet report from Anderson ' +
            'Frank, save it as <b>CSV</b>, and upload it here. You will see what ' +
            'it changes before anything is written.</p></div>';

        form.addField({
            id: 'custpage_file', type: ui.FieldType.FILE, label: 'AF Report (CSV)'
        }).isMandatory = true;

        const asOf = form.addField({
            id: 'custpage_asof', type: ui.FieldType.DATE, label: 'Report As Of'
        });
        asOf.isMandatory = true;
        asOf.defaultValue = new Date();
        asOf.setHelpText({
            help: 'The date this report reflects. Every status written by this ' +
                  'run is anchored to it, and a status older than ' +
                  matcher.STALE_AFTER_DAYS + ' days is treated as stale rather ' +
                  'than trusted.'
        });

        form.addField({
            id: 'custpage_action', type: ui.FieldType.TEXT, label: 'Action'
        }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN }).defaultValue = 'preview';

        form.addSubmitButton({ label: 'Preview Changes' });
        return form;
    }

    function onRequest(context) {
        const request = context.request;
        const response = context.response;

        try {
            if (request.method === 'GET') {
                response.writePage(showUploadForm(null));
                return;
            }

            const action = request.parameters.custpage_action;
            const asOf = parseDateInput(request.parameters.custpage_asof) || new Date();

            if (action === 'preview') {
                const uploaded = request.files.custpage_file;
                if (!uploaded) {
                    response.writePage(showUploadForm('No file received. Please choose a CSV.'));
                    return;
                }

                uploaded.folder = getFolderId();
                uploaded.name = 'af_unapproved_' + fmtDate(asOf).replace(/\//g, '') +
                                '_' + Date.now() + '.csv';
                const fileId = uploaded.save();
                const text = file.load({ id: fileId }).getContents();

                const built = buildFor(text, asOf);

                const form = ui.createForm({ title: TITLE + ' - Preview' });
                form.addField({
                    id: 'custpage_preview', type: ui.FieldType.INLINEHTML, label: ' '
                }).defaultValue = renderPreview(built.diff, built.parsed.warnings);

                form.addField({
                    id: 'custpage_action', type: ui.FieldType.TEXT, label: 'Action'
                }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN })
                    .defaultValue = 'apply';
                form.addField({
                    id: 'custpage_fileid', type: ui.FieldType.TEXT, label: 'File'
                }).updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN })
                    .defaultValue = String(fileId);
                const asOfEcho = form.addField({
                    id: 'custpage_asof', type: ui.FieldType.DATE, label: 'Report As Of'
                });
                asOfEcho.updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
                asOfEcho.defaultValue = asOf;

                form.addSubmitButton({ label: 'Confirm & Apply' });
                response.writePage(form);
                return;
            }

            if (action === 'apply') {
                const fileId = request.parameters.custpage_fileid;
                if (!fileId) {
                    response.writePage(showUploadForm('Lost the uploaded file. Please upload again.'));
                    return;
                }
                const text = file.load({ id: fileId }).getContents();

                // Rebuilt from current state, not replayed from the preview.
                const built = buildFor(text, asOf);
                const outcome = data.applyDiff(built.diff, {
                    fileId: fileId,
                    notes: built.parsed.warnings.join('\n')
                });

                const form = ui.createForm({ title: TITLE + ' - Done' });
                form.addField({
                    id: 'custpage_result', type: ui.FieldType.INLINEHTML, label: ' '
                }).defaultValue = renderResult(outcome, built.diff, queueSweep(outcome));
                response.writePage(form);
                return;
            }

            response.writePage(showUploadForm(null));

        } catch (e) {
            log.error({ title: SCRIPT_NAME + ': unhandled', details: e.stack || e.message });
            const form = ui.createForm({ title: TITLE + ' - Error' });
            form.addField({
                id: 'custpage_err', type: ui.FieldType.INLINEHTML, label: ' '
            }).defaultValue = CSS + '<div class="pcaf"><div class="err"><b>' +
                esc(e.message) + '</b></div><p class="sub">Nothing was written if ' +
                'this happened during preview. Check the script execution log for ' +
                'the full trace.</p></div>';
            context.response.writePage(form);
        }
    }

    return { onRequest: onRequest };
});
