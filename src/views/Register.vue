<template>
    <background>
        <b-row class="PT15vh">
            <b-col sm="12" md="6">
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
            <b-col sm="12" md="5" offset-md="1">
                <form @submit.prevent="register">
                    <div class="form-group text-right">
                        <b-row>
                            <b-col :class="{ 'hasError': $v.form.email.$error }">
                                <input type="text" class="form-control" id="email" placeholder="Email"
                                       v-model="form.email">
                            </b-col>
                        </b-row>
                    </div>
                    <div class="form-group text-right">
                        <b-row>
                            <b-col>
                                <input type="password" class="form-control" id="password" placeholder="Password"
                                       v-model="form.password">
                            </b-col>
                        </b-row>
                    </div>
                    <div class="form-group text-right">
                        <b-row>
                            <b-col>
                                <input type="password" class="form-control" id="passwordConfirm"
                                       placeholder="Repeat password"
                                       v-model="form.passwordConfirm">
                            </b-col>
                        </b-row>
                    </div>
                    <div class="form-group text-right">
                        <b-row>
                            <b-col>
                                <input type="text" class="form-control" id="firstName" placeholder="First name"
                                       v-model="form.firstName">
                            </b-col>
                        </b-row>
                    </div>
                    <div class="form-group text-right">
                        <b-row>
                            <b-col>
                                <input type="text" class="form-control" id="lastName" placeholder="Last name"
                                       v-model="form.lastName">
                            </b-col>
                        </b-row>
                    </div>
                    <b-row>
                        <b-col sm="12" md="5">
                            <b-btn variant="primary" type="submit" class="button-wide">Register</b-btn>
                        </b-col>
                        <b-col sm="12" md="7" class="MT7">
                            <router-link to="/">
                                <a>Already a member?</a>
                            </router-link>
                        </b-col>
                    </b-row>
                </form>
            </b-col>
        </b-row>
    </background>
</template>

<script>
    // this should go to validated fields: @input="v.$touch()"
    import router from '../router.ts';
    import Background from "../components/Background";
    import {required, email, minLength} from "vuelidate/lib/validators";

    export default {
        name: "Register",
        components: {Background},
        validations: {
            form: {
                email: {required, email},
                password: {required, min: minLength(8)},
            }
        },
        data: () => ({
            form: {
                email: '',
                password: '',
                passwordConfirm: '',
                firstName: '',
                lastName: ''
            }
        }),
        methods: {
            register() {
                this.$v.form.$touch();
                if (this.$v.form.$error) {
                    console.log("not ok");
                    return
                }
                /*this.$http.post('/login',
                    {},
                    {
                        headers: {'Content-Type': 'multipart/form-data'}
                    })
                    .then(response => {
                        if (response.status === 200) {
                            router.push('/home')
                        }
                    }).catch(error => {
                    this.displayProperty = 'block'
                });*/
            },
        },
    }
</script>

<style scoped>
    .PT15vh {
        padding-top: 15vh;
    }

    .MT7 {
        margin-top: 7px;
    }

    @media (max-width: 767px) {
        .PT15vh {
            padding-top: 0;
        }
    }

    .button-wide {
        width: 100%;
    }
</style>