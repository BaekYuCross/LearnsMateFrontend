<template>
  <div class="target-user-modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="target-user-select-modal-container" @click.stop>
      <div class="target-user-select-modal-header">
        <h2>타겟 유저</h2>
        <button class="target-user-select-close-button" @click="closeModal">&times;</button>
      </div>
      <TargetUserFilter @search="handleSearch" @reset="handleReset" />
      <div class="target-user-select-modal-content">
        <div class="target-user-content-container">
          <div class="target-user-count">전체 학생 <span class="target-user-length">{{ totalCount }}</span>명</div>
          <div class="target-user-board-container">
            <div class="target-user-board-header">
              <div class="target-user-board-header-select">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="selectAll"
                  class="select-all-checkbox"
                />
              </div>
              <div class="target-user-board-header-code">학생 코드</div>
              <div class="target-user-board-header-name">이름</div>
              <div class="target-user-board-header-email">이메일</div>
              <div class="target-user-board-header-phone">연락처</div>
              <div class="target-user-board-header-address">주소</div>
              <div class="target-user-board-header-age">나이</div>
              <div class="target-user-board-header-birth">생년월일</div>
              <div class="target-user-board-header-memberflag">계정상태</div>
              <div class="target-user-board-header-createdat">생성일</div>
              <div class="target-user-board-header-dormantflag">휴면상태</div>
            </div>
            <div class="target-user-board-body">
              <div class="target-user-board-row" v-for="user in users" :key="user.member_code">
                <div class="target-user-board-row-select">
                  <input
                    type="checkbox"
                    :value="user"
                    v-model="selectedUsers"
                    :checked="isSelected(user)"
                  />
                </div>
                <div class="target-user-board-row-code">{{ user.member_code }}</div>
                <div class="target-user-board-row-name">{{ user.member_name }}</div>
                <div class="target-user-board-row-email">{{ user.member_email }}</div>
                <div class="target-user-board-row-phone">{{ user.member_phone }}</div>
                <div class="target-user-board-row-address">{{ user.member_address }}</div>
                <div class="target-user-board-row-age">{{ user.member_age }}</div>
                <div class="target-user-board-row-birth">{{ user.member_birth }}</div>
                <div class="target-user-board-row-memberflag">{{ user.member_flag === true ? '활성' : '비활성' }}</div>
                <div class="target-user-board-row-createdat">{{ user.created_at }}</div>
                <div class="target-user-board-row-dormantflag">{{ user.member_dormant_flag === true ? '휴면' : '활성' }}</div>
              </div>

              <div class="pagination">
                <button class="page-button prev-button" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">◀</button>
                <button class="page-button" :class="{ active: currentPage === 1 }" @click="changePage(1)">1</button>
                <span v-if="startPage > 2">...</span>
                <template v-for="page in displayedPages" :key="page">
                  <button v-if="page !== 1 && page !== totalPages" class="page-button" :class="{ active: currentPage === page }" @click="changePage(page)">{{ page }}</button>
                </template>
                <span v-if="endPage < totalPages - 1">...</span>
                <button v-if="totalPages > 1" class="page-button" :class="{ active: currentPage === totalPages }" @click="changePage(totalPages)">{{ totalPages }}</button>
                <button class="page-button next-button" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">▶</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="target-user-select-modal-footer">
        <button class="target-user-select-submit-button" @click='saveSelection'>저장</button>
      </div>    
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import axios from 'axios';
import TargetUserFilter from './TargetUserFilter.vue';

const emit = defineEmits(['submit', 'close']);

const isOpen = ref(true);
const users = ref([]);
const selectedUsers = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;
const isFiltered = ref(false);
const lastFilterData = ref(null);

const camelToSnake = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/member/students', {
      params: {
        page: currentPage.value - 1,
        size: pageSize
      },
      withCredentials: true,
    });
    users.value = camelToSnake(response.data.content);
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const isAllSelected = computed(() => {
  return users.value.length > 0 && selectedUsers.value.length === users.value.length;
});

const isSelected = (user) => {
  return selectedUsers.value.some(selected => selected.member_code === user.member_code);
};

