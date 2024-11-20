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
import axios from 'axios';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { ref } from 'vue';
import { useLoginState } from '@/stores/loginState';

// 폼 데이터
const formData = ref({
  adminCode: '',
  adminPassword: ''
});

// 에러 메시지 관리
const errorMessage = ref('');
const loginState = useLoginState(); // 로그인 상태 관리 Store

// 로그인 함수
const loginUser = async () => {
  // 필수 입력 확인
  if (!formData.value.adminCode || !formData.value.adminPassword) {
    alert("사번과 비밀번호를 입력해주세요.");
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/users/login', {
      admin_code: formData.value.adminCode,
      admin_password: formData.value.adminPassword
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('HTTP 응답 상태 코드:', response.status);
    console.log('전체 응답 데이터:', response);

    // 응답 헤더에서 토큰 가져오기
    const token = response.headers.authorization;
    if (token) {
      // 토큰 저장
      localStorage.setItem('token', token);

      // JWT 디코딩
      const decodedToken = jwtDecode(token);
      console.log('Decoded JWT Token:', decodedToken);

      // 로그인 상태 업데이트
      loginState.isLoggedIn = true;
      loginState.adminName = decodedToken.name; // JWT에서 이름 추출하여 상태 설정

      // 성공 메시지
      alert(`${decodedToken.name}님, 환영합니다.`);

      // 메인 페이지로 이동
      router.push('/');
    } else {
      errorMessage.value = '인증 토큰이 없습니다. 로그인 실패';
      alert("아이디와 비밀번호를 확인해주세요.");
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    errorMessage.value = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    alert(errorMessage.value);
  }
};
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
  