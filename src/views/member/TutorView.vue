<template>
  <div class="tutor-layout-container">
    <div class="tutor-side-menu"><MemberSideMenu/></div>
    <div class="tutor-main-content">
      <MemberFilter 
        type="tutor" 
        @search="handleSearch" 
        @reset="handleReset"
      />

      <div class="tutor-content-section" :class="{ 'with-detail': selectedTutor }">
        <div class="tutor-table-container" :class="{ 'shrink': selectedTutor }">
          <div class="header-container">
            <div class="tutor-count">전체 강사 수 <span class="count-number">{{ tutors.length }}</span>명</div>
            <div class="tutor-button-group">
              <button class="tutor-excel-button">
                <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
              </button>
            </div>
          </div>
            
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>강사 코드</th>
                <th>이름</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>주소</th>
                <th>나이</th>
                <th>생년월일</th>
                <th>계정상태</th>
                <th>생성일</th>
                <th>휴면상태</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(tutor, index) in paginatedTutors" 
                :key="tutor.member_code"
                @click="showDetail(tutor)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'tutor-selected': selectedTutor?.member_code === tutor.member_code }"
              >
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ tutor.member_code }}</td>
                <td>{{ tutor.member_name }}</td>
                <td>{{ tutor.member_email }}</td>
                <td>{{ tutor.member_phone }}</td>
                <td>{{ tutor.member_address }}</td>
                <td>{{ tutor.member_age }}</td>
                <td>{{ tutor.member_birth }}</td>
                <td>{{ tutor.member_flag === true ? '활성' : '비활성' }}</td>
                <td>{{ tutor.created_at }}</td>
                <td>{{ tutor.member_dormant_flag === true ? '휴면' : '활성' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- template의 페이지네이션 부분 수정 -->
          <div class="tutor-pagination">
            <button 
              class="tutor-page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              ◀이전
            </button>
            <span v-for="page in visiblePages" :key="page" class="tutor-page-number">
              <button 
                class="tutor-page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </span>
            <button 
              class="tutor-page-button next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >
              다음▶
            </button>
          </div>
        </div>

        <div v-if="selectedTutor" class="tutor-detail-container">
        <div class="tutor-detail-content">
          <h3>상세 정보</h3>
          <div class="tutor-info-grid">
            <!-- 기본 정보 -->
            <div class="tutor-info-item">
              <span class="tutor-label">강사 코드</span>
              <span>{{ selectedTutor.member_code }}</span>
            </div>
            <div class="tutor-info-item">
              <span class="tutor-label">이름</span>
              <span>{{ selectedTutor.member_name }}</span>
            </div>
            <div class="tutor-info-item">
              <span class="tutor-label">이메일</span>
              <span>{{ selectedTutor.member_email }}</span>
            </div>
            <div class="tutor-info-item">
              <span class="tutor-label">연락처</span>
              <span>{{ selectedTutor.member_phone }}</span>
            </div>
            <div class="tutor-info-item">
              <span class="tutor-label">주소</span>
              <span>{{ selectedTutor.member_address }}</span>
            </div>
      
                    <!-- 강의 정보 -->
          <div v-if="tutorDetail?.tutorLectureDetailList?.length" class="lecture-section">
            <h4 class="lecture-title">강의 목록</h4>
            <div class="lecture-list">
              <div v-for="lecture in tutorDetail.tutorLectureDetailList" 
                  :key="lecture.lectureCode" 
                  class="lecture-item">
                <div class="lecture-header">
                  <span class="lecture-name">{{ lecture.lectureTitle }}</span>
                </div>
                <div class="lecture-stats">
                  <span class="stat-item">
                    <strong>강의 수:</strong> {{ lecture.videoCount }}개
                  </span>
                  <span class="stat-item">
                    <strong>수강생:</strong> {{ lecture.totalStudents }}명
                  </span>
                </div>
              </div>
            </div>
          </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';

const selectedTutor = ref(null);
const currentPage = ref(1);
const pageSize = 15;
const tutors = ref([]);
const tutorDetail = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjA3OTAxOSwiZXhwIjoxNzc1Mjc5MDE5fQ._JTJSjD1BhNEOBbx3ZUYDVHgjeWplEjqOoj99imN_7aGyvkPyVihF8dU23HWlX6s3TO0GfAaMP4wgqaOS29zKw';

// Snake Case 변환 헬퍼 함수
const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};
// Snake Case to Camel Case 변환 헬퍼 함수 추가
const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

// 전체 강사 목록 가져오기
const fetchTutors = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/tutors', {
      headers: {
        Authorization: token,
      },
    });
    tutors.value = response.data;
    console.log(tutors.value);
  } catch (error) {
    console.error('Failed to fetch tutors:', error);
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/member/filter/tutor',
      camelToSnake(filterData),
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    tutors.value = response.data;
    currentPage.value = 1;
    selectedTutor.value = null;
  } catch (error) {
    console.error('Failed to filter tutors:', error);
  }
};

// 초기화
const handleReset = () => {
  fetchTutors();
  currentPage.value = 1;
  selectedTutor.value = null;
};

onMounted(() => {
  fetchTutors();
});

// 페이지네이션 관련
const totalPages = computed(() => Math.ceil(tutors.value.length / pageSize));
const paginatedTutors = computed(() =>
  tutors.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    selectedTutor.value = null;
  }
};

