<template>
  <div class="container">
    <div class="row" v-bind:class="{ backgroundGrey : isPair }">
      <div class="col">{{itemdata.startdate}}</div>
      <div class="col">{{itemdata.enddate}}</div>
      <div class="col">{{itemdata.label}}</div>
      <div class="col"><button>Bearbeiten</button></div>
        
    </div>
  </div>
</template>

<script>
export default {
  name : 'MonitorUserScheduleListEntry',
  data : function () {
    return {}
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
