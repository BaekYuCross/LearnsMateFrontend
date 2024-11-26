import axios from '@/plugins/axios'; 

const checkLoginAndTime = async () => {
    const clientInfo = JSON.parse(localStorage.getItem('clientInfo'));
    const isAuthenticated = localStorage.getItem('isAuthenticated');
   
    if (!clientInfo || !isAuthenticated) return false;
   
    const loginTime = new Date(clientInfo.loginTime);
    const now = new Date();
    const diffHours = (now - loginTime) / (1000);
   
    if (diffHours >= 6) {
        try {
            // 로그아웃 요청 보내기
            await axios.post('http://localhost:5000/client/logout', {
                loginHistoryCode: clientInfo.loginHistoryCode,
            });
        } catch (error) {
            console.error('자동 로그아웃 요청 실패:', error);
        }

        localStorage.removeItem('clientInfo');
        localStorage.removeItem('isAuthenticated');
        return false;
    }
   
    return true;
};

const ClientRouter = [
    {
        path: '/client-login',
        name: 'ClientLogin',
        component: () => import('../views/client/clientlogin/ClientLoginView.vue'),
        props: true,
        meta: { isClientPage: false }
    },
    {
        path: '/client-main',
        name: 'ClientMain',
        component: () => import('../views/client/clientmain/ClientMainView.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-voc',
        name: 'ClientVoc',
        component: () => import('../views/client/clientvoc/ClientVOCView.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-myvoc',
        name: 'ClientMyVoc',
        component: () => import('../views/client/clientvoc/ClientVOCMyView.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-lecture',
        name: 'ClientLecture',
        component: () => import('../views/client/clientlecture/ClientLectureView.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-mylecture',
        name: 'ClientMyLecture',
        component: () => import('../views/client/clientlecture/ClientMyLectureView.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-lecturedetail/:id',
        name: 'ClientLectureDetail',
        component: () => import('../views/client/clientlecture/ClientLectureDetail.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-lecturecart',
        name: 'ClientLectureCart',
        component: () => import('../views/client/clientlecture/ClientLectureCart.vue'),
        props: true,
        meta: { isClientPage: true }
    },
    {
        path: '/client-addcoupon',
        name: 'AddCoupon',
        component: () => import('../views/client/clientlecture/ClientCouponAddView.vue'),
        props: true,
        meta: { isClientPage: true }
    },
];

ClientRouter.forEach(route => {
    if (route.meta?.isClientPage) {
        route.beforeEnter = async (to, from, next) => {
            const isValid = await checkLoginAndTime();
            if (!isValid) {
                next('/client-login');
            } else {
                next();
            }
        };
    }
});

export default ClientRouter;