<template>
    <div>
        <navbar/>
        <background>
            <spinner :loaded="loaded">
                <b-row>
                    <b-col cols="12" md="6" offset-md="3">
                        <div v-if="!editing" class="edit">
                            <b-col class="p-md-5 card shadow my-5">
                                <form @submit.prevent='save' class='w-100 card-body'>
                                    <div class="text-center">
                                        <h2 class="pt-2 pb-5">User profile</h2>
                                    </div>
                                    <div class='form-group'>
                                        <b-row class="pb-3 border-bottom-1">
                                            <b-col md="6">
                                                <label for='first'>Name:</label>
                                            </b-col>
                                            <b-col md="6">
                                                {{user.firstName + ' ' + user.lastName}}
                                            </b-col>
                                        </b-row>
                                    </div>
                                    <div v-if="user.bankAccount" class='w-100'>
                                        <b-row class="pb-3 border-bottom-1">
                                            <b-col md="6">
                                                <label for='first'>Bank account:</label>
                                            </b-col>
                                            <b-col md="6">
                                                <div>{{user.bankAccount.name}}</div>
                                                <div>{{user.bankAccount.number}}</div>
                                            </b-col>
                                        </b-row>
                                    </div>
                                    <div class='form-group'>
                                        <b-row class="py-3">
                                            <b-col md="6">
                                                <label for='email'>Email:</label>
                                            </b-col>
                                            <b-col md="6">
                                                <div>{{user.email}}</div>
                                            </b-col>
                                        </b-row>

                                    </div>
                                </form>
                                <b-row v-if="!editing" class="mb-4">
                                    <b-col cols="12" md="6" offset-md="3">
                                        <b-button class="w-100" variant="primary" v-on:click="editing = true">Edit
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </div>
                        <form v-else>
                            <div class="info mt-5">
                                <h2 class="mb-3">Edit user profile</h2>
                                <div class='form-group'>
                                    <label for='first'>Name*:</label>
                                    <b-row>
                                        <b-col cols="6">
                                            <input type='text' class='form-control float-left' v-model='user.firstName'
                                                   id="first" required minlength="1" maxlength="255">
                                        </b-col>
                                        <b-col cols="6">
                                            <input type='text' class='form-control float-right' v-model='user.lastName'
                                                   id='last' required minlength="1" maxlength="255">
                                        </b-col>
                                    </b-row>
                                </div>
                                <div class='form-group'>
                                    <label for='first'>Bank account:</label>
                                    <b-row>
                                        <b-col cols="6">
                                            <input type='text' class='form-control float-left'
                                                   v-model='user.bankAccount.number'
                                                   id="bank-number" maxlength="255">
                                        </b-col>
                                        <b-col cols="6">
                                            <input type='text' class='form-control float-right'
                                                   v-model='user.bankAccount.name'
                                                   id='bank-name' maxlength="255">
                                        </b-col>
                                    </b-row>
                                </div>
                                <div class='form-group'>
                                    <label for='email'>Email*:</label>
                                    <input type='email' class='form-control' v-model='user.email' id='email' required
                                           minlength="5" maxlength="255">
                                </div>
                                <div class='form-group'>
                                    <label for='password'>New password:</label>
                                    <input type='password' class='form-control' v-model='user.password' id='password'
                                           minlength="8" maxlength="255"
                                           placeholder='Enter new password'>
                                </div>
                                <div class='form-group'>
                                    <label for='password-confirmation'>Password confirmation:</label>
                                    <input type='password' class='form-control' v-model='user.passwordConfirmation'
                                           id='password-confirmation' minlength="8" maxlength="255"
                                           placeholder='Enter password again'>
                                </div>
                            </div>
                            <b-row v-if="editing" class="mt-3">
                                <b-col cols="6">
                                    <b-button type="submit" class="w-100" variant="primary">Save</b-button>
                                </b-col>
                                <b-col cols="6">
                                    <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel</b-button>
                                </b-col>
                            </b-row>
                        </form>

                    </b-col>
                </b-row>
            </spinner>
        </background>
    </div>
</template>

<script>
    import userStore from '@/stores/UserStore';
    import Background from '@/components/Background.vue';
    import Navbar from '@/components/Navbar.vue';
    import Spinner from '@/components/Spinner.vue';

    export default {
        name: "UserProfile",
        components: {Background, Navbar, Spinner},
        data: () => ({
            editing: false,
            user: {
                firstName: '',
                lastName: '',
                email: '',
                bankAccount: {},
                password: '',
                passwordConfirmation: '',
            },
            loaded: false,
        }),
        async mounted() {
            this.user = await userStore.getUser();
            this.loaded = true;
        },
        methods: {
            async save() {
                const response = await this.$http.put("/users", this.user);
                this.user = response.data;
                this.user.password = '';
                this.editing = false;
            },
            async cancel() {
                this.user = await userStore.getUser();
                this.editing = false;
            },
        },
    };
</script>

<style scoped>
    .border-bottom-1 {
        border-bottom: lightgray solid 1px;
    }

    label {
        font-weight: 500;
    }
</style>
