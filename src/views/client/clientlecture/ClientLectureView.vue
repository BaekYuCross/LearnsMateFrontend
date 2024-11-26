<template>
    <div class="clientlecture-app-container">
      <ClientHeader />
      <InactivityModal
        v-if="showActivityModal"
        :show="showActivityModal"
        @continue="closeActivityModal"
        @logout="activityLogout"
      />
  
      <!-- 카테고리 섹션 -->
      <div class="clientlecture-course-category">
        <button class="category-button active">
          <img src="@/assets/icons/all.svg" alt="전체" />
          <span>전체</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/back.svg" alt="백엔드" />
          <span>백엔드</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/front.svg" alt="프론트엔드" />
          <span>프론트엔드</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/infra.svg" alt="데브옵스/인프라" />
          <span>데브옵스/인프라</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/db.svg" alt="데이터베이스" />
          <span>데이터베이스</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/web.svg" alt="웹 개발" />
          <span>웹 개발</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/app.svg" alt="모바일 앱 개발" />
          <span>모바일 앱 개발</span>
        </button>
        <button class="category-button">
          <img src="@/assets/icons/fullstack.svg" alt="풀스택" />
          <span>풀스택</span>
        </button>
      </div>

      <!-- 필터 섹션 -->
      <div class="clientlecture-course-filters">
        <button class="filter-button">🔍 기술 스택</button>
        <select class="filter-dropdown">
          <option>난이도</option>
          <option>초급</option>
          <option>중급</option>
          <option>고급</option>
        </select>
        <select class="filter-dropdown">
          <option>가격</option>
          <option>낮은 가격순</option>
          <option>높은 가격순</option>
        </select>
      </div>
  
      <!-- 강의 카드 섹션 -->
      <div class="clientlecture-course-grid">
        <div
          class="course-card"
          v-for="course in courses"
          :key="course.id"
          @click="goToCourse(course.id)"
        >
          <img class="course-thumbnail" :src="course.image" alt="Course Thumbnail" />
          <h3 class="course-title">{{ course.title }}</h3>
          <p class="course-meta">{{ course.meta }}</p>
          <p class="course-discount">
            <span class="discount-rate">{{ course.discount }}</span> <span class="discounted-price">{{ course.discountedPrice }}</span>
          </p>
          <p class="course-original-price">{{ course.originalPrice }}</p>
          <p class="course-stats">
            ⭐ {{ course.rating }} &nbsp;👨‍🎓 {{ course.students }}
          </p>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <div class="clientlecture-pagination">
        <button
          class="clientlecture-page-button prev-button"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          ◀ 이전
        </button>
        <span v-for="page in visiblePages" :key="page" class="clientlecture-page-number">
          <button
            class="clientlecture-page-button"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </span>
        <button
          class="clientlecture-page-button next-button"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          다음 ▶
        </button>
      </div>
    </div>
</template>

  
<script setup>
import ClientHeader from "@/components/client/ClientHeader.vue";
import { useRouter } from "vue-router";
import lecturePhoto from '@/assets/icons/lecturephoto.svg';
import JavaScript from '@/assets/icons/JavaScript.svg';
import React from '@/assets/icons/React.svg';
import Nodejs from '@/assets/icons/Nodejs.svg';
import MySQL from '@/assets/icons/MySQL.svg';
import HTML from '@/assets/icons/HTML.svg';
import DevOps from '@/assets/icons/DevOps.svg';
import Spring from '@/assets/icons/Spring.svg';
import Android from '@/assets/icons/Android.svg';
import Full from '@/assets/icons/Full.svg';
import { ref, computed } from "vue";
import InactivityModal from '@/components/client/InactivityModal.vue';
import { useActivityMonitor } from '@/components/client/useActivityMonitor';

const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(1/12);

const router = useRouter();

