<template>
    <div class="container-fluid">
        <div class="row">
          <div class="col-sm-1" v-if="uname != ''"> {{uname}}  </div>
          <div class="col-sm-1" v-else>{{singleuserid}}</div>
       </div>
        <div class="row d-print-none">
          <div class="col-sm-3"><label for="startdate">Startdatum</label> <input v-bind:style="{ background: backgrounds.startdate }" @change="changeDateStart()" id="startdate" v-model="startdate" class="form-control"></div>
          <div class="col-sm-3"><label for="enddate">Enddatum</label> <input v-bind:style="{ background: backgrounds.enddate }" @change="changeDateend()" id="enddate" v-model="enddate" class="form-control"></div>
          <div class="col-sm-1"><button @click="loadDays" class="form-control btn btn-primary">!</button></div>

      </div>

      <div class="row d-print-none">
        <div class="col">
          <label for="displayColDate">Datum</label>
          <input type="checkbox" v-model="showCols.colDate" id="displayColDate">
        </div>
        <div class="col">
          <label for="displayColType">Tagestyp</label>
          <input type="checkbox" v-model="showCols.colDayType" id="displayColType">
        </div>
        <div class="col">
          <label for="displayColDayResult">Tagesergebnis</label>
          <input type="checkbox" v-model="showCols.colDayResult" id="displayColDayResult">
        </div>
        <div class="col">
          <label for="displayColDayPerformance">Geleistete Stunden</label>
          <input type="checkbox" v-model="showCols.colDayPerformed" id="displayColDayPerformance">
        </div>
        <div class="col">
          <label for="displayColDayWorkDescription">Tagesbeschreibung</label>
          <input type="checkbox" v-model="showCols.colDayWorkDescription" id="displayColDayWorkDescription">
        </div>
        <div class="col">
          <label for="displayColDayToDo">Zu leistende Stunden</label>
          <input type="checkbox" v-model="showCols.colDayToDo" id="displayColDayToDo">
        </div>
        <div class="col">
          <label for="displayColDayTimeEvening">Arbeit nach 20 Uhr</label>
          <input type="checkbox" v-model="showCols.colDayTimeEvening" id="displayColDayTimeEvening">
        </div>
        <div class="col">
          <label for="displayColDayBonusTime">Ausgleichszeit</label>
          <input type="checkbox" v-model="showCols.colDayBonusTime" id="displayColDayBonusTime">
        </div>

      </div>

      <div class="row">
        <table class="table table-bordered" style="table-layout:fixed;">
          <tr>
            <td v-if="showCols.colDate">Datum</td>
            <td>Tag Typ</td>
            <td>Tag Ergebnis</td>
            <td>Geleistete Stunden</td>
            <td>Zu leistende Stunden</td>
            <td>Zeit (in Minuten) nach 20 Uhr geleistet</td>
            <td>Ausgleichszeit (in Minuten) - berechnet </td>
          </tr>
        <tr is="MonitorListEntryDay" v-for="item in days" :daydata="item" v-bind:key="item.id" @message="debugMessage" @update="updateBonus"/>
      </table>
      </div>
      <div class="row">
        Berechnete Ausgleichszeit (nach 20 Uhr): {{bonusTotal}} Minuten
      </div>

      <div class="row d-print-none">
        <div class="col-sm-4">
        <button @click="showOverhours=!showOverhours" class="btn btn-secondary form-control mt-1 mb-1">{{buttonLabel}}</button>
      </div>
      </div>
      <div class="row d-print-none">
        <MonitorUserPeriods :uid="singleuserid" v-if="showOverhours"> </MonitorUserPeriods>
      </div>

    </div>
</template>

