<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          Startdatum
        </div>

        <div class="col">
		<input v-model="newstart">
        </div>

        <div class="col">
          Enddatum
        </div>

        <div class="col">
		<input v-model="newend">
        </div>

        <div class="col">
          Bezeichnung
        </div>

	<div class="col">
		<input v-model="newlabel">
	</div>
	<div class="col">
		<button @click="atClickSave">Speichern</button>
	</div>

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
		   if (! chekcData() ) return;

		    //axios post
	    },
	    checkDate(datestring) {
		   return moment(datestring, "DD.MM.YYYY").isValid();
	    },
	    checkData() {
		    if (
			    checkDate(this.newstart) &&
			    checkDate(this.newend) ) {

			    return true;
		    } else {
			    return false;
		    }
	    }
    },
    computed : {},
    name : 'MonitorUserSchedulesListAddNew'
</script>

<style scoped>
.customtitle {
  margin-top: 2px;
  margin-bottom: 2px;
}
</style>
