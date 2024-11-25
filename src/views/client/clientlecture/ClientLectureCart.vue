<template>
    <div class="clientvoc-app-container">
      <ClientHeader />
      <InactivityModal
        v-if="showActivityModal"
        @continue="closeActivityModal"
        @logout="activityLogout"
      />
      <div class="clientlecturecart-container">
        <h1 class="clientlecturecart-title">수강바구니</h1>
        <div class="clientlecturecart-actions">
          <div class="clientlecturecart-checkbox">
            <input type="checkbox" id="select-all" checked />
            <label for="select-all">전체선택 1/1</label>
            <button class="clientlecturecart-select-button">선택삭제</button>
          </div>
         
        </div>
        <div class="clientlecturecart-content">
          <!-- 강의 목록 -->
          <div class="clientlecturecart-lecture-list">
            <div class="clientlecturecart-lecture-item">
              <div class="clientlecturecart-lecture-thumbnail">
                <img src="@/assets/icons/Android.svg" alt="강의 이미지" />
              </div>
              <div class="clientlecturecart-lecture-info">
                <p class="clientlecturecart-lecture-title">
                  안드로이드 앱 제작 배우기
                </p>
                <p class="clientlecturecart-lecture-author">
                  Cho 조제온 <span class="clientlecturecart-lecture-duration">| 무제한 수강</span>
                </p>
                <p class="clientlecturecart-lecture-price">45,000원</p>
              </div>
              <input type="checkbox" checked />
            </div>
            <div class="line"></div>
          </div>
  
          <!-- 구매 정보 -->
          <div class="clientlecturecart-purchase-info">
            <div class="clientlecturecart-info-section">
              <h2 class="clientlecturecart-info-title">
                구매자정보
                <button class="clientlecturecart-edit-button">수정</button>
              </h2>
              <div class="line"></div>
              <div class="clientlecturecart-info-content">
                <p><strong>이름 </strong> &nbsp;&nbsp;&nbsp;&nbsp;조제온</p>
                <p><strong>이메일 </strong> &nbsp;&nbsp;&nbsp;&nbsp;beyond9@best.com</p>
                <p><strong>휴대폰 번호 </strong> &nbsp;&nbsp;&nbsp;&nbsp;+82 01022599759</p>
              </div>
            </div>
  
            <div class="clientlecturecart-coupon-actions">
            <div class="clientlecturecart-coupon-section">
              <p><strong>쿠폰</strong></p>
              <input type="text" :value="discountAmount > 0 ? discountAmount + '원' : '0원'" readonly />
              <button @click="openModal">쿠폰선택</button>
            </div>
          </div>
          <div class="clientlecturecart-payment-summary">
            <div class="clientlecturecart-payment-item">
              <p><strong>포인트</strong></p>
              <p>보유 100 </p>
            </div>
            <input type="text" value="1,000포인트 이상 사용" readonly />
            <button class="clientlecturecart-point-button">전액사용</button>
            <div class="clientlecturecart-payment-item" style="padding-top: 20px;">
              <p><strong>선택상품금액:</strong></p>
              <p>{{ formattedOriginalPrice }}원</p>
            </div>
            <div class="clientlecturecart-payment-item">
              <p class="highlight"><strong>할인금액:</strong></p>
              <p style="color: #ff0000;">-{{ formattedDiscountAmount }}원</p>
            </div>
            <div class="clientlecturecart-payment-item">
              <p class="total"><strong>총 결제금액:</strong></p>
              <p style="font-weight: bold; font-size: 18px;">{{ totalPrice }}원</p>
            </div>
          </div>
          <button class="clientlecturecart-purchase-button"  @click="openPayModal">결제하기</button>
          <p class="clientlecturecart-note">
            회원 본인은 주문내용을 확인했으며, 구매조건 및 개인정보처리방침과 결제에 동의합니다.
          </p>
          </div>
        </div>
      </div>
      <!-- 쿠폰 존재할 시 모달 -->
      <CouponModal
      v-if="isModalVisible"
      @close="closeModal"
      @apply="applyCoupon"
    />
    <!-- 쿠폰없을 시 모달 -->
    <!-- <NotCouponModal
      v-if="isModalVisible"
      @close="closeModal"
      @apply="applyCoupon"
    /> -->

      <!-- 결제 모달 -->
      <PayModal v-if="isPayModalVisible" @close="closePayModal" @confirm="openPaySuccessModal" />
    <!-- 결제 완료 모달 -->
    <PaySuccessModal v-if="isPaySuccessModalVisible" @close="closePaySuccessModal" />
    
    </div>
   
  </template>
  <script setup>
  import ClientHeader from "@/components/client/ClientHeader.vue";
  import NotCouponModal from "@/components/client/clientlecture/ClientNotCouponModal.vue";
  import CouponModal from "@/components/client/clientlecture/ClientCouponModal.vue";
  import PayModal from "@/components/client/clientpaylecture/ClientPayModal1.vue";
  import PaySuccessModal from "@/components/client/clientpaylecture/ClientPayFinishModal.vue";
  import { ref, computed } from "vue";
  import InactivityModal from '@/components/client/InactivityModal.vue';
  import { useActivityMonitor } from '@/components/client/useActivityMonitor';
  
  const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(30);
 
 const isModalVisible = ref(false);
