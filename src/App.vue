<template>
  <div>
    <AppHeader v-if="shouldShowHeader" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { useLoginState } from '@/stores/loginState';
import { storeToRefs } from 'pinia';

const loginState = useLoginState();
const { isLoggedIn } = storeToRefs(loginState);
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

const shouldShowHeader = computed(() => {
  if (route && isLoggedIn !== undefined) {
    const pathCheck = !excludedPaths.includes(route.path);
    const clientCheck = !route.path.startsWith('/client-lecturedetail/');
    const loginCheck = isLoggedIn.value;
    const transitioning = !isTransitioning.value;

    console.log('Computing header visibility:', {
      path: route.path,
      isLoggedIn: loginCheck,
      isExcluded: !pathCheck,
      isClientLectureDetail: !clientCheck
    });

    return loginCheck && pathCheck && clientCheck && transitioning;
  }
  
  return false;
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