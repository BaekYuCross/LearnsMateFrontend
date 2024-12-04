<template>
  <div>
    <AppHeader v-if="isHeaderVisible" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, ref, watch, nextTick } from 'vue';
import { useLoginState } from '@/stores/loginState';  // loginState import 추가

const loginState = useLoginState();  // store 초기화
const route = useRoute();
const isTransitioning = ref(false);

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

const isHeaderVisible = computed(() => {
  const currentPath = route.path;
  const isExcluded = excludedPaths.includes(currentPath);
  const isClientLectureDetail = currentPath.startsWith('/client-lecturedetail/');
  const isAuthenticated = loginState.isLoggedIn;  // store에서 로그인 상태 확인
  
  console.log('Header visibility:', {
    currentPath,
    isExcluded,
    isClientLectureDetail,
    isAuthenticated
  });
  
  return isAuthenticated && !isExcluded && !isClientLectureDetail && !isTransitioning.value;
});

watch(
  () => route.path,
  () => {
    isTransitioning.value = true;
    nextTick(() => {
      isTransitioning.value = false;
    });
  }
);
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