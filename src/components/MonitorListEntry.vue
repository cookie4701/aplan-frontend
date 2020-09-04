<template>
    <div class="row">



            <div class="col-sm" v-bind:style="{ background: activeColor }">
                {{userinfo.displayname}}
            </div>
            <div class="col-sm" v-bind:style="{ background: activeColor }">
                <button @click="onBtnScheduleUser" class="btn btn-secondary mt-1 ml-1">Stundenpläne anpassen</button>
                <button @click="onBtnHollidaySetup" class="btn btn-secondary mt-1 ml-1">Urlaub festlegen</button>
                <button @click="onBtnVacationSetup" class="btn btn-secondary mt-1 ml-1">Feiertage festlegen</button>
                <button @click="onBtnDetailUser" class="btn btn-secondary mt-1 ml-1">Detail</button>
                <button @click="onBtnTimeChange" class="btn btn-secondary mt-1 ml-1">Zeitanpassung</button>
                <button @click="onBtnFreeze" class="btn btn-secondary mt-1 ml-1">Eingaben blockieren</button>
            </div>

            <div class="col-sm" v-if="!loading" v-bind:style="{ background: activeColor }">
                <img  v-if="hasError" src="../assets/static/redx.png" height="30" />
                <span v-if="!hasError">{{infotext}}</span>
            </div>


    </div>
</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";

    //import MonitorListEntryDay from "./MonitorListEntryDay";
    import {minutesToTime} from "../helper";

    export default {
        name: "MonitorListEntry",
        //components: {MonitorListEntryDay},
        props: ['userinfo', 'rowNumber', 'numberDays'],
        data: function () {
            return {
                startdate: '20',
                activeColor : '#FF0036',
                loading : true,
                workdays : [],
                currentStatus : [],
                hasError : false,
                days : [],
                infotext : ''
            }
        },
        mounted() {
            this.startdate = new Date();

            this.loadCurrentStatus()
            .then( () => {
                this.setColors();
                this.prepareDays();
            });
        },
        methods : {
            prepareDays() {
                let tempdate = this.startdate;
                for (let i = 1; i <= this.numberDays; i++ ) {
                    this.days.push(
                        {
                            singleuserid : this.userinfo.id,
                            qdate : tempdate
                        }
                    );

                    tempdate = new Date();
                    tempdate.setDate( tempdate.getDate()- i);

                }

            },
            setColors() {
                if ( this.rowNumber % 2 == 1) {
                    this.activeColor = 'lightgrey';
                } else {
                    this.activeColor = 'lightblue';
                }
            },
            onBtnHollidaySetup() {
              this.$router.push({name : 'hollidaysuser', params : { userId : this.userinfo.id } });
            },
            onBtnVacationSetup() {
              this.$router.push({name : 'vacationuser', params : { userId : this.userinfo.id } });
            },
            onBtnTimeChange() {
                this.$router.push({name : 'timemodification', params : { id : this.userinfo.id } });
            },
            onBtnDetailUser() {
                this.$router.push({
                    name : 'monitoruser',
                    params : { id : this.userinfo.id}
                })
            },
            onBtnFreeze() {
              this.$router.push({
                name : 'freezeinupt',
                params : { id : this.userinfo.id }
              });
            },
            onBtnScheduleUser() {
              this.$router.push({
                name : 'schedulesuser',
                params : { userId : this.userinfo.id }
              });
            },
            processData() {
                this.infotext = '';
                if ( this.currentStatus === undefined ) return;

                if (this.currentStatus.timeAccount !== undefined ){
                    const timeWork = minutesToTime(this.currentStatus.timeAccount);
                    this.infotext += `Aktueller Stand gestern: ${timeWork}`;
                }

                if ( this.currentStatus.remainHollidayBeforeDate !== undefined) {
                    this.infotext += ` Verb. Urlaub: ${this.currentStatus.remainHollidayBeforeDate}`
                }

                if ( this.currentStatus.remainVavationBeforeDate !== undefined) {
                    this.infotext += ` Verb. Feiertage: ${this.currentStatus.remainVavationBeforeDate}`
                }

            },
            loadCurrentStatus() {
                const param = {
                    qdate : this.startdate,
                    singleuserid : this.userinfo.id

                };

                return axios.post( apiHost + '/rest/moderation/users/current.php', param )
                    .then( data => data.data)
                    .then( (data) => {
                        this.currentStatus = data;
                        this.loading = false;

                    })
                    .then( () => {
                        this.processData();
                    })
                    .catch( () => {
                        this.hasError = true;
                        this.loading = false;
                        // eslint-disable-next-line no-console
                        console.log('ooops');
                    })
            }

        }
    }
</script>

<style scoped>

</style>
