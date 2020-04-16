<template>
  <div class="container">
    <div class="row">
      <div class="col">
        {{message}}
      </div>
    </div>
    <div class="row">
      <div class="col-sm m-2 text-center">
        Bezeichnung
      </div>
      <div class="col-sm m-2 text-center">
        Startdatum
      </div>
      <div class="col-sm m-2 text-center">
        Enddatum
      </div>
      <div class="col-sm m-1">

      </div>

    </div>

    <div class="row mt-1 mb-1" v-for="itm in periods" v-bind:key="itm.id">
      <div class="col-sm text-center">
        {{itm.label}}
      </div>
      <div class="col-sm text-center">
        {{itm.startdate}}
      </div>
      <div class="col-sm text-center">
        {{itm.enddate}}
      </div>
      <div class="col-sm text-center">
        <b-button @click="deletePeriod(itm.id)">Löschen</b-button>
      </div>
    </div>
    <div class="row"> </div>
    <div class="row"> </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name : 'MonitorPeriodList',
  data : function () {
    return {
      message : ''
    };
  },
  methods : {
     deletePeriod(id) {
      var req = this.$store.dispatch('deletePeriod', id);

      req.then( () => {
        this.$store.dispatch('fetchPeriods');
      })
      .catch( err => {
        this.message = err;
      })
    }
  },
  mounted : function() {
    var req = this.$store.dispatch('fetchPeriods');
    req.then( () => {

    })
    .catch( (err) => {
      this.message = err;
    })
  },
  computed : {
    ...mapState({
      periods : state => state.periods.periods
    })
  }
}

</script>

<style scoped>

</style>
