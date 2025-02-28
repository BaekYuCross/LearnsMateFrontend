<template>
  <div class="dashboard-container">
    <!-- 상단 카드 섹션 -->
    <div class="top-section">
      <!-- 고객 섹션 -->
      <div class="card">
        <h3>고객</h3>
        <ul>
          <li v-for="member in formattedMembers" :key="member.memberCode">
            [{{ member.memberType }}]&nbsp; {{ member.memberName }} &nbsp;| &nbsp;{{ member.createdAt }} &nbsp;|&nbsp; {{ member.memberEmail }}
          </li>
        </ul>
        <a href="/student" class="more-link">+ 더보기</a>
      </div>

      <!-- 전날 가입한 회원수 섹션 -->
      <div class="card">
        <h3>전날 가입한 회원수</h3>
        <div class="yesterday-stats">
          <div class="stat-item">
            <p class="yesterday-p">학생</p>
            <p class="stat-value">
              <span class="highlight">{{ yesterdayStudentCount }}</span>
              /{{ totalStudentCount }}
            </p>
          </div>
          <div class="stat-item">
            <p class="yesterday-p">강사</p>
            <p class="stat-value">
              <span class="highlight">{{ yesterdayTutorCount }}</span>
              /{{ totalTutorCount }}
            </p>
          </div>
        </div>       
      </div>

      <!-- 전년도 동월 매출액 비교 섹션 -->
      <div class="card">
        <h3>전년 동월 대비 매출액</h3>
        <div class="stat">
          <Suspense>
            <RevenueComparisonChart :revenueData="revenueData" />
            <template #fallback>
              <div>Loading chart...</div>
            </template>
          </Suspense>
        </div>
      </div>
    </div>

    <!-- 중앙 섹션 -->
    <div class="center-section">
      <!-- 강의 섹션 -->
      <div class="card full-width">
        <h3>강의</h3>
        <ul>
          <li v-for="lecture in formattedTutors" :key="lecture.lecture_code">
            [강사] {{ lecture.tutor_name }} / {{ lecture.lecture_title }}
            <span class="rating">({{ lecture.lecture_category_name }}) {{ lecture.rating }} ★★★★★</span>
          </li>
        </ul>
        <a href="/lecture" class="more-link">+ 더보기</a>
      </div>

      <!-- 계약 섹션 -->
      <div class="card full-width">
        <h3>계약</h3>
        <p><strong>[담당자]</strong> {{ contracts.manager }} - {{ formattedContract.client }}</p>
        <div class="contract-status">
          <div
            class="step"
            v-for="(step, index) in contracts.steps"
            :key="index"
            :class="{ active: step.active, current: step.current }"
          >
            {{ step.name }}
          </div>
        </div>
        <a href="/contract-process" class="more-link">{{ contracts.progress }}</a>
      </div>
    </div>

    <!-- 하단 섹션 -->
    <div class="bottom-section">
      <!-- 미답변 VOC 섹션 -->
      <div class="card small">
        <h3>미답변 VOC</h3>
        <ul>
          <li v-for="(unansweredVOC, index) in unansweredVOCs" :key="index">
            <div class="main-voc-section">
              <p class="voc-contents">[{{ unansweredVOC.voc_category_name }}] - {{ unansweredVOC.voc_content }}</p>
              <button class="detail-button" @click="goToUnansweredVOCPage(unansweredVOC.voc_code)">자세히</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- 마케팅 섹션 -->
      <div class="card small">
        <h3>마케팅</h3>
        <ul>
          <li v-for="(campaign, index) in marketing" :key="index">
            {{ campaign.admin_name }} - {{ campaign.campaign_title }} [{{ campaign.campaign_type }}]
            <button class="detail-button" @click="goToCampaignDetail(campaign.campaign_code)">자세히</button>
          </li>
        </ul>
      </div>

      <!-- TOP3 강의 카테고리 -->
      <div class="card small">
        <h3>TOP3 강의 카테고리</h3>
        <div class="chart-stats">
          <Suspense>
            <CategoryBarChart v-if="categories.length > 0" :categories="categories" />
            <template #fallback>
              <div>Loading chart...</div>
            </template>
          </Suspense>
        </div>
      </div>

      <!-- 예비 블랙리스트 -->
      <div class="card small">
        <h3>예비 블랙리스트</h3>
        <ul>
          <li v-for="(reserved, index) in formattedReservedStudents" :key="index">
            {{ reserved.member_name }} - 신고횟수: {{ reserved.report_count }}
          </li>
          <a href="/student/blacklist/reserved" class="more-link">+ 더보기</a>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const CategoryBarChart = defineAsyncComponent(() => 
  import('@/components/main/CategoryBarChart.vue')
);
const RevenueComparisonChart = defineAsyncComponent(() => 
  import('@/components/main/RevenueComparisonChart.vue')
);

