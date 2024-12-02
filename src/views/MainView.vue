<template>
  <div class="dashboard-container">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <div class="loading-text">데이터를 불러오는 중입니다...</div>
    </div>
    <div v-else>
    <!-- 상단 카드 섹션 -->
      <div class="top-section">
        <!-- 고객 섹션 -->
        <div class="card">
          <h3>고객</h3>
          <ul>
            <li v-for="member in formattedMembers" :key="member.memberCode">
              [{{ member.memberType }}] {{ member.memberName }} / {{ member.createdAt }}
            </li>
          </ul>
          <a href="/student" class="more-link">+ 더보기</a>
        </div>

        <!-- 할 일 섹션 -->
        <div class="card">
          <h3>할 일</h3>
          <ul>
            <li v-for="task in tasks" :key="task.name">{{ task.name }}</li>
          </ul>
          <a href="/tasks" class="more-link">+ 더보기</a>
        </div>

        <!-- 전년도 동월 매출액 비교 섹션 -->
        <div class="card">
          <h3>전년 동월 대비 매출액</h3>
          <ul>
            <li v-for="notice in notices" :key="notice.title">
              [{{ notice.type }}] {{ notice.title }}
            </li>
          </ul>
          <a href="/announcements" class="more-link">+ 더보기</a>
        </div>
      </div>

      <!-- 중앙 섹션 -->
      <div class="center-section">
        <!-- 강의 섹션 -->
        <div class="card full-width">
          <h3>강의</h3>
          <ul>
            <li v-for="lecture in lectures" :key="lecture.lecture_code">
              [강사] {{ lecture.tutor_name }} / {{ lecture.lecture_title }}
              <span class="rating">({{ lecture.lecture_category_name }}) {{ lecture.rating }} ★★★★★</span>
            </li>
          </ul>
          <a href="/lecture" class="more-link">+ 더보기</a>
        </div>

        <!-- 계약 섹션 -->
        <div class="card full-width">
          <h3>계약</h3>
          <p><strong>[담당자]</strong> {{ contracts.manager }} - {{ contracts.client }}</p>
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
              <div class="voc-section">
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

        <!-- 신규 영업활동 -->
        <div class="card small">
          <h3>TOP3 강의 카테고리</h3>
          <div class="chart-stats">
            <CategoryBarChart v-if="categories.length > 0" :categories="categories" />
          </div>
        </div>

        <!-- 매출/견적 -->
        <div class="card small">
          <h3>매출/견적</h3>
          <div class="stats">
            <div>견적: {{ sales.quotes }}</div>
            <div>매출: {{ sales.revenue }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted  } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import CategoryBarChart from '@/components/main/CategoryBarChart.vue';

const router = useRouter();

// 고객 데이터 타입 이름 등록일
const members = ref([]);

// 할 일 데이터
const tasks = ref([
  { name: '10시 정기 회의' },
  { name: '미답변 VOC처리 및 고객 피드백 반영 사항 확인' },
  { name: '[계약 유지] 백경석 - 최종 확인' },
]);

// 공지사항 데이터
const notices = ref([
  { type: '필독', title: '쿠폰 등록 공지' },
  { type: '필독', title: 'VOC 답변 매뉴얼 공지' },
  { type: '마케팅부', title: '캠페인 템플릿 작성 요령' },
]);

// 강의 데이터
const lectures = ref([]);

// 계약 데이터
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

// 미답변 VOC 데이터
const unansweredVOCs = ref({});

// 마케팅 데이터
const marketing = ref({});

// TOP3강의카테고리 데이터
const categories = ref([]); 

// 매출 데이터
const sales = ref({
  quotes: 4,
  revenue: 0,
});

const loading = ref(true);

const fetchMembers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      params: {
        page: 0,
        size: 3, 
        sort: 'created_at,DESC', 
      },
      withCredentials: true,
    });

    members.value = response.data.content; 
    console.log('최근 등록된 멤버 데이터:', members.value);
  } catch (error) {
    console.error('Failed to fetch members:', error);
  }
};

// 전년 동월 대비 매출액 비교


const fetchLectures = async () => {
  try { 
    const response = await axios.get('http://localhost:5000/lecture/list',{
      params: {
        page: 0,
        size: 3,
        sort: 'created_at,DESC'
      },
      withCredentials: true,
    })
    lectures.value = response.data.content;
    console.log('최근 등록된 강의 데이터:',lectures.value);
  } catch (error) {
    console.error('Failed to fetch lectures:', error);
  }
};

