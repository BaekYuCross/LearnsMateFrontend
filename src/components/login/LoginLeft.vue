<template>
  <div class="login-left">
    <h1>Login</h1>
    <form class="login-form" @submit.prevent="loginUser">
      <input v-model="formData.adminCode" type="text" placeholder="사번 ID" class="login-input" />
      <input v-model="formData.adminPassword" type="password" placeholder="비밀번호" class="login-input" />
      <button type="submit" class="login-button">로그인</button>
      <button type="button" class="login-pw" @click="$emit('show-login-pw')">비밀번호 재설정</button>
    </form>
  </div>
</template>

<script setup>
import { useLoginState } from '@/stores/loginState';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const loginState = useLoginState();
const router = useRouter();

const formData = ref({
  adminCode: '',
  adminPassword: '',
});

const checkLoginStatus = async () => {
  try {
    await loginState.fetchLoginState();
    if (loginState.isLoggedIn) {
      router.push('/');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return;
    }
    console.error('로그인 상태 확인 중 에러:', error);
  }
};

const loginUser = async () => {
  try {
    console.log('로그인 시도:', formData.value);
    
    const response = await axios.post(
      'https://learnsmate.shop/users/login',
      {
        admin_code: formData.value.adminCode,
        admin_password: formData.value.adminPassword,
      }
    );
    console.log('로그인 응답:', response);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await loginState.fetchLoginState();
    console.log('로그인 상태:', loginState);
    
    if (loginState.isLoggedIn) {
      alert(`${loginState.adminName}님, 환영합니다.`);
      router.push('/');
    } else {
      throw new Error('로그인 상태 확인 실패');
    }
  } catch (error) {
    console.error('로그인 실패:', error);
    if (error.response) {
      console.log('에러 응답:', error.response.data);
      console.log('에러 상태:', error.response.status);
      console.log('에러 헤더:', error.response.headers);
    }
    alert('로그인에 실패했습니다. 사번 또는 비밀번호를 확인해주세요.');
  }
};

onMounted(async () => {
  checkLoginStatus();
});

</script>
  
  <style scoped>
  .login-left {
    border-top: 8px solid #145f58;
    width: 50%;
    padding: 60px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    h1 {
      margin-bottom: 50px;
      font-size: 30px;
      color: #145f58;
    }
  
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
  
      .login-input {
        width: 360px;
        padding: 10px;
        box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
        font-size: 14px;
        background-color: rgba(232, 240, 254, 0.4);
        border: 1.3px solid #e1dfdf;
        border-radius: 11px;
        color: #3e3e3e;
        outline: none;
  
        &:focus {
          outline: none;
        }
      }
  
      .login-input::placeholder {
        color: rgba(114, 114, 114, 0.5);
        font-size: 15px;
      }
  
      .login-button {
        width: 100%;
        margin-top: 30px;
        padding: 8px;
        box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
        background-color: #145f58;
        color: #fff;
        font-size: 16px;
        border: none;
        border-radius: 60px;
        cursor: pointer;
  
        &:hover {
          background-color: #124c47;
        }
      }
    }
  
    .login-pw {
      background: none;
      border: none;
      color: rgba(128, 128, 128, 0.7);
      font-size: 14px;
      cursor: pointer;
      text-align: center;
      margin: 0 auto;
  
      &:hover {
        color: rgba(128, 128, 128, 1);
        text-decoration: underline;
      }
    }
  }
  </style>
  