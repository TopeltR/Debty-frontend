<template>
    <background>
        <b-row class="PT15vh">
            <b-col sm="12" md="6">
                <p class="logo">debty</p>
            </b-col>
            <b-col sm="12" md="5" offset-md="1">
                <form @submit.prevent="login">
                    <b-row v-bind:style="{display: displayProperty}">
                        <b-col sm="12">
                            <div class="notification">
                                <b-row>
                                    <b-col sm="10">
                                        <h6>Login failed! Wrong email or password</h6>
                                    </b-col>
                                </b-row>
                            </div>
                        </b-col>
                    </b-row>
                    <div class="form-group">
                        <b-row>
                            <b-col>
                                <label class="label" for="email">Email:</label>
                                <input type="text" class="form-control" id="email" placeholder="Email"
                                       v-model="email">
                            </b-col>
                        </b-row>
                    </div>
                    <div class="form-group">
                        <b-row>
                            <b-col>
                                <label class="label" for="password">Password:</label>
                                <input type="password" class="form-control" id="password" placeholder="Password"
                                       v-model="password">
                            </b-col>
                        </b-row>
                    </div>
                    <b-row>
                        <b-col sm="12" md="12">
                            <b-btn variant="primary" type="submit" class="button-wide">Login</b-btn>
                        </b-col>
                    </b-row>
                    <a href="/#/register">Register</a>
                </form>
            </b-col>
        </b-row>
    </background>
</template>

<script>
    import router from '../router.ts';
    import Background from "../components/Background";

    export default {
        name: 'LandingPage',
        components: {Background},
        data: () => ({
            email: '',
            password: '',
            displayProperty: 'none'
        }),

        methods: {
            login() {
                let bodyFormData = new FormData();
                bodyFormData.set('username', this.email);
                bodyFormData.set('password', this.password);

                this.$http.post('/login', bodyFormData, {headers: {'Content-Type': 'multipart/form-data'}})
                    .then(response => {
                        if (response.status === 200) {
                            router.push('/home')
                        }
                    }).catch(error => {
                        this.displayProperty = 'block'
                    });
            },
        },
    };
</script>

<style scoped>
    .PT15vh {
        padding-top: 15vh;
    }
    @media (max-width: 767px) {
        .PT15vh {
            padding-top: 0;
        }
    }

    .logo {
        color: limegreen;
        font-size: 100px;
        font-weight: bolder;
    }

    .button-wide {
        width: 100%;
        background-color: darkgreen;
        font-weight: 500;
        border-color: darkgreen
    }
    .notification {
        height: 45px;
        color: red;
    }
</style>