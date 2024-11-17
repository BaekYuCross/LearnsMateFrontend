<template>
  <div>
    <AppHeader/>
  </div>
  <main>
    <RouterView />
  </main>
</template>

<script setup>

import AppHeader from './components/AppHeader.vue';
import { RouterView } from 'vue-router';

</script>

<style scoped>

</style>