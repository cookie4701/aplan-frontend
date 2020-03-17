<template>
    <div id="UserSetup">
        <div>{{errorMsg}}</div>

        <h3>Allgemeine Daten</h3>

        <label for="username">Benutzername:</label>
        <input type="text" id="username" v-model="userinfo.username">

        <label for="startdate">Start Berechnungszeitraum</label>
        <input type="text" id="startdate" v-model="userinfo.startdate">

        <label for="overhoursbefore">Überstunden Übertrag vom letzten Berechnungszeitraum</label>
        <input type="text" id="overhoursbefore" v-model="userinfo.overhoursbefore">

        <h3>Arbeitszeiten</h3>

        <label for="newSchedule">Neuen Zeitraum anlegen</label>
        <input type="text" id="newSchedule" v-model="scheduleNew.schedulename">

        <label for="newScheduleStart">Beginn</label>
        <input type="text" id="newScheduleStart" v-model="scheduleNew.scheduleStart">

        <label for="newScheduleEnd">Ende</label>
        <input type="text" id="newScheduleEnd" v-model="scheduleNew.scheduleEnd">

        <button @click="doSaveScheduleEntry">Eintragen</button>

        <div id="worktimesListe">
            <ul>
                <li v-for="listItem in scheduleListItems" v-bind:key="listItem.idSchedule">
                    <button @click="setActiveEditScheduleListItem(listItem)">Bearbeiten</button>
                    <div v-if="isActiveEditScheduleListItem===listItem.idSchedule">
                        <input type="text" v-model="editSchedulesListItem.label" v-on:keydown.tab="updateListeItem()" />
                        <input type="text" v-model="editSchedulesListItem.startdate" v-on:keydown.tab="updateListeItem()"/>
                        <input type="text" v-model="editSchedulesListItem.enddate" v-on:keydown.tab="updateListeItem()">

                        <h4>Tage</h4>

                        <div v-for="itm in scheduleItems" v-bind:key="itm.idSchedule">
                            {{itm.dayname}} : {{itm.time_from}} - {{itm.time_to}} <button @click="removeScheduleItem(itm.idScheduleItem)">X</button>
                        </div>

                        <div>
                            Geplante Arbeitszeit: {{timeDay}}
                        </div>

                        <select type="text" v-model="selectedDay" >
                            <option v-for="day in daynames" :value="day.value" v-bind:key="day.value" >
                                {{ day.name }}
                            </option>
                        </select>

                        <input type="text" v-model="newScheduleItem.time_from" />
                        <input type="text" v-model="newScheduleItem.time_to">
                        <button @click="saveNewScheduleItem()">+</button>

                        <div><button @click="unsetActiveEditSchedule()">Schliessen</button> </div>

                    </div>
                    <div v-else>{{listItem.label}}: {{listItem.startdate}} - {{listItem.enddate}}</div>
                </li>
            </ul>
        </div>

        <h3>Fahrtkostenentschädigunen</h3>

        <div>
            <ul>
                <li v-for="compensation in driveCompensations" v-bind:key="compensation.idDrive">
                    {{compensation.startdate}} - {{compensation.enddate}} : {{compensation.val}}
                    <button @click="deleteDriveCompensation(compensation)">X</button>
                </li>
            </ul>
        </div>

        <div>

            <h4>Neuen Datensatz erzeugen</h4>
            Datum ab: <input type="text" v-model="driveCompensationNew.startdate" />
            Datum bis: <input type="text" v-model="driveCompensationNew.enddate" />
            Entschädigung in Euro (0,1234 bspw.): <input type="text" v-model="driveCompensationNew.val" />
            <button @click="createDriveCompensation()">Hinzufügen</button>
        </div>



        <h3>Urlaubsansprüche</h3>

        <ul>
            <li v-for="holliday in hollidaysetup" v-bind:key="holliday.idHolliday">
                {{holliday.startdate}} - {{holliday.enddate}}: {{holliday.nbrdays}} <button @click="deleteHollidaySetup(holliday.idHolliday)">X</button>
            </li>
        </ul>

        <div>
            <label for="hollidaynewstartdate">Startdatum</label>
            <input type="text" id="hollidaynewstartdate" v-model="hollidaynew.startdate" />

            <label for="hollidaynewenddate">Enddatum</label>
            <input type="text" id="hollidaynewenddate" v-model="hollidaynew.enddate" />

            <label for="hollidaynewnbr">Anzahl Tage</label>
            <input type="text" id="hollidaynewnbr" v-model="hollidaynew.nbrdays" />

            <button @click="createHollidaySetup(hollidaynew)">+</button>
        </div>

        <h3>Feiertagsansprüche</h3>

        <ul>
            <li v-for="vacation in vacationsetup" v-bind:key="vacation.idVacation">
                {{vacation.startdate}} - {{vacation.enddate}}: {{vacation.nbrdays}} <button @click="deleteVacationSetup(vacation.idVacation)">X</button>
            </li>
        </ul>

        <div>
            <label for="vacationnewstartdate">Startdatum</label>
            <input type="text" id="vacationnewstartdate" v-model="vacationdaysnew.startdate" />

            <label for="vacationnewenddate">Enddatum</label>
            <input type="text" id="vacationnewenddate" v-model="vacationdaysnew.enddate" />

            <label for="vacationnewnbrdays">Anzahl Tage</label>
            <input type="text" id="vacationnewnbrdays" v-model="vacationdaysnew.nbrdays" />

            <button @click="createVacationSetup(vacationdaysnew)">+</button>
        </div>

        <h3>Arbeitsbereiche</h3>

        <table id="tblWorkareas">
            <tr>
                <td>Kurzbeschreibung</td>
                <td>Erklärung (falls nötig)</td>
                <td>Ziel in Arbeitsstunden (auf das Jahr)</td>
            </tr>

            <tr v-for="workarea in workareas" v-bind:key="workarea.idWorkarea">
                <td><input type="text" v-model="workarea.description" @blur="saveWorkareas()"></td>
                <td><input type="text" v-model="workarea.explanation" @blur="saveWorkareas()"></td>
                <td><input type="text" v-model="workarea.timecapital" @blur="saveWorkareas()"></td>
            </tr>
        </table>

        <button @click="addWorkarea">Bereich hinzufügen</button>


    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {minutesToTime, reaarrangeDateDbToBe, timeToMinutes} from "../helper";

    export default {
        data : function() {
            return {
                isActiveEditScheduleListItem : null,
                newScheduleItem : {
                    day : 0,
                    time_from : '00:00',
                    time_to : '00:00',
                    idSchedule : 0
                },
                editSchedulesListItem: {
                    idSchedule : 0,
                    startdate : '',
                    enddate : '',
                    label : ''
                },
                daynames : [{ name :'Montag', value : 0},
                        {name : 'Dienstag', value : 1},
                    { name : 'Mittwoch', value : 2 },
                    {name : 'Donnerstag', value :3 },
                    {name: 'Freitag', value : 4 },
                    {name : 'Samstag', value : 5 },
                    {name: 'Sonntag', value : 6 }],
                selectedDay : 0,
                errorMsg: '',
                driveCompensationNew : {
                    startdate : '',
                    enddate : '',
                    val : ''
                },
                hollidaynew : {
                    startdate : '',
                    enddate : '',
                    nbrdays : 0
                },
                vacationdaysnew : {
                    startdate : '',
                    enddate : '',
                    nbrdays : 0
                }
            }
        },
        methods : {
            unsetActiveEditSchedule() {
              this.isActiveEditScheduleListItem = -1;
              this.refreshView();
            },
            async doSaveScheduleEntry() {
                try {
                    await this.$store.dispatch('scheduleDataNewToServer', this.scheduleNew);
                    await this.refreshView();
                } catch (e) {
                    this.errorMsg = e.toString();
                }

            },
            setActiveEditScheduleListItem(itm) {
                this.isActiveEditScheduleListItem = itm.idSchedule;
                this.loadScheduleItems(itm.idSchedule);
                this.editSchedulesListItem = itm;

            },
            async loadScheduleItems(idSchedule) {
                try {
                    await this.$store.dispatch('scheduleItemsFetchFromServer', idSchedule);
                } catch  (e) {
                    this.errorMsg = e.toString();
                }

            },
            async updateListeItem() {
                try {
                    await this.$store.dispatch('scheduleDataUpdateToServer', this.editSchedulesListItem );
                    this.editSchedulesListItem.startdate = reaarrangeDateDbToBe(this.editSchedulesListItem.startdate);
                    this.editSchedulesListItem.enddate = reaarrangeDateDbToBe(this.editSchedulesListItem.enddate);
                } catch (e) {
                    this.errorMsg = e.toString();
                }

            },

            async saveNewScheduleItem() {
                try {
                    this.newScheduleItem.day = this.selectedDay;
                    this.newScheduleItem.idSchedule = this.isActiveEditScheduleListItem;
                    await this.$store.dispatch('scheduleItemsToServer', this.newScheduleItem);
                    await this.refreshView();
                } catch (e) {
                    this.errorMsg = e.toString();
                }

            },
            async removeScheduleItem(id) {
                try {
                    await  this.$store.dispatch('scheduleItemDeleteFromServer', id);
                    await this.refreshView();
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },
            async refreshView() {
                await this.$store.dispatch('scheduleDataFromServer');
                this.newScheduleItem.time_to = '00:00';
                this.newScheduleItem.time_from = '00:00';

                if ( this.isActiveEditScheduleListItem > 0 ) {
                    await this.$store.dispatch('scheduleItemsFetchFromServer', this.isActiveEditScheduleListItem)
                }

                await this.$store.dispatch('fetchDriveCompensation');

                await this.$store.dispatch('fetchHollidays');
                await this.$store.dispatch('fetchVacations');

                await this.$store.dispatch('workareasFetch');
            },
            // drive recompensation
            async createDriveCompensation() {
                try {
                    await this.$store.dispatch('insertDriveCompensation', this.driveCompensationNew);
                    await this.refreshView();
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.log(e);
                }

            },

            async deleteDriveCompensation(itm) {
                try {
                    await this.$store.dispatch('deleteDriveCompensation', itm);
                    await this.refreshView();
                } catch(e) {
                    this.errorMsg = e.toString();
                }


            },

            async fetchHollidaySetup() {
                try {
                    await this.$store.dispatch('fetchHollidays');
                } catch(e) {
                    this.errorMsg = e.toString();
                }
            },

            async createHollidaySetup(holliday) {
                try {
                    await this.$store.dispatch('createHollidays', holliday);
                    this.refreshView();
                    this.hollidaynew.startdate = '';
                    this.hollidaynew.enddate = '';
                    this.hollidaynew.nbrdays = '';
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },

            async deleteHollidaySetup(hollidayid) {
                try {
                    await this.$store.dispatch('deleteHollidays', hollidayid)
                    this.refreshView();
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },

            async fetchVacationSetup() {
                try {
                    await this.$store.dispatch('fetchVacations');
                } catch(e) {
                    this.errorMsg = e.toString();
                }
            },

            async createVacationSetup(vacation) {
                try {
                    await this.$store.dispatch('createVacations', vacation);
                    this.refreshView();
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },

            async deleteVacationSetup(vacationid) {
                try {
                    await this.$store.dispatch('deleteVacations', vacationid)
                    this.refreshView();
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },
            async updateWorkareas(data) {
                try {
                    this.$store.dispatch('workareasUpdate', data)
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },
            async createWorkarea(data) {
                try {
                    this.$store.dispatch('workareasCreate', data)
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },
            async deleteWorkarea(id) {
                try {
                    this.$store.dispatch('workareaDelete', id)
                } catch (e) {
                    this.errorMsg = e.toString();
                }
            },
            async saveWorkareas() {
                await this.$store.dispatch('workareasUpdate', this.workareas);
            },

            async addWorkarea() {
                let nextval = this.highestWorkareaRank + 1;
                let wa = {
                    rank : nextval,
                    description : '',
                    explanation : '',
                    timecapital : ''
                }

                await this.$store.dispatch('workareasCreate', wa);
            }
        },
        async mounted () {
            try {
                await this.$store.dispatch('userdataFromServer');
                await this.$store.dispatch('scheduleDataFromServer');
                await this.$store.dispatch('fetchDriveCompensation');
                await this.$store.dispatch('fetchHollidays');
                await this.$store.dispatch('fetchVacations');
                await this.$store.dispatch('workareasFetch');
            } catch (e) {
                this.errorMsg = e.toString();
            }

        },
        computed:
            {
                ...mapState({
                    userinfo : state  => state.userinfo.userinfo,
                    scheduleListItems : state => state.schedule_list.scheduleListItems ,
                    scheduleNew : state => state.schedule_list.scheduleNew,
                    scheduleItems : state => state.schedule_items.scheduleItems,
                    driveCompensations : state => state.drive_compensation.driveCompensations,
                    hollidaysetup : state => state.hollidaysetup.hollidayUser,
                    vacationsetup : state => state.vacationsetup.VacationUser,
                    workareas : state => state.workareas.workareas
                }),

                timeDay : function() {
                    let timePlanned = 0;
                    for (let i=0; i < this.scheduleItems.length; i++) {
                        const sTime = timeToMinutes( this.scheduleItems[i].time_from );
                        const eTime = timeToMinutes( this.scheduleItems[i].time_to );
                        timePlanned += eTime;
                        timePlanned -= sTime;
                    }

                    return minutesToTime(timePlanned);
                },

                highestWorkareaRank: function() {
                    let v = 0;
                    for (let i = 0; i < this.workareas.length; i++) {
                        if ( v < Number(this.workareas[i].rank) ) {
                            v = Number(this.workareas[i].rank);
                        }
                    }

                    return v;
                }
            },

        name: "UserSetup"
    }
</script>

<style scoped>

</style>