<script>
import PromptDetail from './PromptDetail.vue';
import GlobalButton from './GlobalButton.vue';
import PromptMacro from './PromptMacro.vue';
export default {
    components: { PromptDetail, GlobalButton, PromptMacro }
};
</script>

<template>
    <div>
        <!-- 第一部分: 各种站内站外宏观操作 -->
        <div class="_block px-4 pt-2 my-2 rounded bg-red-200" id="global_button">
            <div class="_block__title mb-2">
                <span>魔导</span>
                第一部分: 各种站内站外宏观操作
            </div>
            <GlobalButton></GlobalButton>
        </div>
        <!-- 第二部分: prompt tag 的整体操作 -->
        <div class="_block px-4 pt-2 my-2 rounded bg-green-200" id="prompt_macro">
            <div class="_block__title mb-2">
                <span>标签</span>
                第二部分: prompt tag 的整体操作
            </div>
            <PromptMacro></PromptMacro>
        </div>
        <!-- 第三部分: 单个 prompt tag 的具体操作 -->
        <div class="_block px-4 pt-2 my-2 rounded bg-blue-200" id="prompt_detail">
            <div class="_block__title mb-2">
                <span>操作</span>
                第三部分: 单个 prompt tag 的具体操作
            </div>
            <PromptDetail></PromptDetail>
        </div>
    </div>
</template>

<style lang="scss" scoped>
._block {
    &__title {
        font-size: 1rem;
        position: relative;

        & span {
            font-size: 2rem;
        }

        &::before {
            content: '';
            position: absolute;
            width: 3px;
            height: 2rem;
            background-color: rgb(0, 0, 0);

            top: 0;
            left: -8px;
        }
    }
}
</style>
