<template>
    <div class="marketing-container">
    <MarketingSideMenu/>
    <div class="content-container">
      <div class="coupon-count">등록된 쿠폰 <span class="coupon-length">{{ coupons.length }}</span>개</div>
      <div class="board-container">
        <div class="board-header">
          <div class="board-header-number">쿠폰 번호</div>
          <div class="board-header-name">쿠폰 이름</div>
          <div class="board-header-contents">쿠폰 내용</div>
          <div class="board-header-discount-rate">쿠폰 할인율</div>
          <div class="board-header-type">쿠폰 종류</div>
          <div class="board-header-status">상태</div>
          <div class="board-header-start-date">시작일</div>
          <div class="board-header-expire-date">만료일</div>
          <div class="board-header-created-at">생성일</div>
          <div class="board-header-updated-at">수정일</div>
          <div class="board-header-admin">직원</div>
          <div class="board-header-tutor">강사</div>
        </div>
        <div class="board-body">
          <div
            class="board-row"
            v-for="(coupons, index) in paginatedCoupons"
            :key="coupons.id"
          >
            <div class="board-row-number">{{ coupons.code }}</div>
            <div class="board-row-name">{{ coupons.name }}</div>
            <div class="board-row-contents">{{ coupons.contents }}</div>
            <div class="board-row-discount-rate">{{ coupons.discountRate }}</div>
            <div class="board-row-type">{{ coupons.type }}</div>
            <div class="board-row-status">{{ coupons.status }}</div>
            <div class="board-row-start-date">{{ coupons.startDate }}</div>
            <div class="board-row-expire-date">{{ coupons.expireDate }}</div>
            <div class="board-row-created-at">{{ coupons.createdAt }}</div>
            <div class="board-row-updated-at">{{ coupons.updatedAt }}</div>
            <div class="board-row-admin">{{ coupons.admin }}</div>
            <div class="board-row-tutor">{{ coupons.tutor }}</div>
          </div>
        </div>
        <div class="pagination">
          <button 
            class="page-button prev-button" 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1">◀이전</button>
          <span v-for="page in totalPages" :key="page" class="page-number">
            <button 
              class="page-button" 
              :class="{ active: currentPage === page }" 
              @click="changePage(page)">{{ page }}</button>
          </span>
          <button 
            class="page-button next-button"
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages">다음▶</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';

const coupons = [
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
    {
      id: 1,
      code: "C001-20241118eidj23isjle",
      name: "10% 일반 할인",
      contents: "일반 할인쿠폰입니다.",
      discountRate: "10",
      type: "일반",
      status: "O",
      startDate: "2024-11-01T00:00:00",
      expireDate: "2024-11-30T00:00:00",
      createdAt: "2024-10-031T00:00:00",
      updatedAt: "2024-10-031T00:00:00",
      admin: "이서현",
      tutor: ""
    },
];

const currentPage = ref(1);
const pageSize = 15;

const totalPages = computed(() => Math.ceil(coupons.length / pageSize));

const paginatedCoupons = computed(() =>
  coupons.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

</script>

<style>
    .marketing-container {
      display: flex;
      padding: 20px;
    }
    
    .content-container {
      display: block;
      flex-grow: 1;
      margin-left: 160px;
      margin-top: 50px;
    }
    
    .coupon-count {
      font-size: 17px;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 5px;
      color: #333;
    }

    .coupon-length {
      color: #005950;
    }
    
    .board-container {
      background-color: #ffffff;
    }
    
    .board-header {
      display: grid;
      grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      padding: 10px 20px;
      background-color: #f9f9f9;
      font-size: 13px;
      font-weight: bold;
      color: #595656;
      text-align: center;
    }
    
    .board-body {
      display: flex;
      flex-direction: column;
    }
    
    .board-row {
      display: grid;
      grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      padding: 10px 20px;
      border-bottom: 1px solid #eaeaea;
      font-size: 11px;
      color: #333333;
      text-align: center;
    }
    
    .board-row:hover {
      background-color: #f4f4f4;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
    
    .page-button {
      background: none;
      border: none;
      color: #333;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 13px;
    }
    
    .page-button.active {
      font-weight: bold;
    }
    
    .page-button:disabled {
      color: #ccc;
      cursor: not-allowed;
    }
</style>