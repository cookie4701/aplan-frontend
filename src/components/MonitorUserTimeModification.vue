<template>
    <div class="container-fluid">

      {{userinfo.dname}}

        <div class="row">
          Art der Modifikation
          <select v-model="typeModification">
            <option value="+">Hinzufügen</option>
            <option value="-">Abziehen</option>
          </select>

          Datum der Modifikation
          <input v-model="referenceDate" size="6">

          Zeit
          <input v-model="hours" size="1" class="form-control">
          :
          <input v-model="minutes" size="1" class="form-control">

          <button>Speichern</button>
          <button>Abbrechen</button>
        </div>

      </div>

</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";
    import * as moment from 'moment';

    //import {minutesToTime} from "../helper";

    export default {
      name : 'MonitorUserTimeModification',
      data: function() {
        return {
          hours : '00',
          minutes : '00',
          referenceDate : moment().format("DD.MM.YYYY").toString(),
          typeModification : '+',
          reason : '',
          userinfo : {dname : ''},
          id : -1
        }
      },
      mounted : function() {
        const refThis = this;
        const prom = new Promise( function(resolve) {
          refThis.id = refThis.$route.params.id;
          resolve(refThis.id);
        })

        prom.then( () => {
          return refThis.loadUserinfo();
        } )
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err);
        });

        //this.referenceDate = moment().format("DD.MM.YYYY").toString()
        //this.referenceDate = 'xxx';

      },
      methods : {
        submit() {

        },
        loadUserinfo() {
          const refThis = this;
          const req = axios.get(apiHost + '/rest/moderation/users/userinfo.php', {params : {id : this.id} } );
          req.then( (response) => response.data )
            .then( (data) => {
              refThis.userinfo.dname = data.displayname;
            })
            .catch( (err) => {
              // eslint-disable-next-line no-console
              console.log(err);
            });

            return req;
        }
      }

    }
</script>
