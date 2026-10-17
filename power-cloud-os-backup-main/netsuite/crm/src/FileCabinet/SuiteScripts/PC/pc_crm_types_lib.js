/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
/**
 * PC | Type Map
 * Purpose: map an opportunity engagement type to a project job type, or report that no project applies or that the type is unmapped.
 * Plan task: T2 (Power Cloud NS/CRM/PLAN.md)
 * Author: Power Cloud Consulting, 2026-10-09
 * Deployments: none (library)
 */
define([], () => {
    // Engagement type id (customlist_pc_proj_types) to project jobtype id.
    // 2 New Implementation -> 1 Implementation, 3 Rapid Assessment -> 3, 4 Use Case -> 2,
    // 5 Project Recovery -> 3, 7 SuiteCommerce -> 6, 8 Managed Services -> 9, 10 NSPB -> 2.
    const JOB_TYPE_BY_ENGAGEMENT_TYPE = {
        2: 1,
        3: 3,
        4: 2,
        5: 3,
        7: 6,
        8: 9,
        10: 2
    };
    // 1 New License Deal and 9 Power Cloud Product never create a project.
    const NO_PROJECT_TYPES = [1, 9];
    // jobtype id 5 is Support.
    const JOB_TYPE_SUPPORT = 5;

    const toPositiveInt = (value) => {
        const n = parseInt(value, 10);
        return Number.isInteger(n) && n > 0 ? n : null;
    };

    /**
     * @param {number|string} engagementTypeId value of custbody_pc_project_type
     * @param {number|string} supportTypeId id of the Support value, from script parameter (created in the UI)
     * @returns {{jobTypeId: number}|{noProject: true}|{unmapped: true}}
     */
    const toJobType = (engagementTypeId, supportTypeId) => {
        const type = toPositiveInt(engagementTypeId);
        const support = toPositiveInt(supportTypeId);

        if (!type) {
            return { unmapped: true };
        }
        if (support && type === support) {
            return { jobTypeId: JOB_TYPE_SUPPORT };
        }
        if (NO_PROJECT_TYPES.includes(type)) {
            return { noProject: true };
        }
        if (Object.prototype.hasOwnProperty.call(JOB_TYPE_BY_ENGAGEMENT_TYPE, type)) {
            return { jobTypeId: JOB_TYPE_BY_ENGAGEMENT_TYPE[type] };
        }
        return { unmapped: true };
    };

    return { toJobType };
});
