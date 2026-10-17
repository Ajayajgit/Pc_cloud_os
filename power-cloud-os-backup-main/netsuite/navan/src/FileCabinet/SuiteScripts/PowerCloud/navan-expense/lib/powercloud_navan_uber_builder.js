/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Uber Expense Line Assembly. One expense line per Uber transaction
 *              (Fare, Tip, Adjustment), so lines reconcile 1:1 with the corporate-card charges.
 *              Reuses the Navan expense_builder's find-or-create + corp-card line model; a Tip
 *              that arrives later simply rides find-or-create onto the trip's still-open report,
 *              or a fresh one if that report has been submitted.
 * @author Power Cloud Consulting
 */
define([
    'N/record',
    'N/search',
    'N/log',
    './powercloud_navan_constants',
    './powercloud_navan_expense_builder'
], function (record, search, log, constants, expenseBuilder) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanUberBuilder';

    /**
     * Dedup: has this Uber transaction already been imported? An imported transaction tags its
     * expense line with the Network Transaction Id, so a line search for that id is the check.
     * @param {string} txnId - Network Transaction Id
     * @returns {boolean}
     */
    function isTransactionImported(txnId) {
        if (!txnId) {
            return false;
        }
        const results = search.create({
            type: search.Type.EXPENSE_REPORT,
            filters: [
                ['mainline', 'is', 'F'],
                'AND',
                [constants.UBER_LINE_FIELDS.TXN_ID, 'is', txnId]
            ],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        return results.length > 0;
    }

    /**
     * Parses the NS customer/project internal ID from an Uber Expense Code.
     * Codes are maintained as "ID-Name" (e.g., "4037-AbilityFirst"); we take everything left
     * of the first dash. Free-typed codes that don't start with a number (e.g., "abi") resolve
     * to null → imported with a blank customer, same as the Navan no-Bill-To pattern.
     * @param {string} expenseCode
     * @returns {string|null} NS internal ID string, or null
     */
    function resolveProjectFromCode(expenseCode) {
        if (!expenseCode) {
            return null;
        }
        // Explicit remap first (wrong-entity prefixes and free-typed codes → intended project).
        const override = constants.UBER_CODE_OVERRIDE[String(expenseCode).trim().toLowerCase()];
        if (override) {
            return override;
        }
        const left = String(expenseCode).split('-')[0].trim();
        if (/^\d+$/.test(left)) {
            return left;
        }
        return null;
    }

    /**
     * Builds the line-value object consumed by expense_builder.applyLineToCurrent.
     * @param {Object} txn - parsed Uber transaction (see RESTlet contract)
     * @param {string|null} projectId
     * @param {number} currencyId
     * @returns {Object}
     */
    function buildLineValues(txn, projectId, currencyId) {
        const isBillable = !!projectId && projectId !== constants.EXPENSE.PC_INTERNAL_HOURS_PROJECT_ID;
        const amount = parseFloat(txn.amountUsd) || 0;
        const memo = txn.description || ('Uber ' + (txn.transactionType || '').toLowerCase());

        return {
            expensedate: new Date(txn.expenseDate + 'T00:00:00'),
            category: constants.EXPENSE.TRAVEL_CATEGORY_ID,
            amount: amount,
            currency: currencyId,
            customer: projectId || null,
            isbillable: isBillable,
            expenseisnonreimbursable: true,
            receipt: true,
            // Uber lines have no separate header/expense memo split (unlike Navan trips); the
            // single description serves both the line memo and the customer-facing expense memo.
            standardMemo: memo,
            expenseMemoColumn: memo,
            // Stamped onto the line's custom columns — txn id is the dedup key, trip id groups
            // a trip's Fare/Tip lines for cancellation handling, receipt url is the hyperlink to
            // Uber's trip page (consultant clicks through to pull the original receipt PDF).
            uberTxnId: txn.txnId,
            uberTripId: txn.tripId,
            uberReceiptUrl: txn.receiptUrl
        };
    }

    /** Stamps the Uber tracking columns onto the currently-selected expense line. */
    function applyUberColumns(er, line) {
        er.setCurrentSublistValue({ sublistId: 'expense', fieldId: constants.UBER_LINE_FIELDS.TXN_ID, value: line.uberTxnId });
        if (line.uberTripId) {
            er.setCurrentSublistValue({ sublistId: 'expense', fieldId: constants.UBER_LINE_FIELDS.TRIP_ID, value: line.uberTripId });
        }
        if (line.uberReceiptUrl) {
            er.setCurrentSublistValue({ sublistId: 'expense', fieldId: constants.UBER_LINE_FIELDS.RECEIPT_URL, value: line.uberReceiptUrl });
        }
    }

    /** Sets the corporate-card account on the report header if not already present. */
    function ensureCorpCardAccount(er) {
        try {
            if (!er.getValue({ fieldId: constants.EXPENSE.CORP_CARD_BODY_FIELD })) {
                er.setValue({ fieldId: constants.EXPENSE.CORP_CARD_BODY_FIELD, value: constants.EXPENSE.CORP_CARD_ACCOUNT_ID });
            }
        } catch (e) {
            log.audit({ title: SCRIPT_NAME + ':corpCardBody', details: 'Could not set ' + constants.EXPENSE.CORP_CARD_BODY_FIELD + ': ' + e.message });
        }
    }

    function createReportWithLine(employee, line, trandate, headerMemo) {
        const er = record.create({ type: record.Type.EXPENSE_REPORT, isDynamic: true });
        if (employee.subsidiary) {
            er.setValue({ fieldId: 'subsidiary', value: employee.subsidiary });
        }
        er.setValue({ fieldId: 'entity', value: employee.id });
        if (line.currency) {
            er.setValue({ fieldId: 'currency', value: line.currency });
        }
        er.setValue({ fieldId: 'trandate', value: trandate });
        er.setValue({ fieldId: 'memo', value: headerMemo });
        er.setValue({ fieldId: 'complete', value: false });
        ensureCorpCardAccount(er);

        er.selectNewLine({ sublistId: 'expense' });
        expenseBuilder.applyLineToCurrent(er, line);
        applyUberColumns(er, line);
        er.commitLine({ sublistId: 'expense' });

        const expenseReportId = er.save({ enableSourcing: true, ignoreMandatoryFields: false });
        log.audit({
            title: SCRIPT_NAME,
            details: 'Created Uber expense report ' + expenseReportId + ' for employee ' + employee.id
        });
        return { expenseReportId: expenseReportId, lineIndex: 0 };
    }

    function appendLineToReport(expenseReportId, line, trandate) {
        const er = record.load({ type: record.Type.EXPENSE_REPORT, id: expenseReportId, isDynamic: true });
        ensureCorpCardAccount(er);

        const newLineIndex = er.getLineCount({ sublistId: 'expense' });
        er.selectNewLine({ sublistId: 'expense' });
        expenseBuilder.applyLineToCurrent(er, line);
        applyUberColumns(er, line);
        er.commitLine({ sublistId: 'expense' });

        const existingTrandate = er.getValue({ fieldId: 'trandate' });
        if (!existingTrandate || trandate > existingTrandate) {
            er.setValue({ fieldId: 'trandate', value: trandate });
        }

        er.save({ enableSourcing: true, ignoreMandatoryFields: false });
        log.audit({
            title: SCRIPT_NAME,
            details: 'Appended Uber line ' + newLineIndex + ' to expense report ' + expenseReportId
        });
        return { expenseReportId: expenseReportId, lineIndex: newLineIndex };
    }

    /**
     * Processes one Uber transaction into an expense report line (find-or-create).
     * If NetSuite rejects the parsed project as a customer (the code's numeric prefix isn't a
     * valid/active customer or job — e.g. a test code like "296"), retries with a blank customer
     * so the charge still imports and an NS workflow can assign the customer later.
     * @param {Object} params
     * @param {Object} params.transaction - parsed Uber transaction
     * @param {Object} params.employee - { id, subsidiary }
     * @returns {Object} { expenseReportId, lineIndex, projectId, action }
     */
    function processTransaction(params) {
        const txn = params.transaction;
        const employee = params.employee;
        const projectId = resolveProjectFromCode(txn.expenseCode);
        const currencyId = expenseBuilder.getCurrencyId('USD');
        const trandate = new Date(txn.expenseDate + 'T00:00:00');

        try {
            return placeLine(employee, txn, projectId, currencyId, trandate);
        } catch (e) {
            if (projectId && /invalid field value.*customer/i.test(e.message)) {
                log.audit({
                    title: SCRIPT_NAME,
                    details: 'Expense code "' + txn.expenseCode + '" → project ' + projectId +
                             ' rejected by NetSuite; importing with blank customer. (' + e.message + ')'
                });
                return placeLine(employee, txn, null, currencyId, trandate);
            }
            throw e;
        }
    }

    function placeLine(employee, txn, projectId, currencyId, trandate) {
        const line = buildLineValues(txn, projectId, currencyId);
        const existingReportId = expenseBuilder.findOpenReport(employee.id, projectId);

        let result;
        let action;
        if (existingReportId) {
            result = appendLineToReport(existingReportId, line, trandate);
            action = 'appended';
        } else {
            result = createReportWithLine(employee, line, trandate, constants.EXPENSE.UBER_PLACEHOLDER_MEMO);
            action = 'created';
        }

        return {
            expenseReportId: result.expenseReportId,
            lineIndex: result.lineIndex,
            projectId: projectId,
            action: action
        };
    }

    return {
        processTransaction: processTransaction,
        resolveProjectFromCode: resolveProjectFromCode,
        isTransactionImported: isTransactionImported
    };
});
