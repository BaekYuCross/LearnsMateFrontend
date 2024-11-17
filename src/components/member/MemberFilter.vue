<template>
    <div class="filter-card">
      <div class="section-header">
        <h2 class="section-title">학생</h2>
        <div class="button-group">
          <button @click="search" class="search-button">
            <i class="fas fa-search"></i>
            검색
          </button>
          <button @click="reset" class="reset-button">
            초기화
          </button>
        </div>
      </div>
  
      <div class="filter-container">
        <!-- 첫째 줄 - 회색 배경 -->
         
        <div class="filter-row gray">
        <div class="filter-item">
            <span class="filter-label">학생 코드</span>
            <input 
                v-model="filters.code"
                type="text" 
                placeholder="학생 코드를 입력하세요"
                class="filter-input"
            />
        </div>
        <div class="filter-item">
            <span class="filter-label">학생 이름</span>
            <input 
                v-model="filters.name"
                type="text" 
                placeholder="학생 이름을 입력하세요"
                class="filter-input"
            />
        </div>
        <div class="filter-item">
            <span class="filter-label">이메일</span>
            <input 
              v-model="filters.email"
              type="email" 
              placeholder="이메일을 입력하세요"
              class="filter-input"
            />
          </div>
        </div>
  
        <!-- 둘째 줄 - 흰색 배경 -->
        <div class="filter-row white">
            
          <div class="filter-item"> <!-- 1번 -->
            <span class="filter-label">연락처</span>
            <input 
              v-model="filters.phone"
              type="text" 
              placeholder="연락처를 입력하세요"
              class="filter-input"
            />
          </div>
          <div class="filter-item"> <!-- 2번 -->
            <span class="filter-label">주소</span>
            <input 
              v-model="filters.address"
              type="text" 
              placeholder="주소를 입력하세요"
              class="filter-input"
            />
          </div>

          <div class="filter-item"> <!-- 3번 -->
            <span class="filter-label">나이</span>
            <input 
              v-model="filters.startAge"
              type="text"
              placeholder="시작 나이를 입력해주세요"
              class="filter-input"
            />
            <span class="date-separator">~</span>
            <input 
                v-model="filters.endAge"
                type="text" 
                placeholder="끝 나이를 입력해주세요"
                class="filter-input"
            />
          </div>
        </div>
        <!-- 셋째 줄 - 회색 배경 -->
        <div class="filter-row gray">
            <div class="filter-item"> <!-- 1번 -->
            <span class="filter-label">생년월일</span>
            <div class="date-range-container">
              <input 
                v-model="filters.startBirDate"
                type="date" 
                class="filter-input date-input"
              />
              <span class="date-separator">~</span>
              <input 
                v-model="filters.endBirDate"
                type="date" 
                class="filter-input date-input"
              />
            </div>
          </div>

          <div class="filter-item"> <!-- 2번 -->
                <span class="filter-label">계정상태</span> 
                <select 
                v-model="filters.memberFlag"
                class="filter-input"
                >
                <option value="">전체</option>
                <option value="Y">활성</option>
                <option value="N">비활성</option>
                </select>
            </div>
          
          <div class="filter-item"> <!-- 3번 -->
            <span class="filter-label">생성일</span>
            <div class="date-range-container">
              <input 
                v-model="filters.startCreateDate"
                type="date" 
                class="filter-input date-input"
              />
              <span class="date-separator">~</span>
              <input 
                v-model="filters.endCreateDate"
                type="date" 
                class="filter-input date-input"
              />
            </div>
          </div>

        </div>
        
        <!-- 넷째 줄 - 흰색 배경 -->
        <div class="filter-row white">
            <div class="filter-item partial-width"> <!-- 2번 -->
                <span class="filter-label">휴면 상태</span> 
                <select 
                v-model="filters.dromantFlag"
                class="filter-input"
                >
                <option value="">전체</option>
                <option value="Y">휴면</option>
                <option value="N">비휴면</option>
                </select>
            </div>
        </div>


        </div>
      </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const filters = ref({
    code: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    startAge: '',
    endAge: '',
    startBirDate: '',
    endBirDate: '',
    memberFlag: '',
    startCreateDate: '',
    endCreateDate: '',
    dromantFlag: ''
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
  .filter-card {
    margin-top: 50px;
    margin-bottom: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
  }
  
  .section-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
  }
  
  .filter-container {
    display: flex;
    flex-direction: column;
  }
  
  .filter-row {
    display: flex;
    padding: 1rem;
    gap: 1rem;
  }
  
  .filter-row.gray {
    background-color: #f8f9fa;
  }
  
  .filter-row.white {
    background-color: white;
  }
  
  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .partial-width {
    width: 33.33%;
    flex: 0 0 33.33%;
  }

  .filter-label {
    width: 5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .filter-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: white;
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
  
  .button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .search-button {
    padding: 0.5rem 1rem;
    background-color: #0d9488;
    color: white;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .search-button:hover {
    background-color: #0f766e;
  }
  
  .reset-button {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background-color: white;
  }
  
  .reset-button:hover {
    background-color: #f8fafc;
  }
  
  .search-button:focus,
  .reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }
  </style>