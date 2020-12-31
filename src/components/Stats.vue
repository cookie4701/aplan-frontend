<template>
  <div class="fluid-container">
  <h1>Statistik für {{userinfo.username}}</h1>

    <SelectDateForStat @godate="refreshDate($event)" class="d-print-none"> </SelectDateForStat>

    <div class="d-none d-print-block">
      {{startd}} - {{endd}}
    </div>

    <div v-if="statistics.length > 0" class="row">
      <table class="table">

        <tr>
          <td>Arbeitsbereich</td>
          <td>Geleistete Arbeit in Stunden</td>
          <td>Vorgesehene Zeit in Stunden</td>
          <td>Anteil gesamter Arbeit (erledigt)</td>
          <td>Anteil geplanter Arbeit</td>
        </tr>

        <tr v-for="wa in statistics" v-bind:key="wa.description">
          <td>{{wa.description}}</td>
          <td>{{wa.time.asHours()}}</td>
          <td>{{wa.capital}}</td>
          <td>{{wa.percentageFromTotalTime}}%</td>
          <td>{{wa.percentageFromTotalCapital}}%</td>
        </tr>

        <tr>
          <td>Total</td>
          <td>{{totalTime.asHours()}}</td>
          <td>{{totalCapital.asHours()}}</td>
          <td> </td>
          <td> </td>
        </tr>

      </table>
    </div>
      <div v-if="statistics.length > 0" class="row">
        <div class="col-sm">Bericht generiert am: {{generatedAt}}</div>
      </div>

  </div>
</template>

<script>
import axios from 'axios';
import {apiHost} from "../config";
import SelectDateForStat from "./SelectDateForStat";
import * as moment from 'moment';
import { mapState } from 'vuex';

export default {
  name : 'Stats',
  data : function () {
    return {
      statistics : [],
      totalTime : moment.duration('00:00', "HH:mm"),
      totalCapital : moment.duration('00:00', "HH:mm"),
      message : '',
      startd : '',
      endd : '',
      generatedAt : ''
    };
  },
  components : {
    SelectDateForStat
  },
  mounted () {
    this.$store.dispatch('userdataFromServer');
  },
  methods : {
    refreshDate(eventdata) {
      this.startd =  moment(eventdata.sdate, "YYYY-MM-DD").format("DD.MM.YYYY");
      this.endd = moment(eventdata.edate, "YYYY-MM-DD").format("DD.MM.YYYY");

      this.totalTime = moment.duration('00:00', "HH:mm");
      this.totalCapital = moment.duration('00:00', "HH:mm");
      var req = axios.post(apiHost + '/rest/selfstat/read.php', eventdata);
      req.then( response => response.data )
      .then( (data) => {
        this.statistics.splice(0, this.statistics.length);
        return data;
      })
      .then( data => {
        for ( let i=0; i < data.workareas.length; i++ ) {
          let tmpTime = moment.duration("00:00");
          for (let k=0; k < data.workareas[i].times.length; k++) {
            let dura = moment.duration(data.workareas[i].times[k], "HH:mm:ss");
            tmpTime.add(dura);
            this.totalTime.add(dura);
          }

          let capital = moment.duration(data.workareas[i].timecapital, "HH:mm:ss");
          this.totalCapital.add(capital);

          let t = {
            "description" : data.workareas[i].description,
            "capital" :     data.workareas[i].timecapital,
            "time" :        tmpTime,
            "percentageFromTotalTime" : 0,
            "percentageFromTotalCapital" : 0

          };
          this.statistics.push(t);

        }

        return data;
      })
      .then( () => {
        this.calcPercentageRateTimeWorked();
        this.calcPercentageRateTimeCapital();
        this.generatedAt = moment().format('MM.DD.YYYY HH:mm');
      })
      .catch( err => {
        this.message = err;
      });
    },
    calcPercentageRateTimeWorked() {
      for (let i = 0; i < this.statistics.length; i++) {
        this.statistics[i].percentageFromTotalTime =
          parseFloat(
            (this.statistics[i].time.asHours() / this.totalTime.asHours() ) * 100
          ).toFixed(2);
      }
    },
    calcPercentageRateTimeCapital() {
      for (let i=0; i < this.statistics.length; i++ ) {
        if ( this.totalCapital.asHours() == 0 ) {
            this.statistics[i].percentageFromTotalCapital = '- ';
        } else {
        this.statistics[i].percentageFromTotalCapital =
          parseFloat(
            100 * this.statistics[i].capital / this.totalCapital.asHours()
          ).toFixed(2);
        }
      }
    }
  },
  computed:
      {
          ...mapState({
              userinfo : state  => state.userinfo.userinfo
          }),
      }

}

</script>

<style scoped>

</style>
