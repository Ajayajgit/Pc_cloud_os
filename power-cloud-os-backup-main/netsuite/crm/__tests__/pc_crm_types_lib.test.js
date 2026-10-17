/**
 * Acceptance tests for PC | Type Map (pc_crm_types_lib.js).
 * One test per acceptance criterion in the approved plan block (T2, Power Cloud NS/CRM/PLAN.md).
 * Each title starts with the criterion ID. The support type id is a test fixture, not an account value.
 */
import lib from 'SuiteScripts/PC/pc_crm_types_lib';

const SUPPORT_TYPE_ID = 99;

describe('PC | Type Map acceptance criteria', () => {
    it('T1: engagement types 2, 3, 4, 5, 7, 8 and 10 map to job types 1, 3, 2, 3, 6, 9 and 2', () => {
        const cases = [
            [2, 1],
            [3, 3],
            [4, 2],
            [5, 3],
            [7, 6],
            [8, 9],
            [10, 2]
        ];

        expect(cases.map(([engagementTypeId]) => lib.toJobType(engagementTypeId, SUPPORT_TYPE_ID)))
            .toEqual(cases.map(([, jobTypeId]) => ({ jobTypeId })));
    });

    it('T2: engagement types 1 and 9 return noProject', () => {
        expect(lib.toJobType(1, SUPPORT_TYPE_ID)).toEqual({ noProject: true });
        expect(lib.toJobType(9, SUPPORT_TYPE_ID)).toEqual({ noProject: true });
    });

    it('T3: the engagement type equal to the support type id parameter maps to job type 5', () => {
        // 8 would otherwise map to job type 9, and 6 would otherwise be unmapped, so the support check must win.
        expect(lib.toJobType(8, 8)).toEqual({ jobTypeId: 5 });
        expect(lib.toJobType(6, 6)).toEqual({ jobTypeId: 5 });
    });

    it('T4: engagement type 6, a blank value and an unknown value return unmapped', () => {
        expect(lib.toJobType(6, SUPPORT_TYPE_ID)).toEqual({ unmapped: true });
        expect(lib.toJobType('', SUPPORT_TYPE_ID)).toEqual({ unmapped: true });
        expect(lib.toJobType(42, SUPPORT_TYPE_ID)).toEqual({ unmapped: true });
    });

    it('T5: string ids are accepted the same as numbers', () => {
        expect(lib.toJobType('2', '99')).toEqual(lib.toJobType(2, 99));
        expect(lib.toJobType('1', '99')).toEqual({ noProject: true });
        expect(lib.toJobType('8', '8')).toEqual({ jobTypeId: 5 });
        expect(lib.toJobType('6', '99')).toEqual({ unmapped: true });
    });
});
