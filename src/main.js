import {createApp} from 'vue'

import App from './App.vue';
import router from './router';
import store from './store/store';

import { jwtInterceptor } from './helper';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

//import EnterWorkday from './components/EnterWorkday.vue';


jwtInterceptor();

const app = createApp(App);
app.use(store);
app.use(router);

const rootComponent = app.mount('#app');
