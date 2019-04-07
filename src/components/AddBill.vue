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
                <div>
                    <b-row>
                        <form @submit.prevent='' class='w-100'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='bill.title' id='title' required
                                       placeholder='Enter bill title' maxlength="255">
                            </div>
                            <div class='form-group'>
                                <label for='description'>Description:</label>
                                <textarea id='description' class='form-control' v-model='bill.description'
                                          placeholder='Enter bill description' required maxlength="255"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="buyer">Buyer:</label>
                                <autocomplete id="buyer" v-model="buyer" :field="field" v-on:input="updateBuyer"
                                              :items="allPeople"
                                              :keyExtractor="getFullName"/>
                            </div>
                            <div class="form-group inline-form">
                                <label for="sum" class="pr-3">Sum:</label>
                                <input type="text" class="d-inline form-control skinny" id="sum" v-model="bill.sum"
                                       required v-on:change="displayNotMatchMessage" maxlength="255">
                                <span class="ml-1">€</span>
                            </div>
                            <div class='form-group'>
                                <p v-if='addPersonState.people.length > 0'>Participants:</p>
                                <div v-for='person in addPersonState.people' v-bind:key='person.id'>
                                    <b-col cols="11" offset="1" class="form-group">
                                        <b-row>
                                            <b-col cols="5" md="6">
                                                <label :for="person.firstName">
                                                    {{getFullName(person)}}
                                                    <small v-if="isOwner(person)"> (owner)</small>
                                                </label>
                                            </b-col>
                                            <b-col cols="5" md="4">
                                                <input type="number" class="form-control"
                                                       :id="person.firstName" v-model="person.participation"
                                                       required maxlength="255" v-on:change="displayNotMatchMessage">

                                            </b-col>
                                            <b-col cols="1" class="pt-2">
                                                <span>€</span>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </div>
                                <label for='user'>Add participants:</label>
                                <add-person id="user" :state="addPersonState"/>
                                <p class="text-danger mt-5" v-bind:style='{display: notMatchDisplayProperty}'>
                                    Sum and participations don't match!</p>
                                <p class="text-danger mt-5" v-bind:style="{display: errorDisplayProperty}">
                                    Not all required fields filled</p>
                            </div>
                        </form>
                    </b-row>
                </div>
            </b-row>
        </div>
        <div class="col-12" slot="modal-footer">
            <b-row v-if="canDelete()">
                <b-col cols="6">
                    <b-button class="w-100" variant="danger" v-on:click="deleteBill">Delete</b-button>
                </b-col>
                <b-col cols="6">
                    <b-button class="w-100" variant="primary" v-on:click="save">Save</b-button>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <b-button class="w-100" variant="primary" v-on:click="save">Save</b-button>
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
            },
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
            },
        },
        async mounted() {
            this.user = await userStore.getUser();
            this.initPeople();
            this.setSelectedBillInfo();
        },
        data: () => ({
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
            mapParticipationsFromPaymentsToPersons() {
                const bill = this.selectedBill;
                for (const payment of bill.billPayments) {
                    const person = bill.people.find((p) => p.email === payment.person.email);
                    person.participation = payment.sum;
                }
            },
            initBillPeopleList() {
                this.bill = {...this.selectedBill};
                if (!this.bill.people) {
                    this.bill.people = [];
                }
            },
            initAddPersonPropsAndState() {
                this.buyer = this.bill.buyer;
                this.field.value = this.buyer.firstName + ' ' + this.buyer.lastName;
                this.addPersonState.people = this.bill.people;
            },
            setSelectedBillInfo() {
                if (this.selectedBill) {
                    this.mapParticipationsFromPaymentsToPersons();
                    this.initBillPeopleList();
                    this.initAddPersonPropsAndState();
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
            participationsMatchSum() {
                return this.roundToTwoDecimalPoints(this.addPersonState.people.map((u) => Number(u.participation))
                        .reduce((a, b) => this.roundToTwoDecimalPoints(a + b), 0))
                    === this.roundToTwoDecimalPoints(Number(this.bill.sum));
            },
            displayNotMatchMessage() {
                if (!this.participationsMatchSum()) {
                    this.notMatchDisplayProperty = 'block';
                } else {
                    this.notMatchDisplayProperty = 'none';
                }
            },
            mapBillPaymentsFromPeopleParticipations() {
                this.bill.billPayments = [];
                for (const person of this.bill.people) {
                    this.bill.billPayments.push({
                        person,
                        sum: person.participation,
                    });
                }
            },
            async saveBill() {
                const response = await this.$http.post('/events/' + this.event.id + '/bills', this.bill);
                this.event.bills = response.data.bills;
            },
            async save() {
                if (this.bill.title && this.bill.people.length > 0) {
                    this.errorDisplayProperty = 'none';

                    this.bill.people = this.addPersonState.people;
                    this.mapBillPaymentsFromPeopleParticipations();
                    this.bill.creator = await userStore.getUser();

                    await this.saveBill();
                    this.closeModal();
                } else {
                    this.errorDisplayProperty = 'block';
                }
            },
            async deleteBill() {
                if (confirm("Are you sure?")) {
                    await this.$http.delete('/events/' + this.event.id + '/bills/' + this.bill.id);
                    window.location.reload();
                }
            },
            canDelete() {
                return this.selectedBill != null &&
                    (this.selectedBill.creator != null && this.user.id === this.selectedBill.creator.id ||
                        this.event.owner != null && this.user.id === this.event.owner.id);
            },
            isOwner(user) {
                return user != null && this.selectedBill.creator != null && user.id === this.selectedBill.creator.id;
            },
        },
    };
</script>

<style scoped>
    .inline-form {
        white-space: nowrap;
    }

    .skinny {
        width: 70px;
    }
</style>
