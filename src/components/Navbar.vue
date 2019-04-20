<template>
    <b-container fluid>
        <b-row>
            <b-navbar class='fixed-top w-100 bg-gray py-0 h60px' type='light' toggleable='sm'>
                <b-navbar-toggle target='nav_collapse'></b-navbar-toggle>
                <b-navbar-brand class='limegreen brand' v-on:click='goToHome'>debty</b-navbar-brand>
                <b-collapse is-nav id='nav_collapse'>
                    <b-navbar-nav class="hoverable-nav h60px mt-3">
                        <b-nav-item ref="home" to='/home'>
                            Home
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="hoverable-nav h60px mt-3">
                        <b-nav-item ref="events" to='/events'>
                            Events
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="hoverable-nav h60px mt-3">
                        <b-nav-item ref="debts" to='/debts'>
                            Debts
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="hoverable-nav h60px mt-3">
                        <b-nav-item ref="contacts" to='/contacts'>
                            Contacts
                            <span class='badge badge-primary badge-pill  m-0 bg-lime' v-if="notification === true"> {{notificationAmount}}</span>
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav ref="profile" class="hoverable-nav h60px mt-3">
                        <b-nav-item to='/profile'>
                            Profile
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="ml-auto h60px mt-3">
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
            notification: false,
            notificationAmount: 0,
        }),
        async mounted() {
            this.highlightActiveNav();
            this.user = await userStore.getUser();
            this.getNotificationCount();
        },
        methods: {
            goToHome() {
                router.push('/home');
            },
            async getNotificationCount() {
                const response = await this.$http.get('/contacts/incoming/' + this.user.id);
                if (response.data.length > 0) {
                    this.notification = true;
                    this.notificationAmount = response.data.length;
                }
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

    .h60px {
        height: 60px !important;
    }

    .hoverable-nav:hover, .active {
        color: #fff !important;
        background-color: #EFEFEF !important;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
</style>
