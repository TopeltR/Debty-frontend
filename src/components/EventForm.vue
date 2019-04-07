<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col sm='12' md='6' offset-md='3' class='mt-5'>
                    <b-row>
                        <h2>Create event</h2>
                        <font-awesome-icon v-if="!eventId" id="info" icon='info-circle'
                                           class="ml-1"></font-awesome-icon>
                        <b-tooltip v-if="!eventId" target="info"
                                   title="Create an Event by giving it an informative title and contacts, then add your contacts to it."
                                   placement="bottom"></b-tooltip>
                    </b-row>
                    <b-row>
                        <form @submit.prevent='submitButtonHandler()' class='w-100 mt-3'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='title' id='title' required
                                       placeholder='Enter event title' maxlength="255">
                            </div>
                            <div class='form-group'>
                                <label for='description'>Description:</label>
                                <textarea id='description' class='form-control' v-model='description'
                                          placeholder='Enter event description' maxlength="255"></textarea>
                            </div>
                            <div class='form-group'>
                                <p v-if='addPersonState.people.length !== 0'>People:</p>
                                <ul>
                                    <li v-for='person in addPersonState.people'>
                                        {{ getFullName(person) }}
                                    </li>
                                </ul>
                                <label>Add people:</label>
                                <add-person :state="addPersonState"/>
                                <!--<b-row>
                                    <b-col cols='9' class='pr-0'>
                                        <autocomplete :required="false" id='user' v-model='user' :placeholder='"Name"' :field='field'
                                                      :items='allPeople' class="mb-3"
                                                      :key-extractor='getFullName'></autocomplete>
                                    </b-col>
                                    <b-col cols='3'>
                                        <b-btn v-on:click='addPerson' variant="primary" class='w-100'>
                                            Add
                                        </b-btn>
                                    </b-col>
                                </b-row>-->
                            </div>
                            <b-row class='mt-4'>
                                <b-col v-for="button in buttons" :cols="button.width" :offset="button.offset">
                                    <b-btn :type="button.type" :variant='button.variant'
                                           v-on:click='button.type !== "submit" ? button.handler : undefined'
                                           class='w-100'>
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
    import router from '../router.ts';
    import Background from '@/components/Background';
    import Navbar from '@/components/Navbar';
    import AddPerson from '@/components/AddPerson';
    import userStore from '@/stores/UserStore';

    export default {
        name: 'EventForm',
        components: {Background, Navbar, AddPerson},
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
                    type: "submit",
                    handler: (eventForm, store) => {
                        store.getUser().then((user) => {
                            eventForm.addPersonState.people.push(user);
                            eventForm.$http.post('/events', {
                                title: eventForm.title,
                                people: eventForm.addPersonState.people,
                                description: eventForm.description,
                                owner: user,
                            }).then((result) => {
                                router.push('/events/' + result.data.id);
                            });
                        });
                    },
                    variant: 'primary',
                }],
            },
        },
        data: () => ({
            pageTitle: 'Create event',
            tooltipDisplayProperty: 'block',
            title: '',
            description: '',
            bills: [],
            user: {},
            addPersonState: {
                allPeople: [],
                people: [],
            },
            submitButtonHandler: undefined,
            field: {value: ''},
        }),
        async mounted() {
            if (this.eventId) {
                const {data} = await this.$http.get('/events/' + this.eventId);
                this.title = data.title;
                this.description = data.description;
                this.addPersonState.people = data.people;
                this.bills = data.bills;
                this.pageTitle = 'Edit event';
                this.tooltipDisplayProperty = 'none';
            }

            for (const button of this.buttons) {
                this.fixButtonHandler(button);
            }
            const user = await userStore.getUser();
            const response = await this.$http.get('/contact/id/' + user.id);
            this.addPersonState.allPeople = response.data.filter((u) => u.email !== user.email);
        },
        methods: {
            fixButtonHandler(button) {
                const handler = button.handler;
                button.handler = () => handler(this, userStore);
                if (button.type === "submit") {
                    this.submitButtonHandler = () => button.handler(this, userStore);
                }
            },
            getFullName(user) {
                return user.firstName + ' ' + user.lastName;
            },
        },
    }
    ;
</script>

<style scoped>
</style>
