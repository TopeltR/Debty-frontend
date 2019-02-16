<template>
    <b-row>
        <b-navbar toggleable="sm">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand class="green brand">debty</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav>
                    <b-nav-item href="#/home">
                        Home
                    </b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav>
                    <b-nav-item href="#/events">
                        Events
                    </b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav>
                    <b-nav-item href="#/debts">
                        Debts
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </b-row>
</template>

<script>
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Navbar extends Vue {
    }
</script>

<style scoped>
    .green {
        color: limegreen;
    }

    .brand {
        font-weight: bolder;
        font-size: 30px;
    }

</style>