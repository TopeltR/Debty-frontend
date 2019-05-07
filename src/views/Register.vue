<template>
    <background>
        <b-row class='pt-md-5 flex-md-row-reverse'>
            <b-col sm='12' md='5' offset-md='1'>
                <form @submit.prevent='register()'>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='email' class='form-control' id='email' placeholder='Email *' required
                                       v-model='form.email' minlength="5" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='password' class='form-control' id='password' placeholder='Password *'
                                       required v-model='form.password' minlength="8" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='password' class='form-control' id='passwordConfirm' minlength="8" maxlength="255"
                                       required placeholder='Repeat password *' v-model='form.passwordConfirmation'>
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='firstName' placeholder='First name *'
                                       required v-model='form.firstName' minlength="1" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='lastName' placeholder='Last name *'
                                       required v-model='form.lastName' minlength="1" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <b-row>
                        <b-col sm='12' md='5'>
                            <b-btn variant='primary' type='submit' class='w-100'>Register</b-btn>
                        </b-col>
                        <b-col sm='12' md='7' class='mt-2 text-center text-md-left mob-text-center'>
                            <router-link to='/'>
                                Already a member?
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
                    Imagine, you are out with your friends having a good time. Everybody is chipping in on the stuff you buy.
                    You buy something for the crew and your friends do the same. By the end of the evening you have bunch of bills and
                    no clue how much to pay and to whom.
                    <br><br>
                    Introducing Debty, a platform for friends to sign up, create an event and add all of their bills along with the people who participated. After the event all you need is one click and you will see exactly how much you have to pay and to whom.
                    <br><br>
                    It's that simple!
                </p>
            </b-col>
        </b-row>
    </background>
</template>

<script>
    import router from '@/router.ts';
    import Background from '@/components/Background.vue';
    import User from '@/entities/User.ts';
    import userStore from '@/stores/UserStore.ts';

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
                    userStore.setUser(User.from(response.data));
                    router.push('/home');
                }
            },
        },
    };
</script>

<style scoped>
</style>
