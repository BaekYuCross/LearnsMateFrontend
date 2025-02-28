<template>
  <div>
    <div>
      <AppHeader v-if="isLoggedIn !== null && isLoggedIn && shouldShowHeader" />
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useLoginState } from '@/stores/loginState';
import { storeToRefs } from 'pinia';

const loginState = useLoginState();
const { isLoggedIn } = storeToRefs(loginState);
const route = useRoute();

const excludedPaths = [
  '/login',
  '/client-login',
  '/client-main',
  '/client-voc',
  '/client-myvoc',
  '/client-lecture',
  '/client-mylecture',
  '/client-lecturecart',
  '/client-addcoupon'
];

const shouldShowHeader = computed(() => {
  if (!route || isLoggedIn.value === null) return false;

  const isClientLectureDetail = route.path.startsWith('/client-lecturedetail/');
  const isExcludedPath = excludedPaths.includes(route.path);

  return !isExcludedPath && !isClientLectureDetail;
});

onMounted(async () => {
  try {
    await loginState.fetchLoginState();
  } catch (error) {
    console.error('Failed to fetch login state:', error);
  }
});
</script>

<style>
div[style*="display: none"] {
  display: none !important;
}

.v-application {
  font-family: 'Pretendard-Regular', sans-serif !important;
}

@font-face {
  font-family:'Pretendard-Regular';
  src: url('assets/fonts/Pretendard-Regular.otf') format('truetype');
  font-weight: 400;
}

@font-face {
  font-family:'Pretendard-Light';
  src: url('assets/fonts/Pretendard-Light.otf') format('truetype');
  font-weight: 400;
}
</style>