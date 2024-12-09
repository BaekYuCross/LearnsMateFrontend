<template>
  <MarketingSideMenu />
  <div class="coupon-register-main-container">
    <div class="coupon-register-inner-container">
      <div class="coupon-register-form-container">
        <h2 class="coupon-register-table-header">쿠폰 등록</h2>
        <table class="coupon-register-table">
          <tbody>
            <tr>
              <th>쿠폰 이름</th>
              <td>
                <input type="text" class="coupon-title-textarea" v-model="couponData.couponName"
                  placeholder="쿠폰 이름을 입력하세요.">
              </td>
            </tr>
            <tr>
              <th>쿠폰 종류</th>
              <td>
                <select v-model="couponData.couponCategoryName" class="coupon-category-input">
                  <option value="일반">일반</option>
                  <option value="기념일">기념일</option>
                  <option value="신규가입">신규가입</option>
                  <option value="첫구매">첫 구매</option>
                  <option value="복귀">복귀</option>
                  <option value="완강">완강</option>
                  <option value="이벤트">이벤트</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>쿠폰 내용</th>
              <td>
                <textarea class="coupon-contents-textarea" rows="10" v-model="couponData.couponContents"
                  placeholder="쿠폰 내용을 입력하세요."></textarea>
              </td>
            </tr>
            <tr>
              <th>쿠폰 할인율</th>
              <td>
                <input type="number" min="0" max="100" class="coupon-discount-rate-textarea"
                  v-model="couponData.couponDiscountRate" placeholder="쿠폰 할인율을 입력하세요.">
              </td>
            </tr>
            <tr>
              <th>쿠폰 유효 기간</th>
              <td>
                <div class="date-input-area">
                  <input class="start-date-input" v-model="couponData.couponStartDate" type="date">
                  ~
                  <input class="end-date-input" v-model="couponData.couponExpireDate" type="date">
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      <div class="coupon-target-lecture-container">
        <h2 class="coupon-target-lecture-header">타겟 강의</h2>
        <div class="coupon-target-lecture-filter">
          <label>강의명</label>
            <input 
            type="text" 
            placeholder="강의 제목을 입력하세요."
            v-model="filters.lecture_title">
          <label>강사명</label>
            <input 
            type="text" 
            placeholder="강사 이름을 입력하세요."
            v-model="filters.tutor_name">
          <label>강의 금액</label>
            <input 
            type="number" 
            placeholder="강의 금액을 입력하세요."
            v-model="filters.min_lecture_price">
            ~
            <input 
            type="number" 
            placeholder="강의 금액을 입력하세요."
            v-model="filters.max_lecture_price">
          <button 
          class="lecture-search-button"
          @click="() => applyFilters(filters.value)">
            조회
          </button>
        </div>

        <table class="coupon-target-lecture-table">
          <thead class="coupon-target-lecture-table-header">
            <tr>
              <th><input type="checkbox" @change="toggleAllLectures"></th>
              <th>강의 코드</th>
              <th>강의 제목</th>
              <th>강의 카테고리</th>
              <th>난이도</th>
              <th>강사명</th>
              <th>강사 코드</th>
              <th>등록일</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody class="coupon-target-lecture-table-body" 
          v-for="(lecture, index) in lecture || []"
            :key="lecture.lecture_code">
            <tr>
              <td>
                <input 
    type="checkbox" 
    :checked="selectedLectureIds.some(item => item.lecture_code === lecture.lecture_code)"
    @change="toggleLecture(lecture)"
  >
              </td>
              <td>{{ lecture.lecture_code }}</td>
              <td class="target-lecture-lecture-title">{{ lecture.lecture_title }}</td>
              <td>{{ getCategoryDisplayName(lecture.lecture_category_name) }}</td>
              <td>{{ getLevelDisplayName(lecture.lecture_level) }}</td>
              <td>{{ lecture.tutor_name }}</td>
              <td>{{ lecture.tutor_code }}</td>
              <td>{{ formatDate(lecture.created_at) }}</td>
              <td>{{ lecture.lecture_price.toLocaleString("ko-KR") + '원' || '0원' }}</td>
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

      <div class="coupon-register-buttons">
        <button class="coupon-register-button" @click="showRegisterModal">
          등록
        </button>
        <button class="coupon-cancel-button" @click="showCancelModal">
          취소
        </button>
      </div>
    </div>
  </div>

  <RegisterModule 
    v-if="isRegisterModalOpen" 
    modalTitle="쿠폰을 등록하시겠습니까?" 
    @confirm="registerCoupon"
    @cancel="cancelRegister" />
  <CancelModule 
    v-if="isCancelModalOpen" 
    modalTitle="쿠폰 등록을 취소하시겠습니까?" 
    @confirm="confirmCancel"
    @cancel="cancelRegister" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';

