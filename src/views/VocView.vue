<template>
  <div class="voc-container">
    <VOCSideMenu />
    <div class="voc-content">
      <VOCFilter @search="handleSearch" @reset="handleReset" />
      
      <div class="voc-table-container">
        <div class="voc-table-header">
          <h2>전체 VOC {{ totalCount }}개</h2>
          <div class="voc-button-group">
            <button class="voc-excel-btn">
              <i class="fas fa-file-excel"></i>
              엑셀 다운로드
            </button>
          </div>
        </div>
        
        <div class="voc-table-wrapper">
          <table class="voc-table">
            <thead>
              <tr>
                <th>VOC 번호</th>
                <th>VOC 내용</th>
                <th>카테고리</th>
                <th>고객 유형</th>
                <th>고객명</th>
                <th>고객 코드</th>
                <th>담당자</th>
                <th>등록일</th>
                <th>답변 상태</th>
                <th>만족도</th>
                <th>분석</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="voc in vocList" :key="voc.voc_code">
                <td>{{ voc.voc_code }}</td>
                <td class="voc-content-cell">
                  <div class="voc-content-text">{{ voc.voc_content }}</div>
                </td>
                <td>{{ voc.voc_category_name }}</td>
                <td>{{ voc.member_type }}</td>
                <td>{{ voc.member_name }}</td>
                <td>{{ voc.member_code }}</td>
                <td>{{ voc.admin_name || '-' }}</td>
                <td>{{ formatDate(voc.created_at) }}</td>
                <td>
                  <span :class="getStatusClass(voc.voc_answer_status)">
                    {{ voc.voc_answer_status ? '답변완료' : '미답변' }}
                  </span>
                </td>
                <td>
                  <span :class="getSatisfactionClass(voc.voc_answer_satisfaction)">
                    {{ voc.voc_answer_satisfaction || '-' }}
                  </span>
                </td>
                <td class="voc-analysis-cell">
                  <div class="voc-analysis-text">{{ voc.voc_analysis || '-' }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="voc-pagination">
          <button 
            class="voc-page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            이전
          </button>
          <span class="voc-page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            class="voc-page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VOCSideMenu from '@/components/sideMenu/VOCSideMenu.vue'
import VOCFilter from '@/components/voc/VOCFilter.vue'
import axios from 'axios'
import '@/assets/css/voc/VOCView.css'

const vocList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 10

const fetchVOCList = async (filters = {}) => {
  try {
    const response = await axios.get('learnsmate.shop/voc/list', {
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
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
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