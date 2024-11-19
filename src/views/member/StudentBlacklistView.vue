<template>
  <div class="layout-container">
    <div class="side-menu"><MemberSideMenu/></div>
    <div class="main-content">
      <BlacklistFilter type="student" @search="handleSearch" @reset="handleReset" />

      <div class="content-section" :class="{ 'with-detail': selectedBlacklist }">
        <div class="table-container" :class="{ 'shrink': selectedBlacklist }">
          <!-- 전체 학생 블랙리스트 표시 -->
          <div class="header-container">
            <div class="student-blacklist-count">전체 학생 블랙리스트 수 <span class="count-number">{{ blacklists.length }}</span>명</div>
            <div class="student-blacklist-button-group">
              <button class="student-blacklist-excel-button"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
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
                v-for="(blacklist, index) in paginatedBlacklists" 
                :key="blacklist.blackCode"
                @click="showDetail(blacklist)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedBlacklist?.blackCode === blacklist.blackCode }"
              >
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
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
import { ref, computed } from 'vue'
import BlacklistFilter from '@/components/member/BlacklistFilter.vue';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';

const selectedBlacklist = ref(null);
const currentPage = ref(1);
const pageSize = 15; // 한 페이지당 보여줄 항목 수

const blacklists = ref([
    {
        blackCode: 1,
        memberCode: 11,
        memberName: '김철수',
        memberEmail: 'test@test.com',
        blackReason: '부적절한 언어 사용 및 신고누적',
        createDate: '1999-01-01',
        adminName: '김어드민'
    },
]);

// 더미 데이터 20개로 확장
const expandData = () => {
  const baseData = blacklists.value.slice(0, 1);
  for (let i = 2; i <= 20; i++) {
    blacklists.value.push({
      ...baseData[0],
      blackCode: i,
      memberCode: 10 + i,
    });
  }
};
expandData();

const totalPages = computed(() => Math.ceil(blacklists.value.length / pageSize));

const paginatedBlacklists = computed(() => 
  blacklists.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    selectedBlacklist.value = null;
  }
};

const showDetail = (blacklist) => {
  if (selectedBlacklist.value?.blackCode === blacklist.blackCode) {
    selectedBlacklist.value = null
  } else {
    selectedBlacklist.value = blacklist
  }
};

// formatDate 함수 추가
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// 임시 신고 상세 데이터
const reportDetails = ref([
  {
    reportDTO: {
      reportCode: 1001,
      reportReason: "부적절한 언어 사용",
      reportDate: "2024-03-19T10:30:00",
      commentCode: 5001,
      reportMemberCode: 3001,
      reportedMemberCode: 2001
    },
    commentDTO: {
      commentCode: 5001,
      commentContent: "이 강의 완전 시간낭비임 ㅡㅡ",
      createdAt: "2024-03-19T10:15:00",
      updatedAt: "2024-03-19T10:15:00",
      memberCode: 2001,
      lectureCode: "LEC001"
    }
  },
  {
    reportDTO: {
      reportCode: 1002,
      reportReason: "스팸/도배성 댓글",
      reportDate: "2024-03-19T14:20:00",
      commentCode: 5002,
      reportMemberCode: 3002,
      reportedMemberCode: 2001
    },
    commentDTO: {
      commentCode: 5002,
      commentContent: "같은 내용 반복 도배...",
      createdAt: "2024-03-19T14:10:00",
      updatedAt: "2024-03-19T14:10:00",
      memberCode: 2001,
      lectureCode: "LEC002"
    }
  },
  {
    reportDTO: {
      reportCode: 1002,
      reportReason: "스팸/도배성 댓글",
      reportDate: "2024-03-19T14:20:00",
      commentCode: 5002,
      reportMemberCode: 3002,
      reportedMemberCode: 2001
    },
    commentDTO: {
      commentCode: 5002,
      commentContent: "같은 내용 반복 도배...",
      createdAt: "2024-03-19T14:10:00",
      updatedAt: "2024-03-19T14:10:00",
      memberCode: 2001,
      lectureCode: "LEC002"
    }
  },
  {
    reportDTO: {
      reportCode: 1002,
      reportReason: "스팸/도배성 댓글",
      reportDate: "2024-03-19T14:20:00",
      commentCode: 5002,
      reportMemberCode: 3002,
      reportedMemberCode: 2001
    },
    commentDTO: {
      commentCode: 5002,
      commentContent: "같은 내용 반복 도배...",
      createdAt: "2024-03-19T14:10:00",
      updatedAt: "2024-03-19T14:10:00",
      memberCode: 2001,
      lectureCode: "LEC002"
    }
  },
  {
    reportDTO: {
      reportCode: 1002,
      reportReason: "스팸/도배성 댓글",
      reportDate: "2024-03-19T14:20:00",
      commentCode: 5002,
      reportMemberCode: 3002,
      reportedMemberCode: 2001
    },
    commentDTO: {
      commentCode: 5002,
      commentContent: "같은 내용 반복 도배...",
      createdAt: "2024-03-19T14:10:00",
      updatedAt: "2024-03-19T14:10:00",
      memberCode: 2001,
      lectureCode: "LEC002"
    }
  },
  {
    reportDTO: {
      reportCode: 1002,
      reportReason: "스팸/도배성 댓글",
      reportDate: "2024-03-19T14:20:00",
      commentCode: 5002,
      reportMemberCode: 3002,
      reportedMemberCode: 2001
    },
    commentDTO: {
      commentCode: 5002,
      commentContent: "같은 내용 반복 도배...",
      createdAt: "2024-03-19T14:10:00",
      updatedAt: "2024-03-19T14:10:00",
      memberCode: 2001,
      lectureCode: "LEC002"
    }
  }
]);


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
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto; /* 수평 스크롤 추가 */
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

