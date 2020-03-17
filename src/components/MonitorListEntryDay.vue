<template>
    <span>
        <span v-if="!loadCompleted">
            <img src="../assets/static/loading.gif" height="30" />
        </span>

        <span v-if="loadCompleted && hasError">
            <img src="../assets/static/redx.png" height="30" />
        </span>
        <span v-if="loadCompleted && !hasError">
            {{formattedDate}} ({{holliday}} / {{dayResult}})
        </span>

    </span>
</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";
    import {minutesToTime, timeToMinutes} from "../helper";

    export default {
        name: "MonitorListEntryDay",
        props : ['daydata'],
        data : function () {
            return {
                loadedData : [],
                loadCompleted : false,
                hasError : false,
                formattedDate : '',
                holliday : '',
                dayResult : ''
            }
        },
        mounted() {
            this.loadDayDataFromServer();
        },
        methods : {
            loadDayDataFromServer() {

                axios.post( apiHost + '/rest/moderation/users/single.php', this.daydata )
                    .then( data => data.data)
                    .then( (data) => {
                        this.loadedData = data;
                        this.loadCompleted = true;
                        const month = parseInt(this.daydata.qdate.getMonth(),10) + 1 ;
                        this.formattedDate = this.daydata.qdate.getDate() + '.' +
                            month + '.' +
                            this.daydata.qdate.getFullYear();
                    })
                    .then( () => {
                        this.processData();
                    })
                    .catch( (err) => {
                        this.messages = err;
                        this.hasError = true;
                        this.loadCompleted = true;
                    })
            },
            processData() {
                if ( this.loadedData !== undefined && this.loadedData.hollidayStatus !== undefined) {


                    if (this.loadedData.hollidayStatus.hollidayId === 1) {
                        this.holliday = 'Norm.';
                    } else if (this.loadedData.hollidayStatus.hollidayId === 2) {
                        this.holliday = 'Urlaub';
                    } else if (this.loadedData.hollidayStatus.hollidayId === 3) {
                        this.holliday = "Feier. " + this.loadedData.hollidayStatus.hollidayText;
                    } else if (this.loadedData.hollidayStatus.hollidayId === 4) {
                        this.holliday = "Krank.";
                    } else {
                        this.holliday = "Sonst.";
                    }
                }

                let resultTime = 0;
                let timeToDo = 0;

                if ( this.loadedData !== undefined && this.loadedData.worktime) {

                    for (let i = 0; i < this.loadedData.worktime.length; i++) {
                        resultTime += timeToMinutes( this.loadedData.worktime[i].to );
                        resultTime -= timeToMinutes( this.loadedData.worktime[i].from);
                    }

                    this.dayResult = minutesToTime(resultTime);

                    if (this.loadedData.schedule !== undefined && this.loadedData.hollidayStatus !== undefined &&
                        this.loadedData.hollidayStatus.hollidayId === 1) {
                        for (let k = 0; k < this.loadedData.schedule.length; k++) {
                            timeToDo += timeToMinutes( this.loadedData.schedule[k].timeTo);
                            timeToDo -= timeToMinutes( this.loadedData.schedule[k].timeFrom);
                        }
                    }
                }

                resultTime = resultTime - timeToDo;

                this.dayResult = minutesToTime(resultTime);


            }
        }
    }
</script>

<style scoped>

</style>