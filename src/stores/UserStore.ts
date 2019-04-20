import User from '@/entities/User';

import axios from 'axios';
import router from '@/router';


class UserStore {
    private user: User | null;
    private alerted: boolean;

    constructor() {
        this.user = null;
        this.alerted = false;
    }

    public setUser(user: User) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.alerted = false;
    }

    public async getUser() {
        if (this.user === null) {
            const userFromLocalStorage = localStorage.getItem('user');
            if (userFromLocalStorage === null) {
                const response = await axios.get('/users/loggedIn');
                this.user = User.from(response.data);
            } else {
                this.user = User.from(JSON.parse(userFromLocalStorage));
            }
        }
        return this.user;
    }

    public async isLoggedIn() {
        try {
            await this.getUser();
        } catch (e) {
            return false;
        }
        return true;
    }

    public async logIn(email: string, password: string) {
        const bodyFormData = new FormData();
        bodyFormData.set('username', email);
        bodyFormData.set('password', password);

        const response = await axios.post('/login', bodyFormData, {headers: {'Content-Type': 'multipart/form-data'}});
        const {data: user} = await axios.get('/users/email/' + email);
        this.setUser(User.from(user));
        router.push('/home');
    }

    public async logOut() {
        await axios.post('/users/signout');
        localStorage.removeItem('user');
        this.user = null;
        router.push('/');
    }

    public alertUserNotLoggedIn() {
        if (!this.alerted) {
            alert('You are not logged in!');
            this.alerted = true;
        }
    }
}

const userStore = new UserStore();

export default userStore;
