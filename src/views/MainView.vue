<template>
  <div class="dashboard-container">
    <!-- 상단 카드 섹션 -->
    <div class="top-section">
      <!-- 고객 섹션 -->
      <div class="card">
        <h3>고객</h3>
        <ul>
          <li v-for="customer in customers" :key="customer.name">
            [{{ customer.type }}] {{ customer.name }} / {{ customer.date }}
          </li>
        </ul>
        <a href="/customer" class="more-link">+ 더보기</a>
      </div>

      <!-- 할 일 섹션 -->
      <div class="card">
        <h3>할 일</h3>
        <ul>
          <li v-for="task in tasks" :key="task.name">{{ task.name }}</li>
        </ul>
        <a href="/tasks" class="more-link">+ 더보기</a>
      </div>

      <!-- 공지사항 섹션 -->
      <div class="card">
        <h3>공지사항</h3>
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
          <li v-for="lecture in lectures" :key="lecture.title">
            [강사] {{ lecture.instructor }} / {{ lecture.title }}
            <span class="rating">({{ lecture.reviews }}) {{ lecture.rating }} ★★★★★</span>
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
      <!-- 일정 섹션 -->
      <div class="card small">
        <h3>일정</h3>
        <p>{{ schedules.info }}</p>
      </div>

      <!-- 마케팅 섹션 -->
      <div class="card small">
        <h3>마케팅</h3>
        <p>{{ marketing.info }}</p>
      </div>

      <!-- 신규 영업활동 -->
      <div class="card small">
        <h3>신규 영업활동</h3>
        <div class="stats">
          <div>강의: {{ activities.lectures }}</div>
          <div>학생: {{ activities.students }}</div>
          <div>강사: {{ activities.tutors }}</div>
          <div>영업기회: {{ activities.opportunities }}</div>
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
</template>

<script setup>
import { ref } from 'vue';

// 고객 데이터
const customers = ref([
  { type: '학생', name: '이나현', date: '2024.10.29' },
  { type: '강사', name: '김용승 / 비욘드', date: '2024.10.27' },
  { type: '학생', name: '조제훈', date: '2024.10.24' },
]);

// 할 일 데이터
const tasks = ref([
  { name: '10시 정기 회의' },
  { name: '[계약 유지] 제니 - 최종 확인' },
]);

// 공지사항 데이터
const notices = ref([
  { type: '필독', title: '쿠폰 템플릿 등록 공지' },
  { type: '필독', title: 'VOC 답변 매뉴얼 공지' },
]);

// 강의 데이터
const lectures = ref([
  { instructor: '김동승', title: '비트코드', reviews: 539, rating: 4.9 },
  { instructor: '김현범', title: '백엔드 재밌고 쉽게 배우기', reviews: 539, rating: 4.9 },
]);

// 계약 데이터
const contracts = ref({
  manager: '제니',
  client: '유제니',
  steps: [
    { name: '강의정보 입력 확인', active: true, current: false },
    { name: '커리큘럼 검토', active: true, current: false },
    { name: '강의 커버 이미지 확인', active: true, current: false },
    { name: '강의 검토', active: false, current: true },
    { name: '약관 동의 요청', active: false, current: false },
    { name: '정산 정보 확인', active: false, current: false },
    { name: '최종 승인', active: false, current: false },
  ],
  progress: '6/7 완료',
});

// 일정 데이터
const schedules = ref({ info: '표시할 정보가 없습니다.' });

// 마케팅 데이터
const marketing = ref({ info: '표시할 정보가 없습니다.' });

// 활동 데이터
const activities = ref({
  lectures: 5,
  students: 72,
  tutors: 4,
  opportunities: 16,
});

// 매출 데이터
const sales = ref({
  quotes: 4,
  revenue: 0,
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
  padding: 10px 15px;
  border-radius: 8px;
  background: #e9ecef;
  color: #333;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  flex: 1;
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

.stats div {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

</style>
