
import AddBankAccount from '@/components/AddBankAccount';
import {mount} from "@vue/test-utils";
import userStore from '@/stores/UserStore'
import {Vue} from "vue-property-decorator";


describe('AddBankAccount.vue', () => {
    const bankAccount = {name: 'Name', number: 123};
    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));

    describe('saveBankAccount', () => {
        it('should make post request to address /users/bankAccount/{id} with bankAccount and call cancel', async () => {
            const addBankAccount = mount(AddBankAccount);
            const post = jest.fn(() => Promise.resolve());
            addBankAccount.vm.$http = {post};
            addBankAccount.vm.bankAccount = bankAccount;
            addBankAccount.vm.saveBankAccount();
            const cancel = jest.spyOn(addBankAccount.vm, 'cancel');

            await Vue.nextTick();
            expect(post).toHaveBeenCalledWith('/users/bankAccount/1', bankAccount);
            expect(cancel).toHaveBeenCalled();
        })
    });

});
