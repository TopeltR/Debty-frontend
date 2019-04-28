<template>
    <div>
        <navbar/>
        <background>
            <spinner :loaded="loaded">
                <div v-if="events && events.length > 0">
                    <h1 class='pt-4'>My events
                        <font-awesome-icon icon='plus' class=' ml-3 mt-2 limegreen' v-on:click='createNewEvent'/>
                    </h1>
                    <div class='search-wrapper mr-4 mt-4 mb-4'>
                        <b-row>
                            <b-col md="6">
                                <input class='form-control' type='text' v-model='search' placeholder='Search'/>
                            </b-col>
                        </b-row>
                    </div>
                    <div v-for="event in filteredList" :key="event.id" @click="goToEvent(event.id)"
                         class="card my-3 shadow">
                        <div class="card-body">
                            <b-row>
                                <b-col md="6">
                                    <h4 class="ml-2">{{event.title}}</h4>
                                </b-col>
                                <b-col md="6" class="d-none d-md-block text-right">
                                    <b>Created: </b> {{getDateString(event.createdAt)}}
                                    <span v-if="event.closedAt">
                                    <br>
                                    <b>Closed: </b> {{getDateString(event.closedAt)}}
                                    </span>
                                </b-col>
                            </b-row>
                            <b-row class="mx-2">
                                <small><b>Owner: </b> {{getFullName(event.owner)}}</small>
                            </b-row>
                            <b-row v-if="event.description.length > 0" class="mx-2 mt-3">
                                <p>{{event.description}}</p>
                            </b-row>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center p-5">
                    <h1>You don't have any events yet, grab your friends and create one!</h1>
                    <b-btn class="m-5 btn-limegreen px-3 py-2" v-on:click="goToEventCreation">Create event!</b-btn>
                </div>
            </spinner>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import Spinner from '@/components/Spinner.vue';
    import router from '@/router';
    import userStore from '@/stores/UserStore';
    import eventStore from '@/stores/EventStore';

    export default {
        name: 'Events',
        components: {Navbar, Background, Spinner},

        mounted() {
            this.getEvents();
        },
        data() {
            return {
                events: undefined,
                search: '',
            };
        },
        methods: {
            createNewEvent() {
                router.push('/events/create');
            },
            goToEvent(id) {
                router.push('/events/' + id);
            },
            sortByTime() {
                this.events.sort((event1, event2) => {
                    if (event1.closedAt != null && event2.closedAt == null) {
                        return 1;
                    }
                    if (event2.closedAt != null && event1.closedAt == null) {
                        return -1;
                    }
                    if (event1.createdAt < event2.createdAt) {
                        return 1;
                    }
                    if (event2.createdAt < event1.createdAt) {
                        return -1;
                    }
                    return 0;
                });
            },
            async getEvents() {
                const user = await userStore.getUser();

                eventStore.getUserEvents(user.id).onChange((events) => {
                    this.events = events;
                    this.sortByTime();
                });
            },
            getDateString(date) {
                return date !== null ? new Date(date).toLocaleString() : '';
            },
            goToEventCreation() {
                router.push('/events/create');
            },
            getFullName(person) {
                return person.firstName + ' ' + person.lastName;
            },
        },
        computed: {
            loaded() {
                return !!this.events;
            },
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
    .limegreen {
        color: limegreen;
    }

    .form-control {
        width: 300px !important;
    }

    .card:hover {
        border: solid 1px limegreen;
    }

    .btn-limegreen {
        background-color: limegreen;
        border-color: limegreen;
    }

    .btn-limegreen:hover {
        background-color: #30b530;
        border-color: #30b530;
    }
</style>
