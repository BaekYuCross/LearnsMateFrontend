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
    // 로그인 상태 확인
    async fetchLoginState() {
      try {
        const response = await axios.get('https://learnsmate.shop/admin/status', {
          withCredentials: true,
        });
        
        if (response.data && response.data.code) {
          // 상태 업데이트
          this.updateLoginState(response.data);
        } else {
          this.resetState();
        }
      } catch (error) {
        console.error('Failed to fetch login state:', error);
        this.resetState();
        throw error; // 예외를 다시 throw
      }
    },

    // 상태 업데이트
    updateLoginState(data) {
      this.isLoggedIn = true;
      this.adminName = data.name;
      this.adminTeam = data.adminDepartment;
      this.adminCode = data.code;
      this.exp = data.exp;

      console.log('Login state updated:', {
        isLoggedIn: this.isLoggedIn,
        adminName: this.adminName,
        adminTeam: this.adminTeam,
      });
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

    // 상태 초기화
    resetState() {
      this.isLoggedIn = false;
      this.adminName = '';
      this.adminTeam = '';
      this.adminCode = '';
      this.exp = null;
    },
  },
});
