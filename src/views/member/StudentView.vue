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
          <!-- 전체 학생 수 표시 -->
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
                :key="student.code"
                @click="showDetail(student)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedStudent?.code === student.code }"
              >
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ student.code }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.phone }}</td>
                <td>{{ student.address }}</td>
                <td>{{ student.age }}</td>
                <td>{{ student.birthDate }}</td>
                <td>{{ student.memberFlag === 'Y' ? '활성' : '비활성' }}</td>
                <td>{{ student.createDate }}</td>
                <td>{{ student.dormantFlag === 'Y' ? '휴면' : '활성' }}</td>
              </tr>
            </tbody>
          </table>

          <!-- 페이지네이션 -->
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
              <div class="info-item">
                <span class="label">학생 코드</span>
                <span>{{ selectedStudent.code }}</span>
              </div>
              <div class="info-item">
                <span class="label">이름</span>
                <span>{{ selectedStudent.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">이메일</span>
                <span>{{ selectedStudent.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">연락처</span>
                <span>{{ selectedStudent.phone }}</span>
              </div>
              <div class="info-item">
                <span class="label">생년월일</span>
                <span>{{ selectedStudent.birthDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">주소</span>
                <span>{{ selectedStudent.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';

const selectedStudent = ref(null);
const currentPage = ref(1);
const pageSize = 15; // 한 페이지당 보여줄 항목 수

const students = ref([
  // 더미 데이터 예시
  {
    code: 1,
    name: '김철수',
    email: 'test@example.com',
    phone: '010-1234-5678',
    birthDate: '1999-01-01',
    address: '서울시 강남구'
  },
  {
    code: 'STD002',
    name: '이영희',
    email: 'lee@example.com',
    phone: '010-2345-6789',
    address: '서울시 서초구 서초동',
    age: '23',
    birthDate: '2001-03-15',
    memberFlag: 'Y',
    createDate: '2024-01-20',
    dormantFlag: 'N'
  },
])

// 더미 데이터 20개로 확장
const expandData = () => {
  const baseData = students.value.slice(0, 2);
  for (let i = 3; i <= 20; i++) {
    students.value.push({
      ...baseData[i % 2],
      code: `STD${String(i).padStart(3, '0')}`,
    });
  }
};
expandData();

// 페이지네이션 관련 computed 속성들
const totalPages = computed(() => Math.ceil(students.value.length / pageSize));

const paginatedStudents = computed(() => 
  students.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);

// 페이지 변경 함수
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    selectedStudent.value = null;
  }
};

const showDetail = (student) => {
  if (selectedStudent.value?.code === student.code) {
    selectedStudent.value = null;
  } else {
    selectedStudent.value = student;
  }
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
  background-color: #f8f9fa;
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