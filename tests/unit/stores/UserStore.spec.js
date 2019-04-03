import userStore from '@/stores/UserStore.ts'
import axios from 'axios';

describe('UserStore', () => {
    axios.get = jest.fn(() => Promise.resolve({data: {id: 1}}));
    it('should request logged in user', async () => {
        const user = await userStore.getUser();

        expect(axios.get).toHaveBeenCalledWith('/users/loggedIn');
        expect(user).toEqual({id: 1});

        const user2 = await userStore.getUser();
        expect(axios.get).toBeCalledTimes(1);
        expect(user2).toEqual(user);
    })
});
