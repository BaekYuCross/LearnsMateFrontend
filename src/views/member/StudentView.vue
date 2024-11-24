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
            <div class="count">전체 학생 수 <span class="count-number">{{ totalCount }}</span>명</div>
            <div class="button-group">
              <button class="excel-button">
                <img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드
              </button>
            </div>
          </div>
            
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>학생 코드</th>
                <th>이름</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>주소</th>
                <th>나이</th>
                <th>생년월일</th>
                <th>계정상태</th>
                <th>생성일</th>
                <th>휴면상태</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(student, index) in students" 
                :key="student.memberCode"
                @click="showDetail(student)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedStudent?.memberCode === student.memberCode }"
              >
                <td>{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
                <td>{{ student.memberCode }}</td>
                <td>{{ student.memberName }}</td>
                <td>{{ student.memberEmail }}</td>
                <td>{{ student.memberPhone }}</td>
                <td>{{ student.memberAddress }}</td>
                <td>{{ student.memberAge }}</td>
                <td>{{ student.memberBirth }}</td>
                <td>{{ student.memberFlag === true ? '활성' : '비활성' }}</td>
                <td>{{ student.createdAt }}</td>
                <td>{{ student.memberDormantFlag === true ? '휴면' : '활성' }}</td>
              </tr>
            </tbody>
          </table>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from '@/plugins/axios';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
import MemberFilter from '@/components/member/MemberFilter.vue';
import '@/assets/css/member/StudentView.css';

const selectedStudent = ref(null);
const studentDetail = ref(null);
const students = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);
const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6WyJST0xFX0FETUlOIl0sImlhdCI6MTczMjMzNDYzNSwiZXhwIjoxNzc1NTM0NjM1fQ.mGz_-KbPzd7aO5FDq9ij_odcIJo2V2fmgOQgb2-qB87WXfieAiNPtFuNUwe42QHBJtt_Zo4EgtL1vKU32OP6CQ';

// 학생 목록 가져오기 (일반 조회)
const fetchStudents = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      params: {
        page: currentPage.value - 1,
        size: pageSize,
      },
      headers: {
        Authorization: token,
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
    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      lastFilterData.value,
      {
        params: {
          page: currentPage.value - 1,
          size: pageSize,
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

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
      const response = await axios.get(
        `http://localhost:5000/member/student/${student.memberCode}`,
        {
          headers: { 
            Authorization: token 
          }
        }
      );
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
    1: '강의 관련',
    2: '결제 관련',
    3: '시스템 관련',
    4: '기타'
    // 실제 카테고리 코드에 맞게 수정해주세요
  };
  return categories[categoryCode] || '기타';
};

const formatDate = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray)) return '-';
  
  // 배열의 값이 [2024, 12, 1, 1, 1] 이런 형태라고 가정
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
