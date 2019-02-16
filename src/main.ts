import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

axios.defaults.baseURL = "http://localhost:8080";

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
