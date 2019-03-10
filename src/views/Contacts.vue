<template>
    <div>
        <navbar/>
            <background>
                <div class='search-wrapper'>
                    <h3>Add contact</h3>
                    <b-row>
                        <b-col>
                            <autocomplete id='search' v-model='contact' :placeholder='"Name"' :field='field'
                                          :items='contacts'
                                          :key-extractor='getUserFullName'></autocomplete>
                        </b-col>
                        <b-col>
                            <button type='button' v-on:click='' class='btn btn-primary wide'> Create debt </button>
                        </b-col>
                    </b-row>
                </div>
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
                contacts: [],
            };
        },
        mounted() {
          this.getContacts();
        },
        methods: {
            getUserFullName(user) {
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            getContacts() {
                const self = this;
                userStore.getUser().then((user) => {
                    self.$http.get('/users/contacts/id/' + user.id)
                        .then((data) => {
                            self.contacts = data.data;
                            console.log(self.contacts);
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
        width: 300px;
    }

</style>