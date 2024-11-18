<template>
    <div class="tutor-layout-container">
      <div class="tutor-side-menu">
        <MemberSideMenu/>
      </div>
      <div class="tutor-main-content">
        <!-- 필터 -->
        <MemberFilter 
            type="tutor" 
            @search="handleSearch" 
            @reset="handleReset"
        />
  
        <!-- 전체 강사 수 표시 -->
        <div class="header-container">
        <div class="tutor-count">전체 강사 수 <span class="count-number">{{ tutors.length }}</span>명</div>
        <div class="tutor-button-group">
          <button class="tutor-excel-button"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
        </div>
      </div>
        
        <div class="tutor-content-section" :class="{ 'with-detail': selectedTutor }">
          <div class="tutor-table-container" :class="{ 'shrink': selectedTutor }">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>강사 코드</th>
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
                  v-for="(tutor, index) in paginatedTutors" 
                  :key="tutor.code"
                  @click="showDetail(tutor)"
                  class="cursor-pointer hover:bg-gray-50"
                  :class="{ 'tutor-selected': selectedTutor?.code === tutor.code }"
                >
                  <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ tutor.code }}</td>
                  <td>{{ tutor.name }}</td>
                  <td>{{ tutor.email }}</td>
                  <td>{{ tutor.phone }}</td>
                  <td>{{ tutor.address }}</td>
                  <td>{{ tutor.age }}</td>
                  <td>{{ tutor.birthDate }}</td>
                  <td>{{ tutor.memberFlag === 'Y' ? '활성' : '비활성' }}</td>
                  <td>{{ tutor.createDate }}</td>
                  <td>{{ tutor.dormantFlag === 'Y' ? '휴면' : '활성' }}</td>
                </tr>
              </tbody>
            </table>
  
            <!-- 페이지네이션 -->
            <div class="tutor-pagination">
              <button 
                class="tutor-page-button prev-button" 
                @click="changePage(currentPage - 1)" 
                :disabled="currentPage === 1"
              >
                ◀이전
              </button>
              <span v-for="page in totalPages" :key="page" class="tutor-page-number">
                <button 
                  class="tutor-page-button" 
                  :class="{ active: currentPage === page }" 
                  @click="changePage(page)"
                >
                  {{ page }}
                </button>
              </span>
              <button 
                class="tutor-page-button next-button"
                @click="changePage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
              >
                다음▶
              </button>
            </div>
          </div>
  
          <Transition name="tutor-slide-fade">
            <div v-if="selectedTutor" class="tutor-detail-container">
              <div class="tutor-detail-content">
                <h3>상세 정보</h3>
                <div class="tutor-info-grid">
                  <div class="tutor-info-item">
                    <span class="tutor-label">강사 코드:</span>
                    <span>{{ selectedTutor.code }}</span>
                  </div>
                  <div class="tutor-info-item">
                    <span class="tutor-label">이름:</span>
                    <span>{{ selectedTutor.name }}</span>
                  </div>
                  <!-- 다른 상세 정보들 추가 -->
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
  import MemberFilter from '@/components/member/MemberFilter.vue';
  
  const selectedTutor = ref(null);
  const currentPage = ref(1);
  const pageSize = 15; // 한 페이지당 보여줄 항목 수
  
  const tutors = ref([
    // 더미 데이터 예시
    {
      code: 1,
      name: '김철수',
      email: 'test@example.com',
      phone: '010-1234-5678',
      birthDate: '1999-01-01',
      address: '서울시 강남구'
    },
    {
      code: 'TTR002',
      name: '이영희',
      email: 'lee@example.com',
      phone: '010-2345-6789',
      address: '서울시 서초구 서초동',
      age: '23',
      birthDate: '2001-03-15',
      memberFlag: 'Y',
      createDate: '2024-01-20',
      dormantFlag: 'N'
    },
  ])
  
  // 더미 데이터 20개로 확장
  const expandData = () => {
    const baseData = tutors.value.slice(0, 2);
    for (let i = 3; i <= 20; i++) {
      tutors.value.push({
        ...baseData[i % 2],
        code: `TTR${String(i).padStart(3, '0')}`,
      });
    }
  };
  expandData();
  
  // 페이지네이션 관련 computed 속성들
  const totalPages = computed(() => Math.ceil(tutors.value.length / pageSize));
  
  const paginatedTutors = computed(() => 
    tutors.value.slice(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize
    )
  );
  
  // 페이지 변경 함수
  const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
      selectedTutor.value = null;
    }
  };
  
  const showDetail = (tutor) => {
    if (selectedTutor.value?.code === tutor.code) {
      selectedTutor.value = null
    } else {
      selectedTutor.value = tutor
    }
  }
  </script>
  <style scoped>
  .tutor-layout-container {
    display: flex;
    min-height: 100vh;
  }
  
  .tutor-side-menu {
    left: 0;
    top: 0;
    bottom: 0;
    background-color: #006D5C;
    z-index: 100;
  }
  
  .tutor-main-content {
    flex: 1;
    margin-left: 160px;
    padding: 20px;
    background-color: #f8f9fa;
    min-height: 100vh;
  }
  
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -15px;
    margin-top: 20px;
  }
  
  .tutor-content-section {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    transition: all 0.3s ease;
  }
  
  .tutor-table-container {
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.4s ease-in-out;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .tutor-table-container.shrink {
    flex: 0 0 50%;
  }
  
  .tutor-slide-fade-enter-from {
    transform: translateX(20px);
    opacity: 0;
  }
  
  .tutor-slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
  
  .tutor-slide-fade-enter-active,
  .tutor-slide-fade-leave-active {
    transition: all ease-in-out;
  }
  
  .tutor-detail-container {
    flex: 0 0 50%;
    opacity: 1;
    transform: translateX(0);
  }
  
  table {
    width: 100%;
    min-width: 1200px;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px;
    text-align: center;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
    font-size: 11px;
  }
  
  th {
    font-size: 13px;
  }
  
  .tutor-selected {
    background-color: #e2e8f0;
  }
  
  .tutor-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 16px;
  }
  
  .tutor-info-item {
    display: flex;
    gap: 8px;
  }
  
  .tutor-label {
    color: #64748b;
    min-width: 80px;
  }
  
  /* 각 열의 너비 지정 */
  th:nth-child(1), td:nth-child(1) { width: 100px; }
  th:nth-child(2), td:nth-child(2) { width: 100px; }
  th:nth-child(3), td:nth-child(3) { width: 150px; }
  th:nth-child(4), td:nth-child(4) { width: 120px; }
  th:nth-child(5), td:nth-child(5) { width: 200px; }
  th:nth-child(6), td:nth-child(6) { width: 80px; }
  th:nth-child(7), td:nth-child(7) { width: 100px; }
  th:nth-child(8), td:nth-child(8) { width: 100px; }
  th:nth-child(9), td:nth-child(9) { width: 100px; }
  th:nth-child(10), td:nth-child(10) { width: 100px; }
  
  .tutor-pagination {
    position: sticky;
    left: 0;
    right: 0;
    background: white;
    padding: 20px 0;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  
  .tutor-page-button {
    background: none;
    border: none;
    color: #333;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 13px;
  }
  
  .tutor-page-button.active {
    font-weight: bold;
    color: #006D5C;
  }
  
  .tutor-page-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .tutor-count {
    font-size: 17px;
    font-weight: bold;
    color: #333;
  }
  
  .count-number {
    color: #006D5C;
    font-weight: bold;
  }
  
  .tutor-button-group {
    display: flex;
    gap: 10px;
  }
  
  .tutor-excel-button {
    background: #005950;
    padding: 2px 5px;
    margin-bottom: 3px;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 13px;
  }
  
  .tutor-excel-button img {
    width: 16px;
    height: 16px;
  }
  </style>