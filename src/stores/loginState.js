import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginState = defineStore('loginState', {
  state: () => ({
    isLoggedIn: false,
    adminName: '',
    adminTeam: '',
    adminCode: '',
    exp: null,
  }),
  
  actions: {
    async fetchLoginState() {
      try {
        const response = await axios.get('https://learnsmate.shop/admin/status', {
          withCredentials: true,
        });
        if (response.data && response.data.code) {
          this.updateLoginState(response.data);
        } else {
          this.resetState();
        }
      } catch (error) {
        console.error('Error fetching login state:', error);
        this.resetState();
      }
    },

    updateLoginState(data) {
      this.isLoggedIn = true;
      this.adminName = data.name || ''; // 안전 처리
      this.adminTeam = data.adminDepartment || ''; // 안전 처리
      this.adminCode = data.code || '';
      this.exp = data.exp || null;
    },

    // 로그아웃 처리
    async logout() {
      try {
        await axios.post('https://learnsmate.shop/auth/logout', {}, { withCredentials: true });
        this.resetState();
      } catch (error) {
        console.error('Logout failed:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    },

    // 토큰 만료 시간 설정
    setExp(newExp) {
      this.exp = newExp;
      console.log('Updated token expiration time:', this.exp);
    },

    resetState() {
      this.isLoggedIn = false;
      this.adminName = '';
      this.adminTeam = '';
      this.adminCode = '';
      this.exp = null;
    },
  },
});
