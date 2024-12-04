<template>
  <header class="header-container" v-if="isLoggedIn">
    <nav class="nav-container">
      <div class="logo-section" @click="Main">
        <h1>LearnsMate</h1>
      </div>

      <div class="menu-section">
        <ul class="menu-list">
          <li
            v-for="menu in menus"
            :key="menu.path"
            class="menu-item"
            :class="{ 'active': currentGroup === menu.group }"
            @click="navigateTo(menu.path)"
          >
            {{ menu.name }}
          </li>
        </ul>
      </div>

      <div class="icon-section">
        <div class="user-info2">
          <p class="logouttime">자동 로그아웃 시간 : </p>
          <span :class="{ 'timer': true, 'expired': remainingTime === '만료됨' }">
            {{ remainingTime }}
          </span>

          <button class="extend-btn" @click="refreshToken">연장</button>
        </div>
        <div class="user-info">
          [{{ adminTeam }}]
          <span class="highlight">{{ adminName }}</span> 님, 반갑습니다.
        </div>
        <img src="@/assets/icons/account.svg" alt="계정" class="icon">
        <img src="@/assets/icons/bell.svg" alt="알림" class="icon">
        <img src="@/assets/icons/logout.svg" alt="로그아웃" class="icon" @click="Logout">
        <img src="@/assets/icons/search.svg" alt="검색" class="icon">
        <img src="@/assets/icons/settings.svg" alt="설정" class="icon" @click="goToLearnsBuddy">
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useLoginState } from '@/stores/loginState';

const loginState = useLoginState();
const { isLoggedIn, adminName, adminTeam, exp } = storeToRefs(loginState); // Pinia 상태 참조
const router = useRouter();
const route = useRoute();
const timer = ref(null);

const menus = ref([
  { name: '메인', path: '/main', group: 'main' },
  { name: '강의', path: '/lecture', group: 'lecture', includePaths: ['/lecture', '/payment'] },
  {
    name: '고객',
    path: '/student',
    group: 'member',
    includePaths: ['/student', '/tutor'],
  },
  { name: '마케팅', path: '/marketing', group: 'marketing' },
  { name: 'VOC', path: '/voc', group: 'voc' },
]);

// 만료 시간을 배열로 변환하는 함수
function parseExpirationToArray(exp) {
  const [date, time] = exp.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);
  return [year, month, day, hour, minute, second];
}

// 토큰 갱신
async function refreshToken() {
  try {
    const response = await axios.post('https://learnsmate.shop/auth/refresh', {}, { withCredentials: true });

    const newExp = response.data.exp;
    if (newExp) {
      const parsedExp = parseExpirationToArray(newExp);
      loginState.setExp(parsedExp); // Pinia 상태 업데이트
      startTimer(); // 타이머 갱신
    } else {
      console.warn('서버에서 만료 시간이 반환되지 않았습니다.');
    }
  } catch (error) {
    console.error('토큰 갱신 실패:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      alert('토큰 갱신 실패: 다시 로그인하세요.');
      await Logout(); // 로그아웃 처리
    }
  }
}

// 남은 시간 계산
const calculateRemainingTime = () => {
  if (!exp.value || !Array.isArray(exp.value) || exp.value.length !== 6) {
    return '00:00:00';
  }

  const [year, month, day, hour, minute, second] = exp.value;
  const expirationDate = new Date(year, month - 1, day, hour, minute, second);
  const now = new Date();

  const diffInSeconds = Math.floor((expirationDate - now) / 1000);

  if (diffInSeconds <= 0) {
    clearInterval(timer.value);
    Logout();
    return '만료됨';
  }

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const remainingTime = ref(calculateRemainingTime());

const currentGroup = computed(() => {
  const currentPath = route.path;
  const matchedMenu = menus.value.find((menu) => {
    if (menu.includePaths) {
      return menu.includePaths.some((path) => currentPath.startsWith(path));
    }
    return currentPath.startsWith(menu.path);
  });
  return matchedMenu ? matchedMenu.group : null;
});

const Logout = async () => {
  await loginState.logout();
  alert('로그아웃되었습니다.');
  router.push('/login');
};

const navigateTo = (path) => {
  router.push(path);
};

const goToLearnsBuddy = () => {
  router.push('/client-main');
};

const Main = () => {
  router.push('/');
};

const startTimer = () => {
  if (timer.value) clearInterval(timer.value);
  remainingTime.value = calculateRemainingTime();
  timer.value = setInterval(() => {
    remainingTime.value = calculateRemainingTime();
  }, 1000);
};

watch(
  () => exp.value,
  (newValue) => {
    if (newValue) {
      startTimer();
    } else if (timer.value) {
      clearInterval(timer.value);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (!isLoggedIn.value) {
    try {
      await loginState.fetchLoginState();
    } catch (error) {
      console.error('Failed to fetch login state:', error);
    }
  }
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

  <style scoped>
  .timer {
    padding-top: 3.5px;
  font-size: 13px;
  margin-right: 9px;
  color: #0f0f0f;
  }

  .expired {
    color: red;
  }

  .header-container {
    font-family:'Pretendard-Regular';
    width: 100%;
    height: 50px;
    background-color: #ffffff;
    border-bottom: 3px solid #005950;
    position: fixed;
  }
  
  .nav-container {
    max-width: 1920px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
  
  .logo-section h1 {
    cursor: pointer;
    color: #000000;
    font-size: 20px;
    font-weight: bold;
    white-space: nowrap;
  }
  
  .menu-section {
    flex: 1;
    margin: 0 20px 0 30px;
  }
  
  .menu-list {
    display: flex;
    list-style: none;
    padding: 0;
    gap: 10px;
    margin: 0;
    justify-content: flex-start;
  }
  
  .menu-item {
    font-family:'Pretendard-Regular';
    color: #000000;
    cursor: pointer;
    font-size: 16px;
    white-space: nowrap;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 25px;
    padding-bottom: 25px;
    position: relative;
    width: 52px;
    height: 44.6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .menu-item.active {
    color: #FFFFFF;
    background-color: #005950;
    margin-bottom: -3px;
  }
  
  .icon-section {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .user-info {
    padding-right: 6px;
    padding-top: 5px;
    font-size: 13.5px;
    font-weight: bold;
   color: #000000; 
}

.user-info2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  margin-right: 15px;
    font-size: 16px;
   color: #000000; 
}
.logouttime{
  padding-top: 5px;
  margin-right: 5px;
    font-size: 13px;
   color: #000000; 
}


.extend-btn {
  pointer-events: auto;
  padding: 5px 7px;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  background-color: #005950;
  border: none;
  border-radius: 4px;
  cursor: pointer !important; 
  transition: background-color 0.3s;
}



.highlight {
  color: #005950; 
}
  
  .icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    flex-shrink: 0;
  }
  </style>