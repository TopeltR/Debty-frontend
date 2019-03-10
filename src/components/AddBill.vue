<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            Add bill
        </div>
        <div class="col-10 offset-1">
            <b-row>
                <b-col cols="12" class='TM30px'>
                    <b-row>
                        <form @submit.prevent='' class='wide'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='bill.title' id='title' required=''
                                       placeholder='Enter bill title'>
                            </div>
                            <div class='form-group'>
                                <label for='description'>Description:</label>
                                <textarea id='description' class='form-control' v-model='bill.description' type='text'
                                          placeholder='Enter bill description' required=''></textarea>
                            </div>
                            <div class="form-group">
                                <label for="buyer">Buyer:</label>
                                <autocomplete id="buyer" v-model="buyer" v-on:input="updateBuyer" :items="allPeople"
                                              :keyExtractor="getFullName"/>
                            </div>
                            <div class="form-group">
                                <label for="sum">Sum:</label>
                                <input type="text" class="form-control" id="sum" v-model="bill.sum" required="">
                            </div>
                            <div class='form-group'>
                                <p v-if='addPersonState.people.length > 0'>Participants:</p>
                                <ul>
                                    <li v-for='person in addPersonState.people'>
                                        <!--TODO: Calculate and add person.participation after adding-->
                                        <p>{{ getFullName(person) }}</p>
                                        <!--<input v-model="person.participation">-->
                                    </li>
                                </ul>
                                <label for='user'>Add participants:</label>
                                <add-person id="user" :state="addPersonState"/>
                            </div>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
        </div>
        <div class="col-12" slot="modal-footer">
            <b-row>
                <b-col cols="6">
                    <b-button class="wide" variant="secondary" v-on:click="cancel">Cancel</b-button>
                </b-col>
                <b-col cols="6">
                    <b-button class="wide" variant="primary" v-on:click="save">Save</b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import AddPerson from '@/components/AddPerson.vue'
    import router from '../router.ts';
    import userStore from '../stores/UserStore.ts'
    import Autocomplete from "./Autocomplete";


    export default {
        name: 'AddBill',
        components: {Autocomplete, AddPerson},
        props: {
            state: {
                type: Object,
                showing: {
                    type: Boolean
                },
                default: () => ({
                    showing: false
                }),
            },
            eventId: {
                type: Number
            }
        },
        watch: {
            state: {
                deep: true,
                handler: function (state) {
                    if (state.showing) {
                        this.$refs.modal.show();
                    } else {
                        this.$refs.modal.hide();
                    }
                }
            }
        },
        mounted() {
            this.$http.get('/users/all').then((data) => {
                userStore.getUser().then((user) => {
                    this.allPeople = data.data.filter((u) => u.email !== user.email);
                    // Copy, can't be same
                    this.addPersonState.allPeople = this.allPeople.filter((u) => u);
                });
            }).catch((error) => {
                console.log(error);
                alert('You are not logged in!');
                router.push('/');
            });
            this.bill.people = this.addPersonState.people
        },
        data: () => ({
            user: {},
            field: {},
            allPeople: [],
            buyer: {},
            bill: {
                title: '',
                description: '',
                sum: 0,
                buyer: {},
                people: [],
            },
            addPersonState: {
                allPeople: [],
                people: []
            }
        }),
        methods: {
            updateBuyer() {
                if (this.buyer && this.buyer.firstName) {
                    this.addPersonState.people.removeElement(this.bill.buyer, (person) => person.email);
                    this.bill.buyer = this.buyer;
                    this.addPersonState.people.push(this.buyer);
                    this.buyer = {};
                }
            },
            getFullName(person) {
                return person.firstName + ' ' + person.lastName;
            },
            save() {
                if (this.bill.title && this.bill.description && this.bill.people.length > 0) {
                    this.$http.post('/events/' + this.eventId + '/bills', this.bill)
                        .then((response) => {
                            this.state.showing = false;
                        });
                }
            },
            cancel() {
                this.state.showing = false;
            }
        },
    }
</script>

<style scoped>
    .wide {
        width: 100%;
    }
</style>
