<template>
  <div class="layout-container">
    <div class="side-menu"><MemberSideMenu/></div>
    <div class="main-content">
      <BlacklistFilter 
        :type="filterType"
        @search="handleSearch" 
        @reset="handleReset"
      />

      <div class="blacklist-header-container">
        <div class="blacklist-count">전체 {{ memberTypeText }} 블랙리스트 수 <span class="count-number">{{ formatCurrency(totalCount) }}</span>명</div>
        <div class="blacklist-button-group">
          <button class="blacklist-excel-button" @click="handleExcelDownload">
            <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
          </button>
        </div>
      </div>

      <div class="blacklist-content-section">
        <div class="blacklist-table-container" :class="{ 'shrink': selectedBlacklist }">
          <div class="blacklist-board-container">
            <div class="blacklist-board-header">
              <div class="blacklist-board-header-code">No</div>
              <div class="blacklist-board-header-code blacklist-clickable"
                  @click="handleSort('blackCode')">
                블랙리스트 코드
                <span v-if="currentSortField === 'blackCode'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="blacklist-board-header-code blacklist-clickable"
                  @click="handleSort('memberCode')">
                {{ memberTypeText }} 코드
                <span v-if="currentSortField === 'memberCode'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="blacklist-board-header-name blacklist-clickable"
                  @click="handleSort('memberName')">
                {{ memberTypeText }} 이름
                <span v-if="currentSortField === 'memberName'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="blacklist-board-header-email blacklist-clickable"
                  @click="handleSort('memberEmail')">
                {{ memberTypeText }} 이메일
                <span v-if="currentSortField === 'memberEmail'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="blacklist-board-header-address blacklist-clickable"
                  @click="handleSort('blackReason')">
                블랙리스트 사유
                <span v-if="currentSortField === 'blackReason'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="blacklist-board-header-address blacklist-clickable"
                  @click="handleSort('createdAt')">
                정지일
                <span v-if="currentSortField === 'createdAt'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="blacklist-board-header-address blacklist-clickable"
                  @click="handleSort('adminName')">
                담당자
                <span v-if="currentSortField === 'adminName'" class="blacklist-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
            </div>

            <div class="blacklist-board-body">
              <div 
                class="blacklist-board-row" 
                v-for="(blacklist, index) in blacklists" 
                :key="blacklist.blackCode"
                @click="showDetail(blacklist)"
                :class="{ 'selected': selectedBlacklist?.blackCode === blacklist.blackCode }"
              >
                <div class="blacklist-board-row-code">
                  {{ ((currentPage - 1) * pageSize) + index + 1 }}
                </div>
                <div class="blacklist-board-row-code">
                  {{ blacklist.blackCode }}
                </div>
                <div class="blacklist-board-row-code">
                  {{ blacklist.memberCode }}
                </div>
                <div class="blacklist-board-row-name">
                  {{ maskingUtils.maskName(blacklist.memberName) }}
                </div>
                <div class="blacklist-board-row-email">
                  {{ maskingUtils.maskEmail(blacklist.memberEmail) }}
                </div>
                <div class="blacklist-board-row-address" :title="blacklist.blackReason">
                  {{ blacklist.blackReason }}
                </div>
                <div class="blacklist-board-row-address">
                  {{ formatToDateTime(blacklist.createdAt) }}
                </div>
                <div class="blacklist-board-row-address">
                  {{ blacklist.adminName }}
                </div>
              </div>
            </div>
          </div>

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

        
        <div v-if="selectedBlacklist" class="blacklist-detail-container">
          <div class="blacklist-detail-header">
            <h3>블랙리스트 상세 정보</h3>
            <button class="close-button" @click="closeBlacklistDetail">×</button>
          </div>
          <div class="blacklist-detail-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">{{ memberTypeText }} 코드:</span>
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
                <span>{{ formatToDateTime(selectedBlacklist.createdAt) }}</span>
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

            <div class="report-section">
              <h4 class="report-title">신고 내역</h4>
              <div class="report-list">
                <div v-for="(group, commentCode) in groupedReports" :key="commentCode" class="report-group">
                  <div class="comment-section">
                    <div class="comment-header">
                      <span>댓글 코드: {{ commentCode }}</span>
                      <span>작성일: {{ formatToDateTime(group.commentInfo.createdAt) }}</span>
                    </div>
                    <div class="comment-content">
                      <p>댓글 내용: {{ group.commentInfo.commentContent }}</p>
                      <p class="lecture-code">강의 코드: {{ group.commentInfo.lectureCode }}</p>
                    </div>
                  </div>
                  <div class="reports-section">
                    <div v-for="report in group.reports" :key="report.report_dto.reportCode" class="report-entry">
                      <p>신고 코드: {{ report.report_dto.reportCode }}</p>
                      <p>신고 사유: {{ report.report_dto.reportReason }}</p>
                      <p>신고일: {{ formatToDateTime(report.report_dto.reportDate) }}</p>
                      <p>신고자: {{ report.report_dto.reportMemberCode }}</p>
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
import axios from 'axios';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { saveAs } from 'file-saver';
import BlacklistFilter from '@/components/member/BlacklistFilter.vue';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import '@/assets/css/member/BlacklistView.css';

