<template>
  <div class="login-container">
    <div class="login-box">
     <!-- Left 컴포넌트 -->
     <component :is="currentComponent" @show-login-signup="showLoginSignup" @show-login-signup2="showLoginSignup2"  @show-login="showLogin" />   
      <!-- Right 부분 -->
      <div class="login-right">
        <img src="@/assets/icons/bluetechnologyback.svg" alt="배경" class="background-image" />
        <h2>개발자 강의의 모든 것!</h2>
        <h1 class="title">LearnsBuddy</h1>
        <img src="@/assets/icons/LearnsBuddy-login-logo.svg" alt="LearnsBuddy 로고" class="footer-logo" />
      </div>
    </div>
    <button class="top-right-button" @click="goToLearnsMate">
      LearnsMate 화면
    </button>
  </div>
</template>

<script setup>
 import { shallowRef  } from 'vue';
 import ClientLoginLeft from '@/components/client/login/ClientLoginLeft.vue';
 import ClientLoginSignupLeft from '@/components/client/login/ClientLoginSignupLeft.vue';
 import ClientLoginSignupLeft2 from '@/components/client/login/ClientLoginSignupLeft2.vue';
 import { useRouter } from 'vue-router'; // Vue Router import

const router = useRouter(); // Router 인스턴스 생성

const goToLearnsMate = () => {
  router.push('/login'); // '/login' 경로로 이동
};

 // 현재 보여줄 컴포넌트를 관리하는 상태
 const currentComponent = shallowRef(ClientLoginLeft); 

// 컴포넌트를 전환하는 함수
const showLoginSignup2 = () => {
  currentComponent.value = ClientLoginSignupLeft2;
};

const showLoginSignup = () => {
  currentComponent.value = ClientLoginSignupLeft;
};

const showLogin = () => {
  currentComponent.value = ClientLoginLeft;
};
</script>

  <style scoped>
  /* 컨테이너 스타일 */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f6f8;
  }
  
  /* 로그인 박스 스타일 */
  .login-box {
    display: flex;
    width: 1000px;
    height: 600px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  
  /* Right 컴포넌트 스타일 */
  .login-right {
    width: 50%;
    padding: 20px;
    background-color: #7671f4;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    
  
    .background-image {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
  
    h2 {
      font-size: 30px;
      font-weight: 500;
      z-index: 1;
    }
  
    .title {
      font-size: 40px;
      font-weight: bold;
      z-index: 1;
    }
  
    .footer-logo {
      position: absolute; /* 박스 내부에서 절대 위치 */
      bottom: 20px; /* 아래쪽 여백 */
      left: 50%; /* 수평 중앙 정렬 */
      transform: translateX(-50%); /* 중앙 정렬을 위한 변환 */
      width: 170px;
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  /* 오른쪽 상단 버튼 */
.top-right-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #7671f4;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 3px 30px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5a54d4;
  }
}
  </style>
  