const router = useRouter();

// Loading states for each section
const loadingStates = ref({
  members: true,
  memberCounts: true,
  revenue: true,
  lectures: true,
  contracts: true,
  voc: true,
  marketing: true,
  categories: true,
  reservedList: true
});

// Data refs
const members = ref([]);
const yesterdayStudentCount = ref(0);
const totalStudentCount = ref(0);
const yesterdayTutorCount = ref(0);
const totalTutorCount = ref(0);
const revenueData = ref([]);
const lectures = ref([]);
const reservedList = ref([]);
const latestLectureCode = ref('');
const contracts = ref({
  manager: '',
  client: '',
  steps: [
    { name: '강의정보 입력 확인', active: false, current: false },
    { name: '커리큘럼 검토', active: false, current: false },
    { name: '강의 커버 이미지 확인', active: false, current: false },
    { name: '강의 검토', active: false, current: false },
    { name: '약관 동의 요청', active: false, current: false },
    { name: '정산 정보 확인', active: false, current: false },
    { name: '최종 승인', active: false, current: false },
  ],
  progress: '0/7 완료',
});
const unansweredVOCs = ref({});
const marketing = ref({});
const categories = ref([]);

// Fetch functions with loading state management
const fetchMembers = async () => {
  loadingStates.value.members = true;
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      params: {
        page: 0,
        size: 5,
        sort: 'created_at,DESC',
      },
      withCredentials: true,
    });
    members.value = response.data.content;
  } catch (error) {
    console.error('Failed to fetch members:', error);
  } finally {
    loadingStates.value.members = false;
  }
};

const fetchMemberCounts = async () => {
  loadingStates.value.memberCounts = true;
  try {
    const [studentResponse, tutorResponse] = await Promise.all([
      axios.get("http://localhost:5000/member/count", {
        params: { type: "student" },
        withCredentials: true,
      }),
      axios.get("http://localhost:5000/member/count", {
        params: { type: "tutor" },
        withCredentials: true,
      })
    ]);
    
    yesterdayStudentCount.value = studentResponse.data.yesterdayCount;
    totalStudentCount.value = studentResponse.data.totalCount;
    yesterdayTutorCount.value = tutorResponse.data.yesterdayCount;
    totalTutorCount.value = tutorResponse.data.totalCount;
  } catch (error) {
    console.error("Failed to fetch member counts:", error);
  } finally {
    loadingStates.value.memberCounts = false;
  }
};

const fetchRevenueData = async () => {
  loadingStates.value.revenue = true;
  try {
    const response = await axios.get('http://localhost:5000/payments', {
      params: { page: 0, size: 50 },
      withCredentials: true,
    });

    const data = response.data.graphData;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth - 1 || 12;
    const previousYear = previousMonth === 12 ? currentYear - 1 : currentYear;

    revenueData.value = [
      {
        year: currentYear - 1,
        month: currentMonth,
        revenue: data[currentYear - 1]?.find((item) => item.month === currentMonth)?.totalRevenue || 0,
      },
      {
        year: currentYear,
        month: currentMonth,
        revenue: data[currentYear]?.find((item) => item.month === currentMonth)?.totalRevenue || 0,
      },
      {
        year: currentYear - 1,
        month: previousMonth,
        revenue: data[currentYear - 1]?.find((item) => item.month === previousMonth)?.totalRevenue || 0,
      },
      {
        year: currentYear,
        month: previousMonth,
        revenue: data[currentYear]?.find((item) => item.month === previousMonth)?.totalRevenue || 0,
      },
    ];
  } catch (error) {
    console.error('Failed to fetch revenue data:', error);
  } finally {
    loadingStates.value.revenue = false;
  }
};

const fetchLectures = async () => {
  loadingStates.value.lectures = true;
  try {
    const response = await axios.get('http://localhost:5000/lecture/list', {
      params: {
        page: 0,
        size: 3,
        sort: 'created_at,DESC'
      },
      withCredentials: true,
    });
    lectures.value = response.data.content.map(lecture => ({
      ...lecture,
      lecture_category_name: translateCategory(lecture.lecture_category_name)
    }));
  } catch (error) {
    console.error('Failed to fetch lectures:', error);
  } finally {
    loadingStates.value.lectures = false;
  }
};

