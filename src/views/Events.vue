<template>
    <div>
        <navbar/>
        <background>
            <h1 class="header">My events</h1>
            <div id="table">
                <table class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Owner name</th>
                        <th class="d-none d-md-table-cell" scope="col">Created at</th>
                        <th class="d-none d-md-table-cell" scope="col">Closed at</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="event in events" @click="goToEvent(event.id)">
                        <td>{{event.title}}</td>
                        <td>{{event.description}}</td>
                        <td class="">{{event.owner.firstName}} {{event.owner.lastName}}</td>
                        <td class="">{{event.owner.firstName}} {{event.owner.lastName}}</td>
                        <td class="d-none d-md-table-cell">{{event.created}}</td>
                        <td class="d-none d-md-table-cell">{{event.closed}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from "../stores/UserStore";

    export default {
        name: 'events',
        components: {Navbar, Background},

        mounted() {
            this.getEvents();
        },
        data() {
            return {
                events: [],

            }
        },
        methods: {
            goToEvent(id) {
                router.push("/events/" + id);
            },
            getEvents() {
                let self = this;
                userStore.getUser().then(user => {
                    console.log(user.id);
                    self.$http.get('http://localhost:8080/events/user/' + user.id)
                        .then(data => {
                            self.events = data.data;
                            console.log(data.data);
                            console.log(self.events);
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
        },

    };
</script>

<style>
    .header {
        padding-top: 30px
    }

    .events {
        padding-top: 600px !important;
    }
    .desc {
        width: 40px;
        word-wrap: break-word;
    }



</style>