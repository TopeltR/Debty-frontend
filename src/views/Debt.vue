<template>
    <b-col>
        <navbar></navbar>
        <background>
            <spinner :loaded="loaded">
                <b-row v-if="!editing">
                    <b-col sm="12" md="8" offset-md="2" lg="6" offset-lg="3" class="mt-5">
                        <b-col class="card shadow mb-5">
                            <b-col class="card-body col-md-8 offset-md-2">
                                <div class="text-center">
                                    <h1 class="mt-3 mb-5"> {{ debt.title }} </h1>
                                </div>
                                <b-row class="mt-5 pb-3 border-bottom-1">
                                    <b-col md="6">
                                        <b>Debtor:</b>
                                    </b-col>
                                    <b-col md="6">
                                        {{ getUserFullName(debt.payer) }}
                                        <small v-if="isOwner(debt.payer)">(owner)</small>
                                    </b-col>
                                </b-row>
                                <b-row class="mt-3 pb-3 border-bottom-1">
                                    <b-col md="6">
                                        <b>Receiver:</b>
                                    </b-col>
                                    <b-col md="6">
                                        {{ getUserFullName(debt.receiver) }}
                                        <small v-if="isOwner(debt.receiver)">(owner)</small>
                                    </b-col>
                                </b-row>
                                <b-row class="mt-3 pb-3 border-bottom-1">
                                    <b-col cols="6">
                                        <b>Sum:</b>
                                    </b-col>
                                    <b-col cols="6">
                                        {{ debt.sum }}€
                                    </b-col>
                                </b-row>
                                <b-row class="mt-3 pb-3 border-bottom-1">
                                    <b-col cols="6">
                                        <b>Status:</b>
                                    </b-col>
                                    <b-col cols="6">
                                        <debt-status :status="debt.status"></debt-status>
                                    </b-col>
                                </b-row>
                                <b-row class="mt-3 pb-3 border-bottom-1">
                                    <b-col md="6">
                                        <b>Created:</b>
                                    </b-col>
                                    <b-col md="6">
                                        {{ new Date(debt.createdAt).toLocaleString() }}
                                    </b-col>
                                </b-row>
                                <b-row v-if="debt.modifiedAt !== debt.createdAt" class="mt-3 mb-4">
                                    <b-col md="6">
                                        <b>Modified:</b>
                                    </b-col>
                                    <b-col md="6">
                                        {{ new Date(debt.modifiedAt).toLocaleString() }}
                                    </b-col>
                                </b-row>
                                <b-row class="mt-5" v-if="isOwner(user) && isEditable()">
                                    <b-col cols="6">
                                        <b-button variant="danger" class="w-100" v-on:click="deleteDebt">Delete
                                        </b-button>
                                    </b-col>
                                    <b-col cols="6">
                                        <b-button variant="secondary" class="w-100" v-on:click="editDebt">Edit
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <b-row class="mt-5" v-if="canAcceptDecline()">
                                    <b-col cols="6">
                                        <b-button variant="secondary" class="w-100"
                                                  v-on:click="acceptDeclineDebt(false)">
                                            Decline
                                        </b-button>
                                    </b-col>
                                    <b-col cols="6">
                                        <b-button variant="primary" class="w-100" v-on:click="acceptDeclineDebt(true)">
                                            Accept
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <b-row class="mt-3" v-if="canConfirm()">
                                    <b-col>
                                        <b-button variant="primary" class="w-100" v-on:click="confirmPayment">
                                            Confirm payment
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <b-row v-if="canPay()" class="mt-5 p-3">
                                    <h2>Pay</h2>
                                    <b-row class="mt-2 pl-3">
                                        <b-col cols="4" class="p-0 pr-2">
                                            <img v-on:click="payWithSEB" src="../assets/seb-logo.png"
                                                 class="w-100 bank-link"/>
                                        </b-col>
                                        <b-col cols="4" class="p-0 pr-1">
                                            <img v-on:click="payWithLHV" class="p-2 w-100 bank-link"
                                                 src="../assets/lhv-logo.jpg"/>
                                        </b-col>
                                        <b-col cols="4" class="p-0">
                                            <img v-on:click="payWithSwed" class="swed w-100 bank-link mr-0"
                                                 src="../assets/swedbank-logo.png"/>
                                        </b-col>
                                    </b-row>
                                </b-row>
                                <b-row class="mt-4" v-if="canPay()">
                                    <b-col>
                                        <b-button variant="primary" class="w-100" v-on:click="payDebt">
                                            I have paid
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-col>
                    </b-col>
                </b-row>
                <b-row v-else>
                    <b-col cols="10" offset="1" md="6" offset-md="3" class="w-100">
                        <b-row class="mt-5">
                            <form @submit.prevent='saveDebt' class='w-100'>
                                <h1>Edit debt</h1>
                                <div class='form-group pt-3'>
                                    <input-label :required="true" for='title'>Title</input-label>
                                    <input type='text' class='form-control' v-model='debt.title' id='title'
                                           placeholder='Enter debt title' required minlength="1" maxlength="255">
                                </div>
                                <div class='form-group'
                                     v-if="isOwner(debt.receiver)">
                                    <input-label :required="true">From</input-label>

                                    <autocomplete id='payer' v-model='debt.payer' :placeholder='"Name"' :field='field'
                                                  :items='contacts' :required="true"
                                                  :key-extractor='getUserFullName'></autocomplete>
                                </div>
                                <div class='form-group'
                                     v-if="isOwner(debt.payer)">
                                    <input-label :required="true">To</input-label>

                                    <autocomplete id='receiver'
                                                  v-model='debt.receiver'
                                                  :placeholder='"Name"'
                                                  :field='field'
                                                  :items='contacts'
                                                  :required='true'
                                                  :key-extractor='getUserFullName'></autocomplete>
                                </div>
                                <div class='form-group'>
                                    <b-row>
                                        <b-col cols='2'>
                                            <input-label :required="true" for='sum' class='mt-2'>Sum</input-label>
                                        </b-col>
                                        <b-col cols='3'>
                                            <input id='sum' type='number' class='form-control pr-0' v-model='debt.sum'
                                                   placeholder='0' required min="0" maxlength="255">
                                        </b-col>
                                        <b-col cols='1' class='mt-2 pl-0'>€</b-col>
                                    </b-row>
                                </div>
                                <b-row class='mt-4'
                                       v-if="isOwner(user)">
                                    <b-col cols="6">
                                        <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel
                                        </b-button>
                                    </b-col>
                                    <b-col cols="6">
                                        <b-button class="w-100" variant="primary" v-on:click="saveDebt">Save</b-button>
                                    </b-col>
                                </b-row>
                            </form>
                        </b-row>
                    </b-col>
                </b-row>
            </spinner>
        </background>
    </b-col>
