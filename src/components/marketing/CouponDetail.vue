<template>
  <div class="coupon-top-line"></div>
  <div class="coupon-detail-contents">
  <table class="coupon-detail-table" v-if="props.selectedCoupon">
    <tbody>
        <tr>
            <th>쿠폰 번호</th>
            <td>{{ props.selectedCoupon.coupon_code }}</td>
        </tr>
        <tr>
            <th>쿠폰 이름</th>
            <td>
              <div v-if="isEditMode">
                <input type="text" v-model="editCouponData.coupon_name">
              </div>
              <div v-else>
                {{ props.selectedCoupon.coupon_name }}
              </div>
            </td>
        </tr>
        <tr>
            <th>쿠폰 내용</th>
            <td>
              <div v-if="isEditMode">
                <textarea v-model="editCouponData.coupon_contents"></textarea>
              </div>
              <div v-else>
              {{ props.selectedCoupon.coupon_contents || '-' }}
              </div>
            </td>
        </tr>
        <tr>
            <th>쿠폰 할인율</th>
            <td>
              <div v-if="isEditMode">
                <input type="number" min="0" max="100" v-model="editCouponData.coupon_discount_rate">
              </div>
              <div v-else>
              {{ props.selectedCoupon.coupon_discount_rate }}
              </div>
            </td>
        </tr>
        <tr>
            <th>쿠폰 종류</th>
            <td>
              <div v-if="isEditMode">
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
              <div v-else>
              {{ props.selectedCoupon.coupon_category_name }}
              </div>
            </td>
        </tr>
        <tr>
            <th>상태</th>
            <td>{{ props.selectedCoupon.active_state ? '활성' : '비활성' }}</td>
        </tr>
        <tr>
            <th>시작일</th>
            <td>
              <div v-if="isEditMode">
                <input type="date" v-model="editCouponData.coupon_start_date">
              </div>
              <div v-else>
              {{ formatDate(props.selectedCoupon.coupon_start_date) }}
              </div>
            </td>
        </tr>
        <tr>
            <th>만료일</th>
            <td>
              <div v-if="isEditMode">
                <input type="date" v-model="editCouponData.coupon_expire_date">
              </div>
              <div v-else>
              {{ formatDate(props.selectedCoupon.coupon_expire_date) }}
              </div>
            </td>
        </tr>
        <tr>
            <th>생성일</th>
            <td>{{ formatDate(props.selectedCoupon.created_at) }}</td>
        </tr>
        <tr>
            <th>수정일</th>
            <td>{{ formatDate(props.selectedCoupon.updated_at) }}</td>
        </tr>
        <tr>
            <th>직원</th>
            <td>{{ selectedCoupon.admin_name || '-' }}</td>
        </tr>
        <tr>
            <th>강사</th>
            <td>{{ props.selectedCoupon.tutor_name || '-' }}</td>
        </tr>
    </tbody>
  </table>
  <div class="coupon-buttons">
    <button class="coupon-edit-button" v-if="!isEditMode" @click="enableEditMode">쿠폰 수정</button>
    <div v-else>
      <button class="coupon-save-button" @click="saveCoupon">저장</button>
      <button class="coupon-cancel-button" @click="cancelEdit">취소</button>
    </div>
    <button class="coupon-delete-button" @click="deleteCoupon">쿠폰 삭제</button>
  </div>
</div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from 'axios';

const props = defineProps(['selectedCoupon']);

const isEditMode = ref(false);
const editCouponData = ref({});

watch(
  () => props.selectedCoupon,
  (newCoupon) => {
    if (newCoupon) {
      editCouponData.value = { ...newCoupon };
    }
  },
  { immediate: true }
);

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
    // 저장 로직 (예: API 호출)
    const requestData = { ...editCouponData.value };
    const response = await axios.patch(`http://localhost:5000/coupon/admin/edit/${props.selectedCoupon.coupon_code}`,
    requestData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
    }
  );
    console.log("수정 성공", response.data);

    // 성공 시 화면 데이터 갱신
    Object.assign(props.selectedCoupon, editCouponData.value);
    isEditMode.value = false;
  } catch (error) {
    console.error("수정 실패", error.message);
  }
};

// 쿠폰 삭제 (예: 삭제 로직 추가)
const deleteCoupon = async () => {
  try {
    const response = await axios.patch(`http://localhost:5000/coupon/admin/delete/${props.selectedCoupon.coupon_code}`,
      {},{
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    window.location.href = '/marketing/coupons'
    console.log("삭제 성공", response.data);
    alert("쿠폰이 삭제되었습니다.");
  } catch (error) {
    console.error("삭제 실패", error.message);
    alert("쿠폰 삭제에 실패했습니다.");
  }
};

</script>

<style scoped>
.coupon-top-line {
  height: 15px;
  background-color: #005950;
}

.coupon-detail-contents {
  padding: 20px 30px;
}

.coupon-detail-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0px auto;
  background-color: #ffffff;
}

.coupon-detail-table th {
  background-color: #f9f9f9;
  font-size: 13px;
  font-weight: bold;
  color: #595656;
  text-align: right;
  width: 100px;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
}

.coupon-detail-table td {
    font-size: 11px;
    color: #333333;
    text-align: left;
    width: 82%;
}

.coupon-detail-table th,
.coupon-detail-table td {
  padding: 10px 20px;
  border-bottom: 1px solid #eaeaea;
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
</style>