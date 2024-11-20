<template>
    <div class="login-left">
      <h1>Login</h1>
      <!-- @submit.prevent를 사용하여 재로딩 방지 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <input type="text" placeholder="사번 ID" class="login-input" />
        <input type="password" placeholder="비밀번호" class="login-input" />
        <button type="submit" class="login-button">로그인</button>
        <!-- 비밀번호 재설정 버튼 -->
        <button type="button" class="login-pw" @click="$emit('show-login-pw')">비밀번호 재설정</button>
      </form>
    </div>
  </template>
  
  <script setup>
  const handleSubmit = () => {
    console.log('로그인 버튼 클릭됨');
    // 로그인 로직 추가 가능 (e.g., API 호출)
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
  