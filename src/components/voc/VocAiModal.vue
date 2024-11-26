<template>
    <div class="voc-ai-modal-backdrop" v-if="localSummaryData">
      <div class="voc-ai-modal-container">
        <button class="voc-ai-modal-close" @click="close">×</button>
        <h2 class="voc-ai-modal-title">주차 별 AI 요약 보고서</h2>
        
        <div class="voc-ai-date-picker">
          <label for="monday-picker">날짜 선택:</label>
          <input
            type="date"
            id="monday-picker"
            :value="selectedDate"
            @change="fetchAnalysisData"
            :min="minDate"
          />
        </div>

        <div v-if="localSummaryData.length > 0">
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
        <div v-else>
          <p class="voc-ai-modal-message">요약 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    </div>
  </template>  

<script>
import axios from "axios";

export default {
  name: "VocAiModal",
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
    };
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
    close() {
      this.$emit("close");
    },
    isMonday(dateString) {
      const date = new Date(dateString);
      return date.getDay() === 1;
    },
    async fetchAnalysisData(event) {
      const selectedDate = event.target.value;

      if (!this.isMonday(selectedDate)) {
        alert("월요일만 선택할 수 있습니다.");
        return;
      }

      this.selectedDate = selectedDate;

      try {
        const response = await axios.get("http://localhost:5000/voc/ai/by-date", {
          params: { date: selectedDate },
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
  width: 100%; /* 표를 모달 컨테이너의 너비에 맞춤 */
  max-height: 300px; /* 표의 최대 높이를 제한 */
  overflow-y: auto; /* 표 내용이 넘칠 경우 스크롤 추가 */
  border-collapse: collapse;
  margin-top: 20px;
}

.voc-ai-modal-summary-table th,
.voc-ai-modal-summary-table td {
  border: 1px solid #ddd;
  padding: 10px;
  word-wrap: break-word; /* 긴 텍스트 줄바꿈 */
  text-align: center; /* 텍스트를 가운데 정렬 */
}

.voc-ai-modal-summary-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #333;
}

.voc-ai-modal-summary-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.voc-ai-modal-summary-table tr:hover {
  background-color: #f1f1f1;
}

.voc-ai-modal-summary-table td {
  font-size: 12px;
  overflow: hidden; /* 텍스트가 셀 내부를 넘지 않도록 제한 */
  text-overflow: ellipsis; /* 텍스트가 길 경우 말줄임 표시 */
  white-space: nowrap; /* 텍스트를 한 줄로 유지 */
}

</style>
