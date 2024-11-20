<template>
    <div class="login-left">
      <!-- 강사/학생 전환 버튼 -->
      <div class="role-toggle">
        <button :class="{ active: role === 'instructor' }" @click="setRole('instructor')">강사</button>
        <button :class="{ active: role === 'student' }" @click="setRole('student')">학생</button>
      </div>
      <!-- Form 시작 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <!-- 아이디 입력 -->
        <div class="input-group">
          <label for="id">아이디 (이메일)</label>
          <div class="input-wrapper">
            <input id="id" type="email" placeholder="아이디 입력" v-model="userId" class="login-input" />
            <button type="button" class="auth-button" @click="sendAuthCode">인증</button>
          </div>
        </div>
        <!-- 비밀번호 입력 -->
        <div class="input-group">
          <label for="password">비밀번호</label>
          <input id="password" type="password" placeholder="비밀번호 입력" v-model="password" class="login-input" />
        </div>
        <!-- 이름 입력 -->
        <div class="input-group">
          <label for="name">이름</label>
          <input id="name" type="text" placeholder="이름 입력" v-model="name" class="login-input" />
        </div>
        <!-- 전화번호 입력 -->
        <div class="input-group">
          <label for="phone">전화번호</label>
          <input id="phone" type="tel" placeholder="전화번호 입력" v-model="phone" class="login-input" />
        </div>
        <!-- 닉네임 입력 -->
        <div class="input-group">
          <label for="nickname">닉네임</label>
          <input id="nickname" type="text" placeholder="닉네임 입력" v-model="nickname" class="login-input" />
        </div>
        <!-- 제출 버튼 -->
        <button type="submit" class="login-button">다음</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

// 이벤트 정의
const emit = defineEmits(['show-login-signup2']); // 이벤트 명시
  
  // 상태 관리
  const role = ref('instructor'); // 현재 선택된 역할
  const userId = ref('');
  const password = ref('');
  const name = ref('');
  const phone = ref('');
  const nickname = ref('');
  
  // 역할 설정
  const setRole = (selectedRole) => {
    role.value = selectedRole;
  };
  
  // 인증 버튼 처리
  const sendAuthCode = () => {
    console.log('인증 코드 전송');
  };
  
  // 제출 버튼 처리
const handleSubmit = () => {
  try {
    console.log('제출:', {
      role: role.value,
      userId: userId.value,
      password: password.value,
      name: name.value,
      phone: phone.value,
      nickname: nickname.value,
    });
    // 부모 컴포넌트로 next 이벤트 전달
    emit('show-login-signup2'); // 여기서 발생한 에러일 가능성이 있음
  } catch (error) {
    console.error('handleSubmit 에러:', error);
  }
};
  </script>
  
  
  
 <style scoped>
/* 전체 컨테이너 스타일 */
.login-left {
  border-top: 8px solid #7671f4;
  width: 50%;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 8px 0 0 0; /* 왼쪽 위만 둥글게 */
}

/* 역할 전환 버튼 */
.role-toggle {
  display: flex;
  justify-content: space-between;
  gap: 30px; /* 버튼 사이 간격 */
  margin-bottom: 20px;
  

  button {
    flex: 1;
    padding: 7px 10px;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid #7671f4;
    background-color: #fff;
    color: #7671f4;
    cursor: pointer;
    border-radius: 60px;
    box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
  }

  .active {
    background-color: #7671f4;
    color: #fff;
  }
}

/* 폼 스타일 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 입력 필드 스타일 */
.input-group {
  display: flex;
  flex-direction: column;

  label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.login-input {
  flex: 1;
  
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

/* 인증 버튼 */
.auth-button {
    padding: 10px;
          width: 70px;
          background-color: #FFF597;
          box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
          color: #7a7a7a;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: bold;

  &:hover {
    background-color: #fbff7a;
  }
}

/* 제출 버튼 */
.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #7671f4;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #5c57d6;
  }
}
</style>
