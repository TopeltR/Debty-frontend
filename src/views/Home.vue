<template>
  <div>
    <create-event></create-event>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CreateEvent from '/src/CreateEvent.vue'; // @ is an alias to /src

@Component({
  components: {
    CreateEvent,
  },
})
export default class Home extends Vue {}
</script>
