<template>
  <div class="fluid-container">
    <div class="row">
      {{username}} - {{message}}
    </div>

    <div class="row">
      <div class="col-2-sm">
        <input v-model="nextfreeze" class="form-control">
      </div>
      <div class="col-2-sm">
        <button @click="saveNextFreeze" class="form-control btn btn-primary">Hinzufügen</button>
      </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios';
import {apiHost} from "../config";
import * as moment from 'moment';

export default {
  name : 'MonitorUserFreeze',
  data : function () {
    return {
      userid : 0,
      username : '',
      message : '',
      freezes : [],
      nextfreeze : moment().format("DD.MM.YYYY")
    };
  },
  methods : {
    onLoad() {
      var req = axios.get( apiHost + '/rest/moderation/users/userinfo.php', {params : {id : this.userid}});
      req.then( response => response.data)
      .then( (data) => {
        this.username = data.displayname;
      })
      .catch( (err) => {
        this.message = err;
      })

    },
    saveNextFreeze() {
      let regex = /^[012][0-9]\.[01][0-9]\.20[0-9][0-9]$/;
      if ( ! regex.test(this.nextfreeze) ) {
        this.message = "Datum ist nicht korrekt. Bitte verwenden Sie folgende Form: TT.MM.JJJJ";
      } else {
        this.message = "";
      }

      const tmpMoment = moment(this.nextfreeze, "DD.MM.YYYY");
      const params = {
        moduserid : this.userid,
        qdate : tmpMoment.format("YYYY-MM-DD")
      };

      var req = axios.post( apiHost + '/rest/moderation/user/freeze.php', params);
      req.then(() => {
        this.$router.push({
          name : 'monitoruserlist'
        })
      })
      .catch( () => {
        this.message = "Es gab ein Problem beim Speichern.";
      });

    }
  },
  mounted() {
    this.userid = this.$route.params.id;
    this.onLoad();
  },
  computed : {}
}

</script>

<style scoped>

</style>
