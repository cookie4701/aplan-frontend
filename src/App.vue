<template>

  <div id="app" class="container-fluid">
    <div class="row d-print-none">
      <b-button v-if="isLoggedIn" to="/" class="col m-md-2" variant="primary">Home</b-button>
      <b-button v-if="isLoggedIn" to="worktimeinput" class="col m-md-2" variant="primary">Erledigte Arbeit eintragen</b-button>
      <b-button v-if="isLoggedIn" to="userinfo" class="col m-md-2" variant="primary">Benutzerinformationen anpassen</b-button>
      <b-button v-if="isLoggedIn" to="selftstat" class="col m-md-2" variant="primary">Statistik</b-button>
      <b-button v-if="isLoggedIn" to="businesstrip" class="col m-md-2" variant="primary">Fahrten</b-button>

      <b-dropdown id="dropdownmoderation" text="Moderation" class="m-md-2 col btn btn-secondary">
        <b-dropdown-item>
          <router-link :to="{ name: 'monitoruserlist'}">Nutzer moderieren</router-link>
        </b-dropdown-item>

        <b-dropdown-item>
          <router-link :to="{ name: 'monitorperiodcreate'}">Allgemeinen Arbeitszeitraum festlegen</router-link>
        </b-dropdown-item>

        <b-dropdown-item>
          <router-link :to="{ name: 'monitorperiodlist'}">Allgemeine Arbeitszeiträume anzeigen</router-link>
        </b-dropdown-item>

        <b-dropdown-item>
          <router-link :to="{ name: 'monitorperiod'}">Allgemeine Arbeitszeiträume</router-link>
        </b-dropdown-item>

      </b-dropdown>

      <b-button v-if="isLoggedIn" @click="logout" class="col m-md-2">Logout</b-button>
      <b-button v-if="!isLoggedIn" class="btn btn-light col m-md-2" to="login">Login</b-button>
    </div>

    <div class="row">
      <router-view/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  computed : {
    isLoggedIn : function() {return this.$store.getters.isLoggedIn}
  },
  data : function() {
    return {
      message : ''
    };
  },

  methods : {
    logout : function() {
      this.$store.dispatch('logout')
      .then( () => {
        this.$router.push('/login')
      })
    }
  },
  components: {

  },

  created : function() {
    document.title = 'Timesheet';
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err;
      });
    });
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#mainnav li div { display: inline;}

.shortinput {
  width: 6ch;
}


</style>
