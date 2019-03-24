<template>
    <div>
        <navbar/>
            <background>
                <div class='search-wrapper'>
                    <b-row>
                        <h2>Add contact</h2>
                        <font-awesome-icon id="info" icon='info-circle' class="ml-1"></font-awesome-icon>
                        <b-tooltip target="info"
                                   title="Create an Event by giving it an informative title and contacts, then add your contacts to it."
                                   placement="bottom"></b-tooltip>
                    </b-row>
                    <b-row class='pt-4'>
                        <b-col sm='12' md='6'>
                            <autocomplete id='search ' v-model='contact' :placeholder='"Name"' :field='field'
                                          :items='availableContacts'
                                          :key-extractor='getUserFullName'></autocomplete>
                        </b-col>
                        <b-col>
                            <button type='button' v-on:click='addContact'
                                    class='btn btn-primary wide'> Add contact</button>
                        </b-col>
                    </b-row>
                </div>
                <b-row class='MT30'>
                    <b-col>

                            <b-list-group>
                                <h2>Requests</h2>
                                <div v-if='requests.length > 0'>
                                    <b-list-group-item v-for='r in requests'> {{r.firstName}} {{r.lastName}}
                                        <div v-if='r.type === "INC"'>
                                            <span class='float-right MT-20'>
                                                <span class='btn btn-default'>
                                                    <font-awesome-icon icon='check' class='green icons'  v-on:click='acceptContact(r.id)'/>
                                                </span>
                                            </span>
                                            <span class='float-right MT-20'>
                                                <span class='btn btn-default'>
                                                    <font-awesome-icon icon='times' class='red icons' v-on:click='removeRequest(r.id)'/>
                                                </span>
                                            </span>
                                        </div>
                                        <div v-else></div>
                                    </b-list-group-item>
                                </div>
                                <div v-else class='mt-3'>
                                    <h3>No incoming requests right now.</h3>
                                </div>
                            </b-list-group>

                    </b-col>
                <b-col>
                    <b-list-group>
                        <div v-if="userContacts.length > 0">
                        <h2>My contacts</h2>
                        <b-list-group-item v-for='c in userContacts' > {{c.firstName}} {{c.lastName}} </b-list-group-item>
                        </div>
                        <div v-else class='mt-3'>
                            <h3>No contacts yet, add contacts from search</h3>
                        </div>
                    </b-list-group>
                </b-col>
            </b-row>
        </background>
    </div>
</template>

<script>
    import Navbar from '@/components/Navbar.vue';
    import Background from '@/components/Background.vue';
    import Autocomplete from '@/components/Autocomplete.vue';
    import router from '@/router';
    import userStore from '../stores/UserStore';

    export default {
        name: 'events',
        components: {Navbar, Background, Autocomplete},
        data() {
            return {
                contact: {},
                field: {value: ''},
                availableContacts: [],
                requests: [],
                userContacts: [],
                user: userStore.getUser(),
            };
        },
        mounted() {
          this.getWaitingContacts();
          this.getContacts();
          this.getPersonContacts();
        },
        methods: {
            getUserFullName(user) {
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            getContacts() {
                userStore.getUser().then((user) => {
                    this.$http.get('/contact/all/' + user.id)
                        .then((data) => {
                            this.availableContacts = data.data;
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
            getWaitingContacts() {
                userStore.getUser().then((user) => {
                    this.$http.get('/contact/waiting/' + user.id)
                        .then((data) => {
                            this.requests = data.data;
                            this.requests.forEach((request) => {
                                Object.assign(request, { type: 'INC' });
                            });
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
            addContact() {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.post('/contact/add/' + user.id + '/' + this.contact.id)
                        .then(this.getContacts).then(() => {
                            this.field.value = '';
                            Object.assign(this.contact, { type: 'OUT' });
                            this.requests.push(this.contact);
                        })
                        .catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
            getPersonContacts() {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('/contact/id/' + user.id)
                        .then((data) => {
                            self.userContacts = data.data;
                        }).catch(() => {
                            router.push('/');
                        },
                    );
                });
            },
            acceptContact(id) {
                this.$http.post('/contact/accept/' + id)
                    .then(() => {
                        this.getPersonContacts();
                        this.getWaitingContacts();
                    }).catch(() => {
                        router.push('/');
                    },
                );
            },
            removeRequest(id) {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.delete('/contact/remove/' + user.id + '/' + id)
                        .then(() => {
                            this.getWaitingContacts();
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
    .search-wrapper{
        padding-top: 20px;
        display: table;
        margin: 0 auto;
    }
    #search {
        width: 100%;
    }
    .MT30 {
        margin-top: 40px;
    }
    .green {
        color: limegreen;
    }
    .red {
        color:red;
    }
    .icons {
        width: 22px !important;
        height: 22px !important;
    }
    .MT-20 {
        margin-top:-30px;
    }



</style>