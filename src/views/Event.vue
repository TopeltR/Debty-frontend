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
                        <h2>People</h2>
                        <div class='table-wrapper-scroll-y PT5vh'>
                            <table class='table table-bordered table-striped bill-table'>
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
                <b-row class="PT20">
                    <h2>Bills</h2>
                    <table class='table table-bordered table-hover'>
                        <thead>
                        <tr class='d-none d-md-table-row'>
                            <th scope='col'>Title</th>
                            <th scope='col'>Sum (€)</th>
                            <th class='d-none d-md-table-cell' scope='col'>Buyer</th>
                            <th class='d-none d-md-table-cell' scope='col'>Participants</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="bill in event.bills" @click="openBillModal">
                            <td>{{bill.title}}</td>
                            <td>{{bill.sum}}</td>
                            <td class='d-none d-md-table-cell'>{{bill.buyer.firstName}} {{bill.buyer.lastName}}</td>
                            <td class='d-none d-md-table-cell'>{{bill.people.length}}</td>
                        </tr>
                        </tbody>
                    </table>
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
                createdAt: null,
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
                userStore.getUser()
                    .then((user) => {
                        self.$http.get('/events/' + eventId)
                            .then((response) => {
                                self.event = response.data;
                                console.log(self.event);
                            }).catch(() => {
                                router.push('/');
                            },
                        );
                    });
            },
            openBillModal() {
                // TODO: @ingmar
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

    .PT20 {
        padding-top: 20px;
    }
</style>
