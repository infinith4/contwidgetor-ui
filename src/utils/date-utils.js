import moment from 'moment';
import _ from 'lodash';

const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let getMonths = () => shortMonths;

let generateShortMonths =
    startingMonth => shortMonths.slice(startingMonth).concat(shortMonths.slice(0, startingMonth));

let generateDatesMonthUntil = (year, month, endDay) => {
    let res = [];
    for (var i=1; i<endDay+1; i++) {
        res.push(year + '-' + month + '-' + getIntValAsString(i.toString()));
    }

    return res;
}

let generateAllDates = (startingDate, endDate) => {
    let allDates = [];
    let [yearStartingDate, monthStartingDate, dayStartingDate] = startingDate.split('-');
    let [yearEndDate, monthEndDate, dayEndDate] = endDate.split('-');

    allDates = allDates.concat(generateDatesMonth(yearStartingDate, monthStartingDate, parseInt(dayStartingDate)));

    let [nextMonth, nextYear] = getNextMonthAndYear(monthStartingDate, yearStartingDate);
    let monthsAndYearToGenerate = getMonthsAndYear(nextMonth, nextYear);
    let otherDates = monthsAndYearToGenerate.map(([month, year]) => {
        return generateDatesMonth(year, month, 1);
    });

    allDates = allDates.concat(_.flatten(otherDates));
    allDates = allDates.concat(generateDatesMonthUntil(yearEndDate, monthEndDate, parseInt(dayEndDate) - 1));

    return allDates;
}

let getNextMonthAndYear = (month, year) => {
    if (parseInt(month) === 12) {
        return ['01', (parseInt(year) + 1).toString()];
    } else {
        return [getIntValAsString((parseInt(month) + 1).toString()), year];
    }
}

let getMonthsAndYear = (startingMonth, startingYear) => {
    let i = 0;
    let res = [];
    let currentValMonth = parseInt(startingMonth);
    let currentValYear = parseInt(startingYear);

    while (i < 11) {
        res.push([getIntValAsString(currentValMonth.toString()), currentValYear.toString()]);
        if (parseInt(currentValMonth) + 1 > 12) {
            currentValMonth = '01';
            currentValYear = parseInt(currentValYear) + 1
        } else {
            currentValMonth = getIntValAsString((parseInt(currentValMonth) + 1).toString());
        }

        i++;
    }

    return res;
}

let getIntValAsString = (val) => {
    if (val.length === 1) {
        return '0' + val;
    } else {
        return val.toString();
    }
}

let generateDatesMonth = (_year, _month, fromDay) => {
    let res = [];
    const numDaysInMonths = {'01': 31, '02': 28, '03': 31, '04': 30, '05': 31, '06': 30,
                    '07': 31, '08': 31, '09': 30, '10': 31, '11': 30, '12': 31};

    let numDays = numDaysInMonths[_month];

    for (var i=fromDay; i<numDays+1; i++) {
        res.push(_year + '-' + _month + '-' + getIntValAsString(i.toString()));
    }

    return res;
}

let getDaysBackToClosestSunday = (firstDate) => {
    let res = [];
    let indexDayOfWeek = moment(firstDate).day();
    if (indexDayOfWeek > 0) {
        for (var i=indexDayOfWeek; i>=1; i--) {
            res.push([moment(firstDate).subtract(i, 'days').format('YYYY-MM-DD'), 0]);
        }
    }
    
    return res;
}

module.exports = {
    generateAllDates: generateAllDates,
    generateShortMonths: generateShortMonths,
    getDaysBackToClosestSunday: getDaysBackToClosestSunday,
}

if (process.env.NODE_ENV === 'test') {
    module.exports._private = {
        getNextMonthAndYear: getNextMonthAndYear,
        getMonthsAndYear: getMonthsAndYear,
        getMonths: getMonths,
        getIntValAsString: getIntValAsString,
        generateDatesMonth: generateDatesMonth
    }
}
