import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store.js'
import Home from './views/Home.vue'
import Login from './components/Login.vue'
import Secure from './components/Secure.vue'
import Register from './components/Register.vue'
import About from './components/About.vue'
import UserSetup from "./components/UserSetup";
import EnterWorktime from "./components/EnterWorktime";
import MonitorUserList from "./components/MonitorUserList";
import MonitorSingleUser from "./components/MonitorSingleUser";

Vue.use(Router)

let router = new Router({
        mode: 'history',
        routes: [
                {
                        path: '/',
                        name: 'home',
                        component: Home
                },
                {
                        path: '/login',
                        name: 'login',
                        component: Login
                },

                {
                        path: '/register',
                        name: 'register',
                        component: Register
                },
                {
                        path: '/secure',
                        name: 'secure',
                        component: Secure,
                        meta: { 
                                requiresAuth: true
                        }
                },
                {
                        path : '/userinfo',
                        name : 'userinfo',
                        component : UserSetup,
                        meta : {
                                requiresAuth: true
                        }
                },
                {
                        path : '/worktimeinput',
                        name : 'worktimeinput',
                        component : EnterWorktime,
                        meta : {
                                requiresAuth: true
                        }
                },
                {
                        path : '/monitoruserlist',
                        name : 'monitoruserlist',
                        component : MonitorUserList,
                        meta : {
                                requiresAuth: true
                        }
                },
                {
                        path : '/monitoruser/:id',
                        name : 'monitoruser',
                        component : MonitorSingleUser,
                        meta : {
                                requiresAuth: true
                        }
                },
                {
                        path: '/about',
                        name: 'about',
                        component: About
                }
        ]
})

router.beforeEach((to, from, next) => {
        if(to.matched.some(record => record.meta.requiresAuth)) {
                if (store.getters.isLoggedIn) {
                        next()
                        return
                }
                next('/login') 
        } else {
                next() 
        }
})

export default router
