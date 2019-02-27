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

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'


library.add(faEdit);
library.add(faSave);
Vue.component('font-awesome-icon', FontAwesomeIcon);

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Vuelidate);

Vue.prototype.user = undefined;

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
