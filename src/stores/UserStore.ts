import User from '@/entities/User';

import axios from 'axios';


class UserStore {
    private user: User | undefined;

    constructor() {
        this.user = undefined;
    }

    public setUser(user: User) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    public async getUser() {
        if (this.user === undefined) {
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
}

const userStore = new UserStore();

export default userStore;
