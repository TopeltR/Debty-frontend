<template>
    <div>
        <event-form v-if="editing" :eventId="eventId" :buttons="[
            {
                name: 'Save',
                width: 6,
                offset: 0,
                variant: 'primary',
                handler: (eventForm, userStore) => {
                    if (eventForm.title && eventForm.description) {
                            userStore.getUser().then((user) => {
                                eventForm.$http.post('/events', {
                                    id: this.eventId,
                                    title: eventForm.title,
                                    people: eventForm.people,
                                    description: eventForm.description,
                                    owner: user,
                                }).then((result) => {
                                    this.event = result.data;
                                    this.editing = false;
                                });
                            });
                    }
                },
            },
            {
                name: 'Cancel',
                width: 6,
                offset: 0,
                variant: 'secondary',
                handler: () => {
                    this.editing = false;
                },
            }
        ]"/>
        <div v-else>
            <navbar/>
            <background>
                <b-row>
                    <b-col sm='12' md='6'>
                        <div class='header'>
                            <h1>
                                <span class='eventTitle'>
                                    {{event.title}}
                                </span>
                            </h1>
                            <p>
                                <span>
                                    {{event.description}}
                                </span>
                            </p>
                        </div>
                    </b-col>
                    <b-col sm='12' md='6'>
                        <div class='table-wrapper-scroll-y PT5vh'>
                            <table class='table table-bordered table-striped bill-table'>
                                <thead>
                                <tr>
                                    <th scope='col'>People</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='person in event.people'>
                                    <td>{{person.firstName + ' ' + person.lastName}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </b-col>
                    <b-col cols="6" offset="6" md="2" offset-md="0">
                        <b-btn class="wide" variant='primary' v-on:click='editing = true'>Edit</b-btn>
                    </b-col>
                </b-row>
            </background>
        </div>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';
    import EventForm from '@/components/EventForm.vue';

    export default {
        name: 'Event.vue',
        components: {Navbar, Background, EventForm},
        data: () => ({
            event: {
                id: null,
                title: null,
                description: null,
                owner: null,
                people: [],
                bills: [],
            },
            editing: false,
        }),
        mounted() {
            this.eventId = Number(this.$route.params.id);
            this.getEvent(this.eventId);
        },
        methods: {
            getEvent(eventId) {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('/events/' + eventId)
                        .then((response) => {
                            self.event = response.data;
                            self.event.id = eventId;
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
        },
    };
</script>

<style scoped>
    .eventTitle {
        padding: 0 0;
    }

    .header {
        padding-top: 5vh;
    }

    .wide {
        width: 100%;
    }

    .table-wrapper-scroll-y {
        display: block;
        max-height: 200px;
        overflow-y: auto;
        -ms-overflow-style: -ms-autohiding-scrollbar;
        margin-top: 5vh;
    }
</style>
