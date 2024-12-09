<template>
  <div class="voc-ai-modal-backdrop">
    <div 
      class="voc-ai-modal-container"
      :class="{ 'expanded': showCalendar }"
    >
      <button class="voc-ai-modal-close" @click="close">×</button>
      <h2 class="voc-ai-modal-title">주차 별 AI 요약 보고서</h2>

      <div class="voc-ai-date-picker">
        <label for="monday-picker">날짜 선택:</label>
        <div class="date-input-wrapper">
          <input
            type="text"
            id="monday-picker"
            :value="formatDate(selectedDate)"
            readonly
            @click="toggleCalendar"
          />
          <CustomCalendar
            v-model="selectedDate"
            :min-date="minDate"
            :max-date="maxDate"
            :is-visible="showCalendar"
            @select="handleDateSelect"
          />
        </div>
      </div>

      <div v-if="localSummaryData.length > 0" :class="{ 'content-wrapper': true, 'hidden': showCalendar }">
        <table class="voc-ai-modal-summary-table">
          <thead>
            <tr>
              <th>키워드</th>
              <th>건수</th>
              <th>추천 답안</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in localSummaryData" :key="index">
              <td>{{ item.keyword }}</td>
              <td>{{ item.keywordCount }}건</td>
              <td>{{ item.recommendation }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="voc-ai-modal-message">
        <p>요약 데이터를 불러오는 중입니다...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CustomCalendar from './VOCCustomCalendar.vue';

export default {
  name: "VocAiModal",
  components: {
    CustomCalendar
  },
  props: {
    summaryData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localSummaryData: [],
      selectedDate: null,
      minDate: "2023-06-01",
      maxDate: new Date().toISOString().split("T")[0],
      showCalendar: false
    };
  },
  created() {
    const today = new Date();
    while (today.getDay() !== 1) {
      today.setDate(today.getDate() - 1);
    }
    this.selectedDate = today.toISOString().split('T')[0];
    this.fetchAnalysisData(this.selectedDate);
  },
  watch: {
    summaryData: {
      immediate: true,
      handler(newValue) {
        this.localSummaryData = [...newValue];
      },
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
    },
    handleDateSelect(date) {
      this.showCalendar = false;
      this.fetchAnalysisData(date);
    },
    close() {
      this.$emit("close");
    },
    async fetchAnalysisData(date) {
      try {
        const response = await axios.get("https://learnsmate.shop/voc/ai/by-date", {
          params: { date }
        });

        if (response.status === 204 || !response.data.length) {
          this.localSummaryData = [];
          alert("선택한 날짜에 데이터가 없습니다.");
        } else {
          this.localSummaryData = response.data;
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        alert("데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.voc-ai-date-picker input {
  cursor: pointer;
  background: #fff;
}

.voc-ai-date-picker input::-webkit-calendar-picker-indicator {
  display: none;
}

.voc-ai-date-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.voc-ai-date-picker label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.voc-ai-date-picker input {
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  color: #333;
  width: 200px;
}

.voc-ai-date-picker input:focus {
  outline: none;
  border-color: #145f58;
  box-shadow: 0 0 5px rgba(20, 95, 88, 0.5);
}

.voc-ai-date-picker input::-webkit-calendar-picker-indicator {
  background-color: #ffffff;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
}

.voc-ai-date-picker input:invalid {
  border-color: #ff0000;
}

.voc-ai-modal-backdrop {
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

.voc-ai-modal-container {
  background-color: #ffffff;
  width: 1100px;
  max-width: 90%;
  max-height: 90vh;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  overflow-y: auto;
  position: relative;

  &.expanded {
    height: auto !important;
    min-height: 450px;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 9px;
    background-color: #B5CFCC;
  }

  &::before {
    top: 0;
    left: 0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &::after {
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.voc-ai-modal-close {
  position: absolute;
  top: 15px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.voc-ai-modal-title {
  margin-top: 20px;
  font-size: 20px;
  color: #193325;
  text-align: center;
}

.voc-ai-modal-message {
  text-align: center;
  color: #666;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.voc-ai-modal-summary-table {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border-collapse: collapse;
  margin-top: 20px;
  table-layout: fixed; /* 테이블 레이아웃을 고정으로 설정 */
}

.voc-ai-modal-summary-table th,
.voc-ai-modal-summary-table td {
  border: 1px solid #ddd;
  padding: 10px;
  vertical-align: top;
}

.voc-ai-modal-summary-table th:nth-child(1),
.voc-ai-modal-summary-table td:nth-child(1) {
  width: 20%; /* 키워드 컬럼 */
}

.voc-ai-modal-summary-table th:nth-child(2),
.voc-ai-modal-summary-table td:nth-child(2) {
  width: 15%; /* 건수 컬럼 */
}

.voc-ai-modal-summary-table th:nth-child(3),
.voc-ai-modal-summary-table td:nth-child(3) {
  width: 65%; /* 추천 답안 컬럼 */
}

.voc-ai-modal-summary-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.voc-ai-modal-summary-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.voc-ai-modal-summary-table tr:hover {
  background-color: #f1f1f1;
}

.voc-ai-modal-summary-table td {
  font-size: 12px;
  text-align: left;
  word-break: break-all; /* 긴 텍스트를 여러 줄로 나누기 */
  white-space: normal; /* 줄바꿈 허용 */
  line-height: 1.4; /* 줄 간격 조정 */
}

.voc-ai-modal-summary-table tr:hover {
  background-color: #f1f1f1;
}

.content-wrapper {
  transition: opacity 0.3s ease-in-out;
  opacity: 1;
}

.content-wrapper.hidden {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

.date-input-wrapper {
  position: relative;
  display: inline-block;
  z-index: 1001;
}
</style>