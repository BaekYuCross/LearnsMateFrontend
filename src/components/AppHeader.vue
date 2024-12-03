<template>
  <header class="header-container">
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

          <!-- Vue 방식으로 수정 -->
          <button class="extend-btn" @click="refreshToken">연장</button>
        </div>
        <div class="user-info">
          [{{ loginState.adminTeam }}] 
          <span class="highlight">{{ loginState.adminName }}</span> 님, 반갑습니다.
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
import axios from 'axios';
import { useLoginState } from '@/stores/loginState';

const loginState = useLoginState(); 
const router = useRouter();
const route = useRoute();
const timer = ref(null);

const menus = ref([
  { name: '메인', path: '/main', group: 'main' },
  { name: '강의', path: '/lecture', group: 'lecture' },
  { 
    name: '고객', 
    path: '/student', 
    group: 'member',
    includePaths: ['/student', '/tutor']
  },
  { name: '마케팅', path: '/marketing', group: 'marketing' },
  { name: 'VOC', path: '/voc', group: 'voc' },
]);

// 만료 시간을 배열로 변환하는 함수
function parseExpirationToArray(exp) {
  const [date, time] = exp.split(' '); // 날짜와 시간을 분리
  const [year, month, day] = date.split('-').map(Number); // 연, 월, 일을 숫자로 변환
  const [hour, minute, second] = time.split(':').map(Number); // 시, 분, 초를 숫자로 변환
  return [year, month, day, hour, minute, second]; // 배열 형식으로 반환
}


async function refreshToken() {
  try {
    // 서버의 토큰 갱신 API
    const response = await axios.post(
      'http://localhost:5000/auth/refresh', // 서버의 토큰 갱신 API URL
      {},
      {
        withCredentials: true, // 쿠키를 자동으로 포함하여 요청
      }
    );
    
    console.log('뉴토큰 갱신 성공:', response.data);

    // 서버 응답에서 새로운 만료 시간 가져오기
    const newExp = response.data.exp; //2024-12-03 09:21:27 이렇게 뽑힘

    if (newExp) {
      // 새로운 만료 시간을 배열 형식으로 변환
      const parsedExp = parseExpirationToArray(newExp);

      // 새로운 만료 시간을 loginState에 설정
      loginState.setExp(parsedExp);

      // 타이머 갱신
      startTimer();

    } else {
      console.warn('서버에서 만료 시간이 반환되지 않았습니다.');
    }

    // 이후 클라이언트에서 newAccessToken을 활용할 로직 추가
  } catch (error) {
    console.error('토큰 갱신 실패:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      alert('토큰 갱신 실패: 다시 로그인하세요.');
      await Logout(); // 로그아웃 처리
    }
  }
}


// 남은 시간을 계산하는 함수
const calculateRemainingTime = () => {
  if (!loginState.exp || !Array.isArray(loginState.exp)) return '';
  
  const [year, month, day, hour, minute, second] = loginState.exp;
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

// 남은 시간을 표시할 ref
const remainingTime = ref(calculateRemainingTime());

const currentGroup = computed(() => {
  const currentPath = route.path;
  const matchedMenu = menus.value.find(menu => {
    if (menu.includePaths) {
      return menu.includePaths.some(path => currentPath.startsWith(path));
    }
    return currentPath.startsWith(menu.path);
  });
  return matchedMenu ? matchedMenu.group : null;
});


// 로그아웃 처리
const Logout = async () => {
  await loginState.logout();
  alert('로그아웃되었습니다.');
  router.push('/login');
};

const navigateTo = (path) => {
  router.push(path);
};

const goToLearnsBuddy = (path) => {
  router.push('/client-main');
};

const Main = (path) => {
  router.push('/');
};

const startTimer = () => {
  if (timer.value) clearInterval(timer.value);
  remainingTime.value = calculateRemainingTime();
  timer.value = setInterval(() => {
    remainingTime.value = calculateRemainingTime();
  }, 1000);
};

watch(() => loginState.exp, (newValue) => {
  if (newValue) {
    startTimer();
  }
}, { immediate: true });

onMounted(async () => {
  if (!loginState.isLoggedIn) {
    await loginState.fetchLoginState(); 
  }
  startTimer();
});

// 컴포넌트가 언마운트될 때 타이머 정리
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
    gap: 15px;
    align-items: center;
  }

  .user-info {
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