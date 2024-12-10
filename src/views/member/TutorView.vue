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
              <div v-if="selectedColumns.includes('memberCode')" 
                    class="tutor-board-header-code tutor-clickable"
                    @click="handleSort('memberCode')">
                강사 코드
                <span v-if="currentSortField === 'memberCode'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberName')" 
                    class="tutor-board-header-name tutor-clickable"
                    @click="handleSort('memberName')">
                이름
                <span v-if="currentSortField === 'memberName'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberEmail')" 
                    class="tutor-board-header-email tutor-clickable"
                    @click="handleSort('memberEmail')">
                이메일
                <span v-if="currentSortField === 'memberEmail'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberPhone')" 
                    class="tutor-board-header-phone tutor-clickable"
                    @click="handleSort('memberPhone')">
                연락처
                <span v-if="currentSortField === 'memberPhone'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberAddress')" 
                    class="tutor-board-header-address tutor-clickable"
                    @click="handleSort('memberAddress')">
                주소
                <span v-if="currentSortField === 'memberAddress'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberAge')" 
                    class="tutor-board-header-age tutor-clickable"
                    @click="handleSort('memberAge')">
                나이
                <span v-if="currentSortField === 'memberAge'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberBirth')" 
                    class="tutor-board-header-birth tutor-clickable"
                    @click="handleSort('memberBirth')">
                생년월일
                <span v-if="currentSortField === 'memberBirth'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberFlag')" 
                    class="tutor-board-header-flag tutor-clickable"
                    @click="handleSort('memberFlag')">
                계정상태
                <span v-if="currentSortField === 'memberFlag'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('createdAt')" 
                    class="tutor-board-header-created tutor-clickable"
                    @click="handleSort('createdAt')">
                생성일
                <span v-if="currentSortField === 'createdAt'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
              <div v-if="selectedColumns.includes('memberDormantStatus')" 
                    class="tutor-board-header-dormant tutor-clickable"
                    @click="handleSort('memberDormantStatus')">
                휴면상태
                <span v-if="currentSortField === 'memberDormantStatus'" class="tutor-sort-arrow">
                  {{ currentSortDirection === 'DESC' ? '↑' : '↓' }}
                </span>
              </div>
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
                  {{ formatToDateTime(tutor.createdAt) }}
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
                <span class="tutor-detail-info">{{ selectedTutor.memberCode }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">이름</span>
                <span class="tutor-detail-info">{{ selectedTutor.memberName }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">이메일</span>
                <span class="tutor-detail-info">{{ selectedTutor.memberEmail }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">연락처</span>
                <span class="tutor-detail-info">{{ selectedTutor.memberPhone }}</span>
              </div>
              <div class="tutor-info-item">
                <span class="tutor-label">주소</span>
                <span class="tutor-detail-info">{{ selectedTutor.memberAddress }}</span>
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
const pageSize = 50;
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
const currentSortField = ref('memberCode');
const currentSortDirection = ref('DESC');
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
    
    tutors.value = response.data.content.map(tutor => ({
      ...tutor,
      memberName: maskingUtils.maskName(tutor.memberName),
      memberEmail: maskingUtils.maskEmail(tutor.memberEmail),
      memberPhone: maskingUtils.maskPhone(tutor.memberPhone),
      memberAddress: maskingUtils.maskAddress(tutor.memberAddress)
    }));

    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch tutors:', error);
  }
};
// 필터 검색 처리 함수 수정
const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;
    
    // 항상 정렬된 상태로 데이터를 가져옴
    await fetchSortedTutors();
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

// changePage 함수 수정
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  
  // 항상 정렬된 데이터를 가져옴
  await fetchSortedTutors();
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

const maskingUtils = {
  maskName: (name) => {
    if (!name) return '';
    const first = name.charAt(0);
    const last = name.charAt(name.length - 1);
    return `${first}**${last}`;
  },

  maskEmail: (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    
    const maskedLocal = localPart.substring(0, 2) + 
      '*'.repeat(Math.max(localPart.length - 2, 4));
    return `${maskedLocal}@${domain}`;
  },

  maskPhone: (phone) => {
    if (!phone) return '';
    
    const parts = phone.split('-');
    if (parts.length !== 3) return phone;
    
    return `${parts[0]}-${'*'.repeat(parts[1].length)}-${parts[2]}`;
  },

  maskAddress: (address) => {
    if (!address) return '';
    
    const parts = address.split(' ');
    
    if (parts.length < 3) return address;
    
    const maskedParts = parts.map((part, index) => {
      if (index < 2) return part; 
      
      if (index === 2) {
        return part.substring(0, 2) + '*'.repeat(part.length - 2);
      }
      
      if (part.includes('번길') || part.includes('번지')) {
        const suffix = part.includes('번길') ? '번길' : '번지';
        return '*'.repeat(part.length - suffix.length) + suffix;
      }
      
      return '*'.repeat(part.length);
    });
    
    return maskedParts.join(' ');
  }
};

const showDetail = async (tutor) => {
  if (selectedTutor.value?.memberCode === tutor.memberCode) {
    selectedTutor.value = null;
    tutorDetail.value = null;
  } else {
    try {
      const response = await axios.get(`https://learnsmate.shop/member/tutor/${tutor.memberCode}`);
      tutorDetail.value = response.data;
      // 상세 정보는 마스킹하지 않은 원본 데이터 사용
      selectedTutor.value = {
        memberCode: response.data.member_dto.member_code,
        memberName: response.data.member_dto.member_name,
        memberEmail: response.data.member_dto.member_email,
        memberPhone: response.data.member_dto.member_phone,
        memberAddress: response.data.member_dto.member_address
      };
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

const formatDate = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray)) return '-';

  const [year, month, day] = dateArray;

  // 월과 일이 한 자리수일 경우 앞에 0을 붙임
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

function formatToDateTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
// 정렬된 강사 목록 가져오기
const fetchSortedTutors = async () => {
  try {
    console.log('Fetch sorted tutors with:', {
      isFiltered: isFiltered.value,
      sortField: currentSortField.value,
      sortDirection: currentSortDirection.value,
      filterData: lastFilterData.value
    });

    if (isFiltered.value && lastFilterData.value) {
      // 필터링된 상태면 필터링 정렬 API 호출
      const response = await axios.post(
        'https://learnsmate.shop/member/filter/tutor/sort', 
        lastFilterData.value,  // 필터 데이터는 body로
        {
          withCredentials: true,
          params: {  // 정렬 관련 파라미터
            page: currentPage.value - 1,
            size: pageSize,
            sortField: currentSortField.value,
            sortDirection: currentSortDirection.value
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      handleResponse(response);
    } else {
      // 필터링되지 않은 상태면 일반 정렬 API 호출
      const response = await axios.get(
        'https://learnsmate.shop/member/tutors/sort', 
        {
          withCredentials: true,
          params: {
            page: currentPage.value - 1,
            size: pageSize,
            sortField: currentSortField.value,
            sortDirection: currentSortDirection.value
          }
        }
      );
      handleResponse(response);
    }
  } catch (error) {
    console.error('Failed to fetch sorted tutors:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
  }
};

// 응답 처리 헬퍼 함수
const handleResponse = (response) => {
  if (!response?.data?.content) {
    console.error('Invalid response data structure:', response);
    tutors.value = [];
    totalCount.value = 0;
    totalPages.value = 0;
    return;
  }

  tutors.value = response.data.content.map(tutor => ({
    ...tutor,
    memberName: maskingUtils.maskName(tutor.memberName),
    memberEmail: maskingUtils.maskEmail(tutor.memberEmail),
    memberPhone: maskingUtils.maskPhone(tutor.memberPhone),
    memberAddress: maskingUtils.maskAddress(tutor.memberAddress)
  }));
  totalCount.value = response.data.totalElements;
  totalPages.value = response.data.totalPages;
};

// 정렬 처리 함수
const handleSort = (field) => {
  if (field === currentSortField.value) {
    currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    currentSortField.value = field;
    currentSortDirection.value = 'DESC';
  }
  
  currentPage.value = 1;
  fetchSortedTutors();
};

onMounted(() => {
  fetchTutors();
});
</script>