const LoginRouter = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/LoginView.vue')
    },
    {
        path: '/modal',
        name: 'modal',
        component: () => import('../components/modules/DeleteModule.vue')
    },
    {
        path: '/modal2',
        name: 'modal2',
        component: () => import('../components/modules/FalseModule.vue')
    },
    {
        path: '/modal3',
        name: 'modal3',
        component: () => import('../components/modules/RegisterModule.vue')
    },
];

export default LoginRouter;