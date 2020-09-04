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
          <div class="col">Stunden (h:mm) - Angabe wird in Minuten umgewandelt</div>
          <div class="col"><input v-model="newtime" class="form-control" @blur="reformatTimeField"></div>
          <div class="col"><button class="btn btn-primary" @click="saveNewDataset">Speichern</button></div>

        </div>

      </div>


        <div class="row">
          <div class="col">Startdatum</div>
          <div class="col">Enddatum</div>
          <div class="col">Tage</div>
          <div class="col">Zeit</div>
          <div class="col"></div>
        </div>

        <div v-for="period in periods" v-bind:key="period.idHolliday" class="row myhover mb-2">
          <div class="col">{{period.startdate}}</div>
          <div class="col">{{period.enddate}}</div>
          <div class="col">{{period.nbrdays}}</div>
          <div class="col">{{period.nbrminutes}}</div>
          <div class="col"><button class="btn btn-danger" @click="deleteDataset(period.idHolliday)">x</button></div>
        </div>



    </div>
  </div>

</template>

<script>

import axios from 'axios';
import {apiHost} from "../config";
import * as moment from 'moment';

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
          data[i].startdate = moment(data[i].startdate, "YYYY-MM-DD").format("DD.MM.YYYY");
          data[i].enddate = moment(data[i].enddate, "YYYY-MM-DD").format("DD.MM.YYYY");
          this.periods.push( data[i] );
        }
      })
      .catch( (err) => {
        this.msg = err;
      })
    },
    reformatTimeField() {
      const t = this.newtime.split(":");

      if ( t.length == 2 ) {
        const h = 60 * parseInt( t[0], 10 );
        const m = parseInt(t[1], 10);
        const res = h+m;
        this.newtime = res;
      }

    },
    deleteDataset(id) {
      let data =  {
        hollidayid : id,
        userid : this.$route.params.userId
      };

      let req = axios.post(apiHost + '/rest/moderation/holliday/delete.php', data);
      req.then( () => {
        this.msg = "Dataset deleted";
      })
      .then( () => {
        this.loadListFromServer();
      })
      .then( () => {
        this.msg = '';
      })
      .catch( (err) => {
        this.msg = err;
      })
    },
    saveNewDataset() {
      let data = {
        startdate : moment(this.newstartdate, "DD.MM.YYYY").format("YYYY-MM-DD"),
        enddate : moment(this.newenddate, "DD.MM.YYYY").format("YYYY-MM-DD"),
        days : this.newdays,
        minutes : this.newtime,
        userid : this.$route.params.userId
      };

      let req = axios.post(apiHost + '/rest/moderation/holliday/create.php', data);

      req.then( () => {
        this.msg = "Speichern Ok!";
      })
      .then( () => {
        this.loadListFromServer();
        this.msg = '';
      })
      .catch( (err) => {
        this.msg = err;
      })
    }
  },
  mounted : function() {
    this.onLoad();
  }
}

</script>

<style scoped>
.myhover {
  background-color: #CCFFE5;
}

.myhover:hover {
  background-color:lightgrey;
}
</style>
