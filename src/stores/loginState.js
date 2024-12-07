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
      const currentPath = window.location.pathname;
      const excludePaths = ['/login', '/client-login'];

      if (excludePaths.includes(currentPath)) {
        console.log(`인증 상태 확인을 생략합니다: ${currentPath}`);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/admin/status', {
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

      if (data.exp) {
        if (Array.isArray(data.exp)) {
          const expDate = new Date(Date.UTC(
            data.exp[0], 
            data.exp[1] - 1, 
            data.exp[2], 
            data.exp[3], 
            data.exp[4], 
            data.exp[5]
          ));
          this.exp = expDate.toISOString();
        } else {
          this.exp = new Date(data.exp).toISOString();
        }
      }
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
          'http://localhost:5000/auth/logout',
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
      try {
        const expDate = Array.isArray(newExp)
          ? new Date(newExp[0], newExp[1]-1, newExp[2], newExp[3], newExp[4], newExp[5])
          : new Date(newExp);

        if (!isNaN(expDate.getTime())) {
          this.exp = expDate.toISOString();
        } else {
          throw new Error('Invalid date');
        }
      } catch (error) {
        console.error('Error in setExp:', error);
        this.exp = null;
      }
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
