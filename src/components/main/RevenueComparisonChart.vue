<template>
    <div class="chart-container">
      <canvas id="revenueComparisonChart"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
    name: "RevenueComparisonChart",
    props: {
      revenueData: {
        type: Array,
        required: true,
      },
    },
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        const ctx = document.getElementById('revenueComparisonChart').getContext('2d');
  
        // 데이터 가공
        const labels = [...new Set(this.revenueData.map(item => `${item.month}월`))];
        const currentYearData = this.revenueData
          .filter(item => item.year === new Date().getFullYear())
          .map(item => item.revenue);
        const previousYearData = this.revenueData
          .filter(item => item.year === new Date().getFullYear() - 1)
          .map(item => item.revenue);
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels, // x축: 월
            datasets: [
              {
                label: `${new Date().getFullYear() - 1}년`, // 전년도
                data: previousYearData,
                backgroundColor: '#53CCAC', 
              },
              {
                label: `${new Date().getFullYear()}년`, // 올해
                data: currentYearData,
                backgroundColor: '#F9C94F',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top' },
            },
            scales: {
              x: { stacked: false,
                    barPercentage: 0.3, // 막대 너비 설정 (0~1, 1이 최대 너비)
                    categoryPercentage: 0.6, 
                    grid: {
                display: false, // x축 격자 무늬 제거
                },
                },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: value => `${value.toLocaleString()} 원`, // 숫자 콤마 표시
                },
                grid: {
                display: false, // x축 격자 무늬 제거
                },
              },
            },
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    max-width: 400px;
    height: 200px;
    margin-left: 10px;
  }
  </style>
  