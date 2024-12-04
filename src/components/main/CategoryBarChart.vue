<template>
  <div class="chart-container">
    <canvas ref="categoryBarChart"></canvas>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
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
        this.updateChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.createChart();
  },
  beforeUnmount() {
    this.destroyChart();
  },
  methods: {
    createChart() {
      const ctx = this.$refs.categoryBarChart.getContext('2d');
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
              grid: { display: false },
            },
            y: {
              ticks: { font: { size: 12 } },
              grid: { display: false },
            },
          },
        },
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.createChart();
    },
    destroyChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }
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
