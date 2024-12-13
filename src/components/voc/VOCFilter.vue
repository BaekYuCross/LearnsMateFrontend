<template>
  <div class="voc-filter-card">
    <div class="voc-filter-container">
      <div class="voc-section-header">
        <h2 class="voc-section-title">VOC</h2>
        <div class="voc-button-group">
          <button @click="search" class="voc-search-button">
            <i class="fas fa-search"></i>
            <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
          </button>
          <button @click="reset" class="voc-reset-button">
            <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
          </button>
        </div>
      </div>
      <div class="voc-filter-row gray">
        <div class="voc-filter-item">
          <span class="voc-filter-label">VOC 코드</span>
          <input 
            v-model="filters.vocCode"
            type="text" 
            placeholder="VOC 코드를 입력하세요"
            class="voc-filter-input"
          />
        </div>
        <div class="voc-filter-item">
          <span class="voc-filter-label">VOC 내용</span>
          <input 
            v-model="filters.vocContent"
            type="text" 
            placeholder="VOC 내용을 입력하세요"
            class="voc-filter-input"
          />
        </div>
        <div class="voc-filter-item">
          <span class="voc-filter-label">카테고리</span>
          <select 
            v-model="filters.vocCategoryCode"
            class="voc-filter-input"
          >
            <option value="">카테고리를 선택하세요</option>
            <option value="1">결제 및 환불</option>
            <option value="2">계정 및 로그인</option>
            <option value="3">프로모션 및 쿠폰</option>
            <option value="4">시스템 기술적 문제</option>
            <option value="5">기타 건의사항</option>
          </select>
        </div>
        <div class="voc-filter-item">
          <span class="voc-filter-label">회원 유형</span>
          <select 
            v-model="filters.memberType"
            class="voc-filter-input"
          >
            <option value="">회원 유형을 선택하세요</option>
            <option value="STUDENT">학생</option>
            <option value="TUTOR">강사</option>
          </select>
        </div>
      </div>

      <div class="voc-filter-row white">
        <div class="voc-filter-item">
          <span class="voc-filter-label">답변 상태</span>
          <select 
            v-model="filters.vocAnswerStatus"
            class="voc-filter-input"
          >
            <option value="">답변 상태를 선택하세요</option>
            <option value="true">답변완료</option>
            <option value="false">미답변</option>
          </select>
        </div>
        <div class="voc-filter-item">
          <span class="voc-filter-label">만족도</span>
          <select 
            v-model="filters.vocAnswerSatisfaction"
            class="voc-filter-input"
          >
            <option value="">만족도를 선택하세요</option>
            <option value="만족">만족</option>
            <option value="보통">보통</option>
            <option value="불만족">불만족</option>
          </select>
        </div>
        <div class="voc-filter-item">
          <span class="voc-filter-label">등록일</span>
            <div class="voc-date-range-container">
              <input v-model="filters.startCreateDate" type="date" class="voc-filter-input voc-date-input"/>
              <span class="voc-date-separator">~</span>
              <input v-model="filters.endCreateDate" type="date" class="voc-filter-input voc-date-input"/>
            </div>
          </div>
        <div class="voc-filter-item"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filters = ref({
  vocCode: '',
  vocContent: '',
  vocCategoryCode: '',
  memberType: '',
  vocAnswerStatus: '',
  vocAnswerSatisfaction: '',
  startCreateDate: '',
  endCreateDate: ''
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
.voc-filter-card {
  margin-bottom: 16px;
  background-color: white;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.voc-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
.voc-section-title {
  font-size: 17px;
  font-weight: bold;
}

.voc-filter-container {
  display: flex;
  flex-direction: column;
}

.voc-filter-row {
  display: flex;
  padding: 3px 10px;
}

.voc-filter-row.gray {
  background-color: #EFEFEF;
  border-top: #D9D9D9;
  border-bottom: #D9D9D9;
}
  
.voc-filter-row.white {
  background-color: white;
}

.voc-filter-item {
  width: 25%;
  padding-left: 8px;
  display: flex;
  align-items: center;
}

.voc-filter-label {
  width: 5rem;
  min-width: 5rem;
  font-size: 11px;
  font-weight: 500;
  text-align: end;
  padding-right: 10px;
}

.voc-filter-input {
  outline: none;
  flex: 1;
  padding: 5px 5px;
  font-size: 11px;
  border: 1px solid #e2e8f0;
  min-width: 0;
  width: 100%;
}

.voc-date-range-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.voc-date-input {
  outline: none;
  width: calc(50% - 8px);
  min-width: 0;
}
  
.voc-date-separator {
    color: #64748b;
    padding: 0 0.25rem;
  }

.voc-button-group {
  display: flex;
  gap: 0.5rem;
}

.voc-search-button {
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

.voc-reset-button {
  padding: 4px 5px 3px;   
  border: 1px solid #A29D9D;
  border-radius: 4px;
  font-size: 10px;
  background-color: white;
  margin-bottom: 4px;
  margin-top: 4px;
}

.voc-search-button:hover {
  background-color: #004c42;  
}

.voc-reset-button:hover {
  background-color: #f8fafc;
}

.voc-search-button:focus,
.voc-reset-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}
</style>