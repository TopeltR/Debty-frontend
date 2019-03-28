<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row v-if="!editing">
                <b-col sm="12" md="6" offset-md="3">
                    <b-row class="mt-5">
                        <b-col>
                            <h1> {{ debt.title }} </h1>
                        </b-col>
                    </b-row>
                    <b-row class="mt-4">
                        <b-col cols="3">
                            <b>Debtor:</b>
                        </b-col>
                        <b-col cols="9">
                            {{ getUserFullName(debt.payer) }}
                            <small v-if="debt.payer != null && debt.owner != null && debt.payer.id === debt.owner.id">
                                (owner)
                            </small>
                        </b-col>
                    </b-row>
                    <b-row class="mt-4">
                        <b-col cols="3">
                            <b>Receiver:</b>
                        </b-col>
                        <b-col cols="9">
                            {{ getUserFullName(debt.receiver) }}
                            <small v-if="debt.receiver != null && debt.owner != null && debt.receiver.id === debt.owner.id">
                                (owner)
                            </small>
                        </b-col>
                    </b-row>
                    <b-row class="mt-4">
                        <b-col cols="3">
                            <b>Sum: </b>
                        </b-col>
                        <b-col cols="9">
                            {{ debt.sum }}€
                        </b-col>
                    </b-row>
                    <b-row class="mt-4">
                        <b-col cols="3">
                            <b>Created:</b>
                        </b-col>
                        <b-col cols="9">
                            {{ new Date(debt.createdAt).toLocaleString() }}
                        </b-col>
                    </b-row>
                    <b-row v-if="debt.modifiedAt !== debt.createdAt" class="mt-4">
                        <b-col cols="3">
                            <b>Modified:</b>
                        </b-col>
                        <b-col cols="9">
                            {{ new Date(debt.modifiedAt).toLocaleString() }}
                        </b-col>
                    </b-row>
                    <b-row class="mt-3" v-if="debt.owner != null && user != null && debt.owner.id === user.id">
                        <b-col>
                            <b-button variant="danger" class="mt-3 w-25" v-on:click="deleteDebt">Delete</b-button>
                            <b-button variant="primary" class="mt-3 w-25 ml-2" v-on:click="editDebt">Edit</b-button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col sm="12" md="6" offset-md="3" class="w-100">
                    <b-row class="mt-5">
                        <form @submit.prevent='createDebt' class='w-100'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='debt.title' id='title'
                                       placeholder='Enter debt title'>
                            </div>
                            <div class='form-group'
                                 v-if="debt.receiver != null && debt.owner != null && debt.receiver.id === debt.owner.id">
                                <label>From:</label>

                                <autocomplete id='payer' v-model='debt.payer' :placeholder='"Name"' :field='field'
                                              :items='contacts'
                                              :key-extractor='getUserFullName'></autocomplete>
                            </div>
                            <div class='form-group'
                                 v-if="debt.payer != null && debt.owner != null && debt.payer.id === debt.owner.id">
                                <label>To:</label>

                                <autocomplete id='receiver' v-model='debt.receiver' :placeholder='"Name"' :field='field'
                                              :items='contacts'
                                              :key-extractor='getUserFullName'></autocomplete>
                            </div>
                            <div class='form-group'>
                                <b-row>
                                    <b-col cols='2'>
                                        <label for='sum' class='mt-2'>Sum:</label>
                                    </b-col>
                                    <b-col cols='3'>
                                        <input id='sum' type='text' class='form-control pr-0' v-model='debt.sum'
                                               placeholder='0'>
                                    </b-col>
                                    <b-col cols='1' class='mt-2 pl-0'>€</b-col>
                                </b-row>
                            </div>
                            <b-row class='mt-4'>
                                <b-col cols="6">
                                    <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel</b-button>
                                </b-col>
                                <b-col cols="6">
                                    <b-button class="w-100" variant="primary" v-on:click="saveDebt">Save</b-button>
                                </b-col>
                            </b-row>

                        </form>
                    </b-row>
                </b-col>
            </b-row>
            <b-row v-if="isPayer()">
                <b-col cols="12" md="9" offset-md="3" class="mt-5">
                    <h2>Maksa</h2>
                    <img v-on:click="payWithSEB" src="../assets/seb-logo.png"/>
                    <img v-on:click="payWithLHV" class="lhv" src="../assets/lhv_logo.jpg"/>
                    <img v-on:click="payWithSwed" class="swed" src="../assets/swedbank-logo.png"/>
                </b-col>
            </b-row>
        </background>
    </div>
