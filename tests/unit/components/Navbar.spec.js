import Navbar from "@/components/Navbar";
import userStore from '@/stores/UserStore'
import {mount} from "@vue/test-utils";
import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';

describe('Navbar', () => {
    Vue.use(BootstrapVue);
    console.error = jest.fn();

    const get = jest.fn(() => Promise.resolve({data: [1, 2, 3]}));
    Vue.prototype.$http = {get};
    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));

    describe('getNotificationCount', () => {
        it('should request friend requests from /contact/waiting/{user.id} and set notificationAmount to length of returned array', async () => {
            const navbar = mount(Navbar);
            await Vue.nextTick();

            await navbar.vm.getNotificationCount();

            expect(get).toHaveBeenCalledWith('/contact/waiting/1');
            expect(navbar.vm.notification).toBe(true);
            expect(navbar.vm.notificationAmount).toBe(3);
        })
    });

    it('should render', () => {
        const navbar = mount(Navbar);

        expect(navbar.html()).toMatchSnapshot();
    })
});
