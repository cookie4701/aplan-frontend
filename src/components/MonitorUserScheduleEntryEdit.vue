<template>
  <div class="container-fluid mt-2 mb-2">


      <div class="row mt-6 mb-6" v-for="itm in scheduleDetails" v-bind:key="itm.idScheduleItem">
        <div class="col"> {{itm.dayname}} </div>
        <div class="col"> {{itm.time_from}} </div>

        <div class="col"> {{itm.time_to}} </div>
        <div class="col"> <button @click="deleteScheduleItem(itm.idScheduleItem)" class="btn btn-danger">X</button> </div>
      </div>

  <div class="row">
    <EditNew :scheduleId="scheduleData.idSchedule" @saveNewItemOk="saveEdit"> </EditNew>
  </div>
  </div>

</template>

<script>
import axios from 'axios';
import {apiHost} from "../config";
import MonitorUserScheduleListEntryNew from './MonitorUserScheduleListEntryNew';

export default {
  components : {
    EditNew : MonitorUserScheduleListEntryNew
  },
  name : 'MonitorUserScheduleEntryEdit',
  data : function () {
    return {
      scheduleDetails : [],
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
  methods: {
    saveEdit(/*event*/) {
      this.loadScheduleDetails();
    },
    deleteScheduleItem(idNbr) {

        let req = axios.post(apiHost + '/rest/moderation/users/user_scheduleitem_delete.php' , {userId : this.$route.params.userId, idScheduleItem : idNbr});
        req.then( () => {
          this.loadScheduleDetails();
        })
    },
    loadScheduleDetails() {
      if ( this.scheduleData.idSchedule <= 0) return;

      let req = axios.post(apiHost + '/rest/moderation/users/user_scheduleitems_read.php', {schedule: this.scheduleData} );
      req.then( response => response.data )
      .then( data => {
        this.scheduleDetails.splice(0, this.scheduleDetails.length);
        for (let i = 0; i < data.length; i++) {
          data[i].dayname = this.lookupName(data[i].dayOfWeek);
          this.scheduleDetails.push( data[i] );
        }

      })

    },
    lookupName(nbr) {
      for (let i = 0; i < this.daynames.length; i++ ) {
        if ( nbr == this.daynames[i].value ) return this.daynames[i].name;

      }

      return "Tag nicht gefunden";
    }
  },
  mounted() {
    this.scheduleDetails = [];
    this.loadScheduleDetails();
  },
  props : [ 'scheduleData']
}
</script>

<style scoped>

</style>
