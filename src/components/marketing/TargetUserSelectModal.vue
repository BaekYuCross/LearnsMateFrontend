<template>
  <div class="target-user-modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="target-user-modal-container" @click.stop>
      <div class="modal-header">
        <h2>타겟 유저 선택</h2>
        <button @click="closeModal" class="close-button">×</button>
      </div>

      <!-- TargetUserFilter 컴포넌트 추가 -->
      <TargetUserFilter @search="setFilteredUsers" />

      <div class="user-list">
        <div
          class="user-row"
          v-for="user in paginatedUsers"
          :key="user.memberCode"
        >
          <input
            type="checkbox"
            v-model="selectedUsers"
            :value="user"
          />
          <span>{{ user.name }} - {{ user.phone }}</span>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
        <span v-for="page in totalPages" :key="page">
          <button @click="changePage(page)" :class="{ active: currentPage === page }">{{ page }}</button>
        </span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
      </div>

      <div class="modal-footer">
        <button @click="submitSelection" class="submit-button">저장</button>
        <button @click="closeModal" class="cancel-button">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TargetUserFilter from './TargetUserFilter.vue';

const isOpen = ref(true);
const users = ref([]);
const selectedUsers = ref([]);
const currentPage = ref(1);
const pageSize = 10;

const totalPages = computed(() => Math.ceil(users.value.length / pageSize));
const paginatedUsers = computed(() =>
  users.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const emit = defineEmits(['close', 'submit']);

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const setFilteredUsers = (filteredUsers) => {
  users.value = filteredUsers; // 필터링된 유저 데이터 설정
  currentPage.value = 1;
};

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const submitSelection = () => {
  emit('submit', selectedUsers.value); // 선택된 유저 데이터 부모로 전달
  closeModal();
};
</script>
  
  <style scoped>
  .target-user-modal-overlay {
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
  
  .target-user-modal-container {
    background-color: white;
    width: 1200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #ddd;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
  .user-list {
    max-height: 300px;
    overflow-y: auto;
    padding: 16px;
    border-bottom: 1px solid #ddd;
  }
  
  .user-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .user-row input {
    margin-right: 8px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px 0;
  }
  
  .pagination button {
    margin: 0 4px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px;
  }
  
  .submit-button {
    padding: 8px 16px;
    background-color: #005950;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-button {
    padding: 8px 16px;
    background-color: #ccc;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  