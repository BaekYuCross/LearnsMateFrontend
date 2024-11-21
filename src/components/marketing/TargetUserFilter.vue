<template>
  <div class="target-filter-card">
    <div class="target-filter-container">
      <!-- Gray Row -->
      <div class="target-filter-row gray">
        <div class="target-filter-item">
          <span class="target-filter-label">이름</span>
          <input 
            v-model="filters.memberName" 
            type="text" 
            placeholder="이름을 입력하세요" 
            class="target-filter-input" 
          />
        </div>

        <div class="target-filter-item">
          <span class="target-filter-label">연락처</span>
          <input 
            v-model="filters.memberPhone" 
            type="text" 
            placeholder="연락처를 입력하세요" 
            class="target-filter-input" 
          />
        </div>

        <div class="target-filter-item">
          <span class="target-filter-label">생년월일</span>
          <div class="date-range-container">
            <input 
              v-model="filters.birthStartDate" 
              type="date" 
              class="target-filter-input date-input" 
            />
            <span class="date-separator">~</span>
            <input 
              v-model="filters.birthEndDate" 
              type="date" 
              class="target-filter-input date-input" 
            />
          </div>
        </div>

        <div class="target-filter-item">
          <span class="target-filter-label">이메일</span>
          <input 
            v-model="filters.memberEmail" 
            type="email" 
            placeholder="이메일을 입력하세요" 
            class="target-filter-input" 
          />
        </div>
      </div>

      <!-- White Row -->
      <div class="target-filter-row white">
        <div class="target-filter-item partial">
          <span class="target-filter-label">주소</span>
          <input 
            v-model="filters.memberAddress" 
            type="text" 
            placeholder="주소를 입력하세요" 
            class="target-filter-input" 
          />
        </div>

        <div class="target-filter-item partial">
          <span class="target-filter-label">계정상태</span>
          <select 
            v-model="filters.memberFlag" 
            class="target-filter-input"
          >
            <option value="">전체</option>
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
        </div>

        <div class="target-filter-item">
          <div class="target-button-group">
            <button @click="search" class="target-search-button">
              <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
            </button>
            <button @click="reset" class="reset-button">
              <img class="reset-img" src="/src/assets/icons/reset.svg" alt="초기화">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

// 날짜 변환 헬퍼 함수 추가
const convertToLocalDateTime = (date, isEndDate = false) => {
  if (!date) return null;
  const timeString = isEndDate ? 'T23:59:59' : 'T00:00:00';
  return `${date}${timeString}`;
};

const filters = ref({
  memberName: '',
  memberPhone: '',
  birthStartDate: '',
  birthEndDate: '',
  memberEmail: '',
  memberAddress: '',
  memberFlag: '',
});

const emit = defineEmits(['search', 'reset']);

const search = () => {
  const filterData = {
    memberName: filters.value.memberName,
    memberPhone: filters.value.memberPhone,
    memberEmail: filters.value.memberEmail,
    memberAddress: filters.value.memberAddress,
    memberFlag: filters.value.memberFlag,
    birthStartDate: convertToLocalDateTime(filters.value.birthStartDate),
    birthEndDate: convertToLocalDateTime(filters.value.birthEndDate, true),
  };

  // 빈 값 제거
  Object.keys(filterData).forEach(key => {
    if (filterData[key] === '' || filterData[key] === null || filterData[key] === undefined) {
      delete filterData[key];
    }
  });
  
  emit('search', filterData);
};

const reset = () => {
  filters.value = {
    memberName: '',
    memberPhone: '',
    birthStartDate: '',
    birthEndDate: '',
    memberEmail: '',
    memberAddress: '',
    memberFlag: '',
  };
  emit('reset');
};
</script>

<style>
.target-filter-card {
  margin-bottom: 16px;
  background-color: white;
  padding: 0;
}

.target-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 15px;
  border-bottom: 1px solid #e9ecef;
}

.target-section-title {
  font-size: 18px;
  font-weight: bold;
}

.target-filter-container {
  display: flex;
  flex-direction: column;
}

.target-filter-row {
  display: flex;
  padding: 3px 10px;
  gap: 16px;
}

.target-filter-row.gray {
  background-color: #f8f9fa;
}

.target-filter-row.white {
  background-color: white;
}

.target-filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}

.target-filter-item.partial {
  flex: 1;
  max-width: 300px;
}

.target-filter-label {
  width: 4rem;
  font-size: 10px;
  font-weight: 500;
}

.target-filter-input {
  flex: 1;
  padding: 5px 0px;
  font-size: 10px;
  border: 1px solid #e2e8f0;
}

.date-range-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-input {
  flex: 1;
}

.date-separator {
  color: #64748b;
  padding: 0 0.25rem;
}

.target-button-group {
  display: flex;
  gap: 0.5rem;
  margin-left: 470px;
}

.target-search-button {
  padding: 2px 6px 3px 3px;
  background-color: #005950;
  border: 1px solid #005950;
  border-radius: 4px;
  font-size: 10px;
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 4px;
  margin-top: 4px;
}

.target-search-button:hover {
  background-color: #004c42;
}

.reset-button {
  padding: 4px 5px 3px;
  border: 1px solid #A29D9D;
  border-radius: 4px;
  font-size: 10px;
  background-color: white;
  cursor: pointer;
  margin-bottom: 4px;
  margin-top: 4px;
}

.reset-button:hover {
  background-color: #f8fafc;
}

.excel-download-btn {
  display: flex;
  align-items: center;
  border: 1px solid #005950;
  border-radius: 4px;
  gap: 2px;
  padding: 4px;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-left: 20px;
  font-size: 10px;
  background-color: #005950;
  color: white;
  cursor: pointer;
}

.excel-download-btn:hover {
  background-color: #004c42;
}

.target-search-button:focus,
.reset-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}

input:focus {
  outline: none;  
}


</style>