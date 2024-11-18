<template>
  <!--전체 view 컨테이너-->
  <div class="layout-container">

    <!--사이드 메뉴-->
    <div class="side-menu">
        <MemberSideMenu/>
    </div>

    <!-- 메인 컨텐츠-->
    <div class="main-content">
      <!--블랙리스트 필터-->
      <BlacklistFilter/>

      <!-- 전체 학생 블랙리스트 표시 -->
      <div class="student-blakclist-count">
        <span class="count-number">{{ blacklists.length }}</span>명
      </div>

      <div class="content-section" :class="{ 'with-detail': selectedBlacklist }">
        <div class="table-container" :class="{ 'shrink': selectedBlacklist }">
          <table>
            <thead>
              <tr>
                <th>블랙리스트 코드</th>
                <th>학생 코드</th>
                <th>학생 이름</th>
                <th>학생 이메일</th>
                <th>블랙리스트 사유</th>
                <th>정지일</th>
                <th>담당자</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="black in paginatedStudents" 
                :key="black.blackCode"
                @click="showDetail(black)"
                class="cursor-pointer hover:bg-gray-50"
                :class="{ 'selected': selectedBlack?.blackCode === black.blackCode }"
              >
                <td>{{ black.blackCode }}</td>
                <td>{{ black.memberCode }}</td>
                <td>{{ black.memberName }}</td>
                <td>{{ black.memberEmail }}</td>
                <td>{{ black.blackReason }}</td>
                <td>{{ black.createDate }}</td>
                <td>{{ black.adminName }}</td>
              </tr>
            </tbody>
          </table>

          <!-- 페이지네이션 -->
          <div class="pagination">
            <button 
              class="page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              ◀이전
            </button>
            <span v-for="page in totalPages" :key="page" class="page-number">
              <button 
                class="page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </span>
            <button 
              class="page-button next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >
              다음▶
            </button>
          </div>
        </div>

        <Transition name="slide-fade">
          <div v-if="selectedBlacklist" class="detail-container">
            <div class="detail-content">
              <h3>상세 정보</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">학생 코드:</span>
                  <span>{{ selectedBlacklist.memberCode }}</span>
                </div>
                <div class="info-item">
                  <span class="label">이름:</span>
                  <span>{{ selectedBlacklist.memberName }}</span>
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
import BlacklistFilter from '@/components/member/BlacklistFilter.vue';
import MemberSideMenu from '@/components/sideMenu/MemberSideMenu.vue';

const selectedBlack = ref(null);
const currentPage = ref(1);
const pageSize = 15; // 한 페이지당 보여줄 항목 수

const blacklists = ref([
    {
        blackCode: 1,
        memberCode: 11,
        memberName: '김철수',
        memberEmail: 'test@test.com',
        blackReason: '부적절한 언어 사용 및 신고누적',
        createDate: '1999-01-01',
        adminName: '김어드민'
    },
]);

// 더미 데이터 20개로 확장 -> 나중에 삭제해야함.
const expandData = () => {
  const baseData = blacklists.value.slice(0, 2); // 기본 2개 데이터
  for (let i = 3; i <= 20; i++) {
    blacklists.value.push({
      ...baseData[i % 2],
      code: `STD${String(i).padStart(3, '0')}`,
    });
  }
};
expandData();



// 페이지네이션 관련 computed 속성들
const totalPages = computed(() => Math.ceil(students.value.length / pageSize));

const paginatedStudents = computed(() => 
  blacklists.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);

// 페이지 변경 함수
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;

    // 페이지 변경 시 상세 정보창 닫기 -> 2페이지로 가면 상세정보창 자동으로 닫힘.
    selectedBlack.value = null;
  }
};

const showDetail = (black) => {
  // 현재 선택된 학생을 다시 클릭하면 선택 해제
  if (selectedBlack.value?.blackCode === black.blackCode) {
    selectedBlack.value = null
  } else {
    // 다른 학생을 클릭하면 해당 학생 선택
    selectedBlack.value = black
  }
};



</script>

<style scoped>

</style>