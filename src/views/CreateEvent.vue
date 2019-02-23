<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col sm="12" md="5" class="TM30px">
                    <b-row>
                        <form @submit.prevent="createEvent">
                            <b-col sm="12" md="6">
                                <div class="form-group">
                                    <label for="title">Title</label>
                                    <input type="text" class="form-control" id="title" placeholder="Enter event title">
                                </div>
                                <div class="form-group">
                                    <p v-if="people.length > 0">People:</p>
                                    <ul>
                                        <li v-for="person in people">
                                            {{ person.firstName }}
                                        </li>
                                    </ul>
                                    <label for="user">Add people</label>
                                    <input type="text" class="form-control" id="user" placeholder="Name" v-model="name">
                                    <b-row>
                                        <b-col sm="6" offset-sm="6" md="12">
                                            <button type="button" v-on:click="addPerson"
                                                    class="btn btn-primary button-wide">
                                                Add
                                            </button>
                                        </b-col>
                                    </b-row>
                                </div>
                            </b-col>
                            <b-row>
                                <b-col>
                                    <button type="submit" class="btn btn-primary">Create event</button>
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


    export default {
        name: 'CreateEvent',
        components: {Background, Navbar},
        data: () => ({
            name: '',
            people: [],
        }),
        methods: {
            addPerson() {
                if (this.name.length > 0) {
                    const user = this.searchUser();
                    this.people.push(user);
                    this.name = '';
                }
            },
            searchUser() {
                const user = new User();
                user.firstName = this.name;
                return user;
            },
            createEvent() {
                router.push('/');
            },
        },
    };
</script>

<style scoped>
    #user {
        margin-bottom: 5px;
    }

    .button-wide {
        width: 100%;
    }

    .TM30px {
        margin-top: 30px;
    }
</style>
