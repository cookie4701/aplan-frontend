<template>
  <div>
    <div>
      Anzahl Benutzer anzeigen
      <select id="nbruser" v-model="nbruser">
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      Seite auswählen
      <select id="pagenumber" v-model="pagenumber">
        <option v-for="opt in pagenbroptions" v-bind:value="opt.pnumber" v-bind:key="opt.id">{{opt.pnumber}}</option>
      </select>

    </div>

    <div>
        <MonitorListEntry class="m-2" v-for="(datarow, index) in userdata" v-bind:key="datarow.id" :userinfo="datarow" :row-number="index"></MonitorListEntry>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
    import {apiHost} from "../config";
    import MonitorListEntry from "./MonitorListEntry";

    export default {
        name: "MonitorUserList",
        components: {MonitorListEntry},
        data : function() {
            return {
                userdata : [],
                messages : '',
                nbruser : 10,
                pagenbroptions : [{id : 1, pnumber : 1}, {id : 2, pnumber : 2}]
            }
        },
        methods : {
            onLoad() {
                // retrieve something
                axios.get( apiHost + '/rest/moderation/users/list.php?orgacode=jbuero2020')
                    .then( data => data.data)
                .then( (data) => {
                    this.userdata = data;
                })
                .catch( (err) => {
                    this.messages = err;
                })
            }
        },

        mounted() {
            this.onLoad();
        }
    }
</script>

<style scoped>

</style>