</template>

<script>
    import router from '../router.ts';
    import Background from '@/components/Background';
    import Navbar from '@/components/Navbar';
    import BRow from "bootstrap-vue/src/components/layout/row";
    import Autocomplete from '@/components/Autocomplete';
    import userStore from '@/stores/UserStore';
    import BCol from "bootstrap-vue/src/components/layout/col";

    export default {
        name: 'CreateEvent',
        components: {BCol, BRow, Background, Navbar, Autocomplete},
        data: () => ({
            debtId: null,
            debt: {},
            editing: false,
            contacts: [],
            field: {value: ''},
            user: null,
        }),
        async mounted() {
            this.debtId = Number(this.$route.params.id);
            this.loadDebt();

            const usersResponse = await this.$http.get('/users/all');
            this.user = await userStore.getUser();
            this.contacts = usersResponse.data.filter((u) => u.email !== this.user.email);
        },
        methods: {
            async loadDebt() {
                const debtResponse = await this.$http.get('/debts/' + this.debtId);
                this.debt = debtResponse.data;
                if (this.debt.payer.id === this.debt.owner.id) {
                    this.field.value = this.getUserFullName(this.debt.receiver);
                } else {
                    this.field.value = this.getUserFullName(this.debt.payer);
                }
            },
            getUserFullName(user) {
                if (user == null || user.firstName == null) {
                    return '';
                }
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            editDebt() {
                this.editing = true;
            },
            isPayer() {
                return this.user == null ? false : (this.user.email === this.debt.payer.email);
            },
            async saveDebt() {
                if (this.debt.payer === null) {
                    this.debt.payer = {
                        firstName: this.field.value,
                    };
                }
                await this.$http.post('/debts/', this.debt);
                this.editing = false;
            },
            async deleteDebt() {
                if (confirm("Are you sure?")) {
                    await this.$http.delete('/debts/' + this.debtId);
                    router.push('/debts');
                }
            },
            cancel() {
                this.editing = false;
                this.loadDebt();
            },
            payWithLHV() {
                const url = `https://www.lhv.ee/portfolio/payment_out.cfm?
                i_receiver_name=${this.debt.receiver.bankAccount.name}
                &amp;i_receiver_account_no=${this.debt.receiver.bankAccount.number}
                &amp;i_amount=${this.debt.amount}
                &amp;i_payment_desc=${this.debt.title}&amp`;
                window.location.href = encodeURI(url);
            },
            payWithSEB() {
                const url = `https://www.seb.ee/ip/ipank?act=SMARTPAYM&lang=EST
                &field1=benname&value1=${this.debt.receiver.bankAccount.name}
                &field3=benacc&value3=${this.debt.receiver.bankAccount.number}
                &field10=desc&value10=${this.debt.title}
                &value11=&field5=amount&value5=${this.debt.amount}
                &paymtype=REMSEBEE&field6=currency&value6=EUR`;
                window.location.href = encodeURI(url);
            },
            payWithSwed() {
                window.location.href = "https://www.swedbank.ee/private";
            },
        },
    };
</script>
<style scoped>
    img {
        height: 60px;
        margin-right: 15px;
    }

    .lhv {
        padding: 10px 10px 10px 10px;
        background-color: white;
    }

    .swed {
        background-color: white;
        margin-right: 0;
    }

    @media (max-width: 768px) {
        img {
            height: 46px;
            margin-right: 5px;
        }
    }
</style>
