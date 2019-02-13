<template>
    <div class="row">
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
</template>

<script>
    import router from '../router.ts'

    export default {
        name: "Register.vue",
        data: () => ({
            email: '',
            password: '',
        }),

        methods: {
            login() {
                router.push('home');
            },
        },
    }
</script>

<style scoped>

</style>