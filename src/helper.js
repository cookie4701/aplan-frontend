export function rearrangeDateBeToDb(datevar) {
    let arrDate = datevar.split(".");
    if (arrDate.length != 3) {
        return "2010-07-01";
    }

    let retString = arrDate[2] + '-';
    if (arrDate[1].length < 2) {
        retString += '0';
    }
    retString += arrDate[1] + '-';
    if (arrDate[0].length < 2) {
        retString += '0';
    }
    retString += arrDate[0];
    return retString;
}

export function reaarrangeDateDbToBe(datevar) {
    let arrDate = datevar.split('-');

    if ( arrDate.length != 3 ) {
        return '01.01.2010';
    }

    return arrDate[2] + '.' + arrDate[1] + '.'+  arrDate[0];
}

export function convertStringToDate(datevar) {
    let arrDate = datevar.split('-');

    if ( arrDate.length != 3 ) {
        return new Date();
    }

    return new Date(arrDate[0], arrDate[1]-1, arrDate[2],0,0,0,0);
}

export function convertTimeStringToInteger(timevalString) {
    let arrTime = timevalString.split(':');

    let timeResult = 0;
    timeResult += parseInt( arrTime[0] , 10) * 60;
	if (timeResult < 0 ) {
		timeResult -= parseInt( arrTime[1] ,10 );
	} else {
		timeResult += parseInt( arrTime[1] ,10 );
	}

    return timeResult;
}

export function convertIntegerToTimeString(timevalInteger) {
    let sign = '';
    if (timevalInteger == 0) {
        return "00:00";
    } else if ( timevalInteger < 0) {
        sign = '-';
        timevalInteger *= -1;
    }

        const h = parseInt( timevalInteger / 60, 10);
        const m = timevalInteger - 60*h;

        if ( m < 10) {
            return sign + h +':0' + m;
        } else {
            return sign + h + ':' + m;

    }

}

export function initializeStateWorkWeek() {
    let week = [];

    for (let i = 0; i < 7; i++) {
        const day = {
            "dateOfDay":"2010-01-01",
            "worktime": [
                {
                    "id":-1,
                    "from":"00:00",
                    "to":"16:45"
                },
            ],
            "id":-i,
            "workdone":
                [
                    {"hours":"00:00","rank":0,"descriptive":""}
                ],
            "comment": "",
            "hollidayStatus":{"id":-1,"hollidayId":1,"hollidayText":""},
            "travel" : [],
            "timeAccount" : 0,
            "remainVavationBeforeDate" : 0,
            "remainHollidayBeforeDate" : 0,
            "hollidayPeriod" : {
                "hollidayStart" : "2010-01-01",
                "hollidayEnd" : "2010-01-01"
            },
            "vacationPeriod" : {
                "vacationStart" : "2010-01-01",
                "vacationEnd" : "2010-01-01"
            }
        }

        week.push(day);
    }

    const state = {
        statusWeekData: 'none',
        weekdata : week,
        statusCreateTimePair : 'none',
        statusDeleteTimePair : 'none',
        statusCreateDrive : 'none',
        statusDeleteDrive : 'none',
        statusUpdateDrive : 'none',
        statusUpdateWorkday : 'none'
    }

    return state;
}

export function calcMonday() {
    let today = new Date();
    const myWeekDay = today.getDay();
    if ( myWeekDay == 1) {
        return today;
    }

    if ( myWeekDay == 0) {
        today.setDate( today.getDate() - 1);
        return today;
    }

    today.setDate(today.getDate() - myWeekDay + 1);
    return today;
}

export function getStringDayOfWeek(nbr) {
    if (nbr === 0) {
        return "Montag";
    } else if (nbr === 1) {
        return "Dienstag";
    } else if ( nbr === 2 ) {
        return "Mittwoch";
    } else if ( nbr === 3 ) {
        return "Donnerstag";
    } else if ( nbr === 4 ) {
        return "Freitag";
    } else if ( nbr === 5 ) {
        return "Samstag";
    } else if ( nbr === 6 ) {
        return "Sonntag";
    } else {
        return "...";
    }
}

export function timeToMinutes(timeval) {
    let arr = timeval.split(':');

    if ( arr.length != 2 ) return 0;

    let minutes = parseInt( arr[0], 10) * 60;
    if (minutes >= 0) {
        minutes += parseInt(arr[1], 10);
    } else {
        minutes -= parseInt(arr[1], 10);
    }


    return minutes;
}

export function minutesToTime(minutes) {
    let sign = '';

    if (minutes < 0 ) {
        sign = '-';
        minutes *= -1;
    }
    const h = parseInt(minutes / 60, 10);
    let m = parseInt(minutes, 10) - h*60;

    if (h < 10) {
        if (m<10) {
            return sign + '0' + h + ':0' + m;
        } else {
            return sign + '0' + h + ':' + m;
        }
    } else {
        if (m<10) {
            return sign  + ''+ h + ':0' + m;
        } else {
            return sign + '' + h + ':' + m;
        }
    }

}
