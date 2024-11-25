<template>
    <div class="coupon-modal">
      <div class="modal-overlay" @click="closeModal"></div>
      <div class="modal-content">
        <header class="modal-header">
          <h2>쿠폰 선택</h2>
          <button class="modal-close" @click="closeModal">X</button>
        </header>
  
        <!-- 쿠폰 코드 등록 -->
        <div class="coupon-register">
          <input type="text" placeholder="쿠폰 코드 입력" v-model="couponCode" />
          <button class="register-button" @click="registerCoupon">등록</button>
        </div>
  
      
        <table class="coupon-table">
          <thead>
            <tr>
              <th>썸네일</th>
              <th>강의명</th>
              <th>할인율</th>
              <th>강사명</th>
              <th>선택</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(coupon, index) in coupons" :key="index">
              <td><img :src="coupon.thumbnail" alt="썸네일" class="thumbnail" /></td>
              <td style="width: 265px;">{{ coupon.title }}</td>
              <td>{{ coupon.discount }}%</td>
              <td style="width: 90px;">{{ coupon.instructor }}</td>
              <td>
                <button class="apply-button" @click="selectCoupon(coupon)">선택</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <!-- 확인 버튼 -->
        <div class="modal-footer">
          <button class="confirm-button" @click="confirmSelection">확인</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from "vue";
  import Android from "@/assets/icons/Android.svg";
  
  // 쿠폰 데이터
  const coupons = ref([
    {
      thumbnail: Android,
      title: "안드로이드 앱 제작 배우기",
      discount: 30, // 할인율 (퍼센트)
      instructor: "Cho 조제온",
    },
  ]);
  
  const couponCode = ref("");
  const selectedCoupon = ref(null); // 선택된 쿠폰
  const emit = defineEmits(["close", "apply"]);
  
  // 모달 닫기
  const closeModal = () => emit("close");
  
  // 쿠폰 등록
  const registerCoupon = () => {
    if (!couponCode.value.trim()) {
      alert("쿠폰 코드를 입력해주세요.");
      return;
    }
    alert(`쿠폰 코드 ${couponCode.value}가 등록되었습니다.`);
    couponCode.value = "";
  };
  
  // 쿠폰 선택
  const selectCoupon = (coupon) => {
    alert(" [안드로이드 앱 제작 배우기] 30% 선택되었습니다.");
    selectedCoupon.value = coupon;
  };
  
  // 확인 버튼 클릭 시
  const confirmSelection = () => {
    if (selectedCoupon.value) {
      emit("apply", selectedCoupon.value);
    } else {
      alert("쿠폰을 선택해주세요.");
    }
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
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
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

    &:focus {
        outline: none;
      }
  }
  
  .register-button {
    background-color: #7671f4;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .coupon-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .coupon-table th{
    border-radius: 20px;
    border: 1px solid #ddd;
    width: 50px;
    font-weight: bold;
    padding: 5px;
    text-align: center;
  
  }
  .coupon-table td{
    border: 1px solid #ddd;
    width: 20px;
    height: 10px;
    font-weight: bold;
    padding: 10px;
    text-align: center;
  }
  
  
  .coupon-table th {
    background-color: #f7f7f7;
    font-weight: bold;
    border-radius: 20px;
  }
  
  .thumbnail {
    width: 100px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .apply-button {
  background-color: #7671f4;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ddd;
}

.confirm-button {
  background-color: #7671f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 220px;
  width: 100%;

  font-size: 16px;
}
  </style>
  