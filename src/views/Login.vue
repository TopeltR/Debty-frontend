<template>
    <b-row>
        <b-col sm="12" md="6" offset-md="3">
            <h1>
                Login
            </h1>
            <form @submit.prevent="login">
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
                            <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
                        </b-col>
                    </b-row>
                </div>
                <b-row>
                    <b-col sm="12">
                        <button type="submit" class="btn btn-primary buttonWide">Login</button>
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
        }),

        methods: {
            login() {
                router.push('/');
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
</style>