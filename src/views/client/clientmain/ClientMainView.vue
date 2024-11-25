<template>
  <div class="clientmain-app-container">
    <ClientHeader />
    <div class="clientmain-banner-container">
      <img src="@/assets/icons/beyondsw.svg" alt="배너" class="clientmain-banner" />
    </div>
    <div class="clientmain-categories-container">
      <button class="clientmain-category">백엔드 할인</button>
      <button class="clientmain-category">프론트엔드 할인</button>
      <button class="clientmain-category">게임개발 기획 할인</button>
      <button class="clientmain-category">DB 설계</button>
      <button class="clientmain-category">머신러닝</button>
      <button class="clientmain-category">최고 평점 강의들</button>
    </div>
    <button class="clientmain-top--button" @click="goToLearnsMate">
      쿠폰 추가하러 가기
    </button>
    <div class="clientmain-sub-title">
      <h3>런즈버디에서 성장을 도와드려요</h3>
      <input
        type="text"
        placeholder="배우고 싶은 지식을 입력해보세요!"
        class="clientmain-search-bar"
      />
      <div class="clientmain-icon-container">
        <img src="@/assets/icons/lineline.svg" alt="# 아이콘 배너" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ClientHeader from "@/components/client/ClientHeader.vue";
import { useRouter } from 'vue-router';

const router = useRouter(); 

const goToLearnsMate = () => {
  router.push('/client-addcoupon'); 
};
</script>

<style scoped lang="scss">
.clientmain-app-container {
  background-color: #ffffff;
  height: 100vh;
  text-align: center;
}

.clientmain-banner-container {
  background-color: #040718;
}
.clientmain-banner {
  width: 90%;
  max-height: 300px;
  object-fit: cover;
  padding: 6px;
}


.clientmain-banner-content h1 {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
}

.clientmain-banner-content h2 {
  font-size: 28px;
  margin: 10px 0;
}

.clientmain-banner-content p {
  font-size: 16px;
  line-height: 1.5;
  margin: 20px 0;
}

.clientmain-banner-button {
  padding: 10px 20px;
  background-color: #6c63ff;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clientmain-banner-button:hover {
  background-color: #5a54d6;
}

.clientmain-categories-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.clientmain-category {
  padding: 10px 20px;
  border: 1px solid #7671f4;
  border-radius: 20px;
  background-color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  color: #7671f4;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clientmain-category:hover {
  background-color: #ddd;
}

.clientmain-sub-title {
  margin: 30px 0;
}

.clientmain-sub-title h3 {
  font-size: 26px;
  font-weight: bolder;
  margin-bottom: 3px;
}

.clientmain-top--button {
  position: absolute;
  top: 70px;
  right: 20px;
  background-color: #C071F4;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 3px 30px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.clientmain-search-bar {
  margin: 30px 0;
  width: 600px;
  padding: 13px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #7671f4;
  color: #ffffff;
  outline: none;
  &::placeholder {
    color: #ffffff;
    opacity: 0.7;
    font-weight: bold;
  }

  &:focus {
    outline: none;
  }
}

.clientmain-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
}

.clientmain-icon-container img {
  width: 1400px;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}
</style>
