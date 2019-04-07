<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            Add bank account
        </div>
        <div class="col-10 offset-1">
            <b-row>
                <b-col cols="12" class='TM30px'>
                    <b-row>
                        <form @submit.prevent='' class='wide'>
                            <div class='form-group'>
                                <label for='bankAccountName'>Name connected to bank account:</label>
                                <input type='text' class='form-control' v-model='bankAccount.name' id='bankAccountName'
                                       required placeholder='John Doe' maxlength="255">
                            </div>
                            <div class='form-group'>
                                <label for='bankAccountNumber'>Bank account number:</label>
                                <input type='text' class='form-control' v-model='bankAccount.number' maxlength="255"
                                       id='bankAccountNumber' required placeholder='EE1111111111111111'>
                            </div>
                        </form>
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
                    <b-button class="wide" variant="primary" v-on:click="saveBankAccount">Save</b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import userStore from '@/stores/UserStore';

    export default {
        name: 'AddBankAccount',
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
                handler(state) {
                    if (state.showing) {
                        this.$refs.modal.show();
                    } else {
                        this.$refs.modal.hide();
                    }
                },
            },
        },
        data: () => ({
            bankAccount: {
                name: undefined,
                number: undefined,
            },
        }),
        methods: {
            async saveBankAccount() {
                const user = await userStore.getUser();
                const result = await this.$http.post('/users/bankAccount/' + user.id, this.bankAccount);
                this.cancel();
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
