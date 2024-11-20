<template>
    <div class="login-container">
      <div class="login-box">
        <!-- Left 컴포넌트 -->
        <component :is="currentComponent" @show-login-pw="showLoginPw" @show-login="showLogin" />        
        <!-- Right 부분 그대로 유지 -->
        <div class="login-right">
          <img src="@/assets/icons/blue-greenlogo.svg" alt="Logo" class="logo" />
          <h2>CRM 솔루션 런즈메이트</h2>
          <p>국내 온라인 개발 교육 환경에 최적화된 고객관리 시스템</p>
          <div class="beta-info">
            <div class="beta-box">
              <p>
                런즈메이트 2024년 12월 12일(목)
                <br /><span>베타버전 출시예정</span>
              </p>
            </div>
          </div>
          <footer>
            <img src="@/assets/icons/footlogo.svg" alt="Logo" class="login-footer" />
          </footer>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { shallowRef } from 'vue';
  import LoginLeft from '@/components/login/LoginLeft.vue';
  import LoginPwLeft from '@/components/login/LoginPwLeft.vue';
  
 // 현재 보여줄 컴포넌트를 관리하는 상태
const currentComponent = shallowRef(LoginLeft);

// 컴포넌트를 전환하는 함수
const showLoginPw = () => {
  currentComponent.value = LoginPwLeft;
};

const showLogin = () => {
  currentComponent.value = LoginLeft;
};
  </script>
  
  <style scoped>
  .logo {
    width: 290px;
    height: auto;
  }
  
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f6f8;
  
    .login-box {
      display: flex;
      width: 1000px;
      height: 600px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
      background-color: #fff;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
    }
  
    .login-right {
      width: 50%;
      padding: 20px;
      background-color: #145f58;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
  
      h2 {
        font-size: 30px;
        margin-bottom: 15px;
        font-weight: 500;
      }
  
      p {
        font-size: 17px;
        width: 450px;
      }
  
      .beta-info {
        margin-top: 20px;
  
        .beta-box {
          margin-top: 50px;
          width: 300px;
          border: 1px solid #fff;
          border-radius: 12px;
          padding: 10px;
          text-align: center;
  
          p {
            font-size: 17px;
            width: 280px;
          }
  
          span {
            font-size: 16px;    
          }
        }
      }
  
      .login-footer {
        position: absolute; /* 박스 내부에서 절대 위치 */
      bottom: 20px; /* 아래쪽 여백 */
      left: 50%; /* 수평 중앙 정렬 */
      margin-left: 250px;
      transform: translateX(-50%); /* 중앙 정렬을 위한 변환 */
      width: 170px;
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  </style>
  