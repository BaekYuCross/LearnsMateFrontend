<template>
    <div class="chart-container">
      <canvas id="categoryBarChart"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, watch, onMounted } from 'vue';
  import Chart from 'chart.js/auto';
  
  export default {
  name: "CategoryBarChart",
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  watch: {
    categories: {
      handler() {
        this.$nextTick(() => {
          if (this.chartInstance) {
            this.chartInstance.destroy();
          }
          this.createChart();
        });
      },
      deep: true,
    },
  },
  mounted() {
    if (this.categories.length > 0) {
      this.createChart();
    }
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
  methods: {
    createChart() {
      const ctx = document.getElementById('categoryBarChart')?.getContext('2d');
      if (!ctx || !this.categories.length) return;

      const topCategories = this.categories.slice(0, 3);

      this.chartInstance = new Chart(ctx, {
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
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { stepSize: 5 },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: { font: { size: 12 } },
              grid: {
                display: false,
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
  