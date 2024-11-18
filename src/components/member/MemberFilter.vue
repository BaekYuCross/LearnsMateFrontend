<template>
    <div class="filter-card">
      <div class="section-header">
        <h2 class="section-title">학생</h2>
        <div class="button-group">
          <button @click="search" class="search-button">
            <i class="fas fa-search"></i>
            <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
          </button>
          <button @click="reset" class="reset-button">
            <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
          </button>
        </div>
      </div>
  
      <div class="filter-container">
        <!-- 첫째 줄 - 회색 배경 -->
        <div class="filter-row gray">
          <div class="filter-item">
            <span class="filter-label">학생 코드</span>
            <input v-model="filters.code" type="text" placeholder="학생 코드를 입력하세요" class="filter-input"/>
          </div>
          <div class="filter-item">
            <span class="filter-label">학생 이름</span>
            <input v-model="filters.name" type="text" placeholder="학생 이름을 입력하세요" class="filter-input"/>
          </div>
          <div class="filter-item">
            <span class="filter-label">이메일</span>
            <input v-model="filters.email" type="email" placeholder="이메일을 입력하세요" class="filter-input"/>
          </div>
          <div class="filter-item">
            <span class="filter-label">연락처</span>
            <input v-model="filters.phone" type="text" placeholder="연락처를 입력하세요" class="filter-input"/>
          </div>
        </div>

        <!-- 둘째 줄 - 흰색 배경 -->
        <div class="filter-row white">
          <div class="filter-item">
            <span class="filter-label">주소</span>
            <input v-model="filters.address" type="text" placeholder="주소를 입력하세요" class="filter-input"/>
          </div>
          <div class="filter-item">
            <span class="filter-label">나이</span>
            <div class="date-range-container">
              <input v-model="filters.startAge" type="text" placeholder="시작 나이" class="filter-input"/>
              <span class="date-separator">~</span>
              <input v-model="filters.endAge" type="text" placeholder="끝 나이" class="filter-input"/>
            </div>
          </div>
          <div class="filter-item">
            <span class="filter-label">계정상태</span>
            <select v-model="filters.memberFlag" class="filter-input">
              <option value="">전체</option>
              <option value="Y">활성</option>
              <option value="N">비활성</option>
            </select>
          </div>
          <div class="filter-item">
            <span class="filter-label">휴면상태</span>
            <select v-model="filters.dormantFlag" class="filter-input">
              <option value="">전체</option>
              <option value="Y">휴면</option>
              <option value="N">비휴면</option>
            </select>
          </div>
        </div>

        <!-- 셋째 줄 - 회색 배경 -->
        <div class="filter-row gray">
          <div class="filter-item">
            <span class="filter-label">생년월일</span>
            <div class="date-range-container">
              <input v-model="filters.startBirDate" type="date" class="filter-input date-input"/>
              <span class="date-separator">~</span>
              <input v-model="filters.endBirDate" type="date" class="filter-input date-input"/>
            </div>
          </div>
          <div class="filter-item">
            <span class="filter-label">생성일</span>
            <div class="date-range-container">
              <input v-model="filters.startCreateDate" type="date" class="filter-input date-input"/>
              <span class="date-separator">~</span>
              <input v-model="filters.endCreateDate" type="date" class="filter-input date-input"/>
            </div>
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
    dormantFlag: '',
    startCreateDate: '',
    endCreateDate: '',
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
  margin-bottom: 16px;
  background-color: white;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
  }

.filter-container {
  display: flex;
  flex-direction: column;
}

.filter-row {
  display: flex;
  padding: 3px 10px;
}

.filter-row.gray {
  background-color: #f8f9fa;
}

.filter-row.white {
  background-color: white;
}

.filter-item {
  width: 25%; /* flex 대신 고정 너비 사용 */
  padding: 0 8px; /* 좌우 여백 추가 */
  display: flex;
  align-items: center;
}

.filter-label {
  width: 5rem;
  min-width: 5rem; /* 라벨 너비 고정 */
  font-size: 13px;
  font-weight: 500;
}

.filter-input {
  flex: 1;
  padding: 5px 5px;
  font-size: 13px;
  border: 1px solid #e2e8f0;
  min-width: 0; /* 입력창이 너무 작아지지 않도록 */
  width: 100%; /* 입력창 너비 제한 */
}

/* 나이 범위 입력을 위한 특별 스타일 */
.age-range-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px; /* 간격 축소 */
}

.age-input {
  width: calc(50% - 8px); /* 물결 표시 공간 확보 */
  min-width: 0;
}

.date-separator {
  color: #64748b;
  padding: 0 4px;
  font-size: 12px;
}

/* 날짜 입력 필드용 스타일 */
.date-range-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.date-input {
  width: calc(50% - 8px);
  min-width: 0;
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
  
  .search-button:hover {
    background-color: #004c42;  
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
  }
  
  .search-button:focus,
  .reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }
  </style>