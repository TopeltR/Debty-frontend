<template>
    <label class="font-weight-500" :for="forElement"><slot></slot><span v-if="required" class="text-danger">&nbsp;*</span></label>
</template>

<script>
    export default {
        name: "InputLabel",
        props: {
            for: {type: String},
            required: {type: Boolean, default: false},
        },
        computed: {
            forElement() {
                return this.for;
            },
        },
    };
</script>

<style scoped>
    .font-weight-500 {
        font-weight: 500;
    }
</style>
