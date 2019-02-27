<template>
    <div>
        <navbar/>
        <background>
            <b-row>
                <b-col sm="12" md="6">
                    <div class="header">
                        <h1>
                            <span v-if="editingTitle" class="eventTitle">
                                <b-form-input ref="title" type="text" v-model="event.title" v-on:blur="saveTitle"/>
                            </span>
                            <span v-else class="eventTitle">
                                {{event.title}}
                            </span>
                            <font-awesome-icon v-if="!editingTitle" icon="edit" class="small gray"
                                               v-on:click="editTitle"/>
                        </h1>
                        <p>
                            <span v-if="editingDescription">
                                <b-form-textarea ref="description" type="text" v-model="event.description"
                                                 v-on:blur="saveDescription"></b-form-textarea>
                            </span>
                            <span v-else>
                                {{event.description}}
                            </span>
                            <font-awesome-icon v-if="!editingDescription" icon="edit" class="gray"
                                               v-on:click="editDescription"/>
                        </p>
                    </div>
                </b-col>
                <b-col sm="12" md="6">
                    <div class="table-wrapper-scroll-y PT5vh">
                        <table class="table table-bordered table-striped bill-table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th scope="row">4</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">5</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">6</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th scope="row">4</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">5</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">6</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th scope="row">4</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">5</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">6</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </b-col>
            </b-row>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';
    import BFormInput from "bootstrap-vue/src/components/form-input/form-input";
    import BRow from "bootstrap-vue/src/components/layout/row";
    import BFormTextarea from "bootstrap-vue/src/components/form-textarea/form-textarea";

    export default {
        name: "Event.vue",
        components: {BFormTextarea, BRow, BFormInput, Navbar, Background},
        data: () => ({
            event: {
                id: null,
                title: null,
                description: null,
                owner: null,
                people: [],
                bills: [],
            },
            editingTitle: false,
            editingDescription: false,
        }),
        mounted() {
            this.getEvent(this.$route.params.id);
        },
        methods: {
            editTitle() {
                this.editingTitle = true;
                this.$nextTick(() => this.$refs.title.$el.focus());
            },
            saveTitle() {
                this.editingTitle = false;
                this.updateEvent();
            },
            editDescription() {
                this.editingDescription = true;
                this.$nextTick(() => this.$refs.description.$el.focus());
            },
            saveDescription() {
                this.editingDescription = false;
                this.updateEvent();
            },
            updateEvent() {
                console.log("updating event");
                return;
                let self = this;
                userStore.getUser().then((user) => {
                    self.$http.post('http://localhost:8080/events/' + eventId)
                        .then((response) => {
                            self.event = response.data;
                            console.log(self.event);
                            self.saveTitle();
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
            getEvent(eventId) {
                let self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('http://localhost:8080/events/' + eventId)
                        .then((response) => {
                            self.event = response.data;
                            self.event.id = eventId;
                            console.log(self.event);
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
        },
    }

</script>

<style scoped>
    .eventTitle {
        padding: 0 15px;
    }

    .header {
        padding-top: 5vh;
    }

    .limegreen {
        color: limegreen;
    }

    .small {
        size: 25px !important;
    }

    .gray {
        color: #c3c3c3;
    }

    .table-wrapper-scroll-y {
        display: block;
        max-height: 200px;
        overflow-y: auto;
        -ms-overflow-style: -ms-autohiding-scrollbar;
        margin-top: 5vh;
    }
</style>