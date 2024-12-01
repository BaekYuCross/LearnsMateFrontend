<template>
    <div class="clientmyvoc-container">
      <ClientHeader />
      <InactivityModal
        v-if="showActivityModal"
        :show="showActivityModal"
        @continue="closeActivityModal"
        @logout="activityLogout"
      />
      <div class="clientmyvoc-wrapper">
        <!-- 질문(Q) -->
        <div class="clientmyvoc-block clientmyvoc-question-block">
          <h3 class="clientmyvoc-title">
            Q.
            <div class="clientmyvoc-line"></div>
          </h3>
          <p class="clientmyvoc-text">
            안녕하세요. 제가 얼마 전에 결제한 강의를 수강했는데, 생각보다 내용이 맞지 않아서 환불을 요청하고 싶습니다.
            환불 절차가 어떻게 되는지 궁금한데, 어떤 단계를 거쳐야 하나요? 그리고 환불이 되기까지 얼마나 걸리는지도 알고 싶습니다.
            혹시 환불 가능한 기간이나 조건이 있으면 알려주시면 감사하겠습니다.
          </p>
        </div>
        <!-- 답변(A) -->
        <div class="clientmyvoc-block clientmyvoc-answer-block">
          <h3 class="clientmyvoc-title">
            A.
            <div class="clientmyvoc-line"></div>
          </h3>
          <p class="clientmyvoc-text">
            안녕하세요, 런즈버디 입니다. 😊 <br />
            환불을 요청하시려면, 먼저 로그인 후 '내 강의' 페이지로 이동하여 환불을 원하시는 강의를 선택해 주세요.
            강의 상세 페이지에서 '환불 요청' 버튼을 클릭하면 환불 신청이 접수됩니다. <br />
            환불 정책에 따라 일부 조건이 적용될 수 있으며, 환불 처리 기간은 영업일 기준으로 약 3~5일 정도 소요됩니다.
            자세한 환불 정책은 고객센터 페이지에서 확인하실 수 있습니다.
            추가 문의 사항이 있으시면 언제든지 고객센터로 연락해 주세요! 감사합니다.
          </p>
        </div>
        <!-- 피드백 -->
        <div class="clientmyvoc-feedback">
          <p class="clientmyvoc-feedback-question">답변이 도움 되셨나요?</p>
          <div class="clientmyvoc-feedback-options">
            <div
              class="clientmyvoc-feedback-item"
              @click="sendFeedback('resolved')"
            >
              <span class="clientmyvoc-feedback-icon">😊</span>
              <span>해결됨</span>
            </div>
            <div
              class="clientmyvoc-feedback-item"
              @click="sendFeedback('neutral')"
            >
              <span class="clientmyvoc-feedback-icon">😐</span>
              <span>애매함</span>
            </div>
            <div
              class="clientmyvoc-feedback-item"
              @click="sendFeedback('not_resolved')"
            >
              <span class="clientmyvoc-feedback-icon">😞</span>
              <span>해결안됨</span>
            </div>
          </div>
        </div>
        <!-- 페이지네이션 -->
       <div class="clientmyvoc-pagination">
        <button
          class="clientmyvoc-page-button prev-button"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          ◀ 이전
        </button>
        <span v-for="page in visiblePages" :key="page" class="clientmyvoc-page-number">
          <button
            class="clientmyvoc-page-button"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </span>
        <button
          class="clientmyvoc-page-button next-button"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          다음 ▶
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ClientHeader from "@/components/client/ClientHeader.vue";

import InactivityModal from '@/components/client/InactivityModal.vue';
import { useActivityMonitor } from "@/composables/useActivityMonitor";

const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(30);

const currentPage = ref(1); // 현재 페이지
const totalPages = ref(155); // 총 페이지 수
const maxVisiblePages = 5; // 한 번에 보여줄 페이지 버튼 수

// 피드백 이벤트 핸들러
const sendFeedback = (status) => {
  console.log("Feedback:", status); // 여기에서 서버로 데이터 전송 로직 추가 가능
};

// 현재 페이지를 기준으로 동적으로 페이지 버튼 목록 계산
const visiblePages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 페이지 변경 핸들러
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 여기서 서버 요청으로 해당 페이지 데이터를 가져오면 됨
  }
};
</script>
  
  <style lang="scss">
  .clientmyvoc-container {
    background-color: #ffffff;
    font-family: Arial, sans-serif;
  }
  
  .clientmyvoc-wrapper {
    background-color: #f9f9f9;
    max-width: 1160px;
    margin: 30px auto;
    padding: 20px;
  }
  
  /* 공통 블록 스타일 */
  .clientmyvoc-block {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 30px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* 질문(Q) 스타일링 */
  .clientmyvoc-question-block {
    border-left: 5px solid #7671f4;
  }
  
  .clientmyvoc-title {
    margin-left: 25px;
    display: flex;
    align-items: center;
    font-size: 29px;
    font-weight: bold;
    color: #7671f4;
    margin-bottom: 10px;
  }
  
  .clientmyvoc-line {
  margin-top: 6px;
  width: 400px; /* 원하는 길이로 설정 */
  height: 7px;
  background-color: #7671f4;
  margin-left: 10px;
  border-radius: 60px;
}

  .clientmyvoc-text {
    font-size: 16px;
    padding: 10px 50px;
    color: #818181;
    line-height: 1.6;
    font-weight: bold;
  }
  
  /* 답변(A) 스타일링 */
  .clientmyvoc-answer-block {
    border-left: 5px solid #5a54cc;
  }
  
  /* 피드백 */
  .clientmyvoc-feedback {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }
  
  .clientmyvoc-feedback-question {
    font-size: 14px;
    font-weight: bold;
    color: #7671f4;
    background: rgba(192, 192, 192, 0.2);
    padding: 5px 40px;
    border-radius: 20px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
    margin-right: 500px;
  }
  
  .clientmyvoc-feedback-options {
    display: flex;
    gap: 25px;
  }
  
  .clientmyvoc-feedback-item {
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    color: #b5b5b5;
    cursor: pointer;
  }
  
  .clientmyvoc-feedback-icon {
    display: block;
    font-size: 24px;
    margin-bottom: 4px;
  }
  
  /* 페이지네이션 */
  .clientmyvoc-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }
  
  .clientmyvoc-page-button {
    background: none;
    border: none;
    font-size: 14px;
    color: #333;
    font-weight: bold;
    cursor: pointer;
    padding: 5px 10px;
  }
  
  .clientmyvoc-page-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .clientmyvoc-page-numbers {
    margin: 0 10px;
    font-size: 14px;
  }
  </style>
  