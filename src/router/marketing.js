const MarketingRouter = [
    {
        path: '/marketing',
        name: 'Marketing',
        component: () => import('../views/marketing/campaign/AllCampaignsGetPage.vue')
    },
    {
        path: '/marketing/coupons',
        name: 'Coupons',
        component: () => import('@/views/coupon/CouponView.vue')
    },
    {
        path: '/marketing/register-campaign',
        name: 'Register-campaign',
        component: () => import('../views/marketing/campaign/CampaignRegisterPage.vue'),
      },
      {
        path: '/marketing/campaign-template',
        name: 'Campaign-template',
        component: () => import('../views/marketing/campaignTemplate/AllCampaignTemplatesGetPage.vue'),
      },
      {
        path: '/marketing/campaign',
        name: 'Campaign',
        component: () => import('../views/marketing/campaign/CampaignGetPage.vue'),
      },
      {
        path: '/marketing/issued-coupons',
        name: 'Issued-Coupons',
        component: () => import('@/views/coupon/IssuedCouponView.vue')
      }
];

export default MarketingRouter;