<template>
	<div :style="myStyle">
		<div class="row border border-info rounded mb-2 mt-2">
			<div class="col-sm">
				<div class="displayDate">
					<h3>Datum</h3>
                	{{nameWeekday}} - {{workdaydata.dateOfDay}}
				</div>
			</div>
		</div>
		<div class="dayStatus">
                <label for="dayStatus">Status</label>
                <select id="dayStatus" v-model="workdaydata.hollidayStatus.hollidayId" @change="saveOnLeaveInputAndInformParent" :disabled="workdaydata.inputblocked">
                    <option value="1">Normaler Arbeitstag</option>
                    <option value="2">Urlaub (Ganzer Tag)</option>
                    <option value="6">Urlaub (Stunden) </option>
                    <option value="3">Feiertag (Ganzertag)</option>
                    <option value="7">Feiertag (Stunden) </option>
                    <option value="4">Krankheit</option>
                    <option value="5">Sonstiges</option>

                </select>
			<div v-if="workdaydata.hollidayStatus.hollidayId == 6 || workdaydata.hollidayStatus.hollidayId == 7">
			<label for="hoursTaken">Zeit genommen (H:MM)</label>
			<input id="hoursTaken" type="text" class="shortinput" :disabled="workdaydata.inputblocked" v-model="workdaydata.hoursTaken" @blur="saveOnLeaveInputAndInformParent">
			</div>
        </div>

		<div class="fromto">
                <h3>Uhrzeiten</h3>
                <ul class="list-unstyled" v-if="workdaydata.wirktime !== undefined">
                    <li v-for="timepair in workdaydata.worktime" v-bind="workdaydata.worktime" v-bind:key="timepair.id">
                        <input :disabled="workdaydata.inputblocked" class="shortinput" type="text" v-model="timepair.from" @blur="saveOnLeaveInputAndInformParent"> -
                        <input :disabled="workdaydata.inputblocked" class="shortinput" type="text" v-model="timepair.to" @blur="saveOnLeaveInputAndInformParent">
                        <button :disabled="workdaydata.inputblocked" @click="removeTimePair(timepair.id)" class="btn btn-danger ml-1 mb-1 mt-1">-</button> </li>
                </ul>
                {{remainingTime}}
                <button :disabled="workdaydata.inputblocked" @click="addTimePair(workdaydata.id)" class="btn btn-secondary">+</button>
            </div>
            <div v-if="workdaydata.bonus !== undefined && workdaydata.bonus.length > 0" class="bonustimesclass">
              <p>Zeitkorrektur(en) durch MM / GF</p>
              <ul class="list-unstyled">
                <li v-for="itm in workdaydata.bonus" v-bind:key="itm.id" >{{itm.description}} {{itm.minutes}} Minuten</li>
              </ul>
            </div>

		{{workdaydata.id}}

	</div>
</template>

<script setup>

import {
	timeToMinutes,
	minutesToTime,
	getDaynameFromDate
	} from "../helper";
</script>

<script>
export default {
	name: "EnterWorkday",
	emits: [ 'passMessage', 'onUpdateTimes' ],
	data() {
		return {
			myStyle : { backgroundColor: "white" },
			inputStyle : {},
			remainingTime : ''
		}
	},
	props: ['workdaydata'],
	computed : {
		nameWeekday : function() {
			if (this.workdaydata.dateOfDay !== undefined ) {
				return getDaynameFromDate(this.workdaydata.dateOfDay);
			} else {
				return '';
			}
		}
	},
	mounted() {
            this.validateWorktimes();
	},
	watch : {
            workdaydata : {
                deep: true
            }
    },
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
		validateWorktimes : function() {
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
	}
};

</script>

<style scoped>

.customWidth {}

.description-workarea {
	width: 14ch;
}

.cardestination {
	width: 10ch;
}

</style>
