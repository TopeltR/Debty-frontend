import User from '@/entities/User';

import axios from 'axios';


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

    public alertUserNotLoggedIn() {
        if (!this.alerted) {
            alert('You are not logged in!');
            this.alerted = true;
        }
    }
}

const userStore = new UserStore();

export default userStore;
