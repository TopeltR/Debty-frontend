<template>
    <b-container fluid>
        <b-row>
            <b-navbar class='fixed-top w-100 bg-light-gray' type='light' toggleable='sm'>
                <b-navbar-toggle target='nav_collapse'></b-navbar-toggle>
                <b-navbar-brand class='limegreen brand' v-on:click='goToHome'>debty</b-navbar-brand>
                <b-collapse is-nav id='nav_collapse'>
                    <b-navbar-nav>
                        <b-nav-item to='/home'>
                            Home
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav>
                        <b-nav-item to='/events'>
                            Events
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav>
                        <b-nav-item to='/debts'>
                            Debts
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav>
                        <b-nav-item to='/contacts'>
                            Contacts
                            <span class='badge badge-primary badge-pill  m-0 bg-lime' v-if="notification === true"> {{notificationAmount}}</span>
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav>
                        <b-nav-item to='/profile'>
                            Profile
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="ml-auto">
                        <span> Welcome, <b>{{ getUserName() }}</b></span>
                        <font-awesome-icon v-on:click="logOut" icon="sign-out-alt"
                                           class="icon ml-4 mr-2 mt-1"></font-awesome-icon>
                        <span v-on:click="logOut">Sign out</span>
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </b-row>
    </b-container>
</template>

<script>
    import router from '@/router';
    import userStore from '../stores/UserStore';
    import BNavbar from "bootstrap-vue/src/components/navbar/navbar";

    export default {
        name: 'Navbar',
        components: {BNavbar},
        data: () => ({
            user: null,
            notification: false,
            notificationAmount: 0,
        }),
        async mounted() {
            this.user = await userStore.getUser();
            this.getNotificationCount();
        },
        methods: {
            goToHome() {
                router.push('/home');
            },
            async getNotificationCount() {
                const response = await this.$http.get('/contact/waiting/' + this.user.id);
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
                this.$http.post('/signout');
                router.push('/');
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

    .bg-light-gray {
        background-color: #E8E8E8;
    }

    .icon {
        font-size: 20px;
    }
</style>
