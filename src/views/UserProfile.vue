<template>
    <div>
        <navbar/>
        <background>
            <b-row>
                <b-col cols="12" md="6" offset-md="3" class="title-col">
                    <h1>Kasutajaprofiil</h1>
                </b-col>
                <b-col cols="12" md="6" offset-md="3">
                    <div v-if="!editing" class="edit">
                        <form @submit.prevent='' class='wide'>
                            <div class='form-group'>
                                <label for='first'>Name:</label>
                                <b-row>
                                    <b-col cols="12">
                                        <div>{{user.firstName + ' ' + user.lastName}}</div>
                                    </b-col>
                                </b-row>
                            </div>
                            <div v-if="user.bankAccount" class='form-group'>
                                <label for='first'>Bank account:</label>
                                <b-row>
                                    <b-col cols="12">
                                        <div>{{user.bankAccount.number}}</div>
                                    </b-col>
                                    <b-col cols="12">
                                        <div>{{user.bankAccount.name}}</div>
                                    </b-col>
                                </b-row>
                            </div>
                            <div class='form-group'>
                                <label for='email'>Email:</label>
                                <div>{{user.email}}</div>
                            </div>
                        </form>
                    </div>
                    <div v-else class="info">
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
                    <b-row v-if="editing">
                        <b-col cols="6">
                            <b-button class="w-100" variant="primary" v-on:click="save">Save</b-button>
                        </b-col>
                        <b-col cols="6">
                            <b-button class="w-100" variant="secondary" v-on:click="cancel">Cancel</b-button>
                        </b-col>
                    </b-row>
                    <b-row v-else>
                        <b-col cols="6">
                            <b-button class="w-100" variant="primary" v-on:click="editing = true">Edit</b-button>
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
    .title-col {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    label {
        font-weight: 500;
    }
</style>
