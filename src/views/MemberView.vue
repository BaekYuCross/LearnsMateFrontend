<template>
  <div class="layout-container">
    <div class="side-menu">
        <MemberSideMenu/>
    </div>
    <div class="main-content">
      <MemberFilter/>
    </div>
  </div>
  </template>
  
  <script setup>

import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';

  </script>
  
  <style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.side-menu {
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #006D5C; /* 진한 녹색 배경 */
  z-index: 100; /* 다른 요소들보다 위에 오도록 */
}

.main-content {
  flex: 1;
  margin-left: 160px; /* 사이드메뉴 너비만큼 마진 */
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
}
  </style>