<template>
  <div>
    <Suspense>
      <template #default>
        <AppHeader v-if="shouldShowHeader" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
    <main>
      <RouterView />
    </main>
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
  console.log('Current route path:', route.path);
  console.log('Login state:', isLoggedIn.value);
  console.log('Is excluded path:', excludedPaths.includes(route.path));

  // route나 isLoggedIn이 undefined인 경우 처리
  if (!route || isLoggedIn.value === undefined) {
    return false;
  }

  // 클라이언트 상세 페이지 체크
  const isClientLectureDetail = route.path.startsWith('/client-lecturedetail/');

  // 조건 체크
  return isLoggedIn.value && 
         !excludedPaths.includes(route.path) && 
         !isClientLectureDetail;
});

onMounted(async () => {
  if (!loginState.isLoggedIn) {
    try {
      await loginState.fetchLoginState();
    } catch (error) {
      console.error('Failed to fetch login state:', error);
    }
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