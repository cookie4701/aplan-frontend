<template>

  <div id="app" class="container-fluid">
    <div class="row d-print-none">
      <button @click='go_home' v-if="isLoggedIn" class="col m-md-2 btn btn-primary" variant="primary">Home</button>
      <button @click="enter_worktime"  v-if="isLoggedIn" class="col m-md-2 btn btn-primary" variant="primary">Erledigte Arbeit eintragen</button>
      <button @click="enter_userinfo" v-if="isLoggedIn" class="col m-md-2 btn btn-primary" variant="primary">Benutzerinformationen anpassen</button>
      <button v-if="isLoggedIn" to="/selfstat" class="col m-md-2 btn btn-primary" variant="primary">Statistik</button>
      <button v-if="isLoggedIn" to="/businesstrip" class="col m-md-2" variant="primary">Fahrten</button>

      <button id="dropdownmoderation" data-bs-target='#monitor_target' data-bs-toggle="collapse" class="m-md-2 col btn btn-primary" v-if="isModerator">Moderation</button>

<div id='monitor_target'>
	<button @click='' class="btn btn-secondary">Nutzer moderieren</button>
	<button @click='' class="btn btn-secondary">Allgemeine Arbeitszeiträume festlegen</button>
	<button @click='' class="btn btn-secondary">Allgemeine Arbeitszeiträume anzeigen</button>
	<button @click='' class="btn btn-secondary">Allgemeine Arbeitszeiträume</button>

</div>

      <button v-if="isLoggedIn" @click="logout" class="col m-md-2">Logout</button>
	<button v-if="!isLoggedIn" @click="login_do" class="btn btn-primary">Login</button>
 
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
		isLoggedIn : function() {return this.$store.getters.isLoggedIn},
		isModerator : function() { return this.$store.getters.isModerator}
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
    },

	login_do() {
		this.$router.push('/login');
	},
	enter_worktime() {
		console.log('executing enter_worktime');
		this.$router.push('/worktimeinput');
	},
	enter_userinfo() {
		this.$router.push('/userinfo');
	},
	go_home() {
		this.$router.push('home');
	},
  },
  components: {

  },

  created : function() {
    document.title = 'Timesheet';
	/*
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch('logout')
        }
        throw err;
      });
    });
	*/
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
