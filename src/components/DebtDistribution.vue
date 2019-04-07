<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            Optimized debts
            <font-awesome-icon id="debt-dist-info" icon='info-circle' class="info"></font-awesome-icon>
            <b-tooltip target="debt-dist-info"
                       title="When you have decided to close this event, the following debts will be saved."
                       placement="bottom"></b-tooltip>
        </div>
        <div class="col-10 offset-1">
            <b-row>
                <b-col cols="12">
                    <b-row v-for="debt in debts" class="mt-2 mb-2">
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
                    <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel</b-button>
                </b-col>
                <b-col cols="6">
                    <b-button class="w-100" variant="danger" v-on:click="closeEvent">Close event</b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    export default {
        name: 'DebtDistribution',

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
                type: Array,
            },
            eventId: {
                type: Number,
            },
        },
        watch: {
            state: {
                deep: true,
                handler(state) {
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
            async closeEvent() {
                await this.$http.post('/events/' + this.eventId + '/close');
                this.state.showing = false;
                window.location.reload();
            },
            cancel() {
                this.state.showing = false;
            },
        },
    };
</script>

<style scoped>
    .arrow-margin {
        margin: 6px 10px 0 10px;
    }

    .info {
        color: lightgrey;
        margin-left: 10px;
    }
</style>
