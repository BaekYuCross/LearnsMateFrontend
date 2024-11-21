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
          <div class="student-header-container">
            <div class="count">전체 학생 수 <span class="count-number">{{ totalCount }}</span>명</div>
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
                v-for="(student, index) in students" 
                :key="student.memberCode"
                @click="showDetail(student)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedStudent?.memberCode === student.memberCode }"
              >
                <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
                <td>{{ student.memberCode }}</td>
                <td>{{ student.memberName }}</td>
                <td>{{ student.memberEmail }}</td>
                <td>{{ student.memberPhone }}</td>
                <td>{{ student.memberAddress }}</td>
                <td>{{ student.memberAge }}</td>
                <td>{{ student.memberBirth }}</td>
                <td>{{ student.memberFlag === true ? '활성' : '비활성' }}</td>
                <td>{{ student.createdAt }}</td>
                <td>{{ student.memberDormantFlag === true ? '휴면' : '활성' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="pagination">
            <button class="page-button prev-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">◀</button>
            <button class="page-button" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
            <span v-if="startPage > 2">...</span>
            <template v-for="page in displayedPages" :key="page">
              <button v-if="page !== 1 && page !== totalPages" class="page-button" :class="{ active: currentPage === page }" @click="changePage(page)">{{ page }}</button>
            </template>
            <span v-if="endPage < totalPages - 1">...</span>
            <button v-if="totalPages > 1" class="page-button" :class="{ active: currentPage === totalPages }" @click="changePage(totalPages)">{{ totalPages }}</button>
            <button class="page-button next-button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">▶</button>
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
import axios from '@/plugins/axios';

import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';
import '@/assets/css/member/StudentView.css'

const selectedStudent = ref(null);
const students = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2NjkzMSwiZXhwIjoxNzc1MjY2OTMxfQ.CJuiirAQ9dsPG5_uDuM4lwCC4zczgFIvURxycLzmZsoF86lO4DfkRlR10gdBgWrAtk4apIrABNawISfVwgx47w';

// 전체 학생 목록 가져오기
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        Authorization: token,
      },
    });
    
    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    console.log(students.value);
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;

    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      camelToSnake(filterData),
      {
        params: {
          page: currentPage.value - 1,
          size: pageSize
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    selectedStudent.value = null;
  } catch (error) {
    console.error('Failed to filter students:', error);
  }
};

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedStudent.value = null;
  fetchStudents();
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    // 필터링된 상태일 때는 같은 필터 조건으로 해당 페이지 데이터 요청
    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      camelToSnake(lastFilterData.value),
      {
        params: {
          page: currentPage.value - 1,
          size: pageSize
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } else {
    await fetchStudents();
  }
  
  selectedStudent.value = null;
};
const displayedPages = computed(() => {
  // 앞뒤로 2페이지씩 보이도록 수정
  let start = Math.max(currentPage.value - 2, 2);
  let end = Math.min(start + 4, totalPages.value - 1); // 4로 변경하여 더 많은 페이지 표시
  
  // end가 마지막 페이지에 가까울 때 start를 조정
  if (end === totalPages.value - 1) {
    start = Math.max(end - 4, 2); // 마찬가지로 4로 변경
  }
  
  // start가 2에 가까울 때 end를 조정
  if (start === 2) {
    end = Math.min(6, totalPages.value - 1); // 첫 페이지 다음부터 5개 페이지 표시
  }
  
  let pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const startPage = computed(() => {
  return displayedPages.value[0];
});

const endPage = computed(() => {
  return displayedPages.value[displayedPages.value.length - 1];
});

const showDetail = async (student) => {
  if (selectedStudent.value?.memberCode === student.memberCode) {
    selectedStudent.value = null;
    // reportDetails.value = [];
  } else {
    selectedStudent.value = student;
    try {
      const response = await axios.get(`http://localhost:5000/member/student/${student.memberCode}`, {
          headers: {
            Authorization: token,
          },
        }
      );
      // reportDetails.value = response.data;
      // console.log('학생 상세 정보:', reportDetails.value);
    } catch (error) { 
      console.error('Failed to load student details:', error);
      // reportDetails.value = []; 
    }
  }
};
onMounted(() => {
  fetchStudents();
});
</script>