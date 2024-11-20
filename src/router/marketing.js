const MarketingRouter = [
    {
        path: '/marketing',
        name: 'Marketing',
        component: () => import('../views/marketing/MarketingView.vue')
    },
    {
        path: '/marketing/coupons',
        name: 'Coupons',
        component: () => import('@/views/coupon/CouponView.vue')
    },
    {
        path: '/marketing/register-campaign',
        name: 'Register-campaign',
        component: () => import('../views/marketing/CampaignRegisterPage.vue'),
    },
    {
        path: '/marketing/issued-coupons',
        name: 'IssuedCoupons',
        component: () => import('@/views/coupon/IssuedCouponView.vue')
    }
];

export default MarketingRouter;