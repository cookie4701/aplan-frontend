<template>
  <div class="container">
    <div class="row" v-bind:class="{ backgroundGrey : isPair }">

      <div class="col">{{itemdata.startdate}}</div>
      <div class="col">{{itemdata.enddate}}</div>
      <div class="col">{{itemdata.label}}</div>
      <div class="col"><button @click="btnEditClick(itemdata.idSchedule)">Bearbeiten</button></div>


    <div v-if="editItem > 0" class="col">
      <Edit v-bind:scheduleData="itemdata"> </Edit>
      <button @click="btnResetEdit">Beenden</button>
    </div>
    </div>
  </div>
</template>

<script>
import MonitorUserScheduleEntryEdit from "./MonitorUserScheduleEntryEdit";

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
.backgroundGrey { background-color: grey};

</style>
