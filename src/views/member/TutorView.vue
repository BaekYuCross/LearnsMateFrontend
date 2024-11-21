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
          <div class="tutor-header-container">
            <div class="tutor-count">전체 강사 수 <span class="count-number">{{ totalCount }}</span>명</div>
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
                v-for="(tutor, index) in tutors" 
                :key="tutor.member_code"
                @click="showDetail(tutor)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'tutor-selected': selectedTutor?.member_code === tutor.member_code }"
              >
                <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
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

          <div class="tutor-pagination">
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
import '@/assets/css/member/TutorView.css'

const selectedTutor = ref(null);
const tutors = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const tutorDetail = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjA3OTAxOSwiZXhwIjoxNzc1Mjc5MDE5fQ._JTJSjD1BhNEOBbx3ZUYDVHgjeWplEjqOoj99imN_7aGyvkPyVihF8dU23HWlX6s3TO0GfAaMP4wgqaOS29zKw';

// Snake Case 변환 함수
const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

// Snake to Camel Case 변환 함수
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
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        Authorization: token,
      },
    });
    
    tutors.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch tutors:', error);
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;

    const response = await axios.post(
      'http://localhost:5000/member/filter/tutor',
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
    tutors.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    selectedTutor.value = null;
  } catch (error) {
    console.error('Failed to filter tutors:', error);
  }
};

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedTutor.value = null;
  fetchTutors();
};

// 페이지 변경
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    const response = await axios.post(
      'http://localhost:5000/member/filter/tutor',
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

    tutors.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } else {
    await fetchTutors();
  }
  
  selectedTutor.value = null;
};

const displayedPages = computed(() => {
  let start = Math.max(currentPage.value - 2, 2);
  let end = Math.min(start + 4, totalPages.value - 1);
  
  if (end === totalPages.value - 1) {
    start = Math.max(end - 4, 2);
  }
  
  if (start === 2) {
    end = Math.min(6, totalPages.value - 1);
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
      const convertedData = snakeToCamel(response.data);
      tutorDetail.value = convertedData;
    } catch (error) {
      console.error('Failed to load tutor detail:', error);
    }
  }
};

onMounted(() => {
  fetchTutors();
});
</script>