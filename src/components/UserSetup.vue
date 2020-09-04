<template>
    <div id="UserSetup" class="container-fluid">
        <div class="row">{{errorMsg}}</div>

        <div class="row bg-info customtitle">Allgemeine Daten (Vorgabe; nicht veränderbar)</div>

        <div class="row">
          <div class="col-sm-6">
            <label for="username">Benutzername:</label>
          </div>
          <div class="col-sm-6">
            <input type="text" id="username" v-model="userinfo.username" disabled>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-6">
            <label for="startdate">Start Berechnungszeitraum</label>
          </div>
          <div class="col-sm-6">
            <input type="text" id="startdate" v-model="userinfo.startdate" disabled>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-6">
            <label for="overhoursbefore">Überstunden Übertrag vom letzten Berechnungszeitraum</label>
          </div>
          <div class="col-sm-6">
            <input type="text" id="overhoursbefore" v-model="userinfo.overhoursbefore" disabled>
          </div>
        </div>


        <div class="row bg-info customtitle">Stundenpläne anzeigen</div>

        <div id="worktimesListe">
            <ul class="list-unstyled">
                <li v-for="listItem in scheduleListItems" v-bind:key="listItem.idSchedule" class="mt-2 mb-2 ml-2">
                    <div class="row">
                      <div class="col-sm-2">
                    <button @click="setActiveEditScheduleListItem(listItem)" class="btn btn-primary">Details</button>
                  </div>
                  <div class="col-sm-10">
                    <div class="d-inline" v-if="isActiveEditScheduleListItem===listItem.idSchedule">
                        <input type="text" v-model="editSchedulesListItem.label" disabled />
                        <input type="text" v-model="editSchedulesListItem.startdate" disabled/>
                        <input type="text" v-model="editSchedulesListItem.enddate" disabled>

                        <h4>Tage</h4>

                        <div v-for="itm in scheduleItems" v-bind:key="itm.idSchedule">
                            {{itm.dayname}} : {{itm.time_from}} - {{itm.time_to}}
                        </div>

                        <div class="d-inline">
                            Geplante Arbeitszeit: {{timeDay}}
                        </div>

                        <div class="d-inline"><button @click="unsetActiveEditSchedule()">Schliessen</button> </div>

                    </div>
                    <div class="d-inline" v-else>{{listItem.label}}: {{listItem.startdate}} - {{listItem.enddate}}</div>
                  </div>
                </div>
                </li>

            </ul>
        </div>

        <div class="row customtitle bg-info">Fahrtkostenentschädigunen (Auflistung)</div>

        <div>
            <ul class="list-unstyled">
                <li v-for="compensation in driveCompensations" v-bind:key="compensation.idDrive">
                    <div class="row">
                      <div class="col-sm-1">{{compensation.startdate}}</div>
                      <div class="col-sm-1">{{compensation.enddate}}</div>
                      <div class="col-sm-1">{{compensation.val}}</div>

                    </div>
                </li>
            </ul>
        </div>

        <div class="row customtitle bg-info">Urlaubsansprüche (Auflistung)</div>

        <ul class="list-unstyled">
            <li v-for="holliday in hollidaysetup" v-bind:key="holliday.idHolliday">
              <div class="row">
                <div class="col-sm-1">{{holliday.startdate}}</div>
                <div class="col-sm-1">{{holliday.enddate}}</div>
                <div class="col-sm-1">{{holliday.nbrdays}} Tage</div>
                <div class="col-sm-1">{{holliday.nbrminutes}} Minuten</div>

              </div>
            </li>
        </ul>



        <div class="row customtitle bg-info">Feiertagsansprüche (Auflistung)</div>

        <ul class="list-unstyled">
            <li v-for="vacation in vacationsetup" v-bind:key="vacation.idVacation">
              <div class="row">
                <div class="col-sm">{{vacation.startdate}}</div>
                <div class="col-sm">{{vacation.enddate}}</div>
                <div class="col-sm">{{vacation.nbrdays}} Tage</div>
                <div class="col-sm">{{vacation.nbrminutes}} Minuten </div>
              </div>
            </li>
        </ul>


        <div class="row customtitle bg-info">Arbeitsbereiche</div>

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

        <button @click="addWorkarea" class="btn btn-secondary">Bereich hinzufügen</button>


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
.customtitle {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
