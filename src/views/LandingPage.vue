<template>
    <b-row>
        <b-col>
            Logo
        </b-col>
        <b-col>
            <b-jumbotron>
                <div class="container text-center">
                    <b-button-group vertical id="mainButtons">
                        <b-btn variant="primary" href="#">Login</b-btn>
                        <b-btn variant="success" href="#">Sign up</b-btn>
                    </b-button-group>
                </div>
            </b-jumbotron>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "LandingPage"
    }
</script>

<style scoped>
    #mainButtons {
        margin-top: 20px;
    }
</style>