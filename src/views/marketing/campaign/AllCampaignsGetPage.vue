<template>
  <div class="marketing-container">
    <MarketingSideMenu />
    <CampaignFilter
      @search="handleSearch" 
      @reset="handleReset"
    />
    <div class="content-container">
      <div class="campaign-actions">
      <div class="campaign-count">등록된 캠페인 <span class="campaign-length">{{ campaigns.length }}</span>개</div>
      <div class="campaign-button-group">
        <div class="campaign-column-selector">
            <button @click="toggleDropdown" class="campaign-dropdown-button">
              필요 컬럼 선택 ▼
            </button>
            <div v-show="isDropdownOpen" class="campaign-dropdown-menu">
              <div v-for="(label, key) in columns" :key="key" class="campaign-dropdown-item">
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
        <button class="campaign-register-button" @click="navigateTo()">캠페인 등록</button>
        <button class="campaign-excel-button" @click="handleExcelDownload"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
    </div>
    </div>
      <div class="board-container">
        <div class="board-header">
          <div v-if="selectedColumns.includes('campaignCode')" 
              class="board-header-number campaign-clickable"
              @click="handleSort('campaignCode')">
            캠페인 코드
            <span v-if="currentSortField === 'campaignCode'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>
          </div>
          <div v-if="selectedColumns.includes('campaignTitle')" 
              class="board-header-title campaign-clickable"
              @click="handleSort('campaignTitle')">캠페인 제목
              <span v-if="currentSortField === 'campaignTitle'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>
          </div>
          <div v-if="selectedColumns.includes('campaignContents')"
              class="board-header-contents campaign-clickable"
              @click="handleSort('campaignContents')">캠페인 내용
              <span v-if="currentSortField === 'campaignContents'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>
          </div>
          <div v-if="selectedColumns.includes('campaignType')" 
              class="board-header-type campaign-clickable"
              @click="handleSort('campaignType')">발송 타입
              <span v-if="currentSortField === 'campaignType'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>
          </div>
          <div v-if="selectedColumns.includes('campaignSendDate')" 
              class="board-header-send campaign-clickable"
              @click="handleSort('campaignSendDate')">발송 날짜
              <span v-if="currentSortField === 'campaignSendDate'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>  
          </div>
          <div v-if="selectedColumns.includes('createdAt')" 
              class="board-header-created campaign-clickable"
              @click="handleSort('createdAt')">생성일
              <span v-if="currentSortField === 'createdAt'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>   
          </div>
          <div v-if="selectedColumns.includes('updatedAt')" 
              class="board-header-updated campaign-clickable"
              @click="handleSort('updatedAt')">수정일
              <span v-if="currentSortField === 'updatedAt'" class="sort-arrow">
              {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
            </span>   
          </div>
          <div v-if="selectedColumns.includes('adminName')" 
              class="board-header-admin campaign-clickable"
              @click="handleSort('adminName')">담당자
              <span v-if="currentSortField === 'adminName'" class="sort-arrow">
                {{ currentSortDirection === 'ASC' ? '↑' : '↓' }}
              </span>
          </div>
        </div>
        <div class="board-body">
          <div
    class="board-row"
    v-for="(campaign, index) in paginatedCampaigns"
    :key="campaign.campaign_code"
    @click="getCampaign(campaign.campaign_code)"
  >
    <div v-if="selectedColumns.includes('campaignCode')" class="board-row-number">{{ campaign.campaign_code }}</div>
    <div v-if="selectedColumns.includes('campaignTitle')" class="board-row-title" :title="campaign.campaign_title">
      {{ campaign.campaign_title }}
    </div>
    <div v-if="selectedColumns.includes('campaignContents')" class="board-row-contents" :title="campaign.campaign_contents">
      {{ campaign.campaign_contents }}
    </div>
    <div v-if="selectedColumns.includes('campaignType')" class="board-row-type">{{ campaign.campaign_type }}</div>
    <div v-if="selectedColumns.includes('campaignSendDate')" class="board-row-send">
      {{ campaign.campaign_type === 'INSTANT' 
          ? formatDateFromArray(campaign.campaign_send_date) 
          : formatSendDateFromArray(campaign.campaign_send_date) 
      }}
    </div>
    <div v-if="selectedColumns.includes('createdAt')" class="board-row-created">{{ formatDateFromArray(campaign.created_at) }}</div>
    <div v-if="selectedColumns.includes('updatedAt')" class="board-row-updated">{{ formatDateFromArray(campaign.updated_at) }}</div>
    <div v-if="selectedColumns.includes('adminName')" class="board-row-admin">{{ campaign.admin_name }}</div>
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
</template>

  
  <script setup>
  import { ref, computed, onMounted  } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { saveAs } from 'file-saver';
  import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
  import CampaignFilter from '@/components/marketing/CampaignFilter.vue';

  const router = useRouter(); 

  const campaigns = ref([]);

  const isFiltered = ref(false);
  const lastFilterData = ref(null);
  const isDropdownOpen = ref(false);

  const currentSortField = ref('campaignCode');
  const currentSortDirection = ref('DESC');

  const columns = ref({
    campaignCode: "캠페인 코드",
    campaignTitle: "캠페인 제목",
    campaignContents: "캠페인 내용",
    campaignType: "발송 타입",
    campaignSendDate: "발송 날짜",
    createdAt: "생성일",
    updatedAt: "수정일",
    adminName: "담당자",

  });

  const selectedColumns = ref(Object.keys(columns.value));

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('https://learnsmate.shop/campaign/campaigns', {
        method: 'GET',
        withCredentials: true,
        params: {
          page: currentPage.value - 1,
          size: pageSize,
        },
      });
      campaigns.value = response.data.content.map(campaign => ({
        ...campaign,
        campaign_type: translateCampaignType(campaign.campaign_type)
      }));

      console.log('campaign data:', campaigns.value);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const fetchSortedCampaigns = async () => {
  try {
    if (isFiltered.value && lastFilterData.value) {
      const response = await axios.post(
        'https://learnsmate.shop/campaign/filter/sort',
        camelToSnake(lastFilterData.value),
        {
          withCredentials: true,
          params: {
            page: currentPage.value - 1,
            size: pageSize,
            sortField: camelToSnake(currentSortField.value),
            sortDirection: currentSortDirection.value
          }
        }
      );
      handleResponse(response);
      
    } else {
      const response = await axios.get(
        'https://learnsmate.shop/campaign/campaigns/sort',
        {
          withCredentials: true,
          params: {
            page: currentPage.value - 1,
            size: pageSize,
            sortField: camelToSnake(currentSortField.value),
            sortDirection: currentSortDirection.value
          }
        }
      );
      handleResponse(response);
    }
  } catch (error) {
    console.error('Failed to fetch sorted campaigns:', error);
  }
};

const handleResponse = (response) => {
  campaigns.value = response.data.content.map(campaign => ({
    ...campaign,
    campaign_type: translateCampaignType(campaign.campaign_type)
  }));
  totalPages.value = response.data.totalPages;
};



const handleSort = (field) => {
  if (field === currentSortField.value) {
    currentSortDirection.value = currentSortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    currentSortField.value = field;
    currentSortDirection.value = 'DESC';
  }
  
  currentPage.value = 1;
  fetchSortedCampaigns();
};

  const translateCampaignType = (type) => {
    const campaignTypeMap = {
      INSTANT: '즉시발송',
      RESERVATION: '예약발송',
    };
    return campaignTypeMap[type] || type;
  };


  const currentPage = ref(1);
  const pageSize = 15;
  const totalPages = computed(() => Math.ceil(campaigns.value.length / pageSize));
  

  const paginatedCampaigns = computed(() =>
    campaigns.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
  );

  const getCampaign = (campaignCode) => {
    router.push({ 
            path: '/marketing/campaign', 
            query: { 
              campaignCode: campaignCode,
            } 
        });
  }


  const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
      handleSearch(filters.value); 
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


  const handleSearch = async (preparedFilters) => {
    isFiltered.value = true;
    lastFilterData.value = preparedFilters;
    try {
      console.log("filter data:", preparedFilters);
      const response = await axios.post(
        'https://learnsmate.shop/campaign/filter',
        camelToSnake(preparedFilters),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            page: currentPage.value - 1,
            size: pageSize,
          },
        }
      );
      campaigns.value = response.data.content; // content 배열로 설정
      console.log('filtered campaign data:', campaigns.value);
      totalPages.value = response.data.totalPages;
    } catch (error) {
      console.error('Error while fetching filtered campaigns:', error);
    }
  };


