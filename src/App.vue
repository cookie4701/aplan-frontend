<template>
        <div id="app">
                <div id="nav" class="">
                        <ul id="mainnav">
                                <li class="btn btn-light"><router-link to="/">Home</router-link></li>

                                        <li v-if="isLoggedIn" class="btn btn-light"><router-link to="/secured">Securedpage</router-link></li>
                                        <li v-if="isLoggedIn" class="btn btn-light"><router-link to="/userinfo">Benutzerinformationen</router-link></li>
                                        <li v-if="isLoggedIn" class="btn btn-light"><router-link to="/worktimeinput">Erledigte Arbeit eintragen</router-link></li>
                                        <li v-if="isLoggedIn" class="btn btn-light"><router-link to="/monitoruserlist">Moderation</router-link></li>
                                        <li v-if="isLoggedIn" class="btn btn-light"><a  @click="logout">Logout</a> </li>

                                        <li v-if="!isLoggedIn" class="btn btn-light"><router-link to="login">Login</router-link></li>
                        </ul>
                </div>
                <router-view/>
        </div>
</template>

<script>

export default {
        name: 'app',
        computed : {
                isLoggedIn : function() {return this.$store.getters.isLoggedIn}
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
