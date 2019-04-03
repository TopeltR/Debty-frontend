import Contacts from '@/views/Contacts.vue'
import userStore from '@/stores/UserStore.ts'
import Vue from "vue";
import {mount} from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";


describe('Contacts', () => {
    Vue.use(BootstrapVue);
    console.error = jest.fn();
    console.warn = jest.fn();

    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));
    const contactsList = [{id: 2}, {id: 3}];
    const get = jest.fn(() => Promise.resolve({data: contactsList}));
    const post = jest.fn();
    const del = jest.fn();
    Vue.prototype.$http = {get, post, delete: del};

    describe('getContacts', () => {
        it('should get all availableContacts from /contact/all/{id}', async () => {
            const contacts =  mount(Contacts);

            await await contacts.vm.getContacts();

            expect(get).toHaveBeenCalledWith('/contact/all/1');
            expect(contacts.vm.availableContacts).toEqual(contactsList);
        })
    });

    describe('getWaitingContacts', () => {
        it('should get requests from /contact/waiting/{id}', async () => {
            const contacts = mount(Contacts);

            await contacts.vm.getWaitingContacts();

            expect(get).toHaveBeenCalledWith('/contact/waiting/1');
            expect(contacts.vm.requests).toEqual(contactsList.map((c) => ({...c, type: 'Incoming'})));
        })
    });

    describe('getPersonContacts', () => {
        it('should get user contacts from /contact/id/{id}', async () => {
            const contacts = mount(Contacts);

            await contacts.vm.getPersonContacts();

            expect(get).toHaveBeenCalledWith('/contact/id/1');
            expect(contacts.vm.userContacts).toEqual(contactsList)
        })
    });

    describe('addContact', () => {
        it('should post to /contact/add/{user-id}/{contact-id}', async () => {
            const contacts = mount(Contacts);
            contacts.vm.contact = {id: 5};

            await contacts.vm.addContact();

            expect(post).toHaveBeenCalledWith('/contact/add/1/5');
        })
    });

    describe('acceptContact', () => {
        it('should post to /contact/accept/{user-id}/{id}', async () => {
            const contacts = mount(Contacts);

            await contacts.vm.acceptContact(5);

            expect(post).toHaveBeenCalledWith('/contact/accept/1/5')
        })
    });

    describe('removeRequest', () => {
        it('should delete from /contact/remove/{user-id}/{contact-id}', async () => {
            const contacts = mount(Contacts);

            await contacts.vm.removeRequest({id: 5});

            expect(del).toHaveBeenCalledWith('/contact/remove/1/5');
        })
    });

    it('should render', () => {
        const contacts = mount(Contacts);

        expect(contacts.html()).toMatchSnapshot();
    })
});
