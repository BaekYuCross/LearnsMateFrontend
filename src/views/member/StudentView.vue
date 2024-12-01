<template>
  <div class="layout-container">
    <div class="side-menu"><MemberSideMenu/></div>
    <div class="main-content">
      <MemberFilter 
        type="student" 
        @search="handleSearch" 
        @reset="handleReset"
      />

      <div class="content-section" :class="{ 'with-detail': selectedStudent }">
        <div class="table-container" :class="{ 'shrink': selectedStudent }">
          <div class="student-header-container">
            <div class="count">전체 학생 수 <span class="count-number">{{ formatCurrency(totalCount) }}</span>명</div>
            <div class="button-group">
              <div class="column-selector">
                <button @click="toggleDropdown" class="dropdown-button">
                  필요 컬럼 선택 ▼
                </button>
                <div v-show="isDropdownOpen" class="dropdown-menu">
                  <div v-for="(label, key) in columns" :key="key" class="dropdown-item">
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
              <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx, .xls" style="display: none"/>
              <button class="excel-button" @click="$refs.fileInput.click()">
                <img src="/src/assets/icons/upload.svg" alt="">엑셀 업로드
              </button>
              <button class="excel-button" @click="handleExcelDownload">
                <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
              </button>
              <button class="excel-button" @click="showCategoryModal = true" style="font-size: 13.5px;">
                카테고리 비율
              </button>
            </div>
          </div>
            
          <div class="student-board-container">
            <div class="student-board-header">
              <div v-if="selectedColumns.includes('memberCode')" class="student-board-header-code">학생 코드</div>
              <div v-if="selectedColumns.includes('memberName')" class="student-board-header-name">이름</div>
              <div v-if="selectedColumns.includes('memberEmail')" class="student-board-header-email">이메일</div>
              <div v-if="selectedColumns.includes('memberPhone')" class="student-board-header-phone">연락처</div>
              <div v-if="selectedColumns.includes('memberAddress')" class="student-board-header-address">주소</div>
              <div v-if="selectedColumns.includes('memberAge')" class="student-board-header-age">나이</div>
              <div v-if="selectedColumns.includes('memberBirth')" class="student-board-header-birth">생년월일</div>
              <div v-if="selectedColumns.includes('memberFlag')" class="student-board-header-flag">계정상태</div>
              <div v-if="selectedColumns.includes('createdAt')" class="student-board-header-created">생성일</div>
              <div v-if="selectedColumns.includes('memberDormantStatus')" class="student-board-header-dormant">휴면상태</div>
            </div>

            <div class="student-board-body">
              <div 
                class="student-board-row" 
                v-for="(student, index) in students" 
                :key="student.memberCode"
                @click="showDetail(student)"
                :class="{ 'selected': selectedStudent?.memberCode === student.memberCode }"
              >
                <div v-if="selectedColumns.includes('memberCode')" class="student-board-row-code">
                  {{ student.memberCode }}
                </div>
                <div v-if="selectedColumns.includes('memberName')" class="student-board-row-name">
                  {{ student.memberName }}
                </div>
                <div v-if="selectedColumns.includes('memberEmail')" class="student-board-row-email">
                  {{ student.memberEmail }}
                </div>
                <div v-if="selectedColumns.includes('memberPhone')" class="student-board-row-phone">
                  {{ student.memberPhone }}
                </div>
                <div v-if="selectedColumns.includes('memberAddress')" class="student-board-row-address">
                  {{ student.memberAddress }}
                </div>
                <div v-if="selectedColumns.includes('memberAge')" class="student-board-row-age">
                  {{ student.memberAge }}
                </div>
                <div v-if="selectedColumns.includes('memberBirth')" class="student-board-row-birth">
                  {{ student.memberBirth }}
                </div>
                <div v-if="selectedColumns.includes('memberFlag')" class="student-board-row-flag" :style="{
    backgroundColor: student.memberFlag ? '#dcfce7' : '#fee2e2',
    color: student.memberFlag ? '#166534' : '#991b1b'
  }">
                  {{ student.memberFlag === true ? '활성' : '비활성' }}
                </div>
                <div v-if="selectedColumns.includes('createdAt')" class="student-board-row-created">
                  {{ student.createdAt }}
                </div>
                <div v-if="selectedColumns.includes('memberDormantStatus')" class="student-board-row-dormant" :style="{
    backgroundColor: student.memberDormantStatus ? '#fee2e2' : '#dcfce7',
    color: student.memberDormantStatus ? '#991b1b' : '#166534'}">
                  {{ student.memberDormantStatus === true ? '휴면' : '활성' }}
                </div>
              </div>
            </div>
          </div>

          <div class="pagination">
            <button 
              class="page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              ◀
            </button>
            
            <template v-for="page in displayedPages" :key="page">
              <span v-if="page === '...'" class="page-dots">...</span>
              <button 
                v-else
                class="page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </template>
            
            <button 
              class="page-button next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >
              ▶
            </button>
          </div>
        </div>

        <div v-if="selectedStudent && studentDetail" class="detail-container">
          <div class="detail-content">
            <h3>상세 정보</h3>
            
            <!-- 기본 정보 -->
            <div class="info-section">
              <h4>기본 정보</h4>
              <div class="info-grid">
                <div class="info-row">
                  <span class="label">이름</span>
                  <span>{{ studentDetail.memberDto.memberName }}</span>
                </div>
                <div class="info-row">
                  <span class="label">이메일</span>
                  <span>{{ studentDetail.memberDto.memberEmail }}</span>
                </div>
                <div class="info-row">
                  <span class="label">연락처</span>
                  <span>{{ studentDetail.memberDto.memberPhone }}</span>
                </div>
                <div class="info-row">
                  <span class="label">생년월일</span>
                  <span>{{ studentDetail.memberDto.memberBirth }}</span>
                </div>
                <div class="info-row">
                  <span class="label">주소</span>
                  <span>{{ studentDetail.memberDto.memberAddress }}</span>
                </div>
              </div>
            </div>

            <!-- 수강 진행 현황 -->
            <div class="course-section">
              <h4>수강 진행 현황</h4>
              <div class="course-list">
                <div v-for="lecture in studentDetail.lectureVideoProgressDtolist" 
                     :key="lecture.lectureCode" 
                     class="course-item">
                     <h1></h1>
                  <div class="course-title">{{ lecture.lectureTitle }}</div>
                  <div class="progress-bar">
                    <div class="progress" 
                         :style="{width: `${(lecture.completedVideos/lecture.totalVideos) * 100}%`}">
                    </div>
                  </div>
                  <div class="progress-text">
                    {{lecture.completedVideos}}/{{lecture.totalVideos}} ({{Math.round((lecture.completedVideos/lecture.totalVideos) * 100)}}%)
                  </div>
                </div>
              </div>
            </div>

            <div class="recommended-section">
              <h4>추천 강의 ({{ studentDetail.recommendedLectureList?.length || 0 }})</h4>
              <div class="recommended-list">
                <div v-for="lecture in studentDetail.recommendedLectureList" 
                    :key="lecture.lectureCode" 
                    class="recommended-item">
                  <div class="recommended-content">
                    <div class="lecture-header">
                      <span class="lecture-title">{{ lecture.lectureTitle }}</span>
                      <span :class="['lecture-level', lecture.lectureLevel.toLowerCase()]">
                        {{ lecture.lectureLevel }}
                      </span>
                    </div>
                    <div class="lecture-info">
                      <div class="info-item">
                        <span class="label">강의 가격</span>
                        <span>{{ lecture.lecturePrice.toLocaleString() }}원</span>
                      </div>
                      <div class="info-item">
                        <span class="label">조회수</span>
                        <span>{{ lecture.lectureClickCount }}회</span>
                      </div>
                      <div class="info-item">
                        <span class="label">등록일</span>
                        <span>{{ formatDate(lecture.createdAt).split('T')[0] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 쿠폰 정보 -->
            <div class="coupon-section">
              <h4>쿠폰 정보</h4>
              <div class="coupon-list">
                <!-- 미사용 쿠폰 -->
                <div class="unused-coupons">
                  <h5>미사용 쿠폰 ({{ studentDetail.unusedCouponsList?.length || 0 }})</h5>
                  <div class="coupon-grid">
                    <div v-for="coupon in studentDetail.unusedCouponsList" 
                        :key="coupon.couponIssuanceCode" 
                        class="coupon-item">
                      <div class="coupon-detail">
                        <div>발급 코드: {{ coupon.couponIssuanceCode }}</div>
                        <div>발급일: {{ formatDate(coupon.couponIssueDate) }}</div>
                        <div>사용 상태: {{ coupon.couponUseStatus ? '사용' : '미사용' }}</div>
                        <div>쿠폰 코드: {{ coupon.couponCode }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 사용완료 쿠폰 -->
                <div class="used-coupons">
                  <h5>사용완료 쿠폰 ({{ studentDetail.usedCouponsList?.length || 0 }})</h5>
                  <div class="coupon-grid">
                    <div v-for="coupon in studentDetail.usedCouponsList" 
                        :key="coupon.couponIssuanceCode" 
                        class="coupon-item">
                      <div class="coupon-detail">
                        <div>발급 코드: {{ coupon.couponIssuanceCode }}</div>
                        <div>발급일: {{ formatDate(coupon.couponIssueDate) }}</div>
                        <div>사용일: {{ formatDate(coupon.couponUseDate) }}</div>
                        <div>사용 상태: {{ coupon.couponUseStatus ? '사용' : '미사용' }}</div>
                        <div>쿠폰 코드: {{ coupon.couponCode }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VOC 내역 -->
            <div class="voc-section">
              <h4>문의 내역</h4>
              <div class="voc-list">
                <!-- 미답변 문의 -->
                <div class="unanswered">
                  <h5>미답변 문의 ({{ studentDetail.unansweredvocbyMemberList?.length || 0 }})</h5>
                  <div class="voc-grid">
                    <div v-for="voc in studentDetail.unansweredvocbyMemberList" 
                        :key="voc.vocCode" 
                        class="voc-item">
                      <div class="voc-detail">
                        <div class="voc-header">
                          <span>문의 코드: {{ voc.vocCode }}</span>
                          <span>작성일: {{ formatDate(voc.createdAt) }}</span>
                        </div>
                        <div class="voc-body">
                          <div class="voc-category">카테고리: {{ getVocCategory(voc.vocCategoryCode) }}</div>
                          <div class="voc-content">{{ voc.vocContent }}</div>
                        </div>
                        <div class="voc-footer">
                          <div>답변 상태: {{ voc.vocAnswerStatus ? '답변완료' : '미답변' }}</div>
                          <div>만족도: {{ voc.vocAnswerSatisfaction || '-' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 답변완료 문의 -->
                <div class="answered">
                  <h5>답변완료 문의 ({{ studentDetail.answeredVocbyMemberList?.length || 0 }})</h5>
                  <div class="voc-grid">
                    <div v-for="voc in studentDetail.answeredVocbyMemberList" 
                        :key="voc.vocCode" 
                        class="voc-item">
                      <div class="voc-detail">
                        <div class="voc-header">
                          <span>문의 코드: {{ voc.vocCode }}</span>
                          <span>작성일: {{ formatDate(voc.createdAt) }}</span>
                        </div>
                        <div class="voc-body">
                          <div class="voc-category">카테고리: {{ getVocCategory(voc.vocCategoryCode) }}</div>
                          <div class="voc-content">{{ voc.vocContent }}</div>
                        </div>
                        <div class="voc-footer">
                          <div>답변 상태: {{ voc.vocAnswerStatus ? '답변완료' : '미답변' }}</div>
                          <div>만족도: {{ voc.vocAnswerSatisfaction || '-' }}</div>
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
    </div>
    <CategoryRatioModal 
        :is-open="showCategoryModal" 
        @close="showCategoryModal = false" 
      />
  </div>  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/plugins/axios';
import { saveAs } from 'file-saver';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';
import '@/assets/css/member/StudentView.css';
import CategoryRatioModal from '@/components/member/StudentCategoryRatioModal.vue';
const showCategoryModal = ref(false);
const selectedStudent = ref(null);
const studentDetail = ref(null);
const students = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const isDropdownOpen = ref(false);
const columns = ref({
  memberCode: "학생 코드",
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

// 함수 추가
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateSelectedColumns = () => {
  console.log("현재 선택된 컬럼:", selectedColumns.value);
};
const formatCurrency = (value) => {
  return value.toLocaleString(); // 숫자를 로컬 형식으로 변환 (3자리 단위 콤마)
};

// 학생 목록 가져오기 (일반 조회)
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      withCredentials: true, 
      params: {
        page: currentPage.value - 1,
        size: pageSize,
      },
    });

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch students:', error);
  }
};

// 필터링된 학생 목록 가져오기
const fetchFilteredStudents = async () => {
  if (!lastFilterData.value) return;

  try {
    const response = await axios.post('http://localhost:5000/member/filter/student',lastFilterData.value, {
      withCredentials: true, 
      params: {
        page: currentPage.value - 1,
        size: pageSize,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    students.value = response.data.content;
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch filtered students:', error);
  }
};

// 학생 상세정보 가져오기
const showDetail = async (student) => {
  if (selectedStudent.value?.memberCode === student.memberCode) {
    selectedStudent.value = null;
    studentDetail.value = null;
  } else {
    try {
      const response = await axios.get(`http://localhost:5000/member/student/${student.memberCode}`, {
        withCredentials: true,   
      });

      selectedStudent.value = student;
      studentDetail.value = response.data;
      console.log("상세 정보:", response.data);
      console.log("상세 정보:", studentDetail.value);
    } catch (error) {
      console.error('Failed to load student details:', error);
    }
  }
};

// 페이지 변경 처리
const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  if (isFiltered.value) {
    await fetchFilteredStudents();
  } else {
    await fetchStudents();
  }
};

// 필터링 검색
const handleSearch = async (filterData) => {
  isFiltered.value = true;
  lastFilterData.value = filterData;
  currentPage.value = 1;
  await fetchFilteredStudents();
};


const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    await axios.post('http://localhost:5000/member/excel/upload/student',formData, {
      withCredentials: true,  
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 업로드 성공 후 목록 새로고침
    await fetchStudents();
    alert('엑셀 파일이 성공적으로 업로드되었습니다.');
  } catch (error) {
    console.error('엑셀 업로드 중 오류가 발생했습니다:', error);
    if (error.response) {
      const reader = new FileReader();
      reader.onload = () => {
        console.error('상세 에러:', reader.result);
      };
      reader.readAsText(error.response.data);
    }
    alert('엑셀 업로드에 실패했습니다.');
  } finally {
    // input 초기화 (같은 파일 재선택 가능하도록)
    event.target.value = '';
  }
};

const handleExcelDownload = async() => {
  try{
    const config = {
      method: 'POST',
      url: 'http://localhost:5000/member/excel/download/student',
      responseType: 'blob',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        selectedColumns: selectedColumns.value,
        ...(isFiltered.value && lastFilterData.value ? lastFilterData.value : {})
      }
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
    const fileName = `student_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
    
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
  fetchStudents();
};

// 페이지네이션
const displayedPages = computed(() => {
  const pages = [];
  pages.push(1);
  if (currentPage.value - 1 > 2) {
    pages.push('...');
  }
  for (let i = Math.max(2, currentPage.value - 2); 
       i <= Math.min(totalPages.value - 1, currentPage.value + 2); 
       i++) {
    pages.push(i);
  }
  if (totalPages.value - currentPage.value > 2) {
    pages.push('...');
  }
  if (totalPages.value > 1) {
    pages.push(totalPages.value);
  }
  return pages;
});

const getVocCategory = (categoryCode) => {
  const categories = {
    1: '결제 및 환불',
    2: '계정 및 로그인',
    3: '프로모션 및 쿠폰',
    4: '시스템 기술적 문제',
    5: '기타 건의사항',
  };
  return categories[categoryCode];
};

const formatDate = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray)) return '-';
  
  const [year, month, day, hour, minute] = dateArray;
  
  // 월과 일이 한자리수일 경우 앞에 0을 붙임
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  
  return `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:00`;
};

// 초기 로드
onMounted(() => {
  fetchStudents();
});
</script>