const handleReset = async () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;  
  await fetchCampaigns(); 
};



const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return '';

  const [year, month, day] = dateArray;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const formatSendDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return '';

  const [year, month, day] = dateArray;

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateSelectedColumns = () => {
  console.log("current selected columns:", selectedColumns.value);
};

const navigateTo = () => {
    router.push({ 
        path: "/marketing/register-campaign",
    });
};

const handleExcelDownload = async() => {
  try{
    const config = {
      method: 'POST',
      withCredentials: true,
      url: 'https://learnsmate.shop/campaign/excel/download/campaigns',
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
    const fileName = `campaign_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.xlsx`;
    
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

onMounted(async() => {
  await fetchCampaigns();
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

    .campaign-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .campaign-count {
      flex: 1;
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
    }
    
    .campaign-button-group {
      display: flex;
      gap: 10px;
    }

    .campaign-column-selector {
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      border-radius: 5px;
    }

  .campaign-dropdown-button {
    background-color: #ffffff;
    color: #000000;
    border: 0.5px solid #d5d5d5;
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
  }

    .campaign-dropdown-menu {
      position: absolute;
      background-color: white;
      border: 1px solid #ddd;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 10px;
      margin-top: 200px;
      z-index: 10;
      width: 100px;
      border-radius: 4px;
    }

    .campaign-dropdown-menu input[type="checkbox"] {
      outline: none;
      accent-color: #005950; 
    }

    .campaign-dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
      }

    .campaign-dropdown-item label {
      font-size: 12px;
      color: #333;
      cursor: pointer;
    }

    .campaign-register-button, .campaign-excel-button {
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

    .campaign-excel-button img {
      width: 16px;
      height: 16px;
    }

    .campaign-length {
      color: #005950;
    }
    
    .board-container {
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .board-header {
      display: grid;
      grid-template-columns: 0.6fr 2fr 3fr 1fr 1fr 1fr 1fr 0.5fr;
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
      grid-template-columns: 0.6fr 2fr 3fr 1fr 1fr 1fr 1fr 0.5fr;
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

    .board-row-title {
      max-width: 100%;
    }

    .board-row-contents {
      max-width: 100%;
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

    .campaign-clickable {
    cursor: pointer;
    user-select: none;
    align-items: center;
    gap: 4px;
  }

.campaign-clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.campaign-sort-arrow {
  font-size: 12px;
}
  </style>