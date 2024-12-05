<template>
    <div v-if="isOpen" class="payment-modal-overlay">
      <div class="payment-modal-container">
        <div class="payment-modal-header">
          <h2>월별 매출액 비교</h2>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="payment-modal-content">
          <div class="payment-filter-card">
            <div class="payment-filter-container">
              <div class="payment-section-header">
                <h2 class="payment-section-title">기간 필터</h2>
                <div class="payment-filter-group">
                  <div class="payment-period-container">
                    <div class="period-item">
                      <span class="payment-filter-label">조회 년도</span>
                      <div class="payment-date-container">
                        <select v-model="filter.year" class="payment-filter-input payment-year-input">
                          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="payment-button-group">
                    <button @click="applyFilter" class="payment-search-button">
                      <img class="search-img" src="/src/assets/icons/search_white.svg" alt="">조회
                    </button>
                    <button @click="resetFilter" class="payment-reset-button">
                      <img class="reset-img" src="/src/assets/icons/reset.svg" alt="">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="payment-chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps, defineEmits, watch } from 'vue';
  import axios from 'axios';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  const chartCanvas = ref(null);
  const revenueData = ref({
    currentYear: [],
    previousYear: []
  });
  let chart = null;
  
  const currentYear = new Date().getFullYear();
  const years = ref(Array.from({length: 5}, (_, i) => currentYear - 4 + i));
  const months = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  const filter = ref({
    year: currentYear
  });
  
  const createChart = () => {
    if (chart) {
      chart.destroy();
    }
  
    const ctx = chartCanvas.value.getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months.map(month => `${month}월`),
        datasets: [
        {
          label: `${filter.value.year - 1}년`,
          data: revenueData.value.previousYear,
          backgroundColor: 'rgba(200, 200, 200, 0.6)',
          borderColor: 'rgba(200, 200, 200, 0.8)',
          borderWidth: 1
        },
        {
          label: `${filter.value.year}년`,
          data: revenueData.value.currentYear,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: '월별 매출액 비교',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value.toLocaleString('ko-KR') + '원';
              },
              font: {
                size: 12
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  };
  
  const fetchRevenueData = async () => {
  try {
    const response = await axios.get(`https://learnsmate.shop/payments`, {
      params: {
        page: 0,
        size: 1
      }
    });
    
    const graphData = response.data.graphData;
    const currentYearData = graphData[filter.value.year] || Array(12).fill(0);
    const previousYearData = graphData[filter.value.year - 1] || Array(12).fill(0);

    revenueData.value = {
      previousYear: previousYearData.map(item => item.totalRevenue),
      currentYear: currentYearData.map(item => item.totalRevenue)
    };

    createChart();
  } catch (error) {
    console.error('매출액 데이터를 불러오는데 실패했습니다:', error);
  }
};
  
  const applyFilter = () => {
    fetchRevenueData();
  };
  
  const resetFilter = () => {
    filter.value.year = currentYear;
    fetchRevenueData();
  };
  
  const closeModal = () => {
    if (chart) {
      chart.destroy();
    }
    emit('close');
  };
  
  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      fetchRevenueData();
    }
  });
  
  onMounted(() => {
    if (props.isOpen) {
      fetchRevenueData();
    }
  });
  </script>
  
  <style scoped>
  .payment-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .payment-modal-container {
    background-color: #ffffff;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  position: relative;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  padding: 10px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 9px;
    background-color: #b5cfcc;
  }

  &::before {
    top: 0;
    left: 0;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &::after {
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  }
  
  .payment-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .payment-modal-header h2 {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .payment-filter-card {
    margin-bottom: 16px;
    background-color: white;
    padding: 0;
  }
  
  .payment-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
  }
  
  .payment-section-title {
    font-size: 14px;
    font-weight: bold;
  }
  
  .payment-filter-container {
    display: flex;
    flex-direction: column;
  }
  
  .payment-filter-group {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .payment-period-container {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .period-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .payment-filter-label {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .payment-date-container {
    display: flex;
    gap: 8px;
  }
  
  .payment-filter-input {
    padding: 5px 5px;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
  }
  
  .payment-year-input {
    outline: none;
    width: 80px;
  }
  
  .payment-button-group {
    display: flex;
    gap: 0.5rem;
  }
  
  .payment-search-button {
    padding: 2px 6px 3px 3px;
    background-color: #005950;
    border: 1px solid #005950;
    border-radius: 4px;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;
    margin: 4px 0;
  }
  
  .payment-reset-button {
    padding: 4px 5px 3px;
    border: 1px solid #A29D9D;
    border-radius: 4px;
    font-size: 10px;
    background-color: white;
    margin: 4px 0;
  }
  
  .payment-search-button:hover {
    background-color: #004c42;
  }
  
  .payment-reset-button:hover {
    background-color: #f8fafc;
  }
  
  .payment-chart-container {
    width: 100%;
    height: 450px;
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 30px;
    margin-bottom: 10px;
    cursor: pointer;
    color: #999;
  }
  
  .close-button:hover {
    color: #333;
  }
  </style>