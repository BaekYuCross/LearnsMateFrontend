<template>
    <div>
      <ClientHeader />
      <InactivityModal
        v-if="showActivityModal"
        :show="showActivityModal"
        @continue="closeActivityModal"
        @logout="activityLogout"
      />
      <div class="clientmain-app-container">
        <div class="layout">
          <!-- 왼쪽 사이드바 -->
          <aside class="clientmylecture-sidebar">
            <nav>
              <ul>
                <li class="clientmylecture-menu-item" v-for="menu in menus" :key="menu.id">
                  <a :href="menu.link" class="clientmylecture-menu-link" :class="{ active: menu.active }">{{ menu.name }}</a>
                </li>
              </ul>
            </nav>
          </aside>
  
          <!-- 메인 콘텐츠 -->
          <main class="clientmylecture-main-content">
            <!-- 내 학습 헤더 -->
            <div class="clientmylecture-header">
              <h2 class="clientmylecture-section-title">내 학습</h2>
              <div class="clientmylecture-tabs">
                <button class="clientmylecture-tab-btn" :class="{ active: activeTab === '보유한 강의' }" @click="setActiveTab('보유한 강의')">보유한 강의</button>
                <button class="clientmylecture-tab-btn" :class="{ active: activeTab === '내 강의 폴더' }" @click="setActiveTab('내 강의 폴더')">내 강의 폴더</button>
                <button class="clientmylecture-tab-btn" :class="{ active: activeTab === '성장 로그' }" @click="setActiveTab('성장 로그')">성장 로그</button>
                <button class="clientmylecture-tab-btn" :class="{ active: activeTab === '수강 확인증' }" @click="setActiveTab('수강 확인증')">수강 확인증</button>
                <button class="clientmylecture-tab-btn" :class="{ active: activeTab === '수료증' }" @click="setActiveTab('수료증')">수료증</button>
              </div>
            </div>
  
            <!-- 필터 섹션 -->
            <div class="clientmylecture-filters">
              <div class="clientmylecture-category-filters">
                <button class="clientmylecture-filter-btn" v-for="filter in categoryFilters" :key="filter" @click="toggleCategory(filter)">
                  {{ filter }}
                </button>
              </div>
              <div class="clientmylecture-extra-filters">
                <label><input type="checkbox" v-model="onlyComplete" /> 완료 제외</label>
                <select v-model="sortOrder" class="clientmylecture-dropdown">
                  <option value="recent">최근 학습순</option>
                  <option value="rating">평점순</option>
                  <option value="students">수강생순</option>
                </select>
              </div>
              <input type="text" v-model="searchQuery" placeholder="강의명, 지식공유자 이름 검색" class="clientmylecture-search-input" />
            </div>
  
            <!-- 강의 카드 섹션 -->
            <div class="clientmylecture-course-grid">
              <div
                class="clientmylecture-card"
                v-for="course in courses"
                :key="course.id"
                @click="goToCourse(course.id)"
              >
                <img class="clientmylecture-thumbnail" :src="course.image" alt="Course Thumbnail" />
                <h3 class="clientmylecture-title">{{ course.title }}</h3>
                <p class="clientmylecture-meta">{{ course.meta }}</p>
                <p class="clientmylecture-discount">
                  <span class="clientmylecture-discount-rate">{{ course.discount }}</span> <span class="clientmylecture-discounted-price">{{ course.discountedPrice }}</span>
                </p>
                <p class="clientmylecture-original-price">{{ course.originalPrice }}</p>
                <p class="clientmylecture-stats">
                  ⭐ {{ course.rating }} &nbsp;👨‍🎓 {{ course.students }}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import ClientHeader from "@/components/client/ClientHeader.vue";
  import JavaScript from '@/assets/icons/JavaScript.svg';
  import MySQL from '@/assets/icons/MySQL.svg';
  import HTML from '@/assets/icons/HTML.svg';
  import Android from '@/assets/icons/Android.svg';
  import { ref, computed } from 'vue';
  import { useRouter } from "vue-router";
  import InactivityModal from '@/components/client/InactivityModal.vue';
  import { useActivityMonitor } from "@/composables/useActivityMonitor";

  const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(30);
  
  const router = useRouter(); // router 선언
  
  // 필터와 상태 관리
  const categoryFilters = ["온라인", "모바일/부트캠프"];
  const onlyComplete = ref(false);
  const sortOrder = ref("recent");
  const searchQuery = ref("");
  const activeTab = ref("보유한 강의");
  
  // 필터링된 강의 데이터
  const filteredCourses = computed(() => {
    return courses.value.filter(course => {
      const matchesSearch = course.title.includes(searchQuery.value);
      const matchesComplete = onlyComplete.value ? !course.completed : true;
      return matchesSearch && matchesComplete;
    });
  });
  
  // 활성 탭 변경 함수
  function setActiveTab(tab) {
    activeTab.value = tab;
  }
  
  // 강의로 이동 함수
  function goToCourse(courseId) {
    router.push(`/client-lecturedetail/:${courseId}`); // 마이페이지로 이동
  }
  
  // 강의 데이터 (10개 생성)
  const courses = [
    {
      id: 1,
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
      id: 4,
      image: MySQL,
      title: "MySQL 데이터베이스 입문",
      meta: "데이터 관리와 활용 배우기",
      discount: "(30% 할인)",
      discountedPrice: "₩28,000",
      originalPrice: "₩40,000",
      rating: "4.5 (90+)",
      students: "150+",
    },
  ];
  
  // 사이드바 메뉴 데이터
  const menus = [
    { id: 1, name: "대시보드", link: "#", active: false },
    { id: 2, name: "알림", link: "#", active: false },
    { id: 3, name: "학습 관리", link: "#", active: false },
    { id: 4, name: "내 학습", link: "#", active: true },
    { id: 5, name: "내 로드맵", link: "#", active: false },
    { id: 6, name: "강의 노트", link: "#", active: false },
    { id: 7, name: "멘토링", link: "#", active: false },
    { id: 8, name: "작성한 게시글", link: "#", active: false },
    { id: 9, name: "수강권 문의", link: "#", active: false },
    { id: 10, name: "수강 바구니", link: "#", active: false },
    { id: 11, name: "쿠폰함", link: "#", active: false },
    { id: 12, name: "좋아요", link: "#", active: false },
  ];
  </script>
  
  <style lang="scss" scoped>
  .clientmain-app-container {
    background-color: #ffffff;
    text-align: center;
  }
  
  .layout {
    display: flex;
  }
  
  /* 사이드바 스타일 */
  .clientmylecture-sidebar {
    width: 350px;
    background-color: #ffffff;
    border-right: 1px solid #ddd;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

    nav {
      ul {
        list-style: none;
        padding: 0;
      }
    }
  }
  
  .clientmylecture-menu-item {
    margin-bottom: 10px;
    text-align: left;
    padding-left: 40px;
    padding-right: 20px;
  }
  
  .clientmylecture-menu-link {
    display: block;
            padding: 10px 15px;
            text-decoration: none;
            color: #333;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
  
            &:hover {
                background-color: rgba(163, 160, 255, 0.3); 
              color: #7671f4;
            }
  
            &.active {
                background-color: rgba(163, 160, 255, 0.3); 
              color: #7671f4;
            }
          }
 
  
  .clientmylecture-main-content {
    flex: 1;
    padding: 20px;
  }
  
  /* 강의 카드 스타일 */
  .clientmylecture-course-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  .clientmylecture-card {
    background: #fff;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .clientmylecture-thumbnail {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .clientmylecture-main-content {
  padding: 20px;
  background-color: #ffffff;
}

