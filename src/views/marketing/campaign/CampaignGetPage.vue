<template>
  <div class="campaign-get-container">
    <MarketingSideMenu />
    <div class="campaign-get-contents-container">
      <div class="campaign-get-contents-column">
         <div class="campaign-get-contents-row">
        <div class="campaign-get-select">
          <div class="campaign-get-header">
            <span class="campaign-get-select-span">캠페인 조회</span>
          </div>
          <div class="campaign-get-details">
            <div class="campaign-get-detail-row">
              <span class="detail-title">캠페인 제목</span>
              <span v-if="!isEditMode" class="detail-content" >{{ campaign.campaign_title }}</span>
              <input
                v-if="isEditMode"
                v-model="campaign.campaign_title"
                class="detail-content-input"
                placeholder="캠페인 제목을 입력하세요"
              />
            </div>
            <div class="campaign-get-detail-row">
              <span class="detail-title">캠페인 내용</span>
              <textarea
                v-if="isEditMode"
                v-model="campaign.campaign_contents"
                class="detail-content-textarea"
                placeholder="캠페인 내용을 입력하세요"
                rows="10"
              ></textarea>
              <span v-else class="detail-content content-multiline">{{ campaign.campaign_contents }}</span>
            </div>
            <div class="campaign-get-detail-row">
              <span class="detail-title">담당자</span>
              <span class="detail-content">{{ userName }}</span>
            </div>
            <div class="campaign-get-detail-row">
              <span class="detail-title">발송 유형</span>
              <div class="detail-content send-type">
                  <button
                      class="send-type-btn"
                      :class="{ active: campaignType === 'INSTANT' }"
                      disabled
                  >
                      즉시 발송
                  </button>
                  <button
                      class="send-type-btn"
                      :class="{ active: campaignType === 'RESERVATION' }"
                      disabled
                  >
                      예약 발송
                  </button>

                  <span v-if="campaignType === 'RESERVATION' && !isEditMode">
                      {{ selectedDate }} {{ selectedTime }}
                  </span>
                  <input
                      v-if="isEditMode && campaignType === 'RESERVATION'"
                      type="date"
                      v-model="selectedDate"
                      class="date-input"
                  />
                  <input
                      v-if="isEditMode && campaignType === 'RESERVATION'"
                      type="time"
                      v-model="selectedTime"
                      class="time-input"
                  />
              </div>
          </div>

          </div>
        </div>

        <div class="campaign-get-attach">
          <div class="campaign-get-header">
            <span class="campaign-get-attach-span">쿠폰</span>
            <div class="attach-buttons">
              <button class="excel-download-btn" v-if="isEditMode">
                <img src="/src/assets/icons/upload.svg" alt="엑셀 업로드" />
                엑셀 업로드
              </button>
              <button class="add-coupon-btn" @click="clickCouponSelect" v-if="isEditMode">+</button>
              <button 
                class="remove-all-btn" 
                @click="clearAllCoupons"
                v-if="attachedCoupons.length > 0 && isEditMode"
              >-</button>
            </div>
          </div>
          <div class="campaign-get-coupon-list">
              <div v-for="coupon in campaign.coupons" :key="coupon.coupon_code" class="campaign-get-coupon-item">
                <span class="coupon-name">{{ coupon.coupon_name }}</span>
                <button class="remove-item-btn" @click="removeCoupon(coupon)" v-if="isEditMode">×</button>
            </div>
          </div>
        </div>
      </div>

        <div class="campaign-get-header">
          <span class="campaign-get-select-span">타겟 유저</span>
          <div class="target-buttons">
            <button class="excel-download-btn" v-if="isEditMode">
              <img src="/src/assets/icons/upload.svg" alt="엑셀 업로드" />
              엑셀 업로드
            </button>
            <button class="add-target-user-btn" @click="clickTargetUserSelect" v-if="isEditMode">+</button>
            <button 
              class="remove-all-btn" 
              @click="clearAllUsers"
              v-if="isEditMode"
            >-</button>
          </div>
        </div>
        <div class="target-user-list">
          <div class="target-user-board-header">
            <div>학생 코드</div>
            <div>이름</div>
            <div>이메일</div>
            <div>연락처</div>
            <div>주소</div>
            <div>나이</div>
            <div>생년월일</div>
            <div>계정상태</div>
            <div>생성일</div>
            <div>휴면상태</div>
            <div>삭제</div>
          </div>
          <div v-for="user in campaign.members" :key="user.member_code" class="target-user-item">
            <div>{{ user.member_code }}</div>
            <div>{{ user.member_name }}</div>
            <div>{{ user.member_email }}</div>
            <div>{{ user.member_phone }}</div>
            <div>{{ user.member_address }}</div>
            <div>{{ user.member_age }}</div>
            <div>{{ formatDateFromArray(user.member_birth) }}</div>
            <div>{{ user.member_flag ? '활성' : '비활성' }}</div>
            <div>{{ formatDateTimeFromArray(user.created_at) }}</div>
            <div>{{ user.member_dormant_flag ? '휴면' : '활성' }}</div>
            <div><button class="remove-item-btn" @click="removeUser(user)" v-if="isEditMode">×</button></div>
          </div>
        </div>

        <div class="campaign-get-register-button-group">
          <button 
              class="campaign-get-register-button"
              :class="{ 'instant-button': campaignType === 'INSTANT' }"
              :disabled="campaignType === 'INSTANT'"
              v-if="!isEditMode"
              @click="toggleEditMode"
          >
              수정
          </button>
          <button 
              class="campaign-get-cancel-button" 
              :class="{ 'instant-button': campaignType === 'INSTANT' }"
              :disabled="campaignType === 'INSTANT'"
              v-if="!isEditMode" 
              @click="confirmCancelCampaign"
          >
              예약 취소
          </button>
          <button 
              class="campaign-get-register-button"
              v-if="isEditMode"
              @click="saveChanges"
          >
              확인
          </button>
          <button 
              class="campaign-get-cancel-button"
              v-if="isEditMode"
              @click="cancelEditMode"
          >
              취소
          </button>
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
    <CancelModule
      v-if="isCancelModalOpen"
      modalTitle="예약을 취소하시겠습니까?"
      @confirm="confirmCancel"
      @cancel="cancelRegister"
    />
  </div>
