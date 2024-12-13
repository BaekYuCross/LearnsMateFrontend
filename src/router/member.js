const MemberRouter = [
    {
        path: '/student',
        name: 'Student',
        component: () => import('../views/member/StudentView.vue')
    },
    {
        path: '/student/blacklist',
        name: 'StudentBlacklist',
        component: () => import('../views/member/BlacklistView.vue')
    },
    {
        path: '/student/blacklist/reserved',
        name: 'StudentReservedBlacklist',
        component: () => import('../views/member/ReservedBlacklistView.vue')
    },
    {
        path: '/tutor',
        name: 'Tutor',
        component: () => import('../views/member/TutorView.vue')
    },
    {
        path: '/tutor/blacklist',
        name: 'TutorBlacklist',
        component: () => import('../views/member/BlacklistView.vue')
    },
    {
        path: '/tutor/blacklist/reserved',
        name: 'TutorReservedBlacklist',
        component: () => import('../views/member/ReservedBlacklistView.vue')
    },
];

export default MemberRouter;