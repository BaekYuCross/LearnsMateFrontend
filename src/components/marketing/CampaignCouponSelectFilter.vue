<template>
    <div class="coupon-select-filter-card">
      <div class="coupon-select-section-header">
      </div>
  
      <div class="coupon-select-filter-container">
        <div class="coupon-select-filter-row gray">
          <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 이름</span>
              <input 
                v-model="filters.coupon_name"
                type="text" 
                placeholder="쿠폰 이름을 입력하세요"
                class="coupon-select-filter-input"
              />
          </div>
          <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 내용</span>
              <input 
                v-model="filters.coupon_contents"
                type="text" 
                placeholder="쿠폰 내용을 입력하세요"
                class="coupon-select-filter-input"
              />
          </div>
          <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 종류</span>
              <select
                v-model="filters.coupon_category_code"
                class="coupon-select-filter-input">
                <option value = "">전체</option>
                <option value = "1">일반</option>
                <option value = "2">기념일</option>
                <option value = "3">신규가입</option>
                <option value = "4">첫 구매</option>
                <option value = "5">복귀</option>
                <option value = "6">완강</option>
                <option value = "7">이벤트</option>
              </select>
          </div>
        </div>
        <div class="coupon-select-filter-row white">
          <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 상태</span>
              <select
                v-model="filters.coupon_flag"
                class="coupon-select-filter-input">
                <option value = "">전체</option>
                <option value = true>활성화</option>
                <option value = false>비활성화</option>
              </select>
          </div>
          <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 할인율</span>
              <div class="coupon-select-discount-rate-container">
              <input 
                v-model="filters.min_discount_rate"
                type="number" 
                class="coupon-select-filter-input discount-input"
              />
              <span class="discount-rate-separator">~</span>
              <input 
                v-model="filters.max_discount_rate"
                type="number" 
                class="coupon-select-filter-input discount-input"
              />
              </div>
          </div>
          <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 시작일</span>
              <div class="coupon-select-date-range-container">
              <input 
                v-model="filters.start_coupon_start_date"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
              <span class="coupon-select-date-separator">~</span>
              <input 
                v-model="filters.end_coupon_start_date"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
              </div>
          </div>
        </div>
        <div class="coupon-select-filter-row gray">
        <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 만료일</span>
            <div class="coupon-select-date-range-container">
              <input 
                v-model="filters.start_expire_date"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
              <span class="coupon-select-date-separator">~</span>
              <input 
                v-model="filters.end_expire_date"
                type="date"
                class="coupon-select-filter-input date-input"
              />
            </div>
        </div>
        <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 생성일</span>
            <div class="coupon-select-date-range-container">
              <input 
                v-model="filters.start_created_at"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
              <span class="coupon-select-date-separator">~</span>
              <input 
                v-model="filters.end_created_at"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
            </div>
        </div>
        <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">쿠폰 수정일</span>
            <div class="coupon-select-date-range-container">
              <input 
                v-model="filters.updated_at"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
              <span class="coupon-select-date-separator">~</span>
              <input 
                v-model="filters.updated_at"
                type="date" 
                class="coupon-select-filter-input date-input"
              />
            </div>
        </div>
    </div>
    <div class="coupon-select-filter-row white">
        <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">직원</span>
            <input 
                v-model="filters.admin_code"
                type="text" 
                placeholder="직원 이름을 입력하세요"
                class="coupon-select-filter-input"
            />
        </div>
        <div class="coupon-select-filter-item">
            <span class="coupon-select-filter-label">강사</span>
            <input 
                v-model="filters.tutor_code"
                type="text" 
                placeholder="강사 이름을 입력하세요"
                class="coupon-select-filter-input"
            />
        </div>
        <div class="coupon-select-button-group">
          <button @click="search" class="coupon-select-search-button">
            <i class="fas fa-search"></i>
            <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
          </button>
          <button @click="reset" class="coupon-select-reset-button">
            <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
          </button>
        </div>
        </div>
        </div>
    </div>
  </template>

  
  <script setup>
  import { ref, defineEmits  } from 'vue'
  
  const filters = ref({
    coupon_name: '',
    coupon_contents: '',
    coupon_category_code: '',
    coupon_flag: '',
    min_discount_rate: '',
    max_discount_rate: '',
    start_coupon_start_date: '',
    end_coupon_start_date: '',
    start_expire_date: '',
    end_expire_date: '',
    start_created_at: '',
    end_created_at: '',
    start_updated_at: '',
    end_updated_at: '',
    admin_code: '',
    tutor_code: '',
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
  .coupon-select-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .coupon-select-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .coupon-select-section-title {
    font-size: 16px;
    font-weight: 500;
    font-weight: bold;
  }
  
  .coupon-select-filter-container {
    display: flex;
    flex-direction: column;
    z-index: -100;
  }
  
  .coupon-select-filter-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 8px 16px;
    gap: 16px;
  }
  
  .coupon-select-filter-row.gray {
    background-color: #f8f9fa;
  }
  
  .coupon-select-filter-row.white {
    background-color: white;
  }
  
  .coupon-select-filter-item {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 8px;
  }

  .coupon-select-partial-width {
    width: 33.33%;
    flex: 0 0 33.33%;
  }

  .coupon-select-filter-label {
    min-width: 80px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .coupon-select-filter-input {
    flex: 1;
    padding: 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
  }

  .coupon-select-date-range-container,
  .coupon-select-discount-rate-container {
    display: flex;
    flex: 1;
    gap: 0.5rem;
    align-items: center;
  }
  
  .coupon-select-date-input,
  .coupon-select-discount-input {
    flex: 1;
    min-width: 0;
  }
  
  .coupon-select-date-separator,
  .coupon-select-discount-rate-separator {
    color: #64748b;
    padding: 0 0.25rem;
    font-size: 11px;
  }
  
  .coupon-select-button-group {
    display: flex;
    gap: 0.5rem;
    margin-left: 300px;
  }
  
  .coupon-select-search-button {
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
  }
  
  .coupon-select-search-button:hover {
    background-color: #004c42;  
  }
  
  .coupon-select-reset-button {
    padding: 4px 5px 3px;   
    border: 1px solid #A29D9D;
    border-radius: 4px;
    font-size: 11px;
    background-color: white;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .coupon-select-reset-button:hover {
    background-color: #f8fafc;
  }
  
  .coupon-select-search-button:focus,
  .coupon-select-reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }
</style>
