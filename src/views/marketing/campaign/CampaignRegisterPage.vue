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
                <span class="detail-content">{{ userName }}</span>
                <span class="detail-title">발송 수단</span>
                <div class="detail-content send-method">
                  <button
                    class="send-method-btn"
                    :class="{ active: campaignMethod === 'Email' }"
                    @click="selectSendMethod('Email')"
                  >
                    Email
                  </button>
                  <button
                    class="send-method-btn"
                    :class="{ active: campaignMethod === 'SMS' }"
                    @click="selectSendMethod('SMS')"
                  >
                    SMS
                  </button>
                </div>
              </div>
              <div class="campaign-detail-row">
                <span class="detail-title">발송 유형</span>
                <div class="detail-content send-type">
                  <button
                    class="send-type-btn"
                    :class="{ active: campaignType === 'INSTANT' }"
                    @click="selectSendType('INSTANT')"
                  >
                    즉시 발송
                  </button>
                  <button
                    class="send-type-btn"
                    :class="{ active: campaignType === 'RESERVATION' }"
                    @click="selectSendType('RESERVATION')"
                  >
                    예약 발송
                  </button>
                  <input
                    type="date"
                    v-model="selectedDate"
                    class="date-input"
                    :min="minDate"
                    :disabled="campaignType === 'INSTANT'"
                    @change="handleDateChange"
                  />
                  <TimeSelect
                    v-model="selectedTime"
                    :disabled="campaignType === 'INSTANT'"
                    :selected-date="selectedDate"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="campaign-attach">
            <div class="campaign-header">
              <span class="campaign-attach-span">쿠폰 첨부</span>
              <div class="attach-buttons">
                <input type="file" ref="couponFile" @change="handleCouponFileChange" accept=".xlsx, .xls" hidden />
                <button class="excel-download-btn"  @click="triggerFileUpload('coupon')">
                  <img src="/src/assets/icons/upload.svg" alt="엑셀 업로드" />
                  엑셀 업로드
                </button>
                <button class="add-coupon-btn" @click="clickCouponSelect">+</button>
                <button 
                  class="remove-all-btn" 
                  @click="clearAllCoupons"
                  v-if="attachedCoupons.length > 0"
                >-</button>
              </div>
            </div>
            <div class="coupon-list">
              <div v-for="coupon in attachedCoupons" :key="coupon.coupon_code" class="coupon-item">
                <span class="coupon-name">{{ coupon.coupon_name }}</span>
                <button class="remove-item-btn" @click="removeCoupon(coupon)">×</button>
              </div>
            </div>
          </div>
        </div>
        <div class="campaign-header">
          <span class="campaign-select-span">타겟 유저</span>
          <div class="target-buttons">
            <input type="file" ref="targetUserFile" @change="handleTargetUserFileChange" accept=".xlsx, .xls" hidden />
            <button class="excel-download-btn" @click="triggerFileUpload('targetUser')">
              <img src="/src/assets/icons/upload.svg" alt="엑셀 업로드" />
              엑셀 업로드
            </button>
            <button class="add-target-user-btn" @click="clickTargetUserSelect">+</button>
            <button 
              class="remove-all-btn" 
              @click="clearAllUsers"
              v-if="targetUsers.length > 0"
            >-</button>
          </div>
        </div>
        <div class="target-user-list">
          <div class="target-user-board-header">
            <div class="target-user-board-header-code">학생 코드</div>
            <div class="target-user-board-header-name">이름</div>
            <div class="target-user-board-header-email">이메일</div>
            <div class="target-user-board-header-phone">연락처</div>
            <div class="target-user-board-header-address">주소</div>
            <div class="target-user-board-header-age">나이</div>
            <div class="target-user-board-header-birth">생년월일</div>
            <div class="target-user-board-header-memberflag">계정상태</div>
            <div class="target-user-board-header-createdat">생성일</div>
            <div class="target-user-board-header-dormantflag">휴면상태</div>
            <div class="target-user-board-header-action">삭제</div>
          </div>
          <div v-for="user in paginatedTargetUsers" :key="user.member_code" class="target-user-item">
            <div class="target-user-board-row-code">{{ user.member_code }}</div>
            <div class="target-user-board-row-name">{{ user.member_name }}</div>
            <div class="target-user-board-row-email">{{ user.member_email }}</div>
            <div class="target-user-board-row-phone">{{ user.member_phone }}</div>
            <div class="target-user-board-row-address">{{ user.member_address }}</div>
            <div class="target-user-board-row-age">{{ user.member_age }}</div>
            <div class="target-user-board-row-birth">{{ user.member_birth }}</div>
            <div class="target-user-board-row-memberflag">{{ user.member_flag ? '활성' : '비활성' }}</div>
            <div class="target-user-board-row-createdat">{{ formatToDateTime(user.created_at) }}</div>
            <div class="target-user-board-row-dormantflag">{{ user.member_dormant_flag ? '휴면' : '활성' }}</div>
            <div class="target-user-board-row-action">
              <button class="remove-item-btn" @click="removeUser(user)">×</button>
            </div>
          </div>
          <!-- 페이지네이션 -->
          <div class="pagination">
            <button 
              class="page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >◀</button>
            <button 
              class="page-button" 
              :class="{ active: currentPage === 1 }" 
              @click="changePage(1)"
            >1</button>
            <span v-if="startPage > 2">...</span>
            <template v-for="page in displayedPages" :key="page">
              <button 
                v-if="page !== 1 && page !== totalPages" 
                class="page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >{{ page }}</button>
            </template>
            <span v-if="endPage < totalPages - 1">...</span>
            <button 
              v-if="totalPages > 1" 
              class="page-button" 
              :class="{ active: currentPage === totalPages }" 
              @click="changePage(totalPages)"
            >{{ totalPages }}</button>
            <button 
              class="page-button next-button" 
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >▶</button>
          </div>
        </div>
        <div class="campaign-register-button-group">
          <button class="campaign-register-button" @click="showRegisterModal">
            등록
          </button>
          <button class="campaign-cancel-button" @click="showCancelModal">
            취소
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
  <RegisterModule
      v-if="isRegisterModalOpen"
      modalTitle="캠페인을 등록하시겠습니까?"
      @confirm="confirmRegister"
      @cancel="cancelRegister"
    />
    <CancelModule
      v-if="isCancelModalOpen"
      modalTitle="캠페인 등록을 취소하시겠습니까?"
      @confirm="confirmCancel"
      @cancel="cancelRegister"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import CouponSelectModal from '@/components/marketing/couponSelectModal.vue';
