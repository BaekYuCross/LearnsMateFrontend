<template>
    <div class="login-left">
      <h1>| 비밀번호 재설정</h1>
      <form class="login-form" @submit.prevent="handleSubmit">
        <input id="id" type="text" placeholder="사번 ID" class="login-input" />
        <div class="input-group">
          <label for="email" class="input-label">이메일</label>
          <div class="email-wrapper">
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="E-mail 입력"
              class="login-input email-input"
            />
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
  
        <button type="submit" class="login-button">다음</button>
        <p v-if="message" :class="messageClass">{{ message }}</p>
        <button type="button" class="login-pw" @click="$emit('show-login')">로그인하기</button>
      </form>
    </div>
  </template>
  

  <script setup>
  import { ref } from 'vue';
  
  // 상태 관리
  const email = ref(''); // 이메일 입력값
  const authCodeInput = ref(''); // 사용자 입력 인증번호
  const authCode = ref(''); // 서버로부터 받은 인증번호
  const message = ref(''); // 사용자에게 표시할 메시지
  const messageClass = ref(''); // 메시지 스타일 클래스
  
  // 이메일 인증번호 발송
  const sendAuthCode = () => {
    if (!validateEmail(email.value)) {
      message.value = '이메일 형식이 올바르지 않습니다.';
      messageClass.value = 'error';
      return;
    }
    // 서버로 인증번호 요청 (예시로 랜덤 코드 생성)
    authCode.value = generateAuthCode(); // 인증번호 생성
    message.value = '인증번호가 이메일로 발송되었습니다.';
    messageClass.value = 'success';
    console.log('Generated Auth Code:', authCode.value); // 디버그용
  };
  
  // 폼 제출 처리
  const handleSubmit = () => {
    if (authCodeInput.value === authCode.value) {
      message.value = '비밀번호가 성공적으로 변경되었습니다.';
      messageClass.value = 'success';
      resetForm();
    } else {
      message.value = '인증번호가 틀렸습니다.';
      messageClass.value = 'error';
    }
  };
  
  // 이메일 형식 검증
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // 인증번호 생성 (랜덤 6자리 숫자)
  const generateAuthCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // 폼 초기화
  const resetForm = () => {
    email.value = '';
    authCodeInput.value = '';
    authCode.value = '';
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
  padding-top: 10%;
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

  
  