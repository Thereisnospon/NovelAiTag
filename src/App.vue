<script setup>
import { ref } from 'vue';
</script>

<template>
    <!-- 主页 -->
    <div id="main" class="container mx-auto">
        <!-- 一个摆着的东西 -->
        <div id="_app">App.vue</div>

        <!-- 入口 -->
        <router-view></router-view>
    </div>
    <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style lang="scss">
// 重置样式
@import '@/assets/styles/reset_style.css';
// 全局样式
@import '@/assets/styles/global_variables.scss';

// 临时全局样式 (显示器太亮, 部署时删掉)
html,
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
