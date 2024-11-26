<template>
    <div class="main-container">
    </div>
  </template>
  
<script setup>
import { onMounted } from 'vue';
import { useLoginState } from '@/stores/loginState';

const loginState = useLoginState();

onMounted(async () => {
  await loginState.fetchLoginState(); // 서버에서 로그인 상태 확인
  console.log('로그인 상태:', loginState.isLoggedIn);
  console.log('관리자 이름:', loginState.adminName);

  // 로그인 상태가 아니면 로그인 페이지로 리다이렉트
  if (!loginState.isLoggedIn) {
    window.location.href = '/login';
  }
});
</script>

  
  <style scoped>
  .main-container {
    padding: 20px;
  }
  </style>