<template>
    <div>
        <navbar/>
        <background>
            <div v-if="events.length > 0">
                <h1 class='pt-4'>My events</h1>
                <div class='search-wrapper mr-4 mt-4 mb-4'>
                    <input class='form-control' type='text' v-model='search' placeholder='Search'/>
                </div>
                <div id='table'>
                    <table class='table table-bordered table-hover'>
                        <thead>
                        <tr>
                            <th scope='col'>Title</th>
                            <th scope='col'>Description</th>
                            <th scope='col'>Owner name</th>
                            <th class='d-none d-md-table-cell' scope='col'>Created at</th>
                            <th class='d-none d-md-table-cell' scope='col'>Closed at</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="event in filteredList" @click="goToEvent(event.id)">
                            <td>{{event.title}}</td>
                            <td>{{event.description}}</td>
                            <td class="">{{event.owner.firstName}} {{event.owner.lastName}}</td>
                            <td class='d-none d-md-table-cell'>{{event.created}}</td>
                            <td class='d-none d-md-table-cell'>{{event.closed}}</td>

                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else class="text-center p-5">
                <h1>You don't have any events yet, grab your friends and create one!</h1>
                <b-btn class="m-5" v-on:click="goToEventCreation">Create event!</b-btn>
            </div>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';

    export default {
        name: 'events',
        components: {Navbar, Background},

        mounted() {
            this.getEvents();
        },
        data() {
            return {
                events: [],
                search: '',

            };
        },
        methods: {
            goToEvent(id) {
                router.push('/events/' + id);
            },
            getEvents() {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('http://localhost:8080/events/user/' + user.id)
                        .then((data) => {
                            self.events = data.data;
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
            goToEventCreation() {
                router.push('/events/create');
            },
        },
        computed: {
            filteredList() {
                return this.events.filter((event) => {
                    return event.title.toLowerCase().includes(this.search.toLowerCase()) ||
                        event.description.toLowerCase().includes(this.search.toLowerCase()) ||
                        event.owner.firstName.toLowerCase().includes(this.search.toLowerCase()) ||
                        event.owner.lastName.toLowerCase().includes(this.search.toLowerCase());
                });
            },
        },
    };
</script>

<style scoped>

   .form-control {
       width: 300px !important;
   }
</style>