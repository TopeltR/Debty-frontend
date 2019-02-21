import User from '@/entities/User';

class UserStore {
    private user: User | undefined;

    constructor() {
        this.user = undefined;
    }

    public setUser(user: User) {
        this.user = user;
    }

    public getUser(): User | undefined {
        return this.user;
    }
}

const userStore = new UserStore();

export default userStore;
