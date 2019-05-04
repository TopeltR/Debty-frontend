<template>
    <div>
        <event-form v-if="editing" :eventId="event.id" :buttons="buttons"/>
        <div v-else>
            <navbar/>
            <background>
                <spinner :loaded="loaded">
                    <b-row>
                        <add-bill :key="selectedBillCount" :selectedBill="selectedBill" :state="seeBillState"
                                  :event="event"/>
                        <add-bill :key="addBillClickCount" :state="addBillState" :event="event"/>
                        <debt-distribution :state="debtDistributionState" :debts="debts" :eventId="event.id"/>
                        <b-col sm='12' md='6'>
                            <div class='pt-4'>
                                <h1>
                                <span class='p-0'>
                                    {{event.title}}
                                </span>
                                </h1>
                                <p>
                                <span>
                                    {{event.description}}
                                </span>
                                </p>
                            </div>
                        </b-col>
                        <b-col class="mt-md-4" sm='12' md='6'>
                            <h2>People</h2>
                            <div class='table-wrapper-scroll-y mt-0 mt-md-2'>
                                <table class='table bill-table'>
                                    <tbody>
                                    <tr v-for='person in event.people' :key="person.id">
                                        <td>{{person.firstName + ' ' + person.lastName}}
                                            <small v-if="isOwner(person)"> (owner)</small>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-col>
                    </b-row>
                    <b-row class="pt-2">
                        <b-col v-if="event.bills && event.bills.length > 0" cols="12">
                            <h2>Bills</h2>
                            <div class="bg-white rounded shadow p-3">
                                <table class='table table-hover'>
                                    <thead>
                                    <tr class='d-table-row'>
                                        <th scope='col'>Title</th>
                                        <th scope='col'>Sum</th>
                                        <th class='d-none d-md-table-cell' scope='col'>Buyer</th>
                                        <th class='d-none d-md-table-cell' scope='col'>Participants</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="bill in event.bills" :key="bill.id" v-if="bill !== undefined"
                                        @click="openBillModal(bill)">
                                        <td>{{bill.title}}</td>
                                        <td>{{bill.sum}} €</td>
                                        <td class='d-none d-md-table-cell'>{{bill.buyer.firstName}}
                                            {{bill.buyer.lastName}}
                                        </td>
                                        <td class='d-none d-md-table-cell'>{{bill.people.length}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-col>
                        <b-col v-if="event.closedAt == null">
                            <b-row>
                                <b-col v-if="isOwner(user)" md="2">
                                    <b-btn class="mt-4 w-100" variant="outline-danger"
                                           v-on:click='calculateDistributedDebts'>
                                        Close event...
                                    </b-btn>
                                </b-col>
                                <b-col v-if="isOwner(user)" cols="6" md="2">
                                    <b-btn class="mt-4 w-100" variant="outline-danger" v-on:click='deleteEvent'>Delete
                                    </b-btn>
                                </b-col>
                                <b-col v-if="isOwner(user)" cols="6" md="2">
                                    <b-btn class="mt-4 w-100" variant="outline-primary" v-on:click='editing = true'>Edit
                                    </b-btn>
                                </b-col>
                                <b-col md="2">
                                    <b-btn class="mt-4 mb-3 w-100" variant="outline-primary" v-on:click='addBill'>Add
                                        bill
                                    </b-btn>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col class="pb-5 mt-5" v-else>
                            This event has been closed.
                        </b-col>
                    </b-row>
                </spinner>
            </background>
        </div>
    </div>
</template>

<script>
    import router from '@/router.ts';
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import userStore from '@/stores/UserStore.ts';
    import EventForm from '@/components/EventForm.vue';
    import AddBill from '@/components/AddBill.vue';
    import DebtDistribution from '@/components/DebtDistribution.vue';
    import Spinner from '@/components/Spinner.vue';

    export default {
        name: 'Event',
        components: {Navbar, Background, EventForm, AddBill, DebtDistribution, Spinner},
        data: () => ({
            event: {
                id: null,
                title: null,
                description: null,
                owner: null,
                people: [],
                bills: [],
                createdAt: null,
                closedAt: null,
            },
            user: null,
            selectedBill: undefined,
            addBillClickCount: 0,
            selectedBillCount: 100,
            editing: false,
            addBillState: {showing: false},
            seeBillState: {showing: false},
            addBillStates: {},
            debtDistributionState: {showing: false},
            debts: [],
            loaded: false,
            buttons: [
                {
                    name: 'Save',
                    width: 6,
                    offset: 0,
                    variant: 'primary',
                    type: 'submit',
                    handler(eventForm, store) {
                        if (eventForm.title) {
                            store.getUser().then((user) => {
                                eventForm.$http.post('/events', {
                                    id: this.event.id,
                                    title: eventForm.title,
                                    people: eventForm.addPersonState.people,
                                    description: eventForm.description,
                                    bills: eventForm.bills,
                                    owner: user,
                                }).then((response) => {
                                    this.event = response.data;
                                    this.editing = false;
                                });
                            });
                        }
                    },
                },
                {
                    name: 'Cancel',
                    width: 6,
                    offset: 0,
                    variant: 'secondary',
                    type: '',
                    handler() {
                        this.editing = false;
                    },
                },
            ],
        }),
        async mounted() {
            this.event.id = Number(this.$route.params.id);
            await this.getEvent(this.event.id);
            this.user = await userStore.getUser();

            for (const button of this.buttons) {
                button.handler = button.handler.bind(this);
            }
            for (const bill of this.event.bills) {
                this.addBillStates[bill.id] = {showing: false};
            }

            this.loaded = true;
        },
        methods: {
            isOwner(user) {
                return user != null && this.event.owner != null && user.id === this.event.owner.id;
            },
            async addBill() {
                this.addBillClickCount++;
                await this.$nextTick();
                this.addBillState.showing = false;
                this.addBillState.showing = true;
            },
            async getEvent(eventId) {
                const response = await this.$http.get('/events/' + eventId);
                this.event = response.data;
                this.event.id = eventId;
            },
            async openBillModal(bill) {
                this.selectedBillCount++;
                await this.$nextTick();
                this.selectedBill = bill;
                this.seeBillState.showing = false;
                this.seeBillState.showing = true;
            },
            async calculateDistributedDebts() {
                const response = await this.$http.get('/events/' + this.event.id + '/debts');
                this.debts = response.data;
                this.closeEvent();
            },
            closeEvent() {
                this.debtDistributionState.showing = false;
                this.debtDistributionState.showing = true;
            },
            async deleteEvent() {
                if (confirm("Are you sure?")) {
                    await this.$http.delete('/events/' + this.event.id);
                    router.push('/events');
                }
            },
        },
    };
</script>

<style scoped>
    .table-wrapper-scroll-y {
        display: block;
        max-height: 200px;
        overflow-y: auto;
        -ms-overflow-style: -ms-autohiding-scrollbar;
        margin-top: 5vh;
    }

    table thead tr th {
        border-top-color: white;
        border-bottom-color: white;
    }
</style>
