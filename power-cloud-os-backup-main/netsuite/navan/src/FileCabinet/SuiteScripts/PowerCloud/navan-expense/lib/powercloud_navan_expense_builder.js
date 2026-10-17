/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @description Power Cloud - Expense Report Record Assembly. Find-or-create model:
 *              for each booking, find an open (complete=false) expense report for the same
 *              employee+project and append; otherwise create a new report.
 * @author Power Cloud Consulting
 */
define([
    'N/record',
    'N/search',
    'N/log',
    './powercloud_navan_constants',
    './powercloud_navan_config'
], function (record, search, log, constants, config) {
    'use strict';

    const SCRIPT_NAME = 'PowerCloud_NavanExpenseBuilder';

    /**
     * Resolves the NetSuite project (Customer/Job) internal ID for a booking.
     * Order: customFields[name='billToClient'].value → TRIP_PROJECT_OVERRIDE → null.
     * @param {Object} booking
     * @returns {string|null}
     */
    function resolveProjectId(booking) {
        const cfField = (booking.customFields || []).find(function (c) {
            return c && c.name === 'billToClient';
        });
        if (cfField && cfField.value) {
            return String(cfField.value);
        }
        const tripUuid = (booking.tripUuids || [])[0];
        if (tripUuid && constants.TRIP_PROJECT_OVERRIDE[tripUuid]) {
            return String(constants.TRIP_PROJECT_OVERRIDE[tripUuid]);
        }
        return null;
    }

    /**
     * Header memo = "<tripName>/<purpose>" if purpose is meaningful, else just tripName.
     * @param {Object} booking
     * @returns {string}
     */
    function buildHeaderMemo(booking) {
        const tripName = (booking.tripName || '').trim();
        const purpose = (booking.purpose || '').trim();
        if (purpose && purpose !== 'NA' && purpose !== tripName) {
            return tripName ? tripName + '/' + purpose : purpose;
        }
        return tripName;
    }

    /**
     * Expense memo (custcol_pc_exp_memo). Uses Navan's tripDescription verbatim,
     * appends invoiceNumber when present.
     * NOTE: this column flows through to CUSTOMER INVOICES for billable expenses, so it
     * must contain no internal annotations (e.g., out-of-policy flags were removed 2026-05-28).
     * @param {Object} booking
     * @returns {string}
     */
    function buildExpenseMemo(booking) {
        let memo = (booking.tripDescription || '').trim();
        if (!memo) {
            // CAR bookings sometimes have empty tripDescription — fall back to vendor + city.
            const vendor = (booking.vendor || booking.bookingType || 'BOOKING').trim();
            const city = booking.destination && booking.destination.city ? booking.destination.city : '';
            memo = city ? vendor + ', ' + city : vendor;
        }
        if (booking.invoiceNumber) {
            memo += ' · ' + booking.invoiceNumber;
        }
        return memo;
    }

    /**
     * Searches for an open (complete=false) expense report for the given employee
     * that already has a line tagged to the given project (customer field).
     * Returns the most-recently-created match, or null.
     * @param {string|number} employeeId
     * @param {string|number} projectId
     * @returns {number|null}
     */
    function findOpenReport(employeeId, projectId) {
        if (!employeeId) {
            return null;
        }
        // projectId may be null (no-project bookings) — those group together by blank
        // customer. The line-level `customer` filter on EXPENSE_REPORT search isn't
        // supported here, so we use header-search + per-record line inspection.
        return findOpenReportFallback(employeeId, projectId);
    }

    function findOpenReportFallback(employeeId, projectId) {
        const headerSearch = search.create({
            type: search.Type.EXPENSE_REPORT,
            filters: [
                ['mainline', 'is', 'T'],
                'AND',
                ['employee', 'anyof', String(employeeId)],
                'AND',
                ['posting', 'is', 'F']
            ],
            columns: ['internalid', search.createColumn({ name: 'datecreated', sort: search.Sort.DESC })]
        });

        const reports = headerSearch.run().getRange({ start: 0, end: 50 });
        for (let i = 0; i < reports.length; i++) {
            const reportId = parseInt(reports[i].getValue('internalid'), 10);
            try {
                const er = record.load({ type: record.Type.EXPENSE_REPORT, id: reportId });
                if (er.getValue({ fieldId: 'complete' }) === true) {
                    continue;
                }
                const lineCount = er.getLineCount({ sublistId: 'expense' });
                for (let j = 0; j < lineCount; j++) {
                    const lineCustomer = er.getSublistValue({ sublistId: 'expense', fieldId: 'customer', line: j });
                    if (projectId) {
                        if (String(lineCustomer) === String(projectId)) {
                            return reportId;
                        }
                    } else if (!lineCustomer) {
                        // No-project booking: group with an existing blank-customer line.
                        return reportId;
                    }
                }
            } catch (e) {
                log.debug({ title: SCRIPT_NAME + ':findOpenReportFallback', details: 'Load failed for ' + reportId + ': ' + e.message });
            }
        }
        return null;
    }

    /**
     * Builds the line value object common to create-new and append paths.
     * @param {Object} booking
     * @param {string} projectId
     * @param {string} headerMemo
     * @returns {Object}
     */
    function buildLineValues(booking, projectId, headerMemo, currencyId) {
        const expenseMemo = buildExpenseMemo(booking);
        const standardMemo = constants.EXPENSE.composeStandardMemo(headerMemo, expenseMemo);
        // Billable only when there's a real project that isn't PC Internal Hours.
        // No-project bookings are imported with a blank customer (NS workflow handles them)
        // and can't be billable without a customer.
        const isBillable = !!projectId && projectId !== constants.EXPENSE.PC_INTERNAL_HOURS_PROJECT_ID;
        const amount = parseFloat(booking.grandTotal) || 0;

        return {
            expensedate: new Date(booking.startDate + 'T00:00:00'),
            category: constants.EXPENSE.TRAVEL_CATEGORY_ID,
            amount: amount,
            currency: currencyId,
            customer: projectId || null,
            isbillable: isBillable,
            corporatecard: true,
            expenseisnonreimbursable: true,
            receipt: true,
            memo: standardMemo,
            expenseMemoColumn: expenseMemo,
            headerMemo: headerMemo,
            standardMemo: standardMemo
        };
    }

    /**
     * Applies the line values onto the currently-selected sublist line.
     */
    function applyLineToCurrent(expReport, line) {
        function set(fieldId, value) {
            expReport.setCurrentSublistValue({ sublistId: 'expense', fieldId: fieldId, value: value });
        }
        set('expensedate', line.expensedate);
        set('category', line.category);
        if (line.currency) {
            set('currency', line.currency);
        }
        set('amount', line.amount);
        // No-project bookings are imported with a blank customer (NS workflow handles them).
        if (line.customer) {
            set('customer', line.customer);
        }
        set('isbillable', line.isbillable);
        set('expenseisnonreimbursable', line.expenseisnonreimbursable);
        set('receipt', line.receipt);
        set('memo', line.standardMemo);
        set(constants.EXPENSE.EXPENSE_MEMO_COLUMN, line.expenseMemoColumn);
        // Corporate Card line flag (accounting requirement). Defensive: a wrong field ID
        // logs instead of breaking every line; verify the ID against a live ER.
        try {
            set(constants.EXPENSE.CORP_CARD_LINE_FIELD, true);
        } catch (e) {
            log.audit({ title: SCRIPT_NAME + ':corpCardLine', details: 'Could not set ' + constants.EXPENSE.CORP_CARD_LINE_FIELD + ': ' + e.message });
        }
    }

    /**
     * Creates a NEW expense report with one line for the given booking.
     * @returns {{expenseReportId:number, lineIndex:number}}
     */
    function getCurrencyId(symbol) {
        const results = search.create({
            type: 'currency',
            filters: [['symbol', 'is', symbol || 'USD']],
            columns: ['internalid']
        }).run().getRange({ start: 0, end: 1 });
        if (!results.length) {
            log.debug({ title: SCRIPT_NAME + ':getCurrencyId', details: 'Currency not found for symbol ' + symbol + ', falling back to USD' });
            const fallback = search.create({
                type: 'currency',
                filters: [['symbol', 'is', 'USD']],
                columns: ['internalid']
            }).run().getRange({ start: 0, end: 1 });
            return fallback.length ? parseInt(fallback[0].id, 10) : null;
        }
        return parseInt(results[0].id, 10);
    }

    function createNewReportWithLine(employee, booking, projectId, headerMemo) {
        const trandate = new Date(booking.endDate + 'T00:00:00');
        const currencyId = getCurrencyId(booking.currency);
        const line = buildLineValues(booking, projectId, headerMemo, currencyId);

        log.audit({
            title: SCRIPT_NAME + ':createNewReportWithLine',
            details: 'employee.id=' + employee.id +
                     ' employee.subsidiary=' + (employee.subsidiary || '(none)') +
                     ' booking.currency=' + (booking.currency || '(none)') +
                     ' resolvedCurrencyId=' + (currencyId || '(null)')
        });

        const er = record.create({ type: record.Type.EXPENSE_REPORT, isDynamic: true });
        if (employee.subsidiary) {
            er.setValue({ fieldId: 'subsidiary', value: employee.subsidiary });
        }
        er.setValue({ fieldId: 'entity', value: employee.id });
        if (currencyId) {
            er.setValue({ fieldId: 'currency', value: currencyId });
        }
        log.debug({
            title: SCRIPT_NAME + ':createNewReportWithLine',
            details: 'After setValue, currency on record = ' + er.getValue({ fieldId: 'currency' })
        });
        er.setValue({ fieldId: 'trandate', value: trandate });
        er.setValue({ fieldId: 'memo', value: headerMemo });
        er.setValue({ fieldId: 'complete', value: false });
        // Corporate card account (accounting requirement). Defensive in case the field
        // isn't on the deployed form.
        try {
            er.setValue({ fieldId: constants.EXPENSE.CORP_CARD_BODY_FIELD, value: constants.EXPENSE.CORP_CARD_ACCOUNT_ID });
        } catch (e) {
            log.audit({ title: SCRIPT_NAME + ':corpCardBody', details: 'Could not set ' + constants.EXPENSE.CORP_CARD_BODY_FIELD + ': ' + e.message });
        }

        er.selectNewLine({ sublistId: 'expense' });
        applyLineToCurrent(er, line);
        er.commitLine({ sublistId: 'expense' });

        const expenseReportId = er.save({ enableSourcing: true, ignoreMandatoryFields: false });
        log.audit({
            title: SCRIPT_NAME,
            details: 'Created expense report ' + expenseReportId +
                     ' for employee ' + employee.id +
                     ', project ' + projectId +
                     ', booking ' + booking.uuid
        });
        return { expenseReportId: expenseReportId, lineIndex: 0 };
    }

    /**
     * Loads an existing expense report and appends one line for the given booking.
     * @returns {{expenseReportId:number, lineIndex:number}}
     */
    function appendLineToReport(expenseReportId, booking, projectId, headerMemo) {
        const currencyId = getCurrencyId(booking.currency);
        const line = buildLineValues(booking, projectId, headerMemo, currencyId);
        const er = record.load({
            type: record.Type.EXPENSE_REPORT,
            id: expenseReportId,
            isDynamic: true
        });

        // Ensure the corporate-card account is set on the report before adding a
        // corporate-card line; reports created before this rule (or by hand) lack it,
        // and a corporate-card line without it fails with "Could not determine account
        // for Corporate Card Expenses".
        try {
            if (!er.getValue({ fieldId: constants.EXPENSE.CORP_CARD_BODY_FIELD })) {
                er.setValue({ fieldId: constants.EXPENSE.CORP_CARD_BODY_FIELD, value: constants.EXPENSE.CORP_CARD_ACCOUNT_ID });
            }
        } catch (e) {
            log.audit({ title: SCRIPT_NAME + ':corpCardBody(append)', details: 'Could not set ' + constants.EXPENSE.CORP_CARD_BODY_FIELD + ': ' + e.message });
        }

        // If this report was opened by the Uber poll (generic placeholder memo, since Uber gives
        // no trip name), let Navan's real trip name take over.
        if (headerMemo && er.getValue({ fieldId: 'memo' }) === constants.EXPENSE.UBER_PLACEHOLDER_MEMO) {
            er.setValue({ fieldId: 'memo', value: headerMemo });
        }

        const newLineIndex = er.getLineCount({ sublistId: 'expense' });
        er.selectNewLine({ sublistId: 'expense' });
        applyLineToCurrent(er, line);
        er.commitLine({ sublistId: 'expense' });

        // Bump the trandate to the latest endDate if this booking ends later.
        const existingTrandate = er.getValue({ fieldId: 'trandate' });
        const candidateTrandate = new Date(booking.endDate + 'T00:00:00');
        if (!existingTrandate || candidateTrandate > existingTrandate) {
            er.setValue({ fieldId: 'trandate', value: candidateTrandate });
        }

        er.save({ enableSourcing: true, ignoreMandatoryFields: false });
        log.audit({
            title: SCRIPT_NAME,
            details: 'Appended line ' + newLineIndex + ' to expense report ' + expenseReportId +
                     ' for booking ' + booking.uuid
        });
        return { expenseReportId: expenseReportId, lineIndex: newLineIndex };
    }

    /**
     * Main entry point for processing one booking.
     * Resolves project, finds or creates the open expense report, appends the line.
     * @param {Object} params
     * @param {Object} params.booking
     * @param {Object} params.employee - { id, subsidiary }
     * @returns {Object|null} { expenseReportId, lineIndex, projectId, action } or null if skipped
     */
    function processBooking(params) {
        const booking = params.booking;
        const employee = params.employee;

        // projectId may be null: no-project bookings are imported with a blank customer
        // (NS workflow handles assigning the customer later, since Navan can't backfill it).
        const projectId = resolveProjectId(booking);
        if (!projectId) {
            log.audit({
                title: SCRIPT_NAME + ':processBooking',
                details: 'No project for booking ' + booking.uuid + '; importing with blank customer'
            });
        }

        const amount = parseFloat(booking.grandTotal) || 0;
        if (amount <= 0) {
            log.debug({
                title: SCRIPT_NAME + ':processBooking',
                details: 'Zero/negative grandTotal for booking ' + booking.uuid + ', skipping'
            });
            return null;
        }

        const headerMemo = buildHeaderMemo(booking);
        const existingReportId = findOpenReport(employee.id, projectId);

        let result;
        let action;
        if (existingReportId) {
            result = appendLineToReport(existingReportId, booking, projectId, headerMemo);
            action = 'appended';
        } else {
            result = createNewReportWithLine(employee, booking, projectId, headerMemo);
            action = 'created';
        }

        return {
            expenseReportId: result.expenseReportId,
            lineIndex: result.lineIndex,
            projectId: projectId,
            action: action,
            amount: amount,
            invoiceUrl: booking.invoice || null,
            bookingType: booking.bookingType
        };
    }

    return {
        processBooking: processBooking,
        resolveProjectId: resolveProjectId,
        buildHeaderMemo: buildHeaderMemo,
        buildExpenseMemo: buildExpenseMemo,
        findOpenReport: findOpenReport,
        // Shared primitives reused by the Uber builder (same find-or-create + corp-card line model).
        getCurrencyId: getCurrencyId,
        applyLineToCurrent: applyLineToCurrent
    };
});
