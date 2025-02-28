<template>
    <div class="modal-backdrop" v-if="isModalOpen">
      <div class="modal-container">
        <button class="modal-close" @click="closeModal">×</button>
        <h2 class="modal-title">{{ modalTitle }}</h2>
        <div class="modal-actions">
          <button class="modal-button" @click="confirmAction">예</button>
          <button class="modal-button" @click="cancelAction">아니오</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
   import { ref, defineProps, defineEmits } from 'vue';
  
    // 상태 관리
    const isModalOpen = ref(true);

    defineProps({
      modalTitle: String, // 모달 제목
    });

    const emit = defineEmits(['confirm', 'cancel']);
    
    // 모달 닫기
    const closeModal = () => {
      isModalOpen.value = false;
    };
    
    // "예" 버튼 클릭 시 동작
    const confirmAction = () => {
      emit('confirm'); // "예" 버튼 클릭 시 이벤트 전달
    };

    const cancelAction = () => {
      emit('cancel'); // "아니오" 버튼 클릭 시 이벤트 전달
    };
  </script>
  
  <style lang="scss" scoped>
  /* 배경 투명도 */
  .modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 회색 배경 투명도 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

  
  /* 모달 창 스타일 */
  .modal-container {
  background-color: #ffffff;
  width: 500px;
  height: 200px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  text-align: center;
  position: relative;

  /* 위, 아래 라인 추가 */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 9px; /* 라인 두께 */
    background-color: #B5CFCC; /* 라인 색상 */
  }

  /* 위쪽 라인 */
  &::before {
    top: 0;
    left: 0;
    border-top-left-radius: 10px; /* 모서리 둥글게 */
    border-top-right-radius: 10px; /* 모서리 둥글게 */
  }

  /* 아래쪽 라인 */
  &::after {
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 10px; /* 모서리 둥글게 */
    border-bottom-right-radius: 10px; /* 모서리 둥글게 */
  }
}

  
  /* 닫기 버튼 */
  .modal-close {
    position: absolute;
    top: 15px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  /* 제목 스타일 */
  .modal-title {
    margin-top: 35px;
    font-size: 23px;
    color: #193325; /* 제목 글자 색 */
  }
  
  /* 버튼 컨테이너 */
  .modal-actions {
    display: flex;
    justify-content: center; 
    margin-top: 40px;
    gap: 70px;
    
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
  
      &:hover {
        background-color: #124c47;
      }
    }
  }
  </style>
  