const selectedBlacklist = ref(null);
const blacklists = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const reportDetails = ref([]);
const route = useRoute();
const memberType = ref(route.path.includes('/tutor') ? 'tutor' : 'student');
const memberTypeText = computed(() => ({
  'tutor': '강사',
  'student': '학생'
}[memberType.value]));
const filterType = computed(() => memberType.value);
// 정렬 상태 관리를 위한 ref 추가
const currentSortField = ref('blackCode');
const currentSortDirection = ref('DESC');

watch(
  () => route.path,
  (newPath) => {
    memberType.value = newPath.includes('/tutor') ? 'tutor' : 'student';
    resetData();
  }
);

const formatCurrency = (value) => {
  return value.toLocaleString(); 
};

const resetData = () => {
  currentPage.value = 1;
  selectedBlacklist.value = null;
  reportDetails.value = [];
  blacklists.value = [];
  totalCount.value = 0;
  totalPages.value = 1;
  isFiltered.value = false;
  lastFilterData.value = null;
  fetchBlacklists();
};

const groupedReports = computed(() => {
  const grouped = {};
  
  if (!reportDetails.value || !Array.isArray(reportDetails.value)) {
    return {};
  }
  
  reportDetails.value.forEach(detail => {
    if (!detail.comment_dto) return;
    
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


const fetchBlacklists = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/blacklist/${memberType.value}/sort`, {
      withCredentials: true,
      params: {
        page: currentPage.value - 1,
        size: pageSize,
        sortField: currentSortField.value,
        sortDirection: currentSortDirection.value
      },
    });
    
    if (!response?.data?.content) {
      console.error('Invalid response data structure:', response);
      blacklists.value = [];
      totalCount.value = 0;
      totalPages.value = 0;
      return;
    }

    blacklists.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch blacklists:', error);
  }
};


const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;

    const response = await axios.post(
      `http://localhost:5000/blacklist/filter/${memberType.value}/sort`, 
      lastFilterData.value,
      {
        withCredentials: true,
        params: {
          page: currentPage.value - 1,
          size: pageSize,
          sortField: currentSortField.value,
          sortDirection: currentSortDirection.value
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response?.data?.content) {
      console.error('Invalid response data structure:', response);
      blacklists.value = [];
      totalCount.value = 0;
      totalPages.value = 0;
      return;
    }

    blacklists.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    selectedBlacklist.value = null;
  } catch (error) {
    console.error('Failed to filter blacklists:', error);
  }
};


const handleExcelDownload = async() => {
  try{
    const config = {
      method: 'POST',
      url: `http://localhost:5000/blacklist/excel/download/${memberType.value}`,
      responseType: 'blob',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (isFiltered.value && lastFilterData.value) {
      config.data = lastFilterData.value;
      console.log('excel download request data :', lastFilterData.value);
    }

    const response = await axios(config);
    
    // 에러 응답 체크
    if (response.data instanceof Blob) {
      const isJson = response.data.type === 'application/json';
      if (isJson) {
        const textData = await response.data.text();
        console.error('Server error:', textData);
        throw new Error(textData);
      }
    }
    
    // 파일 다운로드
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    const now = new Date();
    const fileName = `${memberType.value}_blacklist_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
    
    saveAs(blob, fileName);
  } catch (error) {
    console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
    if (error.response) {
      const reader = new FileReader();
      reader.onload = () => {
        console.error('상세 에러:', reader.result);
      };
      reader.readAsText(error.response.data);
    }
  }
}

// 마스킹 유틸리티 함수 추가
const maskingUtils = {
  // 이름 마스킹 (김창섭 -> 김**섭)
  maskName: (name) => {
    if (!name) return '';
    const first = name.charAt(0);
    const last = name.charAt(name.length - 1);
    return `${first}**${last}`;
  },

  // 이메일 마스킹 (dno06117@naver.com -> dn******@naver.com)
  maskEmail: (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    
    const maskedLocal = localPart.substring(0, 2) + 
      '*'.repeat(Math.max(localPart.length - 2, 4));
    return `${maskedLocal}@${domain}`;
  }
};

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedBlacklist.value = null;
  currentSortField.value = 'blackCode'; // 기본 정렬 필드로 리셋
  currentSortDirection.value = 'DESC'; // 기본 정렬 방향으로 리셋
  fetchBlacklists();
};

const closeBlacklistDetail = () => {
  selectedBlacklist.value = null;
  reportDetails.value = null;
};

// 페이지 변경
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    await handleSearch(lastFilterData.value);
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

const showDetail = async (blacklist) => {
  if (selectedBlacklist.value?.blackCode === blacklist.blackCode) {
    selectedBlacklist.value = null;
    reportDetails.value = [];
  } else {
    selectedBlacklist.value = blacklist;
    try {
      const response = await axios.get(`http://localhost:5000/blacklist/${memberType.value}/${blacklist.blackCode}`, {
        withCredentials: true,
      });
      reportDetails.value = response.data;
      console.log("report details : ", reportDetails.value);
    } catch (error) {
      console.error('Failed to load report details:', error);
      reportDetails.value = [];
    }
  }
};

function formatToDateTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// 정렬 처리 함수
const handleSort = async (field) => {
  if (field === currentSortField.value) {
    currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    currentSortField.value = field;
    currentSortDirection.value = 'DESC';
  }
  
  currentPage.value = 1;
  
  if (isFiltered.value && lastFilterData.value) {
    await handleSearch(lastFilterData.value);
  } else {
    await fetchBlacklists();
  }
};

onMounted(() => {
  fetchBlacklists();
});
</script>