
import AddBankAccount from '@/components/AddBankAccount';
import {mount} from "@vue/test-utils";
import userStore from '@/stores/UserStore'
import {Vue} from "vue-property-decorator";
import BootstrapVue from 'bootstrap-vue';


describe('AddBankAccount.vue', () => {
    Vue.use(BootstrapVue);

    const bankAccount = {name: 'Name', number: 123};
    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));

    describe('saveBankAccount', () => {
        it('should make post request to address /users/bankAccount/{id} with bankAccount and call cancel', async () => {
            const addBankAccount = mount(AddBankAccount);
            const cancel = jest.spyOn(addBankAccount.vm, 'cancel');
            const post = jest.fn(() => Promise.resolve());
            addBankAccount.vm.$http = {post};
            addBankAccount.vm.bankAccount = bankAccount;

            await addBankAccount.vm.saveBankAccount();

            expect(post).toHaveBeenCalledWith('/users/bankAccount/1', bankAccount);
            expect(cancel).toHaveBeenCalled();
        })
    });

    const mockModal = (addBankAccount) => {
        const show = jest.fn();
        const hide = jest.fn();
        addBankAccount.vm.$refs.modal = {show, hide};
        return {show, hide};
    };

    describe('cancel', () => {
        it('should set state.showing to false', () => {
            const addBankAccount = mount(AddBankAccount);
            mockModal(addBankAccount);
            addBankAccount.vm.state.showing = true;
            addBankAccount.vm.cancel();

            expect(addBankAccount.vm.state.showing).toBe(false);
        })
    });

    describe('watch', () => {
        const addBankAccount = mount(AddBankAccount);
        const {show, hide} = mockModal(addBankAccount);
        it('should call modal.show when state.showing changes to true', () => {
            addBankAccount.vm.state.showing = false;
            addBankAccount.vm.state.showing = true;
            expect(show).toHaveBeenCalled();
        });

        it('should call modal.hide when state.showing changes to false', () => {
            addBankAccount.vm.state.showing = true;
            addBankAccount.vm.state.showing = false;
            expect(hide).toHaveBeenCalled();
        })
    });

    it('should render', () => {
        expect(mount(AddBankAccount).html()).toMatchSnapshot();
    })
});
