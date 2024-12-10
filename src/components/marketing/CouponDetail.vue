<template>
  
  <div class="coupon-detail-contents">
    <div class="coupon-detail-header">
    <div class="coupon-detail-title">쿠폰</div>
    <button class="coupon-detail-close-button" @click="closeCouponDetail">x</button>
  </div>
    <div class="coupon-detail-table" v-if="props.selectedCoupon">
      <div class="coupon-detail-table-row">
        <div class="coupon-detail-table-head">쿠폰 번호</div>
        <div class="coupon-detail-table-body">{{ props.selectedCoupon.coupon_code }}</div>
      </div>
      <div class="coupon-detail-table-row">
        <div class="coupon-detail-table-head">쿠폰 이름</div>
        <div class="coupon-detail-table-body" v-if="isEditMode">
          <input type="text" v-model="editCouponData.coupon_name">
        </div>
        <div class="coupon-detail-table-body" v-else>
          {{ props.selectedCoupon.coupon_name }}
        </div>
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">쿠폰 내용</div>
      <div class="coupon-detail-table-body" v-if="isEditMode">
        <textarea v-model="editCouponData.coupon_contents"></textarea>
      </div>
      <div class="coupon-detail-table-body" v-else>
        {{ props.selectedCoupon.coupon_contents || '-' }}
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">쿠폰 할인율</div>
      <div class="coupon-detail-table-body" v-if="isEditMode">
        <input type="number" min="0" max="100" v-model="editCouponData.coupon_discount_rate">
      </div>
      <div class="coupon-detail-table-body" v-else>
        {{ props.selectedCoupon.coupon_discount_rate }}
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">쿠폰 종류</div>
      <div class="coupon-detail-table-body" v-if="isEditMode">
        <select v-model="editCouponData.coupon_category_name">
          <option value="일반">일반</option>
          <option value="기념일">기념일</option>
          <option value="신규가입">신규가입</option>
          <option value="첫구매">첫 구매</option>
          <option value="복귀">복귀</option>
          <option value="완강">완강</option>
          <option value="이벤트">이벤트</option>
        </select>
      </div>
      <div class="coupon-detail-table-body" v-else>
        {{ props.selectedCoupon.coupon_category_name }}
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">상태</div>
      <div class="coupon-detail-table-body">
        <div :class="{
          'active-state': true,
          'active': coupon.active_state && coupon.coupon_flag,
          'inactive': !coupon.active_state || !coupon.coupon_flag
          }">{{ (coupon.active_state && coupon.coupon_flag) ? '활성' : (!coupon.coupon_flag ? '삭제' : '비활성') }}
        </div>
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">시작일</div>
      <div class="coupon-detail-table-body" v-if="isEditMode">
        <input type="date" v-model="formattedStartDate">
      </div>
      <div class="coupon-detail-table-body" v-else>
        {{ formatDate(props.selectedCoupon.coupon_start_date) }}
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">만료일</div>
      <div class="coupon-detail-table-body" v-if="isEditMode">
        <input type="date" v-model="formattedExpireDate">
      </div>
      <div class="coupon-detail-table-body" v-else>
        {{ formatDate(props.selectedCoupon.coupon_expire_date) }}
      </div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">생성일</div>
      <div class="coupon-detail-table-body">{{ formatDate(props.selectedCoupon.created_at) }}</div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">수정일</div>
      <div class="coupon-detail-table-body">{{ formatDate(props.selectedCoupon.updated_at) }}</div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">직원</div>
      <div class="coupon-detail-table-body">{{ selectedCoupon.admin_name || '-' }}</div>
    </div>
    <div class="coupon-detail-table-row">
      <div class="coupon-detail-table-head">강사</div>
      <div class="coupon-detail-table-body">{{ props.selectedCoupon.tutor_name || '-' }}</div>
    </div>
    <div class="coupon-buttons">
      <template v-if="!isEditMode">
        <button 
          class="coupon-edit-button" 
          @click="handleEditClick"
          :class="{ 'disabled': isDeleted }"
          :disabled="isDeleted"
        >수정</button>
        <button 
          class="coupon-delete-button" 
          @click="handleDeleteClick"
          :class="{ 'disabled': isDeleted }"
          :disabled="isDeleted"
        >삭제</button>
      </template>
      <template v-else>
        <button 
          class="coupon-save-button" 
          @click="saveCoupon"
          :disabled="isDeleted"
        >저장</button>
        <button 
          class="coupon-cancel-button" 
          @click="cancelEdit"
        >취소</button>
      </template>
    </div>
    <div v-if="isDeleted" class="deleted-coupon-banner">
      이 쿠폰은 삭제되었습니다
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import axios from 'axios';

