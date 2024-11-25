const ClientRouter = [
    {
        path: '/client-login',
        name: 'ClientLogin',
        component: () => import('../views/client/clientlogin/ClientLoginView.vue'),
        props: true
    },
    {
        path: '/client-main',
        name: 'ClientMain',
        component: () => import('../views/client/clientmain/ClientMainView.vue'),
        props: true
    },
    {
        path: '/client-voc',
        name: 'ClientVoc',
        component: () => import('../views/client/clientvoc/ClientVOCView.vue'),
        props: true
    },
    {
        path: '/client-myvoc',
        name: 'ClientMyVoc',
        component: () => import('../views/client/clientvoc/ClientVOCMyView.vue'),
        props: true
    },
    {
        path: '/client-lecture',
        name: 'ClientLecture',
        component: () => import('../views/client/clientlecture/ClientLectureView.vue'),
        props: true
    },
    {
        path: '/client-mylecture',
        name: 'ClientMyLecture',
        component: () => import('../views/client/clientlecture/ClientMyLectureView.vue'),
        props: true
    },
    {
        path: '/client-lecturedetail/:id',
        name: 'ClientLectureDetail',
        component: () => import('../views/client/clientlecture/ClientLectureDetail.vue'),
        props: true
    },
    {
        path: '/client-lecturecart',
        name: 'ClientLectureCart',
        component: () => import('../views/client/clientlecture/ClientLectureCart.vue'),
        props: true
    },
    {
        path: '/client-addcoupon',
        name: 'AddCoupon',
        component: () => import('../views/client/clientlecture/ClientCouponAddView.vue'),
        props: true
    },
];

export default ClientRouter;