<template>
  <div class="filter-card">
    <div class="section-header">
      <h2 class="section-title">블랙리스트</h2>
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
          <span class="filter-label">블랙 코드</span>
          <input 
            v-model="filters.blackCode" 
            type="text" 
            placeholder="블랙리스트 코드를 입력하세요" 
            class="filter-input"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">{{ memberType }} 코드</span>
          <input 
            v-model="filters.memberCode" 
            type="text" 
            :placeholder="`${memberType} 코드를 입력하세요`" 
            class="filter-input"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">{{ memberType }}명</span>
          <input 
            v-model="filters.memberName" 
            type="text" 
            :placeholder="`${memberType}명을 입력하세요`" 
            class="filter-input"
          />
        </div>
        <div class="filter-item">
          <span class="filter-label">이메일</span>
          <input 
            v-model="filters.memberEmail" 
            type="email" 
            placeholder="이메일을 입력하세요" 
            class="filter-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// type prop 정의
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['student', 'tutor'].includes(value)
  }
})

// 멤버 타입 계산
const memberType = computed(() => props.type === 'student' ? '학생' : '강사')

const filters = ref({
  blackCode: '',
  memberCode: '',
  memberName: '',
  memberEmail: '',
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
  
  .date-separator {
    color: #64748b;
    padding: 0 0.25rem;
  }
  
  .button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .search-button {
    padding: 4px 5px 5px 4px;     
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