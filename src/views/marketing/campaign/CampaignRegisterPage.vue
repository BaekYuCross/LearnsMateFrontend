<template>
  <div class="campaign-register-container">
    <MarketingSideMenu />
    <div class="campaign-contents-container">
      <div class="campaign-contents-column">
        <div class="campaign-contents-row">
          <div class="campaign-select">
            <div class="campaign-header">
              <span class="campaign-select-span">캠페인 등록</span>
              <button class="edit-button" @click="toggleEditMode">
                <span v-if="isEditMode">
                  <img src="/src/assets/icons/check.svg" alt="Edit Mode">
                </span>
                <span v-else>
                  ✎
                </span>
              </button>
            </div>
            <div class="campaign-details">
              <div class="campaign-detail-row">
                <span class="detail-title">캠페인 템플릿 선택</span>
                <select v-model="selectedTemplateCode" @change="updateTemplate" class="template-select">
                  <option value="">직접 입력</option>
                  <option v-for="template in templates" :key="template.campaign_template_code" :value="template.campaign_template_code">
                    {{ template.campaign_template_title }}
                  </option>
                </select>
              </div>
              <div class="campaign-detail-row">
                <span class="detail-title">캠페인 제목</span>
                <span v-if="!isEditMode" class="detail-content">{{ campaignTitle }}</span>
                <input
                  v-if="isEditMode"
                  v-model="campaignTitle"
                  class="detail-content-input"
                  placeholder="캠페인 제목을 입력하세요"
                />
              </div>
              <div class="campaign-detail-row">
                <span class="detail-title">캠페인 내용</span>
                <textarea
                  v-if="isEditMode"
                  v-model="campaignContents"
                  class="detail-content-textarea"
                  placeholder="캠페인 내용을 입력하세요"
                  rows="10"
                ></textarea>
                <span v-else class="detail-content content-multiline">{{ campaignContents }}</span>
              </div>
              <div class="campaign-detail-row">
                <span class="detail-title">담당자</span>
                <span class="detail-content">로그인한 직원이름으로 바뀔거여요^^</span>
              </div>
              <div class="campaign-detail-row">
                <span class="detail-title">발송 유형</span>
                <div class="detail-content send-type">
                  <button
                    class="send-type-btn"
                    :class="{ active: campaignType === '즉시 발송' }"
                    @click="selectSendType('즉시 발송')"
                  >
                    즉시 발송
                  </button>
                  <button
                    class="send-type-btn"
                    :class="{ active: campaignType === '예약 발송' }"
                    @click="selectSendType('예약 발송')"
                  >
                    예약 발송
                  </button>
                  <input
                    type="date"
                    v-model="selectedDate"
                    class="date-input"
                    :disabled="campaignType === '즉시 발송'"
                  />
                  <input
                    type="time"
                    v-model="selectedTime"
                    class="time-input"
                    :disabled="campaignType === '즉시 발송'"
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
                <button class="add-coupon-btn" @click="clickCouponSelect">+</button>
              </div>
            </div>
            <div class="coupon-list">
              <div v-for="coupon in attachedCoupons" :key="coupon.coupon_code" class="coupon-item">
                {{ coupon.coupon_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="campaign-header">
          <span class="campaign-select-span">타겟 유저</span>
          <div class="target-buttons">
                <button class="excel-download-btn">
                  <img src="/src/assets/icons/upload.svg" alt="엑셀 업로드" />
                  엑셀 업로드
                </button>
                <button class="add-target-user-btn" @click="clickTargetUserSelect">+</button>
              </div>
        </div>
        <div class="target-user-list">
          <div v-for="user in targetUsers" :key="user.member_code" class="target-user-item">
                {{ user.user_name }}
              </div>
        </div>

        <div class="campaign-register-button-group">
          <button class="campaign-register-button" @click="registerCampaign">
            등록하기
          </button>
          <button class="campaign-cancel-button" @click="cancelCampaign">
            취소하기
          </button>
        </div>
      </div>
    </div>
  </div>
  <CouponSelectModal
    v-if="showCouponSelectModal"
    @Close="handleCouponModalClose"
    @Submit="handleCouponSubmit"
  />
  <TargetUserSelctModal
    v-if="showTargetUserSelectModal"
    @Close="handleTargetUserModalClose"
    @Submit="handleTargetUserSubmit"
  />
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import CouponSelectModal from '@/components/marketing/couponSelectModal.vue';
import TargetUserSelctModal from '@/components/marketing/TargetUserSelectModal.vue';

const showCouponSelectModal = ref(false);
const showTargetUserSelectModal = ref(false);

const clickCouponSelect = async() => {
  showCouponSelectModal.value = true;
};

const handleCouponModalClose = () => {
  showCouponSelectModal.value = false;
};

const handleCouponSubmit = (coupons) => {
  attachedCoupons.value = [...attachedCoupons.value, ...coupons]; // 선택된 쿠폰 추가
  showCouponSelectModal.value = false; // 모달 닫기
};

const clickTargetUserSelect = async() => {
  showTargetUserSelectModal.value = true;
};
const handleTargetUserModalClose = () => {
  showTargetUserSelectModal.value = false;
};

const handleTargetUserSubmit = (users) => {
  targetUsers.value = [...targetUsers.value, ...users]; // 선택된 유저 추가
  showTargetUserSelectModal.value = false; // 모달 닫기
};

const templates = ref([]);
const selectedTemplateCode = ref('');
const campaignTitle = ref('');
const campaignContents = ref('');
const isEditMode = ref(false);
const campaignType = ref('즉시 발송');
const selectedDate = ref('');
const selectedTime = ref('');
const attachedCoupons = ref([]);
const targetUsers = ref([]);

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

const updateTemplate = async () => {
  if (!selectedTemplateCode.value) {
    campaignTitle.value = '';
    campaignContents.value = '';
  } else {
    const template = templates.value.find((t) => t.campaign_template_code === selectedTemplateCode.value);
    if (template) {
      campaignTitle.value = template.campaign_template_title;
      campaignContents.value = template.campaign_template_contents;
    }
  }
};

const fetchTemplates = async () => {
  try {
    const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ';
    const response = await axios.get('http://localhost:5000/campaign-template/list',{
      method: 'GET',
      headers: {
        Authorization: token,
        }
      });
    templates.value = response.data;
    console.log(templates.value);
  } catch (error) {
    console.error('Failed to fetch templates:', error);
  }
};

const selectSendType = (type) => {
  campaignType.value = type;
  if (type === '즉시 발송') {
    selectedDate.value = '';
    selectedTime.value = '';
  }
};

const registerCampaign = async () => {
  if (campaignType.value === '예약 발송' && (!selectedDate.value || !selectedTime.value)) {
    alert('예약 발송 시 날짜와 시간을 설정해주세요.');
    return;
  }

  if (!campaignTitle.value || !campaignContents.value) {
    alert('캠페인 제목과 내용을 입력해주세요.');
    return;
  }

  const payload = {
    campaignTitle: campaignTitle.value,
    campaignContents: campaignContents.value,
    campaignType: campaignType.value,
    campaignSendDate: campaignType.value === '예약 발송' ? `${selectedDate.value}T${selectedTime.value}` : null,
    coupons: attachedCoupons.value, // coupons, targetUsers 이름 바꿔야함.
    targetUsers: targetUsers.value,
  };

  try {
    await post('/https://learnsmate.site/campaign/register', payload);
    alert('캠페인이 등록되었습니다.'); // 모달창으로 변경하기
    window.location.href = '/'; // 해당 캠페인 조회 페이지로? 아니면 전체 조회 페이지로?
  } catch (error) {
    console.error('Failed to register campaign:', error);
    alert('캠페인 등록에 실패했습니다.'); // 모달창으로 변경하기
  } 
};

const cancelCampaign = () => {
  if (confirm('캠페인 등록을 취소하시겠습니까?')) { // 모달창으로 변경하기
    window.location.href = '/marketing';
  }
};

fetchTemplates();
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

.detail-content-textarea {
  padding: 5px 8px;
  margin: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  width: 70%;
  font-family: inherit;
}

.detail-content-input {
  padding: 5px 8px;
  margin: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  width: 40%;
  font-family: inherit;
}

.template-select {
  padding: 5px 8px;
  margin: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  width: 40%;
  outline: none; 
}


.content-multiline {
    white-space: pre-line;
    line-height: 1.6;
    min-height: 171.6px;
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

.send-type-btn.active {
  color: #FFFFFF;
  background-color: #005950;
}

.date-input,
.time-input {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
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

.attach-buttons, .target-buttons {
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

.add-coupon-btn, .add-target-user-btn {
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
    
.coupon-item, .target-user-item {
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

.campaign-register-button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8%;
}

.campaign-register-button, .campaign-cancel-button {
  display: flex;
  gap: 5px;
  font-size: 15px;
  align-items: center;
  padding: 2px 10px;
  background-color: #005950;
  color: white;
  border: 1px solid #005950;
  border-radius: 4px;
  cursor: pointer;   
}


</style>