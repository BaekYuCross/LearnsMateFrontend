<template>
  <div class="issue-coupon-container">
    <MarketingSideMenu />
    <div class="issue-coupon-content-container" @click="deselectCoupon">
      <IssuedCouponFilter @search="applyFilters" @reset="resetFilters"/>
      <div class="issue-coupon-actions">
        <div class="issue-coupon-count">발행된 쿠폰 <span class="issue-coupon-length">{{ totalCount }}</span>개</div>
        <div class="issue-coupon-button-group">
          <div class="issue-coupon-column-selector">
            <button @click="toggleDropdown" class="issue-coupon-dropdown-button">
              필요 컬럼 선택 ▼
            </button>
            <div v-show="isDropdownOpen" class="issue-coupon-dropdown-menu">
              <div v-for="(label, key) in columns" :key="key" class="issue-coupon-dropdown-item">
                <input 
                  type="checkbox" 
                  :value="key" 
                  v-model="selectedColumns" 
                  @change="updateSelectedColumns" 
                  id="key"
                />
                <label :for="key">{{ label }}</label>
              </div>
            </div>
          </div>
          <button class="issue-coupon-excel-button" @click="handleExcelDownload">
            <img src="@/assets/icons/download.svg" alt="다운로드">
            엑셀 다운로드
          </button>
        </div>
      </div>
      <div class="issue-coupon-content-body">
        <div class="issue-coupon-board-container" :class="{ 'single-view': isSingleView }">
          <div class="issue-coupon-board-header">
            <div v-if="selectedColumns.includes('coupon_issuance_code')" class="issue-coupon-board-header-issuance_code">발급 쿠폰 번호</div>
            <div v-if="selectedColumns.includes('coupon_name')" class="issue-coupon-board-header-coupon-name">쿠폰 이름</div>
            <div v-if="selectedColumns.includes('coupon_contents')" class="issue-coupon-board-header-coupon-contents">쿠폰 내용</div>
            <div v-if="selectedColumns.includes('coupon_category_name')" class="issue-coupon-board-header-coupon-category-name">쿠폰 종류</div>
            <div v-if="selectedColumns.includes('student_code')" class="issue-coupon-board-header-student-code">고객 코드</div>
            <div v-if="selectedColumns.includes('student_name')" class="issue-coupon-board-header-student-name">고객명</div>
            <div v-if="selectedColumns.includes('coupon_use_status')" class="issue-coupon-board-header-use-status">사용 여부</div>
            <div v-if="selectedColumns.includes('coupon_discount_rate')" class="issue-coupon-board-header-discount-rate">할인율</div>
            <div v-if="selectedColumns.includes('coupon_start_date')" class="issue-coupon-board-header-start-date">시작일</div> 
            <div v-if="selectedColumns.includes('coupon_expire_date')" class="issue-coupon-board-header-expire-date">만료일</div>
            <div v-if="selectedColumns.includes('coupon_issue_date')" class="issue-coupon-board-header-issue-date">발급일</div>
            <div v-if="selectedColumns.includes('coupon_use_date')" class="issue-coupon-board-header-use-date">사용일</div>
          </div>

          <div class="issue-coupon-board-body">
            <div 
              class="issue-coupon-board-row" 
              v-for="coupon in coupons" 
              :key="coupon.coupon_issuance_code" 
              @click.stop="showIssueCouponDetail(coupon)"
              :class="{'selected': selectedCoupon?.coupon_issuance_code === coupon.coupon_issuance_code }"
            >
              <div v-if="selectedColumns.includes('coupon_issuance_code')" class="issue-coupon-board-row-issuance-code">{{ coupon.coupon_issuance_code }}</div>
              <div v-if="selectedColumns.includes('coupon_name')" class="issue-coupon-board-row-coupon-name">{{ coupon.coupon_name }}</div>
              <div v-if="selectedColumns.includes('coupon_contents')" class="issue-coupon-board-row-coupon-contents">{{ coupon.coupon_contents }}</div>
              <div v-if="selectedColumns.includes('coupon_category_name')" class="issue-coupon-board-row-coupon-category-name">{{ coupon.coupon_category_name }}</div>
              <div v-if="selectedColumns.includes('student_code')" class="issue-coupon-board-row-student-code">{{ coupon.student_code }}</div>
              <div v-if="selectedColumns.includes('student_name')" class="issue-coupon-board-row-student-name">{{ coupon.student_name }}</div>
              <div v-if="selectedColumns.includes('coupon_use_status')" class="issue-coupon-board-row-use-status">{{ coupon.coupon_use_status ? 'O' : 'X' }}</div>
              <div v-if="selectedColumns.includes('coupon_discount_rate')" class="issue-coupon-board-row-discount-rate">{{ coupon.coupon_discount_rate }}</div>
              <div v-if="selectedColumns.includes('coupon_start_date')" class="issue-coupon-board-row-start-date">{{ formatDate(coupon.coupon_start_date) }}</div>
              <div v-if="selectedColumns.includes('coupon_expire_date')" class="issue-coupon-board-row-expire-date">{{ formatDate(coupon.coupon_expire_date) }}</div>
              <div v-if="selectedColumns.includes('coupon_issue_date')" class="issue-coupon-board-row-issue-date">{{ formatDate(coupon.coupon_issue_date) }}</div>
              <div v-if="selectedColumns.includes('coupon_use_date')" class="issue-coupon-board-row-use-date">{{ formatDate(coupon.coupon_use_date) }}</div>
            </div>
          </div>

          <div class="issue-coupon-pagination">
            <button 
              class="issue-coupon-page-button issue-coupon-prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >◀</button>
            <button 
              class="issue-coupon-page-button" 
              :class="{ active: currentPage === 1 }" 
              @click="changePage(1)"
            >1</button>
            <span v-if="startPage > 2">...</span>
            <template v-for="page in displayedPages" :key="page">
              <button 
                v-if="page !== 1 && page !== totalPages" 
                class="issue-coupon-page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >{{ page }}</button>
            </template>
            <span v-if="endPage < totalPages - 1">...</span>
            <button 
              v-if="totalPages > 1" 
              class="issue-coupon-page-button" 
              :class="{ active: currentPage === totalPages }" 
              @click="changePage(totalPages)"
            >{{ totalPages }}</button>
            <button 
              class="issue-coupon-page-button issue-coupon-next-button" 
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >▶</button>
          </div>
        </div>

        <IssuedCouponDetail 
          v-if="selectedCoupon" 
          :selectedCoupon="selectedCoupon"
          @close="closeIssueCouponDetail"
          :class="{ active: isSingleView }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { saveAs } from 'file-saver';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
