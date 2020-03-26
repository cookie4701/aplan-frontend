<template>
  <div>
    <div>
      Anzahl Benutzer anzeigen
      <select id="nbruser" v-model="nbruser" @change="changeSelect()">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      Seite auswählen
      <select id="pagenumber" v-model="pagenumber" @change="changeSelect()">
        <option v-for="opt in pagenbroptions" v-bind:value="opt.pnumber" v-bind:key="opt.id">{{opt.pnumber}}</option>
      </select>

    </div>

    <div>
        <MonitorListEntry class="m-2" v-for="(datarow, index) in userdata" v-bind:key="datarow.id" :userinfo="datarow" :row-number="index" :numberDays='3' ></MonitorListEntry>
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
                nbruser : 5,
                pagenumber : 1,
                pagenbroptions : [{id : 1, pnumber : 1}, {id : 2, pnumber : 2}],
                componentInit: false
            }
        },
        methods : {
            changeSelect() {
              this.messages = '';
              var refThis = this;
              var prom = new Promise( function(resolve) {
                if ( refThis.userdata.length > 0 ) {
                  refThis.userdata.splice(0, refThis.userdata.length);
                  refThis.messages += ' userdata is truncated ';
                } else {
                  refThis.messages += ' not truncating userdata ' + refThis.userdata.length + ' ';
                }

                refThis.componentInit = false;
                resolve(true);
              });


              prom.then( () => {
                this.messages += ' executing getNumberPages ';
                return this.getNumberPages();
              }).
              then( () => {
                this.messages += ' executing refreshUserList ';
                return this.refreshUserList();
              }).
              catch( (err) => {
                this.messages += ' err: ' + err + ' ';
              });

            },

            refreshUserList() {
              if (! this.componentInit ) {
                this.messages += 'compInit not true';
                return;
              }
                // retrieve something
                let url = '/rest/moderation/users/list.php?orgacode=jbuero2020&page=' + this.pagenumber
                  + '&nbritems=' + this.nbruser;
                axios.get( apiHost + url)
                  .then( data => data.data)

                  .then( (data) => {
                    for (let i = 0; i < data.length; i++ ) {
                      this.userdata.push(data[i]);
                    }

                  })

                  .catch( (err) => {
                      this.messages = err;
                  });
            },
             getNumberPages() {
              return axios.get( apiHost + '/rest/moderation/users/count.php?orgacode=jbuero2020')
                .then ( data => data.data )
                .then( data => {
                  const nbrUsers = data.nbr_users;
                  let pages = parseInt( nbrUsers / this.nbruser, 10);
                  if ( isNaN(pages) ) {
                    throw "Not a number " + nbrUsers;
                  }
                  pages++;
                  this.pagenbroptions.splice(0, this.pagenbroptions.length);
                  for (let i = 1; i <= pages; i++ ) {
                    this.pagenbroptions.push( {id : i, pnumber: i});
                  }
                  this.componentInit = true;
                })
                .then( () => {
                  this.messages += ' getNumberPages finished ';
                  return "";
                } )
                .catch( (err) => {
                  this.messages = err;
                })
            }
        },

        mounted() {
            this.changeSelect();
        }
    }
</script>

<style scoped>

</style>
