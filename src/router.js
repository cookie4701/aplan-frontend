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
import MonitorUserTimeModification from "./components/MonitorUserTimeModification";
import MonitorUserFreeze from "./components/MonitorUserFreeze";
import Stats from "./components/Stats";
import Businesstrip from "./components/Businesstrip";
import MonitorPeriodCreate from "./components/MonitorPeriodCreate";
import MonitorPeriodList from "./components/MonitorPeriodList";
import MonitorPeriod from "./components/MonitorPeriod";
import MonitorUserSchedulesList from "./components/MonitorUserSchedulesList";
import MonitorUserHollidayPeriods from "./components/MonitorUserHollidayPeriods";
import MonitorUserVacationPeriods from "./components/MonitorUserVacationPeriods";


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
      path : '/monitoruserlist/:page?/:number?',
      name : 'monitoruserlist',
      props : true,
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
    },
    {
      path : '/monitoruser/timebonus/:id',
      name : 'timemodification',
      component : MonitorUserTimeModification,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/monitoruser/freeze/:id',
      name : 'freezeinupt',
      component : MonitorUserFreeze,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/selfstat',
      name : 'selfstat',
      component : Stats,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/businesstrip',
      name : 'businesstrip',
      component : Businesstrip,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/monitoring/period/create',
      name : 'monitorperiodcreate',
      component : MonitorPeriodCreate,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/monitoring/period/list',
      name : 'monitorperiodlist',
      component : MonitorPeriodList,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/monitoring/period',
      name : 'monitorperiod',
      component : MonitorPeriod,
      meta : {
        requiresAuth : true
      }
    },
    {
      path : '/monitoring/schedules/:userId',
      name : 'schedulesuser',
      component : MonitorUserSchedulesList,
      meta : {
        requiresAuth : true
      }
    },
      {
        path : '/monitoring/hollidays/:userId',
        name : 'hollidaysuser',
        component : MonitorUserHollidayPeriods,
        meta : {
          requiresAuth : true
        }
      },
      {
        path : '/monitoring/vacation/:userId',
        name : 'vacationuser',
        component : MonitorUserVacationPeriods,
        meta : {
          requiresAuth : true
        }
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
