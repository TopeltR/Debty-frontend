<!--Taken from https://alligator.io/vuejs/vue-autocomplete-component/-->
<script>
    export let inputStore = {
        keyExtractor: (object) => object,
        value: {
            field: '',
            object: {},
        },
        setKeyExtractor(fn) {
            this.keyExtractor = fn;
        },
        setValue(value) {
            this.value.object = value;
            this.value.field = this.keyExtractor(value);
        },
    };

    export default {
        name: 'autocomplete',

        props: {
            keyextractor: {
                type: Function,
                required: false,
                default: (object) => {
                    return object;
                },
            },
            items: {
                type: Array,
                required: false,
                default: () => [],
            },
            isAsync: {
                type: Boolean,
                required: false,
                default: false,
            },
            placeholder: {
                type: String,
                required: false,
                default: ""
            },
        },

        data() {
            return {
                isOpen: false,
                results: [],
                inputStore: inputStore,
                isLoading: false,
                arrowCounter: 0,
            };
        },

        methods: {
            onChange() {
                // Let's warn the parent that a change was made
                this.$emit('input', this);

                // Is the data given by an outside ajax request?
                if (this.isAsync) {
                    this.isLoading = true;
                } else {
                    // Let's  our flat array
                    this.filterResults();
                    this.isOpen = true;
                }
            },

            filterResults() {
                // first uncapitalize all the things
                this.results = this.items.filter((item) => {
                    return this.keyextractor(item).toLowerCase().indexOf(this.inputStore.value.field.toLowerCase()) > -1;
                });
            },
            setResult(result) {
                this.inputStore.setValue(result);
                this.$emit('input', result);
                this.isOpen = false;
                //this.search = this.keyextractor(result);
                //this.input.input = result;
            },
            onArrowDown(evt) {
                if (this.arrowCounter < this.results.length) {
                    this.arrowCounter = this.arrowCounter + 1;
                }
            },
            onArrowUp() {
                if (this.arrowCounter > 0) {
                    this.arrowCounter = this.arrowCounter - 1;
                }
            },
            onEnter() {
                this.inputStore.setValue(this.results[this.arrowCounter]);
                //this.search = this.keyextractor(this.results[this.arrowCounter]);
                this.isOpen = false;
                this.arrowCounter = -1;
            },
            handleClickOutside(evt) {
                if (!this.$el.contains(evt.target)) {
                    this.isOpen = false;
                    this.arrowCounter = -1;
                }
            }
        },
        watch: {
            items: function (val, oldValue) {
                // actually compare them
                if (val.length !== oldValue.length) {
                    this.results = val;
                    this.isLoading = false;
                }
            },
        },
        mounted() {
            document.addEventListener('click', this.handleClickOutside);
            this.inputStore.setKeyExtractor(this.keyextractor);
        },
        destroyed() {
            document.removeEventListener('click', this.handleClickOutside)
        }
    };
</script>

<template>
    <div class="autocomplete">
        <input
                type="text"
                :placeholder="placeholder"
                class="form-control"
                @input="onChange"
                v-model="inputStore.value.field"
                @keydown.down="onArrowDown"
                @keydown.up="onArrowUp"
                @keydown.enter="onEnter"
        />
        <ul
                id="autocomplete-results"
                v-show="isOpen"
                class="autocomplete-results"
        >
            <li
                    class="loading"
                    v-if="isLoading"
            >
                Loading results...
            </li>
            <li
                    v-else
                    v-for="(result, i) in results"
                    :key="i"
                    @click="setResult(result)"
                    class="autocomplete-result"
                    :class="{ 'is-active': i === arrowCounter }"
            >
                {{ keyextractor(result) }}
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
    .autocomplete {
        position: relative;
    }

    .autocomplete-results {
        padding: 0;
        margin: 0;
        border: 1px solid lightgray;
        border-radius: 0 0 5px 5px;
        height: auto;
        overflow: auto;
        width: 100%;
        background-color: white;
    }

    .autocomplete-result {
        list-style: none;
        text-align: left;
        padding: 4px 2px 4px 10px;
        cursor: pointer;
    }

    .autocomplete-result.is-active,
    .autocomplete-result:hover {
        background-color: dodgerblue;
        color: white;
    }

</style>