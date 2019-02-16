<template>
        <b-row class="MT20vh">
            <div class="diagonal-background"></div>
            <b-col sm="12" md="6">
                Make the Logo AS BIG AS YOU CAN
            </b-col>
            <b-col sm="12" md="5" offset-md="1">
                <form @submit.prevent="login">
                    <div class="form-group">
                        <b-row>
                            <b-col>
                                <label for="email">Email</label>
                                <input type="text" class="form-control" id="email" placeholder="Email" v-model="email">
                            </b-col>
                        </b-row>
                    </div>
                    <div class="form-group">
                        <b-row>
                            <b-col>
                                <label for="password">Password</label>
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
                </form>
            </b-col>
        </b-row>
</template>

<script>
    export default {
        name: 'LandingPage',
    };
</script>

<style scoped>
    .MT20vh {
        margin-top: 25vh;
    }

    .button-wide {
        width: 100%;
    }

    .diagonal-background {
        background-size: cover;
        height: 100vh;
        width: 100vw;
        background: url("../assets/bg-diagonal.svg") no-repeat 0 0;
    }
</style>