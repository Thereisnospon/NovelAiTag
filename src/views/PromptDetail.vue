<template>
    <div class="grid place-items-left">
        <!-- 正面 tag 输入框 -->
        <div class="rowPositive">
            <div class="input-group">
                <div class="input-group__title">
                    <div class="pb-1">正面 Tag</div>
                    <div><el-button @click="copy2Clipboard('positive')">复制</el-button></div>
                </div>
                <div class="input-group__content">
                    <textarea class="form-control" aria-label="With textarea" id="textarea_pos" :value="PromptStore.output"></textarea>
                </div>
            </div>
        </div>

        <!-- 负面 tag 输入框 -->
        <div class="rowNegative mb-2">
            <div class="input-group">
                <div class="input-group__title">
                    <div class="pb-1">负面 Tag</div>
                    <div><el-button @click="copy2Clipboard('negative')">复制</el-button></div>
                </div>
                <div class="input-group__content">
                    <textarea class="form-control" aria-label="With textarea" id="textarea_pos"></textarea>
                </div>
            </div>
        </div>

        <!-- 已选择的 tag -->

        <!-- 单个 tag 操作 -->
        <div class="rowTagManipulation">
            <!-- tag 分类 read from 'good_practice' -->
            <div class="rowTagCategories">
                <div v-for="(_content, _key) in dictionary" :key="_key">
                    <button
                        class="transition-200 px-4 py-2 mb-2 mr-2 text-white bg-green-600 border border-green-200 rounded hover:opacity-80 active:bg-green-800"
                        :class="{ 'bg-green-800 border-red-900': _key == active }"
                        @click="jumpPage(_key)"
                    >
                        {{ _key }}
                    </button>
                    <!-- <div>{{ _content }}</div> -->
                    <!-- <br /> -->
                </div>
            </div>

            <!-- 该 tag 分类下的所有 tag -->
            <div class="rowTagShow">
                <div v-for="(_content, _key) in dictionary[active]" :key="_key">
                    <div class="btn_group mr-1 mb-1">
                        <button class="btn_l">-</button>
                        <button class="btn_c" @click="tagManage(_key, _content)">{{ _key }}:{{ _content }}</button>
                        <button class="btn_c">xxx</button>
                        <button class="btn_r">+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import good_practice from '../dictionaries/good_practice';
import { ref, reactive } from 'vue';
import { ElNotification } from 'element-plus';

// store 引用
import usePromptStore from '@/stores/stores.js';
let PromptStore = usePromptStore();

// 字典对象
const dictionary = reactive(good_practice);

// 当前激活字典页面
const active = ref('优秀实践');

/**
 * 跳转 tag 页面
 * @param {*} index
 */
const jumpPage = index => {
    active.value = index;
    console.log('打开页面: ', active.value);
};

/**
 * 点击 tag 添加或消除
 * @param {*} _key tag中文名
 * @param {*} _content tag原名
 */
const tagManage = (_key, _content) => {
    console.log('tag: ', _key, '  raw: ', _content);
    PromptStore.addTag({ key: _key, content: _content, time: 1 });
    console.log('output', PromptStore.output);
};

/**
 * 复制到剪切板,
 * @param {*} place 正面1 /负面0 /可能还有单个标签的复制
 */
const copy2Clipboard = place => {
    const obj = { positive: PromptStore.output, negative: 'negative 还没弄好' };

    let text = obj[place];

    if (navigator.clipboard) {
        new Promise((res, rej) => {
            console.log(999);
            navigator.clipboard.writeText(text);
            res();
        }).then(res => {
            ElNotification({
                title: 'Success',
                message: '您已复制成功\n' + text.slice(0, 20) + '...',
                type: 'success'
            });
        });
    } else {
        alert('您的浏览器版本暂时不支持复制, 请手动复制');
    }
};
</script>
<style lang="scss" scoped>
.input-group {
    display: flex;
    justify-content: stretch;
    align-items: center;
    &__title {
        padding: 10px;
        text-align: center;
    }
    &__content {
        flex: 1;
        & textarea {
            width: 100%;
            height: 6rem;
            border-radius: 4px;
            resize: vertical;
        }
    }
}

.rowTagManipulation {
    margin-bottom: 4px;
}

.rowTagCategories {
    display: flex;
    flex-wrap: wrap;
}

.rowTagShow {
    display: flex;
    flex-wrap: wrap;

    .btn_group:hover {
        // background-color: green;
        transition: all 0.3s;
        filter: opacity(75%);
    }

    .btn_l {
        border: 0.15rem solid red;
        border-top-left-radius: 0.75rem;
        border-bottom-left-radius: 0.75rem;
        width: 2rem;
        line-height: 2rem;
        border-right: none;
    }
    .btn_c {
        border: 0.15rem solid red;
        line-height: 2rem;
        border-right: none;
        border-left: none;
    }
    .btn_r {
        border: 0.15rem solid red;
        border-top-right-radius: 0.75rem;
        border-bottom-right-radius: 0.75rem;
        width: 2rem;
        line-height: 2rem;
        border-left: none;
    }
}
</style>
