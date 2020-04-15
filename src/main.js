import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

import { LinkPlugin, ButtonPlugin, BootstrapVue, DropdownPlugin} from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const token = localStorage.getItem('user-token');

if (token) {
        Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

Vue.config.productionTip = false;
Vue.use(DropdownPlugin);
Vue.use(ButtonPlugin);
Vue.use(LinkPlugin);

new Vue({
        router,
        store,
        BootstrapVue,
        render: h => h(App),
}).$mount('#app')