import TargetUserSelctModal from '@/components/marketing/TargetUserSelectModal.vue';
import RegisterModule from '@/components/modules/RegisterModule.vue';
import CancelModule from '@/components/modules/CancelModule.vue'; 
import { useLoginState } from '@/stores/loginState';
import TimeSelect from '@/components/marketing/TimeSelect.vue';

const loginState = useLoginState();

const userCode = loginState.adminCode;
const userName = loginState.adminName;

const isRegisterModalOpen = ref(false);
const isCancelModalOpen = ref(false);
const showCouponSelectModal = ref(false);
const showTargetUserSelectModal = ref(false);
const templates = ref([]);
const selectedTemplateCode = ref('');
const campaignTitle = ref('');
const campaignContents = ref('');
const isEditMode = ref(false);
const campaignType = ref('INSTANT');
const campaignMethod = ref('Email');
const selectedDate = ref('');
const selectedTime = ref('');

const attachedCouponMap = ref(new Map());
const targetUserMap = ref(new Map());

const attachedCoupons = computed(() => Array.from(attachedCouponMap.value.values()));
const targetUsers = computed(() => Array.from(targetUserMap.value.values()));

const couponFile = ref(null);
const targetUserFile = ref(null);

const currentPage = ref(1);
const pageSize = 50;
const totalPages = computed(() => Math.ceil(targetUsers.value.length / pageSize));
const paginatedTargetUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return targetUsers.value.slice(start, start + pageSize);
});

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};
const formatHour = (hour) => `${String(hour).padStart(2, '0')}:00`;

const isPastTime = (hour) => {
  const now = new Date();
  const selectedDateTime = new Date(selectedDate.value);
  selectedDateTime.setHours(hour, 0, 0, 0);

  // 현재 날짜와 시간 비교
  return selectedDateTime <= now && selectedDate.value === now.toISOString().split('T')[0];
};


const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
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

  const startPage = computed(() => {
    return displayedPages.value[0];
  });

  const endPage = computed(() => {
    return displayedPages.value[displayedPages.value.length - 1];
  });

const clickCouponSelect = () => {
  showCouponSelectModal.value = true;
};

const handleCouponModalClose = () => {
  showCouponSelectModal.value = false;
};

const handleCouponSubmit = (coupons) => {
  coupons.forEach(coupon => {
    attachedCouponMap.value.set(coupon.coupon_code, coupon);
  });
  showCouponSelectModal.value = false;
};

const removeCoupon = (coupon) => {
  attachedCouponMap.value.delete(coupon.coupon_code);
};

const clearAllCoupons = () => {
  if (confirm('선택한 모든 쿠폰을 삭제하시겠습니까?')) {
    attachedCouponMap.value.clear();
  }
};

const clickTargetUserSelect = () => {
  showTargetUserSelectModal.value = true;
};

const handleTargetUserModalClose = () => {
  showTargetUserSelectModal.value = false;
};

const handleTargetUserSubmit = (users) => {
  users.forEach(user => {
    targetUserMap.value.set(user.member_code, user);
  });
  showTargetUserSelectModal.value = false;
};

const removeUser = (user) => {
  targetUserMap.value.delete(user.member_code);
};

const clearAllUsers = () => {
  if (confirm('선택한 모든 사용자를 삭제하시겠습니까?')) {
    targetUserMap.value.clear();
  }
};

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
    const response = await axios.get('https://learnsmate.shop/campaign-template/list', {
      withCredentials: true,
    });
    templates.value = response.data;
  } catch (error) {
    console.error('Failed to fetch templates:', error);
  }
};

