/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/url', 'N/ui/message', 'N/currentRecord', 'N/runtime'],
    /**
     * @param{https} https
     * @param{url} url
     * @param{message} message
     * @param{currentRecord} currentRecord
     * @param{runtime} runtime
     */
    function(https, url, message, currentRecord, runtime) {

        var currentMessage = null; // To keep track of the displayed message

        function pageInit(scriptContext) {
            // You can add any page initialization logic here if needed.
        }

        function createProjectFromOpportunity(opportunityId) {
            if (!opportunityId) {
                var rec = currentRecord.get();
                opportunityId = rec.id;
            }

            if (!opportunityId) {
                console.error('Opportunity ID not found.');
                message.create({
                    title: 'Error',
                    message: 'Could not retrieve Opportunity ID.',
                    type: message.Type.ERROR
                }).show({ duration: 5000 });
                return;
            }

            // Show a processing message
            if (currentMessage) {
                currentMessage.hide();
                currentMessage = null;
            }
            currentMessage = message.create({
                title: 'Processing',
                message: 'Creating project, please wait...',
                type: message.Type.INFORMATION
            });
            currentMessage.show();

            // Resolve the Suitelet URL
            // IMPORTANT: Replace 'customscript_sl_create_project' and 'customdeploy_sl_create_project'
            // with your Suitelet's Script ID and Deployment ID.
            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_sl_create_project', // Replace with your Suitelet Script ID
                deploymentId: 'customdeploy_sl_create_project', // Replace with your Suitelet Deployment ID
                returnExternalUrl: false,
                params: {
                    opportunityId: opportunityId
                }
            });

            // Call the Suitelet
            https.get.promise({
                url: suiteletUrl
            }).then(function(response) {
                if (currentMessage) {
                    currentMessage.hide();
                    currentMessage = null;
                }

                var body = JSON.parse(response.body);
                if (body.success) {
                    var successMsg = message.create({
                        title: 'Success',
                        message: 'Project created successfully! Project ID: ' + body.projectId +
                                 (body.projectUrl ? ' <a href="' + body.projectUrl + '" target="_blank">View Project</a>' : ''),
                        type: message.Type.CONFIRMATION
                    });
                    successMsg.show(); // Show indefinitely until user dismisses or navigates away

                    // Optionally, refresh the page or redirect
                    // window.location.reload();
                } else {
                    message.create({
                        title: 'Error Creating Project',
                        message: 'Failed to create project: ' + body.error,
                        type: message.Type.ERROR
                    }).show({ duration: 10000 });
                }
            }).catch(function(error) {
                if (currentMessage) {
                    currentMessage.hide();
                    currentMessage = null;
                }
                console.error('Suitelet call failed', error);
                message.create({
                    title: 'Request Failed',
                    message: 'An error occurred while communicating with the server: ' + error.message,
                    type: message.Type.ERROR
                }).show({ duration: 10000 });
            });
        }

        return {
            pageInit: pageInit,
            createProjectFromOpportunity: createProjectFromOpportunity
        };
    });
