<template>
    <b-container>
        <div>
            <navbar></navbar>

            <b-row>
                <b-col sm="12" md="5">
                    <h2>Events</h2>
                </b-col>
            </b-row>
        </div>
    </b-container>
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
