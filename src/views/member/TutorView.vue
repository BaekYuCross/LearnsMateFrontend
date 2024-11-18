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
  
        
        
        <div class="tutor-content-section" :class="{ 'with-detail': selectedTutor }">
          <div class="tutor-table-container" :class="{ 'shrink': selectedTutor }">
            <!-- 전체 강사 수 표시 -->
            <div class="header-container">
            <div class="tutor-count">전체 강사 수 <span class="count-number">{{ tutors.length }}</span>명</div>
            <div class="tutor-button-group">
              <button class="tutor-excel-button"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
            </div>
            </div>
            
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
          <div v-if="selectedTutor" class="tutor-detail-container">
            <div class="tutor-detail-content">
              <h3>상세 정보</h3>
              <div class="tutor-info-grid">
                <div class="tutor-info-item">
                  <span class="tutor-label">강사 코드</span>
                  <span>{{ selectedTutor.code }}</span>
                </div>
                <div class="tutor-info-item">
                  <span class="tutor-label">이름</span>
                  <span>{{ selectedTutor.name }}</span>
                </div>
                <div class="tutor-info-item">
                  <span class="tutor-label">이메일</span>
                  <span>{{ selectedTutor.email }}</span>
                </div>
                <div class="tutor-info-item">
                  <span class="tutor-label">연락처</span>
                  <span>{{ selectedTutor.phone }}</span>
                </div>
                <div class="tutor-info-item">
                  <span class="tutor-label">생년월일</span>
                  <span>{{ selectedTutor.birthDate }}</span>
                </div>
                <div class="tutor-info-item">
                  <span class="tutor-label">주소</span>
                  <span>{{ selectedTutor.address }}</span>
                </div>
                <div class="tutor-info-item">
                  <span class="tutor-label">총 수강생 수</span>
                  <span>{{ tutorDetail?.tutorLectureDetailList?.reduce((sum, lecture) => sum + lecture.totalStudents, 0).toLocaleString() }}명</span>
                </div>

                <!-- 강의 목록 -->
                <div v-if="tutorDetail?.tutorLectureDetailList?.length">
                  <div class="tutor-info-item">
                    <span class="tutor-label">강의 목록</span>
                  </div>
                  <ul class="lecture-list">
                    <li v-for="lecture in tutorDetail.tutorLectureDetailList" 
                        :key="lecture.lectureCode" 
                        class="lecture-item">
                      {{ lecture.lectureTitle }}, {{ lecture.videoCount }}강
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 로딩 상태 표시 -->
              <div v-if="isLoading" class="loading-spinner">
                데이터를 불러오는 중...
              </div>
            </div>
          </div>
    </div>
  </div>
  </div>
