<template>
  <div class="reserved-layout-container">
    <div class="reserved-side-menu"><MemberSideMenu/></div>
    <div class="reserved-main-content">
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
                :key="blacklist.memberCode"
                @click="showDetail(blacklist)"
                class="reserved-cursor-pointer hover:bg-gray-50"
                :class="{ 'reserved-selected': selectedReserved?.memberCode === blacklist.memberCode }"
              >
                <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
                <td>{{ blacklist.memberCode }}</td>
                <td>{{ blacklist.memberName }}</td>
                <td>{{ blacklist.reportCount }}</td>
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
                <span>{{ selectedReserved.memberCode }}</span>
              </div>
              <div class="reserved-info-item">
                <span class="reserved-label">이름:</span>
                <span>{{ selectedReserved.memberName }}</span>
              </div>
              <div class="reserved-info-item">
                <span class="reserved-label">신고 횟수:</span>
                <span>{{ selectedReserved.reportCount }}회</span>
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
                  <div v-for="report in group.reports" :key="report.reportDto.reportCode" class="reserved-report-entry">
                    <p>신고 코드: {{ report.reportDto.reportCode }}</p>
                    <p>신고 사유: {{ report.reportDto.reportReason }}</p>
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
import axios from '@/plugins/axios';

const route = useRoute();
const memberType = ref(route.path.includes('/tutor') ? 'tutor' : 'student');
const memberTypeText = computed(() => ({
  'tutor': '강사',
  'student': '학생'
}[memberType.value])); 

const filterType = computed(() => memberType.value);

// 모달 관련 상태
const isModalOpen = ref(false);
const modalTitle = ref('블랙리스트를 등록하시겠습니까?');
const blacklistReason = ref('');
const isReasonModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
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

const groupedReports = computed(() => {
  const grouped = {};
  
  reportDetails.value.forEach(detail => {
    const commentCode = detail.commentDto.commentCode;
    
    if (!grouped[commentCode]) {
      grouped[commentCode] = {
        commentInfo: detail.commentDto,
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
      withCredentials: true, 
      params: {
        page: currentPage.value - 1,
        size: pageSize
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
  if (selectedReserved.value?.memberCode === blacklist.memberCode) {
    selectedReserved.value = null;
    reportDetails.value = [];
  } else {
    selectedReserved.value = blacklist;
    try {
      const response = await axios.get(`http://localhost:5000/blacklist/${memberType.value}/reserved/${blacklist.memberCode}`, {
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
      `http://localhost:5000/blacklist/${selectedReserved.value.memberCode}`,{ blackReason: blacklistReason.value }, {
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

onMounted(() => {
  fetchReservedList();
});
</script>