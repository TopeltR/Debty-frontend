import {AxiosInstance} from 'axios';
import {Library} from '@fortawesome/fontawesome-svg-core';
import userStore from '@/stores/UserStore';
import router from '@/router';
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

export default class Config {
    private axios: AxiosInstance;
    private faLibrary: Library;

    constructor(axios: AxiosInstance, faLibrary: Library) {
        this.axios = axios;
        this.faLibrary = faLibrary;
    }

    public configure() {
        this.configureAxios();
        this.configureFa();
    }

    private configureAxios() {
        this.axios.defaults.baseURL = 'http://ec2-3-93-154-97.compute-1.amazonaws.com:8080';
        //this.axios.defaults.baseURL = 'http://localhost:8080';
        this.axios.defaults.withCredentials = true;
        this.axios.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            const path = JSON.parse(error.request.responseText).path;
            if (!['/users/loggedIn'].includes(path) && error.response.status === 401) {
                userStore.alertUserNotLoggedIn();
                router.push('/');
                return Promise.reject(error);
            }
        });
    }

    private configureFa() {
        this.faLibrary.add(faEdit);
        this.faLibrary.add(faSave);
        this.faLibrary.add(faPlus);
        this.faLibrary.add(faArrowRight);
        this.faLibrary.add(faArrowDown);
        this.faLibrary.add(faArrowUp);
        this.faLibrary.add(faInfoCircle);
        this.faLibrary.add(faCheck);
        this.faLibrary.add(faTimes);
        this.faLibrary.add(faEnvelope);
        this.faLibrary.add(faSignOutAlt);
    }
}
