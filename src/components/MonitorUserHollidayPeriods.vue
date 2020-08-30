<template>
  <div class="container-fluid">

    <div class="row">
      <div class="col-sm-1">Neuen Datensatz anlegen: </div>
      <div class="col-sm-1">Startdatum </div>
      <div class="col-sm-1"><input v-model="newstartdate"></div>
      <div class="col-sm-1">Enddatum </div>
      <div class="col-sm-1"><input v-model="newenddate"></div>
      <div class="col-sm-1">Tage </div>
      <div class="col-sm-1"><input v-model="newdays"></div>
      <div class="col-sm-1">Stunden (h:mm)</div>

    </div>

    <div v-for="period in periods" v-bind:key="period.idVacation">
      <div class="col-sm-1">{{period.startdate}}</div>
      <div class="col-sm-1">{{period.enddate}}</div>
      <div class="col-sm-1">{{period.nbrdays}}</div>
      <div class="col-sm-1">{{period.nbrminutes}}</div>
    </div>
  </div>

</template>

<script>

export default {
  name : 'MonitorUserHollidayPeriods',
  data : function() {
    return {
      periods : []
    }
  },
  methods : {
    onLoad() {
      this.periods = [];
    }
  },
  mounted : function() {
    this.onLoad();
  }
}

</script>

<style scoped>

</style>
