<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            {{pageTitle}}
            <div class="d-inline" v-if="!selectedBill">
                <font-awesome-icon id="add-bill-info" icon='info-circle'
                                   class="ml-1"></font-awesome-icon>
                <b-tooltip target="add-bill-info"
                           title="Here you can add bill to the event, remember to add participants!"
                           placement="bottom"></b-tooltip>
            </div>
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
                                <autocomplete id="buyer" v-model="buyer" :field="field" v-on:input="updateBuyer"
                                              :items="allPeople"
                                              :keyExtractor="getFullName"/>
                            </div>
                            <div class="form-group inline-form">
                                <label class="PR5px" for="sum">Sum:</label>
                                <input type="text" class="inline form-control skinny" id="sum" v-model="bill.sum"
                                       required="" v-on:change="displayNotMatchMessage">
                                <span class="ml-1">€</span>
                            </div>
                            <div class='form-group'>
                                <p v-if='addPersonState.people.length > 0'>Participants:</p>
                                <ul>
                                    <li v-for='person in addPersonState.people' v-bind:key='person.id'>
                                        <div class="form-group inline-form">
                                            <label class="PR5px col-9 col-md-6" :for="person.firstName">{{
                                                getFullName(person)
                                                }}</label>
                                            <input type="number" class="inline form-control skinny participation col-3"
                                                   :id="person.firstName" v-model="person.participation" required=""
                                                   v-on:change="displayNotMatchMessage">
                                            <span class="ml-1 col-1">€</span>
                                        </div>
                                    </li>
                                </ul>
                                <label for='user'>Add participants:</label>
                                <add-person id="user" :state="addPersonState"/>
                                <p class="red MT29px" v-bind:style='{display: notMatchDisplayProperty}'>Sum and
                                    participations
                                    don't match!</p>
                                <p class="red MT29px" v-bind:style="{display: errorDisplayProperty}">Not all required
                                    fields filled</p>
                            </div>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
        </div>
        <div class="col-12" slot="modal-footer">
            <b-row>
                <b-col cols="6">
                    <b-button class="wide" variant="secondary" v-on:click="closeModal">Cancel</b-button>
                </b-col>
                <b-col cols="6">
                    <b-button class="wide" variant="primary" v-on:click="save">Save</b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import AddPerson from '@/components/AddPerson.vue';
    import Autocomplete from "./Autocomplete";
    import userStore from "../stores/UserStore";

    export default {
        name: 'AddBill',
        components: {Autocomplete, AddPerson},
        props: {
            state: {
                type: Object,
                showing: {
                    type: Boolean,
                },
                default: () => ({
                    showing: false,
                }),
            },
            selectedBill: {
                title: {type: String, default: ''},
                description: {type: String, default: ''},
                sum: {type: Number, default: 0},
                buyer: {type: Object, default: () => ({})},
                people: {type: Array, default: () => ([])},
                billPayments: {type: Array, default: () => ([])},
                creator: {type: Object},
            },
            event: {
                id: {type: String},
                people: {type: Array},
                owner: {type: Object},
                description: {type: String},
                bills: {type: Object},
            },
        },
        computed: {
            eventPeople() {
                return this.event.people;
            }
        },
        watch: {
            state: {
                deep: true,
                handler(state) {
                    if (state.showing) {
                        this.$refs.modal.show();
                    } else {
                        this.$refs.modal.hide();
                    }
                },
            },
            selectedBill() {
                this.setSelectedBillInfo();
            },
            eventPeople(people) {
                this.initPeople(people);
            }
        },
        async mounted() {
            this.user = await userStore.getUser();
            this.initPeople();
            this.setSelectedBillInfo();
        },
        data: () => ({
            initialBill: {},
            pageTitle: 'Add bill',
            user: {},
            field: {value: ''},
            allPeople: [],
            buyer: {},
            participationChanged: false,
            billChanged: false,
            notMatchDisplayProperty: 'none',
            errorDisplayProperty: 'none',
            peopleInited: false,
            bill: {
                title: '',
                description: '',
                sum: 0,
                buyer: {},
                creator: {},
                people: [],
                billPayments: [],
            },
            addPersonState: {
                allPeople: [],
                people: [],
            },
        }),
        methods: {
            closeModal() {
                this.state.showing = false;
            },
            initPeople(people) {
                people = (people || this.event.people).map((u) => (u));
                if (!this.peopleInited && people) {
                    this.allPeople = people.map((u) => {
                        u.participation = 0;
                        return u;
                    });
                    // Copy, can't be same
                    this.addPersonState.allPeople = this.allPeople.filter((u) => !this.bill.people.includes(u));
                    this.addPersonState.people = this.bill.people;
                    this.peopleInited = true;
                }
            },
            setSelectedBillInfo() {
                if (this.selectedBill) {
                    const bill = this.selectedBill;
                    for (const payment of bill.billPayments) {
                        const person = bill.people.find((p) => p.email === payment.person.email);
                        person.participation = payment.sum;
                    }

                    this.bill = {...bill};
                    if (!this.bill.people) {
                        this.bill.people = [];
                    }
                    this.initialBill = {...bill};
                    this.buyer = this.bill.buyer;
                    this.field.value = this.buyer.firstName + ' ' + this.buyer.lastName;
                    this.addPersonState.people = this.bill.people;
                    this.pageTitle = 'Edit bill';
                }
            },
            updateBuyer() {
                if (this.buyer && this.buyer.firstName) {
                    this.bill.buyer = this.buyer;
                    if (!this.addPersonState.people.map((p) => (p.email)).includes(this.buyer.email)) {
                        this.addPersonState.people.push(this.buyer);
                    }
                    this.buyer = {};
                }
            },
            getFullName(person) {
                return person.firstName + ' ' + person.lastName;
            },
            roundToTwoDecimalPoints(nr) {
                return Math.round(nr * 100) / 100;
            },
            displayNotMatchMessage() {
                const match =
                    this.roundToTwoDecimalPoints(this.addPersonState.people.map((u) => Number(u.participation))
                        .reduce((a, b) => this.roundToTwoDecimalPoints(a + b), 0))
                    === this.roundToTwoDecimalPoints(Number(this.bill.sum));
                if (!match) {
                    this.notMatchDisplayProperty = 'block';
                } else {
                    this.notMatchDisplayProperty = 'none';
                }
            },
            async save() {
                if (this.bill.title && this.bill.people.length > 0) {
                    this.errorDisplayProperty = 'none';
                    this.bill.people = this.addPersonState.people;

                    this.bill.billPayments = [];
                    for (const person of this.bill.people) {
                        this.bill.billPayments.push({
                            person,
                            sum: person.participation,
                        });
                    }

                    this.bill.creator = await userStore.getUser();

                    const response = await this.$http.post('/events/' + this.event.id + '/bills', this.bill);
                    this.event.bills = response.data.bills;

                    this.closeModal();
                } else {
                    this.errorDisplayProperty = 'block';
                }
            }
        },
    };
</script>

<style scoped>
    .wide {
        width: 100%;
    }

    .PR5px {
        padding-right: 5px;
    }

    .inline {
        display: inline;
    }

    .inline-form {
        white-space: nowrap;
    }

    .skinny {
        width: 70px;
    }

    .red {
        color: red;
    }

    .MT29px {
        margin-top: 29px;
    }
</style>