const selectSendType = (type) => {
  campaignType.value = type;
  if (type === 'INSTANT') {
    selectedDate.value = '';
    selectedTime.value = '';
  }
};

const selectSendMethod = (method) => {
  campaignMethod.value = method;
};

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const minTime = computed(() => {
  if (selectedDate.value === minDate.value) {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
  return '00:00';
});

const handleDateChange = () => {
  if (selectedDate.value === minDate.value) {
    selectedTime.value = "";
  }
};

const triggerFileUpload = (type) => {
  if (type === 'coupon' && couponFile.value) {
    couponFile.value.click();
  } else if (type === 'targetUser' && targetUserFile.value) {
    targetUserFile.value.click();
  }
};

const handleTargetUserFileChange = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append("file", file);
  if (file) {
    try {
      const response = await axios.post("https://learnsmate.shop/member/excel/upload/target-student", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("file upload success :", response.data);
      camelToSnake(response.data).forEach((user) => {
        targetUserMap.value.set(user.member_code, user);
      });
    } catch (error) {
      console.error("file upload fail:", error.message);
    }
  }
};

const handleCouponFileChange = async (event) => {
  const file = event.target.files[0];
  const formData = new FormData(); 
  formData.append("file", file);
  if (file) {
    try {
      const response = await axios.post("https://learnsmate.shop/coupon/excel/upload/target-coupon", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("file upload success :", response.data);
      camelToSnake(response.data).forEach((coupon) => {
        attachedCouponMap.value.set(coupon.coupon_code, coupon);
      });
    } catch (error) {
      console.error("file upload fail :", error.message);
    }
  }
};


const registerCampaign = async () => {
  if (campaignType.value === 'RESERVATION' && (!selectedDate.value || !selectedTime.value)) {   
    throw new Error('예약 발송 시 날짜와 시간을 설정해주세요.');
  }

  if (!campaignTitle.value || !campaignContents.value) {
    throw new Error('캠페인 제목과 내용을 입력해주세요.');
  }

  function formatToLocalDateTime(dateString) {
    if (!dateString || dateString.includes('T')) return dateString; // 이미 변환된 경우
    return `${dateString}T00:00:00`; // 시간 추가
  }

  const formattedStudentList = targetUsers.value.map(user => {
    return {
      ...user,
      member_birth: formatToLocalDateTime(user.member_birth) // 생일 변환
    };
  });


  const payload = {
    campaign_title: campaignTitle.value,
    campaign_contents: campaignContents.value,
    campaign_type: campaignType.value,
    campaign_method: campaignMethod.value,
    campaign_send_date: campaignType.value === 'RESERVATION' ? `${selectedDate.value}T${selectedTime.value}` : null,
    coupon_list: attachedCoupons.value,
    student_list: formattedStudentList,
    admin_code: userCode,
  };
  try {
    await axios.post('https://learnsmate.shop/campaign/register', payload, {
      withCredentials:true,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to register campaign:', error);
    alert('캠페인 등록에 실패했습니다.');
  }
};

const showRegisterModal = () => {
  isRegisterModalOpen.value = true;
};

const showCancelModal = () => {
  isCancelModalOpen.value = true;
};

const confirmRegister = async () => {
  try {
    registerCampaign(); 
    isRegisterModalOpen.value = false;
    window.location.href = '/marketing'; 
  } catch (error) {
    console.error('캠페인 등록 실패:', error);
    alert('등록에 실패했습니다.');
  }
};

const confirmCancel = () => {
    isCancelModalOpen.value = false; 
    window.location.href = '/marketing'; 
};

const cancelRegister = () => {
  isRegisterModalOpen.value = false;
  isCancelModalOpen.value = false;
};

const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
  const [year, month, day] = dateArray;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

function formatToDateTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

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
   outline: none;
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

.send-method {
   display: flex;
   gap: 10px;
   align-items: center;
}

.send-type-btn, .send-method-btn {
  padding: 5px 8px;
   background-color: #f0f0f0;
   border: 1px solid #ddd;
   border-radius: 4px;
   font-size: 11px;
   cursor: pointer;
}

.send-type-btn.active, .send-method-btn.active {
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

.time-select {
  max-height: 40px;  
  overflow-y: auto;   
  height: 30.4px;    
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px;
  font-size: 13px; 
  background-color: #ffffff;
  color: #333333;
  cursor: pointer;
  outline: none;
}



.time-select option:disabled {
  color: #bbb;
  background-color: #f9f9f9;
}

.campaign-attach {
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

.coupon-item {
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

.campaign-register-button-group {
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 20px;
   gap: 8%;
}

.campaign-register-button,
.campaign-cancel-button {
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

.campaign-register-button:hover,
.campaign-cancel-button:hover {
   background-color: #004c42;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 5px;
    background-color: #f9f9f9;
  }

  .page-button {
    background: none;
    border: none;
    color: #333;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 13px;
    margin: 0 2px;
  }

  .page-button.active {
    font-weight: bold;
    color: #005950;
  }

  .page-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .prev-button,
  .next-button {
    font-size: 12px;
  }
</style>