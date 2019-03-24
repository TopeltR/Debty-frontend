import User from '@/entities/User';

import axios, {AxiosPromise} from 'axios';


class UserStore {
    private user: User | undefined;

    constructor() {
        this.user = undefined;
    }

    public setUser(user: User) {
        this.user = user;
    }

    public async getUser() {
        if (this.user === undefined) {
            const response = await axios.get('/users/loggedIn');
            this.user = User.from(response.data);
        }
        return this.user;
    }
}

const userStore = new UserStore();

export default userStore;
