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
            <button 
              class="page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              ◀
            </button>
            
            <template v-for="page in displayedPages" :key="page">
              <span v-if="page === '...'" class="page-dots">...</span>
              <button 
                v-else
                class="page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </template>
            
            <button 
              class="page-button next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >
              ▶
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
import axios from '@/plugins/axios';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';
import '@/assets/css/member/StudentView.css';

const selectedStudent = ref(null);
const students = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjMzNDYzNSwiZXhwIjoxNzc1NTM0NjM1fQ.mGz_-KbPzd7aO5FDq9ij_odcIJo2V2fmgOQgb2-qB87WXfieAiNPtFuNUwe42QHBJtt_Zo4EgtL1vKU32OP6CQ';

// 학생 목록 가져오기 (일반 조회)
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      params: {
        page: currentPage.value - 1, // 0-based page
        size: pageSize,
      },
      headers: {
        Authorization: token,
      },
    });

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

// 필터링된 학생 목록 가져오기
const fetchFilteredStudents = async () => {
  if (!lastFilterData.value) return;  // lastFilterData가 없으면 종료

  try {
    console.log('Sending filter data:', lastFilterData.value);  // 디버깅용

    // 날짜 데이터가 있는 경우 ISO 문자열로 변환
    const processedFilterData = {
      ...lastFilterData.value,
      birthStartDate: lastFilterData.value.birthStartDate ? new Date(lastFilterData.value.birthStartDate).toISOString() : null,
      birthEndDate: lastFilterData.value.birthEndDate ? new Date(lastFilterData.value.birthEndDate).toISOString() : null,
      createdStartDate: lastFilterData.value.createdStartDate ? new Date(lastFilterData.value.createdStartDate).toISOString() : null,
      createdEndDate: lastFilterData.value.createdEndDate ? new Date(lastFilterData.value.createdEndDate).toISOString() : null,
    };

    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      processedFilterData,  // 가공된 필터 데이터 사용
      {
        params: {
          page: currentPage.value - 1,
          size: pageSize,
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Filter response:', response.data);  // 디버깅용

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch filtered students:', error);
    if (error.response?.data) {
      console.error('Error response:', error.response.data);
    }
  }
};

// 페이지 변경 처리
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;

  currentPage.value = newPage;

  if (isFiltered.value) {
    await fetchFilteredStudents();
  } else {
    await fetchStudents();
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  isFiltered.value = true;
  lastFilterData.value = filterData;
  currentPage.value = 1;
  await fetchFilteredStudents();
};

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  fetchStudents();
};

const displayedPages = computed(() => {
  const pages = [];
  // const range = 2;
  
  pages.push(1);

  if (currentPage.value - 1 > 2) {
    pages.push('...');
  }
  
  for (let i = Math.max(2, currentPage.value - 2); 
       i <= Math.min(totalPages.value - 1, currentPage.value + 2); 
       i++) {
    pages.push(i);
  }
  
  if (totalPages.value - currentPage.value > 2) {
    pages.push('...');
  }
  
  // 마지막 페이지 추가 (첫 페이지와 같지 않은 경우만)
  if (totalPages.value > 1) {
    pages.push(totalPages.value);
  }
  
  return pages;
});

// 학생 상세 보기
const showDetail = async (student) => {
  if (selectedStudent.value?.memberCode === student.memberCode) {
    selectedStudent.value = null;
  } else {
    selectedStudent.value = student;
    try {
      const response = await axios.get(
        `http://localhost:5000/member/student/${student.memberCode}`,
        { headers: { Authorization: token } }
      );
      console.log('Student details:', response.data);
    } catch (error) {
      console.error('Failed to load student details:', error);
    }
  }
};

// 초기 로드
onMounted(() => {
  fetchStudents();
});
</script>
