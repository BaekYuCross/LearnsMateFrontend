<template>
  <header class="header-container" v-if="!isLoading && isLoggedIn !== null && isLoggedIn">
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

          <button class="extend-btn" 
                  @click.prevent="() => { 
                    console.log('clicked'); 
                    refreshToken(); 
                  }">
            연장
          </button>
        </div>
        <div class="user-info">
          [{{ adminTeam }}]
          <span class="highlight">{{ adminName }}</span> 님, 반갑습니다.
        </div>
        <img src="@/assets/icons/account.svg" alt="계정" class="disabled-icon">
        <img src="@/assets/icons/bell.svg" alt="알림" class="disabled-icon">
        <img src="@/assets/icons/logout.svg" alt="로그아웃" class="icon" @click.stop="Logout">
        <img src="@/assets/icons/search.svg" alt="검색" class="disabled-icon">
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
import { startTimer, clearTimer } from '@/utils/timer';

const isLoading = ref(true);
const loginState = useLoginState();
const isLoggedIn = computed(() => loginState.isLoggedIn ?? false);
const adminName = computed(() => loginState.adminName || '');
const adminTeam = computed(() => loginState.adminTeam || '');
const router = useRouter();
const route = useRoute();
const expirationTime = computed(() => loginState.exp ? new Date(loginState.exp) : null);
const remainingTime = ref('00:00:00');

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

const refreshToken = async () => {
  try {
    const refreshToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('refreshToken='))
      ?.split('=')[1];

    console.log('Refresh token:', refreshToken);

    if (!refreshToken) {
      console.error('Refresh token is missing or not found in cookies.');
      alert('RefreshToken이 없습니다. 갱신할 수 없습니다.');
      return;
    }

    clearTimer();

    const response = await axios.post(
      'http://localhost:5000/auth/refresh',
      { refreshToken },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { accessToken, exp } = response.data;

    console.log('Refresh response:', response.data);

    if (accessToken && exp) {
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;';
      document.cookie = `token=${accessToken}; Path=/; Secure; SameSite=None;`;

      loginState.setExp(exp);

      const newExpirationTime = new Date(exp[0], exp[1] - 1, exp[2], exp[3], exp[4], exp[5]);

      console.log('New expiration time:', newExpirationTime);

      if (newExpirationTime && !isNaN(newExpirationTime.getTime())) {
        startTimer(newExpirationTime, (remaining) => {
          remainingTime.value = remaining;
        });
      } else {
        console.error('Invalid expiration time:', exp);
        remainingTime.value = '만료됨';
        alert('토큰이 만료돼 로그아웃합니다..')
        setTimeout(() => {
          router.replace('/login');
        }, 500);
      }
    }
  } catch (error) {
    console.error('토큰 갱신 에러:', error);

    if (error.response?.status === 401) {
      clearTimer();
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=None;';
      alert('토큰 갱신 실패: 다시 로그인하세요.');
      loginState.resetState();
      router.replace('/login');
    } else if (error.response?.status === 500) {
      alert('서버 오류로 인해 토큰 갱신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.');
    }
  }
};

const currentGroup = computed(() => {
  const currentPath = route.path || '';
  const matchedMenu = menus.value.find((menu) => {
    if (menu.includePaths) {
      return menu.includePaths.some((path) => currentPath.startsWith(path));
    }
    return currentPath.startsWith(menu.path);
  });
  return matchedMenu ? matchedMenu.group : 'defaultGroup';
});

let isLoggingOut = false;

const Logout = async () => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  try {
    const logoutSuccessful = await loginState.logout();
    if (logoutSuccessful) {
      alert('로그아웃 성공!');
      router.replace('/login');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('로그아웃 중 문제가 발생했습니다.');
  } finally {
    isLoggingOut = false;
  }
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

watch(
  () => loginState.isLoggedIn,
  (newValue) => {
    if (!newValue) {
      router.push('/login');
    }
  },
  { immediate: true }
);

const convertArrayToDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) {
    console.error('Invalid date array:', dateArray);
    return null;
  }
  const [year, month, day, hour, minute, second = 0] = dateArray;
  return new Date(year, month - 1, day, hour, minute, second);
};


onMounted(async () => {
  const button = document.querySelector('.extend-btn');
  button?.addEventListener('click', (e) => {
    console.log('Button clicked');
    e.preventDefault();
  }); 

  try {
    await loginState.fetchLoginState();

    console.log('Login state after fetch:', {
      isLoggedIn: loginState.isLoggedIn,
      exp: loginState.exp,
    });

    if (loginState.isLoggedIn && loginState.exp) {
      let expirationTime;

      if (Array.isArray(loginState.exp)) {
        expirationTime = convertArrayToDate(loginState.exp);
      } else {
        expirationTime = new Date(loginState.exp);
      }

      if (!expirationTime || isNaN(expirationTime.getTime())) {
        console.error('Invalid expirationTime:', loginState.exp);
        remainingTime.value = '만료됨';
        return;
      }

      console.log('Starting timer with expirationTime:', expirationTime);
      startTimer(expirationTime, (remaining) => {
        remainingTime.value = remaining;
      });
    } else {
      remainingTime.value = '만료됨';
    }
  } catch (error) {
    console.error('Failed to fetch login state:', error);
    loginState.resetState();
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  remainingTime.value = '00:00:00';
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

  .disabled-icon {
    width:18px;
    height: 19px;
  }
  </style>