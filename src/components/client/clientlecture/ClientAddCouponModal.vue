<template>
  <div class="clientaddcoupon-modal-overlay">
    <div class="clientaddcoupon-modal">
      <button class="modal-close" @click="closeModal">X</button>
      <h2 class="clientaddcoupon-modal-title">쿠폰 생성</h2>

      <label class="clientaddcoupon-modal-label">
        강의 <span class="clientaddcoupon-modal-label-note">(프로모션에 동의한 강의만 선택 가능합니다.)</span>
        <select v-model="newCoupon.lecture" class="clientaddcoupon-modal-input">
          <option value="" disabled>강의를 선택해주세요</option>
          <option v-for="lecture in lectures" :key="lecture.lecture_code" :value="lecture.lecture_code">{{ lecture.lecture_title }}</option>
        </select>
      </label>

      <label class="clientaddcoupon-modal-label">
        할인율(%)
        <input v-model="newCoupon.discount" type="number" class="clientaddcoupon-modal-input" placeholder="할인율을 입력해주세요" />
      </label>

      <label class="clientaddcoupon-modal-label">
        쿠폰 수량(개) <span class="clientaddcoupon-modal-label-note">(제한 수량입니다.)</span>
        <input v-model="newCoupon.quantity" type="number" class="clientaddcoupon-modal-input" placeholder="숫자를 입력해주세요" />
      </label>

      <label class="clientaddcoupon-modal-label">
        쿠폰 만료일 <span class="clientaddcoupon-modal-label-note">(~23시 59분까지 유효합니다.)</span>
        <div class="clientaddcoupon-modal-date-inputs">
          <input v-model="newCoupon.expiryYear" type="number" class="clientaddcoupon-modal-date-input" placeholder="YYYY" />
          <input v-model="newCoupon.expiryMonth" type="number" class="clientaddcoupon-modal-date-input" placeholder="MM" />
          <input v-model="newCoupon.expiryDay" type="number" class="clientaddcoupon-modal-date-input" placeholder="DD" />
        </div>
      </label>
      <button class="clientaddcoupon-save-button" @click="saveCoupon">저장하기</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, defineEmits, onMounted } from "vue";
import axios from 'axios';

const emit = defineEmits(["close", "apply"]);
const closeModal = () => emit("close");
const lectures = ref([]);

const newCoupon = ref({
  lecture: "",
  discount: "",
  quantity: "",
  expiryYear: "",
  expiryMonth: "",
  expiryDay: "",
});

const fetchLectures = async () => {
  try {
    const tutorCode = JSON.parse(localStorage.getItem("clientInfo")).member_code;
    const response = await axios.get(`http://localhost:5000/lecture/client/${tutorCode}`);
    
    console.log('API Response:', response.data);
    
    lectures.value = response.data.map(lecture => ({
      lecture_code: lecture.lecture_code,
      lecture_title: lecture.lecture_title
    }));
    
    console.log('Mapped lectures:', lectures.value);
  } catch (error) {
    console.error('Failed to fetch lectures:', error);
  }
};

onMounted(() => {
  fetchLectures(); 
});
// 날짜 유효성 검사를 위한 함수
const isValidDate = () => {
  const today = new Date();
  const selectedDate = new Date(
    newCoupon.value.expiryYear,
    newCoupon.value.expiryMonth - 1,
    newCoupon.value.expiryDay
  );
  
  if (isNaN(selectedDate.getTime())) {
    return false;
  }
  
  return selectedDate > today;
};

const saveCoupon = async () => {
  if (
    !newCoupon.value.lecture ||
    !newCoupon.value.discount ||
    !newCoupon.value.expiryYear ||
    !newCoupon.value.expiryMonth ||
    !newCoupon.value.expiryDay
  ) {
    alert("모든 필드를 입력하세요!");
    return;
  }

  // 할인율 범위 검사 (1~100)
  const discountRate = parseInt(newCoupon.value.discount);
  if (isNaN(discountRate) || discountRate < 1 || discountRate > 100) {
    alert("할인율은 1에서 100 사이의 숫자여야 합니다.");
    return;
  }

  // 날짜 유효성 검사
  if (!isValidDate()) {
    alert("만료일은 오늘 이후 날짜여야 하며, 유효한 날짜를 입력해주세요.");
    return;
  }

  try {
    const selectedLecture = lectures.value.find(
      lecture => lecture.lecture_code === newCoupon.value.lecture
    );

    // 날짜 포맷팅 (YYYY-MM-DDTHH:mm:ss)
    const expiryDate = `${newCoupon.value.expiryYear}-${
      String(newCoupon.value.expiryMonth).padStart(2, '0')
    }-${String(newCoupon.value.expiryDay).padStart(2, '0')}T23:59:59`;

    const requestData = {
      coupon_name: selectedLecture.lecture_title,
      coupon_discount_rate: discountRate,
      coupon_expire_date: expiryDate,
      tutor_code: JSON.parse(localStorage.getItem("clientInfo")).member_code,
      coupon_category_code: 1,
      lecture_code: newCoupon.value.lecture
    };

    const response = await axios.post('http://localhost:5000/coupon/tutor/register', requestData, {
      withCredentials: true
    });

    if (response.status === 201) {
      alert("쿠폰이 성공적으로 저장되었습니다.");
      closeModal();
    }
  } catch (error) {
    console.error('Failed to save coupon:', error);
    alert("쿠폰 저장에 실패했습니다.");
  }
};
</script>

<style scoped>
.clientaddcoupon-modal-overlay {
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

.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding-left: 330px;
}

.clientaddcoupon-modal {
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: left;
}

.clientaddcoupon-modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
}

.clientaddcoupon-modal-label {
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
  display: block;
  color: #333;
}

.clientaddcoupon-modal-label-note {
  font-size: 12px;
  color: #ff0000;
  font-weight: 100;
  margin-left: 5px;
}

.clientaddcoupon-modal-input {
  width: 100%;
  padding: 10px 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-weight: 500;
  box-sizing: border-box;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  text-overflow: ellipsis;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
}

.clientaddcoupon-modal-input:hover {
  border-color: #7671f4;
  background-color: #f1f1ff;
}

.clientaddcoupon-modal-input:focus {
  outline: none;
  border-color: #5651d6;
  box-shadow: 0 0 4px rgba(118, 113, 244, 0.5);
  background-color: #ffffff;
}

.clientaddcoupon-modal-input option {
  font-size: 13px;
  padding: 5px;
  white-space: normal;
  word-wrap: break-word;
}

.clientaddcoupon-modal-date-inputs {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.clientaddcoupon-modal-date-input {
  width: 100%;
  padding: 10px 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.clientaddcoupon-modal-date-input:hover {
  border-color: #7671f4;
  background-color: #f1f1ff;
}

.clientaddcoupon-modal-date-input:focus {
  outline: none;
  border-color: #5651d6;
  box-shadow: 0 0 4px rgba(118, 113, 244, 0.5);
  background-color: #ffffff;
}

.clientaddcoupon-save-button {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 10px 15px;
  font-size: 16px;
  color: #fff;
  background-color: #7671f4;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}

.clientaddcoupon-save-button:hover {
  background-color: #5651d6;
}
</style>
