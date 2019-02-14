<template>
    <b-row>
        <b-col sm="12" md="5">
            <form @submit.prevent="createEvent">
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
                    <button type="button" v-on:click="addPerson" class="btn btn-primary">Add</button>
                </div>
                <button type="submit" class="btn btn-primary">Create event</button>
            </form>
        </b-col>
    </b-row>
</template>

<script>
    import User from '../entities/User';
    import router from '../router.ts';

    export default {
        name: 'CreateEvent',
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
</style>
