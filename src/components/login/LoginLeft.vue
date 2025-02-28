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
      await router.push('/main');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.warn('인증되지 않은 사용자입니다.');
      return;
    }
    console.error('로그인 상태 확인 중 에러:', error);
  }
};

const loginUser = async () => {
  try {
    const loginResponse = await axios.post('http://localhost:5000/users/login', {
      admin_code: formData.value.adminCode,
      admin_password: formData.value.adminPassword,
    });

    const { accessToken, refreshToken, exp, name, adminDepartment } = loginResponse.data;

    if (accessToken) {
      document.cookie = `token=${accessToken}; Path=/; Secure; SameSite=None;`;
    }

    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}; Path=/; Secure; SameSite=None;`;
    }

    if (Array.isArray(exp)) {
      const expDate = new Date(exp[0], exp[1]-1, exp[2], exp[3], exp[4], exp[5]);
      if (!isNaN(expDate.getTime())) {
        loginState.setExp(expDate);
      }
    }

    loginState.updateLoginState({
      name,
      adminDepartment,
      code: formData.value.adminCode,
      exp,
    });

    alert(`${name}님, 환영합니다.`);
    await router.push('/main');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('로그인에 실패했습니다.');
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
  