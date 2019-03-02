<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col sm="12" md="6" offset-md="3" class="TM30px">
                    <b-row>
                        <form @submit.prevent="createEvent" class="wide">
                            <div class="form-group">
                                <label for="title">Title:</label>
                                <input type="text" class="form-control" v-model="title" id="title" required=""
                                       placeholder="Enter event title">
                            </div>
                            <div class="form-group">
                                <label for="description">Description:</label>
                                <textarea id="description" class="form-control" v-model="description" type="text"
                                          placeholder="Enter event description" required=""></textarea>
                            </div>
                            <div class="form-group">
                                <p v-if="people.length > 0">People:</p>
                                <ul>
                                    <li v-for="person in people">
                                        {{ keyExtractor(person) }}
                                    </li>
                                </ul>
                                <label for="user">Add people:</label>
                                <b-row>
                                    <b-col cols="9" class="PR0px">
                                        <autocomplete id="user" :placeholder="'Name'"
                                                      :items="allPeople"
                                                      :keyextractor="keyExtractor"></autocomplete>
                                    </b-col>
                                    <b-col cols="3">
                                        <button type="button" v-on:click="addPerson"
                                                class="btn btn-primary wide">
                                            Add
                                        </button>
                                    </b-col>
                                </b-row>
                            </div>
                            <b-row class="mt-4">
                                <b-col sm="12">
                                    <button type="button" v-on:click="createEvent"
                                            class="btn btn-primary wide">
                                        Create event
                                    </button>
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
    import {inputStore} from '@/components/Autocomplete'
    import userStore from '@/stores/UserStore';


    export default {
        name: 'CreateEvent',
        components: {Background, Navbar, Autocomplete},
        data: () => ({
            title: '',
            description: '',
            inputStore: inputStore,
            allPeople: [],
            people: [],
        }),
        mounted() {
            this.$http.get("/users/all").then((data) => {
                userStore.getUser().then(user => {
                    this.allPeople = data.data.filter((u) => u.email !== user.email);
                });
            }).catch((error) => {
                alert("You are not logged in!");
                router.push("/");
            });
        },
        methods: {
            keyExtractor(user) {
                return user.firstName + ' ' + user.lastName;
            },
            addPerson() {
                this.user = this.inputStore.value.object;
                userStore.getUser().then((user) => {
                    if (this.user.firstName && !this.people.includes(this.user) && this.user.email !== user.email) {
                        const user = this.user;
                        this.people.push(user);
                        this.allPeople = this.allPeople.filter((person) => !this.people.includes(person));
                        this.inputStore.setValue({email: '', firstName: '', lastName: ''});
                    }
                });
            },
            createEvent() {
                if (this.title && this.description)
                    userStore.getUser().then((user) => {
                        this.$http.post('/events', {
                            title: this.title,
                            people: this.people,
                            owner: user,
                        }).then((result) => {
                            router.push("/events/" + result.data.id);
                        });
                    });
            },
        },
    };
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
