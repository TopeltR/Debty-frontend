<template>
    <div>
        <span v-if="status === 'NEW'" class="status new"><small>{{status}}</small></span>
        <span v-if="status === 'ACCEPTED'" class="status accepted"><small>{{status}}</small></span>
        <span v-if="status === 'DECLINED'" class="status declined"><small>{{status}}</small></span>
        <span v-if="status === 'PAID'" class="status paid"><small>{{status}}</small></span>
        <span v-if="status === 'CONFIRMED'" class="status confirmed"><small>{{status}}</small></span>
    </div>
</template>

<script>
    export default {
        name: "DebtStatus",
        props: {
            status: {
                type: String,
            },
        },
    };
</script>

<style scoped>
    .status {
        border: black solid 1px;
        border-radius: 5px;
        padding: 3px 8px 5px 8px;
    }

    .new {
        border-color: orange !important;
        color: orange !important;
    }

    .declined {
        border-color: red !important;
        color: red !important;
    }

    .paid {
        border-color: deeppink !important;
        color: deeppink !important;
    }

    .accepted {
        border-color: blue !important;
        color: blue !important;
    }

    .confirmed {
        border-color: limegreen !important;
        color: limegreen !important;
    }
</style>