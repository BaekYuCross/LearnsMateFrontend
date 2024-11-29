import { createRouter, createWebHistory } from 'vue-router'
import LectureRouter from './lecture'
import MemberRouter from './member'
import LoginRouter from './login'
import MarketingRouter from './marketing'
import ClientRouter from './client'
import VOCRouter from './voc'


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
    path: '/',
    redirect: '/main'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router