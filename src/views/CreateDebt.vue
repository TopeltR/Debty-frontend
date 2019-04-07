<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col cols="10" offset="1" md="6" offset-md="3" class="w-100">
                    <b-row class="mt-5">
                        <h1 class="w-auto">Create debt</h1>
                        <font-awesome-icon icon="info-circle" class="ml-1"></font-awesome-icon>
                        <b-tooltip target="info"
                                   title="Give your debt an informative title, so that your contact can understand it."
                                   placement="bottom"></b-tooltip>
                    </b-row>
                    <b-row>
                        <form @submit.prevent="saveDebt()" class='w-100'>
                            <div class='form-group pt-3'>
                                <label for='title'>Title:</label>
                                <input type='text' class='form-control' v-model='formData.title' id='title'
                                       placeholder='Enter debt title' required maxlength="255">
                            </div>
                            <div class='form-group'>
                                <b-row>
                                    <b-col cols="10" md="11">
                                        <b-row>
                                            <b-col cols="2">
                                                <label>From:</label>
                                            </b-col>
                                            <b-col cols="10">
                                                <input v-if="!userIsReceiver" type='text' class='form-control'
                                                       v-model='userName' disabled required maxlength="255">
                                                <autocomplete v-else id='payer' v-model='formData.payer'
                                                              :placeholder='"Name"'
                                                              :field='field'
                                                              :items='contacts'
                                                              :required='true'
                                                              :key-extractor='getUserFullName'></autocomplete>
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col cols="2" class="mt-3">
                                                <label>To:</label>
                                            </b-col>
                                            <b-col cols="10" class="mt-3">
                                                <input v-if="userIsReceiver" type='text' class='form-control'
                                                       v-model='userName' disabled required maxlength="255">
                                                <autocomplete v-else id='receiver' v-model='formData.receiver'
                                                              :placeholder='"Name"'
                                                              :field='field'
                                                              :items='contacts'
                                                              :required='true'
                                                              :key-extractor='getUserFullName'
                                                ></autocomplete>
                                            </b-col>
                                        </b-row>
                                    </b-col>
                                    <b-col cols="2" md="1" v-on:click="switchDebtorReceiver">
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
                                        <label for='sum' class='mt-2'>Sum:</label>
                                    </b-col>
                                    <b-col cols='3'>
                                        <input id='sum' type='text' class='form-control pr-0' v-model='formData.sum'
                                               placeholder='0' required maxlength="255">
                                    </b-col>
                                    <b-col cols='1' class='mt-2 pl-0'>€</b-col>
                                </b-row>
                            </div>
                            <b-row class='mt-4 text-center'>
                                <b-col>
                                    <b-btn type="submit" class="w-100" variant="primary">Save</b-btn>
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


    export default {
        name: 'CreateEvent',
        components: {Background, Navbar, Autocomplete},
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

            const response = await this.$http.get('/contacts/id/' + this.user.id);
            this.contacts = response.data.filter((u) => u.email !== this.user.email);
        },
        methods: {
            getUserFullName(user) {
                return user.lastName == null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            async saveDebt() {
                if (this.formData.payer === null) {
                    this.formData.payer = {
                        firstName: this.field.value,
                    };
                } else {
                    this.formData.receiver = {
                        firstName: this.field.value,
                    };
                }
                const result = await this.$http.post('/debts', this.formData);
                router.push('/debts/' + result.data.id);
            },
            switchDebtorReceiver() {
                this.userIsReceiver = !this.userIsReceiver;
            },
        },
    };
</script>

<style scoped>
    .limegreen {
        color: limegreen !important;
    }
</style>
