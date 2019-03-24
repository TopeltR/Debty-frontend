<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col sm='12' md='6' offset-md='3' class='TM30px'>
                    <b-row>
                        <h2>Create Event</h2>
                        <font-awesome-icon id="info" icon='info-circle' class="ml-1"></font-awesome-icon>
                        <b-tooltip target="info"
                                   title="Create an Event by giving it an informative title and contacts, then add your contacts to it."
                                   placement="bottom"></b-tooltip>
                    </b-row>
                    <b-row>
                        <form @submit.prevent='' class='wide mt-3'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='title' id='title' required=''
                                       placeholder='Enter event title'>
                            </div>
                            <div class='form-group'>
                                <label for='description'>Description:</label>
                                <textarea id='description' class='form-control' v-model='description' type='text'
                                          placeholder='Enter event description' required=''></textarea>
                            </div>
                            <div class='form-group'>
                                <p v-if='people.length > 0'>People:</p>
                                <ul>
                                    <li v-for='person in people'>
                                        {{ getFullName(person) }}
                                    </li>
                                </ul>
                                <label for='user'>Add people:</label>
                                <b-row>
                                    <b-col cols='9' class='PR0px'>
                                        <autocomplete id='user' v-model='user' :placeholder='"Name"' :field='field'
                                                      :items='allPeople'
                                                      :key-extractor='getFullName'></autocomplete>
                                    </b-col>
                                    <b-col cols='3'>
                                        <button type='button' v-on:click='addPerson'
                                                class='btn btn-primary wide'>
                                            Add
                                        </button>
                                    </b-col>
                                </b-row>
                            </div>
                            <b-row class='mt-4'>
                                <b-col v-for="button in buttons" :cols="button.width" :offset="button.offset">
                                    <b-btn :variant='button.variant'
                                           v-on:click='button.handler'
                                           class='wide'>
                                        {{button.name}}
                                    </b-btn>
                                </b-col>
                            </b-row>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
        </background>
    </div>
</template>

<script>
    import User from '../entities/User';
    import router from '../router.ts';
    import Background from '@/components/Background';
    import Navbar from '@/components/Navbar';
    import Autocomplete from '@/components/Autocomplete';
    import userStore from '@/stores/UserStore';

    export default {
        name: 'EventForm',
        components: {Background, Navbar, Autocomplete},
        props: {
            eventId: {
                type: Number,
                default: undefined,
            },
            buttons: {
                type: Array,
                default: () => [{
                    width: 12,
                    offset: 0,
                    name: "Create event",
                    handler: (eventForm, userStore) => {
                        if (eventForm.title && eventForm.description) {
                            userStore.getUser().then((user) => {
                                eventForm.people.push(user);
                                eventForm.$http.post('/events', {
                                    title: eventForm.title,
                                    people: eventForm.people,
                                    description: eventForm.description,
                                    owner: user,
                                }).then((result) => {
                                    router.push('/events/' + result.data.id);
                                });
                            });
                        }
                    },
                    variant: 'primary',
                }],
            },
        },
        data: () => ({
            title: '',
            description: '',
            bills: [],
            user: {},
            allPeople: [],
            people: [],
            field: {value: ''},
        }),
        mounted() {
            if (this.eventId) {
                this.$http.get('/events/' + this.eventId).then((data) => {
                    data = data.data;
                    this.title = data.title;
                    this.description = data.description;
                    this.people = data.people;
                    this.bills = data.bills;
                });
            }

            for (let i = 0; i < this.buttons.length; i++) {
                let button = this.buttons[i];
                let handler = button.handler;
                button.handler = () => {
                    handler(this, userStore);
                };
            }
            userStore.getUser().then((user) => {
                this.$http.get('/contact/id/' + user.id).then((data) => {
                    this.allPeople = data.data.filter((u) => u.email !== user.email);
                });
            });
        },
        methods: {
            getFullName(user) {
                return user.firstName + ' ' + user.lastName;
            },
            addPerson() {
                userStore.getUser().then((user) => {
                    if (this.user && this.user.firstName && !this.people.map((user) => user.email).includes(this.user.email)
                        && this.user.email !== user.email) {
                        this.people.push(this.user);
                        this.allPeople = this.allPeople.filter((person) => !this.people.includes(person));
                        this.field.value = '';
                    }
                });
            },
        },
    }
    ;
</script>

<style scoped>
    #user {
        margin-bottom: 5px;
    }

    #description {
        height: 100px;
    }

    .wide {
        width: 100%;
    }

    .PR0px {
        padding-right: 0;
    }

    .TM30px {
        margin-top: 30px;
    }

</style>
