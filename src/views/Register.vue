<template>
    <background>
        <b-row class='pt-md-5 flex-md-row-reverse'>
            <b-col sm='12' md='5' offset-md='1'>
                <form @submit.prevent='register()'>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='email' placeholder='Email' required
                                       v-model='form.email' maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='password' class='form-control' id='password' placeholder='Password'
                                       required v-model='form.password' maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='password' class='form-control' id='passwordConfirm' maxlength="255"
                                       required placeholder='Repeat password' v-model='form.passwordConfirmation'>
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='firstName' placeholder='First name'
                                       required v-model='form.firstName' maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group text-right'>
                        <b-row>
                            <b-col>
                                <input type='text' class='form-control' id='lastName' placeholder='Last name'
                                       required v-model='form.lastName' maxlength="255">
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
            <b-col sm='12' md='6'>
                <p>
                    <b>
                        Doggo ipsum bork heckin angery woofer borking doggo wrinkler vvv shooberino pupper, ur givin me
                        a spook smol pupperino long water shoob.
                    </b>
                    <br><br>
                    Sub woofer big ol pupper such treat heckin good boys he made many woofs much ruin diet very good
                    spot, puggorino super chub doggorino such treat. Doge you are doing me the shock wrinkler,
                    borkdrive. Many pats boof heckin good boys and girls heckin the neighborhood pupper waggy wags
                    shibe, noodle horse aqua doggo you are doing me a frighten shibe fluffer. Shoober sub woofer much
                    ruin diet noodle horse pupper, stop it fren dat tungg tho.
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
                const response = await this.$http.post('/register', user);
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
