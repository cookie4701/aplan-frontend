<template>
  <div class="container">
    <div class="row">
      <div class="col"><select> </select></div>
      <div class="col"><input v-model="from"></div>
      <div class="col"><input v-model="to"></div>
    </div>
  </div>

</template>


<script>
export default {
  name : 'MonitorUserScheduleListEntryNew',
  data : function () {
    return {
      scheduleDetails : [],
      from : '',
      to : '',
      daynames : [
        {name :'Montag', value : 0},
        {name : 'Dienstag', value : 1},
        {name : 'Mittwoch', value : 2 },
        {name : 'Donnerstag', value :3 },
        {name: 'Freitag', value : 4 },
        {name : 'Samstag', value : 5 },
        {name: 'Sonntag', value : 6 }
      ]
    }
  }
}

</script>
<style scoped>

</style>
