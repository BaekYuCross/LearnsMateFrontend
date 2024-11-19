import { createRouter, createWebHistory } from 'vue-router'
import MemberRouter from './member'
<<<<<<< HEAD
import LoginRouter from './login'
=======
import MarketingRouter from './marketing'
>>>>>>> 7362054cf0c03833e49bdc54bffecd6747657f20

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
<<<<<<< HEAD
  ...LoginRouter,
=======
  ...MarketingRouter,
>>>>>>> 7362054cf0c03833e49bdc54bffecd6747657f20

  // {
  //   path: '/marketing',
  //   name: 'Marketing',
  //   component: () => import('../views/MarketingView.vue')
  // },
  // {
  //   path: '/coupons',
  //   name: 'Coupons',
  //   component: () => import('../views/CouponView.vue')

  // },
  {
    path: '/voc',
    name: 'VOC',
    component: () => import('../views/voc/VocView.vue')
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