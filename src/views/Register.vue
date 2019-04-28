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
                    Let's imagine. You are out with your friends having a nice evening. Everybody is chipping in on the stuff you buy.
                    You buy one thing for the crew and other friends do the same. By the end of the evening you have bunch of bills and
                    no clue who you should pay and how much.
                    <br><br>
                    Introducing Debty, a platform for friends to sign up, create an event and then insert these bills including the people,
                    who you bought the items. After the event all you need is one click and you will see exactly how much you have to pay and to who.
                    <br><br>
                    It's that simple!
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
