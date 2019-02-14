<template>
    <div>
        <navbar></navbar>

        <b-row>
            <b-col>
                <h2>Welcome to Debty!</h2>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Navbar from '@/components/Navbar.vue';

    @Component({
        components: {Navbar},
    })
    export default class Home extends Vue {
    }
</script>
