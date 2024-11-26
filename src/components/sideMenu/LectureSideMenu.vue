<template>
    <aside class="side-menu-container">
        <div class="menu-list">
            <div
            v-for="menu in menus"
            :key="menu.name"
            class="menu-item"
            >
            <div class="menu-title">
                {{ menu.name }}
            </div>

            <div class="submenu-list">
                <div
                v-for="submenu in menu.submenus"
                :key="submenu.path"
                class="submenu-item"
                :class="{ active: currentRoute === submenu.path }"
                @click="navigateTo(submenu.path)"
                >
                {{ submenu.name }}
                </div>
            </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    const router = useRouter();
    const route = useRoute();

    const menus = ref([
        {
        name: '강의',
        submenus: [
            { name: '전체 강의', path: '/lecture' },
            { name: '결제 내역', path: '/payment' },
        ],
        },     
    ]);

    const currentRoute = computed(() => route.path);

    const navigateTo = (path) => {
        router.push(path);
    };
</script>

<style scoped>

    .side-menu-container {
        width: 160px;
        height: 100%;
        background-color: #005950;
        position: fixed;
        top: 50px;
        left: 0;
        display: flex;
        flex-direction: column;
        padding-top: 20px;
    }


    .menu-list {
        display: flex;
        flex-direction: column;
    }


    .menu-title {
        color: #ffffff;
        font-family:'Pretendard-Regular';
        font-size: 15px;
        font-weight: bold;
        padding: 5px 0;
        text-indent: 20px;
    }


        .menu-item {
        margin-bottom: 30px; 
        }


    .submenu-list {
        display: flex;
        flex-direction: column;
        gap: 3px;
        text-indent: 20px;
    }

    .submenu-item {
        color: #ffffff;
        cursor: pointer;
        font-family:'Pretendard-Regular';
        font-size: 13px;
        padding: 5px 0px;
        text-align: left;
        transition: background-color 0.2s;
    }

    .submenu-item.active {
        background-color: #ffffff;
        color: #005950;
        font-weight: bold;
    }

    .submenu-item:hover {
        background-color: #004c42;
    }

    .submenu-item.active:hover {
        background-color: #ffffff;
    }
</style>
