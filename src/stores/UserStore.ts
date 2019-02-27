import User from '@/entities/User';

import axios, {AxiosPromise} from 'axios';

interface UserPromise {
    then: Function;
    catch: Function;
}

class UserStore {
    private user: User | undefined;

    constructor() {
        this.user = undefined;
    }

    public setUser(user: User) {
        this.user = user;
    }

    public getUser(): UserPromise {
        if (this.user === undefined) {
            const promise = axios.get('/users/loggedInUser');
            return {
                then: (onfulfilled: any) => {
                    promise.then((response) => {
                        onfulfilled(User.from(response.data));
                    });
                    return this;
                },
                catch: (onrejected: any) => {
                    promise.catch(onrejected);
                    return this;
                },
            };
        } else {
            const user = this.user;
            return {
                then: (onfulfilled: any) => {
                    onfulfilled(user);
                    return this;
                },
                catch: (onrejected: any) => {
                    onrejected(user);
                    return this;
                },
            };
        }

    }
}

const userStore = new UserStore();

export default userStore;
