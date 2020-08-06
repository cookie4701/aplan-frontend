<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col"><select v-model="daySelected">
        <option v-for="day in daynames" v-bind:value="day.value" v-bind:key="day.value">
          {{day.name}}
        </option>
       </select></div>
      <div class="col"><input v-model="from"></div>
      <div class="col"><input v-model="to"></div>
      <div class="col"><button @click="btnSaveClick">Speichern</button></div>
    </div>
  </div>

</template>


<script>
import axios from 'axios';
import {apiHost} from "../config";

export default {
  name : 'MonitorUserScheduleListEntryNew',
  data : function () {
    return {
      from : '',
      to : '',
      daySelected : '',
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
  },
  methods : {
    btnSaveClick() {
      if (! this.checkValues() ) return;
      let postData = {
        idSchedule : this.scheduleId,
        time_from : this.from,
        time_to : this.to,
        day : this.daySelected,
        userId : this.$route.params.userId
      }
      let req = axios.post(apiHost + '/rest/moderation/users/user_scheduleitem_create.php', postData);
      req.then( () => {
        this.from = '';
        this.to = '';
        this.day = 0;
        this.$emit('saveNewItemOk');
      })
      .catch( () => {
        alert("Beim speichern ist etwas schief gegangen!");
      });
    },
    checkValues() {
      if (! Number.isInteger( this.daySelected ) ) {
        alert("Bitte wählen Sie einen Tag aus!");
        return false;
      }

      if (!this.from.includes(":") || ! this.to.includes(":") ) {
        alert("Fehler in der Start- bzw. Endzeit");
        return false;
      }

      let temp = this.from.split(":");
      if (temp.length != 2) {
        alert("Startzeit ist falsch!");
        return false;
      }

      if ( !Number.isInteger( parseInt(temp[0],10) ) || ! Number.isInteger(parseInt(temp[1],10) ) ) {
        alert("Startzeit ist falsch!");
        return false;
      }

      if ( parseInt(temp[0]) > 23 || parseInt(temp[0], 10) < 0 ) {
        alert("Startzeit muss zwischen 0 und 23 Uhr liegen!")
        return false;
      }

      if ( parseInt(temp[1]) > 59 || parseInt(temp[1], 10) < 0 ) {
        alert("In der Startzeit müssen die Minuten zwischen 0 und 59 liegen!")
        return false;
      }

      temp = this.to.split(":");
      if (temp.length != 2) {
        alert("Endzeit ist falsch!");
        return false;
      }

      if ( !Number.isInteger(parseInt(temp[0],10) ) || ! Number.isInteger(parseInt( temp[1],10 ) ) ) {
        alert("Endzeit ist falsch!");
        return false;
      }

      if ( parseInt(temp[0]) > 23 || parseInt(temp[0], 10) < 0 ) {
        alert("Endzeit muss zwischen 0 und 23 Uhr liegen!")
        return false;
      }

      if ( parseInt(temp[1]) > 59 || parseInt(temp[1], 10) < 0 ) {
        alert("In der Endzeit müssen die Minuten zwischen 0 und 59 liegen!")
        return false;
      }

      return true;
    }
  },
  props : [ 'scheduleId' ]
}

</script>
<style scoped>

</style>
