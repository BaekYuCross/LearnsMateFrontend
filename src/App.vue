<template>
  <div>
    <AppHeader v-if="showHeader && !isTransitioning" />
  </div>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';

const route = useRoute();
const isTransitioning = ref(false);
const isLoginPage = computed(() => route.path === '/login');
const isClientLoginPage = computed(() => route.path === '/client-login');
const isClientMainPage = computed(() => route.path === '/client-main');



const showHeader = computed(() => {
  return !isLoginPage.value && !isClientLoginPage.value 
  && !isClientMainPage.value && !isClientVocPage.value 
  && !isClientMyVocPage.value && !isClientLecturePage.value 
  && !isClientMyLecturePage.value && !isClientLectureDetailPage.value;
});

watch(route, () => {
  isTransitioning.value = true;
  isTransitioning.value = false;
 
});
</script>

<style>
/* 초기 상태에서 AppHeader 숨김 */
div[style*="display: none"] {
  display: none !important;
}
</style>
