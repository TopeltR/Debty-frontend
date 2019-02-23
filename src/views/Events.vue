<template>
    <div>
        <navbar></navbar>
        <background>
            <h1 class="header">My events</h1>
            <b-table hover :busy.sync="isBusy" :fields="fields" :items="getEvents" ></b-table>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';

    export default {
        name: 'events',
        components: {Navbar, Background},

        mounted() {
            this.getEvents();
        },
        data() {
            return {
                fields: ['Title', 'Owner', 'Created at', 'Modified at'],
                isBusy: false
            }
        },
        methods: {
            getEvents(ctx) {
                this.$http.get('/events/all').then(
                    (response) => {
                        let items = [];
                        items = response.data;
                        this.isBusy = false;
                        return items
                    },
                ).catch(
                    (error) => {
                        alert('You are not logged in!');
                        router.push('/');
                        return []
                    },
                );
            },
        },
    }
</script>

<style>
    .header {
        padding-top: 30px
    }
</style>