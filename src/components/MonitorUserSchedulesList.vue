<template>
  <div>
    <div class="container-fluid">
      <div v-for="lstitem in schedules"> </div>
    </div>
  </div>
</template>

<script>
export default {
    data : function() {
        return {}
    },
    methods : {},
    computed : {},
    name : 'MonitorUserSchedulesList'
</script>

<style scoped>
.customtitle {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
