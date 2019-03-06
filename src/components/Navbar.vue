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
                </b-collapse>
            </b-navbar>
        </b-row>
    </b-container>
</template>

<script>
    import router from '@/router';

    export default {
        name: 'Navbar',
        methods: {
            goToHome() {
                router.push('/home');
            },
        }
    }
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
</style>