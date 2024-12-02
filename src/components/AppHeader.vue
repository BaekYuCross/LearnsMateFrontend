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
      <span :class="{ 'timer': true, 'expired': remainingTime === '만료됨' }">
      [{{ remainingTime }}]
      </span>

      <div class="icon-section">
        <div class="user-info2">
          <P class="logouttime">자동 로그아웃 시간 : </P>
  <span id="countdown-timer"></span> <!-- 카운트다운 타이머 -->
  <button id="extend-btn" onclick="refreshToken()">연장</button> <!-- 연장 버튼 -->
</div>
        <div class="user-info">
  [{{ loginState.adminTeam }}] 
  <span class="highlight">{{ loginState.adminName }}</span> 님, 반갑습니다.
</div>
        <img src="@/assets/icons/account.svg" alt="계정" class="icon">
        <img src="@/assets/icons/bell.svg" alt="알림" class="icon">
        <img src="@/assets/icons/logout.svg" alt="로그아웃" class="icon"  @click="Logout">
        <img src="@/assets/icons/search.svg" alt="검색" class="icon">
        <img src="@/assets/icons/settings.svg" alt="설정" class="icon" @click="goToLearnsBuddy">
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch} from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

// 남은 시간을 계산하는 함수
const calculateRemainingTime = () => {
  if (!loginState.exp || !Array.isArray(loginState.exp)) return '';
  
  const [year, month, day, hour, minute, second] = loginState.exp;
  const expirationDate = new Date(year, month - 1, day, hour, minute, second);
  const now = new Date();
  
  const diffInSeconds = Math.floor((expirationDate - now) / 1000);
  
  if (diffInSeconds <= 0) {
    clearInterval(timer.value);
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

// 토큰 만료 시간 (4시간 후)
let tokenExpirationTime = Date.now() + 4 * 60 * 60 * 1000; // 현재 시간 + 4시간 (밀리초)

// 카운트다운 타이머 업데이트
function updateCountdown() {
  const countdownElement = document.getElementById('countdown-timer');
  const remainingTime = tokenExpirationTime - Date.now();

  if (remainingTime <= 0) {
    // 시간이 다 되면 자동 로그아웃
    countdownElement.textContent = "00:00";
    logout();
  } else {
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    // 카운트다운 업데이트
    countdownElement.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}

// 00:00 형식으로 만들기
function pad(num) {
  return num < 10 ? '0' + num : num;
}

// 리프레시 토큰 요청
function refreshToken() {
  fetch('http://localhost:5000/auth/refresh', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getRefreshToken()}`
    },
  })
  .then(response => response.json())
  .then(data => {
    // 리프레시 성공시, 새로운 만료 시간 설정
    if (data.success) {
      tokenExpirationTime = Date.now() + 4 * 60 * 60 * 1000; // 4시간 연장
      document.getElementById('extend-btn').style.display = 'none'; // 연장 버튼 숨김
    }
  })
  .catch(error => {
    console.error('Error refreshing token:', error);
  });
}

// 로그아웃 처리
function logout() {
  // 로그아웃 처리를 여기서 실행
  alert("로그인 시간이 만료되었습니다. 로그인 창으로 이동합니다.");
  window.location.href = '/login'; // 로그인 화면으로 이동
}

// 초기 카운트다운 업데이트 (매초마다 실행)
setInterval(updateCountdown, 1000);

// 리프레시 토큰을 가져오는 함수 (예시로 localStorage에서 가져오는 경우)
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}


const navigateTo = (path) => {
  router.push(path);
};

const goToLearnsBuddy = (path) => {
  router.push('/client-main');
};

const Main = (path) => {
  router.push('/');
};

const Logout = async () => {
  await loginState.logout();
  alert('로그아웃되었습니다.');
  router.push('/login');
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
}, { immediate: true });  // immediate: true로 설정하여 즉시 실행

onMounted(async () => {
  if (!loginState.isLoggedIn) {
    await loginState.fetchLoginState(); 
  }
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
    font-family: monospace;
    font-weight: bold;
    color: #005950;
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
#countdown-timer {
  padding-top: 3.5px;
  font-size: 13px;
  margin-right: 9px;
  color: #0f0f0f;
}

#extend-btn {
  padding: 5px 7px;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  background-color: #005950;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#extend-btn:hover {
  background-color: #005950;
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