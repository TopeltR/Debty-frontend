<template>
    <div class="row">
        <div class="col-sm-12 col-md-5">
            <form @submit.prevent="login">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" class="form-control" id="email" placeholder="Email" v-model="email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
    </div>
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

</style>