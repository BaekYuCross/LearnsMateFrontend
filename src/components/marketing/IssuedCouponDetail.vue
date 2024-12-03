<template>
  <div class="issued-coupon-detail-container">
    <div class="issued-coupon-detail-header">
      <h3 class="issued-coupon-detail-title">쿠폰 상세 정보</h3>
      <button class="close-button" @click="$emit('close')">×</button>
    </div>
    <div class="issued-coupon-detail-content">
      <div class="issued-coupon-detail-item">
        <span class="label">발급 쿠폰 번호</span>
        <span class="value">{{ selectedCoupon.coupon_issuance_code }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">쿠폰 이름</span>
        <span class="value">{{ selectedCoupon.coupon_name }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">쿠폰 내용</span>
        <span class="value">{{ selectedCoupon.coupon_contents || '-' }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">쿠폰 종류</span>
        <span class="value">{{ selectedCoupon.coupon_category_name }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">고객 코드</span>
        <span class="value">{{ selectedCoupon.student_code }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">고객명</span>
        <span class="value">{{ selectedCoupon.student_name }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">사용 여부</span>
        <span class="value">{{ selectedCoupon.coupon_use_status ? 'O' : 'X' }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">할인율</span>
        <span class="value">{{ selectedCoupon.coupon_discount_rate }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">시작일</span>
        <span class="value">{{ formatDate(selectedCoupon.coupon_start_date) }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">만료일</span>
        <span class="value">{{ formatDate(selectedCoupon.coupon_expire_date) }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">생성일</span>
        <span class="value">{{ formatDate(selectedCoupon.coupon_issue_date) }}</span>
      </div>
      <div class="issued-coupon-detail-item">
        <span class="label">사용일</span>
        <span class="value">{{ formatDate(selectedCoupon.coupon_use_date) }}</span>
      </div>

      <div class="lecture-info-section" v-if="hasLectureInfo">
      <h4 class="lecture-info-title">강의 정보
        <button class="lecture-toggle-button" @click="toggleLectureSection">
          {{ isLectureSectionVisible ? '&#9650;' : '&#9660;' }}
        </button>
      </h4>
      <div v-if="selectedCoupon.lecture_code?.length > 0 && isLectureSectionVisible">
        <div 
          v-for="(_, index) in selectedCoupon.lecture_code" 
          :key="index"
          class="lecture-item"
        >
          <div class="issued-coupon-detail-item">
            <span class="label">강의 코드</span>
            <span class="value">{{ selectedCoupon.lecture_code[index] }}</span>
          </div>
          <div class="issued-coupon-detail-item">
            <span class="label">강의 이름</span>
            <span class="value">{{ selectedCoupon.lecture_name[index] }}</span>
          </div>
          <div class="issued-coupon-detail-item">
            <span class="label">강사 이름</span>
            <span class="value">{{ selectedCoupon.tutor_name[index] }}</span>
          </div>
          <div class="issued-coupon-detail-item">
            <span class="label">강의 가격</span>
            <span class="value">{{ formatPrice(selectedCoupon.lecture_price[index]) }}</span>
          </div>
          <div v-if="index < selectedCoupon.lecture_code.length - 1" class="lecture-divider"></div>
        </div>
      </div>

      <div v-else-if="isLectureSectionVisible" class="no-lecture-info">
        <span>사용 가능한 강의가 존재하지 않습니다.</span>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  selectedCoupon: {
    type: Object,
    required: true
  }
});

const hasLectureInfo = computed(() => {
  if (!props.selectedCoupon) return false;
  
  return !!(props.selectedCoupon.lecture_code || 
            props.selectedCoupon.lecture_name || 
            props.selectedCoupon.tutor_name || 
            props.selectedCoupon.lecture_price);
});

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatPrice = (price) => {
  if (!price) return '-';
  return price.toLocaleString('ko-KR') + '원';
};

const isLectureSectionVisible = ref(false);

const toggleLectureSection = () => {
  isLectureSectionVisible.value = !isLectureSectionVisible.value;
};
</script>

<style scoped>
.issued-coupon-detail-container {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 570px;
  width: 400px;
  overflow-y: auto;
  flex: 0.4;
  margin-left: 10px;
}

.issued-coupon-detail-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.issued-coupon-detail-title {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
}

.close-button:hover {
  color: #333;
}

.issued-coupon-detail-content {
  padding: 20px;
}

.issued-coupon-detail-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #eaeaea;
}

.label {
  width: 120px;
  color: #666;
  font-size: 14px;
}

.value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.lecture-info-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid #eaeaea;
}

.lecture-info-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 16px;
}

.lecture-item {
  margin-bottom: 16px;
}

.lecture-divider {
  height: 1px;
  background-color: #eaeaea;
  margin: 16px 0;
}

.no-lecture-info {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-top: 8px;
}

.lecture-toggle-button {
  background: none;
  border: none;
  font-size: 16px; /* 화살표 크기 */
  color: #005950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0;
  margin-left: 10px; /* 화살표와 텍스트 간 간격 */
  position: relative;
}

</style>