const selectAll = async (event) => {
  if (event.target.checked) {
    try {
      let response;
      if (isFiltered.value && lastFilterData.value) {
        // 필터링된 전체 데이터 가져오기
        response = await axios.post(
          'http://localhost:5000/member/filter/student',
          camelToSnake(lastFilterData.value),
          {
            params: {
              page: 0,
              size: totalCount.value // 전체 데이터를 한 번에 가져오기 위해 size를 totalCount로 설정
            },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // 필터링되지 않은 전체 데이터 가져오기
        response = await axios.get('http://localhost:5000/member/students', {
          params: {
            page: 0,
            size: totalCount.value
          },
          withCredentials: true,
        });
      }
      selectedUsers.value = camelToSnake(response.data.content);
    } catch (error) {
      console.error('Failed to fetch all users:', error);
    }
  } else {
    selectedUsers.value = [];
  }
};

const handleSearch = async (filterData) => {
  try {
    isFiltered.value = true;
    lastFilterData.value = filterData;
    currentPage.value = 1;
    selectedUsers.value = []; // 검색 시 선택 초기화 추가
    console.log(lastFilterData.value);
    const response = await axios.post(
      'http://localhost:5000/member/filter/student',
      filterData,
      {
        params: {
          page: currentPage.value - 1,
          size: pageSize
        },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    users.value = camelToSnake(response.data.content);
    totalCount.value = response.data.totalElements;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to filter users:', error);
  }
};

const handleReset = () => {
  isFiltered.value = false;
  lastFilterData.value = null;
  currentPage.value = 1;
  selectedUsers.value = []; // 초기화 시 선택 초기화 추가
  fetchUsers();
};

const displayedPages = computed(() => {
  // 앞뒤로 2페이지씩 보이도록 수정
  let start = Math.max(currentPage.value - 2, 2);
  let end = Math.min(start + 4, totalPages.value - 1); // 4로 변경하여 더 많은 페이지 표시
  
  // end가 마지막 페이지에 가까울 때 start를 조정
  if (end === totalPages.value - 1) {
    start = Math.max(end - 4, 2); // 마찬가지로 4로 변경
  }
  
  // start가 2에 가까울 때 end를 조정
  if (start === 2) {
    end = Math.min(6, totalPages.value - 1); // 첫 페이지 다음부터 5개 페이지 표시
  }
  
  let pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const startPage = computed(() => {
  return displayedPages.value[0];
});

const endPage = computed(() => {
  return displayedPages.value[displayedPages.value.length - 1];
});

const changePage = async (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  
  currentPage.value = newPage; 
  
  if (isFiltered.value && lastFilterData.value) {
    await handleSearch(lastFilterData.value);
  } else {
    await fetchUsers();
  }
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const saveSelection = () => {
  emit('submit', selectedUsers.value);
};


onMounted(() => {
  fetchUsers();
});
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

  .target-user-select-modal-container {
    background-color: white;
    width: 1200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .target-user-select-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 4px solid #005950;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }

  .target-user-select-modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .target-user-select-close-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .target-user-select-modal-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f9f9f9;
    padding: 10px;
    border: 1px solid #ddd;
    height: 300px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1); 
  }

  .target-user-content-container {
    display: block;
    flex-grow: 1;
    overflow-y: auto;
  }

  .target-user-board-container {
    background-color: #F9F9F9;
  }

  .target-user-board-header {
    display: grid;
    grid-template-columns: 0.5fr 0.8fr 1fr 2fr 1fr 3fr 1fr 1fr 1fr 1fr 1fr;
    padding: 10px 20px;
    background-color: #f9f9f9;
    font-size: 13px;
    font-weight: bold;
    color: #595656;
    text-align: center;
  }

  .target-user-board-body {
    display: flex;
    flex-direction: column;
  }

  .target-user-board-row {
    display: grid;
    grid-template-columns: 0.5fr 0.8fr 1fr 2fr 1fr 3fr 1fr 1fr 1fr 1fr 1fr;
    padding: 10px 20px;
    border-bottom: 1px solid #eaeaea;
    font-size: 11px;
    color: #333333;
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  .target-user-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .target-user-page-button {
    background: none;
    border: none;
    color: #333;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 13px;
  }
    
  .target-user-page-button.active {
    font-weight: bold;
  }
  
  .target-user-page-button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }

  .target-user-select-modal-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  }

  .target-user-select-submit-button {
    padding: 8px 30px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .target-user-select-submit-button {
    background-color: #005950;
    border: none;
    color: white;
  }

  .select-all-checkbox {
    cursor: pointer;
  }

  .target-user-board-header-select,
  .target-user-board-row-select {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  input[type="checkbox"] {
    cursor: pointer;
    width: 15px;
    height: 15px;
    margin: 0;
    accent-color: #005950; 
  }

  .target-user-count {
    font-size: 17px;
    font-weight: bold;
    color: #333;
  }

  .target-user-length {
    color: #005950;
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

  .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-button {
  background: none;
  border: none;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 13px;
  margin: 0 2px;
}

.page-button.active {
  font-weight: bold;
  color: #005950;
}

.page-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.prev-button,
.next-button {
  font-size: 12px;
}
  </style>
  