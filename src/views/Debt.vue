<template>
    <div>
        <navbar></navbar>
        <background>
            <b-row>
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
                            <b-button variant="primary" v-on:click="editDebt">Edit</b-button>
                        </b-col>
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
    import BRow from "bootstrap-vue/src/components/layout/row";


    export default {
        name: 'CreateEvent',
        components: {BRow, Background, Navbar, Autocomplete},
        data: () => ({
            debt: {},
        }),
        mounted() {
            const debtId = Number(this.$route.params.id);
            this.$http.get('/debts/' + debtId).then((response) => {
                this.debt = response.data;
            }).catch((error) => {
                alert('You are not logged in!');
                router.push('/');
            });
        },
        methods: {
            getUserFullName(user) {
                return user.lastName === null ? user.firstName : user.firstName + ' ' + user.lastName;
            },
            editDebt() {
                // TODO
            }
        },
    };
</script>

<style scoped>
</style>
