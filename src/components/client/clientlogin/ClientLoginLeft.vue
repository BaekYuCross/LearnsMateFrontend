<template>
  <div class="clientlogin-login-left">
    <h1>Login</h1>
    <!-- @submit.prevent 사용 -->
    <form class="clientlogin-login-form" @submit.prevent="handleLogin">
      <input
        type="text"
        placeholder="아이디"
        class="clientlogin-login-input"
        v-model="userId"
      />
      <input
        type="password"
        placeholder="비밀번호"
        class="clientlogin-login-input"
        v-model="password"
      />
      <button
        type="submit"
        class="clientlogin-login-button"
      >
        로그인
      </button>
      <div class="clientlogin-social-login">
        <button
          type="button"
          class="clientlogin-kakao-login"
          @click="handleKakaoLogin"
        >
          <img src="@/assets/icons/kakao.svg" alt="카카오" />
          카카오 로그인
        </button>
        <button
          type="button"
          class="clientlogin-google-login"
          @click="handleGoogleLogin"
        >
          <img src="@/assets/icons/Google.svg" alt="구글" />
          구글 로그인
        </button>
      </div>
      <div class="clientlogin-login-links">
        <a href="#" class="clientlogin-link">아이디 찾기</a>
        <span>|</span>
        <a href="#" class="clientlogin-link">비밀번호 찾기</a>
        <span>|</span>
        <a
          href="#"
          class="clientlogin-link"
          @click="$emit('show-login-signup')"
        >
          회원가입
        </a>
      </div>
    </form>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const userId = ref(""); // 사용자 아이디 입력값
const password = ref(""); // 사용자 비밀번호 입력값

// 로그인 버튼 처리
const handleLogin = async () => {
  try {
    if (!userId.value || !password.value) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const response = await axios.post('https://learnsmate.shop/client/enter', {
      member_email: userId.value,
      member_password: password.value
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Login response:', response);

    if (response.data) {
      const loginData = {
        ...response.data,
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('clientInfo', JSON.stringify(loginData));
      localStorage.setItem('isAuthenticated', 'true');
      
      router.push("/client-main");
    } else {
      alert('로그인 응답 데이터가 올바르지 않습니다.');
      return;
    }
  } catch (error) {
    console.error('로그인 실패 상세 정보:', error);
    if (error.response) {
      alert(`블랙리스트로 등록된 계정입니다.`);
      return;
    } else if (error.request) {
      console.log('요청 에러:', error.request);
      alert('서버에 연결할 수 없습니다.');
      return;
    } else {
      alert('로그인 처리 중 오류가 발생했습니다.');
      return;
    }
  }
};

const handleKakaoLogin = () => {
  console.log("kakao login");
};

const handleGoogleLogin = () => {
  console.log("google login");
};
</script>

<style scoped>
.clientlogin-login-left {
  border-top: 8px solid #7671f4;
  width: 50%;
  padding: 60px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    font-weight: bold;
    margin-bottom: 50px;
    font-size: 30px;
    color: #7671f4;
  }

  .clientlogin-login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .clientlogin-login-input {
      width: 350px;
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

    .clientlogin-login-input::placeholder {
      color: rgba(114, 114, 114, 0.5);
      font-size: 15px;
    }

    .clientlogin-login-button {
      width: 100%;
      margin-top: 30px;
      padding: 10px;
      background-color: #7671f4;
      color: #fff;
      font-size: 17px;
      border: none;
      border-radius: 60px;
      cursor: pointer;
      box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: #5c57d6;
      }
    }

    .clientlogin-social-login {
      display: flex;
      flex-direction: column;
      gap: 15px;

      .clientlogin-kakao-login,
      .clientlogin-google-login {
        display: flex;
        align-items: center;
        gap: 90px;
        width: 100%;
        padding: 10px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 60px;
        border: none;
        cursor: pointer;
        box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
        justify-content: flex-start; /* 왼쪽 정렬 */
      }

      .clientlogin-kakao-login {
        background-color: #fee500;
        color: #000;
        &:hover {
          background-color: #f0d801;
        }
      }

      .clientlogin-google-login {
        background-color: white;
        color: #000;
        &:hover {
          background-color: #f1f1f1;
        }
      }

      img {
        width: 20px;
        margin-left: 10px;
        height: 20px;
        object-fit: contain;
      }
    }

    .clientlogin-login-links {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;

      .clientlogin-link {
        color: #a8a8a8;
        text-decoration: none;
        font-size: 14px;

        &:hover {
          text-decoration: underline;
        }
      }

      span {
        color: #ccc;
      }
    }
  }
}
</style>
