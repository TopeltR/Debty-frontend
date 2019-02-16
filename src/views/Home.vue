<template>
    <div>
        <navbar></navbar>
        <background>
            <div>
                <b-row>
                    <b-col class="TM30px" sm="12" md="6">
                        <b-row>
                            <b-col sm="12" md="4">
                                <b-btn v-b-toggle.events class="mb-2 hidden-button">Events</b-btn>
                            </b-col>
                        </b-row>
                        <b-collapse visible id="events">
                            <b-list-group>
                                <b-list-group-item v-for="event in events" :to="'events/'+event.id">{{ event.title }}
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-col>
                    <b-col class="TM30px" sm="12" md="6">
                        <b-row>
                            <b-col sm="12" md="4">
                                <b-btn v-b-toggle.debts class="mb-2 hidden-button">Debts</b-btn>
                            </b-col>
                        </b-row>
                        <b-collapse visible id="debts">
                            <b-list-group>
                                <b-list-group-item v-for="debt in debts" :to="'debts/'+debt.id">{{ debt.receiver }}
                                </b-list-group-item>
                            </b-list-group>
                        </b-collapse>
                    </b-col>
                </b-row>
            </div>
        </background>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue'


    export default {
        name: "CreateEvent",
        components: {Navbar, Background},
        mounted: () => {
            this.$http.get("/events/").then(
                response => {
                    this.events = response.data;
                }
            )
        },
        data: () => ({
            events: [
                {id: 1, title: "Event 1",},
                {id: 1, title: "Event 1",},
                {id: 1, title: "Event 1",},
                {id: 1, title: "Event 1",},
            ],
            debts: [
                {id: 1, receiver: "Person 1"},
                {id: 1, receiver: "Person 1"},
                {id: 1, receiver: "Person 1"},
                {id: 1, receiver: "Person 1"},
                {id: 1, receiver: "Person 1"},
            ]
        }),
    }
</script>

<style scoped>
    .TM30px {
        margin-top: 30px;
    }

    .hidden-button {
        width: 100%;
        background-color: white;
        color: black;
        font-size: 25px;

    }
</style>
