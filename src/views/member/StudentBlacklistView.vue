<template>
  <div class="layout-container">
    <div class="side-menu"><MemberSideMenu/></div>
    <div class="main-content">
      <BlacklistFilter 
        type="student" 
        @search="handleSearch" 
        @reset="handleReset"
      />

      <div class="content-section" :class="{ 'with-detail': selectedBlacklist }">
        <div class="table-container" :class="{ 'shrink': selectedBlacklist }">
          <div class="blacklist-header-container">
            <div class="student-blacklist-count">전체 학생 블랙리스트 수 <span class="count-number">{{ totalCount }}</span>명</div>
            <div class="student-blacklist-button-group">
              <button class="student-blacklist-excel-button">
                <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>블랙리스트 코드</th>
                <th>학생 코드</th>
                <th>학생 이름</th>
                <th>학생 이메일</th>
                <th>블랙리스트 사유</th>
                <th>정지일</th>
                <th>담당자</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(blacklist, index) in blacklists" 
                :key="blacklist.blackCode"
                @click="showDetail(blacklist)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedBlacklist?.blackCode === blacklist.blackCode }"
              >
                <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
                <td>{{ blacklist.blackCode }}</td>
                <td>{{ blacklist.memberCode }}</td>
                <td>{{ blacklist.memberName }}</td>
                <td>{{ blacklist.memberEmail }}</td>
                <td>{{ blacklist.blackReason }}</td>
                <td>{{ blacklist.createDate }}</td>
                <td>{{ blacklist.adminName }}</td>
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

        <div v-if="selectedBlacklist" class="detail-container">
          <div class="detail-content">
            <h3>블랙리스트 상세 정보</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">학생 코드:</span>
                <span>{{ selectedBlacklist.memberCode }}</span>
              </div>
              <div class="info-item">
                <span class="label">이름:</span>
                <span>{{ selectedBlacklist.memberName }}</span>
              </div>
              <div class="info-item">
                <span class="label">이메일:</span>
                <span>{{ selectedBlacklist.memberEmail }}</span>
              </div>
              <div class="info-item">
                <span class="label">정지일:</span>
                <span>{{ selectedBlacklist.createDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">블랙리스트 사유:</span>
                <span>{{ selectedBlacklist.blackReason }}</span>
              </div>
              <div class="info-item">
                <span class="label">담당자:</span>
                <span>{{ selectedBlacklist.adminName }}</span>
              </div>
              <div class="info-item">
                <span class="label">신고 당한 횟수:</span>
                <span>{{ reportDetails.length }}회</span>
              </div>
            </div>

            <h4 class="report-title">신고 내역</h4>
            <div class="report-list">
              <div v-for="(report, index) in reportDetails" :key="index" class="report-item">
                <div class="report-header">
                  <span class="report-number">신고 #{{ index + 1 }}</span>
                  <span class="report-date">{{ formatDate(report.reportDTO.reportDate) }}</span>
                </div>
                <div class="report-content">
                  <div class="report-info">
                    <p><strong>신고 사유:</strong> {{ report.reportDTO.reportReason }}</p>
                    <p><strong>신고자:</strong> {{ report.reportDTO.reportMemberCode }}</p>
                  </div>
                  <div class="comment-info">
                    <p><strong>댓글 내용:</strong> {{ report.commentDTO.commentContent }}</p>
                    <p><strong>작성일:</strong> {{ formatDate(report.commentDTO.createdAt) }}</p>
                    <p><strong>강의:</strong> {{ report.commentDTO.lectureCode }}</p>
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
import BlacklistFilter from '@/components/member/BlacklistFilter.vue';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import '@/assets/css/member/StudentBlacklistView.css';

const selectedBlacklist = ref(null);
const blacklists = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const reportDetails = ref([]);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2NjkzMSwiZXhwIjoxNzc1MjY2OTMxfQ.CJuiirAQ9dsPG5_uDuM4lwCC4zczgFIvURxycLzmZsoF86lO4DfkRlR10gdBgWrAtk4apIrABNawISfVwgx47w';


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

// 전체 블랙리스트 목록 가져오기
const fetchBlacklists = async () => {
  try {
    const response = await axios.get('http://localhost:5000/blacklist/student', {
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        Authorization: token,
      },
    });
    console.log(response.data);
    blacklists.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch blacklists:', error);
  }
};

// 블랙리스트 필터링 검색
const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;

    const response = await axios.post(
      'http://localhost:5000/blacklist/student/filter',
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
    blacklists.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    selectedBlacklist.value = null;
  } catch (error) {
    console.error('Failed to filter blacklists:', error);
  }
};

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedBlacklist.value = null;
  fetchBlacklists();
};

// 페이지 변경
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    const response = await axios.post(
      'http://localhost:5000/blacklist/student/filter',
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

    blacklists.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } else {
    await fetchBlacklists();
  }
  
  selectedBlacklist.value = null;
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

// 상세 정보 및 신고 내역 조회
const showDetail = async (blacklist) => {
  if (selectedBlacklist.value?.blackCode === blacklist.blackCode) {
    selectedBlacklist.value = null;
    reportDetails.value = [];
  } else {
    selectedBlacklist.value = blacklist;
    try {
      const response = await axios.get(`http://localhost:5000/blacklist/student/${blacklist.blackCode}/reports`, {
        headers: {
          Authorization: token,
        },
      });
      reportDetails.value = response.data;
    } catch (error) {
      console.error('Failed to load report details:', error);
      reportDetails.value = [];
    }
  }
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  fetchBlacklists();
});
</script>