const fetchContractData = async () => {
  loadingStates.value.contracts = true;
  try {
    const response = await axios.get('http://localhost:5000/contract-status/list', {
      withCredentials: true,
    });
    const contractList = response.data;
    if (contractList.length > 0) {
      const latestContract = contractList.reduce((latest, current) => {
        return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
      });
      latestLectureCode.value = latestContract.lecture_code;
      await Promise.all([
        fetchContractLecture(latestLectureCode.value),
        countContracts(latestLectureCode.value)
      ]);
    }
  } catch (error) {
    console.error('Failed to fetch contract list:', error);
  } finally {
    loadingStates.value.contracts = false;
  }
};

const countContracts = async (lectureCode) => {
  try {
    const response = await axios.get(`http://localhost:5000/contract-status/lecture/${lectureCode}`, {
      withCredentials: true,
    });
    contracts.value = response.data;
    const contractsData = response.data;
    const count = contractsData.length;

    if (!contracts.value.steps || !Array.isArray(contracts.value.steps)) {
      contracts.value.steps = [
        { name: '강의 정보\n입력 확인', active: false, current: false },
        { name: '커리큘럼 검토', active: false, current: false },
        { name: '강의 커버\n이미지 확인', active: false, current: false },
        { name: '강의 검토', active: false, current: false },
        { name: '약관 동의 요청', active: false, current: false },
        { name: '정산 정보 확인', active: false, current: false },
        { name: '최종 승인', active: false, current: false },
      ];
    }

    contracts.value.steps = contracts.value.steps.map((step, index) => ({
      ...step,
      active: index < count,
      current: index === count,
    }));

    contracts.value.progress = `${count}/${contracts.value.steps.length} 완료`;

    if (contractsData.length > 0) {
      const lastContract = contractsData[contractsData.length - 1];
      const adminCode = lastContract.admin_code;
      await fetchContractAdmin(adminCode);
    }
  } catch (error) {
    console.error('Failed to count contracts:', error);
  }
};

const fetchContractAdmin = async (adminCode) => {
  try {
    const response = await axios.get(`http://localhost:5000/admin/${adminCode}`, {
      withCredentials: true,
    });
    const contractAdmin = response.data;
    contracts.value.manager = contractAdmin.admin_name;
  } catch (error) {
    console.error('Failed to fetch contract admin:', error);
  }
};

const fetchContractLecture = async (lectureCode) => {
  try {
    const response = await axios.get(`http://localhost:5000/lecture/${lectureCode}`, {
      withCredentials: true,
    });
    const contractLecture = response.data;
    contracts.value.client = contractLecture.tutor_name;
  } catch (error) {
    console.error('Failed to fetch contract lecture:', error);
  }
};

const fetchUnansweredVOC = async () => {
  loadingStates.value.voc = true;
  try {
    const response = await axios.get('http://localhost:5000/voc/unanswered', {
      withCredentials: true,
    });
    unansweredVOCs.value = response.data.slice(0, 5);
  } catch (error) {
    console.error('Failed to fetch unanswered VOCs:', error);
  } finally {
    loadingStates.value.voc = false;
  }
};

const fetchCampaigns = async () => {
  loadingStates.value.marketing = true;
  try {
    const response = await axios.get('http://localhost:5000/campaign/campaigns', {
      params: {
        page: 0,
        size: 5,
        sort: 'created_at,DESC'
      },
      withCredentials: true,
    });
    marketing.value = response.data.content.map(campaign => ({
      ...campaign,
      campaign_type: translateCampaignType(campaign.campaign_type)
    }));
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
  } finally {
    loadingStates.value.marketing = false;
  }
};

const fetchCategoryRatio = async () => {
  loadingStates.value.categories = true;
  try {
    const response = await axios.get('http://localhost:5000/member/category-ratio', {
      withCredentials: true,
    });
    const sortedCategories = response.data.sort((a, b) => b.percentage - a.percentage);
    categories.value = sortedCategories.slice(0, 3).map((item) => ({
      name: translateCategory(item.category),
      ratio: item.percentage,
    }));
  } catch (error) {
    console.error('Failed to fetch category ratios:', error);
  } finally {
    loadingStates.value.categories = false;
  }
};

const fetchReservedList = async () => {
  loadingStates.value.reservedList = true;
  try {
    const response = await axios.get(`http://localhost:5000/blacklist/student/reserved`, {
      withCredentials: true,
      params: {
        page: 0,
        size: 5,
        sort: 'created_at,DESC',
      },
    });
    reservedList.value = response.data.content;
  } catch (error) {
    console.error('Failed to fetch reserved list:', error);
  } finally {
    loadingStates.value.reservedList = false;
  }
};

// Utility functions
const maskEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  
  let maskedLocalPart;
  if (localPart.length <= 4) {
    maskedLocalPart = localPart.slice(0, -1) + '*';
  } else {
    maskedLocalPart = localPart.slice(0, 2) + '*'.repeat(localPart.length - 2);
  }
  
  return `${maskedLocalPart}@${domain}`;
};

