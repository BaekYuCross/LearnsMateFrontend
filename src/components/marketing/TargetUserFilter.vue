<template>
    <div class="target-filter-card">
      <div class="target-filter-container">
        <!-- Gray Row -->
        <div class="target-filter-row gray">
          <div class="target-filter-item">
            <span class="target-filter-label">이름</span>
            <input 
              v-model="filters.name" 
              type="text" 
              placeholder="이름을 입력하세요" 
              class="target-filter-input" 
            />
          </div>
  
          <div class="target-filter-item">
            <span class="target-filter-label">연락처</span>
            <input 
              v-model="filters.phone" 
              type="text" 
              placeholder="연락처를 입력하세요" 
              class="target-filter-input" 
            />
          </div>
  
          <div class="target-filter-item">
            <span class="target-filter-label">생년월일</span>
            <div class="date-range-container">
              <input 
                v-model="filters.startBirDate" 
                type="date" 
                class="target-filter-input date-input" 
              />
              <span class="date-separator">~</span>
              <input 
                v-model="filters.endBirDate" 
                type="date" 
                class="target-filter-input date-input" 
              />
            </div>
          </div>
  
          <div class="target-filter-item">
            <span class="target-filter-label">이메일</span>
            <input 
              v-model="filters.email" 
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
              v-model="filters.address" 
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
              <option value="Y">활성</option>
              <option value="N">비활성</option>
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
import { ref } from 'vue';

const filters = ref({
  name: '',
  phone: '',
  startBirDate: '',
  endBirDate: '',
  email: '',
  address: '',
  memberFlag: '',
});

const emit = defineEmits(['search', 'reset']);

const search = () => {
  emit('search', filters.value);
};

const reset = () => {
  Object.keys(filters.value).forEach((key) => {
    filters.value[key] = '';
  });
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