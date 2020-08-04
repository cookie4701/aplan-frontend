<template>
  <div>
    <div class="container-fluid">
      <div >
        <Entry v-for="lstitem in schedules" v-bind:key="lstitem.idSchedule" v-bind:itemdata="lstitem"> </Entry>

      </div>
      {{id}}
      {{tmp}}
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import {apiHost} from "../config";
import MonitorUserScheduleListEntry from './MonitorUserScheduleListEntry';
import * as moment from 'moment';

export default {
  components : {
    'Entry' : MonitorUserScheduleListEntry
  },

  data : function() {
    return {
      id : 0,
      tmp : '',
      schedules : [],
      daynames : [
        {name :'Montag', value : 0},
        {name : 'Dienstag', value : 1},
        {name : 'Mittwoch', value : 2 },
        {name : 'Donnerstag', value :3 },
        {name: 'Freitag', value : 4 },
        {name : 'Samstag', value : 5 },
        {name: 'Sonntag', value : 6 }
      ]
    }
  },
  methods : {
    onLoad() {
      this.schedules = [];
      this.gatherData();
    },
    gatherData() {
      this.id = this.$route.params.userId;
      this.loadScheduleList();
    },
    loadScheduleList() {
      let req = axios.post(apiHost + '/rest/moderation/users/user_list_schedules.php', {userId : this.id});
      req.then ((response) => response.data)
      .then((data) => {
        this.schedules.splice(0, this.schedules.length);
        for (let i = 0; i < data.length; i++ ) {
          data[i].startdate = moment(data[i].startdate, "YYYY-MM-DD").format("DD.MM.YYYY") ;
          data[i].enddate = moment(data[i].enddate, "YYYY-MM-DD").format("DD.MM.YYYY") ;
          data[i].number = i;
          this.schedules.push(data[i]);
        }
      })
      .catch( () => {
        this.tmp = 'not ok';
      });
    },
  },
  mounted : function() {
    this.onLoad();
  },
  //computed : {},
  name : 'MonitorUserSchedulesList'
}
</script>

<style scoped>
.customtitle {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
