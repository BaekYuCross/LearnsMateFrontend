<template>
  <div class="layout-container">
    <div class="side-menu"><MemberSideMenu/></div>
    <div class="main-content">
      <MemberFilter 
        type="student" 
        @search="handleSearch" 
        @reset="handleReset"
      />

      <div class="content-section" :class="{ 'with-detail': selectedStudent }">
        <div class="table-container" :class="{ 'shrink': selectedStudent }">
          <div class="header-container">
            <div class="count">전체 학생 수 <span class="count-number">{{ students.length }}</span>명</div>
            <div class="button-group">
              <button class="excel-button">
                <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
              </button>
            </div>
          </div>
            
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>학생 코드</th>
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
                v-for="(student, index) in paginatedStudents" 
                :key="student.member_code"
                @click="showDetail(student)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedStudent?.member_code === student.member_code }"
              >
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ student.member_code }}</td>
                <td>{{ student.member_name }}</td>
                <td>{{ student.member_email }}</td>
                <td>{{ student.member_phone }}</td>
                <td>{{ student.member_address }}</td>
                <td>{{ student.member_age }}</td>
                <td>{{ student.member_birth }}</td>
                <td>{{ student.member_flag === true ? '활성' : '비활성' }}</td>
                <td>{{ student.created_at }}</td>
                <td>{{ student.member_dormant_flag === true ? '휴면' : '활성' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="pagination">
            <button 
              class="page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              ◀이전
            </button>
            <span v-for="page in totalPages" :key="page" class="page-number">
              <button 
                class="page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </span>
            <button 
              class="page-button next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >
              다음▶
            </button>
          </div>
        </div>

        <div v-if="selectedStudent" class="detail-container">
          <div class="detail-content">
            <h3>상세 정보</h3>
            <div class="info-grid">
              <div class="info-item" v-for="(value, key) in selectedStudent" :key="key">
                <span class="label">{{ key }}</span>
                <span>{{ value }}</span>
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

// 날짜 변환 헬퍼 함수
const convertToLocalDateTime = (date, isEndDate = false) => {
  if (!date) return null;
  
  // 날짜 문자열에 시간 추가
  const timeString = isEndDate ? 'T23:59:59' : 'T00:00:00';
  return `${date}${timeString}`;
};

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

const selectedStudent = ref(null);
const currentPage = ref(1);
const pageSize = 15;
const students = ref([]);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2NjkzMSwiZXhwIjoxNzc1MjY2OTMxfQ.CJuiirAQ9dsPG5_uDuM4lwCC4zczgFIvURxycLzmZsoF86lO4DfkRlR10gdBgWrAtk4apIrABNawISfVwgx47w';


// 전체 학생 목록 가져오기
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      headers: {
        Authorization: token,
      },
    });
    students.value = response.data;
    console.log(students.value);
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      camelToSnake(filterData), // Camel Case → Snake Case 변환
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    students.value = response.data;
    currentPage.value = 1;
    selectedStudent.value = null;
  } catch (error) {
    console.error('Failed to filter students:', error);
  }
};

// 초기화
const handleReset = () => {
  fetchStudents();
  currentPage.value = 1;
  selectedStudent.value = null;
};

onMounted(() => {
  fetchStudents();
});

// 페이지네이션 관련
const totalPages = computed(() => Math.ceil(students.value.length / pageSize));
const paginatedStudents = computed(() =>
  students.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    selectedStudent.value = null;
  }
};

const showDetail = (student) => {
  selectedStudent.value = selectedStudent.value?.member_code === student.member_code ? null : student;
};
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
}

.side-menu {
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #006D5C;
  z-index: 100;
}

.main-content {
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
  white-space: nowrap;
  background-color: #f8f9fa;
}

.content-section {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.table-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.table-container.shrink {
  flex: 0 0 50%;
}

.detail-container {
  flex: 0 0 40%;
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

.selected {
  background-color: #e2e8f0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  gap: 20px;
}

.label {
  color: #64748b;
  min-width: 100px;
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

.pagination {
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

.page-button {
  background: none;
  border: none;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 13px;
}

.page-button.active {
  font-weight: bold;
  color: #006D5C;
}

.page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.count {
  font-size: 17px;
  font-weight: bold;
  color: #333;
}

.count-number {
  color: #006D5C;
  font-weight: bold;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.excel-button {
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

.excel-button img {
  width: 16px;
  height: 16px;
}

.detail-content h3 {
  margin-bottom: 20px;
  color: #333;
}
</style>