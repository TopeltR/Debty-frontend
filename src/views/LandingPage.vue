<template>
    <b-row class="customRow">
        <b-col class="columns">
           Make the Logo AS BIG AS YOU CAN
        </b-col>
        <b-col class="columns" >
            <b-jumbotron class="jumbo" lead="Login or sign up or idk die" >
                <b-container class="text-center" >
                    <b-button-group vertical>
                        <b-btn variant="primary" href="#" id="loginButton">Login</b-btn>
                        <b-btn variant="success" href="#" id="signupButton">Sign up</b-btn>
                    </b-button-group>
                </b-container>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'LandingPage',
    };
</script>

<style scoped>
    .jumbo {
        height:65vh;
    }
    .customRow {
        padding:10vh;
    }
    #loginButton {
        margin-bottom: 20px;
        width: 10vw;
        height: 10vh;
    }
    #signupButton {
        width: 10vw;
        height: 10vh;
    }

    .columns{
        height: 90vh;
    }

    #loginButton {
        margin-top: 20px;
    }
</style>