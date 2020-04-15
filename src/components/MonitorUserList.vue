<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm">
      Anzahl Benutzer anzeigen
      <select id="nbruser" v-model="nbruser" @change="executeRouteChange()">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>

    <div class="col-sm">

      Seite auswählen
      <select id="pagenumber" v-model="pagenumber" @change="executeRouteChange()">
        <option v-for="opt in pagenbroptions" v-bind:value="opt.pnumber" v-bind:key="opt.id">{{opt.pnumber}}</option>
      </select>

    </div>

    </div>

        <MonitorListEntry class="m-2" v-for="(datarow, index) in userdata" v-bind:key="datarow.id" :userinfo="datarow" :row-number="index" :numberDays='3' ></MonitorListEntry>
  </div>
</template>

<script>
    import axios from 'axios';
    import {apiHost, organization} from "../config";
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
            executeRouteChange() {
              this.$router.push(
                {
                  name : 'monitoruserlist',
                  params : {
                    page : this.pagenumber,
                    number : this.nbruser
                  }
                });
            },
            changeSelectNbr() {
              return this.getNumberPages()
              .then( () => {
                if (this.pagenumber > this.pagenbroptions.length) {
                  this.pagenumber = 1;
                }

                this.changeSelect();
              })
              .catch( (err) => {
                this.messages += err;
              });



            },
            changeSelect() {
              //this.messages = '';
              var refThis = this;
              var prom = new Promise( function(resolve) {
                if ( refThis.userdata.length > 0 ) {
                  refThis.userdata.splice(0, refThis.userdata.length);

                }

                refThis.componentInit = true;
                resolve(true);
              });

              prom.then( () => {
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
              return axios.get( apiHost + '/rest/moderation/users/count.php?orgacode=' + organization)
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
            },
            fxMounted() {
              let page = 1;
              let number = 5;
              if (this.$route.params) {
                if ( this.$route.params.page ) {
                  page = this.$route.params.page;

                }
                if ( this.$route.params.number) {
                  number = this.$route.params.number;
                }
              }


              this.nbruser = number;
              this.pagenumber = page;

              this.changeSelectNbr();
            }
        },

        mounted() {
          this.fxMounted();
        },

        watch:{
    //$route (to, from){
    $route: function() {
        this.fxMounted();
    }
}
    }
</script>

<style scoped>

</style>
