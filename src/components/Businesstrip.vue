<template>
  <div class="fluid-container">

    <SelectDateForStat @godate="refreshDate($event)" class="d-print-none"> </SelectDateForStat>

    <div class="row d-print-none" v-if="rides.length == 0">
      <div class="col-sm">
        Bitte wählen Sie zwei Daten aus und klicken auf Los!
      </div>
    </div>
    <div class="row d-print-none" v-if="rides.length == 0">
      <div class="col-sm">
        {{message}}
      </div>
    </div>

    <div class="row" v-if="rides.length > 0">
      <table class="table">
        <tr>
          <td>Datum</td>
          <td>Start</td>
          <td>Ziel</td>
          <td>Zurück gelegte KM</td>
          <td>Berechnete Entschädigung</td>
          <td>Angewandter Entschädigungssatz</td>
        </tr>

          <tr v-for="trip in rides" v-bind:key="trip.idKm">
            <td>{{trip.date}}</td>
            <td>{{trip.start}}</td>
            <td>{{trip.end}}</td>
            <td>{{trip.km}}</td>
            <td>{{parseFloat(trip.calcRecomp).toFixed(2)}}</td>
            <td>{{parseFloat(trip.appliedRate).toFixed(4)}}</td>
          </tr>

      </table>
    </div>
    <div class="row" v-if="rides.length > 0">
      <div class="col-sm">Total: {{parseFloat(totalrecomp).toFixed(2)}}</div>
    </div>
    <div class="row"> </div>
  </div>
</template>

<script>
import axios from 'axios';
import {apiHost} from "../config";
import * as moment from 'moment';
import SelectDateForStat from "./SelectDateForStat";

export default {
  name : 'Businesstrip',
  components : {SelectDateForStat},
  data : function () {
    return {
      message : '',
      rides : [],
      recompensations : [],
      totalrecomp : 0
    };
  },
  methods : {
    refreshDate(eventdata) {
      this.message = 'Laden Daten, bitte warten...';
      var req = axios.post(apiHost + '/rest/businessride/read.php', eventdata);
      req.then ( response => response.data)
      .then( (data) => {
        this.rides.splice(0, this.rides.length);


        for (let i=0; i < data.rides.length; i++) {
          const day = moment(data.rides[i].day).format("DD.MM.YYYY");
          const rate = this.getRate(day);
          const km = data.rides[i].km;
          const recomp = parseFloat(rate * km).toFixed(2);
          this.rides.push({
            "idKm" : data.rides[i].idKm,
            "start" : data.rides[i].from,
            "end" : data.rides[i].to,
            "appliedRate" : rate,
            "date" :  day,
            "km" : km,
            "calcRecomp" : recomp

          });
        }

        return data;
      })
      .then ( () => {
        let t = 0.0;
        for (let i=0; i < this.rides.length; i++) {
          t += parseFloat(this.rides[i].calcRecomp);
        }
        this.totalrecomp = t;
      })
      .catch( (err) => {
        this.message = err;
      })
    },
    getRate(day) {
      const momentDay = moment(day, "DD.MM.YYYY");
      for (let i=0; i < this.recompensations.length; i++) {
        const momentStart = moment(this.recompensations[i].startdate, "YYYY-MM-DD");
        const momentEnd = moment(this.recompensations[i].enddate, "YYYY-MM-DD");
        if (momentDay.isSameOrAfter(momentStart) && momentDay.isSameOrBefore(momentEnd) ) {
          return this.recompensations[i].val;
        }
      }
      return 0;
    },
    loadDriveRecompensations() {
      let req = axios.post(apiHost + '/rest/drive_compensation/read.php');
      req.then( response => response.data)
      .then( data => {
        this.recompensations = data;
      })
      .catch( err => {
        this.message = err;
      });
    }
  },
  mounted : function() {
    this.loadDriveRecompensations();
  }
}

</script>

<style scoped>

</style>
