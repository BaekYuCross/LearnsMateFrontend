<template>
  <div class="tutor-layout-container">
    <div class="tutor-side-menu"><MemberSideMenu/></div>
    <div class="tutor-main-content">
      <MemberFilter 
        type="tutor" 
        @search="handleSearch" 
        @reset="handleReset"
      />
      <div class="tutor-header-container">
        <div class="tutor-count">전체 강사 수 <span class="count-number">{{ formatCurrency(totalCount) }}</span>명</div>
        <div class="tutor-button-group">
          <div class="column-selector">
            <button @click="toggleDropdown" class="tutor-dropdown-button">
              필요 컬럼 선택 ▼
            </button>
            <div v-show="isDropdownOpen" class="tutor-dropdown-menu">
              <div v-for="(label, key) in columns" :key="key" class="tutor-dropdown-item">
                <input 
                  type="checkbox"
                  :value="key" 
                  v-model="selectedColumns" 
                  @change="updateSelectedColumns" 
                  :id="key"
                />
                <label :for="key">{{ label }}</label>
              </div>
            </div>
          </div>
          <button class="tutor-excel-button" @click="handleExcelDownload">
            <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
          </button>
        </div>
      </div>

      <div class="tutor-content-section" :class="{ 'with-detail': selectedTutor }">
        <div class="tutor-table-container" :class="{ 'shrink': selectedTutor }">
          <div class="tutor-board-container">
            <div class="tutor-board-header">
              <div v-if="selectedColumns.includes('memberCode')" class="tutor-board-header-code">강사 코드</div>
              <div v-if="selectedColumns.includes('memberName')" class="tutor-board-header-name">이름</div>
              <div v-if="selectedColumns.includes('memberEmail')" class="tutor-board-header-email">이메일</div>
              <div v-if="selectedColumns.includes('memberPhone')" class="tutor-board-header-phone">연락처</div>
              <div v-if="selectedColumns.includes('memberAddress')" class="tutor-board-header-address">주소</div>
              <div v-if="selectedColumns.includes('memberAge')" class="tutor-board-header-age">나이</div>
              <div v-if="selectedColumns.includes('memberBirth')" class="tutor-board-header-birth">생년월일</div>
              <div v-if="selectedColumns.includes('memberFlag')" class="tutor-board-header-flag">계정상태</div>
              <div v-if="selectedColumns.includes('createdAt')" class="tutor-board-header-created">생성일</div>
              <div v-if="selectedColumns.includes('memberDormantStatus')" class="tutor-board-header-dormant">휴면상태</div>
            </div>

            <div class="tutor-board-body">
              <div 
                class="tutor-board-row" 
                v-for="(tutor, index) in tutors" 
                :key="tutor.memberCode"
                @click="showDetail(tutor)"
                :class="{ 'selected': selectedTutor?.memberCode === tutor.memberCode }"
              >
                <div v-if="selectedColumns.includes('memberCode')" class="tutor-board-row-code">
                  {{ tutor.memberCode }}
                </div>
                <div v-if="selectedColumns.includes('memberName')" class="tutor-board-row-name">
                  {{ tutor.memberName }}
                </div>
                <div v-if="selectedColumns.includes('memberEmail')" class="tutor-board-row-email">
                  {{ tutor.memberEmail }}
                </div>
                <div v-if="selectedColumns.includes('memberPhone')" class="tutor-board-row-phone">
                  {{ tutor.memberPhone }}
                </div>
                <div v-if="selectedColumns.includes('memberAddress')" class="tutor-board-row-address">
                  {{ tutor.memberAddress }}
                </div>
                <div v-if="selectedColumns.includes('memberAge')" class="tutor-board-row-age">
                  {{ tutor.memberAge }}
                </div>
                <div v-if="selectedColumns.includes('memberBirth')" class="tutor-board-row-birth">
                  {{ tutor.memberBirth }}
                </div>
                <div v-if="selectedColumns.includes('memberFlag')" class="tutor-board-row-flag" :style="{
                    backgroundColor: tutor.memberFlag ? '#dcfce7' : '#fee2e2',
                    color: tutor.memberFlag ? '#166534' : '#991b1b'
                  }">
                  {{ tutor.memberFlag === true ? '활성' : '비활성' }}
                </div>
                <div v-if="selectedColumns.includes('createdAt')" class="tutor-board-row-created">
                  {{ tutor.createdAt }}
                </div>
                <div v-if="selectedColumns.includes('memberDormantStatus')" class="tutor-board-row-dormant" :style="{
                    backgroundColor: tutor.memberDormantStatus ? '#fee2e2' : '#dcfce7',
                    color: tutor.memberDormantStatus ? '#991b1b' : '#166534'}">
                  {{ tutor.memberDormantStatus === true ? '비활성' : '활성' }}
                </div>
              </div>
            </div>
          </div>

          <div class="tutor-pagination">
            <button class="tutor-page-button prev-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">◀</button>
            <button class="tutor-page-button" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
            <span v-if="startPage > 2">...</span>
            <template v-for="page in displayedPages" :key="page">
              <button v-if="page !== 1 && page !== totalPages" class="tutor-page-button" :class="{ active: currentPage === page }" @click="changePage(page)">{{ page }}</button>
            </template>
            <span v-if="endPage < totalPages - 1">...</span>
            <button v-if="totalPages > 1" class="tutor-page-button" :class="{ active: currentPage === totalPages }" @click="changePage(totalPages)">{{ totalPages }}</button>
            <button class="tutor-page-button next-button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">▶</button>
          </div>
        </div>



        <div v-if="selectedTutor" class="tutor-detail-container">
          <div class="tutor-detail-header">
            <h3>강사 상세 정보</h3>
            <button class="close-button" @click="closeTutorDetail">×</button>
          </div>          
          <div class="tutor-detail-content">
            <div class="tutor-info-grid">
              <div class="tutor-info-item">
                <span class="tutor-label">강사 코드</span>
                <span>{{ selectedTutor.memberCode }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">이름</span>
                <span>{{ selectedTutor.memberName }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">이메일</span>
                <span>{{ selectedTutor.memberEmail }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">연락처</span>
                <span>{{ selectedTutor.memberPhone }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">주소</span>
                <span>{{ selectedTutor.memberAddress }}</span>
              </div>
        
              <!-- 강의 정보 -->
              <div class="lecture-section">
                <h4 class="lecture-title">강의 목록</h4>
                <div v-if="tutorDetail?.tutor_lecture_detail_list?.length" class="lecture-list">
                  <div v-for="lecture in tutorDetail.tutor_lecture_detail_list" 
                      :key="lecture.lectureCode" 
                      class="lecture-item">
                    <div class="lecture-header">
                      <span class="lecture-name">{{ lecture.lectureTitle }}</span>
                    </div>
                    <div class="lecture-stats">
                      <span class="stat-item">
                        <strong>강의 수:</strong> {{ lecture.videoCount }}개
                      </span>
                      <span class="stat-item">
                        <strong>수강생:</strong> {{ lecture.totalStudents }}명
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { saveAs } from 'file-saver';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';
import '@/assets/css/member/TutorView.css'
import axios from 'axios';


const selectedTutor = ref(null);
const tutors = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const tutorDetail = ref(null);
const isDropdownOpen = ref(false);
const columns = ref({
  memberCode: "강사 코드",
  memberName: "이름",
  memberEmail: "이메일",
  memberPhone: "연락처",
  memberAddress: "주소",
  memberAge: "나이",
  memberBirth: "생년월일",
  memberFlag: "계정상태",
  createdAt: "생성일",
  memberDormantStatus: "휴면상태"
});
const selectedColumns = ref(Object.keys(columns.value));

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateSelectedColumns = () => {
  console.log("current selected column :", selectedColumns.value);
};

const formatCurrency = (value) => {
  return value.toLocaleString();
};

// 전체 강사 목록
const fetchTutors = async () => {
  try {
    const response = await axios.get('https://learnsmate.shop/member/tutors', {
      withCredentials: true, 
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
    });
    
    tutors.value = response.data.content;
    console.log(tutors.value);
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch tutors:', error);
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;

    const response = await axios.post('https://learnsmate.shop/member/filter/tutor', lastFilterData.value, {
      withCredentials: true, 
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    tutors.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
    selectedTutor.value = null;
  } catch (error) {
    console.error('Failed to filter tutors:', error);
  }
};

const handleExcelDownload = async() => {
  try{
    const config = {
      method: 'POST',
      url: 'https://learnsmate.shop/member/excel/download/tutor',
      responseType: 'blob',
      withCredentials: true, 
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        selectedColumns: selectedColumns.value,  // 선택된 컬럼 정보 추가
        ...(isFiltered.value && lastFilterData.value ? lastFilterData.value : {})}
    };
    
    const response = await axios(config);
    
    // 에러 응답 체크
    if (response.data instanceof Blob) {
      const isJson = response.data.type === 'application/json';
      if (isJson) {
        const textData = await response.data.text();
        console.error('Server error:', textData);
        throw new Error(textData);
      }
    }
    
    // 파일 다운로드
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    const now = new Date();
    const fileName = `tutor_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
    
    saveAs(blob, fileName);
  } catch (error) {
    console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
    if (error.response) {
      const reader = new FileReader();
      reader.onload = () => {
        console.error('상세 에러:', reader.result);
      };
      reader.readAsText(error.response.data);
    }
  }
}

// 초기화
const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedTutor.value = null;
  fetchTutors();
};

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage;
  
  if (isFiltered.value && lastFilterData.value) {
    const response = await axios.post('https://learnsmate.shop/member/filter/tutor',lastFilterData.value, {
      withCredentials: true,   
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    tutors.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } else {
    await fetchTutors();
  }
  
  selectedTutor.value = null;
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

const showDetail = async (tutor) => {
  if (selectedTutor.value?.memberCode === tutor.memberCode) {
    selectedTutor.value = null;
    tutorDetail.value = null;
  } else {
    selectedTutor.value = tutor;
    try {
      const response = await axios.get(`https://learnsmate.shop/member/tutor/${tutor.memberCode}`);
      tutorDetail.value = response.data;
      console.log(tutorDetail.value);
    } catch (error) {
      console.error('Failed to load tutor detail:', error);
    }
  }
};

const closeTutorDetail = () =>{
  selectedTutor.value = null;
  tutorDetail.value = null;
}

onMounted(() => {
  fetchTutors();
});
</script>