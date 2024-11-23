<template>
  <div class="coupon-top-line"></div>
  <div class="coupon-detail-contents">
  <table class="coupon-detail-table" v-if="selectedCoupon">
    <tbody>
        <tr>
            <th>쿠폰 번호</th>
            <td>{{ selectedCoupon.coupon_code }}</td>
        </tr>
        <tr>
            <th>쿠폰 이름</th>
            <td>{{ selectedCoupon.coupon_name }}</td>
        </tr>
        <tr>
            <th>쿠폰 내용</th>
            <td>{{ selectedCoupon.coupon_contents || '-' }}</td>
        </tr>
        <tr>
            <th>쿠폰 할인율</th>
            <td>{{ selectedCoupon.coupon_discount_rate }}</td>
        </tr>
        <tr>
            <th>쿠폰 종류</th>
            <td>{{ selectedCoupon.coupon_category_name }}</td>
        </tr>
        <tr>
            <th>상태</th>
            <td>{{ selectedCoupon.active_state ? '활성' : '비활성' }}</td>
        </tr>
        <tr>
            <th>시작일</th>
            <td>{{ formatDate(selectedCoupon.coupon_start_date) }}</td>
        </tr>
        <tr>
            <th>만료일</th>
            <td>{{ formatDate(selectedCoupon.coupon_expire_date) }}</td>
        </tr>
        <tr>
            <th>생성일</th>
            <td>{{ formatDate(selectedCoupon.created_at) }}</td>
        </tr>
        <tr>
            <th>수정일</th>
            <td>{{ formatDate(selectedCoupon.updated_at) }}</td>
        </tr>
        <tr>
            <th>직원</th>
            <td>{{ selectedCoupon.admin_name || '-' }}</td>
        </tr>
        <tr>
            <th>강사</th>
            <td>{{ selectedCoupon.tutor_name || '-' }}</td>
        </tr>
    </tbody>
  </table>
  <table class="lecture-by-coupon-table">
      <thead>
        <tr>
            <th>강의 코드</th>
            <th>강의 이름</th>
            <th>강사 이름</th>
            <th>강의 가격</th>
        </tr>
      </thead>
      <tbody>
        <tr>
            <td>{{ selectedCoupon.lectureCode || '-'  }}</td>
            <td>{{ selectedCoupon.lectureName || '-'  }}</td>
            <td>{{ selectedCoupon.tutorName || '-'  }}</td>
            <td>{{ selectedCoupon.lecturePrice || '-'  }}</td>
        </tr>
      </tbody>
  </table>
  <div class="coupon-buttons">
    <button class="coupon-edit-button">쿠폰 수정</button>
    <button class="coupon-delete-button">쿠폰 삭제</button>
  </div>
</div>
</template>

<script setup>
defineProps(['selectedCoupon']);

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
    position: relative;
    margin-top: 20px;
    text-align: right;
}

.coupon-edit-button,
.coupon-delete-button {
    background-color: #005950;
    color: #ffffff;
    border: none;
    border-radius: 3px;
    margin-left: 20px;
    padding: 5px 10px;
}

.coupon-edit-button:hover,
.coupon-delete-button:hover {
  cursor: pointer;
  background-color: #004c42;
}
</style>