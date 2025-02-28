import axios from 'axios'; 

const logout = async (loginHistoryCode) => {
    try {
        await axios.post('http://localhost:5000/client/exit', {
            login_history_code: loginHistoryCode,
        });
    } catch (error) {
        console.error('로그아웃 요청 실패:', error);
    } finally {
        localStorage.removeItem('clientInfo');
        localStorage.removeItem('isAuthenticated');
    }
};

const checkLoginAndTime = async () => {
    try {
        const clientInfo = JSON.parse(localStorage.getItem('clientInfo'));
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (!clientInfo || !isAuthenticated) return false;
        
        const loginTime = new Date(clientInfo.loginTime);
        const now = new Date();
        const diffHours = (now - loginTime) / (1000 * 60 * 60);
        
        if (diffHours >= 3) {
            try {
                await axios.post('http://localhost:5000/client/logout', {
                    loginHistoryCode: clientInfo.loginHistoryCode,
                });
            } catch (error) {
                console.error('자동 로그아웃 요청 실패:', error);
            } finally {
                localStorage.removeItem('clientInfo');
                localStorage.removeItem('isAuthenticated');
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error('로그인 체크 중 오류 발생:', error);
        return false;
    }
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
export const setupClientGuard = (router) => {
    router.beforeEach(async (to, from, next) => {
        if (to.meta.isClientPage) {
            const isValid = await checkLoginAndTime();
            if (!isValid) {
                next('/client-login');
                return;
            }
        }
        next();
    });
};

export default ClientRouter;