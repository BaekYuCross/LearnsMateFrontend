<template>
  <MarketingSideMenu />
  <div class="coupon-main-container"
  @click="deselectCoupon">
    <CouponFilter @search="applyFilters" @reset="resetFilters"/>
    <div class="coupon-content-container"
    @click.stop>
      <div class="coupon-table-container" :class="{ 'shrink': selectedCoupon }">
        <!-- 전체 쿠폰 개수 -->
        <div class="coupon-table-top">
          <div class="coupon-count">
            등록된 쿠폰 <span class="coupon-length">{{ coupon.length }}</span>개
          </div>
          <div class="coupon-count-right">
            <button class="coupon-register-button" @click="registerCoupon">쿠폰 등록</button>
          </div>
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
                v-for="(coupon, index) in paginatedCoupons || []"
                :key="coupon.coupon_code"
                @click="selectCoupon(coupon)"
              >
                <td>{{ coupon.coupon_code }}</td>
                <td>{{ coupon.coupon_name }}</td>
                <td>{{ coupon.coupon_contents }}</td>
                <td>{{ coupon.coupon_discount_rate }}</td>
                <td>{{ coupon.coupon_category_name }}</td>
                <td>{{ coupon.active_state ? '활성' : '비활성' }}</td>
                <td>{{ formatDate(coupon.coupon_start_date) }}</td>
                <td>{{ formatDate(coupon.coupon_expire_date) }}</td>
                <td>{{ formatDate(coupon.created_at) }}</td>
                <td>{{ formatDate(coupon.updated_at) }}</td>
                <td>{{ coupon.admin_name || '-' }}</td>
                <td>{{ coupon.tutor_name || '-' }}</td>
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
        <CouponDetail :selectedCoupon="selectedCoupon"
        :token="token"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import CouponFilter from '@/components/marketing/CouponFilter.vue';
import CouponDetail from '@/components/marketing/CouponDetail.vue';
const router = useRouter();

const coupon = ref([]);
const selectedCoupon = ref(null);
const currentPage = ref(1);
const pageSize = 15;
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDUwMDMiLCJlbWFpbCI6IjY5NDA5MEBnbWFpbC5jb20iLCJuYW1lIjoi7J207ISc7ZiEIiwicm9sZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE3MzIxNTEzNzYsImV4cCI6MTc3NTM1MTM3Nn0.09oguvlZSs2ZX3WuZtjt8cATCF7uxYv1Jv7bphGSJd_UZqN97cHG0RRU_5CFGVNONJLRf-x-QtBpIEAi2R2ZgQ';
// 전체 페이지 계산
// const totalPages = computed(() => Math.ceil(coupon.length / pageSize));
const totalPages = computed(() => {
  if (Array.isArray(coupon.value)) {
    return Math.ceil(coupon.value.length / pageSize);
  }
  return 1; // 기본값 1로 반환
});

// 페이지별로 보여줄 쿠폰 계산
// const paginatedCoupons = computed(() =>
//   coupon.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
// );
const paginatedCoupons = computed(() => {
  if (Array.isArray(coupon.value)) {
    return coupon.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
  }
  return []; // 배열이 아닌 경우 빈 배열 반환
});


// 페이지 변경
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 선택된 쿠폰 설정
const selectCoupon = (couponData) => {
  selectedCoupon.value = couponData;
};

// 선택 해제
const deselectCoupon = () => {
  selectedCoupon.value = null;
};

const registerCoupon = () => {
  router.push({ name: 'Register-Coupon' });
};

const fetchCoupons = async () => {
  try {
    const response = await axios.get('http://localhost:5000/coupon/coupons'); // API 호출
    console.log('Fetched data:', response.data); // 응답 데이터 확인

    // 응답 데이터가 배열인지 확인하고 처리
    if (Array.isArray(response.data)) {
      coupon.value = response.data; // 응답 데이터가 배열일 경우 그대로 사용
    } else {
      console.error('Error: Unexpected API response format');
      coupon.value = []; // 배열이 아닌 경우 빈 배열로 초기화
    }
  } catch (error) {
    console.error('Error fetching coupons:', error);
    coupon.value = []; // 오류 발생 시 빈 배열로 초기화
  }
};

const applyFilters = async (filters) => {
  try {
    const response = await axios.post('http://localhost:5000/coupon/filters', camelToSnake(filters),
    {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      }
    }
    );
    console.log(filters);
    coupon.value = response.data;
    currentPage.value = 1;
  } catch (error) {
    console.error('Error fetching filtered coupons:', error);
  }
};

const resetFilters = () => {
  fetchCoupons();
  currentPage.value = 1;
}

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

// 컴포넌트가 로드될 때 데이터 가져오기
onMounted(() => {
  fetchCoupons(); // 처음 로드 시 쿠폰 데이터를 가져옴
});

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

.coupon-register-button {
  background-color: #005950;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    margin-left: 20px;
    padding: 5px 10px;
}

.coupon-register-button:hover {
  cursor: pointer;
  background-color: #004c42;
}

.coupon-table-top {
  display: flex;
  justify-content:space-between;
  padding: 0px 10px;
}

/* 쿠폰 번호 */
.coupon-table th:nth-child(1),
.coupon-table td:nth-child(1) {
  width: 100px;
}

/* 쿠폰 이름 */
.coupon-table th:nth-child(2),
.coupon-table td:nth-child(2) {
  width: 150px;
}

/* 쿠폰 내용 */
.coupon-table th:nth-child(3),
.coupon-table td:nth-child(3) {
  width: 250px;
}

/* 쿠폰 할인율 */
.coupon-table th:nth-child(4),
.coupon-table td:nth-child(4) {
  width: 120px;
}

/* 쿠폰 종류 */
.coupon-table th:nth-child(5),
.coupon-table td:nth-child(5) {
  width: 100px;
}

/* 상태 */
.coupon-table th:nth-child(6),
.coupon-table td:nth-child(6) {
  width: 80px;
}

/* 시작일 */
.coupon-table th:nth-child(7),
.coupon-table td:nth-child(7) {
  width: 120px;
}

/* 만료일 */
.coupon-table th:nth-child(8),
.coupon-table td:nth-child(8) {
  width: 120px;
}

/* 생성일 */
.coupon-table th:nth-child(9),
.coupon-table td:nth-child(9) {
  width: 120px;
}

/* 수정일 */
.coupon-table th:nth-child(10),
.coupon-table td:nth-child(10) {
  width: 120px;
}

/* 직원 */
.coupon-table th:nth-child(11),
.coupon-table td:nth-child(11) {
  width: 100px;
}

/* 강사 */
.coupon-table th:nth-child(12),
.coupon-table td:nth-child(12) {
  width: 100px;
}
</style>
