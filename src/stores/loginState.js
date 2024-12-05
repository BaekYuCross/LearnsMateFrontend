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

    async logout() {
      try {
        const refreshToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('refreshToken='))
          ?.split('=')[1];
    
        if (!refreshToken) {
          alert('RefreshToken이 없습니다. 로그아웃할 수 없습니다.');
          return false;
        }
    
        const response = await axios.post(
          'https://learnsmate.shop/auth/logout',
          { refreshToken },
          { withCredentials: false }
        );
    
        if (response.status === 200) {
          console.log('Logout successful:', response.data);
    
          document.cookie = 'token=; Path=/; Max-Age=0;';
          document.cookie = 'refreshToken=; Path=/; Max-Age=0;';
    
          this.resetState();
          return true;
        } else {
          console.error('Unexpected response status:', response.status, response.data);
          alert('로그아웃에 실패했습니다.');
          return false;
        }
      } catch (error) {
        if (error.response) {
          console.error('Logout failed with response:', error.response.data);
        } else {
          console.error('Logout failed with no response:', error.message);
        }
        alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
        return false;
      }
    },

    setExp(newExp) {
      const expirationDate = new Date(newExp);
      const kstDate = new Date(expirationDate.getTime() + 9 * 60 * 60 * 1000);
      this.exp = kstDate.toISOString();
      console.log('Updated token expiration time (KST):', this.exp);
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
