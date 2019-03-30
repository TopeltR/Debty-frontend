import CreateDebt from '@/views/CreateDebt';
import userStore from '@/stores/UserStore'
import {mount} from "@vue/test-utils";
import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import router from '@/router.ts';

describe('CreateDebt', () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    Vue.use(BootstrapVue);
    const get = jest.fn(() => Promise.resolve({
        data: [
            {id: 2, email: 'user2@email.com'},
            {id: 1, email: 'user1@email.com'}
        ]
    }));
    const post = jest.fn(() => Promise.resolve({data: {id: 5}}));
    Vue.prototype.$http = {get, post};

    const user = {id: 1, firstName: 'first', email: 'user1@email.com'};
    userStore.getUser = jest.fn(() => Promise.resolve(user));

    describe('mounted', () => {
        it('should set formData receiver and owner and user, userName', async () => {
            const createDebt = mount(CreateDebt);

            await Vue.nextTick();

            expect(createDebt.vm.formData.receiver).toEqual(user);
            expect(createDebt.vm.formData.owner).toEqual(user);
            expect(createDebt.vm.user).toEqual(user);
            expect(createDebt.vm.userName).toEqual('first');
        });

        it('should request user contacts', async () => {
            const createDebt = mount(CreateDebt);

            await Vue.nextTick();
            await Vue.nextTick();

            expect(get).toHaveBeenCalledWith('/contact/id/1');
            expect(createDebt.vm.contacts).toEqual([{id: 2, email: 'user2@email.com'}])
        })
    });

    describe('createDebt', () => {
        it('should post debt and redirect to debts page', async () => {
            router.push = jest.fn();
            const createDebt = mount(CreateDebt);
            createDebt.vm.formData.payer = user;

            await createDebt.vm.createDebt();

            expect(post).toHaveBeenCalledWith('/debts', {
                owner: {
                    email: "user1@email.com",
                    firstName: "first",
                    id: 1
                },
                payer: {email: "user1@email.com", firstName: "first", id: 1},
                receiver: {email: "user1@email.com", firstName: "first", id: 1},
                sum: null,
                title: ""
            });
            expect(router.push).toHaveBeenCalledWith('/debts/5');
        })
    });

    it('should render', () => {
        const createDebt = mount(CreateDebt);

        expect(createDebt.html()).toMatchSnapshot();
    })
});
