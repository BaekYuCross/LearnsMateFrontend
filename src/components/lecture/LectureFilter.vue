<template>
    <div class="lecture-filter-card">
      <div class="lecture-filter-container">
        <div class="lecture-section-header">
          <h2 class="lecture-section-title">강의</h2>
          <div class="lecture-button-group">
            <button @click="handleSearch" class="lecture-search-button">
              <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
            </button>
            <button @click="handleReset" class="lecture-reset-button">
              <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
            </button>
          </div>
        </div>
  
        <div class="lecture-filter-row gray">
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">강의 코드</span>
            <input 
              v-model="filterData.lectureCode" 
              type="text" 
              placeholder="강의 코드를 입력하세요"
              class="lecture-filter-input"
            />
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">강의명</span>
            <input 
              v-model="filterData.lectureTitle" 
              type="text" 
              placeholder="강의명을 입력하세요"
              class="lecture-filter-input"
            />
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">카테고리</span>
            <select v-model="filterData.lectureCategoryName" class="lecture-filter-input">
              <option value="">카테고리를 선택하세요</option>
              <option value="BACKEND">백엔드</option>
              <option value="FRONTEND">프론트엔드</option>
              <option value="DEVOPS">데브옵스/인프라</option>
              <option value="DATABASE">데이터베이스</option>
              <option value="WEB_DEVELOPMENT">웹 개발</option>
              <option value="MOBILE_APP_DEVELOPMENT">모바일 앱 개발</option>
              <option value="FULL_STACK">풀스택</option>
            </select>
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">난이도</span>
            <select v-model="filterData.lectureLevel" class="lecture-filter-input">
              <option value="">난이도를 선택하세요</option>
              <option value="BEGINNER">입문</option>
              <option value="INTERMEDIATE">중급</option>
              <option value="ADVANCED">고급</option>
            </select>
          </div>
        </div>
  
        <div class="lecture-filter-row white">
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">강사명</span>
            <input 
              v-model="filterData.tutorName" 
              type="text" 
              placeholder="강사명을 입력하세요"
              class="lecture-filter-input"
            />
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">강사 코드</span>
            <input 
              v-model="filterData.tutorCode" 
              type="text" 
              placeholder="강사 코드를 입력하세요"
              class="lecture-filter-input"
            />
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">승인 상태</span>
            <select v-model="filterData.lectureConfirmStatus" class="lecture-filter-input">
              <option value="">승인 상태를 선택하세요</option>
              <option :value="true">승인완료</option>
              <option :value="false">미승인</option>
            </select>
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">강의 상태</span>
            <select v-model="filterData.lectureStatus" class="lecture-filter-input">
              <option value="">강의 상태를 선택하세요</option>
              <option :value="true">운영중</option>
              <option :value="false">종료</option>
            </select>
          </div>
        </div>
  
        <div class="lecture-filter-row gray">
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">가격 범위</span>
            <div class="lecture-price-range-container">
              <input 
                v-model="filterData.minPrice" 
                type="number" 
                placeholder="최소"
                class="lecture-filter-input lecture-price-input"
              />
              <span class="lecture-price-separator">~</span>
              <input 
                v-model="filterData.maxPrice" 
                type="number" 
                placeholder="최대"
                class="lecture-filter-input lecture-price-input"
              />
            </div>
          </div>
          <div class="lecture-filter-item">
            <span class="lecture-filter-label">등록일</span>
            <div class="lecture-date-range-container">
              <input 
                v-model="filterData.startCreatedAt" 
                type="date" 
                class="lecture-filter-input lecture-date-input"
              />
              <span class="lecture-date-separator">~</span>
              <input 
                v-model="filterData.endCreatedAt" 
                type="date" 
                class="lecture-filter-input lecture-date-input"
              />
            </div>
          </div>
          <div class="lecture-filter-item"></div>
          <div class="lecture-filter-item"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const filterData = ref({
    lectureCode: '',
    lectureTitle: '',
    tutorCode: '',
    tutorName: '',
    lectureCategoryName: '',
    lectureLevel: '',
    lectureConfirmStatus: '',
    lectureStatus: '',
    minPrice: '',
    maxPrice: '',
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
  .lecture-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .lecture-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .lecture-section-title {
    font-size: 17px;
    font-weight: bold;
  }
  
  .lecture-filter-container {
    display: flex;
    flex-direction: column;
  }
  
  .lecture-filter-row {
    display: flex;
    padding: 3px 10px;
  }
  
  .lecture-filter-row.gray {
    background-color: #EFEFEF;
    border-top: #D9D9D9;
    border-bottom: #D9D9D9;
  }
  
  .lecture-filter-row.white {
    background-color: white;
  }
  
  .lecture-filter-item {
    width: 25%;
    padding-left: 8px;
    display: flex;
    align-items: center;
  }
  
  .lecture-filter-label {
    width: 5rem;
    min-width: 5rem;
    font-size: 11px;
    font-weight: 500;
    text-align: end;
    padding-right: 10px;
  }
  
  .lecture-filter-input {
    flex: 1;
    padding: 5px 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    min-width: 0;
    width: 100%;
  }
  
  .lecture-date-range-container,
  .lecture-price-range-container {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .lecture-date-input,
  .lecture-price-input {
    width: calc(50% - 8px);
    min-width: 0;
  }
  
  .lecture-date-separator,
  .lecture-price-separator {
    color: #64748b;
    padding: 0 0.25rem;
  }
  
  .lecture-button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .lecture-search-button {
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
  
  .lecture-reset-button {
    padding: 4px 5px 3px;   
    border: 1px solid #A29D9D;
    border-radius: 4px;
    font-size: 10px;
    background-color: white;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .lecture-search-button:hover {
    background-color: #004c42;  
  }
  
  .lecture-reset-button:hover {
    background-color: #f8fafc;
  }
  
  .lecture-search-button:focus,
  .lecture-reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }
  </style>
