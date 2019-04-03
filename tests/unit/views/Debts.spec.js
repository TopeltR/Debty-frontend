import Debts from '@/views/Debts.vue'
import Vue from "vue";
import {mount} from '@vue/test-utils';
import userStore from '@/stores/UserStore.ts';
import BootstrapVue from 'bootstrap-vue';

describe('Debts', () => {
    Vue.use(BootstrapVue);
    console.error = jest.fn();
    console.warn = jest.fn();

    const debtObject = {payer: {id: 1}, owner: {id: 6}, receiver: {id: 7}};
    const get = jest.fn(() => Promise.resolve({data: [debtObject]}));
    const post = jest.fn();
    const del = jest.fn();
    Vue.prototype.$http = {get, post, delete: del};

    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));

    describe('getDebts', () => {
        it('should get /debts/user/{user-id}', async () => {
            const debts = await mount(Debts);

            debts.vm.user = {id: 1};
            await debts.vm.getDebts();

            expect(get).toHaveBeenCalledWith('/debts/user/1');
            expect(debts.vm.debts).toEqual([debtObject]);

        })
    });

    it('should render', () => {
        const debts = mount(Debts);

        expect(debts.html()).toMatchSnapshot();
    })
});