// script 부분에 추가할 computed 속성
const visiblePages = computed(() => {
  const maxVisible = 11; // 최대 보여질 페이지 수
  const halfVisible = Math.floor(maxVisible / 2); // 현재 페이지 기준 양쪽에 보여질 페이지 수
  
  let startPage = Math.max(currentPage.value - halfVisible, 1);
  let endPage = Math.min(startPage + maxVisible - 1, totalPages.value);
  
  // endPage가 totalPages보다 작을 때, startPage를 조정
  if (endPage - startPage + 1 < maxVisible && startPage > 1) {
    startPage = Math.max(endPage - maxVisible + 1, 1);
  }
  
  // startPage가 1일 때, endPage를 조정
  if (startPage === 1) {
    endPage = Math.min(maxVisible, totalPages.value);
  }
  
  return Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );
});

const showDetail = async (tutor) => {
  if (selectedTutor.value?.member_code === tutor.member_code) {
    selectedTutor.value = null;
    tutorDetail.value = null;
  } else {
    selectedTutor.value = tutor;
    try {
      const response = await axios.get(`http://localhost:5000/member/tutor/${tutor.member_code}`, {
        headers: {
          Authorization: token,
        },
      });
      // snake_case를 camelCase로 변환
      const convertedData = snakeToCamel(response.data);
      tutorDetail.value = convertedData;
      console.log(tutorDetail.value);
    } catch (error) {
      console.error('Failed to load tutor detail:', error);
    }
  }
};
</script>

  <style scoped>
  .tutor-layout-container {
    display: flex;
    min-height: 100vh;
  }
  
  .tutor-side-menu {
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #006D5C;
    z-index: 100;
  }
  
  .tutor-main-content {
    flex: 1;
    margin-left: 160px;
    padding: 20px;
    min-height: 100vh;
  }
  
  .header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 10px 20px;
  width: 100%;
  white-space: nowrap; /* 줄바꿈 방지 */
  background-color: #f8f9fa;
}

  
  .tutor-content-section {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  
  .tutor-table-container {
  display: flex;
  flex-direction: column; /* 수직 방향으로 배치 */
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
  }
  
  .tutor-table-container.shrink {
    flex: 0 0 50%;
  }

  .tutor-detail-container {
  flex: 0 0 40%; /* 50%에서 40%로 변경 */
  opacity: 1;
  transform: translateX(0);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
  
  table {
    width: 100%;
    min-width: 1200px;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
    font-size: 11px;
  }
  
  th {
    font-size: 13px;
  }
  
  .tutor-selected {
    background-color: #e2e8f0;
  }
  
  .tutor-info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
  
.tutor-info-item {
  display: flex;
  gap: 20px;
}
  
.tutor-label {
  color: #64748b;
  min-width: 100px; /* 레이블 너비 통일 */
  text-align: left;
}
  
  /* 각 열의 너비 지정 */
  th:nth-child(1), td:nth-child(1) { width: 100px; }
  th:nth-child(2), td:nth-child(2) { width: 100px; }
  th:nth-child(3), td:nth-child(3) { width: 150px; }
  th:nth-child(4), td:nth-child(4) { width: 120px; }
  th:nth-child(5), td:nth-child(5) { width: 200px; }
  th:nth-child(6), td:nth-child(6) { width: 80px; }
  th:nth-child(7), td:nth-child(7) { width: 100px; }
  th:nth-child(8), td:nth-child(8) { width: 100px; }
  th:nth-child(9), td:nth-child(9) { width: 100px; }
  th:nth-child(10), td:nth-child(10) { width: 100px; }
  
  .tutor-pagination {
    position: sticky;
    left: 0;
    right: 0;
    background: white;
    padding: 20px 0;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  
  .tutor-page-button {
    background: none;
    border: none;
    color: #333;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 13px;
  }
  
  .tutor-page-button.active {
    font-weight: bold;
    color: #006D5C;
  }
  
  .tutor-page-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .tutor-count {
    font-size: 17px;
    font-weight: bold;
    color: #333;
  }
  
  .count-number {
    color: #006D5C;
    font-weight: bold;
  }
  
  .tutor-button-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
  
  .tutor-excel-button {
    display: flex;
    align-items: center;
    background: #005950;
    padding: 2px 5px;
    margin-bottom: 3px;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 13px;
  }
  
  .tutor-excel-button img {
    width: 16px;
    height: 16px;
  }



  .tutor-lectures {
  margin-top: 20px;
}

.lecture-item {
  padding: 8px 8px 8px 100px; /* 왼쪽 패딩을 레이블과 맞춤 */
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.lecture-item {
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.tutor-detail-content h4 {
  margin: 20px 0 10px 0;
  color: #64748b;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
}

/* shrink 클래스가 적용될 때 헤더도 함께 줄어들도록 수정 */
.tutor-table-container.shrink .header-container {
  width: 100%;
}

.tutor-table-container.shrink {
  flex: 0 0 50%;
}

.lecture-section {
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.lecture-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

.lecture-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lecture-item {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.lecture-header {
  margin-bottom: 8px;
}

.lecture-name {
  font-weight: 500;
  color: #333;
}

.lecture-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.stat-item strong {
  color: #333;
}

  </style>