<template>
  <div class="voc-edit-modal-backdrop" v-if="isModalOpen">
    <div class="voc-edit-modal-container">
      <button class="voc-edit-modal-close" @click="closeModal">×</button>
      <h2 class="voc-edit-modal-title">{{ modalTitle }}</h2>
      <p class="voc-edit-modal-message">{{ confirmMessage }}</p>
      <div class="voc-edit-modal-actions">
        <button class="voc-edit-modal-button" @click="confirmAction">예</button>
        <button class="voc-edit-modal-button" @click="closeModal">아니오</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isModalOpen: { type: Boolean, required: true },
  modalTitle: { type: String, required: true },
  confirmMessage: { type: String, required: true },
});

const emit = defineEmits(['confirm', 'cancel']);

const closeModal = () => {
  emit('cancel');
};

const confirmAction = () => {
  emit('confirm');
};
</script>
  
  <style lang="scss" scoped>
  /* 배경 투명도 */
  .voc-edit-modal-backdrop {
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
  .voc-edit-modal-container {
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
  .voc-edit-modal-close {
    position: absolute;
    top: 15px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  /* 제목 스타일 */
  .voc-edit-modal-title {
    margin-top: 35px;
    font-size: 23px;
    color: #193325; /* 제목 글자 색 */
  }
  
  /* 버튼 컨테이너 */
  .voc-edit-modal-actions {
    display: flex;
    justify-content: center; 
    margin-top: 40px;
    gap: 70px;
    
    .voc-edit-modal-button {
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
  