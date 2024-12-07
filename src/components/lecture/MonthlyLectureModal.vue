<template>
    <div v-if="isOpen" class="lecture-modal-overlay">
      <div class="lecture-modal-container">
        <div class="lecture-modal-header">
          <h2>월별/연도별 강의 수</h2>
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
  const monthlyData = ref([]);
  let chart = null;
  const currentYear = new Date().getFullYear();
  const years = ref(Array.from({length: 5}, (_, i) => currentYear - 4 + i));
  const months = ref(Array.from({length: 12}, (_, i) => i + 1));
  const filter = ref({
    startYear: currentYear - 1,
    startMonth: 1,
    endYear: currentYear,
    endMonth: 12
  });

  const createChart = () => {
    if (chart) {
        chart.destroy();
    }

    const ctx = chartCanvas.value.getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.value.map(item => item.date),
            datasets: [{
                label: '강의 수',
                data: monthlyData.value.map(item => item.lectureCount),
                backgroundColor: 'rgba(75, 192, 192, 0.05)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 10,
                        padding: 10,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: '월별 강의 등록 현황',
                    position: 'top',
                    align: 'center',
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
                    beginAtZero: false, // 0부터 시작하지 않도록 설정
                    min: 10, // Y축의 최소값 설정
                    ticks: {
                        stepSize: 10, // Grid 간격 설정
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 12
                        },
                        padding: 10
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
};
  
  const fetchMonthlyData = async (useFilter = false) => {
    try {
      let response;
      if (useFilter) {
        response = await axios.post('http://localhost:5000/lecture/monthly-counts/filter', filter.value);
      } else {
        response = await axios.get('http://localhost:5000/lecture/monthly-counts');
      }
      monthlyData.value = response.data;
      await createChart();
    } catch (error) {
      console.error('월별 강의 수 데이터를 불러오는데 실패했습니다:', error);
    }
  };

  const applyFilter = () => {
    fetchMonthlyData(true);
  };

  const resetFilter = () => {
    filter.value = {
      startYear: currentYear - 1,
      startMonth: 1,
      endYear: currentYear,
      endMonth: 12
    };
    fetchMonthlyData(false);
  };
  
  const closeModal = () => {
    if (chart) {
      chart.destroy();
    }
    emit('close');
  };
  
  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      fetchMonthlyData();
    }
  });
  
  onMounted(() => {
    if (props.isOpen) {
      fetchMonthlyData();
    }
  });
  </script>
  
  <style scoped>
  .lecture-modal-overlay {
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
  
.lecture-modal-container {
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
  
.lecture-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.lecture-modal-header h2 {
  padding-top: 10px;
  padding-left: 10px;
  font-size: 18px;
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

  .lecture-filter-row {
    display: flex;
    padding: 3px 10px;
    background-color: #EFEFEF;
    border-top: #D9D9D9;
    border-bottom: #D9D9D9;
  }

  .lecture-filter-item {
    width: 50%;
    padding-left: 8px;
    display: flex;
    align-items: center;
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
  outline: none;
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
  outline: none;
  width: 80px;
}

.lecture-month-input {
  outline: none;
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

.lecture-search-button:hover {
  background-color: #004c42;  
}

.lecture-reset-button:hover {
  background-color: #f8fafc;
}

.lecture-search-button:focus,
.lecture-reset-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}

  .lecture-chart-container {
    width: 100%;
    height: 450px;
    position: relative;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

.close-button {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
}
  </style>