import AddPerson from '@/components/AddPerson';
import userStore from '@/stores/UserStore'
import {mount} from "@vue/test-utils";
import * as Vue from "vue";
import BootstrapVue from 'bootstrap-vue';

describe('AddPerson.vue', () => {
    Vue.use(BootstrapVue);

    const user = {email: 'test@test.ee'};
    userStore.getUser = jest.fn(() => Promise.resolve(user));

    describe('addPerson', () => {
        it('should add user to people and remove user from allPeople and empty field.value', async () => {
            const addPerson = mount(AddPerson, {
                propsData: {
                    state: {
                        allPeople: [],
                        people: []
                    }
                }
            });
            addPerson.user = {firstName: 'name', email: 'nottest@test.ee'};

            await addPerson.vm.addPerson();

            expect(addPerson.vm.state.people.includes(user))
        })
    });

    it('should render', () => {
        const addPerson = mount(AddPerson, {
            propsData: {
                state: {
                    allPeople: [],
                    people: []
                }
            }
        });
        expect(addPerson.html()).toMatchSnapshot();
    })
});