import RegisterModule from '@/components/modules/RegisterModule.vue';
import CancelModule from '@/components/modules/CancelModule.vue';

const lecture = ref([]);

const totalPages = ref(1); // 전체 페이지 수
const currentPage = ref(1);
const pageSize = 15; // 페이지당 항목 수
const totalCount = ref(0);
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

// fetchLectures 함수 수정
const fetchLectures = async () => {
  try {
    const response = await axios.get('https://learnsmate.shop/lecture/list', {
      withCredentials: true,
      params: {
        page: currentPage.value - 1,
        size: pageSize,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    lecture.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalCount.value = response.data.totalElements;
    
  } catch (error) {
    console.error('강의 데이터를 가져오는 중 오류 발생:', error.message);
  }
};

// changePage 함수 수정
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  console.log('Changed to page:', currentPage.value); // 디버깅용
  if (isFiltered.value) {
    await applyFilters(currentFilters.value, false);
  } else {
    await fetchLectures();
  }
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

const couponData = ref({
  couponName: '',
  couponCategoryName: '',
  couponContents: '',
  couponDiscountRate: '',
  couponStartDate: '',
  couponExpireDate: '',
  selectedLectures: []
})

const formatDateWithTime = {
  // 시작일: 해당 날짜의 00:00:00
  startDate: (date) => {
    if (!date) return null;
    return `${date}T00:00:00`;
  },

  // 만료일: 해당 날짜의 23:59:59
  endDate: (date) => {
    if (!date) return null;
    return `${date}T23:59:59`;
  },

  // 여러 날짜를 쿠폰 데이터에 직접 업데이트
  applyCouponDates: (couponData) => {
    if (couponData.couponStartDate) {
      couponData.couponStartDate = formatDateWithTime.startDate(couponData.couponStartDate);
    }
    if (couponData.couponExpireDate) {
      couponData.couponExpireDate = formatDateWithTime.endDate(couponData.couponExpireDate);
    }
  }
};

const filters = ref({
  lecture_title: '',
  tutor_name: '',
  min_lecture_price: '',
  max_lecture_price: ''
})

const applyFilters = async (filterData, resetPage = true) => {
  try {
    console.log('필터 적용 전:', filters.value);
    
    // 빈 문자열을 null로 변환
    const formattedFilters = {
      lecture_title: filters.value.lecture_title || null,
      tutor_name: filters.value.tutor_name || null,
      min_lecture_price: filters.value.min_lecture_price || null,
      max_lecture_price: filters.value.max_lecture_price || null
    };

    console.log('필터 내용:', formattedFilters);

    isFiltered.value = true;
    currentFilters.value = formattedFilters;

    // 페이지 초기화는 resetPage 파라미터에 따라 결정
    if (resetPage) {
      currentPage.value = 1;
    }

    const page = currentPage.value - 1;

    const response = await axios.post('https://learnsmate.shop/lecture/coupon-register/filter', formattedFilters,
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

    if (response.data) {
      lecture.value = response.data.content;
      totalCount.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;


      console.log('페이지 정보:', {
        현재페이지: currentPage.value,
        전체페이지: totalPages.value,
        전체항목수: totalCount.value,
        현재데이터: response.data.content.length
      });
    }
    
  } catch (error) {
    console.error('Error fetching filtered coupons:', error);
    lecture.value = [];
    totalCount.value = 0;
    totalPages.value = 1;
  }
};

const selectedLectureIds = ref([]);

const registerCoupon = async () => {

  try {
    formatDateWithTime.applyCouponDates(couponData.value);

    const requestData = {
      couponName: couponData.value.couponName,
      couponCategoryName: couponData.value.couponCategoryName,
      couponContents: couponData.value.couponContents,
      couponDiscountRate: Number(couponData.value.couponDiscountRate),
      couponStartDate: couponData.value.couponStartDate, // 변환된 값
      couponExpireDate: couponData.value.couponExpireDate, // 변환된 값
      lectureCode: couponData.value.selectedLectures.map(lecture => lecture.lecture_code), // lecture_code 배열로 전송
    };

    const response = await axios.post('https://learnsmate.shop/coupon/admin/register', requestData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    isRegisterModalOpen.value = false;
    window.location.href = '/marketing/coupons'

    console.log('coupon register success', response.data);
    
  } catch (error) {
    console.error('coupon register fail:', error.message);
  }
};

const lectures = ref([]);

const paginatedLectures = computed(() => {
  return lecture.value; // 서버에서 이미 페이징된 데이터를 그대로 사용
});

onMounted(() => {
  fetchLectures();
});

const categoryMapping = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DEVOPS: '데브옵스',
  DATABASE: '데이터베이스',
  WEB_DEVELOPMENT: '웹 개발',
  MOBILE_APP_DEVELOPMENT: '모바일 앱 개발',
  FULL_STACK: '풀스택',
};

const getCategoryDisplayName = (categoryName) => {
  return categoryMapping[categoryName] || categoryName; // 매핑이 없으면 원래 값 반환
};

const levelMapping = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급'
};

const getLevelDisplayName = (lectureLevel) => {
  return levelMapping[lectureLevel] || lectureLevel;
}

console.log(lectures.value);

const isRegisterModalOpen = ref(false);
const isCancelModalOpen = ref(false);

const toggleLecture = (lecture) => {
  const index = selectedLectureIds.value.findIndex(item => item.lecture_code === lecture.lecture_code);
  if (index === -1) {
    selectedLectureIds.value.push(lecture);
  } else {
    selectedLectureIds.value.splice(index, 1);
  }
  couponData.value.selectedLectures = [...selectedLectureIds.value];
};

const toggleAllLectures = (event) => {
  if (event.target.checked) {
    selectedLectureIds.value = [...lecture.value]; 
  } else {
    selectedLectureIds.value = [];
  }
  couponData.value.selectedLectures = [...selectedLectureIds.value];
};


const showRegisterModal = () => {
  if (!couponData.value.couponName || 
      !couponData.value.couponCategoryName || 
      !couponData.value.couponContents || 
      !couponData.value.couponDiscountRate || 
      !couponData.value.couponStartDate || 
      !couponData.value.couponExpireDate ||
      couponData.value.selectedLectures.length === 0) {
    alert('모든 필드를 입력하고 적용할 강의를 선택해주세요.');
    return;
  }
  isRegisterModalOpen.value = true;
};

const cancelRegister = () => {
  isRegisterModalOpen.value = false;
  isCancelModalOpen.value = false;
};

const confirmCancel = () => {
    isCancelModalOpen.value = false; 
    window.location.href = '/marketing/coupons'; 
};

const showCancelModal = () => {
  isCancelModalOpen.value = true;
};
</script>

<style scoped>
.coupon-register-main-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.coupon-register-inner-container {
  display: block;
  flex-grow: 1;
  margin-left: 160px;
  margin-top: 50px;
  padding: 20px 30px;
  background-color: white;
  height: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.coupon-register-table {
  border-collapse: collapse;
  margin-top: 20px;
  width: 60%;
}

.coupon-title-textarea,
.coupon-category-input,
.coupon-contents-textarea,
.coupon-discount-rate-textarea,
.start-date-input,
.end-date-input {
  padding: 5px 8px;
  margin: 4px;
  border: 1px solid #ddd;
  font-size: 12px;
  width: 70%;
  font-family: inherit;
}

.coupon-contents-textarea {
  white-space: pre-line;
  line-height: 1.6;
  width: 70%;
  resize: none;
}

.coupon-target-lecture-filter {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.coupon-target-lecture-filter label {
  font-size: 12px;
  font-weight: bold;
  margin-left: 20px;
}

.coupon-target-lecture-filter input {
  margin-right: 10px;
  margin-left: 10px;
  padding: 5px 8px;
  border: 1px solid #ddd;
  font-size: 12px;
  font-family: inherit;
  width: 200px;
}

.coupon-target-lecture-container {
  margin-top: 20px;
  width: 100%;
}

.coupon-register-table-header,
.coupon-target-lecture-header {
  font-size: 18px;
  font-weight: bold;
}

.coupon-register-table th {
  font-size: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  color: #333;
  width: 150px;
  text-align: left;
}

.coupon-register-table td {
  flex: 1;
  padding: 12px;
  font-size: 12px;
  color: #555;
}

.coupon-register-table th,
.coupon-register-table td {
  border-bottom: 1px solid #ddd;
}

.date-input-area {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  width: 70%;
}

.coupon-target-lecture-table-body td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.coupon-target-lecture-table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
}

.coupon-target-lecture-table th {
  background-color: #f9f9f9;
  font-size: 13px;
  font-weight: bold;
  color: #595656;
  text-align: center;
  width: 100%;
}

.coupon-target-lecture-table td {
  font-size: 11px;
  color: #333333;
  text-align: center;
  background-color: #ffffff;
}

.coupon-target-lecture-table td.target-lecture-lecture-title {
  text-align: left;
  padding-left: 10px;
}

.coupon-target-lecture-table th,
.coupon-target-lecture-table td {
  padding: 15px 20px;
  margin-top: 20px;
  border-bottom: 1px solid #eaeaea;
}

/* 체크 박스 */
.coupon-target-lecture-table th:nth-child(1),
.coupon-target-lecture-table td:nth-child(1) {
  width: 5%;
}


/* 강의 코드 */
.coupon-target-lecture-table th:nth-child(2),
.coupon-target-lecture-table td:nth-child(2) {
  width: 15%;
}

/* 강의 제목 */
.coupon-target-lecture-table th:nth-child(3),
.coupon-target-lecture-table td:nth-child(3) {
  width: 30%;
}

/* 강의 카테고리 */
.coupon-target-lecture-table th:nth-child(4),
.coupon-target-lecture-table td:nth-child(4) {
  width: 10%;
}

/* 난이도 */
.coupon-target-lecture-table th:nth-child(5),
.coupon-target-lecture-table td:nth-child(5) {
  width: 15%;
}

/* 강사명 */
.coupon-target-lecture-table th:nth-child(6),
.coupon-target-lecture-table td:nth-child(6) {
  width: 10%;
}

/* 강사 코드 */
.coupon-target-lecture-table th:nth-child(7),
.coupon-target-lecture-table td:nth-child(7) {
  width: 10%;
}

/* 등록일 */
.coupon-target-lecture-table th:nth-child(8),
.coupon-target-lecture-table td:nth-child(8) {
  width: 10%;
}

/* 가격 */
.coupon-target-lecture-table th:nth-child(9),
.coupon-target-lecture-table td:nth-child(9) {
  width: 10%;
}

.coupon-register-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 8%;
}

.coupon-register-button,
.coupon-cancel-button,
.lecture-search-button {
  display: flex;
  gap: 5px;
  font-size: 15px;
  align-items: center;
  padding: 2px 10px;
  background-color: #005950;
  color: white;
  border: 1px solid #005950;
  border-radius: 3px;
  cursor: pointer;
}

.coupon-register-button:hover,
.coupon-cancel-button:hover,
.lecture-search-button:hover {
  background-color: #004c42;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
  background-color: #f9f9f9;
}

.page-button {
  background: none;
  border: none;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 13px;
  margin: 0 2px;
}

.page-button.active {
  font-weight: bold;
  color: #005950;
}

.page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.prev-button,
.next-button {
  font-size: 12px;
}
</style>