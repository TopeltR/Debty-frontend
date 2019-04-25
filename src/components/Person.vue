<template>
    <div>

        <span>
            <font-awesome-icon icon='times' v-bind:class="classes"
                               class="icon icons"
                               v-on:click='deletePerson'/>
            {{fullName}}
            <small v-if="this.owner"> (owner)</small>
        </span>
    </div>
</template>

<script>
    import {fromArray} from "@/utils";

    export default {
        name: 'Person',
        props: {
            addPersonState: {type: Object, required: true},
            person: {type: Object, required: true},
            owner: {type: Boolean, default: false},
            disableOwnerDelete: {type: Boolean, default: false},
        },
        data: () => ({
            classes: {'text-danger': true, 'text-muted': false},
        }),
        computed: {
            fullName() {
                return this.person.firstName + ' ' + this.person.lastName;
            },
        },
        mounted() {
            if (!this.disableOwnerDelete && this.owner) {
                this.classes["text-danger"] = false;
                this.classes["text-muted"] = true;
            }
        },
        methods: {
            deletePerson() {
                if (!this.owner || this.disableOwnerDelete) {
                    fromArray(this.addPersonState.people).removeElement(this.person, (person) => person.id);
                }
            },
        },
    };
</script>

<style scoped>
    .icon {
        margin-top: 4px;
        margin-right: 10px;
    }
</style>
