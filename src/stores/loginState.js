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
          withCredentials: true, // 쿠키 포함
        });
        this.isLoggedIn = true;
        this.adminName = response.data.name;
      } catch (error) {
        console.error('로그인 상태를 확인할 수 없습니다:', error);
        this.isLoggedIn = false;
        this.adminName = '';
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.adminName = '';
    },
  },
});
