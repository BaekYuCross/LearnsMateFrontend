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