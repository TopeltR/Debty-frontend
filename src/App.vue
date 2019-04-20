<template>
    <router-view/>
</template>

<script>
    Array.prototype.remove = function(from, to) {
        const rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    Array.prototype.removeElement = function(element, keyExtractor) {
        for (let i = 0; i < this.length; i++) {
            if (keyExtractor(this[i]) === keyExtractor(element)) {
                this.remove(i);
            }
        }
    };

    export default {
        name: "App",
    };
</script>

<style lang="scss">
    #app {
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
</style>
