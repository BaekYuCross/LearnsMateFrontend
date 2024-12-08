<template>
  <div class="voc-ai-modal-backdrop">
    <div class="voc-ai-modal-container">
      <button class="voc-ai-modal-close" @click="close">×</button>
      <h2 class="voc-ai-modal-title">주차 별 AI 요약 보고서</h2>

      <div class="voc-ai-date-picker">
        <label for="custom-monday-picker">날짜 선택:</label>
        <div id="custom-monday-picker" @click="toggleCalendar">
          <span>{{ formattedSelectedDate || "날짜를 선택하세요" }}</span>
        </div>
        <div v-if="isCalendarOpen" class="voc-ai-calendar-container">
          <div class="voc-ai-calendar-header">
            <button @click="changeMonth(-1)">◀</button>
            <span>{{ currentYear }}년 {{ currentMonth + 1 }}월</span>
            <button @click="changeMonth(1)">▶</button>
          </div>
          <div class="voc-ai-calendar-grid">
            <span v-for="(day, index) in daysOfWeek" :key="'day-' + index" class="voc-ai-calendar-day">{{ day }}</span>
            <button
              v-for="date in mondayDatesInMonth"
              :key="date"
              :class="['voc-ai-calendar-date', { 'selected': date === selectedDate }]"
              @click="selectDate(date)"
              :aria-label="'Select ' + new Date(date).toLocaleDateString('ko-KR')"
            >
              {{ new Date(date).getDate() }}
            </button>
          </div>
        </div>
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
  data() {
    return {
      localSummaryData: [],
      selectedDate: null,
      isCalendarOpen: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
    };
  },
  computed: {
    mondayDatesInMonth() {
      const dates = [];
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

      let currentDate = new Date(firstDayOfMonth);
      while (currentDate <= lastDayOfMonth) {
        if (currentDate.getDay() === 1) {
          dates.push(currentDate.toISOString().split("T")[0]);
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    },
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  data() {
    return {
      localSummaryData: [],
      selectedDate: null,
      formattedSelectedDate: null,
      isCalendarOpen: false,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
    };
  },
  methods: {
    toggleCalendar(event) {
      event.stopPropagation();
      this.isCalendarOpen = !this.isCalendarOpen;
    },
    handleOutsideClick(event) {
      const calendar = this.$el.querySelector("#custom-monday-picker");
      if (calendar && !calendar.contains(event.target)) {
        this.isCalendarOpen = false;
      }
    },
    changeMonth(direction) {
      const newMonth = this.currentMonth + direction;
      const newYear = this.currentYear + (newMonth < 0 ? -1 : newMonth > 11 ? 1 : 0);
      const adjustedMonth = (newMonth + 12) % 12;

      const newDate = new Date(newYear, adjustedMonth, 1);
      if (newDate < new Date(this.minDate) || newDate > new Date(this.maxDate)) {
        return;
      }

      this.currentYear = newYear;
      this.currentMonth = adjustedMonth;
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("ko-KR", options);
    },
    selectDate(date) {
      this.selectedDate = date;
      this.formattedSelectedDate = this.formatDate(date);
      this.isCalendarOpen = false;
      this.fetchAnalysisData(date);
    },
    async fetchAnalysisData(date) {
      try {
        const response = await axios.get("https://learnsmate.shop/voc/ai/by-date", {
          params: { date },
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
    close() {
      this.$emit("close");
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

.voc-ai-calendar-container {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
}

.voc-ai-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.voc-ai-calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.voc-ai-calendar-day {
  text-align: center;
  font-weight: bold;
  color: #555;
}

.voc-ai-calendar-date {
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
  padding: 8px;
  cursor: pointer;
}

.voc-ai-calendar-date:hover {
  background-color: #eef;
}

.voc-ai-calendar-date.selected {
  background-color: #007bff;
  color: white;
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
  word-wrap: break-word;
  max-width: 690px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

</style>