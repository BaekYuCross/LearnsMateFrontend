<template>
    <div class="modal-backdrop" v-if="isOpen">
      <div class="modal-container">
        <button class="modal-close" @click="$emit('cancel')">×</button>
        <h2 class="modal-title">블랙리스트 등록 사유</h2>
        <div class="modal-content">
          <textarea 
            v-model="reasonInput" 
            placeholder="블랙리스트 등록 사유를 입력해주세요"
            class="modal-textarea"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button class="modal-button" @click="handleConfirm">등록</button>
          <button class="modal-button" @click="$emit('cancel')">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    isOpen: Boolean,
  });
  
  const emit = defineEmits(['cancel', 'confirm']);
  const reasonInput = ref('');
  
  const handleConfirm = () => {
    if (!reasonInput.value.trim()) {
      alert('등록 사유를 입력해주세요.');
      return;
    }
    emit('confirm', reasonInput.value);
    reasonInput.value = ''; // 초기화
  };
  </script>
  
  <style scoped>
  .modal-backdrop {
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
  
  .modal-container {
    background-color: #ffffff;
    width: 500px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    padding: 20px;
    position: relative;
  }
  
  .modal-close {
    position: absolute;
    top: 15px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  .modal-title {
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 23px;
    color: #193325;
    text-align: center;
  }
  
  .modal-content {
    margin: 20px auto; 
    width: 90%; 
  }
  
  .modal-textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    margin: 0 auto;
    display: block; 
    outline: none;
  }
  
  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 70px;
    margin-top: 20px;
  }
  
  .modal-button {
    background-color: #145f58;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    width: 90px;
    height: 32px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-button:hover {
    background-color: #124c47;
  }
  </style>