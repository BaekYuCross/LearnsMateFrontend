<template>
  <div>
    <AppHeader v-if="showHeader" />
  </div>
  <main>
    <RouterView />
  </main>
</template>

<script setup>

import AppHeader from './components/AppHeader.vue';
import { RouterView , useRoute} from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
const isClientLoginPage = computed(() => route.path === '/client-login');

const showHeader = computed(() => {
  return !isLoginPage.value && !isClientLoginPage.value;
});

</script>

<style scoped>

</style>