/* 내 학습 헤더 */
.clientmylecture-header {
  margin-bottom: 20px;
  text-align: left;

  .clientmylecture-section-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .clientmylecture-tabs {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;

    .clientmylecture-tab-btn {
      padding: 10px 15px;
      font-size: 14px;
      color: #555;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: color 0.3s, border-color 0.3s;

      &:hover {
        color: #4a4aff;
      }

      &.active {
        color: #4a4aff;
        border-color: #4a4aff;
        font-weight: bold;
      }
    }
  }
}

/* 필터 섹션 */
.clientmylecture-filters {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;

  /* 카테고리 필터 */
  .clientmylecture-category-filters {
    display: flex;
    gap: 10px;

    .clientmylecture-filter-btn {
        margin-bottom: 10px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease;

      &:hover {
        background-color: #e6e6ff;
        color: #4a4aff;
      }
    }
  }

  /* 추가 필터 */
  .clientmylecture-extra-filters {
    display: flex;
    align-items: center;
    gap: 15px;

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      font-size: 14px;

      label {
        display: flex;
        align-items: center;
        gap: 5px;

        input[type="checkbox"] {
          cursor: pointer;
        }
      }
    }



    .clientmylecture-dropdown {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #ffffff;
      cursor: pointer;
    }
  }
}

    .clientmylecture-search-input {
      width: 350px;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #ffffff;
      transition: border-color 0.3s ease;

      &::placeholder {
        color: #aaa;
      }
    }

  </style>
  