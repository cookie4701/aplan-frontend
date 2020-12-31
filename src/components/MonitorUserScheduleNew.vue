<template>

    <div class="container-fluid mt-2 mb-2">
      <div class="row">
        <div class="col-sm-1">
          Startdatum
        </div>

        <div class="col-sm-2">
          <input v-model="newstart" >
        </div>

        <div class="col-sm-1">
          Enddatum
        </div>

        <div class="col-sm-2">
          <input v-model="newend">
        </div>

        <div class="col-sm-1">
          Bezeichnung
        </div>

        <div class="col-sm-2">
          <input v-model="newlabel">
        </div>
        <div class="col-sm-1">
          <button @click="atClickSave">Speichern</button>
        </div>

      </div>
    </div>

</template>

<script>
import * as moment from 'moment';
import axios from 'axios';
import {apiHost} from "../config";


export default {
  data : function() {
    return {
      newstart : moment().format("DD.MM.YYYY"),
      newend : moment().format("DD.MM.YYYY"),
      newlabel : ''
    }
  },
  methods : {
    atClickSave() {
      if (! this.checkData() ) return;

      let postData = {
        startdate : moment(this.newstart, "DD.MM.YYYY").format("YYYY-MM-DD"),
        enddate : moment(this.newend, "DD.MM.YYYY").format("YYYY-MM-DD"),
        label : this.newlabel,
        userId : this.$route.params.userId
      };

      let req = axios.post(apiHost + '/rest/moderation/users/user_create_schedule.php', postData);
      req.then( () => {
        this.$emit('createNewOk');
      })
      .then( () => {
        this.newlabel = '';
        this.newstart = moment().format("DD.MM.YYYY");
        this.newend = moment().format("DD.MM.YYYY");
      })
      .catch( () => {
        alert('Da hat etwas nicht funktioniert');
      });

    },
    checkDate(datestring) {
      return moment(datestring, "DD.MM.YYYY").isValid();
    },
    checkData() {
      if (
        this.checkDate(this.newstart) &&
        this.checkDate(this.newend) ) {

          return true;
        } else {
          return false;
        }
      }
    },
    name : 'MonitorUserSchedulesListAddNew'
  }
  </script>

  <style scoped>
  .customtitle {
    margin-top: 2px;
    margin-bottom: 2px;
  }
  </style>
