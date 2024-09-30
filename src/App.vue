<!-- src/App.vue -->
<template>
  <div id="app">
    <Preloader />
    <ImageGenerator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageGenerator from './components/ImageGenerator.vue';
import Preloader from './components/Preloader.vue';


export default defineComponent({
  components: {
    ImageGenerator,
    Preloader,
  },
});
</script>

<style>

</style>