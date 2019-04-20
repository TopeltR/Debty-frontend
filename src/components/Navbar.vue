<template>
    <b-container fluid>
        <b-row>
            <b-navbar class='fixed-top w-100 bg-gray py-0 h-md-60px' type='light' toggleable='sm'>
                <b-navbar-brand class='limegreen brand' v-on:click='goToHome'>debty</b-navbar-brand>
                <b-navbar-toggle target='nav_collapse'></b-navbar-toggle>
                <b-collapse is-nav id='nav_collapse'>
                    <b-navbar-nav class="hoverable-nav h-60px mt-3 pb-2">
                        <b-nav-item ref="home" to='/home'>
                            Home
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="hoverable-nav h-60px mt-3 pb-2">
                        <b-nav-item ref="events" to='/events'>
                            Events
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="hoverable-nav h-60px mt-3 pb-2">
                        <b-nav-item ref="debts" to='/debts'>
                            Debts
                            <span class='badge badge-primary badge-pill m-0 bg-lime'
                                  v-if="debtsNotification === true">{{debtsNotificationAmount}}</span>
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="hoverable-nav h-60px mt-3 pb-2">
                        <b-nav-item ref="contacts" to='/contacts'>
                            Contacts
                            <span class='badge badge-primary badge-pill  m-0 bg-lime'
                                  v-if="contactsNotification === true"> {{contactsNotificationAmount}}</span>
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav ref="profile" class="hoverable-nav h-60px mt-3 pb-2">
                        <b-nav-item to='/profile'>
                            Profile
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="ml-auto h-60px mt-3 pb-2">
                        <span class="d-none d-md-block mr-4 mt-2"> Welcome, <b>{{ getUserName() }}</b></span>
                        <b-nav-item v-on:click="logOut">
                            <font-awesome-icon icon="sign-out-alt"
                                               class="icon mr-2"></font-awesome-icon>
                            <span>Sign out</span>
                        </b-nav-item>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </b-row>
    </b-container>
</template>

<script>
    import router from '@/router';
    import userStore from '../stores/UserStore';

    export default {
        name: 'Navbar',
        data: () => ({
            user: null,
            contactsNotification: false,
            contactsNotificationAmount: 0,
            debtsNotification: false,
            debtsNotificationAmount: 0,
            debtStatus: {
                NEW: 'NEW',
                ACCEPTED: 'ACCEPTED',
                DECLINED: 'DECLINED',
                PAID: 'PAID',
                CONFIRMED: 'CONFIRMED',
            },
        }),
        async mounted() {
            this.highlightActiveNav();
            this.user = await userStore.getUser();
            this.getContactsNotificationCount();
            this.getDebtsNotificationCount();
        },
        methods: {
            goToHome() {
                router.push('/home');
            },
            async getContactsNotificationCount() {
                const response = await this.$http.get('/contacts/incoming/' + this.user.id);
                if (response.data.length > 0) {
                    this.contactsNotification = true;
                    this.contactsNotificationAmount = response.data.length;
                }
            },
            async getDebtsNotificationCount() {
                const response = await this.$http.get('/debts/user/' + this.user.id);
                let debts = response.data;
                debts = debts.filter((debt) => this.isActionForDebt(debt));
                if (debts.length > 0) {
                    this.debtsNotification = true;
                    this.debtsNotificationAmount = debts.length;
                }
            },
            isActionForDebt(debt) {
                const canAcceptDecline = debt.owner.id !== this.user.id && debt.status === this.debtStatus.NEW;
                const canPay = this.user.id === debt.payer.id && debt.status === this.debtStatus.ACCEPTED;
                const canConfirm = this.user.id === debt.receiver.id && debt.status === this.debtStatus.PAID;
                return canAcceptDecline || canPay || canConfirm;
            },
            getUserName() {
                if (this.user == null) {
                    return '';
                }
                return this.user.firstName + ' ' + this.user.lastName;
            },
            logOut() {
                userStore.logOut();
            },
            highlightActiveNav() {
                const currentNav = this.$router.history.current.name;
                this.$refs[currentNav].classList.add("active");
            },
        },
    };
</script>

<style scoped>
    .limegreen {
        color: limegreen;
    }

    .brand {
        font-weight: bolder;
        font-size: 30px;
    }

    .bg-lime {
        background-color: limegreen !important;
    }

    .bg-gray {
        background-color: #dadada;
    }

    .icon {
        font-size: 20px;
    }

    .h-60px {
        height: 60px !important;
    }

    @media (min-width: 575px) {
        .h-md-60px {
            height: 60px !important;
        }

        .hoverable-nav:hover, .active {
            color: #fff !important;
            background-color: #EFEFEF !important;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
        }
    }
</style>
