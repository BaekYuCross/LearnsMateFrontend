<template>
  <div class="clientsignup2-login-left">
      <!-- Form 시작 -->
      <form class="clientsignup2-login-form" @submit.prevent="handleSubmit">
          <!-- 주소 입력 -->
          <div class="clientsignup2-input-group">
              <label for="zipcode">주소 (우편번호)</label>
              <div class="clientsignup2-input-wrapper">
                  <input
                      id="zipcode"
                      type="text"
                      placeholder="우편번호 입력"
                      v-model="zipcode"
                      class="clientsignup2-login-input"
                  />
                  <button type="button" class="clientsignup2-auth-button">검색</button>
              </div>
          </div>
          <div class="clientsignup2-input-group">
              <label for="address">주소 (상세주소)</label>
              <input
                  id="address"
                  type="text"
                  placeholder="상세주소 입력"
                  v-model="address"
                  class="clientsignup2-login-input"
              />
          </div>
          <!-- 성별, 나이 입력 -->
          <div class="clientsignup2-input-group-row">
              <div class="clientsignup2-input-group">
                  <label for="gender">성별</label>
                  <select id="gender" v-model="gender" class="clientsignup2-login-select">
                      <option value="" disabled>성별 선택</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                  </select>
              </div>
              <div class="clientsignup2-input-group">
                  <label for="age">나이</label>
                  <input
                      id="age"
                      type="number"
                      placeholder="나이 입력"
                      v-model="age"
                      class="clientsignup2-login-input"
                  />
              </div>
          </div>
          <!-- 생년월일 -->
          <div class="clientsignup2-input-group">
              <label for="birthdate">생년월일</label>
              <input
                  id="birthdate"
                  type="date"
                  v-model="birthdate"
                  class="clientsignup2-login-input"
              />
          </div>
          <!-- 선호 주제 -->
          <div class="clientsignup2-input-group">
              <label for="topic">선호 주제</label>
              <select id="topic" v-model="topic" class="clientsignup2-login-select2">
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
          <button type="submit" class="clientsignup2-login-button">가입</button>
      </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['show-login']);

const zipcode = ref('');
const address = ref('');
const gender = ref('');
const age = ref('');
const birthdate = ref('');
const topic = ref('');

const handleSubmit = () => {
  console.log('success :', {
      zipcode: zipcode.value,
      address: address.value,
      gender: gender.value,
      age: age.value,
      birthdate: birthdate.value,
      topic: topic.value,
  });

  alert('성공적으로 회원가입 되었습니다.');
  emit('show-login');
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.clientsignup2-login-left {
  border-top: 8px solid #7671f4;
  width: 50%;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 8px 0 0 0;
}

/* 폼 스타일 */
.clientsignup2-login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 입력 필드 스타일 */
.clientsignup2-input-group {
  display: flex;
  flex-direction: column;
 
  label {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
  }

  .clientsignup2-input-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
  }
}

.clientsignup2-input-group-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.clientsignup2-login-input {
  color: #989696;
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

.clientsignup2-login-select {
  color: #989696;
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

.clientsignup2-login-select2 {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  color: #989696;
  background-color: rgba(232, 240, 254, 0.4);
  border: 1.3px solid #e1dfdf;
  border-radius: 11px;
  box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);

  &:focus {
      outline: none;
  }
}
.clientsignup2-login-select2 option {
  color: #333333; /* 옵션 텍스트 색상 */
  background-color: rgba(232, 240, 254, 0.4);
  font-size: 14px; /* 옵션 글씨 크기 */
}

.clientsignup2-auth-button {
  
  padding: 10px;
  width: 70px;
  background-color: #FFF597;
  box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
  color: #757575;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;

  &:hover {
      background-color: #fbff7a;
  }
}

.clientsignup2-login-button {
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
