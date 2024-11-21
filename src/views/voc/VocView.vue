<template>
  <div class="voc-container">
    <VOCSideMenu />
    <div class="voc-content-container">
      <VOCFilter @search="handleSearch" @reset="handleReset" />
      <div class="voc-actions">
        <div class="voc-count">등록된 VOC <span class="voc-length">{{ totalCount }}</span>개</div>
        <div class="voc-button-group">
          <button class="voc-excel-button">
            <img src="@/assets/icons/download.svg" alt="다운로드">
            엑셀 다운로드
          </button>
          <button class="voc-ai-button">
            <img src="@/assets/icons/ai.svg" alt="AI 요약 보고서">
            AI 요약 보고서
          </button>
        </div>
      </div>

      <div class="voc-board-container">
        <div class="voc-board-header">
          <div class="voc-board-header-number">VOC 번호</div>
          <div class="voc-board-header-content">VOC 내용</div>
          <div class="voc-board-header-category">카테고리</div>
          <div class="voc-board-header-type">고객 유형</div>
          <div class="voc-board-header-name">고객명</div>
          <div class="voc-board-header-code">고객 코드</div>
          <div class="voc-board-header-manager">담당자</div>
          <div class="voc-board-header-date">등록일</div>
          <div class="voc-board-header-status">답변 상태</div>
          <div class="voc-board-header-satisfaction">만족도</div>
        </div>

        <div class="voc-board-body">
          <div class="voc-board-row" v-for="voc in vocList" :key="voc.voc_code">
            <div class="voc-board-row-number">{{ voc.voc_code }}</div>
            <div class="voc-board-row-content">{{ voc.voc_content }}</div>
            <div class="voc-board-row-category">{{ voc.voc_category_name }}</div>
            <div class="voc-board-row-type">{{ voc.member_type }}</div>
            <div class="voc-board-row-name">{{ voc.member_name }}</div>
            <div class="voc-board-row-code">{{ voc.member_code }}</div>
            <div class="voc-board-row-manager">{{ voc.admin_name || '-' }}</div>
            <div class="voc-board-row-date">{{ formatDateFromArray(voc.created_at) }}</div>
            <div class="voc-board-row-status">
              <span :class="getStatusClass(voc.voc_answer_status)">
                {{ voc.voc_answer_status ? '답변완료' : '미답변' }}
              </span>
            </div>
            <div class="voc-board-row-satisfaction">
              <span :class="getSatisfactionClass(voc.voc_answer_satisfaction)">
              {{ voc.voc_answer_satisfaction || '-' }}
              </span>
            </div>
          </div>
        </div>

        <div class="voc-pagination">
          <button class="voc-page-button voc-prev-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">◀</button>
          <button class="voc-page-button" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
          <span v-if="startPage > 2">...</span>
          <template v-for="page in displayedPages" :key="page">
            <button v-if="page !== 1 && page !== totalPages"class="voc-page-button" :class="{ active: currentPage === page }" @click="changePage(page)">{{ page }}</button>
          </template>
          <span v-if="endPage < totalPages - 1">...</span>
          <button v-if="totalPages > 1"class="voc-page-button" :class="{ active: currentPage === totalPages }" @click="changePage(totalPages)">{{ totalPages }}</button>
          <button class="voc-page-button voc-next-button"@click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">▶</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VOCSideMenu from '@/components/sideMenu/VOCSideMenu.vue'
import VOCFilter from '@/components/voc/VOCFilter.vue'
import axios from 'axios'
import '@/assets/css/voc/VOCView.css'

const selectedVOC = ref(null)
const vocList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 15
const isFiltered = ref(false)
const lastFilterData = ref(null)
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDIwMDUiLCJlbWFpbCI6ImNobzk3NTlAZ21haWwuY29tIiwibmFtZSI6IuyhsOygnO2biCIsInJvbGVzIjpbXSwiaWF0IjoxNzMyMDcyMDEyLCJleHAiOjE3NzUyNzIwMTJ9.OI2PLhgf-sf90n-r9yR_deawJ2_iPjzPP4QHb2xcOBlWuhG88-3nszwPLOct-Q22Omvu7GCYt0abH8HYhQO8aw';

const fetchVOCList = async (filters = {}) => {
  try {
    const response = await axios.get('http://localhost:5000/voc/list', {
      headers: {
        Authorization: token,
      },
      params: {
        ...filters,
        page: currentPage.value - 1,
        size: pageSize
      }
    });
    
    vocList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('VOC 목록을 불러오는데 실패했습니다:', error);
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
    lastFilterData.value = filterData;

    const response = await axios.post(
      `http://localhost:5000/voc/filter?page=${currentPage.value - 1}&size=${pageSize}`,
      camelToSnake(filterData),
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    vocList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to filter voc:', error);
  }
};

const handleReset = () => {
  fetchVOCList();
  currentPage.value = 1;
  selectedVOC.value = null;
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    // 필터링된 상태일 때는 같은 필터 조건으로 해당 페이지 데이터 요청
    const response = await axios.post(
      `http://localhost:5000/voc/filter?page=${currentPage.value - 1}&size=${pageSize}`,
      camelToSnake(lastFilterData.value),
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    vocList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } else {
    await fetchVOCList();
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


const getStatusClass = (status) => {
  return {
    'voc-status': true,
    'voc-status-completed': status,
    'voc-status-pending': !status
  }
}

const getSatisfactionClass = (satisfaction) => {
  return {
    'voc-satisfaction': true,
    'voc-satisfaction-high': satisfaction === '만족',
    'voc-satisfaction-medium': satisfaction === '보통',
    'voc-satisfaction-low': satisfaction === '불만족'
  }
}

onMounted(() => {
  fetchVOCList()
})

const displayedPages = computed(() => {
  let start = Math.max(currentPage.value - 2, 2)
  let end = Math.min(start + 2, totalPages.value - 1)
  
  if (end === totalPages.value - 1) {
    start = Math.max(end - 2, 2)
  }
  
  let pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const startPage = computed(() => {
  return displayedPages.value[0]
})

const endPage = computed(() => {
  return displayedPages.value[displayedPages.value.length - 1]
})
</script>