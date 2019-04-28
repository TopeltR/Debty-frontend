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
                <b-col cols="12">
                    <b-row>
                        <form @submit.prevent='save()' ref="form" class='w-100'>
                            <div class='form-group'>
                                <input-label :required="true" for="title">Title</input-label>
                                <input type='text' class='form-control' v-model='bill.title' id='title' required
                                       placeholder='Enter bill title' minlength="1" maxlength="255">
                            </div>
                            <div class='form-group'>
                                <input-label for='description'>Description</input-label>
                                <textarea id='description' class='form-control' v-model='bill.description'
                                          placeholder='Enter bill description' maxlength="255"></textarea>
                            </div>
                            <div class="form-group">
                                <input-label :required="true" for="buyer">Buyer</input-label>
                                <autocomplete id="buyer" v-model="buyer" :field="field" v-on:input="updateBuyer"
                                              :items="allPeople" :required="true"
                                              :keyExtractor="getFullName"/>
                            </div>
                            <div class="form-group inline-form">
                                <input-label :required="true" for="sum" class="pr-3">Sum</input-label>
                                <input type="number" step="0.01" class="d-inline form-control skinny" id="sum"
                                       v-model="bill.sum"
                                       required v-on:change="displayNotMatchMessage" min="0" maxlength="255">
                                <span class="ml-1">€</span>
                                <b-btn @click="calculateSum" class="float-right" variant="outline-primary">Calculate
                                </b-btn>
                            </div>
                            <div class='form-group'>
                                <p v-if='addPersonState.people.length > 0'>Participants:</p>
                                <div v-for='person in addPersonState.people' :key='participationChanged'>
                                    <b-col cols="12" class="form-group ml-1 pr-0">
                                        <b-row>
                                            <b-col class="mt-1" cols="6" col-md="7">
                                                <label :for="person.firstName">
                                                    <person :person="person" :addPersonState="addPersonState"
                                                            :owner="isOwner(person)" :disableOwnerDelete="true"/>
                                                </label>
                                            </b-col>
                                            <b-col cols="4" col-md="3">
                                                <input type="number" class="form-control"
                                                       :id="person.firstName" step="0.01" v-model="person.participation"
                                                       required min="0" maxlength="255"
                                                       v-on:change="displayNotMatchMessage">
                                            </b-col>
                                            <b-col cols="1" class="pt-2">
                                                <span>€</span>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </div>
                                <div v-if="billPeople && billPeople.length > 0">
                                    <b-col cols="12" class="form-group ml-1 pr-0">
                                        <b-row>
                                            <b-col class="mt-1" sm="6">
                                            </b-col>
                                            <b-col cols="11" sm="4">
                                                <b-btn @click="divideParticipationsEqually" variant="outline-primary" class="w-100">
                                                    Divide sum
                                                </b-btn>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                </div>
                                <input-label for='user'>Add participants</input-label>
                                <add-person id="user" :state="addPersonState"/>
                                <p class="text-danger mt-5" :key="notMatchDisplayProperty"
                                   v-bind:style='{display: notMatchDisplayProperty}'>
                                    {{errorMessage}}</p>
                            </div>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
        </div>
        <div class="col-12" slot="modal-footer">
            <b-row v-if="canDelete()">
                <b-col cols="6">
                    <b-btn class="w-100" variant="danger" v-on:click="deleteBill">Delete</b-btn>
                </b-col>
                <b-col cols="6">
                    <b-btn class="w-100" variant="primary" v-on:click="submit">Save</b-btn>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col>
                    <b-btn class="w-100" variant="primary" v-on:click="submit">Save</b-btn>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import AddPerson from '@/components/AddPerson.vue';
    import Autocomplete from "@/components/Autocomplete.vue";
    import userStore from "@/stores/UserStore";
    import Person from "@/components/Person.vue";
    import InputLabel from "@/components/InputLabel.vue";
    import fromArray from "@/utils";

    export default {
        name: 'AddBill',
        components: {Person, Autocomplete, AddPerson, InputLabel},
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
            billPeople() {
                return this.addPersonState.people;
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
            addPersonState: {
                deep: true,
                handler() {
                    this.displayNotMatchMessage();
                },
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
            participationChanged: 0,
            billChanged: false,
            errorDisplayProperty: 'none',
            notMatchDisplayProperty: 'none',
            errorMessage: 'Sum and participations don\'t match!',
            notMatchErrorMessage: 'Sum and participations don\'t match!',
            negativeErrorcMessage: 'Negative sums not allowed!',
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
            peopleContains(person) {
                return person && person.email && this.addPersonState.people.map((p) => (p.email)).includes(person.email);
            },
            removePreviousOwnerIfNewOwnerIsntInParticipants() {
                if (this.peopleContains(this.bill.buyer) && this.bill.buyer.email !== this.buyer.email
                    && !this.peopleContains(this.buyer)) {
                    fromArray(this.addPersonState.people).removeElement(this.bill.buyer, (person) => person.email);
                }
            },
            addBuyerToPeopleIfNotInPeople() {
                if (!this.peopleContains(this.buyer)) {
                    this.addPersonState.people.push(this.buyer);
                }
            },
            updateBuyer() {
                if (this.buyer && this.buyer.firstName) {
                    this.removePreviousOwnerIfNewOwnerIsntInParticipants();
                    this.bill.buyer = this.buyer;
                    this.addBuyerToPeopleIfNotInPeople();
                    this.buyer = {};
                }
            },
            getFullName(person) {
                return person.firstName + ' ' + person.lastName;
            },
            roundToTwoDecimalPoints(nr) {
                return Math.round(nr * 100) / 100;
            },
            setErrorMessage(greaterThanZero) {
                if (!greaterThanZero) {
                    this.errorMessage = this.negativeErrorMessage;
                } else {
                    this.errorMessage = this.notMatchErrorMessage;
                }
            },
            participationsMatchSum() {
                const participations = this.roundToTwoDecimalPoints(
                    this.addPersonState.people.map((u) => Number(u.participation))
                        .reduce((a, b) => this.roundToTwoDecimalPoints(a + b), 0));
                const sum = this.roundToTwoDecimalPoints(Number(this.bill.sum));
                const greaterThanZero = participations >= 0 && sum >= 0;
                this.setErrorMessage(greaterThanZero);
                return greaterThanZero && participations === sum;
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
                this.bill.people = this.addPersonState.people;
                this.mapBillPaymentsFromPeopleParticipations();
                this.bill.creator = await userStore.getUser();

                await this.saveBill();
                this.closeModal();
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
                return user != null && this.selectedBill != null
                    && this.selectedBill.creator != null
                    && user.id === this.selectedBill.creator.id;
            },
            calculateSum() {
                this.bill.sum = 0;
                for (const person of this.billPeople) {
                    this.bill.sum += Number(person.participation);
                }
                this.displayNotMatchMessage();
            },
            divideParticipationsEqually() {
                const participation = this.bill.sum / this.addPersonState.people.length;
                const participationRounded = this.roundToTwoDecimalPoints(participation);
                let sum = 0;

                this.billPeople.forEach((person) => {
                    person.participation = participationRounded;
                    sum += participationRounded;
                });

                this.billPeople[this.billPeople.length - 1].participation += (this.bill.sum - sum);
                this.toggleParticipationChanged();
                this.displayNotMatchMessage();
            },
            toggleParticipationChanged() {
                this.participationChanged++;
            },
            submit() {
                const form = this.$refs.form;
                if (!form.checkValidity()) {
                    form.reportValidity();
                } else {
                    this.save();
                }
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
