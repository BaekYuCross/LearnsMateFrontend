<template>
    <div class="payment-modal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">X</button>
        <div class="payment-success">
          <h1 class="success-message">
            <img src="@/assets/icons/bluecheck.svg" alt="결제 완료 아이콘" class="success-icon" />
            결제가 완료되었습니다.
          </h1>
          <p>이제 마이페이지에서 수강이 가능합니다.</p>
          <button class="confirm-button" @click="goToMyPage">확인</button>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { useRouter } from "vue-router";
import { defineEmits } from "vue";

const emit = defineEmits(["close"]);
const router = useRouter();

const close = () => {
  emit("close");
};

// 마이페이지로 이동
const goToMyPage = () => {
  router.push("/client-mylecture");
};
</script>
  
  <style scoped>
  .payment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    position: relative;
    z-index: 1001;
    background: #fff;
    width: 500px;
    padding: 40px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .modal-close {
  position: absolute; /* 위치를 고정 */
  top: 20px; /* 모달 상단에서의 거리 */
  right: 20px; /* 모달 오른쪽에서의 거리 */
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
}
  
  .payment-success {
    text-align: center;
  }
  
  .success-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px; /* 텍스트와 아이콘 간격 */
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0 10px;
    color: #333;
  }
  
  .success-icon {
    width: 20px;
    height: 20px;
  }
  
  .payment-success p {
    font-size: 15px;
    color: #898787;
    font-weight: bold;
    margin-bottom: 30px;
  }
  
  .confirm-button {
    display: inline-block;
    width: 100%;
    padding: 8px 20px;
    background-color: #7671f4;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .confirm-button:hover {
    background-color: #7671f4;
  }
  </style>
  