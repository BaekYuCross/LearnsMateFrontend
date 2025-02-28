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
      <div v-for="voc in paginatedVOCs" :key="voc.vocCode">
        <!-- 질문(Q) -->
        <div class="clientmyvoc-block clientmyvoc-question-block">
          <h3 class="clientmyvoc-title">
            Q.
            <div class="clientmyvoc-line"></div>
          </h3>
          <p class="clientmyvoc-text">{{ voc.vocContent }}</p>
          <div class="clientmyvoc-metadata">
            <span>카테고리: {{ voc.vocCategoryName }}</span>
            <span>작성일: {{ formatDate(voc.createdAt) }}</span>
          </div>
        </div>

        <!-- 답변(A) - 답변이 있는 경우에만 표시 -->
        <div v-if="voc.vocAnswerContent" class="clientmyvoc-block clientmyvoc-answer-block">
          <h3 class="clientmyvoc-title">
            A.
            <div class="clientmyvoc-line"></div>
          </h3>
          <p class="clientmyvoc-text">
            안녕하세요, 런즈버디입니다. 😊<br />
            {{ voc.vocAnswerContent }}
          </p>
          <div class="clientmyvoc-metadata">
            <span>답변자: {{ voc.adminName }}</span>
            <span>답변일: {{ formatDate(voc.vocAnswerCreatedAt) }}</span>
            <span v-if="voc.vocAnswerSatisfaction">
              만족도: {{ getSatisfactionEmoji(voc.vocAnswerSatisfaction) }}
            </span>
          </div>
        </div>

        <!-- 피드백 - 답변이 있고 만족도가 없는 경우에만 표시 -->
        <div v-if="voc.vocAnswerContent && !voc.vocAnswerSatisfaction" class="clientmyvoc-feedback">
          <p class="clientmyvoc-feedback-question">답변이 도움 되셨나요?</p>
          <div class="clientmyvoc-feedback-options">
            <div
              class="clientmyvoc-feedback-item"
              @click="sendFeedback(voc.vocCode, 'resolved')"
            >
              <span class="clientmyvoc-feedback-icon">😊</span>
              <span>만족</span>
            </div>
            <div
              class="clientmyvoc-feedback-item"
              @click="sendFeedback(voc.vocCode, 'neutral')"
            >
              <span class="clientmyvoc-feedback-icon">😐</span>
              <span>보통</span>
            </div>
            <div
              class="clientmyvoc-feedback-item"
              @click="sendFeedback(voc.vocCode, 'not_resolved')"
            >
              <span class="clientmyvoc-feedback-icon">😞</span>
              <span>불만족</span>
            </div>
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
import { ref, computed, onMounted } from "vue";
import ClientHeader from "@/components/client/ClientHeader.vue";
import InactivityModal from '@/components/client/InactivityModal.vue';
import { useActivityMonitor } from "@/composables/useActivityMonitor";
import axios from '@/plugins/axios';

const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(30);

const currentPage = ref(1);
const totalPages = ref(0);
const maxVisiblePages = 5;
const vocList = ref([]);
const itemsPerPage = 1;

// 현재 페이지의 VOC 목록 계산
const paginatedVOCs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return vocList.value.slice(start, end);
});

const formatDate = (dateTime) => {
  if (!dateTime || !Array.isArray(dateTime)) return '';
  
  const [year, month, day, hour, minute] = dateTime;
  
  // 월과 일이 한자리수일 경우 앞에 0을 붙임
  const formattedMonth = String(month).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  const formattedHour = String(hour).padStart(2, '0');
  const formattedMinute = String(minute).padStart(2, '0');
  
  return `${year}년 ${formattedMonth}월 ${formattedDay}일 ${formattedHour}:${formattedMinute}`;
};


const sendFeedback = async (vocCode, status) => {
  try {
    const satisfactionMap = {
      'resolved': 2,
      'neutral': 1,
      'not_resolved': 0
    };

    await axios.post(
      `http://localhost:5000/voc/client/${vocCode}/feedback`,
      null, // body는 null
      {
        params: {  // params로 전송
          satisfaction: satisfactionMap[status]
        },
        withCredentials: true
      }
    );

    fetchUserVOCs();
  } catch (error) {
    console.error('피드백 전송 실패:', error);
  }
};

const getSatisfactionEmoji = (satisfaction) => {
  if (satisfaction === null) return '';
  
  switch(satisfaction) {
    case "만족":
      return "😊 만족";
    case "보통":
      return "😐 보통";
    case "불만족":
      return "😞 불만족";
    default:
      return satisfaction;
  }
};

// VOC 목록 조회
const fetchUserVOCs = async () => {
  try {
    const memberCode = JSON.parse(localStorage.getItem('clientInfo')).member_code;
    const response = await axios.get(`http://localhost:5000/voc/client/list/${memberCode}`, {
      withCredentials: true
    });
    vocList.value = response.data;
    totalPages.value = Math.ceil(vocList.value.length / itemsPerPage);
  } catch (error) {
    console.error('VOC 목록 조회 실패:', error);
  }
};

// 페이지네이션 버튼 계산
const visiblePages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 페이지 변경
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  fetchUserVOCs();
});
</script>
  
<style>
  .clientmyvoc-container {
  background-color: #ffffff;
  height: 100vh;
  overflow-y: auto;
  }
  
  .clientmyvoc-container::-webkit-scrollba {
    width: 6px;
  }

  .clientmyvoc-container::-webkit-scrollbar-thumb {
    background-color: #7671f4;
    border-radius: 10px;
  }

  .clientmyvoc-container::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 10px;
  }
  
  .clientmyvoc-wrapper {
    background-color: #f9f9f9;
    max-width: 1160px;
    margin: 30px auto;
    padding: 20px;
    min-height: calc(100vh - 100px);
    position: relative;  
    padding-bottom: 100px;  
}
  
  .clientmyvoc-block {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 30px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    min-height: 200px;
    display: flex; 
    flex-direction: column;
  }
  
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
    width: 400px;
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
    min-height: 100px; 
  }
  
  .clientmyvoc-answer-block {
    border-left: 5px solid #5a54cc;
  }

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
  
  .clientmyvoc-pagination {
    position: absolute; 
    bottom: 50px; 
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
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

  .clientmyvoc-metadata {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-right: 20px;
}

.clientmyvoc-page-button.active {
  color: #7671f4;
  text-decoration: underline;
}
  </style>
  