const formattedMembers = computed(() => {
  return members.value.map((member) => {
    return {
      ...member,
      memberType: member.memberType === 'STUDENT' ? '학생' : member.memberType,
      createdAt: new Date(member.createdAt).toISOString().split('T')[0], 
    };
  });
});

const fetchContract = async () => {
  try {
    const response = await axios.get('http://localhost:5000/contract-status/list', {
      withCredentials: true,
    });
    const contractList = response.data;
    if (contractList.length > 0) {
      const latestContract = contractList.reduce((latest, current) => {
        return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
      });
      console.log('가장 최근에 등록된 계약의 강의코드:', latestContract.lecture_code);
      latestLectureCode.value = latestContract.lecture_code;
      fetchContractLecture(latestLectureCode.value);
      countContracts(latestLectureCode.value);
    } else {
      console.log('계약 목록이 비어 있습니다.');
    }
  } catch (error) {
    console.error('계약 목록 조회 실패:', error);
  }
};

const countContracts = async (lectureCode) => {
  try { 
    const response = await axios.get(`http://localhost:5000/contract-status/lecture/${lectureCode}`,{
      withCredentials: true,
    })
    contracts.value = response.data;
    const contractsData = response.data; 
    const count = contractsData.length;
    console.log('최근 등록된 강의의 계약 데이터:',contracts.value);
    console.log('계약 과정의 개수:', count);

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
    console.log('업데이트된 계약 데이터:', contracts.value);
    if (contractsData.length > 0) {
      const lastContract = contractsData[contractsData.length - 1];
      const adminCode = lastContract.admin_code;
      console.log('마지막 계약의 admin_code:', adminCode);
      fetchContractAdmin(adminCode);
    }
  } catch (error) {
    console.error('Failed to fetch lectures:', error);
  }
};

const fetchContractAdmin = async (adminCode) => {
  try {
    const response = await axios.get(`http://localhost:5000/admin/${adminCode}`, {
      withCredentials: true,
    });
    const contractAdmin = response.data;
    console.log('계약담당직원 정보:', contractAdmin);
    contracts.value.manager = contractAdmin.admin_name;
    } 
   catch (error) {
    console.error('계약담당직원 조회 실패:', error);
  }
};

const fetchContractLecture = async (lectureCode) => {
  try {
    const response = await axios.get(`http://localhost:5000/lecture/${lectureCode}`,{
      withCredentials: true,
    });
    const contractLecture = response.data;
    contracts.value.client = contractLecture.tutor_name;
    console.log('계약강의 정보:', contractLecture);
  } catch (error) {
    console.error('계약강의 조회 실패:', error);
  }
};

const fetchUnansweredVOC = async () => {
    try {
      const response = await axios.get('http://localhost:5000/voc/unanswered', {
        method: 'GET',
        withCredentials: true,
      });
      unansweredVOCs.value = response.data.slice(0, 5);
      console.log('미답변voc 데이터:', unansweredVOCs.value);
    } catch (error) {
      console.error('Failed to fetch vocs:', error);
    }
};

const goToUnansweredVOCPage = () => {
  router.push({
    path: '/voc',
  });
};

const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:5000/campaign/campaigns', {
        method: 'GET',
        withCredentials: true,
        params: {
          page: 0,
          size: 5,
          sort: 'created_at,DESC'
        },
      });
      marketing.value = response.data.content;
      console.log('캠페인 데이터:', marketing.value);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

const goToCampaignDetail = (campaignCode) => {
  router.push({
    path: '/marketing/campaign',
    query: { campaignCode: campaignCode }
  });
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
  return categoryMap[category] || category; // 매핑되지 않은 경우 원래 이름 반환
};

const fetchCategoryRatio = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/category-ratio', {
      withCredentials: true,
    });

    const sortedCategories = response.data.sort((a, b) => b.percentage - a.percentage);

    // 데이터 가공
    categories.value = sortedCategories.slice(0, 3).map((item) => ({
      name: translateCategory(item.category), // 사용자 친화적인 이름으로 변환
      ratio: item.percentage, // percentage를 ratio로 매핑
    }));

    console.log("TOP3 카테고리:", categories.value);
  } catch (error) {
    console.error('카테고리 비율 데이터를 불러오는데 실패했습니다:', error);
  }
};






// OnMounted - 전체 로딩 관리
onMounted(async () => {
  try {
    await Promise.all([
      fetchMembers(),
      fetchLectures(),
      fetchContract(),
      fetchUnansweredVOC(),
      fetchCampaigns(),
      fetchCategoryRatio(),
    ]);
  } catch (error) {
    console.error('데이터 로딩 중 오류 발생:', error);
  } finally {
    loading.value = false; 
  }
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
.voc-section {
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
