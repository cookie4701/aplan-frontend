<template>
    <div class="container-fluid">


        <div class="row" v-bind:style="{ background: activeColor }" >
            <div class="col-sm-1">
                {{userinfo.displayname}}
            </div>
            <div class="col-sm-2">
                <button @click="onBtnDetailUser">Detail</button>
                <button @click="onBtnTimeChange">Zeitanpassung</button>
            </div>

            <div class="col-sm-9" v-if="!loading">
                <img  v-if="hasError" src="../assets/static/redx.png" height="30" />
                <span v-if="!hasError">{{infotext}}</span>
            </div>






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
                activeColor : 'lightgreen',
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
            onBtnTimeChange() {
                this.$router.push({name : 'timemodification', params : { id : this.userinfo.id } });
            },
            onBtnDetailUser() {
                this.$router.push({
                    name : 'monitoruser',
                    params : { id : this.userinfo.id}
                })
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
