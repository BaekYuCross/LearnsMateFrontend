<template>
    <div v-if="isOpen" class="lecture-modal-overlay">
      <div class="lecture-modal-container">
        <div class="lecture-modal-header">
          <h2> 강의 카테고리 비율</h2>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="lecture-modal-content">
          <div class="lecture-filter-card">
            <div class="lecture-filter-container">
              <div class="lecture-section-header">
                <h2 class="lecture-section-title">기간 필터</h2>
                <div class="lecture-filter-group">
                  <div class="lecture-period-container">
                    <div class="period-item">
                      <span class="lecture-filter-label">시작 년월</span>
                      <div class="lecture-date-container">
                        <select v-model="filter.startYear" class="lecture-filter-input lecture-year-input">
                          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
                        </select>
                        <select v-model="filter.startMonth" class="lecture-filter-input lecture-month-input">
                          <option v-for="month in months" :key="month" :value="month">
                            {{ month.toString().padStart(2, '0') }}월
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="period-item">
                      <span class="lecture-filter-label">종료 년월</span>
                      <div class="lecture-date-container">
                        <select v-model="filter.endYear" class="lecture-filter-input lecture-year-input">
                          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
                        </select>
                        <select v-model="filter.endMonth" class="lecture-filter-input lecture-month-input">
                          <option v-for="month in months" :key="month" :value="month">
                            {{ month.toString().padStart(2, '0') }}월
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="lecture-button-group">
                    <button @click="applyFilter" class="lecture-search-button">
                      <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
                    </button>
                    <button @click="resetFilter" class="lecture-reset-button">
                      <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lecture-chart-container">
            <div class="total-count">
                전체 인원: <span style="color:#005950 ;">{{ totalCount.toLocaleString() }}</span>명
            </div>
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
  import axios from '@/plugins/axios';
  import Chart from 'chart.js/auto';
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  const totalCount = ref(0);
  const chartCanvas = ref(null);
  let chart = null;
  
  // 연도와 월 옵션 설정
  const currentYear = new Date().getFullYear();
  const years = ref(Array.from({length: 5}, (_, i) => currentYear - 4 + i));
  const months = ref(Array.from({length: 12}, (_, i) => i + 1));
  
  // 필터 상태
  const filter = ref({
    startYear: currentYear - 1,
    startMonth: 1,
    endYear: currentYear,
    endMonth: 12
  });
  
  const colors = [
  'rgba(75, 192, 192, 0.7)',   // 청록색 (기준 색)
  'rgba(120, 200, 180, 0.7)',  // 부드러운 민트색
  'rgba(100, 180, 210, 0.7)',  // 밝은 하늘색
  'rgba(85, 210, 180, 0.7)',   // 연한 초록색
  'rgba(200, 225, 180, 0.7)',  // 부드러운 라임색
  'rgba(150, 180, 225, 0.7)',  // 연한 청록-보라색
  'rgba(200, 190, 220, 0.7)'   // 청록빛이 섞인 연보라색
];

const translateCategory = (category) => {
  const categoryMap = {
    'BACKEND': '백엔드',
    'FRONTEND': '프론트엔드',
    'DEVOPS': '데브옵스',
    'DATABASE': '데이터베이스',
    'WEB_DEVELOPMENT': '웹 개발',
    'MOBILE_APP_DEVELOPMENT': '앱 개발',
    'FULL_STACK': '풀스택'
  };
  return categoryMap[category] || category;
};
  
const createChart = (data) => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  const labels = data.map(item => translateCategory(item.category));
  const counts = data.map(item => item.count);
  const percentages = data.map(item => item.percentage);
  
  totalCount.value = counts.reduce((acc, curr) => acc + curr, 0);

chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      data: percentages,
      backgroundColor: colors,
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 25,
          padding: 25,
          font: {
            size: 13
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const label = labels[dataIndex];
            const percentage = percentages[dataIndex];
            return `${label}: ${percentage.toFixed(1)}%`;
          }
        }
      }
    }
  },
  plugins: [
    {
      id: 'percentageLabels',
      beforeDraw: (chart) => {
        const { width } = chart;
        const { datasets } = chart.data;
        const ctx = chart.ctx;
        const total = datasets[0].data.reduce((acc, value) => acc + value, 0);

        ctx.save();
        chart.data.labels.forEach((label, index) => {
          const meta = chart.getDatasetMeta(0);
          const arc = meta.data[index];
          const { x, y } = arc.tooltipPosition();

          const percentage = ((datasets[0].data[index] / total) * 100).toFixed(1) + '%';
          const displayText = `${label}\n${percentage}`; // 카테고리명과 퍼센트 표시

ctx.fillStyle = 'black';
ctx.font = 'bold 13px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

const lines = displayText.split('\n'); // 텍스트 줄바꿈 처리
lines.forEach((line, i) => {
  ctx.fillText(line, x, y + i * 15); // 각 줄에 대한 위치 조정
});
});
ctx.restore();
      }
    }
  ]
});
}

const fetchCategoryRatio = async (useFilter = false) => {
  try {
    let response;
    if (useFilter) {
      const filterData = {
        startDate: `${filter.value.startYear}-${filter.value.startMonth.toString().padStart(2, '0')}-01T00:00:00`,
        endDate: `${filter.value.endYear}-${filter.value.endMonth.toString().padStart(2, '0')}-31T23:59:59`
      };
      response = await axios.post('https://learnsmate.shop/member/category-ratio/filter', filterData, {
        withCredentials: true, 
      });
    } else {
      response = await axios.get('https://learnsmate.shop/member/category-ratio', {
        withCredentials: true, 
      });
    }
    createChart(response.data);
  } catch (error) {
    console.error('카테고리 비율 데이터를 불러오는데 실패했습니다:', error);
  }
};
  
  const applyFilter = () => {
    fetchCategoryRatio(true);
  };
  
  const resetFilter = () => {
    filter.value = {
      startYear: currentYear - 1,
      startMonth: 1,
      endYear: currentYear,
      endMonth: 12
    };
    fetchCategoryRatio(false);
  };
  
  const closeModal = () => {
    if (chart) {
      chart.destroy();
    }
    emit('close');
  };
  
  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      fetchCategoryRatio();
    }
  });
  
  onMounted(() => {
    if (props.isOpen) {
      fetchCategoryRatio();
    }
  });
  </script>
  
  <style scoped>
  .lecture-modal-overlay {
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
  
  .lecture-modal-container {
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-top: 9px solid #B5CFCC; /* 위 테두리 */
  border-bottom: 9px solid #B5CFCC; /* 아래 테두리 */
}

  
  .lecture-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .lecture-modal-header h2 {
    font-size: 16px;
    padding-left: 9px;
    font-weight: bold;
    color: #333;
  }
  
  .lecture-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
  }
  
  .lecture-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
  }
  
  .lecture-section-title {
    font-size: 14px;
    font-weight: bold;
  }
  
  .lecture-filter-container {
    display: flex;
    flex-direction: column;
  }
  
  .lecture-filter-group {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .lecture-filter-label {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .lecture-date-container {
    display: flex;
    gap: 8px;
  }
  
  .lecture-filter-input {
    padding: 5px 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
  }
  
  .lecture-period-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .period-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .lecture-year-input {
    width: 80px;
  }
  
  .lecture-month-input {
    width: 60px;
  }
  
  .lecture-button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .lecture-search-button {
    padding: 2px 6px 3px 3px;        
    background-color: #005950;
    border: 1px solid #005950;
    border-radius: 4px;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .lecture-reset-button {
    padding: 4px 5px 3px;   
    border: 1px solid #A29D9D;
    border-radius: 4px;
    font-size: 10px;
    background-color: white;
    margin-bottom: 4px;
    margin-top: 4px;
  }
  
  .lecture-chart-container {
  position: relative;
  width: 100%;
  height: 500px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
  
  .search-img, .reset-img {
    width: 14px;
    height: 12px;
    
  }
  
  .close-button {
    font-size: 27px;
    margin-bottom: 10px;
    margin-right: 5px;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
  }
  
  .close-button:hover {
    color: #333;
  }
  
  .total-count {
  position: absolute;
  left: 10px;
  font-size: 17px;
  font-weight: bold;
  color: #333;
}
  </style>