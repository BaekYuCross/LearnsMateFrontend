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

<style scoped>
.inactivity-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(4, 7, 24, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 30px 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  font-size: 26px;
  font-weight: bolder;
  margin-bottom: 10px;
  color: #333;
}

.modal-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.modal-buttons button {
  padding: 10px 30px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.modal-buttons button:first-child {
  border: 1px solid #7671f4;
  color: #7671f4;
}

.modal-buttons button:first-child:hover {
  background-color: #7671f4;
  color: white;
}

.modal-buttons button:last-child {
  border: 1px solid #C071F4;
  color: #C071F4;
}

.modal-buttons button:last-child:hover {
  background-color: #C071F4;
  color: white;
}
</style>