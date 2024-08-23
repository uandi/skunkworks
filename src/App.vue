<template>
  <div id="app">
    <ImageGenerator />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ImageGenerator from './components/ImageGenerator.vue';

export default defineComponent({
  name: 'App',
  components: {
    ImageGenerator
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>