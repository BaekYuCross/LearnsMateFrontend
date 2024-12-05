<template>
    <div class="payment-container">
      <LectureSideMenu />
      <div class="payment-content-container">
        <PaymentFilter @search="handleSearch" @reset="handleReset" />
        <div class="payment-actions">
          <div class="payment-count">
            총 결제 건수 <span class="payment-length">{{ formatNumber(totalElements) }}</span>건
          </div>
          <div class="payment-button-group">
            <div class="payment-column-selector">
              <button @click="toggleDropdown" class="payment-dropdown-button">
                필요 컬럼 선택 ▼
              </button>
              <div v-show="isDropdownOpen" class="payment-dropdown-menu">
                <div v-for="(label, key) in columns" :key="key" class="payment-dropdown-item">
                  <input 
                    type="checkbox" 
                    :value="key" 
                    v-model="selectedColumns" 
                    @change="updateSelectedColumns"
                    :id="'checkbox-' + key"
                  />
                  <label :for="'checkbox-' + key">{{ label }}</label>
                </div>
              </div>
            </div>
            <button class="payment-excel-button" @click="handleExcelDownload">
              <img src="@/assets/icons/download.svg" alt="다운로드">
              엑셀 다운로드
            </button>
            <button class="payment-revenue-button" @click="openRevenueModal">
              <img src="@/assets/icons/ai.svg" alt="매출액 비교">
              매출액 비교
            </button>
          </div>
        </div>
  
        <div class="payment-content-body">
          <div class="payment-board-container">
            <div class="payment-board-header">
              <div 
                v-if="selectedColumns.includes('paymentCode')" 
                class="payment-board-header-code"
                @click="sortPaymentList('payment_code')"
                :class="{
                  'sort-asc': sortState.column === 'payment_code' && sortState.order === 1,
                  'sort-desc': sortState.column === 'payment_code' && sortState.order === 2
                }"
              >
                결제코드
              </div>
              <div 
                v-if="selectedColumns.includes('createdAt')" 
                class="payment-board-header-date"
                @click="sortPaymentList('created_at')"
                :class="{
                  'sort-asc': sortState.column === 'created_at' && sortState.order === 1,
                  'sort-desc': sortState.column === 'created_at' && sortState.order === 2
                }"
              >
                결제일
              </div>
              <div 
                v-if="selectedColumns.includes('lectureCode')" 
                class="payment-board-header-lecturecode"
                @click="sortPaymentList('lecture_code')"
                :class="{
                  'sort-asc': sortState.column === 'lecture_code' && sortState.order === 1,
                  'sort-desc': sortState.column === 'lecture_code' && sortState.order === 2
                }"
              >
                강의코드
              </div>
              <div 
                v-if="selectedColumns.includes('lectureTitle')" 
                class="payment-board-header-title"
                @click="sortPaymentList('lecture_title')"
                :class="{
                  'sort-asc': sortState.column === 'lecture_title' && sortState.order === 1,
                  'sort-desc': sortState.column === 'lecture_title' && sortState.order === 2
                }"
              >
                강의명
              </div>
              <div 
                v-if="selectedColumns.includes('lectureCategoryName')" 
                class="payment-board-header-category"
                @click="sortPaymentList('lecture_category_name')"
                :class="{
                  'sort-asc': sortState.column === 'lecture_category_name' && sortState.order === 1,
                  'sort-desc': sortState.column === 'lecture_category_name' && sortState.order === 2
                }"
              >
                강의 카테고리
              </div>
              <div 
                v-if="selectedColumns.includes('tutorCode')" 
                class="payment-board-header-tutorcode"
                @click="sortPaymentList('tutor_code')"
                :class="{
                  'sort-asc': sortState.column === 'tutor_code' && sortState.order === 1,
                  'sort-desc': sortState.column === 'tutor_code' && sortState.order === 2
                }"
              >
                강사코드
              </div>
              <div 
                v-if="selectedColumns.includes('tutorName')" 
                class="payment-board-header-tutor"
                @click="sortPaymentList('tutor_name')"
                :class="{
                  'sort-asc': sortState.column === 'tutor_name' && sortState.order === 1,
                  'sort-desc': sortState.column === 'tutor_name' && sortState.order === 2
                }"
              >
                강사명
              </div>
              <div 
                v-if="selectedColumns.includes('studentCode')" 
                class="payment-board-header-studentcode"
                @click="sortPaymentList('student_code')"
                :class="{
                  'sort-asc': sortState.column === 'student_code' && sortState.order === 1,
                  'sort-desc': sortState.column === 'student_code' && sortState.order === 2
                }"
              >
                학생코드
              </div>
              <div 
                v-if="selectedColumns.includes('studentName')" 
                class="payment-board-header-student"
                @click="sortPaymentList('student_name')"
                :class="{
                  'sort-asc': sortState.column === 'student_name' && sortState.order === 1,
                  'sort-desc': sortState.column === 'student_name' && sortState.order === 2
                }"
              >
                학생명
              </div>
              <div 
                v-if="selectedColumns.includes('lecturePrice')" 
                class="payment-board-header-lectureprice"
                @click="sortPaymentList('lecture_price')"
                :class="{
                  'sort-asc': sortState.column === 'lecture_price' && sortState.order === 1,
                  'sort-desc': sortState.column === 'lecture_price' && sortState.order === 2
                }"
              >
                원가(원)
              </div>
              <div 
                v-if="selectedColumns.includes('couponIssuanceName')" 
                class="payment-board-header-coupon"
                @click="sortPaymentList('coupon_issuance_name')"
                :class="{
                  'sort-asc': sortState.column === 'coupon_issuance_name' && sortState.order === 1,
                  'sort-desc': sortState.column === 'coupon_issuance_name' && sortState.order === 2
                }"
              >
                적용쿠폰
              </div>
              <div 
                v-if="selectedColumns.includes('paymentPrice')" 
                class="payment-board-header-price"
                @click="sortPaymentList('payment_price')"
                :class="{
                  'sort-asc': sortState.column === 'payment_price' && sortState.order === 1,
                  'sort-desc': sortState.column === 'payment_price' && sortState.order === 2
                }"
              >
                결제액(원)
              </div>
            </div>
  
            <div class="payment-board-body">
                <div 
                    v-for="payment in paymentList" 
                    :key="payment.payment_code"
                    class="payment-board-row"
                    @click="showPaymentDetail(payment)"
                    :class="{ 'selected': selectedPayment?.payment_code === payment.payment_code }"
                >
                    <div v-if="selectedColumns.includes('paymentCode')" class="payment-board-row-code">
                    {{ payment.payment_code }}
                    </div>
                    <div v-if="selectedColumns.includes('createdAt')" class="payment-board-row-date">
                    {{ formatDateFromArray(payment.created_at) }}
                    </div>
                    <div v-if="selectedColumns.includes('lectureCode')" class="payment-board-row-lecturecode">
                    {{ truncateText(payment.lecture_code, 15) }}
                    </div>
                    <div v-if="selectedColumns.includes('lectureTitle')" class="payment-board-row-title">
                    {{ truncateText(payment.lecture_title, 20) }}
                    </div>
                    <div v-if="selectedColumns.includes('lectureCategoryName')" class="payment-board-row-category">
                        {{ translateCategory(payment.lecture_category_name || payment.lecture_category) }}
                    </div>
                    <div v-if="selectedColumns.includes('tutorCode')" class="payment-board-row-tutorcode">
                    {{ payment.tutor_code }}
                    </div>
                    <div v-if="selectedColumns.includes('tutorName')" class="payment-board-row-tutor">
                    {{ maskName(payment.tutor_name) }}
                    </div>
                    <div v-if="selectedColumns.includes('studentCode')" class="payment-board-row-studentcode">
                    {{ payment.student_code }}
                    </div>
                    <div v-if="selectedColumns.includes('studentName')" class="payment-board-row-student">
                    {{ maskName(payment.student_name) }}
                    </div>
                    <div v-if="selectedColumns.includes('lecturePrice')" class="payment-board-row-lectureprice">
                    {{ formatPrice(payment.lecture_price) }}
                    </div>
                    <div v-if="selectedColumns.includes('couponIssuanceName')" class="payment-board-row-coupon">
                    {{ payment.coupon_issuance_name || '-' }}
                    </div>
                    <div v-if="selectedColumns.includes('paymentPrice')" class="payment-board-row-price">
                    {{ formatPrice(payment.payment_price) }}
                    </div>
                </div>
            </div>
  
            <div class="payment-pagination">
              <button 
                class="payment-page-button payment-prev-button" 
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
              >◀</button>
              <button 
                class="payment-page-button"
                :class="{ active: currentPage === 1 }"
                @click="changePage(1)"
              >1</button>
              <span v-if="startPage > 2">...</span>
              <template v-for="page in displayedPages" :key="page">
                <button 
                  v-if="page !== 1 && page !== totalPages"
                  class="payment-page-button"
                  :class="{ active: currentPage === page }"
                  @click="changePage(page)"
                >{{ page }}</button>
              </template>
              <span v-if="endPage < totalPages - 1">...</span>
              <button 
                v-if="totalPages > 1"
                class="payment-page-button"
                :class="{ active: currentPage === totalPages }"
                @click="changePage(totalPages)"
              >{{ totalPages }}</button>
              <button 
                class="payment-page-button payment-next-button"
                @click="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
              >▶</button>
            </div>
          </div>
  
          <div v-if="selectedPayment" class="payment-detail-container">
            <div class="payment-detail-header">
              <h3 class="payment-detail-title">결제 상세 정보</h3>
              <button class="close-button" @click="closePaymentDetail">×</button>
            </div>
            <div class="payment-detail-content">
              <div class="payment-detail-item">
                <span class="label">결제 코드</span>
                <span class="value">{{ selectedPayment.payment_code }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">결제 금액</span>
                <span class="value">{{ formatPrice(selectedPayment.payment_price) }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">결제일</span>
                <span class="value">{{ formatDateFromArray(selectedPayment.created_at) }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강의 코드</span>
                <span class="value">{{ selectedPayment.lecture_code }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강의명</span>
                <span class="value" style="width: 200px; text-align: right;">{{ selectedPayment.lecture_title }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강의 가격</span>
                <span class="value">{{ formatPrice(selectedPayment.lecture_price) }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강의 상태</span>
                <span class="value">{{ selectedPayment.lecture_status ? '운영중' : '종료' }}</span>
              </div>
              <div class="payment-detail-item">
                  <span class="label">강의 카테고리</span>
                  <span class="value">{{ translateCategory(selectedPayment.lecture_category_name || selectedPayment.lecture_category) }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강의 난이도</span>
                <span class="value">{{ translateLevel(selectedPayment.lecture_level) }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강의 조회수</span>
                <span class="value">{{ selectedPayment.lecture_click_count }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강사 코드</span>
                <span class="value">{{ selectedPayment.tutor_code }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">강사명</span>
                <span class="value">{{ selectedPayment.tutor_name }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">학생 코드</span>
                <span class="value">{{ selectedPayment.student_code }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">학생명</span>
                <span class="value">{{ selectedPayment.student_name }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">적용 쿠폰 코드</span>
                <span class="value">{{ selectedPayment.coupon_issuance_code || '-' }}</span>
              </div>
              <div class="payment-detail-item">
                <span class="label">적용 쿠폰명</span>
                <span class="value">{{ selectedPayment.coupon_issuance_name || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PaymentRevenueModal 
      :isOpen="isRevenueModalOpen"
      @close="closeRevenueModal"
    />
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import LectureSideMenu from '@/components/sideMenu/LectureSideMenu.vue';
import PaymentFilter from '@/components/payment/PaymentFilter.vue';
import axios from 'axios';
import '@/assets/css/payment/PaymentView.css';
import { useLoginState } from '@/stores/loginState';
import PaymentRevenueModal from '@/components/payment/PaymentRevenueModal.vue';
import { saveAs } from 'file-saver';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
  
const loginState = useLoginState(); 
const paymentList = ref([]);
const selectedPayment = ref(null);
const totalElements = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 50;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const isDropdownOpen = ref(false);
const isRevenueModalOpen = ref(false);

const columns = ref({
    paymentCode: "결제코드",
    createdAt: "결제일",
    lectureCode: "강의코드",
    lectureTitle: "강의명",
    lectureCategoryName: "강의 카테고리",
    tutorCode: "강사코드",
    tutorName: "강사명",
    studentCode: "학생코드",
    studentName: "학생명",
    lecturePrice: "원가(원)",
    couponIssuanceName: "적용쿠폰",
    paymentPrice: "결제액(원)"
});

const sortState = ref({
  column: null,
  order: 0,
});

const sortPaymentList = (columnKey) => {
  if (sortState.value.column === columnKey) {
    sortState.value.order = (sortState.value.order + 1) % 3;
  } else {
    sortState.value.column = columnKey;
    sortState.value.order = 1;
  }

  if (sortState.value.order === 0) {
    fetchPaymentList();
  } else {
    paymentList.value.sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];

      if (sortState.value.order === 1) {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }
};

const selectedColumns = ref(Object.keys(columns.value));

const fetchPaymentList = async (filters = {}) => {
  try {
    const response = await axios.get(`https://learnsmate.shop/payments`, {
      params: {
        ...filters,
        page: currentPage.value - 1,
        size: pageSize
      },
    });

    paymentList.value = response.data.paymentData.map(payment => ({
      ...payment,
      lecture_category_name: payment.lecture_category_name || payment.lecture_category
    }));
    totalElements.value = response.data.totalElements;
    totalPages.value = Math.ceil(totalElements.value / pageSize);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
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

const handleSearch = async (filterData) => {
    try {
        isFiltered.value = true;

        const convertToISODate = (date) => {
            if (!date) return null;
            const parsedDate = new Date(date);
            return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0).toISOString();
        };

        const processedData = {
            ...filterData,
            startCreatedAt: convertToISODate(filterData.startCreatedAt),
            endCreatedAt: convertToISODate(filterData.endCreatedAt),
        };

        lastFilterData.value = processedData;

        const response = await axios.post(
            `https://learnsmate.shop/payments/filter?page=${currentPage.value - 1}&size=${pageSize}`,
            camelToSnake(processedData)
        );

        paymentList.value = response.data.content;
        totalElements.value = response.data.totalElements;
        totalPages.value = response.data.totalPages;
    } catch (error) {
        console.error('Failed to filter payments:', error);
    }
};
  
  const handleReset = () => {
    isFiltered.value = false;
    lastFilterData.value = null;
    currentPage.value = 1;
    selectedPayment.value = null;
    fetchPaymentList();
  };

  const handleExcelDownload = async () => {
  try {
    const config = {
      method: 'POST',
      url: 'https://learnsmate.shop/payments/excel/download',
      responseType: 'blob',
      data: {
        selected_columns: selectedColumns.value,
        ...(isFiltered.value && lastFilterData.value ? camelToSnake(lastFilterData.value) : {}),
      },
    };

    const response = await axios(config);

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'payment_data.xlsx');
  } catch (error) {
    console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
  }
};

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };
  
  const updateSelectedColumns = () => {
    console.log("Selected columns:", selectedColumns.value);
  };
  
  const formatPrice = (price) => {
    return price?.toLocaleString('ko-KR') + '원' || '0원';
  };

  const translateCategory = (category) => {
  if (!category) return '-';
  
  const categoryMap = {
    'BACKEND': '백엔드',
    'FRONTEND': '프론트엔드',
    'DEVOPS': '데브옵스/인프라',
    'DATABASE': '데이터베이스',
    'WEB_DEVELOPMENT': '웹 개발',
    'MOBILE_APP_DEVELOPMENT': '모바일 앱 개발',
    'FULL_STACK': '풀스택'
  };

  return categoryMap[category] || category;
};

const translateLevel = (level) => {
  if (!level) return '-';
  
  const levelMap = {
    'BEGINNER': '입문',
    'INTERMEDIATE': '중급',
    'ADVANCED': '고급'
  };

  return levelMap[level] || level;
};

const formatNumber = (number) => {
  if (!number) return '0';
  return number.toLocaleString('ko-KR');
};

  const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return '';

  const [year, month, day, hours = 0, minutes = 0, seconds = 0] = dateArray;

  if (dateArray.length === 5 && hours === 0 && minutes === 0) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};
  
const showPaymentDetail = async (payment) => {
  if (selectedPayment.value?.payment_code === payment.payment_code) {
    closePaymentDetail();
  } else {
    try {
      console.log('Requesting payment details for code:', payment.payment_code);
      const response = await axios.get(
        `https://learnsmate.shop/payments/${payment.payment_code}`
      );
      
      if (response.data) {
        selectedPayment.value = response.data;
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
      if (error.response?.status === 404) {
        alert('존재하지 않는 결제 내역입니다.');
      } else if (error.response?.status === 500) {
        alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        alert('결제 상세 정보를 가져오는데 실패했습니다.');
      }
    }
  }
};
  
  const closePaymentDetail = () => {
    selectedPayment.value = null;
  };
  
  const changePage = async (newPage) => {
    if (newPage < 1 || newPage > totalPages.value) return;
    currentPage.value = newPage;

    if (isFiltered.value && lastFilterData.value) {
        const response = await axios.post(
            `https://learnsmate.shop/payments/filter?page=${currentPage.value - 1}&size=${pageSize}`,
            camelToSnake(lastFilterData.value)
        );

        paymentList.value = response.data.content;
        totalElements.value = response.data.totalElements;
        totalPages.value = response.data.totalPages;
    } else {
        await fetchPaymentList();
    }
};

const openRevenueModal = () => {
  isRevenueModalOpen.value = true;
};

const closeRevenueModal = () => {
  isRevenueModalOpen.value = false;
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

const maskName = (name) => {
  if (!name || name.length < 2) return name;
  const firstChar = name[0];
  const lastChar = name[name.length - 1];
  return `${firstChar}**${lastChar}`;
};
  
  onMounted(async () => {
    fetchPaymentList();
    if (!loginState.isLoggedIn) {
    await loginState.fetchLoginState(); 
  }
  });
</script>