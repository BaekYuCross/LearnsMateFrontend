<template>
  <div class="login-left">
    <h1>Login</h1>
    <!-- @submit.prevent를 사용하여 재로딩 방지 -->
    <form class="login-form" @submit.prevent="loginUser">
      <input v-model="formData.adminCode" type="text" placeholder="사번 ID" class="login-input" />
      <input v-model="formData.adminPassword" type="password" placeholder="비밀번호" class="login-input" />
      <button type="submit" class="login-button">로그인</button>
      <!-- 비밀번호 재설정 버튼 -->
      <button type="button" class="login-pw" @click="$emit('show-login-pw')">비밀번호 재설정</button>
    </form>
  </div>
</template>
<script setup>
import { useLoginState } from '@/stores/loginState';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const loginState = useLoginState(); // Pinia 상태
const router = useRouter(); // Vue Router 사용

const formData = ref({
  adminCode: '',
  adminPassword: '',
});

const loginUser = async () => {
  if (!formData.value.adminCode || !formData.value.adminPassword) {
    alert('사번과 비밀번호를 입력해주세요.');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/users/login',
      {
        admin_code: formData.value.adminCode,
        admin_password: formData.value.adminPassword,
      },
      {
        withCredentials: true, // 쿠키 포함
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('로그인 성공:', response);

    // 로그인 상태 확인 (쿠키 기반)
    await loginState.fetchLoginState();

    alert(`${loginState.adminName}님, 환영합니다.`);
    router.push('/'); 
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('로그인에 실패했습니다. 사번 또는 비밀번호를 확인해주세요.');
  }
};

// 앱 로드 시 로그인 상태 확인
onMounted(async () => {
  await loginState.fetchLoginState(); // 쿠키 기반 인증 정보 확인
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
  