// 강의 데이터 (10개 생성)
const courses = [
  {
    id: 1,
    image: lecturePhoto,
    title: "Python 완벽 가이드",
    meta: "초급부터 중급까지 배우는 Python",
    discount: "(30% 할인)",
    discountedPrice: "₩29,400",
    originalPrice: "₩42,000",
    rating: "4.8 (100+)",
    students: "200+",
  },
  {
    id: 2,
    image: JavaScript,
    title: "JavaScript 실전 입문",
    meta: "웹 개발 필수 언어 배우기",
    discount: "(25% 할인)",
    discountedPrice: "₩30,000",
    originalPrice: "₩40,000",
    rating: "4.7 (200+)",
    students: "300+",
  },
  {
    id: 3,
    image: React,
    title: "React & Redux 마스터",
    meta: "최신 프론트엔드 기술 배우기",
    discount: "(20% 할인)",
    discountedPrice: "₩36,000",
    originalPrice: "₩45,000",
    rating: "4.9 (150+)",
    students: "250+",
  },
  {
    id: 4,
    image: Nodejs,
    title: "Node.js 백엔드 기초",
    meta: "효율적인 서버 구축 배우기",
    discount: "(35% 할인)",
    discountedPrice: "₩26,000",
    originalPrice: "₩40,000",
    rating: "4.6 (120+)",
    students: "180+",
  },
  {
    id: 5,
    image: MySQL,
    title: "MySQL 데이터베이스 입문",
    meta: "데이터 관리와 활용 배우기",
    discount: "(30% 할인)",
    discountedPrice: "₩28,000",
    originalPrice: "₩40,000",
    rating: "4.5 (90+)",
    students: "150+",
  },
  {
    id: 6,
    image: HTML,
    title: "HTML & CSS 완벽 가이드",
    meta: "웹 사이트 기초부터 제작까지",
    discount: "(40% 할인)",
    discountedPrice: "₩24,000",
    originalPrice: "₩40,000",
    rating: "4.8 (200+)",
    students: "300+",
  },
  {
    id: 7,
    image: DevOps,
    title: "DevOps 도구와 활용",
    meta: "CI/CD 파이프라인 실습",
    discount: "(20% 할인)",
    discountedPrice: "₩32,000",
    originalPrice: "₩40,000",
    rating: "4.7 (110+)",
    students: "210+",
  },
  {
    id: 8,
    image: Spring,
    title: "Spring Boot 완전 정복",
    meta: "백엔드 애플리케이션 개발",
    discount: "(25% 할인)",
    discountedPrice: "₩37,500",
    originalPrice: "₩50,000",
    rating: "4.9 (150+)",
    students: "280+",
  },
  {
    id: 9,
    image: Android,
    title: "Android 앱 개발 초급",
    meta: "안드로이드 앱 제작 배우기",
    discount: "(30% 할인)",
    discountedPrice: "₩31,500",
    originalPrice: "₩45,000",
    rating: "4.6 (130+)",
    students: "190+",
  },
  {
    id: 10,
    image: Full,
    title: "Full Stack 개발자 도전",
    meta: "프론트부터 백엔드까지",
    discount: "(30% 할인)",
    discountedPrice: "₩40,000",
    originalPrice: "₩60,000",
    rating: "5.0 (200+)",
    students: "500+",
  },
];

// 강의 클릭 시 이동
const goToCourse = (id) => {
  router.push(`/client-lecturedetail/${id}`); // 강의 상세 페이지로 이동
};


const currentPage = ref(1); // 현재 페이지
const totalPages = ref(155); // 총 페이지 수
const maxVisiblePages = 5; // 한 번에 보여줄 페이지 버튼 수


// 현재 페이지를 기준으로 동적으로 페이지 버튼 목록 계산
const visiblePages = computed(() => {
  const pages = [];
  const startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// 페이지 변경 핸들러
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    console.log(`현재 페이지: ${page}`);
    // 여기서 서버 요청으로 해당 페이지 데이터를 가져오면 됨
  }
};

</script>

<style lang="scss">
.clientlecture-app-container {
  background-color: #ffffff;
  height: 100vh;
  overflow-y: auto;
}

.clientlecture-app-container::-webkit-scrollbar {
  width: 6px;
}

.clientlecture-app-container::-webkit-scrollbar-thumb {
  background-color: #7671f4;
  border-radius: 10px;
}

.clientlecture-app-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
  border-radius: 10px;
}

.clientlecture-course-category {
  display: flex;
  justify-content: center;
  gap: 80px; /* 간격 넓힘 */
  margin: 30px 0;
}

.category-button {
  background: none;
  border: none;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.category-button img {
  display: block;
  margin: 0 auto 5px;
  width: 50px;
  height: 50px;
}

.category-button.active span {
  color: #7671f4;
  font-weight: bold;
}

.category-button.active {
  color: #7671f4;
  border: 1px solid #7671f4;
  border-radius: 20px;
  padding: 10px;
  font-weight: bold;
}

.clientlecture-course-filters {
  display: flex;
  justify-content: flex-start;
  gap: 20px; 
  margin: 10px 20px;
}

.filter-button {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 5px 15px;
  cursor: pointer;
  font-size: 14px;
}

.filter-dropdown {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 5px 15px;
  font-size: 14px;
}

.clientlecture-course-grid {
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 한 줄에 5개 */
  gap: 20px;
  padding: 20px;
}

.course-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  text-align: center;
  cursor: pointer;
}

.course-thumbnail {
  width: 100%; 
  max-width: 180px;
  height: 180px;
  object-fit: cover; 
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}

.course-thumbnail:hover {
  transform: scale(1.05); 
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2); 
}

.course-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0 5px;
}

.course-meta {
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  margin-bottom: 10px;
}

.course-discount {
  font-size: 14px;
  color: #e60023;
  font-weight: bold;
  margin: 5px 0;
}

.course-original-price {
  font-size: 12px;
  color: #000000;
  font-weight: bold;
  text-decoration: line-through;
  margin: 5px 0;
}

.course-stats {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
}

/* 페이지네이션 */
.clientlecture-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.clientlecture-page-button {
  background: none;
  border: none;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  padding: 5px 10px;
}

.clientlecture-page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.clientlecture-page-numbers {
  margin: 0 10px;
  font-size: 16px;
}

</style>

  