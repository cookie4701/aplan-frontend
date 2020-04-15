<template>
    <div :style="myStyle">
        <div class="row border border-info rounded mb-2 mt-2">
            <div class="col-sm">
            <div class="displayDate">
                <h3>Datum</h3>
                {{workdaydata.dateOfDay}}
            </div>
            <div class="dayStatus">
                <label for="dayStatus">Status</label>
                <select id="dayStatus" v-model="workdaydata.hollidayStatus.hollidayId" @change="saveOnLeaveInputAndInformParent" :disabled="workdaydata.inputblocked">
                    <option value="1">Normaler Arbeitstag</option>
                    <option value="2">Urlaub</option>
                    <option value="3">Feiertag</option>
                    <option value="4">Krankheit</option>
                    <option value="5">Sonstiges</option>
                </select>
            </div>
            <div class="fromto">
                <h3>Uhrzeiten</h3>
                <ul class="list-unstyled">
                    <li v-for="timepair in workdaydata.worktime" v-bind="workdaydata.worktime" v-bind:key="timepair.id">
                        <input :disabled="workdaydata.inputblocked" class="shortinput" type="text" v-model="timepair.from" @blur="saveOnLeaveInputAndInformParent"> -
                        <input :disabled="workdaydata.inputblocked" class="shortinput" type="text" v-model="timepair.to" @blur="saveOnLeaveInputAndInformParent">
                        <button :disabled="workdaydata.inputblocked" @click="removeTimePair(timepair.id)" class="btn btn-danger ml-1 mb-1 mt-1">-</button> </li>
                </ul>
                {{remainingTime}}
                <button :disabled="workdaydata.inputblocked" @click="addTimePair(workdaydata.id)" class="btn btn-secondary">+</button>
            </div>
            <div v-if="workdaydata.bonus.length > 0" class="bonustimesclass">
              <p>Zeitkorrektur(en) durch MM / GF</p>
              <ul class="list-unstyled">
                <li v-for="itm in workdaydata.bonus" v-bind:key="itm.id" >{{itm.description}} {{itm.minutes}} Minuten</li>
              </ul>
            </div>
            </div>

            <div class="col-sm">
            <div class="workareas form-group">
                <h3>Arbeitsbereiche</h3>
                <ul class="list-unstyled list-inline">

                    <li class="list-inline-item" v-for="workarea in workdaydata.workdone" v-bind="workdaydata.workdone" v-bind:key="workarea.id">

                        <input v-model="workarea.descriptive" class="description-workarea" disabled>
                        <input type="text" v-model="workarea.hours" class="shortinput" @blur="saveOnLeaveInput" :disabled="workdaydata.inputblocked" />

                    </li>
                </ul>
            </div>
            </div>

            <div class="description col-sm">
                <h3>Erläuterungen</h3>
                <textarea v-model="workdaydata.comment" class="text-sm-left" rows="10" @blur="saveOnLeaveInput" :disabled="workdaydata.inputblocked"></textarea>
            </div>

            <div class="col-sm">
                <h3>Fahrtenliste</h3>
                <ul class="list-unstyled">
                    <li v-for="drive in workdaydata.travel" v-bind:key="drive.id" class="mb-3" >
                        <input type="text" v-model="drive.kmFrom" class="cardestination mb-1" @blur="saveOnLeaveInput"> ->
                        <input type="text" v-model="drive.kmTo" class="cardestination mb-1" @blur="saveOnLeaveInput">:
                        <input type="text" v-model="drive.km" class="shortinput mb-1" @blur="saveOnLeaveInput">
                        <button @click="removeDrive(drive.id)" class="btn btn-danger ml-2">X</button>
                    </li>
                </ul>
                <button class="btn btn-secondary mr-2" @click="addDrive(workdaydata.id)">+</button>

            </div>

        </div>
    </div>
</template>

<script>
    import {timeToMinutes, minutesToTime} from "../helper";

    export default {
        name: "EnterWorkday",
        data() {
            return {
                myStyle:{
                    backgroundColor:"white"
                },
                inputStyle : {

                },
                remainingTime : ''
            }
        },
        props: ['workdaydata'],
        methods : {
            addDrive(workdayid) {
                this.$store.dispatch('createDrive', workdayid)
                    .then( () => {
                        this.$forceUpdate();
                        this.$emit('passMessage', 'Fahrt hinzugefügt');
                    })
            },
            removeDrive(driveId) {
                this.$store.dispatch('deleteDrive', driveId)
                    .then( () => {
                        this.$forceUpdate();
                        this.$emit('passMessage', 'Fahrt entfernt');
                    })
            },
            addTimePair(workdayid) {

                this.$store.dispatch('createTimePairToDayById', workdayid)
                    .then( () => {
                        this.$forceUpdate();
                        this.$emit('passMessage', 'Uhrzeit hinzugefügt');
                    })
            },
            removeTimePair(timePairId) {

                this.$store.dispatch('deleteTimePairById', timePairId)
                    .then( () => {
                        this.$forceUpdate();
                        this.$emit('passMessage', 'Uhrzeit entfernt');
                    })
            },
            saveOnLeaveInputAndInformParent() {
                this.saveOnLeaveInput();

                const payload = {
                    id : this.workdaydata.id,
                    worktime : this.workdaydata.worktime,
                    holliday : this.workdaydata.hollidayStatus.hollidayId
                };

                this.$emit('onUpdateTimes', payload);

                this.validateWorktimes();
            },
            saveOnLeaveInput() {
                this.$store.dispatch('updateWorkDay', this.workdaydata)
                    .then( () => {
                        const d = new Date().toLocaleString();
                        this.$emit('passMessage', `Speichern ok ( ${this.workdaydata.dateOfDay} ${d} )`  )
                    })
                    .then( () => {
                        this.validateWorktimes();
                    })
                    .catch( () => {
                    const d = new Date().toLocaleString();
                    this.$emit('passMessage', `Speichern NICHT ok ( ${this.workdaydata.dateOfDay} ${d} )`  )
                });
            },
            validateWorktimes() {
                let left = 0;
                let right = 0;

                for (let i=0; i < this.workdaydata.worktime.length; i++ ) {
                    left += timeToMinutes(this.workdaydata.worktime[i].to) - timeToMinutes(this.workdaydata.worktime[i].from);
                }

                for (let i = 0; i < this.workdaydata.workdone.length; i++) {
                    right += timeToMinutes( this.workdaydata.workdone[i].hours );
                }

                if ( right !== left ) {
                    this.myStyle = {
                        backgroundColor:"palevioletred"

                    };
                    this.remainingTime = minutesToTime(right - left);

                } else {
                    this.myStyle = {
                        backgroundColor:"white"

                    };
                    this.remainingTime = '';
                }
            }
        },
        watch : {
            workdaydata : {
                deep: true
            }
        },
        mounted() {
            this.validateWorktimes();
        }
    }
</script>

<style scoped>
.customWidth {
    /*
    width: calc(50% - 2em);

     */
}
    .description-workarea {
        width: 14ch;
    }
    .cardestination {
        width: 10ch;
    }

</style>
