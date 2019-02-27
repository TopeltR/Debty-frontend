<template>
    <div>
        <navbar/>
        <background>
            <h1 class="header">My events</h1>
            <b-table class="events" hover :busy.sync="isBusy" :fields="fields" :items="items" sortable="true" ></b-table>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import axios from 'axios';
    import userStore from "../stores/UserStore";
    /**
     * Documentation can be found https://bootstrap-vue.js.org/docs/components/table/#event-based-refreshing-of-data
     *
     */

    export default {
        name: 'events',
        components: {Navbar, Background},

        mounted() {
            this.getEvents();
        },
        data() {
            return {
                items: [],
                fields: [
                    { key: 'title', label: 'Title', sortable:true },
                    { key: 'owner.firstName', label: 'Owner Firstname', sortable:true },
                    { key: 'owner.lastName', label: 'Owner lastname', sortable:true },
                    { key: 'created', label: 'Created', sortable:true },
                    { key: 'modified', label: 'Modified', sortable:true },
                    { key: 'people.length', label: 'People', sortable:true },
                ],
                isBusy: false
            }
        },
        methods: {
            getEvents() {
                let self = this;
                userStore.getUser().then(user => {
                    console.log(user.id);
                    self.$http.get('http://localhost:8080/events/user/' + user.id)
                        .then(data => {
                        self.items = data.data;
                        console.log(self.items);
                    }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
        },
    }
</script>

<style>
    .header {
        padding-top: 30px
    }
    .events {
        padding-top: 600px !important;
    }
</style>