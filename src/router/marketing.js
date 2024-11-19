const MarketingRouter = [
    {
        path: '/marketing',
        name: 'Marketing',
        component: () => import('../views/marketing/campaign/CampaignGetPage.vue')
    },
    {
        path: '/marketing/coupons',
        name: 'Coupons',
        component: () => import('@/views/CouponView.vue')
    },
      {
        path: '/marketing/register-campaign',
        name: 'Register-campaign',
        component: () => import('../views/marketing/campaign/CampaignRegisterPage.vue'),
      },
      {
        path: '/marketing/campaign-template',
        name: 'Campaign-template',
        component: () => import('../views/marketing/campaignTemplate/CampaignTemplateGetPage.vue'),
      }
];

export default MarketingRouter;