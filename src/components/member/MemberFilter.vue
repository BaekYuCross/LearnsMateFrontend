<template>
  <div class="filter-card">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
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
          <span class="filter-label">{{ memberType }} 코드</span>
          <input v-model="filters.memberCode" type="text" placeholder="코드를 입력하세요" class="filter-input"/>
        </div>
        <div class="filter-item">
          <span class="filter-label">{{ memberType }}명</span>
          <input v-model="filters.memberName" type="text" placeholder="이름을 입력하세요" class="filter-input"/>
        </div>
        <div class="filter-item">
          <span class="filter-label">이메일</span>
          <input v-model="filters.memberEmail" type="email" placeholder="이메일을 입력하세요" class="filter-input"/>
        </div>
        <div class="filter-item">
          <span class="filter-label">연락처</span>
          <input v-model="filters.memberPhone" type="text" placeholder="연락처를 입력하세요" class="filter-input"/>
        </div>
      </div>

      <!-- 둘째 줄 - 흰색 배경 -->
      <div class="filter-row white">
        <div class="filter-item">
          <span class="filter-label">주소</span>
          <input v-model="filters.memberAddress" type="text" placeholder="주소를 입력하세요" class="filter-input"/>
        </div>
        <div class="filter-item">
          <span class="filter-label">나이</span>
          <div class="date-range-container">
            <input v-model="filters.memberStartAge" type="text" placeholder="시작 나이" class="filter-input"/>
            <span class="date-separator">~</span>
            <input v-model="filters.memberEndAge" type="text" placeholder="끝 나이" class="filter-input"/>
          </div>
        </div>
        <div class="filter-item">
          <span class="filter-label">계정상태</span>
          <select v-model="filters.memberFlag" class="filter-input">
            <option value="">전체</option>
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
        </div>
        <div class="filter-item">
          <span class="filter-label">휴면상태</span>
          <select v-model="filters.memberDormantFlag" class="filter-input">
            <option value="">전체</option>
            <option value="true">휴면</option>
            <option value="false">비휴면</option>
          </select>
        </div>
      </div>

      <!-- 셋째 줄 - 회색 배경 -->
      <div class="filter-row gray">
        <div class="filter-item">
          <span class="filter-label">생년월일</span>
          <div class="date-range-container">
            <input v-model="filters.birthStartDate" type="date" class="filter-input date-input"/>
            <span class="date-separator">~</span>
            <input v-model="filters.birthEndDate" type="date" class="filter-input date-input"/>
          </div>
        </div>
        <div class="filter-item">
          <span class="filter-label">생성일</span>
          <div class="date-range-container">
            <input v-model="filters.createdStartDate" type="date" class="filter-input date-input"/>
            <span class="date-separator">~</span>
            <input v-model="filters.createdEndDate" type="date" class="filter-input date-input"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 날짜 변환 헬퍼 함수 추가
const convertToLocalDateTime = (date, isEndDate = false) => {
  if (!date) return null;
  const timeString = isEndDate ? 'T23:59:59' : 'T00:00:00';
  return `${date}${timeString}`;
};

// Props 정의
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['student', 'tutor'].includes(value),
  },
});

// 컴포넌트 데이터 및 computed 속성
const title = computed(() => (props.type === 'student' ? '학생' : '강사'));
const memberType = computed(() => (props.type === 'student' ? '학생' : '강사'));

const filters = ref({
  memberCode: '',
  memberName: '',
  memberEmail: '',
  memberPhone: '',
  memberAddress: '',
  memberStartAge: '',
  memberEndAge: '',
  birthStartDate: '',
  birthEndDate: '',
  memberFlag: '',
  memberDormantFlag: '',
  createdStartDate: '',
  createdEndDate: '',
});

// Emit 정의
const emit = defineEmits(['search', 'reset']);

// MemberFilter.vue의 search 함수 수정
const search = () => {
  const filterData = {
    memberCode: filters.value.memberCode,
    memberName: filters.value.memberName,
    memberEmail: filters.value.memberEmail,
    memberPhone: filters.value.memberPhone,
    memberAddress: filters.value.memberAddress,
    memberStartAge: filters.value.memberStartAge,
    memberEndAge: filters.value.memberEndAge,
    memberFlag: filters.value.memberFlag,
    memberDormantFlag: filters.value.memberDormantFlag,
    birthStartDate: convertToLocalDateTime(filters.value.birthStartDate),
    birthEndDate: convertToLocalDateTime(filters.value.birthEndDate, true),
    createdStartDate: convertToLocalDateTime(filters.value.createdStartDate),
    createdEndDate: convertToLocalDateTime(filters.value.createdEndDate, true),
  };

  // 빈 값 제거
  Object.keys(filterData).forEach(key => {
    if (filterData[key] === '' || filterData[key] === null || filterData[key] === undefined) {
      delete filterData[key];
    }
  });
  
  emit('search', filterData);
};

// 초기화 함수
const reset = () => {
  filters.value = {
    memberCode: '',
    memberName: '',
    memberEmail: '',
    memberPhone: '',
    memberAddress: '',
    memberStartAge: '',
    memberEndAge: '',
    birthStartDate: '',
    birthEndDate: '',
    memberFlag: '',
    memberDormantFlag: '',
    createdStartDate: '',
    createdEndDate: '',
  };
  emit('reset');
};

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
    font-size: 17px;
    font-weight: bold;
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
  background-color: #EFEFEF;
  border-top: #D9D9D9;
  border-bottom: #D9D9D9;
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
  min-width: 5rem;
  font-size: 11px;
  font-weight: 500;
  text-align: end;
  padding-right: 10px;
}

.filter-input {
  flex: 1;
  padding: 5px 5px;
  font-size: 11px;
  border: 1px solid #e2e8f0;
  min-width: 0;
  width: 100%;

  &:focus{
    outline: none;
  }
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
  padding: 0 4px;  /* 0.25rem 대신 4px로 통일 */

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