const emit = defineEmits();
const props = defineProps(['selectedCoupon']);

const isEditMode = ref(false);
const editCouponData = ref({});

const isDeleted = computed(() => {
  return props.selectedCoupon && !props.selectedCoupon.coupon_flag;
});

const handleEditClick = () => {
  if (isDeleted.value) {
    alert('이미 삭제된 쿠폰은 수정할 수 없습니다.');
    return;
  }
  enableEditMode();
};

const handleDeleteClick = () => {
  if (isDeleted.value) {
    alert('이미 삭제된 쿠폰입니다.');
    return;
  }
  deleteCoupon();
};

watch(
  () => props.selectedCoupon,
  (newCoupon) => {
    if (newCoupon) {
      editCouponData.value = { ...newCoupon };
    }
  },
  { immediate: true }
);

const formattedStartDate = computed({
  get: () => formatDateForInput(editCouponData.value.coupon_start_date),
  set: (value) => editCouponData.value.coupon_start_date = value
});

const formattedExpireDate = computed({
  get: () => formatDateForInput(editCouponData.value.coupon_expire_date),
  set: (value) => editCouponData.value.coupon_expire_date = value
});

const formatDateForInput = (isoDate) => {
  if (!isoDate) return '';
  // ISO 날짜 문자열에서 'YYYY-MM-DD' 부분만 추출
  return isoDate.split('T')[0];
};

const closeCouponDetail = () => {
  emit('close-coupon-detail'); 
};

// 날짜 포맷 함수
const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatDateWithTime = {
  // 시작일: 해당 날짜의 00:00:00
  startDate: (date) => {
    if (!date) return null;
    if (date.includes('T')) return date;
    return `${date}T00:00:00`;
  },

  // 만료일: 해당 날짜의 23:59:59
  endDate: (date) => {
    if (!date) return null;
    if (date.includes('T')) return date;
    return `${date}T23:59:59`;
  },

  // 여러 날짜를 쿠폰 데이터에 직접 업데이트
  applyCouponDates: (editCouponData) => {
    const editedData = { ...editCouponData };
    if (editedData.coupon_start_date) {
      editedData.coupon_start_date = formatDateWithTime.startDate(editedData.coupon_start_date);
    }
    if (editedData.coupon_expire_date) {
      editedData.coupon_expire_date = formatDateWithTime.endDate(editedData.coupon_expire_date);
    }
    return editedData;
  }
};

// 수정 모드 활성화
const enableEditMode = () => {
  isEditMode.value = true;
  // editCouponData.value = { ...selectedCoupon };
};

// 수정 취소
const cancelEdit = () => {
  isEditMode.value = false;
  editCouponData.value = { ...props.selectedCoupon };
};

// 수정 데이터 저장
const saveCoupon = async () => {
  try {

    const requestData = formatDateWithTime.applyCouponDates({ ...editCouponData.value });

    const response = await axios.patch(`https://learnsmate.shop/coupon/admin/edit/${props.selectedCoupon.coupon_code}`,
      requestData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    Object.assign(props.selectedCoupon, response.data);
    isEditMode.value = false;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        alert(error.response.data);
        return;
      } 
      else if (error.response.status === 404) {
        alert(error.response.data);
        return;
      }
      else {
        alert('직원 쿠폰은 수정할 수 없습니다.');
        return;
      }
    } else {
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  }
};

