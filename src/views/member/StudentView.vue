<template>
  <div class="layout-container">
    <div class="side-menu"><MemberSideMenu/></div>
      <div class="main-content">
        <MemberFilter 
          type="student" 
          @search="handleSearch" 
          @reset="handleReset"
        />
          <div class="student-header-container" >
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
              <button class="excel-button" @click="handleExcelDownload">
                <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
              </button>
              <button class="excel-button" @click="showCategoryModal = true" style="font-size: 13.5px;">
                카테고리 비율
              </button>
            </div>
          </div>


          <div class="content-section">
            <div class="table-container" :class="{ 'shrink': selectedStudent }">
              <div class="student-board-container">
                <div class="student-board-header">
                  <div v-if="selectedColumns.includes('memberCode')" 
                        class="student-board-header-code student-clickable"
                        @click="handleSort('memberCode')">
                    학생 코드
                    <span v-if="currentSortField === 'memberCode'" class="student-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberName')" 
                        class="student-board-header-name student-clickable"
                        @click="handleSort('memberName')">
                    이름
                    <span v-if="currentSortField === 'memberName'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberEmail')" 
                        class="student-board-header-email student-clickable"
                        @click="handleSort('memberEmail')">
                    이메일
                    <span v-if="currentSortField === 'memberEmail'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberPhone')" 
                        class="student-board-header-phone student-clickable"
                        @click="handleSort('memberPhone')">
                    연락처
                    <span v-if="currentSortField === 'memberPhone'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberAddress')" 
                        class="student-board-header-address student-clickable"
                        @click="handleSort('memberAddress')">
                    주소
                    <span v-if="currentSortField === 'memberAddress'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberAge')" 
                        class="student-board-header-age student-clickable"
                        @click="handleSort('memberAge')">
                    나이
                    <span v-if="currentSortField === 'memberAge'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberBirth')" 
                        class="student-board-header-birth student-clickable"
                        @click="handleSort('memberBirth')">
                    생년월일
                    <span v-if="currentSortField === 'memberBirth'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberFlag')" 
                        class="student-board-header-flag student-clickable"
                        @click="handleSort('memberFlag')">
                    계정상태
                    <span v-if="currentSortField === 'memberFlag'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('createdAt')" 
                        class="student-board-header-created student-clickable"
                        @click="handleSort('createdAt')">
                    생성일
                    <span v-if="currentSortField === 'createdAt'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
                  <div v-if="selectedColumns.includes('memberDormantStatus')" 
                        class="student-board-header-dormant student-clickable"
                        @click="handleSort('memberDormantStatus')">
                    휴면상태
                    <span v-if="currentSortField === 'memberDormantStatus'" class="studnet-sort-arrow">
                      {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
                    </span>
                  </div>
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
                      color: student.memberFlag ? '#166534' : '#991b1b', }">
                      {{ student.memberFlag === true ? '활성' : '비활성' }}
                    </div>
                    <div v-if="selectedColumns.includes('createdAt')" class="student-board-row-created">
                      {{ formatToDateTime(student.createdAt) }}
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
            <div class="detail-header">
              <h3>상세 정보</h3>
              <button class="close-button" @click="closeStudentDetail">×</button>
            </div>
            <div class="detail-content">
              <div class="info-grid">
                <div class="info-row">
                  <span class="label">이름</span>
                  <span>{{ studentDetail.member_dto.member_name }}</span>
                </div>
                <div class="info-row">
                  <span class="label">이메일</span>
                  <span>{{ studentDetail.member_dto.member_email }}</span>
                </div>
                <div class="info-row">
                  <span class="label">연락처</span>
                  <span>{{ studentDetail.member_dto.member_phone }}</span>
                </div>
                <div class="info-row">
                  <span class="label">생년월일</span>
                  <span>{{ formatToDateTime(studentDetail.member_dto.member_birth) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">주소</span>
                  <span>{{ studentDetail.member_dto.member_address }}</span>
                </div>
              </div>


              <!-- 수강 진행 현황 -->
              <div class="course-section">
                <div class="course-header">
                  <h4>수강 진행 현황 ({{ studentDetail?.lecture_video_progress_dtolist?.length || 0 }})
                  <button class="course-toggle-button" @click="toggleCourseSection">
                    {{ isCourseSectionVisible ? '&#9650;' : '&#9660;'  }}
                  </button>
                </h4>
                </div>
                <div v-if="isCourseSectionVisible" class="course-list">
                  <div
                    v-for="lecture in studentDetail.lecture_video_progress_dtolist"
                    :key="lecture.lectureCode"
                    class="course-item"
                  >
                    <div class="course-title">{{ lecture.lectureTitle }}</div>
                    <div class="progress-bar">
                      <div
                        class="progress"
                        :style="{ width: `${(lecture.completedVideos / lecture.totalVideos) * 100}%` }"
                      ></div>
                    </div>
                    <div class="progress-text">
                      {{ lecture.completedVideos }}/{{ lecture.totalVideos }}
                      ({{ Math.round((lecture.completedVideos / lecture.totalVideos) * 100) }}%)
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 추천 강의 섹션 -->
              <div class="recommended-section">
                <div class="recommended-header">
                  <h4>추천 강의 ({{ studentDetail.recommended_lecture_list?.length || 0 }})
                  <button class="recommended-toggle-button" @click="toggleRecommendedSection">
                    {{ isRecommendedSectionVisible ? '&#9650;' : '&#9660;' }}
                  </button></h4>
                </div>
                <div v-if="isRecommendedSectionVisible" class="recommended-list">
                  <div
                    v-for="lecture in studentDetail.recommended_lecture_list"
                    :key="lecture.lectureCode"
                    class="recommended-item"
                  >
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
                    <div class="subsection-header">
                      <h5>미사용 쿠폰 ({{ studentDetail.unused_coupons_list?.length || 0 }})
                        <button class="coupon-toggle-button" @click="toggleUnusedCoupons">
                          {{ isUnusedCouponsVisible ? '▲' : '▼' }}
                        </button>
                      </h5>
                    </div>
                    <div v-if="isUnusedCouponsVisible" class="coupon-grid">
                      <div v-for="coupon in studentDetail.unused_coupons_list" 
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
                    <div class="subsection-header">
                      <h5>사용완료 쿠폰 ({{ studentDetail.used_coupons_list?.length || 0 }})
                        <button class="coupon-toggle-button" @click="toggleUsedCoupons">
                          {{ isUsedCouponsVisible ? '▲' : '▼' }}
                        </button>
                      </h5>
                    </div>
                    <div v-if="isUsedCouponsVisible" class="coupon-grid">
                      <div v-for="coupon in studentDetail.used_coupons_list" 
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

                <!-- VOC 내역 -->
                <div class="voc-section">
                  <h4>문의 내역</h4>
                  <div class="voc-list">
                  <!-- 미답변 문의 -->
                  <div class="unanswered">
                    <div class="subsection-header">
                      <h5>미답변 문의 ({{ studentDetail.unanswered_vocby_member_list?.length || 0 }})
                        <button class="voc-toggle-button" @click="toggleUnansweredVoc">
                          {{ isUnansweredVocVisible ? '▲' : '▼' }}
                        </button>
                      </h5>
                    </div>
                    <div v-if="isUnansweredVocVisible" class="voc-grid">
                      <div v-for="voc in studentDetail.unanswered_vocby_member_list" 
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
                    <div class="subsection-header">
                      <h5>답변완료 문의 ({{ studentDetail.answered_vocby_member_list?.length || 0 }})
                        <button class="voc-toggle-button" @click="toggleAnsweredVoc">
                          {{ isAnsweredVocVisible ? '▲' : '▼' }}
                        </button>
                      </h5>
                    </div>
                    <div v-if="isAnsweredVocVisible" class="voc-grid">
                      <div v-for="voc in studentDetail.answered_vocby_member_list" 
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
    </div>
    <CategoryRatioModal 
        :is-open="showCategoryModal" 
        @close="showCategoryModal = false" 
      />
  </div>  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { saveAs } from 'file-saver';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';
import '@/assets/css/member/StudentView.css';
import CategoryRatioModal from '@/components/member/StudentCategoryRatioModal.vue';
import axios from 'axios';
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
const currentSortField = ref('memberCode');
const currentSortDirection = ref('DESC');
const selectedColumns = ref(Object.keys(columns.value));

const isUnusedCouponsVisible = ref(false);
const isUsedCouponsVisible = ref(false);
const isUnansweredVocVisible = ref(false);
const isAnsweredVocVisible = ref(false);
// 함수 추가
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 토글 상태 관리
const isCourseSectionVisible = ref(false);

const toggleCourseSection = () => {
  isCourseSectionVisible.value = !isCourseSectionVisible.value;
};

const updateSelectedColumns = () => {
  console.log("current selected column :", selectedColumns.value);
};

const toggleUnusedCoupons = () => {
  isUnusedCouponsVisible.value = !isUnusedCouponsVisible.value;
};

const toggleUsedCoupons = () => {
  isUsedCouponsVisible.value = !isUsedCouponsVisible.value;
};

const toggleUnansweredVoc = () => {
  isUnansweredVocVisible.value = !isUnansweredVocVisible.value;
};

const toggleAnsweredVoc = () => {
  isAnsweredVocVisible.value = !isAnsweredVocVisible.value;
};

const formatCurrency = (value) => {
  return value.toLocaleString(); // 숫자를 로컬 형식으로 변환 (3자리 단위 콤마)
};

// 추천 강의 섹션 보이기/숨기기 상태 관리
const isRecommendedSectionVisible = ref(false);

const toggleRecommendedSection = () => {
  isRecommendedSectionVisible.value = !isRecommendedSectionVisible.value;
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

    // 마스킹 처리를 적용한 데이터로 변환
    students.value = response.data.content.map(student => ({
      ...student,
      memberName: maskingUtils.maskName(student.memberName),
      memberEmail: maskingUtils.maskEmail(student.memberEmail),
      memberPhone: maskingUtils.maskPhone(student.memberPhone),
      memberAddress: maskingUtils.maskAddress(student.memberAddress)
    }));
    console.log(students.value);
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

    // 마스킹 처리를 적용한 데이터로 변환
    students.value = response.data.content.map(student => ({
      ...student,
      memberName: maskingUtils.maskName(student.memberName),
      memberEmail: maskingUtils.maskEmail(student.memberEmail),
      memberPhone: maskingUtils.maskPhone(student.memberPhone),
      memberAddress: maskingUtils.maskAddress(student.memberAddress)
    }));
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
      console.log(studentDetail.value);
    } catch (error) {
      console.error('Failed to load student details:', error);
    }
  }
};

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

