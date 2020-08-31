<template>
  <div>

    <div class="container-fluid">

      <div class="row border border-danger" v-if="msg != ''">
        {{msg}}
      </div>

      <div class="border border-info rounded">
        <div class="row mt-2">
          <div class="col">Neuen Datensatz anlegen: </div>
        </div>
    <div class="row mb-2">

      <div class="col">Startdatum </div>
      <div class="col"><input v-model="newstartdate" class="form-control"></div>
      <div class="col">Enddatum </div>
      <div class="col"><input v-model="newenddate" class="form-control"></div>
      <div class="col">Tage </div>
      <div class="col"><input v-model="newdays" class="form-control"></div>
      <div class="col">Stunden (h:mm)</div>
      <div class="col"><input v-model="newtime" class="form-control"></div>
      <div class="col"><button class="btn btn-primary">Speichern</button></div>

    </div>

  </div>

  <div class="row">
    <div class="col">Startdatum</div>
    <div class="col">Enddatum</div>
    <div class="col">Tage</div>
    <div class="col">Zeit</div>
    <div class="col"></div>
  </div>

    <div v-for="period in periods" v-bind:key="period.idHolliday" class="row myhover">
      <div class="col">{{period.startdate}}</div>
      <div class="col">{{period.enddate}}</div>
      <div class="col">{{period.nbrdays}}</div>
      <div class="col">{{period.nbrminutes}}</div>
      <div class="col"><button class="btn btn-danger">x</button></div>
    </div>

  </div>
  </div>

</template>

<script>

import axios from 'axios';
import {apiHost} from "../config";

export default {
  name : 'MonitorUserHollidayPeriods',
  data : function() {
    return {
      id : 0,
      periods : [],
      newstartdate : '',
      newenddate : '',
      newdays : 0,
      newtime : 0,
      msg : ''
    }
  },
  methods : {
    onLoad() {
      this.id = this.$route.params.userId;
      this.periods = [];
      this.loadListFromServer();
    },
    loadListFromServer() {
      let req = axios.post(apiHost + '/rest/moderation/holliday/read.php', {userId : this.id});
      req.then( response => response.data)
        .then( data => {
          this.periods.splice(0, this.periods.length);
          for (let i=0; i < data.length; i++ ) {
            this.periods.push( data[i] );
          }
        })
        .catch( (err) => {
          this.msg = err;
        })
    },
  },
  mounted : function() {
    this.onLoad();
  }
}

</script>

<style scoped>
.myhover {
  background-color: white;
}

.myhover:hover {
  background-color:lightgrey;
}
</style>
