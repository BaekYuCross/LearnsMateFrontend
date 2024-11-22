<template>
    <div class="marketing-container">
      <MarketingSideMenu />
      <CampaignTemplateFilter/>
      <div class="content-container">
        <div class="campaigntemplate-actions">
          <div class="campaigntemplate-count">전체 템플릿 <span class="campaigntemplate-length">{{ campaignTemplates.length }}</span>개</div>
          <div class="campaigntemplate-button-group">
            <button class="campaigntemplate-register-button" @click="clickRegister()">템플릿 등록</button>
            <button class="campaigntemplate-excel-button"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
          </div>
        </div>
        <div class="board-container">
          <div class="board-header">
            <div class="board-header-number">템플릿 번호</div>
            <div class="board-header-title">템플릿 제목</div>
            <div class="board-header-contents">템플릿 내용</div>
            <div class="board-header-created">생성일</div>
            <div class="board-header-updated">수정일</div>
            <div class="board-header-admin">담당자</div>
          </div>
          <div class="board-body">
            <div
              class="board-row"
              v-for="(campaignTemplate, index) in paginatedCampaignTemplates"
              :key="campaignTemplate.campaignCode"
            >
              <div class="board-row-number">{{ campaignTemplate.campaignTemplateCode }}</div>
              <div class="board-row-title">{{ campaignTemplate.campaignTemplateTitle }}</div>
              <div class="board-row-contents">{{ campaignTemplate.campaignTemplateContents }}</div>
              <div class="board-row-created">{{ campaignTemplate.createdAt }}</div>
              <div class="board-row-updated">{{ campaignTemplate.updatedAt }}</div>
              <div class="board-row-admin">{{ campaignTemplate.adminCode }}</div>
            </div>
          </div>
          <!-- 페이지네이션 버튼 -->
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
    <campaignTemplateRegisterModal 
    v-if="showModal"
    @close="handleModalClose"
    @submit="handleModalSubmit"
  />
  </template>
  
  
  <script setup>
  import { ref, computed, onMounted  } from 'vue';
  import { useRouter } from 'vue-router';
  import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
  import CampaignTemplateFilter from '@/components/marketing/CampaignTemplateFilter.vue';
  import campaignTemplateRegisterModal from '@/components/marketing/campaignTemplateRegisterModal.vue';
  
  const router = useRouter(); 
  
  const campaignTemplates = [];
  
  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/https://learnsmate.site/campaign-template/list');
      campaignTemplates.value = response.data;
    } catch (error) {
      console.error('Failed to fetch campaign-templates:', error);
    }
  };

  const showModal = ref(false);
  
  const currentPage = ref(1);
  const pageSize = 15;
  
  const totalPages = computed(() => Math.ceil(campaignTemplates.length / pageSize));
  
  const paginatedCampaignTemplates = computed(() =>
    campaignTemplates.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
  );
  
  const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };
  
  const clickRegister = () => {
    showModal.value = true;
  };


    const handleModalClose = () => {
    showModal.value = false;
    showCouponSelectModal.value = false;
    };

    const registerCampaignTemplate = async () => {

        if (!campaignTemplateTitle.value || !campaignTemplateContents.value) {
            alert('템플릿의 제목과 내용을 입력해주세요.');
            return;
        }

        const payload = {
            campaignTemplateTitle: campaignTitle.value,
            campaignTemplateContents: campaignContents.value,
            campaignType: campaignType.value,
            campaignSendDate: campaignType.value === '예약 발송' ? `${selectedDate.value}T${selectedTime.value}` : null,
            coupons: attachedCoupons.value, // coupons, targetUsers 이름 바꿔야함.
            targetUsers: targetUsers.value,
        };

    try {
        await post('/https://learnsmate.site/campaign-template/register', payload);
        alert('캠페인이 등록되었습니다.'); // 모달창으로 변경하기
        window.location.href = '/'; // 해당 캠페인 조회 페이지로? 아니면 전체 조회 페이지로?
    } catch (error) {
        console.error('Failed to register campaign:', error);
        alert('캠페인 등록에 실패했습니다.'); // 모달창으로 변경하기
    } 
};

    const handleModalSubmit = (formData) => {
    registerCampaignTemplate();
    fetchCampaigns();
    };
  
  onMounted(() => {
    fetchCampaigns();
  });
  </script>
  
  <style scoped>
  .marketing-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  
  .content-container {
    display: block;
    flex-grow: 1;
    margin-left: 160px;
    margin-top: 50px;
  }
  
  .campaigntemplate-actions {
    display: flex;
  }
  
  .campaigntemplate-count {
    flex: 1;
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }
  
  .campaigntemplate-button-group {
    display: flex;
    gap: 10px;
  }
  
  .campaigntemplate-register-button, .campaigntemplate-excel-button {
    background: #005950;
    padding: 2px 5px;
    margin-bottom: 3px;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 13px;
  }
  
  .campaigntemplate-length {
    color: #005950;
  }
  
  .board-container {
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .board-header {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr;
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
    grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr;
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
  