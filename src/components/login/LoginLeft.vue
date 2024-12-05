<template>
  <div class="login-left">
    <h1>Login</h1>
    <form class="login-form" @submit.prevent="loginUser">
      <input v-model="formData.adminCode" type="text" placeholder="사번 ID" class="login-input" />
      <input v-model="formData.adminPassword" type="password" placeholder="비밀번호" class="login-input" />
      <button type="submit" class="login-button">로그인</button>
      <button type="button" class="login-pw" @click="$emit('show-login-pw')">비밀번호 재설정</button>
    </form>
    <!-- 디버깅용: 남은 시간 표시 -->
    <p v-if="remainingTime !== '만료됨'">남은 시간: {{ remainingTime }}</p>
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

const remainingTime = ref('00:00:00');
const timer = ref(null);

const startTimer = (expirationDate) => {
  clearInterval(timer.value);

  timer.value = setInterval(() => {
    const remaining = calculateRemainingTime(expirationDate);
    remainingTime.value = remaining;

    if (remaining === '만료됨') {
      clearInterval(timer.value);
      alert('세션이 만료되었습니다. 다시 로그인하세요.');
      loginState.resetState();
      router.replace('/login');
    }
  }, 1000);
};

const calculateRemainingTime = (expirationDate) => {
  const now = new Date();
  const diff = expirationDate - now;

  if (diff <= 0) return '만료됨';

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const loginUser = async () => {
  try {
    const loginResponse = await axios.post('/users/login', {
      admin_code: formData.value.adminCode,
      admin_password: formData.value.adminPassword,
    });

    const { accessToken, refreshToken, exp } = loginResponse.data;

    if (accessToken) {
      document.cookie = `token=${accessToken}; Path=/; Secure; SameSite=None;`;
    }

    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}; Path=/; Secure; SameSite=None;`;
    }

    if (exp) {
      const expirationDate = new Date(exp);
      startTimer(expirationDate);
    }

    alert('로그인 성공!');
    await router.push('/main');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('로그인에 실패했습니다.');
  }
};

onMounted(async () => {
  try {
    await loginState.fetchLoginState();
    if (loginState.isLoggedIn) {
      await router.push('/');
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.warn('인증되지 않은 사용자입니다.');
      return;
    }
    console.error('로그인 상태 확인 중 에러:', error);
  }
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
  