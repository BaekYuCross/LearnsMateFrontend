import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export function useActivityMonitor(timeoutMinutes = 1/12) {
 const router = useRouter();
 const showActivityModal = ref(false);
 const lastActivity = ref(Date.now());
 const activityModalTimer = ref(null);
 const activityLogoutTimer = ref(null);

 // 사용자 활동 감지
 const resetActivityTimer = () => {
    if (!showActivityModal.value) {
      lastActivity.value = Date.now();
    }
  };

 // 활동 감지할 이벤트들
 const events = [
   'mousedown', 'mousemove', 'keydown',
   'scroll', 'touchstart', 'click', 'keypress'
 ];

  const openActivityModal = () => {
    showActivityModal.value = true;
    // 5분 후 자동 로그아웃
    activityModalTimer.value = setTimeout(activityLogout, 5 * 1000);
  };

 // 모달 닫기
 const closeActivityModal = () => {
    showActivityModal.value = false;
    if (activityModalTimer.value) {
      clearTimeout(activityModalTimer.value);
    }
    // 모달을 닫을 때 활동 시간을 리셋
    lastActivity.value = Date.now();
  };

 // 로그아웃 처리
 const activityLogout = () => {
   // localStorage 클리어
   localStorage.removeItem('clientInfo');
   localStorage.removeItem('isAuthenticated');
   
   // 로그아웃 메시지 표시
   alert('장시간 움직임이 없어 로그아웃 되었습니다.');
   
   // 로그인 페이지로 이동
   router.push('/client-login'); 
 };

 // 주기적으로 체크
 const checkInactivity = () => {
    // 모달이 이미 열려있다면 체크하지 않음
    if (!showActivityModal.value) {
      const inactiveTime = Date.now() - lastActivity.value;
      if (inactiveTime >= timeoutMinutes * 60 * 1000) {
        openActivityModal();
      }
    }
  };

 onMounted(() => {
   // 이벤트 리스너 등록
   events.forEach(event => {
     window.addEventListener(event, resetActivityTimer);
   });

   // 1분마다 비활성 상태 체크
   activityLogoutTimer.value = setInterval(checkInactivity, 1000);
 });

 onUnmounted(() => {
   // 이벤트 리스너 제거
   events.forEach(event => {
     window.removeEventListener(event, resetActivityTimer);
   });

   // 타이머 클리어
   if (activityModalTimer.value) clearTimeout(activityModalTimer.value);
   if (activityLogoutTimer.value) clearInterval(activityLogoutTimer.value);
 });

 return {
   showActivityModal,
   closeActivityModal,
   activityLogout
 };
}