.table-container.shrink {
  flex: 0 0 50%;
}

.detail-container {
  flex: 0 0 50%;
  opacity: 1;
  transform: translateX(0);
}

table {
  width: 100%;
  min-width: 1200px; /* 테이블 최소 너비 설정 */
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  font-size: 11px;
}

th{
  font-size: 13px;
}

.selected {
  background-color: #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.label {
  color: #64748b;
  min-width: 80px;
}

/* 각 열의 너비 지정 */
th:nth-child(1), td:nth-child(1) { width: 100px; } /* 학생 코드 */
th:nth-child(2), td:nth-child(2) { width: 100px; } /* 이름 */
th:nth-child(3), td:nth-child(3) { width: 150px; } /* 이메일 */
th:nth-child(4), td:nth-child(4) { width: 120px; } /* 연락처 */
th:nth-child(5), td:nth-child(5) { width: 200px; } /* 주소 */
th:nth-child(6), td:nth-child(6) { width: 80px; } /* 나이 */
th:nth-child(7), td:nth-child(7) { width: 100px; } /* 생년월일 */
th:nth-child(8), td:nth-child(8) { width: 100px; } /* 계정상태 */
th:nth-child(9), td:nth-child(9) { width: 100px; } /* 생성일 */
th:nth-child(10), td:nth-child(10) { width: 100px; } /* 휴면상태 */

/* 페이지네이션 */
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

.student-blacklist-count {
  font-size: 17px;
  font-weight: bold;
  color: #333;
}

.count-number {
  color: #006D5C;
  font-weight: bold;
}

.student-blacklist-button-group {
  display: flex;
  gap: 10px;
}

.student-blacklist-excel-button {    
  background: #005950;
  padding: 2px 5px;
  margin-bottom: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
}

.student-blacklist-excel-button img {
  width: 16px;
  height: 16px;
}

.detail-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.report-title {
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 580px;  /* 원하는 높이로 조절 가능 */
  overflow-y: auto;   /* 세로 스크롤 추가 */
  padding-right: 10px; /* 스크롤바 공간 확보 */
}

.report-item {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 15px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e2e8f0;
}

.report-number {
  font-weight: bold;
  color: #006D5C;
}

.report-date {
  color: #666;
  font-size: 0.9em;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.report-info, .comment-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.report-info p, .comment-info p {
  margin: 0;
  font-size: 0.9em;
}
</style>