</template>

  
  
  <script setup>
  import { ref, computed, watch  } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  import { jwtDecode } from 'jwt-decode'; 
  import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
  import CouponSelectModal from '@/components/marketing/couponSelectModal.vue';
  import TargetUserSelctModal from '@/components/marketing/TargetUserSelectModal.vue';
  import CancelModule from '@/components/modules/CancelModule.vue';
  
  const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjI2MTY5MywiZXhwIjoxNzc1NDYxNjkzfQ.sfY4-uvhksfHdeuFUY216KJbfjkK8jeBWAVBzFttMYpn_zC4ao2FB9DZt6xEleAGh7VsteoloNjAPCWbzxD6xg';
  const userCode = jwtDecode(token).sub;
  const userName = jwtDecode(token).name;
  
  const route = useRoute();
  
  const campaign = ref({});
  const isEditMode = ref(false);
  
  const showCouponSelectModal = ref(false);
  const showTargetUserSelectModal = ref(false);
  const isCancelModalOpen = ref(false);
  
  const campaignType = ref('RESERVATION'); 
  const selectedDate = ref('');
  const selectedTime = ref('');
  
  const attachedCouponMap = ref(new Map());
  const targetUserMap = ref(new Map());
  
  const attachedCoupons = computed(() => Array.from(attachedCouponMap.value.values()));
  const targetUsers = computed(() => Array.from(targetUserMap.value.values()));
  
  const fetchTemplate = async () => {
    const campaignCode = route.query.campaignCode;
    try {
        const response = await axios.get(`http://localhost:5000/campaign/${campaignCode}`, {
            headers: { Authorization: token },
        });
        campaign.value = response.data;

        campaignType.value = campaign.value.campaign_type; 

        if (campaignType.value === 'RESERVATION' && Array.isArray(campaign.value.campaign_send_date)) {
            const formattedDateTime = formatSendDateFromArray(campaign.value.campaign_send_date);
            const [date, time] = formattedDateTime.split(' ');
            selectedDate.value = date; 
            selectedTime.value = time; 
        } else {
            selectedDate.value = '';
            selectedTime.value = '';
        }

        attachedCouponMap.value.clear();
        if (campaign.value.coupons) {
            campaign.value.coupons.forEach((coupon) => {
                attachedCouponMap.value.set(coupon.coupon_code, coupon);
            });
        }
        targetUserMap.value.clear();
        if (campaign.value.members) {
            campaign.value.members.forEach((member) => {
                targetUserMap.value.set(member.member_code, member);
            });
        }
    } catch (error) {
        console.error('캠페인 데이터 로드 실패:', error);
    }
};



  
const toggleEditMode = () => {
    if (campaignType.value === 'RESERVATION' && Array.isArray(campaign.value.campaign_send_date)) {
        const formattedDateTime = formatSendDateFromArray(campaign.value.campaign_send_date);
        const [date, time] = formattedDateTime.split(' ');
        selectedDate.value = date; // "YYYY-MM-DD"
        selectedTime.value = time; // "HH:MM"
    }
    isEditMode.value = true;
};

  
  const saveChanges = async () => {
    if (campaignType.value === 'RESERVATION' && (!selectedDate.value || !selectedTime.value)) {
        alert('예약 발송 날짜와 시간을 설정하세요.');
        return;
    }

    const payload = {
        campaign_code: campaign.value.campaign_code,
        campaign_title: campaign.value.campaign_title,
        campaign_contents: campaign.value.campaign_contents,
        campaign_type: campaignType.value, 
        campaign_send_date: campaignType.value === 'RESERVATION' ? `${selectedDate.value}T${selectedTime.value}` : null,
        coupons: attachedCoupons.value,
        members: targetUsers.value,
        admin_code: userCode,
        created_at: campaign.value.created_at,
        updated_at: new Date().toISOString(),
    };

      try {
          await axios.patch('http://localhost:5000/campaign/edit', payload, {
              headers: {
                  Authorization: token,
                  'Content-Type': 'application/json',
              },
          });
          isEditMode.value = false;
          fetchTemplate(); 
      } catch (error) {
          console.error('캠페인 수정 실패:', error);
          alert('발송 날짜/시간을 입력해주세요');
      }
  };

  
  const cancelEditMode = () => {
    if (confirm('수정을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) {
      isEditMode.value = false;
      fetchTemplate(); 
    }
  };
  const confirmCancelCampaign = async () => {
    isCancelModalOpen.value = true;
  };
  
  const cancelCampaign = async () => {
    const campaignCode = route.query.campaignCode;
    try {
      await axios.delete(`http://localhost:5000/campaign/delete/${campaignCode}`, {
              headers: {
                  Authorization: token,
              },
          });
          window.location.href = '/marketing';
    } catch (error) {
      console.error('캠페인 삭제 실패:', error);
          alert('삭제에 실패했습니다.');
    }

  };
  
  const clickCouponSelect = () => {
    showCouponSelectModal.value = true;
  };
  
  const handleCouponModalClose = () => {
    showCouponSelectModal.value = false;
  };
  
  const handleCouponSubmit = (coupons) => {
    coupons.forEach((coupon) => {
      attachedCouponMap.value.set(coupon.coupon_code, coupon);
    });
    campaign.value.coupons = Array.from(attachedCouponMap.value.values());
    showCouponSelectModal.value = false;
  };
  
  const removeCoupon = (coupon) => {
    attachedCouponMap.value.delete(coupon.coupon_code);
    campaign.value.coupons = Array.from(attachedCouponMap.value.values());
  };
  
  const clearAllCoupons = () => {
    if (confirm('선택한 모든 쿠폰을 삭제하시겠습니까?')) {
      attachedCouponMap.value.clear();
      campaign.value.coupons = [];
    }
  };
  
  const clickTargetUserSelect = () => {
    showTargetUserSelectModal.value = true;
  };
  
  const handleTargetUserModalClose = () => {
    showTargetUserSelectModal.value = false;
  };
  
  const handleTargetUserSubmit = (users) => {
    users.forEach((user) => {
      targetUserMap.value.set(user.member_code, user);
    });
    campaign.value.members = Array.from(targetUserMap.value.values());
    showTargetUserSelectModal.value = false;
  };

  const confirmCancel = () => {
    isCancelModalOpen.value = false; 
    cancelCampaign();
  };

  const cancelRegister = () => {
    isCancelModalOpen.value = false;
    return;
  };

  const removeUser = (user) => {
    targetUserMap.value.delete(user.member_code);
    campaign.value.members = Array.from(targetUserMap.value.values());
  };

  
  const clearAllUsers = () => {
    if (confirm('선택한 모든 사용자를 삭제하시겠습니까?')) {
      targetUserMap.value.clear();
      campaign.value.members = [];
    }
  };

  const formatDateTimeFromArray = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return '';
    const [year, month, day, hours, minutes, seconds] = dateArray;
    return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  const formatSendDateFromArray = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 5) return '';
    const [year, month, day, hours, minutes] = dateArray;
    return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };
  
  const formatDateFromArray = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
    const [year, month, day] = dateArray;
    return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
  };

  watch(() => campaign.value, (newCampaign) => {
    attachedCouponMap.value.clear();
    targetUserMap.value.clear();
    
    if (newCampaign.coupons) {
      newCampaign.coupons.forEach((coupon) => {
        attachedCouponMap.value.set(coupon.coupon_code, coupon);
      });
    }
    
    if (newCampaign.members) {
      newCampaign.members.forEach((member) => {
        targetUserMap.value.set(member.member_code, member);
      });
    }
  }, { deep: true });
  
  fetchTemplate();
  </script>
  

  
