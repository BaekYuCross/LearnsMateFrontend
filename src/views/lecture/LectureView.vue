<template>
  <div class="lecture-container">
    <LectureSideMenu />
    <div class="lecture-content-container" :class="{ 'single-view': isSingleView }">
      <LectureFilter @search="handleSearch" @reset="handleReset" />
      <div class="lecture-actions">
        <div class="lecture-count">등록된 강의 <span class="lecture-length">{{ formatNumber(totalCount) }}</span>개</div>
        <div class="lecture-button-group">
          <div class="lecture-column-selector">
            <button @click="toggleDropdown" class="lecture-dropdown-button">
              필요 컬럼 선택 ▼
            </button>
            <div v-show="isDropdownOpen" class="lecture-dropdown-menu">
              <div v-for="(label, key) in columns" :key="key" class="lecture-dropdown-item">
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
          <button class="lecture-excel-button" @click="handleExcelDownload">
            <img src="@/assets/icons/download.svg" alt="다운로드">
            엑셀 다운로드
          </button>
          <button class="lecture-monthly-counts-button" @click="openMonthlyModal">
            <img src="@/assets/icons/ai.svg" alt="월별/연도별 강의 수 조회">
            월별 데이터
          </button>
        </div>
      </div>

      <div class="lecture-content-body">
        <div class="lecture-board-container">
          <div class="lecture-board-header">
            <div 
              v-if="selectedColumns.includes('lectureCode')" 
              class="lecture-board-header-code"
              @click="sortLectureList('lecture_code')"
              :class="{
                'sort-asc': sortState.column === 'lecture_code' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_code' && sortState.order === 2,
              }"
            >
              강의 코드
            </div>
            <div 
              v-if="selectedColumns.includes('lectureTitle')" 
              class="lecture-board-header-title"
              @click="sortLectureList('lecture_title')"
              :class="{
                'sort-asc': sortState.column === 'lecture_title' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_title' && sortState.order === 2,
              }"
            >
              강의 제목
            </div>
            <div 
              v-if="selectedColumns.includes('lectureCategoryName')" 
              class="lecture-board-header-category"
              @click="sortLectureList('lecture_category_name')"
              :class="{
                'sort-asc': sortState.column === 'lecture_category_name' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_category_name' && sortState.order === 2,
              }"
            >
              카테고리
            </div>
            <div 
              v-if="selectedColumns.includes('lectureLevel')" 
              class="lecture-board-header-level"
              @click="sortLectureList('lecture_level')"
              :class="{
                'sort-asc': sortState.column === 'lecture_level' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_level' && sortState.order === 2,
              }"
            >
              난이도
            </div>
            <div 
              v-if="selectedColumns.includes('tutorName')" 
              class="lecture-board-header-tutor"
              @click="sortLectureList('tutor_name')"
              :class="{
                'sort-asc': sortState.column === 'tutor_name' && sortState.order === 1,
                'sort-desc': sortState.column === 'tutor_name' && sortState.order === 2,
              }"
            >
              강사명
            </div>
            <div 
              v-if="selectedColumns.includes('tutorCode')" 
              class="lecture-board-header-tutorcode"
              @click="sortLectureList('tutor_code')"
              :class="{
                'sort-asc': sortState.column === 'tutor_code' && sortState.order === 1,
                'sort-desc': sortState.column === 'tutor_code' && sortState.order === 2,
              }"
            >
              강사 코드
            </div>
            <div 
              v-if="selectedColumns.includes('createdAt')" 
              class="lecture-board-header-date"
              @click="sortLectureList('created_at')"
              :class="{
                'sort-asc': sortState.column === 'created_at' && sortState.order === 1,
                'sort-desc': sortState.column === 'created_at' && sortState.order === 2,
              }"
            >
              등록일
            </div>
            <div 
              v-if="selectedColumns.includes('price')" 
              class="lecture-board-header-price"
              @click="sortLectureList('lecture_price')"
              :class="{
                'sort-asc': sortState.column === 'lecture_price' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_price' && sortState.order === 2,
              }"
            >
              가격
            </div>
            <div 
              v-if="selectedColumns.includes('lectureConfirmStatus')" 
              class="lecture-board-header-confirm"
              @click="sortLectureList('lecture_confirm_status')"
              :class="{
                'sort-asc': sortState.column === 'lecture_confirm_status' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_confirm_status' && sortState.order === 2,
              }"
            >
              승인 상태
            </div>
            <div 
              v-if="selectedColumns.includes('lectureStatus')" 
              class="lecture-board-header-status"
              @click="sortLectureList('lecture_status')"
              :class="{
                'sort-asc': sortState.column === 'lecture_status' && sortState.order === 1,
                'sort-desc': sortState.column === 'lecture_status' && sortState.order === 2,
              }"
            >
              강의 상태
            </div>
          </div>

          <div class="lecture-board-body">
            <div 
              class="lecture-board-row" 
              v-for="lecture in lectureList" 
              :key="lecture.lecture_code" 
              @click="showLectureDetail(lecture)"
              :class="{ 'selected': selectedLecture?.lecture_code === lecture.lecture_code }"
            >
              <div v-if="selectedColumns.includes('lectureCode')" class="lecture-board-row-code">
                {{ lecture.lecture_code.slice(0, 15) }}...
              </div>
              <div v-if="selectedColumns.includes('lectureTitle')" class="lecture-board-row-title">
                {{ lecture.lecture_title.slice(0, 20) }}...
              </div>
              <div v-if="selectedColumns.includes('lectureCategoryName')" class="lecture-board-row-category">
                {{ getMappedCategory(lecture.lecture_category_name) }}
              </div>
              <div v-if="selectedColumns.includes('lectureLevel')" class="lecture-board-row-level">
                {{ getMappedLevel(lecture.lecture_level) }}
              </div>
              <div v-if="selectedColumns.includes('tutorName')" class="lecture-board-row-tutor">
                {{ maskTutorName(lecture.tutor_name) }}
              </div>
              <div v-if="selectedColumns.includes('tutorCode')" class="lecture-board-row-tutorcode">
                {{ lecture.tutor_code }}
              </div>
              <div v-if="selectedColumns.includes('createdAt')" class="lecture-board-row-date">
                {{ formatDateFromString(lecture.created_at).slice(0, 10) }}
              </div>
              <div v-if="selectedColumns.includes('price')" class="lecture-board-row-price">
                {{ formatPrice(lecture.lecture_price) }}
              </div>
              <div v-if="selectedColumns.includes('lectureConfirmStatus')" class="lecture-board-row-confirm">
                <span :class="getConfirmStatusClass(lecture.lecture_confirm_status)">
                  {{ lecture.lecture_confirm_status ? '승인완료' : '미승인' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('lectureStatus')" class="lecture-board-row-status">
                <span :class="getLectureStatusClass(lecture.lecture_status)">
                  {{ lecture.lecture_status ? '운영중' : '종료' }}
                </span>
              </div>
            </div>
          </div>

          <div class="lecture-pagination">
            <button class="lecture-page-button lecture-prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >◀</button>
            <button 
              class="lecture-page-button" 
              :class="{ active: currentPage === 1 }" 
              @click="changePage(1)"
            >1</button>
            <span v-if="startPage > 2">...</span>
            <template v-for="page in displayedPages" :key="page">
              <button 
                v-if="page !== 1 && page !== totalPages"
                class="lecture-page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >{{ page }}</button>
            </template>
            <span v-if="endPage < totalPages - 1">...</span>
            <button 
              v-if="totalPages > 1"
              class="lecture-page-button" 
              :class="{ active: currentPage === totalPages }" 
              @click="changePage(totalPages)"
            >{{ totalPages }}</button>
            <button 
              class="lecture-page-button lecture-next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >▶</button>
          </div>
        </div>

        <div v-if="selectedLecture" class="lecture-detail-container" :class="{ active: isSingleView }">
          <div class="lecture-detail-header">
            <h3 class="lecture-detail-title">강의 상세 정보</h3>
            <button class="close-button" @click="closeLectureDetail">×</button>
          </div>
          <div class="lecture-detail-content">
            <div class="lecture-detail-item">
              <span class="label">강의 코드</span>
              <span class="value">{{ selectedLecture.lecture_code }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">강의 제목</span>
              <span class="value" style="width: 200px; text-align: right;" :title="selectedLecture.lecture_title">{{ selectedLecture.lecture_title }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">카테고리</span>
              <span class="value">{{ getMappedCategory(selectedLecture.lecture_category_name) }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">난이도</span>
              <span class="value">{{ getMappedLevel(selectedLecture.lecture_level) }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">강사명</span>
              <span class="value">{{ selectedLecture.tutor_name }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">강사 코드</span>
              <span class="value">{{ selectedLecture.tutor_code }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">등록일</span>
              <span class="value">{{ formatDateFromArray(selectedLecture.created_at) }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">가격</span>
              <span class="value">{{ formatPrice(selectedLecture.lecture_price) }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">승인 상태</span>
              <span class="value" :class="getConfirmStatusClass(selectedLecture.lecture_confirm_status)">
                {{ selectedLecture.lecture_confirm_status ? '승인완료' : '미승인' }}
              </span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">강의 상태</span>
              <span class="value" :class="getLectureStatusClass(selectedLecture.lecture_status)">
                {{ selectedLecture.lecture_status ? '운영중' : '종료' }}
              </span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">총 학생 수</span>
              <span class="value">{{ selectedLecture.purchase_count }}</span>
            </div>
            <div class="lecture-toggle-header">
            <span>
            강의 비디오 목록
            <button class="lecture-toggle-button" @click="toggleCourseSection">
            {{ isCourseSectionVisible ? '&#9650;' : '&#9660;' }}
             </button> </span>
            </div>
             <div v-if="selectedLecture.lecture_videos && selectedLecture.lecture_videos.length > 0" class="lecture-detail-item">
              <div v-if="isCourseSectionVisible" class="lecture-recommended-list">
                <div v-for="(video, index) in selectedLecture.lecture_videos" :key="index" class="lecture-recommended-item">
                  {{ video.videoTitle || '비디오 제목 없음' }}
                </div>
              </div>
            </div>
            <div class="lecture-stats-section">
              <div class="lecture-stats-header">
                <div class="lecture-stats-actions">
                  <h3 class="lecture-stats-title">구매 전환율 필터링 </h3>
                    <button @click="fetchLectureStats" class="lecture-stats-search">
                      <img src="@/assets/icons/search_white.svg" alt="조회">조회
                    </button>
                    <button @click="resetStatsFilter" class="lecture-stats-reset">
                      <img src="@/assets/icons/reset.svg" alt="초기화">
                    </button>
                  </div>
                <div class="lecture-stats-filter">
                  <div class="lecture-stats-period">
                    <div class="lecture-stats-dates">
                      <span class="lecture-stats-label">조회 기간</span>
                      <div class="lecture-stats-date-group">
                        <select v-model="statsFilter.startYear" class="lecture-stats-select">
                          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
                        </select>
                        <select v-model="statsFilter.startMonth" class="lecture-stats-select">
                          <option v-for="month in months" :key="month" :value="month">
                            {{ String(month).padStart(2, '0') }}월
                          </option>
                        </select>
                      </div>
                      <span class="lecture-stats-separator">~</span>
                      <div class="lecture-stats-date-group">
                        <select v-model="statsFilter.endYear" class="lecture-stats-select">
                          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
                        </select>
                        <select v-model="statsFilter.endMonth" class="lecture-stats-select">
                          <option v-for="month in months" :key="month" :value="month">
                            {{ String(month).padStart(2, '0') }}월
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                 
                </div>
              </div>

              <div class="lecture-stats-charts">
                <div class="lecture-stats-chart">
                  <h4 class="lecture-stats-chart-title">전체 강의 전환율</h4>
                  <div class="lecture-stats-chart-wrapper">
                    <canvas ref="overallStatsChart"></canvas>
                  </div>
                </div>
                <div class="lecture-stats-chart">
                  <h4 class="lecture-stats-chart-title">카테고리별 전환율</h4>
                  <div class="lecture-stats-chart-wrapper">
                    <canvas ref="categoryStatsChart"></canvas>
                  </div>
                </div>
                <div class="lecture-stats-chart">
                  <h4 class="lecture-stats-chart-title">현재 강의 전환율</h4>
                  <div class="lecture-stats-chart-wrapper">
                    <canvas ref="lectureStatsChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MonthlyLectureModal 
    :isOpen="isMonthlyModalOpen"
    @close="closeMonthlyModal"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LectureSideMenu from '@/components/sideMenu/LectureSideMenu.vue'
import LectureFilter from '@/components/lecture/LectureFilter.vue'
import MonthlyLectureModal from '@/components/lecture/MonthlyLectureModal.vue';
import axios from 'axios'
import { saveAs } from 'file-saver'
import '@/assets/css/lecture/LectureView.css'
import Chart from 'chart.js/auto'
import { useLoginState } from '@/stores/loginState';

const loginState = useLoginState(); 
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
const isMonthlyModalOpen = ref(false);
const isSingleView = ref(false)
const selectedLecture = ref(null)
const lectureList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 50
const isFiltered = ref(false)
const lastFilterData = ref(null)
const overallStatsChart = ref(null);
const categoryStatsChart = ref(null);
const lectureStatsChart = ref(null)
let overallChart = null;
let categoryChart = null;
let lectureChart = null;
const currentYear = new Date().getFullYear()
const years = ref(Array.from({length: 5}, (_, i) => currentYear - 4 + i))
const months = ref(Array.from({length: 12}, (_, i) => i + 1))
const isDropdownOpen = ref(false);
const columns = ref({
  lectureCode: "강의 코드",
  lectureTitle: "강의명",
  lectureCategoryName: "카테고리",
  lectureLevel: "난이도",
  tutorName: "강사명",
  tutorCode: "강사 코드",
  price: "가격",
  createdAt: "등록일",
  lectureConfirmStatus: "승인 상태",
  lectureStatus: "강의 상태",
});

const levelMapping = {
  BEGINNER: '입문',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

const categoryMapping = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DEVOPS: '데브옵스',
  DATABASE: '데이터베이스',
  WEB_DEVELOPMENT: '웹 개발',
  MOBILE_APP_DEVELOPMENT: '모바일 앱 개발',
  FULL_STACK: '풀스택',
};

const sortState = ref({
  column: null,
  order: 0,
});

const levelOrder = {
  '입문': 1,
  '중급': 2,
  '고급': 3,
};

const sortLectureList = (columnKey) => {
  if (sortState.value.column === columnKey) {
    sortState.value.order = (sortState.value.order + 1) % 3;
  } else {
    sortState.value.column = columnKey;
    sortState.value.order = 1;
  }

  if (sortState.value.order === 0) {
    fetchLectureList();
  } else {
    lectureList.value.sort((a, b) => {
      const valueA = columnKey === 'lecture_level' ? levelOrder[getMappedLevel(a[columnKey])] : a[columnKey];
      const valueB = columnKey === 'lecture_level' ? levelOrder[getMappedLevel(b[columnKey])] : b[columnKey];

      if (sortState.value.order === 1) {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  }
};

const maskTutorName = (name) => {
  if (!name || name.length < 2) return name;
  const firstChar = name[0];
  const lastChar = name[name.length - 1];
  return `${firstChar}**${lastChar}`;
};

const selectedColumns = ref(Object.keys(columns.value));

const getMappedLevel = (level) => {
  return levelMapping[level] || '알 수 없음';
};

const getMappedCategory = (category) => {
  return categoryMapping[category] || '알 수 없음';
};

const isCourseSectionVisible = ref(false);

const toggleCourseSection = () => {
  isCourseSectionVisible.value = !isCourseSectionVisible.value;
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

const statsFilter = ref({
  startYear: new Date().getFullYear() - 1,
  startMonth: 1,
  endYear: new Date().getFullYear(),
  endMonth: 12
})

const fetchLectureList = async (filters = {}) => {
  try {
    const response = await axios.get('http://localhost:5000/lecture/list', {
      params: {
        ...filters,
        page: currentPage.value - 1,
        size: pageSize
      }
    });
    
    lectureList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

  } catch (error) {
    console.error('lecture-list get fail:', error);
  }
};

const showSingleLecture = () => {
  isSingleView.value = true;
};

const hideSingleLecture = () => {
  isSingleView.value = false;
};

const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    const response = await axios.post(
      `http://localhost:5000/lecture/filter?page=${currentPage.value - 1}&size=${pageSize}`, camelToSnake(filterData));

    lectureList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

  } catch (error) {
    console.error("Failed to filter lectures:", error);
  }
};

const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedLecture.value = null;
  fetchLectureList();
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;

  if (isFiltered.value && lastFilterData.value) {
    const response = await axios.post(`http://localhost:5000/lecture/filter?page=${currentPage.value - 1}&size=${pageSize}`,camelToSnake(lastFilterData.value));

    lectureList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

  } else {
    await fetchLectureList();
  }
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateSelectedColumns = () => {
  console.log("current selected column :", selectedColumns.value);
};

const handleExcelDownload = async () => {
  try {
    const config = {
      method: 'POST',
      url: 'http://localhost:5000/lecture/excel/download',
      responseType: 'blob',
      data: {
        selectedColumns: camelToSnake(selectedColumns.value),
        ...(isFiltered.value && lastFilterData.value ? lastFilterData.value : {}),
      },
    };

    const response = await axios(config);

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'lecture_data.xlsx');
  } catch (error) {
    console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
  }
};

const formatDateFromString = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date)) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return '';

  const [year, month, day] = dateArray;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const formatNumber = (number) => {
  if (!number) return '0';
  return number.toLocaleString('ko-KR');
};

const formatPrice = (price) => {
  return price?.toLocaleString('ko-KR') + '원' || '0원';
};

const getConfirmStatusClass = (status) => {
  return {
    'lecture-status': true,
    'lecture-status-completed': status,
    'lecture-status-pending': !status
  }
};

const getLectureStatusClass = (status) => {
  return {
    'lecture-status': true,
    'lecture-status-active': status,
    'lecture-status-inactive': !status
  }
};

const showLectureDetail = async (lecture) => {
  if (selectedLecture.value?.lecture_code === lecture.lecture_code) {
    closeLectureDetail()
  } else {
    try {
      const response = await axios.get(`http://localhost:5000/lecture/${lecture.lecture_code}`)
      selectedLecture.value = response.data
      console.log(response.data);
      showSingleLecture()
      fetchLectureStats()
    } catch (error) {
      console.error('Failed to fetch lecture details:', error)
    }
  }
}

const closeLectureDetail = () => {
  selectedLecture.value = null;
  hideSingleLecture();
};

const createStatsCharts = (data) => {
  const safeData = {
    totalClicks: data.total_lecture_click_count || 0,
    totalPurchases: data.total_student_count || 0,
    totalConversionRate: data.total_conversion_rate || 0,

    categoryClicks: data.category_click_count || 0,
    categoryPurchases: data.category_purchase_count || 0,
    categoryConversionRate: data.category_conversion_rate || 0,

    lectureClicks: data.lecture_click_count || 0,
    lecturePurchases: data.student_count || 0,
    lectureConversionRate: data.conversion_rate || 0,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        font: {
          size: 11
        },
        padding: {
          bottom: 10
        },
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  if (overallChart) overallChart.destroy();
  const overallCtx = overallStatsChart.value.getContext("2d");
  overallChart = new Chart(overallCtx, {
    type: "bar",
    data: {
      labels: ["클릭 수", "구매 수"],
      datasets: [
        {
          label: "전체 강의",
          data: [safeData.totalClicks, safeData.totalPurchases],
          backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)"],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: { ...chartOptions.plugins.title, text: `전체 전환율: ${safeData.totalConversionRate.toFixed(2)}%` },
      },
    },
  });

  if (categoryChart) categoryChart.destroy();
  const categoryCtx = categoryStatsChart.value.getContext("2d");
  categoryChart = new Chart(categoryCtx, {
    type: "bar",
    data: {
      labels: ["클릭 수", "구매 수"],
      datasets: [
        {
          label: "카테고리",
          data: [safeData.categoryClicks, safeData.categoryPurchases],
          backgroundColor: ["rgba(255, 159, 64, 0.2)", "rgba(153, 102, 255, 0.2)"],
          borderColor: ["rgba(255, 159, 64, 1)", "rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: { ...chartOptions.plugins.title, text: `카테고리 전환율: ${safeData.categoryConversionRate.toFixed(2)}%` },
      },
    },
  });

  if (lectureChart) lectureChart.destroy();
  const lectureCtx = lectureStatsChart.value.getContext("2d");
  lectureChart = new Chart(lectureCtx, {
    type: "bar",
    data: {
      labels: ["클릭 수", "구매 수"],
      datasets: [
        {
          label: "현재 강의",
          data: [safeData.lectureClicks, safeData.lecturePurchases],
          backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        title: { ...chartOptions.plugins.title, text: `강의 전환율: ${safeData.lectureConversionRate.toFixed(2)}%` },
      },
    },
  });
};

const fetchLectureStats = async () => {
  try {
    const response = await axios.post(
      `http://localhost:5000/lecture/${selectedLecture.value.lecture_code}/stats/filter`,
      camelToSnake(statsFilter.value)
    );

    if (response.data) {
      createStatsCharts(response.data);
    } else {
      console.error('No data received from stats API');
    }
  } catch (error) {
    console.error('Failed to fetch lecture stats:', error);
  }
};

const resetStatsFilter = () => {
  statsFilter.value = {
    startYear: currentYear - 1,
    startMonth: 1,
    endYear: currentYear,
    endMonth: 12
  }
  fetchLectureStats()
}

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

const openMonthlyModal = () => {
  isMonthlyModalOpen.value = true;
};

const closeMonthlyModal = () => {
  isMonthlyModalOpen.value = false;
};

onMounted(async () => {
  fetchLectureList();
  if (!loginState.isLoggedIn) {
    await loginState.fetchLoginState(); 
  }
});
</script>