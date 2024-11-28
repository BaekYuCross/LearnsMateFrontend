<template>
    <div>
      <ClientHeader />
      <InactivityModal
        v-if="showActivityModal"
        :show="showActivityModal"
        @continue="closeActivityModal"
        @logout="activityLogout"
      />
      <div class="clientlecturecoupon-coupon-management-container">
        <div class="clientlecturecoupon-layout">
          <aside class="clientlecturecoupon-sidebar">
            <div class="clientlecturecoupon-sidebar-section">
              <h3 class="clientlecturecoupon-sidebar-title">HOME</h3>
              <ul class="clientlecturecoupon-sidebar-menu">
                <li class="clientlecturecoupon-sidebar-menu-item">
                  <a href="#" class="clientlecturecoupon-sidebar-menu-link">대시보드</a>
                </li>
                <li class="clientlecturecoupon-sidebar-menu-item">
                  <a href="#" class="clientlecturecoupon-sidebar-menu-link">알림</a>
                </li>
              </ul>
            </div>
  
            <div class="clientlecturecoupon-sidebar-section">
              <h3 class="clientlecturecoupon-sidebar-title">새 강의 만들기</h3>
              <ul class="clientlecturecoupon-sidebar-menu">
                <li class="clientlecturecoupon-sidebar-menu-item">
                  <a href="#" class="clientlecturecoupon-sidebar-menu-link">새 강의 만들기</a>
                </li>
              </ul>
            </div>
  
            <div class="clientlecturecoupon-sidebar-section">
              <h3 class="clientlecturecoupon-sidebar-title">강의 관리</h3>
              <ul class="clientlecturecoupon-sidebar-menu">
                <li
                  v-for="menu in menus"
                  :key="menu.id"
                  :class="{ active: menu.active }"
                  class="clientlecturecoupon-sidebar-menu-item"
                >
                  <a :href="menu.link" class="clientlecturecoupon-sidebar-menu-link">{{ menu.name }}</a>
                </li>
              </ul>
            </div>
          </aside>
  
          <main class="clientlecturecoupon-content">
            <div class="clientlecturecoupon-header">
              <h2>쿠폰 관리</h2>
              <div class="clientlecturecoupon-input-container">
                <select v-model="selectedLecture" class="clientlecturecoupon-lecture-dropdown">
                  <option disabled value="전체 강의">전체 강의</option>
                  <option v-for="lecture in lectures" :key="lecture" :value="lecture">{{ lecture }}</option>
                </select>
                <button class="clientlecturecoupon-add-coupon-button" @click="openModal">쿠폰 추가</button>
              </div>
            </div>
  
            <table class="clientlecturecoupon-coupon-table">
              <thead>
                <tr>
                  <th>강의</th>
                  <th>할인율</th>
                  <th>할인 금액</th>
                  <th>쿠폰 코드</th>
                  <th>시작일</th>
                  <th>종료일</th>
                  <th>활성화 여부</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="coupon in paginatedCoupons" :key="coupon.code">
                  <td>{{ coupon.lecture }}</td>
                  <td>{{ coupon.discount }}</td>
                  <td>{{ coupon.amount }}</td>
                  <td>{{ coupon.code }}</td>
                  <td>{{ coupon.startDate }}</td>
                  <td>{{ coupon.endDate }}</td>
                  <td>{{ coupon.active }}</td>
                </tr>
              </tbody>
            </table>
  
            <div class="clientlecturecoupon-pagination">
              <button @click="prevPage" :disabled="currentPage === 1">이전</button>
              <span>{{ currentPage }} / {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
            </div>
          </main>
        </div>
      </div>
      <ClientAddCouponModal v-if="isModalOpen" @close="closeModal" @save="addCoupon" />
    </div>
  </template>
  
  <script setup>
  import ClientHeader from "@/components/client/ClientHeader.vue";
  import ClientAddCouponModal from "@/components/client/clientlecture/ClientAddCouponModal.vue";
  import { ref, computed, onMounted } from "vue";
  import InactivityModal from '@/components/client/InactivityModal.vue';
  import { useActivityMonitor } from "@/composables/useActivityMonitor";
  
  // 비활성 모니터링 관련
  const { showActivityModal, closeActivityModal, activityLogout } = useActivityMonitor(1);
  
  const menus = [
    { id: 1, name: "강의 관리", link: "#", active: false },
    { id: 2, name: "멘토링 관리", link: "#", active: false },
    { id: 3, name: "강의 질문 관리", link: "#", active: false },
    { id: 4, name: "수강생 리스트", link: "#", active: false },
    { id: 5, name: "새소식 관리", link: "#", active: false },
    { id: 6, name: "수익관리", link: "#", active: false },
    { id: 7, name: "쿠폰 관리", link: "#", active: true },
  ];
  
  const coupons = ref([]);
  
  const isModalOpen = ref(false);
  
  const openModal = () => {
    isModalOpen.value = true;
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
  };
  
  const addCoupon = (newCoupon) => {
    coupons.value.push({ ...newCoupon, code: `NEW-${Date.now()}`, active: "O" });
    closeModal();
  };
  
  onMounted(() => {
    coupons.value = [
      {
        lecture: "Python 완벽 가이드 - 초급부터 중급까지",
        discount: "30%",
        amount: "₩12,600",
        code: "0000-000asdfasd",
        startDate: "2024-10-30",
        endDate: "2024-10-30",
        active: "O",
      },
      {
        lecture: "JavaScript 심화 강의",
        discount: "20%",
        amount: "₩15,000",
        code: "1111-bbbccccc",
        startDate: "2024-11-01",
        endDate: "2024-11-15",
        active: "X",
      },
    ];
  });
  
  const selectedLecture = ref("전체 강의");
  const lectures = ["Python 입문 강의", "JavaScript 실전 강의", "MySQL 데이터베이스"];
  
  const itemsPerPage = ref(5);
  const currentPage = ref(1);
  
  const totalPages = computed(() => {
    if (!coupons.value || coupons.value.length === 0) return 1;
    return Math.ceil(coupons.value.length / itemsPerPage.value);
  });
  
  const paginatedCoupons = computed(() => {
    if (!coupons.value || coupons.value.length === 0) return [];
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return coupons.value.slice(start, end);
  });
  
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };
  
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  };
  </script>
  
  <style scoped>
  .clientlecturecoupon-coupon-management-container {
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    height: 92vh;
  }
  
  .clientlecturecoupon-layout {
    display: flex;
    flex: 1;
  }
  
  .clientlecturecoupon-sidebar {
    width: 250px;
    padding-top: 50px;
    background-color: #fff;
    border-right: 1px solid #ddd;
    padding: 30px;
    height: 100%;
  }
  
  .clientlecturecoupon-sidebar-section {
    margin-bottom: 20px;
  }
  
  .clientlecturecoupon-sidebar-title {
    font-size: 15px;
    font-weight: bold;
    color: #bdbcbc;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  
  .clientlecturecoupon-sidebar-menu {
    list-style: none;
    padding: 0;
  }
  
  .clientlecturecoupon-sidebar-menu-item {
    margin-bottom: 10px;
  }
  
  .clientlecturecoupon-sidebar-menu-link {
    text-decoration: none;
    color: #333;
    font-weight: bold;
    padding: 8px 12px;
    display: block;
    border-radius: 4px;
  }
  
  .clientlecturecoupon-sidebar-menu-link:hover {
    background-color: rgba(163, 160, 255, 0.1);
    color: #4a4aff;
  }
  
  .clientlecturecoupon-sidebar-menu-item.active .clientlecturecoupon-sidebar-menu-link {
    background-color: rgba(163, 160, 255, 0.3);
    color: #4a4aff;
  }
  
  .clientlecturecoupon-content {
    flex: 1;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .clientlecturecoupon-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .clientlecturecoupon-input-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .clientlecturecoupon-lecture-dropdown {
    margin-right: 20px;
    width: 200px;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #c9c9c9;
    border-radius: 4px;
    background-color: #fff;
    color: #b2b2b2;
    outline: none;
    cursor: pointer;
  }
  
  .clientlecturecoupon-lecture-dropdown option {
    outline: none;
    color: #333;
  }
  
  .clientlecturecoupon-lecture-dropdown option[disabled] {
    color: #aaa;
  }
  
  .clientlecturecoupon-add-coupon-button {
    padding: 8px 12px;
    background-color: #7671f4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .clientlecturecoupon-coupon-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 14px;
    margin-top: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .clientlecturecoupon-coupon-table thead th {
    background-color: #7671f4;
    color: white;
    padding: 12px;
    font-weight: bold;
    text-align: center;
    border-bottom: 2px solid #ddd;
  }
  
  .clientlecturecoupon-coupon-table tbody td {
    padding: 12px;
    font-weight: bold;
    color: #333;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }
  
  .clientlecturecoupon-coupon-table tbody tr:hover {
    background-color: #f5f5f5;
  }
  
  .clientlecturecoupon-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 390px;
  }
  
  .clientlecturecoupon-pagination button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background-color: #7671f4;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }
  
  .clientlecturecoupon-pagination button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  
  .clientlecturecoupon-pagination span {
    font-size: 14px;
    color: #333;
  }
  </style>
  