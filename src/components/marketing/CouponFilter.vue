<template>
    <div class="coupon-filter-card">
      <div class="coupon-section-header">
        <h2 class="coupon-section-title">쿠폰</h2>
        <div class="coupon-button-group">
          <button @click="search" class="coupon-search-button">
            <i class="fas fa-search"></i>
            <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
          </button>
          <button @click="reset" class="reset-button">
            <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
          </button>
        </div>
      </div>
  
      <div class="coupon-filter-container">
        <div class="coupon-filter-row gray">
          <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 이름</span>
              <input 
                v-model="filters.coupon_name"
                type="text" 
                placeholder="쿠폰 이름을 입력하세요"
                class="coupon-filter-input"
              />
          </div>
          <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 내용</span>
              <input 
                v-model="filters.coupon_contents"
                type="text" 
                placeholder="쿠폰 내용을 입력하세요"
                class="coupon-filter-input"
              />
          </div>
          <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 종류</span>
              <select
                v-model="filters.coupon_category_name"
                class="coupon-filter-input">
                <option value = "">전체</option>
                <option value = "일반">일반</option>
                <option value = "기념일">기념일</option>
                <option value = "신규가입">신규가입</option>
                <option value = "첫구매">첫 구매</option>
                <option value = "복귀">복귀</option>
                <option value = "완강">완강</option>
                <option value = "이벤트">이벤트</option>
              </select>
          </div>
        </div>
        <div class="coupon-filter-row white">
          <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 상태</span>
              <select
                v-model="filters.active_state"
                class="coupon-filter-input">
                <option value = "">전체</option>
                <option value = true>활성화</option>
                <option value = false>비활성화</option>
              </select>
          </div>
          <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 할인율</span>
              <div class="coupon-discount-rate-container">
              <input 
                v-model="filters.min_discount_rate"
                type="number" 
                class="coupon-filter-input discount-input"
              />
              <span class="discount-rate-separator">~</span>
              <input 
                v-model="filters.max_discount_rate"
                type="number" 
                class="coupon-filter-input discount-input"
              />
              </div>
          </div>
          <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 시작일</span>
              <div class="coupon-date-range-container">
              <input 
                v-model="filters.start_coupon_start_date"
                type="date" 
                class="coupon-filter-input date-input"
              />
              <span class="coupon-date-separator">~</span>
              <input 
                v-model="filters.end_coupon_start_date"
                type="date" 
                class="coupon-filter-input date-input"
              />
              </div>
          </div>
        </div>
        <div class="coupon-filter-row gray">
        <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 만료일</span>
            <div class="coupon-date-range-container">
              <input 
                v-model="filters.start_expire_date"
                type="date" 
                class="coupon-filter-input date-input"
              />
              <span class="coupon-date-separator">~</span>
              <input 
                v-model="filters.end_expire_date"
                type="date"
                class="coupon-filter-input date-input"
              />
            </div>
        </div>
        <div class="coupon-filter-item">
            <span class="coupon-filter-label">쿠폰 생성일</span>
            <div class="coupon-date-range-container">
              <input 
                v-model="filters.start_created_at"
                type="date" 
                class="coupon-filter-input date-input"
              />
              <span class="coupon-date-separator">~</span>
              <input 
                v-model="filters.end_created_at"
                type="date" 
                class="coupon-filter-input date-input"
              />
            </div>
        </div>
    </div>
    <div class="coupon-filter-row white">
        <div class="coupon-filter-item">
            <span class="coupon-filter-label">직원</span>
            <input 
                v-model="filters.admin_name"
                type="text" 
                placeholder="직원 이름을 입력하세요"
                class="coupon-filter-input"
            />
        </div>
        <div class="coupon-filter-item">
            <span class="coupon-filter-label">강사</span>
            <input 
                v-model="filters.tutor_name"
                type="text" 
                placeholder="강사 이름을 입력하세요"
                class="coupon-filter-input"
            />
        </div>
        <div class="coupon-filter-item">
    </div>
        </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const filters = ref({
    coupon_name: '',
    coupon_contents: '',
    coupon_category_name: '',
    active_state: '',
    min_discount_rate: '',
    max_discount_rate: '',
    start_coupon_start_date: '',
    end_coupon_start_date:'',
    start_expire_date: '',
    end_expire_date: '',
    start_created_at: '',
    end_created_at: '',
    admin_name: '',
    tutor_name: '',
  })
  
  const emit = defineEmits(['search', 'reset'])
  
  const search = () => {
    emit('search', filters.value)
  }
  
  const reset = () => {
    Object.keys(filters.value).forEach(key => {
      filters.value[key] = ''
    })
    emit('reset')
  }
  </script>
  
<style scoped>
  .coupon-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 50px;
    margin-left: 160px;
  }
  
  .coupon-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .coupon-section-title {
    font-size: 16px;
    font-weight: 500;
    font-weight: bold;
  }
  
  .coupon-filter-container {
    display: flex;
    flex-direction: column;
    z-index: -100;
  }
  
  .coupon-filter-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 8px 16px;
    gap: 16px;
  }
  
  .coupon-filter-row.gray {
    background-color: #f8f9fa;
  }
  
  .coupon-filter-row.white {
    background-color: white;
  }
  
  .coupon-filter-item {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 8px;
  }

  .partial-width {
    width: 33.33%;
    flex: 0 0 33.33%;
  }

  .coupon-filter-label {
    min-width: 80px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .coupon-filter-input {
    flex: 1;
    padding: 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
  }

  .coupon-date-range-container,
  .coupon-discount-rate-container {
    display: flex;
    flex: 1;
    gap: 0.5rem;
    align-items: center;
  }
  
  .date-input,
  .discount-input {
    flex: 1;
    min-width: 0;
  }
  
  .coupon-date-separator,
  .discount-rate-separator {
    color: #64748b;
    padding: 0 0.25rem;
    font-size: 11px;
  }
  
  .coupon-button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .coupon-search-button {
    padding: 2px 6px 3px 3px;        
    background-color: #005950;
    border: 1px solid #005950;
    border-radius: 4px;
    font-size: 11px;
    color: white;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    margin-top: 4px;
    padding: 2px 4px;
  }
  
  .coupon-search-button:hover {
    background-color: #004c42;
    cursor: pointer;
  }
  
  .reset-button {
    padding: 4px 5px 3px;   
    border: 1px solid #A29D9D;
    border-radius: 4px;
    font-size: 11px;
    background-color: white;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .reset-button:hover {
    background-color: #f8fafc;
    cursor: pointer;
  }
  
  .coupon-search-button:focus,
  .reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }
</style>