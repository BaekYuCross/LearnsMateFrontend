<template>
    <div class="campaign-filter-card">
      <div class="campaign-section-header">
        <h2 class="campaign-section-title">캠페인</h2>
        <div class="campaign-button-group">
          <button @click="search" class="campaign-search-button">
            <i class="fas fa-search"></i>
            <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
          </button>
          <button @click="reset" class="reset-button">
            <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
          </button>
        </div>
      </div>
  
      <div class="campaign-filter-container">
        <!-- 첫째 줄 - 회색 배경 -->
        <div class="campaign-filter-row gray">
        <div class="campaign-filter-item">
            <span class="campaign-filter-label">캠페인 제목</span>
            <input 
                v-model="filters.campaignTitle"
                type="text" 
                placeholder="캠페인 제목을 입력하세요"
                class="campaign-filter-input"
            />
        </div>
        <div class="campaign-filter-item">
            <span class="campaign-filter-label">게시일</span>
            <div class="campaign-date-range-container">
              <input 
                v-model="filters.campaignStartPostDate"
                type="date" 
                class="campaign-filter-input date-input"
              />
              <span class="campaign-date-separator">~</span>
              <input 
                v-model="filters.campaignEndPostDate"
                type="date" 
                class="campaign-filter-input date-input"
              />
            </div>
        </div>
        <div class="campaign-filter-item">
            <span class="campaign-filter-label">발송 타입</span>
            <select 
                v-model="filters.campaignType"
                class="campaign-filter-input"
                >
                <option value="">전체</option>
                <option value="instant">즉시 발송</option>
                <option value="reservation">예약 발송</option>
                </select>
          </div>

          <div class="campaign-filter-item"> <!-- 1번 -->
            <span class="campaign-filter-label">발송 현황</span>
            <select 
                v-model="filters.campaignStatus"
                class="campaign-filter-input"
                >
                <option value="">전체</option>
                <option value="completed">발송 완료</option>
                <option value="scheduled">발송 예정</option>
                </select>
          </div>
        </div>
        </div>
      </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const filters = ref({
    campaignTitle: '',
    campaignStartPostDate: '',
    campaignEndPostDate: '',
    campaignType: '',
    campaignStatus: '', 
  })
  
  const emit = defineEmits(['search', 'reset'])

  const convertToLocalDateTime = (date, isEndDate = false) => {
    if (!date) return null; 
    const timeString = isEndDate ? 'T23:59:59' : 'T00:00:00';
    return `${date}${timeString}`; 
  };

  const prepareFilters = (filters) => {
    return {
      ...filters,
      campaignStartPostDate: convertToLocalDateTime(filters.campaignStartPostDate), // 시작 날짜 변환
      campaignEndPostDate: convertToLocalDateTime(filters.campaignEndPostDate, true), // 종료 날짜 변환
    };
  };
  
  const search = () => {
    const preparedFilters = prepareFilters(filters.value);
    console.log(preparedFilters); 
    emit('search', preparedFilters); 
  };

  
  const reset = () => {
    Object.keys(filters.value).forEach(key => {
      filters.value[key] = ''
    })
    emit('reset')
  }
  </script>
  
  <style scoped>
  .campaign-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 50px;
    margin-left: 160px;
  }
  
  .campaign-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .campaign-section-title {
    font-size: 17px;
    font-weight: bold;
  }
  
  .campaign-filter-container {
    display: flex;
    flex-direction: column;
  }
  
  .campaign-filter-row {
    display: flex;
    padding: 3px 10px;
  }
  
  .campaign-filter-row.gray {
    background-color: #EFEFEF;
    border-top: #D9D9D9;
    border-bottom: #D9D9D9;
  }
  
  .campaign-filter-row.white {
    background-color: white;
  }
  
  .campaign-filter-item {
    width: 25%;
    padding-left: 8px;
    display: flex;
    align-items: center;

  }

  .partial-width {
    width: 33.33%;
    flex: 0 0 33.33%;
  }

  .campaign-filter-label {
    width: 5rem;
    min-width: 5rem;
    font-size: 11px;
    font-weight: 500;
    text-align: end;
    padding-right: 10px;
  }
  
  .campaign-filter-input {
    flex: 1;
    padding: 5px 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    min-width: 0;
    width: 100%;
    outline: none;
  }

  .campaign-date-range-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .date-input {
    flex: 1;
  }
  
  .campaign-date-separator {
    color: #64748b;
    padding: 0 0.25rem;
  }
  
  .campaign-button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .campaign-search-button {
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
  
  .campaign-search-button:hover {
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
  
  .campaign-search-button:focus,
  .reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
  }

  input:focus {
    outline: none; 
  }
  </style>