const maskName = (name) => {
  if (!name) return '';
  
  if (name.length === 2) {
    return name.charAt(0) + '*';
  }
  
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
};

const translateCampaignType = (type) => {
  const campaignTypeMap = {
    INSTANT: '즉시발송',
    RESERVATION: '예약발송',
  };
  return campaignTypeMap[type] || type;
};

const translateCategory = (category) => {
  const categoryMap = {
    BACKEND: '백엔드',
    FRONTEND: '프론트엔드',
    DEVOPS: '데브옵스',
    DATABASE: '데이터베이스',
    WEB_DEVELOPMENT: '웹 개발',
    MOBILE_APP_DEVELOPMENT: '앱 개발',
    FULL_STACK: '풀스택',
  };
  return categoryMap[category] || category;
};

// Computed properties
const formattedMembers = computed(() => {
  return members.value.map((member) => ({
    ...member,
    memberType: member.memberType === 'STUDENT' ? '학생' : member.memberType,
    createdAt: new Date(member.createdAt).toISOString().split('T')[0],
    memberEmail: maskEmail(member.memberEmail),
    memberName: maskName(member.memberName)
  }));
});

const formattedTutors = computed(() => {
  return lectures.value.map((tutor) => ({
    ...tutor,
    tutor_name: maskName(tutor.tutor_name)
  }));
});

const formattedContract = computed(() => {
  return {
    ...contracts.value,
    client: maskName(contracts.value.client),
  };
});

const formattedReservedStudents = computed(() => {
  return reservedList.value.map((student) => ({
    ...student,
    member_name: maskName(student.member_name)
  }));
});

// Navigation functions
const goToUnansweredVOCPage = () => {
  router.push({
    path: '/voc',
  });
};

const goToCampaignDetail = (campaignCode) => {
  router.push({
    path: '/marketing/campaign',
    query: { campaignCode: campaignCode }
  });
};

// Lifecycle hooks
onMounted(() => {
  // 각 섹션별로 독립적으로 데이터 로딩
  fetchMembers();
  fetchMemberCounts();
  fetchRevenueData();
  fetchLectures();
  fetchContractData();
  fetchUnansweredVOC();
  fetchCampaigns();
  fetchCategoryRatio();
  fetchReservedList();
});
</script>

<style scoped>
/* 전체 컨테이너 */
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  background: #f8f9fa;
  font-family: 'Pretendard-Light';
  color: #333;
  padding-top: 70px;
  padding-left: 20px;
  padding-right: 20px;
}

/* 섹션 컨테이너 */
.top-section,
.center-section,
.bottom-section {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 20px;
}

/* 공통 카드 스타일 */
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1;
}

/* 카드 헤더 */
.card h3 {
  font-size: 18px;
  font-weight: bold;
  color: #005950;
  margin-bottom: 15px;
  border-bottom: 2px solid #005950;
  padding-bottom: 8px;
}

/* 리스트 스타일 */
.card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card ul li {
  font-size: 14px;
  margin-bottom: 10px;
  color: #555;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card ul li span {
  font-size: 12px;
  color: #999;
}
.main-voc-section {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  gap: 10px;
  width: 100%;
}
.voc-contents {
  flex-grow: 1; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  max-width: calc(100% - 80px); 
}

.detail-button {
  margin-left: 10px;
  color: #999;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
  flex-shrink: 0;  
}

.detail-button:hover {
  color: #007f6e; 
}

/* "더보기" 링크 스타일 */
.more-link {
  display: inline-block;
  margin-top: 10px;
  color: #005950;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
}

.more-link:hover {
  color: #007f6e;
}

/* 강의 평가 점수 스타일 */
.rating {
  font-size: 12px;
  color: #f39c12;
  margin-left: 5px;
}

/* 계약 진행 상태 */
.contract-status {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.step {
  display: flex; 
  justify-content: center; 
  align-items: center;
  padding: 10px 10px;
  border-radius: 8px;
  background: #e9ecef;
  color: #333;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  flex: 1;
  white-space: pre-line; 
}

.step.active {
  background: #005950;
  color: #fff;
  font-weight: bold;
}

.step.current {
  border: 2px solid #005950;
}

/* 하단 카드 */
.card.small {
  flex: 1;
  min-width: 200px;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}

.chart-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: 30px;
  gap: 10px;
}



.stats div {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.yesterday-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 30px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.yesterday-p {
  font-size: 20px;
  font-weight: bold;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.highlight {
  color: #005950; 
  font-size: 50px;
}


.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #005950;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 15px;
  font-size: 16px;
  color: #333;
}


</style>
