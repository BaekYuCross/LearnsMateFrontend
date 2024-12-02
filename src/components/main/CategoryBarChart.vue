<template>
    <div class="chart-container">
      <canvas id="categoryBarChart"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto';
  
  export default {
  name: "CategoryBarChart",
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const ctx = document.getElementById('categoryBarChart').getContext('2d');
      const topCategories = this.categories.slice(0, 3); // 상위 3개만 가져오기

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topCategories.map((category) => category.name),
          datasets: [
            {
              label: '카테고리 비율 (%)',
              data: topCategories.map((category) => category.ratio),
              backgroundColor: ['#B5CAEA', '#88DFCA', '#D8D1E6'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y', // 가로 막대형 차트로 변경
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false, // 범례 숨기기
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { stepSize: 5 },
              grid: {
                display: false, // x축 격자 무늬 제거
                },
            },
            y: {
              ticks: { font: { size: 12 } },
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
    margin: auto;
  }
  </style>
  