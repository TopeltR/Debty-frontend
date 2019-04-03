import Events from '@/views/Events.vue'
import Vue from 'vue';
import {mount} from '@vue/test-utils';
import userStore from '@/stores/UserStore.ts';
import BootstrapVue from 'bootstrap-vue';

describe('Events', () => {
    Vue.use(BootstrapVue);
    console.error = jest.fn();
    console.warn = jest.fn();

    const get = jest.fn(() => Promise.resolve({data: [{id: 2}]}));
    const post = jest.fn();
    const del = jest.fn();
    Vue.prototype.$http = {get, post, delete: del};

    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));

    describe('getEvents', () => {
        it('should get all user events', async () => {
            const events = mount(Events);

            await events.vm.getEvents();

            expect(get).toHaveBeenCalledWith('/events/user/1');
            expect(events.vm.events).toEqual([{id: 2}]);
        })
    });

    it('should render', () => {
        const events = mount(Events);

        expect(events.html()).toMatchSnapshot();
    })
});
