const LoginRouter = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login/LoginView.vue')
    },
];

export default LoginRouter;