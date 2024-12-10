<!-- TimeSelect.vue -->
<template>
    <div class="custom-select" v-click-outside="closeDropdown">
      <!-- 선택된 시간을 보여주는 헤더 -->
      <div class="select-header" @click="toggleDropdown">
        <span>{{ modelValue || '시간 선택' }}</span>
        <span class="arrow" :class="{ 'arrow-up': isOpen }">▼</span>
      </div>
      
      <!-- 드롭다운 메뉴 -->
      <div v-show="isOpen" class="select-dropdown">
        <div 
          v-for="hour in 24" 
          :key="hour"
          class="select-option"
          :class="{ 
            'selected': modelValue === formatHour(hour),
            'disabled': disabled || isPastTime(hour)
          }"
          @click="selectTime(hour)"
        >
          {{ formatHour(hour) }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: String,
    disabled: Boolean,
    selectedDate: String
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const isOpen = ref(false);
  
  const formatHour = (hour) => `${String(hour).padStart(2, '0')}:00`;
  
  const isPastTime = (hour) => {
    if (!props.selectedDate) return false;
    
    const now = new Date();
    const selectedDateTime = new Date(props.selectedDate);
    selectedDateTime.setHours(hour, 0, 0, 0);
  
    return selectedDateTime <= now && props.selectedDate === now.toISOString().split('T')[0];
  };
  
  const selectTime = (hour) => {
    if (props.disabled || isPastTime(hour)) return;
    
    const formattedTime = formatHour(hour);
    emit('update:modelValue', formattedTime);
    isOpen.value = false;
  };
  
  const toggleDropdown = () => {
    if (!props.disabled) {
      isOpen.value = !isOpen.value;
    }
  };
  
  const closeDropdown = () => {
    isOpen.value = false;
  };
  
  // 클릭 외부 감지를 위한 디렉티브
  const vClickOutside = {
    mounted(el, binding) {
      el._clickOutside = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
      document.addEventListener('click', el._clickOutside);
    },
    unmounted(el) {
      document.removeEventListener('click', el._clickOutside);
    }
  };
  </script>
  
  <style scoped>
  .custom-select {
    position: relative;
    width: 100px;
    user-select: none;
  }
  
  .select-header {
    height: 30px;
    padding: 0 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 13px;
  }

  
  .arrow {
  font-size: 10px;
    }

    .arrow-up {
    transform: scaleY(-1);  
    }
  
  .select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 4px;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  .select-option {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
  }

  
  .select-option.selected {
    background: #e6f7ff;
    color: #005950;
  }
  
  .select-option.disabled {
    color: #ccc;
    cursor: not-allowed;
    background: #f9f9f9;
  }
  
  /* 스크롤바 스타일링 */
  .select-dropdown::-webkit-scrollbar {
    width: 6px;
  }
  
  .select-dropdown::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  .select-dropdown::-webkit-scrollbar-thumb {
    background: #005950;
    border-radius: 3px;
  }
  </style>