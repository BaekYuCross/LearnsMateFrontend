<template>
  <div class="target-user-modal-overlay" v-if="isOpen" @click="closeModal">
    <div class="target-user-select-modal-container" @click.stop>
      <div class="target-user-select-modal-header">
        <h2>타겟 유저</h2>
        <button class="target-user-select-close-button" @click="closeModal">&times;</button>
      </div>
      <TargetUserFilter @search="applyFilters" @reset="applyFilters({})" />
      <div class="target-user-select-modal-content">
        <div class="target-user-content-container">
          <div class="target-user-count">전체 학생 <span class="target-user-length">{{ users.length }}</span>명</div>
          <div class="target-user-board-container">
            <div class="target-user-board-header">
              <div class="target-user-board-header-select">선택</div>
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
              <div class="target-user-board-row" v-for="user in paginatedUsers" :key="user.user_code">
                <div class="target-user-board-row-select">
                  <input
                    type="checkbox"
                    :value="user"
                    v-model="selectedUsers"
                  />
                </div>
                <!-- 쿠폰 -> 멤버로 변경하기!!!!!!! -->
                <div class="target-user-board-row-code">{{ user.member_code }}</div>
                <div class="target-user-board-row-name">{{ user.member_name }}</div>
                <div class="target-user-board-row-email">{{ user.member_email }}</div>
                <div class="target-user-board-row-phone">{{ user.member_phone }}</div>
                <div class="target-user-board-row-address">{{ user.member_address }}</div>
                <div class="target-user-board-row-age">{{ user.member_age }}</div>
                <div class="target-user-board-row-birth">{{ formatDateFromArray(user.member_birth) }}</div>
                <div class="target-user-board-row-memberflag">{{ user.member_flag }}</div>
                <div class="target-user-board-row-createdat">{{ formatDateTimeFromArray(user.updated_at) }}</div>
                <div class="target-user-board-row-dormantflag">{{ user.member_dormant_status }}</div>
              </div>

              <div class="target-user-pagination">
                <button 
                    class="target-user-page-button target-user-prev-button" 
                    @click="changePage(currentPage - 1)" 
                    :disabled="currentPage === 1">◀이전</button>
                <span v-for="page in totalPages" :key="page" class="page-number">
                    <button 
                    class="target-user-page-button" 
                    :class="{ active: currentPage === page }" 
                    @click="changePage(page)">{{ page }}</button>
                </span>
                <button 
                    class="target-user-page-button target-user-next-button"
                    @click="changePage(currentPage + 1)" 
                    :disabled="currentPage === totalPages">다음▶</button>
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
const cancleModal = ref(false);

const isOpen = ref(true);
const users = ref([]);
const selectedUsers = ref([]);

const fetchUsers = async () => {
    try {
      const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ';
      const response = await axios.get('http://localhost:5000/member/students',{
        method: 'GET',
        headers: {
          Authorization: token,
          }
        });
        users.value = response.data;
        console.log(users.value);
        console.log(users.value.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const saveSelection = () => {
  emit('submit', selectedUsers.value);
};

const currentPage = ref(1);
const pageSize = 15;

const totalPages = computed(() => Math.ceil(users.value.length / pageSize));

const paginatedUsers = computed(() =>
  Array.isArray(users.value)
    ? users.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
    : []
);

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatDateTimeFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 6) return ''; // 유효하지 않은 데이터 처리
  const [year, month, day, hours, minutes, seconds] = dateArray;
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatDateFromArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return ''; // 유효하지 않은 데이터 처리
  const [year, month, day, hours, minutes ] = dateArray;
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
};

const applyFilters = async (filters) => {
  try {
    const token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDIwMDEwMDEiLCJlbWFpbCI6ImRid3BkbXMxMTIyQG5hdmVyLmNvbSIsIm5hbWUiOiLsnKDsoJzsnYAiLCJyb2xlcyI6W10sImlhdCI6MTczMjA2MzM2OSwiZXhwIjoxNzc1MjYzMzY5fQ.bAHcsoQVi8dd-XFl0aWUE6srz68YbToSmhzPKHgYhkxETTWsoT2o5iGQ0r0LYVx2d3MqplgXGDVGxOqcXDAHEQ';
    const response = await axios.post(
      'http://localhost:5000/member/filter/student', 
      filters,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    users.value = response.data; 
    currentPage.value = 1; 
    console.log('Filtered Users:', users.value);
  } catch (error) {
    console.error('Error fetching filtered users:', error);
  }
};

onMounted(async() => {
  await fetchUsers();
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
  </style>
  