<style scoped>
.campaign-get-container {
   display: flex;
   flex-direction: column;
   padding: 20px;
}

.campaign-get-contents-container {
   display: block;
   flex-grow: 1;
   margin-left: 160px;
   margin-top: 50px;
   padding: 20px 30px;
   background-color: white;
   height: auto;
   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.campaign-get-contents-column {
   display: flex;
   flex-direction: column;
}

.campaign-get-contents-row {
   display: flex;
   flex-direction: row;
   gap: 10%;
   margin-bottom: 20px;
}

.campaign-get-header {
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

.campaign-get-select {
   width: 45%;
}

.campaign-get-select-span {
   font-size: 18px;
   font-weight: bold;
}

.campaign-get-attach-span {
   font-size: 18px;
   font-weight: bold;
}

.campaign-get-target-span {
   font-size: 18px;
   font-weight: bold;
}

.campaign-get-details {
   display: flex;
   flex-direction: column;
   border-top: 2px solid #333;
}

.campaign-get-detail-row {
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
  color: #ffffff;
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

.campaign-get-attach {
   width: 45%;
}

.attach-buttons,
.target-buttons {
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
   padding: 4px 8px;
}

.excel-download-btn img {
   width: 16px;
   height: 16px;
}

.excel-download-btn:hover {
   background-color: #004c42;
}

.add-coupon-btn,
.add-target-user-btn {
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

.add-coupon-btn:hover,
.add-target-user-btn:hover {
   background-color: #004c42;
}

.remove-all-btn {
   width: 25px;
   height: 25px;
   font-size: 15px;
   background-color: #858282;
   color: white;
   border: 1px solid #858282;
   border-radius: 4px;
   cursor: pointer;
   display: flex;
   align-items: center;
   justify-content: center;
}

.remove-all-btn:hover {
   background-color: #39ac75;
}

.remove-item-btn {
   background: none;
   border: none;
   color: #004c42;
   font-size: 18px;
   cursor: pointer;
   padding: 0 5px;
}

.remove-item-btn:hover {
   color: #39ac75;
}

.campaign-get-coupon-list {
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

.target-user-board-header {
   display: grid;
   grid-template-columns: 0.8fr 1fr 2fr 1fr 3fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
   padding: 10px 20px;
   background-color: #f9f9f9;
   font-size: 13px;
   font-weight: bold;
   color: #595656;
   text-align: center;
}

.campaign-get-coupon-item {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 8px 12px;
   background-color: white;
   border: 1px solid #ddd;
   border-radius: 4px;
   font-size: 12px;
}

.target-user-item {
   display: grid;
   grid-template-columns: 0.8fr 1fr 2fr 1fr 3fr 1fr 1fr 1fr 1fr 1fr 0.5fr;
   padding: 10px 20px;
   background-color: white;
   border: 1px solid #ddd;
   border-radius: 4px;
   font-size: 12px;
   text-align: center;
   align-items: center;
}

.target-user-board-row-action {
   display: flex;
   justify-content: center;
   align-items: center;
}

.campaign-get-register-button-group {
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 20px;
   gap: 8%;
}

.campaign-get-register-button,
.campaign-get-cancel-button {
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

.campaign-get-register-button:hover,
.campaign-get-cancel-button:hover {
   background-color: #004c42;
}

.instant-button {
  background-color: #ddd; /* 원하는 색상 */
  border-color: #ddd;
  color: white;
  cursor: not-allowed;
}

.instant-button:hover {
  background-color: #ddd;
}

</style>