<script>
    import * as moment from 'moment';
    import MonitorListEntryDay from "./MonitorListEntryDay";
    import MonitorUserPeriods from "./MonitorUserPeriods";
    import axios from 'axios';
    import {apiHost} from "../config";

    export default {
        name: "MonitorSingleUser",
        components : {MonitorListEntryDay, MonitorUserPeriods},
        data : function() {
          return {
            uname : '',
            startdate : '',
            enddate : '',
            backgrounds : {
              startdate : '#ffffff',
              enddate : '#ffffff'
            },
            momentStartdate : moment().subtract(31, 'days') ,
            momentEnddate : moment().subtract(1, 'days'),
            days : [],
            singleuserid : 0,
            globalIndex : 0,
            showOverhours : false,
            buttonLabel : 'Vorgabe Überstunden pro Periode einblenden',
            showCols : {
              colDate : true,
              colDayType : true,
              colDayResult : true,
              colDayPerformed : true,
              colDayWorkDescription : true,
              colDayToDo : true,
              colDayTimeEvening : true,
              colDayBonusTime : true
            }
          }
        },
        methods : {
          updateBonus(data) {

            if ( data.qdate === undefined ) return;
            const momentRefDate = moment(data.qdate, "DD.MM.YYYY");
            for (let i = 0; i < this.days.length; i++ ) {
              const momentTemp = moment(this.days[i].qdate, "YYYY-MM-DD");

              if ( momentTemp.isSame(momentRefDate) ) {
                this.days[i].bonus = data.bonus;
              }
            }
          },
          resetStartDate() {
            this.startdate = this.momentStartdate.format("DD.MM.YYYY").toString();
          },
          resetEndDate() {
            this.enddate = this.momentEnddate.format("DD.MM.YYYY").toString();
          },
          changeDateStart() {
            if ( ! moment(this.startdate, "DD.MM.YYYY").isValid() ) {
              this.resetStartDate();
              this.backgrounds.startdate = '#ff0000';
              setTimeout(this.applyWhitebackground,5000);
              return;
            }

            this.momentStartdate = moment(this.startdate, "DD.MM.YYYY");
            this.resetStartDate();
          },
          applyWhitebackground() {
            this.backgrounds.startdate = '#ffffff';
            this.backgrounds.enddate = '#ffffff';
          },
          changeDateend() {

            if ( ! moment(this.enddate, "DD.MM.YYYY").isValid() ) {
              this.resetEndDate();
              this.backgrounds.enddate = '#ff0000';
              setTimeout(this.applyWhitebackground,5000);
              return;
            }

            this.momentEnddate = moment(this.enddate, "DD.MM.YYYY");
            this.resetEndDate();
          },
          loadDays() {
            this.days.splice(0, this.days.length);
            let tempDate = this.momentStartdate.clone();
            let i = this.globalIndex;
            while ( this.momentEnddate.isSameOrAfter(tempDate) ) {
              this.days.push({qdate : tempDate.format("DD.MM.YYYY"), singleuserid : this.singleuserid, id : i, bonus : 0 } );
              i++;
              tempDate.add(1, 'days');
            }
            this.globalIndex = i;
          },
          loadUserinfo() {
            const data = {
              id : this.singleuserid
            };

            var req = axios.get( apiHost + '/rest/moderation/users/userinfo.php', {params : data});
            req.then( (response) => response.data)
            .then( (data ) => {
              this.uname = data.displayname;
            })
            .catch( (err) => {
              this.message = err;
            });
          },
          debugMessage(str) {
            console.log(str);
          }
        },
        watch : {
          showOverhours(newValue) {
            if (newValue) {
              this.buttonLabel = 'Vorgabe Überstunden pro Periode ausblenden';
            } else {
              this.buttonLabel = 'Vorgabe Überstunden pro Periode einblenden';
            }
          }
        },
        mounted : function () {
          this.resetStartDate();
          this.resetEndDate();
          this.singleuserid = this.$route.params.id;
          this.loadUserinfo();

        },

    computed : {
      bonusTotal() {
        if (this.days === undefined ) return 0;

        if (this.days.length == 0) return 0;

        let res = 0;

        for (let i = 0; i < this.days.length; i++) {
          res += this.days[i].bonus;
        }
        return res;
      }
    }
    }
</script>

<style scoped>

</style>
