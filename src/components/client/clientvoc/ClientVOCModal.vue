<template>
  <div class="clientvocmodal-overlay">
    <div class="clientvocmodal-content">
      <h2 class="clientvocmodal-title">문의하기</h2>
      <p class="clientvocmodal-intro">
        안녕하세요 <span class="clientvocmodal-highlight">런즈버디</span>입니다. 😊<br />
        오늘도 런즈버디를 이용해주셔서 감사합니다.<br />
        아래 카테고리 선택과 내용을 작성해 주시면 답변 도와드리겠습니다.
      </p>

      <div class="clientvocmodal-form">
        <label class="clientvocmodal-label">VOC 카테고리</label>
        <select v-model="selectedCategory" class="clientvocmodal-select">
          <option value="" disabled>카테고리 선택</option>
          <option>결제 및 환불</option>
          <option>강의 자료 요청</option>
          <option>강사 피드백</option>
          <option>기술적 문제</option>
          <option>기타 건의사항</option>
        </select>

        <label class="clientvocmodal-label">VOC 내용</label>
        <textarea
          v-model="inquiryContent"
          class="clientvocmodal-textarea"
          placeholder="문의사항을 상세히 입력해주세요. 정확한 답변이 가능합니다."
        ></textarea>
      </div>

      <p class="clientvocmodal-footer">
        제출함으로써 런즈버디 <span class="clientvocmodal-link">이용약관</span>, <span class="clientvocmodal-link">개인정보처리방침</span>에 동의합니다.
      </p>

      <div class="clientvocmodal-actions">
        <button @click="$emit('close')" class="clientvocmodal-close-button">취소</button>
        <button @click="handleSubmit" class="clientvocmodal-submit-button">제출</button>
      </div>
    </div>

    <div v-if="showNotification" class="clientvocmodal-notification">
      <p>제출되었습니다!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Emits 정의
const emit = defineEmits(["close", "submit"]);

const showNotification = ref(false);


const selectedCategory = ref("");
const inquiryContent = ref("");

const handleSubmit = () => {
  if (!selectedCategory.value || !inquiryContent.value) {
    alert("모든 필드를 작성해 주세요.");
    return;
  }


  showNotification.value = true;


  emit("submit", {
    category: selectedCategory.value,
    content: inquiryContent.value,
  });

  
  setTimeout(() => {
    showNotification.value = false;
    emit("close");
  }, 2000);
};
</script>
<style lang="scss" scoped>
.clientvocmodal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(41, 38, 98, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.clientvocmodal-content {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 30px;
  width: 500px;
  height: 530px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: left;
}

.clientvocmodal-title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20px;
}

.clientvocmodal-intro {
  font-weight: bold;
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.clientvocmodal-highlight {
  color: #7671f4;
  font-weight: bold;
}

.clientvocmodal-form {
  margin-bottom: 40px;
}

.clientvocmodal-label {
  margin-top: 10px;
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
  margin-top: 10px;
}

.clientvocmodal-select {
background-color: #F6F9FF;
box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
width: 100%;
padding: 10px;
border: 1px solid #ddd;
border-radius: 10px;
margin-bottom: 15px;
font-weight: bold;
font-size: 14px;
color: #b3b3b3; 
outline: none;
transition: color 0.2s ease, border-color 0.2s ease;
}


.clientvocmodal-select option:disabled {
color: #b3b3b3; 
font-weight: normal;
}


.clientvocmodal-select:focus {
color: #333333; 
font-weight: normal;
}


.clientvocmodal-select option:not(:disabled) {
color: #333333;
font-weight: normal;

}

.clientvocmodal-textarea {
box-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
width: 100%;
background-color: #F6F9FF;
height: 100px;
padding: 10px;
border: 1px solid #ddd;
border-radius: 10px;
font-weight: bold; 
font-size: 14px; 
font-family: 'Arial', sans-serif; 
color: #333; 
outline: none;


&::placeholder {
  color: #b3b3b3; 
  font-weight: normal; 
  font-family: 'Arial', sans-serif; 
}

}


.clientvocmodal-footer {
  font-size: 14px;
  font-weight: bold;
  color: #666666;
  text-align: center;
  margin-bottom: 20px;
}

.clientvocmodal-link {
  color: #7671f4;
  text-decoration: underline;
  cursor: pointer;
}

.clientvocmodal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.clientvocmodal-close-button {
  background: #ddd;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clientvocmodal-close-button:hover {
  background: #bbb;
}

.clientvocmodal-submit-button {
  background: #7671f4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.clientvocmodal-submit-button:hover {
  background: #5a54cc;
}

.clientvocmodal-notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #7671f4;
  color: white;
  padding: 15px 30px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}
</style>