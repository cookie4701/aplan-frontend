<template>
  <div class="container-fluid">
    <div class="row">
      {{username}} - {{message}}
    </div>

    <div class="row">
        <table>
                <tr v-for="fre in freezes" v-bind:key="fre.idFreeze">
                        <td>{{fre.freezedate}}</td>
                        <td><button @click="deleteFreezeDate(fre.idFreeze)">Löschen</button> </td>
                </tr>
        </table>
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
        this.getUserdata();
        this.getFreezeItems();
    },
    deleteFreezeDate(id) {
            var req = axios.post(apiHost + '/rest/moderation/users/freeze_delete.php', {deleteFreezeId : id});
            req.then( response => response.data )
                    .then( data => {
                            if (data.message == "ok" ) {
                                    for (var i = 0; i < this.freezes.length; i++ ) {
                                            if (this.freezes[i].idFreeze == id ) {
                                                    this.freezes.splice(i, 1);
                                            }
                                    }
                            }
                    })

                    .catch( () => {
                        this.message = "Löschen war nicht erfolgreich!"; 
                    });

    },
    getUserdata() {
      var req = axios.get( apiHost + '/rest/moderation/users/userinfo.php', {params : {id : this.userid}});
      req.then( response => response.data)
      .then( (data) => {
        this.username = data.displayname;
      })
      .catch( (err) => {
        this.message = err;
      })

    },
    resetFreezes() {
            this.freezes.splice(0, this.freezes.length);
    },
    getFreezeItems() {
            var req = axios.post( apiHost + '/rest/moderation/users/freeze_list.php', {moduserid : this.userid});
            req.then( response => response.data )
            .then( data => {
                    this.resetFreezes();
                    return data;
            })
            .then( data => {
                for (var i = 0; i < data.data.length; i++ ) {
                        data.data[i].freezedate = moment(data.data[i].freezedate, "YYYY-MM-DD").format("DD.MM.YYYY") ;
                        this.freezes.push(data.data[i]);
                }
            })

            .catch( () => {
            });
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

      var req = axios.post( apiHost + '/rest/moderation/users/freeze.php', params);
      req.then(() => {
              this.getFreezeItems();
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
