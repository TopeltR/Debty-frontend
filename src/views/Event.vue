<template>
    <div>
        <event-form v-if="editing" :eventId="event.id" :buttons="buttons"/>
        <div v-else>
            <navbar/>
            <background>
                <b-row>
                    <add-bill :key="selectedBill ? selectedBill.id : -1" :selectedBill="selectedBill" :state="seeBillState" :event="event"/>
                    <add-bill :key="addBillClickCount" :state="addBillState" :event="event"/>
                    <debt-distribution :state="debtDistributionState" :debts="debts" :eventId="event.id"/>
                    <b-col sm='12' md='6'>
                        <div class='header'>
                            <h1>
                                <span class='eventTitle'>
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
                    <b-col class="MDMT40px" sm='12' md='6'>
                        <h2>People</h2>
                        <div class='table-wrapper-scroll-y MDMT3vh'>
                            <table class='table table-bordered table-striped bill-table'>
                                <tbody>
                                <tr v-for='person in event.people'>
                                    <td>{{person.firstName + ' ' + person.lastName}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </b-col>
                </b-row>
                <b-row class="PT20px">
                    <b-col cols="12">
                        <h2>Bills</h2>
                        <table class='table table-bordered table-hover table-striped'>
                            <thead>
                            <tr class='d-none d-md-table-row'>
                                <th scope='col'>Title</th>
                                <th scope='col'>Sum (€)</th>
                                <th class='d-none d-md-table-cell' scope='col'>Buyer</th>
                                <th class='d-none d-md-table-cell' scope='col'>Participants</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="bill in event.bills" v-if="bill !== undefined" @click="openBillModal(bill)">
                                <td>{{bill.title}}</td>
                                <td>{{bill.sum}}</td>
                                <td class='d-none d-md-table-cell'>{{bill.buyer.firstName}} {{bill.buyer.lastName}}</td>
                                <td class='d-none d-md-table-cell'>{{bill.people.length}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </b-col>
                    <b-col v-if="event.closedAt == null">
                        <b-row>
                            <b-col v-if="isOwner()" class="mb-3" cols="12" offset="0" md="2" offset-md="0">
                                <b-btn class="wide mt-4" variant='danger' v-on:click='calculateDistributedDebts'>Close
                                    event...
                                </b-btn>
                            </b-col>
                            <b-col v-if="isOwner()" cols="6" offset="0" md="2" offset-md="0">
                                <b-btn class="wide mt-4" variant='primary' v-on:click='editing = true'>Edit</b-btn>
                            </b-col>
                            <b-col cols="6" offset="0" md="2" offset-md="0">
                                <b-btn class="wide mt-4 mb-3" variant='primary' v-on:click='addBill'>Add bill</b-btn>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col class="pb-5" v-else>
                        This event has been closed.
                    </b-col>
                </b-row>
            </background>
        </div>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import userStore from '../stores/UserStore';
    import EventForm from '@/components/EventForm.vue';
    import AddBill from '@/components/AddBill.vue';
    import DebtDistribution from '@/components/DebtDistribution.vue';

    export default {
        name: 'Event.vue',
        components: {Navbar, Background, EventForm, AddBill, DebtDistribution},
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
            editing: false,
            addBillState: {showing: false},
            seeBillState: {showing: false},
            addBillStates: {},
            debtDistributionState: {showing: false},
            debts: [],
            buttons: [
                {
                    name: 'Save',
                    width: 6,
                    offset: 0,
                    variant: 'primary',
                    handler(eventForm, store) {
                        if (eventForm.title && eventForm.description) {
                            store.getUser().then((user) => {
                                eventForm.$http.post('/events', {
                                    id: this.event.id,
                                    title: eventForm.title,
                                    people: eventForm.people,
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
        },
        methods: {
            isOwner() {
                return this.user != null && this.event.owner != null && this.user.id === this.event.owner.id;
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
            openBillModal(bill) {
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
        },
    };
</script>

<style scoped>
    .eventTitle {
        padding: 0 0;
    }

    .header {
        padding-top: 5vh;
    }

    .wide {
        width: 100%;
    }

    .table-wrapper-scroll-y {
        display: block;
        max-height: 200px;
        overflow-y: auto;
        -ms-overflow-style: -ms-autohiding-scrollbar;
        margin-top: 5vh;
    }

    .PT20px {
        padding-top: 20px;
    }

    @media (min-width: 768px) {
        .MDMT40px {
            margin-top: 40px;
        }

        .MDMT3vh {
            margin-top: 3vh;
        }
    }
</style>
