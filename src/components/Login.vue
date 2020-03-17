<template>
        <div>
                <form class="login" @submit.prevent="login">
                        <h1>Login</h1>
                        <label for="username">Benutzername</label>
                        <input id="username" type="text" required v-model="username" />

                        <label for="password">Passwort</label>
                        <input id="password" type="password" required v-model="password" />

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

        methods : {
                login: function() {
                        let username = this.username;
                        let password = this.password;
                        this.$store.dispatch('login', {username, password})
                                .then ( () => this.$router.push('/'))
                                .catch( () => {
                                        //console.log(err);
                                });
                }
        }
}

</script>
