import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginState = defineStore('loginState', {
  state: () => ({
    isLoggedIn: false, // 로그인 상태
    adminName: '',     // 관리자 이름
    adminTeam: '',     // 관리자 부서
    adminCode: '',     // 관리자 코드
  }),
  actions: {
    async fetchLoginState() {
      try {
        const response = await axios.get('http://localhost:5000/admin/status', {
          withCredentials: true,
        });
        this.isLoggedIn = true;
        this.adminName = response.data.name;
        this.adminTeam = response.data.adminDepartment; 
        this.adminCode = response.data.code; 
      } catch (error) {
        console.error('로그인 상태를 확인할 수 없습니다:', error);
        this.isLoggedIn = false;
        this.adminName = '';
        this.adminTeam = '';
        this.adminCode = '';
      }
    },
    async logout() {
      try {
        await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
        this.isLoggedIn = false;
        this.adminName = '';
        this.adminTeam = '';
        this.adminCode = '';
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    },
  },
});