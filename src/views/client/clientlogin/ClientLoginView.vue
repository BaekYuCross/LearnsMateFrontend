<template>
  <div class="clientlogin-login-container">
    <div class="clientlogin-login-box">
     <!-- Left 컴포넌트 -->
     <component :is="currentComponent" @show-login-signup="showLoginSignup" @show-login-signup2="showLoginSignup2"  @show-login="showLogin" />   
      <!-- Right 부분 -->
      <div class="clientlogin-login-right">
        <img src="@/assets/icons/bluetechnologyback.svg" alt="배경" class="clientlogin-background-image" />
        <h2>개발자 강의의 모든 것!</h2>
        <h1 class="clientlogin-title">LearnsBuddy</h1>
        <img src="@/assets/icons/LearnsBuddy-login-logo.svg" alt="LearnsBuddy 로고" class="clientlogin-footer-logo" />
      </div>
    </div>
    <button class="clientlogin-top-right-button" @click="goToLearnsMate">
      LearnsMate 화면
    </button>
  </div>
</template>

<script setup>
 import { shallowRef  } from 'vue';
 import ClientLoginLeft from '@/components/client/clientlogin/ClientLoginLeft.vue';
 import ClientLoginSignupLeft from '@/components/client/clientlogin/ClientLoginSignupLeft.vue';
 import ClientLoginSignupLeft2 from '@/components/client/clientlogin/ClientLoginSignupLeft2.vue';
 import { useRouter } from 'vue-router'; 

const router = useRouter(); 

const goToLearnsMate = () => {
  router.push('/login');
};


 const currentComponent = shallowRef(ClientLoginLeft); 


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

.clientlogin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f6f8;
}


.clientlogin-login-box {
  display: flex;
  width: 1000px;
  height: 600px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
}

/* Right 컴포넌트 스타일 */
.clientlogin-login-right {
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
}

.clientlogin-background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.clientlogin-login-right h2 {
  font-size: 30px;
  font-weight: 500;
  z-index: 1;
}

.clientlogin-title {
  font-size: 40px;
  font-weight: bold;
  z-index: 1;
}

.clientlogin-footer-logo {
  position: absolute;
  bottom: 20px; 
  left: 50%; 
  transform: translateX(-50%); 
  width: 170px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}


.clientlogin-top-right-button {
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
}

.clientlogin-top-right-button:hover {
  background-color: #5a54d4;
}
</style>
