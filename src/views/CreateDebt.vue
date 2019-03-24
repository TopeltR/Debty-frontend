<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
                <b-col sm='12' md='6' offset-md='3' class='MT30px'>
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
                                <label>Add debtor:</label>

                                <autocomplete id='payer' v-model='formData.payer' :placeholder='"Name"' :field='field'
                                              :items='contacts'
                                              :key-extractor='getUserFullName'></autocomplete>
                            </div>
                            <div class='form-group'>
                                <b-row>
                                    <b-col cols='2'>
                                        <label for='sum' class='MT5px'>Sum:</label>
                                    </b-col>
                                    <b-col cols='3' md='2'>
                                        <input id='sum' type='text' class='form-control PR0' v-model='formData.sum'
                                               placeholder='0'>
                                    </b-col>
                                    <b-col cols='1' class='MT5px PL0'>€</b-col>
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


    export default {
        name: 'CreateEvent',
        components: {Background, Navbar, Autocomplete},
        data: () => ({
            formData: {
                title: '',
                payer: null,
                receiver: null,
                sum: null,
            },
            field: {value: ''},
            contacts: [],
        }),
        async mounted() {
            const user = await userStore.getUser();
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
                this.formData.receiver = await userStore.getUser();
                const result = await this.$http.post('/debts', this.formData);
                router.push('/debts/' + result.data.id);
            },
        },
    };
</script>

<style scoped>
    .wide {
        width: 100%;
    }

    .PR0 {
        padding-right: 0;
    }

    .PL0 {
        padding-left: 0;
    }

    .MT30px {
        margin-top: 30px;
    }

    .MT5px {
        margin-top: 5px;
    }
</style>
