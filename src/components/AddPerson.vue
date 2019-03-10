<template>
    <b-row>
        <b-col cols='8' col-md="9">
            <autocomplete id='user' v-model='user' :placeholder='"Name"' :field='field'
                          :items='state.allPeople'
                          :key-extractor='getFullName'></autocomplete>
        </b-col>
        <b-col cols='4' col-md="3">
            <button type='button' v-on:click='addPerson'
                    class='btn btn-primary wide'>
                Add
            </button>
        </b-col>
    </b-row>
</template>

<script>
    import Autocomplete from '@/components/Autocomplete.vue';
    import userStore from '../stores/UserStore.ts';

    export default {
        name: "AddPerson",
        components: {Autocomplete},
        props: {
            state: {
                type: Object,
                allPeople: {
                    type: Array,
                },
                people: {
                    type: Array,
                },
            },
        },
        data: () => ({
            user: {},
            field: {value: ''},
        }),
        mounted() {

        },
        methods: {
            getFullName(user) {
                return user.firstName + ' ' + user.lastName;
            },
            addPerson() {
                userStore.getUser().then((user) => {
                    if (this.user && this.user.firstName && !this.state.people.map(user => user.email).includes(this.user.email)
                        && this.user.email !== user.email) {
                        this.state.people.push(this.user);
                        this.state.allPeople = this.state.allPeople.filter((person) => !this.state.people.includes(person));
                        this.field.value = '';
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .wide {
        width: 100%;
    }
</style>
