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
import '@/assets/css/member/StudentView.css';

const selectedStudent = ref(null);
const students = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const memberCodeCursor = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjMzNDYzNSwiZXhwIjoxNzc1NTM0NjM1fQ.mGz_-KbPzd7aO5FDq9ij_odcIJo2V2fmgOQgb2-qB87WXfieAiNPtFuNUwe42QHBJtt_Zo4EgtL1vKU32OP6CQ';

// 커서 상태를 저장하는 맵 (페이지별 커서를 저장)
const pageCursors = ref(new Map());

// 전체 학생 목록 가져오기
const fetchStudents = async () => {
  try {
    const params = {
      size: pageSize,
    };

    // 첫 페이지는 offset 방식
    if (currentPage.value === 1) {
      params.page = 0;
    } else {
      const cursor = pageCursors.value.get(currentPage.value);
      if (!cursor) {
        console.error('No cursor available for page:', currentPage.value);
        return;
      }
      params.memberCodeCursor = cursor;
    }

    const response = await axios.get('http://localhost:5000/member/students', {
      params,
      headers: {
        Authorization: token,
      },
    });

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

    // 다음 페이지 커서 저장
    if (response.data.nextCursor) {
      const nextPage = currentPage.value + 1;
      pageCursors.value.set(nextPage, response.data.nextCursor); // 커서 저장
      console.log(`Cursor for page ${nextPage}:`, response.data.nextCursor);
    } else {
      console.warn('No nextCursor in response for page:', currentPage.value);
    }
  } catch (error) {
    console.error('Failed to fetch students:', error);
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
  }
};
// 필터링된 학생 목록 가져오기
const fetchFilteredStudents = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      lastFilterData.value,
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

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

    console.log('Filtered API Response:', response.data);
  } catch (error) {
    console.error('Failed to fetch filtered students:', error);
  }
};
// 페이지 변경 처리
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;

  currentPage.value = newPage;

  if (isFiltered.value) {
    // 필터링된 상태일 때
    await fetchFilteredStudents();
  } else {
    // 일반 페이징
    await fetchStudents();
  }

  selectedStudent.value = null; // 선택된 학생 초기화
};

// 필터링 검색
const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true; // 필터링 활성화
    lastFilterData.value = filterData; // 필터 데이터 저장
    currentPage.value = 1; // 페이지 초기화
    pageCursors.value.clear(); // 커서 초기화

    await fetchFilteredStudents();
  } catch (error) {
    console.error('Failed to search students with filters:', error);
  }
};

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedStudent.value = null;

  memberCodeCursor.value = null;
  pageCursors.value.clear();
  fetchStudents();
};

const displayedPages = computed(() => {
  const start = Math.max(currentPage.value - 2, 2);
  const end = Math.min(start + 4, totalPages.value - 1);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const startPage = computed(() => {
  return displayedPages.value.length > 0 ? displayedPages.value[0] : 1;
});

const endPage = computed(() => {
  return displayedPages.value.length > 0 ? displayedPages.value[displayedPages.value.length - 1] : totalPages.value;
});

// 학생 상세 정보 보기
const showDetail = async (student) => {
  if (selectedStudent.value?.memberCode === student.memberCode) {
    selectedStudent.value = null;
  } else {
    selectedStudent.value = student;
    try {
      const response = await axios.get(
        `http://localhost:5000/member/student/${student.memberCode}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('Student details:', response.data);
    } catch (error) {
      console.error('Failed to load student details:', error);
    }
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchStudents();
});
</script>
