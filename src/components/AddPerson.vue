<template>
    <b-row>
        <b-col cols='8' col-md="9">
            <autocomplete :required='false' id='user' v-model='user' :placeholder='"Name"' :field='field'
                          :items='state.allPeople'
                          :keyExtractor="getFullName"/>
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
    import userStore from "../stores/UserStore";

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
        methods: {
            getFullName(user) {
                return user.firstName + ' ' + user.lastName;
            },
            addPerson() {
                if (this.user && this.user.firstName && !this.state.people.map((user) => user.email)
                    .includes(this.user.email)) {
                    this.state.people.push(this.user);
                    this.state.allPeople = this.state.allPeople.filter((person) => !this.state.people.includes(person));
                    this.field.value = '';
                }
            },
        },
    };
</script>

<style scoped>
    .wide {
        width: 100%;
    }
</style>
