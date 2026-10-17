/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/log', 'N/search', 'N/runtime', 'N/url', 'N/format'],
    /**
     * @param{record} record
     * @param{log} log
     * @param{search} search
     * @param{runtime} runtime
     * @param{url} nsUrl
     * @param{format} format
     */
    function(record, log, search, runtime, nsUrl, format) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Encapsulation of the incoming request
         * @param {ServerResponse} scriptContext.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(scriptContext) {
            if (scriptContext.request.method === 'GET') {
                var opportunityId = scriptContext.request.parameters.opportunityId;
                log.debug('Suitelet Triggered', 'Opportunity ID: ' + opportunityId);

                try {
                    if (!opportunityId) {
                        throw 'Opportunity ID is required.';
                    }

                    var oppRec = record.load({
                        type: record.Type.OPPORTUNITY,
                        id: opportunityId,
                        isDynamic: false
                    });

                    // Log the resource values fetched from Opportunity
                    var solPrincipal = oppRec.getValue('custbody_opp_principal');
                    var senConsultant = oppRec.getValue('custbody_opp_proj_srcon');
                    var staffConsultantOpp = oppRec.getValue('custbody_opp_proj_staff');
                    var leadDev = oppRec.getValue('custbody_opp_proj_leaddev');

                    log.debug('Opportunity Resource Values', {
                        solPrincipal: solPrincipal,
                        senConsultant: senConsultant,
                        staffConsultantOpp: staffConsultantOpp,
                        leadDev: leadDev,
                        oppClass: oppRec.getValue('class'),
                        oppEntity: oppRec.getValue('entity'),
                        oppRate: oppRec.getValue('custbody_opp_rate'),
                        isRapid: oppRec.getValue('custbody_opp_rapid')
                    });


                    // --- Create Project Record ---
                    var projectRec = record.create({
                        type: record.Type.JOB, // JOB is the internal ID for Project
                        isDynamic: true
                    });

                    // 1. Project Name {companyname} should come from Opportunity Title {title}
                    projectRec.setValue({ fieldId: 'companyname', value: oppRec.getValue('title') });

                    // 2. Project Parent {parent}
                    var oppClass = oppRec.getValue('class');
                    var customerId = oppRec.getValue('entity');
                    var projectParent;
                    if (oppClass == '5') { // Class 'Anderson Frank' (ID 5)
                        projectParent = 136; // Customer 'Anderson Frank' (ID 136)
                    } else {
                        projectParent = customerId;
                    }
                    projectRec.setValue({ fieldId: 'parent', value: projectParent });

                    // 3. Project Status {entitystatus} = "Awarded - Pre-kickoff" (ID 5)
                    projectRec.setValue({ fieldId: 'entitystatus', value: 5 });

                    // Fixed: Set resource fields with correct field IDs
                    if (solPrincipal) {
                        projectRec.setValue({ fieldId: 'custentity_pc_proj_principal', value: solPrincipal });
                    }
                    if (senConsultant) {
                        projectRec.setValue({ fieldId: 'custentity_pc_sen_consultant', value: senConsultant });
                    }
                    if (staffConsultantOpp) {
                        // FIXED: Use correct field ID for staff consultant
                        projectRec.setValue({ fieldId: 'custentity_pc_proj_staff_cons', value: staffConsultantOpp });
                    }
                    if (leadDev) {
                        projectRec.setValue({ fieldId: 'custentity_proj_lead_dev', value: leadDev });
                    }
                    if (oppClass) {
                        projectRec.setValue({ fieldId: 'custentity_cus_rev_src', value: oppClass });
                    }
                    projectRec.setValue({ fieldId: 'allowtime', value: true });
                    projectRec.setValue({ fieldId: 'allowallresourcesfortasks', value: true });
                    projectRec.setValue({ fieldId: 'allowexpenses', value: true });
                    projectRec.setValue({ fieldId: 'projectexpensetype', value: -2 });

                    var projectId = projectRec.save();
                    log.audit('Project Created', 'Project ID: ' + projectId);

                    if (!projectId) {
                        log.error('CRITICAL: Project ID is null or invalid after saving project record.', 'Returned Project ID: ' + projectId);
                        throw 'Failed to save project record or Project ID is invalid.';
                    }

                    // --- Link project back to opportunity custom field ---
                    try {
                        var oppUpdateRec = record.load({
                            type: record.Type.OPPORTUNITY,
                            id: opportunityId,
                            isDynamic: false
                        });
                        oppUpdateRec.setValue({ fieldId: 'custbody_opp_proj_create', value: projectId });
                        oppUpdateRec.save();
                        log.audit('Opportunity Updated', 'Linked project ' + projectId + ' to opportunity ' + opportunityId + ' in custbody_opp_proj_create field');
                    } catch (linkError) {
                        log.error('Failed to link project to opportunity', {
                            error: linkError.message,
                            projectId: projectId,
                            opportunityId: opportunityId
                        });
                    }

                    // --- Prepare resources for tasks ---
                    var oppRate = oppRec.getValue('custbody_opp_rate') || 0;
                    var resourcesToAssign = [
                        { id: solPrincipal, role: 'Principal' },
                        { id: senConsultant, role: 'Senior Consultant' },
                        { id: staffConsultantOpp, role: 'Staff Consultant' },
                        { id: leadDev, role: 'Lead Developer' }
                    ];
                    log.debug('Prepared resourcesToAssign array', resourcesToAssign);

                    // --- Create Project Task: "Netsuite Configuration" ---
                    createProjectTask(record, log, format, projectId, "Netsuite Configuration", resourcesToAssign, oppRate);

                    // 14. If {custbody_opp_rapid} on the opportunity = True, create "Rapid Assessment" task
                    var isRapidOpp = oppRec.getValue('custbody_opp_rapid');
                    if (isRapidOpp === true || isRapidOpp === 'T' || isRapidOpp === 'true') {
                        createProjectTask(record, log, format, projectId, "Rapid Assessment", resourcesToAssign, 106.25);
                    }

                    var projectUrl = nsUrl.resolveRecord({
                        recordType: record.Type.JOB,
                        recordId: projectId,
                        isEditMode: false
                    });

                    scriptContext.response.setHeader({ name: 'Content-Type', value: 'application/json' });
                    scriptContext.response.write(JSON.stringify({ success: true, projectId: projectId, projectUrl: projectUrl }));

                } catch (e) {
                    log.error('Error Creating Project or Tasks', {
                        name: e.name,
                        message: e.message || e.toString(),
                        stack: e.stack || (e.getStackTrace ? e.getStackTrace() : 'N/A'),
                        details: e.toString(),
                        fullErrorObject: JSON.stringify(e) 
                    });
                    scriptContext.response.setHeader({ name: 'Content-Type', value: 'application/json' });
                    scriptContext.response.write(JSON.stringify({ success: false, error: e.message || e.toString(), details: e.toString() } ));
                }
            } else {
                scriptContext.response.write('This Suitelet only accepts GET requests.');
            }
        }

        /**
         * Helper function to create a project task and assign resources.
         * Fixed version with proper planned work handling.
         */
        function createProjectTask(recordModule, logModule, formatModule, projectId, taskTitle, resourcesToAssignInput, unitPrice) {
            logModule.debug('createProjectTask START', {
                projectId: projectId,
                taskTitle: taskTitle,
                unitPrice: unitPrice,
                resourceCount: resourcesToAssignInput.length
            });

            if (!projectId || String(projectId).trim() === "" || projectId === 'null' || projectId === 'undefined') {
                logModule.error('CRITICAL: Invalid Project ID', 'Project ID: "' + projectId + '", Task Title: ' + taskTitle);
                throw new Error('Parent Project ID is invalid: ' + projectId);
            }

            var numericProjectId = parseInt(projectId, 10);
            if (isNaN(numericProjectId)) {
                logModule.error('CRITICAL: Project ID is not a number', 'Original: "' + projectId + '", Parsed: ' + numericProjectId);
                throw new Error('Parent Project ID not a valid number: ' + projectId);
            }

            var taskId;

            try {
                // Filter valid resources first
                var validResources = resourcesToAssignInput.filter(function(resourceInfo) {
                    var isValid = resourceInfo.id && String(resourceInfo.id).trim() !== "";
                    logModule.debug('Resource validation', {
                        resourceId: resourceInfo.id,
                        role: resourceInfo.role,
                        isValid: isValid
                    });
                    return isValid;
                });

                logModule.debug('Valid resources to assign', { 
                    count: validResources.length,
                    resources: validResources.map(function(r) { return { id: r.id, role: r.role }; })
                });

                // Create task with proper planned work setup
                var taskRec = recordModule.create({
                    type: recordModule.Type.PROJECT_TASK,
                    isDynamic: false
                });

                // Set basic task fields
                taskRec.setValue({ fieldId: 'project', value: numericProjectId }); 
                taskRec.setValue({ fieldId: 'company', value: numericProjectId }); 
                taskRec.setValue({ fieldId: 'title', value: taskTitle });
                
                // Set multiple planned work related fields
                taskRec.setValue({ fieldId: 'plannedwork', value: validResources.length || 1 });
                
                // Try alternative field names for planned work
                try {
                    taskRec.setValue({ fieldId: 'estimatedwork', value: validResources.length || 1 });
                } catch (e) {
                    logModule.debug('estimatedwork field not available on task header');
                }
                
                try {
                    taskRec.setValue({ fieldId: 'estimatedhours', value: validResources.length || 1 });
                } catch (e) {
                    logModule.debug('estimatedhours field not available on task header');
                }

                // Set status to ensure task is valid
                try {
                    taskRec.setValue({ fieldId: 'status', value: 'NOTSTART' }); // Not Started
                } catch (e) {
                    logModule.debug('status field not available or value invalid');
                }

                logModule.debug('Basic task fields set', {
                    project: numericProjectId,
                    title: taskTitle,
                    plannedwork: validResources.length || 1
                });

                // Add assignments using the assignee sublist (discovered from logs)
                validResources.forEach(function(resourceInfo, index) {
                    try {
                        logModule.debug('Adding assignment ' + index, {
                            resourceId: resourceInfo.id,
                            role: resourceInfo.role
                        });

                        // Determine service item based on role
                        var serviceItemId;
                        if (resourceInfo.role === 'Principal' || resourceInfo.role === 'Senior Consultant' || resourceInfo.role === 'Staff Consultant') {
                            serviceItemId = 6;
                        } else if (resourceInfo.role === 'Lead Developer') {
                            serviceItemId = 7;
                        } else {
                            logModule.warn('Unknown role, using default service item', 'Role: ' + resourceInfo.role);
                            serviceItemId = 6;
                        }

                        // Use assignee sublist as discovered in logs
                        taskRec.insertLine({
                            sublistId: 'assignee',
                            line: index
                        });

                        // Set resource using the field that worked
                        taskRec.setSublistValue({
                            sublistId: 'assignee',
                            fieldId: 'resource',
                            line: index,
                            value: resourceInfo.id
                        });

                        // Set service item
                        try {
                            taskRec.setSublistValue({
                                sublistId: 'assignee',
                                fieldId: 'serviceitem',
                                line: index,
                                value: serviceItemId
                            });
                        } catch (e) {
                            logModule.debug('serviceitem field not available on assignee sublist');
                        }

                        // Set unit price
                        try {
                            taskRec.setSublistValue({
                                sublistId: 'assignee',
                                fieldId: 'unitprice',
                                line: index,
                                value: unitPrice || 0
                            });
                        } catch (e) {
                            logModule.debug('unitprice field not available on assignee sublist');
                        }

                        // Set estimated work for this assignment
                        try {
                            taskRec.setSublistValue({
                                sublistId: 'assignee',
                                fieldId: 'estimatedwork',
                                line: index,
                                value: 1
                            });
                        } catch (e) {
                            logModule.debug('estimatedwork field not available on assignee sublist');
                        }

                        // Try alternative field names for planned work on assignment
                        try {
                            taskRec.setSublistValue({
                                sublistId: 'assignee',
                                fieldId: 'plannedwork',
                                line: index,
                                value: 1
                            });
                        } catch (e) {
                            logModule.debug('plannedwork field not available on assignee sublist');
                        }

                        logModule.debug('Assignment ' + index + ' successfully configured', {
                            resourceId: resourceInfo.id,
                            serviceItemId: serviceItemId
                        });

                    } catch (assignmentError) {
                        logModule.error('Error adding assignment', {
                            error: assignmentError.message,
                            resourceId: resourceInfo.id,
                            role: resourceInfo.role,
                            index: index
                        });
                    }
                });

                // Save the task
                taskId = taskRec.save();
                logModule.audit('Project Task SAVED successfully', { 
                    taskId: taskId, 
                    taskTitle: taskTitle,
                    projectId: numericProjectId,
                    assignmentsAdded: validResources.length 
                });

            } catch (taskError) {
                logModule.error('ERROR CREATING TASK', {
                    name: taskError.name,
                    message: taskError.message,
                    stack: taskError.stack,
                    taskTitle: taskTitle,
                    projectId: numericProjectId
                });
                throw taskError;
            }

            return taskId; 
        }

        return {
            onRequest: onRequest
        };
    });