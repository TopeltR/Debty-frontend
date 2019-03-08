<template>
    <div>
        <event-form v-if='editing' :eventId='eventId'/>
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
                    <b-btn variant='primary' v-if='!editing' v-on:click='startEditing'>Edit</b-btn>
                    <div v-else>
                        <b-btn variant='primary' v-on:click='saveEdit'>Save</b-btn>
                        <b-btn variant='primary' v-on:click='cancelEdit'>Cancel</b-btn>
                    </div>
                </b-row>
                <b-row class="PT20">
                    <table class='table table-bordered table-hover'>
                        <thead>
                        <tr>
                            <th scope='col'>Title</th>
                            <th scope='col'>Sum(€)</th>
                            <th scope='col'>Buyer</th>
                            <th class='d-none d-md-table-cell' scope='col'>Participants</th>
                            <th class='d-none d-md-table-cell' scope='col'>Created by</th>
                            <th class='d-none d-md-table-cell' scope='col'>Created at</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="bill in event.bills" @click="openBillModal">
                            <td>{{bill.title}}</td>
                            <td>{{bill.sum}}</td>
                            <td class=''>{{bill.buyer.firstName}} {{bill.buyer.lastName}}</td>
                            <td class='d-none d-md-table-cell'>{{bill.people.length}}</td>
                            <td class='d-none d-md-table-cell'>{{bill.creator.firstName}} {{bill.creator.lastName}}</td>
                            <td class='d-none d-md-table-cell'>{{bill.createdAt}}</td>
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
    import BRow from "bootstrap-vue/src/components/layout/row";

    export default {
        name: 'Event.vue',
        components: {BRow, Navbar, Background, EventForm},
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
            prevEvent: {
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
            this.getEvent(this.$route.params.id);
        },
        methods: {
            startEditing() {
                this.editing = true;
                this.prevEvent = JSON.parse(JSON.stringify(this.event));
            },
            saveEdit() {
                this.editing = false;
            },
            cancelEdit() {
                return;
            },
            updateEvent() {
                return;
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.post('/events/' + eventId)
                        .then((response) => {
                            self.event = response.data;
                            self.saveTitle();
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
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
