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
 data() {
   return {
     chartInstance: null,
   };
 },
 watch: {
   revenueData: {
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
   if (this.revenueData.length > 0) {
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
     const ctx = document.getElementById('revenueComparisonChart')?.getContext('2d');
     if (!ctx || !this.revenueData.length) return;

     const labels = [...new Set(this.revenueData.map(item => `${item.month}월`))];
     const currentYearData = this.revenueData
       .filter(item => item.year === new Date().getFullYear())
       .map(item => item.revenue);
     const previousYearData = this.revenueData
       .filter(item => item.year === new Date().getFullYear() - 1)
       .map(item => item.revenue);

     this.chartInstance = new Chart(ctx, {
       type: 'bar',
       data: {
         labels,
         datasets: [
           {
             label: `${new Date().getFullYear() - 1}년`,
             data: previousYearData,
             backgroundColor: '#BCF2E3',
           },
           {
             label: `${new Date().getFullYear()}년`,
             data: currentYearData,
             backgroundColor: '#029688',
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
           x: { 
             stacked: false,
             barPercentage: 0.3,
             categoryPercentage: 0.6,
             grid: {
               display: false,
             },
           },
           y: {
             beginAtZero: true,
             ticks: {
               callback: value => `${value.toLocaleString()} 원`,
             },
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
  height: 200px;
  margin-left: 10px;
}
</style>
