<template>
    <div class="member-container">
      <MemberSideMenu/>
      <MemberFilter/>
    </div>
  </template>
  
  <script setup>

import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';

  </script>
  
  <style scoped>
  .member-container {
    padding: 20px;
  }
  </style>
<template>
    <div class="member-container">
      <MemberSideMenu/>
    </div>
  </template>
  
  <script setup>
    import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
  </script>
  
  <style scoped>
  .member-container {
    padding: 20px;
  }
  </style>