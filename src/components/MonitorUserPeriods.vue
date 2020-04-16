<template>
  <div class="container">
    <div class="row">{{message}}</div>
    <div class="row" v-for="itm in userperiods" v-bind:key="itm.idStart">

      <div class="col-sm">
        {{itm.label}}
      </div>

      <div class="col-sm">
        {{itm.start}}
      </div>

      <div class="col-sm">
        {{itm.end}}
      </div>

      <div class="col-sm">
        {{itm.minutes}}
      </div>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
//import * as moment from 'moment'

export default {
  name : 'MonitorUserPeriods',
  props : ['uid'],
  data : function () {
    return {
      message : ''
    };
  },
  //methods : {},
  mounted() {
    var req = this.$store.dispatch('fetchUserPeriods', this.uid);
    req.then( () => {

    })
    .catch( (err) => {
      this.message = err;
    })
  },
  computed : {
    ...mapState({
      userperiods : state => state.periods.userperiod
    })
  }
}

</script>

<style scoped>

</style>
