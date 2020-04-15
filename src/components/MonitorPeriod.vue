<template>
  <div class="container">

    <div class="row">
    <MonitorPeriodCreate> </MonitorPeriodCreate>
  </div>

  <div class="row">
    <MonitorPeriodList> </MonitorPeriodList>
  </div>
  </div>
</template>

<script>

import MonitorPeriodList from './MonitorPeriodList';
import MonitorPeriodCreate from './MonitorPeriodCreate';

export default {
  name : 'MonitorPeriod',
  data : function () {
    return {

    };
  },

  components : {MonitorPeriodList, MonitorPeriodCreate}
}

</script>

<style scoped>

</style>
