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

    /*public getUser(): UserPromise {
        if (this.user === undefined) {
            const promise = axios.get('/users/loggedIn');
            const userPromise = {
                then: (onfulfilled: any) => {
                    promise.then((response) => {
                        onfulfilled(User.from(response.data));
                    });
                    return userPromise;
                },
                catch: (onrejected: any) => {
                    promise.catch(onrejected);
                    return userPromise;
                },
            };
            return userPromise;
        } else {
            const user = this.user;
            const userPromise = {
                then: (onfulfilled: any) => {
                    onfulfilled(user);
                    return userPromise;
                },
                catch: (onrejected: any) => {
                    onrejected(user);
                    return userPromise;
                },
            };
            return userPromise;
        }

    }*/
}

const userStore = new UserStore();

export default userStore;
