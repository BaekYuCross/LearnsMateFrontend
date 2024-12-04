// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Pinia 불러오기
import App from './App.vue';
import router from './router/router.js';
import './assets/css/style.css';
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://learnsmate.shop'

// Pinia 초기화
const pinia = createPinia();

const app = createApp(App);
app.use(pinia); // Pinia 사용 설정
app.use(router); // Router 사용 설정 // 이거 vue에서 하는건가 
app.mount('#app');
