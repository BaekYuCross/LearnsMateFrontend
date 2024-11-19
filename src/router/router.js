import { createRouter, createWebHistory } from 'vue-router'
import MemberRouter from './member'
import LoginRouter from './login'

const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/MainView.vue')
  },
  {
    path: '/lecture',
    name: 'Lecture',
    component: () => import('../views/LectureView.vue')
  },

  ...MemberRouter,
  ...LoginRouter,

  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('../views/MarketingView.vue')
  },
  {
    path: '/coupons',
    name: 'Coupons',
    component: () => import('../views/CouponView.vue')

  },
  {
    path: '/voc',
    name: 'VOC',
    component: () => import('../views/VocView.vue')
  },
  {
    path: '/',
    redirect: '/main'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router