import IssuedCouponFilter from '@/components/marketing/IssuedCouponFilter.vue';
import IssuedCouponDetail from '@/components/marketing/IssuedCouponDetail.vue';

const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 50;
const totalCount = ref(0);
const isFiltered = ref(false);
const lastFilterData = ref(null);
const selectedCoupon = ref(null);
const isSingleView = ref(false);
const isDropdownOpen = ref(false);
const coupons = ref([]);

const columns = ref({
  coupon_issuance_code: "발급 쿠폰 번호",
  coupon_name: "쿠폰 이름",
  coupon_code: "쿠폰 내용",
  coupon_category_name: "쿠폰 종류",
  student_code: "고객 코드",
  student_name: "고객명",
  coupon_use_status: "사용 여부",
  coupon_discount_rate: "할인율",
  coupon_start_date: "시작일",
  coupon_expire_date: "만료일",
  coupon_issue_date: "발급일",
  coupon_use_date: "사용일",

  });

  const selectedColumns = ref(Object.keys(columns.value));

const fetchIssueCouponList = async () => {
  try {
    const response = await axios.get('http://localhost:5000/issue-coupon/all-issued-coupons2',
      {
        withCredentials: true,
        params: {
          page: currentPage.value - 1,
          size: pageSize,
        }
      }
    );

    coupons.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

    console.log("발급쿠폰 데이터:",coupons.value);
  } catch(error) {
    console.error('IssueCoupon 목록을 불러오는데 실패했습니다:', error);
  }
};

const applyFilters = async (filterData) => {
  try {
    isFiltered.value = true;
    currentPage.value = 1;
    lastFilterData.value = filterData;

    const response = await axios.post(
      `http://localhost:5000/issue-coupon/filters2?page=0&size=${pageSize}`,
      camelToSnake(filterData)
    );

    coupons.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('필터링 중 오류 발생:', error);
  }
};

const resetFilters = async () => {
  try {
    isFiltered.value = false;
    lastFilterData.value = null;
    currentPage.value = 1;
    await fetchIssueCouponList();
    selectedCoupon.value = null;
  } catch (error) {
    console.error('리셋 중 오류 발생:', error);
  }
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;

  try {
    currentPage.value = newPage;

    if (isFiltered.value && lastFilterData.value) {
      const response = await axios.post(
        `http://localhost:5000/issue-coupon/filters2?page=${currentPage.value - 1}&size=${pageSize}`,
        camelToSnake(lastFilterData.value)
      );

      coupons.value = response.data.content;
      totalCount.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
    } else {
      await fetchIssueCouponList();
    }
  } catch (error) {
    console.error('페이지 변경 중 오류 발생:', error);
  }
};

