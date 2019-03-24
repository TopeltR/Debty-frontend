<template>
    <div>
        <event-form v-if="editing" :eventId="event.id" :buttons="buttons"/>
        <div v-else>
            <navbar/>
            <background>
                <b-row>
                    <add-bill :selectedBill="selectedBill" :state="seeBillState" :event="event"/>
                    <add-bill :state="addBillState" :event="event"/>
                    <debt-distribution :state="debtDistributionState" :debts="debts"/>
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
                    <b-col cols="6" offset="0" md="2" offset-md="0">
                        <b-btn class="wide mt-4" variant='primary' v-on:click='editing = true'>Edit</b-btn>
                    </b-col>
                    <b-col cols="6" offset="0" md="2" offset-md="0">
                        <b-btn class="wide mt-4" variant='primary' v-on:click='addBill'>Add bill</b-btn>
                    </b-col>
                    <b-col class="mb-3" cols="12" offset="0" md="2" offset-md="0">
                        <b-btn class="wide mt-4" variant='danger' v-on:click='calculateDistributedDebts'>Close event...</b-btn>
                    </b-col>
                </b-row>
            </background>
        </div>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
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
            },
            selectedBill: undefined,
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
                    handler: function (eventForm, userStore) {
                        if (eventForm.title && eventForm.description) {
                            userStore.getUser().then((user) => {
                                eventForm.$http.post('/events', {
                                    id: this.event.id,
                                    title: eventForm.title,
                                    people: eventForm.people,
                                    description: eventForm.description,
                                    owner: user,
                                }).then((result) => {
                                    this.event = result.data;
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
                    handler: function () {
                        this.editing = false;
                    },
                },
            ],
        }),
        mounted() {
            this.event.id = Number(this.$route.params.id);
            this.getEvent(this.event.id);

            for (let i = 0; i < this.buttons.length; i++) {
                let button = this.buttons[i];
                button.handler = button.handler.bind(this);
            }

            for (let i = 0; i < this.event.bills; i++) {
                let bill = this.event.bills[i];
                this.addBillStates[bill.id] = {showing: false};
            }
        },
        methods: {
            addBill() {
                this.addBillState.showing = false;
                this.addBillState.showing = true;
            },
            getAddBillState(id) {
                this.addBillStates[id] = {showing: false};
                return this.addBillStates[id];
            },
            getEvent(eventId) {
                const self = this;
                userStore.getUser().then((user) => {
                        self.$http.get('/events/' + eventId)
                            .then((response) => {
                                self.event = response.data;
                                self.event.id = eventId;
                            }).catch(() => {
                                router.push('/');
                            },
                        );
                    });
            },
            openBillModal(bill) {
                this.selectedBill = bill;
                this.seeBillState.showing = false;
                this.seeBillState.showing = true;
            },
            calculateDistributedDebts() {
                this.$http.get('/events/' + this.event.id + '/debts').then(
                    (response) => {
                        console.log(response.data);
                        this.debts = response.data;
                        console.log(this.debts);
                        this.closeEvent();
                    },
                ).catch((error) => {
                    console.log(error);
                    alert('You are not logged in!');
                    router.push('/');
                });
            },
            closeEvent() {
                console.log("should open debts modal rn");
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
