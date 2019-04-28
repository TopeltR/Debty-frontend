<template>
    <div>
        <navbar></navbar>
        <add-bank-account :state="addBankAccountState"></add-bank-account>
        <background>
            <spinner :loaded="loaded">
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
                                    <b-list-group-item v-for='event in events' :to='"events/"+event.id' :key="event.id">
                                        {{ event.title }}
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
                                    <b-list-group-item v-for='debt in debts' :to='"debts/"+debt.id' :key="debt.id">
                                        {{ debt.title }}
                                        <span v-if="debt.action"
                                              class='badge badge-primary badge-pill m-0 ml-2 bg-lime'>!</span>
                                    </b-list-group-item>
                                </b-list-group>
                            </b-collapse>
                        </b-col>
                    </b-row>
                </div>
            </spinner>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';
    import AddBankAccount from "@/components/AddBankAccount.vue";
    import Spinner from '@/components/Spinner.vue';

    export default {
        name: 'Home',
        components: {AddBankAccount, Navbar, Background, Spinner},
        async mounted() {
            this.user = await userStore.getUser();
            this.getDebts();
            this.getEvents();
            this.openBankAccountModal();
        },
        data: () => ({
            events: null,
            debts: null,
            addBankAccountState: {showing: false},
            user: {},
            debtStatus: {
                NEW: 'NEW',
                ACCEPTED: 'ACCEPTED',
                DECLINED: 'DECLINED',
                PAID: 'PAID',
                CONFIRMED: 'CONFIRMED',
            },
        }),
        computed: {
            loaded() {
                return !!this.events && !!this.debts;
            },
        },
        methods: {
            createNewEvent() {
                router.push('/events/create');
            },
            createNewDebt() {
                router.push('/debts/create');
            },
            async getDebts() {
                const response = await this.$http.get('/debts/user/' + this.user.id);
                this.debts = response.data;
                this.debts.map((debt) => this.addKeysToDebt(debt));
            },
            async getEvents() {
                const response = await this.$http.get('/events/user/' + this.user.id);
                this.events = response.data;
                this.events = this.events.filter((event) =>
                    event.people.some((person) => person.id === this.user.id));
            },
            async openBankAccountModal() {
                if (this.user.bankAccount === null) {
                    this.addBankAccountState.showing = false;
                    this.addBankAccountState.showing = true;
                }
            },
            addKeysToDebt(debt) {
                const key = 'action';
                debt[key] = this.isActionForDebt(debt);
                return debt;
            },
            isActionForDebt(debt) {
                const canAcceptDecline = debt.owner.id !== this.user.id && debt.status === this.debtStatus.NEW;
                const canPay = this.user.id === debt.payer.id && debt.status === this.debtStatus.ACCEPTED;
                const canConfirm = this.user.id === debt.receiver.id && debt.status === this.debtStatus.PAID;
                return canAcceptDecline || canPay || canConfirm;
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

    .bg-lime {
        background-color: limegreen !important;
    }
</style>
