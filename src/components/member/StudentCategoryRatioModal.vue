<template>
    <div v-if="isOpen" class="lecture-modal-overlay">
      <div class="lecture-modal-container">
        <div class="lecture-modal-header">
          <h2>강의 카테고리 비율</h2>
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
                전체 인원: {{ totalCount.toLocaleString() }}명
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
  'rgba(75, 192, 192, 0.7)',   // 청록색
  'rgba(255, 99, 132, 0.7)',   // 분홍색
  'rgba(255, 205, 86, 0.7)',   // 노란색
  'rgba(54, 162, 235, 0.7)',   // 파란색
  'rgba(153, 102, 255, 0.7)',  // 보라색
  'rgba(255, 159, 64, 0.7)',   // 주황색
  'rgba(201, 203, 207, 0.7)'   // 회색
];
  
  const token = 'Bearer yourTokenHere'; // 실제 토큰으로 교체 필요
  const createChart = (data) => {
  if (chart) {
    chart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  const labels = data.map(item => item.category);
  const counts = data.map(item => item.count);
  const percentages = data.map(item => item.percentage);
  
  totalCount.value = counts.reduce((acc, curr) => acc + curr, 0);  // .value 추가

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
      title: {
        display: false
      },
      legend: {
        position: 'bottom',  // 범례 위치를 아래로 변경
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12
          }
        },
        maxWidth: 250
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const label = labels[dataIndex];
            const count = counts[dataIndex];
            const percentage = percentages[dataIndex];
            return `${label}: ${count.toLocaleString()}명 (${percentage.toFixed(1)}%)`;
          }
        }
      }
    },
    layout: {
      padding: {
        top: 50,
        right: 20,
        bottom: 30,  // 아래 여백 조금 더 추가
        left: 20
      }
    }
  }
});
};

const fetchCategoryRatio = async (useFilter = false) => {
  try {
    let response;
    if (useFilter) {
      const filterData = {
        startDate: `${filter.value.startYear}-${filter.value.startMonth.toString().padStart(2, '0')}-01T00:00:00`,
        endDate: `${filter.value.endYear}-${filter.value.endMonth.toString().padStart(2, '0')}-31T23:59:59`
      };
      response = await axios.post('http://localhost:5000/member/category-ratio/filter', filterData, {
        headers: {
          Authorization: token
        }
      });
    } else {
      response = await axios.get('http://localhost:5000/member/category-ratio', {
        headers: {
          Authorization: token
        }
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
    font-size: 11px;
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
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
  
  .search-img, .reset-img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  
  .close-button {
    font-size: 24px;
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
  top: 20px;
  left: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}
  </style>