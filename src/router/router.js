import { createRouter, createWebHistory } from 'vue-router';
import LectureRouter from './lecture';
import MemberRouter from './member';
import LoginRouter from './login';
import MarketingRouter from './marketing';
import { setupClientRouter } from './client';
import VOCRouter from './voc';
import { useLoginState } from '@/stores/loginState';

const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/MainView.vue')
  },
  ...MemberRouter,
  ...LoginRouter,
  ...MarketingRouter,
  ...setupClientRouter(router),
  ...LectureRouter,
  ...VOCRouter,
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/LoginView.vue')
  },
  {
    path: '/',
    redirect: '/main'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const authRequiredRoutes = ['/main', '/lecture', '/marketing', '/voc', '/member'];

router.beforeEach(async (to, from, next) => {
  const loginState = useLoginState();
  const requiresAuth = authRequiredRoutes.some((path) => to.path.startsWith(path));

  try {
    if (!loginState.isLoggedIn) {
      await loginState.fetchLoginState();
    }

    if (requiresAuth && !loginState.isLoggedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } catch (error) {
    console.error('Auth check failed:', error);

    if (requiresAuth) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  }
});

export default router;
