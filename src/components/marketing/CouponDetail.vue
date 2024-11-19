<template>
  <div class="coupon-top-line"></div>
  <div class="coupon-detail-contents">
  <table class="coupon-detail-table" v-if="selectedCoupon">
    <tbody>
        <tr>
            <th>쿠폰 번호</th>
            <td>{{ selectedCoupon.code }}</td>
        </tr>
        <tr>
            <th>쿠폰 이름</th>
            <td>{{ selectedCoupon.name }}</td>
        </tr>
        <tr>
            <th>쿠폰 내용</th>
            <td>{{ selectedCoupon.contents || '-' }}</td>
        </tr>
        <tr>
            <th>쿠폰 할인율</th>
            <td>{{ selectedCoupon.discountRate }}</td>
        </tr>
        <tr>
            <th>쿠폰 종류</th>
            <td>{{ selectedCoupon.type }}</td>
        </tr>
        <tr>
            <th>상태</th>
            <td>{{ selectedCoupon.status }}</td>
        </tr>
        <tr>
            <th>시작일</th>
            <td>{{ selectedCoupon.startDate }}</td>
        </tr>
        <tr>
            <th>만료일</th>
            <td>{{ selectedCoupon.expireDate }}</td>
        </tr>
        <tr>
            <th>생성일</th>
            <td>{{ selectedCoupon.createdAt }}</td>
        </tr>
        <tr>
            <th>수정일</th>
            <td>{{ selectedCoupon.updatedAt }}</td>
        </tr>
        <tr>
            <th>직원</th>
            <td>{{ selectedCoupon.admin || '-' }}</td>
        </tr>
        <tr>
            <th>강사</th>
            <td>{{ selectedCoupon.tutor || '-' }}</td>
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
  <!-- <button class="close-button" @click="selectedCoupon = null">닫기</button> -->
</template>

<script>
export default {
  props: {
    selectedCoupon: {
      type: Object,
      required: true,
    }
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
  width: 18%;
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
    padding: 10px 20px;
}
</style>