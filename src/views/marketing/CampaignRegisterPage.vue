<template>
    <div class="campaign-register-container">
        <MarketingSideMenu />
        <div class="campaign-contents-container">
            <div class="campaign-contents-column">
                <div class="campaign-contents-row">
                    <div class="campaign-select">
                        <div class="campaign-header">
                            <span class="campaign-select-span">캠페인 조회</span>
                            <button class="edit-button">✎</button>
                        </div>
                        <div class="campaign-details">
                            <div class="campaign-detail-row">
                                <span class="detail-title">캠페인 템플릿 선택</span>
                                <select
                                    v-model="selectedTemplateId"
                                    class="template-select"
                                >
                                    <option
                                    v-for="template in templates"
                                    :key="template.id"
                                    :value="template.id"
                                    >
                                    {{ template.title }}
                                    </option>
                                </select>
                                </div>
                                <div class="campaign-detail-row">
                                    <span class="detail-title">캠페인 제목</span>
                                    <span class="detail-content">{{ selectedTemplate?.title }}</span>
                                    </div>
                                    <div class="campaign-detail-row">
                                    <span class="detail-title">캠페인 내용</span>
                                    <span class="detail-content content-multiline">
                                        {{ selectedTemplate?.content }}
                                    </span>
                                    </div>
                            <div class="campaign-detail-row">
                                <span class="detail-title">담당자</span>
                                <span class="detail-content">조제훈</span>
                            </div>
                            <div class="campaign-detail-row">
                                <span class="detail-title">발송 유형</span>
                                <div class="detail-content send-type">
                                    <button class="send-type-btn">즉시 발송</button>
                                    <button class="send-type-btn">예약 발송</button>
                                    <input
                                        type="date"
                                        v-model="selectedDate"
                                        class="date-input"
                                        />
                                        <input
                                        type="text"
                                        v-model="selectedTime"
                                        placeholder="HH:MM:SS"
                                        class="time-input"
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="campaign-attach">
                        <div class="campaign-header">
                            <span class="campaign-attach-span">쿠폰 첨부</span>
                            <div class="attach-buttons">
                            <button class="excel-download-btn">
                                <img src="/src/assets/icons/upload.svg" alt="엑셀 업로드" />
                                엑셀 업로드
                            </button>
                            <button class="add-coupon-btn">+</button>
                            </div>
                        </div>
                        <div class="coupon-list">
                            <!-- <div class="coupon-item">첨부된 쿠폰 리스트</div>
                            <div class="coupon-item">첨부된 쿠폰 리스트</div>
                            <div class="coupon-item">첨부된 쿠폰 리스트</div> -->
                        </div>
                        </div>
                </div>
                <div class="campaign-target">
                        <TargetUserFilter/>
                </div>
                <div class="target-user-list">

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import TargetUserFilter from '@/components/marketing/TargetUserFilter.vue';

const templates = ref([
  { id: 1, title: '특별 할인쿠폰 증정!!', content: `[LearnsMate] 이달의 주인공에게 축하카드가 도착했어요.\n\n소중한 고객님 생일을 진심으로 축하드려요.\n감사의 마음을 담아 전합니다.\n\n이달의 주인공에게만 드리는 특별한 생일서비스를 확인하시고 남은 11월 하루 하루 행복하시길 바라겠습니다.` },
  { id: 2, title: '신규 고객 이벤트', content: `새로운 고객님께 드리는 특별한 혜택!\n\n첫 주문 시 20% 할인 쿠폰을 드립니다.\n\n지금 바로 쇼핑을 시작해 보세요!` },
  { id: 3, title: '감사 이벤트 안내', content: `항상 저희 서비스를 이용해주셔서 감사합니다.\n\n감사의 마음으로 특별 선물을 준비했습니다.\n\n지금 바로 확인하세요!` },
]);

const selectedTemplateId = ref(1);
const selectedDate = ref('');
const selectedTime = ref('');

const selectedTemplate = computed(() =>
  templates.value.find((template) => template.id === selectedTemplateId.value)
);

const combinedDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return null;

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!timeRegex.test(selectedTime.value)) {
    console.error('Invalid time format');
    return null;
  }

  try {
    return new Date(`${selectedDate.value}T${selectedTime.value}`);
  } catch {
    console.error('Invalid date or time value');
    return null;
  }
});
</script>



<style scoped>
.campaign-register-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.campaign-contents-container {
    display: block;
    flex-grow: 1;
    margin-left: 160px;
    margin-top: 50px;
    padding: 20px 30px;
    background-color: white;
    height: auto;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.campaign-contents-column {
    display: flex;
    flex-direction: column;
}

.campaign-contents-row {
    display: flex;
    flex-direction: row;
    gap: 10%;
    margin-bottom: 20px;
}

.campaign-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.edit-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #666;
}

.campaign-select {
    width: 45%;
}

.campaign-select-span {
    font-size: 18px;
    font-weight: bold;
}

.campaign-attach-span {
    font-size: 18px;
    font-weight: bold;
}

.campaign-target-span {
    font-size: 18px;
    font-weight: bold;
}

.campaign-details {
    display: flex;
    flex-direction: column;
    border-top: 2px solid #333;
}

.campaign-detail-row {
    display: flex;
    border-bottom: 1px solid #ddd;
}

.detail-title {
    font-size: 12px;
    padding: 12px;
    background-color: #f9f9f9;
    color: #333;
    width: 150px;
    text-align: left;
}

.detail-content {
    flex: 1;
    padding: 12px;
    font-size: 12px;
    color: #555;
}

.template-select {
  padding: 5px 8px;
  border: 1px solid #ddd;
  font-size: 12px;
  width: 40%;
}


.content-multiline {
    white-space: pre-line;
    line-height: 1.6;
    min-height: 120px;
}

.send-type {
    display: flex;
    gap: 10px;
    align-items: center;
}

.send-type-btn {
    padding: 5px 10px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 10px;
    cursor: pointer;
}

.send-type-btn:hover {
    background-color: #e0e0e0;
}

.date-input,
.time-input {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.time-input {
    width: 100px;
}

.campaign-attach {
  width: 45%;
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.attach-buttons {
  display: flex;
  align-items: center; 
  gap: 10px;
}

.excel-download-btn {
  display: flex;
  gap: 5px;
  font-size: 12px;
  background-color: #005950;
  color: white;
  border: 1px solid #005950;
  border-radius: 4px;
  cursor: pointer;             
}

.excel-download-btn img {
  width: 16px;
  height: 16px;
}

.excel-download-btn:hover {
  background-color: #004c42;
}

.add-coupon-btn {
  width: 25px;
  height: 25px;
  font-size: 15px;
  background-color: #005950;
  color: white;
  border: 1px solid #005950;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-coupon-btn:hover {
  background-color: #004c42;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  height: 335px;
  overflow-y: auto; 
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1); 
}

.target-user-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  height: 335px;
  overflow-y: auto; 
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1); 
}
    
.coupon-item {
  padding: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #333;
}

.coupon-item:hover {
  background-color: #f4f4f4;
}

</style>