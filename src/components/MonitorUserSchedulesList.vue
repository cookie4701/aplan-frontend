<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <NewSchedule @createNewOk="loadScheduleList"> </NewSchedule>
      </div>

      <div class="row" >
        <Entry v-for="lstitem in schedules" v-bind:key="lstitem.idSchedule" v-bind:itemdata="lstitem" @deleteListEntryOk="loadScheduleList"> </Entry>

      </div>

      <div class="row">

      </div>

    </div>
  </div>
</template>

<script>

import axios from 'axios';
import {apiHost} from "../config";
import MonitorUserScheduleListEntry from './MonitorUserScheduleListEntry';
import MonitorUserSchedulesListAddNew from './MonitorUserScheduleNew';

import * as moment from 'moment';

export default {
  components : {
    'Entry' : MonitorUserScheduleListEntry,
    'NewSchedule' : MonitorUserSchedulesListAddNew
  },

  data : function() {
    return {
      id : 0,
      tmp : '',
      schedules : []

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
          data[i].userId = this.id;
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
  name : 'MonitorUserSchedulesList'
}
</script>

<style scoped>
.customtitle {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
