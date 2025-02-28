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
            <div class="campaigntemplate-column-selector">
            <button @click="toggleDropdown" class="campaigntemplate-dropdown-button">
              필요 컬럼 선택 ▼
            </button>
            <div v-show="isDropdownOpen" class="campaigntemplate-dropdown-menu">
              <div v-for="(label, key) in columns" :key="key" class="campaigntemplate-dropdown-item">
                <input 
                  type="checkbox" 
                  :value="key" 
                  v-model="selectedColumns" 
                  @change="updateSelectedColumns" 
                  id="key"
                />
                <label :for="key">{{ label }}</label>
              </div>
            </div>
          </div>
            <button class="campaigntemplate-register-button" @click="clickRegister">템플릿 등록</button>
            <button class="campaigntemplate-excel-button" @click="handleExcelDownload"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
          </div>
        </div>
        <div class="board-container">
          <div class="board-header">
            <div v-if="selectedColumns.includes('campaignTemplateCode')" 
                  class="board-header-number campaigntemplate-clickable"
                  @click="handleSort('campaignTemplateCode')">
              템플릿 코드
              <span v-if="currentSortField === 'campaignTemplateCode'" class="campaigntemplate-sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
            </div>
            <div v-if="selectedColumns.includes('campaignTemplateTitle')" 
                  class="board-header-title campaigntemplate-clickable"
                  @click="handleSort('campaignTemplateTitle')">
              템플릿 제목
              <span v-if="currentSortField === 'campaignTemplateTitle'" class="campaigntemplate-sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
            </div>
            <div v-if="selectedColumns.includes('campaignTemplateContents')" 
                  class="board-header-contents campaigntemplate-clickable"
                  @click="handleSort('campaignTemplateContents')">
              템플릿 내용
              <span v-if="currentSortField === 'campaignTemplateContents'" class="campaigntemplate-sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
            </div>
            <div v-if="selectedColumns.includes('createdAt')" 
                  class="board-header-created campaigntemplate-clickable"
                  @click="handleSort('createdAt')">
              생성일
              <span v-if="currentSortField === 'createdAt'" class="campaigntemplate-sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
            </div>
            <div v-if="selectedColumns.includes('updatedAt')" 
                  class="board-header-updated campaigntemplate-clickable"
                  @click="handleSort('updatedAt')">
              수정일
              <span v-if="currentSortField === 'updatedAt'" class="campaigntemplate-sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
            </div>
            <div v-if="selectedColumns.includes('adminName')" 
                  class="board-header-admin campaigntemplate-clickable"
                  @click="handleSort('adminName')">
              담당자
              <span v-if="currentSortField === 'adminName'" class="campaigntemplate-sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
            </div>
            </div>
          <div class="board-body">
            <div
              class="board-row"
              v-for="(campaignTemplate, index) in paginatedCampaignTemplates"
              :key="campaignTemplate.campaign_template_code"
              @click="showCampaignTemplateModal(campaignTemplate.campaign_template_code)"
            >
              <div  v-if="selectedColumns.includes('campaignTemplateCode')" class="board-row-number">{{ campaignTemplate.campaign_template_code }}</div>
              <div  v-if="selectedColumns.includes('campaignTemplateTitle')" class="board-row-title">{{ campaignTemplate.campaign_template_title }}</div>
              <div  v-if="selectedColumns.includes('campaignTemplateContents')" class="board-row-contents">{{ campaignTemplate.campaign_template_contents }}</div>
              <div  v-if="selectedColumns.includes('createdAt')" class="board-row-created">{{ formatDateFromArray(campaignTemplate.created_at) }}</div>
              <div  v-if="selectedColumns.includes('updatedAt')" class="board-row-updated">{{ formatDateFromArray(campaignTemplate.updated_at) }}</div>
              <div  v-if="selectedColumns.includes('adminName')" class="board-row-admin">{{ campaignTemplate.admin_name }}</div>
            </div>
          </div>
          <!-- 페이지네이션 버튼 -->
          <div class="pagination">
            <button 
              class="page-button prev-button" 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 1">◀</button>
            <span v-for="page in totalPages" :key="page" class="page-number">
              <button 
                class="page-button" 
                :class="{ active: currentPage === page }" 
                @click="changePage(page)">{{ page }}</button>
            </span>
            <button 
              class="page-button next-button"
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages">▶</button>
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
  import { saveAs } from 'file-saver';
  import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
  import CampaignTemplateFilter from '@/components/marketing/CampaignTemplateFilter.vue';
  import CampaignTemplateGetModal from '@/components/marketing/CampaignTemplateGetModal.vue';
  import CampaignTemplateRegisterModal from '@/components/marketing/campaignTemplateRegisterModal.vue';

  const campaignTemplates = ref([]);

  const isFiltered = ref(false);
  const lastFilterData = ref(null);

  const isDropdownOpen = ref(false);

  const columns = ref({
    campaignTemplateCode: "템플릿 코드",
    campaignTemplateTitle: "템플릿 제목",
    campaignTemplateContents: "템플릿 내용",
    createdAt: "생성일",
    updatedAt: "수정일",
    adminName: "담당자",
  });

  const selectedColumns = ref(Object.keys(columns.value));
