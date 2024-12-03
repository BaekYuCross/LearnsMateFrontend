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
            등록된 쿠폰 <span class="coupon-length">{{ (totalCount || 0).toLocaleString("ko-KR") }}</span>개
          </div>
          <div class="coupon-count-right">
            <button class="coupon-register-button" @click="registerCoupon">쿠폰 등록</button>
            <button class="coupon-excel-button" @click="handleExcelDownload"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
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
                v-for="(coupon, index) in coupon || []"
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
    ◀
  </button>
  
  <template v-for="page in displayedPages" :key="page">
    <span v-if="page === '...'" class="page-dots">...</span>
    <button 
      v-else
      class="page-button" 
      :class="{ active: currentPage === page }" 
      @click="changePage(page)"
    >
      {{ page }}
    </button>
  </template>
  
  <button 
    class="page-button next-button" 
    @click="changePage(currentPage + 1)" 
    :disabled="currentPage === totalPages"
  >
    ▶
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
import { saveAs } from 'file-saver';
import axios from 'axios';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import CouponFilter from '@/components/marketing/CouponFilter.vue';
import CouponDetail from '@/components/marketing/CouponDetail.vue';
const router = useRouter();

const totalCount = ref(0);

const coupon = ref([]);
const selectedCoupon = ref(null);
const currentPage = ref(1);
const pageSize = 15;

const totalPages = ref(1);

const isFiltered = ref(false);
const currentFilters = ref(null);

// displayedPages computed 속성 추가
const displayedPages = computed(() => {
  const pages = [];
  pages.push(1);
  if (currentPage.value - 1 > 2) {
    pages.push('...');
  }
  for (let i = Math.max(2, currentPage.value - 2); 
       i <= Math.min(totalPages.value - 1, currentPage.value + 2); 
       i++) {
    pages.push(i);
  }
  if (totalPages.value - currentPage.value > 2) {
    pages.push('...');
  }
  if (totalPages.value > 1) {
    pages.push(totalPages.value);
  }
  return pages;
});

// fetchCoupons 함수 수정
const fetchCoupons = async () => {
  try {
    const response = await axios.get('http://localhost:5000/coupon/coupons2',
      {
        withCredentials: true,
        params: {
          page: currentPage.value - 1,
          size: pageSize,
        },
      });
    
    coupon.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalCount.value = response.data.totalElements;
    
    console.log(response.data.content);
    console.log(coupon.value);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    coupon.value = []; 
    totalCount.value = 0;
  }
};

// changePage 함수도 수정
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  if (isFiltered.value && currentFilters.value) {
    // 페이지 리셋하지 않고 필터 적용
    await applyFilters(currentFilters.value, false);
  } else {
    await fetchCoupons();
  }
};

const paginatedCoupons = computed(() => {
  if (Array.isArray(coupon.value)) {
    return coupon.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize);
  }
  return [];
});

const selectCoupon = (couponData) => {
  selectedCoupon.value = couponData;
};

const deselectCoupon = () => {
  selectedCoupon.value = null;
};

const registerCoupon = () => {
  router.push({ name: 'Register-Coupon' });
};

const applyFilters = async (filters, resetPage = true) => {
  try {
    console.log('필터 적용 전:', filters);
    console.log('필터 적용 후:', filters);

    isFiltered.value = true;
    currentFilters.value = filters;

    // 페이지 초기화는 resetPage 파라미터에 따라 결정
    if (resetPage) {
      currentPage.value = 1;
    }

    const response = await axios.post('http://localhost:5000/coupon/filters2', filters,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
          page: currentPage.value - 1,
          size: pageSize,
      }
    });

    if (response.data && response.data.content) {
      coupon.value = response.data.content;
      totalCount.value = response.data.totalElements || 0;
      totalPages.value = response.data.totalPages || 1;
    } else {
      coupon.value = response.data;
      totalCount.value = response.data.length || 0;
      totalPages.value = Math.ceil((response.data.length || 0) / pageSize);
    }
    
    console.log('Filtered data:', response.data);
    console.log('Total count:', totalCount.value);
    console.log('Total pages:', totalPages.value);
    
  } catch (error) {
    console.error('Error fetching filtered coupons:', error);
    coupon.value = [];
    totalCount.value = 0;
    totalPages.value = 1;
  }
};

const resetFilters = () => {
  isFiltered.value = false;  // 필터링 상태 해제
  currentFilters.value = null;  // 현재 필터 값 초기화
  currentPage.value = 1;
  fetchCoupons();
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

onMounted(() => {
  fetchCoupons();
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

// 기존 imports 아래에 추가
const columns = {
  couponCode: "쿠폰 번호",
  couponName: "쿠폰 이름",
  couponContents: "쿠폰 내용",
  couponDiscountRate: "쿠폰 할인율",
  couponCategoryName: "쿠폰 종류",
  activeState: "상태",
  couponStartDate: "시작일",
  couponExpireDate: "만료일",
  createdAt: "생성일",
  updatedAt: "수정일",
  adminName: "직원",
  tutorName: "강사"
};

const handleExcelDownload = async() => {
  try{

    console.log('Current filters:', currentFilters.value); // 현재 필터 상태 확인
    const filterData = isFiltered.value && currentFilters.value ? {
      couponName: currentFilters.value.coupon_name || null,
      couponContents: currentFilters.value.coupon_contents || null,
      activeState: currentFilters.value.active_state || null,
      startExpireDate: currentFilters.value.start_expire_date || null,
      endExpireDate: currentFilters.value.end_expire_date || null,
      startCreatedAt: currentFilters.value.start_created_at || null,
      endCreatedAt: currentFilters.value.end_created_at || null,
      minDiscountRate: currentFilters.value.min_discount_rate || null,
      maxDiscountRate: currentFilters.value.max_discount_rate || null,
      startCouponStartDate: currentFilters.value.start_coupon_start_date || null,
      endCouponStartDate: currentFilters.value.end_coupon_start_date || null,
      couponCategoryName: currentFilters.value.coupon_category_name || null,
      adminName: currentFilters.value.admin_name || null,
      tutorName: currentFilters.value.tutor_name || null,
      selectedColumns: Object.keys(columns)
    } : null;

    console.log('Sending filter data for excel:', filterData); // 디버깅용

    const config = {
      method: 'POST',
      withCredentials: true,
      url: 'http://localhost:5000/coupon/excel/download',
      responseType: 'blob',
      data: filterData,
        headers: {
        'Content-Type': 'application/json'
      },
    };
    
    const response = await axios(config);
    
    // 에러 응답 체크
    if (response.data instanceof Blob) {
      const isJson = response.data.type === 'application/json';
      if (isJson) {
        const textData = await response.data.text();
        console.error('Server error:', textData);
        throw new Error(textData);
      }
    }
    
    // 파일 다운로드
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const now = new Date();
    const fileName = `coupon_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
    
    saveAs(blob, fileName);
  } catch (error) {
    console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
    if (error.response) {
      const reader = new FileReader();
      reader.onload = () => {
        console.error('상세 에러:', reader.result);
      };
      reader.readAsText(error.response.data);
    }
  }
}

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

.coupon-length {
  color: #005950;
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

.coupon-register-button,
.coupon-excel-button {
  background-color: #005950;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    margin-left: 20px;
    padding: 5px 10px;
}

.coupon-register-button:hover,
.coupon-excel-button:hover {
  cursor: pointer;
  background-color: #004c42;
}

.coupon-table-top {
  display: flex;
  justify-content:space-between;
  padding: 0px 10px;
}

.coupon-table-row td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
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
