<template>
    <div class="main-container">
    </div>
  </template>
  
  <script setup>


  import { useLoginState } from '@/stores/loginState';
import { onMounted } from 'vue';

  const loginState = useLoginState();

  onMounted(() => {
  console.log('Pinia Store 상태:', loginState.$state); // 현재 스토어 상태 출력
  console.log('로그인 상태:', loginState.isLoggedIn);
  console.log('관리자 이름:', loginState.adminName);
});


  </script>
  
  <style scoped>
  .main-container {
    padding: 20px;
  }
  </style>