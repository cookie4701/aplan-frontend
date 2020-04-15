<template>
  <div class="mt-3 mb-3">
    <div class="row mt-1">
      <div class="col-sm">Startdatum</div>
      <div class="col-sm"><input v-model="startdate"></div>
    </div>
    <div class="row mt-1">
      <div class="col-sm">Enddatum</div>
      <div class="col-sm"><input v-model="enddate"> </div>
    </div>
    <div class="row mt-1">
      <div class="col-sm"> </div>
      <div class="col-sm"><button @click="goParent">Los</button></div>
    </div>

  </div>
</template>

<script>

import * as moment from 'moment';

export default {
  name : 'SelectDateForStat',
  data : function () {
    return {
      startdate : moment().format('DD.MM.YYYY'),
      enddate : moment().format('DD.MM.YYYY')
    };
  },
  methods : {
    goParent() {
      const data = {
        sdate : moment(this.startdate, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        edate : moment(this.enddate, 'DD.MM.YYYY').format('YYYY-MM-DD')
      };
      this.$emit('godate', data );
    }
  }

}

</script>

<style scoped>

</style>
