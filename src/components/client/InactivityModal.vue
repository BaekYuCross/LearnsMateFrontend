<template>
    <div v-if="show" class="inactivity-modal">
      <div class="modal-content">
        <h2>사용 중이신가요?</h2>
        <p>장시간 움직임이 감지되지 않았습니다.</p>
        <div class="modal-buttons">
          <button @click="$emit('continue')">예</button>
          <button @click="$emit('logout')">아니오</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: Boolean
  });
  
  defineEmits(['continue', 'logout']);
  </script>