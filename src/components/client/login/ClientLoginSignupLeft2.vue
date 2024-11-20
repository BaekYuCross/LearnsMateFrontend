<template>
    <div class="login-left">
      <!-- Form 시작 -->
      <form class="login-form" @submit.prevent="handleSubmit">
        <!-- 주소 입력 -->
        <div class="input-group">
          <label for="zipcode">주소 (우편번호)</label>
          <div class="input-wrapper">
            <input
              id="zipcode"
              type="text"
              placeholder="우편번호 입력"
              v-model="zipcode"
              class="login-input"
            />
            <button type="button" class="auth-button">검색</button>
          </div>
        </div>
        <div class="input-group">
          <label for="address">주소 (상세주소)</label>
          <input
            id="address"
            type="text"
            placeholder="상세주소 입력"
            v-model="address"
            class="login-input"
          />
        </div>
        <!-- 성별, 나이 입력 -->
        <div class="input-group-row">
          <div class="input-group">
            <label for="gender">성별</label>
            <select id="gender" v-model="gender" class="login-select">
              <option value="" disabled>성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div class="input-group">
            <label for="age">나이</label>
            <input
              id="age"
              type="number"
              placeholder="나이 입력"
              v-model="age"
              class="login-input"
            />
          </div>
        </div>
        <!-- 생년월일 -->
        <div class="input-group">
          <label for="birthdate">생년월일</label>
          <input
            id="birthdate"
            type="date"
            v-model="birthdate"
            class="login-input"
          />
        </div>
        <!-- 선호 주제 -->
        <div class="input-group">
          <label for="topic">선호 주제</label>
          <select id="topic" v-model="topic" class="login-select2">
            <option value="" disabled>선호하는 주제를 선택해주세요.</option>
            <option value="backend">백엔드</option>
            <option value="frontend">프론트엔드</option>
            <option value="devops">데브옵스/인프라</option>
            <option value="mobile">데이터베이스</option>
            <option value="mobile">웹개발</option>
            <option value="mobile">모바일 앱개발</option>
            <option value="mobile">풀스택</option>
          </select>
        </div>
        <!-- 가입 버튼 -->
        <button type="submit" class="login-button">가입</button>
      </form>
    </div>
  </template>
  
  
  <script setup>
import { ref } from 'vue';
const emit = defineEmits(['show-login']); // 이벤트 선언

// 상태 관리
const zipcode = ref('');
const address = ref('');
const gender = ref('');
const age = ref('');
const birthdate = ref('');
const topic = ref('');


const handleSubmit = () => {
  console.log('회원가입 성공:', {
    zipcode: zipcode.value,
    address: address.value,
    gender: gender.value,
    age: age.value,
    birthdate: birthdate.value,
    topic: topic.value,
  });

  // 성공 메시지 표시
  alert('성공적으로 회원가입 되었습니다.');
  emit('show-login'); // 이벤트 발생

};

</script>

  
<style scoped>
/* 전체 컨테이너 스타일 */
.login-left {
    border-top: 8px solid #7671f4;
  width: 50%;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 8px;
  border-radius: 8px 0 0 0; /* 왼쪽 위만 둥글게 */
}

/* 역할 전환 버튼 */
.role-toggle {
  display: flex;
  justify-content: space-between;
  gap: 40px; /* 버튼 사이 간격 */
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
  gap: 25px;
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

.input-group-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.login-input {
    flex: 1;
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

.login-select {
    flex: 1;
    width: 190px;
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
.login-select2 {
    flex: 1;
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

.login-button {
    margin-top: 13px;
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
