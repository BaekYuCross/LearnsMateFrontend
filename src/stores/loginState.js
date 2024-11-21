// src/stores/loginState.js
import { defineStore } from 'pinia';

export const useLoginState = defineStore('loginState', {
  state: () => ({
    isLoggedIn: false, // 로그인 상태
    adminName: ''      // 관리자 이름
  }),
  actions: {
    resetState() {
      this.isLoggedIn = false;
      this.adminName = '';
    }
  }
});

