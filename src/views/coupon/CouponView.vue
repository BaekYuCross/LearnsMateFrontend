<template>
  <MarketingSideMenu />
  <div class="coupon-main-container">
    <CouponFilter @search="applyFilters" @reset="resetFilters" />
    <!-- 전체 쿠폰 개수 -->
    <div class="coupon-table-top">
          <div class="coupon-count">
            등록된 쿠폰 <span class="coupon-length">{{ (totalCount || 0).toLocaleString("ko-KR") }}</span>개
          </div>
          <div class="coupon-count-right">
            <button class="coupon-register-button" @click="registerCoupon">쿠폰 등록</button>
            <button class="coupon-excel-button" @click="handleExcelDownload"><img src="/src/assets/icons/download.svg"
                alt="" class="excel-img">엑셀 다운로드</button>
          </div>
        </div>
    <div class="coupon-inner-container" :class="{ 'shrink': selectedCoupon }">
      <div class="coupon-full-view">
        
        <!-- 조회 데이터 테이블 -->
        <div class="coupon-content-container" @click.stop>
          <div class="coupon-table-container">
            <div class="coupon-table-wrapper">
              <div class="coupon-table">
                <div class="coupon-table-header">
                  <div class="coupon-clickable" @click="handleSort('couponCode')">
                      쿠폰 번호
                      <span v-if="currentSortField === 'couponCode'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('couponName')">
                      쿠폰 이름
                      <span v-if="currentSortField === 'couponName'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('couponContents')">
                      쿠폰 내용
                      <span v-if="currentSortField === 'couponContents'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('couponDiscountRate')">
                      쿠폰 할인율
                      <span v-if="currentSortField === 'couponDiscountRate'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('couponCategoryName')">
                      쿠폰 종류
                      <span v-if="currentSortField === 'couponCategoryName'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('activeState')">
                      상태
                      <span v-if="currentSortField === 'activeState'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('couponStartDate')">
                      시작일
                      <span v-if="currentSortField === 'couponStartDate'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('couponExpireDate')">
                      만료일
                      <span v-if="currentSortField === 'couponExpireDate'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('createdAt')">
                      생성일
                      <span v-if="currentSortField === 'createdAt'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('updatedAt')">
                      수정일
                      <span v-if="currentSortField === 'updatedAt'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('adminName')">
                      직원
                      <span v-if="currentSortField === 'adminName'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
                  <div class="coupon-clickable" @click="handleSort('tutorName')">
                      강사
                      <span v-if="currentSortField === 'tutorName'" class="coupon-sort-arrow">
                          {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                      </span>
                  </div>
              </div>
                <div class="coupon-table-body">
                  <div class="coupon-table-row" v-for="(coupon, index) in coupon || []" :key="coupon.coupon_code"
                    @click="selectCoupon(coupon)">
                    <div>{{ coupon.coupon_code }}</div>
                    <div>{{ coupon.coupon_name }}</div>
                    <div>{{ coupon.coupon_contents }}</div>
                    <div>{{ coupon.coupon_discount_rate }}</div>
                    <div>{{ coupon.coupon_category_name }}</div>
                    <div class="coupon-table-active-state-row">
                    <div :class="{
                      'active-state': true,
                      'active': coupon.active_state,
                      'inactive': !coupon.active_state
                    }">{{ coupon.active_state ? '활성' : '비활성' }}</div>
                    </div>
                    <div>{{ formatDate(coupon.coupon_start_date) }}</div>
                    <div>{{ formatDate(coupon.coupon_expire_date) }}</div>
                    <div>{{ formatDate(coupon.created_at) }}</div>
                    <div>{{ formatDate(coupon.updated_at) }}</div>
                    <div>{{ coupon.admin_name || '-' }}</div>
                    <div>{{ coupon.tutor_name || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 페이지네이션 -->
          <div class="coupon-pagination">
            <button class="coupon-page-button prev-button" @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1">
              ◀
            </button>

            <template v-for="page in displayedPages" :key="page">
              <span v-if="page === '...'" class="coupon-page-dots">...</span>
              <button v-else class="coupon-page-button" :class="{ active: currentPage === page }"
                @click="changePage(page)">
                {{ page }}
              </button>
            </template>

            <button class="coupon-page-button next-button" @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages">
              ▶
            </button>
          </div>

        </div>
      </div>

      <!-- 쿠폰 단건 조회 -->
      <div class="coupon-detail-container" v-if="selectedCoupon">
        <CouponDetail :selectedCoupon="selectedCoupon" @close-coupon-detail="deselectCoupon" />
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
const currentSortField = ref('createdAt');
const currentSortDirection = ref('DESC');

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

const fetchCoupons = async () => {
  try {
    const response = await axios.get('https://learnsmate.shop/coupon/coupons2/sort',
      {
        withCredentials: true,
        params: {
          page: currentPage.value - 1,
          size: pageSize,
          sortField: currentSortField.value,
          sortDirection: currentSortDirection.value
        },
      });

    coupon.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalCount.value = response.data.totalElements;

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
  if (selectedCoupon.value === couponData) {
    selectedCoupon.value = null;
  } else {
    selectedCoupon.value = couponData;
  }
};

const deselectCoupon = () => {
  selectedCoupon.value = null;
};

const registerCoupon = () => {
  router.push({ name: 'Register-Coupon' });
};

const applyFilters = async (filters, resetPage = true) => {
  try {
    isFiltered.value = true;
    currentFilters.value = filters;

    // 페이지 초기화는 resetPage 파라미터에 따라 결정
    if (resetPage) {
      currentPage.value = 1;
    }

    const response = await axios.post('https://learnsmate.shop/coupon/filters2', filters,
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

  } catch (error) {
    console.error('Error fetching filtered coupons:', error);
    coupon.value = [];
    totalCount.value = 0;
    totalPages.value = 1;
  }
};

const resetFilters = () => {
  isFiltered.value = false;
  currentFilters.value = null;
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

const handleExcelDownload = async () => {
  try {

    console.log('Current filters:', currentFilters.value);
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

    const config = {
      method: 'POST',
      withCredentials: true,
      url: 'https://learnsmate.shop/coupon/excel/download',
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

const handleSort = async (field) => {
  if (currentSortField.value === field) {
    // 같은 필드를 다시 클릭하면 정렬 방향을 토글
    currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    // 다른 필드를 클릭하면 해당 필드로 변경하고 DESC로 시작
    currentSortField.value = field;
    currentSortDirection.value = 'DESC';
  }
  
  // 정렬된 데이터 fetch
  if (isFiltered.value && currentFilters.value) {
    await applyFilters(currentFilters.value, false);
  } else {
    await fetchCoupons();
  }
};

</script>

<style>
.coupon-main-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 160px;
}

.coupon-content-container {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 575px;
  height: 100%;
  width: 100%;
  transition: width 0.3s ease;
  /* Smooth width transition */
  overflow: hidden;
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

.coupon-table-header {
  background-color: #f9f9f9;
  font-size: 13px;
  font-weight: bold;
  color: #595656;
  padding: 7px 14px;
  display: grid;
  grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr;
  padding: 7px 14px;
  background-color: #f9f9f9;
  font-size: 12px;
  font-weight: bold;
  color: #595656;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
  top: 0;
}

.coupon-table-body {
  border-bottom: 1px solid #eaeaea;
  font-size: 11px;
  color: #333333;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* height: calc(100% - 35px); */
  height: 400px;
}

.coupon-table-row {
  display: grid;
  grid-template-columns:  1fr 2fr 3fr 1fr 1fr 1fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr;
  padding: 10px;
  padding-left: 0px;
  padding-right: 0px;
  border-bottom: 1px solid #eaeaea;
  font-size: 11px;
  color: #333333;
  text-align: center;
  align-items: center;
  background-color: #ffffff;
  cursor: pointer;
}

.coupon-table-header,
.coupon-table-body {
  padding: 10px 15px;
  text-align: center;
}

.coupon-table-body {
  padding-top: 0px;
}

.coupon-table-row:hover {
  background-color: #f4f4f4;
}

.coupon-table-container {
  flex: 1;
  transition: flex 0.3s ease;
  overflow-x: hidden;
}

.coupon-inner-container.shrink {
  flex: 0.6;
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
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  /* margin-top: 40px; */
  border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  border-radius: 3px;
  margin-left: 20px;
  padding: 3px 5px;
}

.coupon-register-button:hover,
.coupon-excel-button:hover {
  cursor: pointer;
  background-color: #004c42;
}

.coupon-table-top {
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
}

.coupon-table-row td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.coupon-table-row div {
  overflow: hidden;
  text-overflow: ellipsis; /* 넘친 텍스트에 "..." 추가 */
  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
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

.coupon-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 40px;
  margin-bottom: 10px;
}

.coupon-page-button {
  min-width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-page-button.active {
  font-weight: bold;
  color: #005950;
}

.coupon-page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.coupon-prev-button,
.coupon-next-button {
  color: #005950;
}

.coupon-inner-container {
  display: flex;
  flex-grow: 1;
  gap: 20px;
  position: relative;
  transition: all 0.3s ease;
}

.coupon-full-view {
  width: 100%;
  transition: width 0.3s ease;
}

.coupon-inner-container.shrink .coupon-full-view {
  width: 60%;
}

.coupon-detail-container {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* shrink 상태일 때 coupon-detail-container 수정 */
.coupon-inner-container.shrink .coupon-detail-container {
  width: 40%;
  opacity: 1;
  /* height: 100%; */
}

/* coupon-table-top 수정 */
.coupon-table-top {
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
  width: 100%;
  transition: width 0.3s ease;
}

/* coupon-content-container 수정 */
.coupon-content-container {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 575px;
  /* height: 100%; */
  width: 100%;
  transition: all 0.3s ease;
  overflow-x: auto;
}

.excel-img {
  margin-right: 4px;
}

.coupon-active-state-row {
  margin-left: 25px;
  border-radius: 12px;
  width: 50px;
  height: 15px;
  padding: 0px;
}

.coupon-table .coupon-table-row td.active-state {
  display: flex;
  justify-content: center;
  border-radius: 12px;
  padding: 0.5px;
  width: 50px;
  height: 15px;
  align-items: center;
  margin-top: auto;
}

/* active_state가 true일 때 */
.coupon-table .coupon-table-row td.active-state.active {
  background-color: #dcfce7;
  color: #166534; /* 활성일 때 글자색 */
}

/* active_state가 false일 때 */
.coupon-table .coupon-table-row td.active-state.inactive {
  background-color: #fee2e2;
  color: #991b1b; /* 비활성일 때 글자색 */
}

.coupon-active-state {
  display: flex;
  justify-content: center;
  align-items: center;
}

.coupon-table-row div.active-state {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 0.5px;
  text-align: center;
  color: #ffffff; /* 기본 글자색 */
  width: 50px;
}

/* active_state가 true일 때 */
.coupon-table-row div.active-state.active {
  background-color: #dcfce7;
  color: #166534; /* 활성일 때 글자색 */
}

/* active_state가 false일 때 */
.coupon-table-row div.active-state.inactive {
  background-color: #fee2e2;
  color: #991b1b; /* 비활성일 때 글자색 */
}

.coupon-table-active-state-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.coupon-clickable {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.coupon-clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.coupon-sort-arrow {
  font-size: 12px;
}
</style>