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
                        </b-col>
                    </b-row>
                    <b-row class="mt-4">
                        <b-col cols="3">
                            <b>Receiver:</b>
                        </b-col>
                        <b-col cols="9">
                            {{ getUserFullName(debt.receiver) }}
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
                    <b-row class="mt-3">
                        <b-col>
                            <b-button variant="primary" class="w-25 mt-3" v-on:click="edit">Edit</b-button>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col sm="12" md="6" offset-md="3">
                    <b-row class="mt-5">
                        <form @submit.prevent='createDebt' class='wide'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='debt.title' id='title'
                                       placeholder='Enter debt title'>
                            </div>
                            <div class='form-group'>
                                <label>Add debtor:</label>

                                <autocomplete id='payer' v-model='debt.payer' :placeholder='"Name"' :field='field'
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
                                    <b-button class="w-100" variant="primary" v-on:click="save">Save</b-button>
                                </b-col>
                            </b-row>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
            <b-row>
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
    import Background from '@/components/Background';
    import Navbar from '@/components/Navbar';
    import BRow from "bootstrap-vue/src/components/layout/row";
    import Autocomplete from '@/components/Autocomplete';
    import userStore from '@/stores/UserStore';

    export default {
        name: 'CreateEvent',
        components: {BRow, Background, Navbar, Autocomplete},
        data: () => ({
            debtId: null,
            debt: {},
            editing: false,
            contacts: [],
            field: {value: ''},
        }),
        async mounted() {
            this.debtId = Number(this.$route.params.id);
            this.loadDebt();

            const usersResponse = await this.$http.get('/users/all');
            const user = await userStore.getUser();
            this.contacts = usersResponse.data.filter((u) => u.email !== user.email);
        },
        methods: {
            async loadDebt() {
                const debtResponse = await this.$http.get('/debts/' + this.debtId);
                this.debt = debtResponse.data;
                this.field.value = this.getUserFullName(this.debt.payer);
            },
            getUserFullName(user) {
                if (user === undefined || user.firstName === undefined) {
                    return '';
                }
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            edit() {
                this.editing = true;
            },
            save() {
                this.editing = false;
                if (this.debt.payer === null) {
                    this.debt.payer = {
                        firstName: this.field.value,
                    };
                }
                // TODO: actually save this too
            },
            cancel() {
                this.editing = false;
                this.loadDebt();
            },
            payWithLHV() {
                const url = `https://www.lhv.ee/portfolio/payment_out.cfm?i_receiver_name=${this.debt.receiver.bankAccount.name}&amp;i_receiver_account_no=${this.debt.receiver.bankAccount.number}&amp;i_amount=${this.debt.amount}&amp;i_payment_desc=${this.debt.title}&amp`;
                window.location.href = encodeURI(url);
            },
            payWithSEB() {
                const url = `https://www.seb.ee/ip/ipank?act=SMARTPAYM&lang=EST&field1=benname&value1=${this.debt.receiver.bankAccount.name}&field3=benacc&value3=${this.debt.receiver.bankAccount.number}&field10=desc&value10=${this.debt.title}&value11=&field5=amount&value5=${this.debt.amount}&paymtype=REMSEBEE&field6=currency&value6=EUR`;
                window.location.href = encodeURI(url);
            },
            payWithSwed() {
                window.location.href = "https://www.swedbank.ee/private";
            }
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

    @media(max-width: 768px) {
        img {
            height: 46px;
            margin-right: 5px;
        }
    }
</style>
