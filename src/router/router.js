import { createRouter, createWebHistory } from 'vue-router'

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
  {
    path: '/member',
    name: 'Member',
    component: () => import('../views/member/MemberView.vue')
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('../views/marketing/MarketingView.vue'),
  },
  {
    path: '/marketing/register-campaign',
    name: 'Register-campaign',
    component: () => import('../views/marketing/CampaignRegisterPage.vue'),
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