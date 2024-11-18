<template>
    <header class="header-container">
      <nav class="nav-container">
        <div class="logo-section">
          <h1>LearnsMate</h1>
        </div>
  
        <div class="menu-section">
          <ul class="menu-list">
            <li 
              v-for="menu in menus" 
              :key="menu.path"
              class="menu-item"
              :class="{ 'active': currentRoute === menu.path }"
              @click="navigateTo(menu.path)"
            >
              {{ menu.name }}
            </li>
          </ul>
        </div>
  
        <div class="icon-section">
          <img src="@/assets/icons/account.svg" alt="계정" class="icon">
          <img src="@/assets/icons/bell.svg" alt="알림" class="icon">
          <img src="@/assets/icons/logout.svg" alt="로그아웃" class="icon">
          <img src="@/assets/icons/search.svg" alt="검색" class="icon">
          <img src="@/assets/icons/settings.svg" alt="설정" class="icon">
        </div>
      </nav>
    </header>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  const menus = ref([
    { name: '메인', path: '/main' },
    { name: '강의', path: '/lecture' },
    { name: '고객', path: '/student' },
    { name: '마케팅', path: '/marketing' },
    { name: 'VOC', path: '/voc' }
  ]);
  
  const currentRoute = computed(() => route.path);
  
  const navigateTo = (path) => {
    router.push(path);
  };
  </script>
  
  <style scoped>
  .header-container {
    width: 100%;
    height: 50px;
    background-color: #ffffff;
    border-bottom: 3px solid #005950;
    position: fixed;
  }
  
  .nav-container {
    max-width: 1920px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
  
  .logo-section h1 {
    color: #000000;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
  }
  
  .menu-section {
    flex: 1;
    margin: 0 20px 0 30px;
  }
  
  .menu-list {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 10px;
    margin: 0;
    justify-content: flex-start;
  }
  
  .menu-item {
    color: #000000;
    cursor: pointer;
    font-family: "Malgun Gothic";
    font-size: 16px;
    white-space: nowrap;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 25px;
    padding-bottom: 25px;
    position: relative;
    width: 52px;
    height: 44.6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .menu-item.active {
    color: #FFFFFF;
    background-color: #005950;
    margin-bottom: -3px;
  }
  
  .icon-section {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    flex-shrink: 0;
  }
  </style>