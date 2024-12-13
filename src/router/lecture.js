const LectureRouter = [
    {
        path: '/lecture',
        name: 'Lecture',
        component: () => import('../views/lecture/LectureView.vue')
    },
    {
        path: '/payment',
        name: 'Payment',
        component: () => import('../views/payment/PaymentView.vue')
    },
];

export default LectureRouter;