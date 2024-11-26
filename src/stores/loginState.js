import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginState = defineStore('loginState', {
  state: () => ({
    isLoggedIn: false, // 로그인 상태
    adminName: '',     // 관리자 이름
  }),
  actions: {
    async fetchLoginState() {
      try {
        const response = await axios.get('http://localhost:5000/admin/status', {
          withCredentials: true,
        });
        this.isLoggedIn = true;
        this.adminName = response.data.name;
      } catch (error) {
        console.error('로그인 상태를 확인할 수 없습니다:', error);
        this.isLoggedIn = false;
        this.adminName = '';
      }
    },
    async logout() {
      try {
        await axios.post('http://localhost:5000/admin/logout', {}, { withCredentials: true });
        this.isLoggedIn = false;
        this.adminName = '';
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    },
  },
});
