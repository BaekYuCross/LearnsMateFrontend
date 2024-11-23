<template>
  <div class="lecture-container">
    <LectureSideMenu />
    <div class="lecture-content-container" :class="{ 'single-view': isSingleView }">
      <LectureFilter @search="handleSearch" @reset="handleReset" />
      <div class="lecture-actions">
        <div class="lecture-count">등록된 강의 <span class="lecture-length">{{ totalCount }}</span>개</div>
        <div class="lecture-button-group">
          <button class="lecture-excel-button" @click="handleExcelDownload">
            <img src="@/assets/icons/download.svg" alt="다운로드">
            엑셀 다운로드
          </button>
          <button class="lecture-monthly-counts-button">
            <img src="@/assets/icons/ai.svg" alt="월별/연도별 강의 수 조회">
            월별/연도별 강의 수 보기
          </button>
        </div>
      </div>

      <div class="lecture-content-body">
        <div class="lecture-board-container">
          <div class="lecture-board-header">
            <div class="lecture-board-header-code">강의 코드</div>
            <div class="lecture-board-header-title">강의 제목</div>
            <div class="lecture-board-header-category">카테고리</div>
            <div class="lecture-board-header-level">난이도</div>
            <div class="lecture-board-header-tutor">강사명</div>
            <div class="lecture-board-header-tutorcode">강사 코드</div>
            <div class="lecture-board-header-date">등록일</div>
            <div class="lecture-board-header-price">가격</div>
            <div class="lecture-board-header-confirm">승인 상태</div>
            <div class="lecture-board-header-status">강의 상태</div>
          </div>

          <div class="lecture-board-body">
            <div 
              class="lecture-board-row" 
              v-for="lecture in displayedLectures" 
              :key="lecture.lecture_code" 
              @click="showLectureDetail(lecture)"
              :class="{ 'selected': selectedLecture?.lecture_code === lecture.lecture_code }"
            >
              <div class="lecture-board-row-code">{{ lecture.lecture_code.slice(0, 15) }}...</div>
              <div class="lecture-board-row-title">{{ lecture.lecture_title.slice(0, 20) }}...</div>
              <div class="lecture-board-row-category">{{ lecture.lecture_category_name.slice(0, 10) }}</div>
              <div class="lecture-board-row-level">{{ lecture.lecture_level }}</div>
              <div class="lecture-board-row-tutor">{{ lecture.tutor_name }}</div>
              <div class="lecture-board-row-tutorcode">{{ lecture.tutor_code }}</div>
              <div class="lecture-board-row-date">{{ formatDateFromArray(lecture.created_at).slice(0, 10) }}</div>
              <div class="lecture-board-row-price">{{ formatPrice(lecture.lecture_price) }}</div>
              <div class="lecture-board-row-confirm">
                <span :class="getConfirmStatusClass(lecture.lecture_confirm_status)">
                  {{ lecture.lecture_confirm_status ? '승인완료' : '미승인' }}
                </span>
              </div>
              <div class="lecture-board-row-status">
                <span :class="getLectureStatusClass(lecture.lecture_status)">
                  {{ lecture.lecture_status ? '운영중' : '종료' }}
                </span>
              </div>
            </div>
          </div>

          <div class="lecture-pagination">
            <button 
              class="lecture-page-button lecture-prev-button" 
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
              <span class="value">{{ selectedLecture.lecture_title }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">카테고리</span>
              <span class="value">{{ selectedLecture.lecture_category_name }}</span>
            </div>
            <div class="lecture-detail-item">
              <span class="label">난이도</span>
              <span class="value">{{ selectedLecture.lecture_level }}</span>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import LectureSideMenu from '@/components/sideMenu/LectureSideMenu.vue'
import LectureFilter from '@/components/lecture/LectureFilter.vue'
import axios from 'axios'
import { saveAs } from 'file-saver'
import '@/assets/css/lecture/LectureView.css'

const isSingleView = ref(false)
const selectedLecture = ref(null)
const lectureList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const displaySize = 15;
const pageSize = 50;
const cursors = ref({});
const displayedLectures = ref([]);
const isFiltered = ref(false)
const lastFilterData = ref(null)
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDIwMDUiLCJlbWFpbCI6ImNobzk3NTlAZ21haWwuY29tIiwibmFtZSI6IuyhsOygnO2biCIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzMyMjYxNDczLCJleHAiOjE3NzU0NjE0NzN9.YXyZssRjHVLhiSRkx4zqRXJAciK60GxbmdQQ66uutW2M_R9nlGqnq6ilE2PJRlhbOyCEhlVPAKNP4Xze4I20BA';

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

const snakeToCamel = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

const fetchLectureList = async (filters = {}) => {
  try {
    const response = await axios.get("http://localhost:5000/lecture/list", {
      headers: {
        Authorization: token,
      },
      params: {
        ...filters,
        page: currentPage.value - 1,
        size: pageSize
      }
    });
    
    if (!response.data?.data) {
      console.error('No data received from server');
      return;
    }

    lectureList.value = response.data.data;
    totalCount.value = response.data.totalElements || 0;
    totalPages.value = Math.ceil((response.data.totalElements || 0) / pageSize);
    displayedLectures.value = lectureList.value.slice(0, displaySize);

  } catch (error) {
    console.error('강의 목록을 불러오는데 실패했습니다:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
};

const handleScroll = () => {
  const container = document.querySelector('.lecture-board-body');
  if (!container) return;

  const { scrollTop, scrollHeight, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreLectures();
  }
};


const loadMoreLectures = () => {
  const currentDisplayed = displayedLectures.value.length;
  if (currentDisplayed < Math.min(lectureList.value.length, pageSize)) {
    displayedLectures.value = lectureList.value.slice(0, 
      Math.min(currentDisplayed + displaySize, pageSize)
    );
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
    const response = await axios.post(
      `http://localhost:5000/lecture/filter?page=${currentPage.value - 1}&size=${pageSize}`,
      camelToSnake(filterData),
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("API Response:", response.data);

    lectureList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;

  } catch (error) {
    console.error("Failed to filter lectures:", error);
  }
};

const handleReset = () => {
  fetchLectureList();
  currentPage.value = 1;
  selectedLecture.value = null;
  isFiltered.value = false;
  lastFilterData.value = null;
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    await handleSearch(lastFilterData.value);
  } else {
    const cursor = cursors.value[currentPage.value - 1];
    
    try {
      const response = await axios.get("http://localhost:5000/lecture/list", {
        headers: {
          Authorization: token,
        },
        params: {
          cursor: cursor,
          size: pageSize
        }
      });

      if (response.data?.data) {
        lectureList.value = response.data.data;
        displayedLectures.value = lectureList.value.slice(0, displaySize);

        if (response.data.data.length > 0) {
          const lastItem = response.data.data[response.data.data.length - 1];
          if (lastItem.created_at) {
            const cursorDate = Array.isArray(lastItem.created_at) 
              ? new Date(
                  lastItem.created_at[0],
                  lastItem.created_at[1] - 1,
                  lastItem.created_at[2],
                  lastItem.created_at[3] || 0,
                  lastItem.created_at[4] || 0,
                  lastItem.created_at[5] || 0
                ).toISOString()
              : lastItem.created_at;
            cursors.value[currentPage.value] = cursorDate;
          }
        }
      }
    } catch (error) {
      console.error('페이지 변경 중 오류 발생:', error);
    }
  }
};

const handleExcelDownload = async () => {
  try {
    const config = {
      method: 'POST',
      url: 'http://localhost:5000/lecture/excel/download',
      responseType: 'blob',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    };

    if (isFiltered.value && lastFilterData.value) {
      config.data = lastFilterData.value;
    }

    const response = await axios(config);
    
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    saveAs(blob, 'lecture_data.xlsx');
  } catch (error) {
    console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
  }
};

const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return '';

  const [year, month, day, hours = 0, minutes = 0, seconds = 0] = dateArray;

  if (dateArray.length === 5 && hours === 0 && minutes === 0) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
    closeLectureDetail();
  } else {
    try {
      const response = await axios.get(`http://localhost:5000/lecture/${lecture.lecture_code}`);
      selectedLecture.value = response.data;
      showSingleLecture();
    } catch (error) {
      console.error('Failed to fetch lecture details:', error);
    }
  }
};

const closeLectureDetail = () => {
  selectedLecture.value = null;
  hideSingleLecture();
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
  fetchLectureList();
  const container = document.querySelector('.lecture-board-body');
  if (container) {
    container.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  const container = document.querySelector('.lecture-board-body');
  if (container) {
    container.removeEventListener('scroll', handleScroll);
  }
});
</script>