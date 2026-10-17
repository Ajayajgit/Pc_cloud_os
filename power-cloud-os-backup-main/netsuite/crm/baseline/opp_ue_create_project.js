/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/ui/serverWidget', 'N/runtime'],
    /**
     * @param {serverWidget} serverWidget
     * @param {runtime} runtime
     */
    function (serverWidget, runtime) {

        /**
         * Adds the “Create Project” button only when:
         *   • the record is being viewed (VIEW, not EDIT), and
         *   • the opportunity’s status is “Won – Awaiting Project” (internal ID 24), and
         *   • no project has already been linked (custbody_opp_proj_create is empty)
         *
         * @param {Object} scriptContext
         * @param {Record}  scriptContext.newRecord  – current opportunity
         * @param {string} scriptContext.type        – trigger type
         * @param {Form}   scriptContext.form        – form
         */
        function beforeLoad(scriptContext) {

            // Only run in VIEW mode
            if (scriptContext.type !== scriptContext.UserEventType.VIEW) {
                return;
            }

            var form          = scriptContext.form;
            var currentRecord = scriptContext.newRecord;
            var opportunityId = currentRecord.id;

            // 1. Check opportunity status (fieldId 'entitystatus')
            var oppStatusId = currentRecord.getValue({ fieldId: 'entitystatus' });
            var STATUS_WON_AWAITING_PROJECT = '24';   // internal ID for “Won – Awaiting Project”

            if (oppStatusId !== STATUS_WON_AWAITING_PROJECT) {
                return; // Wrong status – no button
            }

            // 2. Ensure no project has already been created/linked
            var existingProjectId = currentRecord.getValue({ fieldId: 'custbody_opp_proj_create' });
            if (existingProjectId) {
                return; // Project already exists – no button
            }

            // 3. Add the button + link client script
            form.clientScriptModulePath = './opp_cs_create_project.js'; // adjust path if needed
            form.addButton({
                id: 'custpage_create_project_button',
                label: 'Create Project',
                functionName: 'createProjectFromOpportunity(' + opportunityId + ')'
            });
        }

        return {
            beforeLoad: beforeLoad
        };
    });
