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
        if (response.data) {
          this.isLoggedIn = true;
          this.adminName = response.data.name;
          this.adminTeam = response.data.adminDepartment;
          this.adminCode = response.data.code;
          this.exp = response.data.exp;
          console.log('로그인 상태 업데이트:', {
            isLoggedIn: this.isLoggedIn,
            adminName: this.adminName,
            adminTeam: this.adminTeam
          });
        }
      } catch (error) {
        console.error('로그인 상태를 확인할 수 없습니다:', error);
        this.resetState();
        throw error;
      }
    },

    // 로그아웃 처리
    async logout() {
      try {
        await axios.post('https://learnsmate.shop/auth/logout', {}, { withCredentials: true });
        this.resetState();
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    },


    // 새 토큰 만료 시간 설정
    setExp(newExp) {
      this.exp = newExp;
      console.log('새로운 토큰 만료시간:', this.exp);
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
