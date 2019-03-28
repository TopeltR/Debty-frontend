<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col sm='12' md='6' offset-md='3' class='mt-5 pt-3'>
                    <b-row>
                        <h2>Create debt</h2>
                        <font-awesome-icon id="info" icon='info-circle' class="ml-1"></font-awesome-icon>
                        <b-tooltip target="info"
                                   title="Give your debt an informative title, so that your contact can understand it."
                                   placement="bottom"></b-tooltip>
                        <form @submit.prevent='createDebt' class='wide'>
                            <div class='form-group'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='formData.title' id='title'
                                       placeholder='Enter debt title'>
                            </div>
                            <div class='form-group'>
                                <b-row>
                                    <b-col cols="11">
                                        <b-row>
                                            <b-col cols="2">
                                                <label>From:</label>
                                            </b-col>
                                            <b-col cols="10">
                                                <input v-if="!userIsReceiver" type='text' class='form-control'
                                                       v-model='userName'
                                                       disabled>
                                                <autocomplete v-else id='payer' v-model='formData.payer'
                                                              :placeholder='"Name"'
                                                              :field='field'
                                                              :items='contacts'
                                                              :key-extractor='getUserFullName'></autocomplete>
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col cols="2" class="mt-3">
                                                <label>To:</label>
                                            </b-col>
                                            <b-col cols="10" class="mt-3">
                                                <input v-if="userIsReceiver" type='text' class='form-control'
                                                       v-model='userName'
                                                       disabled>
                                                <autocomplete v-else id='receiver' v-model='formData.receiver'
                                                              :placeholder='"Name"'
                                                              :field='field'
                                                              :items='contacts'
                                                              :key-extractor='getUserFullName'></autocomplete>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col cols="1" v-on:click="switchDebtorReceiver">
                                        <font-awesome-icon icon='arrow-up'
                                                           class="mt-4 p-0 limegreen"></font-awesome-icon>
                                        <font-awesome-icon icon='arrow-down'
                                                           class="mb-2 ml-2 limegreen"></font-awesome-icon>
                                    </b-col>
                                </b-row>
                            </div>
                            <div class='form-group'>
                                <b-row>
                                    <b-col cols='2'>
                                        <label for='sum' class='mt-1'>Sum:</label>
                                    </b-col>
                                    <b-col cols='3' md='2'>
                                        <input id='sum' type='text' class='form-control pr-0' v-model='formData.sum'
                                               placeholder='0'>
                                    </b-col>
                                    <b-col cols='1' class='pl-0 mt-1'>€</b-col>
                                </b-row>
                            </div>
                            <b-row class='mt-4'>
                                <b-col sm='12'>
                                    <button type='button' v-on:click='createDebt'
                                            class='btn btn-primary wide'>
                                        Create debt
                                    </button>
                                </b-col>
                            </b-row>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
        </background>
    </div>
</template>

<script>
    import router from '../router.ts';
    import Background from '@/components/Background';
    import Navbar from '@/components/Navbar';
    import Autocomplete from '@/components/Autocomplete';
    import userStore from '@/stores/UserStore';
    import BCol from "bootstrap-vue/src/components/layout/col";
    import BRow from "bootstrap-vue/src/components/layout/row";


    export default {
        name: 'CreateEvent',
        components: {BRow, BCol, Background, Navbar, Autocomplete},
        data: () => ({
            formData: {
                title: '',
                payer: null,
                receiver: null,
                owner: null,
                sum: null,
            },
            field: {value: ''},
            contacts: [],
            user: null,
            userIsReceiver: true,
            userName: null,
        }),
        async mounted() {
            this.user = await userStore.getUser();
            this.formData.receiver = this.user;
            this.formData.owner = this.user;
            this.userName = this.getUserFullName(this.user);

            const response = await this.$http.get('/contact/id/' + user.id);
            this.contacts = response.data.filter((u) => u.email !== user.email);
        },
        methods: {
            getUserFullName(user) {
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            async createDebt() {
                if (this.formData.payer === null) {
                    this.formData.payer = {
                        firstName: this.field.value,
                    };
                }
                const result = await this.$http.post('/debts', this.formData);
                router.push('/debts/' + result.data.id);
            },
            switchDebtorReceiver() {
                this.userIsReceiver = !this.userIsReceiver;
            }
        },
    };
</script>

<style scoped>
    .limegreen {
        color: limegreen !important;
    }
</style>
