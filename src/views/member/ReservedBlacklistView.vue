<template>
  <div class="reserved-layout-container">
    <div class="reserved-side-menu"><MemberSideMenu/></div>
    <div class="reserved-main-content">
      <BlacklistFilter 
        type="student" 
        @search="handleSearch" 
        @reset="handleReset"
      />

      <div class="reserved-content-section" :class="{ 'reserved-with-detail': selectedReserved }">
        <div class="reserved-table-container" :class="{ 'reserved-shrink': selectedReserved }">
          <div class="reserved-header-container">
            <div class="reserved-count">
              예비 {{ memberTypeText }} 블랙리스트 수 
              <span class="reserved-count-number">{{ totalCount }}</span>명
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>{{ memberTypeText }} 코드</th>
                <th>{{ memberTypeText }} 이름</th>
                <th>신고 횟수</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(blacklist, index) in reservedList" 
                :key="blacklist.member_code"
                @click="showDetail(blacklist)"
                class="reserved-cursor-pointer hover:bg-gray-50"
                :class="{ 'reserved-selected': selectedReserved?.member_code === blacklist.member_code }"
              >
                <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
                <td>{{ blacklist.member_code }}</td>
                <td>{{ blacklist.member_name }}</td>
                <td>{{ blacklist.report_count }}</td>
              </tr>
            </tbody>
          </table>

          <div class="reserved-pagination">
            <button 
              class="reserved-page-button reserved-prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >◀</button>
            <button 
              class="reserved-page-button" 
              :class="{ 'reserved-active': currentPage === 1 }" 
              @click="changePage(1)"
            >1</button>
            <span v-if="startPage > 2">...</span>
            <template v-for="page in displayedPages" :key="page">
              <button 
                v-if="page !== 1 && page !== totalPages" 
                class="reserved-page-button" 
                :class="{ 'reserved-active': currentPage === page }" 
                @click="changePage(page)"
              >{{ page }}</button>
            </template>
            <span v-if="endPage < totalPages - 1">...</span>
            <button 
              v-if="totalPages > 1" 
              class="reserved-page-button" 
              :class="{ 'reserved-active': currentPage === totalPages }" 
              @click="changePage(totalPages)"
            >{{ totalPages }}</button>
            <button 
              class="reserved-page-button reserved-next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >▶</button>
          </div>
        </div>

        <div v-if="selectedReserved" class="reserved-detail-container">
          <div class="reserved-detail-content">
            <h3>예비 블랙리스트 상세 정보</h3>
            <div class="reserved-info-grid">
              <div class="reserved-info-item">
                <span class="reserved-label">{{ memberTypeText }} 코드:</span>
                <span>{{ selectedReserved.member_code }}</span>
              </div>
              <div class="reserved-info-item">
                <span class="reserved-label">이름:</span>
                <span>{{ selectedReserved.member_name }}</span>
              </div>
              <div class="reserved-info-item">
                <span class="reserved-label">신고 횟수:</span>
                <span>{{ selectedReserved.report_count }}회</span>
              </div>
            </div>

            <h4 class="reserved-report-title">신고 내역</h4>
            <div class="reserved-report-list">
              <div v-for="(group, commentCode) in groupedReports" :key="commentCode" class="reserved-report-group">
                <div class="reserved-comment-section">
                  <div class="reserved-comment-header">
                    <span>댓글 코드: {{ commentCode }}</span>
                    <span>작성일: {{ group.commentInfo.createdAt }}</span>
                  </div>
                  <div class="reserved-comment-content">
                    <p>댓글 내용: {{ group.commentInfo.commentContent }}</p>
                    <p class="reserved-lecture-code">강의 코드: {{ group.commentInfo.lectureCode }}</p>
                  </div>
                </div>
                <div class="reserved-reports-section">
                  <div v-for="report in group.reports" :key="report.report_dto.reportCode" class="reserved-report-entry">
                    <p>신고 코드: {{ report.report_dto.reportCode }}</p>
                    <p>신고 사유: {{ report.report_dto.reportReason }}</p>
                  </div>
                </div>
              </div>
            </div>

            <button @click="registerBlacklist" class="reserved-insert">등록하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import BlacklistFilter from '@/components/member/BlacklistFilter.vue';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import '@/assets/css/member/ReservedBlacklistView.css';

  const route = useRoute();
  const memberType = ref(route.path.includes('/tutor') ? 'tutor' : 'student');
  const memberTypeText = computed(() => ({
  'tutor': '강사',
  'student': '학생'
}[memberType.value])); 

