const MarketingRouter = [
    {
        path: '/marketing',
        name: 'Marketing',
        component: () => import('../views/MarketingView.vue')
    },
    {
        path: '/marketing/coupons',
        name: 'Coupons',
        component: () => import('@/views/CouponView.vue')
    }
];

export default MarketingRouter;