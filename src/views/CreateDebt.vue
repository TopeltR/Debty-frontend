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
                                <input-label :required="true" for='title'>Title</input-label>
                                <input type='text' class='form-control' v-model='formData.title' id='title'
                                       placeholder='Enter debt title' required minlength="1" maxlength="255">
                            </div>
                            <div class='form-group'>
                                <b-row>
                                    <b-col cols="10" md="11">
                                        <b-row>
                                            <b-col cols="2">
                                                <input-label :required="true">From</input-label>
                                            </b-col>
                                            <b-col cols="10">
                                                <input v-if="!userIsReceiver" type='text' class='form-control'
                                                       v-model='userName' disabled required maxlength="255">
                                                <autocomplete v-else id='payer' v-model='other'
                                                              :placeholder='"Name"'
                                                              :field='field'
                                                              :items='contacts'
                                                              :required='true'
                                                              :key-extractor='getUserFullName'></autocomplete>
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col cols="2" class="mt-3">
                                                <input-label :required="true">To</input-label>
                                            </b-col>
                                            <b-col cols="10" class="mt-3">
                                                <input v-if="userIsReceiver" type='text' class='form-control'
                                                       v-model='userName' disabled required maxlength="255">
                                                <autocomplete v-else id='receiver' v-model='other'
                                                              :placeholder='"Name"'
                                                              :field='field'
                                                              :items='contacts'
                                                              :required='true'
                                                              :key-extractor='getUserFullName'></autocomplete>
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
                                        <input-label :required="true" for='sum' class='mt-2'>Sum</input-label>
                                    </b-col>
                                    <b-col cols='3'>
                                        <input id='sum' type='number' class='form-control pr-0'
                                               v-model='formData.sum'
                                               placeholder='0' required min="0" maxlength="255">
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
    import router from '@/router.ts';
    import Background from '@/components/Background.vue';
    import Navbar from '@/components/Navbar.vue';
    import Autocomplete from '@/components/Autocomplete.vue';
    import Spinner from '@/components/Spinner.vue';
    import userStore from '@/stores/UserStore.ts';
    import InputLabel from "@/components/InputLabel.vue";


    export default {
        name: 'CreateDebt',
        components: {InputLabel, Background, Navbar, Autocomplete, Spinner},
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
            other: null,
            userIsReceiver: true,
            userName: null,
        }),
        async mounted() {
            this.user = await userStore.getUser();
            this.formData.receiver = this.user;
            this.formData.owner = this.user;
            this.userName = this.getUserFullName(this.user);

            const response = await this.$http.get('/contacts/' + this.user.id + '/users');
            this.contacts = response.data.filter((u) => u.email !== this.user.email);
        },
        methods: {
            getUserFullName(user) {
                return user.lastName == null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            async saveDebt() {
                const result = await this.$http.post('/debts', this.formData);
                router.push('/debts/' + result.data.id);
            },
            switchDebtorReceiver() {
                this.userIsReceiver = !this.userIsReceiver;
                if (this.userIsReceiver) {
                    this.formData.receiver = this.user;
                    this.formData.payer = this.other;
                } else {
                    this.formData.receiver = this.other;
                    this.formData.payer = this.user;
                }
            },
        },
    };
</script>

<style scoped>
    .limegreen {
        color: limegreen !important;
    }
</style>
