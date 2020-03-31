const _ = require('underscore');

// TODOs will be implemented only if I have time, otherwise - we can walk over them in face-to-face interview

// TODO: look at the billFor once the dust settles and see if we can refactor by extracting pieces of code 
// to separate methods to improve readability

module.exports.billFor = (month, activeSubscription, users) => {
  // short-circuits:  
  const defaultTotal = 0.0;

  // parse date and throw error if wrong
  if (!_.isString(month)) {
    // TODO: throw error - required argument is not here
  }

  const dateParts = month.split('-');
  if (dateParts !== 2) {
    // TODO: throw format error we expected to have exactly two numbers divided by dash
  }

  // let Date object itself throw format error if something is wrong
  // but if needed we can wrap up the error in a custom error (e.g. to better handle it and report to user through UI)
  const billingMonthDate = new Date(dateParts[0], dateParts[1] - 1);

  // - check if we have users data
  if (!_.isArray(users) || users.length === 0) {
    // no data on users - return zero as per spec
    return defaultTotal;
  }

  // - checks if we have subscription plan info
  if (!_.isObject(activeSubscription)) {
    return defaultTotal;
  }

  // TODO: verify activeSubscription has required fields - error out if something is missing 

  // TODO: need either to filter out or error on users with missing required fields    

  // first we calculate daily rate
  const firstDay = firstDayOfMonth(billingMonthDate);
  const lastDay = lastDayOfMonth(billingMonthDate);
  const daysInMonth = lastDay.getDate() - firstDay.getDate() + 1;
  const dailyRate = activeSubscription.monthlyPriceInDollars / daysInMonth;

  // now walk over all users, calculate days active during the given month and calculate totals
  let total = 0.0;

  // bad algo complexity, I know but I want to finish it before timer :)  
  const userDaysCalculator = (acc, user) => {
    // skip if user does not belong to the customer from the plan
    if (user.customerId !== activeSubscription.customerId) {
      return acc;
    }

    // if deactivated befor first of month - skip
    if (_.isDate(user.deactivatedOn) && user.deactivatedOn < firstDay) {
      return acc;
    }

    // if activated after end of month - skip 
    if (_.isDate(user.activatedOn) && user.activatedOn > lastDay) {
      return acc;
    }

    // otherwise calculate how many days are left
    let firstBillingDay = 1;
    if (user.activatedOn > firstDay) {
      firstBillingDay = user.activatedOn.getDate();
    }

    let lastBillingDay = lastDay.getDate();
    if (_.isDate(user.deactivatedOn) && user.deactivatedOn < lastDay) {
      lastBillingDay = user.deactivatedOn.getDate();
    }

    const daysActiveDuringMonth = lastBillingDay - firstBillingDay + 1;

    return acc + daysActiveDuringMonth;
  };

  const totalUserDays = users.reduce(userDaysCalculator, 0);
  return Math.round(totalUserDays * dailyRate * 100) / 100;
}

/*******************
* Helper functions *
*******************/

/**
  Takes a Date instance and returns a Date which is the first day
  of that month. For example:

  firstDayOfMonth(new Date(2019, 2, 7)) // => new Date(2019, 2, 1)

  Input type: Date
  Output type: Date
**/
function firstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
  Takes a Date object and returns a Date which is the last day
  of that month. For example:

  lastDayOfMonth(new Date(2019, 2, 7)) // => new Date(2019, 2, 28)

  Input type: Date
  Output type: Date
**/
function lastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
  Takes a Date object and returns a Date which is the next day.
  For example:

  nextDay(new Date(2019, 2, 7))  // => new Date(2019, 2, 8)
  nextDay(new Date(2019, 2, 28)) // => new Date(2019, 3, 1)

  Input type: Date
  Output type: Date
**/
function nextDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
}