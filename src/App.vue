<script setup>
import { ref } from 'vue';
// import useAppStore from '@/stores/app.js';
// import useUserStore from '@/stores/user.js';

// defineProps({
//     msg: String
// });

// let appStore = useAppStore();
// console.log('appStore: ', appStore);

// const add = () => {
//     appStore.addCount();
// };
// const reset = () => {
//     appStore.reset();
// };
</script>

<template>
    <!-- 主页 -->
    <div id="main" class="container mx-auto">
        <div id="_app">App.vue</div>

        <!-- <div>app count {{ appStore.count }}</div>
        <button @click="add">add</button>
        <button @click="reset">reset</button> -->

        <router-view></router-view>
    </div>
    <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style lang="scss">
// 重置样式
@import './style.css';

// 临时全局样式 (显示器太亮, 部署时删掉)
body {
    background-color: rgb(164, 164, 164);
}

// 总入口样式
#_app {
    background: green;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 12px;
    line-height: 24px;

    display: none;
}
</style>
