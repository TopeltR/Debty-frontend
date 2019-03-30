import AddBill from '@/components/AddBill';
import {mount} from "@vue/test-utils";
import userStore from '@/stores/UserStore';
import {Vue} from "vue-property-decorator";
import BootstrapVue from 'bootstrap-vue';
import App from "@/App";

describe('AddBill', () => {
    Vue.use(BootstrapVue);
    Vue.use(App);

    console.error = jest.fn();
    console.warn = jest.fn();

    userStore.getUser = jest.fn(() => Promise.resolve({id: 1}));

    describe('updateBuyer', () => {
        it('should add buyer into addPersonState.people and bill.buyer and empty buyer', () => {
            const addBill = mount(AddBill, {
                propsData: {
                    state: {},
                    selectedBill: {},
                    event: {}
                }
            });
            addBill.vm.$http = {get: jest.fn(() => Promise.resolve({data: []}))};
            addBill.vm.bill = {buyer: {}};
            const buyer = {firstName: 'first name'};
            addBill.vm.buyer = buyer;

            addBill.vm.updateBuyer();

            expect(addBill.vm.addPersonState.people.includes(buyer));
            expect(addBill.vm.buyer).toEqual({});
            expect(addBill.vm.bill.buyer).toEqual(buyer);
        })
    });

    describe('save', () => {
        it('should transform bill and post bill to /events/{event.id}/bills', async () => {
            const addBill = mount(AddBill, {
                propsData: {
                    state: {},
                    selectedBill: {},
                    event: {}
                }
            });
            const bill = {title: 'title', description: 'description', people: [{id: 1}], billPayments: []};
            addBill.vm.bill = bill;
            const person = {id: 1, participation: 10};
            addBill.vm.addPersonState.people = [person];
            addBill.vm.event.id = 5;
            const bills = [{id: 3}];
            addBill.vm.$http = {post: jest.fn(() => Promise.resolve({data: {bills}}))};

            await addBill.vm.save();

            expect(addBill.vm.$http.post).toHaveBeenCalledWith('/events/5/bills', {
                ...bill,
                people: [person],
                billPayments: [{person, sum: 10}]
            });
            expect(addBill.vm.event.bills).toEqual(bills);
            expect(addBill.vm.state.showing).toBe(false);
        });
    });

    it('should render', () => {
        const addBill = mount(AddBill, {
            propsData: {
                state: {},
                selectedBill: {},
                event: {}
            }
        });

        expect(addBill.html()).toMatchSnapshot();
    })
});
