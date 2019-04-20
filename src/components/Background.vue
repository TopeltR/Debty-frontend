<template>
    <b-container fluid class='diagonal-background'>
        <b-container>

            <slot></slot>
        </b-container>
    </b-container>
</template>

<script>
    export default {
        name: 'Background',
    };
</script>

<style scoped>
    .diagonal-background {
        background: url('../assets/bg-diagonal.svg') no-repeat center center fixed;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
        min-height: 100vh;
        padding-top: 70px;
    }
</style>
