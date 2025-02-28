import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/router.js';
import './assets/css/style.css';
import axios from 'axios';

// Axios 기본 설정
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:5000';

// Axios 요청 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios 응답 인터셉터 (옵션)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('인증 실패: 다시 로그인하세요.');
      // 로그아웃 처리 또는 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);

// Pinia 초기화
const pinia = createPinia();

// Vue 애플리케이션 초기화
const app = createApp(App);
app.use(pinia); // Pinia 사용
app.use(router); // Router 사용
app.mount('#app');
