/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**
 * PC | Opportunity CRM Buttons
 * Purpose: form-attached handlers for the Create Project and Resume Project Setup buttons; posts to PC | Create Project Service.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: none (attached to the opportunity form by PC | Opportunity CRM Guard)
 */
define(['N/https', 'N/url', 'N/currentRecord', 'N/ui/message', 'N/log'], (
    https,
    url,
    currentRecord,
    message,
    log
) => {
    const SUITELET_SCRIPT_ID = 'customscript_pc_crm_create_project_sl';
    const SUITELET_DEPLOYMENT_ID = 'customdeploy_pc_crm_create_project_sl';
    const MESSAGE_SECONDS = 8000;

    let inFlight = false;

    /**
     * UUID v4 from the browser. N/crypto/random is a server-side module and is not available in a client
     * script, so the browser's crypto.getRandomValues is used. There is no weaker fallback: if the browser cannot
     * supply random values the request is not sent.
     */
    const newRequestId = () => {
        const cryptoApi = window.crypto;
        if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
            return null;
        }
        const bytes = new Uint8Array(16);
        cryptoApi.getRandomValues(bytes);
        // RFC 4122: version 4 in byte 6, variant 10xx in byte 8.
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    };

    const show = (type, title, text) => {
        message.create({ type, title, message: text }).show({ duration: MESSAGE_SECONDS });
    };

    const send = (action) => {
        if (inFlight) {
            return;
        }
        let oppId = null;
        try {
            oppId = currentRecord.get().id;
            const requestId = newRequestId();
            if (!requestId) {
                show(message.Type.ERROR, 'Project setup not started', 'This browser cannot generate a request id.');
                return;
            }

            const suiteletUrl = url.resolveScript({
                scriptId: SUITELET_SCRIPT_ID,
                deploymentId: SUITELET_DEPLOYMENT_ID
            });

            inFlight = true;
            show(message.Type.INFORMATION, 'Project setup', 'Working. Do not close this page.');

            https.post.promise({
                url: suiteletUrl,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opportunityId: Number(oppId), requestId, action })
            }).then((response) => {
                inFlight = false;
                let body = null;
                try {
                    body = JSON.parse(response.body);
                } catch (parseError) {
                    log.error({
                        title: `send could not read the response on opportunity ${oppId}`,
                        details: `${parseError.name}: ${parseError.message}`
                    });
                }
                if (body && body.success) {
                    show(message.Type.CONFIRMATION, 'Project ready', 'The project was set up. Reloading.');
                    // Navigation, not DOM manipulation: reload so the form shows the new status and links.
                    window.location.reload();
                } else if (body && body.state === 'complete') {
                    show(message.Type.INFORMATION, 'Already set up', body.error || 'A project already exists for this opportunity.');
                    window.location.reload();
                } else {
                    show(message.Type.ERROR, 'Project setup stopped', (body && body.error) || 'No usable answer from the service.');
                }
            }).catch((e) => {
                inFlight = false;
                log.error({
                    title: `send failed on opportunity ${oppId}`,
                    details: `${e.name}: ${e.message}\n${e.stack}`
                });
                show(message.Type.ERROR, 'Project setup stopped', 'The request failed. Try Resume Project Setup.');
            });
        } catch (e) {
            inFlight = false;
            log.error({
                title: `send failed on opportunity ${oppId}`,
                details: `${e.name}: ${e.message}\n${e.stack}`
            });
            show(message.Type.ERROR, 'Project setup stopped', 'The request could not be sent.');
        }
    };

    const pageInit = () => {
        // Intentionally empty: the form-attached module only needs its button handlers.
    };

    const createProject = () => {
        send('create');
    };

    const resumeProject = () => {
        send('resume');
    };

    return { pageInit, createProject, resumeProject };
});
