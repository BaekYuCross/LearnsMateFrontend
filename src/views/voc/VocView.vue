<template>
  <div class="voc-container">
    <VOCSideMenu />
    <div class="voc-content-container">
      <VOCFilter @search="handleSearch" @reset="handleReset" />
      <div class="voc-actions">
        <div class="voc-count">등록된 VOC <span class="voc-length">{{ vocList.length }}</span>개</div>
        <div class="voc-button-group">
          <button class="voc-register-button">
            <img src="@/assets/icons/voc_answer_register.svg" alt="VOC 답변 등록록">
            VOC 등록
          </button>
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
          <div class="voc-board-row" v-for="voc in paginatedVOCs" :key="voc.voc_code">
            <div class="voc-board-row-number">{{ voc.voc_code }}</div>
            <div class="voc-board-row-content">{{ voc.voc_content }}</div>
            <div class="voc-board-row-category">{{ voc.voc_category_name }}</div>
            <div class="voc-board-row-type">{{ voc.member_type }}</div>
            <div class="voc-board-row-name">{{ voc.member_name }}</div>
            <div class="voc-board-row-code">{{ voc.member_code }}</div>
            <div class="voc-board-row-manager">{{ voc.admin_name || '-' }}</div>
            <div class="voc-board-row-date">{{ formatDate(voc.created_at) }}</div>
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
          <button 
            class="voc-page-button voc-prev-button" 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
          >
            ◀이전
          </button>
          <span v-for="page in totalPages" :key="page" class="page-number">
            <button 
              class="voc-page-button" 
              :class="{ active: currentPage === page }" 
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </span>
          <button 
            class="voc-page-button voc-next-button"
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
          >
            다음▶
          </button>
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

const vocList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

const paginatedVOCs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return vocList.value.slice(start, end)
})

const fetchVOCList = async (filters = {}) => {
  try {
    const response = await axios.get('https://learnsmate.shop/voc/list', {
      params: {
        ...filters,
        page: currentPage.value,
        size: pageSize
      }
    })
    vocList.value = response.data
    totalCount.value = response.data.length
    totalPages.value = Math.ceil(totalCount.value / pageSize)
  } catch (error) {
    console.error('VOC 목록을 불러오는데 실패했습니다:', error)
  }
}

const handleSearch = (filters) => {
  currentPage.value = 1
  fetchVOCList(filters)
}

const handleReset = () => {
  currentPage.value = 1
  fetchVOCList()
}

const changePage = (page) => {
  currentPage.value = page
  fetchVOCList()
}

const formatDate = (dateString) => {
  if (!dateString) {
    return '-'
  }

  const isoDateString = dateString.replace(' ', 'T')
  const date = new Date(isoDateString)
  
  if (isNaN(date.getTime())) {
    console.error('유효하지 않은 날짜 포맷:', dateString)
    return '-'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

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
</script>