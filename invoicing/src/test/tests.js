const main = require('../main');
const assert = require('chai').assert;
const itParam = require('mocha-param');

const testCases = {
    plan: {
        id: 1,
        customerId: 1,
        monthlyPriceInDollars: 4,
    },

    singleUserActivatedBeforeBillingMonth: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2018-11-04'),
            deactivatedOn: null,
            customerId: 1
        }
    ],
    singleUserActivatedAfterBillingMonthEnd: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2020-03-04'),
            deactivatedOn: null,
            customerId: 1
        }
    ],
    singleUserActivatedBeforeBillingMonthAndDeactivatedAfterBillingMonthEnd: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2018-06-02'),
            deactivatedOn: new Date('2020-03-04'),
            customerId: 1
        }
    ],
    singleUserActivatedDuringBillingMonthAndDeactivatedAfterBillingMonthEnd: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2019-01-22'),
            deactivatedOn: new Date('2020-03-04'),
            customerId: 1
        },
    ],
    singleUserActivatedAndDeactivatedDuringBillingMonth: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2019-01-15'),
            deactivatedOn: new Date('2019-01-19'),
            customerId: 1
        }
    ],
    singleUserActiveOnlyOnFirstDayOfBillingMonth: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date(2019, 0, 01),
            deactivatedOn: new Date(2019, 0, 01),
            customerId: 1
        }
    ],
    singleUserActiveOnlyOnLastDayOfBillingMonth: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2019-01-31'),
            deactivatedOn: new Date('2019-01-31'),
            customerId: 1
        }
    ],
    constantUsers: [
        {
            id: 1,
            name: 'Employee #1',
            activatedOn: new Date('2018-11-04'),
            deactivatedOn: null,
            customerId: 1,
        },
        {
            id: 2,
            name: 'Employee #2',
            activatedOn: new Date('2018-12-04'),
            deactivatedOn: null,
            customerId: 1,
        },
    ],
    noUsers: []

}

describe('billFor', function () {
    it('works when the customer has no active users during the month', function () {
        // closeTo parameters -> actual, expected, tolerance
        assert.closeTo(main.billFor('2019-01', testCases.plan, testCases.noUsers), 0.00, 0.01);
    });

    itParam('returns zero when subscription info is not provided ${value.desc}',
        [
            { desc: 'null', plan: null },
            { desc: 'undefined', plan: undefined }
        ],
        value => {
            assert.closeTo(main.billFor('2019-01', value.plan, testCases.constantUsers), 0.00, 0.01);
        });

    itParam('works when ${value.desc}',
        [
            {
                desc: 'customer has a single user activated before billing month',
                users: testCases.singleUserActivatedBeforeBillingMonth,
                plan: testCases.plan,
                expected: testCases.plan.monthlyPriceInDollars
            },
            {
                desc: 'customer has a single user activated AFTER billing month end',
                users: testCases.singleUserActivatedAfterBillingMonthEnd,
                plan: testCases.plan,
                expected: 0.00
            },
            {
                desc: 'customer has a single user activated BEFORE billing month and deactivated AFTER billing month end',
                users: testCases.singleUserActivatedBeforeBillingMonthAndDeactivatedAfterBillingMonthEnd,
                plan: testCases.plan,
                expected: testCases.plan.monthlyPriceInDollars
            },
            {
                desc: 'customer has a single user activated DURING billing month and deactivated AFTER billing month end',
                users: testCases.singleUserActivatedDuringBillingMonthAndDeactivatedAfterBillingMonthEnd,
                plan: testCases.plan,
                expected: 1.42
            },
            {
                desc: 'customer has a single user activated and deactivated DURING billing month',
                users: testCases.singleUserActivatedAndDeactivatedDuringBillingMonth,
                plan: testCases.plan,
                expected: 0.65
            },
            {
                desc: 'customer has a single user active only on first day of the billing month',
                users: testCases.singleUserActiveOnlyOnFirstDayOfBillingMonth,
                plan: testCases.plan,
                expected: 0.13
            },
            {
                desc: 'customer has a single user active only on the last day of billing month',
                users: testCases.singleUserActiveOnlyOnLastDayOfBillingMonth,
                plan: testCases.plan,
                expected: 0.13
            },
        ],
        value => {
            // ACT
            const billTotal = main.billFor('2019-01', value.plan, value.users);

            // ASSERT
            assert.closeTo(billTotal, value.expected, 0.01);
        });
});