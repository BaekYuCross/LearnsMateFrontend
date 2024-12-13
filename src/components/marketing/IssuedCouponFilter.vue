<template>
  <div class="issued-coupon-filter-card">
    <div class="issued-coupon-section-header">
      <h2 class="issued-coupon-section-title">발급된 쿠폰</h2>
      <div class="issued-coupon-button-group">
        <button @click="search" class="issued-coupon-search-button">
          <i class="fas fa-search"></i>
          <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
        </button>
        <button @click="reset" class="reset-button">
          <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
        </button>
      </div>
    </div>

    <div class="issued-coupon-filter-container">
      <div class="issued-coupon-filter-row gray">
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 이름</span>
          <input 
            v-model="filters.coupon_name"
            type="text" 
            placeholder="쿠폰 이름을 입력하세요"
            class="issued-coupon-filter-input"
          />
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 내용</span>
          <input 
            v-model="filters.coupon_contents"
            type="text" 
            placeholder="쿠폰 내용을 입력하세요"
            class="issued-coupon-filter-input"
          />
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 종류</span>
          <select
            v-model="filters.coupon_category_name"
            class="issued-coupon-filter-input">
            <option value="">전체</option>
            <option value="일반">일반</option>
            <option value="기념일">기념일</option>
            <option value="신규가입">신규가입</option>
            <option value="첫구매">첫 구매</option>
            <option value="복귀">복귀</option>
            <option value="완강">완강</option>
            <option value="이벤트">이벤트</option>
          </select>
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">고객 코드</span>
          <input 
            v-model="filters.student_code"
            type="text" 
            placeholder="고객 코드를 입력하세요"
            class="issued-coupon-filter-input"
          />
        </div>
      </div>
      <div class="issued-coupon-filter-row white">
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">고객명</span>
          <input 
            v-model="filters.student_name"
            type="text" 
            placeholder="고객명을 입력하세요"
            class="issued-coupon-filter-input"
          />
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">사용 여부</span>
          <select
            v-model="filters.coupon_use_status"
            class="issued-coupon-filter-input">
            <option value="">전체</option>
            <option value="true">사용 완료</option>
            <option value="false">미사용</option>
          </select>
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 할인율</span>
          <div class="issued-coupon-discount-rate-container">
            <input 
              v-model="filters.min_discount_rate"
              type="number" 
              class="issued-coupon-filter-input discount-input"
              placeholder="할인율을 입력하세요"
            />
            <span class="issued-discount-rate-separator">~</span>
            <input 
              v-model="filters.max_discount_rate"
              type="number" 
              class="issued-coupon-filter-input discount-input"
              placeholder="할인율을 입력하세요"
            />
          </div>
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 시작일</span>
          <div class="issued-coupon-date-range-container">
            <input 
              v-model="filters.start_coupon_start_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
            <span class="issued-coupon-date-separator">~</span>
            <input 
              v-model="filters.end_coupon_start_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
          </div>
        </div>
      </div>
      <div class="issued-coupon-filter-row gray">
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 만료일</span>
          <div class="issued-coupon-date-range-container">
            <input 
              v-model="filters.start_coupon_expire_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
            <span class="issued-coupon-date-separator">~</span>
            <input 
              v-model="filters.end_coupon_expire_date"
              type="date"
              class="issued-coupon-filter-input date-input"
            />
          </div>
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 발급일</span>
          <div class="issued-coupon-date-range-container">
            <input 
              v-model="filters.start_coupon_issue_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
            <span class="issued-coupon-date-separator">~</span>
            <input 
              v-model="filters.end_coupon_issue_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
          </div>
        </div>
        <div class="issued-coupon-filter-item">
          <span class="issued-coupon-filter-label">쿠폰 사용일</span>
          <div class="issued-coupon-date-range-container">
            <input 
              v-model="filters.start_coupon_use_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
            <span class="issued-coupon-date-separator">~</span>
            <input 
              v-model="filters.end_coupon_use_date"
              type="date" 
              class="issued-coupon-filter-input date-input"
            />
          </div>
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
    student_code: '',
    student_name: '',
    coupon_use_status: '',
    min_discount_rate: '',
    max_discount_rate: '',
    start_coupon_start_date: '',
    end_coupon_start_date: '',
    start_coupon_expire_date: '',
    end_coupon_expire_date: '',
    start_coupon_use_date: '',
    end_coupon_use_date: '',
    start_coupon_issue_date: '',
    end_coupon_issue_date: ''
  })
  
  const emit = defineEmits(['search', 'reset'])
  
  const search = () => {
    const formattedFilters = { ...filters.value };

  // 날짜 필드와 빈 문자열 처리
  Object.keys(formattedFilters).forEach(key => {
    if (formattedFilters[key] === '') {
      formattedFilters[key] = null;
    } else if (key.includes('date') && formattedFilters[key]) {
      formattedFilters[key] = new Date(formattedFilters[key]).toISOString();
    }
  });

  emit('search', formattedFilters);
  };
  
  const reset = () => {
    Object.keys(filters.value).forEach(key => {
      filters.value[key] = '';
    });
    emit('reset')
  };
</script>
  
<style scoped>
.issued-coupon-filter-card {
  margin-bottom: 16px;
  background-color: white;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  /* margin-top: 50px와 margin-left: 160px 제거 */
}

.issued-coupon-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 10px;
  border-bottom: 1px solid #e9ecef;
}

.issued-coupon-section-title {
  font-size: 17px;
  font-weight: bold;
}

.issued-coupon-filter-container {
  display: flex;
  flex-direction: column;
  /* z-index: -100 제거 */
}

.issued-coupon-filter-row {
  display: flex;
  padding: 3px 10px;
}

.issued-coupon-filter-row.gray {
  background-color: #EFEFEF;
  border-top: #D9D9D9;
  border-bottom: #D9D9D9;
}

.issued-coupon-filter-row.white {
  background-color: white;
}

.issued-coupon-filter-item {
  width: 25%;
  padding-left: 8px;
  display: flex;
  align-items: center;
}

.issued-coupon-filter-label {
  width: 5rem;
  min-width: 5rem;
  font-size: 11px;
  font-weight: 500;
  text-align: end;
  padding-right: 10px;
}

.issued-coupon-filter-input {
  flex: 1;
  padding: 5px 5px;
  font-size: 11px;
  border: 1px solid #e2e8f0;
  min-width: 0;
  width: 100%;
}

.issued-coupon-date-range-container,
.issued-coupon-discount-rate-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.date-input,
.discount-input {
  width: calc(50% - 8px);
  min-width: 0;
}

.issued-coupon-date-separator,
.issued-discount-rate-separator {
  color: #64748b;
  padding: 0 0.25rem;
  font-size: 11px;
}

.issued-coupon-button-group {
  display: flex;
  gap: 0.5rem;
}

.issued-coupon-search-button {
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

.issued-coupon-search-button:hover {
  background-color: #004c42;
  cursor: pointer;
}

.reset-button {
  padding: 4px 5px 3px;   
  border: 1px solid #A29D9D;
  border-radius: 4px;
  font-size: 10px;
  background-color: white;
  margin-bottom: 4px;
  margin-top: 4px;
}

.reset-button:hover {
  background-color: #f8fafc;
  cursor: pointer;
}

.issued-coupon-search-button:focus,
.reset-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}
</style>