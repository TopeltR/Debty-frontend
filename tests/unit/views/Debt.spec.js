import Debt from '@/views/Debt.vue'
import Vue from 'vue';
import {mount} from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';

describe('Debt', () => {
    Vue.use(BootstrapVue);
    console.error = jest.fn();
    console.warn = jest.fn();

    const debtObject = {payer: {id: 5}, owner: {id: 6}, receiver: {id: 7}};
    const get = jest.fn(() => Promise.resolve({data: debtObject, }));
    const post = jest.fn();
    const del = jest.fn();
    Vue.prototype.$http = {get, post, delete: del};

    describe('loadDebt', () => {
        it('should get debts from debts/{debt-id}', async () => {
            const debt = mount(Debt);
            debt.vm.debtId = 1;

            await debt.vm.loadDebt();

            expect(get).toHaveBeenCalledWith('/debts/1');
            expect(debt.vm.debt).toEqual(debtObject);
        });
    });

    describe('save', () => {
        it('should post debt to /debts/', async () => {
            const debt = mount(Debt);

            await debt.vm.loadDebt();
            await debt.vm.save();

            expect(post).toHaveBeenCalledWith('/debts/', debtObject);
        })
    });

    it('should render', () => {
        const debt = mount(Debt);

        expect(debt.html()).toMatchSnapshot();
    });
});
