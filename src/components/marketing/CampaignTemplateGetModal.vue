<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>캠페인 템플릿 조회</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-content">
        <div class="input-group">
          <label>템플릿 제목</label>
          <input 
            type="text" 
            v-if="isEditMode"
            v-model="campaignTemplate.campaign_template_title"
            placeholder="템플릿 제목을 입력하세요."
          >
          <span v-else class="detail-content content-multiline">{{ campaignTemplate.campaign_template_title }}</span>
        </div>
        <div class="input-group">
          <label>담당자</label>
          <span class="detail-content content-multiline">{{ campaignTemplate.admin_name }}</span>
        </div>
        <div class="input-group content-group">
          <label>템플릿 내용</label>
          <textarea
              v-if="isEditMode"
              v-model="campaignTemplate.campaign_template_contents"
              class="detail-content-textarea"
              placeholder="캠페인 내용을 입력하세요"
              rows="10"
            ></textarea>
            <span v-else class="detail-content content-multiline">{{ campaignTemplate.campaign_template_contents }}</span>
        </div>
      </div>
      <div class="modal-footer">
        <button v-if="!isEditMode" class="submit-button" @click="handleEdit">수정</button>
        <button v-if="isEditMode" class="submit-button" @click="saveChanges">저장</button>
        <button v-if="!isEditMode" class="delete-button" @click="handleDelete">삭제</button>
        <button v-if="isEditMode" class="cancel-button" @click="cancelEdit">취소</button>
      </div>
    </div>
  </div>
  <DeleteModule
      v-if="isDeleteModalOpen"
      modalTitle="캠페인 템플릿을 삭제하시겠습니까?"
      @confirm="deleteCampaignTemplate"
      @cancel="cancelDelete"
    />
    <ConfirmModule
      v-if="isConfirmModalOpen"
      modalTitle="성공적으로 수정되었습니다."
      @confirm="successEdit"
      @cancel="closeModal"
    />
</template>

<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue';
import axios from 'axios';
import DeleteModule from '../modules/DeleteModule.vue';
import ConfirmModule from '../modules/ConfirmModule.vue';

const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ'; 

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const props = defineProps({
campaignTemplateCode: {
  type: Number,
  required: true,
},
});

const emit = defineEmits(['close']);

const isOpen = ref(true);
const isEditMode = ref(false);
const isDeleteModalOpen = ref(false);
const isConfirmModalOpen = ref(false);

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

const campaignTemplate = ref({
  campaign_template_title: '',
  campaign_template_contents: '',
  admin_name: '',
});
console.log("부모에서 넘어온 템플릿코드: ",props.campaignTemplateCode);
const fetchCampaignTemplate = async () => {
try {
  const response = await axios.get(`http://localhost:5000/campaign-template/${props.campaignTemplateCode}`, {
    headers: {
      Authorization: token,
    },
  });
  campaignTemplate.value = response.data;
  console.log('캠페인 템플릿 조회 성공:', response.data);
} catch (error) {
  console.error('캠페인 템플릿 조회 실패:', error);
}
};

onMounted(fetchCampaignTemplate);

const handleEdit = async () => {
console.log('템플릿 수정 모드');
  isEditMode.value = true;
};

const cancelEdit = () => {
  isEditMode.value = false;
};

const saveChanges = async () => {
  const payload = {
        campaignTemplateTitle: campaignTemplate.value.campaign_template_title,
        campaignTemplateContents: campaignTemplate.value.campaign_template_contents,
        adminName: campaignTemplate.value.admin_name, 
    };
    console.log("요청한 수정 정보: ", payload);
  try {
      await axios.patch(`http://localhost:5000/campaign-template/edit/${props.campaignTemplateCode}`,payload,{
      headers: {
        Authorization: token,
      }
    });
    isConfirmModalOpen.value = true;
    isEditMode.value = false;
    fetchCampaignTemplate();
  } catch (error) {
    console.error('캠페인 템플릿 수정 실패:', error);
  }
};

const handleDelete = async () => {
  isDeleteModalOpen.value = true;
};

const deleteCampaignTemplate = async () => {
  console.log('템플릿 삭제 요청');
 try {
  await axios.patch(`http://localhost:5000/campaign-template/delete/${props.campaignTemplateCode}`,{
    headers: {
      Authorization: token,
    }
  });
  fetchCampaignTemplate();
  isDeleteModalOpen.value = false;
  closeModal();
 } catch (error) {
  console.error("캠페인 템플릿 삭제 실패:",error);
 }
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
    return;
  };

  const successEdit = () => {
    isConfirmModalOpen.value = false;
    return;
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

.detail-content {
  flex: 1; 
  border: 1px solid #ddd; 
  padding: 15px;
  font-size: 13px; 
  outline: none;
  font-family: inherit; 
  background-color: white; 
  color: #595656;
  white-space: pre-wrap;
}

.content-multiline {
  display: inline-block;
  resize: none;
}


.modal-footer {
display: flex;
justify-content: center;
gap: 10px;
padding: 20px;
border-top: 1px solid #eee;
}

.delete-button,
.cancel-button,
.submit-button {
padding: 8px 30px;
border-radius: 4px;
font-size: 14px;
cursor: pointer;
}

.delete-button,
.cancel-button,
.submit-button {
background-color: #005950;
border: none;
color: white;
}
</style>