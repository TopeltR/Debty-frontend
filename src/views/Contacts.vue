<template>
    <div>
        <navbar/>
        <background>
            <div class='d-table my-0 mx-auto pt-4'>
                <b-row class='ml-0'>
                    <h2>Add contact</h2>
                    <font-awesome-icon id="info" icon='info-circle' class='ml-1'></font-awesome-icon>
                    <b-tooltip target="info"
                               title="Create an Event by giving it an informative title and contacts, then add your contacts to it."
                               placement="bottom">
                    </b-tooltip>
                </b-row>
                <b-row class='pt-4'>
                    <b-col sm='12' md='6'>
                        <autocomplete id='search ' v-model='contact' :placeholder='"Name"' :field='field' class="w-100"
                                      :items='availableContacts' :required='true'
                                      :key-extractor='getUserFullName'>
                        </autocomplete>
                    </b-col>
                    <b-col class='pt-3 pt-md-0'>
                        <button type='button' v-on:click='addContact'
                                class='btn btn-primary wide'> Add contact
                        </button>
                    </b-col>
                </b-row>
            </div>
            <b-row class='mt-5'>
                <b-col md='6'>
                    <b-list-group>
                        <h2>Requests</h2>
                        <div v-if='requests.length > 0' class="shadow rounded">
                            <b-list-group-item v-for='request in requests'> {{request.firstName}} {{request.lastName}}
                                <span v-if='request.type === "Incoming"'>
                                    <font-awesome-icon icon='check' class='limegreen ml-1 icons float-right'
                                                       v-on:click='acceptContact(request.id)'/>
                                    <font-awesome-icon icon='times' class='text-danger icons float-right'
                                                       v-on:click='removeRequest(request.id)'/>
                                </span>
                                <div v-else></div>
                            </b-list-group-item>
                        </div>
                        <div v-else class='mt-3'>
                            <h4>No requests right now</h4>
                        </div>
                    </b-list-group>

                </b-col>
                <b-col md='6'>
                    <b-list-group>
                        <h2>My contacts</h2>
                        <div v-if="userContacts.length > 0" class="shadow rounded">
                            <b-list-group-item v-for='contact in userContacts'> {{contact.firstName}}
                                {{contact.lastName}}
                                <font-awesome-icon icon='times' class='text-danger icons float-right'
                                                   v-on:click='removeRequest(contact)'/>
                            </b-list-group-item>
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
    import userStore from '../stores/UserStore';

    export default {
        name: 'events',
        components: {Navbar, Background, Autocomplete},
        data: () => ({
            contact: {},
            field: {value: ''},
            availableContacts: [],
            requests: [],
            userContacts: [],
            user: userStore.getUser(),
        }),
        mounted() {
            this.getWaitingContacts();
            this.getContacts();
            this.getPersonContacts();
        },
        methods: {
            getUserFullName(user) {
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            async getContacts() {
                this.user = await userStore.getUser();
                const {data} = await this.$http.get('/contacts/all/' + this.user.id);
                this.availableContacts = data;
            },
            async getWaitingContacts() {
                this.user = await userStore.getUser();
                const response = await this.$http.get('/contacts/waiting/' + this.user.id);
                this.requests = response.data;
                this.requests.forEach((request) => {
                    Object.assign(request, {type: 'Incoming'});
                });
            },
            async addContact() {
                this.user = await userStore.getUser();
                if (this.contact && this.contact.id) {
                    await this.$http.post('/contacts/add/' + this.user.id + '/' + this.contact.id);
                    this.field.value = '';
                    this.requests.push(this.contact);
                }
            },
            async getPersonContacts() {
                this.user = await userStore.getUser();
                const response = await this.$http.get('/contacts/id/' + this.user.id);
                this.userContacts = response.data;
            },
            async acceptContact(id) {
                this.user = await userStore.getUser();
                await this.$http.post('/contacts/accept/' + this.user.id + "/" + id);
                this.getPersonContacts();
                this.getWaitingContacts();
            },
            async removeRequest(contact) {
                this.user = await userStore.getUser();
                await this.$http.delete('/contacts/remove/' + this.user.id + '/' + contact.id);
                this.getWaitingContacts();
                this.getPersonContacts();
            },
        },
    };
</script>

<style scoped>
    .limegreen {
        color: limegreen;
    }

    .icons {
        width: 22px !important;
        height: 22px !important;
    }
</style>