const handleExcelDownload = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/issue-coupon/excel/download',
      isFiltered.value && lastFilterData.value ? camelToSnake(lastFilterData.value) : {},
      {
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'issue_coupon_data.xlsx');
  } catch (error) {
    console.error('엑셀 다운로드 중 오류 발생:', error);
  }
};

const showIssueCouponDetail = (coupon) => {
  if (selectedCoupon.value?.coupon_issuance_code === coupon.coupon_issuance_code) {
    closeIssueCouponDetail();
  } else {
    selectedCoupon.value = coupon;  // 이미 가지고 있는 데이터 사용
    showSingleView();
  }
};

const closeIssueCouponDetail = () => {
  selectedCoupon.value = null;
  hideSingleView();
};

const showSingleView = () => {
  isSingleView.value = true;
};

const hideSingleView = () => {
  isSingleView.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const deselectCoupon = (event) => {
  if (event.target.classList.contains('issue-coupon-content-container')) {
    closeIssueCouponDetail();
  }
};

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const displayedPages = computed(() => {
  let start = Math.max(currentPage.value - 2, 2);
  let end = Math.min(start + 2, totalPages.value - 1);
  
  if (end === totalPages.value - 1) {
    start = Math.max(end - 2, 2);
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

onMounted(() => {
  fetchIssueCouponList();
});
</script>

<style scoped>
.issue-coupon-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.issue-coupon-content-container {
  flex: 1;
  padding: 20px;
  margin-left: 160px;
  margin-top: 50px;
}

.issue-coupon-content-body {
  display: flex;
  flex-direction: row;
  gap: 5px;
  width: 100%;
}

.issue-coupon-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.issue-coupon-count {
  flex: 1;
  font-size: 17px;
  font-weight: bold;
  color: #333;
}

.issue-coupon-length {
  color: #005950;
}

.issue-coupon-button-group {
  display: flex;
  gap: 10px;
}

.issue-coupon-column-selector {
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
}

.issue-coupon-dropdown-button {
  background-color: #ffffff;
    color: #000000;
    border: 0.5px solid #d5d5d5;
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
}

.issue-coupon-dropdown-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-top: 277px;
  z-index: 10;
  width: 115px;
  border-radius: 4px;
}

.issue-coupon-dropdown-menu input[type="checkbox"] {
  outline: none;
  accent-color: #005950; 
}

.issue-coupon-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.issue-coupon-dropdown-item label {
    font-size: 12px;
    color: #333;
    cursor: pointer;
  }

.issue-coupon-excel-button {
  background: #005950;
  padding: 3px 5px;
  margin-bottom: 3px;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 3px;
}

.issue-coupon-excel-button img {
  width: 16px;
  height: 16px;
}

.issue-coupon-board-container {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 570px;
  flex: 1;
  overflow-x: auto;
}

.issue-coupon-board-header {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  padding: 7px 14px;
  background-color: #f9f9f9;
  font-size: 12px;
  font-weight: bold;
  color: #595656;
  text-align: center;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 1;
}

.issue-coupon-board-body {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 35px);
}

.issue-coupon-board-row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  padding: 10px 15px;
  border-bottom: 1px solid #eaeaea;
  font-size: 11px;
  color: #333333;
  text-align: center;
  align-items: center;
  background-color: #ffffff;
  cursor: pointer;
}

.issue-coupon-board-row:hover {
  background-color: #f4f4f4;
}

.issue-coupon-board-row.selected {
  background-color: #f4f4f4;
}

.issue-coupon-board-row > div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 5px;
}

.issue-coupon-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.issue-coupon-page-button {
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

.issue-coupon-page-button.active {
  font-weight: bold;
  color: #005950;
}

.issue-coupon-page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.issue-coupon-prev-button,
.issue-coupon-next-button {
  color: #005950;
}

.issue-coupon-excel-button img {
  width: 16px;
  height: 16px;
}

.issue-coupon-pagination span {
  color: #666;
  margin: 0 5px;
}

.issue-coupon-board-container.single-view {
  flex: 0.7;
}

.issue-coupon-detail-container {
  flex: 0;
}

.issue-coupon-detail-container.active {
  flex: 0.3;
}

.issue-coupon-excel-button:hover {
  background-color: #004c42;
}
</style>