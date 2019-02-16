import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

axios.defaults.baseURL = "http://localhost:8080";

axios.interceptors.response.use(response => response,
    error => {
        const {status} = error.response;
        if (status !== 401) {
            //return Promise.reject(error.response);
        }
    }
);

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
