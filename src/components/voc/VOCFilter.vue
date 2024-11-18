<template>
  <div class="voc-filter-card">
    <div class="voc-filter-container">
      <div class="voc-filter-row white">
        <div class="voc-filter-item">
          <span class="voc-filter-h2">VOC</span>
        </div>
        <div class="voc-filter-item">
        </div>
        <div class="voc-button-group">
          <button @click="search" class="voc-search-button">
            <img src="@/assets/icons/search.svg" alt="검색" class="voc-icon">
            조회
          </button>
          <button @click="reset" class="voc-reset-button">
            초기화
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
            <div class="voc-date-range">
              <input 
                v-model="filters.startDate"
                type="date" 
                class="voc-filter-input"
              />
              <span class="voc-date-separator">~</span>
              <input 
                v-model="filters.endDate"
                type="date" 
                class="voc-filter-input"
              />
            </div>
          </div>
        <div class="voc-filter-item">
        </div>
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
  startDate: '',
  endDate: ''
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
  padding-top:2.5px;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: calc(30px + 1rem) 0 1rem calc(160px);
}

.voc-filter-container {
  display: flex;
  flex-direction: column;
}

.voc-filter-row {
  display: flex;
  padding: 2.5px 5px 2.5px 10px;
  gap: 50px;
  align-items: flex-start;
}

.voc-filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}

.voc-filter-h2 {
  padding-left : 6px;
  font-size: 18px;
  font-weight: bold;
  color: #374151;
  text-align: end;
}

.voc-filter-label {
  min-width: 55px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: end;
}

.voc-filter-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 12px;
  max-width: 230px;
}

.voc-filter-input:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 1px #0d9488;
}

.voc-date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.voc-date-range input {
  width: calc(50% - 10px);
}

.voc-date-separator {
  color: #64748b;
  font-size: 0.875rem;
}

.voc-filter-row:last-child .voc-filter-item:empty {
  min-width: 113px;
}

.voc-button-group {
  display: flex;
  gap: 5px;
  align-items: center;
  min-width: 365px;
  justify-content: flex-end;
  padding-top: 0;
}

.voc-search-button {
  padding: 5px 10px;
  background-color: #0d9488;
  color: white;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 12px;
  transition: background-color 0.2s;
}

.voc-reset-button {
  padding: 5px 10px;
  height:29.2px;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 12px;
  transition: background-color 0.2s;
}

.voc-search-button:hover {
  background-color: #0f766e;
}

.voc-reset-button:hover {
  background-color: #f8fafc;
}

.voc-search-button:focus,
.voc-reset-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}

.voc-filter-input[type="date"] {
  min-width: 0;
  flex: 1;
}

.voc-icon {
  width: 12px;
  height: 12px;
}

.voc-filter-row.gray {
  background-color: #EFEFEF;
  border-top: #D9D9D9;
  border-bottom: #D9D9D9;
}
  
.voc-filter-row.white {
  background-color: white;
}
</style>