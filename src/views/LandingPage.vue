<template>
    <background>
        <b-row class='PT15vh'>
            <b-col sm='12' md='6'>
                <p class='logo'>debty</p>
            </b-col>
            <b-col sm='12' md='5' offset-md='1'>
                <form @submit.prevent='login'>
                    <b-row v-bind:style='{display: displayProperty}'>
                        <b-col sm='12'>
                            <div class='notification'>
                                <b-row>
                                    <b-col sm='10'>
                                        <h6>Login failed! Wrong email or password</h6>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-col>
                    </b-row>
                    <div class='form-group'>
                        <b-row>
                            <b-col>
                                <label class='label' for='email'>Email:</label>
                                <input type='email' class='form-control' id='email' placeholder='Email' required
                                       v-model='email' minlength="5" maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <div class='form-group'>
                        <b-row>
                            <b-col>
                                <label class='label' for='password'>Password:</label>
                                <input type='password' class='form-control' id='password' placeholder='Password'
                                       required v-model='password' maxlength="255">
                            </b-col>
                        </b-row>
                    </div>
                    <b-row>
                        <b-col sm='12' md='5'>
                            <b-btn variant='primary' type='submit' class='wide'>Login</b-btn>
                        </b-col>
                        <b-col sm='12' md='7' class='MT7 mob-text-center'>
                            <router-link to='/register'>
                                <a>Register?</a>
                            </router-link>
                        </b-col>
                    </b-row>
                </form>
            </b-col>
        </b-row>
    </background>
</template>

<script>
    import Background from '../components/Background';
    import userStore from '../stores/UserStore';

    export default {
        name: 'LandingPage',
        components: {Background},
        data: () => ({
            email: '',
            password: '',
            displayProperty: 'none',
        }),
        methods: {
            async login() {
                try {
                    await userStore.logIn(this.email, this.password);
                } catch (e) {
                    this.displayProperty = 'block';
                }
            },
        },
    };
</script>

<style scoped>
    .PT15vh {
        padding-top: 15vh;
    }

    .logo {
        color: limegreen;
        font-size: 100px;
        font-weight: bolder;
    }

    .wide {
        width: 100%;
    }

    .notification {
        height: 45px;
        color: red;
    }

    .MT7 {
        margin-top: 7px;
    }

    @media (max-width: 767px) {
        .PT15vh {
            padding-top: 0;
        }

        .mob-text-center {
            text-align: center;
        }
    }
</style>
