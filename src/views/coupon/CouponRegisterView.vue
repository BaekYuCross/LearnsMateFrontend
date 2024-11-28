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
          <label>
            강의명
            <input type="text" placeholder="강의 제목을 입력하세요.">
          </label>
          <label>
            강사명
            <input type="text" placeholder="강사 이름을 입력하세요.">
          </label>
          <label>
            강의 금액
            <input type="number" placeholder="강의 금액을 입력하세요.">
          </label>
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
          <tbody class="coupon-target-lecture-table-body" v-for="lecture in paginatedLectures"
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
              <td>{{ lecture.lecture_title }}</td>
              <td>{{ lecture.category_name }}</td>
              <td>{{ lecture.lecture_level }}</td>
              <td>{{ lecture.tutor_name }}</td>
              <td>{{ lecture.tutor_code }}</td>
              <td>{{ formatDate(lecture.created_at) }}</td>
              <td>{{ lecture.lecture_price }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button class="page-button prev-button" @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1">◀</button>
        <button class="page-button" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
        <span v-if="startPage > 2">...</span>
        <template v-for="page in displayedPages" :key="page">
          <button v-if="page !== 1 && page !== totalPages" class="page-button" :class="{ active: currentPage === page }"
            @click="changePage(page)">{{ page }}</button>
        </template>
        <span v-if="endPage < totalPages - 1">...</span>
        <button v-if="totalPages > 1" class="page-button" :class="{ active: currentPage === totalPages }"
          @click="changePage(totalPages)">{{ totalPages }}</button>
        <button class="page-button next-button" @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages">▶</button>
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

  <RegisterModule v-if="isRegisterModalOpen" modalTitle="쿠폰을 등록하시겠습니까?" @confirm="registerCoupon"
    @cancel="cancelRegister" />
  <CancelModule v-if="isCancelModalOpen" modalTitle="쿠폰 등록을 취소하시겠습니까?" @confirm="confirmCancel"
    @cancel="cancelRegister" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ';
const userCode = jwtDecode(token).sub;
const userName = jwtDecode(token).name;

import RegisterModule from '@/components/modules/RegisterModule.vue';
import CancelModule from '@/components/modules/CancelModule.vue';

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


const selectedLectureIds = ref([]);

const registerCoupon = async () => {
  try {

    // couponData의 날짜 필드를 직접 수정
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


    console.log(requestData.data);
  // 날짜 필드와 빈 문자열 처리
  // Object.keys(couponData).forEach(key => {
  //   if (couponData[key] === '') {
  //     couponData[key] = null;
  //   } else if (key.includes('date') && couponData[key]) {
  //     couponData[key] = new Date(couponData[key]).toISOString();
  //   }
  // });
console.log(couponData.value.couponStartDate, couponData.value.couponExpireDate); 

console.log(couponData.value);


    const response = await axios.post('http://localhost:5000/coupon/admin/register', requestData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('쿠폰 등록 성공', response.data);
    
  } catch (error) {
    console.error('쿠폰 등록 실패:', error.message);
  }
};

const lectures = ref([]);
const currentPage = ref(1);
const pageSize = 50;

const totalPages = computed(() => Math.ceil(lectures.value.length / pageSize));
const paginatedLectures = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return lectures.value.slice(start, start + pageSize);
});

const fetchLectures = async () => {
  try {
    const response = await axios.get('http://localhost:5000/lecture/all-lectures', {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    lectures.value = response.data;
    console.log(lectures.value);
  } catch (error) {
    console.error('강의 데이터를 가져오는 중 오류 발생:', error.message);
  }
};

onMounted(() => {
  fetchLectures();
});

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
    selectedLectureIds.value = [...paginatedLectures.value];
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

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

const displayedPages = computed(() => {
  let start = Math.max(currentPage.value - 2, 2);
  let end = Math.min(start + 4, totalPages.value - 1);

  if (end === totalPages.value - 1) {
    start = Math.max(end - 4, 2);
  }

  if (start === 2) {
    end = Math.min(6, totalPages.value - 1);
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
}

.coupon-target-lecture-filter input {
  margin-right: 20px;
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
.coupon-cancel-button {
  display: flex;
  gap: 5px;
  font-size: 15px;
  align-items: center;
  padding: 2px 10px;
  background-color: #005950;
  color: white;
  border: 1px solid #005950;
  border-radius: 4px;
  cursor: pointer;
}

.coupon-register-button:hover,
.coupon-cancel-button:hover {
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