// 쿠폰 삭제 (예: 삭제 로직 추가)
const deleteCoupon = async () => {
  try {
    const response = await axios.patch(`https://learnsmate.shop/coupon/admin/delete/${props.selectedCoupon.coupon_code}`,
      {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    );
    window.location.href = '/marketing/coupons'
    alert("쿠폰이 삭제되었습니다.");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        alert(error.response.data);
        return;
      } 
      else if (error.response.status === 404) {
        alert(error.response.data);
        return;
      }
      else {
        alert('쿠폰 삭제 중 오류가 발생했습니다.');
        return;
      }
    } else {
      alert('서버와의 통신 중 오류가 발생했습니다.');
    }
  }
};

</script>

<style scoped>

.coupon-detail-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.coupon-detail-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.coupon-detail-contents {
  padding: 20px 30px;
  background-color: #ffffff;
}

.coupon-detail-close-button {
  background: none;
    border: none;
    font-size: 20px;
    color: #999;
    cursor: pointer;
}

.coupon-detail-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0px auto;
  background-color: #ffffff;
}

.coupon-detail-table-head {
  background-color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  color: #595656;
  text-align: right;
  width: 100px;
  white-space: nowrap;
  /* 텍스트 줄바꿈 방지 */
}

.coupon-detail-table-body {
  font-size: 13px;
  color: #333333;
  text-align: left;
  width: 82%;
  background-color: #ffffff;
}

.coupon-detail-table-head,
.coupon-detail-table-body {
  padding: 10px 20px;
  border-bottom: 1px dashed #eaeaea;
}

.lecture-by-coupon-table th {
  background-color: #f9f9f9;
  font-size: 13px;
  font-weight: bold;
  color: #595656;
  text-align: center;
}

.lecture-by-coupon-table td {
  font-size: 11px;
  color: #333333;
  text-align: center;
  background-color: #ffffff;
}

.lecture-by-coupon-table th,
.lecture-by-coupon-table td {
  padding: 10px 20px;
  margin-top: 20px;
  border-bottom: 1px solid #eaeaea;
}

.lecture-by-coupon-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.coupon-buttons {
  display: flex;
  justify-content: right;
  position: relative;
  margin-top: 20px;
  text-align: right;
}

.coupon-edit-button,
.coupon-delete-button,
.coupon-save-button,
.coupon-cancel-button {
  background-color: #005950;
  color: #ffffff;
  border: none;
  border-radius: 3px;
  margin-left: 20px;
  padding: 5px 10px;
}

.coupon-edit-button:hover,
.coupon-delete-button:hover,
.coupon-save-button:hover,
.coupon-cancel-button:hover {
  cursor: pointer;
  background-color: #004c42;
}

.coupon-detail-table-row {
  display: flex;
}

.coupon-detail-table-body .active-state {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 0.5px;
  text-align: center;
  width: 50px;
  font-size: 13px;
}

.coupon-detail-table-body .active-state.active {
  background-color: #dcfce7;
  color: #166534;
}

.coupon-detail-table-body .active-state.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}

.coupon-detail-table-body textarea {
  width: 100%;
  height: 100px;
  resize: none;
  padding: 8px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
}

.coupon-detail-table-body input {
  width: 100%;
  padding: 2px;
  padding-left: 5px;
    border: 1px solid #eaeaea;
    border-radius: 4px;
}

.deleted-coupon-banner {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
}

.coupon-edit-button.disabled,
.coupon-delete-button.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.coupon-edit-button.disabled:hover,
.coupon-delete-button.disabled:hover {
  background-color: #cccccc;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: #cccccc;
}

.coupon-detail-table-body .active-state {
  font-weight: bold;
}

.coupon-detail-table-body .active-state.inactive {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>