watch(
  () => route.path,
  (newPath) => {
    memberType.value = newPath.includes('/tutor') ? 'tutor' : 'student';
    resetData();
  }
);

const resetData = () => {
  currentPage.value = 1;
  selectedReserved.value = null;
  reportDetails.value = [];
  reservedList.value = [];
  totalCount.value = 0;
  totalPages.value = 1;
  isFiltered.value = false;
  lastFilterData.value = null;
  fetchReservedList();
};

const selectedReserved = ref(null);
const reservedList = ref([]);
const reportDetails = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMjIwMDEwMDEiLCJlbWFpbCI6InRlc3RAdGVzdGNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjE3MDI0MywiZXhwIjoxNzc1MzcwMjQzfQ.siOUx66zZE72QyxF6LVCOHQefZRRs_ZscsUfZRbEYlQY7E1GWrO5K9IRIhnBzCA0cIoQvmnoHqvPKEMn_h1HOw';

// 댓글별로 그룹화된 신고 내역
const groupedReports = computed(() => {
  const grouped = {};
  
  reportDetails.value.forEach(detail => {
    const commentCode = detail.comment_dto.commentCode;
    
    if (!grouped[commentCode]) {
      grouped[commentCode] = {
        commentInfo: detail.comment_dto,
        reports: []
      };
    }
    
    grouped[commentCode].reports.push(detail);
  });
  
  return grouped;
});

const fetchReservedList = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/blacklist/${memberType.value}/reserved`, {
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        Authorization: token,
      },
    });
    
    console.log('Response data:', response.data);
    
    reservedList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage + 1;
  } catch (error) {
    console.error('Failed to fetch reserved list:', error);
  }
};

const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;

    const response = await axios.post(
      `http://localhost:5000/blacklist/${memberType.value}/reserved/filter`,
      filterData,
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
    reservedList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    selectedReserved.value = null;
  } catch (error) {
    console.error('Failed to filter reserved list:', error);
  }
};

const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedReserved.value = null;
  fetchReservedList();
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    const response = await axios.post(
      `http://localhost:5000/blacklist/${memberType.value}/reserved/filter`,
      lastFilterData.value,
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

    reservedList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } else {
    await fetchReservedList();
  }
  
  selectedReserved.value = null;
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

const startPage = computed(() => displayedPages.value[0]);
const endPage = computed(() => displayedPages.value[displayedPages.value.length - 1]);

const showDetail = async (blacklist) => {
  if (selectedReserved.value?.member_code === blacklist.member_code) {
    selectedReserved.value = null;
    reportDetails.value = [];
  } else {
    selectedReserved.value = blacklist;
    try {
      const response = await axios.get(
        `http://localhost:5000/blacklist/${memberType.value}/reserved/${blacklist.member_code}`, 
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log('Detail response:', response.data);
      reportDetails.value = response.data;
    } catch (error) {
      console.error('Failed to load report details:', error);
      reportDetails.value = [];
    }
  }
};

const registerBlacklist = async () => {
  if (!selectedReserved.value) return;
  
  try {
    await axios.post(
      `http://localhost:5000/blacklist/${selectedReserved.value.member_code}`,  // membercode를 URL에 포함
       "신고 누적으로 인한 블랙리스트 등록",  // RequestSaveBlacklistVO에 맞는 형식
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );
    
    await fetchReservedList();
    selectedReserved.value = null;
  } catch (error) {
    console.error('Failed to register blacklist:', error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  fetchReservedList();
});
</script>