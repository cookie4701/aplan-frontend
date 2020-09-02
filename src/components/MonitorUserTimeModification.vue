<template>
    <div class="container-fluid">

      {{userinfo.dname}}

        <div class="row">
          <div>{{errormessage}}</div>
          <label for="selectModification">Art der Modifikation</label>
          <select v-model="typeModification" class="form-control" id="selectModification">
            <option value="+">Hinzufügen</option>
            <option value="-">Abziehen</option>
          </select>

          <label for="dateModification" class="mt-2">Datum der Modifikation</label>
          <input v-model="referenceDate" size="6" class="form-control" id="dateModification">

          <label for="timefrom" class="mt-2">Zeit</label>
          <input v-model="hours" size="1" class="form-control" id="timefrom">
          <label for="timeto" class="mt-2">:</label>
          <input v-model="minutes" size="1" class="form-control" id="timeto">

          <label for="reason" class="mt-2">Begründung / Erläuterung</label>
          <input v-model="reason" class="form-control" id="reason">
          <button @click="submit" class="btn btn-primary mr-2 mt-2">Speichern</button>
          <button class="btn btn-primary ml-2 mt-2">Abbrechen</button>
        </div>

      </div>

</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";
    import * as moment from 'moment';
    
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
          id : -1,
          errormessage : ''
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
          const param = {
            moduserid : this.id,
            moddate   : this.referenceDate,
            modtime   : this.hours + ':' + this.minutes,
            modreason : this.reason,
            modtype   : this.typeModification
          };

          const req = axios.post(apiHost + '/rest/moderation/users/timemodification.php', param);
          req.then( (response) => response.data)
          .then( ()  => {
            this.errormessage = 'Speichern erfolgreich.';
            this.$router.push({path : '/monitoruserlist'});
          })
          .catch( () => {
            this.errormessage = 'Speichern war nicht erfolgreich.';
          });
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