const currentSortField = ref('createdAt');
const currentSortDirection = ref('DESC');

const fetchCampaignTemplates = async () => {
 try {
   const response = await axios.get('http://localhost:5000/campaign-template/list/sort', {
     withCredentials: true,
     params: {
       sortField: currentSortField.value,
       sortDirection: currentSortDirection.value
     }
   });
   campaignTemplates.value = response.data;
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
    if (!Array.isArray(dateArray) || dateArray.length < 3) return '';
  const [year, month, day] = dateArray;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };

  const updateSelectedColumns = () => {
    console.log("current selected columns :", selectedColumns.value);
  };

  
  const clickRegister = () => {
    showRegisterModal.value = true;
  };

  const handleExcelDownload = async() => {
    try{
      const config = {
        method: 'POST',
        withCredentials: true,
        url: 'http://localhost:5000/campaign-template/excel/download/campaign-templates',
        responseType: 'blob',
        data: {
          selectedColumns: camelToSnake(selectedColumns.value),
          ...(isFiltered.value && lastFilterData.value ? lastFilterData.value : {}),
        },
      };

      const response = await axios(config);
      
      // 에러 응답 체크
      if (response.data instanceof Blob) {
        const isJson = response.data.type === 'application/json';
        if (isJson) {
          const textData = await response.data.text();
          console.error('Server error:', textData);
          throw new Error(textData);
        }
      }
      
      // 파일 다운로드
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });

      const now = new Date();
      const fileName = `campaign_template_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
      
      saveAs(blob, fileName);
    } catch (error) {
      console.error('엑셀 다운로드 중 오류가 발생했습니다:', error);
      if (error.response) {
        const reader = new FileReader();
        reader.onload = () => {
          console.error('상세 에러:', reader.result);
        };
        reader.readAsText(error.response.data);
      }
    }
  }


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
    const response = await axios.post(
      'http://localhost:5000/campaign-template/filter/sort',
      camelToSnake(preparedFilters),
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          page: currentPage.value - 1,
          size: pageSize,
          sortField: currentSortField.value,
          sortDirection: currentSortDirection.value
        },
      }
    );
    campaignTemplates.value = response.data.content;
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

  const handleSort = (field) => {
 if (currentSortField.value === field) {
   currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC'
 } else {
   currentSortField.value = field
   currentSortDirection.value = 'ASC'
 }

 if (isFiltered.value) {
   handleSearch(lastFilterData.value)
 } else {
   fetchCampaignTemplates()
 }
}

  
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
  }
  
  .campaigntemplate-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
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

  .campaigntemplate-column-selector {
    cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
    }

  .campaigntemplate-dropdown-button {
    background-color: #ffffff;
    color: #000000;
    border: 0.5px solid #d5d5d5;
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  .campaigntemplate-dropdown-menu {
    position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-top: 160px;
  z-index: 10;
  width: 100px;
  border-radius: 4px;
  }

  .campaigntemplate-dropdown-menu input[type="checkbox"] {
  outline: none;
  accent-color: #005950; 
}

  .campaigntemplate-dropdown-item {
    display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  }

  .campaigntemplate-dropdown-item label {
    font-size: 12px;
    color: #333;
    cursor: pointer;
  }
  
  .campaigntemplate-register-button, .campaigntemplate-excel-button {
    background: #005950;
    padding: 3px 5px;
    margin-bottom: 3px;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: 3px;
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
    padding: 7px 14px;
    background-color: #f9f9f9;
    font-size: 12px;
    font-weight: bold;
    color: #595656;
    text-align: center;
    border-bottom: 1px solid #eaeaea;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .board-body {
    display: flex;
    flex-direction: column;
  }
  
  .board-row {
    display: grid;
    grid-template-columns: 1fr 2fr 3fr 1fr 1fr 1fr;
    padding: 10px 14px;
    border-bottom: 1px solid #eaeaea;
    font-size: 11px;
    color: #333333;
    text-align: center;
    align-items: center;
    background-color: #ffffff;
  }
  
  .board-row:hover {
    background-color: #f4f4f4;
  }

  .board-row-title,
  .board-row-contents {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

  .campaigntemplate-clickable {
    cursor: pointer;
    user-select: none;
    align-items: center;
    gap: 4px;
  }

.campaigntemplate-clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.campaigntemplate-sort-arrow {
  font-size: 12px;
}
  </style>