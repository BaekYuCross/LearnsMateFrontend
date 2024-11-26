<template>
    <div class="marketing-container">
      <MarketingSideMenu />
      <CampaignTemplateFilter
        @Search="handleSearch"
        @reset="handleReset"
      />
      <div class="content-container">
        <div class="campaigntemplate-actions">
          <div class="campaigntemplate-count">전체 템플릿 <span class="campaigntemplate-length">{{ campaignTemplates.length }}</span>개</div>
          <div class="campaigntemplate-button-group">
            <button class="campaigntemplate-register-button" @click="clickRegister">템플릿 등록</button>
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
              :key="campaignTemplate.campaign_template_code"
              @click="showCampaignTemplateModal(campaignTemplate.campaign_template_code)"
            >
              <div class="board-row-number">{{ campaignTemplate.campaign_template_code }}</div>
              <div class="board-row-title">{{ campaignTemplate.campaign_template_title }}</div>
              <div class="board-row-contents">{{ campaignTemplate.campaign_template_contents }}</div>
              <div class="board-row-created">{{ formatDateFromArray(campaignTemplate.created_at) }}</div>
              <div class="board-row-updated">{{ formatDateFromArray(campaignTemplate.updated_at) }}</div>
              <div class="board-row-admin">{{ campaignTemplate.admin_name }}</div>
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
    <CampaignTemplateRegisterModal 
      v-if="showRegisterModal"
      @cancel="handleRegisterModalClose"
      @confirm="handleModalSubmit"
    />
    <CampaignTemplateGetModal
      v-if="showGetModal"
      :campaignTemplateCode="selectedCampaignTemplate"
      @close="handleGetModalClose"
    />
  </template>
  
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
  import CampaignTemplateFilter from '@/components/marketing/CampaignTemplateFilter.vue';
  import CampaignTemplateGetModal from '@/components/marketing/CampaignTemplateGetModal.vue';
  import CampaignTemplateRegisterModal from '@/components/marketing/campaignTemplateRegisterModal.vue';
  
  const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ'; 
  
  const campaignTemplates = ref([]);

  const isFiltered = ref(false);
  const lastFilterData = ref(null);
  
  const fetchCampaignTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/campaign-template/list',{
      method: 'GET',
      headers: {
        Authorization: token,
      }
    });
      campaignTemplates.value = response.data;
      console.log(campaignTemplates.value);
    } catch (error) {
      console.error('Failed to fetch campaign-templates:', error);
    }
  };

  const showRegisterModal = ref(false);
  const showGetModal = ref(false);
  const selectedCampaignTemplate = ref(null);
  
  const currentPage = ref(1);
  const pageSize = 15;
  
  const totalPages = computed(() => Math.ceil(campaignTemplates.value.length / pageSize));
  
  const paginatedCampaignTemplates = computed(() =>
    campaignTemplates.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
  );
  const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const camelToSnake = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(camelToSnake);
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {});
  };

  const formatDateFromArray = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) return ''; 
    const [year, month, day, hours, minutes, seconds] = dateArray;
    return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  const clickRegister = () => {
    showRegisterModal.value = true;
  };


  const handleRegisterModalClose = () => {
    showRegisterModal.value = false;
  };

  const showCampaignTemplateModal = (template) => {
    selectedCampaignTemplate.value = template;
    showGetModal.value = true;
  };

  const handleGetModalClose = () => {
    selectedCampaignTemplate.value = null;
    showGetModal.value = false; 
  };


  const handleSearch = async (preparedFilters) => {
    isFiltered.value = true;
    lastFilterData.value = preparedFilters;
    try {
      console.log("부모컴포넌트로 넘어온 filters data: ",preparedFilters);
      const response = await axios.post(
        'http://localhost:5000/campaign-template/filter',
        camelToSnake(preparedFilters),
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          params: {
            page: currentPage.value - 1, // 0-based pagination
            size: pageSize,
          },
        }
      );
      campaignTemplates.value = response.data.content; // API의 응답 구조에 따라 조정
      console.log('Filtered campaigns:', campaignTemplates.value);
      totalPages.value = response.data.totalPages; 
    } catch (error) {
      console.error('Error while fetching filtered campaigns:', error);
    }
  };

  const handleReset = async () => {
    isFiltered.value = false;
    lastFilterData.value = null;
    currentPage.value = 1;  
    await fetchCampaignTemplates(); 
  };

  const handleModalSubmit = () => {
    showRegisterModal.value = false;
    fetchCampaignTemplates();
  };
  
  onMounted(() => {
    fetchCampaignTemplates();
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
  