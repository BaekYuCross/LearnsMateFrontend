<template>
  <header class="clientheader-app-header">
    <router-link to="/client-main" class="clientheader-logo-link">LearnsBuddy</router-link>

    <nav class="clientheader-user-menu" style="margin-left: 20px;">
      <router-link to="/client-lecture" class="clientheader-user-link">강의</router-link>
      <router-link to="#" class="clientheader-user-link">로드맵</router-link>
      <router-link to="/client-voc" class="clientheader-user-link">VOC</router-link>
    </nav>

    <div class="clientheader-search-container">
      <input
        type="text"
        class="clientheader-search-input"
        placeholder="한화시스템 BEYOND SW CAMP를 검색해보세요!"
      />
      <img src="@/assets/icons/search.svg" alt="검색" />
    </div>

    <div class="clientheader-user-menu">
      <router-link to="/client-mylecture" class="clientheader-user-link">내 강의</router-link>
      <a href="#" class="clientheader-user-link" @click.prevent="handleLogout">로그아웃</a>
      <div class="clientheader-user-icon">
        <img src="@/assets/icons/person.svg" alt="유저 아이콘"  @click="goToLogin"/>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const handleLogout = async () => {
  try {
    const clientInfo = JSON.parse(localStorage.getItem('clientInfo'));
    if (!clientInfo) {
      router.push('/client-login');
      return;
    }

    console.log(clientInfo);

    // 로그아웃 요청
    await axios.post('https://learnsmate.shop/client/exit', {
      login_history_code: clientInfo.login_history_code,
    });

    // localStorage 클리어
    localStorage.removeItem('clientInfo');
    localStorage.removeItem('isAuthenticated');
    
    // 로그인 페이지로 이동
    router.push('/client-login');
  } catch (error) {
    console.error('로그아웃 실패:', error);
    alert('로그아웃 처리 중 오류가 발생했습니다.');
  }
};

const goToLogin = (path) => {
  router.push('/client-login');
};
</script>

<style lang="scss" scoped>
.clientheader-app-header {
  display: flex;
  justify-content: space-between;
  font-family:'Pretendard-Light';
  align-items: center;
  padding: 10px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #ececec;

  .clientheader-logo-link {
    text-decoration: none;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 24px;
    font-weight: bolder;
    color: #6c63ff;
  }

  .clientheader-search-container {
    flex: 1; 
    display: flex;
    justify-content: center; 
    align-items: center;
    gap: 10px;

    .clientheader-search-input {
      width: 100%; 
      max-width: 600px; 
      background-color: #f2f2f2;
      padding: 10px 20px;
      border: 1px solid #ddd;
      border-radius: 50px;
      outline: none;

      &:focus {
        border-color: #6c63ff;
      }
    }

    img {
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
  }

  .clientheader-user-menu {
    display: flex;
    align-items: center;
    gap: 15px;

    .clientheader-user-link {
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      text-decoration: none;

      &:hover {
        color: #6c63ff;
      }
    }

    .clientheader-user-icon img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
}
</style>
