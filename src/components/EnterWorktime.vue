<template>
    <div class="container-fluid">
        <div class="controlcomponent row">
            <button @click="week4Before" class="btn btn-primary ml-1 mr-1">4 Wochen zurück</button>
            <button @click="weekBefore" class="btn btn-primary ml-1 mr-1">Woche zurück</button>
            <!-- <button class="btn btn-primary">Export</button> -->
            <!-- Springe zu Woche: <select>
            <option>1...</option>
        </select> -->
            <button @click="weekAfter" class="btn btn-primary ml-1 mr-1">Woche vor</button>
            <button @click="weekAfter" class="btn btn-primary ml-1 mr-1">4 Wochen vor</button>
        </div>

        <div class="row">{{message}}</div>

        <div v-if="weekState === 'error'">
            Fehler beim Laden!
        </div>
        <div v-else-if="weekState !== 'success'">
            <img src="../assets/static/loading.gif" />

        </div>
        <div v-else>
            <EnterWorkday @passMessage="processMessage($event)" @onUpdateTimes="updateTimes($event)" v-for="workday in week" v-bind:key="workday.id" :workdaydata="workday"></EnterWorkday>

            <div class="totalweek">
                <div class="row">
                    <h3>Wochenzusammenfassung</h3>
                </div>

                <div class="row">
                    <div class="col-sm-10">Geleistete Stunden in der Woche</div>
                    <div class="col-sm-2">{{workTime}}</div>
                </div>

                <div class="row">
                    <div class="col-sm-10">Zu leistende Stunden in der Woche</div>
                    <div class="col-sm-2">{{workToDo}}</div>
                </div>

                <div class="row">
                    <div class="col-sm-10">Stand Ende letzte Woche</div>
                    <div class="col-sm-2">{{timeAccountBefore}}</div>
                </div>

                <div class="row">
                    <div class="col-sm-10">Neuer Stand</div>
                    <div class="col-sm-2">{{workResultNew}}</div>
                </div>

                <div class="row">
                    <div class="col-sm-4"> </div>
                    <div class="col-sm-4">Urlaub ({{hollidayPeriod}})</div>
                    <div class="col-sm-4">Feiertage ({{vacationPeriod}})</div>
                </div>

                <div class="row">
                    <div class="col-sm-4">Vor der Woche</div>
                    <div class="col-sm-4">{{hollidaysRemainBeforeWeek}}</div>
                    <div class="col-sm-4">{{vacationDaysRemainBeforeWeek}}</div>
                </div>

                <div class="row">
                    <div class="col-sm-4">Diese Woche genommen</div>
                    <div class="col-sm-4">{{hollidaysTakenThisWeek}} </div>
                    <div class="col-sm-4">{{vacationDaysTakenThisWeek}} </div>
                </div>

                <div class="row">
                    <div class="col-sm-4">Neuer Stand</div>
                    <div class="col-sm-4">{{hollidaysRemainThisWeek}} </div>
                    <div class="col-sm-4">{{vacationDaysRemainThisWeek}} </div>
                </div>



            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import EnterWorkday from "./EnterWorkday";
    import {
        calcMonday,
        convertIntegerToTimeString,
        convertTimeStringToInteger, minutesToTime,
        reaarrangeDateDbToBe,
        timeToMinutes
    } from "../helper";


    export default {
        name: "EnterWorktime",
        data() {
            return {
                workdaysLoading: false,
                messages: [],
                startDate : calcMonday,
                workTime : '00:00',
                hollidaysRemainBeforeWeek : 0,
                hollidaysTakenThisWeek : 0,
                hollidaysRemainThisWeek : 0,
                hollidayPeriod : '',
                vacationDaysRemainBeforeWeek : 0,
                vacationDaysTakenThisWeek : 0,
                vacationDaysRemainThisWeek : 0,
                vacationPeriod : '',
                workToDo : '00:00',
                workResultNew : '00:00',
                timeAccountBefore : '00:00'
            }
        },
        components: {EnterWorkday},
        mounted() {
            this.startDate = calcMonday();
            this.loadFromServer();

        },
        methods: {
            updateTimes(eventdata) {
              for (let i = 0; i < this.week.length; i++ ) {
                  if (eventdata.id === this.week[i].id) {

                      this.week[i].hollidayStatus.hollidayId = parseInt( eventdata.holliday, 10);

                      for (let m = 0; m < eventdata.worktime.length; m++) {

                          for (let p = 0; p < this.week[i].worktime.length; p++) {
                              if ( this.week[i].worktime[p].id === eventdata.worktime[m].id) {
                                  this.week[i].worktime[p].from = eventdata.worktime[m].from;
                                  this.week[i].worktime[p].to = eventdata.worktime[m].to;
                              }
                          }
                      }
                      i = this.week.length;
                  }
              }
              this.recalc();
            },
            totalTimeFx() {
                if (this.week === undefined) return '00:00';

                let timeComputed = 0;

                for (let i  = 0; i < this.week.length; i++) {

                    if (this.week[i].worktime !== undefined) {

                        for (let k = 0; k < this.week[i].worktime.length; k++) {
                            timeComputed += convertTimeStringToInteger(this.week[i].worktime[k].to);
                            timeComputed -= convertTimeStringToInteger(this.week[i].worktime[k].from);
                        }
                    }
                }

                timeComputed = convertIntegerToTimeString(timeComputed);
                this.workTime = timeComputed;
            },

            weekBefore() {
                this.startDate.setDate(this.startDate.getDate()-7);
                this.loadFromServer();
            },
            weekAfter() {
                this.startDate.setDate(this.startDate.getDate()+7);
                this.loadFromServer();
            },
            week4Before() {
                this.startDate.setDate(this.startDate.getDate()-28);
                this.loadFromServer();
            },
            week4After() {
                this.startDate.setDate(this.startDate.getDate()+28);
                this.loadFromServer();
            },
            loadFromServer() {
                this.workdaysLoading = true;
                const monday = this.startDate;
                let datestring = monday.getFullYear() + '-';
                if (monday.getMonth()+1 < 10) {
                    datestring +='0';
                }
                datestring += (monday.getMonth()+1) + '-';
                if (monday.getDate() < 10 ) {
                    datestring += '0';
                }
                datestring += monday.getDate();
                const data = {
                    startdate: datestring,
                    nbrDays: 7
                };

                var prom = this.$store.dispatch('fetchWeekData', data);

                prom.then(() => {
                    this.workdaysLoading = false;
                })
                    .then( () => {
                        this.processMessage('Alle Daten wurden geladen');
                    })
                    .then( () => {
                        this.recalc();
                    })

                    .catch( () => {
                        this.message = 'Fehler beim laden';
                    });

            },
            recalc: function() {
                this.hollidayPeriodFx();
                this.vacationPeriodFx();
                this.hollidaysRemainBeforeWeekFx();
                this.vacationDaysRemainBeforeWeekFx();
                this.calcOffDays();
                this.calcWorkToDo();
                this.timeAccountBeforeFx();
                this.calcWorkDone();
                this.calcNewResult();
            },

            processMessage(event) {
                this.messages.push( `${event}` );
                while (this.messages.length > 3) {
                    this.messages.splice(0,1);
                }

            },
            hollidaysRemainBeforeWeekFx: function() {
                if (this.week == undefined) {
                    return 0;
                }

                this.hollidaysRemainBeforeWeek = this.week[0].remainHollidayBeforeDate;
            },
            vacationPeriodFx: function() {
                if (this.week === undefined) {
                    this.vacationPeriod = "Keine Feiertagsperiode definiert!";
                    return;
                }

                this.vacationPeriod = reaarrangeDateDbToBe(this.week[0].vacationPeriod.vacationStart) +
                    '-' +
                    reaarrangeDateDbToBe(this.week[0].vacationPeriod.vacationEnd);
            },
            hollidayPeriodFx: function() {
                if (this.week === undefined) {
                    this.hollidayPeriod = "Keine Urlaubsperiode definiert!";
                    return;
                }

                this.hollidayPeriod = reaarrangeDateDbToBe(this.week[0].hollidayPeriod.hollidayStart) +
                    '-' +
                    reaarrangeDateDbToBe(this.week[0].hollidayPeriod.hollidayEnd);
            },
            vacationDaysRemainBeforeWeekFx: function() {
                if (this.week === undefined ) {
                    this.vacationDaysRemainBeforeWeek = 'Keine Feiertage eingetragen';
                    return;
                }

                this.vacationDaysRemainBeforeWeek = this.week[0].remainVavationBeforeDate;
            },

            calcOffDays: function() {
                this.hollidaysTakenThisWeek = 0;
                this.vacationDaysTakenThisWeek = 0;

                for (let i = 0; i < this.week.length; i++) {
                    if ( this.week[i].hollidayStatus.hollidayId == 2) {
                        this.hollidaysTakenThisWeek += 1;
                    }

                    if ( this.week[i].hollidayStatus.hollidayId == 3) {
                        this.vacationDaysTakenThisWeek += 1;
                    }
                }

                this.hollidaysRemainThisWeek = this.hollidaysRemainBeforeWeek - this.hollidaysTakenThisWeek;
                this.vacationDaysRemainThisWeek = this.vacationDaysRemainBeforeWeek - this.vacationDaysTakenThisWeek;
            },
            calcWorkToDo: function () {
                let weekTimeCalc = 0;

                for (let i=0; i < this.week.length; i++) {

                    let dayTime = 0;

                    if (this.week[i].hollidayStatus.hollidayId === 1) {
                        for (let k = 0; k < this.week[i].schedule.length; k++) {
                            dayTime += timeToMinutes( this.week[i].schedule[k].timeTo );
                            dayTime -= timeToMinutes( this.week[i].schedule[k].timeFrom );
                        }
                    }

                    weekTimeCalc += dayTime;

                }

                this.workToDo = minutesToTime(weekTimeCalc);

            },
            calcWorkDone: function() {
              let calcTimeDone = 0;
              for (let i = 0; i < this.week.length; i++ ) {
                  for (let k = 0; k < this.week[i].worktime.length; k++) {
                      calcTimeDone += timeToMinutes(this.week[i].worktime[k].to) - timeToMinutes(this.week[i].worktime[k].from) ;
                  }
              }

              this.workTime = minutesToTime(calcTimeDone);

            },
            calcNewResult: function() {
                let old = timeToMinutes(this.timeAccountBefore);
                let todo = timeToMinutes(this.workToDo);
                let done = timeToMinutes(this.workTime);
                let result = old + done - todo;
                this.workResultNew = minutesToTime(result);
            },
            timeAccountBeforeFx: function() {
                if ( this.week === undefined) return '00:00';

                this.timeAccountBefore = convertIntegerToTimeString(this.week[0].timeAccount);
            }

        },

        computed: {
            ...mapState({
                week: state => state.weekdata.weekdata,
                weekState: state => state.weekdata.statusWeekData,
                timePairState: state => state.weekdata.statusCreateTimePair
            }),
            message : function() {
                return this.messages.join(' / ');
            },
            totalTime: function() {

                if (this.week === undefined) return '00:00';

                let timeComputed = 0;

                for (let i  = 0; i < this.week.length; i++) {

                    if (this.week[i].worktime !== undefined) {

                        for (let k = 0; k < this.week[i].worktime.length; k++) {
                            timeComputed += convertTimeStringToInteger(this.week[i].worktime[k].to);
                            timeComputed -= convertTimeStringToInteger(this.week[i].worktime[k].from);
                        }
                    }
                }

                timeComputed = convertIntegerToTimeString(timeComputed);
                return timeComputed;
            }



        },
        watch: {

            week: {
                deep: true,
                immediate: true,
                handler: {}
            },


        }

    }

</script>
<style scoped>

</style>