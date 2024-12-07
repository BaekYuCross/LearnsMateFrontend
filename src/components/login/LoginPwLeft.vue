<template>
  <div
    class="login-left"
    :style="{ paddingTop: isAuthVerified ? '6%' : '10%' }"
  >
    <h1>| 비밀번호 재설정</h1>
    <!-- @submit.prevent로 재로딩 방지 -->
    <form class="login-form" @submit.prevent="handleSubmit">
      <input id="adminCode"  v-model.trim="adminCode" type="adminCode" placeholder="사번 ID" class="login-input" />
      
      <div class="input-group">
        <label for="email" class="input-label">이메일</label>
        <div class="email-wrapper">
          <input
            id="email"
            v-model.trim="email"
            type="email"
            placeholder="E-mail 입력"
            class="login-input email-input"
          />
          <!-- 인증 버튼 -->
          <button type="button" class="auth-button" @click="sendAuthCode">인증</button>
        </div>
      </div>

      <div class="input-group">
        <label for="auth-code" class="input-label">인증번호</label>
        <input
          id="auth-code"
          v-model="authCodeInput"
          type="text"
          placeholder="인증번호 입력"
          class="login-input"
        />
      </div>

      <!-- 새 비밀번호 입력창 (인증 성공 시 표시) -->
      <div class="input-group" v-if="isAuthVerified">
        <label for="new-password" class="input-label">새 비밀번호</label>
        <input
          id="new-password"
          v-model="newPassword"
          type="password"
          placeholder="새 비밀번호 입력"
          class="login-input"
        />
      </div>

      <!-- 다음 버튼 (인증 성공 시 완료 버튼으로 변경) -->
      <button type="submit" class="login-button">
        {{ isAuthVerified ? '완료' : '다음' }}
      </button>
      <!-- 메시지 출력 -->
      <p v-if="message" :class="messageClass">{{ message }}</p>
      <!-- 로그인하기 버튼 -->
      <button type="button" class="login-pw" @click="$emit('show-login')">로그인하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 상태 관리
const email = ref(''); // 이메일 입력값
const authCodeInput = ref(''); // 사용자 입력 인증번호
const authCode = ref(''); // 서버로부터 받은 인증번호
const message = ref(''); // 사용자에게 표시할 메시지
const messageClass = ref(''); // 메시지 스타일 클래스
const isAuthVerified = ref(false); // 인증 여부
const newPassword = ref(''); // 새 비밀번호 입력값
const adminCode = ref(''); // 사번 ID

// 이메일 인증번호 발송
const sendAuthCode = async () => {
  if (!validateEmail(email.value)) {
    message.value = '이메일 형식이 올바르지 않습니다.';
    messageClass.value = 'error';
    return;
  }

  if (!adminCode.value) {
    message.value = '사번 ID를 입력해주세요.';
    messageClass.value = 'error';
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/admin/verification-email/password', {
      email: email.value,
      adminCode: adminCode.value, 
    });
    authCode.value = response.data.verificationCode; // 서버에서 인증번호 받아오기
    message.value = '인증번호가 이메일로 발송되었습니다.';
    messageClass.value = 'success';
    console.log('Generated Auth Code:', authCode.value);
  } catch (error) {
    message.value = error.response?.data?.message || '이메일 인증 실패.';
    messageClass.value = 'error';
  }
};

// 폼 제출 처리
const handleSubmit = async () => {
  if (!isAuthVerified.value) {
    // 인증번호 검증 단계
    try {
      await axios.post('http://localhost:5000/admin/verification-email/confirmation', {
        email: email.value,
        code: authCodeInput.value,
        adminCode: adminCode.value,
      });
      isAuthVerified.value = true; // 인증 성공
      message.value = '인증이 완료되었습니다. 새 비밀번호를 입력해주세요.';
      messageClass.value = 'success';
    } catch (error) {
      message.value = error.response?.data?.message || '인증번호가 틀렸습니다.';
      messageClass.value = 'error';
    }
  } else {
    // 비밀번호 변경 완료 단계
    if (newPassword.value.length < 6) {
      message.value = '비밀번호는 최소 6자리 이상이어야 합니다.';
      messageClass.value = 'error';
      return;
    }

    try {
      console.log("Email Before Submit:", email.value);
      console.log("New Password Before Submit:", newPassword.value);
      await axios.post('http://localhost:5000/admin/password', {
        adminEmail: email.value,
        adminPassword: newPassword.value,
      });
      message.value = '비밀번호가 성공적으로 변경되었습니다.';
      messageClass.value = 'success';
      resetForm(); // 폼 초기화
    } catch (error) {
      message.value = error.response?.data?.message || '비밀번호 변경 실패.';
      messageClass.value = 'error';
    }
  }
};

// 이메일 형식 검증
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 폼 초기화
const resetForm = () => {
  email.value = '';
  authCodeInput.value = '';
  authCode.value = '';
  newPassword.value = '';
  adminCode.value = '';
  isAuthVerified.value = false;
};
</script>


<style scoped>

.message {

  margin-top: 20px;
  font-size: 14px;
  
}

.success {
    text-align: center;
  color: #28a745;
}

.error {
    text-align: center;
  color: #dc3545;
}

.login-left {
  border-top: 8px solid #145f58;
  width: 50%;
  padding: 40px 60px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;

  h1 {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bolder;
    color: #145f58;
  }

  .input-label {
        font-size: 14px;
        color: #3e3e3e;
        font-weight: bold;
      }



  .login-form {
    display: flex;
    flex-direction: column;
    gap: 23px;

    .input-group {
      display: flex;
      flex-direction: column; /* 라벨과 입력 필드를 세로로 정렬 */
      gap: 8px; /* 라벨과 입력 필드 간의 간격 */

      .email-wrapper {
        display: flex;
        gap: 10px;

        .email-input {
          flex: 1;
        }

        .auth-button {
          padding: 10px;
          width: 70px;
          background-color: #145f58;
          box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;

          &:hover {
            background-color: #124c47;
          }
        }
      }
    }

    .login-input {
      width: 100%;
      padding: 10px;
      font-size: 14px;
      background-color: rgba(232, 240, 254, 0.4);
      border: 1.3px solid #e1dfdf;
      border-radius: 11px;
      box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);

      &:focus {
        outline: none;
      }
    }

    .login-input::placeholder {
      color: rgba(114, 114, 114, 0.7);
    }

    .login-button {
        width: 100%;
        margin-top: 10px;
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
}
</style>

  
  