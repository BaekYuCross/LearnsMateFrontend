const MemberRouter = [
    {
        path: '/student',
        name: 'Student',
        component: () => import('../views/member/StudentView.vue')
    },
    {
        path: '/student/blacklist',
        name: 'StudentBlacklist',
        component: () => import('../views/member/StudentBlacklistView.vue')
    },
    {
        path: '/tutor',
        name: 'Tutor',
        component: () => import('../views/member/TutorView.vue')
    },
    {
        path: '/tutor/blacklist',
        name: 'TutorBlacklist',
        component: () => import('../views/member/TutorBlacklistView.vue')
    },
];

export default MemberRouter;