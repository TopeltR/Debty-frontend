<template>
    <b-container fluid>
        <b-row class='PB65px'>
            <b-navbar class='fixed-top' style='background-color: #E8E8E8; width:100%' type='light' variant='' toggleable='sm'>
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
                                <font-awesome-icon v-if="notification === true" class='limegreen m-0' icon='envelope' />
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav>
                        <b-nav-item to='/profile'>
                            Profile
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
            notification: false,
        }),
        mounted() {
            this.getNotificationCount();
        },
        methods: {
            goToHome() {
                router.push('/home');
            },
            async getNotificationCount() {
                 const user = await userStore.getUser();
                    this.$http.get('/contact/waiting/' + user.id)
                        .then((data) => {
                            if (data.data.length > 0) {
                                this.notification = true;
                            }
                        }).catch(() => {
                            router.push('/');
                    },
                );
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
    .PB65px {
        padding-bottom: 65px;
    }
    .MT5 {
        padding-bottom: 5px;
    }

</style>