const originalPrice = ref(45000); // 강의 원가
const discountAmount = ref(0); // 할인 금액

// 3자리 단위로 콤마를 찍는 함수
const formatCurrency = (value) => {
  return value.toLocaleString(); // 숫자를 로컬 형식으로 변환 (3자리 단위 콤마)
};

// 총 결제 금액 계산 및 포맷팅
const totalPrice = computed(() => formatCurrency(originalPrice.value - discountAmount.value));
const formattedOriginalPrice = computed(() => formatCurrency(originalPrice.value)); // 포맷팅된 원가
const formattedDiscountAmount = computed(() => formatCurrency(discountAmount.value)); // 포맷팅된 할인 금액

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

// 상태 관리
const isPayModalVisible = ref(false);
const isPaySuccessModalVisible = ref(false);

// 결제 모달 열기 및 닫기
const openPayModal = () => {
  isPayModalVisible.value = true;
};
const closePayModal = () => {
  isPayModalVisible.value = false;
};

// 결제 완료 모달 열기 및 닫기
const openPaySuccessModal = () => {
  isPayModalVisible.value = false; // 결제 모달 닫기
  isPaySuccessModalVisible.value = true; // 결제 완료 모달 열기
};
const closePaySuccessModal = () => {
  isPaySuccessModalVisible.value = false;
};


const applyCoupon = (coupon) => {
  const discountRate = parseInt(coupon.discount); // 할인율 가져오기
  discountAmount.value = Math.round((originalPrice.value * discountRate) / 100); // 할인 금액 계산
  closeModal();
};
 </script>
  
  
  <style scoped>
.clientvoc-app-container {
  font-family: "Arial", sans-serif;
  background-color: #f9f9f9;
  padding: 20px;
}

.clientlecturecart-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clientlecturecart-title {
    padding-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;

}

.clientlecturecart-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clientlecturecart-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #555;
}

.clientlecturecart-select-button {
  background-color: #ffffff;
  color: #767676;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-left: 625px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.clientlecturecart-select-button:hover {
  background-color: #f5f5f5;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.line {
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
}

.clientlecturecart-content {
  display: flex;
  gap: 20px;
}

/* 강의 목록 */
.clientlecturecart-lecture-list {
  flex: 0.7;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.clientlecturecart-lecture-item {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.clientlecturecart-lecture-thumbnail img {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.clientlecturecart-lecture-info {
  flex: 1;
}

.clientlecturecart-lecture-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.clientlecturecart-lecture-author {
  
  font-size: 14px;
  color: #767676;
}

.clientlecturecart-lecture-duration {
  color: #7671f4;
  font-weight: 500;
  margin-left: 5px;
}

.clientlecturecart-lecture-price {
  font-size: 14px;
  color: #e60000;
  font-weight: bold;
}

/* 구매 정보 */
.clientlecturecart-purchase-info {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 0.3;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}


.clientlecturecart-info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.clientlecturecart-edit-button {
  background-color: #ffffff;
  border: 1.3px solid #a5a5a5;
  color: #000000;
  font-weight: bold;
  margin-left: 12px;
  border-radius: 4px;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.clientlecturecart-info-content {
  display: flex;
  flex-direction: column;
  gap: 10px; 
  font-size: 14px; 
  color: #333; 
  line-height: 1.6; 
  margin-top: 10px; 
}

.clientlecturecart-info-content p {
  margin: 0; /* 기본 여백 제거 */
}

.clientlecturecart-info-content strong {

  font-weight: bold; /* 이름, 이메일, 번호를 강조 */
  color: #aaaaaa; /* 강조된 텍스트 색상 */
}

.clientlecturecart-edit-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

.clientlecturecart-coupon-section {
  gap: 10px; 
  font-size: 14px; 
  margin-top: 20px;
}

.clientlecturecart-coupon-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}


.clientlecturecart-coupon-actions input {
  flex: 1;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 230px;
}

.clientlecturecart-coupon-actions button {
  background-color: #ffffff;
  border: 1.3px solid #a5a5a5;
  color: #000000;
  font-weight: bold;
  margin-left: 12px;
  border-radius: 4px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, box-shadow 0.3s;


  &:focus {
        outline: none;
      }
}

.clientlecturecart-coupon-actions button:hover {
  background-color: #f5f5f5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.clientlecturecart-payment-summary {
  margin-top: 20px;
}

.clientlecturecart-payment-item {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 14px;
}


.clientlecturecart-payment-summary input {
    margin-left: 2.4px;
  flex: 1;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
  width: 230px;
  background-color: #f9f9f9;
}


.clientlecturecart-point-button {
  background-color: #ffffff;
  border: 1.3px solid #a5a5a5;
  color: #000000;
  font-weight: bold;
  border-radius: 4px;
  padding: 10px 12px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.clientlecturecart-point-button:hover {
  background-color: #f5f5f5;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.highlight {
  color: #ff0000;
}

.total {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.clientlecturecart-purchase-button {
  margin-top: 20px;
  width: 100%;
  background-color: #7671f4;
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.clientlecturecart-purchase-button:hover {
  background-color: #5c57d6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.clientlecturecart-note {
  margin-top: 20px;
  font-size: 14px;
  color: #767676;
  text-align: center;
}

</style>
