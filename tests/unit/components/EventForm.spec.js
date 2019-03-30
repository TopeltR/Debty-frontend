import EventForm from '@/components/EventForm';
import userStore from '@/stores/UserStore'
import {mount} from "@vue/test-utils";
import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';

describe('EventForm', () => {
    Vue.use(BootstrapVue);
    console.warn = jest.fn();
    console.error = jest.fn();

    describe('mounted', () => {
        it('should get event info if eventId is specified', async () => {
            const get = jest.fn(() => Promise.resolve({
                data: {
                    title: 'title',
                    description: 'desc',
                    people: [],
                    bills: []
                }
            }));
            Vue.prototype.$http = {get};

            const eventForm = mount(EventForm, {propsData: {eventId: 1, buttons: []}});

            await Vue.nextTick();

            expect(get).toHaveBeenCalledWith('/events/1');
            expect(eventForm.vm.title).toBe('title');
            expect(eventForm.vm.description).toBe('desc');
            expect(eventForm.vm.people).toEqual([]);
            expect(eventForm.vm.bills).toEqual([]);
        });

        it('should get user contacts and save them into allPeople', async () => {
            userStore.getUser = jest.fn(() => Promise.resolve({id: 1, email: 'user@email.com'}));
            const contacts = [{id: 2, email: 'notuser@email.com'}];
            const get = jest.fn(() => Promise.resolve({data: contacts}));
            Vue.prototype.$http = {get};

            const eventForm = mount(EventForm, {propsData: {buttons: []}});

            await Vue.nextTick();
            expect(get).toHaveBeenCalledWith('/contact/id/1');
            await Vue.nextTick();
            expect(eventForm.vm.allPeople).toEqual(contacts)
        })
    });

    it('should render', () => {
        const eventForm = mount(EventForm);

        expect(eventForm.html()).toMatchSnapshot();
    })
});
