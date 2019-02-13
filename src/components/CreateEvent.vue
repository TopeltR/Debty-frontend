<template>
    <div class="row">
        <form>
            <div class="form-group" @submit.prevent>
                <label for="title">Title</label>
                <input type="text" class="form-control" id="title" placeholder="Enter event title">
            </div>
            <div class="form-group">
                <ul>
                    <li v-for="person in people">
                        <p>Name: {{ person.name }}</p>
                        <p>Email: {{ person.email }}</p>
                    </li>
                </ul>
                <label for="user">Add people</label>
                <input type="text" class="form-control" id="user" placeholder="Nimi" v-model="name">
                <input type="text" class="form-control" id="email" placeholder="Email" v-model="email">
                <button type="button" v-on:click="addPerson" class="btn btn-primary">Add user</button>
            </div>
            <div class="form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    import User from '../entities/User';

    export default {
        name: 'CreateEvent',
        data: () => ({
            name: '',
            email: '',
            people: [],
        }),
        methods: {
            addPerson(event) {
                console.log(this)
            },
            getPerson() {

            },
        },
    };
</script>

<style scoped>

</style>
