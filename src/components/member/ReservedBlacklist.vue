<template>
  <div class="content-section" :class="{ 'with-detail': selectedReservedBlacklist }">
    <div class="table-container" :class="{ 'shrink': selectedReservedBlacklist }">
      <div class="header-container">
        <div class="reserved-blacklist-count">예비 {{ memberTypeText }} 블랙리스트 수 <span class="count-number">{{ reservedBlacklists.length }}</span>명</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>{{ memberTypeText }} 코드</th>
            <th>{{ memberTypeText }} 이름</th>
            <th>{{ memberTypeText }} 이메일</th>
            <th>신고 횟수</th>
            <th>최근 신고일</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(blacklist, index) in paginatedReservedBlacklists" 
            :key="blacklist.memberCode"
            @click="showDetail(blacklist)"
            class="cursor-pointer hover:bg-gray-50"
            :class="{ 'selected': selectedReservedBlacklist?.memberCode === blacklist.memberCode }"
          >
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>{{ blacklist.memberCode }}</td>
            <td>{{ blacklist.memberName }}</td>
            <td>{{ blacklist.memberEmail }}</td>
            <td>{{ blacklist.reportCount }}</td>
            <td>{{ blacklist.lastReportDate }}</td>
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

    <div v-if="selectedReservedBlacklist" class="detail-container">
      <div class="detail-content">
        <h3>예비 블랙리스트 상세 정보</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">{{ memberTypeText }} 코드:</span>
            <span>{{ selectedReservedBlacklist.memberCode }}</span>
          </div>
          <div class="info-item">
            <span class="label">이름:</span>
            <span>{{ selectedReservedBlacklist.memberName }}</span>
          </div>
          <div class="info-item">
            <span class="label">이메일:</span>
            <span>{{ selectedReservedBlacklist.memberEmail }}</span>
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

        <!-- 여기에 등록하기 버튼 -->
        <button class="reserved-blacklist-insert">등록하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['student', 'tutor'].includes(value)
  }
});

const memberTypeText = computed(() => ({
  'tutor': '강사',
  'student': '학생'
}[props.type]));

const selectedReservedBlacklist = ref(null);
const currentPage = ref(1);
const pageSize = 15;

// 임시 데이터
const reservedBlacklists = ref([
  {
    memberCode: 'STD101',
    memberName: '김예비',
    memberEmail: 'reserved@test.com',
    reportCount: 3,
    lastReportDate: '2024-03-19'
  }
]);

// 더미 데이터 확장
const expandData = () => {
  const baseData = reservedBlacklists.value[0];
  for (let i = 2; i <= 20; i++) {
    reservedBlacklists.value.push({
      ...baseData,
      memberCode: `STD${100 + i}`,
      reportCount: Math.floor(Math.random() * 5) + 1
    });
  }
};
expandData();

const totalPages = computed(() => Math.ceil(reservedBlacklists.value.length / pageSize));

const paginatedReservedBlacklists = computed(() => 
  reservedBlacklists.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    selectedReservedBlacklist.value = null;
  }
};

const showDetail = (blacklist) => {
  if (selectedReservedBlacklist.value?.memberCode === blacklist.memberCode) {
    selectedReservedBlacklist.value = null;
  } else {
    selectedReservedBlacklist.value = blacklist;
  }
};

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
  },{
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
  },{
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
  },{
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
  },{
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
