import { createRouter, createWebHistory } from 'vue-router';
import LectureRouter from './lecture';
import MemberRouter from './member';
import LoginRouter from './login';
import MarketingRouter from './marketing';
import ClientRouter from './client';
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
  ...ClientRouter,
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

const authRequiredRoutes = ['/main', '/lecture', '/marketing', '/client', '/voc', '/member'];

router.beforeEach(async (to, from, next) => {
  const loginState = useLoginState();
  const requiresAuth = authRequiredRoutes.some((path) => to.path.startsWith(path));

  try {
    if (!loginState.isLoggedIn) {
      await loginState.fetchLoginState();
    }

    if (to.path.startsWith('/client') && !loginState.isLoggedIn) {
      next({ path: '/client-login', query: { redirect: to.fullPath } });
      return;
    }

    if (requiresAuth && !loginState.isLoggedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } catch (error) {
    console.error('Auth check failed:', error);

    if (to.path.startsWith('/client')) {
      next({ path: '/client-login', query: { redirect: to.fullPath } });
      return;
    }

    if (requiresAuth) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next();
    }
  }
});

export default router;
