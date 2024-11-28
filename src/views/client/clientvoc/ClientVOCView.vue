<template>
  <div class="clientvoc-app-container">
    <ClientHeader />
    <InactivityModal
      v-if="showActivityModal"
      :show="showActivityModal"
      @continue="closeActivityModal"
      @logout="activityLogout"
    />
    <div class="clientvoc-header">
      <div class="clientvoc-header-row">
        <div class="clientvoc-text">
          <h2>궁금한 점이 있으신가요?</h2>
          <p>먼저 아래의 자주 묻는 질문 FAQ 리스트를 확인해 주세요!</p>
        </div>
        <button class="clientvoc-check-voc-button"  @click="goToMyVOC">
          내 VOC 답변 확인하러가기
        </button>
      </div>
    </div>
    <div class="clientvoc-wrapper">
      <section class="clientvoc-faq">
        <ul class="clientvoc-questions">
          <li
            v-for="(item, index) in faqList"
            :key="index"
            class="clientvoc-question-item"
          >
            <button
              class="clientvoc-question-button"
              @click="toggleAnswer(index)"
            >
            <img
             :src="expandedIndex === index ? minusIcon : plusIcon"
             alt="아이콘"
             class="clientvoc-icon"
           />

              <span>{{ item.question }}</span>
            </button>
            <p v-if="expandedIndex === index" class="clientvoc-answer">
              {{ item.answer }}
            </p>
          </li>
        </ul>

        <div class="clientvoc-footer">
          <p>원하는 답변을 찾지 못하셨나요?</p>
          <p>
            그럼 하단의 <span class="clientvoc-highlight">'문의하기'</span>에서
            직접 문의해 주세요.<br />
            <p>최대한 빠르게 답변드리도록 하겠습니다!
          </p></p>
          <button class="clientvoc-inquiry-button"   @click="openModal">문의하기</button>
        </div>
      </section>
    </div>
    <ClientVOCModal   v-if="isModalOpen"
  @close="closeModal"
  @submit="handleSubmit"/>
  </div>
</template>

<script setup>
import ClientHeader from "@/components/client/ClientHeader.vue";
import ClientVOCModal from "@/components/client/clientvoc/ClientVOCModal.vue";
import plusIcon from "@/assets/icons/plus.svg";
import minusIcon from "@/assets/icons/minus.svg";
import { ref } from "vue";
import { useRouter } from "vue-router";

import InactivityModal from '@/components/client/InactivityModal.vue';
import { useActivityMonitor } from "@/composables/useActivityMonitor";

const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(30);

const router = useRouter();

