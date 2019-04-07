<template>
    <div>
        <navbar></navbar>
        <add-bank-account :state="addBankAccountState"></add-bank-account>
        <background>
            <div>
                <b-row>
                    <b-col class='mt-5' sm='12' md='6'>
                        <b-row>
                            <b-col sm='12'>
                                <b-btn v-b-toggle.events class='menu-list-button shadow'>
                                    <span class='float-left'>Events</span>
                                    <font-awesome-icon icon='plus' class='float-right mt-2 green'
                                                       v-on:click='createNewEvent'/>
                                </b-btn>
                            </b-col>
                        </b-row>
                        <b-collapse visible id='events' class="shadow">
                            <b-list-group>
                                <b-list-group-item v-for='event in events' :to='"events/"+event.id'>{{ event.title }}
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-col>
                    <b-col class='mt-5' sm='12' md='6'>
                        <b-row>
                            <b-col sm='12'>
                                <b-btn v-b-toggle.debts class='menu-list-button shadow'>
                                    <span class='float-left'>Debts</span>
                                    <font-awesome-icon icon='plus' class='float-right mt-2 green'
                                                       v-on:click='createNewDebt'/>
                                </b-btn>
                            </b-col>
                        </b-row>
                        <b-collapse visible id='debts' class="mb-3 shadow">
                            <b-list-group>
                                <b-list-group-item v-for='debt in debts' :to='"debts/"+debt.id'>{{ debt.title }}
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-col>
                </b-row>
            </div>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';
    import AddBankAccount from "../components/AddBankAccount";

    export default {
        name: 'CreateEvent',
        components: {AddBankAccount, Navbar, Background},
        mounted() {
            this.getDebts();
            this.getEvents();
            this.openBankAccountModal();
        },
        data: () => ({
            events: [],
            debts: [],
            addBankAccountState: {showing: false},
            user: {},
        }),
        methods: {
            createNewEvent() {
                router.push('/events/create');
            },
            createNewDebt() {
                router.push('/debts/create');
            },
            async getDebts() {
                this.user = await userStore.getUser();
                const response = await this.$http.get('/debts/all');

                response.data.forEach((debt) => {
                    if (debt.payer.id === this.user.id) {
                        Object.assign(debt, {type: 'out'});
                        this.debts.push(debt);
                    } else if (debt.receiver.id === this.user.id) {
                        Object.assign(debt, {type: 'in'});
                        this.debts.push(debt);
                    }
                });
                this.debts = this.debts.filter((debt) => debt.payer.id === this.user.id
                    || debt.receiver.id === this.user.id);
            },
            async getEvents() {
                const response = await this.$http.get('/events/all');
                this.events = response.data;
                this.events = this.events.filter((event) =>
                    event.people.some((person) => person.id === this.user.id));
            },
            async openBankAccountModal() {
                const user = await userStore.getUser();
                if (user.bankAccount === null) {
                    this.addBankAccountState.showing = false;
                    this.addBankAccountState.showing = true;
                }
            },
        },
    };
</script>

<style scoped>
    .green {
        color: limegreen;
    }

    .menu-list-button {
        width: 100%;
        background-color: white;
        color: black;
        font-size: 25px;
        border-color: lightgray;
        border-radius: 5px 5px 5px 5px !important;
    }

    #events {
        border-radius: .25rem;
    }

    #debts {
        border-radius: .25rem;
    }
</style>
