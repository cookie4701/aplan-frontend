<template>
    <tr>
        <td v-if="!loadCompleted">
            <img src="../assets/static/loading.gif" height="30" />
        </td>

        <td v-else-if="loadCompleted && hasError">
            <img src="../assets/static/redx.png" height="30" />
        </td>

            <td v-if="loadCompleted && !hasError" >{{formattedDate}} {{messages}}</td>
            <td v-if="loadCompleted && !hasError">{{holliday}}</td>
            <td v-if="loadCompleted && !hasError">{{dayResult}}</td>
            <td v-if="loadCompleted && !hasError" @click="popup">
              <ul>
                <li v-for="itm in loadedData.worktime" v-bind:key="itm.id" >{{itm.from}} : {{itm.to}}</li>
              </ul>
              <div v-if="popupWorkfields" class="tooltiptext">
                {{formattedDate}}
                <ul>
                  <li v-for="itm in listWorkareas" v-bind:key="itm.rank">{{itm.descriptive}}: {{itm.hours}}</li>
                </ul>
                {{loadedData.comment}}
              </div>
            </td>
            <td v-if="loadCompleted && !hasError">
              <ul>
                <li v-for="itm in loadedData.schedule" v-bind:key="itm.iditem">{{itm.timeFrom}} : {{itm.timeTo}}</li>
              </ul>
            </td>
            <td v-if="loadCompleted && !hasError">
              {{after20oclock}}
            </td>
            <td v-if="loadCompleted && !hasError">
              {{recomp}}
            </td>

    </tr>
</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";
    import {minutesToTime, timeToMinutes} from "../helper";
    import * as moment from 'moment';

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
                dayResult : '',
                worktimeString : '',
                scheduledTimeString : '',
                messages : '',
                popupWorkfields : false,
                after20oclock : 0
            }
        },
        mounted() {
          this.loadDayDataFromServer();
        },
        methods : {
            popup() {
              //this.$emit('message', 'boo');
              this.popupWorkfields = true;
              setTimeout(() => {
                this.popupWorkfields = false;
              }, 5000);
            },
            resetPopup() {
              this.popupWorkfields = false;
            },
            loadDayDataFromServer() {

              this.daydata.qdate = moment(this.daydata.qdate, "DD.MM.YYYY").format("YYYY-MM-DD");

                axios.post( apiHost + '/rest/moderation/users/single.php', this.daydata )
                    .then( data => data.data)
                    .then( (data) => {
                        this.loadedData = data;
                        this.loadCompleted = true;
                        this.formattedDate = moment(this.daydata.qdate, "YYYY-MM-DD").format("DD.MM.YYYY");
                    })
                    .then( () => {

                        return this.processData();
                    })

                    .then( () => {
                      return this.calcAfter20oclock();
                    })

                    .then( () => {
                      const tmpDate = moment(this.daydata.qdate, "YYYY-MM-DD").format("DD.MM.YYYY");
                      const data = {
                        qdate : tmpDate,
                        bonus : this.recomp
                      };

                      return this.$emit('update', data);
                    })

                    .catch( (err) => {
                        this.messages = err;
                        this.hasError = true;
                        this.loadCompleted = true;

                    });
            },

            calcAfter20oclock() {
              if ( this.loadedData.worktime === undefined ) return 0;

              let result = 0;
              for (let i = 0; i < this.loadedData.worktime.length; i++) {
                if ( timeToMinutes(this.loadedData.worktime[i].to) > 1200 ) {
                  const timeFrom =
                    timeToMinutes( this.loadedData.worktime[i].from ) > 1200 ?
                    timeToMinutes( this.loadedData.worktime[i].from ) : 1200;
                  result -= timeFrom;
                  result += timeToMinutes( this.loadedData.worktime[i].to );
                }
              }
              this.after20oclock = result;
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
                } else {
                  this.holliday = 'Norm.';
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
        },
        computed : {
          listWorkareas() {
            function myFilterFunction(val) {
              if (val.hours.includes('00:00') ) {
                return false;
              } else {
                return true;
              }
            }
            return this.loadedData.workdone.filter(myFilterFunction);

          },

          recomp() {
            return this.after20oclock * 0.2;
          }
        }
      }

</script>

<style scoped>
.tooltiptext {
  background-color: darkgray;
  color: #fff;
  text-align: left;
  padding: 5px 0;
  border-radius: 3px;
  top: 10px;
  left: 10px;
  width: 100%;

  /* Position the tooltip text - see examples below! */
  position: relative;
  z-index: 1000;
}
</style>
