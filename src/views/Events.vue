<template>
    <div>
        <navbar></navbar>
        <background>
            <h1 class="header">My events</h1>
            <b-table class="events" hover :busy.sync="isBusy" :fields="fields" :items="getEvents" sortable="true" ></b-table>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import axios from 'axios';

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
                fields: [
                    { key: 'title', label: 'Title' },
                    { key: 'owner.firstName', label: 'Owner Firstname' },
                    { key: 'owner.lastName', label: 'Owner lastname' },
                    { key: 'created', label: 'Created' },
                    { key: 'modified', label: 'Modified' },
                    { key: 'people', label: 'People' },
                    { key: 'bills', label: 'Bills' },
                ],
                isBusy: false
            }
        },
        methods: {
            getEvents() {
                /*   this.$http.get('/events/all').then(
                   (response) => {
                       let items = [];
                       items = response.data;
                       console.log(items);
                       this.isBusy = false;
                       return items
                   },
               ).catch(
                   (error) => {
                       alert('You are not logged in!');
                       router.push('/');
                       return []
                   },
               );*/

                let promise = axios.get('http://localhost:8080/events/all');
                return promise.then(data => {
                    let items = data.data;
                    return items || [];
                })


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