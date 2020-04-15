<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <label for="startdate">Startdatum</label>
      </div>
      <div class="col">
        <input v-model="data.startDate" id="startdate">
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label for="enddate">Enddatum</label>
      </div>
      <div class="col">
        <input v-model="data.endDate" id="enddate">
      </div>
    </div>

    <div class="row">
      <div class="col">
        <label for="label">Bezeichnung</label>
      </div>
      <div class="col">
        <input v-model="data.label" id="label">
      </div>
    </div>

    <div class="row">
      <div class="col">

      </div>
      <div class="col">
        <button @click="submitPeriod" class="btn btn-primary">Speichern</button>
      </div>

    </div>

    <div class="row">
      <div class="col">
        {{message}}
      </div>
    </div>


  </div>
</template>

<script>
import * as moment from 'moment';

export default {
  name : 'MonitorPeriodCreate',
  data : function () {
    return {
      data:  {
        startDate : moment().format("DD.MM.YYYY"),
        endDate : moment().format("DD.MM.YYYY"),
        label : ''
      },
      message : ''

    };
  },
  methods : {
    onLoad() {

    },
    submitPeriod() {
      const submitData = {
        startdate : this.data.startDate,
        enddate : this.data.endDate,
        label : this.data.label
      }

      var req = this.$store.dispatch('createPeriods', submitData);

      req.catch( err => {
        this.message = err;
      });
    }
  }


}

</script>

<style scoped>

</style>
