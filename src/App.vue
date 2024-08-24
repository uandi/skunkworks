<!-- src/App.vue -->
<template>
  <div id="app">
    <ImageGenerator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageGenerator from './components/ImageGenerator.vue';

export default defineComponent({
  components: {
    ImageGenerator,
  },
});
</script>

<style>

</style>