<template>
  <div class="reserved-layout-container">
    <div class="reserved-side-menu"><MemberSideMenu/></div>
    <div class="reserved-main-content">
      <div class="reserved-header-container">
        <div class="reserved-count">
          예비 {{ memberTypeText }} 블랙리스트 수 
          <span class="reserved-count-number">{{ formatCurrency(totalCount) }}</span>명
        </div>
      </div>


      <div class="reserved-content-section" :class="{ 'reserved-with-detail': selectedReserved }">
        <div class="reserved-table-container" :class="{ 'reserved-shrink': selectedReserved }">
          <div class="reserved-board-container">
            <div class="reserved-board-header">
              <div class="reserved-table-cell">No</div>
              <div class="reserved-table-cell reserved-clickable" 
                  @click="handleSort('memberCode')">
                {{ memberTypeText }} 코드
                <span v-if="currentSortField === 'memberCode'" class="reserved-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="reserved-table-cell reserved-clickable" 
                  @click="handleSort('memberName')">
                {{ memberTypeText }} 이름
                <span v-if="currentSortField === 'memberName'" class="reserved-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
              <div class="reserved-table-cell reserved-clickable" 
                  @click="handleSort('reportCount')">
                신고 횟수
                <span v-if="currentSortField === 'reportCount'" class="reserved-sort-arrow">
                  {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                </span>
              </div>
            </div>
            
            <div class="reserved-board-body">
              <div 
                v-for="(blacklist, index) in reservedList" 
                :key="blacklist.member_code"
                @click="showDetail(blacklist)"
                class="reserved-table-row reserved-cursor-pointer hover:bg-gray-50"
                :class="{ 'reserved-selected': selectedReserved?.member_code === blacklist.member_code }"
              >
                <div class="reserved-table-row-cell">
                  {{ ((currentPage - 1) * pageSize) + index + 1 }}
                </div>
                <div class="reserved-table-row-cell">
                  {{ blacklist.member_code }}
                </div>
                <div class="reserved-table-row-cell">
                  {{ maskingUtils.maskName(blacklist.member_name) }}
                </div>
                <div class="reserved-table-row-cell">
                  {{ blacklist.report_count }}
                </div>
              </div>
            </div>
          </div>

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
          <div class="reserved-detail-header">
            <h3>예비 블랙리스트 상세 정보</h3>
            <button class="close-button" @click="closeResveredBlacklistDetail">×</button>
          </div>
          <div class="reserved-detail-content">
            <div class="reserved-info-grid">
              <div class="reserved-info-item">
                <span class="reserved-label">{{ memberTypeText }} 코드</span>
                <span class="reserved-detail-info">{{ selectedReserved.member_code }}</span>
              </div>
              <div class="reserved-info-item">
                <span class="reserved-label">이름</span>
                <span class="reserved-detail-info">{{ selectedReserved.member_name }}</span>
              </div>
              <div class="reserved-info-item">
                <span class="reserved-label">신고 횟수</span>
                <span class="reserved-detail-info">{{ selectedReserved.report_count }}회</span>
              </div>
            </div>

            <h4 class="reserved-report-title">신고 내역</h4>
            <div class="reserved-report-list">
              <div v-for="(group, commentCode) in groupedReports" :key="commentCode" class="reserved-report-group">
                <div class="reserved-comment-section">
                  <div class="reserved-comment-header">
                    <span>댓글 코드: {{ commentCode }}</span>
                    <span>작성일: {{ formatToDateTime(group.commentInfo.createdAt) }}</span>
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
            <!-- 블랙리스트 등록 버튼 -->
            <button 
              v-if="selectedReserved" 
              @click="openReasonModal" 
              class="register-button mt-4"
            >
              블랙리스트 등록
            </button>

            <!-- 사유 입력 모달 -->
            <BlackReason
              :is-open="isReasonModalOpen"
              @cancel="closeReasonModal"
              @confirm="handleReasonConfirm"
            />

            <!-- 모달 컴포넌트 사용 -->
            <RegisterModule
              v-if="isConfirmModalOpen"
              :modalTitle="modalTitle"
              @confirm="confirmRegister"
              @cancel="closeConfirmModal"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import RegisterModule from '@/components/modules/RegisterModule.vue';
import BlackReason from '@/components/member/BlackReason.vue';
import '@/assets/css/member/ReservedBlacklistView.css';
import axios from 'axios';

const route = useRoute();
const memberType = ref(route.path.includes('/tutor') ? 'tutor' : 'student');
const memberTypeText = computed(() => ({
  'tutor': '강사',
  'student': '학생'
}[memberType.value])); 

// 모달 관련 상태
const isModalOpen = ref(false);
const modalTitle = ref('블랙리스트를 등록하시겠습니까?');
const blacklistReason = ref('');
const isReasonModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const currentSortField = ref('reportCount'); // 기본 정렬 필드
const currentSortDirection = ref('DESC'); // 기본 정렬 방향
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
    const response = await axios.get(`http://localhost:5000/blacklist/${memberType.value}/reserved/sort`, {
      withCredentials: true, 
      params: {
        page: currentPage.value - 1,
        size: pageSize,
        sortField: currentSortField.value,
        sortDirection: currentSortDirection.value
      },
    });
    
    reservedList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    currentPage.value = response.data.currentPage + 1;
  } catch (error) {
    console.error('Failed to fetch reserved list:', error);
  }
};

const handleSort = async (field) => {
  if (field === currentSortField.value) {
    // 같은 필드를 다시 클릭하면 방향만 변경
    currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    // 다른 필드를 클릭하면 필드 변경 및 DESC로 초기화
    currentSortField.value = field;
    currentSortDirection.value = 'DESC';
  }
  
  currentPage.value = 1; // 페이지 초기화
  await fetchReservedList();
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    const response = await axios.post(`http://localhost:5000/blacklist/${memberType.value}/reserved/filter`,lastFilterData.value, {
      withCredentials: true,  
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

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
      const response = await axios.get(`http://localhost:5000/blacklist/${memberType.value}/reserved/${blacklist.member_code}`, {
          withCredentials: true
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

const maskingUtils = {
 maskName: (name) => {
   if (!name) return '';
   const first = name.charAt(0);
   const last = name.charAt(name.length - 1);
   return `${first}**${last}`;
 }
};

// 사유 입력 모달 열기
const openReasonModal = () => {
  isReasonModalOpen.value = true;
};

// 사유 입력 모달 닫기
const closeReasonModal = () => {
  isReasonModalOpen.value = false;
};

// 사유 입력 후 확인
const handleReasonConfirm = (reason) => {
  blacklistReason.value = reason;
  isReasonModalOpen.value = false;
  isConfirmModalOpen.value = true;
};
// 최종 확인 모달 닫기
const closeConfirmModal = () => {
  isConfirmModalOpen.value = false;
  blacklistReason.value = '';
};

const confirmRegister = async () => {
  try {
    await axios.post(
      `http://localhost:5000/blacklist/${selectedReserved.value.member_code}`,{ blackReason: blacklistReason.value }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    alert('블랙리스트 등록이 완료되었습니다.');
    closeConfirmModal();
    await fetchReservedList();
    selectedReserved.value = null;
  } catch (error) {
    console.error('Failed to register blacklist:', error);
    alert('블랙리스트 등록에 실패했습니다.');
  }
};

const closeResveredBlacklistDetail = () => {
  selectedReserved.value = null;
  reportDetails.value = null;
}

function formatToDateTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

onMounted(() => {
  fetchReservedList();
});
</script>