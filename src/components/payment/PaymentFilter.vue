<template>
    <div class="payment-filter-card">
      <div class="payment-filter-container">
        <div class="payment-section-header">
          <h2 class="payment-section-title">결제</h2>
          <div class="payment-button-group">
            <button @click="handleSearch" class="payment-search-button">
              <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
            </button>
            <button @click="handleReset" class="payment-reset-button">
              <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
            </button>
          </div>
        </div>
  
        <div class="payment-filter-row gray">
          <div class="payment-filter-item">
            <span class="payment-filter-label">결제 코드</span>
            <input 
              v-model="filterData.paymentCode" 
              type="text" 
              placeholder="결제 코드를 입력하세요"
              class="payment-filter-input"
            />
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">결제 금액</span>
            <div class="payment-price-range-container">
              <input 
                v-model="filterData.minPaymentPrice" 
                type="number" 
                placeholder="최소"
                class="payment-filter-input payment-price-input"
              />
              <span class="payment-price-separator">~</span>
              <input 
                v-model="filterData.maxPaymentPrice" 
                type="number" 
                placeholder="최대"
                class="payment-filter-input payment-price-input"
              />
            </div>
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">강의 코드</span>
            <input 
              v-model="filterData.lectureCode" 
              type="text" 
              placeholder="강의 코드를 입력하세요"
              class="payment-filter-input"
            />
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">강의명</span>
            <input 
              v-model="filterData.lectureTitle" 
              type="text" 
              placeholder="강의명을 입력하세요"
              class="payment-filter-input"
            />
          </div>
        </div>
  
        <div class="payment-filter-row white">
          <div class="payment-filter-item">
            <span class="payment-filter-label">강사명</span>
            <input 
              v-model="filterData.tutorName" 
              type="text" 
              placeholder="강사명을 입력하세요"
              class="payment-filter-input"
            />
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">강사 코드</span>
            <input 
              v-model="filterData.tutorCode" 
              type="text" 
              placeholder="강사 코드를 입력하세요"
              class="payment-filter-input"
            />
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">학생명</span>
            <input 
              v-model="filterData.studentName" 
              type="text" 
              placeholder="학생명을 입력하세요"
              class="payment-filter-input"
            />
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">학생 코드</span>
            <input 
              v-model="filterData.studentCode" 
              type="text" 
              placeholder="학생 코드를 입력하세요"
              class="payment-filter-input"
            />
          </div>
        </div>
  
        <div class="payment-filter-row gray">
          <div class="payment-filter-item">
            <span class="payment-filter-label">강의 가격</span>
            <div class="payment-price-range-container">
              <input 
                v-model="filterData.minLecturePrice" 
                type="number" 
                placeholder="최소"
                class="payment-filter-input payment-price-input"
              />
              <span class="payment-price-separator">~</span>
              <input 
                v-model="filterData.maxLecturePrice" 
                type="number" 
                placeholder="최대"
                class="payment-filter-input payment-price-input"
              />
            </div>
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">결제일</span>
            <div class="payment-date-range-container">
              <input 
                v-model="filterData.startCreatedAt" 
                type="date" 
                class="payment-filter-input payment-date-input"
              />
              <span class="payment-date-separator">~</span>
              <input 
                v-model="filterData.endCreatedAt" 
                type="date" 
                class="payment-filter-input payment-date-input"
              />
            </div>
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">쿠폰 코드</span>
            <input 
              v-model="filterData.couponIssuanceCode" 
              type="text" 
              placeholder="쿠폰 코드를 입력하세요"
              class="payment-filter-input"
            />
          </div>
          <div class="payment-filter-item">
            <span class="payment-filter-label">쿠폰명</span>
            <input 
              v-model="filterData.couponIssuanceName" 
              type="text" 
              placeholder="쿠폰명을 입력하세요"
              class="payment-filter-input"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const filterData = ref({
    paymentCode: '',
    minPaymentPrice: '',
    maxPaymentPrice: '',
    lectureCode: '',
    lectureTitle: '',
    minLecturePrice: '',
    maxLecturePrice: '',
    tutorCode: '',
    tutorName: '',
    studentCode: '',
    studentName: '',
    couponIssuanceCode: '',
    couponIssuanceName: '',
    startCreatedAt: '',
    endCreatedAt: ''
  });
  
  const emit = defineEmits(['search', 'reset'])
  
  const handleSearch = () => {
    emit('search', filterData.value);
  };
  
  const handleReset = () => {
    Object.keys(filterData.value).forEach(key => {
      filterData.value[key] = '';
    });
    emit('reset');
  };
  </script>
  
  <style scoped>
  .payment-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .payment-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .payment-section-title {
    font-size: 17px;
    font-weight: bold;
  }
  
  .payment-filter-container {
    display: flex;
    flex-direction: column;
  }
  
  .payment-filter-row {
    display: flex;
    padding: 3px 10px;
  }
  
  .payment-filter-row.gray {
    background-color: #EFEFEF;
    border-top: #D9D9D9;
    border-bottom: #D9D9D9;
  }
  
  .payment-filter-row.white {
    background-color: white;
  }
  
  .payment-filter-item {
    width: 25%;
    padding-left: 8px;
    display: flex;
    align-items: center;
  }
  
  .payment-filter-label {
    width: 5rem;
    min-width: 5rem;
    font-size: 11px;
    font-weight: 500;
    text-align: end;
    padding-right: 10px;
  }
  
  .payment-filter-input {
    flex: 1;
    padding: 5px 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    min-width: 0;
    width: 100%;
  }
  
  .payment-date-range-container,
  .payment-price-range-container {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .payment-date-input,
  .payment-price-input {
    width: calc(50% - 8px);
    min-width: 0;
  }
  
  .payment-date-separator,
  .payment-price-separator {
    color: #64748b;
    padding: 0 0.25rem;
  }
  
  .payment-button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .payment-search-button {
    padding: 2px 6px 3px 3px;        
    background-color: #005950;
    border: 1px solid #005950;
    border-radius: 4px;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .payment-reset-button {
    padding: 4px 5px 3px;   
    border: 1px solid #A29D9D;
    border-radius: 4px;
    font-size: 10px;
    background-color: white;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .payment-search-button:hover {
    background-color: #004c42;  
  }
  
  .payment-reset-button:hover {
    background-color: #f8fafc;
  }
  
  .payment-search-button:focus,
  .payment-reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }
  </style>