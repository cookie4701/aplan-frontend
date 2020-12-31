<template>
  <div class="fluid-container">
    <form class="login" @submit.prevent="login">
      <div class="row">
        <div class="col">
          Login
        </div>
      </div>

      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <label for="username">Benutzername</label>
        </div>
        <div class="col-sm">
          <input id="username" type="text" required v-model="username" />
        </div>
        <div class="col-sm"></div>
      </div>

      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <label for="password">Passwort</label>
        </div>
        <div class="col-sm">
          <input id="password" type="password" required v-model="password" />
        </div>
        <div class="col-sm"></div>
      </div>

      <button type="submit">Login</button>

    </form>
  </div>
</template>

<script>
export default {
  data()  {
    return {
      username : "",
      password : ""
    }
	},
	name : 'login',

  methods : {
    login: function() {
      let username = this.username;
      let password = this.password;
      this.$store.dispatch('login', {username, password})
      .then ( () => this.$router.push('/'))
      .catch( () => {
				/* console.log(err); */
      });
    }
  }
}

</script>
