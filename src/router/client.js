const ClientRouter = [
    {
        path: '/client-login',
        name: 'ClientLogin',
        component: () => import('../views/client/login/ClientLoginView.vue')
    },
];

export default ClientRouter;