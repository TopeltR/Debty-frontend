<template>
    <b-row>
        <b-col>
           Make the Logo AS BIG AS YOU CAN
        </b-col>
        <b-col>
            <b-jumbotron>
                <b-container class="text-center" >
                    <b-button-group vertical id="mainButtons">
                        <b-btn variant="primary" href="#">Login</b-btn>
                        <b-btn variant="success" href="#">Sign up</b-btn>
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
    #mainButtons {
        margin-top: 20px;
    }
</style>