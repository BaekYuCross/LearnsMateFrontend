<template>
  <MarketingSideMenu />
  <div class="coupon-main-container">
    <CouponFilter @search="applyFilters" />
    <div class="coupon-content-container">
      <div class="coupon-table-container" :class="{ 'shrink': selectedCoupon }">
        <!-- 전체 쿠폰 개수 -->
        <div class="coupon-count">
          등록된 쿠폰 <span class="coupon-length">{{ coupon.length }}</span>개
        </div>
        <!-- 조회 데이터 테이블 -->
        <div class="coupon-table-wrapper">
          <table class="coupon-table">
            <thead class="coupon-table-header">
              <tr>
                <th>쿠폰 번호</th>
                <th>쿠폰 이름</th>
                <th>쿠폰 내용</th>
                <th>쿠폰 할인율</th>
                <th>쿠폰 종류</th>
                <th>상태</th>
                <th>시작일</th>
                <th>만료일</th>
                <th>생성일</th>
                <th>수정일</th>
                <th>직원</th>
                <th>강사</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="coupon-table-row"
                v-for="(coupon, index) in paginatedCoupons"
                :key="coupon.id"
                @click="selectCoupon(coupon)"
              >
                <td>{{ coupon.code }}</td>
                <td>{{ coupon.name }}</td>
                <td>{{ coupon.contents }}</td>
                <td>{{ coupon.discountRate }}</td>
                <td>{{ coupon.type }}</td>
                <td>{{ coupon.status }}</td>
                <td>{{ coupon.startDate }}</td>
                <td>{{ coupon.expireDate }}</td>
                <td>{{ coupon.createdAt }}</td>
                <td>{{ coupon.updatedAt }}</td>
                <td>{{ coupon.admin || '-' }}</td>
                <td>{{ coupon.tutor || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 페이지네이션 -->
        <div class="pagination">
          <button
            class="page-button prev-button"
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            ◀이전
          </button>
          <span v-for="page in totalPages" :key="page" class="page-number">
            <button
              class="page-button"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </span>
          <button
            class="page-button next-button"
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            다음▶
          </button>
        </div>
      </div>
      <!-- 쿠폰 단건 조회 -->
      <div class="coupon-detail-container" v-if="selectedCoupon">
        <CouponDetail :selectedCoupon="selectedCoupon" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import CouponFilter from '@/components/marketing/CouponFilter.vue';
import CouponDetail from '@/components/marketing/CouponDetail.vue';

const coupon = [
  {
    id: 1,
    code: "C001-20241118eidj23isjle",
    name: "10% 일반 할인",
    contents: "일반 할인쿠폰입니다.",
    discountRate: "10",
    type: "일반",
    status: "O",
    startDate: "2024-11-01",
    expireDate: "2024-11-30",
    createdAt: "2024-10-031",
    updatedAt: "2024-10-031",
    admin: "이서현",
    tutor: "",
  },
  // ... 나머지 데이터는 동일
];

const selectedCoupon = ref(null);
const currentPage = ref(1);
const pageSize = 15;

const totalPages = computed(() => Math.ceil(coupon.length / pageSize));

const paginatedCoupons = computed(() =>
  coupon.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const applyFilters = async (filters) => {
  try {
    const response = await axios.post('/api/coupons/filter', filters);
    coupon.value = response.data;
    currentPage.value = 1;
  } catch (error) {
    console.error('Error fetching filtered coupons:', error);
  }
};

const selectCoupon = (coupon) => {
  selectedCoupon.value = coupon;
};
</script>

<style>
.coupon-main-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.coupon-content-container {
  display: flex;
  flex-grow: 1;
  margin-left: 160px;
  margin-top: 10px;
}

.coupon-count {
  font-size: 17px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #333;
}

.coupon-table {
  width: 100%;
  min-width: 1200px;
  table-layout: fixed;
  border-collapse: collapse;
  background-color: #ffffff;
}

.coupon-table th {
  background-color: #f9f9f9;
  font-size: 13px;
  font-weight: bold;
  color: #595656;
}

.coupon-table td {
  border-bottom: 1px solid #eaeaea;
  font-size: 11px;
  color: #333333;
}

.coupon-table th,
.coupon-table td {
  padding: 10px 20px;
  text-align: center;
}

.coupon-table-row:hover {
  cursor: pointer;
  background-color: #f4f4f4;
}

.coupon-table-container {
  flex: 1;
  transition: flex 0.3s ease;
  overflow-x: hidden;
}

.coupon-table-container.shrink {
  flex: 0.5;
}

.coupon-table-wrapper {
  overflow-x: auto;
  flex: 1;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-button {
  background: none;
  border: none;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 13px;
}

.page-button.active {
  font-weight: bold;
}

.page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.coupon-detail-container {
  flex: 0.5;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: flex 0.3s ease;
  margin-left: 10px;
}

.coupon-detail-container .close-button {
  background-color: #ff6666;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.coupon-detail-container .close-button:hover {
  background-color: #cc0000;
}

.coupon-table th:nth-child(1),
.coupon-table td:nth-child(1) {
  width: 150px;
}

.coupon-table th:nth-child(2),
.coupon-table td:nth-child(2) {
  width: 150px;
}

.coupon-table th:nth-child(3),
.coupon-table td:nth-child(3) {
  width: 200px;
}

.coupon-table th:nth-child(4),
.coupon-table td:nth-child(4) {
  width: 120px;
}

.coupon-table th:nth-child(5),
.coupon-table td:nth-child(5) {
  width: 100px;
}

.coupon-table th:nth-child(6),
.coupon-table td:nth-child(6) {
  width: 80px;
}

.coupon-table th:nth-child(7),
.coupon-table td:nth-child(7) {
  width: 100px;
}

.coupon-table th:nth-child(8),
.coupon-table td:nth-child(8) {
  width: 120px;
}

.coupon-table th:nth-child(9),
.coupon-table td:nth-child(9) {
  width: 120px;
}

.coupon-table th:nth-child(10),
.coupon-table td:nth-child(10) {
  width: 120px;
}

.coupon-table th:nth-child(11),
.coupon-table td:nth-child(11) {
  width: 100px;
}

.coupon-table th:nth-child(12),
.coupon-table td:nth-child(12) {
  width: 100px;
}
</style>
