import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {
    faArrowDown,
    faArrowRight,
    faArrowUp,
    faCheck,
    faEdit,
    faEnvelope,
    faInfoCircle,
    faPlus,
    faSave,
    faSignOutAlt,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

library.add(faEdit);
library.add(faSave);
library.add(faPlus);
library.add(faArrowRight);
library.add(faArrowDown);
library.add(faArrowUp);
library.add(faInfoCircle);
library.add(faCheck);
library.add(faTimes);
library.add(faEnvelope);
library.add(faSignOutAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