</template>

  <script setup>
  import { ref, computed } from 'vue'
  import axios from 'axios';
  import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';
  import MemberFilter from '@/components/member/MemberFilter.vue';
  
  const selectedTutor = ref(null);
  const currentPage = ref(1);
  const pageSize = 15; // 한 페이지당 보여줄 항목 수
  const tutorDetail = ref(null);
  const isLoading = ref(false);

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

  
  const loadTutorDetail = async () => {
  if (!selectedTutor.value) return;
  
  isLoading.value = true;
  tutorDetail.value = null;
  
  tutorDetail.value = {
  memberDTO: {
    name: "김용승",
    email: "dhkdkd12@gmail.com",
    phone: "010-9090-2020",
    birthDate: "2002-02-06",
    address: "서울특별시 강남구 선릉로 627"
  },
  tutorLectureDetailList: [
    {
      lectureCode: "LEC001",
      lectureTitle: "백엔드 고수가 되기싶은자, 나에게로 - 42강",
      videoCount: 42,
      totalStudents: 328
    },
    {
      lectureCode: "LEC002",
      lectureTitle: "자바(JAVA)를 잡아보자 - 40강",
      videoCount: 40,
      totalStudents: 256
    },
    {
      lectureCode: "LEC003",
      lectureTitle: "자바를 기초부터! JAVA BASIC - 22강",
      videoCount: 22,
      totalStudents: 415
    },
    {
      lectureCode: "LEC004",
      lectureTitle: "스프링부트 마스터 클래스 - 35강",
      videoCount: 35,
      totalStudents: 281
    }
  ]
};

isLoading.value = false;

  // try {
  //   const response = await axios.get(`/tutor/${selectedTutor.value.code}`)
  //   tutorDetail.value = response.data
  // } catch (error) {
  //   console.error('Failed to load tutor detail:', error)
  // } finally {
  //   isLoading.value = false
  // }
}

  const showDetail = (tutor) => {
    if (selectedTutor.value?.code === tutor.code) {
      selectedTutor.value = null;
      tutorDetail.value = null;
    } else {
      selectedTutor.value = tutor

    // loadTutorDetail 로직 통합
    isLoading.value = true;
    tutorDetail.value = null;
    
    tutorDetail.value = {
      memberDTO: {
        name: "김용승",
        email: "dhkdkd12@gmail.com",
        phone: "010-9090-2020",
        birthDate: "2002-02-06",
        address: "서울특별시 강남구 선릉로 627"
      },
      tutorLectureDetailList: [
        {
          lectureCode: "LEC001",
          lectureTitle: "백엔드 고수가 되기싶은자, 나에게로 - 42강",
          videoCount: 42,
          totalStudents: 328
        },
        {
          lectureCode: "LEC002",
          lectureTitle: "자바(JAVA)를 잡아보자 - 40강",
          videoCount: 40,
          totalStudents: 256
        },
        {
          lectureCode: "LEC003",
          lectureTitle: "자바를 기초부터! JAVA BASIC - 22강",
          videoCount: 22,
          totalStudents: 415
        },
        {
          lectureCode: "LEC004",
          lectureTitle: "스프링부트 마스터 클래스 - 35강",
          videoCount: 35,
          totalStudents: 281
        }
      ]
    };
    
    isLoading.value = false;
    
    // API 연동 시에는 아래 코드 사용
    // try {
    //   const response = await axios.get(`/tutor/${selectedTutor.value.code}`)
    //   tutorDetail.value = response.data
    // } catch (error) {
    //   console.error('Failed to load tutor detail:', error)
    // } finally {
    //   isLoading.value = false
    // }
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
  padding: 10px 10px 10px 20px;
  width: 100%;
  white-space: nowrap; /* 줄바꿈 방지 */
  background-color: #f8f9fa;
}

  
  .tutor-content-section {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  
  .tutor-table-container {
  display: flex;
  flex-direction: column; /* 수직 방향으로 배치 */
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
  }
  
  .tutor-table-container.shrink {
    flex: 0 0 50%;
  }

  .tutor-detail-container {
  flex: 0 0 40%; /* 50%에서 40%로 변경 */
  opacity: 1;
  transform: translateX(0);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
  
.tutor-info-item {
  display: flex;
  gap: 20px;
}
  
.tutor-label {
  color: #64748b;
  min-width: 100px; /* 레이블 너비 통일 */
  text-align: left;
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
  align-items: center;
  gap: 10px;
}
  
  .tutor-excel-button {
    display: flex;
    align-items: center;
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



  .tutor-lectures {
  margin-top: 20px;
}

.lecture-item {
  padding: 8px 8px 8px 100px; /* 왼쪽 패딩을 레이블과 맞춤 */
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.lecture-item {
  padding: 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.tutor-detail-content h4 {
  margin: 20px 0 10px 0;
  color: #64748b;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
}

/* shrink 클래스가 적용될 때 헤더도 함께 줄어들도록 수정 */
.tutor-table-container.shrink .header-container {
  width: 100%;
}

.tutor-table-container.shrink {
  flex: 0 0 50%;
}
  </style>