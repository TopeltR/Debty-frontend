<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            Optimized debts
            <font-awesome-icon id="info" icon='info-circle' class="info"></font-awesome-icon>
            <b-tooltip target="info"
                       title="When you have decided to close this event, the following debts will be saved."
                       placement="bottom"></b-tooltip>
        </div>
        <div class="col-10 offset-1">
            <b-row>
                <b-col cols="12" class='TM30px'>
                    <b-row v-for="debt in debts" class="MV15px">
                        <b-col sm="12" md="3"><b>{{ debt.sum }} €</b></b-col>
                        <b-col sm="12" md="9">
                            {{ getFullName(debt.payer) }}
                            <font-awesome-icon icon='arrow-right' class="arrow-margin"></font-awesome-icon>
                            {{ getFullName(debt.receiver) }}
                        </b-col>
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
    import BCol from "bootstrap-vue/src/components/layout/col";


    export default {
        name: 'DebtDistribution',
        components: {
            BCol,
            BRow
        },
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
            debts: {
                type: Array
            }
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
        methods: {
            getFullName(person) {
                return person.firstName + ' ' + person.lastName;
            },
            closeEvent() {
                this.$http.post('/events/' + this.eventId + '/bills', this.bill)
                    .then((response) => {
                        this.state.showing = false;
                    }); // TODO What is u doing here?
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

    .MV15px {
        margin-top: 15px;
        margin-bottom: 15px;
    }

    .arrow-margin {
        margin: 6px 10px 0 10px;
    }

    .info {
        color: lightgrey;
        margin-left: 10px;
    }
</style>
