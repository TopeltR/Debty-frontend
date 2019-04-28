<template>
    <b-modal ref="modal" class="col-12">
        <div class="col-12" slot="modal-title">
            Add bank account
        </div>
        <div class="col-10 offset-1">
            <b-row>
                <b-col cols="12" class='mt-4'>
                    <b-row>
                        <form @submit.prevent='saveBankAccount' ref="form" class='w-100'>
                            <div class='form-group'>
                                <input-label for='bankAccountName'>Name connected to bank account</input-label>
                                <input type='text' class='form-control' v-model='bankAccount.name' id='bankAccountName'
                                       required placeholder='John Doe' maxlength="255">
                            </div>
                            <div class='form-group'>
                                <input-label for='bankAccountNumber'>Bank account number</input-label>
                                <input type='text' class='form-control' v-model='bankAccount.number' maxlength="255"
                                       id='bankAccountNumber' required placeholder='EE1111111111111111'>
                            </div>
                        </form>
                    </b-row>
                </b-col>
            </b-row>
        </div>
        <div class="col-12" slot="modal-footer">
            <b-row class="mx-2">
                <b-col cols="6">
                    <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel</b-button>
                </b-col>
                <b-col cols="6">
                    <b-button class="w-100" variant="primary" v-on:click="submit">Save</b-button>
                </b-col>
            </b-row>
        </div>
    </b-modal>
</template>

<script>
    import User from '../entities/User';
    import userStore from '@/stores/UserStore';
    import InputLabel from "./InputLabel";

    export default {
        name: 'AddBankAccount',
        components: {InputLabel},
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
                const response = await this.$http.post('/users/' + user.id + '/bankAccount', this.bankAccount);
                userStore.setUser(User.from(response.data));
                this.cancel();
            },
            submit() {
                const form = this.$refs.form;
                if (!form.checkValidity()) {
                    form.reportValidity();
                } else {
                    this.saveBankAccount();
                }
            },
            cancel() {
                this.state.showing = false;
            },
        },
    };
</script>

<style scoped>
</style>
