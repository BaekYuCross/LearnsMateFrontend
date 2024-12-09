<template>
    <div class="calendar-wrapper" v-show="isVisible">
      <div class="calendar">
        <div class="calendar-header">
          <button @click="previousMonth">&lt;</button>
          <span>{{ currentMonthYear }}</span>
          <button @click="nextMonth">&gt;</button>
        </div>
        <div class="calendar-body">
          <div class="weekdays">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
          </div>
          <div class="days">
            <div
              v-for="day in calendarDays"
              :key="day.date"
              class="day"
              :class="{
                'disabled': !day.isMonday || !isDateInRange(day.date),
                'selected': isSelected(day.date),
                'current': isCurrentMonth(day.date)
              }"
              @click="selectDate(day)"
            >
              {{ day.dayOfMonth }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomCalendar',
    props: {
      value: {
        type: String,
        default: null
      },
      minDate: {
        type: String,
        required: true
      },
      maxDate: {
        type: String,
        required: true
      },
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        currentDate: new Date(),
        weekDays: ['일', '월', '화', '수', '목', '금', '토'],
        selectedDate: this.value ? new Date(this.value) : null
      }
    },
    computed: {
      currentMonthYear() {
        return this.currentDate.toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: 'long' 
        });
      },
      calendarDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];
  
        // 이전 달의 날짜들
        const prevMonthDays = firstDay.getDay();
        for (let i = prevMonthDays - 1; i >= 0; i--) {
          const date = new Date(year, month, -i);
          days.push({
            date: date.toISOString().split('T')[0],
            dayOfMonth: date.getDate(),
            isMonday: date.getDay() === 1
          });
        }
  
        // 현재 달의 날짜들
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const date = new Date(year, month, i);
          days.push({
            date: date.toISOString().split('T')[0],
            dayOfMonth: i,
            isMonday: date.getDay() === 1
          });
        }
  
        // 다음 달의 날짜들
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(year, month + 1, i);
          days.push({
            date: date.toISOString().split('T')[0],
            dayOfMonth: date.getDate(),
            isMonday: date.getDay() === 1
          });
        }
  
        return days;
      }
    },
    methods: {
      previousMonth() {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() - 1,
          1
        );
      },
      nextMonth() {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + 1,
          1
        );
      },
      isDateInRange(date) {
        return date >= this.minDate && date <= this.maxDate;
      },
      isSelected(date) {
        return this.selectedDate && 
          date === this.selectedDate.toISOString().split('T')[0];
      },
      isCurrentMonth(date) {
        const currentMonth = this.currentDate.getMonth();
        return new Date(date).getMonth() === currentMonth;
      },
      selectDate(day) {
        if (!day.isMonday || !this.isDateInRange(day.date)) return;
        
        this.selectedDate = new Date(day.date);
        this.$emit('input', day.date);
        this.$emit('select', day.date);
      }
    }
  }
  </script>
  
  <style scoped>
  .calendar-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 12px;
    margin-top: 4px;
  }
  
  .calendar {
    width: 280px;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .calendar-header button {
    border: none;
    background: none;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .calendar-header button:hover {
    background-color: #f0f0f0;
  }
  
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
  
  .day {
    padding: 8px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .day:hover:not(.disabled) {
    background-color: #f0f0f0;
  }
  
  .disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .selected {
    background-color: #145f58;
    color: white;
  }
  
  .current:not(.disabled) {
    color: #145f58;
  }
  
  .day:not(.current) {
    color: #999;
  }
  </style>