</template>

<script>
    import router from '@/router.ts';
    import Background from '@/components/Background.vue';
    import Navbar from '@/components/Navbar.vue';
    import Autocomplete from '@/components/Autocomplete.vue';
    import userStore from '@/stores/UserStore.ts';
    import DebtStatus from "@/components/DebtStatus.vue";
    import Spinner from "@/components/Spinner.vue";
    import InputLabel from "@/components/InputLabel.vue";

    export default {
        name: 'Debt',
        components: {InputLabel, DebtStatus, Background, Navbar, Autocomplete, Spinner},
        data: () => ({
            debtId: null,
            debt: {},
            editing: false,
            contacts: [],
            field: {value: ''},
            user: null,
            debtStatus: {
                NEW: 'NEW',
                ACCEPTED: 'ACCEPTED',
                DECLINED: 'DECLINED',
                PAID: 'PAID',
                CONFIRMED: 'CONFIRMED',
            },
            loaded: false,
        }),
        async mounted() {
            this.debtId = Number(this.$route.params.id);
            this.loadDebt();

            this.user = await userStore.getUser();
            const usersResponse = await this.$http.get('/contacts/' + this.user.id + '/users');
            this.contacts = usersResponse.data.filter((user) => user.email !== this.user.email);

            this.loaded = true;
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
            isOwner(user) {
                return user != null && this.debt.owner != null && user.id === this.debt.owner.id;
            },
            canAcceptDecline() {
                return this.debt.owner != null && this.user != null
                    && this.debt.owner.id !== this.user.id
                    && this.debt.status === this.debtStatus.NEW;
            },
            canPay() {
                return this.user != null && this.debt.payer != null
                    && this.user.id === this.debt.payer.id
                    && this.debt.status === this.debtStatus.ACCEPTED;
            },
            canConfirm() {
                return this.user != null && this.debt.receiver != null
                    && this.user.id === this.debt.receiver.id
                    && this.debt.status === this.debtStatus.PAID;
            },
            isEditable() {
                return this.debt.status !== this.debtStatus.PAID && this.debt.status !== this.debtStatus.CONFIRMED;
            },
            saveDebt() {
                if (this.debt.payer === null) {
                    this.debt.payer = {
                        firstName: this.field.value,
                    };
                }
                this.debt.status = this.debtStatus.NEW;
                this.editing = false;
                this.save();
            },
            async save() {
                await this.$http.post('/debts/', this.debt);
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
            async acceptDeclineDebt(isAccept) {
                const response = await this.$http.put('/debts/' + this.debt.id + '/accept/' + isAccept);
                this.debt = response.data;
            },
            async payDebt() {
                const response = await this.$http.put('/debts/' + this.debt.id + '/pay');
                this.debt = response.data;
            },
            async confirmPayment() {
                const response = await this.$http.put('/debts/' + this.debt.id + '/confirm');
                this.debt = response.data;
            },
            payWithLHV() {
                let url = '';
                if (this.debt.receiver.bankAccount != null) {
                    url = `https://www.lhv.ee/portfolio/payment_out.cfm?` +
                        `i_receiver_account_no=${this.debt.receiver.bankAccount.number}` +
                        `&i_receiver_name=${this.debt.receiver.bankAccount.name}` +
                        `&i_payment_desc=${this.debt.title}` +
                        `&i_amount=${this.debt.sum}`;
                } else {
                    url = `https://www.lhv.ee/portfolio/payment_out.cfm?` +
                        `i_payment_desc=${this.debt.title}` +
                        `&i_amount=${this.debt.sum}`;
                }
                window.open(encodeURI(url));
            },
            payWithSEB() {
                let url = '';
                if (this.debt.receiver.bankAccount != null) {
                    url = `https://www.seb.ee/ip/ipank?act=SMARTPAYM&lang=EST` +
                        `&field3=benacc&value3=${this.debt.receiver.bankAccount.number}` +
                        `&field1=benname&value1=${this.debt.receiver.bankAccount.name}` +
                        `&value11=&field5=amount&value5=${this.debt.sum}` +
                        `&field10=desc&value10=${this.debt.title}` +
                        `&paymtype=REMSEBEE&field6=currency&value6=EUR`;
                } else {
                    url = `https://www.seb.ee/ip/ipank?act=SMARTPAYM&lang=EST` +
                        `&value11=&field5=amount&value5=${this.debt.sum}` +
                        `&field10=desc&value10=${this.debt.title}` +
                        `&paymtype=REMSEBEE&field6=currency&value6=EUR`;
                }
                window.open(encodeURI(url));
            },
            payWithSwed() {
                window.open("https://www.swedbank.ee/private");
            },
        },
    };
</script>
<style scoped>
    img {
        height: 50px;
        margin-right: 15px;
    }

    @media (max-width: 768px) {
        img {
            height: 46px;
            margin-right: 5px;
        }
    }

    .bank-link:hover {
        box-shadow: 0 0 2px rgba(33, 33, 33, .2);
    }

    .border-bottom-1 {
        border-bottom: lightgray solid 1px;
    }
</style>
