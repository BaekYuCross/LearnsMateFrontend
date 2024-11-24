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
        <button class="campaign-register-button" @click="navigateTo()">캠페인 등록</button>
        <button class="campaign-excel-button"><img src="/src/assets/icons/download.svg" alt="">엑셀 다운로드</button>
    </div>
    </div>
      <div class="board-container">
        <div class="board-header">
          <div class="board-header-number">캠페인 번호</div>
          <div class="board-header-title">캠페인 제목</div>
          <div class="board-header-contents">캠페인 내용</div>
          <div class="board-header-type">발송 타입</div>
          <div class="board-header-send">발송 날짜</div>
          <div class="board-header-created">생성일</div>
          <div class="board-header-updated">수정일</div>
          <div class="board-header-admin">담당자</div>
        </div>
        <div class="board-body">
          <div
    class="board-row"
    v-for="(campaign, index) in paginatedCampaigns"
    :key="campaign.campaign_code"
    @click="getCampaign(campaign.campaign_code)"
  >
    <div class="board-row-number">{{ campaign.campaign_code }}</div>
    <div class="board-row-title" :title="campaign.campaign_title">
      {{ campaign.campaign_title }}
    </div>
    <div class="board-row-contents" :title="campaign.campaign_contents">
      {{ campaign.campaign_contents }}
    </div>
    <div class="board-row-type">{{ campaign.campaign_type }}</div>
    <div class="board-row-send">
      {{ campaign.campaign_type === 'INSTANT' 
          ? formatDateFromArray(campaign.campaign_send_date) 
          : formatSendDateFromArray(campaign.campaign_send_date) 
      }}
    </div>
    <div class="board-row-created">{{ formatDateFromArray(campaign.created_at) }}</div>
    <div class="board-row-updated">{{ formatDateFromArray(campaign.updated_at) }}</div>
    <div class="board-row-admin">{{ campaign.admin_name }}</div>
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
</template>

  
  <script setup>
  import { ref, computed, onMounted  } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import MarketingSideMenu from '@/components/sideMenu/MarketingSideMenu.vue';
  import CampaignFilter from '@/components/marketing/CampaignFilter.vue';

  const router = useRouter(); 

  const campaigns = ref([]);

  const fetchCampaigns = async () => {
    try {
      const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ';
      const response = await axios.get('http://localhost:5000/campaign/campaigns',{
      method: 'GET',
      headers: {
        Authorization: token,
        }
      });
      campaigns.value = response.data;
      console.log(campaigns.value);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
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
  try {
    console.log("부모컴포넌트로 넘어온 filters data: ",preparedFilters);
    const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ';
    const response = await axios.post(
      'http://localhost:5000/campaign/filter',
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
    campaigns.value = response.data.content; // API의 응답 구조에 따라 조정
    console.log('Filtered campaigns:', campaigns.value);
    totalPages.value = response.data.totalPages; 
  } catch (error) {
    console.error('Error while fetching filtered campaigns:', error);
  }
};

const handleReset = async () => {
  await fetchCampaigns(); 
  currentPage.value = 1;  
};



const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 6) return ''; 
  const [year, month, day, hours, minutes, seconds] = dateArray;
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatSendDateFromArray = (dateArray) => {
 if (!Array.isArray(dateArray) || dateArray.length < 5) return '';
 const [year, month, day, hours, minutes] = dateArray;
 return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
};


const navigateTo = () => {
    router.push({ 
        path: "/marketing/register-campaign",
    });
};

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
      margin-top: 50px;
    }

    .campaign-actions {
      display: flex;
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

    .campaign-register-button, .campaign-excel-button {
      background: #005950;
      padding: 2px 5px;
      margin-bottom: 3px;
      border: none;
      color: #ffffff;
      cursor: pointer;
      font-size: 13px;
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
      grid-template-columns: 0.6fr 2fr 3fr 1fr 1fr 1fr 1fr 0.5fr;
      padding: 10px 20px;
      border-bottom: 1px solid #eaeaea;
      font-size: 11px;
      color: #333333;
      text-align: center;
      cursor: pointer;
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
  </style>