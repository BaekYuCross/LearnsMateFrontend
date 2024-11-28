<template>
    <div class="coupon-modal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <header class="modal-header">
          <h2>쿠폰 선택</h2>
          <button class="modal-close" @click="closeModal">X</button>
        </header>
  
        <div class="coupon-register">
          <input type="text" placeholder="쿠폰 코드 입력" v-model="couponCode" />
          <button class="register-button" @click="registerCoupon">등록</button>
        </div>
  
        <div class="no-coupon">
          <img src="@/assets/icons/whatwg.svg" alt="물음표 아이콘" class="no-coupon-icon" />
          <p class="no-coupon-text">사용가능한 쿠폰이 없어요..</p>
          <p class="no-coupon-subtext">
            쿠폰을 새로 등록하거나<br />
            쿠폰 적용이 가능한 강의를 선택했는지 확인해주세요!
          </p>
        </div>
  
        <!-- 확인 버튼 -->
        <div class="modal-footer">
          <button class="confirm-button" @click="confirmSelection">확인</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from "vue";
  
  const couponCode = ref("");
  const emit = defineEmits(["close", "apply"]);
  
  const closeModal = () => emit("close");
  const registerCoupon = () => {
    if (couponCode.value.trim() === "") {
      alert("쿠폰 코드를 입력해주세요.");
      return;
    }
    alert(`쿠폰 코드 ${couponCode.value}가 등록되었습니다.`);
    couponCode.value = "";
  };
  
  const confirmSelection = () => {
    alert("선택이 완료되었습니다.");
    closeModal();
  };
  </script>
  
  <style scoped>
  .coupon-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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
    width: 800px;
    height:  600px;
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
  
  .coupon-register {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;
  }
  
  .coupon-register input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-right: 10px;
  }
  
  .register-button {
    background-color: #7671f4;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .no-coupon {
    padding-top: 20px;
    text-align: center;
    margin: 50px 0;
  }
  
  .no-coupon-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
  
  .no-coupon-text {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .no-coupon-subtext {
    font-size: 14px;
    font-weight: bold;
    color: #c5c5c5;
    line-height: 1.5;
  }
  
  .modal-footer {
    text-align: center;
    margin-top: 20px;
  }
  
  .confirm-button {
    width: 100%;
    padding: 12px;
    background-color: #7671f4;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    margin-top: 120px;
    font-weight: bold;
    cursor: pointer;
  }
  </style>
  