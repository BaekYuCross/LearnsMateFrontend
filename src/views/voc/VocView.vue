<template>
  <div class="voc-container">
    <VOCSideMenu />
    <div class="voc-content-container" :class="{ 'single-view': isSingleView }">
      <VOCFilter @search="handleSearch" @reset="handleReset" />
      <div class="voc-actions">
        <div class="voc-count">등록된 VOC <span class="voc-length">{{ formatNumber(totalCount) }}</span>개</div>
        <div class="voc-button-group">
          <button class="voc-excel-button" @click="handleExcelDownload">
            <img src="@/assets/icons/download.svg" alt="다운로드">
            엑셀 다운로드
          </button>
          <button class="voc-ai-button" @click="openAiModal">
            <img src="@/assets/icons/ai.svg" alt="AI 요약 보고서">
            AI 요약 보고서
          </button>
        </div>
      </div>

      <div class="voc-content-body">
        <div class="voc-board-container">
          <div class="voc-board-header">
            <div 
              class="voc-board-header-number"
              @click="sortVOCList('voc_code')"
              :class="{
                'sort-asc': sortState.column === 'voc_code' && sortState.order === 1,
                'sort-desc': sortState.column === 'voc_code' && sortState.order === 2
              }"
            >
              VOC 번호
            </div>
            <div 
              class="voc-board-header-content"
              @click="sortVOCList('voc_content')"
              :class="{
                'sort-asc': sortState.column === 'voc_content' && sortState.order === 1,
                'sort-desc': sortState.column === 'voc_content' && sortState.order === 2
              }"
            >
              VOC 내용
            </div>
            <div 
              class="voc-board-header-category"
              @click="sortVOCList('voc_category_name')"
              :class="{
                'sort-asc': sortState.column === 'voc_category_name' && sortState.order === 1,
                'sort-desc': sortState.column === 'voc_category_name' && sortState.order === 2
              }"
            >
              카테고리
            </div>
            <div 
              class="voc-board-header-type"
              @click="sortVOCList('member_type')"
              :class="{
                'sort-asc': sortState.column === 'member_type' && sortState.order === 1,
                'sort-desc': sortState.column === 'member_type' && sortState.order === 2
              }"
            >
              고객 유형
            </div>
            <div 
              class="voc-board-header-name"
              @click="sortVOCList('member_name')"
              :class="{
                'sort-asc': sortState.column === 'member_name' && sortState.order === 1,
                'sort-desc': sortState.column === 'member_name' && sortState.order === 2
              }"
            >
              고객명
            </div>
            <div 
              class="voc-board-header-code"
              @click="sortVOCList('member_code')"
              :class="{
                'sort-asc': sortState.column === 'member_code' && sortState.order === 1,
                'sort-desc': sortState.column === 'member_code' && sortState.order === 2
              }"
            >
              고객 코드
            </div>
            <div 
              class="voc-board-header-manager"
              @click="sortVOCList('admin_name')"
              :class="{
                'sort-asc': sortState.column === 'admin_name' && sortState.order === 1,
                'sort-desc': sortState.column === 'admin_name' && sortState.order === 2
              }"
            >
              담당자
            </div>
            <div 
              class="voc-board-header-date"
              @click="sortVOCList('created_at')"
              :class="{
                'sort-asc': sortState.column === 'created_at' && sortState.order === 1,
                'sort-desc': sortState.column === 'created_at' && sortState.order === 2
              }"
            >
              등록일
            </div>
            <div 
              class="voc-board-header-status"
              @click="sortVOCList('voc_answer_status')"
              :class="{
                'sort-asc': sortState.column === 'voc_answer_status' && sortState.order === 1,
                'sort-desc': sortState.column === 'voc_answer_status' && sortState.order === 2
              }"
            >
              답변 상태
            </div>
            <div 
              class="voc-board-header-satisfaction"
              @click="sortVOCList('voc_answer_satisfaction')"
              :class="{
                'sort-asc': sortState.column === 'voc_answer_satisfaction' && sortState.order === 1,
                'sort-desc': sortState.column === 'voc_answer_satisfaction' && sortState.order === 2
              }"
            >
              만족도
            </div>
          </div>

          <div class="voc-board-body">
            <div class="voc-board-row" v-for="voc in vocList" :key="voc.voc_code" @click="showVOCDetail(voc)" :class="{ 'selected': selectedVOC?.voc_code === voc.voc_code }">
              <div class="voc-board-row-number">{{ voc.voc_code.slice(0, 10) }}...</div>
              <div class="voc-board-row-content">{{ voc.voc_content }}</div>
              <div class="voc-board-row-category">{{ voc.voc_category_name }}</div>
              <div class="voc-board-row-type">{{ translateMemberType(voc.member_type) }}</div>
              <div class="voc-board-row-name">{{ maskName(voc.member_name) }}</div>
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
        <div v-if="selectedVOC" class="voc-detail-container" :class="{ active: isSingleView }">
          <div class="voc-detail-header">
            <h3 class="voc-detail-title">VOC 상세 정보</h3>
            <button class="close-button" @click="closeVOCDetail">×</button>
          </div>
          <div class="voc-detail-content">
            <div class="voc-detail-item">
              <span class="label">VOC 번호</span>
              <span class="value">{{ selectedVOC.voc_code }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">VOC 내용</span>
              <span class="value" style="width: 200px;">{{ selectedVOC.voc_content }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">카테고리</span>
              <span class="value">{{ selectedVOC.voc_category_name }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">고객 유형</span>
              <span class="value">{{ translateMemberType(selectedVOC.member_type) }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">고객명</span>
              <span class="value">{{ selectedVOC.member_name }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">고객 코드</span>
              <span class="value">{{ selectedVOC.member_code }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">담당자</span>
              <span class="value">{{ selectedVOC.admin_name || '-' }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">등록일</span>
              <span class="value">{{ formatDateFromArray(selectedVOC.created_at) }}</span>
            </div>
            <div class="voc-detail-item">
              <span class="label">답변 상태</span>
              <span class="value_voc_answer_status" :class="getStatusClass(selectedVOC.voc_answer_status)">
                {{ selectedVOC.voc_answer_status ? '답변완료' : '미답변' }}
              </span>
            </div>
            <div class="voc-detail-item">
              <span class="label">만족도</span>
              <span class="value_satisfaction" :class="getSatisfactionClass(selectedVOC.voc_answer_satisfaction)">
                {{ selectedVOC.voc_answer_satisfaction || '-' }}
              </span>
            </div>
            <div class="voc-detail-item">
              <span class="label">VOC 답변</span>
              <span v-if="!isEditingAnswer" class="value" style="width: 200px;">{{ selectedVOC.voc_answer_content || '답변이 등록되지 않았습니다.' }}</span>
              <textarea
                v-else
                v-model="editAnswerContent"
                class="voc-answer-input"
                placeholder="답변을 입력하세요."
              ></textarea>
            </div>
            <div class="voc-detail-actions">
              <button
                v-if="!isEditingAnswer && !selectedVOC.voc_answer_code"
                class="voc-answer-register-button"
                @click="startRegisteringAnswer"
              >
                VOC 답변 등록
              </button>
              <button
                v-if="!isEditingAnswer && selectedVOC.voc_answer_code"
                class="voc-answer-edit-button"
                @click="startEditingAnswer"
              >
                VOC 답변 수정
              </button>
              <button
                v-if="isEditingAnswer"
                class="voc-answer-complete-button"
                @click="cancelEditing"
              >
                취소
              </button>
              <button
                v-if="isEditingAnswer"
                class="voc-answer-complete-button"
                @click="confirmAction"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <voc-ai-modal
      v-if="isAiModalOpen"
      :summary-data="aiData"
      @close="closeAiModal"
    />

    <VOCRegisterModule
      :isModalOpen="isRegisterModalOpen"
      :modalTitle="'VOC 답변 등록'"
      :confirmMessage="`'${editAnswerContent}' 을 등록하시겠습니까?`"
      @confirm="submitRegisterAnswer"
      @cancel="closeRegisterModal"
    />

    <VOCEditModule
        :isModalOpen="isEditModalOpen"
        :modalTitle="'VOC 답변 수정'"
        :confirmMessage="`'${editAnswerContent}' 으로 수정하시겠습니까?`"
        @confirm="submitEditAnswer"
        @cancel="closeEditModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VOCSideMenu from '@/components/sideMenu/VOCSideMenu.vue'
import VOCFilter from '@/components/voc/VOCFilter.vue'
import axios from 'axios'
import { saveAs } from 'file-saver'
import '@/assets/css/voc/VOCView.css'
import VocAiModal from "@/components/voc/VocAiModal.vue";
import VOCRegisterModule from '@/components/voc/VOCRegisterModule.vue';
import VOCEditModule from '@/components/voc/VOCEditModule.vue'
import { useLoginState } from '@/stores/loginState';

const loginState = useLoginState(); 
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
const isRegisterModalOpen = ref(false);
const isEditingAnswer = ref(false);
const editAnswerContent = ref('');
const isEditModalOpen = ref(false);
const isSingleView = ref(false);
const selectedVOC = ref(null)
const vocList = ref([])
const totalCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 50
const isFiltered = ref(false)
const lastFilterData = ref(null)
const isAiModalOpen = ref(false);
const aiData = ref([]);
const isLoading = ref(false);

const fetchVOCList = async (filters = {}) => {
  try {
    const response = await axios.get('https://learnsmate.shop/voc/list',
      {
        params: {
          ...filters,
          page: currentPage.value - 1,
          size: pageSize,
        }
      }
    );
    
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

const showSingleVoc = () => {
  isSingleView.value = true;
  console.log('showSingleVoc called: isSingleView =', isSingleView.value);
};


const formatNumber = (number) => {
  if (!number) return '0';
  return number.toLocaleString('ko-KR');
};

const hideSingleVoc = () => {
  isSingleView.value = false;
  console.log('hideSingleVoc called: isSingleView =', isSingleView.value);
};

const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    currentPage.value = 1;

    const convertToISODate = (date) => {
      if (!date) return null;
      const parsedDate = new Date(date);
      return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0).toISOString();
    };

    const processedData = {
      ...filterData,
      startCreateDate: convertToISODate(filterData.startCreateDate),
      endCreateDate: convertToISODate(filterData.endCreateDate),
      vocCategoryCode: filterData.vocCategoryCode ? parseInt(filterData.vocCategoryCode) : null,
      vocAnswerStatus: filterData.vocAnswerStatus === "true" ? true :
                      filterData.vocAnswerStatus === "false" ? false : null,
    };

    lastFilterData.value = processedData;

    const response = await axios.post(
      `https://learnsmate.shop/voc/filter?page=0&size=${pageSize}`,
      camelToSnake(processedData)
    );

    vocList.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('필터링 중 오류 발생:', error);
  }
};

const handleReset = async () => {
  try {
    isFiltered.value = false;
    lastFilterData.value = null;
    currentPage.value = 1;

    await fetchVOCList();
    selectedVOC.value = null;
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
        `https://learnsmate.shop/voc/filter?page=${currentPage.value - 1}&size=${pageSize}`,
        camelToSnake(lastFilterData.value)
      );

      vocList.value = response.data.content;
      totalCount.value = response.data.totalElements;
      totalPages.value = response.data.totalPages;
    } else {
      await fetchVOCList();
    }
  } catch (error) {
    console.error('페이지 변경 중 오류 발생:', error);
  }
};

const handleExcelDownload = async () => {
  try {
    const response = await axios.post(
      'https://learnsmate.shop/voc/excel/download',
      isFiltered.value && lastFilterData.value ? camelToSnake(lastFilterData.value) : {},
      {
        responseType: 'blob',
      }
    );

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'voc_data.xlsx');
  } catch (error) {
    console.error('엑셀 다운로드 중 오류 발생:', error);
  }
};

const translateMemberType = (type) => {
  if (type === 'STUDENT') {
    return '학생';
  } else if (type === 'TUTOR') {
    return '강사';
  } else {
    return type; // 예외 처리
  }
};

const cancelEditing = () => {
  isEditingAnswer.value = false;  
  editAnswerContent.value = selectedVOC.value.voc_answer_content; 
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

const showVOCDetail = async (voc) => {
  if (selectedVOC.value?.voc_code === voc.voc_code) {
    closeVOCDetail();
    return;
  }
  if (isEditingAnswer.value) {
    cancelEditing();
  }
    try {
      const response = await axios.get(`https://learnsmate.shop/voc/${voc.voc_code}`);
      selectedVOC.value = response.data;
      showSingleVoc();
      console.log('Selected VOC:', selectedVOC.value);
    } catch (error) {
      console.error('Failed to fetch VOC details:', error);
  }
};


const closeVOCDetail = () => {
  selectedVOC.value = null;
  hideSingleVoc();
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

const closeRegisterModal = () => {
  isRegisterModalOpen.value = false;
};


const startEditingAnswer = () => {
    isEditingAnswer.value = true;
    editAnswerContent.value = selectedVOC.value?.voc_answer_content || '';
};

const startRegisteringAnswer = () => {
  isEditingAnswer.value = true;
  editAnswerContent.value = '';
};


const confirmAction = () => {
  if (!editAnswerContent.value.trim()) {
    alert('답변 내용을 입력해주세요.');
    return;
  }





  if (!selectedVOC.value.voc_answer_code) {
    isRegisterModalOpen.value = true;
  } else {
    isEditModalOpen.value = true;
  }
};

const submitRegisterAnswer = async () => {
  try {
    const response = await axios.post(
      `https://learnsmate.shop/voc-answer/register`,
      {
        voc_answer_content: editAnswerContent.value,
        admin_code: loginState.adminCode,
        voc_code: selectedVOC.value.voc_code,
      }
    );
    const vocResponse = await axios.get(`https://learnsmate.shop/voc/${selectedVOC.value.voc_code}`);
    const updatedVOC = vocResponse.data;
    selectedVOC.value = updatedVOC;
    const vocIndex = vocList.value.findIndex(voc => voc.voc_code === updatedVOC.voc_code);
    if (vocIndex !== -1) {
      vocList.value[vocIndex] = updatedVOC;
    }

    closeRegisterModal();
    isEditingAnswer.value = false;

    alert('답변이 성공적으로 등록되었습니다.');
  } catch (error) {
    console.error('VOC 답변 등록 중 오류 발생:', error);
    alert('답변 등록 중 오류가 발생했습니다.');
  }
};

const submitEditAnswer = async () => {
  try {
    const vocAnswerCode = selectedVOC.value.voc_answer_code;
    const response = await axios.patch(
      `https://learnsmate.shop/voc-answer/edit/${vocAnswerCode}`,
      { voc_answer_content: editAnswerContent.value }
    );
    selectedVOC.value.voc_answer_content = editAnswerContent.value;
    isEditingAnswer.value = false;
    closeEditModal();
    alert('답변이 성공적으로 수정되었습니다.');
  } catch (error) {
    console.error('VOC 답변 수정 중 오류 발생:', error);
    alert('답변 수정 중 오류가 발생했습니다.');
  }
};

const openAiModal = async () => {
  isAiModalOpen.value = true;
  isLoading.value = true;
  document.body.style.overflow = 'hidden';

  try {
    const response = await axios.get('https://learnsmate.shop/voc/ai/current-week');
    aiData.value = response.data || [];
  } catch (error) {
    console.error('AI 요약 데이터 로드 실패:', error);
    alert('AI 요약 데이터를 로드하는 중 문제가 발생했습니다.');
  } finally {
    isLoading.value = false;
  }
};

const closeAiModal = () => {
  isAiModalOpen.value = false;
  aiData.value = [];

  document.body.style.overflow = '';
};

onMounted(async () => {
  fetchVOCList()
  if (!loginState.isLoggedIn) {
    await loginState.fetchLoginState(); 
  }
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

const maskName = (name) => {
  if (!name || name.length < 2) return name;
  const firstChar = name[0];
  const lastChar = name[name.length - 1];
  return `${firstChar}**${lastChar}`;
};

const sortState = ref({
  column: null,
  order: 0,
});

const sortVOCList = (columnKey) => {
  if (sortState.value.column === columnKey) {
    sortState.value.order = (sortState.value.order + 1) % 3;
  } else {
    sortState.value.column = columnKey;
    sortState.value.order = 1;
  }

  if (sortState.value.order === 0) {
    fetchVOCList();
  } else {
    vocList.value.sort((a, b) => {
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
</script>