<template>
    <Teleport to="body">
      <div v-if="isOpen" class="coupon-select-modal-overlay" @click="closeModal">
        <div class="coupon-select-modal-container" @click.stop>
          <div class="coupon-select-modal-header">
            <h2>쿠폰 첨부</h2>
            <button class="coupon-select-close-button" @click="closeModal">&times;</button>
          </div>
          <div>
            <CampaignCouponSelectFilter/>
          </div>
          <div class="coupon-select-modal-content">
            <div class="content-container">
                <div class="coupon-count">전체 쿠폰 <span class="coupon-length">{{ coupons.length }}</span>개</div>
                <div class="board-container">
                    <div class="board-header">
                    <div class="board-header-select">선택</div>
                    <div class="board-header-name">쿠폰 이름</div>
                    <div class="board-header-contents">쿠폰 내용</div>
                    <div class="board-header-discount-rate">쿠폰 할인율</div>
                    <div class="board-header-type">쿠폰 종류</div>
                    <div class="board-header-start-date">시작일</div>
                    <div class="board-header-expire-date">만료일</div>
                    <div class="board-header-created-at">생성일</div>
                    <div class="board-header-updated-at">수정일</div>
                    </div>
                    <div class="board-body">
                    <div
                        class="board-row"
                        v-for="(coupons, index) in paginatedCoupons"
                        :key="coupons.id"
                    >
                        <div class="board-row-select"></div> /* 체크박스 */
                        <div class="board-row-name">{{ coupons.name }}</div>
                        <div class="board-row-contents">{{ coupons.contents }}</div>
                        <div class="board-row-discount-rate">{{ coupons.discountRate }}</div>
                        <div class="board-row-type">{{ coupons.type }}</div>
                        <div class="board-row-start-date">{{ coupons.startDate }}</div>
                        <div class="board-row-expire-date">{{ coupons.expireDate }}</div>
                        <div class="board-row-created-at">{{ coupons.createdAt }}</div>
                        <div class="board-row-updated-at">{{ coupons.updatedAt }}</div>
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
          <div class="coupon-select-modal-footer">
            <button class="coupon-select-submit-button" @click="handleSubmit">저장</button>
          </div>
        </div>
      </div>
    </Teleport>
    <FalseModule 
      v-if="cancleModal"
      @close="handleModalClose"
      @submit="handleSubmit"
    />
  </template>
  
  <script setup>
  import { ref, defineEmits, computed } from 'vue';
  import axios from 'axios';
  import FalseModule from './modules/FalseModule.vue';  
  import CampaignCouponSelectFilter from './marketing/CampaignCouponSelectFilter.vue';
  
  const emit = defineEmits(['close', 'submit']);
  const cancleModal = ref(false);
  
  const isOpen = ref(true);
  const formData = ref({
    campaignTemplateTitle: '',
    campaignTemplateContents: '',
    adminCode: ''
  });

  const coupons = [];
  
  const clickCancel = () => {
    cancleModal.value = true;
  };
  
  const handleModalClose = () => {
    cancleModal.value = false;
  };
  
  const closeModal = () => {
    isOpen.value = false;
    emit('close');
  };
  
  const handleSubmit = async () => {
    try {
      const response = await fetch('https://learnsmate.site/campaign-template/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value)
      });
  
      if (response.ok) {
        emit('submit', formData.value);
        closeModal();
      } else {
        console.error('Failed to submit template');
      }
    } catch (error) {
      console.error('Error submitting template:', error);
    }
  };

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

const applyFilters = async (filters) => {
  try {
    const response = await axios.post('/https://learnsmate.site/coupons/filter', filters);
    coupons.value = response.data; // 필터링된 쿠폰 데이터를 업데이트
    currentPage.value = 1; // 필터링 후 첫 페이지로 이동
  } catch (error) {
    console.error('Error fetching filtered coupons:', error);
  }
};
  </script>
  
  <style scoped>
  .coupon-select-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .coupon-select-modal-container {
    background-color: white;
    width: 1200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .coupon-select-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 4px solid #005950;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
  
  .coupon-select-modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
  
  .coupon-select-close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }
  
  .coupon-select-modal-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f9f9f9;
    padding: 10px;
    border: 1px solid #ddd;
    height: 300px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1); 
  }
  
  .coupon-select-input-group {
    display: flex;
    margin-bottom: -1px;
  }
  
  .coupon-select-input-group label {
    width: 150px;
    background-color: #f9f9f9;
    padding: 15px 10px;
    font-size: 14px;
    font-weight: lighter;
    color: #595656;
    border: 1px solid #ddd;
    display: flex;
    justify-content: flex-end;
  }
  
  .coupon-select-input-group input,
  .coupon-select-input-group textarea {
    flex: 1;
    border: 1px solid #ddd;
    padding: 15px;
    font-size: 13px;
    outline: none;
    resize: none;
    font-family: inherit;
  }
  
  .coupon-select-input-group input::placeholder,
  .coupon-select-input-group textarea::placeholder {
    color: #999;
  }
  
  .coupon-select-content-group textarea {
    min-height: 200px;
  }
  
  .coupon-select-modal-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  }
  
  .coupon-select-cancel-button,
  .coupon-select-submit-button {
    padding: 8px 30px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .coupon-select-submit-button {
    background-color: #005950;
    border: none;
    color: white;
  }

  .content-container {
      display: block;
      flex-grow: 1;
    }
    
    .coupon-count {
      font-size: 17px;
      font-weight: bold;
      color: #333;
    }

    .coupon-length {
      color: #005950;
    }
    
    .board-container {
      background-color: #F9F9F9;
    }
    
    .board-header {
      display: grid;
      grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr;
      padding: 10px 20px;
      background-color: #f9f9f9;
      font-size: 13px;
      font-weight: bold;
      color: #595656;
      text-align: center;
    }

    .board-header > div {
      display: flex;
      align-items: center;
      justify-content: center;
}
    
    .board-body {
      display: flex;
      flex-direction: column;
    }
    
    .board-row {
      display: grid;
      grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr 1fr 1fr 1fr;
      padding: 10px 20px;
      border-bottom: 1px solid #eaeaea;
      font-size: 11px;
      color: #333333;
      text-align: center;
    }
    
    .board-row > div {
      display: flex;
      align-items: center;
      justify-content: center;
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
  