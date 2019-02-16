<template>
    <b-row>
        <b-col sm="12" md="6" offset-md="3">
            <h1>
                Login
            </h1>
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
                        <b-col class="labelContainer" sm="12" md="2">
                            <label for="email">Email</label>
                        </b-col>
                        <b-col sm="12" md="10">
                            <input type="text" class="form-control" id="email" placeholder="Email" v-model="email">
                        </b-col>
                    </b-row>
                </div>
                <div class="form-group">
                    <b-row>
                        <b-col class="labelContainer" sm="12" md="2">
                            <label for="password">Password</label>
                        </b-col>
                        <b-col sm="12" md="10">
                            <input type="password" class="form-control" id="password" placeholder="Password"
                                   v-model="password">
                        </b-col>
                    </b-row>
                </div>
                <b-row>
                    <b-col sm="12">
                        <b-btn variant="primary" type="submit" class="buttonWide">Login</b-btn>
                    </b-col>
                </b-row>
            </form>
        </b-col>
    </b-row>
</template>

<script>
    import router from '../router.ts';

    export default {
        name: 'Login',
        data: () => ({
            email: '',
            password: '',
            displayProperty: 'none'
        }),

        methods: {
            login() {
                this.$http.post('/login', {
                    username: this.email,
                    password: this.password,
                }).then(response => {
                    if (response.status === 200) {
                        router.push('/home')
                    } else {
                        this.displayProperty = 'block'
                    }
                }).catch(error => {
                    console.log(error)
                });
                router.push('/home');
            },
        },
    };
</script>

<style scoped>
    .labelContainer {
        padding-top: 7px;
    }

    .buttonWide {
        width: 100%;
    }

    .notification {
        padding-top: 30px;
        height: 100px;
        color: red;
    }
</style>