// 페이지 변경 처리 수정
const changePage = async (newPage) => {
 if (newPage < 1 || newPage > totalPages.value) return;
 currentPage.value = newPage;
 
 if (currentSortField.value) {
   await fetchSortedStudents();
 } else if (isFiltered.value) {
   await fetchFilteredStudents();
 } else {
   await fetchStudents();
 }
};

// 필터 검색 처리 함수 수정
const handleSearch = async (filterData) => {
 isFiltered.value = true;
 lastFilterData.value = filterData;
 currentPage.value = 1;
 
 if (currentSortField.value) {
   await fetchSortedStudents();
 } else {
   await fetchFilteredStudents();
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

const closeStudentDetail = () => {
  selectedStudent.value = null;
  studentDetail.value = null;
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

// 정렬된 학생 목록 가져오기 (필터링 여부에 따라 다른 endpoint 사용)
const fetchSortedStudents = async () => {
 try {
   if (isFiltered.value && lastFilterData.value) {
     // 필터링된 상태면 필터링 정렬 API 호출
     console.log(lastFilterData.value);
     const response = await axios.post('http://localhost:5000/member/filter/student/sort', 
       lastFilterData.value,
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
     console.log(response.data);
     handleResponse(response);
   } else {
     // 필터링되지 않은 상태면 일반 정렬 API 호출
     console.log("노필터링");
     const response = await axios.get('http://localhost:5000/member/students/sort', {
       withCredentials: true,
       params: {
         page: currentPage.value - 1,
         size: pageSize,
         sortField: currentSortField.value,
         sortDirection: currentSortDirection.value
       }
     });
     handleResponse(response);
   }
 } catch (error) {
   console.error('Failed to fetch sorted students:', error);
 }
};

// 응답 처리 헬퍼 함수
const handleResponse = (response) => {
 students.value = response.data.content.map(student => ({
   ...student,
   memberName: maskingUtils.maskName(student.memberName),
   memberEmail: maskingUtils.maskEmail(student.memberEmail),
   memberPhone: maskingUtils.maskPhone(student.memberPhone),
   memberAddress: maskingUtils.maskAddress(student.memberAddress)
 }));
 totalCount.value = response.data.totalElements;
 totalPages.value = response.data.totalPages;
};


// 정렬 처리 함수
const handleSort = (field) => {
 if (field === currentSortField.value) {
   // 같은 필드면 방향만 전환
   currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC';
 } else {
   // 다른 필드면 필드 변경 및 방향 초기화
   currentSortField.value = field;
   currentSortDirection.value = 'DESC';
 }
 
 // 현재 페이지 초기화 및 데이터 가져오기
 currentPage.value = 1;
 fetchSortedStudents();
};

// 초기 로드
onMounted(() => {
  fetchStudents();
  const header = document.querySelector('.student-header-container');
  const section = document.querySelector('.content-section');
  
  if (header && section) {
    header.style.marginBottom = '0';
    section.style.marginTop = '0';
  }
});
</script>