const isModalOpen = ref(false);
const expandedIndex = ref(null); 
const faqList = [
  {
    question: "[강의 자료 요청/문제] 강의 자료가 제공되지 않는데 어디서 다운로드할 수 있나요?",
    answer:
      "런스버디에서는 학생분들이 강의 자료를 쉽게 다운로드할 수 있도록 강의 페이지 내 '자료 다운로드' 탭을 제공합니다. 해당 탭에서 필요한 자료를 확인하시고 다운로드해 주시면 됩니다.",
  },
  {
    question: "[결제/환불 문의] 강의를 결제하려고 하는데 결제가 자꾸 실패해요. 어떻게 해야 하나요?",
    answer:
      "결제가 실패하는 경우, 먼저 인터넷 연결 상태를 확인해 주세요. 문제가 지속된다면 고객센터에 문의하시거나 다른 결제 수단을 시도해 보세요.",
  },
  {
    question: "[결제/환불 문의] 환불을 요청하고 싶은데 절차가 어떻게 되나요?",
    answer:
      "환불을 요청하려면 강의 페이지의 '환불 요청' 버튼을 클릭하거나 고객센터에 직접 문의하시면 빠르게 처리해 드립니다.",
  },
  {
    question:
      "[강사 피드백] 강의에서 다루는 주제가 더 깊이 설명되었으면 좋겠습니다. 추가 강의를 계획 중인가요?",
    answer:
      "강사님께 피드백을 전달드리겠습니다. 추가 강의는 수요에 따라 계획될 수 있습니다. 의견 주셔서 감사합니다.",
  },
  {
    question:
      "[기타 건의사항] 사이트에서 제공하는 UI가 복잡해서 사용하기 어려워요. 개선 계획이 있나요?",
    answer:
      "런스버디에서는 사용자 경험을 최우선으로 생각하며 지속적으로 UI/UX를 개선하고 있습니다. 추가적인 의견은 고객센터를 통해 전달해 주세요.",
  },
  {
    question: "[기술적 문제] 로그인할 때 오류가 발생했어요. 어떻게 해결할 수 있나요?",
    answer:
      "로그인 오류는 브라우저 캐시를 삭제하거나 최신 브라우저로 접속해 보세요. 문제가 지속되면 고객센터에 문의해 주시면 도움을 드리겠습니다.",
  },
  {
    question: "[강의 자료 요청/문제] 특정 강의 자료에 접근할 수 없다고 나옵니다. 해결 방법이 있나요?",
    answer:
      "강의 자료에 접근할 수 없는 경우, 강의 등록 상태를 확인하거나 담당 강사님께 요청해 주세요. 추가 문의는 고객센터로 연락 바랍니다.",
  },
  {
    question: "[기술적 문제]  강의 재생 중 소리가 안 나옵니다. 무엇이 문제인가요?",
    answer:
      "강의 재생 중 소리가 나오지 않을 경우, 먼저 장치의 음소거 상태를 확인하고 브라우저 설정에서 오디오 권한을 확인해 주세요. 여전히 문제가 있다면 고객센터로 문의해 주세요.",
  },
  {
    question: "[기타 건의사항]  수강 완료 후 수료증을 받을 수 있나요?",
    answer:
      "수료증은 강의를 100% 수강 완료한 경우 발급됩니다. 발급 가능한 강의는 강의 상세 페이지에서 확인할 수 있습니다.",
  },
  {
    question: "[결제/환불 문의]  결제 내역을 확인할 수 있는 방법이 있나요?",
    answer:
      "결제 내역은 마이페이지에서 확인할 수 있습니다. 문제가 있는 경우, 고객센터로 문의해 주시면 자세히 안내해 드리겠습니다.",
  },
  {
    question:
      "[강의 자료 요청/문제]  강의에서 사용된 참고 자료나 링크가 깨졌어요. 업데이트가 가능한가요?",
    answer:
      "강의 참고 자료나 링크가 깨진 경우, 강사님께 전달하거나 고객센터에 문의해 주시면 빠르게 해결해 드리겠습니다.",
  },
  {
    question:
      "[결제/환불 문의] 할인 쿠폰을 적용했는데 결제 금액이 다르게 나옵니다. 확인해 주실 수 있나요?",
    answer:
      "할인 쿠폰 적용 후 결제 금액이 다르게 표시되는 경우, 사용 조건을 확인해 주세요. 문제가 지속되면 고객센터로 문의해 주시기 바랍니다.",
  },
  {
    question:
      "[강의 자료 요청/문제] 강의 슬라이드의 예제 코드 자료를 추가로 받을 수 있을까요?",
    answer:
      "예제 코드 자료는 강의 페이지의 '자료 다운로드' 탭에서 제공됩니다. 추가 자료가 필요하면 강사님께 요청해 주세요.",
  },
];


const toggleAnswer = (index) => {
  // 같은 질문을 클릭하면 닫기, 다른 질문을 클릭하면 열기
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

// 모달 열기
const openModal = () => {
  isModalOpen.value = true;
};

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};

const goToMyVOC = () => {
  router.push("/client-myvoc");
};
const handleSubmit = (data) => {
  console.log("제출된 데이터:", data);
};

</script>

<style lang="scss">
.clientvoc-app-container {
  background-color: #f9f9f9;
}

.clientvoc-wrapper {
  padding-bottom: 40px;
  max-width: 1160px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.clientvoc-faq {
  padding: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.clientvoc-header {
  background-color: #7671f4;
  padding: 20px 40px;
  color: #ffffff;
  margin-bottom: 20px;
}

.clientvoc-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clientvoc-text {
  font-family:Inter;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
}

.clientvoc-header h2 {
  padding-left: 150px;
  font-size: 26px;
  font-weight: bold;
  margin: 0;
}

.clientvoc-header p {
  padding-left: 150px;
  font-size: 16px;
  margin: 0;
}

.clientvoc-check-voc-button {
  background-color: #7671f4;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 20px;
  padding: 10px 40px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.clientvoc-check-voc-button:hover {
  background-color: #7671f4;
  color: #ffffff;
}

.clientvoc-questions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.clientvoc-question-item {
  margin-bottom: 20px;
}

.clientvoc-question-button {
  width: 100%;
  text-align: left;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #5c5c5c;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.clientvoc-question-button:hover {
  background-color: #e9e9e9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.clientvoc-icon {
  margin-right: 15px;
  width: 15px;
  height: 15px;
}

.clientvoc-answer {
  padding: 20px 30px;
  font-size: 15px;
  color: #000000;
  font-weight: 400;
  background-color: #f9f9f9;
  border-left: 3px solid #7671f4;
  margin-top: 15px;
  border-radius: 0 0 8px 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.clientvoc-footer {
  font-family:Inter;
  text-align: center;
  margin-top: 40px;
}

.clientvoc-footer p {
  font-size: 17px;
  color: #626262;
  margin: 3px 0;
  font-weight: bold;
}

.clientvoc-highlight {
  color: #7671f4;
  font-weight: bold;
}

.clientvoc-inquiry-button {
  margin-top: 25px;
  margin-bottom: 20px;
  background-color: #7671f4;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 150px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clientvoc-inquiry-button:hover {
  background-color: #5a54cc;
}

</style>
