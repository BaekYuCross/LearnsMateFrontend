<template>
  <div class="payment-modal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <header class="modal-header">
        <h2>결제 방법</h2>
        <button class="modal-close" @click="closeModal">X</button>
      </header>
      <div class="payment-options">
  <label class="radio-option">
    <input type="radio" name="paymentMethod" value="learnsPay" v-model="selectedPayment" />
    LearnsPay | 런즈 페이
  </label>
  <div class="learns-pay-card" v-if="selectedPayment === 'learnsPay'">
    <div class="card-placeholder">
      <img src="@/assets/icons/plus.svg" alt="plus 이미지" class="plus-icon" />
      <p class="placeholder-text">런즈페이에 추가하고 간편하게 결제하세요!</p>
      <button class="register-card-button">결제수단 등록하기</button>
    </div>
  </div>

  <label class="radio-option">
  <input type="radio" name="paymentMethod" value="generalPay" v-model="selectedPayment" />
  일반결제
</label>

<div class="general-payment" v-if="selectedPayment === 'generalPay'">
  <div class="payment-methods">
  <div class="payment-button quick">
    <span class="badge">즉시 할인</span>
    퀵페이
  </div>
  <div class="payment-button toss">
    <img src="@/assets/icons/toss.svg" alt="toss 이미지" />
  </div>
  <div class="payment-button naver">
    <span class="badge">적립 혜택</span>
    <img src="@/assets/icons/naver.svg" alt="naver 이미지" />
  </div>
    <button class="payment-button kakao"><img src="@/assets/icons/kaka.svg" alt="kakao 이미지" /></button>
    <button class="payment-button account">가상계좌</button>
    <button class="payment-button edu">평생교육바우처</button>
  </div>
  <div class="payment-info">
    <p>퀵페이: 결제 시 0.5% 할인</p>
    <p>삼성 앱카드: 5만원 이상 결제 시 1,000원 할인</p>
    <p>네이버페이: 머니 결제 시 네이버포인트 0.3% 적립</p>
    <p>평생교육바우처: 이용안내</p>
    <p>신용카드 무이자 할부 안내 ></p>
  </div>
</div>
</div>

<div class="agreement-section">
  <input type="checkbox" id="agree-terms" v-model="isAgreed" />
  <label for="agree-terms">[필수] 결제 서비스 이용 약관, 개인정보 처리 동의 ></label>
</div>

      <!-- Confirm Button -->
      <div class="modal-footer">
        <button class="confirm-button" :disabled="!isAgreed" @click="confirmPayment">결제하기</button>
      </div>
    </div>
      <!-- 결제 완료 모달 -->
      <PaySuccessModal
        v-if="isPaySuccessModalVisible"
        @close="closePaySuccessModal"
      />
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { useRouter } from "vue-router";
import PaySuccessModal from "@/components/client/clientpaylecture/ClientPayFinishModal.vue";

// 상태 관리
const selectedPayment = ref("learnsPay");
const isAgreed = ref(false);
const isPaySuccessModalVisible = ref(false);
const router = useRouter();

const emit = defineEmits(["close", "confirm"]);

// 결제 확인 버튼
const confirmPayment = () => {
  emit("confirm");
};

// 결제 완료 모달 띄우기
const proceedToPaymentSuccess = () => {
  if (isAgreed.value) {
    // 약관 동의 시 결제 완료 모달 표시
    isPaySuccessModalVisible.value = true;
  } else {
    alert("약관에 동의해주세요."); // 약관 미동의 시 경고
  }
};

// 모달 닫기 및 마이페이지 이동
const closePaySuccessModal = () => {
  isPaySuccessModalVisible.value = false;
  router.push("/client-mylecture"); // 마이페이지로 이동
};

// 모달 닫기 및 마이페이지 이동
const closeModal = () => {
  emit("close");
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
  z-index: 1001;
  background: #fff;
  width: 600px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  flex-direction: column;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: bold;
}

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.payment-options {
  margin: 20px 0;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Arial', sans-serif;
}

.radio-option {
 
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #6a6a6a;
  font-weight: bold;
  margin-bottom: 10px;
}

.radio-option input[type="radio"] {
  margin-right: 10px;
}

.learns-pay-card {
  margin-left: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 350px;
}

.card-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.plus-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
}

.placeholder-text {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.register-card-button {
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  background-color: #e0e0e0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.register-card-button:hover {
  background-color: #ccc;
}
.radio-option {

  font-size: 17px;
  font-weight: bold;
  color: #656363;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.radio-option input[type="radio"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.general-payment {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.payment-methods {
  padding-top: -28px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: left;
}

.payment-button {
  position: relative;
  width: 110px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  overflow: visible;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
}

.payment-button.quick {
  border: 2px solid #7671f4;
}

.payment-button:hover {
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.payment-button img {
  max-width: 70px;
  max-height: 70px;
}


.badge {
  position: absolute;
  top: -12px; /* 버튼 위로 배치 */
  left: 10px; /* 버튼 내부에서 적절한 위치로 설정 */
  font-size: 12px;
  font-weight: bold;
  background-color: #7671f4; /* 배지 배경색 */
  color: #ffffff; /* 배지 텍스트 색상 */
  padding: 4px 8px;
  border-radius: 12px; /* 둥근 모서리 */
  z-index: 10; /* 버튼보다 높은 우선순위로 설정 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* 배지에 그림자 추가 */
}

.payment-button.quick .badge {
  background-color: #7671f4;
}

.payment-button.naver .badge {
  background-color: #5cb85c;
}

.payment-button.toss {
  display: flex;
  justify-content: center;
  align-items: center;
}
.payment-info {
  font-size: 13px;
  color: #9d9d9d;
  line-height: 1.6;
}

.payment-info p {
 line-height: 1.3;
}

.agreement-section {
  display: flex;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.agreement-section input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.agreement-section label {
  cursor: pointer;
  font-size: 14px;
  color: #767676;
}

button.confirm-button {
  width: 100%;
  padding: 15px 0;
  background-color: #7671f4;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.confirm-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
  border: none;
}

button.confirm-button:hover:not(:disabled) {
  background-color: #7671f4;
  border: none;
}
</style>
