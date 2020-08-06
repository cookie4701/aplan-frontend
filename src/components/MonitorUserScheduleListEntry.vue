<template>
  <div class="container-fluid">
    <div class="row pt-2 pb-2" v-bind:class="{ backgroundGrey : isPair }">

      <div class="col-sm-1">{{itemdata.startdate}}</div>
      <div class="col-sm-1">{{itemdata.enddate}}</div>
      <div class="col-sm-1">{{itemdata.label}}</div>
      <div class="col-sm-1"><button @click="btnEditClick(itemdata.idSchedule)">Bearbeiten</button> <button @click="btnDeleteClick(itemdata.idSchedule)">Löschen</button></div>


    <div v-if="editItem > 0" class="col-sm-8">
      <Edit v-bind:scheduleData="itemdata"> </Edit>
      <button @click="btnResetEdit">Beenden</button>
    </div>
    </div>
  </div>
</template>

<script>
import MonitorUserScheduleEntryEdit from "./MonitorUserScheduleEntryEdit";
import axios from 'axios';
import {apiHost} from "../config";


export default {
  components : {
    Edit : MonitorUserScheduleEntryEdit
  },
  name : 'MonitorUserScheduleListEntry',
  data : function () {
    return {
      editItem : -1
    }
  },
  methods : {
    btnEditClick(id) {
      this.editItem = id;
    },
    btnResetEdit() {
      this.editItem = -1;
    },
    btnDeleteClick(id) {
      let postData = {
        userId : this.$route.params.userId,
        idSchedule : id
      };

      let req = axios.post(apiHost + '/rest/moderation/users/user_delete_schedule.php', postData);
      req.then( () => {
        this.$emit('deleteListEntryOk');
      })
      .catch( () => {
        alert('Da hat etwas nicht funktioniert!');
      });
    }
  },
  props : [ 'itemdata'],
  computed : {
    isPair : function() {
      if (this.itemdata.number % 2  == 0 ) return true;
      else return false;
    }
  }

}
</script>

<style scoped>
.backgroundGrey {
  background-color: grey;
}

</style>
