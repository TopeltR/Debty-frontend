import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import Vuelidate from 'vuelidate';
// import VuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

axios.defaults.baseURL = 'http://localhost:8080';

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Vuelidate);
/*Vue.use(VuelidateErrorExtractor, {
    i18n: false,
    messages: {
        required: '{attribute} is required!',
        isJoe: '{attribute} must be Joe',
        email: '{attribute} is not a valid email address.'
    }
});

Vue.component('form-group', templates.singleErrorExtractor.foundation6);*/


new Vue({
    router,
    render: (h) => h(App),
}).$mount('#app');
