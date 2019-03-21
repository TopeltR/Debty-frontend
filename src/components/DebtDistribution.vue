<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            Add bill
        </div>
        <div class="col-10 offset-1">
            <b-row>
                <b-col cols="12" class='TM30px'>
                    <b-row>
                        <h2>Finalized debts after closing event</h2>
                    </b-row>
                    <b-row>
                        <table class='table table-bordered table-striped bill-table'>
                            <thead>
                            <tr class='d-none d-md-table-row'>
                                <th scope='col'>Payer</th>
                                <th scope='col'>Receiver</th>
                                <th scope='col'>Sum (€)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for='debt in debts'>
                                <td>{{ getFullName(debt.payer) }}</td>
                                <td>{{ getFullName(debt.receiver) }}</td>
                                <td>{{ debt.sum }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </b-row>
                </b-col>
            </b-row>
        </div>
        <div class="col-12" slot="modal-footer">
            <b-row>
                <b-col cols="6">
                    <b-button class="wide" variant="secondary" v-on:click="cancel">Cancel</b-button>
                </b-col>
                <b-col cols="6">
                    <b-button class="wide" variant="primary" v-on:click="closeEvent">Close event</b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import router from '../router.ts';
    import BRow from "bootstrap-vue/src/components/layout/row";


    export default {
        name: 'DebtDistribution',
        components: {BRow},
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
            eventId: {
                type: Number,
            },
        },
        watch: {
            state: {
                deep: true,
                handler: function(state) {
                    if (state.showing) {
                        this.$refs.modal.show();
                    } else {
                        this.$refs.modal.hide();
                    }
                },
            },
        },
        mounted() {
            this.$http.get('/events/' + this.eventId + '/debts').then(
                (response) => {
                    this.debts = response.data;
                },
            ).catch((error) => {
                alert('You are not logged in!');
                router.push('/');
            });
        },
        data: () => ({
            debts: [],
        }),
        methods: {
            getFullName(person) {
                return person.firstName + ' ' + person.lastName;
            },
            closeEvent() {
                console.log("Close event"); // TODO What is u doing here?
            },
            cancel() {
                this.state.showing = false;
            },
        },
    };
</script>

<style scoped>
    .wide {
        width: 100%;
    }
</style>
