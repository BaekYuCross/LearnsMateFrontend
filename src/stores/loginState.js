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
      this.adminName = data.name || '';
      this.adminTeam = data.adminDepartment || '';
      this.adminCode = data.code || '';
      this.exp = Array.isArray(data.exp) ? data.exp : null;
    },

    // 로그아웃 처리
    async logout() {
      try {
        const response = await axios.post(
          'https://learnsmate.shop/auth/logout',
          {},
          { withCredentials: true }
        );
    
        if (response.status === 200) {
          this.resetState();
          alert('로그아웃되었습니다.');
        } else {
          console.error('Unexpected response status:', response.status);
          alert('로그아웃에 실패했습니다.');
        }
      } catch (error) {
        console.error('Logout failed:', error);
        alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
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
