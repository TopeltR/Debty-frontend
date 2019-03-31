<template>
    <div>
        <navbar/>
        <background>
            <b-row>

                <b-col cols="12" md="6" offset-md="3">
                    <div v-if="!editing" class="edit">
                        <b-col class="card shadow my-5">
                            <form @submit.prevent='' class='w-100 card-body'>
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
                                <b-col cols="6">
                                    <b-button class="w-100" variant="primary" v-on:click="editing = true">Edit</b-button>
                                </b-col>
                            </b-row>
                        </b-col>
                    </div>
                    <div v-else class="info mt-5">
                        <h2 class="mb-3">Edit user profile</h2>
                        <div class='form-group'>
                            <label for='first'>Name:</label>
                            <b-row>
                                <b-col cols="6">
                                    <input type='text' class='form-control float-left'
                                           v-model='user.firstName' id="first" required=''
                                           placeholder=''>
                                </b-col>
                                <b-col cols="6">
                                    <input type='text' class='form-control float-right' v-model='user.lastName'
                                           id='last' required=''
                                           placeholder=''>
                                </b-col>
                            </b-row>
                        </div>
                        <div class='form-group'>
                            <label for='first'>Bank account</label>
                            <b-row>
                                <b-col cols="6">
                                    <input type='text' class='form-control float-left'
                                           v-model='user.bankAccount.number' id="bank-number" required=''
                                           placeholder=''>
                                </b-col>
                                <b-col cols="6">
                                    <input type='text' class='form-control float-right'
                                           v-model='user.bankAccount.name'
                                           id='bank-name' required=''
                                           placeholder=''>
                                </b-col>
                            </b-row>
                        </div>
                        <div class='form-group'>
                            <label for='email'>Email</label>
                            <input type='text' class='form-control' v-model='user.email' id='email' required=''
                                   placeholder=''>
                        </div>
                        <div class='form-group'>
                            <label for='password'>New password</label>
                            <input type='password' class='form-control' v-model='user.password' id='password'
                                   required=''
                                   placeholder='Enter new password'>
                        </div>
                        <div class='form-group'>
                            <label for='password-confirmation'>Password confirmation</label>
                            <input type='password' class='form-control' v-model='user.passwordConfirmation'
                                   id='password-confirmation' required=''
                                   placeholder='Enter password again'>
                        </div>
                    </div>
                    <b-row v-if="editing" class="mt-3">
                        <b-col cols="6">
                            <b-button class="w-100" variant="primary" v-on:click="save">Save</b-button>
                        </b-col>
                        <b-col cols="6">
                            <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel</b-button>
                        </b-col>
                    </b-row>

                </b-col>
            </b-row>
        </background>
    </div>
</template>

<script>
    import userStore from '../stores/UserStore';
    import Background from '@/components/Background';
    import Navbar from '@/components/Navbar';

    export default {
        name: "UserProfile.vue",
        components: {Background, Navbar},
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
        }),
        async mounted() {
            this.user = await userStore.getUser();
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
