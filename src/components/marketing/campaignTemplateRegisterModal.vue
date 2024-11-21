<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>캠페인 템플릿 등록</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="input-group">
            <label>템플릿 제목</label>
            <input 
              type="text" 
              v-model="formData.campaignTemplateTitle"
              placeholder="템플릿 제목을 입력하세요."
            >
          </div>
          <div class="input-group">
            <label>담당자</label>
            <input 
              type="text" 
              v-model="formData.adminCode"
              placeholder="나중에 로그인한 직원 이름이 들어가용 ^^"
            >
          </div>
          <div class="input-group content-group">
            <label>템플릿 내용</label>
            <textarea 
              v-model="formData.campaignTemplateContents"
              placeholder="템플릿 내용을 입력하세요."
              rows="10"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="submit-button" @click="handleSubmit">저장</button>
        </div>
      </div>
    </div>
  <FalseModule 
    v-if="cancleModal"
    @close="handleModalClose"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import FalseModule from '@/components/modules/FalseModule.vue';

const emit = defineEmits(['close', 'submit']);
const cancleModal = ref(false);

const isOpen = ref(true);
const formData = ref({
  campaignTemplateTitle: '',
  campaignTemplateContents: '',
  adminCode: ''
});

const clickCancel = () => {
  cancleModal.value = true;
};

const handleModalClose = () => {
  cancleModal.value = false;
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:8080/campaign-template/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value)
    });

    if (response.ok) {
      emit('submit', formData.value);
      closeModal();
    } else {
      console.error('Failed to submit template');
    }
  } catch (error) {
    console.error('Error submitting template:', error);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  width: 800px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 4px solid #005950;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-content {
  padding: 20px;
}

.input-group {
  display: flex;
  margin-bottom: -1px;
}

.input-group label {
  width: 150px;
  background-color: #f9f9f9;
  padding: 15px 10px;
  font-size: 14px;
  font-weight: lighter;
  color: #595656;
  border: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
}

.input-group input,
.input-group textarea {
  flex: 1;
  border: 1px solid #ddd;
  padding: 15px;
  font-size: 13px;
  outline: none;
  resize: none;
  font-family: inherit;
}

.input-group input::placeholder,
.input-group textarea::placeholder {
  color: #999;
}

.content-group textarea {
  min-height: 200px;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.cancel-button,
.submit-button {
  padding: 8px 30px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.submit-button {
  background-color: #005950;
  border: none;
  color: white;
}
</style>