<template>
    <background>
        <b-row class='pt-md-5 flex-md-row-reverse'>
            <b-col sm='12' md='5' offset-md='1'>
                <form @submit.prevent='register()'>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='email' class='form-control' id='email' placeholder='Email*' required
                                       v-model='form.email' minlength="5" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='password' class='form-control' id='password' placeholder='Password*'
                                       required v-model='form.password' minlength="8" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='password' class='form-control' id='passwordConfirm' minlength="8" maxlength="255"
                                       required placeholder='Repeat password*' v-model='form.passwordConfirmation'>
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='firstName' placeholder='First name*'
                                       required v-model='form.firstName' minlength="1" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='lastName' placeholder='Last name*'
                                       required v-model='form.lastName' minlength="1" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <b-row>
                        <b-col sm='12' md='5'>
                            <b-btn variant='primary' type='submit' class='w-100'>Register</b-btn>
                        </b-col>
                        <b-col sm='12' md='7' class='mt-3 text-center text-md-left mob-text-center'>
                            <router-link to='/'>
                                <a>Already a member?</a>
                            </router-link>
                        </b-col>
                    </b-row>
                </form>
            </b-col>
            <b-col sm='12' md='6' class="mt-4 mt-md-0">
                <p>
                    <b>
                        We are debty.
                    </b>
                    <br><br>
                    Debt is when something, usually money, is owed by one party, the borrower or debtor, to a second party, the lender or creditor.
                    Debt is a deferred payment, or series of payments, that is owed in the future, which is what differentiates it from an immediate purchase.
                    Private individuals lend money to other people, mostly relatives or friends. One reason for such informal debts is comfort.
                    Such debts can cause problems when they are not paid back according to expectations of the lending person.
                </p>
            </b-col>
        </b-row>
    </background>
</template>

<script>
    // this should go to validated fields: @input='v.$touch()'
    import router from '../router.ts';
    import Background from '../components/Background';
    import User from '../entities/User';
    import userStore from '../stores/UserStore';

    export default {
        name: 'Register',
        components: {Background},
        data: () => ({
            form: {
                email: '',
                password: '',
                passwordConfirmation: '',
                firstName: '',
                lastName: '',
            },
        }),
        methods: {
            async register() {
                const user = this.form;
                const response = await this.$http.post('/users/register', user);
                if (response.status === 200) {
                    userStore.setUser(User.from(user));
                    router.push('/home');
                }
            },
        },
    };
</script>

<style scoped>
</style>
